---
title: "Three Gaps in a Caching Layer, and the Go Library I Built to Close Them"
date: "2026-10-13"
updatedAt: "2026-10-23"
description: "Weir is a Go library for HTTP caching in front of an origin that has to stay up. What Varnish, nginx and Souin already solve, the three things I couldn't find in one place, and how it got built with Claude Code."
tags: ["go", "caching", "http", "claude", "buildinpublic"]
---

Weir began with a caching layer that had three weaknesses, and a suspicion that they weren't unusual.

It couldn't survive a hard reset. Flush the cache and every request after that was a cold miss, all of them at once, all of them headed for the origin. It had no defence against flooding either, so when requests arrived faster than the origin could regenerate entries, nothing held them back. And it had no TTL jitter. Entries that were stored in a batch expired in a batch, and the stampede came back on a schedule instead of happening once.

Weir is what came of that: a Go library for shared HTTP caching in front of an origin that has to stay up, with adapters for `net/http` and Caddy. Version 1.0.0 went out on 12 October 2026, fifteen days after the first design document.

## Surely somebody has solved this already

Partly. And the part that's solved is solved well. The research that seeded the project went looking for reasons not to build it, and found plenty that was already done.

Varnish coalesces requests for one object without being asked. Its documentation says that when several clients request the same page it "will send one request to the backend". It also has grace mode, which serves a stale object while a new one is fetched. nginx has `proxy_cache_lock`, under which "only one request at a time will be allowed to populate a new cache element". Souin, which is written in Go, lists RFC 7234 compliance, request coalescing, surrogate-key purging, ESI and storage providers including Badger, etcd, Olric and Redis, and it plugs into Caddy through the cache-handler module. If you need any of that today, use it - Weir has two storage backends and no ESI.

