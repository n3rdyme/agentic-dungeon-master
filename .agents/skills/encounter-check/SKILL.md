---
name: encounter-check
description: Check an unsecured overnight rest for a contextual hostile interruption and establish its nature when one occurs. Use when party-long-rest identifies a wilderness or road camp, exposed populated-area shelter or alley, dungeon, enemy territory, or another unsafe sleeping environment; also use when the user explicitly requests a encounter-check check.
---

# Random Encounter

Act as the campaign DM between combats. This skill decides whether an unsecured sleep is interrupted and, if so, what believable threat approaches. It does not advance the day or grant rest recovery.

Announce the check only as `[encounter-check checking safety]`. Keep the rolls, weighted table, and persistence work out of chat unless the player explicitly asks to see them.

## Establish the chance

Read the minimum campaign canon needed for the current location, nearby factions and creatures, current events, weather, party level and size, watches, camp defenses, light, noise, and depleted resources. Choose one threshold:

| Sleeping environment | Encounter on d20 |
| --- | ---: |
| Wilds, road, or unsecured wilderness camp | 1 |
| Populated but exposed place, including an alley | 1-2 |
| Hostile environment, dungeon, or enemy-held ground | 1-4 |

Secure lodging or a genuinely guarded sanctuary requires no check and should return control to `party-long-rest`.

Invoke `dice-roll` for one labeled d20 occurrence check. A result higher than the threshold means nothing hostile interrupts the rest; return control to `party-long-rest` without inventing an event. A result within the listed range means a hostile encounter is imminent.

Make only one occurrence check for a particular sleep attempt. An encounter that interrupts and later resumes the same rest does not authorize another check.

## Determine the threat

After an encounter is indicated, create a contextual weighted table before

rolling again:

- Include between 2 and 10 distinct, believable hostile scenarios.
- Assign every result from 1 through 20 exactly once using contiguous ranges; the weights must total 20 slots.
- Do not include harmless, empty, or "no encounter" outcomes. The first roll already established an imminent hostile threat.
- Weight common local dangers more heavily than exceptional ones. Use known factions, fauna, consequences, and active pressures when supported by canon; do not introduce an unrelated monster merely for variety.
- Adjust challenge to the circumstances and party condition through creature count, tactics, terrain, objectives, timing, or avenues of retreat. The result should be credible, not automatically balanced or automatically lethal.

Invoke `dice-roll` for a second labeled d20 and select the scenario whose range contains the result. The roller retains both results in the campaign's normal roll history. Carry the selected scenario into the resulting scene or `combat.md`; do not create a separate player-facing record for the table.

## Resolve the interruption

Introduce the selected threat through second-person fiction. Preserve player agency. Determine detection and surprise from watches, passive perception, visibility, stealth, and established precautions; the occurrence roll alone does not decide surprise.

If hostile action or unavoidable violence begins, invoke `combat-start`. Record in `combat.md` that the encounter interrupted an overnight rest, that its random encounter check is already complete, and that long-rest recovery and the day advance remain pending. If the situation can still be avoided, negotiated, or escaped, resolve those choices before deciding whether combat starts.

Return to `party-long-rest` only after the threat is fully resolved and the fiction establishes whether the party resumes and completes the rest. Never grant recovery or advance the day from this skill.
