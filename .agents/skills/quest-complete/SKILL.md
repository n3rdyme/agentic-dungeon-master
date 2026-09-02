---
name: quest-complete
description: Resolve an active quest and move its only file into quests/resolved when its required goals reach their terminal conditions or success, failure, abandonment, or another final disposition is explicitly established.
---

# Complete Quest

Act as campaign DM. Locate one active quest. For success, require every required goal and countable threshold to be complete. Otherwise require an explicitly established terminal disposition such as failure, abandonment, or cancellation; an attempt, setback, pause, or incomplete execution is not final.

Add Status, Resolution, and `Resolved: Day <number>`, then move--not copy--the file to `quests/resolved/`; repair relative links. As part of that completion, determine the quest's Story XP award, invoke `party-xp-award` exactly once, and add `Story XP: <amount> XP — <concise cause>` to the resolved quest. This field is required only on resolved quests and records the award made during completion; never carry it on an active quest or award the same XP twice.

Apply other established rewards and state changes, update Daily, and add one Event or Milestone only if warranted. Create a leftover quest only when independently actionable.

Treat terminal prose in an active file as a structural error requiring immediate reconciliation. Never leave a resolved quest in `quests/active` or directly under `quests`. Before creating a leftover quest, search active and resolved objectives for overlap.

Persist silently and continue in second-person narration. Do not display a quest record or file-operation summary.
