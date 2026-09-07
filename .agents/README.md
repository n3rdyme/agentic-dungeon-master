# Agentic DM Skills

## Naming convention

Canonical skill names use `<noun>-<verb>`: place the subject or domain first

and the operation second. Use lowercase letters, digits, and hyphens only.

Prefer a specific noun over a broad category, and use one consistent verb for

the same operation across the skill set.

Slash commands and conversational phrases are triggers declared by a canonical

skill, not separate alias skills. `/roll` triggers `dice-roll`; `/fight`

triggers `combat-fight`.

This file is the canonical skill registry. Every skill creation, rename,

replacement, or removal must update this file in the same change. Place the

skill in its permitted role section and add one short purpose statement after

an em dash. Beneath it, link every related skill, reference Markdown file, and

executable tool used by the skill. A skill is not complete until its directory

name, frontmatter, metadata, cross-references, role boundaries, and registry

entry agree.

## Role boundaries

### Story role

Story mode owns narration and canonical campaign mutations outside active

combat. It may prepare `combat.md` and reconcile its resolved consequences, but

must not invoke `combat-fight`.

### Combat role

Combat mode may invoke only `combat-fight`, `dice-roll`, and the read-only

`party-status-show` and `party-spells-show`. It writes

`combat.md` only at defined checkpoints. The append-only `roll-history.log`

written by `dice-roll` is the sole external-write exception.

### Information role

Information mode is read-only and may not invoke action skills.

### Administration and setup

Administration skills select, create, import, audit, or repair campaigns. They

are not gameplay actions and are unavailable during combat.

## Story role skills

- [`story-rules-apply`](skills/story-rules-apply/SKILL.md) — Reloads and reapplies narration, agency, and combat-transition rules for the active Story role.
  - Related skills: [`campaign-open`](skills/campaign-open/SKILL.md)
  - References: [`story-mode-rules.md`](references/story-mode-rules.md)

### Time, downtime, and sessions

- [`time-advance`](skills/time-advance/SKILL.md) — Advances chronology across two or more skipped nights using one compressed Daily and one range ledger per business.
  - Related skills: [`business-day-reconcile`](skills/business-day-reconcile/SKILL.md), [`debt-pay`](skills/debt-pay/SKILL.md), [`event-record`](skills/event-record/SKILL.md), [`party-long-rest`](skills/party-long-rest/SKILL.md)
  - References: [`businesses.md`](references/businesses.md), [`calendar.md`](references/calendar.md), [`debts.md`](references/debts.md)
- [`session-end`](skills/session-end/SKILL.md) — Saves a complete operational checkpoint in `resume.md`.
  - Related skills: [`poker-play`](skills/poker-play/SKILL.md)
  - References: [`calendar.md`](references/calendar.md), [`debts.md`](references/debts.md), [`party-state.md`](references/party-state.md)
- [`session-resume`](skills/session-resume/SKILL.md) — Restores current campaign state from its saved checkpoint.
  - Related skills: [`combat-finish`](skills/combat-finish/SKILL.md), [`party-state-initialize`](skills/party-state-initialize/SKILL.md), [`poker-play`](skills/poker-play/SKILL.md), [`quest-update`](skills/quest-update/SKILL.md)
  - References: [`calendar.md`](references/calendar.md), [`debts.md`](references/debts.md), [`party-state.md`](references/party-state.md)
- [`party-long-rest`](skills/party-long-rest/SKILL.md) — Resolves overnight rest, recovery, safety, and a day boundary.
  - Related skills: [`business-day-reconcile`](skills/business-day-reconcile/SKILL.md), [`combat-start`](skills/combat-start/SKILL.md), [`encounter-check`](skills/encounter-check/SKILL.md), [`party-state-update`](skills/party-state-update/SKILL.md), [`session-end`](skills/session-end/SKILL.md)
  - References: [`businesses.md`](references/businesses.md), [`calendar.md`](references/calendar.md), [`debts.md`](references/debts.md), [`party-state.md`](references/party-state.md)
