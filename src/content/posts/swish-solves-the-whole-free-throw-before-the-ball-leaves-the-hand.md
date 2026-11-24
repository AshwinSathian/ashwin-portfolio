---
title: "Swish solves the whole free throw before the ball leaves the hand"
date: "2026-11-24"
description: "A ball under gravity follows a curve you can write down, so a basketball game doesn't have to step it frame by frame. Swish finds each contact as the first root of a small polynomial and solves the whole shot at release. This post covers the root finder, the rules that keep a ball from sinking into the rim, the shot that would never end, and what a game can do once it knows the result early."
seoDescription: "An event-driven ball solver in TypeScript: contact times as polynomial roots, rules against sinking and wedging, and a camera that knows the result."
tags: ["typescript", "gamedev", "physics", "algorithms"]
---

Most game physics moves things in small steps. Every tick you add velocity to position, check for overlaps, push things apart and go again. It works for almost anything. But its failures are well known too - a fast object can pass through a thin one between two steps, and the answer depends a little on the step size.

A basketball in flight is about the easiest case there is for doing without steps. Between contacts it's under gravity alone, so its path is a parabola you can write down. [Swish](https://swish.ashwinsathian.com), a free throw game for the browser, takes that literally. The solver in `src/physics.ts` doesn't have a timestep at all - it works out when the ball next touches something, jumps straight to that moment, applies the bounce and repeats. The whole shot is solved in one call at the moment you let go, every rim rattle and floor bounce included.

The arithmetic is short. Most of the code that matters is a handful of rules that stop an exact solver tripping over its own rounding, and the rest is what the game does once it knows the outcome before the ball has moved.

## Why steps would be a bad fit here

Some numbers from the code first. Release speeds run from `SPEED_MIN = 4` to `SPEED_MAX = 13` metres a second. The ball's radius is 0.12 m, and the rim, seen side-on, is a tube of radius 0.01 m. At 60 Hz a ball moves between 6.7 and 21.7 cm per frame. That's more than the ball's own radius at the top end, and more than six times the rim tube's radius even at the bottom.

A stepped solver would need substeps near the hoop, a swept test, or both - and even then the result would depend on frame timing. And small differences matter here. On the record screen's own grid of shots (more on that below), nudging the launch by 1 mm/s flips made to missed, or back, on 113 of the 6,016 shots that touch the rim - 1.88%.

The flight is also short. Across those 24,000 shots, a flight has 9.4 segments on average, 13 at the 99th percentile and 61 at the most.

## Contacts are roots

A segment is one parabola: a start time, position, velocity and spin. Say we have gravity and a constant wind `ax`: the centre `t` seconds in is at `x + vx t + ax t^2/2`, `y + vy t - g t^2/2`. Every surface becomes a function of `t` that's positive while the ball is clear and crosses zero at contact.

For a flat surface (the floor, the walls, the faces of the backboard) that's a quadratic in `t`. For a point it's a quartic: the distance squared from the moving centre to the point, minus the contact radius squared. Swish is side-on, so the ring's just two points, one each side of the hoop, each with contact radius `BALL_R + RIM.tube`. The backboard is a rectangle whose four corners are points too. One pass of the loop asks for the floor, the walls, the four board faces, six rim and corner points and two ring-plane crossings, and takes the earliest.

The root finder's small and recursive. To find a polynomial's real roots in an interval, it first finds its derivative's roots there, and those split the interval into monotonic pieces with at most one root each. So a quartic recurses through a cubic and a quadratic down to a linear equation, which it solves directly. Inside each piece where the sign changes it runs Newton's method, falling back to bisection when a step leaves the bracket, and on every fourth iteration regardless.

There's an asymmetry in it, and it's deliberate. `bisect` always returns the end of the bracket on the starting side of the root, so contact times land slightly before the surface, never past it. The comment on `firstEntry` says why:

```ts
/** First time in [0, h] that f goes from positive to non-positive, or -1. Contacts are returned from the positive side, so a ball never starts a segment inside a surface. */
export function firstEntry(c: ArrayLike<number>, d: number, h: number, tolerance = 1e-6): number {
  const f0 = c[0];
  // Only a start within rounding of the surface counts as touching it. Further inside, wait for the next entry.
  if (f0 <= 0 && f0 > -tolerance && (c[1] < 0 || (c[1] === 0 && c[2] < 0))) return 0;
```

