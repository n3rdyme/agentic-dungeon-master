---
name: poker-play
description: Start, continue, and resolve persistent story-mode poker using the repository's stateful Node engine. Use when the player joins or asks to play Texas Hold'em or five-card draw; establish the dealer and clockwise seating order, enforce the correct betting and draw streets, choose every NPC action automatically from legal actions and that NPC's own information, prompt only for the player character's decisions, and settle agreed stakes without exposing hidden cards.
---

# Play Poker

Run poker only in Story mode outside combat. Use `cards-shuffle` for each fresh hand, then use `.agents/tools/poker.mjs` as the mechanical authority. The tool persists the live hand in `data/poker-state.json`, validates turn order and betting, deals without replacement, creates side pots, evaluates showdowns, and returns only the acting seat's private cards plus public state.

Announce `[poker-play dealing cards]` when a new hand begins. Otherwise preserve immersion and narrate in second person without showing JSON, tool commands, the deck, burn cards, or another player's hidden cards.

## Establish the table

Before the first hand, establish or ask for:

1. **Variant:** Texas Hold'em or five-card draw. Treat “5card” as five-card draw unless the player says otherwise.
2. **Stakes and chips:** agree on each buy-in, chip denomination, and whether chips represent campaign currency. Verify the player can cover the buy-in.
3. **Structure:** use small and big blinds for Hold'em, with an optional ante; use an ante and minimum opening bet for five-card draw.
4. **Seats:** provide the dealer first, followed by every player in clockwise seating order. Identify the player character explicitly. Use established NPCs when the fiction supplies them; otherwise create believable opponents through normal NPC workflows.

Show the dealer, ordered seats, starting stacks, and betting structure before shuffling. Let the player correct the table. Never silently add a participant, move a seat, or change agreed stakes.

## Start or continue a hand

Invoke `cards-shuffle` and pass its exact 52-card JSON array to a `start` request. Send one JSON request on standard input:

```json
{
  "campaign": "Player",
  "operation": "start",
  "variant": "holdem",
  "players": [
    { "name": "Dealer", "stack": 100, "tableOpeningStack": 100 },
    { "name": "Player", "stack": 100, "tableOpeningStack": 100, "human": true }
  ],
  "dealer": "Dealer",
  "smallBlind": 1,
  "bigBlind": 2,
  "ante": 0,
  "deck": ["h1", "... all 52 shuffled cards ..."]
}
```

For five-card draw, use `"variant":"five-card-draw"`, `ante`, and `minimumBet` instead of blinds. Run the tool as:

```text
node .agents/tools/poker.mjs
```

Use `{"campaign":"Player","operation":"state"}` to resume the persisted hand. Never start with `replace:true` while an unfinished hand exists. For a subsequent hand, carry forward every stack and original `tableOpeningStack`, rotate the dealer one occupied seat clockwise, obtain a new shuffle, and start only after the prior hand is complete.

## Resolve turns

The response names exactly one acting seat and supplies legal actions.

- For an NPC turn, choose and submit a legal action automatically. Base the decision only on that NPC's hole cards, public cards, public betting, stack, position, established personality, and plausible imperfect judgment. Never use the deck or another player's hidden cards. Vary play naturally; NPCs need not play perfectly or irrationally.
- For the player character's turn, present their private cards, public board, pot, current wager, amount to call, stacks, recent actions, and legal choices. Wait for their decision. Never choose, fold, check, call, bet, raise, go all-in, or discard for them.
- After applying the player's decision, resolve consecutive NPC decisions automatically until the player must decide again or the hand ends.

Submit betting decisions with `operation: "act"`, the exact acting `player`, and one action:

```json
{ "type": "fold" }
{ "type": "check" }
{ "type": "call" }
{ "type": "bet", "amount": 6 }
{ "type": "raise", "amount": 14 }
{ "type": "all-in" }
```

`raise.amount` is the player's total wager for the current betting street, not the increment. The engine enforces minimum bets, minimum raises, calls, all-ins, action reopening, and side pots.

During five-card draw, submit `operation: "draw"`, the acting player, and zero through three unique zero-based indexes from that player's five-card hand:

```json
{
  "campaign": "Player",
  "operation": "draw",
  "player": "Player",
  "discard": [1, 4]
}
```

Let NPCs select their own discards automatically. Show the player named cards when requesting discards; translate their choices to indexes without exposing the encoding.

## Betting sequence

Rely on the engine for every transition and never skip a betting opportunity:

- **Hold'em:** post blinds; bet preflop; burn and deal the flop; bet; burn and deal the turn; bet; burn and deal the river; bet; showdown.
- **Five-card draw:** post antes; deal five; bet; each remaining player may discard up to three and draw replacements; bet again; showdown.

At showdown, reveal only hands entitled to be shown by the established result, name each winning hand, and narrate main- and side-pot awards exactly as the tool reports them.

## Stakes and persistence

Treat `data/poker-state.json` as the authority for the live table. If chips represent campaign currency, reserve the agreed player buy-in and settle the net change exactly once when the player leaves the table, using the difference between their final stack and `tableOpeningStack`. Update the appropriate gp/sp/cp fields in `data/status.json` without denomination drift, and record the notable result in the current Daily. Do not change campaign currency after each bet or hand, and never let the player wager unreserved funds.

When chips represent campaign currency, read `../../references/debts.md` and treat a missing status `debts` field as empty. Require currency on hand to cover the reserved buy-in. If reserving it would make uncommitted funds negative, show the projected value and require explicit player acknowledgment before the first hand.

Ensure `session-end` references an unfinished `data/poker-state.json` so a new chat can resume the exact deck, cursor, seats, stacks, pot, street, and acting player. Never reshuffle an unfinished hand.