- [`party-short-rest`](skills/party-short-rest/SKILL.md) — Resolves chosen short-rest recovery without advancing the day.
  - Related skills: [`dice-roll`](skills/dice-roll/SKILL.md), [`party-state-update`](skills/party-state-update/SKILL.md)
  - References: [`party-state.md`](references/party-state.md)

### Businesses

- [`business-create`](skills/business-create/SKILL.md) — Creates a separately financed business after ownership is established.
  - Related skills: [`business-update`](skills/business-update/SKILL.md), [`business-day-reconcile`](skills/business-day-reconcile/SKILL.md), [`business-remove`](skills/business-remove/SKILL.md)
  - References: [`businesses.md`](references/businesses.md)
- [`business-update`](skills/business-update/SKILL.md) — Updates established business operations, capital, staff, expenses, or financing, with explicit approval required before financial changes.
  - Related skills: [`business-create`](skills/business-create/SKILL.md), [`business-day-reconcile`](skills/business-day-reconcile/SKILL.md), [`business-remove`](skills/business-remove/SKILL.md)
  - References: [`businesses.md`](references/businesses.md)
- [`business-day-reconcile`](skills/business-day-reconcile/SKILL.md) — Closes one financial day or one compressed multi-day span for every active business and prints its signed net result with gross income and expenses.
  - Related skills: [`business-update`](skills/business-update/SKILL.md), [`dice-roll`](skills/dice-roll/SKILL.md), [`party-long-rest`](skills/party-long-rest/SKILL.md), [`time-advance`](skills/time-advance/SKILL.md)
  - References: [`businesses.md`](references/businesses.md)
- [`business-status-show`](skills/business-status-show/SKILL.md) — Displays separate business capital, earnings, expenses, and debt without changing state.
  - Related skills: [`party-status-show`](skills/party-status-show/SKILL.md)
  - References: [`businesses.md`](references/businesses.md)
- [`business-remove`](skills/business-remove/SKILL.md) — Archives a conclusively sold, closed, or terminated business.
  - Related skills: [`business-day-reconcile`](skills/business-day-reconcile/SKILL.md), [`business-update`](skills/business-update/SKILL.md), [`event-record`](skills/event-record/SKILL.md)
  - References: [`businesses.md`](references/businesses.md)
  - Tools: [`validate-businesses.mjs`](tools/validate-businesses.mjs)

### Combat preparation and reconciliation

- [`combat-start`](skills/combat-start/SKILL.md) — Narrates the perceptible combat trigger and creates the persistent encounter handoff in `combat.md`.
  - Related skills: [`combat-finish`](skills/combat-finish/SKILL.md), [`party-state-initialize`](skills/party-state-initialize/SKILL.md)
  - References: [`combat-file.md`](references/combat-file.md), [`party-state.md`](references/party-state.md)
- [`combat-finish`](skills/combat-finish/SKILL.md) — Applies and archives a resolved encounter's consequences.
  - Related skills: [`item-consume`](skills/item-consume/SKILL.md), [`item-loot`](skills/item-loot/SKILL.md), [`party-inventory-update`](skills/party-inventory-update/SKILL.md), [`party-level-up`](skills/party-level-up/SKILL.md), [`party-member-death`](skills/party-member-death/SKILL.md), [`party-state-update`](skills/party-state-update/SKILL.md)
  - References: [`combat-file.md`](references/combat-file.md), [`party-state.md`](references/party-state.md)
- [`encounter-check`](skills/encounter-check/SKILL.md) — Determines whether unsafe overnight rest draws a hostile threat.
  - Related skills: [`combat-start`](skills/combat-start/SKILL.md), [`dice-roll`](skills/dice-roll/SKILL.md), [`party-long-rest`](skills/party-long-rest/SKILL.md)

