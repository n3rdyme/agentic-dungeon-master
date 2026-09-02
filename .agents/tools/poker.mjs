#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CARD = /^[hsdc](?:[1-9]|1[0-3])$/;

function fail(message) { throw new Error(message); }
function integer(value, label, minimum = 0) {
  if (!Number.isSafeInteger(value) || value < minimum) fail(`${label} must be an integer of at least ${minimum}.`);
  return value;
}
function findRoot(start) {
  let current = path.resolve(start);
  while (true) {
    if (fs.existsSync(path.join(current, ".root"))) return current;
    const parent = path.dirname(current);
    if (parent === current) fail('Repository root marker ".root" was not found.');
    current = parent;
  }
}
function campaignDirectory(root, name) {
  if (typeof name !== "string" || !name || name !== name.trim() || name.startsWith(".") || name.includes("/") || name.includes("\\") || path.basename(name) !== name) fail("campaign must be an exact non-hidden player-folder name.");
  const campaigns = path.join(root, "campaigns");
  const entry = fs.readdirSync(campaigns, { withFileTypes: true }).find((item) => item.isDirectory() && item.name === name);
  if (!entry) fail(`Campaign "${name}" was not found under campaigns/.`);
  return path.join(campaigns, name);
}
function validateDeck(deck) {
  if (!Array.isArray(deck) || deck.length !== 52) fail("deck must contain exactly 52 cards.");
  if (deck.some((card) => typeof card !== "string" || !CARD.test(card))) fail("deck contains an invalid card identifier.");
  if (new Set(deck).size !== 52) fail("deck contains duplicate cards.");
  return [...deck];
}
function clockwise(state, from, predicate) {
  for (let offset = 1; offset <= state.seats.length; offset += 1) {
    const index = (from + offset) % state.seats.length;
    if (predicate(state.seats[index], index)) return index;
  }
  return null;
}
function active(seat) { return !seat.folded; }
function canAct(seat) { return active(seat) && !seat.allIn; }
function drawCard(state) {
  if (state.cursor >= state.deck.length) fail("The deck is exhausted.");
  const card = state.deck[state.cursor];
  state.cursor += 1;
  return card;
}
function commit(state, index, amount, label) {
  const seat = state.seats[index];
  const paid = Math.min(integer(amount, label), seat.stack);
  seat.stack -= paid;
  seat.streetContribution += paid;
  seat.committed += paid;
  if (seat.stack === 0) seat.allIn = true;
  return paid;
}
function addHistory(state, text) {
  state.history.push(text);
  if (state.history.length > 500) state.history.splice(0, state.history.length - 500);
}
function potSize(state) { return state.seats.reduce((sum, seat) => sum + seat.committed, 0); }
function dealRounds(state, count) {
  let index = clockwise(state, state.dealer, active);
  for (let round = 0; round < count; round += 1) {
    const start = index;
    do {
      state.seats[index].hole.push(drawCard(state));
      index = clockwise(state, index, active);
    } while (index !== start);
  }
}
function resetBetting(state) {
  state.currentBet = 0;
  state.minRaise = state.baseBet;
  for (const seat of state.seats) {
    seat.streetContribution = 0;
    seat.acted = false;
  }
}
function contenders(state) { return state.seats.map((seat, index) => ({ seat, index })).filter(({ seat }) => active(seat)); }
function bettingComplete(state) {
  return state.seats.every((seat) => !canAct(seat) || (seat.acted && seat.streetContribution === state.currentBet));
}
function nextBettingActor(state, from) {
  return clockwise(state, from, (seat) => canAct(seat) && (!seat.acted || seat.streetContribution < state.currentBet));
}
function firstPostDealer(state) { return clockwise(state, state.dealer, canAct); }
function burnAndDeal(state, count) {
  state.burns.push(drawCard(state));
  for (let index = 0; index < count; index += 1) state.board.push(drawCard(state));
}
function combinations(cards, choose, start = 0, prefix = [], output = []) {
  if (prefix.length === choose) { output.push(prefix); return output; }
  for (let index = start; index <= cards.length - (choose - prefix.length); index += 1) {
    combinations(cards, choose, index + 1, [...prefix, cards[index]], output);
  }
  return output;
}
function rankValue(card) { const rank = Number(card.slice(1)); return rank === 1 ? 14 : rank; }
function scoreFive(cards) {
  const ranks = cards.map(rankValue).sort((a, b) => b - a);
  const counts = new Map();
  for (const rank of ranks) counts.set(rank, (counts.get(rank) ?? 0) + 1);
  const groups = [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0]);
  const flush = new Set(cards.map((card) => card[0])).size === 1;
  const unique = [...new Set(ranks)];
  if (unique[0] === 14) unique.push(1);
  let straightHigh = 0;
  for (let index = 0; index <= unique.length - 5; index += 1) {
    if (unique[index] - unique[index + 4] === 4) { straightHigh = unique[index]; break; }
  }
  let value;
  let name;
  if (flush && straightHigh) { value = [8, straightHigh]; name = "Straight Flush"; }
  else if (groups[0][1] === 4) { value = [7, groups[0][0], groups[1][0]]; name = "Four of a Kind"; }
  else if (groups[0][1] === 3 && groups[1][1] === 2) { value = [6, groups[0][0], groups[1][0]]; name = "Full House"; }
  else if (flush) { value = [5, ...ranks]; name = "Flush"; }
  else if (straightHigh) { value = [4, straightHigh]; name = "Straight"; }
  else if (groups[0][1] === 3) { value = [3, groups[0][0], ...groups.slice(1).map(([rank]) => rank).sort((a, b) => b - a)]; name = "Three of a Kind"; }
  else if (groups[0][1] === 2 && groups[1][1] === 2) { const pairs = [groups[0][0], groups[1][0]].sort((a, b) => b - a); value = [2, ...pairs, groups[2][0]]; name = "Two Pair"; }
  else if (groups[0][1] === 2) { value = [1, groups[0][0], ...groups.slice(1).map(([rank]) => rank).sort((a, b) => b - a)]; name = "One Pair"; }
  else { value = [0, ...ranks]; name = "High Card"; }
  return { value, name, cards };
}
function compareValues(left, right) {
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    const difference = (left[index] ?? 0) - (right[index] ?? 0);
    if (difference) return difference;
  }
  return 0;
}
function bestHand(cards) {
  if (cards.length < 5 || cards.length > 7) fail("A poker hand must contain five through seven cards.");
  return combinations(cards, 5).map(scoreFive).sort((a, b) => compareValues(b.value, a.value))[0];
}
function clockwiseOrder(state, indexes) {
  const order = [];
  let cursor = state.dealer;
  while (order.length < indexes.length) {
    cursor = (cursor + 1) % state.seats.length;
    if (indexes.includes(cursor)) order.push(cursor);
  }
  return order;
}
function finishShowdown(state) {
  state.phase = "showdown";
  state.acting = null;
  const eligible = contenders(state);
  const evaluated = new Map(eligible.map(({ seat, index }) => [index, bestHand(state.variant === "holdem" ? [...seat.hole, ...state.board] : seat.hole)]));
  const levels = [...new Set(state.seats.map((seat) => seat.committed).filter((amount) => amount > 0))].sort((a, b) => a - b);
  let previous = 0;
  const payouts = new Map();
  const pots = [];
  for (const level of levels) {
    const contributors = state.seats.map((seat, index) => ({ seat, index })).filter(({ seat }) => seat.committed >= level);
    const amount = (level - previous) * contributors.length;
    const candidates = contributors.filter(({ seat }) => active(seat)).map(({ index }) => index);
    if (amount > 0 && candidates.length) {
      let winners = [candidates[0]];
      for (const candidate of candidates.slice(1)) {
        const comparison = compareValues(evaluated.get(candidate).value, evaluated.get(winners[0]).value);
        if (comparison > 0) winners = [candidate]; else if (comparison === 0) winners.push(candidate);
      }
      const share = Math.floor(amount / winners.length);
      let remainder = amount % winners.length;
      for (const winner of winners) { state.seats[winner].stack += share; payouts.set(winner, (payouts.get(winner) ?? 0) + share); }
      for (const winner of clockwiseOrder(state, winners)) { if (!remainder) break; state.seats[winner].stack += 1; payouts.set(winner, (payouts.get(winner) ?? 0) + 1); remainder -= 1; }
      pots.push({ amount, winners: winners.map((index) => state.seats[index].name) });
    }
    previous = level;
  }
  state.showdown = eligible.map(({ seat, index }) => ({ name: seat.name, cards: seat.hole, hand: evaluated.get(index).name, bestFive: evaluated.get(index).cards, payout: payouts.get(index) ?? 0 }));
  state.pots = pots;
  state.complete = true;
  addHistory(state, `Showdown completed for ${potSize(state)} chips.`);
}
function awardLastPlayer(state) {
  const [{ seat, index }] = contenders(state);
  const amount = potSize(state);
  seat.stack += amount;
  state.phase = "complete";
  state.acting = null;
  state.complete = true;
  state.pots = [{ amount, winners: [seat.name] }];
  state.showdown = [{ name: seat.name, cards: [], hand: "Won uncontested", bestFive: [], payout: amount }];
  addHistory(state, `${state.seats[index].name} won ${amount} chips uncontested.`);
}
function maybeRunout(state) {
  if (state.variant !== "holdem") return false;
  if (state.seats.filter(canAct).length > 1) return false;
  while (state.board.length < 5) burnAndDeal(state, state.board.length === 0 ? 3 : 1);
  finishShowdown(state);
  return true;
}
function advanceBetting(state) {
  if (contenders(state).length === 1) { awardLastPlayer(state); return; }
  if (!bettingComplete(state)) return;
  if (state.variant === "holdem") {
    if (maybeRunout(state)) return;
    if (state.phase === "preflop") { burnAndDeal(state, 3); state.phase = "flop"; }
    else if (state.phase === "flop") { burnAndDeal(state, 1); state.phase = "turn"; }
    else if (state.phase === "turn") { burnAndDeal(state, 1); state.phase = "river"; }
    else if (state.phase === "river") { finishShowdown(state); return; }
    resetBetting(state);
    state.acting = firstPostDealer(state);
  } else if (state.phase === "first-bet") {
    state.phase = "draw";
    for (const seat of state.seats) seat.drawn = seat.folded;
    state.acting = clockwise(state, state.dealer, (seat) => !seat.drawn);
  } else if (state.phase === "second-bet") {
    finishShowdown(state);
  }
}
function legalActions(state, index) {
  const seat = state.seats[index];
  if (!canAct(seat) || state.acting !== index) return [];
  const toCall = Math.max(0, state.currentBet - seat.streetContribution);
  const actions = [];
  if (toCall === 0) actions.push({ type: "check" }); else actions.push({ type: "fold" }, { type: "call", amount: Math.min(toCall, seat.stack) });
  if (state.currentBet === 0 && seat.stack > 0) actions.push({ type: "bet", minimum: Math.min(state.minRaise, seat.stack), maximum: seat.stack });
  if (state.currentBet > 0 && seat.stack > toCall) actions.push({ type: "raise", minimumTotal: Math.min(state.currentBet + state.minRaise, seat.streetContribution + seat.stack), maximumTotal: seat.streetContribution + seat.stack });
  if (seat.stack > 0) actions.push({ type: "all-in", total: seat.streetContribution + seat.stack });
  return actions;
}
function applyAction(state, request) {
  if (state.complete || state.phase === "draw") fail("No betting action is currently available.");
  const index = state.acting;
  if (index === null) fail("No player is acting.");
  const seat = state.seats[index];
  if (request.player !== seat.name) fail(`It is ${seat.name}'s turn.`);
  const action = request.action;
  if (!action || typeof action !== "object") fail("action must be an object.");
  const type = action.type;
  const toCall = Math.max(0, state.currentBet - seat.streetContribution);
  let description;
  if (type === "fold") { seat.folded = true; seat.acted = true; description = "folded"; }
  else if (type === "check") { if (toCall !== 0) fail("Cannot check while facing a bet."); seat.acted = true; description = "checked"; }
  else if (type === "call") { if (toCall === 0) fail("There is no bet to call."); const paid = commit(state, index, toCall, "call"); seat.acted = true; description = `called ${paid}`; }
  else if (type === "bet") {
    if (state.currentBet !== 0) fail("Use raise while facing an existing bet.");
    const amount = integer(action.amount, "bet", 1);
    if (amount > seat.stack) fail("Bet exceeds the player's stack.");
    if (amount < state.minRaise && amount !== seat.stack) fail(`Minimum bet is ${state.minRaise}.`);
    commit(state, index, amount, "bet"); state.currentBet = seat.streetContribution; state.minRaise = amount;
    for (const other of state.seats) if (canAct(other)) other.acted = false;
    seat.acted = true; description = `bet ${amount}`;
  } else if (type === "raise") {
    if (state.currentBet === 0) fail("Use bet when no wager exists.");
    const target = integer(action.amount, "raise total", 1);
    const maximum = seat.streetContribution + seat.stack;
    if (target <= state.currentBet || target > maximum) fail(`Raise total must be above ${state.currentBet} and no more than ${maximum}.`);
    const raiseSize = target - state.currentBet;
    if (raiseSize < state.minRaise && target !== maximum) fail(`Minimum raise total is ${state.currentBet + state.minRaise}.`);
    commit(state, index, target - seat.streetContribution, "raise");
    if (raiseSize >= state.minRaise) { state.minRaise = raiseSize; for (const other of state.seats) if (canAct(other)) other.acted = false; }
    state.currentBet = target; seat.acted = true; description = `raised to ${target}`;
  } else if (type === "all-in") {
    const target = seat.streetContribution + seat.stack;
    if (seat.stack === 0) fail("Player is already all-in.");
    const raiseSize = target - state.currentBet;
    commit(state, index, seat.stack, "all-in");
    if (target > state.currentBet) {
      if (raiseSize >= state.minRaise) { state.minRaise = raiseSize; for (const other of state.seats) if (canAct(other)) other.acted = false; }
      state.currentBet = target;
    }
    seat.acted = true; description = `went all-in for ${target}`;
  } else fail(`Unsupported action "${type}".`);
  addHistory(state, `${seat.name} ${description}.`);
  if (contenders(state).length === 1) { awardLastPlayer(state); return; }
  if (bettingComplete(state)) { advanceBetting(state); return; }
  state.acting = nextBettingActor(state, index);
}
function applyDraw(state, request) {
  if (state.variant !== "five-card-draw" || state.phase !== "draw") fail("No draw is currently available.");
  const index = state.acting;
  const seat = state.seats[index];
  if (request.player !== seat.name) fail(`It is ${seat.name}'s draw.`);
  if (!Array.isArray(request.discard)) fail("discard must be an array of zero through three card indexes.");
  const indexes = [...new Set(request.discard)];
  if (indexes.length !== request.discard.length || indexes.length > 3 || indexes.some((item) => !Number.isInteger(item) || item < 0 || item > 4)) fail("discard must contain up to three unique indexes from 0 through 4.");
  for (const cardIndex of indexes.sort((a, b) => a - b)) seat.hole[cardIndex] = drawCard(state);
  seat.drawn = true;
  addHistory(state, `${seat.name} drew ${indexes.length} card${indexes.length === 1 ? "" : "s"}.`);
  const next = clockwise(state, index, (candidate) => !candidate.drawn);
  if (next !== null) { state.acting = next; return; }
  state.phase = "second-bet";
  resetBetting(state);
  if (state.seats.filter(canAct).length <= 1) { finishShowdown(state); return; }
  state.acting = firstPostDealer(state);
}
function startState(input) {
  const variant = input.variant === "holdem" ? "holdem" : input.variant === "five-card-draw" || input.variant === "5card" ? "five-card-draw" : fail("variant must be holdem or five-card-draw.");
  if (!Array.isArray(input.players) || input.players.length < 2 || input.players.length > (variant === "holdem" ? 10 : 8)) fail("players must contain a valid table of two or more seats.");
  const names = new Set();
  const seats = input.players.map((player, index) => {
    if (!player || typeof player.name !== "string" || !player.name.trim()) fail(`players[${index}] needs a name.`);
    const name = player.name.trim(); if (names.has(name)) fail(`Duplicate player name "${name}".`); names.add(name);
    const stack = integer(player.stack, `${name} stack`, 1);
    const tableOpeningStack = player.tableOpeningStack === undefined ? stack : integer(player.tableOpeningStack, `${name} tableOpeningStack`);
    return { name, human: Boolean(player.human), stack, tableOpeningStack, hole: [], folded: false, allIn: false, streetContribution: 0, committed: 0, acted: false, drawn: false };
  });
  if (seats.filter((seat) => seat.human).length !== 1) fail("Exactly one player must be marked human.");
  const dealer = typeof input.dealer === "string" ? seats.findIndex((seat) => seat.name === input.dealer) : input.dealer;
  if (!Number.isInteger(dealer) || dealer < 0 || dealer >= seats.length) fail("dealer must identify one occupied seat.");
  const ante = integer(input.ante ?? 0, "ante");
  const smallBlind = variant === "holdem" ? integer(input.smallBlind, "smallBlind", 1) : 0;
  const bigBlind = variant === "holdem" ? integer(input.bigBlind, "bigBlind", smallBlind) : 0;
  const baseBet = variant === "holdem" ? bigBlind : integer(input.minimumBet ?? 1, "minimumBet", 1);
  const state = { version: 1, variant, seats, dealer, ante, smallBlind, bigBlind, baseBet, deck: validateDeck(input.deck), cursor: 0, board: [], burns: [], phase: variant === "holdem" ? "preflop" : "first-bet", acting: null, currentBet: 0, minRaise: baseBet, history: [], complete: false, showdown: null, pots: [] };
  if (ante) {
    for (let index = 0; index < seats.length; index += 1) commit(state, index, ante, "ante");
    for (const seat of seats) seat.streetContribution = 0;
  }
  dealRounds(state, variant === "holdem" ? 2 : 5);
  if (variant === "holdem") {
    const smallIndex = seats.length === 2 ? dealer : clockwise(state, dealer, active);
    const bigIndex = clockwise(state, smallIndex, active);
    commit(state, smallIndex, smallBlind, "small blind");
    commit(state, bigIndex, bigBlind, "big blind");
    state.currentBet = Math.max(...seats.map((seat) => seat.streetContribution));
    state.acting = clockwise(state, bigIndex, canAct);
    addHistory(state, `${seats[smallIndex].name} posted ${smallBlind}; ${seats[bigIndex].name} posted ${bigBlind}.`);
  } else {
    state.acting = firstPostDealer(state);
    if (ante) addHistory(state, `Each player posted an ante of ${ante}.`);
  }
  return state;
}
function publicResponse(state) {
  const actor = state.acting === null ? null : state.seats[state.acting];
  const response = {
    variant: state.variant,
    phase: state.phase,
    dealer: state.seats[state.dealer].name,
    board: state.board,
    pot: potSize(state),
    currentBet: state.currentBet,
    minimumRaise: state.minRaise,
    acting: actor?.name ?? null,
    seats: state.seats.map((seat, index) => ({ seat: index, name: seat.name, human: seat.human, stack: seat.stack, tableOpeningStack: seat.tableOpeningStack, folded: seat.folded, allIn: seat.allIn, committed: seat.committed, streetContribution: seat.streetContribution })),
    recentActions: state.history.slice(-12),
    complete: state.complete,
  };
  if (actor) {
    response.decision = state.phase === "draw"
      ? { player: actor.name, human: actor.human, cards: actor.hole, discardIndexes: [0, 1, 2, 3, 4], maximumDiscards: 3 }
      : { player: actor.name, human: actor.human, cards: actor.hole, legalActions: legalActions(state, state.acting) };
  }
  if (state.complete) { response.showdown = state.showdown; response.pots = state.pots; }
  return response;
}

const root = findRoot(path.dirname(fileURLToPath(import.meta.url)));
let source = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => { source += chunk; });
process.stdin.on("end", () => {
  try {
    if (!source.trim()) fail("Provide one JSON request on standard input.");
    const input = JSON.parse(source);
    const directory = campaignDirectory(root, input.campaign);
    const statePath = path.join(directory, "data", "poker-state.json");
    let state;
    if (input.operation === "start") {
      if (fs.existsSync(statePath)) {
        const existing = JSON.parse(fs.readFileSync(statePath, "utf8"));
        if (!existing.complete && !input.replace) fail("An unfinished poker hand already exists.");
      }
      state = startState(input);
    } else {
      if (!fs.existsSync(statePath)) fail("No poker state exists for this campaign.");
      state = JSON.parse(fs.readFileSync(statePath, "utf8"));
      if (input.operation === "act") applyAction(state, input);
      else if (input.operation === "draw") applyDraw(state, input);
      else if (input.operation !== "state") fail("operation must be start, state, act, or draw.");
    }
    fs.writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
    process.stdout.write(`${JSON.stringify(publicResponse(state), null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
});
