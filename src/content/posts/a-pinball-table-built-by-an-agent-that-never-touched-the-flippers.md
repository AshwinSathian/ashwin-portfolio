---
title: "A pinball table built by an agent that never touched the flippers"
date: "2026-11-20"
description: "Lightkeeper is a browser pinball table that Claude Code built from one prompt. Why its physics carries its own sine function, how a table gets tuned by scripts nobody plays, and what the checks caught."
seoDescription: "Lightkeeper is a browser pinball table Claude Code built from one prompt: deterministic physics, a table tuned by scripts, and what the checks caught."
tags: ["typescript", "webgl", "gamedev", "claude", "buildinpublic"]
---

Lightkeeper is a pinball table for the browser: a lighthouse on a night sea, with a ramp, an orbit, three pop bumpers, a bank of drop targets and three-ball multiball. It came out of one prompt to Claude Code. The prompt asked for the research, the plan, the design, the build, the checks and the deploy, and it asked not to be consulted along the way. The folder was created at 01:33 and the first deploy went out about forty minutes later.

What makes it worth writing about is that nothing in that loop could hold a flipper button. A pinball table is mostly feel - how a ball comes off the rubber, how wide a ramp is when you're aiming at it - and the thing building this one had no hands. So it had to find other ways to know whether the table worked, and those are what this post is about.

It's live at [lightkeeper.ashwinsathian.com](https://lightkeeper.ashwinsathian.com), and the code is at [github.com/AshwinSathian/lightkeeper](https://github.com/AshwinSathian/lightkeeper).

## Why the physics brings its own sine

The plan settled one thing before any code: the simulation would be deterministic. Same seed, same inputs, same game, on any device. That buys three features at once. A replay is just the seed and the list of inputs. A replay can be a link. And every test can rerun a game and expect the identical score.

JavaScript gets you most of the way there. Addition, subtraction, multiplication and division are IEEE 754 operations, so they round the same way everywhere. `Math.sqrt` is pinned too: the ECMAScript spec says it returns the Number closest to the true square root. `Math.sin` isn't. The spec's whole instruction for it is to "return an implementation-approximated Number value representing the sine", which leaves the last bits to each engine. A flipper that rotates through `Math.sin` on a phone and through a different `Math.sin` in a desktop browser will, sooner or later, put a ball a hair to the left, and from there the two games split.

So `src/math.ts` has its own sine, a Taylor series run out to the fifteenth power, after folding the angle into the half turn around zero where the series behaves. It stays within a billionth of `Math.sin`, and a test holds it there. Randomness is a seeded 32-bit generator. The physics steps a fixed 1/480 of a second, with no clock anywhere in it.

The replays are small. A replay is varint-packed input ticks in a URL fragment, and three test games of one to two minutes came out at 190, 376 and 464 characters. You can paste a whole game into a chat message.

Input timing gets the same care. Input events arrive with a timestamp, and each frame applies them at the tick they actually happened on, not at the start of the next frame. At 480 ticks a second that puts a flip within about 2 milliseconds of the press, where a frame-rounded input could be 16 off - and on a table where the ramp shot is a window of a few milliseconds, that's the difference between the ramp and the post beside it.

## Tuning a table nobody could play

With no hands, the agent wrote scripts that played the table instead, and kept rewriting the table when the scripts said something was off.

The first script plunged at strengths from 20% to 100% and logged every switch the ball touched. Every strong plunge went the same way: up the shooter lane, round the top arch, down the left orbit and straight into the left outlane. The kickback saved it each time, but without the kickback a full plunge would have been a drain. Real tables send that ball to an inlane, so a small slanted rubber went in under the orbit to turn it. The same run showed the skill shot - plunge so the ball drops through the lit top lane - only happened between 66% and 68% power. With the plunger reaching full pull in 0.85 seconds, that's a hold window of about 17 milliseconds. The plunger's range got narrowed so the lanes take up more of it.

The same sweep turned up a plain bug. Its log counted an orbit shot whenever the ball came down the orbit as well as up it. One sign in the sensor code was backwards.

