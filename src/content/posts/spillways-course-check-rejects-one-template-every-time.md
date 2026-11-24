---
title: "Spillway's course check rejected one template, every time"
date: "2026-11-24"
updatedAt: "2026-11-24"
description: "Spillway won't put a stretch of course in front of you until a small search has found a way through it from every channel. How that search models the rider, why it's more pessimistic than the game, and what 19,734 checks showed it actually caught."
seoDescription: "How Spillway checks generated endless-runner sections with a 63-state reachability search, and what measuring 19,734 checks showed it rejects."
tags: ["typescript", "gamedev", "algorithms", "testing"]
---

Procedural generation has a fairness problem built into it. A generator that picks obstacles at random will, sooner or later, pick a set that can't be passed, and in an endless runner that's a death the player did nothing to earn. The usual answers are to hand-tune the templates until it doesn't seem to happen, or to let a playtester find out.

[Spillway](https://spillway.ashwinsathian.com) takes a third route. You ride a front door on a hydrofoil down a flooded street with three channels, jumping timber booms, tucking under washing lines and footbridges, and steering round pilings, barges and ferries. The course is built from a seed one section at a time. `src/course.ts` won't add a section until a search has found a survivable route through it from all three channels. What it's actually been catching is less obvious. The numbers below were measured for this post.

## The rider as 63 states

The search doesn't run the game's physics. It works on a coarser picture of the rider, and the comment at the top of the solver gives the whole model in one line: "Time is cut into 60 ms steps. A state is (lane, phase): phase 0 is riding, 1-10 a jump, 11-20 a tuck."

That's three lanes and 21 phases. So, 63 states per step. A jump walks through phases 1 to 10 and lands back on 0, and a tuck does the same from 11 to 20. Whether a phase gets past an obstacle is one function:

```ts
const adv = (p: number) => (p === 0 || p === 10 || p === 20 ? 0 : p + 1);
const clears = (c: number, p: number) =>
  c === FREE || c === C_RAMP || c === C_HULL || (c === C_BOOM && p >= 2 && p <= 8) || (c === C_LINE && p >= 11 && p <= 19);
```

Before it searches, `makeGrid()` turns the section's obstacles into cells, one kind per lane per step. A boom becomes `C_BOOM`. A washing line or a footbridge becomes `C_LINE`. Pilings, ferries and the walled front of a barge become `C_WALL`, which no phase clears. A barge with a yellow ramp gets `C_RAMP` cells and then `C_HULL` for the deck, and you can ride along the top of it.

`solve()` then sweeps the grid forward. From each reachable state it tries riding on, starting a jump, starting a tuck, and moving one lane left or right. A lane change takes three steps and has to clear both lanes on every one of them. The solver keeps the best value per state (costs come off a starting 1,000, so anything below zero is unreached) and walks back from the end to recover the route. It's dynamic programming over a small table - nothing cleverer - and it's cheap. Measured in Node 24 on an M-series Mac, a solve covered about 47 steps on average and took about 0.1 ms.

There's one detail in the grid that only shows up at speed. The street speeds up with distance - `15 + 23 * z / (z + 1500)` metres a second - so a 60 ms step is 0.9 m long at the start and 2 m long by 6 km. A boom is 0.5 m deep. One step can land on the near side of a boom and the next on the far side, and then the boom would never touch a cell at all. So a cell counts as blocked if either neighbouring step reaches the obstacle.

## More pessimistic than the game

A check like this is only any use if a route it finds is one the real rider can ride. The real rider lives in `src/sim.ts`, at 120 Hz, with gravity and a fixed sideways speed:

```ts
const GRAVITY = 46;
const JUMP_V = 13.74; // 2.05 m apex, 0.6 s in the air
const SHIFT_V = 20.8; // one lane in 0.13 s
```

The solver's numbers are worse than these. If we step the sim's jump through its own integration, with the same constants and tick, the rider is above a boom's top (0.85 m) from 75 ms after take-off until 517 ms. The solver credits a jump with clearing a boom only in phases 2 to 8, which is 120 to 480 ms. A lane change in the sim takes 130 ms (2.7 m at 20.8 m/s). The solver gives it three steps, 180 ms. A tuck in the sim lasts 0.6 s from the moment it's pressed, and the solver counts it as under a line only from phase 11 to 19.

Every gap runs the same way. The model's rider is slower and clumsier than the one you control, so a route the model finds should leave the real rider time to spare - and the bot runs further down are the evidence that it does. (The comment's 2.05 m apex is the analytic figure, by the way. Stepped at 120 Hz, the jump peaks at 1.995 m and lands after 0.592 s, still well clear.)

