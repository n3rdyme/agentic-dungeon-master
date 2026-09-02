#!/usr/bin/env node

"use strict";

const { randomInt } = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const MAX_REQUESTS = 1000;
const MAX_TOTAL_DICE = 1000;
const MAX_DIE = 1_000_000;
const MAX_ABS_MODIFIER = 1_000_000;

function parseInput(source) {
  try {
    return JSON.parse(source);
  } catch (strictError) {
    // Accept the documented relaxed form: unquoted keys and trailing commas.
    // Do not evaluate input as JavaScript.
    const relaxed = source
      .replace(/([{,]\s*)([A-Za-z_$][\w$]*)(\s*:)/g, '$1"$2"$3')
      .replace(/,\s*([}\]])/g, "$1");

    try {
      return JSON.parse(relaxed);
    } catch {
      throw new Error(`Invalid input: ${strictError.message}`);
    }
  }
}

function findRepositoryRoot(startDirectory) {
  let current = path.resolve(startDirectory);

  while (true) {
    if (fs.existsSync(path.join(current, ".root"))) {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      throw new Error('Repository root marker ".root" was not found.');
    }
    current = parent;
  }
}

function resolveCampaignDirectory(repositoryRoot, campaign) {
  if (typeof campaign !== "string" || campaign.trim() === "") {
    throw new Error("Input campaign must be a non-empty string.");
  }
  if (campaign !== campaign.trim()) {
    throw new Error("Input campaign must not have leading or trailing whitespace.");
  }

  if (campaign.startsWith(".") || campaign.includes("/") || campaign.includes("\\") || path.basename(campaign) !== campaign) {
    throw new Error("Input campaign must be an exact non-hidden player-folder name.");
  }

  const campaignsDirectory = path.join(repositoryRoot, "campaigns");
  const match = fs
    .readdirSync(campaignsDirectory, { withFileTypes: true })
    .find((entry) => entry.isDirectory() && entry.name === campaign);

  if (!match) {
    throw new Error(
      `Campaign "${campaign}" does not match a player folder under campaigns/.`,
    );
  }

  return path.join(campaignsDirectory, match.name);
}

function validateRolls(value) {
  if (!Array.isArray(value)) {
    throw new Error("Input must be an array of roll requests.");
  }
  if (value.length === 0) {
    throw new Error("Input must contain at least one roll request.");
  }
  if (value.length > MAX_REQUESTS) {
    throw new Error(`Input exceeds the ${MAX_REQUESTS}-request limit.`);
  }

  let totalDice = 0;
  const labels = new Set();

  return value.map((entry, index) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error(`Roll ${index} must be an object.`);
    }
    if (typeof entry.roll !== "string" || entry.roll.trim() === "") {
      throw new Error(`Roll ${index} must have a non-empty string label.`);
    }
    const roll = entry.roll.trim();
    if (labels.has(roll)) {
      throw new Error(`Roll ${index} has duplicate label "${roll}".`);
    }
    labels.add(roll);

    if (!Number.isSafeInteger(entry.die) || entry.die < 2 || entry.die > MAX_DIE) {
      throw new Error(
        `Roll ${index} die must be an integer from 2 through ${MAX_DIE}.`,
      );
    }

    const count = entry.count === undefined ? 1 : entry.count;
    if (!Number.isSafeInteger(count) || count < 1 || count > MAX_TOTAL_DICE) {
      throw new Error(
        `Roll ${index} count must be an integer from 1 through ${MAX_TOTAL_DICE}.`,
      );
    }
    totalDice += count;
    if (totalDice > MAX_TOTAL_DICE) {
      throw new Error(`Input exceeds the ${MAX_TOTAL_DICE}-die batch limit.`);
    }

    const modifier = entry.modifier === undefined ? 0 : entry.modifier;
    if (
      !Number.isSafeInteger(modifier) ||
      Math.abs(modifier) > MAX_ABS_MODIFIER
    ) {
      throw new Error(
        `Roll ${index} modifier must be an integer from -${MAX_ABS_MODIFIER} through ${MAX_ABS_MODIFIER}.`,
      );
    }

    const results = Array.from({ length: count }, () =>
      randomInt(1, entry.die + 1),
    );
    const total = results.reduce((sum, result) => sum + result, modifier);

    return { roll, count, die: entry.die, results, modifier, total };
  });
}

function rollRequest(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Input must be an object containing campaign and rolls.");
  }

  const repositoryRoot = findRepositoryRoot(__dirname);
  const campaignDirectory = resolveCampaignDirectory(
    repositoryRoot,
    value.campaign,
  );
  const response = {
    campaign: value.campaign,
    rolls: validateRolls(value.rolls),
  };

  fs.appendFileSync(
    path.join(campaignDirectory, "roll-history.log"),
    `${JSON.stringify(response)}\n`,
    "utf8",
  );

  return response;
}

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  input += chunk;
});
process.stdin.on("end", () => {
  try {
    if (input.trim() === "") {
      throw new Error("No roll requests were provided on standard input.");
    }
    const output = rollRequest(parseInput(input));
    process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
});
