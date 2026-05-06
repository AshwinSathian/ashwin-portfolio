---
title: "Wait, Is Markdown Having a Moment?"
date: "2026-05-06"
description: "A format invented by a blogger in 2004 to avoid wrestling with HTML has quietly become the default language of artificial intelligence. Most people using it every day have never heard its name."
tags: ["technology", "AI", "writing"]
---

There's a good chance you've never heard of Markdown.

And there's an equally good chance you've been reading it every single day for the past couple of years. Without knowing it has a name.

That, to me, is the fascinating part of where we are right now. A format invented in 2004 by a blogger — literally built so a guy could write for the internet without wrestling with HTML — has quietly become the default language of artificial intelligence. Most of the people who encounter it daily would have no idea what you're talking about if you called it "Markdown."

So. How did we get here?

---

## A Blogger, a Very Specific Annoyance, and a Brilliant Shorthand

John Gruber created Markdown in 2004. He was a writer. He wanted to write for the web without the overhead of HTML — all those angle brackets, closing tags, and ampersand codes for a simple apostrophe. Nightmarish stuff.

So he and Aaron Swartz came up with a shorthand. A hash symbol before a line makes it a heading. Wrap a word in asterisks and it's bold. A hyphen at the start of a line becomes a bullet point. The goal, as Gruber put it, was that the document should look fine even as raw plain text — before it's rendered into anything. No formatting instructions bleeding through. Just clean, readable writing.

It worked. And for a while, it stayed in its lane.

Bloggers used it. Then technical writers found it. Then GitHub happened.

GitHub launched in 2008 and quietly made Markdown the default for READMEs, issues, pull requests, comments. Overnight — well, over a few years — millions of engineers started writing Markdown daily as a part of normal work. Not because they made some deliberate choice. Just because that's how things worked on GitHub.

Stack Overflow adopted a Markdown-flavoured input. Reddit's post syntax was derived from it. Technical documentation platforms built entire ecosystems on it. The format had become the grammar of engineering writing.

But here's the thing. It was still almost entirely invisible to anyone outside software. Ask a non-engineer what Markdown was in 2022 and you'd get a very polite blank stare. Fair enough, honestly.

---

## And Then ChatGPT Showed Up (You Knew This Was Coming)

ChatGPT launched publicly in November 2022. A hundred million users in two months. Wild number.

And here's the thing nobody really talks about — it talks in Markdown.

Ask it anything remotely complex and the response comes back with headers, bullet points, bold text, code blocks. Structured, hierarchical, formatted. Claude does the same. Gemini too. It's not a coincidence, and it's not just some design decision a product manager made.

The models learned to do this. From the ground up.

Think about what these models trained on. GitHub has billions of `.md` files. Stack Overflow's answers are Markdown-flavoured. Reddit. Technical documentation across the entire web. When these models ingested the internet, they weren't just absorbing language — they were absorbing the idea that a well-organised, thorough response looks a specific way. And that way, overwhelmingly, was Markdown.

Then came fine-tuning. This is the phase where human raters sit with model responses and score them. And here's something that makes complete sense in hindsight — formatted responses consistently scored higher. A bulleted explanation reads better than a wall of text. A response with a clear heading feels more thorough, more useful. Raters kept rewarding structure. Models kept learning to produce more of it.

That feedback loop ran for months. And now it's baked deep into how these systems respond.

Here's a small, slightly nerdy footnote I love. Researchers noticed that LLMs have a weirdly high fondness for em dashes in their prose — more than you'd expect from regular English writing. The theory is that em dashes appear disproportionately in the kind of careful, structured writing that Markdown-heavy content tends to attract. So the model's structural instincts, absorbed from all that formatted training data, leak into its punctuation. Markdown influencing prose style, at a level the model itself has no awareness of.

That's how deep this goes.

---

## Okay, But What Does That Actually Mean for Regular People?

Here's the part that genuinely stops me.

The people reading ChatGPT or Claude responses every day — most of them are not engineers. They're students, writers, small business owners, curious people who want answers. They don't know what a fenced code block is. They've never heard of GitHub Flavoured Markdown. They couldn't tell you what a CommonMark renderer does if you offered them money.

But they recognise the structure. The headers feel natural. The bullet points feel right. The formatting feels like it belongs there.

A syntax that engineers treated as their private professional shorthand for two decades is now just how AI talks to the world. Hundreds of millions of people read it every day. Most of them have never heard its name.

