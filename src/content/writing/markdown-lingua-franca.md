---
title: "The Quiet Rise of Markdown — From README Files to the Language of AI"
date: "2026-05-06"
description: "How a 2004 blogging tool became the default language of artificial intelligence — and why hundreds of millions of people are reading it every day without knowing it has a name."
tags: ["technology", "AI", "writing"]
---

# The Quiet Rise of Markdown — From README Files to the Language of AI

There's a good chance you've never heard of Markdown.

And there's an equally good chance you've been reading it every single day for the past couple of years. Without knowing it has a name.

That's the strange thing about where we are right now. A syntax invented in 2004 by a blogger — literally created to make it easier to write for the internet — has quietly become the default language of artificial intelligence. It happened gradually, then all at once. And most people who use it daily would have no idea what you're talking about if you called it "Markdown."

Let me explain how we got here.

---

## It Started With a Blogger and a Very Specific Problem

John Gruber created Markdown in 2004. He was a writer. He wanted to write for the web without wrestling with HTML — all those angle brackets and closing tags and ampersand codes. The goal, as he put it, was simple: a document should be readable as-is, as plain text, without looking like it was stuffed with formatting instructions.

So he and Aaron Swartz came up with a shorthand. A hash symbol before a line makes it a heading. Wrap a word in asterisks and it's bold. A hyphen at the start of a line becomes a bullet point. Readable as plain text, renders beautifully as HTML.

It worked. And for a while, it stayed in its lane.

Bloggers used it. Then technical writers found it. Then it spread into developer tools — and that's really where it took root. GitHub launched in 2008 and made Markdown the default for READMEs, issues, pull requests, comments. Suddenly, millions of engineers were writing Markdown every day as part of their workflow. Not because they chose it, exactly. Just because that's how things worked on GitHub.

Stack Overflow adopted a Markdown-flavoured input format. Reddit's post syntax was derived from it. Documentation platforms built on it. The format had quietly become the grammar of technical writing — but it was still largely invisible to anyone who didn't work in software.

Ask a non-engineer in 2022 what Markdown was and you'd mostly get blank stares. Fair enough.

---

## Then LLMs Arrived and Everything Changed

ChatGPT launched publicly in November 2022. By early 2023 it had a hundred million users. And here's the thing nobody talks about much — it talks in Markdown.

Ask ChatGPT to explain something complex. You get headers, bullet points, bold text, code blocks. Organised, hierarchical, formatted. Claude does the same. Gemini too. It's not a coincidence, and it's not just a stylistic choice someone made in a product meeting.

The models learned to do this. From the ground up.

Think about what these models trained on. GitHub has billions of Markdown files. Stack Overflow's answers are Markdown-flavoured. Reddit's posts. Technical documentation across the entire internet. When GPT-4 or Claude trained on the web, they weren't just absorbing language — they were absorbing the idea that structured, well-organised responses look a specific way. And that way was Markdown.

Then comes the fine-tuning phase. This is where human raters sit with model responses and score them. And here's something that makes intuitive sense in hindsight — formatted responses consistently scored higher. A bullet-pointed explanation reads better than a wall of text. A response with a clear heading feels more thorough. Raters kept rewarding structure. Models kept learning to produce it.

That feedback loop ran for months. The result is baked deep into how these models respond.

There's even a funny footnote to this. Researchers noticed that LLMs have a statistically unusual fondness for em dashes in their prose — more than you'd expect from normal English writing. The theory is that em dashes appear disproportionately in the kind of structured, careful writing that Markdown-heavy content tends to attract. The model's structural instincts, absorbed from all that formatted training data, leak into its punctuation. Markdown influencing prose style. That's how deep this goes.

---

## Hundreds of Millions of People Are Now Reading Markdown

Here's the part that genuinely fascinates me.

The people reading ChatGPT responses every day — the vast majority of them are not engineers. They're students, writers, small business owners, curious people who want to know things. They don't know what a fenced code block is. They've never heard of GitHub Flavoured Markdown. They couldn't tell you the difference between a CommonMark renderer and a GFM parser.

