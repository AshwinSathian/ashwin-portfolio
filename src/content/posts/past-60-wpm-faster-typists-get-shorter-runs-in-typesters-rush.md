---
title: "Past 60 WPM, faster typists get shorter runs in Typester's Rush"
date: "2026-11-24"
description: "Rush gives you 15 seconds and every word you finish buys more. Running the game's own engine with simulated typists shows what those rules pay for: word length drops out of the sums, runs get longer up to about 60 WPM and shorter after it because of a 30-second cap, and accuracy outweighs speed by a wide margin."
seoDescription: "Simulating a typing game's time bank: break-even speed per level, how a 30 s cap shortens fast runs, and why the combo multiplier rewards accuracy."
tags: ["typescript", "gamedev", "algorithms"]
---

A game's rules make a claim about what's worth getting good at, whether the person writing them meant one or not. A scoring formula is a small economy. Players work out what it pays for without reading any code, and they play towards that - so it helps to know what it pays before they do.

[Typester](https://typester.ashwinsathian.com) is my typing game, and its main mode, Rush, is built on a time bank. You start with 15 seconds. Each word you finish adds time, each wrong key takes 400 ms away, and the run ends when the bank is empty. The game's own notes call it a game "where every word buys time" and promise that "every run ends". Both are true. Who the bank favours is harder to see. For this post we took the engine out of the app and ran simulated typists through it at different speeds and error rates, and some of the answers aren't what the rules seem to say at first reading.

## The rules, as the engine writes them

The rules live in `core/engine.ts` and `core/words.ts`, neither of which imports Angular, and the engine takes the time as an argument (`press(char, now)` and `tick(now)`). That made this easy - the simulation drives the same `Run` class the game does, with a clock that only moves when the script says so.

The time a word buys is one function:

```ts
/** Time a completed word adds to the bank. Shrinks 12% per level, so even
 *  the fastest typist eventually runs dry. */
export function bonusMsFor(word: Word, level: number): number {
  const perLetter = 520 * Math.pow(0.88, level - 1);
  return Math.round(word.text.length * perLetter * (word.gold ? 1.5 : 1));
}
```

Level goes up every six words (`WORDS_PER_LEVEL = 6`), and the word supply in `core/words.ts` widens the length band as levels go up, from 3 to 5 letters at the start towards long words later. Gold words turn up with an 8% chance per word (never the first one), pay 1.5 times the time and score double.

The cap comes in when a word finishes, and clips the bonus to whatever room is left under 30 seconds:

```ts
if (this.rules.clock === 'bank') {
  const room = BANK_CAP_MS - this.remaining(now);
  bonusMs = Math.max(0, Math.min(bonusMsFor(word, level), room));
  this.endsAtMs += bonusMs;
}
```

The constant's comment states its purpose: "The bank can never hold more than this, so a strong start can't coast."

Scoring doesn't touch the clock at all. A word is worth its letters times 10, times the combo multiplier, doubled if it's gold:

```ts
const points = word.text.length * 10 * multiplierFor(this.combo) * (word.gold ? 2 : 1);
```

The multiplier climbs from ×1 to ×5 at 20, 50, 100 and 180 clean keystrokes in a row (`COMBO_STEPS = [0, 20, 50, 100, 180]`), and any miss drops the combo to zero.

## Word length cancels out

Start with a sum you can do on paper. A word of `n` letters buys `n * 520 * 0.88^(level-1)` ms. If you take `t` ms per keystroke, it costs you `n * t` ms to type. The bank grows when the first number beats the second, and `n` is on both sides, so it divides out. All that's left is whether your time per keystroke is under `520 * 0.88^(level-1)`.

So the length of a word has nothing to do with whether it pays to type it - not as far as the clock goes, anyway. The mode's blurb on the home screen says "Words get longer and buy less of it", and the second half is true per level, but the longer word itself pays exactly as much per letter as a short one at the same level. What makes the bank shrink is the level count and nothing else. (Longer words are harder for a real person, and the sum doesn't know that. More on that below.)

That turns break-even into a speed per level. Converting milliseconds per keystroke into words per minute at five keystrokes a word gives `12,000 / perLetter`:

| Level | ms a letter buys | Break-even speed |
| --- | --- | --- |
| 1 | 520 | 23 WPM |
| 4 | 354 | 34 WPM |
| 8 | 213 | 56 WPM |
| 10 | 165 | 73 WPM |
| 13 | 112 | 107 WPM |
| 16 | 76 | 157 WPM |

Below break-even the bank drains, above it, it fills. A 60 WPM typist gains time on every word up to level 8 and loses it from level 9 on. And a 150 WPM typist stays ahead until about level 16, which is 90-odd words in. Gold words shift this slightly. One word in about twelve pays half as much again, which lifts the average pay by about 4% and the break-even speeds with it. Either way, everybody crosses the line eventually. That's the promise in the `bonusMsFor` comment, and the 12% decay keeps it.

## The simulation, and what it assumes

The script imports `engine.ts`, `words.ts` and the bundled list of 3,141 words, and plays Rush with a simulated typist. Its assumptions, stated plainly because the results depend on every one of them:

- The typist presses one key every `t` ms, steadily, for the whole run, with no gap between words and no slowdown on long words or late levels. Every speed in this post is keystroke WPM, i.e. keystrokes per minute divided by 5. Typester's own meter reads 11 to 13% higher (the last section explains why), so 60 keystroke WPM shows as about 67.
- A miss is a wrong key pressed instead of the right one, chosen at random at a fixed rate, independent of everything else. In Typester a wrong key never enters the word, so a miss is an extra keystroke that costs 400 ms and the combo, and the typist then presses the right key.
- Words come from the game's real `levelledSupply`, gold words included, seeded so a run can be repeated - it's the same supply a real Rush uses, just with a fixed seed. Every figure below is the mean of 200 seeds, measured in Node 24, and scores are rounded to the nearest thousand because they move by several percent from one set of seeds to the next.
- The tab is never hidden, so the run never pauses.

Real people break all of these. Every one. They slow down on twelve-letter words, make errors in clusters, get tired, rush when the clock runs low. The game keeps scores only in the browser, so there aren't any real runs to check any of this against. What the simulation shows is what the rules reward for an idealised typist - read it that way.

## Faster typists get shorter runs

A perfect Rush run, no misses at all, lasts this long at different speeds. The second column is the game as it ships. The third changes one number in a copy of the engine, setting `BANK_CAP_MS` to a billion, and runs the same typists again.

| Keystroke WPM | Run length | Without the cap | Bonus clipped by the cap |
| --- | --- | --- | --- |
| 30 | 110 s | 110 s | 0 s |
| 40 | 140 s | 148 s | 4 s |
| 50 | 144 s | 170 s | 16 s |
| 60 | 144 s | 184 s | 27 s |
| 80 | 138 s | 196 s | 46 s |
| 100 | 131 s | 201 s | 60 s |
| 150 | 114 s | 205 s | 84 s |
| 200 | 102 s | 205 s | 99 s |

Without the cap, runs get longer with speed and level off at about 205 seconds. But with it, run length peaks at 50 to 60 keystroke WPM, about 144 seconds, and falls from there. A flawless 200 WPM typist's run is over in 102 seconds. That's nearly 40 seconds sooner than a 40 WPM typist's.

The last column explains it. A fast typist fills the bank to 30 seconds within the first few seconds of play (in one seeded run, the 100 WPM typist hits the cap 4.8 seconds in, on level 2) and then spends the early levels throwing away time the rules say they've earned. By the end of the run the 100 WPM typist has had 60 seconds of bonus clipped. That's twice the whole bank. Then the levels arrive faster in wall-clock time, because a fast typist finishes six words sooner, and each level cuts the pay by 12% whatever the clock says. So the fast typist reaches the levels where they lose time sooner, and does it with no more than 30 seconds in hand, the same as everyone else.

So the cap does its job. "A strong start can't coast" is exactly what the second column shows - nobody, however quick, can bank two minutes in the opening and live off it. The side effect is that how long you survive stops measuring how fast you type once you're past about 60 WPM. Past that it runs backwards, and a quicker typist won't last as long.