Where the model couldn't be made pessimistic cheaply, the search just doesn't allow the move. A jump off a barge deck hangs longer than ten phases describe, so `solve()` never starts one. The comment says why: "A jump off a deck hangs longer than the phases model, so routes never rely on one." Riding off the end of a deck counts as a short fall, entered at phase 6, roughly the back half of a jump. The first version of the solver already had that drop for riding. A later fix added the no-jump rule, extended the drop to tucking off a deck, and doubled each section's lead-in from 0.4 to 0.8 seconds of travel. The comment on the lead-in reads "The lead-in must allow two lane changes from an outer channel."

The model also leaves things out - it knows nothing about Surge, the kite, the lifebuoy or the gull. A section is checked for the bare game, i.e. a rider with no pickups at all. That's the hardest version of it.

## The gate, and what happens when it shuts

The check sits in `Course.section()`:

```ts
      // The lead-in must allow two lane changes from an outer channel.
      const g = makeGrid(z0 - v * 0.8, last + v * 0.5, this.slack, cand);
      if (solve(g, 0) && solve(g, 1) && solve(g, 2)) { obs = cand; zEnd = last; }
    }
    if (!obs) { obs = []; zEnd = z0 + d; }
```

A candidate is a template (rows of three lanes, drawn from a pool that grows harder with distance), flipped at random and laid out at the current speed. It's solved three times, once from each channel. If any of the three fails, the generator draws again, up to ten tries, and the draw can land on the same template. If all ten fail, the course gets an empty section - one beat of open water with nothing in it. It's a blunt fallback. But it can't kill anyone.

Once a section is in, a fourth solve from a random lane picks the line for the letters. On about 82% of sections the trail of floating post follows that route. The rest get no trail.

## What 19,734 checks caught

To see what the gate does in practice, we can copy `course.ts` into a scratch folder, add counters to `section()` and `solve()`, and build 200 courses of 6,000 m each. The seeds here are the ones the tests' bot soak uses (multiples of 7919). That came to 18,968 sections from 19,734 candidates:

| Tries before a section was accepted | Sections |
|---|---|
| 1 | 18,263 |
| 2 | 649 |
| 3 | 51 |
| 4 | 5 |
| 10, so the empty fallback | 0 |

So 96.3% of sections passed first time, and the fallback never fired. The rejections are the odd part. All 766 of them were the same template, and it failed every one of the 766 times it was drawn, from all three lanes:

```ts
  [3, ['F.F', '...', 'PFP']], [3, ['PPJ', 'TPP', 'PJP']], [3, ['HHB', 'HHB', 'HHB', '...']], [3, ['FF.', '..F', 'FF.']],
```

It's the first entry on that line. Read it top to bottom as three rows: ferries in the two outer channels, a row of open water, then piling, ferry, piling. That last row was `C_WALL` in every lane. You can't jump a piling or tuck under a ferry, so without a pickup there was no way past. The search was right all 766 times.

It's a tier-3 template, so it appears only after 2,000 m, where the pool holds 14 templates (tiers 2 and 3). It made up 766 of the 10,617 tier-3 candidates, 7.2%, which is about its one-in-fourteen share. Slack Water, the same game at 80% speed, tells the same story: 23,326 sections over the same seeds, 958 rejections, every one of them this template.

Seeds only sample the table, though, so the stronger check is to take seeds out of it. Solve every template on its own, at every distance from the start of its tier out to 60 km, flipped both ways, at both speeds, from all three lanes. Only this one ever failed. It failed at every distance tried.

