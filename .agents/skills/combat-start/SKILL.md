---
name: combat-start
description: Narrate the perceptible transition into combat, persist a complete encounter in the selected campaign's combat.md, and stop Story execution. Use only after an attack or other hostile action occurs, or an observable development makes immediate violence unavoidable; never trigger from intent, preparation, failed stealth, detection, suspicion, or possible danger alone.
---

# Start Combat

Act as the story DM, never the combat resolver. Read `../../references/combat-file.md`, `../../references/party-state.md`, active character mechanics and equipment, `data/party-state.json`, combatants, location, and environment. If party state is missing or incomplete, invoke `party-state-initialize` before proceeding.

## Establish the boundary

Require one concrete combat trigger:

- the player explicitly executes an attack or another hostile action;
- another creature makes an observable attack or hostile action; or
- an observable development leaves immediate violence unavoidable.

Intent and execution are different. A proposal to attack, combat preparation, marking a target, drawing or readying equipment, tactical movement, failed stealth, detection, suspicion, a threat, or an armed enemy does not alone cross the boundary when the player can still meaningfully withdraw, hide, negotiate, deceive, surrender, wait, or choose whether to make the first attack.

Before creating `combat.md`, resolve the last declared Story action completely. Establish through player-perceptible fiction what happened and why combat now begins. Do not use hidden information, the encounter file, or the ready message as the first disclosure that the party made noise, was noticed, saw a weapon raised, suffered an attack, or encountered some other trigger. If the player has not yet been shown the trigger, remain in Story mode, narrate the changed situation, and stop for their response instead of invoking this skill.

Create or overwrite `campaigns/<Player>/combat.md` using the required structure. Give the encounter a unique stable ID and descriptive name. Set Status to Ready and record complete locked setup, allies, hostiles, environment, distances, hazards, light, cover, and surprise. Under `## Party`, link `data/party-state.json` once as the shared opening state. For each participating party member, record only their name, a relative link to `party/<Name>/Stats.md`, current weapon, and any encounter-specific opening position and status not represented by those sources. Give `Opening status` its own line and preserve every known combat-relevant transient fact with its established value, such as `Hidden (Stealth 17)`, cover, surprise, held or readied items, concealment, disguise, concentration, duration, or effect target; write `None` when there is no such status. Do not copy character sheets, permanent mechanics, equipment lists, or transient-state records into `combat.md`. Do not roll initiative or resolve any action. Never overwrite an In Progress encounter with a different encounter. At the player's explicit request, the same encounter may be restarted by updating its existing `combat.md` in place: preserve its Encounter ID and locked setup, restore its documented opening state, set Status to Ready, and clear Initiative, Action History, and Resolution. Archive a Resolved encounter with `combat-finish` before creating a different encounter.

After writing `combat.md`, return one self-contained final response containing:

1. the required Story location ledger;
2. concise second-person narration of the causal transition already established, including the perceptible hostile act or unavoidable trigger;
3. the exact handoff line:

`Combat ready - <Encounter ID>`

Do not roll initiative, resolve a combat turn, display `combat.md`, or continue Story execution beyond the triggering moment.