### NPCs and factions

- [`npc-meet`](skills/npc-meet/SKILL.md) — Creates canonical records for individually significant NPCs.
  - Related skills: [`faction-update`](skills/faction-update/SKILL.md), [`location-update`](skills/location-update/SKILL.md)
- [`npc-update`](skills/npc-update/SKILL.md) — Persists durable changes to an existing NPC.
  - Related skills: [`party-member-adopt`](skills/party-member-adopt/SKILL.md)
- [`faction-update`](skills/faction-update/SKILL.md) — Creates or updates durable faction state and relationships.

### Games and cards

- [`cards-shuffle`](skills/cards-shuffle/SKILL.md) — Creates one fair shuffled standard 52-card deck for story-mode card games.
  - Related skills: [`poker-play`](skills/poker-play/SKILL.md)
  - Tools: [`shuffle.mjs`](tools/shuffle.mjs)
- [`poker-play`](skills/poker-play/SKILL.md) — Runs persistent Texas Hold'em and five-card draw with enforced betting and showdowns.
  - Related skills: [`cards-shuffle`](skills/cards-shuffle/SKILL.md), [`npc-meet`](skills/npc-meet/SKILL.md), [`session-end`](skills/session-end/SKILL.md), [`session-resume`](skills/session-resume/SKILL.md)
  - References: [`debts.md`](references/debts.md)
  - Tools: [`poker.mjs`](tools/poker.mjs), [`shuffle.mjs`](tools/shuffle.mjs)

### Quests, locations, and world state

- [`quest-complete`](skills/quest-complete/SKILL.md) — Resolves and archives a quest with a terminal disposition.
  - Related skills: [`party-xp-award`](skills/party-xp-award/SKILL.md)
- [`quest-receive`](skills/quest-receive/SKILL.md) — Creates an accepted objective with outcome-level goals.
- [`quest-update`](skills/quest-update/SKILL.md) — Records completion of a defined quest goal or counted unit.
  - Related skills: [`quest-complete`](skills/quest-complete/SKILL.md), [`quest-receive`](skills/quest-receive/SKILL.md)
  - Tools: [`logTrigger.js`](skills/quest-update/scripts/logTrigger.js)
- [`location-discover`](skills/location-discover/SKILL.md) — Creates canonical storage for a newly established place.
- [`location-update`](skills/location-update/SKILL.md) — Persists durable changes to places and public conditions.
- [`event-record`](skills/event-record/SKILL.md) — Records a notable noncombat occurrence for later retrieval.
- [`milestone-record`](skills/milestone-record/SKILL.md) — Records a sparse campaign-defining turning point.

### Inventory, items, and spells

- [`debt-create`](skills/debt-create/SKILL.md) — Records an accepted future financial obligation.
  - Related skills: [`debt-pay`](skills/debt-pay/SKILL.md), [`debt-resolve`](skills/debt-resolve/SKILL.md), [`debt-update`](skills/debt-update/SKILL.md), [`item-buy`](skills/item-buy/SKILL.md)
  - References: [`debts.md`](references/debts.md)
- [`debt-pay`](skills/debt-pay/SKILL.md) — Pays and advances or completes an active obligation.
  - Related skills: [`debt-create`](skills/debt-create/SKILL.md), [`debt-resolve`](skills/debt-resolve/SKILL.md), [`debt-update`](skills/debt-update/SKILL.md)
  - References: [`debts.md`](references/debts.md)
- [`debt-update`](skills/debt-update/SKILL.md) — Revises established obligation terms without payment.
  - Related skills: [`debt-create`](skills/debt-create/SKILL.md), [`debt-pay`](skills/debt-pay/SKILL.md), [`debt-resolve`](skills/debt-resolve/SKILL.md)
  - References: [`debts.md`](references/debts.md)
