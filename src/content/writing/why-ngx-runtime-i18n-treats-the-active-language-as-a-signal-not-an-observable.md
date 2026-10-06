---
title: "Why ngx-runtime-i18n treats the active language as a signal, not an Observable"
date: "2026-08-17"
description: "Why ngx-runtime-i18n was built signals-first from day one instead of retrofitting signals onto an RxJS core, and how its compat layer works."
tags: ["angular", "signals", "rxjs", "i18n"]
canonical: "https://dev.to/ashwinsathian/why-ngx-runtime-i18n-treats-the-active-language-as-a-signal-not-an-observable-4i3g"
---

The idea of building **@ngx-runtime-i18n** came from my personal experience and, if I may daresay, frustration with the popular options for internationalisation in Angular apps. In applications of scale, especially at an enterprise level, it was no picnic. One of the critical decisions was whether to use signals, which were clearly the road ahead and yet, even as we speak, are not the standard for the community at large.

Most Angular i18n libraries predate signals. **ngx-translate** and **transloco** both started as RxJS-first services, and both have spent the last year retrofitting signal support on top. Transloco added `translateSignal` by wrapping `toObservable()` around its existing pipeline (jsverse/transloco#781 is the tracking issue, still open, with a maintainer confirming a signals-native rewrite is in progress). ngx-translate went further in its v18 rewrite and made signals the primary API. Angular's own built-in i18n never solved this because it is a compile step, not a runtime library. It produces one build per locale, with no way to switch languages without a page reload, which means local development is no party either.

I wanted the opposite starting point: build the service on signals from day one and treat RxJS as an optional bridge for people who still need it. That's **@ngx-runtime-i18n/angular**. `I18nService` exposes `lang()`, `ready()`, and `switching()` as signals directly, and `t$()` is a computed signal that recomputes when the language or the parameters change. There's no `toSignal(this.service.stream$)` anywhere in the implementation. If your codebase has NgRx effects or older RxJS-based code that needs Observables, `I18nCompatService` wraps the same state as `lang$`/`ready$`.

The other piece I didn't want to compromise on was ICU. A lot of runtime i18n libraries handle "1 item" / "2 items" and stop there, which works for English and fails for Arabic (six plural forms), Polish, or Russian. `formatIcu()` implements `plural`, `select`, and `selectordinal` against the actual CLDR plural categories (zero/one/two/few/many/other), so a translator can write correct plural rules for their language instead of the library silently falling back to English-shaped logic.

SSR was the third constraint. `provideRuntimeI18nSsr()` seeds the resolved catalog into Angular's `TransferState` on the server, so the client picks up exactly what was rendered instead of re-fetching and re-resolving the language after hydration. There's no flash of the wrong language and no mismatch warning.

The library is still growing. It's six packages now (`core`, `angular`, `primeng`, `material`, `schematics`, `cli`), all on npm as of v2.1.0, with real but small usage so far. The parts I'd most like feedback on are route-scoped catalog loading (`loadScope()`/`unloadScope()`) for large apps with many feature modules, and whether the fallback-chain API (`fallbacks: string[]` on top of `defaultLang`) covers the cases people hit in multi-region products.

Repo: [github.com/AshwinSathian/ngx-runtime-i18n](https://github.com/AshwinSathian/ngx-runtime-i18n)

npm: [@ngx-runtime-i18n/angular](https://www.npmjs.com/package/@ngx-runtime-i18n/angular)

Docs: [i18n.ashwinsathian.com](https://i18n.ashwinsathian.com/)
