---
title: "What a browser tab won't let an API client do"
date: "2026-11-10"
description: "Wayfarer is an API client that opens in a browser tab. What the tab takes away, how the app says so before you send, and two ways its own claims and checks turned out wrong."
tags: ["api", "cors", "browser", "angular", "buildinpublic"]
---

Wayfarer is an API client that opens in a browser tab. There's nothing to install and no account to make. Collections, environments and history live in the browser's IndexedDB, and apart from loading the app, the only traffic is the request you compose, sent to the host you typed (plus the token request, if you use OAuth 2.0). I announced it on 10 November 2026. The current version is 3.4.0, and it's MIT-licensed.

It also imports Postman, Insomnia, OpenAPI, HAR and cURL, runs Postman-style scripts in a QuickJS sandbox, keeps secrets in an encrypted vault, and does GraphQL, WebSockets and event streams. The README has the full list. This post is about the other side of living in a tab, which is what a page isn't allowed to do.

## What the tab takes away

A desktop client sends requests from a process that can do almost anything. A page sends them through the browser, and the browser decides what goes out:

- A response from another origin reaches the page only if the server allows it (CORS), and a request that isn't "simple" is first asked about with a preflight.
- `Cookie`, `Host`, `Origin`, `Connection` and the other forbidden header names are dropped, and a page can't read the browser's own cookies.
- An `http://` address is blocked from an `https://` page.
- From another origin, a page can read only the CORS-safelisted response headers and the ones the server exposes.
- Phase timings (DNS, connect, first byte) exist only if the server sends `Timing-Allow-Origin`.
- Redirects are followed without being shown, TLS can't be relaxed, and no proxy can be set.

A desktop client is under none of these rules, so its documentation rarely mentions them. The nearest web peer does mention them - Hoppscotch's documentation says its web app needs nothing for an API that allows CORS, and otherwise an agent, an extension or a proxy (read on 4 November 2026; the [comparison page](https://wayfarer.ashwinsathian.com/compare/hoppscotch/) links it).

## Say what the browser will do, before the send

Before a request goes, Wayfarer's composer says what the browser will do to it (claim C-049). It lists the headers the browser will drop, says whether it will ask the server first and why, and warns when an `http://` address will be blocked. For a PUT with an Authorization header it reads: "The browser asks the server first, with an OPTIONS request, because of the method PUT, the header Authorization. The request is sent only if the server's answer allows it."

After a failure the app can say less than you'd like, and it says that too: "The request got no response. The browser does not say why: the name may not resolve, the server may have refused the connection, or it does not allow requests from this page (CORS). Send it through the Local Bridge to see which." A page can't tell those cases apart, so the message doesn't pick one.

An early version did the opposite. Its service worker answered a failed network request with a 504, which is a gateway timeout and blames a server for something the page couldn't attribute. That was finding F06 in the September audit. Claim C-010 now says a network failure shows the real error, never a made-up 504.

## When the page can't, a program on your machine can

The Local Bridge is `npx wayfarer-bridge`, a small Node program with no dependencies. It listens on 127.0.0.1, refuses a request whose Host isn't loopback, and relays only for an allowed origin that presents its token. The token comes from a pairing code the bridge prints when it starts. The code works once, and three wrong ones in a row lock pairing for 60 seconds, the right one included. Through the bridge, `Cookie`, `Host` and `Origin` go as written, redirects are followed hop by hop and listed, and an `http://` address works.

The page keeps the say over where a request goes. The route called Auto sends from the page first. Only after the page got no answer does it consider the bridge, and then it goes at once for a GET, HEAD or OPTIONS or when a preflight was needed, and asks you first for anything else. A response is never sent twice (C-064).

## The Timings tab was making up a number

The browser's Resource Timing API gives a page the phases of a request: DNS, connect, TLS, time to first byte, content. For a response from another origin whose server sends no `Timing-Allow-Origin`, the browser sets those phase times to zero and keeps only when the request started and ended. Wayfarer's Timings tab computed the Content phase as the end of the response minus its start. With the start zeroed, that was the end minus zero, which is the time since the page loaded.

On a fresh page, a request of 750 ms showed a Content phase of 1.9 seconds. Ten minutes after the page loaded, a request of about one second showed a Content phase of 593 seconds. Claim C-023 already said phase timings are withheld without the header, and its test checked four phases, not Content. A walkthrough of the live app as a first-time visitor found it on 9 November, the day before the announcement.

Every phase goes through one function that subtracts two times - so the fix is a condition in it: a time of zero is withheld, not the start of the page. The new unit test failed first, for the reason reported, and C-023's end-to-end test now checks that Content isn't drawn. The fix shipped in 3.2.4.

## Every claim has a test, and the ledger failed in two ways

Wayfarer's [claims ledger](https://wayfarer.ashwinsathian.com/blog/the-claims-ledger/) has 94 rows. Each is a sentence the project says about itself, with the documents that say it and the tests that prove it. `npm run check:claims` fails if a row has no test or names one that doesn't exist, and the tests about the page run in Chromium, Firefox and WebKit before a release is deployed. A claim test is never retried, since one that passes on the second try hasn't shown what it claims.

The first failure was a claim. C-012 said the production page loads with no script the app didn't ship, with zero CSP violations. The Cloudflare zone that serves the site injects a bot-detection script. The Content-Security-Policy blocks it, and a block counts as a violation, so the claim was false. The check for zero violations was skipped against production with a warning, so nothing was checking the claim. On 9 November, in 3.2.5, it was reworded to what holds: the page runs no script but the app's, and the policy blocks any other, including one the host adds. The new test fails on any script fetched from another origin or from `/cdn-cgi/`, and on any violation that isn't a blocked script. The strict zero-violations test is still there - skipped on production until the zone stops injecting. That's issue #75, and it's open.

The second was in the check itself. A claim whose only test was marked skipped passed `check:claims`, and the README listed it as tested. Version 3.4.0 stopped counting skipped tests.

## Where it stands

Four of the September audit's 75 issues are still open. One is the Cloudflare script. One is WebKit sending a request that needs a preflight although the server refused it, when the service worker is in control. One is whether the bridge is reachable under Chrome's local-network rules and Safari's mixed-content rules, which hasn't been checked in all three browsers. The last is the deploy: it ships the tested files by hand, and a rollback hasn't been rehearsed.

There's no gRPC, MQTT or Socket.IO, and no MCP server. Collections aren't files in a Git repository yet; that's next. A collection reaches a teammate as a file or an encrypted link, not as a workspace you edit together.

The app is at [wayfarer.ashwinsathian.com](https://wayfarer.ashwinsathian.com/app/) and the code is at [github.com/AshwinSathian/wayfarer](https://github.com/AshwinSathian/wayfarer). If a request works in Postman and fails in the tab, open an issue with the composer's notes. Those are the cases the notes are there for.
