# Canonical transient party state

`data/party-state.json` is the sole authority for transient character mechanics. `Stats.md` owns permanent maxima and derived mechanics. Never duplicate currency, XP, level, inventory, biography, or narrative chronology here.

Use this shape, adding character-specific slot levels and resources as needed:

```json
{
  "Characters": {
    "<Character>": {
      "CurrentHP": 10,
      "TemporaryHP": 0,
      "HitDice": {
        "d10": 1
      },
      "DeathSaves": { "Successes": 0, "Failures": 0 },
      "Conditions": [],
      "Exhaustion": 0,
      "SpellSlots": {
        "1": 2
      },
      "Resources": {
        "Second Wind": 2
      },
      "Concentration": null,
      "Effects": []
    }
  }
}
```

Rules:

- Use exact active character names as keys. Do not include retired characters.
- Record remaining uses as integers. Record zero explicitly; do not omit a depleted Hit Die, slot level, or limited resource.
- Omit `SpellSlots` entries only when the character has no slots at that level.
- Give effects enough structured detail to resolve them: name, source, duration or expiry, and mechanical consequence. Use `null` only where the schema shows it; use empty arrays or objects for empty collections.
- Read maxima and recovery rules only from validated `Stats.md`. Current and remaining values must stay between zero and those maxima unless an explicit rule permits otherwise. Never copy maxima or recovery rules into party state.
- Route established out-of-combat changes through `party-state-update`. Combat execution keeps an in-memory copy, records final deltas in `combat.md`, and `combat-finish` invokes `party-state-update` after resolution.
- Update only affected fields, preserve unknown fields, and parse the complete JSON before and after every write.
