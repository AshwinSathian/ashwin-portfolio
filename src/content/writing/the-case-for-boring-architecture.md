---
title: "The case for boring architecture"
date: "2025-03-10"
description: "Why choosing the obvious technology is one of the most underrated acts of engineering leadership."
tags: ["architecture", "leadership"]
---

There is a specific kind of meeting that happens in every engineering organisation. It usually begins with a phrase like *"what if we tried"* or *"have you seen what they're doing at"* — and ends, if you're lucky, with someone saying the word "boring."

I have been in that meeting many times. I have been the person who wanted the new thing. I have also been the person who said no to the new thing. The second role is harder, and I think more important.

## The allure of the interesting

Engineers are curious by nature. We read release notes. We follow the people who write the runtimes. We feel genuine pleasure when a new abstraction maps cleanly onto a problem we've been fighting for months. This is not a character flaw — it's part of why the job is good.

But curiosity unchecked becomes entropy. Every new dependency is a surface area for failure. Every framework migration is weeks of work that does not move the product forward. Every "let's try this" is a question you've deferred: what happens when this breaks at 2am, and the person who introduced it has left?

The appeal of interesting architecture is mostly an appeal to the people building it, not to the organisation running it.

## What boring actually means

Boring does not mean old. It does not mean simple in a naïve sense. It means: the failure modes are understood. The community is large enough that most of your problems are searchable. The tooling is mature. The hiring pool knows it.

PostgreSQL is boring. Linux is boring. REST is boring. These technologies are also running most of the world's critical systems, quietly, without drama, because their corners have been found and documented.

When I say I prefer boring architecture, I mean I prefer architecture where the interesting problems are in the domain — where the hard work is understanding the business, not understanding the runtime.

## The architectural decision as a leadership act

Here is the part that took me a while to understand: choosing boring technology is not a technical decision. It is a leadership decision.

It is a decision about who owns the system three years from now. It is a decision about what skills the team needs to hire for. It is a decision about what happens on-call at 3am when something breaks. It is a decision about how much cognitive load you are willing to impose on every engineer who joins after you.

When you introduce a novel technology, you are writing a debt note against the future attention of your team. Sometimes that debt is worth it — there are problems that genuinely require new tools. But the interest accrues in oncall rotation, in onboarding time, in the slow accumulation of institutional knowledge that only two people hold.

The engineers who chose boring technology are, in my experience, the ones who understand this. They have usually been burned. They have watched a system collapse under the weight of its own cleverness. They have done the migration that didn't need to happen.

## When to break the rule

There are problems that genuinely require new tools. If your latency requirements are tight enough that you need to control memory allocation, Go or Rust may not be avoidable. If your data model is graph-shaped, a relational database is fighting physics. If you are building on top of LLM infrastructure, there is no mature, battle-tested stack yet — you are, by definition, going to be early.

In those cases, you make the call, document the reasoning, and accept the cost. The discipline is in making it a conscious, explicit decision — not a default, not a preference, not "because it's what I know from my last job."

The question is not whether to ever use something new. The question is: what is the problem that this solves, specifically, that we cannot solve with what we have?

If the answer is clear, proceed. If the answer involves the word "elegant" or "clean" or "fun," reconsider.

## The systems that last

I spent five years working on a single platform. I watched it grow from something a small team could hold in their heads to something that served millions of records across dozens of enterprise customers.

The parts of that system that aged well were the boring ones. The REST API we wrote in year one still works in year five, with minor additions. The PostgreSQL schema we designed carefully at the start is still the spine of the product. The job queue built on basic primitives outlasted three attempts to replace it with something more sophisticated.

The parts that aged badly were the clever ones. The abstraction that made sense in theory but that no one could explain in practice. The service that was extracted too early, before the boundaries were clear. The framework that was cutting-edge in 2020 and orphaned by 2023.

Boring architecture is how you give a system a long life. It is how you respect the people who will maintain it after you.

---

The best technical decision I ever made was choosing the obvious thing. I have not always made that choice. When I have, I've rarely regretted it.
