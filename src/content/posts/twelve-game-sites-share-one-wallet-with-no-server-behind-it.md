---
title: "Twelve game sites share one wallet with no server behind it"
date: "2026-11-24"
description: "Twelve browser games on twelve subdomains carry one player card and one token balance, kept in a single cookie that a script from the arcade writes from inside each game's origin. How the integration comes down to one return value, why the cookie is parsed as hostile input, what it costs on every request, and which limits the design accepts."
seoDescription: "One token wallet across twelve subdomains with no server: a parent-domain cookie, a fail-open event API, hostile-input parsing and cache-header deploys."
tags: ["typescript", "gamedev", "security", "cloudflare"]
---

Two subdomains are two origins, and the browser keeps them apart on purpose. `coil.example.com` can't read `glide.example.com`'s localStorage, can't open its IndexedDB, can't post into it unless both pages agree to talk. Most of the time that's exactly what you want. It gets in the way when twelve separate sites are meant to feel like one place, and you'd rather not run a server just to remember how many tokens somebody has.

The player card in [The Arcade](https://arcade.ashwinsathian.com) runs straight into it. Each of its twelve games lives on its own subdomain and is deployed on its own. The arcade gives every visitor a tag like Velvet Otter and 12 tokens. A token loads a credit of plays onto a machine, a good run pays tokens back, and the balance follows you from Coil to Pinfall to the hall and back. There are no accounts. There's no database either. The whole wallet is one cookie, and the code that reads and writes it is one script, `pass.js`, which every game loads from the arcade. The source is in [the arcade's repository](https://github.com/AshwinSathian/arcade), under `src/pass/`.

## Writing the cookie from inside each game

localStorage is per origin, so it was never going to work. But a cookie can be set on the parent domain, and then every subdomain sees it - but only code running on one of those subdomains can write it there. A script served from `arcade.ashwinsathian.com` and loaded with a plain `<script src>` into Coil's page runs in Coil's origin, with Coil's `document.cookie`. So one file, hosted once, writes the same cookie from twelve places.

```ts
const shared = location.hostname === "ashwinsathian.com" || location.hostname.endsWith(".ashwinsathian.com");
const attrs = `${shared ? "; Domain=ashwinsathian.com" : ""}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
const jar = (k: string) => document.cookie.split(/;\s*/).find((c) => c.startsWith(`${k}=`))?.slice(k.length + 1);
const setCookie = (k: string, v: string, age: number) => { try { document.cookie = `${k}=${v}${attrs}; Max-Age=${age}`; } catch { /* cookies blocked: this page still plays */ } };
```

Off the real domain (localhost, a preview URL), the card is host-only. The card is written with `Max-Age=34560000`, which is 400 days. And with cookies blocked, the card lives in a variable for the life of the page, so at least it isn't dealt afresh on every read.

The pass is built as an IIFE by `scripts/pass.ts`. It's a classic script, and it has to be. The site tests fail if `pass.js` contains an `import` or `export`, or goes over 14 KB gzipped. The current build is 33,484 bytes, 12,780 gzipped.

## The whole API is a return value

How does a game talk to a script it doesn't own and might not have? Two DOM events. The comment at the top of `src/pass/main.ts` is the entire contract:

```ts
//   if (!dispatchEvent(new CustomEvent("arcade:start", { cancelable: true, detail: { mode } }))) return;
//   dispatchEvent(new CustomEvent("arcade:end", { detail: { mode, score, won } }));   // or { mode, quit: true }
```

`dispatchEvent` returns false only when the event is cancelable and some listener called `preventDefault()`. So the start of a run is a question - may I? - and the answer comes back synchronously, as a boolean, from whoever's listening. If the pass is there and you're out of tokens, it cancels the event and opens its out-of-tokens sheet. If the pass never loaded, nobody listens, `dispatchEvent` returns true and the game plays free.

The pass does put `window.arcadePass` on the page, and the hall drives it directly. A game never has to look for it, though. It doesn't wait on a promise or check a version. It fires the event and reads the result.

The design doc names the failure it wants to avoid, as an anti-goal: "a game that stops working because the pass failed to load". `scripts/pass-check.ts` tests that in a real browser against a stand-in page, `tests/fixtures/game.html`. It blocks `pass.js` at the network level and asserts the page still starts a run with no errors.

The pass's listener also copes with a game that dispatches `start` without making it cancelable:

```ts
if (!r.ok) {
  // A start the game can't call off goes ahead unpaid; a toast says so rather than a dialog over a live game.
  if (e.cancelable) { e.preventDefault(); ui.out(); }
  else ui.toast("Out of tokens: this run is on the house", "info");
  return;
}
```

There's a quieter half to the integration, which is keys. The pass draws its chip, dialogs and toasts in a closed shadow root inside the game's page, and Enter on "Insert token" mustn't also start the game. The pass registers a capture-phase listener on `window` for key events and stops any event whose path includes its host element. A capture listener on `window` runs before anything at the target or on the way back up, so that part comes for free. The only listeners it could lose to are other capture listeners on `window`. Load order settles that. The design doc has each game put the pass's `defer` tag before its own script, so the pass gets in first.

## The cookie is input

Every machine reads a value that any page on the domain can write, and that the player can edit in devtools. So `parse()` in `src/pass/card.ts` treats it as hostile. Numbers are clamped (tokens to 0-99, plays on a machine to 0-9), the tag is cut down to `[A-Za-z0-9 '-]`, unknown machines are dropped, the receipt is cut to 12 lines, and anything malformed gives a fresh card that keeps a valid tag. Everything from the card reaches the page through `textContent`.

That list was there from the start. It still had a hole. Bests are kept under keys like `coil.classic`, and the original parser only checked that the part before the dot was a known machine. The card is serialised as base64url of its JSON, and `btoa` throws on any character above U+00FF. JSON can carry one as a `\u` escape, which `JSON.parse` turns into the real character - so a cookie with a best under `"coil.\u263a"` (a smiley, once decoded) parsed fine and then made every write throw. Every change goes through a write. Worse still, the pass makes a change as soon as it loads (it pays the day's tokens), and that call came before it registered its event listeners. So the script threw on every page load, nobody was listening, and every game on that browser quietly played free. Commit ec3050c shut that route by allowing only plain keys:

```ts
// Keys are a machine's slug, or for bests "slug.mode" in lower-case ASCII: anything else is dropped, so a hostile
// cookie can't smuggle in characters that would stop the card being written back.
if (modes ? !(k.includes(".") && known.has(slug) && /^[a-z]{1,12}(\.[a-z]{1,12})?$/.test(mode)) : !known.has(k)) continue;
```

Run the parser from before that commit and the current one against the same forged cookie and we can see the change. The old one returns a card whose `serialise()` throws `InvalidCharacterError`. The new one drops the key and serialises without complaint.

It isn't the only way to make the card unwritable, though, and the other one's still open. The check is on the shape of a key, not on how many there are, and numbers are written back in full. Say we forge a cookie of 4,079 bytes (name included). It can hold 214 keys like `"coil.ab":1e9`. `parse()` accepts all 214, since each one matches the pattern and 1e9 is the clamp. `serialise()` then writes each value as `1000000000`, and the card comes back at 6,124 characters with the receipt already cut to nothing. That won't fit in a cookie. In Chromium, driven by Playwright, setting a cookie that size does nothing: no exception, and the old cookie stays where it was. So every change is read, applied, written, ignored - and gone on the next read. The only person this hurts is whoever forged their own cookie, since every subdomain that could write one is the arcade's. The fix is easy enough to see (keep only modes the economy table knows, or cap the number of bests). It isn't in the code yet.

## 3,200 of 4,096 bytes, on every request

A cookie can hold about 4,096 bytes. This one isn't allowed near that. `serialise()` aims for 3,200 and gives up receipt lines until it fits:

```ts
/** Base64url of the JSON: cookie-safe, and a third smaller than percent-encoding it. Everything in a card is ASCII. */
const b64 = (o: unknown) => btoa(JSON.stringify(o)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
export const MAX = 3200; // of the 4,096 bytes a cookie may hold
export function serialise(c: Card): string {
  const c2 = { ...c, log: c.log.slice(0, LOG) };
  let s = b64(c2);
  while (s.length > MAX && c2.log.length) { c2.log.pop(); s = b64(c2); }
  return s;
}
```

We ran the real `card.ts` and `economy.ts` in Node 24 to get the sizes. A fresh card is about 210 characters. After six runs across five machines, with a full 12-line receipt, it's 1,080. The largest legitimate card - 99 tokens, a credit on every machine, a best at the clamp for each of the 51 modes - is 3,032 characters with no receipt, and the loop keeps it under 3,200 with one. The "third smaller" in the comment holds for a fresh card, at 208 characters against 302 percent-encoded. On the played card it's closer to a fifth (1,080 against 1,354).

Why so careful? Because `Domain=ashwinsathian.com` means the browser sends the card on every request to every host under that domain, whether or not the page wants it. That's each game's HTML, scripts and textures, every byte-range request the hall makes for its clips, and the apex site too. None of them read it. Only `pass.js` does. HTTP/2 and HTTP/3 header compression should make the repeats cheap on a warm connection, though that hasn't been measured here, and the first request on each connection pays in full.

## What stops abuse, and what doesn't

A handful of rules in `src/pass/economy.ts` and `main.ts` each close one cheap trick:

- A run has to start in the same tab before it can pay. The start is kept in sessionStorage, per machine, and an `end` with no matching start pays nothing. The comment on it says it's there "so a reload mid-run can't pay twice". Payment is worked out from the mode the start recorded, whatever the end says.
- A run shorter than 1,500 ms pays nothing. Neither does a quit, and a quit gets no refund.
- A machine pays at most 20 tokens a day, and a Daily mode pays once a day per machine.
- The cup holds 99. Below 3, one token comes back every 15 minutes, up to 3.
- Forgetting your card gives you a new one with 3 tokens, not the welcome 12. From 0 that's still a top-up of 3, which is no more than waiting 45 minutes.

The sessionStorage rule has a gap we haven't run but expect from how browsers work. Duplicating a tab copies its sessionStorage, so one start could be ended, and paid, in both copies.

Then there's devtools, which no rule touches. The card is base64url JSON; decode it, set `tok` to 99, encode it, done. `pass-check.ts` edits the card exactly that way to put the page into its out-of-tokens state. The design doc says so up front: the wallet is "a cookie the player can edit", and the architecture notes add that tokens have no value outside the arcade. The rules are there for people who aren't doing that, and they don't pretend otherwise.

Concurrency gets the same treatment. Two tabs on two games can both hold the card, so every change re-reads the cookie first:

```ts
/** Every change re-reads the cookie first, so two open tabs don't undo each other. */
function change<T>(f: (c: Card, now: number) => T): T {
  const c = read(), out = f(c, Date.now());
  write(c);
  ui.paint(c);
  dispatchEvent(new CustomEvent("arcade:card", { detail: c }));
  return out;
}
```

Read, modify and write happen in one synchronous call, so within a tab nothing can interleave. Across tabs? There's no lock at all. Two writes at the same moment and the last one wins, which the design doc calls acceptable.

## Deploying is a cache header

Because every game loads the live file, changing the economy (a price, a payout threshold, which modes are free) is a deploy of the arcade alone. How soon a page load picks it up is set by one rule in `public/_headers`:

```
/pass.js
  Cache-Control: public, max-age=300, stale-while-revalidate=3600
  Access-Control-Allow-Origin: *
```

A cached copy is fresh for five minutes, and after that a browser may serve it stale for up to an hour while it fetches the new one. The design doc planned a day of staleness, and ec3050c cut it to an hour. That bound is on fetches, though. A game tab that's been open for three days isn't refetching anything - it's still running the `pass.js` it loaded three days ago. The CORS header isn't what the script needs. A script tag without `crossorigin` loads cross-origin anyway, and the font the pass loads into each game's page is served by the `/pass/*` rule, which carries the same header.

The other side of this is that each game lets a script from another origin run in it. Eight of the twelve have a Content Security Policy, and each of those lists `https://arcade.ashwinsathian.com` in `script-src` and `font-src`, alongside `'unsafe-inline'`, which all eight still allow. Rally, Minefield, Lightkeeper and Typester have no CSP. The tag carries no subresource integrity hash, and the design doc says that's on purpose: "the pass is updated in place by design, and it is served from the same owner's origin". Whoever can change `pass.js` can run code in all twelve.

That headers file had its own accident. In Cloudflare's format an unindented line starts a new path, and an indented line under it is a header. When the `/pass.js` block was first added (5857ffc), it was pasted into the middle of the `/*` block - between `Speculation-Rules: "` and the rest of its value. The paste's `/pass.js` line started a new rule, the dangling `/speculation.json"` became a path of its own, and the site-wide Content Security Policy ended up under that path, where it would match nothing. The Speculation-Rules header got the pasted comment as its value. The next commit, 46f8aab, put it back 83 seconds later, on the same branch, before the pull request merged, so the broken file never shipped. The same commit added a test that checks the CSP and the speculation rules sit inside the `/*` block.

The card still says `v: 1`. A card with any other version is treated as malformed and replaced, keeping only the tag, and an older `pass.js` writes back only the fields it knows. So the first time the card needs a new field, an old copy of the script, open in some tab since last week, will drop it. And if the version goes up instead, that old copy will throw the card away.
