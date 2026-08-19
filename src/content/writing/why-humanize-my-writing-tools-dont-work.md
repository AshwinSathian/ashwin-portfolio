---
title: "Why \"Humanize My Writing\" Tools Don't Work"
date: "2026-08-18"
description: "A look at AI-writing detection research and why most 'humanize my writing' tools lean on brittle word lists instead of the more durable structural signal."
tags: ["ai", "writing", "llm", "claude"]
canonical: "https://dev.to/ashwinsathian/why-humanize-my-writing-tools-dont-work-3l76"
---

In December 2024, Florida State University linguists Tom Juzek and Zina Ward set out to answer a question that had turned into a running joke among people who read a lot of AI output: why does ChatGPT say "delve" so much?

Instead of guessing, they built a study designed to eliminate the wrong explanations first, a philosophy-of-science-style method for ruling out competing hypotheses one at a time. First candidate: maybe these words are just common in whatever text the models were trained on. Ruled out. Second candidate: something about the model architecture, or the mechanics of how the model picks its next word. Also ruled out. What was left, after comparing a base version of Llama 2 against the same model fine-tuned with human feedback, was the fine-tuning stage itself. Somewhere in the process of humans rating model outputs as good or bad, "delve" started winning.

That's not a fringe result. A separate team led by Dmitry Kobak at the University of Tübingen ran the numbers on over 15 million PubMed abstracts published between 2010 and 2024, borrowing a statistical method from epidemiology, "excess mortality," repurposed as "excess vocabulary," to separate ordinary word-frequency drift from something anomalous. "Delve" wasn't the only word that spiked. "Meticulously" rose 137% year over year. "Intricate," 117%. "Commendable," 83%. By their estimate, at least 13.5% of 2024 biomedical abstracts show signs of LLM involvement, a bigger vocabulary shift than the one COVID caused. Kobak's study measures the size of that shift. The fine-tuning explanation for *why* it happens is still just the FSU team's own finding, unreplicated so far.

Here's the part almost nobody mentions when they cite that finding: it's already going stale. A follow-up study from the same FSU team found "delve," "boast," and "meticulous" showing up more often in ordinary spoken language too, in podcasts and YouTube talks. People who read a lot of AI text are picking up its vocabulary and using it themselves. The tell is bleeding into the population it was supposed to detect.

## The word-list trap

This is the problem with almost every "humanize my writing" tool currently on GitHub, even the well-built ones: underneath whatever nuance they add, they're still built around a list of words. I went looking, expecting a handful of thoughtful tools and a pile of junk. What I found instead was a spectrum of care applied to the same underlying mechanism.

The most-starred tool in the space has over 36,000 stars, a number worth eyeing with some skepticism given it's a single markdown file. It does real work: protecting ordinary formal vocabulary from being flagged, refusing to invent facts during a rewrite, matching a user's own writing sample instead of forcing one house style on everyone. None of that changes what it's actually doing underneath, which is checking a passage against roughly three dozen fixed patterns, a heuristic that goes stale the moment models or detectors shift. A second tool opens by citing real false-positive research on AI detectors before giving a single rule, and states outright that its signals are "worth acting on; not worth ruining someone's day over," arguably the most epistemically honest framing in the entire space. Strip away that framing, though, and the bulk of what's left is the same genre of banned-word list as everything else.

Then there's the tool at the other end of the spectrum, the one that instructs its model to treat certain words as an instant, unqualified tell: "if even one of these words appears, the text immediately flags as machine-written." Its banned list includes *robust*, *scalable*, *integrated*, *proactive*, words that show up constantly in ordinary technical writing because they're often the correct word for the job. Strike "robust" from a paragraph about fault tolerance and the paragraph just gets vaguer. No single word carries that much diagnostic weight on its own.

Even the more careful tools slip into the same trap. One enforces a rule capping em dashes at "Maximum ONE per 500 words," with no stated methodology behind the number anywhere in its documentation, and separately instructs its model to apply all its rules silently, never mentioning them to the person it's writing for. That's a strange thing to optimize for if the goal is writing that's actually good. Being undetected is a different achievement.

