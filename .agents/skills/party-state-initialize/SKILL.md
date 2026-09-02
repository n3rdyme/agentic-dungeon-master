---
name: party-state-initialize
description: Create the canonical data/party-state.json for an existing filesystem-backed campaign that predates transient-state storage or repair a structurally incomplete state file. Use when a selected campaign lacks party-state.json or a state audit cannot map every active character and required transient mechanic.
---

# Initialize Party State

Act outside combat. Read `../../references/party-state.md`, `data/status.json`, every active character's `Stats.md`, the current Daily and `resume.md` when they exist, and only other recent records that may establish current mechanics.

Derive permanent maxima and available resource categories from validated character files. Derive current values only from explicit recent canon. Never interpret silence as fully recovered.

For each unresolved current value, ask the player. Offer a single "everyone is fully recovered with no transient effects" confirmation when appropriate, but do not apply that assumption without approval. Resolve each active character; exclude `party/retired/`.

Stage the complete JSON, verify all values against maxima, then write it once. Do not change `Stats.md`, advance time, grant recovery, or alter chronology. When repairing an existing file, preserve valid known state and request only missing or contradictory facts.

Do not proceed with play-state mutation while a required current value remains unknown. Ask only the questions needed to resolve it. Once valid, continue the requested play workflow without displaying a migration record or file summary.
