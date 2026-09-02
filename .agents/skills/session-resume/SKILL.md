---
name: session-resume
description: Restore a filesystem-backed campaign in a new chat from its resume.md operational checkpoint and linked canonical state. Use when the player resumes, continues, loads, or returns to a campaign; read the complete live situation, pending player decision, active work, recent chronology, relevant milestones, and linked canon without loading the whole campaign.
---

# Resume Campaign Session

Act as the campaign DM. Read `campaign-info.md` completely on every resume, then read `resume.md` completely. Treat `campaign-info.md` only as immutable world-building permissions and prohibitions, never as party composition, relationship state, character motivation, or story direction. Never edit it while resuming; it changes only when the user explicitly asks the OOC DM to update it. Read `../../references/party-state.md`, `../../references/debts.md`, `../../references/businesses.md`, `../../references/calendar.md`, `data/status.json`, `data/inventory.json`, `data/party-state.json`, and every file linked from `resume.md` that is necessary to understand the immediate situation. Do not load unrelated campaign canon. Treat a missing `debts` field as `[]`.

Load every active business explicitly linked under State References. If an active business is missing there, read only its `business.json` to identify the checkpoint conflict; do not silently reconstruct or reconcile it.

Check active obligations when resuming. Bring an overdue or due-today obligation into the recap only when the party knows of it and it can affect the immediate situation; never pay, renegotiate, or resolve it merely by resuming.

If `day_of_week` is missing from `data/status.json`, add `"day_of_week": "Sunday"` without changing `Day`, then parse the complete JSON again. This one backward-compatible status migration is the sole exception to resume's ordinary read-only behavior. Perform it silently before play. If the field is present but is not one of the seven exact weekday names, stop and report the conflict instead of replacing it.

If `data/party-state.json` is absent or structurally incomplete, stop before play and invoke `party-state-initialize`. Resuming is read-only once a valid party-state file exists; the explicit migration workflow owns its creation. Apart from the weekday migration above, resuming remains read-only once valid canonical state exists.

If `combat.md` exists with Ready or In Progress status, do not resume story narration. Tell the player that its encounter ID is awaiting the battle role. If it is Resolved, invoke `combat-finish` before resuming the aftermath.

If `data/poker-state.json` exists with an unfinished hand, invoke `poker-play` with its state operation. Resume the exact deck cursor, seats, stacks, pot, betting street, and acting player. Never reshuffle, expose hidden cards, or reconstruct the hand from prose.

Treat canonical status, party state, and entity files as authoritative. Use `resume.md` as a current-state map, not as storage for transient mechanics. If its day, location, or linked facts conflict with canonical files, report the conflict before play; never silently choose. Do not expect copied HP, resource, XP, currency, inventory, or equipment values in `resume.md`; read those from its canonical State References. If `resume.md` is absent, reconstruct the smallest useful context from status, party state, the current Daily, active quest filenames, current location, and present characters, and warn that no end-session checkpoint was available. Do not create or update files merely by resuming except for the missing-weekday migration above.

Read Operational Continuity as the checkpoint for an unfinished multi-step attempt and its imminent plan. Resume at the recorded current or next step without treating steps, planning, or plan revisions as quest progress. Invoke `quest-update` only after a defined goal completes or a completed unit advances a defined countable goal.

Start with the location ledger, a concise immersive recap, and the exact open situation awaiting the player, all in second person. Do not decide the pending choice, take an action for the player character, or display a structured resume record.