- [`debt-resolve`](skills/debt-resolve/SKILL.md) — Closes an obligation through a terminal nonpayment outcome.
  - Related skills: [`debt-create`](skills/debt-create/SKILL.md), [`debt-pay`](skills/debt-pay/SKILL.md), [`debt-update`](skills/debt-update/SKILL.md)
  - References: [`debts.md`](references/debts.md)
- [`debt-show`](skills/debt-show/SKILL.md) — Displays the active obligation ledger and financial totals without changing state.
  - Related skills: [`party-status-show`](skills/party-status-show/SKILL.md)
  - References: [`debts.md`](references/debts.md)

- [`item-buy`](skills/item-buy/SKILL.md) — Purchases items or services and deducts exact currency.
  - Related skills: [`debt-create`](skills/debt-create/SKILL.md), [`party-inventory-update`](skills/party-inventory-update/SKILL.md)
  - References: [`debts.md`](references/debts.md)
- [`item-sell`](skills/item-sell/SKILL.md) — Sells owned property and adds exact proceeds.
  - Related skills: [`party-inventory-update`](skills/party-inventory-update/SKILL.md)
- [`item-loot`](skills/item-loot/SKILL.md) — Records established loot in shared party inventory.
  - Related skills: [`party-inventory-update`](skills/party-inventory-update/SKILL.md)
- [`item-identify`](skills/item-identify/SKILL.md) — Persists an item's established identity and properties.
  - Related skills: [`party-inventory-update`](skills/party-inventory-update/SKILL.md), [`quest-receive`](skills/quest-receive/SKILL.md)
- [`item-consume`](skills/item-consume/SKILL.md) — Applies established consumption of carried personal equipment.
  - Related skills: [`combat-finish`](skills/combat-finish/SKILL.md), [`party-inventory-update`](skills/party-inventory-update/SKILL.md)
- [`party-inventory-update`](skills/party-inventory-update/SKILL.md) — Mutates canonical shared party inventory.
  - Related skills: [`item-buy`](skills/item-buy/SKILL.md), [`item-identify`](skills/item-identify/SKILL.md), [`item-loot`](skills/item-loot/SKILL.md), [`item-sell`](skills/item-sell/SKILL.md)
- [`party-inventory-show`](skills/party-inventory-show/SKILL.md) — Displays categorized shared party inventory without changing it.
  - Related skills: [`party-inventory-update`](skills/party-inventory-update/SKILL.md)
- [`spell-cast`](skills/spell-cast/SKILL.md) — Resolves and persists an out-of-combat spell cast.
  - Related skills: [`combat-finish`](skills/combat-finish/SKILL.md), [`dice-roll`](skills/dice-roll/SKILL.md), [`item-consume`](skills/item-consume/SKILL.md), [`party-inventory-update`](skills/party-inventory-update/SKILL.md), [`party-state-update`](skills/party-state-update/SKILL.md)
  - References: [`party-state.md`](references/party-state.md)

### Party members and party state

- [`party-member-adopt`](skills/party-member-adopt/SKILL.md) — Promotes an NPC with an authentically agreed ongoing party alliance while preserving evolving NPC agency and current commitments.
  - Related skills: [`milestone-record`](skills/milestone-record/SKILL.md), [`party-member-create`](skills/party-member-create/SKILL.md), [`party-member-retire`](skills/party-member-retire/SKILL.md), [`party-state-update`](skills/party-state-update/SKILL.md)
- [`party-member-create`](skills/party-member-create/SKILL.md) — Builds, approves, validates, and adds one complete party character.
  - Related skills: [`campaign-start`](skills/campaign-start/SKILL.md), [`milestone-record`](skills/milestone-record/SKILL.md), [`party-member-adopt`](skills/party-member-adopt/SKILL.md), [`party-member-update`](skills/party-member-update/SKILL.md), [`party-member-validate`](skills/party-member-validate/SKILL.md), [`party-state-update`](skills/party-state-update/SKILL.md)
