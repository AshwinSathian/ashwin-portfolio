---
title: "Why Better Auth's MongoDB adapter can't populate() a Mongoose ref"
date: "2026-08-17"
description: "Better Auth's official MongoDB adapter bypasses Mongoose, so populate() silently fails on its tables. better-auth-mongoose fixes that."
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

`populate()` fails silently. There's no error, only `null`, as if the ref never resolved. If you've hit this, you're not doing anything wrong.

## Why it happens

`mongodbAdapter()` talks to the raw [`mongodb`](https://www.npmjs.com/package/mongodb) driver, not Mongoose. It never registers a Mongoose model for `user`, `session`, `account`, or any of Better Auth's own tables. Two consequences follow:

1. You end up with two disconnected views of the same database. Better Auth writes through `MongoClient` directly, and your own code reads and writes through Mongoose. The two share no schema, validation, or hooks.
2. The `_id` types don't line up. Better Auth's default ID generator produces a 32-character base62 string, which is not an `ObjectId`. Mongoose's `populate()` needs an `ObjectId` to resolve a ref, so the ref has nothing valid to point at.

This gap has been open and documented on Better Auth's own repo since February 2025:

- [`better-auth#1492`](https://github.com/better-auth/better-auth/issues/1492): forced to install the raw `mongodb` package as a duplicate dependency, even in apps that only ever use Mongoose.
- [`better-auth#6289`](https://github.com/better-auth/better-auth/issues/6289): id/session mismatches from mixing Mongoose reads with raw-driver writes on the same collections.
- [`better-auth` discussion `#9364`](https://github.com/better-auth/better-auth/discussions/9364) and [`#1921`](https://github.com/better-auth/better-auth/discussions/1921): people hitting exactly this `populate()` failure and asking for a real Mongoose adapter.

The usual workaround is to call `mongoose.connection.getClient()` and hand the raw client to `mongodbAdapter()`. That changes where Better Auth *connects* but not what it *stores*, so your ref field still has nothing valid to resolve against.

## The fix

[`better-auth-mongoose`](https://github.com/AshwinSathian/better-auth-mongoose) registers Better Auth's tables as extendable Mongoose models on a connection you already own. It also overrides ID generation to produce 24-character `ObjectId` hex strings in place of Better Auth's default base62 IDs. The adapter converts between `ObjectId` and `string` at the boundary, so Better Auth's core still sees plain strings while MongoDB stores `ObjectId`s.

```typescript
import { betterAuth } from "better-auth";
import { mongooseAdapter } from "better-auth-mongoose";
import mongoose, { Schema } from "mongoose";

await mongoose.connect(process.env.MONGO_URI!);

export const auth = betterAuth({
  database: mongooseAdapter(mongoose.connection),
});
```

The same `Post` model and the same `.populate("author")` call now work without a workaround:

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

The repo runs this as a test in CI:

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

It also passes the official [`@better-auth/test-utils`](https://www.npmjs.com/package/@better-auth/test-utils) adapter contract suite, the same conformance tests the official adapters run against.

## What else comes with it

- Zero direct dependencies. `mongoose` and `better-auth` are peer dependencies you already have, and the raw `mongodb` driver is never pulled in.
- Schema extension. `schemas: { user: new Schema({ role: { type: String, default: "member" } }) }` merges your fields in and won't let a required Better Auth field be loosened by accident.
- Transactions are on by default, using Mongoose sessions. On a standalone `mongod` (common in local dev) the adapter falls back to non-transactional writes instead of crashing on boot.
- Adapter-level joins. Better Auth 1.4+ can push joins down to the adapter for a documented 2–3x latency improvement on endpoints like `get-session`. This adapter turns those joins into `.populate()` calls when you set `experimental: { joins: true }`.
- If you're on NestJS: [`examples/nestjs-mongoose`](https://github.com/AshwinSathian/better-auth-mongoose/tree/main/examples/nestjs-mongoose) is a complete app built on [`@thallesp/nestjs-better-auth`](https://github.com/thallesp/nestjs-better-auth), exercised over HTTP in CI on every push.
- If you're building multi-tenant SaaS on top of Better Auth's `organization` plugin, there's a companion package, [`better-auth-mongoose-tenant`](https://www.npmjs.com/package/better-auth-mongoose-tenant), for automatic tenant-scoped queries on your own models.

```bash
pnpm add better-auth-mongoose mongoose better-auth
```

[better-auth-mongoose.ashwinsathian.com](https://better-auth-mongoose.ashwinsathian.com) has the full writeup, a compatibility matrix (Mongoose 6–9, Better Auth 1.4–1.6), and more recipes. The repo is at [github.com/AshwinSathian/better-auth-mongoose](https://github.com/AshwinSathian/better-auth-mongoose). It's MIT licensed and not affiliated with the Better Auth team. I built it because this gap has been open for a year and a half.
