---
title: "A computer can't tell you how hard a sudoku is"
date: "2026-11-20"
description: "Nonet grades every sudoku by the techniques a person needs, not by how long a backtracking search takes. Why search effort barely tracks difficulty, how a human-technique solver sets levels, par times, hints and an adaptive rating, and what went wrong on the way."
seoDescription: "How Nonet grades sudoku by human solving techniques, generates puzzles to a level, and adapts difficulty with an Elo rating that scores time against par."
tags: ["algorithms", "gamedev", "typescript", "javascript", "claude"]
---

Every sudoku app has an Easy and a Hard button, and most of them can't say what the difference is. A common way to make the levels is to count clues, or to time a solver on the puzzle. Neither measures what a player feels. A puzzle with few clues can still fall to easy fills, and one with many can stop a good player at the one cell that needs an X-Wing.

[Nonet](https://nonet.ashwinsathian.com) is a sudoku I had Claude Code build end to end, from a prompt that asked for no intervention. It grades each puzzle by the techniques a person needs to solve it, and that grade then sets the levels, the par time, the hints and an adaptive mode that picks your next puzzle from how the last one went. This post is about that grader and what it was made to do.

## Search effort barely tracks difficulty

A computer solves sudoku by search. Nonet's search, in `src/sudoku.ts`, keeps each cell's possible digits as a 9-bit mask, fills the cell with the fewest options, and backs up when a cell runs out. It's fast, and it's what the generator uses to check that a puzzle has one solution. It also gives a number that looks like difficulty: how many nodes the search visits before it's sure.

To see whether that number means anything, `scripts/spread.ts` makes 2,000 random puzzles, each dug down until no clue can be removed without allowing a second solution. For each it counts the search nodes and grades it with the human-technique solver described below. The rank correlation between the two is 0.39. Sorted by the level the technique solver gives them, the median search sizes are:

| Level | Median nodes | Largest |
|---|---|---|
| Easy | 89 | 1,732 |
| Medium | 138 | 2,528 |
| Hard | 265 | 2,792 |
| Expert | 273 | 3,520 |
| Master | 287 | 3,232 |

Hard, Expert and Master look the same to the search, and the hardest Easy puzzle took the search longer than the median Master. A person doesn't search. They look for patterns, and the patterns are what make a puzzle hard.

## A solver that only knows what people know

`src/logic.ts` is a second solver that only uses human techniques, and always the cheapest one that makes progress. There are 24, in order: full house, hidden single, naked single, pointing, box-line reduction, the naked and hidden subsets up to quads, X-Wing, Swordfish and Jellyfish, Skyscraper, 2-String Kite, Turbot fish, XY-Wing, XYZ-Wing, W-Wing, the first type of unique rectangle, and three kinds of chain. Each has a cost, loosely on the scale the Sudoku Explainer program uses: 1.2 for a hidden single in a box, 2.6 for a pointing pair, 3.2 for an X-Wing, 6.0 for a general chain plus a little for each extra pair of links.

A puzzle's rating is the cost of its hardest step, and the solver records every step on the way. Ratings decide the five levels. Easy needs nothing past hidden singles in boxes, Medium needs any single, Hard adds locked candidates, pairs and X-Wings, Expert adds triples, fish, wings and rectangles, and Master needs chains.

The chains are the one part that isn't a pattern match. Every remaining candidate is a node. A strong link joins two candidates where one must be true: the only two places for a digit in a row, column or box, or the only two digits left in a cell. A weak link joins two that can't both be true. A chain that starts and ends on strong links and alternates between the two kinds proves that one of its ends is true, so any candidate that sees both ends can go. The solver runs a breadth-first search from every candidate and keeps the shortest chain that removes something. Then it names the chain by its shape. A three-link chain on one digit through two parallel rows is a Skyscraper. The same shape through a row and a column is a 2-String Kite, and through a box it's a Turbot fish. Longer ones are X-Chains, XY-Chains or the general alternating chain. The hint uses those names, so a player who has read about Skyscrapers sees one.

## Digging a puzzle to a level

The generator in `src/levels.ts` fills a grid at random, then removes clues in pairs that mirror each other through the centre, which is why every puzzle has the rotational symmetry of a printed one. A removal stays only if the search still finds one solution. Below Master, it also has to pass the technique solver capped at the level's hardest technique: an Easy puzzle stops losing clues the moment one more removal would need a naked single. Easy and Medium also keep at least 36 and 30 clues, because a puzzle that is technically all hidden singles but starts with 25 clues doesn't feel easy. If the finished puzzle comes out below the level, the generator starts again.

Master puzzles skip the cap. Chain searches are too slow to run after every removal, and they don't need to: of the 2,000 random puzzles above, 187 already need a chain, and 21 need something past the solver's techniques. Those 21 are thrown away. A puzzle that the technique solver can't finish would leave the hint button with nothing honest to say, so Nonet never deals one.

All of this is quick. Easy and Medium puzzles take about 1 ms each on my laptop and Hard about 8 ms, per `scripts/bench.ts`. It runs in a Web Worker anyway, which keeps a few puzzles of each level ready. On a phone profile, with the CPU slowed 4 times and a slow 4G connection, the first screen paints at 432 ms, and a Master puzzle from the ready pool is on screen 141 ms after the tap.

The random numbers come from sfc32, which uses only 32-bit integer operations and gives the same sequence in every JavaScript engine. So the Daily needs no server: the local date is hashed into a seed, and every device that runs the generator on that seed gets the same puzzle. The level climbs through the week, from Easy on Monday to Master on Sunday.

## Par is a sum of steps

Each technique also has a time in seconds: 7 for a hidden single in a box, 25 for a pointing pair, 45 for an X-Wing, 150 for a general chain. A puzzle's par is the sum over every step of its logical solve. That makes par different from rating in a useful way. Generated Expert puzzles have pars from 6 to 15 minutes, because par counts every step and the rating counts only the hardest. In the generated sets, Easy pars sit around 4 minutes and Master pars run from 8 to 50.

Those seconds per technique are a guess. Nothing in Nonet was measured on real players, and I'd expect the costs of the rarer techniques to be wrong. What the adaptive mode needs from par is a consistent yardstick, and the next section is built so that a yardstick that's off by a constant factor still works.

## Adaptive mode is Elo with a score between 0 and 1

In the adaptive mode, the player has a rating on the same scale as the puzzles. After each game it moves by an Elo update, the rating system from chess. The expected score is logistic in the gap between your rating and the puzzle's rating. The actual score, which chess keeps to 0, 0.5 or 1, is continuous here:

```ts
const time = 1 / (1 + Math.pow(secs / par, 1.5));
return time * Math.pow(0.85, mistakes) * Math.pow(0.75, hints);
```

Finishing in exactly par time with no mistakes or hints scores 0.5, so a player who solves puzzles at par stays where they are. Finishing in half of par scores 0.74, twice par scores 0.26, and each hint costs a quarter of whatever is left. An adaptive game left for another one counts as 0.

The update is `rating + K * (score - expected)`. K starts at 1.6 and falls with games played, to 1.13 after two, 0.8 after six and a floor of 0.4 after 30. A new player at 2.5 who solves a 2.3-rated Medium puzzle in half its par moves up by 0.25 in their first game, and by 0.08 for the same result once K has settled. The first few games move the rating a long way, and later ones nudge it.

Because the rating and the puzzles share a scale, the next puzzle is drawn at the new rating: the generator picks the level the rating falls in and, from the puzzles it has ready, the one rated closest. If par is consistently too generous, a player's ratings come out high everywhere, and the puzzles they get still match how they play against that par. The results screen says what happened in a sentence, for example that you finished under par with no mistakes or hints, so the next puzzle is harder.

## Hints are the next step from where you are

A hint runs the same technique solver on the player's grid. If a placed digit is wrong, that comes first. Otherwise the solver needs candidates, and the player's own notes are the better source when they can be trusted: if every empty cell has notes and none of them has crossed out the right answer, the hint works from them. That way it finds the step the player is stuck on, rather than one they took ten minutes ago. If the notes are incomplete or wrong, the hint works from fresh candidates, and applying an elimination fills the notes in first.

A hint comes in three taps. The first names the technique and where to look ("Look for an X-Wing in row 3"). The second highlights the cells and explains the step, with the digits it removes struck through in red. The third applies it, as one move that undo can take back.

The test I trust most for this plays games using nothing but hints. `src/game.test.ts` takes four puzzles from each level, puts a wrong digit and a stray note on the board, sometimes fills every note, then asks for a hint and applies it until the puzzle is done. Every elimination is checked against the solution, and every game has to finish. A second test runs the technique solver over 50 generated puzzles and checks every placement and every removal against the known solution.

## What went wrong on the way

**A Hard puzzle could read as Expert.** The first rating was the hardest step plus up to 0.4 for the number of harder steps, so that puzzles at one level would still differ. The benchmark printed a Hard puzzle rated 3.68, which is past the 3.6 where Expert starts, so the adaptive mode would have labelled it wrong. The bonus is now capped at 0.09, which can't cross into the next level.

**A design review found five things I'd have shipped.** It ran on screenshots with my own [loupe](https://loupe.ashwinsathian.com) skill. Restart cleared the undo history, so one tap could wipe a game for good, and Show solution ended an adaptive game (and cost rating) on a single tap. A digit the player got wrong turned the clue it clashed with red as well, though a clue is never the mistake. Pencil notes in the selected cell measured 3.4 to 1 against their background, under the 4.5 to 1 that WCAG asks for text. And the logo's centre square, which is meant to be blue, wasn't: CSS selectors can't reach inside an SVG `<use>` copy, so the class on it did nothing. Restart is now one undoable move, Show solution asks twice, only the player's digit goes red, the note colour is darker, and the colour is set inline on the square.

**The Daily changed at midnight UTC.** The date came from `toISOString()`, so in India the Daily turned over at 5:30 in the morning. It now uses the local date. The puzzle is the same for everyone on the same calendar day, which for a few hours means two puzzles are live in different time zones.

**Hint text said "a x-wing".** The nudge was built as "There's a {technique} in {place}", lower-cased, with a fixed article. It now picks "a" or "an" by sound, keeps names like X-Wing in their own case, and calls a pointing pair a pair or a triple by its size.

## What it doesn't do

It can't solve every valid sudoku by logic. Puzzles that need forcing nets or other techniques past chains exist, and about 1 in 100 random minimal puzzles is one of them. The generator drops those. A pasted puzzle that needs them still plays, and its hints fall back to checking your digits and filling in a cell.

Par isn't calibrated against people, and the adaptive rating is per device, with nothing stored on a server. The rating is also only as good as the order of the technique costs: if a player finds W-Wings easier than XY-Wings, the grader won't know.

The game is at [nonet.ashwinsathian.com](https://nonet.ashwinsathian.com), and the code is at [github.com/AshwinSathian/nonet](https://github.com/AshwinSathian/nonet), under the MIT licence. If a hint ever tells you something that isn't true, I'd like to see the puzzle.
