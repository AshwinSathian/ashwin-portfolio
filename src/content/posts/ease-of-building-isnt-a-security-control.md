---
title: "Ease of building isn't a security control"
date: "2026-11-16"
description: "A security report on Lovable apps, how a Supabase database ends up readable by strangers, who the fixes reach, and a logged-out check to run before you ship."
seoDescription: "What the Crissy Field report on Lovable apps shows about Supabase row-level security, who owns the fix, and a logged-out check to run before you ship."
tags: ["lovable", "supabase", "security", "ai", "vibecoding"]
---

Crissy Field, a security firm in Hamburg, [worked with the German daily Handelsblatt](https://www.privacyaffairs.com/lovable-apps-data-exposure/) on a study of apps built with Lovable. Handelsblatt reported it on 2 November, and an English report followed on 14 November. The firm looked at 159,041 Lovable projects found in the Common Crawl web archive, and of the 34,545 that used Supabase, 24,664 sent database records to a visitor who wasn't logged in. That alone can be harmless, since a menu or an event list is meant to be public. Among the data they found readable were profiles and chat messages from a forum, order records with phone numbers and addresses, and identity-document records.

The headline email share needs care, and Crissy Field is careful about it. An email address in a table can be a public contact detail or test data, and the sample doesn't represent every Lovable app. It isn't a confirmed leak rate. I'd still read the report, because the mechanism behind it doesn't depend on any percentage.

## How a browser ends up talking to your database

A Lovable app is mostly front end, and its data usually lives in Supabase. The page talks to the database directly, over an API, using a key that ships inside the page's JavaScript. Everyone who loads the app gets the key. That's by design, and Supabase [calls it the publishable key](https://supabase.com/docs/guides/api/api-keys).

So the key can't be what keeps a stranger out. What does is row-level security (RLS), which is a set of rules on each table about who may read or write which rows. Supabase's guidance is to enable it on every table in an exposed schema, because a table without it is readable and writable by any role with a grant on it. Somebody has to write those rules. A prompt can create a table in seconds, but it doesn't decide who may read it.

A few details catch people out, all from Supabase's own docs:

- Adding a policy doesn't take back a grant that already exists. On older projects a new table starts with every privilege granted to the unauthenticated role, so an insert path can stay open on a table you thought was protected.
- A view bypasses RLS by default, since it's usually created by the all-powerful postgres user. A view over a locked-down table can hand out every row. On Postgres 15 and above, `security_invoker = true` makes the view obey the table's policies.
- The secret key (formerly `service_role`) skips RLS entirely, so it never goes in front-end code.

## Whose problem is it

Lovable's position, which hasn't changed much, is that the builder owns the result. Its security documentation says: "You are responsible for ensuring that your app meets the security requirements appropriate for its use case." Privacy Affairs, quoting it, reports that Lovable told Handelsblatt this is a known configuration problem across the industry. And that's fair enough. The data in those apps belongs to the builder's users, and the terms say who is responsible.

Two changes have landed since, and per Privacy Affairs' reading of the changelogs both reach new work and not old. Supabase stopped exposing new tables to its public API automatically (existing tables keep their grants). On 12 November Lovable began asking people to review critical security findings when they publish on its built-in backend, though they can still choose to publish anyway, and only Enterprise workspaces can block it. An app nobody republishes isn't scanned again.

Here's where I land. Who the end users of a platform like this are matters more than the terms. Lovable's pitch is that you needn't know how to code, so a warning about missing policies carries different weight for a founder who has never heard of RLS than for a specialist engineer, who would stop and fix it. The warning exists, and I wouldn't say it's missing. But for the common person it may not be enough, and that's where the onus moves to the platform, to make secure the default and the insecure option the one that needs a decision.

## What I'd do before shipping on this stack

Spec it. Before the app has data, write the access rules per table: who reads, who writes, who neither. For most tables the answer is "only the owner of the row", and a few really are public, like a menu or an event list. Writing that down is the same job as a specification anywhere else (the [Signal proof post](/writing/when-agents-write-the-proof-the-specification-is-the-work) is about the same lesson), only here a missing line means a stranger reads your users.

Then test it the way a stranger would. Take only the publishable key from your own deployed bundle, log out, and query every table, plus every view, with something like:

```sh
curl "https://<project>.supabase.co/rest/v1/<table>?select=*&limit=1" \
  -H "apikey: <publishable-key>"
```

An empty array or a permission error is what you want. Anything that comes back should be there on purpose. Run it again after every schema change, since a new table is a new chance to forget.

Least possible access, that should be the aim. Decide it first, then check it from the outside.