- [`party-member-death`](skills/party-member-death/SKILL.md) — Archives a permanently dead member and leaves a linked memorial.
  - Related skills: [`combat-finish`](skills/combat-finish/SKILL.md), [`event-record`](skills/event-record/SKILL.md), [`milestone-record`](skills/milestone-record/SKILL.md), [`party-state-update`](skills/party-state-update/SKILL.md)
- [`party-member-update`](skills/party-member-update/SKILL.md) — Persists established permanent or narrative character changes.
  - Related skills: [`party-level-up`](skills/party-level-up/SKILL.md), [`party-member-adopt`](skills/party-member-adopt/SKILL.md), [`party-member-create`](skills/party-member-create/SKILL.md), [`party-member-validate`](skills/party-member-validate/SKILL.md), [`party-state-update`](skills/party-state-update/SKILL.md)
  - References: [`custom-spells-template.md`](skills/party-member-update/references/custom-spells-template.md), [`personality-template.md`](skills/party-member-update/references/personality-template.md), [`stats-template.md`](skills/party-member-update/references/stats-template.md)
  - Tools: [`validatePartyMember.mjs`](skills/party-member-update/scripts/validatePartyMember.mjs)
- [`party-member-retire`](skills/party-member-retire/SKILL.md) — Returns a living member to canonical NPC status with player consent.
  - Related skills: [`event-record`](skills/event-record/SKILL.md), [`milestone-record`](skills/milestone-record/SKILL.md), [`party-member-adopt`](skills/party-member-adopt/SKILL.md), [`party-member-death`](skills/party-member-death/SKILL.md), [`party-state-update`](skills/party-state-update/SKILL.md)
- [`party-xp-award`](skills/party-xp-award/SKILL.md) — Awards an established amount of noncombat story XP.
  - Related skills: [`party-level-up`](skills/party-level-up/SKILL.md), [`quest-complete`](skills/quest-complete/SKILL.md)
- [`party-level-up`](skills/party-level-up/SKILL.md) — Advances and validates active characters one at a time.
  - Related skills: [`dice-roll`](skills/dice-roll/SKILL.md), [`milestone-record`](skills/milestone-record/SKILL.md), [`party-member-update`](skills/party-member-update/SKILL.md), [`party-member-validate`](skills/party-member-validate/SKILL.md)
  - References: [`party-state.md`](references/party-state.md), [`level-up-checklist.md`](skills/party-level-up/references/level-up-checklist.md)
- [`party-state-update`](skills/party-state-update/SKILL.md) — Persists established transient mechanical state changes.
  - Related skills: [`combat-finish`](skills/combat-finish/SKILL.md), [`party-member-adopt`](skills/party-member-adopt/SKILL.md)
  - References: [`party-state.md`](references/party-state.md)

## Combat role skills

- [`combat-fight`](skills/combat-fight/SKILL.md) — Resolves persistent combat in memory and checkpoints completed state.
  - Related skills: [`dice-roll`](skills/dice-roll/SKILL.md), [`item-consume`](skills/item-consume/SKILL.md), [`party-spells-show`](skills/party-spells-show/SKILL.md), [`party-status-show`](skills/party-status-show/SKILL.md)
  - References: [`combat-file.md`](references/combat-file.md), [`combat-protocol.md`](skills/combat-fight/references/combat-protocol.md)
  - Tools: [`rollDice.js`](skills/combat-fight/scripts/rollDice.js)

`/fight` is a trigger declared by `combat-fight`; it is not an alias skill.

## Shared utility skills

- [`dice-roll`](skills/dice-roll/SKILL.md) — Executes campaign-scoped dice requests and logs authoritative results.
  - Related skills: [`combat-fight`](skills/combat-fight/SKILL.md)
  - Tools: [`rollDice.js`](skills/combat-fight/scripts/rollDice.js)
