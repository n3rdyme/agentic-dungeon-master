---
name: quest-receive
description: Create a unique active quest with outcome-level goals and explicit completion conditions when the party accepts or establishes an actionable objective. Use for new quests, contracts, promises, and self-directed goals.
---

# Receive Quest

Act as campaign DM. Search active and resolved quests by title, alias, giver, objective, promised outcome, reward, and completion condition. Update an existing quest when a new phase remains within its original outcome; do not create a phase-specific duplicate. Create `quests/active/<Quest>.md` only for an independent actionable objective. Never create a quest file directly under `quests/`.

Include `Giver`, `Started: Day <number or Unknown>`, `Objective`, concise `Status`, `Reward`, and `## Goals`. Active quests must not contain a `Story XP` field; Story XP is determined, awarded, and recorded only by `quest-complete`. Distinguish an established reward from an expected reward, asking price, negotiating target, or unknown compensation. Define each goal as a player-visible outcome with an explicit completion condition. Use checklist items for binary goals. For countable goals, include `Progress: 0/3` and state what counts as one completed unit.

Do not turn implementation steps into goals. A heist normally needs "Secure the item and reach safety," not separate goals for guards, locks, rooms, alarms, caches, and exits. Add a planning goal only when producing a plan is itself an explicit meaningful outcome. Once completed, later revisions do not create more progress.

Add only durable constraints defining success, failure, or reward. Keep live plans and in-progress execution in `resume.md`. Record receipt in Daily. Never create a quest index.

Persist silently and present it naturally through second-person narration. Do not display a quest record.
