---
title: "When agents write the proof, the specification is the work"
date: "2026-11-13"
description: "Google DeepMind's agents proved security properties of Signal's libsignal down to the machine code. What was and wasn't proved, why nobody has to trust the proof, and what it says about briefing coding agents."
seoDescription: "DeepMind's agents proved Signal's libsignal secure at machine-code level. What it covers, why it is checkable, and what it means for briefing coding agents."
tags: ["ai", "agents", "formal-verification", "security", "softwareengineering"]
---

On 10 November, Google DeepMind published [AlphaProof Code](https://google-deepmind.github.io/code-verification/), a paper and a public Lean development in which teams of agents proved security properties of libsignal, the reference implementation of the Signal protocol. The agents wrote about 6.5 million lines of proof, and every line is checked by Lean's kernel. The part a human has to read and trust is much smaller, around 26,000 lines of specifications and machine-code semantics. No author wrote any of the proof.

Everyone will quote the 6.5 million. The paper's own lesson is about the 26,000.

## What was proved, and what wasn't

The target is the unmodified libsignal crates, wrapped in a small command-line tool and compiled to AArch64 Linux machine code. The theorems are about runs of that binary, not about the Rust source, which means the compiler can't introduce a surprise the proof never saw. They cover Signal's post-quantum handshake (PQXDH) and the Triple Ratchet, and they establish forward secrecy, authentication, post-compromise security and handshake secrecy.

It isn't a certificate for the Signal app. The scope is one-to-one sessions, and group messaging is left as future work. Key generation isn't verified. The low-level cryptographic primitives are idealised, so the results hold on the condition that those primitives are secure. The computational proof is against classical attackers, and the paper says plainly that the ratchet theorems don't yet prove the post-quantum healing the newer ratchet is built for. None of this is hidden; it's in the paper's own list of what comes next.

## Why you don't have to trust the agents

A proof written by a swarm of agents sounds like something to be nervous about, but the nervousness belongs elsewhere. A proof either type-checks in Lean or it doesn't, and it doesn't matter who or what wrote it. The proof is the cheap, untrusted part.

What can't be checked automatically is the specification, the theorem statements and their assumptions about how the code runs. If it's wrong, a perfectly valid proof can still prove the wrong thing. So the setup is built around that: agents can't edit the specification, and when a proof attempt suggests it's subtly wrong, the agent can only propose an amendment. A separate critic agent, which never sees the proof attempts, accepts it only if it's necessary, doesn't weaken security, and is small. Humans approve it after that.

The team also tested whether the specification could catch real mistakes. They put two previously fixed libsignal bugs back, rebuilt the binary, and proved in Lean that the result violates the security theorem. A specification that fails on known-bad code is at least not vacuous (though it says little about bugs nobody has found yet).

## Where the effort went

The proof work took a team of five about four weeks, each running agents on their own workstation. The paper's comparison is seL4, which took twenty person-years to verify, and CompCert, which took six. Those were written with verification in mind, which libsignal wasn't.

Then comes the sentence I keep returning to: "The majority of our effort went not into proofs but into specifications." The paper says prior formal models of Signal covered the handshake and the ratchet separately, and predated the post-quantum ratchet, so the specifications had to be composed and extended over several rounds of drafts and review. Once proofs got cheap, the hard question became what to prove.

## The same shift, without the kernel

Most of us don't have a Lean kernel. When I brief a coding agent, nothing checks whether my brief was the right one. Tests come closest, and a test suite is only as good as the person who decided what to test.

Suppose I ask an agent to "retry failed payments". It will write retries, and it may write them well. Whether a retry can charge a customer twice, how many attempts are allowed, and what happens when the process dies halfway are all specification questions, and the agent will answer them confidently if I leave them open. A strong implementation of a weak spec is still a weak spec, only now it ships faster.

That's the part of the work I think grows. Identifying the problem, writing the spec in enough detail that it can be argued with, and iterating on it is where I've always started, so I'm hardly neutral here. If anything, this looks like an extension of what I've been doing as an engineer. The paper at least suggests a version of it where the proofs check themselves, and the spec is the only part left to get right.

What has your experience been? Where do you see yourself spending the time?
