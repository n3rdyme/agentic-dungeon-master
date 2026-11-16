---
name: html-render
description: Render a local HTML document or fragment to a PNG image with the repository's Puppeteer-based Node.js tool. Use for requests such as html-to-png, screenshot this local HTML, or make a PNG preview of an HTML artifact; do not use for remote webpages.
---

# HTML Render

Render one local HTML file from the repository root:

```text
node .agents/skills/html-render/scripts/html-to-png.mjs <input.html> [output.png] [options]
```

If the output is omitted, the tool writes a PNG beside the input using the same basename. It accepts complete documents and HTML fragments. The renderer supplies a neutral page shell and theme variables when a fragment expects host styling.

Useful options:

- `--width <pixels>` sets the viewport width; the default is 1024.
- `--height <pixels>` sets the initial viewport height; the default is 768.
- `--scale-factor <number>` sets device pixel density; the default is 1.
- `--selector <css>` captures one element instead of the full page.
- `--theme light|dark` selects injected fallback colors; the default is light.
- `--transparent` preserves a transparent page background.
- `--executable-path <path>` selects Chrome or Edge explicitly.

Use only local filesystem input. Preserve an explicit output path; otherwise use the deterministic default. On success, show the resulting PNG and report its path. If dependencies are absent, run `npm install --prefix .agents/skills/html-render` before retrying.
