#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const numberFormat = /^\d+\. /;

function beginsExemptContent(line) {
  const trimmed = line.trimStart();
  return (
    trimmed.startsWith("-") ||
    trimmed.startsWith("|") ||
    trimmed.startsWith(">") ||
    numberFormat.test(trimmed)
  );
}

function beginsHeaderContent(line) {
  const trimmed = line.trimStart();
  return trimmed.startsWith("#");
}

export function formatMarkdown(text) {
  const newline = text.includes("\r\n") ? "\r\n" : "\n";
  const hasFinalNewline = text.endsWith("\n");
  const lines = text.split(/\r?\n/);
  if (hasFinalNewline) lines.pop();

  const output = [];
  let inFence = false;
  let inFrontMatter = lines[0]?.trim() === "---";
  let frontMatterClosed = !inFrontMatter;
  let insertions = 0;

  for (const line of lines) {
    const trimmed = line.trimStart();
    const fence = /^(?:```|~~~)/.test(trimmed);

    if (
      output.length > 0 &&
      !inFence &&
      frontMatterClosed &&
      !line.startsWith("  ")
    ) {
      const previous = output.at(-1);
      const isPreviousEmpty = previous.trim() === "";
      const isPreviousHeader = beginsHeaderContent(previous);
      const bothNonempty = !isPreviousEmpty && trimmed !== "";
      const exempt =
        (beginsExemptContent(line) && beginsExemptContent(previous)) ||
        isPreviousEmpty;
      if (bothNonempty && (!exempt || isPreviousHeader)) {
        output.push("");
        insertions += 1;
      }
    }

    output.push(line);

    if (
      inFrontMatter &&
      !frontMatterClosed &&
      output.length > 1 &&
      trimmed === "---"
    ) {
      frontMatterClosed = true;
      inFrontMatter = false;
    } else if (fence && frontMatterClosed) {
      inFence = !inFence;
    }
  }

  const formatted = output.join(newline) + (hasFinalNewline ? newline : "");
  return { text: formatted, changed: formatted !== text, insertions };
}

export function formatMarkdownFile(filename) {
  const file = path.resolve(filename);
  const before = fs.readFileSync(file, "utf8");
  const result = formatMarkdown(before);
  if (result.changed) fs.writeFileSync(file, result.text, "utf8");
  return { file, changed: result.changed, insertions: result.insertions };
}

function markdownFilesIn(directory) {
  const files = [];
  const visit = (current) => {
    const entries = fs
      .readdirSync(current, { withFileTypes: true })
      .sort((left, right) =>
        left.name < right.name ? -1 : left.name > right.name ? 1 : 0,
      );
    for (const entry of entries) {
      const candidate = path.join(current, entry.name);
      if (entry.isDirectory()) visit(candidate);
      else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
        files.push(candidate);
    }
  };
  visit(directory);
  return files;
}

export function formatMarkdownPath(target) {
  const resolved = path.resolve(target);
  const stat = fs.statSync(resolved);
  if (stat.isFile()) return formatMarkdownFile(resolved);
  if (!stat.isDirectory())
    throw new Error(`Not a file or directory: ${resolved}`);

  const results = markdownFilesIn(resolved).map(formatMarkdownFile);
  return {
    directory: resolved,
    files: results.length,
    changed: results.filter((result) => result.changed).length,
    insertions: results.reduce((total, result) => total + result.insertions, 0),
    results,
  };
}

const invokedPath = process.argv[1]
  ? pathToFileURL(path.resolve(process.argv[1])).href
  : null;
if (invokedPath === import.meta.url) {
  const target = process.argv[2];
  if (!target || process.argv.length !== 3) {
    console.error(
      "Usage: node .agents/tools/markdown-format.mjs <file-or-directory>",
    );
    process.exit(2);
  }
  try {
    process.stdout.write(`${JSON.stringify(formatMarkdownPath(target))}\n`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