But they recognise the structure. The headers feel natural. The bullet points feel right. The formatting feels like it belongs there.

A syntax that engineers treated as their own private shorthand for 20 years is now just how AI communicates. Hundreds of millions of people read it every day. And it's spreading further.

Cloudflare — the company that handles traffic for a significant chunk of the internet — launched a feature in February 2026 called "Markdown for Agents." What it does is interesting. When an AI system comes crawling to a website, Cloudflare automatically converts the HTML page into clean Markdown before serving it. Their reasoning was explicit: a typical blog post in HTML might be 16,000 tokens. The same post in Markdown — stripped of navigation bars, scripts, stylesheets, all the structural noise — comes in around 3,000 tokens.

That's not just an efficiency improvement. That's infrastructure-level acknowledgment that Markdown has become the preferred format for machine-readable content.

This is a format built for human readability becoming the preferred format for AI readability as well. That's unusual. Most things optimised for machines aren't great for humans. Markdown threads that needle in both directions.

---

## What This Means for How We Think About Formatting

There's a sustainability angle here that doesn't get talked about enough.

Every token an LLM processes costs compute. Compute costs energy. At the scale these models operate — billions of queries a day — the overhead of parsing bloated, noisy formats is not trivial. A 20 to 30 percent reduction in token count from Markdown versus raw HTML, across billions of requests, adds up.

We don't have direct peer-reviewed research linking Markdown adoption to measurable energy savings in LLM inference. To be honest. But the logic is sound, the token efficiency data is well-documented, and it's a reasonable inference that deserves more attention than it currently gets.

A format that's easier to read, easier to write, and cheaper to process. That's a rare combination.

---

## The Tools Are Following

The cultural shift is happening away from AI too, even if more slowly.

Obsidian — a note-taking app built entirely on plain Markdown files stored locally on your device — has over 1.5 million active monthly users as of 2025. Growing at 22 percent year-on-year. With no venture capital. The people using it aren't all developers. Writers, researchers, students, academics — people who want their notes to be portable, permanent, and owned by them rather than locked in some company's proprietary format.

Notion, which operates on Markdown-adjacent principles, serves over 100 million users.

These tools didn't grow because people went looking for Markdown specifically. They grew because Markdown turns out to be an elegant way to create well-formatted documents without the bloat of traditional word processors. Once you get comfortable with the basics — and the basics really are basic — it clicks. The syntax disappears. You're just writing.

AI has accelerated this. People who interact with ChatGPT and Claude long enough start to absorb the formatting instinctively. The headers, the bullets, the hierarchy. Some of them start using it in their own writing. Not because they know it's Markdown. Just because it works.

---

## Where This Goes

It's hard to predict with confidence. But a few things seem likely.

Markdown literacy is going to keep spreading, mostly through osmosis. Not through tutorials or deliberate learning — just through daily exposure to AI-generated content. The conventions will feel more and more natural to more and more people.

The tooling is going to follow that. Applications that render Markdown cleanly, that make it easy to write and share formatted documents without friction, are going to find growing audiences outside the traditional developer space. The gap between "technical format" and "everyday writing tool" will narrow.

And the AI side of this will get more explicit. The `llms.txt` standard — a proposal for websites to provide a Markdown-formatted file specifically for AI consumption — is a sign of where content infrastructure is heading. Sites that want to be legible to AI will think about Markdown the way they currently think about SEO. It'll become part of how you publish.

---

## The Strange Thing Is That Nobody Planned This

There was no committee that decided Markdown would become the lingua franca of AI. No standards body. No product roadmap at any major company that said "let's make this the default output format of large language models."

It just happened. Because a format created for human readability turned out, by a kind of elegant accident, to be exactly what machine intelligence needed too. The same properties that made Markdown appealing to a blogger in 2004 — clean structure, minimal noise, human-readable even as plain text — make it ideal for training data, for model output, for AI-readable content.

John Gruber built a better way to write for the internet. And twenty years later, the internet's AI layer adopted it as its native tongue.

That's a strange and genuinely interesting moment in the history of how we communicate. And we're right in the middle of it.

Most of us just don't know what to call the thing we're living through.

It's called Markdown.
