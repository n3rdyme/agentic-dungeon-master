# Broken Markdown link repair

Use this workflow only for missing local `.md` destinations reported by `../../../tools/validate-markdown-links.cjs` in the selected campaign.

## Repair boundary

- Search only inside the selected campaign. Resolve the reported destination relative to its source file, preserve any fragment, and inspect the source context before searching for a replacement.
- Repair a link only when exactly one existing canonical Markdown file is established as the same entity or record after an already-completed rename or move. Require both a unique candidate and lifecycle evidence from the owning workflow; filename similarity alone is insufficient.
- Change only the stale destination. Preserve the link label, fragment, surrounding prose, and historical meaning. Calculate a relative path from the source file and use forward slashes.
- Never create, rename, move, copy, restore, retire, resolve, archive, remove, or otherwise transition an entity merely to make validation pass. Never alter rosters, state, status, accounting, XP, inventory, chronology, or other canon as link repair. Those operations remain owned by their dedicated skills and retain all of their consent and evidence requirements.
- If a reported source belongs to protected party storage, this authorization extends only to its stale Markdown destination; it does not authorize any other party-member change.

## Established relocation patterns

Check the relevant owning skill before applying one of these repairs:

- **Resolved quest:** [`quest-complete`](../../quest-complete/SKILL.md) moves the single quest file from `quests/active/` to `quests/resolved/`. Repair an old active-path link only when the same quest file exists under `resolved`, its status and resolution fields establish completion, and no competing quest candidate exists.
- **Retired or dead party member:** [`party-member-retire`](../../party-member-retire/SKILL.md) and [`party-member-death`](../../party-member-death/SKILL.md) move `party/<Name>/` to `party/retired/<Name>/` while leaving a status-bearing root hub. Repair an old detail-file path only when that hub says `Retired` or `Dead`, the archive exists, and the member is absent from the active roster and party state.
- **Restored party member:** [`party-member-adopt`](../../party-member-adopt/SKILL.md) moves a retired member's archive back to `party/<Name>/`. Repair an old archive path only when the active directory and hub exist, the member is present in the active roster and party state, and no retired directory remains. Never interpret a `Dead` memorial as evidence of restoration.
- **Removed business:** [`business-remove`](../../business-remove/SKILL.md) moves the complete directory from `data/businesses/<business-id>/` to `data/businesses/removed/<business-id>/`. Repair an old active-business path only when the same id exists only under `removed` and its `business.json` status and closing metadata establish removal.
- **Archived combat:** [`combat-finish`](../../combat-finish/SKILL.md) moves a resolved `combat.md` to a uniquely named record under `log/Combat/`. Repair a stale live-combat link only when source context supplies an Encounter ID and exactly one archive with that ID exists and records the resolved encounter.
- **Compressed Daily:** [`time-advance`](../../time-advance/SKILL.md) may move the starting day's Daily to `log/Daily/<startDay>-<finalDay> - <Location>.md`. Repair the old single-day path only when exactly one range Daily begins on that same day and its contents establish the same interval and location.
- **Established identity rename:** [`npc-update`](../../npc-update/SKILL.md) requires links to be repaired after an identity revelation. [`item-identify`](../../item-identify/SKILL.md) keeps one canonical file per unique item identity. Repair an old NPC or item destination only when aliases, provenance, or explicit identity history uniquely proves that the existing file is the same entity; do not infer identity from resemblance.

For another rename or move, read the owning skill that established it and apply the same standard: the transition is already canonical, the old target is absent, one new target is uniquely proven, and changing the destination preserves rather than rewrites history.

## Recheck and unresolved report

After each confident batch, rerun the Markdown-link validator. Continue until it returns `[]` or no additional repair is justified. Let the full campaign validator format the touched Markdown and collect all other findings.

When any link remains unresolved, keep the validator's exact JSON grouped by source file. Run the rest of campaign validation, then display that JSON and briefly identify any candidates or conflicts found. Ask the user one concise question for the destination or canon needed to resolve the links. Do not choose among ambiguous candidates or suppress the failure.
