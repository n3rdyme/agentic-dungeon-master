# Historical Reconciliation

Use this contract at every imported Daily checkpoint.

## Evidence priority

Prefer, in order:

1. explicit player statements and confirmations;
2. established selected-branch narration and successful tool results;
3. later canonical records that quote or link their evidence; and
4. assistant summaries, plans, estimates, and proposed values.

Treat the fourth category as a lead to verify, not self-authenticating canon. Label an asking price, negotiating target, expectation, report, inference, and confirmed value distinctly. Preserve unresolved conflicts as `Unknown` and add them to `data/import-discrepancies.md`.

## Historical-import mode

Write the Daily ledger first. Then load and apply each applicable skill below. The Daily ledger owns chronology; domain skills own canonical entity structure and lifecycle.

In historical-import mode:

- suppress live-play narration, skill announcements, and automatic trigger logs;
- do not append a second copy of facts already recorded in the Daily ledger;
- search current and resolved canon before every create;
- make retries idempotent by updating or consolidating instead of appending;
- use only evidence from the consumed interval and prior imported canon; and
- never fill a required field with an invention. Use `Unknown` only when the missing value materially matters; otherwise omit the field.

## Consequence routing

| Consequence | Governing skill |
|---|---|
| New durable place or independent site | `location-discover` |
| Durable change to a known place | `location-update` |
| Newly established individually significant NPC | `npc-meet` |
| NPC identity, location, status, motive, or relationship change | `npc-update` |
| Durable faction discovered or changed | `faction-update` |
| New independent actionable objective | `quest-receive` |
| Completed defined quest goal | `quest-update` |
| Terminal quest disposition | `quest-complete` |
| Shared property acquired | `item-loot` |
| Item identity or properties established | `item-identify` |
| Item purchased, sold, consumed, or removed | matching item skill |
| Accepted unpaid obligation | `debt-create` |
| Obligation payment | `debt-pay` |
| Revised obligation terms | `debt-update` |
| Terminal nonpayment obligation outcome | `debt-resolve` |
| Notable noncombat occurrence | `event-record` |
| Campaign-defining turn or story XP | `milestone-record` / `party-xp-award` |
| Party member identity, biography, personality, relationship, knowledge, permanent mechanics, equipment, or custom spell changes | `party-member-update` |
| Party member permanently dies | `party-member-death` |
| Party member permanently or indefinitely departs alive | `party-member-retire` |

Do not replay historical combat through live combat skills. Archive its established participants, state changes, outcome, XP, and loot directly under `log/Combat` using the imported evidence.

## Entity thresholds

- Create a location only when it has durable retrievable canon beyond a passing mention. Use a section of its parent unless a sub-location has an independent role, state, occupants, or likely future retrieval.
- A name alone does not justify an NPC file. Keep names known only through a roster, guest list, workplace, household, faction, or undifferentiated group membership as plain text in the owning location or faction. Create an NPC only after meaningful interaction or distinctive behavior, appearance, knowledge, motives, relationships, actionable responsibility, or independently changing state makes the person useful to retrieve separately. Promote and link a background name only when that threshold is crossed.
- Create a quest only for an independent accepted, promised, contracted, or self-directed outcome. Do not turn an itinerary, item to inspect, or one step of an existing objective into a separate quest without independent stakes.
- An unidentified item does not automatically require a quest. Link it to an existing objective, create an identification quest only when the party adopts that objective, or record deliberate deferral in import discrepancies.

## End-of-import audit

Before marking the import complete:

1. Confirm active quests exist only in `quests/active` and resolved quests only
   in `quests/resolved`.

2. Check quests for missing metadata, explicit goals, completion conditions, terminal prose in active files, and overlapping objectives or rewards. Active quests must not contain `Story XP`; every resolved quest requires one numeric `Story XP:` field recording its completion award. Reconcile that award with status and its Daily, Event, or Milestone evidence without adding it twice.
3. Compare every unresolved promise, contract, accepted objective, and self-directed commitment in the final resume and recent Daily ledgers to the active quests. Compare every accepted unpaid financial obligation to status debts, while excluding quotes and rejected offers.
4. Review all unidentified, unopened, coded, unknown, or unexamined inventory and classify each as covered, intentionally deferred, or missing work.
5. Search NPC and location names, aliases, roles, and geographic parents for duplicates, commentary-only canon, and missing durable entities.
6. Check that Events, Milestones, and Combats do not duplicate the same occurrence without independently useful retrieval value.
7. Verify every active party member's strict Stats and Personality templates, optional Custom Spells template, world-building-only `campaign-info.md`, JSON, relative links, status, resume, and the final Daily ledger.
8. Run the bundled validator and resolve all errors. Record reviewed warnings
   that remain genuinely uncertain.
