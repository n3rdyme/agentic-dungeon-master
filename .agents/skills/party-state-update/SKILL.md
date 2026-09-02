---
name: party-state-update
description: Persist an established change to canonical transient mechanics in data/party-state.json. Use only in story mode for HP, temporary HP, Hit Dice, death saves, conditions, exhaustion, spell slots, limited resources, concentration, or continuing effects, including final deltas reconciled by combat-finish.
---

# Party State Update

Act only as the story DM or an administrative reconciliation workflow. Never run during Ready or In Progress combat. Read `../../references/party-state.md`, the complete `data/party-state.json`, and the affected active characters' validated `Stats.md` before changing state.

Require an established source and exact affected fields. For a resolved combat, also require Status Resolved, the Encounter ID, opening state, final state, and complete deltas from `combat.md`. Never infer an expenditure or recovery from silence.

When `party-member-adopt` supplies a noncanonical staged character path and a prospective new-character state entry, validate that entry against the staged `Stats.md` and current party level without writing canonical state. Label this result **STAGED**. Apply it only after the adoption workflow commits the member to `party.md` and `party/<Name>/`; on that second invocation, repeat every before-value and maximum check before replacing canonical state.

Validate each proposed value against its permanent maximum and governing rule. Preserve nonparticipants, unaffected fields, unknown extension fields, and all state not explicitly changed. Reject negative remaining uses, unsupported recovery, HP beyond an allowed maximum, an unknown character, or a delta that does not reconcile with its recorded before and after values.

Apply the complete logical change as one JSON transaction:

1. Parse the full current file.
2. Verify every expected before value.
3. Stage only the established field changes.
4. Validate the complete staged document.
5. Replace `data/party-state.json` once and reread it to verify the result.

If the canonical file already contains every expected final value, treat the transaction as already applied. If only part matches, stop and report the conflict; never apply a partial delta or guess which part is authoritative.

Do not edit permanent mechanics, Equipment, shared inventory, currency, XP, chronology, or narrative canon. Persist silently unless player input is needed to resolve an actual contradiction.
