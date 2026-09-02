#!/usr/bin/env node

import { randomInt } from "node:crypto";

const suits = ["h", "s", "d", "c"];
const deck = suits.flatMap((suit) =>
  Array.from({ length: 13 }, (_, index) => `${suit}${index + 1}`),
);

for (let index = deck.length - 1; index > 0; index -= 1) {
  const swapIndex = randomInt(index + 1);
  [deck[index], deck[swapIndex]] = [deck[swapIndex], deck[index]];
}

process.stdout.write(`${JSON.stringify(deck)}\n`);
