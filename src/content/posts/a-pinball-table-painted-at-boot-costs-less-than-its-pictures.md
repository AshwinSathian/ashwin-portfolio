---
title: "A pinball table painted at boot costs less than its pictures"
date: "2026-11-24"
updatedAt: "2026-11-24"
description: "Lightkeeper ships no image files. Its playfield, plastics and sprites are painted with Canvas 2D from the same table description the physics reads, at the screen's own scale, and WebGL 2 only puts the layers together. What that costs at boot, what it saves on the wire, and where it falls short."
seoDescription: "How a browser pinball table paints its art with Canvas 2D at boot, at screen scale, and composites it in WebGL 2: measured costs, sizes and limits."
tags: ["typescript", "gamedev", "webgl", "performance"]
---

Art is usually the heaviest thing a browser game puts on the wire. The code is a few dozen kilobytes, and the playfield, the sprites and the backgrounds are a megabyte or two of PNGs, exported at whatever resolution somebody picked. A phone gets them too big, a 4K monitor gets them too small - and every time a wall moves, somebody has to open the image editor again.

[Lightkeeper](https://lightkeeper.ashwinsathian.com) is a pinball table of a lighthouse on a night sea, and it doesn't download a single image to draw the table. The build inlines everything into one HTML file of 35.43 KB gzipped. Apart from icons, a manifest and a service worker, the only other thing it needs to draw is a 20 KB subset of the display font. The sky, the sea, the lighthouse, the ramp, the flippers and all 28 lamp inserts are painted with Canvas 2D when the page boots. Then they're handed to WebGL 2 as textures. WebGL never draws a wall or a star itself - it only composites.

## One table, two readers

The whole table lives in `src/table.ts`. There are 121 segments (84 walls, 23 pieces of ramp plastic, and the rubbers, slings and drop targets), three pop bumpers, twelve sensors and 28 lamps, on a 600 by 1230 field. The physics builds its colliders from those arrays. The painter in `src/bake.ts` walks the same arrays to draw them, so the walls on screen are the walls the ball bounces off:

```ts
  for (const s of SEGS) {
    if (s.layer !== 0 || s.drop) continue;
    g.lineCap = 'round';
    if (s.mat === 'wall') {
      g.strokeStyle = '#4a5462'; g.lineWidth = s.w * 2 + 1;
```

`s.w` is the half thickness the collision code uses. So a wall is stroked at exactly the width the ball sees, plus one table unit for the dark edge, with a thinner chrome highlight on top. Lamps work the same way. Each entry in `LAMPS` has a position, a shape, a size and a colour, and the painter uses it twice. The base texture gets an unlit socket, the lamp's colour mixed 78% of the way to near-black. The atlas gets the lit version: a hot centre with a halo 3.2 times the insert's size.

So moving a bumper is one edit - the painting follows it. An image pipeline can't give you that, not without a script that renders the images from the same data... at which point you've written the painter anyway.

## Painting at the screen's scale

Since the art isn't decoded from a file, it can be painted at whatever size the screen needs. `main.ts` works out the table's height in device pixels during layout and paints at that scale:

```ts
  const k = Math.min((th * dpr) / H, 2048 / H);
  if (Math.abs(k - bakedK) / k > 0.04) { bakedK = k; renderer.setBaked(bake(k)); }
```

`k` is device pixels per table unit. The pixel ratio is capped at 2. The table's never painted taller than 2048 pixels, which happens to be the smallest maximum texture size the WebGL 2 spec lets a device report. The second line is the re-bake rule: a resize repaints only if the scale moved by more than 4%. Without it, every small change in the window's height (a mobile address bar sliding away, say) would throw the textures out and paint them again.

On a 390 by 844 phone at a pixel ratio of 3, with no safe-area insets, the layout gives the table about 756 CSS pixels of height. That puts `k` at 1.23 and the playfield texture at 738 by 1513. A 1440 by 900 desktop at a pixel ratio of 1 gets 0.69.

There are three canvases. `base` is everything under the ball, from the wood grain to the walls. `over` is what sits above a ball: the clear ramp and its rails, the sling plastics, the apron. The atlas holds 37 sprites, nine for the moving parts and glows and one per lamp, packed into rows on a 1024-pixel-wide canvas by a shelf packer of about 30 lines. The glows and the lighthouse beam are painted at 0.6 and 0.3 of the table's scale.

## What it costs

Painting all this takes time at boot. How much? We timed it in headless Chromium on an M-series Mac, calling `bake()` at the phone's scale of 1.23 over four runs:

- recording the Canvas 2D calls: 0.5 to 1 ms
- forcing them to rasterise (reading one pixel back from each canvas): 4 to 5 ms
- uploading the three canvases as textures: 0.3 to 0.4 ms

The middle step is there because Chrome records Canvas 2D calls and draws them later, so timing `bake()` on its own times only the recording. The renderer doesn't read pixels back, though. It paints and uploads straight away. Timed that way (paint, upload, wait for the GPU to finish), the whole thing took 2.2 to 2.4 ms at the phone's scale, and 2.1 to 5 ms across 0.69, 1.23 and 1.665. Call it under 10 ms. That's once per page load, and once per real resize.

With the CPU throttled four times, the paint-and-upload path took 4.6 to 8.7 ms. That figure doesn't say much about a slow phone, mind. Chrome's throttling slows the page's main thread. The raster work happens on the GPU. That isn't throttled.

Against that, we saved the same three canvases as files. They were exported with `toBlob`, so the PNGs come from Chrome's own encoder with no optimisation pass:

| at k = 1.23 | PNG | WebP, quality 0.85 |
|---|---|---|
| base | 1,028 KB | 52 KB |
| over | 91 KB | 31 KB |
| atlas | 401 KB | 65 KB |

As PNGs that's about 1.5 MB for one screen size, and the art has soft gradients everywhere, the worst case for PNG. Even as lossy WebP it's 148 KB, four times the whole gzipped page, and that's for one scale. At the desktop's 0.69 the WebP set is 73 KB and at the 2048-pixel cap it's 219 KB. What replaces all of it is `bake.ts`, 21.5 KB of source that gzips to about 6.5 KB before minification.

A few milliseconds of work, then, against 150 to 220 KB of download that would be blurry or wasteful on most screens anyway. On a slow connection that's an easy call, and at these numbers it holds on a fast one too.

## A ball that reflects this frame's lamps

`gl.ts` composites each frame in four passes. Target A, at the table's resolution, gets the base texture, the lamps and the moving parts. Target B gets a copy of A, the balls, the `over` texture and the lighthouse beam. Bloom blurs the bright parts of B at a quarter size. The last pass puts it all on screen.

Lamps never touch a canvas after boot. A lit lamp is its atlas sprite added on top of the unlit socket with additive blending, its brightness passed in the vertex colour. The game only says whether each lamp is off, on, blinking slowly or blinking fast. `main.ts` eases the brightness towards that with exponential time constants of 30 ms to light and 90 ms to go dark (about 95% of the way there after 90 and 270 ms), the way an incandescent bulb is quicker to light than to die. So a lamp's just a number between 0 and 1 a frame.

Why two targets, when one would hold the picture? The ball. It's a quad whose fragment shader treats it as a mirrored sphere, and the sphere reflects the playfield by sampling A:

```glsl
  vec3 rf = reflect(vec3(0.0, 0.0, -1.0), n);
  vec2 w = ball.xy + vec2(rf.x, -rf.y) * ball.z * (1.4 + 2.2 * (1.0 - rf.z));
  vec3 env = texture(scene, vec2(w.x / ${W.toFixed(1)}, 1.0 - w.y / ${H.toFixed(1)})).rgb;
```

`n` is the sphere's normal at this pixel, worked out from where the pixel sits in the quad. A view ray straight down bounces off it, and the shader follows the bounce sideways across the playfield - further the flatter the bounce, up to about four ball radii. A shader can't read the target it's drawing into. So the playfield and lamps go into A, and the balls are drawn into B, reading from A. That's why the chrome changes when a lamp near the ball comes on: it's sampling this frame's lamps, not a baked environment map. Towards the crown the shader fades from that sample to a "ceiling" colour, the underside of the glass, and it adds a key light and a highlight across the ball.

The limits come straight out of the passes. A ball can't reflect another ball, because no ball is in A. It can't reflect the ramp plastics either, because those go on in B. A ball on the ramp is drawn after `over`, 8% larger, so it reads as raised. It still samples the playfield under the ramp, though.

The last pass tilts the table on wide screens too, with no 3D camera. The finished frame goes onto a trapezoid whose top two vertices get a `w` of `1 / (1 - 0.11)`, so the GPU interpolates the texture as if the top edge were further away. And the 128 by 32 display? A byte a dot, turned into round amber dots by its own shader - its big text is the display face rasterised, keeping any pixel with alpha over 110.

## Where it falls short

When this was written, effects quality only ever went down - in play, `main.ts` averages frame times over 120 frames:

```ts
      if (avg > 21 && renderer.bloom) renderer.bloom = false;
      else if (avg > 24 && quality > 0.7) { quality = 0.7; doLayout(); }
```

A slow window turns bloom off, and a second slow one drops the resolution to 70%. Nothing turned them back on, so a phone that stuttered for a couple of seconds (a notification arriving, say) played the rest of the session without bloom, unless the player picked an effects setting by hand.

The font's a dependency of the painting, too. The table's lettering is drawn in Big Shoulders, so boot waits for the font, but only for 1.5 seconds. If it hasn't arrived by then, the table's painted in the fallback face, and going by the code it stayed that way until something repainted. That was a resize past the 4% rule, or the drop to 70% itself - `dpr` includes `quality`, so the drop changes `k` and every texture's painted again, smaller. This hadn't been tried on a slow connection.

And every timing above comes from a Mac running headless Chromium on its own GPU. Does a few milliseconds of painting stay a few milliseconds on a mid-range Android?

## Since this was published

A fix on 24 November dealt with both. If the display face misses the 1.5 second wait, the table is now painted again as soon as the font arrives. And effects come back: after ten smooth seconds the resolution returns first, then bloom, while a level that's had to be dropped twice stays off for the session, so a borderline phone doesn't flicker between the two.