The history of that line was short - two versions, at the time. The first had it as `'FPF', '...', 'PFP'`, a full wall in the first row as well as the last. A later fix opened up the first row to `'F.F'` and left the last one alone. Neither version was ever playable, and no player saw either, because the gate rejected it every time it came up.

So the gate's measurable work had been to hide one authoring mistake. That doesn't make it useless. A mistake like that - a whole row of walls, typed into a table of strings - is exactly what hand-tuning misses, and without the gate it'd have been an unwinnable row about once in every fourteen sections past the 2 km mark. It does mean that "every section is checked" and "the check is catching unfair combinations" aren't the same claim. Only the first was true here.

The obvious fix was to delete the template or open a gap in its last row. The other approach, which Spillway didn't take at the time, was a test that solves every template on its own, like the sweep above, so a dead one fails the build instead of quietly costing a retry.

## What one section at a time leaves out

Each section is checked against its own obstacles only, from a lead-in of open water, and every lane starts in phase 0, riding level and settled. But a real rider arrives however the last section left them. Maybe mid-jump, maybe halfway between lanes. Sections are separated by a rest - 0.82 seconds of travel, or 1.15 in the opening 250 m - and that's what makes the assumption reasonable. It's still an assumption.

The seams get one test of their own. `src/sim.test.ts` builds 40 courses to 6,000 m and solves each one end to end, from the middle lane, as one grid of about 5,900 m:

```ts
test('a route exists through the whole course', () => {
  for (let seed = 1; seed <= 40; seed++) {
    const c = new Course(seed * 31, false);
    c.ensure(6000);
    assert.ok(solve(makeGrid(0, 5900, false, c.obs), 1), `seed ${seed} has no route`);
  }
});
```

Does that prove a route exists from every state a player could arrive in? No. It proves one exists across every boundary in those 40 courses, from one starting lane.

The other check is the bot in `src/bot.ts`, which drives the menu backdrop with the same solver. While it's riding and centred in a lane, it replans every 30 ticks over the next four seconds of course, valuing letters and post buoys. When a route is about to run out mid-air or mid-tuck, it replans from there. The suite asserts the bot survives 3,000 m on 200 seeds with pickups turned off (it never presses Surge in that test). That soak passes, and takes most of the suite's run time.

And it holds up much further. With pickups off, on 50 of the same seeds, the bot rode the full 15 minutes a ghost link allows. All 50 survived, finishing at about 30.6 km.

That number cuts both ways. It shows the solver's routes hold up in the real sim over long distances. It also shows how little the course asks of a rider with perfect information and perfect timing. The pool stops changing at 2,000 m. After that it's only the speed and the spacing between rows that keep tightening: the beat between rows falls from 0.835 seconds at 2 km towards 0.68, and the speed creeps towards 38 m/s without reaching it.

And none of this says anything about people. The check proves a route exists, and the bot proves a frame-perfect rider can follow it. Whether a person can read a ferry and two pilings at nearly 30 m/s in time to pick the open channel is a separate question. The game's own planning notes list "Difficulty untested on people" as an accepted risk, say difficulty tuning needs real playtests, and offer Slack Water at 80% speed as the gentler option in the meantime.

The same seed builds the same course in every browser, because the generator uses only + - * /, which IEEE 754 rounds the same way everywhere. A search that had rejected one template 766 times out of 766 said the template table needed a test of its own. The gate hadn't yet met a table varied enough that some of its rejections would be combinations nobody wrote down on purpose.

## Since this was published

A fix on 24 November made the template rideable. Its last row is now `PF.` - piling, ferry, open water - so the line is to ride the middle channel past the two ferries and then move to the open side. A new test solves every template on its own at each distance its tier is dealt, both flips, both speeds and all three lanes, and on the old template it fails from 2,002 m. That changes courses past 2,000 m, so the replay version went from 1 to 2, and a version 1 link still rebuilds the old course exactly. Ghosts are now simulated in 4 ms slices from the frame loop, which took the longest task at 4x CPU throttling from 706 to 243 ms. The pass rates above describe the old pool.
