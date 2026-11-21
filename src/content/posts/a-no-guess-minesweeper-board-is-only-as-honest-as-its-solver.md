---
title: "A no-guess Minesweeper board is only as honest as its solver"
date: "2026-11-20"
description: "To promise a Minesweeper board never needs a guess, a program has to play it first. Why simple rules accept fewer than 2% of Expert boards, how exact counting gets that to 16%, and why certainty has to be decided without floating point."
seoDescription: "How Minefield proves a Minesweeper board needs no guessing: local rules, exact enumeration with log-binomial weights, and certainty decided without floats."
tags: ["algorithms", "gamedev", "typescript", "javascript"]
---

Most games of Minesweeper that are lost on Expert aren't lost to a mistake. They end on a pair of cells where the numbers fit a mine in either one, and the player has to pick. Plenty of players like that. Plenty don't, and for them there's a variant called no-guess: the game only deals boards that can be cleared by logic from the first click.

The catch is in the word "can". Something has to decide that, before the player sees the board, and that something is a solver playing the board on its own. So the promise a no-guess game makes is exactly as strong as its solver. If the solver ever calls a cell safe when it isn't, the game ships a board that needs a guess and tells the player it doesn't. If the solver misses a deduction a person could make, nothing breaks, but the game throws away boards that were fine.

