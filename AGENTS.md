# Campaign workspace instructions

## Workspace modes

This repository is a filesystem-backed tabletop campaign engine. Campaign
stores are the non-hidden direct child directories of `campaigns/`, with each
directory named for its player.

The default mode is **Engine Editing**. In this mode, behave as a normal Codex
workspace agent: inspect, discuss, test, and edit the campaign engine or any
explicitly named files. Do not select a campaign, load campaign canon, or assume
a gameplay role merely because campaign directories exist.

Campaign play begins only through one of these entry workflows:

- `campaign-start`: collect a player name and initialize
  `campaigns/<Player>` after applying the approved workspace scaffold.
- `campaign-open`: resolve an explicitly named existing campaign and requested
  role directly from the opening message; prompt only for a missing or
  ambiguous campaign or role.

When no campaign role is active, treat an exact bare `help` message as a request
for compact campaign-entry help. Show the available campaign names and the
supported open, continue, fight, info, and start command forms without selecting
a campaign or reading campaign canon.

Do not display a startup menu automatically during ordinary editing requests.
Do not implicitly invoke either entry workflow from a request to edit, inspect,
test, or discuss the engine.

## Skill creation and naming

When creating or renaming engine skills in Engine Editing mode:

- Use canonical `<noun>-<verb>` names: put the subject or domain first and the
  operation second, such as `quest-update`, `item-buy`, or `campaign-open`.
- Prefer a specific noun over a broad category and use one consistent verb for
  the same operation across the skill set.
- Treat slash commands and conversational phrases as triggers declared by the
  canonical skill, not as separate alias skills. For example, `/roll` may
  trigger `dice-roll` and `/fight` may trigger `combat-fight`.
- Classify the skill by role and filesystem permissions before implementing it.
  A new skill must not broaden the Combat role beyond its documented write and
  invocation boundaries.
- Update the skill directory, metadata, cross-skill references, role
  instructions, examples, and announcements together when applying a rename.
- Update `.agents/README.md` in the same change whenever a skill is created,
  renamed, replaced, or removed. Preserve its role grouping, linked
  `skill-name — purpose` format, and nested links to related skills, reference
  Markdown, and executable tools.
- Use `.agents/README.md` as the canonical skill catalog and maintenance guide.
- Keep skill instructions, references, metadata, and examples campaign-agnostic. Use obviously synthetic labels beginning with `Sample` for example people, places, organizations, businesses, events, debts, and similar fictional records. Never copy names, facts, dates, amounts, or outcomes from campaign stores into engine examples.

## Python runtime

- Invoke Python with the full executable path
  `%LOCALAPPDATA%\Python\bin\python.exe`. Do not rely on `python`, PATH lookup,
  or the Microsoft Store alias under `WindowsApps`.
- Run the skill validator from PowerShell with:

  ```powershell
  & "$env:LOCALAPPDATA\Python\bin\python.exe" "$env:USERPROFILE\.codex\skills\.system\skill-creator\scripts\quick_validate.py" ".agents\skills\<skill-name>"
  ```

## Campaign and role selection

- A campaign selection applies only to the current chat. Never write a shared
  current-campaign file; simultaneous chats may use different campaigns.
- Discover campaigns from non-hidden direct child directories of `campaigns/`.
  Use the child directory name as the player and campaign name. Do not hardcode
  any campaign name. When the opening message unambiguously names a discovered
  campaign, select it without asking the user to repeat the selection.
- Do not read campaign canon before the user selects that campaign, unless the
  user explicitly asks to inspect or edit those files in Engine Editing mode.
- After opening or creating a campaign, resolve an unambiguous role request
  already present in the user's message. Otherwise present these roles and wait
  for a selection:
  1. Continue the Story
  2. Let's Do Battle!
  3. Campaign Information
- Load only the selected role's detailed instructions. A role remains active in
  the current chat until the user changes it or returns to Engine Editing.

## Campaign storage safety

When a campaign is active or campaign files are explicitly being edited:

- Treat files in that campaign directory as canonical.
- Read only the files required by the selected role and current request.
- Search before creating an entity. Update overlapping names or subjects rather
  than creating duplicates.
- Never invent missing facts in factual answers. Report absence or conflict.
- Preserve player choices. Never speak, decide, move, or end a scene for the
  player character.
- Do not delete canon. Apply explicit retcons in place or preserve historical
  outcomes in chronology when the fiction changes.
- Use relative Markdown links inside campaigns and write UTF-8 text.
- Never introduce hard line breaks merely to word-wrap prose in any Markdown file. Store each prose paragraph as one physical line; use newlines only for genuine Markdown structure such as paragraph boundaries, headings, lists, block quotes, tables, and fenced code blocks.
- Name every non-placeholder file anywhere under `log/` with a numeric chronology prefix for the campaign Day on which it was created. Canonical Markdown records under Daily, Events, Combat, and Milestones use `<Day> - <Title>.md`; only a compressed multi-day Daily may use `<start>-<end> - <Location>.md`. Never use `Day <number> -`, `DAY<number>`, `D<number>`, or an unprefixed log filename. `.gitkeep` is exempt.
- After creating or updating a campaign Markdown file, run
  `node .agents/tools/markdown-format.mjs "<file-or-directory>"`. Use that deterministic
  tool—not LLM judgment—to insert GitHub-compatible paragraph spacing while
  preserving tables, fenced code blocks, and front matter.
- Keep edits narrow. Do not rewrite an entire exported campaign unless the user
  requests a migration.
- Mutate `party/`, `party.md`, and party-member state only through their owning
  story or administration skills. Direct creation, adoption, and living
  retirement always require explicit player consent. Record death only when permanent death is
  conclusively established; never infer it from an unresolved condition.
  Ordinary established character development may be persisted by
  `party-member-update` without a separate filesystem prompt.

## Player-facing play

- Address all roleplay and combat narration in second person. Refer to the
  player character as "you," while preserving named references for companions
  and other creatures when clarity requires them.
- During campaign play, action skills persist established changes silently and
  continue the fiction. Do not display file-operation summaries, structured
  records, internal handoffs, or other out-of-character diagnostics unless the
  active skill explicitly requires a player-facing prompt or transition.
- When a required skill-use announcement must be shown, format the entire
  announcement as `[<skill-name> <summary>]`. Keep the summary to at most three
  words and add no surrounding explanation. Example: `[npc-meet saving Sample NPC]`.
- For `item-buy` and `item-sell`, use the signed total transaction amount as
  the summary. A purchase is negative and a sale is positive. Format nonzero
  denominations as compact `gp`, `sp`, and `cp` suffixed tokens in that order;
  one leading sign applies to the whole amount. Examples:
  `[item-buy -12gp 4sp]` and `[item-sell +8gp 2cp]`.
