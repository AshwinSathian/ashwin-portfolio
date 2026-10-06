---
title: "How Do You Check an Answer When Nobody Agrees How to Spell It?"
date: "2026-08-28"
description: "Building a fuzzy answer-checker for a Malayalam movie quiz, and finding a real bug in my own work three rounds in a row."
tags: ["typescript", "nlp", "claude", "buildinpublic"]
---

I'm building a daily game called Etha Padam. You get five clues about a Malayalam movie, hardest first, and you can answer as soon as you're confident. The earlier you get it, the higher your score. The hard part turned out to be the text box where someone types the answer.

There's no agreed way to type Malayalam in English letters. Ask five people how to spell "achan" (father, roughly) and you might get achan, acchan, achchan, and two more I haven't thought of yet. None of them is wrong. Manglish was never designed. It came about because people needed to text each other faster than a Malayalam keyboard allows, so there's no standard to be wrong against.

So if the correct answer in my database says "Pottu" and someone types "Pote," is that right or wrong? A plain string comparison says wrong. A Malayalam speaker would tell you it's obviously the same word.

## Okay but surely someone's solved this already

Partly. Varnam is a project that does real transliteration, turning your Manglish into Malayalam script as you type, and it's well built. MLphone is a smaller tool that generates phonetic keys for Malayalam words, a Soundex for Malayalam. I read through both before writing a line of code.

Neither one solves my problem. Varnam uses a dictionary to guess which real Malayalam word you meant, and a movie title is a proper noun that isn't going to be in anyone's dictionary. MLphone works on Malayalam Unicode text, and my input is the Manglish someone just typed into a text box.

## The one thing that made this easier than it sounds

It took me an embarrassingly long time to see that I don't need to search anything. Every clue set has one correct answer, plus a short curated list of alternate spellings I already accept for it. I only need to know whether the guess is close enough to any of those.

A general search tool checks your guess against thousands of words at once, so it has to worry about two different words colliding into the same phonetic key. I only ever check against a handful, all for the same movie. If my rules are a little aggressive and fold two different sounds together, it almost never matters, because there's no unrelated word around to confuse the guess with. That's why I could build something this loose and still trust it.

## The approach, roughly

Take the guess and the correct answer and run both through the same pipeline. Lowercase everything, strip out punctuation, turn "twenty eighteen" into "2018," and collapse "C.I.D" and "C I D" into "cid."

Then a handful of rules fold known Manglish variation into one shape. Aspirated and unaspirated sounds get typed the same way, so "kh" and "k" fold together, and so do "th" and "t." Doubled letters fold too, because "achan" and "acchan" are the same word typed with different levels of enthusiasm about that middle consonant. If both strings land on the same key, it's a match.

If they don't, I run a distance check between the two keys (not the raw strings), one where swapping two vowels costs very little and swapping a vowel for a consonant costs a lot. If the distance is small enough for how long the words are, the guess counts as close, not exact. In the product, that's the moment to ask "did you mean X?" instead of silently accepting or rejecting.

None of this needs a dictionary, the internet, or a model. It's regex and dynamic programming, which was sort of the point.

## This is the part where I got humbled, more than once

I wrote the rules, traced a few words through them by hand, felt good about it, and handed the spec to Claude Code to build.

The first thing it came back with was "your spec doesn't do what you think it does." Three of my own required test cases couldn't pass with the rules as I'd written them. "Pottey" and "Pottu" don't converge. "Muvi" and "Movie" don't converge. I had described a rule that was supposed to handle these and then never written it. It was easy to fix once it was pointed out, and I'd much rather have my homework checked while the bug is still in a design doc than find it in production.

We fixed it, and the tests passed.

Then I went looking for edge cases myself, because by this point I didn't trust myself not to have left another gap, and I had. An empty guess, or one that's only punctuation, could come back as "close enough" against a very short answer, because an empty string and a one-letter word aren't far apart in edit distance. I added a guard for that.

The guard had its own gap. Some correct answers, once they go through a rule that strips trailing vowels, strip down to nothing at all. So an empty guess and a correctly typed guess for that answer could both end up as the empty string, hit my new guard, and get rejected. My fix for one bug had made room for a worse one, where a completely correct answer is marked wrong. I only found it because I deliberately tried to break my own fix.

That's three rounds with a real bug in each. The first surfaced when Claude Code tried to make my own test cases pass, and the other two when I went looking for edge cases myself. None of them would have shown up in a demo. They're the kind of bug that turns up much later as a support ticket nobody can reproduce.

## What I'm taking from this

It would be easy to read this as "AI wrote buggy code," but the bugs were mine. I wrote the original spec with the gaps already in it. What interests me more is that a green test suite told me the code was fine twice and was wrong both times, because the tests I'd asked for weren't the tests that would have caught the bugs.

What worked was not stopping at "tests pass" and asking instead: what happens on an empty string, what happens if this answer is nothing but vowels, what happens at the edges nobody thought to write a test for? None of that is specific to Claude or to AI. It's what checking your own work involves, and it matters as much when a tool wrote most of the code as when it didn't.

The matcher is live in Etha Padam now. Every guess a player submits is checked first against the correct answer and then against the alternates I've curated for that clue set. Every outcome is logged, so over time I can see where the "close" calls land and whether the rules need adjusting. It isn't published anywhere on its own, and I'm in no hurry to change that. I'd like it to stay boring and correct at its one job for a while before I try to turn it into something more general.
