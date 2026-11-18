---
title: "What makes a coding agent's edit low-risk?"
date: "2026-11-18"
description: "Cognition's Devin Bots let teams decide which changes merge without a human. Why an approval prompt isn't that rule, and what I'd write down before an agent gets write access."
seoDescription: "Devin Bots leave auto-merge rules to the team. Why click-through approval fails, and the five rules I'd write down before a coding agent gets write access."
tags: ["ai", "agents", "softwareengineering", "claude"]
---

Cognition launched Devin Bots on 17 November: persistent agents that own an outcome, start Devin sessions to work on it, and keep going for days or weeks. The part I keep rereading is in [Fortune's report](https://fortune.com/2026/11/17/exclusive-cognition-bets-on-devin-bots-coding-agents-in-challenge-to-anthropics-duet-and-openais-dots/). Teams decide which changes need human review, and low-risk edits, the example given is changing a button's colour, can be set to approve and merge on their own. Cognition's CEO, Scott Wu, says the safeguards rely on "rules companies set and monitor, rather than relying on models themselves being smart enough to recognize a risky or malicious prompt."

That's a reasonable design. It also makes the rules your job, and the product hasn't written them for you.

## What the docs give you, and what I couldn't find

The [Bots docs](https://docs.devin.ai/work-with-devin/bots) describe a "Needs you" list: decisions, pull requests to review or merge, and permission requests. A permission request is the Bot asking to approve something it can't do alone, such as new access, an automation, a network host or a usage-limit increase. Each Bot also has [its own usage limit](https://docs.devin.ai/work-with-devin/bots/usage-limits.md), though on Enterprise the docs say a Bot's limit only stops it when budgets and user limits are enabled for the whole enterprise. So that's a setting worth confirming, not assuming.

What I didn't find is a page on auto-merge rules. It may exist elsewhere, and Cognition's [launch post](https://devin.ai/blog/introducing-devin-bots) says engineers define "when spending or releases require approval". But "low-risk" is left to you to define, and I couldn't find published defect or rollback rates for Bots, so there's no outside number to calibrate against either.

## Don't fill the gap with a click

The obvious default is a prompt a person clicks through. [Anthropic's own data](https://claude.com/resources/articles/auto-mode-default-in-claude-code) is the best measurement of that I've found. Users approve 97% of Claude Code permission prompts (an earlier engineering post put it at 93%). In a study, 1,053 paid testers had one prompt swapped for a clearly dangerous command, and 143 of them caught it, 13.6%. They did worse as sessions got longer: about 17% caught early, about 5% after fifty or more prompts.

Take it with the caveats Anthropic gives. It was a test environment, the testers knew they were being evaluated, and auto mode is Anthropic's own product (which, in the same study, blocked 89%). Anthropic is also candid that the classifier isn't "a drop-in replacement for careful human review on high-stakes infrastructure". So the comparison isn't human against model. It's that a person asked to approve everything ends up approving everything, which makes the prompt a queue and not a control.

The point for Bots is that a rule has to be something a machine can check, and a human only gets involved where the rule says they must. "A human reviews risky changes" isn't a rule until someone has defined risky.

## What I'd write down before a Bot gets write access

1. **Autonomy per action.** Read, push to a branch, merge, get new access, spend. Each one gets its own setting, since "can write code" covers all five.
2. **"Low-risk" defined by the diff, not the description.** Paths touched, lines changed, tests green. The description is written by the same agent that made the change, so it can't be the evidence for it.
3. **Never auto-approved.** New access, new network hosts, higher limits, and anything touching auth, payments or migrations.
4. **A spend limit per Bot, and one named human who owns it.** A limit nobody is responsible for gets raised by whoever is blocked by it.
5. **A weekly read of a sample of auto-merged PRs, plus a count of reverts.** Widen the policy only when that sample is boring.

Some of this you can enforce today without any vendor's help. On GitHub, a `CODEOWNERS` file combined with branch protection that requires code-owner review makes the "never auto-approved" paths mechanical, whoever opens the PR:

```text
# .github/CODEOWNERS (needs "Require review from Code Owners" in branch protection)
/src/auth/        @your-org/security
/src/payments/    @your-org/payments
/migrations/      @your-org/data
```

And the weekly read starts from two commands you can run against the bot's account (swap in its real username):

```sh
gh pr list --state merged --search "author:<bot> merged:>=2026-11-11" --limit 200
git log --since="1 week ago" --oneline --grep='^Revert "'
```

The paths and team names above are placeholders of mine, not anything Devin ships. The point is only that rules 3 and 5 can live in the repository and not in a settings page.

I'd start narrow. A first rule that only auto-merges documentation and copy changes with passing tests is dull, and dull is what the weekly sample should look like before it gets any wider.

What's your auto-merge rule today, if you have one?
