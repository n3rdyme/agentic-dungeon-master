---
name: party-inventory-show
description: Display the selected campaign's canonical shared party inventory organized into useful categories without changing campaign state. Use in Story or Campaign Information mode for `/inventory`, the exact messages `inventory` or `inventory?`, "party inventory," "show inventory," "what are we carrying," and equivalent requests for shared party property; do not include personally assigned character Equipment.md.
---

# Show Party Inventory

Read only the selected campaign's complete `data/inventory.json`. Do not read character `Equipment.md`, mutate files, transfer ownership, identify unknown properties, or infer missing inventory. Physical transport by a named character does not make shared loot personal equipment.

Organize every entry into a concise, useful category inferred from its established identity, such as Weapons and Ammunition, Armor and Clothing, Tools and Gear, Keys and Documents, Consumables, Treasure, Contraband Cargo, or Vehicles. Create only categories needed by the current inventory. Preserve each item exactly once and preserve source order within a category.

Return only the formatted inventory as ordinary Markdown, with one level-two heading per category and no surrounding commentary or fenced code block:

```markdown
## <Category>

- <item> [(quantity) ][— <notes>]
```

Apply these display rules:

- Omit quantity when it is exactly one. Otherwise show `(<Quantity>)`, or `(<Quantity> <Unit>)` when a meaningful Unit is present.
- Append `— <notes>` only for useful established information such as physical state, location, purpose, compatibility, weight, identifying description, or readable text.
- Omit provenance-only source IDs, encounter IDs, and dates from notes. Retain any useful descriptive text stored alongside provenance, rewriting it only for concise display without changing its meaning.
- Do not expose raw JSON field names, add prices, identify unknown items, or invent categories that imply unestablished properties.
- When the array is empty, return only `Party inventory is empty.`

Do not emit a skill-use announcement; the inventory report is the requested output.
