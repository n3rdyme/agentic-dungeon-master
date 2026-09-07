---
name: party-status-show
description: Display a compact read-only summary of the selected campaign's current day and weekday, XP, party currency and obligations, separate business capital, present party members, absent active members' last known locations, and accompanying non-party NPCs using only established mechanics. Use in both Story and Combat roles. Always use for the exact messages `status` and `status?`, as well as `/status`, "party status," "show party status," or other requests to check the party's current mechanical condition; never mutate campaign files.
---

# Show Party Status

Read the selected campaign's `data/status.json`, `data/party-state.json`, `party.md`, and each active member's `Stats.md`. Use the active scene and the minimum current canon needed to identify which active members are present, which active members were left behind, their last known locations, and any non-party NPCs currently traveling with the group. Read `../../references/party-state.md` for state ownership, `../../references/debts.md` for obligation calculations, `../../references/businesses.md` for separate business capital, and `../../references/calendar.md` for weekday handling. Do not read retired members, infer missing values, recover resources, or modify any file.

When the group is traveling or otherwise split, distinguish active party membership from current presence:

- Give the normal mechanical entry only for active members currently with the player character.

- For each active member left behind, omit their mechanical entry and show `**<Name>:** <Last known location>` instead. Use the most specific established location and never infer one.

- Include each established non-party NPC currently traveling with the player character. Give them the same heading-and-lines presentation as a present party member, but include only facts explicitly established in current canon or live combat state. Omit every unknown line; never estimate NPC HP, Hit Dice, conditions, spell slots, resources, or maxima.

- Do not treat a temporary traveling NPC as an active party member and do not add them to `party.md` or `data/party-state.json`.

If current presence or an absent member's last known location is genuinely unclear, identify that conflict briefly rather than silently assuming everyone is together.

Use `Stats.md` for HP, Hit Die, spell-slot, and resource maxima. Use `data/party-state.json` for all current and remaining values. If required data is missing or inconsistent, identify the conflict briefly instead of silently repairing it.

Display a missing `day_of_week` as Sunday without modifying status. Report a present invalid value as a conflict.

Treat a missing `debts` field as `[]`. Calculate finite outstanding, indefinite recurring count, reserved obligations, and uncommitted funds from the shared debt rules. Never count a proposal absent from status.

In Combat role, preserve the combat engine's read-only boundary. Use the current in-memory encounter state for every value changed since the latest checkpoint, falling back to `combat.md` for the latest completed checkpoint and `data/party-state.json` only for unchanged opening values. Never discard an in-memory delta, reread stale state over it, mutate campaign state, or write a combat checkpoint merely to answer status.

## Format

Return the entire response as one fenced `markdown` code block with no text before or after it. Display the party-wide lines first:

```markdown
Day: <Day> (<day_of_week>)
Time: <Approximate time of day with modifier (early morning, late afternoon, etc.)>
XP: <Xp>/<XpLevelUp>
Currency on Hand: <Gold>gp <Silver>sp
Obligations: <finite total> (<active count> active)
- <amount> to <name> (due Day <next_due_day> — <condition>)
Available Funds: <currency minus reserved obligations>
Business — <name>: <capital> capital; Day <last reconciled day> net <signed amount>
```

Always show gp and sp, including zero values. Append `<Copper>cp` only when Copper is nonzero. Do not convert denominations.

After Available Funds, add exactly one compact line for each active business in stable ID order. Read only its `business.json` and latest ledger. For a one-day ledger, use `Business — <name>: <capital> capital; Day <day> net <signed amount>`. Treat a historical ledger without `day_count` as one day. For `day_count > 1`, use `Business — <name>: <capital> capital; Days <start>-<end> aggregate net <signed amount>`, where `<end> = <start> + day_count`. Before the first reconciliation, replace the final clause with `not yet reconciled`. Append `; <amount> unfunded` when nonzero and `; setup incomplete` when false. Business capital is never included in Currency on Hand or Available Funds.

Then display present active members in `party.md` order using a level-two heading:

```markdown
## <Name>
HP: <CurrentHP>/<Hit Point Maximum>, Hit Dice: <total remaining> remaining
Conditions: <comma-separated active conditions>
Spell Slots: 1st <remaining>/<maximum>, 2nd <remaining>/<maximum>
```

Place the HP line immediately after each member heading with no blank line. Always show HP and remaining Hit Dice. Show Conditions only when at least one condition is active; never output `Conditions: None`. Use `Hit Die` when exactly one remains and `Hit Dice` otherwise. For multiclass characters with different die sizes, append a compact parenthetical breakdown by die size. Show Spell Slots only for a character with spell slots; list only applicable slot levels in ascending order and use ordinal labels.

Show these additional lines only when applicable:

- `Temporary HP: <value>` when nonzero.
- `Exhaustion: <value>` when nonzero.
- `Death Saves: <successes> successes, <failures> failures` when CurrentHP is zero or either count is nonzero.

- `Resources: <name> <remaining>/<maximum>, ...` when limited resources exist.
- `Concentration: <effect>` when concentration is active.
- `Effects: <compact active-effect summary>` when continuing effects exist.

After present active members, show any absent active members in `party.md` order as standalone lines:

```markdown
**<Name>:** <Last known location>
```

Then show accompanying non-party NPCs using the same level-two heading and applicable mechanical lines as present members. Preserve an established travel or seating order; otherwise use the order in which current canon identifies them. Omit an NPC's HP line when either current HP or maximum HP is unknown.

Do not include inventory, equipment, abilities, attacks, AC, biography, quest state, or narrative commentary unless the user separately asks. Do not emit a skill-use announcement; the formatted status is the requested output.
