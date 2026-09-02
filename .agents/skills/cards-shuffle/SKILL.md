---
name: cards-shuffle
description: Create one unbiased shuffled standard 52-card deck using the repository's Node shuffle tool and compact card identifiers. Use in Story mode whenever play establishes that a fresh physical deck is shuffled, including poker and other standard-card games; do not use to reorder a deck already in play or to simulate poker rules beyond shuffling.
---

# Shuffle Cards

Invoke the repository tool from the repository root:

```text
node .agents/tools/shuffle.mjs
```

The tool constructs all 52 unique cards, shuffles them with a cryptographically backed Fisher-Yates shuffle, and writes one JSON array to standard output. It accepts no input.

## Card identifiers

Each card is encoded as one suit letter followed by an integer rank:

- `h`: heart
- `s`: spade
- `d`: diamond
- `c`: club
- `1`: ace
- `2` through `10`: numbered ranks
- `11`: jack
- `12`: queen
- `13`: king

Examples: `h1` is the ace of hearts, `s11` is the jack of spades, and `c13` is the king of clubs. The output is always a JSON array such as `["d4","h1",...]` containing every valid identifier exactly once.

## Use the deck

Announce `[cards-shuffle shuffling deck]` in player-facing Story mode. Treat array index 0 as the top of the deck and consume cards sequentially without replacement. Retain one returned array and one next-card cursor for the entire deck. Never call the tool again during the same deck, insert a card, reorder unseen cards, or choose a desired outcome.

Keep unrevealed cards hidden from the player during immersive play. Do not print the complete JSON array to chat unless the user explicitly asks OOC to inspect the tool output. Narrate only established visible cards and game actions.

This skill establishes fair deck order only. It does not define a poker variant, seats, blinds or antes, stacks, betting legality, pots and side pots, burn cards, dealing streets, showdown order, hand evaluation, or persistent game state. Use explicit game rules and tracked hand state for those concerns. Invoke `poker-play` when the selected game is Texas Hold'em or five-card draw.
