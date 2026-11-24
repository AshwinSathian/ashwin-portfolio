---
title: "A Minesweeper hint can be true and still not show you why"
date: "2026-11-24"
updatedAt: "2026-11-24"
description: "A solver that never lies can still give hints nobody can follow. In Minefield, a correct hint often skips the step that proves it, rings a dozen numbers where six would do, or rings nothing at all. What each kind of hint shows, what it leaves out, and what it costs to work out."
seoDescription: "Why correct Minesweeper hints can still be hard to follow: hidden deduction steps, oversized proofs, ranking by rule and a search budget, measured."
tags: ["algorithms", "gamedev", "typescript"]
---

A proof that a machine accepts and a proof that a person can follow aren't the same object. The first only has to be correct. The second has to be short enough to hold in your head, and it has to start from things you're actually able to see. Most of the time we get away with treating them as one - the machine's proof is short anyway. Hints in a puzzle game are one place where they come apart.

[Minefield](https://minefield.ashwinsathian.com) is a Minesweeper game with a hint button. Press it and the game outlines one cell it's sure about, rings the numbers that prove it, and gives one sentence of why. The solver behind it is exact: it finds every cell the numbers settle and never calls a cell safe when it isn't. So every hint is true. The question for this post is how often a true hint is also one a player can check from the board in front of them, and the answer is less often than the ring suggests.

## What a hint is made of

Each certain cell the solver finds comes back as a `Move`, in `src/solver.ts`:

```ts
export interface Move {
  cell: number;
  mine: boolean;
  kind: Kind;
  /** Revealed numbers that force this move. */
  because: number[];
}
```

`kind` says which layer of the solver found it. `single` is one number on its own, `pair` is two overlapping numbers read together, `enum` comes from counting every arrangement of mines on a group of connected numbers, and `count` is a move that only holds once you bring in how many mines are left on the board. `because` is the list of numbers the game rings. The sentence comes from a table in `src/main.ts`, two lines per kind, one for a safe cell and one for a mine:

```ts
single: ['That number already has all its mines, so this cell is clear.', 'That number needs every hidden cell around it, so this one is a mine.'],
```

The contract a hint offers, then: look at these numbers, apply this kind of reasoning, and you'll reach this cell. The rest of this post is about the places where that contract is looser than it looks.

## The single rule is never one step

To build a constraint from a revealed number, the solver walks the number's hidden neighbours and subtracts any it's already decided are mines:

```ts
for (const j of nb[i]) {
  if (view[j] !== HIDDEN) continue;
  if (fate[j] === MINE) need--;
  else if (fate[j] !== SAFE) cells.push(j);
}
```

And this is the line that produces a single-rule safe move:

```ts
if (c.need === 0) for (const j of c.cells) { decide(j, SAFE, 'single', [c.src]); found = true; }
```

`need` starts at the number itself, which is at least 1, because zeros and hidden cells are skipped. The only thing that lowers it is `fate[j] === MINE`, a mine the solver deduced earlier in the same call. Flags don't count at all - the file's header comment says the solver "trusts only numbers", which also means a wrong flag can't mislead it. So `need` can only reach zero after the solver has already proved some mines from other numbers. A single-rule safe hint is at least the second step of a proof, and `because` holds only the number from the last step.

Whether that matters depends on whether the player's flagged those mines. If they have, the ring is fine: the number touches its flagged mines, the sentence is true on its face, done. But if they haven't, the hint rings one number and says it "already has all its mines", while those mines are hidden tiles with nothing on them (with the odds view off, that is; with it on, a proven mine gets a glyph).

How often does a hint-following player flag? We can play 100 Expert boards (30 by 16, 99 mines) purely by hints: ask for a hint, do what it says, repeat. That gives 19,793 single-rule safe hints, and in every one of them at least one ringed number had a deduced mine next to it that wasn't flagged. The code above guarantees the deduced mine. What the run adds is that nobody flagged it - if the script flags every proven mine before asking, the unflagged count is zero, as it has to be.

The hint itself is why nobody's flagging. `hint()` in `src/game.ts` looks for a safe cell first and only offers a mine when there's no safe cell to show. On 40 Beginner and 40 Intermediate boards played by hints, not a single mine hint came up. Someone who leans on the button is never told to flag anything, and with odds off every single-rule hint they get leans on mines they were never shown.

None of this makes the hint wrong - it's true every time. And the data for a fuller hint is already in the result. `moves` is pushed in the order the solver decides things, and each earlier mine move carries its own `because`. A hint could ring the mines it depends on and the numbers that proved them. It doesn't, today.

## Ringing the whole component

The `enum` layer has the opposite problem. When it settles a cell, the reason it gives is every number in the connected group it counted:

```ts
if (neverMine) decide(cell, SAFE, localSafe ? 'enum' : 'count', c.srcs);
```

`c.srcs` is the whole frontier component. It's accurate in the narrow sense - the counting did look at all of them. But "every way the mines can sit around the ringed numbers leaves this cell clear" is a hard sentence to check when a lot of numbers are ringed. In the 100 hint-played Expert games there were 591 enumeration safe hints, and they ringed a median of 12 numbers, 56 at most.

Does a proof need that many? Often not. We can check with a script that starts with the numbers touching the hinted cell and grows the set outward one ring of neighbours at a time, through shared hidden cells. At each step it checks whether every arrangement over just that subset leaves the cell clear, taking as given whatever the single and pair rules had already settled (so it leans on the same unflagged mines as above). It stops at the first subset that's enough. Over a separate run of 60 Expert games (269 enumeration hints), the hint ringed a median of 10 numbers and the first subset that proved it had a median of 6. For 56 of those 269 hints, four numbers or fewer were enough.

That subset isn't the smallest proof - it's only the first one a breadth-first growth happens to reach, so the real minimum is the same or smaller. Finding a genuinely minimal set of constraints is a search of its own, on top of the one the solver already does.

## Count moves ring the wrong thing

Some cells no number touches at all. When the mines left over can all be accounted for on the frontier, every interior cell is clear, and the solver says so like this:

```ts
if (restCounts.every((r) => r === 0)) for (const i of interior) decide(i, SAFE, 'count', []);
```

An empty `because`. The hint outlines the cell, rings nothing and says "Counting the mines that are left settles it: this cell is clear." The reasoning lives off the board, in the mine counter in the header and in which mine totals the frontier allows. A `count` move on the frontier rings its component instead, but the deciding fact (the total) still isn't one of the ringed numbers. They're rare. The 100 Expert games had 47 `count` safe hints out of about 20,500: 9 ringed nothing, and the other 38 ringed a component of up to 19 numbers.

## Cheapest rule first, then nearest

When several sure moves are available, `hint()` has to pick one:

```ts
const pick = (ms: Move[]) => {
  if (!ms.length) return null;
  const top = Math.min(...ms.map((m) => rank[m.kind]));
  const tier = ms.filter((m) => rank[m.kind] === top);
  const c = near === null ? tier[0].cell : nearest(tier.map((m) => m.cell), near, this.size.w);
  return tier.find((m) => m.cell === c)!;
};
```

The rank goes single, pair, enum, count. It keeps only the moves of the cheapest kind and then takes the one closest to your last click. A one-number argument is easier to check than a twelve-number one, so the order favours easy proofs. The price is that an easy move on the far side of the board beats a harder one right where you're looking. Across 20,515 safe hints in 100 hint-played Expert games (the last revealed cell passed in as the place to look near), 935 of them, about 4.6%, skipped a nearer sure move to stay in the cheaper tier. The extra distance had a median of 2 cells and a maximum of 27. The game scrolls the hinted cell into view, so the far case is noticeable - not lost.

Flip the order and you get the opposite problem. Nearest-first would sometimes hand you a twelve-number enumeration next to your finger when a one-number move was sitting a few cells away.

## When the hint runs out of budget

The counting layer has a budget. It's a node count. When this was written every search stopped after 400,000 nodes, shared across every component on the frontier, and when it stops it reports no probabilities and no `enum` or `count` moves. That keeps the solver sound (it can only fail to find a move, never invent one), and it's what produces the hint "Too many possibilities to work through here."

You'd expect that never to show up on a board the game has promised needs no guessing. Mostly it doesn't. But the promise was checked along one route through the board, and a player following hints takes a different route, so the frontier they end up with isn't one the check ever saw. Across 2,700 hint-played Expert games in the runs for this post (2,500 distinct boards, some played twice with a different click order), four reached a position where the full count went over budget. One of them is game 32 of the 100-game sample used above.

That one's odd, because the failure doesn't look like a failure at first. The local rules had no safe cell left and the count was over budget, so the hint fell back to the mines the local rules could prove. It offered 27 mine hints in a row (the only mine hints in all 100 games). Flagging doesn't change what the solver sees, since it ignores flags, so each of those 27 presses re-ran the same search on the same position and hit the same 400,000-node wall - about 13.5 ms a time. After the 27th flag there was nothing left to offer. A copy of the solver with the budget raised to a million nodes finds six safe cells in that position by enumeration, in 14 to 24 ms.

Four in 2,700 is rare, and the figure comes from a handful of seeds, so it's an order of magnitude and nothing finer.

## Paying for it on the main thread

Dealing runs in a Web Worker. Hints don't. They run where you tap. `hint()` called `analyse()` with probabilities on, so every hint ran the full enumeration over the whole frontier, even when a single-rule move was available and the cheap layers alone would have found it. With the odds view on, `apply()` in `main.ts` runs the same analysis after every move.

Measured in Node 24 on a Mac, 1,000 hint-played Expert games make between 205,000 and 206,500 hint calls with a median of 0.07 to 0.08 ms. The worst call moved between 14 and 51 ms from run to run - it's the tail that's noisy, not the median. On a 60 by 40 board with 480 mines, ten games make 10,071 calls; three quiet runs gave a median of 0.49 ms, 1.2 ms at the 99th percentile and a worst call between 2.2 and 5.6 ms. And runs with other jobs on the machine were slower, up to 39 ms at worst. Phones weren't measured - treat all of these as desktop numbers.

The hint sentence also goes to a live region for screen readers, but the outlined cell and the ringed numbers were only CSS classes, and the keyboard cursor didn't move to the hinted cell. So a screen reader heard "Read the two ringed numbers together" with nothing to say which two.

## What a followable hint would need

The deduction order is in `moves`, and the mines a single-rule step depends on are earlier entries in that list, each with its own `because`. A smaller proof for an enumeration move isn't hard to find by growing outward from the cell, at the cost of more counting per hint. At these timings that cost looks affordable on a desktop - phones haven't been timed.

Would a hint with three steps and four numbers be easier to follow than one step and twelve numbers, or does it only look tidier on paper?

## Since this was published

A fix on 24 November changed what a hint costs and what a screen reader hears. `hint()` now tries the single and pair rules first and only enumerates when they find no safe cell (a flag the local pass can't settle still triggers the full check, so a wrong flag is still reported first). It keeps its analysis for the view it was made on, and it gets a budget of a million nodes, while dealing and the odds view stay at 400,000. Over 2,700 hint-led Expert games the median hint went from 0.09 to 0.02 ms and the 99th percentile from 0.78 to 0.18 ms, and none of them got stuck over budget. A hint now moves the cursor and focus to its cell and reads out where it is and up to four of the ringed numbers, cell labels follow the screen on a turned board, and the loss note names the cell. Moves redraw only the cells that changed, too - on a 60 by 40 board at 4x CPU throttling in a phone viewport, the move handler's median went from 18.3 to 1.4 ms. What a hint rings hasn't changed, so the single, enumeration and count cases above still stand. The ranking figures (the 4.6% and the four stuck games in 2,700) were measured on the old code, though, and since the hint now stops at the first cheap rule that finds a safe cell, the move it picks can differ from the one it picked then.