That first check is the other half - the one for starts. A segment that starts on a surface and heads into it counts as an immediate contact, but only within `1e-6` of the surface. Further inside, it's something to wait out.

The floor is searched first, with a 12-second horizon, and its time then bounds every other search in that pass.

## Rules against rounding

An exact solver still runs on doubles. Two places in it needed a rule to stop a correct answer turning into an endless one.

The first is the ring plane. A basket counts when the ball's centre passes down through `y = RIM.y` between the two rim points. After that crossing the solver nudges the ball `1e-9` past the plane and searches again - and with the normal tolerance, that search could find the same crossing again at `t = 0`. So the ring-plane search is strict:

```ts
// A strict crossing has no rounding allowance, so a ball just past the plane does not cross it again.
return firstEntry(q, 2, h, strict ? 0 : 1e-6);
```

There's an upward crossing as well, which sets a `below` flag. A ball that pops up through the ring from underneath and drops back isn't a make. `made` is only set when `!below`.

The second is resting contact. A ball rolling on the floor, or sitting in the crook between ring and board, is touching all the time, and a contact solver sees that as an infinite run of zero-length bounces. Swish doesn't model rolling, and it doesn't need to. After every bounce it makes sure the ball leaves the surface at a minimum speed:

```ts
// Keep a small separating speed, so a ball rolling on a surface is a run of tiny hops and never sinks in.
const out = s.vx * nx + s.vy * ny;
if (out < 0.03) { s.vx += (0.03 - out) * nx; s.vy += (0.03 - out) * ny; }
```

Three centimetres a second is too small to see, but it means the next contact is a real root some way into the future and not another zero-length bounce. The bounce itself is restitution plus Coulomb friction per surface (`floor: [0.8, 0.5]`, `rim: [0.58, 0.25]` and so on), with the ball treated as a hollow sphere.

## The shot that never ends

Those rules make every hop finite. But they don't make the number of hops finite. A ball can settle between the ring and the backboard and hop there in tiny steps forever. The game's own design notes list it as a risk: "Ball wedges between ring and board, solver never ends".

The fix is what you'd do on a real court - knock it out. The solver counts rim and board contacts, and every 24 of them it checks how far the ball has moved:

```ts
if (contacts >= 24) {
  const mx = s.x - settleX, my = s.y - settleY;
  if (mx * mx + my * my < 0.0009 && !kicked) {
    kicked = true;
    s.vx = -1.5; s.vy = 1.4; s.spin = 0;
    if (record) segs.push({ ...s, hit: 'kick', force: 0 });
  }
  contacts = 0; settleX = s.x; settleY = s.y;
}
```

Less than 3 cm in 24 contacts means stuck. There's a wrinkle in the first window, though - `settleX` and `settleY` start at the release point, so the first check always sees a ball that's travelled four metres and lets it go. In practice the earliest kick comes after 48 rim and board contacts.

Then the ball is kicked loose, the outcome becomes `'stuck'`, and the rules give the shot back. `score()` returns without using up an attempt, and the game calls "Stuck on the rim" with "Have that one back" under it. Behind all that sit two stop checks after each event, at 220 events or once the flight passes 11 seconds, so a solve has an upper bound whatever the inputs.

It's rare. On the record screen's grid, 17 of 24,000 shots get stuck, and every one is kicked after exactly 48 rim and board contacts. What the player sees is a rattle: the kick comes roughly one to two seconds of game time after the ball's first contact. None of the 24,000 reaches the 220-event cap.

## Checking it against brute force

How do we test a solver like this? Against the obvious alternative, run so finely that it can't be wrong in the same way. One test in `src/sim.test.ts` takes six shots aimed across the rim and the board, with a wind of 0.6. It flies each one with a velocity Verlet integrator at `dt = 1e-6`, a million steps a second, until it overlaps the rim, the board or the floor. The solver's first contact has to agree within 3e-5 seconds.

