---
name: dice-roll
description: Parse `/roll` requests and natural-language dice descriptions, execute all requested dice through the repository's campaign-scoped Node roller, return concise results, and rely on the roller to log the full JSON response. Use for `/roll`, "roll dice," dice notation such as 2d6+4, or labeled batches such as attack, damage, healing, checks, and saves.
---

# Roll Dice

Translate the user's dice request into one invocation of `../combat-fight/scripts/rollDice.js`. This skill rolls dice only; it does not resolve attacks, compare Armor Class, apply damage, or make combat decisions.

## Select the campaign

Use the active campaign's exact player-folder name beneath `campaigns/`. If one campaign is clearly active from the current task or files, use it. If multiple campaigns exist and the active one is unclear, ask before rolling. Never guess or use a partial campaign name.

## Parse the request

Accept compact notation and ordinary English, including:

- `/roll d20`
- `/roll 2d6+4`
- `/roll d20+5 attack, d6+3 shortbow, 3d6 sneak attack`
- `/roll a d20 plus 7 for perception and two d8 plus 3 for healing`

For each requested roll, derive:

- `roll`: preserve the user's English descriptor; if absent, use the dice expression as the label.
- `count`: number of dice, default `1`.
- `die`: sides per die.
- `modifier`: signed fixed modifier, default `0`.

Treat commas, semicolons, and unambiguous uses of "and" as roll separators. Do not reinterpret game terminology as additional mechanics. For example, "advantage" requires two labeled d20 dice but the roller does not choose the higher result unless the user explicitly asks for that presentation. Ask a brief clarification when notation, grouping, modifier, or descriptor is materially ambiguous.

## Execute

Send one top-level object through standard input:

```javascript
{
  campaign: "Player",
  rolls: [
    { roll: "attack", count: 1, die: 20, modifier: 5 },
    { roll: "shortbow", count: 1, die: 6, modifier: 3 },
    { roll: "sneak attack", count: 3, die: 6, modifier: 0 },
  ],
}
```

Use the available Node executable. Never simulate a result mentally, substitute another random generator, reroll, or edit returned values. The roller validates `campaigns/<Player>` and appends the response to its `roll-history.log`.

## Respond

Do not show the raw JSON response or command in chat unless the user explicitly asks for it. Give one concise human-readable line per roll showing its label, individual dice, modifier when nonzero, and total. If several damage components are clearly part of one hit, show their combined total as an additional line without changing the logged rolls. The full response remains available in the campaign's `roll-history.log`.
