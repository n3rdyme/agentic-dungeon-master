---
name: campaign-import
description: Import an Anthropic conversation export into a new filesystem-backed tabletop campaign, or resume an interrupted import from its saved ordinal bookmark, while preserving evolving active-party personality, knowledge, relationships, and shared language. Use when the user invokes Import Campaign, asks to reconstruct campaign canon from a conversation JSON file, or supplies a split Anthropic conversation to migrate into a new `campaigns/PLAYER` folder.
---

# Import Campaign

Reconstruct campaign canon one fictional day at a time. Treat the selected conversation branch as source evidence and each completed Daily log as the authoritative ledger for that imported day. Never narrate new fiction, resolve uncertain actions, or invent missing facts.

## Collect and validate inputs

Require:

- a player/campaign name used to create `campaigns/<Player>`; and
- an Anthropic conversation JSON filename readable by `../../tools/readConversation.mjs`.

Use a bare player name as the exact child directory name under `campaigns/`; do not add a suffix. Apply the same safe-name rules as `campaign-start`. Refuse to overwrite an existing campaign unless it contains `data/import-bookmark.json` for the same conversation file; in that case resume the interrupted import.

Do not read canon from other campaigns. Read `../campaign-start/references/scaffold.md`, `../../references/party-state.md`, `../../references/calendar.md`, and `../../references/campaign-info.md` before creating files. Read the full `party-member-update` skill and its Stats, Personality, and custom-spell templates before creating party files. Read `references/historical-reconciliation.md` before processing the first day.

## Create the import scaffold

Create the scaffold directories and files before reading conversation content. Use placeholders where the export has not established canon:

- `data/status.json`: Player, Day `1000`, `day_of_week` `Sunday`, Level `1`, XP `0`, threshold `300`, zero currency, Location `Unknown`, and `debts: []`;
- `data/inventory.json`: `[]`;
- `data/party-state.json`: `{ "Characters": {} }` until active characters and their mechanics are established;
- `data/import-bookmark.json`: conversation filename, Bookmark `"0"`, Day `1000`, and Complete `false`;
- `homebrew.md`, `party.md`, `world.md`, and `resume.md` with concise headings and explicit unestablished/import-in-progress text;
- `campaign-info.md` using the immutable campaign-info template; populate only source-established world-building permissions and prohibitions, plus the player name when known; never place party composition, relationships, current state, or inferred story direction there;
- `party/<Player>.md` plus `Bio.md`, `Appearance.md`, `Personality.md`, `Knowledge.md`, `Stats.md`, and `Equipment.md` placeholders that already conform to the strict templates; create `Custom Spells.md` only when needed; and
- `.gitkeep` files in otherwise empty `party/retired`, `npcs`, `factions`, `items`, `quests/active`, `quests/resolved`, `log/Daily`, `log/Events`, `log/Combat`, and `log/Milestones` directories.

Do not create `world/Unknown.md`, a fake Day log, or invented character data. Replace placeholders only when the conversation establishes facts.

## Read the selected branch incrementally

Invoke from the repository root:

```text
node .agents/tools/readConversation.mjs "<conversation file>" <limit> [bookmark]
```

Use the saved Bookmark as the starting ordinal. Use bounded reads of 25–100 messages so a day boundary is not buried in excessive context. The reader has already removed abandoned branches and internal thinking while retaining text, tool activity, and extracted attachments.

Read sequentially until the earliest established boundary:

- the party completes or settles into an overnight rest, sleep, or night spent;
- narration advances to the next morning or next day; or
- an OOC agreement deliberately skips more than a night, such as "skip winter" or "jump ahead to spring."

A short rest, nap, proposed rest, discussion of sleeping, or plan to skip time is not a boundary until the fiction or OOC agreement establishes that time passes. If a boundary occurs before the end of a returned page, calculate its bookmark as `starting ordinal + number of consumed messages`; do not checkpoint the unread tail.

When a page contains no boundary, fold its established facts into the current day's draft ledger before reading again, but do not advance `status.json` Day or the committed import bookmark. A retry may reread that material, so every draft merge must be idempotent and replace or consolidate facts rather than append duplicates.

