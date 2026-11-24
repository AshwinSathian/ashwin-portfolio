---
title: "Clover's grass draw pays for every cell, even the hedges"
date: "2026-11-24"
updatedAt: "2026-11-24"
description: "Clover draws its lawn as one instanced call with no instance buffer: every blade is worked out from its instance number and a 19 by 21 texture. What that layout costs, where the waste goes, and how the quality governor that guards it behaves when the frame clock lies."
seoDescription: "Instanced WebGL 2 grass from gl_InstanceID and a state texture, its fixed instance count, and the one-way quality governor it shipped with."
tags: ["webgl", "gamedev", "performance", "typescript"]
---

Grass is the stock example for instancing. One small mesh, thousands of copies, and a buffer the GPU reads once per copy for its position, its colour, maybe a scale. When a copy goes away you either rewrite the buffer or mark the slot dead and live with the hole. It's bookkeeping. And in a mowing game the grass disappears a cell at a time, so there's a lot of it.

[Clover](https://clover.ashwinsathian.com) is a top-down maze game where a robot mower cuts the lawn of a hedge maze while four geese chase it. The lawn is real geometry, about 6,000 blades at full quality, and there's no instance buffer behind it at all. Every blade works out where it is, how tall it is and whether it exists from two things - its `gl_InstanceID` and a 19 by 21 texture with one texel per maze cell. Cutting grass means changing the texture. That's a tidy property, and it comes with a bill: the number of instances never goes down, however much of the lawn is gone.

## One draw, no buffer

The grass is one line in `src/render.ts`:

```ts
gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, BLADE_VERTS, W * H * T.grass);
```

`W * H` is the maze, 19 by 21, so 399 cells. `T.grass` is blades per cell for the current quality tier, 32 at the top, and `BLADE_VERTS` is 7, one blade drawn as a seven-vertex strip that tapers to a point. The vertex array object bound for the call is empty - no attributes at all. So at the top tier we get 12,768 instances and 89,376 vertex shader invocations, and none of them read a vertex buffer.

The vertex shader in `src/shaders.ts` starts by turning the instance number back into a cell:

```glsl
int id = gl_InstanceID, cell = id / uPer, k = id - cell * uPer;
ivec2 c = ivec2(cell % 19, cell / 19);
vec4 st = texelFetch(uState, c, 0);
if (st.b < .5 || st.r < .02) { gl_Position = vec4(2., 2., 2., 1.); return; }
```

The channels, going by the comment on `setState`, are "grass height, stripe tone, open lawn, unused". Blue says whether the cell is lawn at all. Red says how tall its grass is. If the cell is a hedge, the pond, or grass that's been cut right down, every vertex of the blade is sent to the same point outside clip space, the triangles have no area and the clipper throws them away. No fragments.

Everything else about a live blade comes from hashing. When this was written the seed was its id, and four pseudo-random values came out of `float(id)`: two place the blade inside its cell, one sets its facing, and the remaining one does double duty - it sets the height and also picks the tip colour, so the taller blades are the yellower ones. Wind is a sine sway plus a slow noise gust that rolls across the garden. None of it's stored. A blade is the same blade on every frame because its seed is.

## Half the instances never draw

How much of that draw can ever do anything? Less than half. The maze is a fixed 19 by 21, but hedges take a lot of it and the pond takes the middle. If we run the generator over 10,000 seeds, a maze has between 178 and 203 cells of grass, 189.4 on average. That's 47.5% of 399.

So before the mower moves, a little over half the instances belong to hedge or pond cells that will never draw a blade. As the lawn is cut, the live share falls towards zero while the count stays at 12,768. A dead instance isn't free. It still runs the shader up to that early `return`, which means an integer divide, a texel fetch and a compare, seven times over, one per vertex.

Cheap, though - much cheaper than a live one. A cut cell returns before the hashes, the wind noise and the push loop, and it produces no fragments at all. So the frame does get lighter as the lawn goes. What doesn't change is the instance count, and every one of the 399 cells pays for its fetch and its early-out on every frame, hedges included.

The alternative is that bookkeeping from the top: compact the live blades into a buffer, or draw per-cell ranges and skip the dead ones. With 399 cells, either would cost the CPU next to nothing. Clover does neither, and the code doesn't say why. What it buys is visible enough, though - the grass has no state of its own outside one tiny texture, and the draw call never changes shape.

Live blades are another matter. Each vertex loops over six "push" sources so the grass bends out of the way of whatever drives through it:

```glsl
for (int i = 0; i < 6; i++) {
  vec4 q = uPush[i];
  if (q.w <= 0.) continue;
  vec2 d = base - q.xy; float l = length(d) + 1e-4;
  disp += d / l * smoothstep(q.z, q.z * .3, l) * q.w;
}
```

The six slots are the mower, the four geese and the ghost mower in a Daily race, filled every frame in `src/main.ts`. The fragment shader then does a four-tap shadow lookup, a cloud-shadow noise and the same lantern and headlight loop the rest of the scene uses. Grass receives the sun's shadow but isn't drawn into the shadow map, so there's no second pass over all those instances.

## One texel per cell, uploaded whole

Cutting a cell changes one texel's worth of meaning. What actually goes to the GPU is the whole texture, every frame:

```ts
for (let i = 0; i < W * H; i++) {
  const open = s.maze.cells[i] === PATH;
  height[i] = s.grass[i] ? Math.min(1, height[i] + dt * 3) : Math.max(0, height[i] - dt * 6);
  stateTex[i * 4] = open ? height[i] * 255 : 0;
  stateTex[i * 4 + 1] = s.cut[i] ? TONE[s.cut[i] - 1] : 128;
  stateTex[i * 4 + 2] = open ? 255 : 0;
  stateTex[i * 4 + 3] = 255;
}
gfx.setState(stateTex);
```

Why the whole thing? Easing. A cut cell's grass doesn't vanish - it shrinks to nothing in about a sixth of a second (`dt * 6`), and the grass on a new lawn grows in at half that rate. The red channel is animated on the CPU, and the simple answer is to rebuild all 399 texels and send 1,596 bytes in one `texSubImage2D`. At that size there isn't much to save - a dirty-rectangle upload would save at most a kilobyte and a half a frame, and you'd need a list of which cells are mid-animation to do it.

The green channel is the other half of the mowing look. `TONE` maps the direction a cell was cut in to a shade, `[255, 160, 0, 95]` for up, left, down and right, and the floor shader draws stripes from it, the way a real lawn shows them. The floor samples that texture with `texture()` and linear filtering, at `(p + .5) / vec2(19., 21.)`, which puts every cell's centre on a texel centre. So the stripe tone blends smoothly from one cell's centre to the next rather than only at the edges. The grass uses `texelFetch` and gets exactly one texel per cell, no blending.

The game's rules don't see any of this. They read `sim.grass`, a `Uint8Array` of ones and zeros, and the easing uses frame time inside `main.ts` only, so the deterministic sim never sees a height between 0 and 1.

## The governor

So the one lever left is how many blades go in each cell. It sits in a table of quality tiers in `src/render.ts`:

```ts
/** Quality steps, best first. The governor only ever moves down the list during a session. */
const TIERS = [
  { dpr: 2, samples: 4, bloom: 4, grass: 32 },
  { dpr: 1.6, samples: 4, bloom: 3, grass: 26 },
  { dpr: 1.3, samples: 2, bloom: 3, grass: 16 },
  { dpr: 1, samples: 2, bloom: 2, grass: 12 },
  { dpr: 0.8, samples: 0, bloom: 2, grass: 9 },
];
```

Each step lowers the resolution cap, the MSAA samples, the length of the bloom chain and the blades per cell, all together. On an average maze that's about 6,060, 4,924, 3,030, 2,273 and 1,705 visible blades. The bottom tier draws 3,591 instances, so the dead ones shrink with the density.

When to step was decided in `src/main.ts`:

```ts
let last = performance.now(), frames = 0, slow = 0, governWait = 120;
function govern(raw: number) {
  if (document.hidden || raw > 0.1) return;
  if (--governWait > 0) return;
  frames++; slow += raw;
  if (frames >= 45) {
    if (slow / frames > 0.0215 && gfx.stepDown()) governWait = 90;
    frames = 0; slow = 0;
  }
}
```

It skipped the first 120 frames. After that it averaged frame time over windows of 45 frames, and if a window's mean was over 21.5 ms it dropped a tier, rebuilt the framebuffers and waited 90 frames before judging again. On a 60 Hz screen a frame that misses vsync takes about 33 ms, so a window needs roughly 29% missed frames before the mean crosses the line. If we feed a copy of `govern()` synthetic cadences, it agrees: one miss in four never trips it, and three in every ten walk it down to the bottom tier.

Then there was the `raw > 0.1` check. It read as though a frame over 100 ms was thrown out, since a single hitch says nothing about steady load. The caller clamped first, though:

```ts
const dt = Math.min(0.05, (now - last) / 1000);
last = now;
time += dt;
govern(dt);
```

`dt` couldn't go past 0.05, so the check never fired. A long hitch was counted as a 50 ms frame instead of being skipped, and the arithmetic of that was less forgiving than it looks. Seven of those in one 45-frame window, with 16.7 ms frames around them, average (7 × 50 + 38 × 16.67) / 45, about 21.85 ms. Over the line. Six aren't enough - about 21.1 ms. So seven stutters inside about a second - a burst of garbage collection, a tab coming back to the front, anything - could cost a tier for the rest of the session. Fully hidden tabs were still caught by `document.hidden`, which helped.

And what was it actually timing? The gap between `requestAnimationFrame` callbacks is the display's cadence, and the GPU's cost is only one of the reasons that gap might be long. A browser that runs `requestAnimationFrame` at 30 Hz, for whatever reason, handed the governor a steady 33 ms with the GPU half idle, and nothing in `govern()` could tell that apart from a GPU that's struggling. Run the same copy of the function on a steady 30 Hz cadence and it steps down at frames 164, 298, 432 and 566, which puts it at the lowest tier about 19 seconds in.

The blind spot runs the other way too. At vsync a fast frame and a barely-fast-enough frame both read 16.7 ms, so frame time can't show headroom, and a governor can only find it by trying a better tier and watching. This one never tried - going by the comment on `TIERS`, it only ever moved down. The frame-timing script in `scripts/perf.ts` gets around the same problem by recording main-thread work per frame, which, in its comment's words, "still shows a regression when the frame rate is capped at 60". Whatever tier the game dropped to in a bad second, it stayed there.

## A tier drop reshuffled the lawn

One visible side effect of stepping down comes straight from having no buffer. A blade's id is `cell * uPer + k`, and its placement, height, facing and tint all came from hashing that id. When `uPer` goes from 32 to 26, cell 10 stops owning ids 320 to 351 and owns 260 to 285 instead. Every blade in the maze got new numbers. So every blade moved.

With an instance buffer you'd drop every fifth blade and leave the rest where they were. Here the whole lawn was regenerated at once, at the moment the game had decided it was struggling - at most four times a session, since there are five tiers. Hashing on the cell and `k` rather than the global id would have kept the first 26 blades of each cell in place.

## What's been measured

Very little on the GPU side. `scripts/perf.ts` was run against a local build for this post, in headless Chromium with ANGLE's Metal backend on an Apple M4 Pro, using a 390 by 844 phone profile at 3x pixel ratio. At 1x, 4x and 6x CPU throttling it held 60 fps with a p95 frame of 16.7 ms, and the governor stayed at tier 0. The p95 main-thread work per frame was 0.3, 0.8 and 1.4 ms. JavaScript only. The script doesn't time the GPU, and a laptop GPU behind a phone-sized viewport doesn't say much about a phone's.

The game's own notes say it hasn't been played on real phones, so GPU cost and heat there aren't known, and neither is what those 89,376 vertex invocations cost on a phone's GPU. The 30 Hz walk-down and the reshuffle on a tier drop came from reading the code, not from watching a device do either. On a real phone, which would trip the governor first - the grass, or the frame clock?

## Since this was published

A fix on 24 November replaced the governor with one in `src/govern.ts`. It takes the raw frame interval rather than the clamped one, leaves out any gap over 250 ms as a stall, and judges the median of each 60-frame window, so a few hitches no longer cost a tier. It aims for the display's own cadence, up to 60 Hz. A slow window first tries the lowest tier once - if that's no faster, the cap is the display's, the tier goes back and that cadence becomes the aim. After eight good windows it tries one tier better, and each try that turns out too slow doubles the wait before the next. Blades are now seeded with `float(cell * 64 + k)`, so a tier change thins each cell without moving the blades that stay, and the Daily now counts UTC days, so everyone gets the same maze at the same time.
