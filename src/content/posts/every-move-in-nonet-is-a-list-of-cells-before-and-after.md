---
title: "Every move in Nonet is a list of cells, before and after"
date: "2026-11-24"
updatedAt: "2026-11-24"
description: "In a sudoku, one tap can change dozens of cells, and undo has to take back all of them at once. How Nonet records every kind of move as the cells it changed, what undo leaves alone, and how the whole history is saved after every move."
seoDescription: "How a browser sudoku records every move as a before-and-after diff of cells, so undo, redo, hints, restart and saving all share one log."
tags: ["typescript", "gamedev"]
---

The textbook way to build undo is the command pattern. Every action is an object that knows how to do itself and how to undo itself, and the history is a stack of those objects. It works well in a text editor, where most actions touch one place - type a letter, delete a word. It gets awkward once an action reaches past the thing the user touched. Then every command needs an inverse that's exactly right, and a subtle bug in one inverse turns undo into a slow way of corrupting the document.

A sudoku has plenty of those actions. In [Nonet](https://nonet.ashwinsathian.com), placing a digit also clears that digit from the pencil notes of every cell in the same row, column and box. "Fill notes" writes into every empty cell on the board. A hint can remove candidates from cells all over the grid. Say a player places a 7, sees it was wrong and presses undo. The 7 has to go, and every note it tidied away has to come back, in one step. So Nonet doesn't store commands at all - it stores results. A move is a list of cells, with what each one held before and after.

## A move is the cells it changed

A cell in the game state is two numbers: the digit (0 for empty) and the notes, a 9-bit mask with bit `d - 1` set when `d` is pencilled in. A move is three parallel arrays. This is all of it, from `src/game.ts`:

```ts
interface Cell { v: number; n: number }
interface Move { cells: number[]; before: Cell[]; after: Cell[] }
```

Every change to the board goes through one function. You hand it the cells that might change and a function that says what each one becomes, and it records only the ones that actually did:

```ts
function commit(g: Game, cells: number[], change: (i: number, c: Cell) => Cell) {
  const before: Cell[] = [], after: Cell[] = [], changed: number[] = [];
  for (const i of cells) {
    const b = { v: g.values[i], n: g.notes[i] }, a = change(i, b);
    if (a.v === b.v && a.n === b.n) continue;
    changed.push(i); before.push(b); after.push(a);
    g.values[i] = a.v; g.notes[i] = a.n;
  }
  if (!changed.length) return false;
  g.undo.push({ cells: changed, before, after });
  if (g.undo.length > 500) g.undo.shift();
  g.redo = [];
  return true;
}
```

Undo and redo don't know what kind of move they're looking at. They don't need to. Undo writes `before` back into the board and moves the record to the redo stack, and redo writes `after` and moves it back:

```ts
export function undo(g: Game) {
  const m = g.undo.pop();
  if (!m) return null;
  m.cells.forEach((i, k) => { g.values[i] = m.before[k].v; g.notes[i] = m.before[k].n; });
  g.redo.push(m);
  return m.cells;
}
```

There's no inverse to write, because the inverse is just the old values. A command stores what to do and has to work out how to undo it, while a diff stores the outcome and gets undo for free, at the cost of storing both states of every cell it touched (the sizes are further down).

Two details in `commit` are easy to miss. A move that changes nothing isn't recorded - there's no entry for it at all. Call `fillNotes` twice on the same board and the second call returns `false`, with one entry left in the history. And the click handler for the Fill notes button in `src/main.ts` only shows "Notes filled in" when that call returns `true`, so the player isn't told about a change that didn't happen.

## One intent, many cells

Routing everything through `commit` means each thing the player means to do becomes exactly one entry, however many cells it touches. Take placing a digit with the tidy-notes setting on (it's on by default):

```ts
const b = bit(d);
const cells = tidy ? [i, ...PEERS[i].filter((p) => !g.values[p] && g.notes[p] & b)] : [i];
commit(g, cells, (k, c) => (k === i ? { v: d, n: 0 } : { v: c.v, n: c.n & ~b }));
```

The cell gets the digit and loses its notes. Every empty peer that had that digit pencilled in loses that one bit - nothing else about it changes. Take Medium seed 3 with every note filled in: if we place the right digit in the first empty cell, that's a move of 6 cells. Undo puts all six back. The tests check exactly that: fill the notes, place a digit, check the peer notes changed, undo and compare values and notes with the snapshot from before, then redo and compare with the snapshot from after.

"Fill notes" is one `commit` over every empty cell. Applying a hint is one more. A hint that places a digit goes through `place`, so it tidies the peers like a placement the player made. A hint that removes candidates can do something larger. When the player's notes can't be trusted (some empty cell has no notes, or a note has crossed out the right answer), the hint sets `fill`, and applying it replaces every empty cell's notes with fresh candidates before the elimination. Any eliminations the player had made by hand go with them. It's still one move, though:

```ts
const v = grid(g), c = candidates(v);
const notes = Uint16Array.from(g.notes, (n, i) => (h.fill || !n ? c[i] : n));
apply(v, notes, s);
return commit(g, [...Array(81).keys()].filter((i) => !g.values[i]), (i) => ({ v: 0, n: notes[i] }));
```

How big do these get? We can play a Master puzzle (seed 7) to the end on hints alone and look at the history. Starting with no notes, it takes 61 moves. The largest is 39 cells: the 17th hint, a pointing step, which filled the notes of every empty cell before removing anything. Starting from a board where Fill notes has already run (a 55-cell move of its own, one per empty cell), the largest hint move is 10 cells, the 16th. Either way one undo takes a hint back, filled notes and all.

The hint that says "this digit is wrong" works the same way. Clearing the wrong digits is a `commit` that sets those cells to empty, so the player can undo it and get the wrong digit back.

## Restart used to be the exception

Restart wasn't written through this log at first. Before commit a78e0e7, the handler in `src/main.ts` rebuilt the board from the puzzle string and threw the history away:

```ts
G.values = Array.from(G.puzzle, (ch) => (ch === '.' ? 0 : +ch));
G.notes.fill(0); G.undo = []; G.redo = [];
```

It's a natural way to write restart. But it also meant one tap on Restart, on the pause screen, wiped every digit and note the player had added, for good. The commit is titled "Design review fixes" (the game's build plan lists a design review as one of its milestones), and its fix was to stop treating restart as special:

```ts
/** Clear every digit and note the player added, as one undoable move. */
export function restart(g: Game) {
  return commit(g, [...Array(81).keys()].filter((i) => !isGiven(g, i)), () => ({ v: 0, n: 0 }));
}
```

After a restart, the line under the puzzle title now reads "Restarted. Undo brings your digits back." In a Medium game with notes filled and one digit placed, the restart move is 51 cells, and undoing it puts back every value and note exactly (compared as JSON before and after). And restart returns `false` on an untouched board, so restarting a fresh puzzle just unpauses.

Why was the bug possible at all? Every other action had to go through `commit` to change a cell during play, so it landed in the history whether its author thought about undo or not. Restart didn't - it wrote the arrays directly. (The only other direct write left is on Show solution, which fills in `g.values` after the game has already ended.) Once restart became "set all these cells to empty", it got undo the same way everything else does, without a line of undo code.

## What undo leaves alone

Undo restores the board. It doesn't restore the score - that follows from where the score lives. A wrong digit counts as a mistake the moment it's placed, keyed by cell and digit so that retyping the same wrong digit counts once:

```ts
if (d !== answer(g, i)) {
  const key = i * 10 + d;
  if (!g.wrong.includes(key)) { g.wrong.push(key); g.mistakes++; }
  return 'wrong';
}
```

Neither `g.wrong` nor `g.mistakes` is part of a `Move`, so undo can't reach them. If we place a wrong digit on Easy seed 2 and undo it, `mistakes` is still 1. Hints are no different. The counter goes up when the hint panel opens, and undoing the step it applied doesn't bring it down. In Adaptive mode those two numbers feed the player's rating.

There was a gap next to this, though. When a player left an Adaptive game for a new puzzle, `abandon()` recorded it as unfinished, which costs rating - but only if `G.undo.length` was non-zero. Undoing every move empties that stack. So place a wrong digit, undo it, and start a new puzzle: the mistake was counted (1, in the same Easy game), the undo stack was at 0, and the game was never recorded at all. Opening hints without applying any left the stack empty too. The comment above `abandon()` calls this "a started adaptive game", and a non-empty undo stack was the only test for started. A player who undid everything looked exactly like one who never touched the board.

New moves clear the redo stack, with one line in `commit`, `g.redo = []`. Undo twice, toggle a note, and the redo stack goes from 2 to 0. There's one line of history.

The history is capped at 500 moves, oldest dropped first. Toggle notes 700 times on one cell and the stack holds exactly 500. Will a real game hit that? Rarely. Expert seed 9 has 54 empty cells and 180 candidates left once the clues are counted, so pencilling in every candidate one tap at a time and then placing all 54 digits comes to about 234 moves. The cap needs heavier note work than that - a lot heavier. A player who pencils all nine digits into every empty cell, ruled-out ones included, makes 486 moves before placing anything. Add the 54 placements and it's 540, and the first 40 of those taps can no longer be undone.

## Undo doesn't tell the board which cells changed

`undo` returns the cells it changed. But the UI only checks whether it returned anything (`doUndo` does nothing more when the stack was empty) and ignores which cells they were. After any move, undo included, `src/main.ts` calls `render()`, which builds a key for each of the 81 cells from its value, notes and highlight classes. It only touches the DOM for cells whose key changed:

```ts
const key = `${v}|${n}|${cls}|${same}|${marks}`;
if (key === c.key) continue;
```

So the board never needs to know whether a change came from a tap, a hint, an undo or a restart - it compares what's there with what it drew last time. A 51-cell undo and a one-cell note toggle take the same path.

## Saving the game is saving the history

The game state is plain data: arrays of numbers, the two stacks of moves, the clock, the counts. The comment at the top of `src/game.ts` gives the reason, "so it can be saved to localStorage after every move" - and the undo history goes along with it. Reload the page halfway through a puzzle and undo still works, all the way back.

The save is coalesced. More than one thing can call `save()` in the same turn of the event loop (a move that solves the puzzle saves the game, then `finish` saves the stats), so the first call queues a microtask and the rest do nothing until it runs:

```ts
const save = () => {
  if (saveQueued) return;
  saveQueued = true;
  queueMicrotask(() => { saveQueued = false; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* storage full or blocked */ } });
};
```

There are two other writes. While a game is in progress, a five-second interval saves it, which keeps the clock reasonably current. And when the tab goes hidden, a game in progress pauses and the state is written straight away, with `localStorage.setItem` called directly instead of through the queued `save()`. That's the write that covers a player who switches apps mid-puzzle and never comes back to the tab.

Measured in Node 24, the game object from the hint-only Master game above is 7.6 KB of JSON at the end, with 61 moves in its history. It's 9.6 KB when the game starts from filled notes. The 486-move notes game is 32.7 KB, which is roughly what a full 500-move history of one-cell moves costs. The pool of 15 ready puzzles saved next to the game is 4.0 KB. All of it's rewritten on every save, because the whole save is one localStorage key. And a write that fails (storage full, or blocked) is caught and dropped, and play goes on without saving.

## One slot

The save holds one game. `S.game` is a single field, and starting any new puzzle replaces it. Leave a Daily half done to try a Hard puzzle and the Daily in progress is gone. Tap Daily again and you'll get the same puzzle, since it comes from the date, but from the start, with an empty history and the clock at zero. Nonet resumes a Daily only when the current game is that day's Daily. An Adaptive game swapped out this way is recorded as unfinished, as long as the player did anything in it.

A second slot would be a small change to the data, since a `Game` already carries everything needed to resume it, history included. Which behaviour a second slot should have - one game per mode, or a list of games in progress - isn't something the code or the game's notes settle.

## Since this was published

A fix on 24 November closed the gap in `abandon()`. A new `started()` counts an Adaptive game as started after any move (even one that's been undone), a mistake or an opened hint, so the wrong-digit-then-undo game and the hints-only one are now recorded as unfinished like any other. The same fix sorted out long-press notes on Android, where the 420 ms timer and the `contextmenu` event both fired and the note went on and straight back off - whichever comes first now wins.