## Advance imported time

Start at Day 1000 unless the conversation explicitly establishes another starting day. Always start the imported campaign's `day_of_week` at `Sunday`. Advance both Day and weekday exactly once for an ordinary overnight boundary.

For larger skips, prefer an explicit elapsed duration. Otherwise estimate:

- 7 days per week;
- 30 days per month;
- 90 days per season; and
- 365 days per year.

Apply stated quantities proportionally. Use the most specific unit present and do not add a separate overnight day when it is already included in the skip. Record the wording and estimate in the current Daily log. Do not create empty Daily files for every skipped day.

For every larger skip, advance `day_of_week` by the elapsed days modulo seven and commit it with Day. Never derive the weekday from the numeric Day alone.

## Reconcile one game day

Before reading beyond a boundary, create or update exactly one `log/Daily/<day> - <location>.md` for the consumed interval. Keep it concise but complete enough to serve as the authoritative imported ledger. Record:

- where the party went, time changes, rests, travel, and scene outcomes;
- player and party actions, relationships, injuries, recovery, conditions, resources, level, XP, currency, and accepted unpaid obligations that were explicitly established;
- acquired, consumed, equipped, transferred, sold, or lost items;
- quests received, completed goal-level progress, final dispositions, and rewards;

- named NPC meetings, roles, durable personality, motives, status, location, relationship, demonstrated opinion of the player or party, and meaningful language or knowledge gained;
- locations and durable sites visited or established;
- factions, leadership, goals, resources, territory, and party disposition;
- combats and their established outcomes;
- world-altering events, discoveries, deaths, political changes, destruction, ownership, and other durable consequences; and
- milestones, including every discussion or award of noncombat story XP.

Treat explicit retcons and later statements on the selected branch as authoritative over earlier statements. Preserve uncertainty as `Unknown`; never guess merely to complete a file.

## Derive canonical state from the Daily ledger

After the Daily entry is complete, reconcile the campaign from that ledger and the consumed source messages:

- Build the day's typed consequence queue and route every party-member change through `party-member-update`; route every other entry through the applicable canonical skill listed in `references/historical-reconciliation.md`. Load each applicable skill's full `SKILL.md` before writing that entity type. Apply its schema and lifecycle rules in historical-import mode; do not imitate those rules independently.

- Keep party-wide level, XP, currency, day, location, and active debts in `data/status.json`. Read `../../references/debts.md`; route established unpaid obligations through `debt-create`, payments through `debt-pay`, revised terms through `debt-update`, and nonpayment terminal outcomes through `debt-resolve` in historical-import mode. Never import a quote as debt.
- Keep transient mechanics only in `data/party-state.json`; keep maxima and permanent mechanics in each character's `Stats.md`.
- Put items explicitly assigned for a character's ongoing personal use, wearing, wielding, preparation, attunement, or ready combat access in that character's `Equipment.md`; put other party property in `data/inventory.json`. A character merely picking up, pocketing, packing, or transporting loot does not establish personal assignment.
- Create or update character identity, biography, appearance, personality, and relationships only from established facts.
- Search names and aliases before creating NPC, location, faction, item, quest, Event, Combat, or Milestone files. Update instead of duplicating.
- Store current entity state in its canonical file and history in Daily, Event, Combat, or Milestone records. Cross-link rather than copy.
- Archive resolved historical combats under `log/Combat/<creation Day> - <Encounter ID> - <Encounter Name>.md`; never create a live `combat.md` during import. Use the numeric imported campaign Day on which the archive record is created even when the encounter's historical occurrence date is uncertain.
- Record sparse campaign-defining achievements and every noncombat story-XP award or discussion under `log/Milestones/<creation Day> - <Title>.md`, then apply an explicitly awarded amount to status XP. Do not infer an XP amount.
- Apply `quest-receive`, `quest-update`, and `quest-complete` rules to historical quest receipts, goal progress, and terminal outcomes. Active quest files may exist only in `quests/active`; resolved quest files may exist only in `quests/resolved`; never create quest files directly under `quests`.
- Record established rules exceptions in `homebrew.md`; do not silently repair legacy mechanics to current rules.

