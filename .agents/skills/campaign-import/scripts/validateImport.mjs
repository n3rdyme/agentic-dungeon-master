#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { validatePartyMember } from "../../party-member-update/scripts/validatePartyMember.mjs";

const campaign = path.resolve(process.argv[2] ?? "");
const errors = [];
const warnings = [];

if (!process.argv[2] || !fs.existsSync(campaign)) {
  console.error("Usage: node validateImport.mjs <campaign-directory>");
  process.exit(2);
}

function filesUnder(dir, extension) {
  if (!fs.existsSync(dir)) return [];
  const output = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) output.push(...filesUnder(full, extension));
    else if (!extension || entry.name.endsWith(extension)) output.push(full);
  }
  return output;
}

function relative(file) {
  return path.relative(campaign, file).replaceAll("\\", "/");
}

for (const file of filesUnder(campaign, ".json")) {
  try {
    JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    errors.push(`${relative(file)}: invalid JSON (${error.message})`);
  }
}

const markdownFiles = filesUnder(campaign, ".md");
const linkPattern = /\[[^\]]+\]\(([^)]+)\)/g;
for (const file of markdownFiles) {
  const body = fs.readFileSync(file, "utf8");
  for (const match of body.matchAll(linkPattern)) {
    const target = match[1];
    if (/^(https?:\/\/|#)/i.test(target)) continue;
    const local = decodeURIComponent(target.split("#", 1)[0]);
    if (!fs.existsSync(path.resolve(path.dirname(file), local))) {
      errors.push(`${relative(file)}: broken link ${target}`);
    }
  }
}

const quests = path.join(campaign, "quests");
if (fs.existsSync(quests)) {
  for (const entry of fs.readdirSync(quests, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".md")) {
      errors.push(`quests/${entry.name}: quest files may exist only in active or resolved`);
    }
  }
}

const activeQuestFiles = filesUnder(path.join(quests, "active"), ".md");
const resolvedQuestFiles = filesUnder(path.join(quests, "resolved"), ".md");
const normalized = new Map();

function questIdentity(file, body) {
  const title = body.match(/^#\s+(.+)$/m)?.[1] ?? path.basename(file, ".md");
  return title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function validateResolvedStoryXp(file, body) {
  const declarations = [...body.matchAll(/^\*{0,2}Story XP\*{0,2}:\s*(.+)$/gmi)];
  if (declarations.length !== 1) {
    errors.push(`${relative(file)}: expected exactly one Story XP field`);
    return;
  }
  if (!/\b\d+\s*XP\b/i.test(declarations[0][1])) {
    errors.push(`${relative(file)}: Story XP field must contain a numeric XP amount`);
  }
}

for (const file of activeQuestFiles) {
  const body = fs.readFileSync(file, "utf8");
  for (const field of ["Giver", "Started", "Objective", "Status", "Reward"]) {
    if (!new RegExp(`^\\*{0,2}${field}\\*{0,2}:`, "mi").test(body)) {
      errors.push(`${relative(file)}: missing ${field}`);
    }
  }
  if (/^\*{0,2}Story XP\*{0,2}:/mi.test(body)) {
    errors.push(`${relative(file)}: active quest must not contain Story XP`);
  }
  if (!/^##\s+Goals\s*$/mi.test(body)) errors.push(`${relative(file)}: missing Goals section`);
  if (!/-\s+\[[ xX]\]/.test(body) && !/Progress:\s*\d+\s*\/\s*\d+/i.test(body)) {
    errors.push(`${relative(file)}: no binary or countable goal`);
  }
  if (/\bresolved\b|\bcompleted successfully\b/i.test(body)) {
    errors.push(`${relative(file)}: active quest contains terminal language`);
  }
  const identity = questIdentity(file, body);
  if (normalized.has(identity)) warnings.push(`${relative(file)}: duplicate title with ${normalized.get(identity)}`);
  else normalized.set(identity, relative(file));
}

for (const file of resolvedQuestFiles) {
  const body = fs.readFileSync(file, "utf8");
  validateResolvedStoryXp(file, body);
  if (!/Resolved:\s*Day\s+(?:\d+|Unknown)/i.test(body)) errors.push(`${relative(file)}: missing Resolved day`);
  if (!/Resolution:/i.test(body) && !/^##\s+Resolution\s*$/mi.test(body)) errors.push(`${relative(file)}: missing Resolution`);
  if (/Status:\s*Active/i.test(body)) errors.push(`${relative(file)}: resolved quest is marked active`);
  const identity = questIdentity(file, body);
  if (normalized.has(identity)) errors.push(`${relative(file)}: duplicates ${normalized.get(identity)}`);
  else normalized.set(identity, relative(file));
}

const partyIndex = path.join(campaign, "party.md");
if (fs.existsSync(partyIndex)) {
  const body = fs.readFileSync(partyIndex, "utf8");
  const activeNames = [...body.matchAll(/\[[^\]]+\]\(party\/([^/)]+)\.md\)/g)].map(match => decodeURIComponent(match[1]));
  for (const name of activeNames) {
    for (const required of ["Bio.md", "Appearance.md", "Personality.md", "Knowledge.md", "Stats.md", "Equipment.md"]) {
      const file = path.join(campaign, "party", name, required);
      if (!fs.existsSync(file)) errors.push(`party/${name}/${required}: missing active-party file`);
    }
    const partyResult = validatePartyMember(campaign, name);
    errors.push(...partyResult.errors);
    warnings.push(...partyResult.warnings);
  }
}

const campaignInfo = path.join(campaign, "campaign-info.md");
if (!fs.existsSync(campaignInfo)) {
  errors.push("campaign-info.md: missing immutable world-building contract");
} else {
  const body = fs.readFileSync(campaignInfo, "utf8");
  const expected = ["World-Building Direction", "World-Building Boundaries"];
  const actual = [...body.matchAll(/^## (.+)$/gm)].map(match => match[1].trim());
  if (JSON.stringify(actual) !== JSON.stringify(expected)) errors.push("campaign-info.md: required sections are missing, unexpected, or out of order");
}

const inventoryFile = path.join(campaign, "data", "inventory.json");
if (fs.existsSync(inventoryFile)) {
  try {
    const inventory = JSON.parse(fs.readFileSync(inventoryFile, "utf8"));
    for (const entry of inventory) {
      const text = `${entry.Item ?? ""} ${entry.Source ?? ""}`;
      if (/\bunidentified\b|\bunknown\b|\bunopened\b|\bcoded\b/i.test(text)) {
        warnings.push(`inventory: review unresolved item "${entry.Item ?? "Unnamed item"}"`);
      }
    }
  } catch {
    // JSON error is already reported above.
  }
}

const statusFile = path.join(campaign, "data", "status.json");
if (fs.existsSync(statusFile)) {
  try {
    const status = JSON.parse(fs.readFileSync(statusFile, "utf8"));
    const weekdayNames = new Set(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]);
    if (!weekdayNames.has(status.day_of_week)) {
      errors.push("data/status.json: imported campaign requires a valid day_of_week");
    }
  } catch {
    // JSON error is already reported above.
  }
}

const legacyMagicItems = path.join(campaign, ["Magic", "Items.md"].join(" "));
if (fs.existsSync(legacyMagicItems)) {
  errors.push("legacy monolithic unique-item ledger is forbidden; migrate each unique item to items/<Item>.md");
}

const uniqueItems = path.join(campaign, "items");
if (!fs.existsSync(uniqueItems)) errors.push("items: missing canonical unique-item directory");

const bookmarkFile = path.join(campaign, "data", "import-bookmark.json");
if (fs.existsSync(bookmarkFile)) {
  try {
    const bookmark = JSON.parse(fs.readFileSync(bookmarkFile, "utf8"));
    if (bookmark.Complete === true && errors.length) {
      errors.unshift("import-bookmark marks the import complete while validation errors remain");
    }
  } catch {
    // JSON error is already reported above.
  }
}

for (const message of errors) console.error(`ERROR: ${message}`);
for (const message of warnings) console.warn(`WARNING: ${message}`);
console.log(`Import validation: ${errors.length} error(s), ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