- [`party-status-show`](skills/party-status-show/SKILL.md) — Displays present party mechanics, absent members' locations, and accompanying NPCs without changing state.
  - Related skills: [`business-status-show`](skills/business-status-show/SKILL.md), [`combat-fight`](skills/combat-fight/SKILL.md), [`debt-show`](skills/debt-show/SKILL.md)
  - References: [`businesses.md`](references/businesses.md), [`calendar.md`](references/calendar.md), [`debts.md`](references/debts.md), [`party-state.md`](references/party-state.md)
- [`party-spells-show`](skills/party-spells-show/SKILL.md) — Displays party spell lists, current slots, and brief mechanical summaries without changing state.
  - Related skills: [`combat-fight`](skills/combat-fight/SKILL.md)
  - References: [`party-state.md`](references/party-state.md)

`dice-roll`, `party-status-show`, and `party-spells-show` are shared with combat.

`/roll` is a `dice-roll` trigger, and its campaign-scoped append to

`roll-history.log` is intentional. Both report skills are strictly read-only in

every role.

## Administration, setup, and validation skills

### Before campaign selection

- [`campaign-start`](skills/campaign-start/SKILL.md) — Creates and scaffolds a new validated level-1 campaign.
  - Related skills: [`campaign-open`](skills/campaign-open/SKILL.md), [`party-member-create`](skills/party-member-create/SKILL.md), [`party-member-update`](skills/party-member-update/SKILL.md), [`party-member-validate`](skills/party-member-validate/SKILL.md), [`session-end`](skills/session-end/SKILL.md), [`session-resume`](skills/session-resume/SKILL.md)
  - References: [`calendar.md`](references/calendar.md), [`campaign-info.md`](references/campaign-info.md), [`party-state.md`](references/party-state.md), [`scaffold.md`](skills/campaign-start/references/scaffold.md)
- [`campaign-open`](skills/campaign-open/SKILL.md) — Opens an existing campaign from unambiguous intent, prompts only for missing choices, and provides campaign-entry help for a bare `help` request.
  - Related skills: [`campaign-start`](skills/campaign-start/SKILL.md), [`combat-fight`](skills/combat-fight/SKILL.md), [`combat-finish`](skills/combat-finish/SKILL.md), [`combat-start`](skills/combat-start/SKILL.md), [`debt-create`](skills/debt-create/SKILL.md), [`debt-pay`](skills/debt-pay/SKILL.md), [`debt-resolve`](skills/debt-resolve/SKILL.md), [`debt-show`](skills/debt-show/SKILL.md), [`debt-update`](skills/debt-update/SKILL.md), [`dice-roll`](skills/dice-roll/SKILL.md), [`party-member-adopt`](skills/party-member-adopt/SKILL.md), [`party-member-death`](skills/party-member-death/SKILL.md), [`party-member-retire`](skills/party-member-retire/SKILL.md), [`party-spells-show`](skills/party-spells-show/SKILL.md), [`party-status-show`](skills/party-status-show/SKILL.md), [`session-resume`](skills/session-resume/SKILL.md)
  - References: [`battle.md`](skills/campaign-open/references/battle.md), [`campaign-information.md`](skills/campaign-open/references/campaign-information.md), [`continue-story.md`](skills/campaign-open/references/continue-story.md), [`story-mode-rules.md`](references/story-mode-rules.md)
