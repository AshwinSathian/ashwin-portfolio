---
title: "A worn lane hooks later before it hooks earlier"
date: "2026-11-24"
updatedAt: "2026-11-24"
description: "Pinfall's lane carries an oil field that the ball wears off and drags down the lane as you play. For the first ten to seventeen balls on one line, the wear makes the ball hook less, and then it flips. Why the friction curve hides half of the wear, when each oil pattern flips, and what oil can never change in this model."
seoDescription: "How lane oil wear and carry-down change the hook in a browser bowling sim, measured ball by ball, and why oil can't change the entry angle."
tags: ["typescript", "gamedev", "physics", "algorithms"]
---

When a simulation has two effects pulling in opposite directions, the one you can see in the code isn't always the one the player meets first. Each effect is written down on its own and each reads fine - only running them together tells you which one wins, and when.

[Pinfall](https://pinfall.ashwinsathian.com) is a ten-pin bowling game in the browser, and its lane has oil on it. When this was written, the README put the promise in one line: "A line that strikes in the first frame hooks earlier by the eighth." But measured ball by ball, the same line does the opposite for the first ten to seventeen balls. It breaks later and hooks less. Then it flips. Both halves come out of about a dozen lines in `src/sim.ts`, and neither half is a bug.

## Where the hook comes from

Nothing in Pinfall scripts a hook. The ball's one sphere in a rigid-body solver that runs at a fixed 480 Hz, with sequential impulses and Coulomb friction. Oil changes one thing: the friction coefficient at the contact under the ball. The ball leaves your hand skidding, with sidespin, and friction works on the slip between the contact patch and the lane until the slip runs out and the ball turns and starts to roll.

The oil is a field of 39 boards by 64 rows. Each cell is a bit under 29 cm of lane, and the friction under the ball is read from it:

```ts
const MU_DRY = 0.24, MU_OIL = 0.035;
```

```ts
  mu(x: number, z: number) {
    const c = this.cell(x, z), o = c < 0 ? 0 : this.a[c];
    const f = o > 0.6 ? 1 : o / 0.6;
    return MU_DRY + (MU_OIL - MU_DRY) * f;
  }
```

Any cell with more than 0.6 units of oil is fully slick. Below 0.6 the friction rises in a straight line to the dry value at zero. The patterns are built in the `Oil` constructor, and their oiled middles all sit above that line - 1.0 for House and Short, 0.9 for Long, 0.82 for Sport. Each one tapers to nothing over the last 1.5 m before its length (40, 32, 44 and 41 ft) - past that, the boards read zero.

So the oil in the middle has headroom. It can lose a fair amount and the ball won't notice.

## Two ways the ball moves oil

Wear runs once per solver step, while the ball's touching the lane and short of the head pin:

```ts
    for (const [k, w] of [[0, 1], [-1, 0.35], [1, 0.35]]) {
      const cc = col + k;
      if (cc < 0 || cc >= OIL_COLS) continue;
      const idx = c + k, take = a[idx] * 0.16 * w * ds, put = this.carried * 0.3 * w * ds;
      a[idx] += put - take;
      this.carried += take - put;
    }
```

The ball lifts 16% per metre of whatever is on its board, and 35% of that rate from the boards either side. What it lifts goes into `carried`. It puts back 30% per metre of the load on its own board, and the side boards take their share too, so about 51% per metre in all. Over one cell on the middle board that's roughly 4.6% of the oil lifted, less what goes back down. The rest rides on the ball and comes off further along. Bowlers call that carry-down.

Now set both against the friction curve. Lifting oil off the front of the lane takes a cell from 1.0 to 0.95 to 0.9, and none of that changes the friction, because the curve's flat above 0.6. But carry-down is different. It lays oil on the thin end of the taper and on the dry boards past it, where every bit of oil counts from the first ball.

The wear you'd expect to show first, a drier front end and an earlier hook, is held back by the headroom. The wear you might not think about (oil dragged into the taper and beyond) takes friction away right where the ball turns.

## Ball by ball

The test suite checks the mechanism - oil goes down along the track near the front, goes up past the pattern, and boards away from the track stay as they were. What it doesn't check is what that does to the hook over a game.

So we take the throw Pinfall's autoplay bot uses: stand at 0.14 m, spin −0.5, 8.1 m/s. We aim it with the bot's own bisection at the bot's pocket target on a fresh lane, then throw exactly that throw thirty times with wear on. After each ball we record where it broke (its furthest point right before hooking back left), where it crossed the head pin, and the pinfall. Measured in Node 24 on an M-series Mac. Breakpoints come from the path, sampled every 1/120 s, so they move in steps of about 6 cm.

On House the first ball breaks 11.52 m down the lane and enters 58 mm right of the head pin. By ball 10 it breaks at 11.65 m and enters at 78 mm. By ball 17 it's at 11.71 m and 90 mm. That's 32 mm of drift away from the hook.

Which oil does it? We'll split the ten-ball lane into parts and throw the same ball over each part on its own. Wear on the cells that started above 0.6 leaves the entry exactly where it was on a fresh lane, at 56.7 mm. Carry-down onto boards that started dry moves it to 66.2 mm. The changes in the thin end of the taper, cells that started between zero and 0.6, move it to 67.5 mm. The whole worn lane gives 78.5 mm. So about half the drift is oil pushed into the taper, still inside the pattern, and the other half is oil on the dry back end. After ten balls the taper cells have gained up to 0.227 and the dry cells up to 0.214. On a dry cell that cuts the friction from 0.24 to about 0.17.

Then it turns. At ball 18 the entry starts back towards the hook. By ball 20 the break has come forward to 11.30 m, and by ball 30 it breaks at 9.23 m, enters 13 mm from the head pin, high on the nose, and leaves pins. That's the earlier hook the README described, roughly a game late.

The first phase isn't the model getting it wrong - carry-down does the same thing on real lanes, where it makes balls skid further and hit light. Pinfall just shows it for a long stretch before the front end gives way.

Every pattern does this. What changes is when it flips:

| Pattern | Middle oil | Entry drifts away until | First track cell that started above 0.6 drops below it |
|---|---|---|---|
| Sport | 0.82 | ball 10 | after ball 10 |
| Long | 0.9 | ball 13 | after ball 12 |
| House | 1.0 | ball 17 | after ball 16 |
| Short | 1.0 | ball 17 | after ball 16 |

The flip comes within a ball of the first saturated cell on the track wearing below 0.6. That's when front-end wear starts to reach the friction at all. Sport has the least headroom, so it flips first, and House and Short, with the most, flip last.

Long shows it from a different side. Its breakpoint stays at 10.56 m for twelve balls, to the 6 cm resolution of the path. The entry still drifts, from 59 mm to 80 mm. On Long the carry-down past 44 ft takes hook out after the break, instead of moving the break itself.

## What a player sees of it

Less than the table suggests. A ten-frame game for one player is between 11 and 21 balls. A run's oil is created once when it starts and every player bowls on it, so four players can put up to 84 balls down one lane - those games go through the flip.

The bot never sees it. It doesn't repeat a throw: `angleFor` bisects a fresh aim every ball, on the current worn oil. A person sees it through the aiming guide, which had a small gap of its own.

## The dotted line didn't wear the lane

The dotted line you see while pulling back is the solver itself, run with no pins. When this was written it was called like this:

```ts
    guidePath = simulate(makeThrow(x0, angle, speed, spin), oil, standing, { pins: false, record: false }).path;
```

It ran on the current `oil`, so with the full path showing, it already bent with every earlier ball's wear. What it left out was the wear of the throw it was drawing. `wear` defaults to off, and the solver then works on a copy of the field (`o.wear ? oil : oil.clone()` in the `Roll` constructor). The real throw starts with `{ wear: true }`.

That matters because a ball can run into oil it's carried down a moment earlier. Its own wear changes the throw doing the wearing. On a grid of 209 throws across a fresh House lane, pinfall with wear on differed from pinfall with wear off in 40 of them.

For a throw close to the bot's on a fresh House lane, the guide and the real ball agreed to the last bit for 1.38 seconds, out to 11.2 m. Then the carry-down under the ball pulled them apart, and they crossed the head pin 1.56 mm apart.

By default it's hidden. The guide stops at the arrows - the code draws it to 0.6 m past them, 5.17 m out, well before the paths split. With Settings showing the full path, the line was exact for the first 11 m and a millimetre or two out at the pins. And the guide's test in `sim.test.ts` couldn't catch it, because it ran the real throw without `wear: true` as well.

## What oil can't touch

Now the entry angle, the angle the ball makes with the lane as it reaches the pins. For a throw of `makeThrow(0.15, 0.02, 8, spin)` it doesn't change with the pattern, to three decimal places. The last column is House after 20 balls of a different throw, the bot-style `makeThrow(0.14, 0.02, 8.1, -0.5)`:

| Spin | House | Sport | Short | Long | House after 20 balls |
|---|---|---|---|---|---|
| −0.3 | 0.457° | 0.457° | 0.457° | 0.457° | 0.457° |
| −0.5 | 2.111° | 2.111° | 2.111° | 2.111° | 2.111° |
| −0.8 | 5.256° | 5.256° | 5.256° | 5.256° | 5.256° |

The oil moved where those balls arrived by as much as 246 mm. The −0.8 ball crosses the head pin anywhere from 207 mm to 453 mm left, depending on the pattern. The angle didn't move. Neither did the speed - thrown at 8 m/s with spin −0.5, the ball reaches the pins at 6.70 m/s on every pattern.

That's textbook physics, and the solver reproduces it. The friction part of the solve is three lines:

```ts
        let l1 = c.l1 - v1 * c.k1, l2 = c.l2 - v2 * c.k2;
        const max = c.mu * c.ln, m2 = l1 * l1 + l2 * l2;
        if (m2 > max * max) { const s = max / Math.sqrt(m2); l1 *= s; l2 *= s; }
```

While the ball skids, the friction impulse is clamped to a disc and points straight against the slip. For a sphere whose inertia is the same about every axis, that impulse shrinks the slip without turning it. The friction coefficient sets how fast it shrinks - it's got no say in the direction. So the velocity the ball ends up rolling with depends only on the throw: `v_final = v0 - u0 / (1 + R^2/k^2)`, where `u0` is the starting slip, `R` the radius and `k` the radius of gyration. Pinfall's ball is that sphere:

```ts
const BALL_M = 6.8, BALL_I = BALL_M * 0.0635 * 0.0635;
```

The pins get a proper inertia tensor. `iw()` rotates their two different moments by each pin's orientation, but the ball's special-cased to one number (`if (b.ball) { IW[0] = x * b.ip; ...`). Put the throw's six integer fields into the closed form and you get 2.100° at 6.708 m/s for the −0.5 ball, and 5.235° for the −0.8 one. The solver gets 2.111° and 5.256°, within 0.021°.

In this model, then, oil decides where the ball starts to roll. It never decides the angle or the speed it arrives with. And wear is no different - on House, thirty balls of the bot's throw moved the break 2.29 m and the entry angle by a ten-thousandth of a degree.

A real ball, though, has a core whose inertia differs by axis, so its spin axis migrates as it rolls and keeps putting fresh cover on the lane. That flare is part of how lane condition changes the turn at the back. Pinfall's solver already handles a body with per-axis inertia, since the pins are one. Giving the ball the same treatment is what's missing.

## What it leaves open

The renderer has a flat top of its own. Lane gloss was `clamp(oil * 1.35, 0., 1.)` in `src/shaders.ts`. A cell looked fully glossy until it dropped below about 0.74, so front-end wear only showed on screen once it was well along. How visible the carry-down is in a real game hasn't been checked.

Lowering the 0.6 threshold, or starting the patterns nearer to it, would bring the earlier hook into a solo game. It'd also change how every shared Daily link replays, which is what `VERSION` in `src/rules.ts` is there for. Whether a lane that tightens for a whole game before it opens out is worse to play on, or just less familiar, would take people bowling on it to say.

## Since this was published

A fix on 24 November changed the README and the guide. The README no longer says the line hooks earlier by the eighth frame - it now describes carry-down first and track wear after it, the order the game actually plays in. The guide goes through a new `preview()`, which rolls the ball on a cloned lane with wear on, and the bot aims with the same function, so the dotted line now matches the throw all the way to the pins. Lane gloss is now a plain `clamp(oil, 0., 1.)`, so wear shows across the whole range. And links now refuse throws the controls can't make: spin about the vertical, a speed outside 5.5 to 10 m/s, or an aim beyond 0.1 rad.
