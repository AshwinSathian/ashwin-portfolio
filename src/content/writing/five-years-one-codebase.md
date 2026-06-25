---
title: "Five Years, One Codebase: What Staying Teaches You"
date: "2026-06-10"
description: "In an industry that treats job-hopping as career acceleration, staying at one company for five years gets treated as a yellow flag. It shouldn't be."
tags: ["engineering", "leadership", "architecture"]
---

There's a moment you hit in software engineering — usually around year two or three at a company — where you know the codebase well enough to be dangerous. The module boundaries make sense. You know which services are brittle. You've got strong opinions about the database schema. Most people leave around this point, either because another offer arrives or because the challenge feels solved.

I stayed for five years.

The thing I didn't expect was how much there was still to learn after year two. Not about the code — I mean about the compound effects of technical decisions over time.

---

## What happens to an architectural decision at six months

It looks clean. The boundaries are sensible, the data model is tidy, the code review went well. You're proud of it.

At two years: the codebase has grown around it. There are now seventeen services that depend on the contract you designed. One team worked around a limitation in it; another worked through it correctly. The limitation you knew about but didn't document — because you'd "fix it properly later" — has become load-bearing in ways you never intended.

At four years: you can trace the lineage of every decision. Not just "this is how things are," but "this is why, and here's the Thursday afternoon when the choice was made, and here's what was true in the world at that moment that made it seem reasonable." That context is invisible to anyone who joined later. It lives in your head and nowhere else.

Staying long enough to watch your own decisions age is one of the most clarifying experiences I've had as an engineer. You become the owner of your own mistakes in a way that is uncomfortable and educational in equal measure.

---

## The shift from "does this work?" to "will this hold?"

Something shifts when you stop thinking about what you'll build next and start thinking about what has to last.

Early-career engineering is mostly about acquiring skills and shipping things. That's appropriate — you need volume, you need to write a lot of code, work on a lot of problems, see the inside of different systems.

But there's a different kind of skill that only comes from tenure. From being accountable for something long enough to experience the full lifecycle of your decisions. You stop asking "does this work?" and start asking "will this hold?" and "what does this look like in three years?" and "what assumptions am I baking in that might become false?"

Architecture isn't a design phase. It's an ongoing conversation with the future. You can't have that conversation if you left before the future arrived.

---

## What AI changes about this

I want to be honest about something: the experience of staying long enough to understand a system deeply is being reshaped by AI tooling. And I think most engineers aren't talking clearly about how.

The common fear is that AI makes depth unnecessary — that you can parachute into any codebase with a good LLM and be immediately productive. There's something to this. AI-assisted development genuinely flattens the early learning curve. You can understand an unfamiliar module faster, ask the right questions of a codebase you've never touched, and ship something reasonable in week one rather than month three.

But here's what doesn't change: the *judgment* about what to build, where to draw the boundaries, which abstractions will age well. AI can help you write the code for any decision you've made. It cannot make the decision for you — not the ones that matter.

The engineers who are getting the most from AI tooling right now are not the ones using it to avoid thinking. They're the ones with enough system-level judgment to know what to ask for, how to evaluate what comes back, and where to push back. Depth and AI augmentation are not in tension. They compound.

That's the lesson five years at one codebase actually teaches you: it's not the code you know, it's the judgment you accumulate. AI raises the floor for everyone. It doesn't close the gap at the top.

---

## A word of honesty about staying

I want to be clear: five years at one company can also mean stagnation. I've seen it. Engineers who stay too long and stop growing, who optimize for comfort rather than craft, who mistake familiarity with expertise.

Tenure alone proves nothing.

But the opposite failure mode is more common in our industry right now — people who accumulate breadth at the expense of depth, who never stay long enough to be accountable for the long-term consequences of anything. Who leave before the systems they built either succeed or fail. Novelty feels like learning. Often it isn't.

The signal I'd look for, if I were hiring a senior engineer: have they ever been around long enough to be wrong about something they designed? Have they shipped something, watched it age, and been the person who had to fix it — not just patch it, but understand it well enough to address the root without breaking the sixteen things that had grown up around it?

That experience is rarer than any specific technology skill. It doesn't show up in a skills matrix.

---

## The thing that actually transfers

I'm at HighLevel now, leading engineering for products at a significantly larger scale than anything I'd owned before. Different company, different architecture, different constraints.

What transferred immediately was not Angular, or NestJS, or any particular pattern. It was the instinct to ask: what has to hold here? What are the implicit contracts that nobody has written down? Where is the debt that everyone is managing around rather than through?

Those questions come from having been in a codebase long enough to see your own blind spots made literal in production. They are not teachable in a tutorial. They don't show up on a resume.

You only get them by staying.

The structure has to last. The only way to know if yours did is to be there when time comes for it.