And it's not just at the consumer level either.

Cloudflare — the company that sits between a huge chunk of the internet and the people accessing it — launched a feature in February 2026 called "Markdown for Agents." What it does is tell you a lot. When an AI system comes crawling to a website, Cloudflare automatically converts the HTML page into clean Markdown before serving it. Their reasoning was explicit: a typical blog post in HTML might clock in at 16,000 tokens. The same post in Markdown — stripped of navigation bars, scripts, stylesheets, all the noise that means nothing to a machine — comes in around 3,000 tokens.

That is infrastructure-level acknowledgment that Markdown has become the preferred format for machine-readable content. Cloudflare didn't build that feature for fun. They built it because it matters.

---

## Wait, Is This Actually a Sustainability Thing Too?

Bit of a tangent, bear with me.

Every token an LLM processes costs compute. Compute costs energy. At the scale these models operate — billions of queries every day — the overhead of parsing bloated, noisy formats is not a trivial thing. Research comparing different formats has found Markdown to be meaningfully more token-efficient than alternatives. A lot more efficient than XML. A lot more efficient than raw HTML. Even JSON comes in heavier.

Now, I'll be honest — there isn't peer-reviewed research that directly connects Markdown adoption to measurable energy savings in LLM inference specifically. Not yet, anyway. But the logic holds together. Fewer tokens processed at massive scale means less compute, which means less energy. It's an inference, not a proven fact, and I'd rather tell you that than pretend otherwise.

But it's a reasonable inference. And it deserves more attention than it currently gets.

---

## So Are Regular People Actually Picking Up Markdown? (Sort of, Yeah)

The cultural shift is happening away from AI as well, even if more quietly.

Obsidian — a note-taking app built entirely on plain Markdown files, stored locally on your device, owned by you — has over 1.5 million active monthly users as of 2025. Growing at 22 percent year on year. No venture capital. The people using it aren't all developers by a long stretch. Writers, researchers, students, academics — people who want their notes to be portable, permanent, and not locked inside some company's proprietary format that might disappear in three years.

Notion, which operates on Markdown-adjacent principles, serves over a hundred million users.

These tools didn't grow because people went searching for Markdown specifically. They grew because Markdown turns out to be an elegant way to create well-formatted documents without the bloat and friction of traditional word processors. Once you get the basics down — and really, the basics are not hard — the syntax disappears. You're just writing.

AI is accelerating this in a quiet way. People who interact with ChatGPT and Claude long enough start absorbing the formatting instinctively. The headers, the bullets, the hierarchy. Some of them start using it in their own writing. Not because they know it's Markdown. Just because it works.

---

## Where Does This Actually Go From Here?

Genuinely hard to say with confidence. But a few things seem likely enough to put on record.

Markdown literacy is going to keep spreading, mostly through osmosis. Not through tutorials or anyone deliberately learning it — just through daily exposure to AI-generated content that's formatted this way. The conventions will feel more natural to more people over time.

Tooling will follow. Applications that render Markdown cleanly and make it easy to write and share well-formatted documents without friction are going to find growing audiences well outside the traditional developer space. The gap between "technical format" and "everyday writing tool" is going to narrow.

And on the AI infrastructure side — there's a proposal called `llms.txt`, essentially a standard where websites provide a Markdown-formatted file specifically for AI consumption. Think of it like `robots.txt`, but for feeding content to language models cleanly. Sites that want to be legible to AI are going to think about Markdown the way they currently think about SEO. It's going to become part of how you publish for the web.

---

## Here's the Thing That Gets Me, Though

Nobody planned this.

There was no committee. No standards body that sat down and decided Markdown would become the lingua franca of AI. No roadmap at any major tech company that said "let's make this the default output format of large language models."

It just happened. Because a format created for human readability turned out, by a kind of elegant accident, to be exactly what machine intelligence needed as well. The same properties that made Markdown appealing to a blogger in 2004 — clean structure, minimal noise, readable even as plain text — make it ideal for training data, for model output, for AI-readable content.

John Gruber built a better way to write for the internet. Twenty years later, the AI layer of that internet adopted it as its native tongue.

That's a strange and genuinely interesting thing to sit with. We're right in the middle of a quiet shift in how structured information moves around — and most people experiencing it have no idea what the thing doing the shifting is even called.

It's called Markdown.

And it might just be having its moment.
