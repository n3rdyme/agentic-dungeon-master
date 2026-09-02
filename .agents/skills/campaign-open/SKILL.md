---
name: campaign-open
description: Open an existing filesystem-backed tabletop campaign and select its operating role, inferring either choice from an unambiguous request. Use when explicitly invoked or when the user asks to open, resume, continue, inspect, or fight in a campaign; when no campaign role is active, also use for the exact bare messages Continue or Help.
---

# Continue Campaign

Operate from the repository root. Do not hardcode campaign names and do not load campaign canon before selection. Resolve the campaign and role independently from the user's full message. Do not ask the user to repeat a choice that is already unambiguous.

## Show entry help

When no campaign role is active and the user's entire trimmed message is `help` case-insensitively:

1. Discover available campaigns using the same directory rules below, but do not select one or read campaign canon or a role reference.
2. Show a compact guide containing these forms and meanings:
   - `open <campaign>` — select a campaign, then choose a role.
   - `continue <campaign>` — open directly in Story.
   - `<campaign> fight` — open directly in Battle.
   - `<campaign> info` — open directly in Campaign Information.
   - `start campaign` — create a new campaign.
3. List the discovered campaign names alphabetically. If none exist, say so and offer `campaign-start`.
4. Stop and wait for the user's command.

## Select a campaign

1. Discover non-hidden direct child directories of `campaigns/`. Each directory name is the player and campaign name; ignore files and names beginning with `.`.
2. Match campaign names case-insensitively against the user's full message. An exact directory name stated in the message is an explicit selection even when other routing words surround it. For example, `open Sample Player`, `Continue Sample Player`, and `Sample Player Fight` all select the `Sample Player` directory.
3. If exactly one campaign matches, select it without displaying the campaign list or asking for confirmation.
4. If the message does not identify exactly one campaign, sort the names alphabetically, display a numbered list even when there is only one candidate, and wait for a name or number. Reject a selection not in the list. Preserve any role already resolved from the earlier message.
5. If no campaigns exist, say so and offer `campaign-start`.
6. Treat the selected directory as active only in this chat. Never persist the selection in a shared file.

## Select a role

Infer role intent from ordinary, case-insensitive phrasing:

- **Continue the Story** when the message asks to continue, resume, or enter the story.
- **Let's Do Battle!** when it asks to fight, battle, or enter combat.
- **Campaign Information** when it asks to open campaign information or info.

If exactly one role is clear, select it without displaying the role menu or asking for confirmation. Thus `Continue Sample Player` opens that campaign directly in Story, while `Sample Player Fight` opens it directly in Battle.

If no role is clear, or conflicting role signals make the intent ambiguous, display exactly:

1. Continue the Story
2. Let's Do Battle!
3. Campaign Information

Wait for the user's selection. Preserve the selected campaign. Do not read any role reference before the role is chosen.

- For **Continue the Story**, read `references/continue-story.md` completely and follow it.
- For **Let's Do Battle!**, read `references/battle.md` completely and follow it.
- For **Campaign Information**, read `references/campaign-information.md` completely and follow it.

The chosen role stays active in this chat until the user explicitly changes roles or returns to Engine Editing.