What I couldn't find was the rest of my list in one place - at least not built in, and not in the pages I read. That list is lifetimes randomised so that a batch doesn't expire together, a limit on origin fetches shared across different keys, and a default that hides unkeyed request headers from the origin. Any of these projects may offer them through configuration or modules I didn't read. The [comparison on Weir's site](https://weir.ashwinsathian.com/compare/) links every page it relies on, and where a claim couldn't be checked against a project's own documentation it was left out.

So no single technique here is new. What I was after is the combination, in one library.

## Coalescing stops one stampede and not the other

Coalescing turns a hundred concurrent requests for one URL into one origin fetch and ninety-nine waiters. It's the right answer to a hot key. But it does nothing when ten thousand different URLs go cold in the same second, because no two of those requests share a key - and that's what a full flush, a restart, or a batch of entries with one TTL produces.

Weir puts every origin fetch, whatever its key, behind one limiter. There are 64 slots by default, with a share per path so that one busy route can't take them all. In the load test that stores 10,000 keys with the same lifetime and lets them expire together, with the limit set to 32, all 10,000 were refetched, the origin never had more than 32 requests in flight, and no client saw an error.

Jitter is the smaller half of the same idea. Each entry's lifetime is shortened by up to 10%, so entries stored together don't expire together. In the README's transcript an origin answers `max-age=60`, and thirteen seconds later the cached copy reports `ttl=43` where plain arithmetic says 47, because jitter took four seconds off that entry.

## The origin sees what the cache keyed

Cache poisoning needs one thing: an input that changes the origin's response and isn't part of the cache key. James Kettle's research at PortSwigger is the catalogue of how often that's true. CVE-2024-35296 is the same idea turned into a denial of service - an invalid `Accept-Encoding` header could make Apache Traffic Server fail its cache lookup and forward the request to the origin.

nginx, for one, keeps the two apart: which request headers reach the upstream is a setting you manage separately from the cache key. Weir ties them together. On a cacheable request the origin receives only the headers that are in the key, the ones you've explicitly allowed, and a short fixed list that HTTP and tracing need. The request it forwards is the request it keyed, so a header the cache ignores never reaches the origin and can't shape what gets stored for everybody else.

Does that cost anything? It does, and it's the first thing you'll trip over. If your origin reads `Accept-Language`, a device header or a cookie to build a page, it won't see it until you say so. You key it, you allow it, or you lose it. For the first five minutes Weir counts the cookie names it dropped and logs the common ones once, so you can find the ones you forgot.

## How it got built

I didn't type most of this code. Weir was built through Claude Code sessions, and I'd rather say exactly how than leave it vague.

The first design document is dated 27 September and credits Claude with research and drafting help. Out of it came ten numbered documents, among them a spec where every behaviour has a requirement ID and a threat model that says how each threat is answered and tested. Then came 103 task cards. One session took one card, wrote the tests first with each test citing the requirement it covers, and ended in a pull request. Sessions can't merge - I reviewed and merged those myself. A script fails the build if a requirement ID has no test citing it, and there are 147 of them.

Did that make it correct? No. Before the release, six adversarial reviews of the finished code found a 304 response that could bring back a body a hard purge had removed. They found `%2e` being decoded into a dot-segment of the path, and a named pipe at the snapshot path that hung startup. Each of those got a test. And the work between the first release candidate and the release turned up more: a module tagged without its `go.sum` lines, a runbook that promised a cache hit after a restart when the real answer is a revalidation, and a resumed download that could be handed a `206` nobody had checked against the bytes the client already held.

The release wasn't clean either. The session cutting 1.0.0 asked Go's module proxy for the version before the tag existed, the proxy cached its "not found", and the release sat for half an hour waiting for that to expire. The changelog inside the `v1.0.0` tag still says "unreleased". A published Go module version can't be replaced, so it always will.

The reference machine is my own M4 Pro. The first run on it showed the cached-hit path had become 32% slower since the first milestone, which nothing in CI had flagged. Another run was thrown away because the machine was busy with a Chrome video stream and several Claude Code sessions, and the numbers spread by 38%. A cached hit now takes 852 nanoseconds there.

## The day after: a seventh review

The day after 1.0.1 I asked for one more review, this time with instructions to attack the thing. It found eight serious problems in code that six reviews and a green test suite had passed, and each one was confirmed with a test before anyone believed it.

The worst was in coalescing, the first thing the library promises. When the origin took 15 seconds to answer, 100 requests waiting on one key made 16 fetches between them, and 84 got a 503 - the waiters gave up at 10 seconds and fetched for themselves, which is the stampede the library exists to stop. Twenty errors from one path opened the circuit breaker for every path. Half a million POSTs to URLs nobody had cached sent about half of all the other entries back to the origin.

The fixes shipped as 1.1.0 on 13 October. They weren't clean either. A reviewer reading them found three defects in the fixes themselves, and the existing tests caught a fourth: behind Caddy, every GET had quietly stopped being cached. One performance claim I made along the way was noise from a run that wasn't compared against its baseline, and the record now says so.

The same release makes a cached hit cheaper: 669 nanoseconds and 8 allocations, against 964 and 12 for 1.0.1 in the same run on a machine that wasn't idle.

## Where it stands

Weir is days old. Varnish and nginx have years of production behind them and Weir has none yet - 30 fuzz targets running an hour each without a crash don't change that. It isn't a CDN, a WAF or a rate limiter. It has two stores, memory and Valkey, and the Valkey one has only been tested against Valkey 8.1. Its threat model lists 51 threats with the answer and the test for each, and ten risks it doesn't remove.

The documentation is at [weir.ashwinsathian.com](https://weir.ashwinsathian.com) and the code is at [github.com/AshwinSathian/weir](https://github.com/AshwinSathian/weir), under Apache-2.0. Whether the combination earns its place is for the people who run it to say.

## Update, 23 October 2026

Weir 1.2.0 is out. Part of it answers a second comparison round that showed where Weir lost. When several clients waited for a response too large to store, each of them downloaded it from the origin. Now they read one download together, and in the comparison's over-size test the origin calls went from 150 to 3. Nodes that share a Valkey server can fetch a missing key once between them instead of once each, and the Valkey store can keep a local copy in front of the server so a hit skips the round trip. Both are off by default. The library builds on Go 1.26 now, and CI tests the Valkey store against 7.2 as well as 8.1.

The third round, run against 1.2.0, found what it still does badly. Weir holds about 3.6 KB of memory for a cached 100-byte response, where Varnish holds about 1 KB. In a cache-busting flood it turns away more of the flooded path's clients than any other cache does, even while the origin still has room, though none of the other traffic fails. I also measured latency for the first time, but the control moved too much between runs to trust, so none of those numbers are published. Memory and a measurement I can trust are the work for 1.3.0.
