---
name: time-advance
description: Advance a filesystem-backed campaign across two or more skipped days while preserving chronology and stopping for consequential interruptions. Use when the player asks to wait, travel, work, train, skip at least two days or multiple nights, or jump ahead by weeks, months, seasons, or years.
---

# Advance Time

Act as the campaign DM between combats. Compress an established interval without inventing player choices or treating uneventful days as scenes. Use this skill only when `daysSkipped >= 2`. One skipped day means sleeping through one night and must use `party-long-rest`; two skipped days means sleeping through two nights and is the smallest valid `time-advance` interval. Never invoke this skill merely to avoid playing the remainder of the current day before one overnight boundary.

Announce the transition only as `[time-advance passing time]`.

## Establish the interval

Read `../../references/debts.md`, `../../references/businesses.md`, `../../references/calendar.md`, `data/status.json`, the current Daily, `resume.md` when present, active quests with time pressure, relevant location and faction canon, and `data/party-state.json`. Confirm what the party is doing, why time is passing, where it occurs, and the intended duration. Ask only when the duration or activity would materially change the result.

Convert natural intervals consistently unless the fiction establishes exact dates:

- one week = 7 days
- one month = 30 days
- one season = 90 days
- one year = 365 days

Let `startDay` and `startNameOfDay` be the current `data/status.json` values and let `daysSkipped` be the full requested elapsed duration. The final day is `startDay + daysSkipped`; the final weekday is `startNameOfDay` advanced by `daysSkipped mod 7` through Sunday–Saturday. Never count the first overnight twice. Treat a missing starting weekday as Sunday. Stop on an invalid value.

Require `daysSkipped` to be an integer of at least 2 after resolving the requested interval. If it resolves to exactly 1, stop this workflow and route the completed overnight to `party-long-rest` without creating a range Daily or range business ledger.

## Resolve before committing

Identify anything that should interrupt the skip: a required player decision, quest deadline, resource shortage, expense the party cannot pay, dangerous travel, hostile attention, faction action, combat, or another material event. Resolve required costs and downtime mechanics under their owning skills.

Treat a missing `debts` field as `[]`. Before committing, identify every active payment whose `next_due_day` falls after the starting day and on or before the proposed endpoint, plus anything already due or overdue. Stop on the last day before the first obligation that requires player instruction or an unresolved condition. Do not pay automatically. If the player has already established payment instructions and every condition is satisfied, invoke `debt-pay` at the proper boundary and continue only while funds and instructions remain.

Require every active business to be setup-complete before advancing. Confirm that the business interval can use its `average` earnings profile throughout; a known closure, exceptional adjustment, model change, cash shortfall requiring a choice, or other consequential interruption ends the proposed interval before that event. After the exact endpoint is established, invoke `business-day-reconcile` once for the half-open interval beginning at `startDay` and ending at `finalDay`, covering Days `startDay` through `finalDay - 1`. Require it to create one `daily/<startDay>-<finalDay>.json` per active business with `day_count = finalDay - startDay`. Preserve every required player-facing aggregate business result line and include it in the time-advance result.

Invoke `party-long-rest` in compressed-boundary mode to establish the first overnight boundary, including any unsafe-rest encounter check, without creating single-day chronology or business artifacts. If that rest or any later material event is interrupted, stop before committing the compressed interval, persist only consequences that actually occurred, and return control to play. Do not assume the remaining interval passes.

Do not manufacture one random encounter check per compressed night. Assess the whole interval and surface only encounters or decisions significant enough to resume play. When the fiction requires a particular unsafe overnight to be resolved, use `party-long-rest` for that boundary.

## Commit the elapsed time

After the first overnight succeeds, apply its long-rest recovery and the established recovery and continuing effects for the remaining interval. Reconcile expiring effects, resource use, expenses, work, travel, quest deadlines, NPC or faction activity, and location changes that are actually implied by the agreed activity. Never award XP, complete quest goals, spend money, or change equipment without an established cause.

Update `data/status.json` `Day` directly to `startDay + daysSkipped` and `day_of_week` directly to the weekday calculated from the original starting weekday and full elapsed duration. Commit both together; compressed-boundary mode did not already increment either value.

Create exactly one campaign Daily representing the entire interval. Its exact filename is `log/Daily/<startDay>-<finalDay> - <Location>.md`, where `Location` is the established location where play resumes on `finalDay`. When the existing current Daily for `startDay` contains earlier events from that day, move it to the range filename and preserve its contents before adding the compressed interval summary. Do not retain a separate single-day file for `startDay`, create intermediate Daily files, or create a second endpoint Daily. Treat the range Daily as the current Daily for `finalDay`. Refuse to overwrite an existing range filename or silently combine conflicting chronology.

Each active business likewise receives exactly one immutable `daily/<startDay>-<finalDay>.json` for the interval. Do not create single-day or intermediate business ledgers. The range ledger has `day: startDay`, `day_count: finalDay - startDay`, uses the `average` profile for every covered day without an earnings roll, stores aggregate interval totals, and leaves `last_reconciled_day` at `finalDay - 1`.

Create exactly one chronological Event under `log/Events/` for the elapsed interval. Follow the `event-record` schema and include:

- the starting and ending day;
- the elapsed number of days and human-readable interval;
- the known reason or activity, or `Reason unknown` when none is established;
- where the interval occurred and any established travel endpoints;
- material consequences, costs, changes, or `None` when nothing notable happened.

Name the Event for the activity or transition rather than merely `Time Skip`. Link it from the range Daily. Do not create a second Event for the same interval.

Persist the time advance silently. Resume in second person at the first moment requiring player input, making the elapsed interval clear through natural narration rather than displaying a structured record.
