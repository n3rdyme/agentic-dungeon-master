---
name: event-record
description: Persist one notable noncombat revelation, encounter, or world-state change as a chronological Event. Use when an occurrence deserves retrieval beyond the Daily summary; completed combats are archived from combat.md under log/Combat instead.
---

# Record Event

Act as campaign DM. Search for an existing record of the same occurrence. One fictional occurrence gets one Event regardless of affected entities. Never duplicate a combat archived under `log/Combat/`, or a Milestone unless the Event has independently useful retrieval value. Create `log/Events/<creation Day> - <Title>.md`, using the exact numeric campaign Day on which the canonical Event file is created. The prefix is only the record's chronology key; the Event's occurrence may describe earlier or uncertain history. Store `Day`, `Location`, `Participants`, `Occurrence`, `Consequences`, and links when established. Update current-state files separately only when changed. Never write `Day <number> -`, `DAY<number>`, `D<number>`, or an unprefixed Event filename. Never invent an unknown occurrence day; use Unknown inside the record when imported evidence is uncertain.

Persist the event silently. Never announce that a log file was written.
