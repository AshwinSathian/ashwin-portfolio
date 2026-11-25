---
title: "Reverting a commit doesn't recall a key"
date: "2026-11-25"
description: "A coding agent committed a credential for a private Hugging Face repo to Together AI's public GitHub repo. Scanning caught it and the commit was reverted, but someone had the key during the exposure window. What a revert leaves behind, what Hugging Face and GitHub offer on the credential side, and the order I'd respond in."
seoDescription: "An AI agent committed a credential to a public repo, and someone used it. What a revert leaves behind, and the credential fixes that hold."
tags: ["ai", "agents", "security", "git", "softwareengineering"]
---

Together AI's scanner caught a credential an AI coding agent had committed, and the commit was reverted. During the exposure window, someone took the key and used it.

That's the short version of a [security notice](https://www.together.ai/blog/security-event-prompt-leakage-for-requests-in-june-and-july-of-2026) Together published on 21 November, written by its CEO, Vipul Ved Prakash. An agent committed a credential to `xorl`, the company's public GitHub repository. The credential opened a private Hugging Face repository holding prompt samples, collected during routine testing from requests to the MiniMax M3, GLM-5.2 and Kimi K2.6 models, mostly on 24 June and 4, 8 and 14 July. "Our automated scanning detected the exposed credential, and we reverted the commit." During what the notice calls the exposure window, an unauthorised party took the credential, downloaded the samples, searched them for credentials to other services and tested whether those worked.

The notice leaves a fair amount out. It doesn't name the agent or the kind of credential, and it doesn't say how long the window lasted, whether the key was used before or after the revert, or when it was revoked; it only says the commit was reverted. Whether personal data was in the samples is still under review. So what follows is about the mechanism, and not about what Together did or didn't do in the hours that mattered.

## A revert is one more commit

`git revert` doesn't remove anything. It adds a commit that undoes the change, and the original commit stays in the history, with the secret in it, for anyone who has fetched or can fetch the repo.

It's easy to see in a throwaway repo. Commit a file holding a fake Hugging Face token, revert it, and the working tree is clean again. Then ask git and a scanner:

```sh
# output trimmed; rule and commit from gitleaks -v
$ git log --oneline -S "$TOKEN"
3dfcb28 Revert "add config"
8381b80 add config

$ gitleaks dir .   # files on disk only
no leaks found     # exit 0

$ gitleaks git .   # every commit
leaks found: 1     # exit 1, rule huggingface-access-token, commit 8381b80
```

Both commits contain the token, one adding it and one taking it out, and gitleaks flags the one that added it. A scan of the checkout passes after the revert, so a check that only looks at files on disk will tell you the problem is gone.

Rewriting history doesn't settle it either. GitHub's own guide to [removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository) says that after a rewrite and force push the commits may still be reachable in clones and forks, "Directly via their SHA-1 hashes in cached views on GitHub", and through pull requests that reference them. Support can clear cached views, but only where the risk "can't be mitigated by rotating affected credentials". That's why the guide's first step is to "revoke and/or rotate that secret", and why it says the rewrite "may not be warranted".

## What the credential side offers

Together's first fix is "scoped or short-lived credentials, and keyless access where supported". The notice doesn't say what kind of credential leaked, but a Hugging Face access token is the likeliest, and the Hub's [token docs](https://huggingface.co/docs/hub/security-tokens) give you three levers on one.

Fine-grained tokens can be limited to specific resources, "such as a specific model or models in a specific organization", and Hugging Face recommends "using only fine-grained tokens for production usage". A `read` or `write` token reaches every repository its owner can. Expiry is weak: tokens that "haven't been used for a year expire automatically", so a token in regular use lives until someone deletes it. And anyone can kill a leaked one. `POST /api/credentials/revoke` invalidates a token immediately, and you "don't need any rights over the account or organization that owns the token".

Keyless exists, though only for CI. [Trusted Publishers](https://huggingface.co/docs/hub/trusted-publishers) lets a CI job swap its provider's OIDC token for a Hugging Face token that lasts an hour, and the page sums up the cost of a leak as "At most ~1 hour, and scoped to one repo." Nothing is stored for an agent to find. An agent running inside that job can still read the token and commit it, but the damage has a clock on it. An agent on a laptop still needs a fine-grained token.

GitHub has the matching half. Hugging Face user and organisation tokens are [partner patterns](https://docs.github.com/en/code-security/secret-scanning/introduction/supported-secret-scanning-patterns) with push protection support, and for partner secrets GitHub will "notify the provider so they can take action, such as revoking the credential". Push protection for users is on by default and "Stops you from pushing secrets to public repositories on GitHub", though you can push past it, and unless the repository has push protection on too, nobody is alerted. Since the notice doesn't say what the credential was or how the agent pushed, I can't tell you why none of this stopped it. It's still the first thing I'd check on my own repos.

## The second leak was in the prompts

The part of the notice I'd read twice is what the intruder did next. They didn't stop at the prompts. They searched them for more credentials and tried those. Five of the ones they tested were canary credentials "associated with a Dragos security experiment". A canary exists to raise an alarm when someone uses it, though the notice doesn't say whether that's how the testing came to light, or whether any real customer keys were in there.

Some people paste API keys into prompts, so a store of raw prompts can turn into a store of other people's credentials without anyone meaning it to. Together's answer is to make zero data retention the default for new accounts, and to tell customers handling sensitive prompts to turn it on. If you keep prompt samples for testing, scan them for secrets the way you'd scan a repo, and give the store its own short-lived credential.

## What I'd change

Detection only tells you a key is out. So I'd put the work where the credential lives:

1. **Nothing long-lived in the agent's reach.** If the agent's environment has no Hugging Face token (no `HF_TOKEN`, and no saved login in `~/.cache/huggingface/token`), it can't commit one. Where a job needs Hub access, use a Trusted Publisher or a fine-grained token scoped to the one repo.
2. **Block before the push, and close the bypasses.** A pre-commit hook running `gitleaks git --staged` fails on the commit itself. Both it and push protection can be skipped, though: `git commit --no-verify` ignores the hook (and so can an agent, unless its permissions deny it), hooks in `.git/hooks` don't come with a clone, and a bypass of user push protection raises no alert. So deny `--no-verify` in the agent's permissions, install the hook as part of setup, and turn on push protection for the repository, which alerts on every bypass.
3. **Scan history, not the checkout.** In CI, run `gitleaks git` on a full clone (`fetch-depth: 0` on GitHub Actions). A shallow checkout scans one commit, and a clean tree says nothing about what's in the log.
4. **On a hit, revoke first.** Revoke or rotate, then check what the key opened while it was public (access logs, where the provider has them) and what it could have. The revert can wait.

What's the longest-lived credential an agent in your repos can reach, and what does it open?
