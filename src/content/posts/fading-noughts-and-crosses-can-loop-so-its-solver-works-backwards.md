---
title: "Fading noughts and crosses can loop, so its solver works backwards"
date: "2026-11-24"
updatedAt: "2026-11-24"
description: "A game where positions can come round again breaks the usual recursive solver. How Noughts solves its Fading mode by retrograde analysis instead, what the table says about the game, and the one rule the table can't see."
seoDescription: "Solving a looping noughts and crosses variant with retrograde analysis in TypeScript: 128,170 positions, a forced win in 13 plies, and the threefold limit."
tags: ["typescript", "algorithms", "gamedev"]
---

The first game solver most of us write is a recursive function that asks every child for its value and takes the best one. That works because the recursion has a floor. Every line of play ends, so every call eventually returns. Take the floor away (let a position come round again) and the same function asks itself a question it's still in the middle of answering.

Fading, one of the three modes in [Noughts](https://noughts.ashwinsathian.com), has no floor. Each side keeps at most three marks, and placing a fourth removes your oldest. The grid never fills, so the game doesn't have to end. Noughts still knows the exact result of every Fading position, and it works that out in the browser when you pick the mode. This post is about how, and about the rule the solved table got wrong.

## A game that goes round

The tests in `src/engine.test.ts` have the plainest picture of it. X plays 0, 1, 5, 6 over and over, O plays 2, 3, 7, 8, and each new mark lands as the oldest one disappears:

```ts
// X rotates through 0 1 5 6 and O through 2 3 7 8: no line ever forms, and every 8 plies the
// position comes back. The position after ply 6 is back at 14 and 22, so ply 22 draws.
const loop = [0, 2, 1, 3, 5, 7, ...[6, 8, 0, 2, 1, 3, 5, 7], ...[6, 8, 0, 2, 1, 3, 5, 7]];
```

Without a rule to stop it, that goes on for ever. The game's rule is threefold repetition - we'll come back to it, because the solver doesn't know about it.

## Why the recursion doesn't finish

Classic is the easy case, and `src/solve.ts` does the obvious thing. A board is a base-3 number (each cell is empty, X or O), the memo is an `Int16Array` of 19,683 slots, and a memoised negamax fills it from the empty board. It visits 5,478 positions, which the tests pin exactly. The whole table takes a few milliseconds in Node 24 on an M4 Pro Mac.

The values carry distance as well as result:

```ts
export const WIN = 1000;
/** The value a move has for the side that plays it, given the value of the position it leads to. */
export const back = (v: number) => (v > 0 ? -(v - 1) : v < 0 ? -(v + 1) : 0);
```

`WIN - d` means the side to move can force a win in `d` plies, `-(WIN - d)` means it loses in `d`, and 0 is a draw. Stepping back one ply flips the sign and moves the number one step closer to zero, so a faster win is always the bigger number. Keep that in mind - it comes back at the end.

Now try the same thing on Fading. A position there is both sides' queues of marks, oldest first, plus whose turn it is. Play the loop above and after eight plies you're looking at a position you've already seen. The negamax call for that position is still on the stack, waiting for its children. The memo doesn't help - nothing has been written to it yet. You can cap the depth. But then the answer depends on the cap, and a "draw" only means nobody won within however many plies you allowed.

So the solver turns the problem round. Instead of asking where a position leads, it starts at the positions where the game is already over and works out what leads to them.

## Start from the end

The first job is to find every position the game can reach. `solve.ts` packs a position into one integer: each queue becomes up to three digits of `cell + 1`, and the turn goes in the low bit.

```ts
const qcode = (q: readonly number[]) => q.reduce((a, c) => a * 10 + c + 1, 0);
const fkey = (x: readonly number[], o: readonly number[], turn: number) => (qcode(x) * 1000 + qcode(o)) * 2 + turn;
```

The forward pass is a plain breadth-first walk from the empty board. It gives every new key a small id, stores each position's children by id, and marks a position as done when the move into it completed a line. Done positions get no children - nobody plays on after a win. The walk finds 128,170 positions. A separate walk that uses the game's own `rules.apply`, and shares no code with the solver, finds the same 128,170, and 12,096 of them are finished games.

Then comes the backward pass, which is short enough to quote whole:

```ts
const left = Int32Array.from(kids, (l) => l.length);
const val = new Int16Array(n);
const queue: number[] = [];
for (let i = 0; i < n; i++) if (done[i]) { val[i] = -WIN; queue.push(i); }
for (let h = 0; h < queue.length; h++) {
  const c = queue[h];
  for (const p of parents[c]) {
    if (val[p] !== 0 || done[p]) continue;
    if (val[c] < 0) { val[p] = back(val[c]); queue.push(p); }
    else if (--left[p] === 0) { val[p] = back(val[c]); queue.push(p); }
  }
}
```

A finished position is a loss for the side to move - the other side just made three in a row. Everything else follows from two rules. If one of your moves reaches a position that's lost for your opponent, you're winning. If every one of your moves reaches a position that's won for your opponent, you're losing. `left[p]` counts how many of `p`'s children haven't yet been shown to be wins for the opponent. Each time one is, the counter drops, and when it hits zero `p` is a loss.

The queue does the distance bookkeeping on its own. It starts with every finished position at distance zero, and each position pushed gets its child's distance plus one, so the queue comes out in order of distance. A winning position is set by the first losing child to reach it, which is the fastest win. A losing position is set when its last child resolves, and that's the one furthest away, so the loser is credited with the longest defence.

Some positions are never pushed at all. They have at least one child that isn't a win for the opponent and no child that's a loss for them, so their counter never reaches zero and their value stays at the 0 it started with. Those are the positions where neither side can force anything, and the game can go round. `val` starts at zero for a reason - unresolved means draw, and there's no separate pass to label them. Counted from the separate walk, that's 13,193 drawn positions, against 78,613 won and 24,268 lost for the side to move, plus the 12,096 finished.

## What the table says about Fading

Every edge square is worth 987 for X as an opening, i.e. a forced win in 13 plies. The corners and the centre are worth 0. So X wins Fading by force, but only by opening on an edge. A corner throws the win away on move one.

It's a strong claim to rest on one solver, so the tests check it without the solver. `engine.test.ts` has a small depth-limited search, `forces(s, d)`, that asks whether X can force a win within `d` plies using nothing but `rules.apply`:

```ts
const r = s.turn === 0 ? kids.some((t) => forces(t, d - 1, memo)) : kids.every((t) => forces(t, d - 1, memo));
```

A depth limit is fine here, because it's asking a yes-or-no question with the limit in the question. The test asserts `forces(initial('fading'), 13, memo)` is true and that the same call with 11 is false, which pins the 13 from both sides (X moves on odd plies, so 12 can't be the answer). And another test walks every reply O could make against the Best bot playing X and checks each line ends in an X win within 13 plies.

