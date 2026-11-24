---
title: "A leaderboard that never asks the browser for a score"
date: "2026-11-20"
description: "Any score a browser sends could have been typed by hand. Coil's Daily board takes the moves instead and plays them again on a Cloudflare Worker. What a simulation gives up to run on both sides, how the server parses a replay it can't trust, and what changing the rules does to every link already shared."
seoDescription: "Server-side replay scoring for a browser game: one deterministic simulation in client and Worker, hostile-input replay parsing, and versioned rules."
tags: ["typescript", "gamedev", "cloudflare", "security"]
---

A score that arrives over HTTP is a number somebody typed, whether the typing was done by your game or by `curl`. You can sign it, obfuscate the code that sends it, rate-limit it - the client still holds every key you give it. The only score worth storing is one the server worked out for itself.

That's how the Daily leaderboard works in [Coil](https://coil.ashwinsathian.com), my snake game. A submission is a name, a random id for the device and a replay: the seed, and the ticks where the snake turned. The Worker behind `/api/daily` plays that replay through the same `src/sim.ts` the browser runs and stores the score it gets. The request has no field for a score at all.

Running one simulation in two places sounds like importing a file twice. Mostly it's about what the simulation isn't allowed to touch, and what the server has to assume about the bytes it's given.

## What the simulation gives up

The first line of `sim.ts` is the contract: integer-only, seeded, no clock, no DOM. Each of those closes off one way for the browser's game and the server's game to drift apart.

No clock is the one that takes discipline. Anything in the game that feels like time has to be counted in ticks, or in milliseconds the simulation adds up itself. The snake speeds up as it grows (in Classic a tick lasts `Math.max(68, 150 - (len - 3) * 2)` ms), and the sim keeps `elapsed` as the sum of those intervals without ever reading `performance.now()`. So the combo window, 3,500 ms between fruit, and Blitz's 60-second limit are both measured in simulated time. A phone that drops frames gets the same combo as a desktop, and so does the Worker, which has no frames at all.

Real time exists in exactly one place, the frame loop in `main.ts`. It adds each frame's delta to an accumulator, runs a tick whenever the accumulator passes the current interval (at most four a frame) and gives the renderer what's left over as a fraction to draw between cells. Nothing the renderer does can reach back into the game.

Seeded randomness has a quieter cost. The generator is a 32-bit one, seeded once per game, and the game draws from it to place fruit, roll for golden fruit and lay out rooms. The quality of the numbers hardly matters - the order of the calls does. Every `this.rand()` before the first fruit shifts every number after it, so one extra draw anywhere (one more wall, a loop reordered) gives every old seed a different game. In a seeded simulation the sequence of random draws is part of the file format, whether or not anybody wrote that down.

Integer-only is easy for snake, where every position is an index into a 21 by 21 board held in a `Uint8Array`. A game with real physics can't do that, and [the pinball table](/writing/a-pinball-replay-is-a-promise-about-the-last-bit-of-every-float) carries its own sine function instead.

## Record what the simulation did, not what was pressed

The input side has a trap in it. On a phone, three swipes can land inside one tick. `main.ts` queues up to three turns, drops one that repeats or reverses the last turn in the queue, and feeds the sim one per tick. The sim checks again, because a turn can be legal when it's queued and illegal by the time it's applied:

```ts
if (input >= 0 && input !== this.dir && input !== (this.dir ^ 2)) {
  this.dir = input;
  this.log.push(this.tick, input);
}
```

The log is written inside `step()`, after that check. So a replay holds the turns the simulation accepted, at the tick it accepted them, and never a key the player pressed. A rejected reversal or a swipe that arrived late was never recorded, so a replay can't trip over one. The replay player in `src/replay.ts` adds one more rule. If a log has two events on the same tick, which an honest client never writes and a forged one might, the second is skipped (the comment says "stale events are ignored, not replayed late").

The codec writes a header of rules revision, mode, seed, end tick and event count, then each event as a varint of `tickDelta * 4 + direction`, and base64url-encodes the lot. An autopilot run on the 20 November Daily board, 2,967 ticks and 694 turns long, comes to 940 characters. That fits in the fragment of a link, and it's small enough to keep whole in D1 next to the score, so every row on the board can be watched.

## The replay is hostile input

On the server the replay is the one field that matters, and an attacker controls every byte of it. `decode()` treats it that way before the simulation sees anything:

- the string has to match `^[A-Za-z0-9_-]{4,20000}$`, inside a request body of at most 24,000 characters;
- the revision byte has to be one this code knows, and the mode index has to exist;
- the end tick can be at most `MAX_TICKS`, 200,000, and the event count at most one more than the end tick;
- a varint longer than five bytes, an event after the end tick or a single trailing byte is an error.

