---
name: party-long-rest
description: Resolve overnight sleep or a long rest, including any unsafe-rest encounter check, close the current day, and advance campaign chronology exactly once. Use only when the fiction establishes a day boundary; invoke encounter-check before granting rest in an unsecured location.
---

# Sleep and Advance Day

Act only as the campaign DM between combats. Read `../../references/party-state.md`, `../../references/debts.md`, `../../references/businesses.md`, `../../references/calendar.md`, every active character's `Stats.md`, `data/party-state.json`, and the minimum current-location and live-situation canon needed to establish the sleeping environment. Confirm location, safety, watches, defenses, intended duration, and actual completion. Never choose player actions.

## Resolve safety before the night

Classify the place before changing any campaign file:

- **Secure:** A protected home, reputable lodging, guarded sanctuary, or other place where ordinary hostile intrusion is not a meaningful risk. Continue without a encounter-check check.

- **Unsecured:** A road or wilderness camp, alley or exposed populated-area shelter, dungeon, enemy-held ground, or another location where hostile interruption is plausible. Invoke `encounter-check` exactly once for this sleep attempt.

Do not increment the day, apply long-rest recovery, finish the Daily, or rotate `resume.md` until the encounter check and any resulting threat are fully resolved. If no encounter occurs, continue this workflow. If a threat occurs, pause the sleep transaction and resolve the scene. Use `combat-start` when the threat establishes hostile action or unavoidable violence. Resume this workflow only after the interruption is resolved and the fiction establishes that the party completes enough rest.

Do not repeat the encounter check merely because an interrupted rest resumes. Check again only after the party abandons that attempt and begins a materially new overnight rest, such as at a different place or on a later night. Preserve the interrupted-rest status in `combat.md` and, when needed across chats, in `resume.md` so continuation does not grant recovery or reroll prematurely.

When `time-advance` invokes this skill in compressed-boundary mode, use the safety rules above only to establish whether the first overnight completes. After it completes, return that established boundary to `time-advance` without reconciling a business, finishing or creating a Daily, changing `data/status.json`, applying recovery, or rotating `resume.md`. The parent workflow owns the single aggregated business reconciliation, range Daily, chronology update, and recovery transaction for the complete interval. If interrupted, leave compressed-boundary mode and resolve only consequences that actually occur.

## Complete the boundary

If interrupted, persist only consequences that actually occurred and do not apply long-rest recovery until the rest is completed. Once the day boundary is reached:

1. Invoke `business-day-reconcile` for the old day. If any active business cannot reconcile, stop before advancing time. Preserve every required player-facing business result line returned by that workflow and include the lines in the waking response after the boundary succeeds.

2. Finish the old Daily.

3. Increment `data/status.json` `Day` exactly once and advance `day_of_week` exactly once through Sunday–Saturday in the same status transaction.

4. Apply every strict-2024 long-rest recovery rule and class-specific recovery limit through one `party-state-update` transaction.

5. Through that transaction, clear only conditions and effects that the rules or established duration end, and reset death saves when applicable.

6. Create one `log/Daily/<new Day> - <Location>.md` for the new day. The filename must begin with the exact numeric Day followed by ` - `.

Treat a missing `debts` field as `[]`. After incrementing the day, identify payments now due or overdue. Never pay them automatically or treat a reached day as satisfying a condition. Surface a concise natural reminder only when the party knows of the obligation and it is relevant to the waking situation. Never overwrite an existing day, change permanent maxima, or assume every effect ends on a rest.

If `day_of_week` is missing, use Sunday as the current day before advancing, so the newly begun day is Monday. If it is present but invalid, stop and report the conflict rather than advancing chronology.

After the boundary succeeds, consume the restored checkpoint: if `resume.md` exists, move it to `resume.bak`, replacing an existing `resume.bak`. Do not generate a new `resume.md`; the campaign is already active and `session-end` owns the next checkpoint. If `resume.md` is absent, leave any existing `resume.bak` unchanged.

Persist the new day and recovery silently. Narrate waking, interruption, or other established outcome in second person.
