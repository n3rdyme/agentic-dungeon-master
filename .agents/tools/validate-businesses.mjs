#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const integer = (value) => Number.isSafeInteger(value) && value >= 0;

export function validateBusinesses(campaignRoot) {
  const root = path.resolve(campaignRoot);
  const base = path.join(root, "data", "businesses");
  const errors = [];
  const warnings = [];
  let count = 0;
  if (!fs.existsSync(base)) return { errors, warnings, count };

  const inspect = (directory, archived = false) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      if (!archived && entry.name === "removed") {
        inspect(path.join(directory, entry.name), true);
        continue;
      }
      count += 1;
      const relative = path.relative(root, path.join(directory, entry.name)).replaceAll("\\", "/");
      const fail = (message) => errors.push(`${relative}: ${message}`);
      if (!slug.test(entry.name)) fail("directory name must be a lowercase hyphenated id");
      const required = ["Business.md", "business.json", "debts.json"];
      for (const name of required) if (!fs.existsSync(path.join(directory, entry.name, name))) fail(`missing ${name}`);
      const dailyDir = path.join(directory, entry.name, "daily");
      if (!fs.existsSync(dailyDir) || !fs.statSync(dailyDir).isDirectory()) fail("missing daily directory");
      let business, debts;
      try { business = JSON.parse(fs.readFileSync(path.join(directory, entry.name, "business.json"), "utf8")); } catch { continue; }
      try { debts = JSON.parse(fs.readFileSync(path.join(directory, entry.name, "debts.json"), "utf8")); } catch { continue; }
      if (business.id !== entry.name) fail("business.json id does not match directory");
      if (debts.business_id !== entry.name) fail("debts.json business_id does not match directory");
      if (business.schema_version !== 3 || debts.schema_version !== 1) fail("unsupported schema_version");
      if (archived ? business.status !== "removed" : business.status !== "active") fail(`status must be ${archived ? "removed" : "active"}`);
      for (const field of ["created_day", "financial_start_day", "last_reconciled_day", "current_cp", "lifetime_income_cp", "lifetime_required_expenses_cp", "lifetime_funded_expenses_cp", "unfunded_expenses_cp"])
        if (!integer(business[field])) fail(`${field} must be a nonnegative safe integer`);
      if (!Number.isSafeInteger(business.lifetime_net_income_cp)) fail("lifetime_net_income_cp must be a safe integer");
      if (typeof business.setup_complete !== "boolean" || !Array.isArray(business.setup_gaps)) fail("setup completeness fields are invalid");
      else if (business.setup_complete && business.setup_gaps.length) fail("complete business may not retain setup gaps");
      else if (!business.setup_complete && !business.setup_gaps.length) fail("incomplete business must identify setup gaps");
      const low = business.earnings?.thresholds?.low_max;
      const high = business.earnings?.thresholds?.high_min;
      if (!Number.isSafeInteger(low) || !Number.isSafeInteger(high) || low >= high) fail("earnings thresholds must be ordered integers");
      if (!Array.isArray(business.discretionary_expenses)) fail("discretionary_expenses must be an array");
      if ("employees" in business || "vacancies" in business) fail("schema version 3 stores named staff and vacancies only in Business.md");
      if (!Array.isArray(debts.debts)) fail("debts must be an array");
      if (business.setup_complete) {
        if (!business.earnings.cadence) fail("complete business requires earnings cadence");
        for (const tier of ["low", "average", "peak"]) {
          const profile = business.earnings?.profiles?.[tier];
          if (!profile) { fail(`complete business requires ${tier} earnings profile`); continue; }
          if (typeof profile.traffic !== "string" || !profile.traffic.trim()) fail(`${tier} profile requires traffic text`);
          if (!integer(profile.income_cp)) fail(`${tier}.income_cp must be a nonnegative safe integer`);
          if (!integer(profile.variable_expense_cp)) fail(`${tier}.variable_expense_cp must be a nonnegative safe integer`);
          if ("income" in profile || "variable_expenses" in profile) fail(`${tier} profile contains legacy itemized accounts`);
        }
        const staffing = business.staffing;
        if (!staffing || !Array.isArray(staffing.positions) || !staffing.positions.length) fail("complete business requires staffing.positions");
        else {
          let calculatedSalary = 0;
          for (const [index, position] of staffing.positions.entries()) {
            const at = `staffing.positions[${index}]`;
            if (typeof position.position !== "string" || !position.position.trim()) fail(`${at}.position must be nonempty text`);
            if (!Number.isSafeInteger(position.quantity) || position.quantity < 1) fail(`${at}.quantity must be a positive safe integer`);
            if (!Number.isSafeInteger(position.salary_30_days_each_cp) || position.salary_30_days_each_cp < 1) fail(`${at}.salary_30_days_each_cp must be a positive safe integer`);
            if (Number.isSafeInteger(position.quantity) && Number.isSafeInteger(position.salary_30_days_each_cp)) calculatedSalary += position.quantity * position.salary_30_days_each_cp;
          }
          if (!integer(staffing.full_staff_daily_cost_cp)) fail("staffing.full_staff_daily_cost_cp must be a nonnegative safe integer");
          if (staffing.full_staff_daily_cost_cp !== Math.round(calculatedSalary / 30)) fail("staffing.full_staff_daily_cost_cp does not equal rounded full-staff salary divided by 30");
        }
        const expense = business.operating_expenses;
        if (!expense || typeof expense !== "object" || Array.isArray(expense)) fail("complete business requires aggregate operating_expenses");
        else {
          for (const field of ["amount_cp", "interval_days", "start_day", "next_due_day", "funded_for_next_payment_cp"]) if (!integer(expense[field])) fail(`operating_expenses.${field} must be a nonnegative safe integer`);
          if (expense.amount_cp < 1 || expense.interval_days < 1) fail("operating_expenses amount and interval must be positive");
          if (expense.next_due_day < expense.start_day) fail("operating_expenses.next_due_day precedes start_day");
          if (expense.status !== "active") fail("operating_expenses.status must be active");
        }
      } else warnings.push(`${relative}: accounting setup incomplete`);

      const daily = fs.existsSync(dailyDir)
        ? fs.readdirSync(dailyDir)
          .filter((name) => name.endsWith(".json"))
          .map((name) => {
            const match = /^(\d+)(?:-(\d+))?\.json$/.exec(name);
            if (!match) { fail(`${name} must use <day>.json or <start>-<end>.json`); return null; }
            const start = Number.parseInt(match[1]);
            const end = match[2] ? Number.parseInt(match[2]) : start + 1;
            if (end <= start) fail(`${name} range end must be greater than its start`);
            if (match[2] && end - start < 2) fail(`${name} range ledger must span at least two skipped days`);
            return { name, start, end, ranged: Boolean(match[2]) };
          })
          .filter(Boolean)
          .sort((a, b) => a.start - b.start || a.end - b.end)
        : [];
      let expected = business.financial_start_day;
      for (const { name, start, end, ranged } of daily) {
        if (start !== expected) fail(`daily sequence expected Day ${expected}, found Day ${start}`);
        expected = end;
        let record;
        try { record = JSON.parse(fs.readFileSync(path.join(dailyDir, name), "utf8")); } catch { continue; }
        if (record.business_id !== entry.name || record.day !== start) fail(`${name} identity mismatch`);
        const dayCount = record.day_count ?? 1;
        if (!Number.isSafeInteger(dayCount) || dayCount < 1) fail(`${name} day_count must be a positive safe integer`);
        if (ranged && !("day_count" in record)) fail(`${name} range ledger requires day_count`);
        if (dayCount !== end - start) fail(`${name} day_count does not match filename coverage`);
        const totals = record.totals;
        if (totals) {
          if (totals.net_income_cp !== totals.total_income_cp - totals.total_required_expenses_cp) fail(`${name} net income mismatch`);
          if (totals.cash_flow_cp !== totals.total_income_cp - totals.total_funded_expenses_cp) fail(`${name} cash flow mismatch`);
          if (record.closing_cp !== record.opening_cp + totals.cash_flow_cp) fail(`${name} closing capital mismatch`);
          if (record.closing_cp < 0) fail(`${name} closing capital is negative`);
        }
      }
      if (business.last_reconciled_day !== expected - 1) fail("last_reconciled_day does not match daily sequence");
    }
  };
  inspect(base);
  return { errors, warnings, count };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const campaign = process.argv[2];
  if (!campaign) { console.error("Usage: node validate-businesses.mjs campaigns/<Player>"); process.exit(2); }
  const result = validateBusinesses(campaign);
  result.errors.forEach((message) => console.error(`ERROR: ${message}`));
  result.warnings.forEach((message) => console.warn(`WARNING: ${message}`));
  console.log(`Businesses: ${result.errors.length} error(s), ${result.warnings.length} warning(s); ${result.count} checked`);
  process.exit(result.errors.length ? 1 : 0);
}
