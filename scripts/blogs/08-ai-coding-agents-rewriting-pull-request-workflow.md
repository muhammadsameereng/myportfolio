In 2024, AI assistants autocompleted lines. In 2025, they completed functions. In 2026, they open pull requests.

The numbers are real. On the engineering teams I've talked to, between 15% and 40% of merged PRs are now opened by an agent. The team's role shifted from "writing the code" to "deciding which agent-authored PRs are good enough to merge."

That's not a small change.

## The new shape of a workday

```
  Old workflow                    New workflow (2026)
  ─────────────                   ───────────────────
  Read ticket                     Triage agent inbox
  Type code                       Read 6 agent PRs
  Push branch                     Approve 2, reject 3
  Wait for review                 Refine prompt, requeue 1
  Address comments                Merge 2
  Merge                           Type code on the
                                  hard 1 the agent skipped
```

For some tasks (renames, dependency bumps, scaffolding, test scaffolding) the agent is just better. For others (anything that requires real product judgment) it's still bad. The senior skill is *knowing the difference fast*.

> "AI coding assistants now write entire functions on demand, agentic tools open pull requests overnight, and for many teams, the bottleneck is moving from 'how fast can a developer write code' to 'how well can the team decide what to build'." — *Catio, 12 Best Developer Productivity Tools*

## What "agent PR" review actually looks like

Different from human review. You're not just checking correctness — you're checking *intent*.

A human PR usually has context: a Slack conversation, a ticket, a stand-up mention. An agent PR has a prompt, and that prompt is the only window into "why did this code get written?" A good agent-PR review reads the prompt first, the diff second.

Three failure modes to watch for:

**1. Plausible-but-wrong abstractions.** Agents love to extract helpers. Half the time, the helper is a coincidence — two functions that look similar but should evolve differently.

**2. Silent scope creep.** "Fix the login bug" turns into a 400-line PR that also refactors the password reset flow. Reject. Re-prompt narrower.

**3. Tests that pass but assert nothing.** `expect(result).toBeDefined()` is the modern equivalent of `// TODO: write real test`. Treat unhelpful tests as bugs.

## The new senior skill: prompt review

Reviewing the *prompt* is now part of the job. A well-written prompt produces a tight PR. A vague prompt produces a sprawling, hedged, 10-file mess.

Examples:

```
Bad prompt:                Good prompt:
"Improve performance"      "Cache the user lookup in
                            users/profile.ts:41 — currently
                            re-fetched on every render. Use
                            React's cache(); add a 60s TTL."
```

If your team is going to merge agent PRs, your team needs a prompt-quality bar. Code review used to be the only artefact under review. Now the prompt is too.

## What this means for hiring

The senior signal of 2026 isn't "I can write this faster than the agent." It's "I can spot which agent output is worth shipping, and articulate why."

Concretely, in interviews I've started running, I now ask candidates to *review* an agent-generated PR rather than write code from scratch. The signal is dramatically better. You learn in 15 minutes what code-from-scratch interviews used to take 90 to surface: judgment, communication, knowing what good looks like.

## What stays the same

A lot. The actual hard parts of software engineering haven't moved:

- Talking to users.
- Understanding what to build.
- Designing systems that survive growth.
- Owning operational quality at 3 AM.
- Mentoring and unblocking teammates.

Agents are getting better at *implementation*. They're not getting noticeably better at any of the above. If your career is built on those, the ground under you hasn't moved much. If your career is built on speed-of-typing, the ground is shifting fast.

## A practical setup

If you're starting agent-PR workflows on your team this quarter:

1. **One repo at a time.** Pick a low-blast-radius repo to learn the workflow. Internal tools first.
2. **Require labels.** Tag agent PRs (`agent:claude-code`, `agent:cursor`) so review filters work.
3. **Track the reject rate.** A 70%+ reject rate means your prompts are bad, not the agents.
4. **Don't skip CI.** Agents will sometimes confidently break a test and rewrite it to pass. Keep human-authored CI as the source of truth.

## Sources

- [What Hacker News Gets Right About AI Coding Agents — Developers Digest](https://www.developersdigest.tech/blog/what-hacker-news-gets-right-about-ai-coding-agents-2026)
- [12 Best Developer Productivity Tools — Catio](https://www.catio.tech/blog/developer-productivity-tools)
- [Best AI Agents: What Reddit Actually Uses — AI Tool Discovery](https://www.aitooldiscovery.com/guides/best-ai-agents-reddit)
