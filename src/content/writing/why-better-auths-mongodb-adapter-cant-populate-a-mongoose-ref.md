---
title: "Why Better Auth's MongoDB adapter can't populate() a Mongoose ref"
date: "2026-08-17"
description: "Better Auth's official MongoDB adapter bypasses Mongoose, so populate() silently fails on its tables — and how better-auth-mongoose fixes it."
tags: ["mongodb", "mongoose", "node", "typescript"]
canonical: "https://dev.to/ashwinsathian/why-better-auths-mongodb-adapter-cant-populate-a-mongoose-ref-e2c"
---

If your Node app already uses Mongoose and you wire up Better Auth with its official MongoDB adapter, this looks fine at first:

```typescript
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";

const client = mongoose.connection.getClient();

export const auth = betterAuth({
  database: mongodbAdapter(client.db()),
});
```

Then you try to reference a Better-Auth-created user from your own model:

```typescript
const Post = mongoose.model(
  "Post",
  new Schema({
    title: String,
    author: { type: Schema.Types.ObjectId, ref: "user" },
  }),
);

const post = await Post.findOne({ title: "..." }).populate("author");

post.author; // null
```

`populate()` silently fails. Not an error — just `null`, like the ref never resolved. If you've hit this, you're not doing anything wrong.

## Why it happens

`mongodbAdapter()` talks to the raw [`mongodb`](https://www.npmjs.com/package/mongodb) driver, not Mongoose. It never registers a Mongoose model for `user`, `session`, `account`, or any of Better Auth's own tables. Two consequences fall out of that:

1. **You end up with two disconnected views of the same database.** Better Auth writes through `MongoClient` directly. Your own code reads and writes through Mongoose. No shared schema, no shared validation, no shared hooks between the two.
2. **The `_id` types don't line up.** Better Auth's default ID generator produces a 32-character base62 string — not a real `ObjectId`. Mongoose's `populate()` needs a real `ObjectId` to resolve a ref against. There's nothing valid on the other end.

This isn't a one-off — it's been an open, documented gap on Better Auth's own repo since February 2025:

- [`better-auth#1492`](https://github.com/better-auth/better-auth/issues/1492) — forced to install the raw `mongodb` package as a duplicate dependency, even in apps that only ever use Mongoose.
- [`better-auth#6289`](https://github.com/better-auth/better-auth/issues/6289) — id/session mismatches from mixing Mongoose reads with raw-driver writes on the same collections.
- [`better-auth` discussion `#9364`](https://github.com/better-auth/better-auth/discussions/9364) and [`#1921`](https://github.com/better-auth/better-auth/discussions/1921) — people hitting exactly this `populate()` failure and asking for a real Mongoose adapter.

The workaround everyone lands on — `mongoose.connection.getClient()`, hand the raw client to `mongodbAdapter()` — only fixes where Better Auth *connects*. It doesn't fix what it *stores*. Your ref field still has nothing valid to resolve against.

## The actual fix

[`better-auth-mongoose`](https://github.com/AshwinSathian/better-auth-mongoose) registers Better Auth's tables as real, extendable Mongoose models on a connection you already own, and overrides ID generation to produce real 24-character `ObjectId` hex strings instead of Better Auth's default base62 IDs — converting between `ObjectId` and `string` at the boundary so Better Auth's own core still sees plain strings, but MongoDB stores actual `ObjectId`s underneath.

```typescript
import { betterAuth } from "better-auth";
import { mongooseAdapter } from "better-auth-mongoose";
import mongoose, { Schema } from "mongoose";

await mongoose.connect(process.env.MONGO_URI!);

export const auth = betterAuth({
  database: mongooseAdapter(mongoose.connection),
});
```

Same `Post` model, same `.populate("author")` call, no workaround:

```typescript
const Post = mongoose.model(
  "Post",
  new Schema({
    title: String,
    author: { type: Schema.Types.ObjectId, ref: "user", required: true },
  }),
);

const post = await Post.findOne({ title: "..." }).populate("author").lean().exec();

post.author.email; // resolved
```

This is a real, CI-run test in the repo, not a claim in a README:

```typescript
describe("the differentiator: a consumer's own model can .populate() a Better-Auth-created user", () => {
  it("resolves Post.author via .populate() after Better Auth creates the user", async () => {
    const auth = betterAuth({ database: mongooseAdapter(connection) });

    const { user } = await auth.api.signUpEmail({
      body: { email: "author@example.com", password: "correct-horse-battery-staple", name: "Post Author" },
    });

    await Post.create({ title: "Hello, populate()", author: coerceToObjectId(user.id) });

    const post = await Post.findOne({ title: "Hello, populate()" }).populate("author").lean().exec();

    expect(post.author.email).toBe("author@example.com"); // passes
  });
});
```

It also passes the official [`@better-auth/test-utils`](https://www.npmjs.com/package/@better-auth/test-utils) adapter contract suite, so it's not just "populate works" — it's a fully conformant Better Auth adapter.

## What else comes with it

- **Zero direct dependencies.** `mongoose` and `better-auth` are peers you already have; the raw `mongodb` driver is never pulled in.
- **Schema extension that doesn't fight Better Auth.** `schemas: { user: new Schema({ role: { type: String, default: "member" } }) }` merges your fields in without letting a required Better Auth field get accidentally loosened.
- **Transactions on by default**, using real Mongoose sessions, with automatic fallback to non-transactional writes on a standalone `mongod` (common in local dev) instead of crashing on boot.
- **Adapter-level joins.** Better Auth 1.4+ can push joins down to the adapter for a documented 2–3x latency improvement on endpoints like `get-session`. This adapter turns that straight into `.populate()` calls — flip `experimental: { joins: true }` and it's already wired up.
- If you're on NestJS: [`examples/nestjs-mongoose`](https://github.com/AshwinSathian/better-auth-mongoose/tree/main/examples/nestjs-mongoose) is a complete app built on [`@thallesp/nestjs-better-auth`](https://github.com/thallesp/nestjs-better-auth), exercised over real HTTP in CI on every push.
- If you're building multi-tenant SaaS on top of Better Auth's `organization` plugin, there's a companion package, [`better-auth-mongoose-tenant`](https://www.npmjs.com/package/better-auth-mongoose-tenant), for automatic tenant-scoped queries on your own models.

```bash
pnpm add better-auth-mongoose mongoose better-auth
```

[better-auth-mongoose.ashwinsathian.com](https://better-auth-mongoose.ashwinsathian.com) has the full writeup, a compatibility matrix (Mongoose 6–9, Better Auth 1.4–1.6), and more recipes. Repo's at [github.com/AshwinSathian/better-auth-mongoose](https://github.com/AshwinSathian/better-auth-mongoose) — MIT licensed, not affiliated with the Better Auth team, built because this gap has sat open for a year and a half.
