---
name: npc-meet
description: Create canonical storage for an individually significant NPC and link relevant relationships. Use after a meaningful interaction or when distinctive behavior, appearance, knowledge, motives, relationships, actionable responsibility, or independently changing state makes that person useful to retrieve separately; do not use for a name known only through a roster, guest list, workplace, household, faction, or other undifferentiated group membership.
---

# Meet NPC

Act as campaign DM. A name alone does not justify an NPC file. Keep a person known only by name, role, and group affiliation as plain text in the owning location or faction roster, using `location-update` or `faction-update` when that roster fact warrants persistence. Casual mentions, staff lists, guest lists, invitations, and undifferentiated membership do not meet the persistence threshold.

Create an NPC file only when the person has individually retrievable significance: a meaningful interaction, distinctive behavior or appearance, unique knowledge or motives, an actionable role, a personal relationship, or state likely to change independently. When a background person later crosses this threshold, create the file then and replace their roster name with a link.

Search names, aliases, titles, roles, relationships, and collisions first. Update a matching vague/aliased NPC instead of duplicating it. If two established people share a name, use the shortest stable disambiguator in the filename and record aliases in both files.

Create `npcs/<Specific Name>.md` with these headings when established: `Role`, `Location`, `Status`, `Aliases`, `Description`, `Motives`, `Relationships`, and `History`. Use only established facts. Link relevant locations, factions, and related NPCs when useful and record the meeting in Daily.

Persist the NPC silently and continue the meeting in second-person narration.
