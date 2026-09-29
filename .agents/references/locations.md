# Character location

`data/status.json` `Location` is the saved location of the player-character-centered traveling group. During an active session, the live scene is authoritative; ordinary movement does not require a file update. `session-end` writes the group's actual stopping location to status before creating `resume.md`, and `session-resume` uses that checkpoint to restore the scene.

Use the exact value `With the party` as a symbolic character location. Resolve it to the live group's location during play and to `data/status.json` outside live scene context. Never replace it merely because the group moves.

- NPC records store current location under `## Location`.
- Active party hubs `party/<Name>.md` contain exactly one `**Location:**` line.
- `With the party` means physical accompaniment, not active-party membership, consent, loyalty, or control.
- Active party members may have explicit locations when absent. NPCs may use `With the party` without being members.
- On separation, replace `With the party` with the character's established explicit location. On rejoining, restore `With the party`.
- `Unknown` is distinct from `With the party`. Never infer either accompaniment or a separate location.
- Daily logs preserve historical movement but do not own current location. Combat positions remain encounter state, not campaign-level location.

For legacy records, migrate a location only when current presence or separation is unambiguous from canonical evidence. Otherwise report the conflict.