The gap in cost is wide - somewhere between 300 and 2,000 times, from the ranges below. Measured in Node 24 on an M-series Mac, on a centred 52-degree swish, the integrator takes 947,985 steps just to reach the ring (8 to 27 ms across runs) and gets there at 0.947985 s, the time the solver gives. The solver's whole flight, seven floor bounces included, took 14 to 28 microseconds a call. All 24,000 record-screen shots took 0.4 to 1 second, i.e. roughly 17 to 42 microseconds a shot. Those timings moved a lot with whatever else the machine was doing, so treat them as rough.

That test stops at the first contact, though. Everything after the first bounce isn't compared with anything - and that's where restitution, friction, the separating speed and the kick live. Two other tests come at it sideways. One samples a sweep of flights every 2 ms and checks the ball never overlaps the ring by more than 2 mm. The other checks that across a grid of shots every flight ends, in under 240 segments and under 13 seconds, and that every make is above and inside the ring just before `tMake`. They show the bounces are sane, which isn't the same as showing they're right.

## What knowing early buys

Because the flight exists in full at release, the rest of the game reads from it. Rendering is a lookup. `poseAt` binary-searches the segments for time `t` and evaluates the parabola, so frame rate can't change where the ball goes. Sounds and sparks fire as the frame clock passes each segment's start, and a make is scored the moment the ball goes through the ring, not when it stops bouncing.

The camera director uses it too. When a shot is fired, `main.ts` marks it as dramatic if the solved flight touches the rim. The tenth shot of a round always gets it as well, since its check is `tFirst > 0` and every flight hits something, if only the floor:

```ts
for (const fl of flying) {
  if (!fl.drama || fl.ghost || fl.settled) continue;
  const contact = fl.f.tFirst;
  if (fl.t > contact - 0.17 && fl.t < fl.f.tDone + 0.04) want = 0.42;
}
```

From 0.17 seconds before first contact until just after the result, time eases down to 0.42 of normal speed and the camera pushes in. The game isn't guessing that this one's close. It knows the ball will touch the rim, and it doesn't let on whether it drops. Shot Clock turns it off. With reduced motion set, the slowdown stops at 0.7 and the camera stays put.

The dotted aiming arc uses the same solver, run again on every frame while you're pulling back. So the dots are exact, which is a design problem of its own - a guide showing the whole true path turns the game into lining up dots. The arc is cut by time:

```ts
const end = Math.max(0.1, (f.tFirst > 0 ? f.tFirst : 1) * save.guide);
```

The setting is a fraction of the time to first contact. "Whole" is 1, "Short" is 0.3, and the default, "Most", is 0.58. With the default you see a bit over half the flight to the first thing it hits, enough to read the shape of the arc but not where it lands.

The record screen, the Chart, does the same at scale: a 200 by 120 grid of angles (30 to 80 degrees) and speeds (6 to 10 m/s) from the free throw line, solved in 7 ms slices per frame. On top go your last 240 shots from the line with no wind. 2,975 of the 24,000 go in, 482 of them clean. (Shots are whole millimetres a second, which is also what lets a challenge link replay them elsewhere.)

## What it leaves out

The solver is two-dimensional. A shot is `x`, `y`, two velocities and a wind, with no depth anywhere in the physics. The court is drawn in 3D, but a shot can't drift left or right of the ring.

There's no air drag and no Magnus lift - the design notes list both as non-goals, and that's what keeps each segment an exact parabola. The ball carries backspin (2.4 times the release speed), but spin only matters at a bounce - it's friction's business, nothing else's.

The net's scripted. When a ball goes through, the solver multiplies its velocity by fixed factors (`s.vx *= 0.22; s.vy *= 0.62`) and that's all the net does to it. The net you see is a Verlet mesh of 72 nodes in `src/net.ts`, stepped at 120 Hz and pushed by the ball's solved position. And nothing flows back from it. It's the one part of the game with a fixed timestep, and it can't change a result.

The tolerances are judgement calls: `1e-6` for touching, `1e-9` past the ring plane, 3 cm/s of separation, 3 cm over 24 contacts for stuck. Only the sweeps test them. Nothing yet measures how close any of them sits to the point where a ball sinks in, or gets kicked when it shouldn't.
