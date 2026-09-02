---
name: quest-update
description: Record completed goal-level progress on an existing active quest and log every activation or false positive to quests/quest-update.log. Trigger automatically only when a defined quest goal is completed or a completed unit advances a defined countable goal. Do not trigger for planning, attempts, intermediate actions, discussion, new information, or revisions to an already completed plan; alter quest definitions only when the player explicitly requests quest maintenance.
---

# Update Quest

## Require completed goal-level progress

Match exactly one active quest and one goal already defined in that quest. An automatic update is allowed only when established events either complete a binary goal or add a completed unit to a countable goal, such as `0/3` to `1/3`.

Attempts and intermediate steps are fiction in progress, not quest progress. For "Secure the pistols and reach safety," sneaking past a guard, picking a lock, entering, locating or removing the pistols, stashing them, and leaving do not update the quest. Update only when the completion condition--reaching safety with the pistols secured--is established.

Planning is not progress unless the quest already contains a distinct goal such as "Develop a workable plan" with an explicit completion condition. Complete it once when that condition is met. Later discussion or revision does not reopen or re-complete it.

Do not trigger automatically for a changed lead, constraint, participant, method, position, intended next step, or provisional plan. Store live execution state and imminent plans in `resume.md` at end-session. Route a new quest to `quest-receive` and a final disposition to `quest-complete`. Change quest structure only when the player explicitly asks to edit, retcon, or maintain it.

## Log every activation

Before any canonical write, invoke `scripts/logTrigger.js` with one strict JSON object containing:

- `campaign`, `day`, exact `userInput`, and `activationMode` (`automatic` or `explicit`);
- `candidateQuests` and `matchedQuest`;
- `triggerSignals`, each with `source`, exact `quote`, and `sourceReference`;
- `classification`: `goal-completed`, `countable-progress`, `action-in-progress`, `planning-only`, `mention-only`, `ambiguous`, `new-quest`, `quest-completion`, `explicit-maintenance`, or `no-active-match`;
- `decision`: `update`, `skip`, `clarify`, `quest-receive`, or `quest-complete`;
- `durableChanges`: objects with `category`, `goal`, `before`, and `after`; and
- a concise `reason`.

Use signal source `user-input`, `prior-narration`, or `canonical-file`. User-input quotes must be verbatim. Cite only existing evidence. The script rejects automatic updates except `goal-completed` and `countable-goal-progress`, and rejects updates without a matched quest, named goal, exact evidence, and distinct values.

It appends and echoes one JSONL line at `campaigns/<Player>/quests/quest-update.log`. Never show it to the player. Log false positives with `skip`.

## Keep the quest compact

Treat the quest as an outcome dashboard, not history, transcript, plan, or operational checkpoint. Retain metadata, concise status, outcome-level goals with completion conditions and counters, durable success or failure constraints, and reward. Active quests must not contain a `Story XP` field.

Mark a binary goal complete once. For a countable goal, update only its counter and completion state. Do not append execution steps, dialogue, plans, revisions, chronology, repeated facts, or Story XP.

Persist progress silently and present it naturally through second-person narration.
