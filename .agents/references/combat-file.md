# Persistent combat file

Use `campaigns/<Player>/combat.md` as the single live combat handoff. It is temporary canonical encounter state shared between story and combat chats.

```markdown
# Combat: <encounter name>

**Encounter ID:** <unique stable id>

**Status:** Ready | In Progress | Resolved

**Day:** <campaign day>

**Location:** <relative link or canonical name>

## Encounter Setup
<onset, environment, terrain, cover, hazards, light, distances, and surprise>

## Party

**Opening state:** [party-state.json](data/party-state.json)

### <party member name>
- Stats: [Stats.md](party/<member>/Stats.md)
- Current weapon: <weapon or None>
- Opening status: <encounter-local transient states with established values, or None>

<repeat for each participating party member; record position separately when relevant. Opening status includes every story-known combat-relevant state not reliably represented by the linked sources, such as Hidden with its established Stealth result, cover, surprise, a readied or held item, concealment, disguise, mount, concentration, or another temporary effect. Preserve exact established rolls, DCs, durations, and targets. Do not infer an unestablished value.>

## Allies
<locked stat blocks and opening state, or None>

## Hostiles
<locked stat blocks, opening state, XP, attacks, saves, and abilities>

## Initiative
<order and rolls; empty while Ready>

## Action History
<append concise chronological entries for all turns, reactions, and material state changes in each completed round; empty while Ready>

## Resolution
<when Resolved: outcome, rounds, XP, loot, final transient state for every party participant, exact Equipment and resource deltas, hostile dispositions, and established consequences>
```

Rules:

- Never maintain more than one live `combat.md` per campaign.
- Never overwrite an In Progress encounter. Archive a Resolved encounter before creating another. A Ready encounter may be replaced only when the fiction explicitly supersedes it before combat begins.
- Treat the linked character statistics and shared opening party state as the encounter's locked opening sources. Read them when combat begins; do not copy their contents into `combat.md`. Append corrections explicitly rather than silently rewriting history.
- Put the shared `data/party-state.json` link once under `## Party`, never under individual party members. `data/status.json` remains the party-wide campaign ledger for day, XP, and currency and is not a per-character combat source.
- Write an initial checkpoint after initiative, one checkpoint at the end of every completed round, and one final checkpoint when resolved. Resolve each round in memory and never persist a partial round.
- During execution, do not update campaign canon outside `combat.md`. The only other write is the append-only `roll-history.log` produced by `dice-roll`.
- Record every final party-state, Equipment, and resource delta in Resolution so `combat-finish` can apply it exactly once in story mode.
- Archive a resolved file by moving it to `log/Combat/<Day> - <Encounter ID> - <Encounter Name>.md`, using the resolved file's exact numeric campaign Day; never copy it or leave the live file behind. The filename must begin with digits followed by ` - `, not `Day <number>`, `DAY<number>`, or `D<number>`.
