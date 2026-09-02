---
name: party-member-validate
description: Audit a filesystem-backed campaign character for completeness, internal consistency, strict 2024 Player's Handbook legality, and compliance with approved homebrew. Use for `/validate character`, "validate character," "audit character sheet," or explicit `$party-member-validate`; check every required species, background, feat, class, subclass, spell, equipment, and level choice plus all derived statistics without modifying files.
---

# Validate Character

Perform a read-only audit. Never repair, normalize, or complete the character unless the user separately authorizes edits after reviewing the findings.

## Resolve the target

1. Use the campaign active in this chat. If none is active, list campaign directories and ask the user to select one.
2. Resolve `<character>` case-insensitively against active and retired party character hubs. Ask when absent or ambiguous; never guess.
3. Read `data/status.json`, `data/inventory.json`, `data/party-state.json`, `homebrew.md` when present, the character hub, and all files in that character's directory.
4. When the character's equipment claims a unique magic item or magical effect, read its linked `items/<Item>.md` file. If the equipment lacks a link, search `items` by exact item identity and report an absent definition.

### Staged creation, adoption, or level-up mode

When `party-member-create`, `party-member-adopt`, or `party-level-up` invokes this skill with both a noncanonical staged character path and an explicit target level, audit the staged character instead of a canonical counterpart. Use the campaign's canonical files for shared context. For creation or adoption, require the target to equal the current `data/status.json` Level; for level-up, require its explicitly staged next level. Label the result **STAGED**. This exception applies only to the read-only precommit audit; normal character validation still requires exact equality with the current party Level.

## Establish the rules baseline

Treat the 2024 Player's Handbook as the strict baseline. Treat `homebrew.md` as the only authority for mechanical exceptions and additions. If it is absent or states that none are approved, no homebrew is approved.

Do not legalize a rule because it appears in the character files. Flag 2014, legacy, third-party, custom, and unsupported mechanics unless `homebrew.md` explicitly approves the exact exception. Cosmetic reflavoring that changes no mechanics is not homebrew.

Verify uncertain rules from an authoritative 2024 source when available. If a rule cannot be verified confidently, report it as unverified rather than inventing a requirement.

## Run the audit

First run the strict structural validator:

```text
node .agents/skills/party-member-update/scripts/validatePartyMember.mjs "campaigns/<Player>" "<character>"
```

Any structural error is a **FAIL**. Then read `references/audit-checklist.md` completely and apply every relevant check through the character's current level. Recalculate derived values independently from recorded choices and equipment. Check both missing benefits and benefits the character should not have.

For spellcasting, "complete" means every required cantrip, prepared-spell, or known-spell selection is filled to its legal capacity. It does not mean the character must possess every spell on the class spell list.

## Report

Return one of these verdicts:

- **PASS**: complete, internally consistent, and compliant.
- **PASS WITH WARNINGS**: playable and legal, but some noncritical facts are missing or cannot be verified.
- **FAIL**: a required choice is missing, a calculation is wrong, files conflict, or an unapproved rules exception is present.

Organize findings as:

1. **Errors** — illegal, contradictory, or mechanically incomplete items.
2. **Warnings** — ambiguity, missing provenance, or noncritical omissions.
3. **Verified** — concise summary of major areas that passed.

For each error or warning, cite the campaign file and show the expected rule or calculation. Distinguish facts from inference. End with a prioritized correction list, but do not edit any file.
