---
title: "Coil's leaderboard never asks the browser for a score"
date: "2026-11-20"
description: "Coil is a snake game in a 25 KB page. The browser and the server run the same simulation, so the server scores each Daily run from its moves. What that gets right, what it can't prove, and three places it broke."
seoDescription: "Coil is a snake game whose server replays every leaderboard run from its moves. What a shared deterministic simulation buys, and what it can't prove."
tags: ["gamedev", "javascript", "cloudflare", "claude", "buildinpublic"]
---

[Coil](https://coil.ashwinsathian.com) is a snake game for phone, tablet and desktop browsers, with five modes and a Daily board that's the same for everyone. The page is one HTML file of about 25 KB gzipped, with its CSS and JavaScript inlined, plus a 28 KB cut of the Anybody font. The sounds are synthesised in the browser, so there are no image or audio files to fetch, and after the first visit it plays offline.

Claude Code built it in one session, from a prompt that asked for the whole job (research, design, code, tests, deploy) with no intervention from me. I sent a few notes while it worked: push harder on taste, which review skills to use, and that the default look was too retro for my liking, so a modern one is now a tap away. A later prompt asked about the walls, and that's further down. The first version was committed at 00:57 IST on 20 November, and the walls change at 01:44.

Most of what's interesting about it follows from one decision.

## The game is a function from moves to a score

`src/sim.ts` is the whole game, and it has no clock. The board is 21 by 21 cells, the random numbers come from a 32-bit generator seeded once, and every value in the state is an integer. Time is counted in ticks. Each tick the snake moves one cell, and the number of milliseconds a tick stands for is worked out from the state: in Classic, 150 ms for a new snake, falling to 68 ms as it grows. The same seed and the same turns always give the same game, down to the tick it ends on.

That makes a game cheap to keep. A replay is the seed plus the ticks where the direction changed, packed as variable-length integers and base64url-encoded. A Classic run that ended 55 segments long comes to 192 characters, which fits in the fragment of a link. A run can be shared and watched move for move, and nothing about it is stored anywhere.

Three more features come from the same property. In Daily, your best run of the day plays beside you as a faint second snake. The title screen runs the sim with an autopilot, which takes the shortest path to the fruit only if the snake can still reach its own tail afterwards. And the tests use that autopilot to play about a hundred games, checking on every tick that the board and the snake still agree.

## The server plays every run again

The Daily leaderboard is a Cloudflare Worker with D1 behind it, and the Worker imports the same `sim.ts` as the page. A submission carries a name, a random id for the device and a replay. It doesn't carry a score. The Worker decodes the replay and checks that it's a Daily run on today's board (or yesterday's, for a run that ended just after midnight UTC). Then it plays the run to the end and stores the score it got. A replay that doesn't end in a finished game is refused, and so is one that scored nothing.

That rules out a forged score. No request can claim 9,000 points, because the points come from the server's own playthrough. It doesn't rule out a run nobody played. A replay proves the moves are legal, and says nothing about whether a person made them at the speed the game ran - someone with time could search for a long run offline and submit it. An automated security review of the Worker suggested handing out a nonce when a game starts and checking, on submit, that the wall-clock time since then is at least as long as the game. Coil doesn't do that. A program can wait in real time too, so the check would make cheating slower without stopping it, and it would refuse a run played offline and sent later. For a personal leaderboard, legal and scored by the server is the line.

The rest is ordinary. Names are 1 to 16 letters, numbers, spaces, dots or dashes. Each device keeps its best run of the day, and the Worker allows 20 submissions a minute from one IP address.

## Changing the rules without breaking old links

The later prompt was a question: shouldn't the walls wrap, so that leaving at the bottom brings you in at the top of the same column? Both rules are common in snake games, and Coil already had both. Classic has solid walls, and Blitz and Zen wrap on every edge. What I suggested was a mix, hard walls along some stretches and porous ones along others, with walls inside the field as well.

That became the edge model. Every row and every column has a flag that says whether its ends are a gate, so the rim is decided cell by cell. A solid line is a wall; a dashed line in the fruit's colour is a gate, and you come back in on the opposite edge, in the same row or column. A generator cuts each edge into mirrored runs of wall or gate and places mirrored walls inside. It keeps a wall only if a flood fill, one that follows the gates, still reaches every open cell. A new mode, Gates, is a run of these rooms. Eat the room's quota and you bank 100 times the room number, and the next room has fewer gates and more walls. Daily is now one generated room a day.

Changing the Daily board broke a promise the sim had made. A replay recorded before the change would play on a different board and come out with a different score, or end early. So the first byte of a replay, which had been a format version, is now the revision of the rules the game was played under. A Daily replay from revision 1 still gets the old board, with its rocks and solid edges. One from revision 2 gets a room. Before any of the new code went in, the session played one autopilot game in each of the four modes there were and saved each replay with its score and the tick it ended on. A test now plays those back under the new code and checks both numbers. The leaderboard accepts only the current revision, since today's board is the one it checks a run against.

## Three places it broke

**The service worker kept an old copy of the app.** Coil serves its cached page at once and refreshes the cache in the background. A repeat visit is instant, and a returning visitor runs the previous version until the next load. While the Gates change was being tested, a replay link from the new version opened in a browser that still had the old app cached. The old app didn't know revision 2, called the link damaged and threw it away. Now the service worker tells open tabs when the page it fetched differs from the one it had, and the app reloads onto the new one when that interrupts nothing: on the menu, or when a link is waiting for a version that can read it. A browser that has only the very first service worker still gets one load of the old app, because that code has nothing listening.

**The first retro look was too close to someone else's.** The default look started as a snake with round eyes on a two-tone checkerboard. Three design reviews ran on the screenshots, one of them with my own [loupe](https://loupe.ashwinsathian.com), and one pointed out that a checkerboard under a snake with eyes is the look of Google's snake game. Retro is now a snake of square blocks, with a madder block every third segment, on a flat charcoal board with a dot at each grid point. The fruit is a cut gem.

**Runs worth nothing made the board.** A check against the live site submitted a Daily run that died on its first move, and it was ranked first of one. The Worker now refuses a run that scored nothing, and the game doesn't offer the name form for one.

## Drawing between ticks

The sim moves in whole cells, between about 7 and 17 times a second depending on the mode and the snake's length. The renderer draws at the display's rate and fills in the frames between. The head slides from the last cell into the new one, the tail slides out of the cell it's leaving, and the body between them is cell centres joined into one path, so it never drifts sideways. A snake halfway through a gate hangs off one edge, so it's drawn a second time, shifted by the width or height of the board. In the Modern look each piece of the body has its own colour gradient. Most pieces move only when the sim ticks, so their gradients are built once a tick and reused for every frame until the next one.

## Where it stands

Before launch it was checked in Chromium at phone, tablet, landscape-phone and desktop sizes, in both looks and both themes, and the leaderboard and the offline load were tested against the live site. Touch, vibration and sound weren't checked on a real device. And the leaderboard can't tell a patient player from a patient program.

The game is at [coil.ashwinsathian.com](https://coil.ashwinsathian.com), and the code is at [github.com/AshwinSathian/coil](https://github.com/AshwinSathian/coil), under the MIT licence. If a replay link doesn't open for you, I'd like to see it.