The tick cap is what bounds the server's work. I measured it for this post. In Node 24 on my machine, a 200,000-tick Zen game replays in 4 to 14 ms, and a Classic game of 2,452 ticks in a quarter of a millisecond. So the worst replay the decoder lets through costs a few milliseconds of CPU, and a Workers rate-limit binding (20 submissions a minute per IP address) stops anyone sending many of them.

After decoding, the Worker checks that the run is a Daily under the current revision and that its seed is today's board or yesterday's, for a run that ended just after midnight UTC. `dailySeed()` is an FNV-1a hash of `coil:` and the date, so the Worker recomputes the seed instead of looking it up. Then it plays the run to the end:

```ts
const game = simulate(replay);
if (game.alive || game.tick !== replay.endTick) return fail('Replay does not end in a finished game');
if (game.score <= 0) return fail('Score at least one fruit to join the leaderboard');
```

A run has to die exactly on the tick its replay says it ended. That's why `die()` counts the fatal move as a tick - without it, a replay would stop one tick short of the death it records. The zero-score rule came out of launch day, when a check against the live site sent a run that died on its first move, and it was ranked first of one.

The insert is an upsert on `(day, player)` that keeps the higher score along with that run's replay, so a worse run later in the day can't replace a better one.

The 20,000-character cap is a real ceiling, and measuring for this post showed where it bites. Zen has no death, and three autopilot Zen runs crossed 20,000 characters at about 15,000 turns, which is roughly 2 hours 40 minutes of play. The client reads share links with the same `decode()`, so a Zen run longer than that makes a link Coil refuses to open. Zen isn't on the leaderboard and the server never sees one. The link is still broken.

## What the server can't prove

A replay proves the moves are legal. It says nothing about who made them, or how fast. The sim runs headless in Node, the code is MIT-licensed and the seed is a hash of the date, so someone patient could search for a long Daily run offline and submit it.

An automated security review of the Worker suggested a fix: hand out a nonce when a game starts, and on submit check that the wall-clock time since then is at least as long as the game. Coil doesn't do it. A program can wait in real time too, so the check would make cheating slower without stopping it. For a personal leaderboard, legal and scored by the server is where the line sits.

## Changing the rules under links already shared

"Same seed, same moves, same game" holds only while the rules hold still, and Coil's changed on its first day. The Gates commit rebuilt the board model. Revision 1 had a `wrap` flag per mode, and Daily was rocks on a board with solid edges. Revision 2 has a gate flag for every row and column and generated rooms, and Daily became one generated room a day. A Daily replay recorded under revision 1 and played under revision 2 would be a different board, ending at a different score or dying early.

The first byte of a replay used to be a format version. It became the revision of the rules the game was played under, and the constructor branches on it where the rules differ:

```ts
if (layout === 'daily') {
  if (rev === 1) this.placeRocks();
  else this.buildRoom(DAILY_LEVEL);
}
```

`placeRocks()` now carries a comment, "Kept exactly as shipped so old Daily replays still play back", and that includes the number and order of its random draws. `MODES` became append-only, because a mode is stored as its index.

That branch only covers Daily, though. Classic, Blitz and Zen take no branch at all, and their old replays still play back only because swapping `wrap: true` for gate arrays filled with ones changed no outcome. Nothing in the `rev` check proves that. A test does. Before the refactor went in, one autopilot game was played in each of the four modes there were, and `src/fixtures-v1.json` keeps each replay with its score and end tick. The test plays them under the current code and checks both numbers. If a later change moves any of them, the test fails instead of a link somebody shared.

The leaderboard accepts only the current revision, because today's board is the one it scores against. The Daily ghost (your best run of the day, drawn as a faint second snake) drops a saved run from older rules for the same reason.

## The other copy of the code

Versioned replays turned up one more place where two copies of the code can disagree, and that's the browser's cache. Coil's service worker serves the cached page at once and refreshes it in the background. While Gates was being tested, a revision 2 link opened in a browser that still had the revision 1 app. The old decoder knew only version 1, so it threw, and the old app showed "This replay link is damaged or incomplete" and cleared the link.

Now the service worker compares the fresh page's ETag (or Last-Modified, or length) with the cached one and tells open tabs when they differ. The app reloads onto the new version only when that interrupts nothing: on the menu, or when a link is waiting for a version that can read it. The new decoder also says why it refused, "replay is from a newer version of Coil", so the app keeps the link and asks the service worker for an update instead of throwing it away. A browser holding the very first service worker still gets one load of the old app, because that code has nothing listening.

Coil is at [coil.ashwinsathian.com](https://coil.ashwinsathian.com). Everything above lives in `src/sim.ts`, `src/replay.ts` and `worker/index.ts`, 587 lines between the three.
