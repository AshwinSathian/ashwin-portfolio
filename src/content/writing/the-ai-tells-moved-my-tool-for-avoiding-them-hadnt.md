---
title: "The AI Tells Moved. My Tool for Avoiding Them Hadn't."
date: "2026-10-05"
description: "I audited my own anti-AI-writing skill against 2026 research. Its showcase examples had swapped the 2023 tells for the 2026 ones, and a blind test caught it inventing facts."
tags: ["ai", "writing", "llm", "claude"]
---

In August [I argued](/writing/why-humanize-my-writing-tools-dont-work) that word lists are the wrong way to make AI-assisted writing read as human, and I published a Claude Code skill built on sentence structure and specific claims instead. Two months later I audited that skill against newer research. The argument held up, but the skill had a problem I should have caught, and it was in the examples I had chosen to show it off.

One of them rewrote a puffed-up paragraph about API rate limiting. The original ended on "a testament to thoughtful, resilient system design." My rewrite ended like this:

> That complexity is cheaper than the outage it prevents.

I liked that line. It is also a known pattern. The most-used tool in this space, blader's humanizer (about 54,000 GitHub stars), ranks its patterns by strength, and "one-line closers" is second of 26. The other example was worse. Its original contained "It's not just a matter of nostalgia — it's a matter of reliability," which my rewrite removed, and then the rewrite added three constructions of the same kind, including "not because they distrust GPS but because a dead phone in the backcountry is a real scenario, not a hypothetical one." The validation notes I published with the skill praised a sample for the fragment "Speed compounds:" and called it rhythm variety.

The skill had taken text written in the 2023 style and rewritten it in the 2026 one.

## How that happened

The first version leaned on a 2024 study from the Universidade da Coruña, which found that model sentences cluster in a narrow band of lengths where human sentences spread out. From that I wrote a rule: vary sentence rhythm on purpose. A model told to vary its rhythm writes short sentences for effect, and a short sentence written for effect after a long one is the closer, the fragment, and the colon reveal.

The study has also aged. It measured Mistral, Falcon, and LLaMA. A 2026 paper that tested 284 linguistic features across 27 models and ten kinds of text found most proposed indicators depended heavily on context. Sentence-length variation was not the durable signal I had called it.

## What the newer measurements say

On 30 July *The Economist* published a comparison of its own articles with rewrites by ChatGPT, Claude, Gemini, and Grok: 55,940 sentences and 1.2 million words, set against human journalism and novels going back to 1950. The paper's summary is that the tells are now long words, long sentences, and thin punctuation. The models favor polysyllables and nouns made from verbs. Their sentences run long and are joined with "and," which is their most overused word. They use fewer commas and semicolons than people and almost no parentheses. They still reach for "not X but Y" and lists of three.

The em dash result surprised people. Of the four models, only Claude uses more em dashes than human writers. ChatGPT now uses fewer than any other writer in the study.

Two of those findings had been measured before. A 2025 paper in PNAS found instruction-tuned models using nominalizations at 1.5 to 2 times the human rate, and the trailing "-ing" clause ("underscoring its importance") at 2 to 5 times. Wikipedia's volunteer-maintained list of AI vocabulary, which I leaned on last time, is now sorted by model era. Its list for mid-2025 onward has four words on it, and "delve" is recorded as having fallen sharply.

Anthropic has named a habit in its own model, too. Its prompting guide for Claude Fable 5.1 describes "mannered prose," which substitutes "metaphor and flourish for direct statement," and gives the example of writing "a dial worth turning" for "a parameter worth varying." A Hacker News thread in August collected complaints about the same thing, many of them about the phrase "load-bearing." Those complaints are unmeasured. The vendor's description is not a measurement either, but it is the vendor describing its own product.

## The finding I liked least

To test the rewrite of the skill, I had fresh model instances write the same three pieces with no skill, with the old one, and with the new one. One task was a short internal blog post arguing that a team should adopt feature flags. The writers were told nothing about the team.

With the old skill loaded, one of them opened its case like this:

> Two weeks ago we shipped the new checkout flow together with the tax library upgrade. When error rates rose, we could not tell which change caused it.

There was no such release. The old skill's first rule was to commit to specific, checkable claims, and its rule against inventing things came seven bullets later. Asked to be specific about a team it knew nothing about, the model made up an incident. My first draft of the new rules did the same thing and produced a "checkout redesign" with a forty-minute rollback.

The rewritten examples had the same fault in a quieter form. The rate-limiting rewrite mentioned a database connection pool and a `Retry-After` header. Both are plausible, and neither was in the original paragraph.

The rule against invention is now second, directly under the rule that creates the pressure, and it names the forms the failure takes: the made-up incident, the mechanism the writer does not know, and anything a rewrite adds to its source. In the final test round, the model writing the same blog post under the new rules supported its point about stale flags with Knight Capital, which lost $440 million in 45 minutes in 2012 after a deploy reactivated dead code behind a reused flag. That happened.

## Testing it blind

Last time I compared outputs myself, knowing which was which, and scored them against my own list. This time the pairs were shuffled by a script and judged by two models that saw only "Passage A" and "Passage B."

My second draft of the new rules lost to the old skill. One judge called it the more machine-like passage in five pairs of six and preferred the old version in four. The reasons were consistent. It restated itself ("so requests that do not carry a valid signature are not acted on"). It had been told to prefer literal language and had dropped an analogy that the old version used to explain a B-tree. One pull request description ended on a dramatic claim that went past the facts it had been given.

I added a rule to say each thing once, an exception for analogies that explain how something works, and the fixes from a separate adversarial review that had found twenty problems, several of them in the skill's own prose. In the next round both judges preferred the new version to no skill in five pairs of six, and to the old skill in five of six and four of six.

That is twelve pairs. The judges are Claude models, which may share blind spots with the writers, and I tuned the rules on the same three tasks I then scored them on. I would not put much weight on the exact numbers. I put more on the direction, and on one thing the counting script showed: across all eighteen passages, including the ones written with no skill, there was not one em dash and not one "it's not X, it's Y" that a pattern could match. The two tells people talk about most were absent. The judges were reacting to restatement, to stock transitions like "The speedup comes at a price, and writes pay it," and to invented history.

## What it still does not do

It does not get text past an AI detector. Current detectors are trained classifiers. A 2026 paper found that GPTZero and Pangram often label text from a base model as human and text from the instruction-tuned version of the same model as AI, which suggests they are reading the tuning and not the phrasing. A style guide does not change how a model was tuned. The skill now says so in its overview, and tells the model to say so if asked.

Version 2.0.0 is in the same repository as before, along with the blind pairs, both judges' answers, the comparisons it lost, and the review that found the twenty problems: [github.com/AshwinSathian/humanize-writing-skill](https://github.com/AshwinSathian/humanize-writing-skill). The part I expect to rewrite first is the file listing the habits of current Claude models, which is dated October 2026 and will be wrong after the next release.
