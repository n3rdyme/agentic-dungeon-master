# Campaign validation checklist

- Require every current scaffold root file and directory, except that checkpoint state may be either `resume.md` for a saved session or `resume.bak` without `resume.md` for an active session after a completed day boundary.
- Parse every JSON file and validate status, inventory, and party-state shapes.
- Validate every business directory, required file, ID, setup state, monetary integer, earnings threshold, tier traffic and totals, aggregate staffing positions and cost, aggregate ordinary expenses, discretionary expenses, debt ledger, immutable single-day or non-overlapping range sequence, `day_count`, and ledger arithmetic through `validate-businesses.mjs`.
- Accept a missing status `day_of_week` only for backward compatibility and warn that `session-resume` will initialize it to Sunday. When present, require one exact weekday name from Sunday through Saturday.
- Treat a missing status `debts` field as an empty array. When present, require a valid active-debt array, unique ids, valid currency, coherent one-time or recurring schedules, and report overdue obligations as warnings rather than structural errors.
- Run `node .agents/tools/validate-markdown-links.cjs <campaign-directory>`, follow `link-repair.md` for every reported destination, and rerun it after repairs. Treat every remaining source/destination pair as a structural error, display the JSON report, and prompt the user for resolution evidence rather than guessing.
- Run `node .agents/tools/markdown-format.mjs <campaign-directory>` once. Let that tool recursively process every `.md` file and enforce spacing deterministically; never inspect or rewrite spacing through LLM judgment.
- Require party.md to link each active member exactly once.
- Require one matching hub, detail directory, complete file set, party-state key, strict party-member template, and campaign-level Stats level per member.
- Reject unindexed active directories or party-state characters. Permit an inactive root hub only when it is a valid `Dead` memorial or `Retired` redirect with a matching `party/retired/<Name>/` archive; retired redirects must also link to the canonical NPC record.
- Require the world-building-only campaign-info.md sections in exact template order and reject transient party, relationship, plot, or current-state headings. When `resume.md` exists, require its sections in exact template order. Treat an absent `resume.md` with an existing `resume.bak` as a valid active-chat state with no warning; reject the campaign when both are absent.
- Require quests only under active or resolved. Reject `Story XP` fields in active quests and require exactly one numeric `Story XP:` completion award in every resolved quest. Reject legacy item storage.
- Require items and all four log subdirectories. Require every non-placeholder file anywhere under `log/` to begin with its numeric creation-Day prefix. Markdown records under Daily, Events, Combat, and Milestones use `<Day> - ` for ordinary records and `<start>-<end> - ` only for a compressed multi-day Daily. Reject `Day <number>`, `DAY<number>`, `D<number>`, and unprefixed names. Ignore `.gitkeep`.
- Compare party-state membership, HP, and spell-slot maxima with Stats where values can be parsed deterministically.
- Invoke party-member-validate for every active member after structure checks.