Thirteen isn't the longest forced win in the table, by the way. Some reachable positions need 17.

## When it runs

The table takes time to build. In the same Node setup, `scripts/bench.ts` puts it at roughly 100 to 260 ms, depending on what else the machine is doing, so a tenth to a quarter of a second. Once built it holds about 3.7 MB of heap (a rough figure, from `process.memoryUsage()` either side of the build).

It isn't built on page load. When you pick Fading on the menu, `main.ts` queues the build with `requestIdleCallback`, and if you press Play before that has run, `start()` builds it before the first move. Both run on the main thread. No worker. The Ultimate bot's tree search has a Web Worker, because it thinks on every move; the Fading table is a one-off cost, and after that every lookup is a `Map.get`. The build hasn't been timed on a phone, where it'll be slower.

## Playing from the table

Once every position has an exact value, three features come almost free. Show odds labels each empty square with what it leads to ("wins in 2", "loses in 1", "draw"). The review grades every move as best, slow (a win kept, but now a longer one) or a slip (the result dropped). And the bot reads it.

Easy takes a win in one if there is one and plays at random otherwise. Good plays like Best seven times in ten, and like Easy the rest. Best never gives up a result it holds. When several moves hold the same value, a winning Best takes any of them, since the value already prefers the fastest win. Drawing or losing, it has to choose between moves the value can't separate, so `bot.ts` counts traps:

