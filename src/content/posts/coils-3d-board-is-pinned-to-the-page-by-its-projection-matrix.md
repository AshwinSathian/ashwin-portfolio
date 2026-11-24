---
title: "Coil's 3D board is pinned to the page by its projection matrix"
date: "2026-11-24"
updatedAt: "2026-11-24"
description: "Coil draws a lit 3D board behind an ordinary HTML layout, and the floor has to land on the same pixels the layout reserved for it. How a fixed full-screen canvas, a placeholder element and an off-axis projection keep the two in step, and what drawing the whole screen costs."
seoDescription: "A WebGL 2 board behind an HTML layout: a fixed canvas, a placeholder rect and an off-axis projection that pins the floor to page pixels."
tags: ["typescript", "gamedev", "webgl", "performance"]
---

Put a 3D scene inside a web page and you get two choices, and neither is much fun. Keep the canvas inside its layout box and the scene stops at the box's edge, so shadows, light and reflections end in a hard rectangle. Or stretch the canvas over the whole screen with the page on top, and the layout no longer knows where anything in the scene is - every label, hit area and score popup has to be projected from 3D back into page coordinates, every frame, by hand.

[Coil](https://coil.ashwinsathian.com), my snake game, takes the second route but rigs the camera so the hard part goes away. The board is a lit 3D world seen from straight above, with shadows, reflections and bloom, drawn in raw WebGL 2 (`src/render3d.ts`, with the GLSL in `src/shaders.ts`). The canvas covers the whole screen. And yet the floor of that world sits exactly where the CSS grid put the board, while anything raised off the floor still leans with perspective. That comes down to one projection matrix, built each frame from a rect the renderer reads off the layout.

## The canvas leaves the layout, the placeholder stays

In the markup the canvas sits where you'd expect, inside a `.board-wrap` that the grid sizes with a `--b` variable. When WebGL 2 is there, `main.ts` sets `data-stage="3d"` on the root and one rule pulls the canvas out of that box:

```css
:root[data-stage='3d'] #board {
  position: fixed;
  inset: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  border-radius: 0;
  box-shadow: none;
  background: none;
}
```

The wrapper keeps its size, though. It's still a grid item with a width and height of its own, so the layout has a square hole where the board belongs. Nothing's drawn in it. The renderer reads that hole:

```ts
resize() {
  if (!this.ready) return;
  const wrap = this.canvas.parentElement!.getBoundingClientRect();
  this.cssW = innerWidth;
  this.cssH = innerHeight;
  const s = wrap.width / (W + MARGIN * 2);
  this.rect = { x: wrap.left + MARGIN * s, y: wrap.top + MARGIN * s, s };
  const dpr = Math.min(devicePixelRatio || 1, 2) * this.scale;
```

`W` is 21, the board's width in cells, and `MARGIN` is 0.78 of a cell of rim on each side. So `rect` says where cell (0, 0) starts on the page and how many CSS pixels a cell is. Everything else in the camera comes from those three numbers.

The rest of `resize()` only reallocates the drawing buffers when the canvas's pixel size actually changes. That makes it cheap enough to call often, and `main.ts` calls it from a `ResizeObserver` on the wrapper, from `resize`, and from a passive `scroll` listener in the capture phase. A scrolling panel that moves the placeholder gets the floor moved with it. But something that shifted the wrapper without a resize or a scroll wouldn't - `rect` was only re-read on those three events, and the floor would sit where the wrapper used to be until the next one.

Without WebGL 2 (or with `?flat` in the URL) none of this runs. The canvas stays in its box and `src/render.ts` draws a flat 2D board into it.

## A camera built from a bounding rect

This is the function that does it:

```ts
private matrix(now: number) {
  const { x, y, s } = this.rect, vw = this.cssW, vh = this.cssH;
  let ox = x, oy = y;
  if (now < this.shakeUntil) {
    const k = ((this.shakeUntil - now) / 340) * s * 0.22;
    ox += (Math.random() - 0.5) * k;
    oy += (Math.random() - 0.5) * k;
  }
  const D = EYE, ex = this.ex, ez = this.ez, B = (2 * s) / vw, Bz = (2 * s) / vh;
  const A = (2 * ox) / vw - 1 + B * ex;
  const C = 1 - (2 * oy) / vh - Bz * ez;
  const n = D - 5, f = D + 5, a = (f + n) / (f - n), b = (-2 * f * n) / (f - n);
  return new Float32Array([B * D, 0, 0, 0, -A, -C, -a, -1, 0, -Bz * D, 0, 0, A * D - B * ex * D, C * D + Bz * ez * D, a * D + b, D]);
}
```

The world is in cells: x across, z down the board, y up. The eye hangs `EYE` = 30 cells above the point (ex, ez). Multiply a point (x, y, z) through and the fourth row gives w = D - y. The first row gives clip x = B·D·(x - ex) + A·(D - y). Divide by w and you have

ndc x = A + B · (x - ex) · D / (D - y)

Now set y = 0. The D/(D - y) factor becomes 1 and the two `ex` terms cancel (that's why `A` has `+ B * ex` folded into it). What's left is ndc x = 2·(ox + s·x)/vw - 1, which is the page pixel `ox + s * x` written in clip space. The vertical axis works out the same way with `C` and `oy`. So every point on the floor lands on `rect.x + x * s`, `rect.y + z * s`, wherever the eye is.

Raised points don't cancel. A point at height y is pushed away from the spot under the eye by D/(D - y), which is ordinary perspective. The frustum is off-axis, though. The eye sits over the board, and the board isn't at the centre of the viewport (on the phone layout it's centred across but sits well above the middle), so the frustum is skewed to match.

The near and far planes, 25 and 35, sit only 5 cells either side of the floor. That's enough. The solid objects stand a little over a cell tall at most, sparks from a death peak at about 3.4 cells, and the mirrored copy (more on that below) goes no deeper than the walls are tall.

We can check the algebra with a script that copies `matrix()` and projects points by hand, using the board rects headless Chromium reports for a 390 by 844 phone and a 1280 by 800 desktop. Across nine eye positions, in double precision, the floor corners land on their CSS positions with errors around 1e-13 px. Done in float32, as the GPU gets it, the worst error is about 3e-5 px.

One exception is in the code above. For 340 ms after a death the shake moves `ox` and `oy`, and the floor moves with them. That's the only time it leaves its box.

## How much the perspective moves

The eye isn't fixed. Each frame it eases towards a point a little way off the centre, in the direction of the head:

```ts
const tx = W / 2 + (hx - dx[0] * (1 - alpha) - W / 2) * 0.14;
const tz = H / 2 + (hz - dx[1] * (1 - alpha) - H / 2) * 0.14;
const k = 1 - Math.exp(-dt * 2.2);
this.ex += (tx - this.ex) * k;
this.ez += (tz - this.ez) * k;
```

The `alpha` term is the fraction of a tick that's passed, so the eye follows the head as drawn between cells, not the cell it'll jump to. With 0.14 of the head's offset, the eye stays within about a cell and a half of the middle. With reduced motion on, it doesn't move at all.

So how far does anything actually lean? Not far. The tallest walls in Retro are a little over a cell high, so take a wall top at y = 1.1 on the left edge of the board and run it through the same script. With the eye centred it leans about 6 px outward on the phone layout, where a cell is 15.87 CSS px, and about 13 px on the desktop one (32.06 px a cell). Move the eye 2.8 cells, from 9.1 to 11.9, and that wall top shifts 1.7 px on the phone and 3.4 px on the desktop. The floor under it doesn't move at all.

## The page can write on the floor

Once the floor is the layout, the page can put things on it without knowing anything about 3D. When the snake eats, the renderer drops a `+10` on the board as a plain DOM element:

```ts
el.style.left = `${this.rect.x + x * this.rect.s}px`;
el.style.top = `${this.rect.y + z * this.rect.s}px`;
```

`.pop` is `position: fixed` and `rect` came from `getBoundingClientRect()`, so both are in viewport coordinates and agree. No projection, no reading back from the GPU.

It's exact only at y = 0, mind. The point it uses is the floor under the fruit, and the fruit floats half a cell or so up and bobs. At the corners of the board the label's anchor can be off from where the fruit is drawn by about 5 px on the phone and 10 px on the desktop. You don't see it - `.pop` is centred on its anchor with `translate: -50% -50%` and its animation carries it 46 px up as it fades.

Input gets the same benefit. Swipes are read on `document.body`, anywhere on the screen, so nothing has to hit-test the 3D scene. And the floor quad isn't the board; it runs from -90 to 110 cells, so the ground shader paints table (a streaked noise texture in Retro, an almost plain floor in Modern) everywhere outside the 21 by 21 grid. The menu panels are styled as things lying on that table, and the comment above their CSS says as much: "a fired enamel plaque in Retro, a pane of glass in Modern".

## Reflections as a second pass of the same geometry

A floor that's a perfect plane at y = 0 makes reflections cheap. The mirror image of the scene is the scene with y negated. The object vertex shader has a `uMirror` uniform for that (`if(uMirror>.5) w.y=-w.y;`), and the colour pass draws everything twice:

```ts
const reflective = w.reflect > 0.02 && this.scale > 0.6;
if (reflective) {
  setObj(true);
  gl.frontFace(gl.CW);
  this.drawBatches(this.obj, false);
  for (const [ox, oz] of offsets) this.drawTube(this.obj, this.tube, ox, oz);
  gl.frontFace(gl.CCW);
  gl.clear(gl.DEPTH_BUFFER_BIT);
}
```

Negating y flips the winding of every triangle. Hence the `frontFace` swap, and the lighting for the mirrored pass uses an eye at -y too. Then the depth buffer is cleared and the floor is drawn over the reflection with ordinary alpha blending. The ground shader ends with `o=vec4(c,1.-clamp(refl,0.,.95));`, so the floor covers the mirror image with weight 1 - refl and the reflection shows through with weight `refl`. In Retro that varies tile by tile, each glazed tile a little different and the grout lines at zero. Modern's night floor goes up to 0.5, which is why it reads as a black mirror.

There's no reflection texture and no extra render target. In exchange, nearly every object (all but the gate plates and the ghost) is drawn one more time per frame, and there's only one mirror, the floor. Anything that isn't a flat plane at y = 0 can't reflect this way.

## Paying for the whole screen

All of this rests on a canvas the size of the viewport, and most of the viewport isn't board. In headless Chromium, on the 390 by 844 phone at a device pixel ratio of 2, the canvas is 780 by 1688. The 21 by 21 grid covers 33.7% of its pixels, and on the 1280 by 800 desktop it's 44.3%. The rest is table, rendered with the same shadowed, multisampled, bloomed pipeline as the board.

On paper that buffer is big. Each frame renders into a 4x multisampled RGBA16F colour buffer with a 24-bit depth buffer. It resolves into a texture and runs a five-level bloom chain off that (RGBA8 if `EXT_color_buffer_float` is missing, and fewer samples if the driver caps them). Worked out from the formats at 780 by 1688, that's around 77 MB before any driver padding, plus a 1536 by 1536 shadow map. What a phone driver actually allocates hasn't been measured. While the look is switching between Retro and Modern there's a second target of the same size, freed when the switch ends.

But the renderer does watch its own frame time. If a device can't keep up it lowers the resolution in steps, down to half, and `this.scale > 0.6` in the condition above turns the reflection pass off on the third step.

The download grew too. Coil inlines its whole build into one `index.html`, and the 3D commit (39db724, "Rebuild the board as a top-down 3D world") took that file from 24.98 KB to 40.79 KB gzipped, building the commits either side. The same commit raised the size budget in `docs/PLAN.md` from 30 KB to 45 KB. `render3d.ts` and `shaders.ts` are 1,425 lines between them, with no 3D library underneath.

The only GPU behind any of these numbers is SwiftShader, Chromium's software renderer, which says little about how a phone's GPU handles 77 MB of render targets.

## Since this was published

A fix on 24 November has the renderer read the wrapper's position every frame, not only on a resize or a scroll, so a layout shift that moves the board without resizing it no longer leaves the floor behind. An 80 px change in the header's height was enough to show the old gap. The resolution governor is now a class of its own and steps both ways. Slow frames count however slow they are, clamped to 100 ms (before, a frame over 120 ms was ignored, so a GPU under about 8 fps never stepped down at all), and gaps over a second are left out as a hidden tab or a pause. After about 600 smooth frames it tries a size up, and a step up that turns slow again becomes the ceiling.
