# Agentic D&D

Agentic D&D is a filesystem-backed tabletop campaign engine for Codex. It combines persistent campaign canon, second-person story play, mechanically isolated combat, character and inventory management, quests, businesses, debts, downtime, card games, and validation workflows in one repository.

Campaigns live under `campaigns/<Player>`. The files are the campaign's memory: characters, locations, relationships, mechanics, chronology, inventory, finances, active objectives, and the exact situation needed to resume later.

## Highlights

- **Persistent campaigns:** Story state survives across chats through canonical Markdown and JSON records plus a focused `resume.md` checkpoint.
- **Three operating roles:** Continue the Story, Let's Do Battle!, and Campaign Information have distinct permissions and context boundaries.
- **Player agency:** Story narration never chooses, moves, speaks for, or ends a scene for the player character.
- **Purpose-built combat handoff:** Story mode prepares `combat.md`; Battle mode resolves it round by round; Story mode applies the final consequences.
- **Complete character support:** Creation, adoption, advancement, retirement, death, permanent development, transient resources, spell reporting, and legality audits have dedicated workflows.
- **Living world records:** NPCs, factions, locations, events, milestones, and quests are stored as linked canon rather than reconstructed from chat history.
- **Exact inventory and finance tracking:** Shared inventory, personal equipment, purchases, sales, debts, business capital, payroll, expenses, and daily earnings have explicit owners and transaction rules.
- **Downtime and chronology:** Short rests, long rests, unsafe-camp encounters, multi-day advancement, business reconciliation, weekdays, and session checkpoints advance coherently.
- **Stateful games:** The engine includes unbiased card shuffling and persistent Texas Hold'em and five-card draw.
- **Validation and migration:** Campaigns can be created, imported from an Anthropic conversation export, structurally audited, and repaired without treating other campaigns as templates.

## Getting started

### Requirements