The second script cradled a ball on a flipper, let it roll off and flipped after each of 44 delays. Nearly every early flip sent the ball into a slingshot. The friction model was the cause. It treated the ball as a block sliding on the rubber, so friction held it to the flipper and the flipper carried it to the end of its stroke before letting go. A real ball rolls along the flipper as it swings. Dropping the flipper's friction from 0.18 to 0.02 let it do that. After the change a third script measured launch angles: a ball hit mid-flipper goes almost straight up, 4 to 5 degrees off vertical, and one near the tip crosses the table at 15 to 39 degrees. That matches how real flippers behave, where a later flip sends the ball cross-court.

Those angles also showed how hard the ramp was. To enter the ramp, the ball's centre had to cross its mouth inside an 18-unit gap, which worked out to launch angles between 27 and 29 degrees and a timing window of about six milliseconds. A fourth script dropped balls from a grid of positions and speeds and tallied the first thing each one hit after a flip. The right flipper made the ramp 42 times and the left made it 10, against almost a thousand hits on the drop targets in the middle. So the mouth became a funnel, 64 units wide at the bottom. It's still a hard shot, closer to a real table than to a toy - but that's a judgement from a script and not from anyone's thumb.

## The ball reflects the table

There are no image files. The playfield, the plastics above the ball and a sheet of sprites are painted with Canvas 2D when the page loads, at the screen's own resolution, and WebGL 2 puts them together each frame.

The pass I'd point at is the ball. It's drawn as a chrome sphere whose edge samples the lit playfield around it, taken from the frame being drawn, so when a lamp next to the ball comes on, its reflection comes on too. The lamps themselves fade like incandescent bulbs, quicker to light than to die out. The ramp is a second collision layer. Crossing its mouth going up moves the ball to a layer where only the ramp's walls exist, and it drops back at the exit or if it rolls back down. The score sits on a 128 by 32 amber dot-matrix display drawn by a fragment shader, with a hand-set 5 by 7 pixel font for the small text.

The build inlines all of it, scripts, styles and markup, into one HTML file of 35 KB gzipped. The only other request is a 20 KB cut of the Big Shoulders Display font. Every sound is made with Web Audio, down to three bells for the score chimes.

## What the checks caught

The fuzz test ran 12 games of 90 seconds with random flips and checked that no ball left the table and none went over the speed limit. It failed on the first run: the speed cap was applied before collisions, and a pop bumper's kick could push a ball past it afterwards. The cap now runs after them too.

The first screenshot run threw `RangeError: offset is out of bounds` on every frame. A full-screen quad was being packed into a buffer sized for four vertices, when its two triangles needed six. The same run caught a texture uniform being set while a different shader program was bound.

The screenshots couldn't come from the usual browser tool, because another session had it locked, so the agent wrote its own Playwright scripts. The software renderer timed out at phone resolution, and they ended up running on the Mac's GPU. Those scripts now take screenshots at five screen sizes and play a whole game - three balls, game over, initials, replay - in a real browser. A last one measures frames at phone size with the CPU slowed four times. The 95th-percentile frame was 16.7 ms, which is 60 frames a second, but on a Mac's graphics chip and not a phone's.

A separate agent then reviewed the screenshots against Apple's interface guidelines with the [loupe skill](https://loupe.ashwinsathian.com). It found eleven problems. On a phone held sideways the Play button was cut off below the fold, the menu text was hard to read over the table art, and the pause button overlapped the score display. Ten were fixed. The eleventh, the score display showing behind the game-over sheet, was left as it is.

## Where it stands

There was one interruption, and it was mine. Halfway through I told it not to copy anything from [Coil](https://coil.ashwinsathian.com), the snake game built the same way a few hours earlier, unless it had to. So Lightkeeper has no server at all. High scores stay on the device with three-letter initials, the way a real machine keeps them.

What none of this settles is how the table feels. The flipper strength, the slope, how forgiving the ramp is: every one of them was tuned against numbers from scripts. It hasn't been played on a real phone either, so the touch flippers, the vibration on Android and the prompt to turn a phone upright have only run in a desktop browser pretending to be a phone. Haptics on iPhones were left out, since the one web workaround is reported closed in iOS 26.5.

All of the physics constants sit in one block at the top of `src/physics.ts`. Whether they're right is for someone with thumbs to say.