## Preserve active party member growth

Treat an NPC who joins and travels with the party as an active party member, not as an ordinary NPC. Store that character under `party/<Name>.md` with a linked `party/<Name>/` directory containing `Bio.md`, `Appearance.md`, `Personality.md`, `Knowledge.md`, `Stats.md`, and `Equipment.md`. Do not maintain a second competing file under `npcs/`. Add the member to `party.md` and `data/party-state.json` when active; use `party/retired` only after an established permanent departure, death, replacement, or obsolescence.

At every imported day checkpoint, use `party-member-update`, then reread each active party member's `Personality.md` and `Knowledge.md`, then merge all established development from that day. Do this even when no mechanical state changed.

Keep `Personality.md` as current cumulative roleplay canon:

- enduring traits, voice, habits, values, fears, desires, boundaries, and recurring behavior;
- current opinion of and relationship with the player and other party members, including trust, affection, loyalty, tension, resentment, protectiveness, attraction, conflict, and repaired conflict when established;
- relationship changes and the shared experiences that materially explain the current state; and
- inside jokes, nicknames, euphemisms, coded phrases, terms of address, and other shared language. Preserve the established wording, participants, meaning, originating context, and any later evolution in meaning.

Do not flatten a developing relationship into a generic adjective. Preserve distinctive interpersonal texture without copying whole conversations. Do not delete an inside joke or euphemism merely because it was not used that day; revise or retire it only when later canon establishes that change. Infer a durable trait only from repeated or especially decisive demonstrated behavior, and preserve ambiguity when evidence is weak.

Keep `Knowledge.md` as that character's perspective, not omniscient campaign canon. Track established facts the character knows, how or from whom they learned them when relevant, confidence or uncertainty, false beliefs, secrets shared with them, information intentionally withheld from them, and specialized knowledge they can apply. Never grant a party member knowledge merely because it appeared elsewhere in the conversation. Update or correct beliefs only when the character learns the correction.

Use Daily logs for chronological detail and these two files for the resulting current personality and perspective. Ensure `resume.md` links the active party members whose personality or knowledge matters to the immediate situation.

Do not invoke gameplay skills once per imported mention. Batch the day's established outcomes while following the workspace's canonical schemas and trigger boundaries.

## Commit the day checkpoint

Complete these steps in order before reading another conversation page:

1. Finish the Daily ledger.

2. Reconcile every affected canonical file.

3. Replace `resume.md` with the immediate post-interval situation, operational continuity, pending player decision, present characters, and links to authoritative state and relevant canon. Do not duplicate mechanics.

4. Parse all JSON, verify links, ensure current canon agrees with the Daily ledger, and confirm no unresolved write remains. Run `node .agents/skills/campaign-import/scripts/validateImport.mjs "campaigns/<Player>"`. Resolve every error. Review every warning and either reconcile it or record the deliberate uncertainty in `data/import-discrepancies.md`.

5. Write `data/status.json` once with the resulting Day, `day_of_week`, and all other established party-wide values.

6. Write `data/import-bookmark.json` last as the checkpoint commit marker:

```json
{
  "ConversationFile": "<filename>",
  "Bookmark": "<next ordinal or null>",
  "Day": 1001,
  "Complete": false
}
```

The bookmark is the next unread ordinal. If processing fails before the bookmark write, leave the prior bookmark intact and make prior writes idempotent on retry. Never read the next slice until the checkpoint is valid.

After an ordinary overnight boundary, the saved Day is the newly begun day. A larger skip advances by the estimated elapsed days. At end of conversation, reconcile the remaining partial day without advancing it, save Bookmark `null`, set Complete `true`, and produce a final resumable checkpoint.

Before setting Complete `true`, perform the end-of-import audit from `references/historical-reconciliation.md`. Conversation exhaustion alone is not completion.

Continue day by day until the conversation ends or a fact essential to safe reconciliation is genuinely ambiguous. Report concise import progress without displaying internal records or copied conversation text.
