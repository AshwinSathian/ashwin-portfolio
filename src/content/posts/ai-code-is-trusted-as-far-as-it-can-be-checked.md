---
title: "AI code is trusted as far as it can be checked"
date: "2026-11-20"
description: "Two 2026 developer surveys: most developers trust AI output when they can verify it, and most say they generate AI code faster than they can. What the numbers can and can't tell us, and what I'd do about the gap."
seoDescription: "Stack Overflow: 48% trust AI output when they can verify it. Sonar: 76% generate AI code faster than they can. What the surveys show and what to do."
tags: ["ai", "softwareengineering", "codereview", "testing"]
---

Two surveys came out about five weeks apart this autumn, and I keep reading them as one question asked from both ends.

Stack Overflow's [2026 developer survey](https://survey.stackoverflow.co/2026/ai/data/ai-trust), [published on 6 October](https://stackoverflow.co/company/press/archive/stack-overflow-annual-developer-survey-ai-trust-conditional), asked how far people trust AI output. The biggest group, 48% of 14,304 respondents, chose "I trust it when I can easily verify the output". Another 16% trust it for many tasks but not important decisions, 16% for low-risk tasks only, 12% not for most work, and 7% for many tasks including important decisions. Sonar's [State of Code survey](https://www.sonarsource.com/company/press-releases/sonar-releases-2027-developer-survey-report/), released on 12 November, asked 1,026 developers and engineering managers about volume. 76% said they generate AI code faster than they can verify it, and 53% said they spend more time reviewing code than writing it (18% remembered that being true before AI tools).

I wouldn't add these up. The populations differ, both are self-reported, and neither survey measured what checking costs. The link between them is my inference: if trust depends on being able to verify, and verification is what's falling behind, then how much we trust AI code is set by how cheap it is to check. That's an argument, and the surveys are only consistent with it.

## The condition is about the artifact

"When I can easily verify it" sounds like a statement about the developer, as if some people are better at checking. I'd say it's mostly about the output. A change with a failing-then-passing test, a small diff and a clear statement of intent is easy to verify. A 900-line diff that looks right isn't, however good the reviewer is.

Stack Overflow also asked how people check AI answers (a multi-select question, 13,162 respondents). About three in four run the code locally (77% on the chart), 64% compare it against the codebase, 53% inspect tests and security implications, and 10% use it as is. Running it locally is the most common check, and it's an acceptance test done by hand, by whoever happens to be reading. Whether that holds up as volume grows is a separate question, and Sonar's 76% is the only hint at it, a self-reported comparison that suggests verification is the bottleneck for many teams.

## What the surveys can't tell us

Sonar found that only 39% completely agree that AI-generated code is always checked before it's committed, while 94% don't fully trust it. 42% are very or extremely concerned that well-written AI code makes bugs harder to spot, and only 23% have well-defined, AI-specific guidelines or automated checks. Those are attitudes and self-assessments. They don't show how thoroughly anyone reads. Sonar also sells verification tools, and it reports that 77% of respondents say strong verification tools increase their trust, which is the result its product needs. The numbers are still a fair description of a bottleneck that most of us will recognise from our own review queue.

Two older studies are worth keeping in mind, with a limit on what they show. Neither tested code review. In a [2023 user study](https://arxiv.org/abs/2211.03622), Perry, Srivastava, Kumar and Boneh found that participants with an AI assistant wrote less secure code on four of five tasks and were more likely to believe it was secure (a small study of one older model). METR's [2025 trial](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) found experienced open-source developers took 19% longer with AI while believing it had sped them up by about 20%. METR's [February update](https://metr.org/blog/2026-02-24-uplift-update/) says that estimate is probably out of date, that its newer data is an unreliable signal because of who dropped out, and that self-reported speedups "can be quite unreliable". What both results share is a gap between how a person judges AI-assisted work and how it measures. They're a reason not to treat "I checked it" as the same as "it's checked", and no more than that.

## Make the diff cheaper to check

The fix I'd start with is the one from [my LinkedIn post](https://www.linkedin.com/feed/update/urn:li:activity:7529512783898361856/): write the spec and the acceptance test first, before the prompt, so that there's a check that doesn't depend on someone reading every line. These are practices I'd use, not findings from either survey:

- **The human writes the test, and the agent can't change it.** If the agent writes both the code and its test, the test only shows the code agrees with itself. DeepMind's Signal verification [kept the specification out of the agents' reach](/writing/when-agents-write-the-proof-the-specification-is-the-work) for that reason, and a proof is the far end of what a check can be.
- **The check runs without you.** Whatever you do by hand every time, such as running it locally or clicking through it, is the first candidate to become a test in CI, since it's already the check most people do.
- **Small, scoped changes.** If "low-risk" is [defined by the diff and not the description](/writing/what-makes-a-coding-agents-edit-low-risk), the size and the paths touched are something a machine can enforce.
- **Sample what you didn't read.** If most changes merge on green checks, read a sample each week and count the reverts. That tells you whether the checks are any good, which a green tick can't.

A weak acceptance test can be worse than none, because it adds confidence without adding evidence. Writing a good one is the specification problem again, which was the lesson of the Signal work too.

When the diff arrives faster than you can read it, what is your check?
