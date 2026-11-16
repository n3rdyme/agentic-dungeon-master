#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer';

const usage = `Usage: node html-to-png.mjs <input.html> [output.png] [options]

Options:
  --width <pixels>           Viewport width (default: 1024)
  --height <pixels>          Initial viewport height (default: 768)
  --scale-factor <number>    Device pixel ratio (default: 1)
  --selector <css>           Capture one element instead of the full page
  --theme <light|dark>       Fallback theme for HTML fragments (default: light)
  --transparent              Preserve a transparent page background
  --executable-path <path>   Chrome or Edge executable
  --help                     Show this help`;

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

function positiveNumber(value, name, integer = false) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0 || (integer && !Number.isInteger(parsed))) {
    throw new Error(`${name} must be a positive ${integer ? 'integer' : 'number'}.`);
  }
  return parsed;
}

function parseArgs(argv) {
  const options = { width: 1024, height: 768, scaleFactor: 1, theme: 'light', transparent: false };
  const positional = [];

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const next = () => {
      index += 1;
      if (index >= argv.length) throw new Error(`${argument} requires a value.`);
      return argv[index];
    };

    if (argument === '--help' || argument === '-h') options.help = true;
    else if (argument === '--width') options.width = positiveNumber(next(), '--width', true);
    else if (argument === '--height') options.height = positiveNumber(next(), '--height', true);
    else if (argument === '--scale-factor') options.scaleFactor = positiveNumber(next(), '--scale-factor');
    else if (argument === '--selector') options.selector = next();
    else if (argument === '--theme') options.theme = next();
    else if (argument === '--transparent') options.transparent = true;
    else if (argument === '--executable-path') options.executablePath = next();
    else if (argument.startsWith('-')) throw new Error(`Unknown option: ${argument}`);
    else positional.push(argument);
  }

  if (!['light', 'dark'].includes(options.theme)) throw new Error('--theme must be light or dark.');
  if (positional.length > 2) throw new Error('Expected an input HTML path and optional output PNG path.');
  options.input = positional[0];
  options.output = positional[1];
  return options;
}

async function isFile(candidate) {
  if (!candidate) return false;
  try {
    return (await fs.stat(candidate)).isFile();
  } catch {
    return false;
  }
}

async function findBrowser(explicitPath) {
  const candidates = [
    explicitPath,
    process.env.PUPPETEER_EXECUTABLE_PATH,
    process.platform === 'win32' ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' : undefined,
    process.platform === 'win32' ? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe' : undefined,
    process.platform === 'win32' ? 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe' : undefined,
    process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : undefined,
    process.platform === 'linux' ? '/usr/bin/google-chrome' : undefined,
    process.platform === 'linux' ? '/usr/bin/chromium' : undefined,
    process.platform === 'linux' ? '/usr/bin/chromium-browser' : undefined,
  ];
  for (const candidate of candidates) {
    if (await isFile(candidate)) return candidate;
  }
  return undefined;
}

function themeCss(theme, transparent) {
  const colors = theme === 'dark'
    ? {
        background: '#16181d', foreground: '#f5f7fa', card: '#20242b', muted: '#2a3039', mutedForeground: '#b8c0cc',
        border: '#3b4350', primary: '#e8ebf0', blue: '#70a7ff', orange: '#f2a65a', green: '#68c483', red: '#ff7777', series1: '#82aaff',
      }
    : {
        background: '#ffffff', foreground: '#1d2430', card: '#ffffff', muted: '#eef1f5', mutedForeground: '#5f6b7a',
        border: '#d7dde5', primary: '#202733', blue: '#2563eb', orange: '#c76b16', green: '#27854b', red: '#c83e3e', series1: '#356fc1',
      };
  const pageBackground = transparent ? 'transparent' : colors.background;
  return `
    :root {
      --font-size-base: 14px;
      --background: ${colors.background}; --foreground: ${colors.foreground};
      --card: ${colors.card}; --card-foreground: ${colors.foreground};
      --muted: ${colors.muted}; --muted-foreground: ${colors.mutedForeground};
      --border: ${colors.border}; --primary: ${colors.primary}; --primary-foreground: ${colors.background};
      --blue: ${colors.blue}; --orange: ${colors.orange}; --green: ${colors.green}; --red: ${colors.red};
      --viz-series-1: ${colors.series1};
    }
    * { box-sizing: border-box; }
    html, body { margin: 0; min-height: 100%; background: ${pageBackground}; color: var(--foreground); }
    body { padding: 20px; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    h1, h2, h3, p { margin: 0; }
    .text-small { font-size: 12px; }
    .text-muted { color: var(--muted-foreground); }
  `;
}

async function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    fail(`${error.message}\n\n${usage}`);
    return;
  }
  if (options.help) {
    console.log(usage);
    return;
  }
  if (!options.input) {
    fail(`An input HTML file is required.\n\n${usage}`);
    return;
  }

  const inputPath = path.resolve(options.input);
  const outputPath = path.resolve(options.output ?? path.join(path.dirname(inputPath), `${path.parse(inputPath).name}.png`));
  if (!(await isFile(inputPath))) {
    fail(`Input HTML file not found: ${inputPath}`);
    return;
  }
  if (path.extname(outputPath).toLowerCase() !== '.png') {
    fail(`Output path must end in .png: ${outputPath}`);
    return;
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  const executablePath = await findBrowser(options.executablePath);
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, executablePath, args: ['--allow-file-access-from-files'] });
    const page = await browser.newPage();
    await page.setViewport({ width: options.width, height: options.height, deviceScaleFactor: options.scaleFactor });
    const source = await fs.readFile(inputPath, 'utf8');
    const directoryUrl = pathToFileURL(`${path.dirname(inputPath)}${path.sep}`).href;
    const baseTag = `<base href="${directoryUrl}">`;
    const pageSource = /<head(?:\s[^>]*)?>/i.test(source)
      ? source.replace(/<head(?:\s[^>]*)?>/i, (head) => `${head}${baseTag}`)
      : `${baseTag}${source}`;
    await page.setContent(pageSource, { waitUntil: 'networkidle0', timeout: 30_000 });
    await page.addStyleTag({ content: themeCss(options.theme, options.transparent) });
    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready;
      const pendingImages = [...document.images]
        .filter((image) => !image.complete)
        .map((image) => new Promise((resolve) => {
          image.addEventListener('load', resolve, { once: true });
          image.addEventListener('error', resolve, { once: true });
        }));
      await Promise.all(pendingImages);
    });

    if (options.selector) {
      const element = await page.$(options.selector);
      if (!element) throw new Error(`Selector did not match an element: ${options.selector}`);
      await element.screenshot({ path: outputPath, omitBackground: options.transparent });
    } else {
      await page.screenshot({ path: outputPath, fullPage: true, omitBackground: options.transparent });
    }

    const dimensions = await page.evaluate(() => ({
      width: Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth ?? 0),
      height: Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight ?? 0),
    }));
    console.log(JSON.stringify({ input: inputPath, output: outputPath, ...dimensions }, null, 2));
  } finally {
    await browser?.close();
  }
}

main().catch((error) => fail(error.stack ?? error.message));
