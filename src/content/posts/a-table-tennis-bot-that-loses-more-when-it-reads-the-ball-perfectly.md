---
title: "A table tennis bot that loses more when it reads the ball perfectly"
date: "2026-11-24"
updatedAt: "2026-11-24"
description: "Rally's computer opponent predicts the ball exactly with the game's own physics, then misreads it, reacts late and moves under a speed limit. Take any one of those away and it should get better. Two of them do. Take away the misread and the Casual and Club bots start losing."
seoDescription: "A table tennis bot that predicts the ball exactly, then misreads, reacts late and moves slowly. Removing the misread makes two of its levels worse."
tags: ["typescript", "gamedev", "algorithms", "physics"]
---

A computer opponent in a ball game starts out knowing too much. The game's physics is right there, and the program can run it forward and know where the ball's going to the last decimal. So there's no question of whether it can play well. What it needs is a way to play badly that a person will accept, and the cheap way is a dice roll that says "miss this one". Suppose a slow ball sits up in the middle of the table and the bot swings straight through it. That's the miss a dice roll gives you, and it doesn't look like a person missing.

[Rally](https://rally.ashwinsathian.com) is table tennis in a browser tab, and its opponent is built the other way round. It predicts the ball exactly, curve included, and is then given the limits a person has: it reacts late, it misjudges the flight at first and less as the ball comes in, and its paddle can only speed up and slow down so fast. The comment at the top of `src/ai.ts` says "when it misses it is because of those limits, never a dice roll that says 'miss'".

Three limits on one perfect prediction, then. Remove any one of them and you'd expect a stronger bot. For two of the three, it is. The third, the misread, goes the wrong way at two of the three levels, and we don't know why yet.

## The prediction copies the simulation

The match physics lives in `src/sim.ts`, a fixed 240 Hz step in metres and seconds on a regulation 2.74 by 1.525 m table. The rules are two-dimensional - a ball has a position, a velocity and a `curve` (sideways acceleration from spin, which decays every tick), and where a shot lands is fixed at the moment it's hit. Height is drawn for the eye and never decides a point.

That makes a ball's future cheap to compute. `predict()` in `src/ai.ts` doesn't call the simulation's `step()`, but it repeats the same equations for the ball, tick by tick:

```ts
for (let i = 0; i < 2400; i++) {
  vx += c * TICK;
  c *= curveDecay;
  const nx = x + vx * TICK, ny = y + b.vy * TICK;
  if ((ny - yc) * b.vy >= 0) {
    const f = (yc - y) / (ny - y);
    return { x: x + (nx - x) * f, t: t + TICK * f };
  }
  x = nx; y = ny; t += TICK;
}
```

It returns where the ball will cross the bot's hitting line (`yc`) and how long that'll take. A test in `src/sim.test.ts` runs a curving ball through the real `step()` until it crosses that line, and checks the prediction to within 1e-9 m. So before any limits go on, the bot's eye is perfect - curve and all.

What `predict()` leaves out is paddles. It answers "where will this ball be" and never "will I get there". Everything else in the bot is about that second question.

## A misread drawn once, shrinking with the flight

The first limit is perception. When a new shot heads its way, the bot draws a reaction time and one number from a normal distribution, and keeps both until the ball arrives:

```ts
this.wait = L.react * (0.8 + this.rand() * 0.4);
this.z = this.gauss();
```

Each tick after the wait, its guess of where the ball will cross is the true crossing plus that number, scaled by how long the ball still has to fly:

```ts
const guess = hit.x + this.z * L.sigma * hit.t * (1 + Math.abs(b.curve) * 0.4);
```

`sigma` is metres of misread per second of flight left. Casual has 0.3, Club 0.18 and Pro 0.09, so at one standard deviation a Casual bot looking at a ball half a second away is 15 cm out, and a Pro 4.5 cm. Pro's eye is over three times sharper than Casual's. And a curving ball adds to the error.

Because `z` is drawn once per shot, the error doesn't average out over the flight. The bot commits to a wrong idea of the shot - say, that it's going a bit wider than it really is - and slides towards the right spot as `hit.t` falls to zero. A fresh draw every tick would have it jittering around the right answer instead.

The reaction time comes first. `react` is 0.34 s for Casual, 0.26 s for Club and 0.16 s for Pro, times something between 0.8 and 1.2 per shot. A Pro waits 128 to 192 ms, a Casual 272 to 408 ms. During the wait, its target is wherever its paddle is (the comment says "still reading the shot"), so it brakes to a stop from whatever it was doing.

## A body with a top speed and brakes

The third limit is the body. The paddle drives towards its target under a speed limit and an acceleration limit, and brakes so it stops on the target, give or take a few millimetres:

```ts
const want = (d: number, v: number, vmax: number) => {
  const stop = Math.sqrt(2 * L.amax * Math.abs(d)) * Math.sign(d);
  const goal = clamp(stop, -vmax, vmax);
  return v + clamp(goal - v, -L.amax * TICK, L.amax * TICK);
};
```

`sqrt(2·a·d)` is the fastest you can go and still stop within `d` at deceleration `a`. The paddle speeds up until it meets that curve or its top speed, then rides the curve down. Casual tops out at 1.8 m/s and accelerates at up to 7 m/s per second, Club at 2.4 and 12, Pro at 4.5 and 32.

In time, running that same rule from rest at 240 Hz in one dimension, the paddle first covers half a metre in about 500 ms at Casual, 380 at Club and 230 at Pro. Add the reaction time and a Casual bot needs most of a second for half a metre. A ball at the game's starting speed of 3.3 m/s takes roughly 0.9 s to reach the bot's hitting line, and at the 11 m/s cap about 0.28 s (both are approximations: distance along the table over speed). Far enough away, a ball can't be reached. No rule in the code says so - it falls out of the numbers.

## Aiming is choosing where on the paddle to hit

Where the ball goes next comes from the shot model that every player shares, you included. The contact point on the paddle picks where across the table the ball lands. With `u` running from -1 at one tip to +1 at the other:

```ts
export const landX = (u: number) => (0.65 * u + 0.35 * u * u * u) * LAND_REACH;
```

The cubic is gentle in the middle and steep at the ends - a centred hit is safe and the tips carry the risk. `LAND_REACH` puts a hit on the very tip just past the side of the table. Counting across the contact width, 7.37% of it sends the ball wide.

The bot wants a landing spot, so it has to invert the curve. A cubic does have a closed-form inverse, but this one is monotonic and its derivative never drops below 0.65 × `LAND_REACH`, which makes Newton's method from a linear first guess an easy fit:

```ts
export function aimFor(x: number) {
  let u = clamp(x / LAND_REACH, -1, 1);
  for (let i = 0; i < 6; i++) u -= (landX(u) - x) / ((0.65 + 1.05 * u * u) * LAND_REACH);
  return clamp(u, -1, 1);
}
```

Six steps is plenty. A test sweeps the table's width in centimetre steps and checks `landX(aimFor(x))` comes back within 1e-9. The bot's target is then its guess of the ball, offset by that contact point:

```ts
tx = guess - aimFor(this.aimX) * CONTACT;
```

If the paddle's there and still, the ball meets it at the planned `u`. It won't always land exactly on the planned spot even then, since `strike()` adds up to 5 cm for a paddle moving sideways and turns that sideways speed into curve. But if the guess was off, or the paddle's still a few centimetres short, the ball meets the face somewhere else and goes somewhere else - sometimes into that 7.37%. So a late bot doesn't only miss. It hits wide too, from the same model that sends your shots wide.

`aimX` itself aims away from where you're standing, as wide as the level's `margin` allows (Casual stays 0.5 m inside the side line, Pro 0.22 m), and pulls towards the middle against a fast ball:

```ts
this.aimX *= clamp((2.9 / speed - 0.25) / 0.3, 0.2, 1);
```

That factor is 1 below about 5.3 m/s and bottoms out at 0.2 above about 9.4 m/s.

## Take one limit away

To see which limit does what, we can take a bot, remove one limit, and play it against an unmodified bot of the same level, using the game's own seeded bots and `step()` loop the way `npm run bench` does. The table is 200 matches per row (seeds 1000 to 1199), measured in Node 24. "No body limit" means a top speed of 100 m/s and acceleration of 1000 m/s per second, which removes the limit for any practical purpose.

| Modified bot against stock, same level | Casual | Club | Pro |
|---|---|---|---|
| nothing changed | 41.5% | 59% | 48% |
| no misread (`sigma: 0`) | 10% | 10% | 56.5% |
| no reaction time (`react: 0`) | 100% | 100% | 100% |
| no body limit | 100% | 100% | 100% |

The first row should be 50%, and it's 41.5 to 59. That spread is mostly chance. One standard deviation at 200 matches is about 3.5 points, and swapping seats moves each number by a few points, usually within that. Two perfect-reading Clubs against each other came out at 54%.

Reaction time and the body behave as you'd guess - take either away and the bot wins every match at every level.

The misread doesn't. At Pro, a bot that reads every ball perfectly wins 56.5% against one that misjudges it - a little better than even. At Casual and Club it wins 10%. The perfect reader loses nine matches in ten to its own level with the error switched back on.

It isn't all or nothing, either. If we scale Club's `sigma` and play each version against stock Club over the same 200 seeds:

| Club `sigma` | × 0 | × 0.25 | × 0.5 | × 1 | × 2 |
|---|---|---|---|---|---|
| wins against stock Club | 10% | 14% | 28% | 59% | 24% |

More misread helps, right up to Club's own value. But doubling it hurts again.

## Not the spin, the nudge or the pace

The obvious suspect is spin. A bot that misjudged the ball is still sliding sideways when it makes contact, and `strike()` turns the paddle's sideways speed into curve with `b.curve = clamp(p.vx * 0.9, -MAX_CURVE, MAX_CURVE)`. And that does show up in play. Over 60 matches, the stock Casual bot's returns carry a mean curve of 0.461 against 0.285 for the perfect reader. At Club it's 0.375 against 0.264. At Pro there's no gap (0.400 against 0.390), and Pro is also the level where the misread doesn't help.

That's a correlation, though. It doesn't survive a test. On a scratch copy of `sim.ts` where every shot leaves with zero curve, the perfect reader still wins only 10% at Casual and 8.5% at Club. Two more suspects go the same way. With the sideways landing nudge removed as well, it's 10% and 6.5%. With the forward pace a paddle adds removed, using the unmodified spin and nudge, it's 8.5% and 10%. The width of the shots hardly moves either: the Club bots' returns land about 0.28 m from the centre line on average, with the misread or without it.

What does change is where the points go. Over 100 Casual matches, the stock bot won 663 points by its opponent failing to reach or return the ball; the perfect reader won 385. So the misjudging bot's shots are harder to get back. Why? None of spin, nudge, pace or width explains it.

## What the bots can't say about people

Between levels the bench is lopsided. Bots at different levels sit far apart in it: Club beats Casual in all 100 matches, Pro beats Club in all 100, and two Pros average 108.6 shots a rally against 6.4 for two Casuals. Losing isn't only about being late, either - between 15% and 34% of points in each pairing end on a wide ball, and the stock Pro in a 40-match run lost 82 points wide against 322 by not returning the ball.

People are a different case. You aren't held to the bot's body, for one thing. Steered by a mouse, your paddle goes wherever the pointer is, clamped to its zone. On touch it moves by however far your finger moves, also with no speed limit. Either way its velocity is smoothed over about 30 ms, "so one jittery pointer sample can't turn into a smash", as the comment in `sim.ts` puts it. The keyboard's the exception - arrow keys move the paddle at 2.8 m/s, slower than Pro's 4.5.

Which leaves the misread. It was written as a handicap. Against a bot of its own level it works as a weapon, and nothing checked so far says what kind.
