#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

function findRepositoryRoot(start) {
  let current = path.resolve(start);
  while (true) {
    if (fs.existsSync(path.join(current, ".root"))) return current;
    const parent = path.dirname(current);
    if (parent === current) fail("Repository root marker .root was not found");
    current = parent;
  }
}

function resolveConversationFile(root, filename) {
  const candidates = [
    path.resolve(process.cwd(), filename),
    path.join(root, "WORK", "conversations", filename),
    path.join(root, "WORK", filename),
  ];

  for (const candidate of candidates) {
    if (fs.statSync(candidate, { throwIfNoEntry: false })?.isFile()) return candidate;
  }
  fail(`Conversation file not found: ${filename}`);
}

function encodeBookmark(ordinal) {
  return String(ordinal);
}

function decodeBookmark(value, messageCount) {
  if (!/^\d+$/.test(value)) fail("Bookmark must be a nonnegative integer ordinal");
  const ordinal = Number(value);
  if (!Number.isSafeInteger(ordinal) || ordinal > messageCount) {
    fail("Bookmark contains an invalid resume location");
  }
  return ordinal;
}

function buildLinearProgression(messages) {
  if (messages.length === 0) return [];
  const rootParent = "00000000-0000-4000-8000-000000000000";

  const byId = new Map();
  for (const message of messages) {
    if (typeof message?.uuid !== "string" || message.uuid.length === 0) {
      fail("Every conversation message must have a UUID");
    }
    if (byId.has(message.uuid)) fail(`Duplicate message UUID: ${message.uuid}`);
    byId.set(message.uuid, message);
  }

  const reversed = [];
  const visited = new Set();
  let current = messages.at(-1);
  while (current) {
    if (visited.has(current.uuid)) fail(`Cycle detected at message UUID: ${current.uuid}`);
    visited.add(current.uuid);
    reversed.push(current);

    if (!current.parent_message_uuid || current.parent_message_uuid === rootParent) break;
    current = byId.get(current.parent_message_uuid);
    if (!current) fail(`Missing parent message UUID: ${reversed.at(-1).parent_message_uuid}`);
  }

  return reversed.reverse();
}

function renderAttachment(attachment, index) {
  const name = attachment?.file_name || `attachment-${index + 1}`;
  const type = attachment?.file_type ? ` (${attachment.file_type})` : "";
  const content = attachment?.extracted_content;
  const rendered = typeof content === "string"
    ? content
    : content == null
      ? "[No extracted content available]"
      : JSON.stringify(content, null, 2);
  return `[Attachment: ${name}${type}]\n${rendered}`;
}

function renderFile(file, index) {
  const name = file?.file_name || `file-${index + 1}`;
  const uuid = file?.file_uuid ? `\nFile UUID: ${file.file_uuid}` : "";
  return `[Attached file: ${name}]${uuid}`;
}

function renderValue(value) {
  if (typeof value === "string") return value;
  if (value == null) return "";
  return JSON.stringify(value, null, 2);
}

function renderToolBlock(block) {
  const label = block.type === "tool_use" ? "Tool use" : "Tool result";
  const name = block.name || block.tool_identifier || "unknown";
  const values = block.type === "tool_use"
    ? [block.input, block.message]
    : [block.content, block.structured_content, block.display_content, block.message];
  const rendered = [...new Set(values.map(renderValue).filter(Boolean))];
  return [`[${label}: ${name}]`, ...rendered].join("\n");
}

function renderMessage(message) {
  const sections = [];
  if (Array.isArray(message?.content) && message.content.length > 0) {
    for (const block of message.content) {
      if (block?.type === "thinking") continue;
      if (block?.type === "text" && typeof block.text === "string") sections.push(block.text);
      else if (block?.type === "tool_use" || block?.type === "tool_result") {
        sections.push(renderToolBlock(block));
      } else {
        sections.push(`[${block?.type || "content"}]\n${JSON.stringify(block, null, 2)}`);
      }
    }
  } else if (typeof message?.text === "string" && message.text.length > 0) {
    sections.push(message.text);
  }

  const attachments = Array.isArray(message?.attachments) ? message.attachments : [];
  attachments.forEach((attachment, index) => sections.push(renderAttachment(attachment, index)));

  const attachmentNames = new Set(attachments.map((attachment) => attachment?.file_name).filter(Boolean));
  const files = Array.isArray(message?.files) ? message.files : [];
  files.forEach((file, index) => {
    if (!attachmentNames.has(file?.file_name)) sections.push(renderFile(file, index));
  });

  return sections.join("\n\n");
}

const [filename, rawLimit, rawBookmark] = process.argv.slice(2);
if (!filename || !rawLimit) {
  fail("Usage: node readConversation.mjs <filename> <limit> [bookmark]");
}

const limit = Number(rawLimit);
if (!Number.isSafeInteger(limit) || limit <= 0) fail("limit must be a positive integer");

const root = findRepositoryRoot(process.cwd());
const conversationFile = resolveConversationFile(root, filename);

let conversation;
try {
  conversation = JSON.parse(fs.readFileSync(conversationFile, "utf8"));
} catch (error) {
  fail(`Unable to parse conversation JSON: ${error.message}`);
}

if (!Array.isArray(conversation?.chat_messages)) {
  fail("Expected an Anthropic conversation object with a chat_messages array");
}

const progression = buildLinearProgression(conversation.chat_messages);
const start = rawBookmark
  ? decodeBookmark(rawBookmark, progression.length)
  : 0;
const end = Math.min(start + limit, progression.length);

const data = progression.slice(start, end).map((message) => {
  const actor = message.sender === "human"
    ? "user"
    : message.sender === "assistant"
      ? "ai"
      : fail(`Unsupported message sender: ${message.sender}`);
  return { actor, text: renderMessage(message) };
});

const output = {
  bookmark: end < progression.length
    ? encodeBookmark(end)
    : null,
  data,
};

process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
