---
name: session-end
description: Reconcile filesystem-backed campaign canon and replace the campaign's resume.md operational checkpoint so a later chat can continue without reconstructing current state. Use when the player ends, pauses, saves, or closes a campaign session; keep Daily logs as historical summaries and store the live situation, pending decisions, relevant state, and canon links in resume.md.
---

# End Campaign Session

Act as the campaign DM. Never advance time because the chat ends.

Never edit `campaign-info.md`; it is immutable unless the user explicitly asks the OOC DM to update the creative contract.

First read `../../references/party-state.md`, `../../references/debts.md`, `../../references/businesses.md`, and `../../references/calendar.md` and reconcile canonical files for events that actually occurred: current Daily summary, completed combat outcomes, entities, quests, equipment, shared inventory, currency, XP, current location, and `data/party-state.json`. Daily files summarize what happened during their campaign day; never use them as transient resume state.

If `combat.md` exists, read it and link it from `resume.md` with its encounter ID and status. Never duplicate its setup, action history, or resolution.

If `data/poker-state.json` exists with an unfinished hand, link it from `resume.md` and preserve the table, variant, betting street, acting player, and pending player decision through `poker-play`. Never copy the deck, hole cards, burn cards, or other hidden state into `resume.md`.

Then create or completely replace `campaigns/<Player>/resume.md`. It is the single mutable operational checkpoint, not chronology and not a source that overrides canonical status or entity files. Include every known fact needed to continue the immediate situation without reloading the campaign, while linking durable details instead of copying entire files.

Use this shape and omit no applicable section:

```markdown
# Resume State

**Day:** <day> (<day_of_week>)

**Location:** [<location>](<relative link>)

## Immediate Situation
<where the scene stopped, what is happening, and the last established action>

## Operational Continuity
<the current multi-step attempt, last completed immediate step, current step, next intended step, and imminent plan or contingencies; use None when no such sequence is active>

## Awaiting the Player
<unresolved decision or None>

## Present Characters
<party and NPC links, current disposition, positioning, and scene relevance>

## State References
- [Campaign status](data/status.json)
- [Transient party state](data/party-state.json)
- [Shared inventory](data/inventory.json)

<add [Active poker state](data/poker-state.json) when an unfinished hand exists>

<links only; add character equipment or another canonical state file only when the immediate scene requires it>

## Active Work
<links to quests being actively pursued and why each matters now, or None>

## Other Open Threads
<known unresolved threats, promises, leads, and consequences, with links>

## Recent Chronology
<links to the current Daily and enough recent relevant Daily/Event records to explain the present situation>

## Relevant Milestones
<links to milestones that materially affect the current situation, or None>

## Relevant Canon
<links to current location, involved NPCs, factions, items, and other files the next chat should read>

```

Use root-relative Markdown relationships expressed as relative file links. Remove stale material from the previous checkpoint. Mark unknowns explicitly; never invent them. Validate all three JSON files and every link in `resume.md`. Do not copy HP, spell slots, Hit Dice, conditions, effects, XP, currency, inventory contents, equipment contents, or other canonical state into `resume.md`. Link the authoritative file instead. Keep time pressure and other scene-specific consequences in Immediate Situation or Awaiting the Player only when they are necessary to resume the fiction.

Treat unfinished execution and imminent plans as operational continuity, not quest progress. Preserve where the party is within a multi-step attempt even when none of its defined quest goals has completed. Do not copy those intermediate steps into quest files.

Treat a missing `debts` field as `[]`. Preserve any due, overdue, or imminent obligation that materially affects continuation under Other Open Threads by linking `data/status.json`; do not copy the ledger or calculated totals into `resume.md`.

Under State References, link every active business's `Business.md`, `business.json`, and `debts.json`, plus its latest reconciliation when one exists. Preserve setup gaps, capital, unfunded expenses, and the next day that must reconcile through those links; never copy business debt into party obligations.

When ready, give only a natural brief acknowledgement that the campaign is saved. Do not display checkpoint contents, file lists, or a structured record.
