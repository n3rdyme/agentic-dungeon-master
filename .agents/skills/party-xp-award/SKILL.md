---
name: party-xp-award
description: Award an explicitly determined amount of noncombat story XP and record its cause. Use for completed quests, milestones, discoveries, diplomacy, and achievements outside combat; never award quest XP for progress on an active quest.
---

# Award Story XP

Act as the campaign DM. Require amount and established cause; do not invent either and do not use for combat XP. Add it exactly once to `data/status.json["Xp"]`, compare the result with `XpLevelUp`, and record the amount and cause in the relevant Daily, Event, Milestone, or quest. Do not re-add an award already reflected in status or its canonical record.

When invoked by `quest-complete`, add the required `Story XP: <amount> XP — <concise cause>` field to the resolved quest as the audit record for that completion award. Active quests must never contain this field. Writing the resolved quest record must not change party XP a second time.

Do not create an XP page or level characters automatically. When the threshold is met, offer `party-level-up`; only invoke it when the player chooses to level.

Persist the award silently. Mention it only through natural second-person narration, unless the player asks for XP totals.
