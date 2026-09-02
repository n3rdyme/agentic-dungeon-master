---
name: business-remove
description: Terminate, sell, close, or otherwise remove a business after a conclusive disposition, preserving its complete accounting history and applying established proceeds, debts, and final obligations. Use in Story mode outside combat; never remove one from a proposal.
---

# Remove Business

Announce `[business-remove archiving business]`. Read `../../references/businesses.md`, the target's complete files, the current Daily, and the established disposition.

Reconcile through the last operating day when required. Apply only established sale proceeds, owner distributions, assumed or retained debts, severance, taxes, and closing costs. Never infer that a buyer assumed a debt. Current capital may not become negative, and unresolved obligations remain explicit.

Set status and closing metadata, then move the complete directory to `data/businesses/removed/<business-id>/`. Never delete or rewrite its daily history. Record the disposition in the current Daily and use `event-record` when it is notable. Format changed Markdown.