Score doesn't fall, though. It keeps rising with speed even with the cap, from about 21,000 points at 40 WPM to 55,000 at 100 and 88,000 at 200, because a faster typist finishes more words in a shorter run (134 words at 100 WPM, 200 at 200). The fast run's shorter and still scores more.

## Accuracy outweighs speed

The multiplier is where misses really cost, and it's where the economy leans hardest. The same simulation gives these mean scores at different error rates:

| Keystroke WPM | No misses | 0.5% | 1% | 2% | 5% |
| --- | --- | --- | --- | --- | --- |
| 40 | 21,000 | 17,000 | 13,000 | 10,000 | 6,000 |
| 60 | 35,000 | 27,000 | 21,000 | 16,000 | 10,000 |
| 80 | 46,000 | 35,000 | 28,000 | 20,000 | 12,000 |
| 100 | 55,000 | 41,000 | 33,000 | 24,000 | 15,000 |
| 150 | 73,000 | 55,000 | 43,000 | 31,000 | 19,000 |

Read along the rows first. One miss in 200 keystrokes costs between a fifth and a quarter of the score. At 2% misses (98% accuracy) a typist keeps 40-odd percent of what a flawless run at the same speed makes. Then compare rows. A 60 WPM typist who never misses scores about 35,000, and a 150 WPM typist missing 2% scores about 31,000. Less, at two and a half times the speed. The 40 WPM typist with no misses scores about what an 80 WPM typist at 2% gets.

Why so steep? The combo steps. ×5 needs 180 clean keystrokes in a row, and at a 2% miss rate the average gap between misses is 50 keystrokes. If we count where the keystrokes land for the 100 WPM typist at 2%, it's 34% at ×1, 31% at ×2, 23% at ×3, 10% at ×4 and 2% at ×5. At 1% the same typist spends about 14% of the run at ×5. That fits the arithmetic: with misses independent, the chance of 180 clean keys in a row is 0.98^180 at 2%, under 3%. Points scale with the multiplier directly, so a typist who can hold ×5 earns five times as much per letter as one who keeps falling back to ×1. Speed scales points too, of course - but only through the number of words, and the cap has already limited how long a fast run lasts.

Misses barely move the clock, though. At 100 WPM going from no misses to 5% shortens the run from 131 to 118 seconds. A miss costs 400 ms and one keystroke of time, and the bank doesn't take long to recover from that.

## The WPM on the results screen

One more number in the economy, and a small one. The results screen and the meter show WPM from this:

```ts
/** Words per minute, counting a word as five characters and crediting one
 *  space per finished word, the usual convention. */
export function wpm(chars: number, words: number, elapsedMs: number): number {
  if (elapsedMs < 1000) return 0;
  return Math.round((chars + words) / 5 / (elapsedMs / 60_000));
}
```

Crediting a space per word is the usual convention in typing tests, where you have to press the space bar to move on. Typester never asks for the space bar - finishing the last letter completes the word, and the engine ignores a space if you press one. The space is never typed. It's credited anyway, so the number shown is higher than the rate of keys actually pressed. In the simulation a 100 WPM keystroke rate shows as 112 WPM, and 30 shows as 34. That's about 11 to 13%, shrinking a little as words get longer at later levels. So a Typester WPM and one from a test where you've had to press the space bar every time aren't quite the same number.

## What the rules pay for

Put together, Rush pays for clean streaks first and speed second, and survival time peaks at about 60 keystroke WPM, or 67 on the meter. The Daily runs on the same rules (the same 15-second bank, with the words seeded by the date), so all of this holds there too. Sprint and Drill run on fixed clocks of 60 and 45 seconds, so the bank arithmetic doesn't apply to them, though the multiplier does.

None of this is code doing something it wasn't told to do. Each rule does what it says.

Whether that's the right thing for a typing game to reward is an open question. Rush leans towards accuracy far harder than its "every word buys time" pitch suggests. But a 200 WPM typist who plays a flawless run, and lasts nearly 40 seconds less than someone typing at a fifth of the speed, could fairly ask what they're being timed for.
