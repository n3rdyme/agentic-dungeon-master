# Level-up checklist

Apply every relevant item to each staged character through the target level.

## Party gate

- Active membership excludes `party/retired/`.
- Each active character begins at exactly the current `status.json` Level.
- Target level is current party level plus one.
- XP or an approved homebrew leveling exception authorizes advancement.

## Character audit

- Target level and proficiency bonus are correct.
- Hit Point Maximum uses the selected legal method and all relevant modifiers.
- Ability scores, modifiers, saving throws, skills, AC, initiative, speed, passive scores, attacks, damage, spell attack, and save DC are recalculated.
- Every class and subclass feature through the target level is present, and no later-level feature is present.
- Every required class, subclass, feat, ability-score, proficiency, expertise, mastery, fighting-style, or similar choice is complete and legal.
- Cantrips, prepared or known spells, replacements, spell slots, rituals, and other spellcasting limits are complete and legal for the target level.
- Equipment effects agree with `Equipment.md`; unused possessions remain shared inventory and all currency remains party-wide in `data/status.json`.
- Approved exceptions are stated precisely in `homebrew.md`; character files do not act as their own rules authority.
- Transient capacities and remaining uses are represented consistently in `data/party-state.json` without granting an unsupported refresh.

## Final invariant

After commit, `data/status.json` Level and the Level in every active `party/<Character>/Stats.md` are identical. Any mismatch invalidates the party and requires rollback of the entire level-up transaction.
