---
title: "Runtime i18n for Angular, done right: @ngx-runtime-i18n"
date: "2025-10-27"
description: "A signals-first, SSR-safe runtime i18n library for Angular that swaps compile-time locale builds and RxJS-only APIs for a small, modern core."
tags: ["angular", "i18n", "typescript", "ssr"]
canonical: "https://levelup.gitconnected.com/runtime-i18n-for-angular-done-right-ngx-runtime-i18n-d8922f92a327"
---

Internationalisation in Angular tends to force a choice between two options:

- Angular's built-in i18n is compile-time only. That suits static text and AOT performance, but it needs one build per locale, complicates deployments, and doesn't help when strings must come from a CMS or need to change without a rebuild.
- Older runtime libraries such as `ngx-translate` solved switching language at runtime, but many apps ran into trouble with SSR and hydration, change-detection churn, bundle size, and the lack of a signals-native API.

`@ngx-runtime-i18n` is a small alternative built on Angular's current primitives (signals, standalone, SSR/TransferState), with a deliberately minimal API.

## What's in the box?

`@ngx-runtime-i18n/core` has the framework-agnostic primitives:

- A small, dependency-free ICU-lite formatter (string interpolation, plus `plural` with `one`/`other` and exact `=0`, `=2`, …).
- Shared types used by the Angular wrapper.

`@ngx-runtime-i18n/angular` is the Angular integration:

- A signals-first `I18nService` with a minimal surface (`lang()`, `ready()`, `t()`, `setLang()`).
- An `I18nPipe` that's impure by design but doesn't write during render (avoids `NG0600`).
- `I18nCompatService` (RxJS) for apps that aren't on signals yet.
- SSR support: a `TransferState` snapshot on the server, read on the client without hydration mismatches.
- Cancellation-aware language switching (rapid toggles won't corrupt state).
- Lazy-loaded Angular locale data per language, so date and number pipes follow the switch.

## Quick start

```bash
npm i @ngx-runtime-i18n/angular @ngx-runtime-i18n/core
```

Provide the library once at app bootstrap:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideRuntimeI18n } from '@ngx-runtime-i18n/angular';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideRuntimeI18n(
      {
        defaultLang: 'en',
        supported: ['en', 'hi', 'de'],
        fetchCatalog: (lang, signal) =>
          fetch(`/i18n/${lang}.json`, { signal }).then((r) => {
            if (!r.ok) throw new Error(`Failed to load catalog: ${lang}`);
            return r.json();
          }),
      },
      {
        localeLoaders: {
          en: () => import('@angular/common/locales/global/en'),
          hi: () => import('@angular/common/locales/global/hi'),
          de: () => import('@angular/common/locales/global/de'),
        },
        options: {
          autoDetect: true,
          storageKey: '@ngx-runtime-i18n:lang',
          preferNavigatorBase: true,
        },
      }
    ),
  ],
};
```

Use it in templates:

```html
<h1>{{ 'home.title' | i18n }}</h1>
<p>{{ 'home.greeting' | i18n:{ name: user.name, count: unreadCount } }}</p>
```

Or imperatively:

```typescript
import { inject } from '@angular/core';
import { I18nService } from '@ngx-runtime-i18n/angular';

const i18n = inject(I18nService);

if (i18n.ready()) {
  console.log(i18n.t('cart.items', { n: 2 }));
}

await i18n.setLang('de');
```

Not on signals? Use the RxJS-backed compatibility service:

```typescript
import { I18nCompatService } from '@ngx-runtime-i18n/angular';

i18nCompat.ready$.subscribe((ready) => ...);
i18nCompat.lang$.subscribe((lang) => ...);
i18nCompat.t$('home.title').subscribe((text) => ...);