Word lists share the same fragility no matter how carefully they're built: cheap to build, fast to go stale, and aimed at the weakest part of the signal.

## What the stronger signal actually looks like

Separately from all of this vocabulary-chasing, there's a body of peer-reviewed computational linguistics research quietly measuring sentence shape instead of word choice.

A 2024 study out of the Universidade da Coruña compared six sets of LLM-generated news text (Mistral, Falcon, and LLaMA at four different sizes) against real human-written news articles, chosen specifically from after the models' training cutoffs so nothing in the comparison could have been memorized. Human writing spread its sentence lengths across a wide range, some short, some long, unevenly. Every model, regardless of which one wrote the piece, clustered tightly into a narrow 10-to-30-token band. That gap between human and machine was larger than the differences between the six models themselves. Whatever "sounds like Mistral" and whatever "sounds like LLaMA" turned out to have more in common with each other, structurally, than either has with an actual human sentence.

A separate PNAS study found the same convergence in the shape of entire stories instead of sentences: LLM-generated narratives cluster around a much smaller set of recurring plot patterns than human-written ones do, even across different prompts. Same convergence, different scale, still nothing to do with vocabulary.

This is the inconvenient part for anyone building a "humanizer" out of a word list: structure is a harder problem to fake your way around, and it's also the more durable signal, because it isn't tied to which specific words happen to be fashionable in this quarter's training data. A model can stop saying "delve" tomorrow. Rewriting the shape of its sentences is a different kind of problem.

## The em dash isn't the story people think it is

If there's one tell that's achieved genuine cultural traction outside of NLP circles, it's the em dash. NPR ran a piece on "the unofficial movement to save the em dash" from guilt by association. A Rochester Institute of Technology student paper cited GPT-4.1 using the mark at roughly 3.28 times the rate of typical human essays.

What's less settled, and this is where the sources genuinely disagree, is whether that overuse even means what people assume it means, let alone why it happens. One independent analysis argues it's a training-data artifact: labs eventually ran out of fresh web text and started digitizing older, pre-1950s books, which use em dashes far more heavily than contemporary writing, and GPT-3.5, trained before this shift, didn't show the same overuse that GPT-4o does. A competing explanation points the other direction: human raters, during the reinforcement-learning stage that shapes a model's final behavior, reward the clarity and pacing an em dash provides, and that preference gets baked in regardless of what the training data looked like.

Benjamin Dreyer, Random House's longtime copy chief and about as credentialed a human authority on English prose as exists, doesn't think the overuse claim itself holds up. He went looking for the "charts and graphs and proofs" behind the em-dash panic and found none. Examining sample AI prose by hand, he called the whole thing "social media blather" and found nothing anomalous in the counts. What worries him more is the chilling effect: students spooked into avoiding a perfectly good punctuation mark for fear of being falsely flagged, paying a real cost for a signal that was never trustworthy on its own to begin with.

## What the source of all this actually said

At least 6 of the 13 tools I looked at trace their DNA back to one place: Wikipedia's "Signs of AI writing" essay, maintained by volunteer editors who patrol new submissions for undisclosed AI content. It's genuinely excellent applied research. Built from thousands of real cases and revised as models change, it's more rigorous than most of what's built on top of it.

It also contains a warning that hardly anyone who cites it seems to have read past: its own verdict on the tells it catalogs is that they're surface symptoms of something worse underneath, unreliable sourcing, shallow synthesis, no real editorial judgment. Scrub the vocabulary without touching any of that and you've, in the essay's own words, "obscured the actual concerns." A find-and-replace pass that swaps "delve" for something else and caps the em dashes gets past the pattern-matching. It never produces text anyone actually thought through.

That's the harder problem, and it's the one worth building for. We ended up doing exactly that: research on 27 cross-referenced tells, ranked by source strength and how often each one actually shows up, plus a teardown of what the tools above get wrong, that became a Claude Code skill built around structure and specificity first, with the vocabulary list demoted to a backup role instead of the primary mechanism. It's not foolproof, and it'll date the same way every tell-based approach eventually does. It's on GitHub if you want to check the sourcing yourself: [github.com/AshwinSathian/humanize-writing-skill](https://github.com/AshwinSathian/humanize-writing-skill).
