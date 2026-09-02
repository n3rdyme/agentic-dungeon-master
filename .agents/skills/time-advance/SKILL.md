---
name: time-advance
description: Advance a filesystem-backed campaign across multiple days or a longer downtime interval while preserving chronology and stopping for consequential interruptions. Use when the player asks to wait, travel, work, train, skip days or weeks, jump ahead to a month, season, or year, or otherwise pass more than one overnight boundary without playing every day.
---

# Advance Time

Act as the campaign DM between combats. Compress an established interval without inventing player choices or treating uneventful days as scenes. Do not use this skill for a single ordinary overnight rest; use `party-long-rest`.

Announce the transition only as `[time-advance passing time]`.

## Establish the interval

Read `../../references/debts.md`, `../../references/businesses.md`, `../../references/calendar.md`, `data/status.json`, the current Daily, `resume.md` when present, active quests with time pressure, relevant location and faction canon, and `data/party-state.json`. Confirm what the party is doing, why time is passing, where it occurs, and the intended duration. Ask only when the duration or activity would materially change the result.

Convert natural intervals consistently unless the fiction establishes exact

dates:

- one week = 7 days
- one month = 30 days
- one season = 90 days
- one year = 365 days

Let `startDay` and `startNameOfDay` be the current `data/status.json` values and let `daysSkipped` be the full requested elapsed duration. The final day is `startDay + daysSkipped`; the final weekday is `startNameOfDay` advanced by `daysSkipped mod 7` through Sunday–Saturday. Never count the first overnight twice. Treat a missing starting weekday as Sunday. Stop on an invalid value.

## Resolve before committing

Identify anything that should interrupt the skip: a required player decision, quest deadline, resource shortage, expense the party cannot pay, dangerous travel, hostile attention, faction action, combat, or another material event. Resolve required costs and downtime mechanics under their owning skills.

Treat a missing `debts` field as `[]`. Before committing, identify every active payment whose `next_due_day` falls after the starting day and on or before the proposed endpoint, plus anything already due or overdue. Stop on the last day before the first obligation that requires player instruction or an unresolved condition. Do not pay automatically. If the player has already established payment instructions and every condition is satisfied, invoke `debt-pay` at the proper boundary and continue only while funds and instructions remain.

Require every active business to be setup-complete before advancing. Invoke `business-day-reconcile` once for every elapsed campaign day, in chronological order, before crossing that day's boundary. Stop on the last completed day if reconciliation exposes a setup conflict, cash shortfall requiring a choice, closure, or other consequential interruption. Preserve every required player-facing business result line returned by those reconciliations and include the lines in the time-advance result, grouped in chronological day order.

Use `party-long-rest` to complete and record the current campaign day and its first overnight boundary. This includes any unsafe-rest encounter check. If that rest or any later material event is interrupted, stop the time skip at the last completed boundary, persist only elapsed consequences, and return control to play. Do not assume the remaining interval passes.

Do not manufacture one random encounter check per compressed night. Assess the whole interval and surface only encounters or decisions significant enough to resume play. When the fiction requires a particular unsafe overnight to be resolved, use `party-long-rest` for that boundary.

## Commit the elapsed time

After the first overnight succeeds, apply established recovery and continuing effects for the remaining interval. Reconcile expiring effects, resource use, expenses, work, travel, quest deadlines, NPC or faction activity, and location changes that are actually implied by the agreed activity. Never award XP, complete quest goals, spend money, or change equipment without an established cause.

Update `data/status.json` `Day` directly to `startDay + daysSkipped` and `day_of_week` directly to the weekday calculated from the original starting weekday and full elapsed duration. Commit both together, accounting for the one day already advanced by `party-long-rest`. Do not add `daysSkipped` to the post-sleep values.

Create or update the endpoint campaign Daily only when play resumes on that day; do not generate empty campaign Daily files for every skipped day. Still create every business's required immutable daily reconciliation.

Create exactly one chronological Event under `log/Events/` for the elapsed interval. Follow the `event-record` schema and include:

- the starting and ending day;
- the elapsed number of days and human-readable interval;
- the known reason or activity, or `Reason unknown` when none is established;
- where the interval occurred and any established travel endpoints;
- material consequences, costs, changes, or `None` when nothing notable happened.

Name the Event for the activity or transition rather than merely `Time Skip`. Link it from the endpoint Daily when one exists. Do not create a second Event for the same interval.

Persist the time advance silently. Resume in second person at the first moment requiring player input, making the elapsed interval clear through natural narration rather than displaying a structured record.