await i18nCompat.setLang('hi');
```

## Why this library exists (and what it optimises for)

1. Runtime first. Load catalogs from anywhere (public JSON, CMS, API), switch languages without rebuilding, and keep deployments simple.
2. SSR and hydration. The initial catalogue and locale are snapshotted on the server via `TransferState` and read on the client without double-fetches or hydration warnings.
3. Signals-native API. The `I18nPipe` is impure on purpose but read-only, and `I18nService.lang` is a signal you can depend on anywhere, so there's no global zone churn and no manual change detection.
4. Small surface area. A small core formatter and a focused Angular wrapper, with no globals and no deep DI hierarchies.
5. Pragmatic ICU. Most apps don't need the full ICU matrix on day one. The core ships an ICU-lite that covers interpolation and plural basics.
6. Cancellation and race-safety. Rapid toggles (`en → de → hi → en`) don't corrupt the active catalog. The library passes an `AbortSignal` to your `fetchCatalog` so stale requests are cancelled.

## Usage patterns

**Feature-level catalogs (split by route)**

```typescript
{
  path: '',
  providers: [
    provideRuntimeI18n(
      {
        defaultLang: 'en',
        supported: ['en', 'hi'],
        fetchCatalog: (lang, signal) =>
          fetch(`/i18n/feature.${lang}.json`, { signal }).then(r => r.json()),
      }
    ),
  ],
  loadComponent: () => import('./feature.component'),
}
```

Each feature area can ship its own keys, which keeps catalogues small and makes it clear who owns them.

**Multi-tenant or brand overlays**

```typescript
fetchCatalog: async (lang, signal) => {
  const [base, tenant] = await Promise.all([
    fetch(`/i18n/base.${lang}.json`, { signal }).then(r => r.json()),
    fetch(`/i18n/${tenantId}.${lang}.json`, { signal }).then(r => r.json()),
  ]);
  return deepMerge(base, tenant);
}
```

**Server-prefetch with `TransferState`**

During SSR, hit your CMS/API directly, then stash the result:

```typescript
import { makeStateKey, TransferState } from '@angular/core';

const STATE_KEY = makeStateKey<Record<string, unknown>>('i18n:en');

provideRuntimeI18n(
  {
    defaultLang: 'en',
    supported: ['en', 'de'],
    fetchCatalog: async (lang, signal) => {
      if (isServer) {
        const cat = await cms.fetch(lang, { signal });
        transferState.set(STATE_KEY, cat);
        return cat;
      }
      return transferState.get(STATE_KEY, null) ??
        fetch(`/i18n/${lang}.json`, { signal }).then(r => r.json());
    },
  }
);
```

The library reads the snapshot on the client and skips the duplicate request.

## Implementation notes

- No writes during render: the pipe only reads `lang()` to establish reactivity, and the translation work itself is pure.
- Missing keys: in dev mode, warnings are de-duplicated per key.
- Config tokens: four injection tokens wire up config, the catalogs store, locale loaders, and options (`RUNTIME_I18N_CONFIG`, `RUNTIME_I18N_CATALOGS`, `RUNTIME_I18N_LOCALE_LOADERS`, `RUNTIME_I18N_OPTIONS`).
- Locale data: opt-in per language with `localeLoaders`, so date/number pipes switch correctly without bundling every locale.
- Compat layer: `I18nCompatService` mirrors the signals API with RxJS for gradual migrations.

## Roadmap

**Short-to-mid term:**

- Full ICU message syntax.
- Dev tooling: key extraction, dead-key detection, and catalogue linting.
- First-class CMS adapters (filesystem, HTTP, popular headless CMS).
- Schematics/Generators: generate per-feature catalog scaffolds and locale-data wiring.
- Language negotiation improvements (regional fallbacks, custom mappers).
- Runtime devtools: overlay to inspect keys, active catalog, and missing translations at a glance.

**Longer-term explorations:**

- Message compilation to speed hot paths for large catalogs.
- Polyglot mode: composing multiple sources (base + module + A/B experiment layer) with predictable precedence.

## Where the library stands today

- Core and Angular packages are production-ready for apps that need runtime i18n with SSR correctness and a signals-native API.
- If you need the full ICU grammar, watch the upcoming minor releases.
- The demos include a CSR app and an SSR app that show the recommended setups (public JSON catalogs, locale loaders, auto-detect + persist).

## Adoption checklist

1. Install `@ngx-runtime-i18n/angular` and `@ngx-runtime-i18n/core`.
2. Provide it once at bootstrap; wire a `fetchCatalog` and optional `localeLoaders`.
3. Create `public/i18n/en.json` (and friends).
4. Replace template calls with `| i18n` and imperative usages with `i18n.t(…)`.
5. If needed, start on `I18nCompatService` (RxJS) and migrate to signals over time.

Feedback, issues, and PRs are welcome.
