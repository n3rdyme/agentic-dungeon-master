# Business Accounting

Each business is a separate financial entity stored at `data/businesses/<business-id>/`. Party currency and party debts do not include business cash, revenue, expenses, or debt. Transfers between the party and a business are explicit owner contributions or distributions recorded on both sides.

## Required files

- `Business.md` describes ownership, purpose, condition, reputation, operating cadence, low/average/peak traffic and earnings, external influences, and other material operating facts.
- `business.json` owns current capital, cumulative totals, earnings rules, aggregate staffing costs, aggregate ordinary operating expenses, discretionary expenses, and setup completeness.
- `debts.json` owns the business's capital loans and installment schedules.
- `daily/<day>.json` is an immutable reconciliation for one campaign day.

Store every amount as a nonnegative integer number of copper pieces in a field ending `_cp`. Use lowercase hyphenated stable IDs. Do not invent missing employees, wages, traffic, income, or costs. Put unknown required facts in `setup_gaps`, set `setup_complete` false, and do not reconcile the business until they are established.

## Earnings model

An open earning opportunity uses exactly one authoritative `1d20` roll through `dice-roll`. A natural 1 is always low and a natural 20 is always peak. Otherwise add the day's established modifiers and compare the adjusted result to the business's structural thresholds:

- adjusted result at or below `low_max` is low;
- adjusted result at or above `high_min` is peak;
- every result between them is average.

Thresholds represent durable quality, reputation, and location. Daily modifiers represent current external conditions. Define modifier categories in `Business.md`; normally apply at most one factor from each category. Examples include weekday cadence, festivals, weather, supply disruption, local events, or temporary reputation. Never apply a modifier merely because it seems plausible. A closed day has no earnings roll, but its expenses still reconcile.

Each tier in `business.json` supplies established traffic, total income, and total variable expense. `Business.md` describes the activities and ordinary costs represented by those totals. The same activity result selects both sides: a busy day normally earns more and consumes more resources. Do not make a second roll for expenses. Daily income is the selected tier total plus any separately established guaranteed income.

An established exceptional mismatch may add an explicit income or expense adjustment without changing the tier. Examples include donated refreshments, extraordinary cleaning, or a premium private booking with unusually low physical traffic. Never infer an adjustment merely to improve the result.

## Daily expense allocation

Fund the fixed `full_staff_daily_cost_cp` first, including approved vacant positions, then the selected tier's variable expense, aggregate ordinary operating expenses, capital-loan payments, and discretionary expenses. Current capital may never fall below zero. Required amounts that cannot be funded remain visible as unfunded expenses.

For a scheduled amount, calculate the day's accrual from the amount still needed for the next payment divided by the inclusive number of days from the reconciliation day through its due day. Round the fractional copper normally: less than half a copper down, half or more up. Recalculate from the remaining amount every day. On the due day, use the exact remaining amount as the true-up. Full-staff cost is instead one fixed daily expense, rounded normally from the sum of position quantity multiplied by 30-day salary and divided by 30.

Funding a daily accrual moves that amount out of current capital and into the record's `funded_for_next_payment_cp`; it does not charge the business again on the due date. When fully funded and due, consume the funded amount, advance the schedule, and reset the funded field. Record any overdue or unfunded amount without silently forgiving, rescheduling, or borrowing it.

Discretionary one-off expenses use `remaining_cp`, `start_day`, `due_day`, and `funded_for_payment_cp`. A sample 30gp expense beginning Day 10 and due Day 19 therefore accrues 3gp on Day 10.

## Daily record and totals

Reconcile days sequentially and idempotently. Refuse to overwrite an existing daily record or skip a day. Each `daily/<day>.json` records opening capital, the earnings roll and modifiers (or the reason no roll occurred), selected traffic tier, profile income and variable expense totals, aggregate staffing and ordinary operating costs, discrete debt and discretionary expenses, explicit adjustments, totals, and closing capital.

- `net_income_cp = total_income_cp - total_required_expenses_cp`
- `cash_flow_cp = total_income_cp - total_funded_expenses_cp`
- `closing_cp = opening_cp + cash_flow_cp`

Existing daily records are immutable. Correct an error with an identified adjustment on a later day. `business-remove` archives rather than deletes a business and its history.

## Canonical JSON shapes

`business.json` contains:

- `schema_version`, `id`, `name`, `status`, `created_day`, `financial_start_day`, `last_reconciled_day`;
- `setup_complete`, `setup_gaps`;
- `current_cp`, `lifetime_income_cp`, `lifetime_required_expenses_cp`, `lifetime_funded_expenses_cp`, `lifetime_net_income_cp`, `unfunded_expenses_cp`;
- `earnings.thresholds`, `earnings.cadence`, and low, average, and peak `earnings.profiles`, each containing `traffic`, `income_cp`, and `variable_expense_cp`;
- `staffing.positions`, containing only position, quantity, and salary per 30 days, plus `full_staff_daily_cost_cp`;
- one aggregate `operating_expenses` schedule and the `discretionary_expenses` array.

Schema version 3 requires `traffic`, `income_cp`, and `variable_expense_cp` in every completed earnings profile. Named employees and `[Vacant]` roster entries belong in `Business.md`, not JSON. Every approved position is included in `staffing` whether filled or vacant, so filling a vacancy does not change payroll; adding, removing, or repricing a position does. `full_staff_daily_cost_cp` must equal the normally rounded sum of position quantity multiplied by 30-day salary and divided by 30. `Business.md` also describes what the aggregate income, variable expense, and ordinary operating expense totals represent. Discretionary expenses and debts remain discrete because their purposes and schedules affect play.

`debts.json` contains `schema_version`, `business_id`, and `debts`. A debt records its creditor, purpose, original and remaining principal, installment, interval, next due day, remaining payments, established interest terms, funding for the next payment, condition, and status.
