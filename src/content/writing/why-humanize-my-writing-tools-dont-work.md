---
title: "Why \"Humanize My Writing\" Tools Don't Work"
date: "2026-08-18"
description: "A look at AI-writing detection research and why most 'humanize my writing' tools lean on brittle word lists instead of the more durable structural signal."
tags: ["ai", "writing", "llm", "claude"]
canonical: "https://dev.to/ashwinsathian/why-humanize-my-writing-tools-dont-work-3l76"
---

In December 2024, Florida State University linguists Tom Juzek and Zina Ward set out to answer a question that had become a running joke among people who read a lot of AI output: why does ChatGPT say "delve" so much?

Instead of guessing, they designed a study to rule out competing hypotheses one at a time, in the manner of philosophy of science. The first candidate was that these words are simply common in the text the models were trained on. That was ruled out. The second was something in the model architecture, or in how the model picks its next word. That was ruled out too. What was left, after comparing a base version of Llama 2 against the same model fine-tuned with human feedback, was the fine-tuning stage. Somewhere in the process of humans rating model outputs as good or bad, "delve" started winning.

A separate team led by Dmitry Kobak at the University of Tübingen analyzed over 15 million PubMed abstracts published between 2010 and 2024. They borrowed "excess mortality," a statistical method from epidemiology, and repurposed it as "excess vocabulary" to separate ordinary word-frequency drift from anomalies. "Delve" wasn't the only word that spiked. "Meticulously" rose 137% year over year, "intricate" 117%, and "commendable" 83%. By their estimate, at least 13.5% of 2024 biomedical abstracts show signs of LLM involvement, a bigger vocabulary shift than the one COVID caused. Kobak's study measures the size of that shift. The fine-tuning explanation for *why* it happens is still the FSU team's finding alone, unreplicated so far.

That finding is already going stale. A follow-up study from the same FSU team found "delve," "boast," and "meticulous" showing up more often in ordinary spoken language too, in podcasts and YouTube talks. People who read a lot of AI text are picking up its vocabulary and using it themselves, so the words are spreading into the human speech they were supposed to set AI text apart from.

## The word-list trap

Almost every "humanize my writing" tool currently on GitHub, including the well-built ones, is built around a list of words. I went looking, expecting a handful of thoughtful tools and a pile of junk. What I found was the same mechanism applied with varying degrees of care.

The most-starred tool in the space has over 36,000 stars, a number worth some skepticism given that it's a single markdown file. It does real work: it protects ordinary formal vocabulary from being flagged, refuses to invent facts during a rewrite, and matches a user's own writing sample instead of forcing one house style on everyone. Underneath, it still checks a passage against roughly three dozen fixed patterns, and fixed patterns go stale when models or detectors shift. A second tool opens by citing real false-positive research on AI detectors before giving a single rule, and states outright that its signals are "worth acting on; not worth ruining someone's day over," arguably the most honest framing of any tool I looked at. Most of what follows that framing is a banned-word list like everyone else's.

At the other end is a tool that instructs its model to treat certain words as an instant, unqualified tell: "if even one of these words appears, the text immediately flags as machine-written." Its banned list includes *robust*, *scalable*, *integrated*, and *proactive*, words that show up constantly in ordinary technical writing because they're often the correct word for the job. Strike "robust" from a paragraph about fault tolerance and the paragraph gets vaguer. No single word is that strong a signal.

The more careful tools make the same mistake. One caps em dashes at "Maximum ONE per 500 words," and nothing in its documentation says where the number comes from. It also instructs its model to apply all its rules silently and never mention them to the person it's writing for. That's a strange thing to optimize for if the goal is good writing. It serves a different goal, which is going undetected.

However carefully a word list is built, it targets the weakest part of the signal.

## What the stronger signal looks like

Separately from the vocabulary work, peer-reviewed computational linguistics research has been measuring sentence shape.

A 2024 study from the Universidade da Coruña compared six sets of LLM-generated news text (Mistral, Falcon, and LLaMA at four different sizes) against human-written news articles published after the models' training cutoffs, so nothing in the comparison could have been memorized. Human sentence lengths spread unevenly across a wide range. Every model's sentences clustered in a narrow band of 10 to 30 tokens. That gap between human and machine was larger than the differences among the six models.

A separate PNAS study found a similar convergence at the scale of whole stories: LLM-generated narratives cluster around a much smaller set of recurring plot patterns than human-written ones do, even across different prompts. That result has nothing to do with vocabulary either.

This is a problem for anyone building a "humanizer" out of a word list. A model can stop saying "delve" tomorrow, but changing the shape of its sentences is much harder. Structure is also the more durable signal, because it isn't tied to which words happen to be fashionable in this quarter's training data.

## The em dash isn't the story people think it is

The em dash is the one tell that has caught on outside NLP circles. NPR ran a piece on "the unofficial movement to save the em dash" from guilt by association. A Rochester Institute of Technology student paper cited GPT-4.1 using the mark at roughly 3.28 times the rate of typical human essays.

The sources disagree on whether that overuse means what people assume it means, and on why it happens. One independent analysis argues it's a training-data artifact: labs ran out of fresh web text and started digitizing older, pre-1950s books, which use em dashes far more heavily than contemporary writing. GPT-3.5, trained before this shift, didn't show the overuse that GPT-4o does. A competing explanation is that human raters, during the reinforcement-learning stage that shapes a model's final behavior, reward the clarity and pacing an em dash provides, and the model learns that preference regardless of what the training data looked like.

Benjamin Dreyer, Random House's longtime copy chief, doesn't think the overuse claim holds up. He went looking for the "charts and graphs and proofs" behind the em-dash panic and found none. Examining sample AI prose by hand, he found nothing anomalous in the counts and called the whole thing "social media blather." What worries him more is the chilling effect: students avoid a perfectly good punctuation mark for fear of being falsely flagged, over a signal that was never trustworthy by itself.

## What the source of all this said

At least 6 of the 13 tools I looked at trace back to one place: Wikipedia's "Signs of AI writing" essay, maintained by volunteer editors who patrol new submissions for undisclosed AI content. It's excellent applied research. It is built from thousands of real cases and revised as models change, and it's more rigorous than most of what's built on top of it.

It also contains a warning that few of the people citing it seem to have read. Its own verdict on the tells it catalogs is that they're surface symptoms of worse problems underneath: unreliable sourcing, shallow synthesis, no real editorial judgment. Scrub the vocabulary without touching any of that and you've, in the essay's own words, "obscured the actual concerns." A find-and-replace pass that swaps "delve" for something else and caps the em dashes gets past the pattern-matching, but it doesn't produce text anyone thought through.

That's the harder problem, and it's the one worth building for. We ended up doing that. We researched 27 cross-referenced tells, ranked them by source strength and by how often each one shows up, and wrote a teardown of what the tools above get wrong. The result is a Claude Code skill built around structure and specificity first, with the vocabulary list as a backup. It's not foolproof, and it'll date the same way every tell-based approach does. It's on GitHub if you want to check the sourcing yourself: [github.com/AshwinSathian/humanize-writing-skill](https://github.com/AshwinSathian/humanize-writing-skill).
