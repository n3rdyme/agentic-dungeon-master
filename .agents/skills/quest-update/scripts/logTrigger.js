#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

function findRoot(start) {
  let current = path.resolve(start);
  while (true) {
    if (fs.existsSync(path.join(current, ".root"))) return current;
    const parent = path.dirname(current);
    if (parent === current) fail("Repository root marker .root was not found");
    current = parent;
  }
}

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => { raw += chunk; });
process.stdin.on("end", () => {
  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    fail("Input must be one strict JSON object");
  }

  const requiredStrings = ["campaign", "userInput", "activationMode", "classification", "decision", "reason"];
  for (const field of requiredStrings) {
    if (typeof input[field] !== "string" || input[field].trim() === "") {
      fail(`${field} must be a non-empty string`);
    }
  }
  if (!Array.isArray(input.candidateQuests) || !Array.isArray(input.triggerSignals) || !Array.isArray(input.durableChanges)) {
    fail("candidateQuests, triggerSignals, and durableChanges must be arrays");
  }

  const activationModes = new Set(["automatic", "explicit"]);
  const classifications = new Set(["goal-completed", "countable-progress", "action-in-progress", "planning-only", "mention-only", "ambiguous", "new-quest", "quest-completion", "explicit-maintenance", "no-active-match"]);
  const decisions = new Set(["update", "skip", "clarify", "quest-receive", "quest-complete"]);
  const automaticCategories = new Set(["goal-completed", "countable-goal-progress"]);
  const explicitCategories = new Set(["goal-definition", "objective", "reward", "status"]);
  const signalSources = new Set(["user-input", "prior-narration", "canonical-file"]);
  if (!activationModes.has(input.activationMode)) fail("Unsupported activationMode");
  if (!classifications.has(input.classification)) fail("Unsupported classification");
  if (!decisions.has(input.decision)) fail("Unsupported decision");

  for (const signal of input.triggerSignals) {
    if (!signal || typeof signal !== "object" || !signalSources.has(signal.source)) {
      fail("Each trigger signal needs a supported source");
    }
    if (typeof signal.quote !== "string" || signal.quote.trim() === "" ||
        typeof signal.sourceReference !== "string" || signal.sourceReference.trim() === "") {
      fail("Each trigger signal needs an exact quote and sourceReference");
    }
    if (signal.source === "user-input" && !input.userInput.includes(signal.quote)) {
      fail(`User-input trigger quote was not found verbatim: ${signal.quote}`);
    }
  }

  for (const change of input.durableChanges) {
    if (!change || typeof change !== "object" ||
        (!automaticCategories.has(change.category) && !explicitCategories.has(change.category))) {
      fail("Each durable change needs an allowed category");
    }
    if (typeof change.goal !== "string" || change.goal.trim() === "") {
      fail("Each durable change needs a named goal");
    }
    if (typeof change.before !== "string" || typeof change.after !== "string" ||
        change.before.trim() === "" || change.after.trim() === "" || change.before === change.after) {
      fail("Each durable change needs distinct non-empty before and after values");
    }
  }

  if (input.decision === "update") {
    if (typeof input.matchedQuest !== "string" || input.matchedQuest.trim() === "") {
      fail("A durable update requires matchedQuest");
    }
    if (input.triggerSignals.length === 0 || input.durableChanges.length === 0) {
      fail("A durable update requires exact evidence and at least one durable change");
    }
    if (input.activationMode === "automatic") {
      if (!new Set(["goal-completed", "countable-progress"]).has(input.classification)) {
        fail("Automatic updates require goal-completed or countable-progress classification");
      }
      if (input.durableChanges.some((change) => !automaticCategories.has(change.category))) {
        fail("Automatic updates may only complete a goal or advance a countable goal");
      }
    } else {
      if (input.classification !== "explicit-maintenance") {
        fail("Explicit updates require explicit-maintenance classification");
      }
      if (input.durableChanges.some((change) => !explicitCategories.has(change.category))) {
        fail("Explicit maintenance used an unsupported category");
      }
    }
  } else if (input.durableChanges.length !== 0) {
    fail("Only an update decision may include durableChanges");
  }

  const root = findRoot(process.cwd());
  const campaign = input.campaign.trim();
  if (!campaign || campaign.startsWith(".") || campaign.includes("/") || campaign.includes("\\") || path.basename(campaign) !== campaign) {
    fail("campaign must be an exact non-hidden player-folder name");
  }
  const campaignDir = path.join(root, "campaigns", campaign);
  const questsDir = path.join(campaignDir, "quests");
  if (!fs.statSync(campaignDir, { throwIfNoEntry: false })?.isDirectory()) {
    fail(`Campaign directory not found: campaigns/${campaign}`);
  }
  if (!fs.statSync(questsDir, { throwIfNoEntry: false })?.isDirectory()) {
    fail(`Quests directory not found: campaigns/${campaign}/quests`);
  }

  const entry = {
    timestamp: new Date().toISOString(),
    skill: "quest-update",
    campaign,
    day: input.day ?? null,
    userInput: input.userInput,
    activationMode: input.activationMode,
    candidateQuests: input.candidateQuests,
    matchedQuest: input.matchedQuest ?? null,
    triggerSignals: input.triggerSignals,
    classification: input.classification,
    decision: input.decision,
    durableChanges: input.durableChanges,
    reason: input.reason,
  };

  const line = JSON.stringify(entry);
  fs.appendFileSync(path.join(questsDir, "quest-update.log"), `${line}\n`, "utf8");
  process.stdout.write(`${line}\n`);
});
