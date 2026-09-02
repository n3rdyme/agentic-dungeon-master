---
name: business-create
description: Create a separate canonical business entity after its creation or purchase is conclusively established, including opening capital, operations, staff, expenses, and business debt. Use in Story mode outside combat; never create one from a proposal or negotiation.
---

# Create Business

Act only after ownership or creation is established. Announce `[business-create opening business]`, then read `../../references/businesses.md`, `data/status.json`, the current Daily, and the minimum relevant location and transaction canon.

Search `data/businesses/` by ID, name, aliases, and linked location before creating anything. If the business already exists, use `business-update`.

Create `data/businesses/<business-id>/Business.md`, `business.json`, `debts.json`, and `daily/`. Record exact established facts. A normal new business must have complete traffic, aggregate income and variable-expense tier profiles, a named Markdown roster, aggregate positions and wages, one ordinary operating-cost schedule, cadence, and thresholds. For an explicitly initialized legacy business, permit `setup_complete: false`, list every missing requirement in `setup_gaps`, and set `last_reconciled_day` to one day before `financial_start_day`.

Opening capital must have an established source. For a party owner contribution, deduct the exact amount from `data/status.json`, add it to business `current_cp`, and record the transfer in the current Daily in one transaction. Never represent business debt in party `debts`.

Move any conclusively assigned existing obligation from the party ledger into the appropriate business expense or `debts.json` record without changing its terms. Link the business from its canonical location and record material ownership or financing changes in the current Daily. Format every changed campaign Markdown file with `node .agents/tools/markdown-format.mjs`.
