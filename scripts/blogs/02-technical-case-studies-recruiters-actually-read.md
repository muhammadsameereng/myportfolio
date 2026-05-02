A case study isn't a postmortem. It isn't a tutorial. It isn't a feature list. It's a story with one job: convince a stranger that *you* — specifically you, not your team, not your framework — made good decisions under real constraints.

Here's the structure I use. It's boring. It works.

## The 90-second skim

Recruiters spend an average of 90 seconds on a portfolio piece. Optimise for the skim, then reward the deep reader.

```
Skim path:
  Title  →  Cover image  →  H1  →  TL;DR  →  Result number  →  exit
Deep path:
  Title  →  Problem  →  Constraints  →  Decisions  →  Outcome  →  Reflection
```

If the skim path doesn't say "this person solved a real problem and shipped," the deep path never happens.

## The five-section template

### 1. The problem (in one paragraph)
Not "the company wanted a new dashboard." Specific: *"Customer-support agents were copying order IDs between three tools to refund a charge — averaging 4.2 minutes per refund and dropping ~8% of cases on hand-off."*

Recruiters love numbers because numbers are falsifiable. Vague claims read as marketing.

### 2. The constraints
Constraints are where the engineering happens. List the three or four real ones:

- "Couldn't touch the legacy refund API — locked behind a vendor contract."
- "Two-week deadline because of an audit."
- "Team of one (me) plus a half-time designer."

Anyone can solve a problem with infinite time. The story is *which tradeoffs you accepted*.

### 3. The decisions
This is the section recruiters read most carefully. For each decision, give the alternative you considered and why you didn't pick it.

| Decision | Picked | Rejected | Why |
| --- | --- | --- | --- |
| Data layer | Server actions | tRPC | One less dep; team unfamiliar |
| Auth | Magic-link only | Password + OAuth | Internal tool, allow-list of 12 |
| State | URL params | Zustand | Shareable links mattered more than ergonomics |

A table like this signals you've thought about *more than the code you shipped*. That's the senior signal.

### 4. The outcome
One headline number, two supporting numbers. Then one sentence on the qualitative win.

> *Refund time dropped from 4.2 min to 38 sec. Hand-off drops fell from 8% to 0.4%. Support went from "the worst part of the job" to a tool agents now ask for in onboarding.*

### 5. What you'd do differently
This is the section that separates juniors from seniors. Juniors close with "I learned a lot." Seniors close with a real critique of their own work.

- "I picked Server Actions before they had proper streaming. I'd use Route Handlers today."
- "I should have built an undo flow on day one — we ended up retrofitting it after a near-miss."

A real "what I'd do differently" earns trust. Faking humility is obvious; just say what was actually wrong.

## The cover image trap

Stock photos of people in headsets immediately downgrade your work. Use one of:

- A real screenshot of the thing (cropped tight).
- A simple architecture diagram you drew (Excalidraw is fine).
- A chart of the metric that moved.

If the cover image isn't of *your work*, it's noise.

## How long should it be?

```
500 words   = too short, reads as a tweet
1,200 words = sweet spot for portfolio reads
2,500 words = only if there's a genuinely complex story
5,000 words = nobody will read it. nobody.
```

The skim path should answer "should I read this?" in five seconds. The deep path should answer "would I hire this person?" in five minutes.

## Sources

- [How To Choose Blog Topics For SEO In 2026 — Nation Media Design](https://nationmediadesign.com/blog/how-to-choose-blog-topics-for-seo-in-2026)
- [SEO Blog Structure for 2026 — KherKroldanSeo](https://kherkroldanseo.com/ultimate-seo-blog-structure-for-2026/)