- [`campaign-import`](skills/campaign-import/SKILL.md) — Reconstructs campaign canon from a conversation export.
  - Related skills: [`campaign-start`](skills/campaign-start/SKILL.md), [`debt-create`](skills/debt-create/SKILL.md), [`debt-pay`](skills/debt-pay/SKILL.md), [`debt-resolve`](skills/debt-resolve/SKILL.md), [`debt-update`](skills/debt-update/SKILL.md), [`event-record`](skills/event-record/SKILL.md), [`faction-update`](skills/faction-update/SKILL.md), [`item-identify`](skills/item-identify/SKILL.md), [`item-loot`](skills/item-loot/SKILL.md), [`location-discover`](skills/location-discover/SKILL.md), [`location-update`](skills/location-update/SKILL.md), [`milestone-record`](skills/milestone-record/SKILL.md), [`npc-meet`](skills/npc-meet/SKILL.md), [`npc-update`](skills/npc-update/SKILL.md), [`party-member-death`](skills/party-member-death/SKILL.md), [`party-member-retire`](skills/party-member-retire/SKILL.md), [`party-member-update`](skills/party-member-update/SKILL.md), [`party-xp-award`](skills/party-xp-award/SKILL.md), [`quest-complete`](skills/quest-complete/SKILL.md), [`quest-receive`](skills/quest-receive/SKILL.md), [`quest-update`](skills/quest-update/SKILL.md)
  - References: [`calendar.md`](references/calendar.md), [`campaign-info.md`](references/campaign-info.md), [`debts.md`](references/debts.md), [`party-state.md`](references/party-state.md), [`historical-reconciliation.md`](skills/campaign-import/references/historical-reconciliation.md)
  - Tools: [`readConversation.mjs`](tools/readConversation.mjs), [`validateImport.mjs`](skills/campaign-import/scripts/validateImport.mjs), [`validatePartyMember.mjs`](skills/party-member-update/scripts/validatePartyMember.mjs)

### Campaign support

- [`campaign-validate`](skills/campaign-validate/SKILL.md) — Audits complete campaign structure and cross-file consistency.
  - Related skills: [`campaign-start`](skills/campaign-start/SKILL.md), [`party-member-update`](skills/party-member-update/SKILL.md), [`party-member-validate`](skills/party-member-validate/SKILL.md)
  - References: [`businesses.md`](references/businesses.md), [`calendar.md`](references/calendar.md), [`campaign-info.md`](references/campaign-info.md), [`debts.md`](references/debts.md), [`campaign-checklist.md`](skills/campaign-validate/references/campaign-checklist.md)
  - Tools: [`markdown-format.mjs`](tools/markdown-format.mjs), [`validate-businesses.mjs`](tools/validate-businesses.mjs), [`validateCampaign.mjs`](skills/campaign-validate/scripts/validateCampaign.mjs), [`validatePartyMember.mjs`](skills/party-member-update/scripts/validatePartyMember.mjs)
- [`party-member-validate`](skills/party-member-validate/SKILL.md) — Audits character completeness, mechanics, and rules legality.
  - Related skills: [`party-level-up`](skills/party-level-up/SKILL.md), [`party-member-adopt`](skills/party-member-adopt/SKILL.md), [`party-member-create`](skills/party-member-create/SKILL.md), [`party-member-update`](skills/party-member-update/SKILL.md)
  - References: [`audit-checklist.md`](skills/party-member-validate/references/audit-checklist.md)
  - Tools: [`validatePartyMember.mjs`](skills/party-member-update/scripts/validatePartyMember.mjs)
- [`party-state-initialize`](skills/party-state-initialize/SKILL.md) — Creates or repairs canonical transient party state.
  - References: [`party-state.md`](references/party-state.md)

Role selection loads role instruction references; it does not require separate

skills whose only purpose is to represent the selected role.

## Maintenance requirements

When creating, renaming, replacing, or removing a skill:

1. Use the canonical `<noun>-<verb>` convention.

2. Classify the skill's role and filesystem permissions before implementation.

3. Update its directory, frontmatter, UI metadata, cross-skill references,

   scripts, role instructions, examples, and announcements together.

4. Update this registry in the same change, preserving role grouping, the

   linked `skill-name — purpose` format, and nested links to every related

   skill, reference Markdown file, and executable tool.

5. Declare command phrases as triggers on the canonical skill instead of

   creating alias skills.

6. Validate the complete skill set, every registry link, Markdown links, and

   stale canonical names.
