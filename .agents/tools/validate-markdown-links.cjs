#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

function markdownFilesIn(directory) {
  const files = [];

  const visit = (current) => {
    const entries = fs
      .readdirSync(current, { withFileTypes: true })
      .sort((left, right) => left.name.localeCompare(right.name));

    for (const entry of entries) {
      const candidate = path.join(current, entry.name);
      if (entry.isDirectory()) visit(candidate);
      else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
        files.push(candidate);
      }
    }
  };

  visit(directory);
  return files;
}

function withoutFencedCode(markdown) {
  const output = [];
  let fence = null;

  for (const line of markdown.split(/\r?\n/)) {
    const match = line.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (!fence && match) {
      fence = { marker: match[1][0], length: match[1].length };
      output.push("");
      continue;
    }

    if (
      fence &&
      new RegExp(`^\\s{0,3}${fence.marker}{${fence.length},}\\s*$`).test(line)
    ) {
      fence = null;
      output.push("");
      continue;
    }

    output.push(fence ? "" : line);
  }

  return output.join("\n");
}

function inlineDestinations(markdown) {
  const destinations = [];

  for (let index = 0; index < markdown.length; index += 1) {
    if (markdown[index] === "`") {
      let length = 1;
      while (markdown[index + length] === "`") length += 1;
      const closing = markdown.indexOf("`".repeat(length), index + length);
      if (closing !== -1) index = closing + length - 1;
      continue;
    }

    if (markdown[index] !== "]" || markdown[index + 1] !== "(") continue;

    let cursor = index + 2;
    while (/\s/.test(markdown[cursor] || "")) cursor += 1;

    if (markdown[cursor] === "<") {
      const end = markdown.indexOf(">", cursor + 1);
      if (end !== -1) destinations.push(markdown.slice(cursor + 1, end));
      continue;
    }

    const start = cursor;
    let nestedParentheses = 0;
    while (cursor < markdown.length) {
      const character = markdown[cursor];
      if (character === "\\") {
        cursor += 2;
        continue;
      }
      if (/\s/.test(character) && nestedParentheses === 0) break;
      if (character === "(") nestedParentheses += 1;
      else if (character === ")") {
        if (nestedParentheses === 0) break;
        nestedParentheses -= 1;
      }
      cursor += 1;
    }

    if (cursor > start) destinations.push(markdown.slice(start, cursor));
  }

  return destinations;
}

function referenceDestinations(markdown) {
  const destinations = [];
  const definition = /^\s{0,3}\[[^\]]+\]:\s*(?:<([^>]+)>|(\S+))/gm;

  for (const match of markdown.matchAll(definition)) {
    destinations.push(match[1] || match[2]);
  }

  return destinations;
}

function localMarkdownPath(destination) {
  if (!destination || destination.startsWith("#")) return null;
  if (destination.startsWith("//") || /^[a-z][a-z\d+.-]*:/i.test(destination)) {
    return null;
  }

  const pathname = destination.split(/[?#]/, 1)[0];
  if (!pathname) return null;

  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    decoded = pathname;
  }

  if (!decoded.toLowerCase().endsWith(".md")) return null;
  return decoded.replace(/\\([() ])/g, "$1");
}

function isMarkdownFile(filename) {
  try {
    return fs.statSync(filename).isFile();
  } catch {
    return false;
  }
}

function validateMarkdownLinks(directory) {
  const root = path.resolve(directory);
  const stat = fs.statSync(root);
  if (!stat.isDirectory()) throw new Error(`Not a directory: ${root}`);

  const errors = [];
  for (const file of markdownFilesIn(root)) {
    const markdown = withoutFencedCode(fs.readFileSync(file, "utf8"));
    const destinations = [
      ...inlineDestinations(markdown),
      ...referenceDestinations(markdown),
    ];
    const missing = [];

    for (const destination of destinations) {
      const localPath = localMarkdownPath(destination);
      if (!localPath) continue;
      if (!isMarkdownFile(path.resolve(path.dirname(file), localPath))) {
        if (!missing.includes(destination)) missing.push(destination);
      }
    }

    if (missing.length > 0) {
      errors.push({
        source: path.relative(root, file).replaceAll("\\", "/"),
        destinations: missing,
      });
    }
  }

  return errors;
}

module.exports = { validateMarkdownLinks };

if (require.main === module) {
  const directory = process.argv[2];
  if (!directory || process.argv.length !== 3) {
    console.error(
      "Usage: node .agents/tools/validate-markdown-links.cjs <directory>",
    );
    process.exit(2);
  }

  try {
    const errors = validateMarkdownLinks(directory);
    process.stdout.write(`${JSON.stringify(errors, null, 2)}\n`);
    process.exitCode = errors.length > 0 ? 1 : 0;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}