[Minefield](https://minefield.ashwinsathian.com) is a Minesweeper game, and the solver is the part worth writing about. The same code deals the boards, gives hints, shades every hidden cell by its chance of being a mine, and tells you after a loss whether you had a safe move. All of that only works if the solver is both sound (it never claims a certainty it doesn't have) and complete (it finds every certainty the numbers allow).

## Two cheap rules

The solver in `src/solver.ts` works in layers, cheapest first, and the first two are what any player learns in their first hour.

The single rule looks at one number at a time. If a 2 already touches two mines it knows about, its other hidden neighbours are clear. If it has exactly two hidden neighbours left and needs two mines, both are mines.

The pair rule compares two numbers that share hidden cells. Call their cell sets A and B, and the mines each still needs `need_A` and `need_B`. The cells in B but not in A hold at least `need_B - need_A` mines. If that's as many cells as there are, they're all mines, and A's own cells must be clear:

```ts
// Mines in B outside A are at least need_B - need_A. If that fills them, A's own cells are clear.
if (onlyB.length && B.need - A.need === onlyB.length) {
  for (const j of onlyB) decide(j, MINE, 'pair', [A.src, B.src]);
  for (const j of onlyA) decide(j, SAFE, 'pair', [A.src, B.src]);
}
```

That covers the 1-2-1 patterns and their relatives, and it's where most no-guess generators stop. It isn't enough, and the numbers say by how much. `scripts/layers.ts` deals 1,000 random Expert boards (30 by 16, 99 mines, with the 3×3 block around the first click kept clear) and has the solver play each one. 158 of them can be cleared without a guess. 141 of those 158 hit a point where both cheap rules had nothing left to say. A generator using only the two rules would accept 17 boards in 1,000, and would reject nine of every ten boards that were in fact fine.

## Counting every arrangement

The third layer is exhaustive. It takes every hidden cell that touches a revealed number (the frontier), groups the cells into components that share constraints, and for each component counts every way to place mines that satisfies all its numbers. A backtracking search assigns cells in breadth-first order through the constraints, so each number closes early, and it prunes the moment a number has too many mines or too few cells left to reach its count.

The counts are kept by how many mines each arrangement uses: `cnt[k]` arrangements with k mines, and for each cell, how many of those have a mine on it. That split matters because arrangements are not equally likely. Mines left over from the frontier have to go somewhere in the interior, the hidden cells no number touches. If there are I interior cells and R mines left in total, an arrangement that puts K mines on the frontier leaves C(I, R−K) ways to fill the interior. An arrangement with fewer frontier mines leaves more for the interior, and early in an Expert game that can make it many times more likely.

So the probability that a cell is a mine is a sum over every combination of the components' mine counts, each weighted by the interior's binomial. This also brings in the total mine count, which is how endgames get solved: with three mines left and the arrangements that fit the numbers all using exactly three, everything in the interior is clear. The solver labels deductions that only hold because of that total as `count`, and the hint says so.

The binomials get large. C(380, 90), a normal mid-game Expert value, is about 10^89. On a 60 by 40 custom board with 480 mines it's around 10^513, which is past the 10^308 a double can hold. The solver works in logs (a cached table of log-factorials), subtracts the largest log weight before exponentiating, and rescales each component's counts by its own maximum. The probabilities stay ratios of numbers near 1.

## Certainty can't come from a float

This is the easy part to get wrong. Once you have probabilities, it's tempting to call a cell safe when its probability is 0 and a mine when it's 1. With scaled weights, that test lies. A combination whose interior weight is 10^-400 times the largest one underflows to exactly zero after the rescale. It is still a possible arrangement of mines. If it was the only one that put a mine on some cell, that cell now shows a probability of exactly 0, and a solver that reads certainty from the float calls it safe.

That would be a no-guess board with a hidden guess in it. It would be rare, and it would be invisible in testing.

So Minefield decides certainty from feasibility, not weight. For each component and each mine count k, it asks one yes-or-no question: is there any way to pick counts for the other components such that the leftover mines, R − k − K, come to somewhere between zero and I? That's a boolean convolution of which counts each component can have. A cell is certainly safe only if, for every feasible k, no arrangement with k mines puts a mine on it. Those are integer counts compared to zero, exact in a double because the search budget keeps them under a million. Floats are used for the shading and nothing else.

The same check is run twice per cell, once with the interior constraint and once without. A cell that's only settled with it is a `count` deduction. That's why the hint can say "counting the mines that are left settles it" instead of pointing at numbers that don't explain the move.

## Checking the solver against brute force

The test I trust most compares the solver with the dumbest thing that could work. `src/solver.test.ts` makes 400 random positions on 5-to-7 by 5 boards with 4 to 8 mines, reveals a few cells, and enumerates every placement of the mines over all hidden cells, keeping those that agree with every number. Each hidden cell's probability from the brute force must match the solver's to within 10^-9, and every cell the brute force finds at exactly 0 or 1 must be marked safe or mine by the solver, and no others. Positions with more than 22 hidden cells are skipped to keep it fast, and the test fails if fewer than 150 positions get checked.

A second test deals 45 no-guess boards across Beginner, Intermediate and Expert, then plays each through the game's own rules, asking for a hint every move and doing what it says. Every hint has to be a sure move, and every game has to end in a win. A Playwright script does the same thing in a browser through the real interface, clicking the cell the hint outlines.

## The budget, and which way it fails

Exhaustive search has a worst case. A long frontier with loose numbers can have more arrangements than is sensible to walk, so the search stops after 400,000 nodes. When it does, the solver returns no probabilities and draws no conclusions from that layer. For dealing, that means the board is rejected. The budget can make the solver less complete. It can't make it unsound, which is the direction that matters for the promise. In 3,000 test boards across the three presets, the budget was never what stopped the solver.

## Dealing boards fast enough to not notice

With a solver this complete, the generator can be simple. `src/gen.ts` places mines at random around the first click, has the solver play the board, and deals again if it gets stuck. At 15.8% that's five or six tries on average for Expert. `scripts/bench.ts` deals 100 Expert boards on my laptop at a median of 2.5 ms each, 11.6 ms at the 95th percentile and 45 ms at worst. It runs in a Web Worker anyway, because a 60 by 40 board takes around 120 ms and a phone is slower than a laptop. With the CPU slowed 4× and network latency set to 150 ms, the first tap on an Expert board is painted 78 ms later, deal included.

Rejection is not the only way. Simon Tatham's Mines, in his puzzle collection, takes the other route: where its solver gets stuck, it moves mines to change the board and carries on. That works at higher densities, where rejection would almost never succeed. Minefield caps no-guess custom boards at a quarter of the cells being mines instead.

The Daily board comes free from determinism. The generator draws from a seeded sfc32, and the retry loop is deterministic, so a seed made from the UTC date gives every player the same no-guess board, with nothing stored on a server.

## Once the solver is honest, the rest is wiring

Hints ask the solver for its certain moves and show the cheapest one, near your last click, with the numbers behind it ringed. A single-rule move points at one number. A pair move points at two. An enumeration move points at the whole component, because that's the honest answer. A flag the solver can prove is on a safe cell comes up first.

The odds view shades hidden cells by their exact probability. Cells away from the numbers all share one value, so they're tinted rather than labelled, and the number goes in a toast.

The loss review is my favourite, and it depends on completeness more than anything else. After you hit a mine, the solver looks at the position just before your click. If it finds a sure move, the game says a safe move was open and outlines it. If it doesn't, the game says you were forced to guess and gives the odds the cell you picked had. A weaker solver would tell people they had no choice when they did.

## What it doesn't do

It doesn't grade difficulty. Some no-guess boards need a deduction across a frontier of twenty cells that the solver finds in a millisecond and a person would need a long stare to see. Minefield's hint will show you that move, but the board itself is called no-guess either way. Rating boards by the hardest layer they need is the obvious next step, and `layers.ts` already counts it.

And no-guess is a promise about the board, not about you. A wrong flag the solver ignores is still a wrong flag, and chording around it will still find the mine.