```ts
/** Number of replies that drop the opponent's result below what the position holds for them. */
function traps(s: State, move: number) {
  const t = apply(s, move);
  if (t.over) return 0;
  const hold = value(t);
  let n = 0;
  for (const v of moveValues(t).values()) if (Math.sign(v) < Math.sign(hold)) n++;
  return n / t.legal.length;
}
```

Among the equal moves, Best plays the one that leaves you the largest share of replies that lose ground. In Fading that's most of what Best does as O. After an edge opening O is lost, so it takes the longest defence available and, among those, the one with the most ways for you to go wrong.

## The rule the table can't see

The comment at the top of `src/rules.ts` states the repetition rule: "A position seen for the third time is a draw (the solver calls those cycles draws too)." The game keeps a count of every position in a `Map` that `replay()` builds from the move list. But the solver's key has no count in it. It knows the two queues and whose turn it is, and nothing about how often the game has been there.

For the value of a fresh game that doesn't matter, and the reason is the distance in the values. Once a side is winning and plays the fastest win, the distance - the number in the value - drops by at least one every ply (the loser can only make it shorter), so no position can repeat on the way. Draws stay draws either way. The trouble starts once a game has already repeated itself, because then a square the table calls a win can be the one that ends the game in a draw.

A line that shows it is `#f0123465701234657012346`, which Noughts accepts as a replay link. It's 22 plies. From ply 6 the two sides walk the same eight moves round twice, so positions 14 to 21 are 6 to 13 again. The loop isn't free, though. On every lap, at plies 8, 12, 16 and 20, O has a win in one and plays something else - the review grades each of those a slip, from a value of 999 down to 0. And X answers each time with a slip of its own, at plies 9, 13, 17 and 21. So random play almost never gets here. Across 20,000 random Fading games (seed 7 of the game's own generator), 34 saw a position twice, and none reached a third repetition.

After 20 plies it's X's move, and the table calls the position a draw. X has three squares. The bottom right holds the draw, the bottom left loses in 8 plies, and the centre loses in 4. X takes the centre. When this was written, the review marked that move as a mistake, and going by the note code in `main.ts` it said that before it the game was a draw, and after it Noughts can force a win in 2 moves.

Now look at it from O's side. The table says O wins in 3 plies, and only by playing the bottom left. That square recreates the position from plies 6 and 14, for the third time. The other two squares lose on X's next move. So O's only real choice is the draw, and the game ends on "Draw. The same position came up three times." In a same-screen game with odds on, the bottom left would have been labelled "wins in 2" just before. X's centre held the draw as well as the bottom right did - and it was still graded a slip.

How far did this reach? Not to Best, probably. From the moment it's winning, the distance drops every ply, and every position after that point is one where Best is winning, so none of them can repeat a position from before, when it wasn't. That's an argument - not an exhaustive search. Good was another matter. Its random three moves in ten could let a win slip into a loop, and when it then played its best move it could walk into a third repetition the same way; nobody went looking for a game where it did.

The online rooms already treat the count as part of the game (the server replays the whole history to check for a third repetition, because a single position can't tell it). The table didn't. It can't, without changing what a key is. Putting the count in the key makes a position depend on the path to it, and the table grows with every history it has to tell apart. A cheaper patch, treating any move that would be a third repetition as a draw when the table is read, would fix O's last move and not X's grade one ply earlier, because the table would still think it knew what happens after X's move. What's the smallest change that fixes both?

## Since this was published

A fix on 24 November gives Fading values the game so far, and the key stays as it was. Any position already seen twice is a draw to move into, and the backward pass reruns with those positions held at a draw. That takes about 5 ms, the last 16 sets of repetitions are cached, and the result feeds the review grades, Show odds, both solved bots and the trap count. Checked against a brute-force search that counts repetitions, it gave 0 mismatches over 2,961 moves, against 6 with the history ignored. In the line above, O's bottom left now scores 0, and X's centre is graded best. The review's deciding mistake changed too - it's now the loser's last slip in a won game, and a drawn game names none.
