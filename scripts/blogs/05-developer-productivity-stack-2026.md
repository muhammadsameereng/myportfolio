Productivity posts usually list 40 tools. You'll add three to your bookmarks, use them once, and forget them. This isn't that post.

These are the eight tools I actually open every working day. Anything I tried and dropped doesn't make the list.

## The whole workday in one diagram

```
  Morning                Afternoon             Evening
  ───────                ──────────            ───────
  Linear   →  VS Code  →  Claude Code  →  Vercel  →  Linear
   (plan)    (write)      (pair)        (ship)    (close)
              ↑              ↓
          Raycast  ←──  Notion / iA Writer
            (jump)        (capture)
```

Eight tools. Same shape every day. The point is the *consistency*, not the tools.

## 1. Linear — the source of truth

Issue tracker, planning doc, and shipping log in one. The keyboard-first UX is what locked me in. If a task isn't in Linear, it doesn't exist.

**The trick:** one project per side-project, plus one *"Personal"* project for everything not work. No Notion docs, no scratch files. One inbox.

## 2. VS Code with three extensions

I uninstalled 22 extensions last year. The three that survived:

- **GitLens** — git blame inline, hover history.
- **Error Lens** — pushes errors into the line, not a panel.
- **TODO Highlight** — keeps TODO/FIXME/HACK visible so they don't rot.

That's it. Themes, icon packs, snippet libraries — all noise. Less surface area, fewer surprises.

## 3. Claude Code — the AI pair

By far the biggest workflow change in 2026. Claude Code lives in my terminal and reads the repo. I use it for:

- **Refactors I know I want.** "Extract the upload size limit into a constant in three files." Saves 90 seconds, every time.
- **Reading unfamiliar code.** "Walk me through how auth callbacks flow through this file." Faster than grep.
- **Writing tests for code I just wrote.** It catches the edge cases I miss.

What I don't use it for: anything where I don't already know what right looks like. AI is great at execution, terrible at strategy. The taste is still mine.

## 4. Raycast — the launcher

Spotlight replacement. Five reasons it earned a daily slot:

- Window management with a keystroke (⌥⌘←/→).
- Clipboard history (game-changer for code snippets).
- Quick-link snippets — `;email` types my email everywhere.
- Floating notes for "thinking out loud" without committing to a doc.
- Calculator that handles unit conversion and currency.

It's $8/month for the Pro tier. I'd pay $50.

## 5. Notion — long-form thinking only

I've stopped using Notion as a database, a task list, or a wiki. It's pure long-form scratch space now. One workspace, no nesting deeper than two levels. If I find myself building elaborate page hierarchies, I'm avoiding the actual work.

## 6. iA Writer — for things that ship

When a piece of writing is going to leave my computer (a blog post, a doc, a long Slack message), I move it to iA Writer. The constraints — no fonts, no colors, no comments — make me focus on the words. Markdown in, markdown out, no surprises.

## 7. Vercel — the deploy button

`git push` triggers a preview deploy. Merge to main triggers production. I don't think about CI/CD until something breaks. The rest of my brain is freed for the actual work.

## 8. Cron — calendar that respects my keyboard

I switched off Google Calendar's web UI in 2025 and never looked back. Cron's keyboard shortcuts let me triage a week of meetings in 60 seconds. Time-blocking actually sticks because the friction to schedule is gone.

## What I tried and dropped

| Tool | Why I dropped it |
| --- | --- |
| Obsidian | Plugin sprawl; couldn't stop tinkering |
| GitHub Copilot | Replaced by Claude Code (better at multi-file tasks) |
| Slack on desktop | Notifications killed flow; web-only now |
| Todoist | Linear absorbed the role |
| Trello | Same |
| 4 different terminal apps | Default Terminal.app is fine |

The lesson: tool-hopping is procrastination disguised as productivity. The setup compounds when you stop changing it.

## The meta-rule

If a tool requires me to maintain it more than once a quarter, it's not a tool — it's a hobby. Real tools fade into the background.

## Sources

- [12 Best Developer Productivity Tools in 2026 — Catio](https://www.catio.tech/blog/developer-productivity-tools)
- [10 Best Tech Blogs for Developers — TripleTen](https://tripleten.com/blog/posts/10-software-development-blogs-worth-bookmarking)