- **Codex:** Open and use the repository from its root so `AGENTS.md` and the skill catalog are available.
- **Node.js 18 or newer:** Node must be installed and available as `node`. A current supported release from [nodejs.org](https://nodejs.org/) is recommended.
- **No npm install:** The engine has no `package.json` and its JavaScript tooling uses only built-in Node modules, including `node:crypto`, `node:fs`, and `node:path`.

Verify the runtime before play:

```powershell
node --version
node .agents/tools/shuffle.mjs
```

The version command should report `v18.0.0` or newer. The shuffle smoke test should print a JSON array containing 52 compact card identifiers; it does not change campaign state.

Node powers the authoritative dice roller as well as combat support, card shuffling, poker, Markdown formatting, imports, and campaign validation. Do not invoke the dice script merely as a smoke test: every successful campaign-scoped roll appends its result to `campaigns/<Player>/roll-history.log`. During play, use `/roll`, a natural-language dice request, or the combat workflow so the engine supplies the selected campaign correctly.

### Open the engine

Open the repository root in Codex. When no campaign role is active, send:

```text
help
```

This lists the available campaigns and the supported entry forms without opening or reading any campaign.

### Start a new campaign

```text
start campaign
```

The setup workflow asks for the player character's name, a class or broad archetype, and an optional world description. It creates `campaigns/<Player>`, builds a complete level-1 character using the strict 2024 Player's Handbook baseline, records any explicitly approved homebrew, validates the result, and saves an initial resume checkpoint.

### Open an existing campaign

Use the campaign directory name directly. These examples assume an existing campaign named `Sample Player`:

```text
open Sample Player
continue Sample Player
Sample Player fight
Sample Player info
```

- `open <campaign>` selects the campaign and asks for a role when the message does not already specify one.
- `continue <campaign>` opens directly in Story.
- `<campaign> fight` opens directly in Battle.
- `<campaign> info` opens directly in read-only Campaign Information.

Campaign selection lasts only for the current chat, so separate chats can safely work with different campaigns.

## Usage overview

Think of one Story chat as the main play session and a second Battle chat as a focused combat resolver. Both work from the same campaign files, so the encounter can move between them without copying context by hand.

### 1. Begin an interactive Story session

Open a new Codex chat at the repository root and continue the campaign:

```text
continue Sample Player
```

The chat selects `Sample Player`, enters Continue the Story, reads the saved `resume.md` checkpoint and its relevant canonical links, and presents a short recap plus the exact situation awaiting your decision. Continue playing in ordinary language. The Story role narrates the world, asks for your choices, and persists established character, relationship, quest, inventory, financial, and world changes through the appropriate skills.

### 2. Let the Story session prepare combat

When an attack occurs or immediate violence becomes unavoidable, keep responding naturally in the Story chat. For example:

```text
I draw my sword and attack the nearest guard.
```

The Story role narrates the perceptible transition, records the complete encounter setup in `combat.md`, marks it Ready, and stops. It does not resolve initiative or attacks. The handoff preserves the participants, positions, environment, hazards, and opening mechanical state for a separate Battle chat.

### 3. Resolve combat in a second chat

Open another Codex chat at the same repository root and send:

```text
Sample Player fight
```

This chat enters Let's Do Battle!, reads the prepared `combat.md`, rolls initiative, and resolves the encounter round by round. It shows the dice and arithmetic used, tracks HP, conditions, positions, concentration, ammunition, slots, and other resources, and asks what your character does on each turn.

When the encounter is finished, the Battle chat marks `combat.md` Resolved and stops. It deliberately does not update story canon, award XP, transfer loot, or edit character equipment; those consequences belong to the Story role.

### 4. Return to the original Story chat

Go back to the original Story chat and send:

```text
continue
```

The Story role detects the resolved encounter, applies its final HP and resource state, equipment consumption, XP, loot, deaths, and durable world consequences, archives the combat record, and resumes with the aftermath. This closes the handoff cleanly before further roleplay.

### 5. End the session and create a checkpoint

Periodically, and especially before leaving a Story chat for good, send:

```text
save the campaign and end the session
```

The session-ending workflow reconciles everything that actually happened, updates the current chronology, and replaces `resume.md` with a compact operational checkpoint. Ending a chat does not advance campaign time by itself. The checkpoint makes the campaign internally ready to resume and gives you a coherent state to copy or commit as a backup.

The `campaigns/` directory is a separate Git repository in this workspace. After saving the session, you can create a versioned backup from the root repository with:

```powershell
git -C campaigns add -A
git -C campaigns commit -m "Save Sample Player session"
```

A local Git commit protects against accidental edits and lets you inspect prior states; push or copy that repository elsewhere if you also want an off-machine backup.

### 6. Continue later in a new chat

Start a fresh Codex chat at the repository root and send the same Story entry command:

```text
continue Sample Player
```

The new chat reads `campaign-info.md`, `resume.md`, canonical status, transient party state, inventory, and only the linked context needed for the immediate situation. It then recaps the live scene and returns control at the saved decision point. You do not need to paste the previous conversation into the new chat.

### Player-facing skills worth knowing

You normally request these capabilities in plain language; memorizing internal skill names is optional.

| Player request | Skill | What it provides |
| --- | --- | --- |
| `status` | [`party-status-show`](.agents/skills/party-status-show/SKILL.md) | Current day, XP, currency, obligations, business capital, present party members, absent members' locations, and accompanying NPCs; read-only |
| `inventory` | [`party-inventory-show`](.agents/skills/party-inventory-show/SKILL.md) | Categorized shared party inventory; read-only and separate from personally assigned equipment |
| `spells` | [`party-spells-show`](.agents/skills/party-spells-show/SKILL.md) | Spell attacks, save DCs, cantrips, slots, prepared or known spells, and concentration markers; read-only |
| `debts` | [`debt-show`](.agents/skills/debt-show/SKILL.md) | Due and overdue payments, finite and recurring obligations, currency on hand, and uncommitted funds; read-only |
| `show the business books` | [`business-status-show`](.agents/skills/business-status-show/SKILL.md) | Capital, recent earnings, payroll, recurring expenses, unfunded costs, and business debt; read-only |
| `/roll 2d6+4` | [`dice-roll`](.agents/skills/dice-roll/SKILL.md) | An authoritative campaign-scoped roll whose exact result is appended to `roll-history.log` |
| `take a short rest` | [`party-short-rest`](.agents/skills/party-short-rest/SKILL.md) | Chosen short-rest recovery without crossing a day boundary |
| `make camp for the night` | [`party-long-rest`](.agents/skills/party-long-rest/SKILL.md) | Safety check, overnight recovery, business reconciliation, and one chronological day boundary |
| `advance three days` | [`time-advance`](.agents/skills/time-advance/SKILL.md) | Multi-day downtime that stops for encounters, financial decisions, or other consequential interruptions |
| `save the campaign` | [`session-end`](.agents/skills/session-end/SKILL.md) | Reconciles canon and writes the checkpoint used by a future Story chat |

## Roles

| Role | Intended use | Filesystem behavior |
| --- | --- | --- |
| **Continue the Story** | Interactive second-person roleplay, exploration, downtime, relationships, quests, purchases, and world changes | Reads relevant canon and persists established changes through the owning skills |
| **Let's Do Battle!** | Resolve a prepared encounter with visible dice, initiative, actions, HP, conditions, and resources | Writes only `combat.md` at defined checkpoints; the dice tool also appends `roll-history.log` |
| **Campaign Information** | Ask factual questions about characters, history, inventory, debts, businesses, locations, or unresolved threads | Strictly read-only; reports missing or conflicting facts instead of inventing answers |
| **Engine Editing** | Inspect, test, document, or improve the engine itself | Default repository mode; does not implicitly select or read a campaign |

## Everyday usage

Natural-language requests normally select the appropriate skill automatically. You can also explicitly invoke a workflow as `$skill-name` when you want to be specific.

Useful in-campaign requests include:

```text
status
inventory
spells
debts
/roll 2d6+4
save the campaign
take a short rest
make camp for the night
advance three days
show the business books
```

Actions that change ownership, currency, obligations, permanent character membership, or business finances require the fiction and any necessary player approval to be established first. Read-only reports never mutate campaign state.

## How persistence works

A campaign store typically contains:

```text
campaigns/<Player>/
|-- campaign-info.md       World-building permissions and boundaries
|-- homebrew.md            Approved rules exceptions
|-- party.md               Active-party index
|-- resume.md              Current operational checkpoint
|-- combat.md              Temporary live combat handoff, when present
|-- data/                  Status, transient party state, inventory, businesses
|-- party/                 Complete active and archived character records
|-- npcs/                  Significant NPC records and party-facing indexes
|-- world/                 Locations and durable world state
|-- factions/              Faction leadership, goals, resources, and relations
|-- quests/                Active and resolved objectives
`-- log/                   Daily chronology, events, milestones, and combats
```

Canonical files own different kinds of truth. For example, `data/status.json` owns day, XP, party currency, and active party debts; `data/party-state.json` owns transient mechanics such as HP and spell slots; character `Stats.md` files own permanent mechanics; and `resume.md` links the state needed to continue without duplicating those values.

## Feature and skill index

The repository currently provides 57 skills. The tables below group them by human-facing capability; click any skill for its exact triggers, rules, and boundaries.

### Campaign entry, import, and validation

| Skill | Purpose |
| --- | --- |
| [`campaign-start`](.agents/skills/campaign-start/SKILL.md) | Create, validate, and checkpoint a new campaign and level-1 player character |
| [`campaign-open`](.agents/skills/campaign-open/SKILL.md) | Discover or directly open an existing campaign in Story, Battle, or Information mode |
| [`campaign-import`](.agents/skills/campaign-import/SKILL.md) | Reconstruct evolving campaign canon from an Anthropic conversation export |
| [`campaign-validate`](.agents/skills/campaign-validate/SKILL.md) | Normalize and audit campaign structure, links, JSON, characters, quests, businesses, and chronology |

### Story rules, sessions, rest, and time

| Skill | Purpose |
| --- | --- |
| [`story-rules-apply`](.agents/skills/story-rules-apply/SKILL.md) | Reapply the active Story role's narration, agency, persistence, and transition rules |
| [`session-resume`](.agents/skills/session-resume/SKILL.md) | Restore the live situation from `resume.md` and linked canonical state |
| [`session-end`](.agents/skills/session-end/SKILL.md) | Reconcile canon and save a complete operational checkpoint |
| [`party-short-rest`](.agents/skills/party-short-rest/SKILL.md) | Resolve selected short-rest recovery without advancing the day |
| [`party-long-rest`](.agents/skills/party-long-rest/SKILL.md) | Resolve sleep, recovery, safety, businesses, obligations, and one day boundary |
| [`encounter-check`](.agents/skills/encounter-check/SKILL.md) | Check an unsecured overnight rest for a contextual hostile interruption |
| [`time-advance`](.agents/skills/time-advance/SKILL.md) | Advance two or more skipped nights in one compressed interval while stopping for consequential events |

### Combat and dice

| Skill | Purpose |
| --- | --- |
| [`combat-start`](.agents/skills/combat-start/SKILL.md) | Create the persistent encounter handoff when immediate violence begins |
| [`combat-fight`](.agents/skills/combat-fight/SKILL.md) | Resolve initiative and combat round by round with visible mechanics and checkpoints |
| [`combat-finish`](.agents/skills/combat-finish/SKILL.md) | Apply and archive resolved combat consequences in Story mode |
| [`dice-roll`](.agents/skills/dice-roll/SKILL.md) | Execute campaign-scoped authoritative dice requests and log their exact results |

### Party members, advancement, and state

| Skill | Purpose |
| --- | --- |
| [`party-member-create`](.agents/skills/party-member-create/SKILL.md) | Build, approve, validate, and add a complete party character |
| [`party-member-adopt`](.agents/skills/party-member-adopt/SKILL.md) | Promote an NPC who authentically agrees to an ongoing party alliance |
| [`party-member-update`](.agents/skills/party-member-update/SKILL.md) | Persist established biography, personality, relationship, knowledge, equipment, or permanent mechanical changes |
| [`party-member-retire`](.agents/skills/party-member-retire/SKILL.md) | Return a living party member to canonical NPC status with player consent |
| [`party-member-death`](.agents/skills/party-member-death/SKILL.md) | Archive a conclusively and permanently dead party member with a linked memorial |
| [`party-member-validate`](.agents/skills/party-member-validate/SKILL.md) | Audit character completeness, consistency, legality, and approved homebrew |
| [`party-level-up`](.agents/skills/party-level-up/SKILL.md) | Advance and validate every active character one at a time |
| [`party-xp-award`](.agents/skills/party-xp-award/SKILL.md) | Award an explicitly established amount of noncombat story XP |
| [`party-state-initialize`](.agents/skills/party-state-initialize/SKILL.md) | Create or structurally repair canonical transient party state |
| [`party-state-update`](.agents/skills/party-state-update/SKILL.md) | Persist established HP, conditions, slots, resources, concentration, and other transient mechanics |
| [`party-status-show`](.agents/skills/party-status-show/SKILL.md) | Show current party mechanics, currency, obligations, presence, and companions without mutation |
| [`party-spells-show`](.agents/skills/party-spells-show/SKILL.md) | Show spell attacks, save DCs, slots, prepared or known spells, and concentration markers |

### NPCs, factions, locations, quests, and chronology

| Skill | Purpose |
| --- | --- |
| [`npc-meet`](.agents/skills/npc-meet/SKILL.md) | Create canonical storage for an individually significant NPC |
| [`npc-update`](.agents/skills/npc-update/SKILL.md) | Persist an established change to an NPC's identity, status, location, motives, or relationships |
| [`faction-update`](.agents/skills/faction-update/SKILL.md) | Create or update faction leadership, goals, resources, disposition, and party relations |
| [`location-discover`](.agents/skills/location-discover/SKILL.md) | Create canonical storage for a newly established place |
| [`location-update`](.agents/skills/location-update/SKILL.md) | Persist durable changes to a place, institution, territory, or public condition |
| [`quest-receive`](.agents/skills/quest-receive/SKILL.md) | Create an accepted objective with outcome-level goals and completion conditions |
| [`quest-update`](.agents/skills/quest-update/SKILL.md) | Record completion of a defined goal or progress unit using exact evidence |
| [`quest-complete`](.agents/skills/quest-complete/SKILL.md) | Resolve and archive a quest with a terminal outcome |
| [`event-record`](.agents/skills/event-record/SKILL.md) | Preserve a notable noncombat occurrence for later retrieval |
| [`milestone-record`](.agents/skills/milestone-record/SKILL.md) | Preserve a sparse campaign-defining achievement or turning point |

### Inventory, items, purchases, and spells

| Skill | Purpose |
| --- | --- |
| [`party-inventory-show`](.agents/skills/party-inventory-show/SKILL.md) | Display categorized shared inventory without changing it |
| [`party-inventory-update`](.agents/skills/party-inventory-update/SKILL.md) | Apply established changes to canonical shared inventory |
| [`item-buy`](.agents/skills/item-buy/SKILL.md) | Purchase exact items or services with immediate or deferred payment |
| [`item-sell`](.agents/skills/item-sell/SKILL.md) | Sell owned property and add exact proceeds |
| [`item-loot`](.agents/skills/item-loot/SKILL.md) | Record established acquisitions in shared inventory |
| [`item-identify`](.agents/skills/item-identify/SKILL.md) | Persist an existing item's established identity, properties, risks, and lore |
| [`item-consume`](.agents/skills/item-consume/SKILL.md) | Apply established expenditure or destruction of personal equipment |
| [`spell-cast`](.agents/skills/spell-cast/SKILL.md) | Resolve and persist an out-of-combat spell cast and its consequences |

### Debts and businesses

| Skill | Purpose |
| --- | --- |
| [`debt-create`](.agents/skills/debt-create/SKILL.md) | Record an accepted future party obligation without paying it |
| [`debt-pay`](.agents/skills/debt-pay/SKILL.md) | Pay one occurrence or an established full early payoff |
| [`debt-update`](.agents/skills/debt-update/SKILL.md) | Revise exact obligation terms without payment |
| [`debt-resolve`](.agents/skills/debt-resolve/SKILL.md) | Close an obligation after a terminal outcome other than ordinary payment |
| [`debt-show`](.agents/skills/debt-show/SKILL.md) | Show due, overdue, finite, recurring, reserved, and uncommitted financial totals |
| [`business-create`](.agents/skills/business-create/SKILL.md) | Create a separately financed business after ownership is established |
| [`business-update`](.agents/skills/business-update/SKILL.md) | Update authorized business operations, staffing, expenses, capital, or financing |
| [`business-day-reconcile`](.agents/skills/business-day-reconcile/SKILL.md) | Close one financial day or compressed multi-day span for every active business and report its signed result |
| [`business-status-show`](.agents/skills/business-status-show/SKILL.md) | Show separate business capital, earnings, expenses, staffing, and debts |
| [`business-remove`](.agents/skills/business-remove/SKILL.md) | Archive a conclusively sold, closed, or terminated business and its accounting history |

### Cards and poker

| Skill | Purpose |
| --- | --- |
| [`cards-shuffle`](.agents/skills/cards-shuffle/SKILL.md) | Create one unbiased standard 52-card deck |
| [`poker-play`](.agents/skills/poker-play/SKILL.md) | Run persistent Texas Hold'em or five-card draw with enforced betting and resumable state |

## Safety and consistency guarantees

- Campaign canon is read only after a campaign is selected or explicitly named for engine work.
- Missing or conflicting facts are reported rather than guessed.
- Significant entities are searched before creation to avoid duplicates.
- Campaign history is preserved; ordinary updates do not erase prior outcomes.
- Combat mode cannot silently rewrite story canon, inventory, XP, or character files.
- Information mode cannot change files or advance play.
- Party membership changes and business financial changes retain explicit approval gates.
- New or modified campaign Markdown is deterministically formatted, and campaign and character validators check structural invariants.
- Engine examples use unmistakably synthetic `Sample …` labels and never copy names, facts, dates, amounts, or outcomes from campaign stores.

## Engine documentation

- [`AGENTS.md`](AGENTS.md) defines repository-wide operating rules and safety boundaries.
- [`.agents/README.md`](.agents/README.md) is the canonical skill registry and maintenance guide, including cross-skill references and executable tools.
- [`.agents/skills/`](.agents/skills) contains the individual skill definitions.
- [`.agents/references/`](.agents/references) contains shared schemas and role rules.
- [`.agents/tools/`](.agents/tools) and skill-local `scripts/` directories contain deterministic helpers for formatting, validation, dice, cards, poker, and imports.
