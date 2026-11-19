---
title: "A pinball replay is a promise about the last bit of every float"
date: "2026-11-20"
description: "A replay that stores only inputs has to produce the same doubles in every browser. Why Lightkeeper's physics carries its own sine, how often V8 and JavaScriptCore actually disagree on Math.sin, and the divide-by-zero that putting Math.sin back exposed."
seoDescription: "Deterministic JavaScript physics for pinball replays: what ECMAScript pins down, where V8 and JavaScriptCore disagree on Math.sin, and a NaN it hid."
tags: ["typescript", "gamedev", "javascript", "floating-point"]
---

A replay that stores only inputs is a small thing to send. [Lightkeeper](https://lightkeeper.ashwinsathian.com), a pinball table for the browser that Claude Code built for me, packs a game as its seed, its mode and every button press with the tick it landed on, base64url'd into the fragment of a link. Two bot games of 101 and 135 seconds come to 494 and 488 characters.

The cost is a promise. Whoever opens that link runs the physics from the start, in their own browser, on their own JavaScript engine, and has to get the same game. Same game means the same doubles, down to the last bit, for every step of the ball. Pinball is about the worst place to make that promise, and JavaScript keeps most of it for you. The part it doesn't keep is `Math.sin`.

## How little it takes to split a game

I wanted a number for "chaotic" before trusting the design, so for this post I ran a test against the sim. Ten games were played by the crude bot from the test suite (it flips at random when a ball is near a flipper). Each was played twice, and the second time the ball's `x` was nudged by one unit in the last place, a relative change of 2⁻⁵², five seconds in.

Four of the ten ended with a different score. Seed 6 finished on 1,116,600 untouched and 438,750 nudged, and seed 7 went the other way, 225,830 to 624,990. In those four, the nudged ball was a full ball radius (15 units) from where it should have been between 7.4 and 11.5 seconds after the nudge. In three others the positions differed in the third decimal for a while and then the games came back together. The last three showed nothing at that precision.

The bot reacts to where the ball is, the way a person would, so a ball a hair to the left gets a different flip and the difference compounds. One bit is enough. So the question is which operations are allowed to change a bit from one engine to the next.

## What ECMAScript pins down, and what it doesn't

Arithmetic is safe. The spec defines `Number::add` and `Number::multiply` as IEEE 754-2019 double arithmetic and returns 𝔽 of the exact real result, the nearest double. Division is the same, and `%` computes its remainder exactly and then rounds. `Math.sqrt` is pinned too: its last step is "Return 𝔽(the square root of ℝ(n))".

`Math.sin` ends differently: "Return an implementation-approximated Number value representing the sine of ℝ(n)." `Math.cos` and `Math.hypot` end the same way. Each engine picks its own algorithm, and the last bit belongs to it.

So `src/physics.ts` opens with "Deterministic: no clock, no Math.random, no Math.sin", and `src/math.ts` has its own:

```ts
export function sin(x: number): number {
  x = x % TAU;
  if (x > PI) x -= TAU;
  else if (x < -PI) x += TAU;
  if (x > PI / 2) x = PI - x;
  else if (x < -PI / 2) x = -PI - x;
  const x2 = x * x;
  // Taylor series to x^15; error below 1e-9 on [-pi/2, pi/2].
  return x * (1 + x2 * (-1 / 6 + x2 * (1 / 120 + /* ... */)));
}

export const cos = (x: number) => sin(x + PI / 2);
```

It folds the angle into a quarter turn either side of zero and runs a Taylor series out to x¹⁵, using nothing but the operations the spec pins. It's less accurate than `Math.sin` - the error reaches about 6 × 10⁻¹² at the ends of the range - and that doesn't matter. Accuracy wasn't what it was for. Every engine evaluates the same polynomial with the same rounded operations and gets the same answer, wrong in the same place. A test keeps it within 10⁻⁹ of `Math.sin` across −20 to 20 radians, which keeps it close but proves nothing about sameness.

The sim has only two callers. `World` turns each flipper's angle into a direction every tick, `f.dx = f.side * cos(f.a)` and `f.dy = sin(f.a)`, and `table.ts` uses `arc()` to lay out the curved walls once at load. `Math.sqrt` shows up ten times in the collision code, and that's fine. Randomness is a seeded mulberry32, and the step is a fixed 1/480 of a second.

## Do the engines actually disagree?

The spec allows a difference. That's a long way from showing one. So I logged every angle the sim handed its sine during 20 bot games of up to ten minutes each, which came to 708 distinct values: 141 from laying out the arcs at load, the rest flipper angles from play. Then I ran `Math.sin` and `Math.cos` on each of them in Node 24.19 (V8, Chrome's engine) and in the JavaScriptCore build that ships with macOS (Safari's engine).

17 of the sines and 11 of the cosines came out different, each by 1.1 × 10⁻¹⁶, one bit in the last place. That's 28 of 1,416 values, about one in fifty. Given what one bit did to the ball above, I'd expect a Chrome replay opened in Safari through `Math.sin` to split from its recording the first time a flipper passed through one of those angles.

With the sim's own sine, the same 20 games finished on identical scores, ticks and ball positions in both engines.

## The guard a NaN walks past

To run the `Math.sin` side of that comparison I swapped `Math.sin` and `Math.cos` back into a copy of `math.ts`. The copy crashed before it got to compare anything. In seed 1, on the first plunge, the ball's position became `NaN` at tick 805, and the next collision lookup threw from `moveBall`.

The cause was in the table, not the trig. `table.ts` builds walls by joining points into segments, and some point lists splice an arc in after a point that's equal to the arc's start:

```ts
export const ORBIT_WALL: P[] = [[82, 652], [82, 300], ...arc(300, 300, 218, 180, 222, 10)];
```

The arc's first point is (300 + 218·cos 180°, 300 + 218·sin 180°). With `Math.cos(π)` that's exactly −1, the point is exactly (82, 300), and the wall gets a segment of length zero. The collision code divides by its squared length:

```ts
let t = ((b.x - s.ax) * s.dx + (b.y - s.ay) * s.dy) / s.len2;
t = t < 0 ? 0 : t > 1 ? 1 : t;
// ...
if (d2 >= reach * reach || d2 < 1e-12) return;
```

`0 / 0` is `NaN`. The clamp passes `NaN` through, because both comparisons are false. The distance comes out `NaN`, and the early return is skipped for the same reason, since `NaN >= x` and `NaN < x` are both false. So the `NaN` goes into `resolve()` and from there into the ball. And it doesn't need the ball to be near the wall. The segment is listed in every grid cell that overlaps a box 69 units out from it, so any ball in those cells is poisoned.

Under the sim's own cosine, cos(π) comes out as −0.999999999994. The arc starts 1.7 × 10⁻⁹ units from (82, 300), the segment has a length, and it behaves like a tiny post. The table has three of these stubs, at the top of the left orbit's inner wall (82, 300) and at both ends of the ramp's hairpin, (440, 400) and (538, 400). So the shipped game works because its sine is slightly wrong. A more accurate sine, which is what anyone tidying up `math.ts` would be aiming for, would crash every game on its first plunge. `npm test` would catch that, since the fuzz test would throw, but it would throw from deep in the ball physics, a long way from the cause.

There are two lessons in that, one specific and one general. The specific fix is to drop zero-length segments when `World` builds its colliders, or not emit duplicate points in `poly()`. The general one is about guards: one written as `if (d2 >= limit) return` lets `NaN` through, and `if (!(d2 < limit)) return` doesn't. A guard should send `NaN` down the safe branch.

The fix isn't in yet, and there's a reason to be careful with it.

## The replay doesn't know which physics it was played on

I tried the fix on a copy, filtering out every segment shorter than 0.001 units, and ran the 20 bot games again. Three of them ended differently: seed 4 went from 556,900 to 453,670. A stub at a joint is a real collider, and a ball touching that joint comes off it differently once the stub is gone.

That's a problem because Lightkeeper's replay format has nothing to say about physics. The `v: 1` at the front of a replay is the version of the codec. The tuning block at the top of `physics.ts`, the material table and the geometry in `table.ts` aren't in it anywhere. Any change to those (this fix, a flipper friction tweak, a post moved by a few units) and every shared link plays a different game. Every replay kept with a high score in `localStorage` does too, and nothing reports an error, because the bytes still decode fine.

[Coil](/writing/coils-leaderboard-never-asks-the-browser-for-a-score) ran into the same thing on its first day and made the first byte of its replays the revision of the rules, with saved replays from the old rules pinned in a test. Lightkeeper needs that before its physics changes again, and the zero-length fix is the change that will need it first.

## Inputs land on ticks, not frames

Determinism covers what the sim computes. The input side decides what it's given. Pointer and key events keep their `event.timeStamp`, and each frame the loop works out where each one falls between the last frame and this one, and applies it on that tick:

```ts
// Apply each input at the tick it happened on, inside this frame's span.
const at = q ? t0 + Math.max(0, Math.min(n, Math.floor(((q.t - prev) / span) * n))) : Infinity;
```

The log records the tick each input was applied on, so a replay feeds it back on exactly that tick. At 60 frames a second that's 8 ticks a frame, so a flip lands within about 2 ms of the press, where rounding to the frame could put it 16 ms off. The 480 Hz step also handles tunnelling without extra code. The ball's speed is capped at 4,200 units a second, which is 8.75 units a step, and a ball 15 units in radius can't skip through a wall in that.

The game is at [lightkeeper.ashwinsathian.com](https://lightkeeper.ashwinsathian.com) and the code at [github.com/AshwinSathian/lightkeeper](https://github.com/AshwinSathian/lightkeeper). The three stubs are segments 68, 99 and 116 of `SEGS`, if you want to watch one take down a ball.
