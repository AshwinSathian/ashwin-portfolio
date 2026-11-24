---
title: "The puck belongs to whoever's half it's in"
date: "2026-11-24"
description: "Glide's online air hockey has no server simulation and no rollback: whoever's half the puck is in runs it, and a Durable Object only relays. What that rule buys, where it stops being true, and what a handover costs once the latency climbs."
seoDescription: "Puck-ownership netcode for browser air hockey: a relay-only Durable Object, handover at the centre line, and what latency does to it."
tags: ["typescript", "gamedev", "cloudflare", "networking"]
---

Every online game has to settle one question early: when two machines disagree about what happened, whose version wins? There are well-worn answers. A server can run the game and the clients defer to it. The clients can run in lockstep, waiting on each other's inputs, or run ahead and roll back when late inputs arrive. Or authority can move between the players, so each object belongs to whoever is closest to it, and that machine's word is final.

[Glide](https://glide.ashwinsathian.com) is air hockey in the browser, and it takes the last route, with the table itself deciding who has authority. Each player's mallet stays in their own half. So if the puck's in my half, only my mallet can hit it, and my browser can run the puck and be right by definition. The other screen watches. When the puck crosses the centre line, it changes hands and the authority goes with it. The code's on [GitHub](https://github.com/AshwinSathian/glide). The rule turns out to be only nearly true, and the places where it isn't are where latency and reconnects start to bite.

## A room that keeps the score and nothing else

The server side is one Cloudflare Worker with a Durable Object per room code. The comment at the top of `worker/room.ts` sets out the design:

```ts
// The room doesn't run the puck. Whoever's half the puck is in runs it and streams it to the other player; the room relays
// those messages and keeps the one thing both sides must agree on, the score. A goal is reported by the player it was
// scored against, because the puck was in their half and so in their simulation.
```

The messages are small. A client sends `s` about 30 times a second (its mallet, the puck if it owns it, and its round-trip time), `h` when it hands the puck over, `g` for a goal, `again` for a rematch and `echo` to measure the round trip. The room passes `s` and `h` straight to the other player and doesn't look inside them, beyond the parser's check that each position is four finite numbers, each under 50 in absolute value.

Goals are the only thing it judges:

```ts
case 'g': {
  // Only the player scored against reports it, and only the next goal in order: a repeat is ignored.
  if (!room.started || room.over || msg.c !== seat || msg.n !== room.goals + 1) return { out, changed: false };
```

The player who conceded is the one whose half the puck was in - the owner, whose simulation is the one that saw it go in. The Durable Object writes to storage only when someone sits down, scores or asks for a rematch. A day after the last write, an alarm deletes the room if nobody's connected.

## Handing the puck over

On the client, `owner` says who runs the puck, and it's `-1` while the puck's in transit. Every frame, `netFrame()` in `src/main.ts` checks whether the owner's puck has left their half:

```ts
const p = world.puck, theirs = me === 0 ? p.z < -0.004 : p.z > 0.004;
if (theirs) {
  net.send({ t: 'h', p: [p.x, p.z, p.vx, p.vz] });
  owner = -1;
  return;
}
```

The threshold is 4 mm past the line. But the check runs once a frame, and the physics runs at 480 Hz inside that frame - so at 60 fps a fast puck's already some way past the line by the time it's handed over. In the two-client harness described below, at shots of 7 to 9 m/s, the median handover came 9.3 cm past the line and the largest 13.2 cm. For that overshoot the owner is still running the puck, with both mallets live and the receiver's placed from its last report.

The frame loop also stops one case from ever arising. A frame's delta is capped at 0.05 s and the puck's speed at 9 m/s, so one frame carries the puck at most 0.45 m. The far goal's a metre from the centre line. So the owner can't hit a shot that crosses the line and scores at the other end before the next `netFrame()` gives it away.

The receiver gets the `h` some tens of milliseconds later. By then the puck's moved on, so it runs the handed-over state forward by its estimate of the one-way delay before taking control:

```ts
} else if (m.t === 'h') {
  if (phase !== 'play') return;
  const p: Puck = { x: m.p[0], z: m.p[1], vx: m.p[2], vz: m.p[3], spin: world.puck.spin };
  coast(p, latency);
  Object.assign(world.puck, p);
  owner = me;
```

`latency` is half the sum of both players' round trips to the room, smoothed, and capped at a quarter of a second. Nothing gets rolled back. Nobody reverses a decision the other side made. The old owner's sim was right while the puck was in its half, and from here on the new owner's is.

## What `coast` leaves out

`coast` is the free-puck function from `src/sim.ts`, and its comment says what it's for: "Where a free puck goes: walls only, no mallets... Used by the bot to predict and by the online code to fast-forward." It builds a throwaway world with the mallets parked at (9, 9) and (-9, -9), off the table, and switched off.

For the bot that's fine. For the handover, it means the receiver's own mallet doesn't exist for the `latency` seconds that `coast` covers. Picture the receiver standing right in the puck's path. On their screen, before the `h` arrives, the puck's a forecast and their mallet is live in it, so they see the puck hit their mallet. Then the `h` lands. `coast` replays that stretch of time without their mallet, and `Object.assign` writes the result over the save they just made. The puck's suddenly further down the table, past them.

At 50 ms one-way and 7.5 m/s, that's 37 cm of travel with no defender in the way - a bit over a third of the receiver's half.

To see what this does to a game, we copied the online path of `main.ts` (`onNet`, `netFrame` and the online branch of `simulate`) into a Node script. It runs two Shark-level bots as the players, with a fixed one-way delay between them. It's a reimplementation with bots, not the shipped client with people. The bots react to their own screen's forecast, as a person would, but they don't learn to play around the lag. So read the numbers as a direction, not a measurement of the live game:

| One-way delay | Seconds of live play per goal | Handovers that erased a local hit |
|---|---|---|
| 1 ms | 4.12 | 3.3% |
| 20 ms | 3.12 | 7.2% |
| 50 ms | 2.37 | 7.1% |
| 100 ms | 1.19 | 21% |

The 1 ms row isn't zero. At that delay `coast` hardly runs at all, so its 29 erased hits out of 882 handovers come from the rest of the design: the frame-long overshoot and the strip at the centre line (more on that below).

At 100 ms the trace is nearly monotonous. The serving bot hits the puck at 7.5 to 9 m/s, the puck crosses, the `h` arrives, `coast` runs it 75 to 90 cm past a defender who isn't there, and the goal follows about 15 to 35 ms after the handover (17 ms at the tenth percentile, 33 ms at the median and the ninetieth). Defence still exists at that latency - just not in the first tenth of a second after a crossing, which is when a fast shot is in the receiver's half.

The obvious change would be to fast-forward with the receiver's mallet switched on, stepping the real world instead of coasting a copy. It hasn't been tried, so there's no number for it. It also wouldn't bring back the motion the receiver's mallet made before the `h` arrived. It'd only stop the puck passing through where the mallet is now.

## The strip where both mallets reach

The premise was that only the owner's mallet can touch the puck. Near the line, the sim's own constants say otherwise. In `src/sim.ts`:

```ts
export const PR = 0.04, MR = 0.062;     // puck and mallet radii, a little over real size so they read on a phone
...
export const LINE = 0.006;              // how far past the centre line a mallet's edge may reach
```

A mallet's centre can come within 5.6 cm of the line (its radius less those 6 mm). It touches the puck when their centres are 10.2 cm apart. So it can reach a puck whose centre is up to 4.6 cm into the other half, and that leaves a strip 9.2 cm wide across the middle of the table where either mallet can make contact, whoever owns the puck.

The code allows for it. On the owner's screen both mallets take part in the physics. The other player's mallet is placed where its last report says it should be by now: dead-reckoned for at most 0.15 s, and allowed 1.5 times the normal mallet speed to catch up. On the other screen only your own mallet takes part, so you see your own hit at once. When the two versions differ, the owner's wins and your screen gets corrected.

How often? Rarely, in bots. In an offline run, one shared world with bots playing ten minutes per pairing, contacts that the non-owner's mallet would have made were 0.1% to 0.4% of all mallet contacts. Bots don't fight for the puck on the line the way people do, though, so that's likely low.

## Corrections arrive 30 times a second

The watching screen isn't frozen between messages. It runs the puck itself, so the motion stays smooth, and each `s` from the owner pulls it back into line:

```ts
// Small differences are eased away; a big one (a hit we hadn't seen yet) snaps.
const k = err > 0.12 ? 1 : 0.35;
w.x += (p.x - w.x) * k; w.z += (p.z - w.z) * k; w.vx = p.vx; w.vz = p.vz;
```

The comment names the common case. Your screen doesn't know the owner hit the puck until the next report arrives - up to 33 ms of sending interval, plus the delay - and a hit takes the puck more than 12 cm off its old path almost at once. In the harness, 16% to 19% of the owner's puck updates were snaps at delays of 50 ms and under, and 9% at 100 ms. So there's no rollback, but the watching screen gets corrected a lot, and every correction is a jump.

## The goal that wasn't

The commit `b97767a` is mostly about fonts and contrast - it also changed what the non-owner does when its forecast puck crosses a goal line. Before, both screens did this:

```ts
if (owner === me) { net!.send({ t: 'g', c, n: goalsSeen + 1 }); }
world.puck.vx = world.puck.vz = 0;
phase = 'goal'; phaseT = -9; // waits for the room to confirm
```

The `if` covered only the send. The non-owner froze the puck and waited for a confirmation that might not come, because on its screen the puck was a forecast and the owner may well have saved it. While it waited, the `s` handler stopped applying the owner's puck, since it only does that in the play phase. After the change, only the owner stops:

```ts
// Only the puck's owner can say it went in. On the other screen the puck is a forecast, and the owner may have saved it.
if (owner === me) {
  net!.send({ t: 'g', c, n: goalsSeen + 1 });
  world.puck.vx = world.puck.vz = 0;
  phase = 'goal'; phaseT = -9; // waits for the room to confirm
}
```

That `phaseT = -9` is a timeout. The goal phase ends when `phaseT` passes 1.6 s, so if the room's `score` never arrives, the owner gives up after 10.6 s. It isn't clean, though. `afterGoal()` may play a replay first. Then `serve()` places the puck and sets `owner = lastConceded` - but only on the owner's screen, and `lastConceded` still names whoever conceded the previous goal. The other screen never left play. If `lastConceded` is the other seat, each side now thinks the other has the puck, and nobody runs it.

## Reconnects and the goal counter

`Net` in `src/online.ts` keeps a seat token in `sessionStorage`, so a reload gets the same seat back. After a dropped socket it retries at 600 ms and again at 1.2 s. If both fail, it stops and shows "That room has closed. Make a new link from the menu." The backoff formula would go up to 8 s, if it ever got that far - it doesn't. After that, only the browser's `online` event or the tab becoming visible again triggers another try.

When a player does come back mid-game, the room sends `start` to both, with the current score and the serve in the returning player's half. Each client runs `startMatch()` and then `serve()`, so `owner` is reset on both sides. That also clears up an `h` lost in the drop.

It also breaks the score. `startMatch()` sets `goalsSeen = 0`, and the next goal is reported as `n: goalsSeen + 1`, so `n: 1`. The room's count isn't reset, and it wants `room.goals + 1`. Driving `worker/room.ts` directly - two goals, a reconnect, then a report with `n: 1` - the room returns `changed: false` and `room.goals` stays at 2. Once a goal has been scored, a reconnect means no later goal counts: each one sends the owner into the 10.6 s timeout above, and the score stays where it was. The client never sends a `g` again, so the counter doesn't protect against a resend either, because there are no resends. For goals to count after a reconnect, the client's count has to survive the reconnect too. It doesn't.

## What it trusts

The room trusts both clients completely. A player who never reports a goal against themselves never concedes one, and nothing checks that the puck states in `s` and `h` follow from any physics. Room codes are 8 characters from a 28-letter alphabet with no vowels, so no words, about 380 billion of them. Room lookups and creation are rate limited per IP. A stranger guessing their way into your room isn't practical. The only person who could cheat you is the one you sent the link to.

How close do two real players on the same continent come to the 20 ms row? And do people defend through the handover window any better than bots do?
