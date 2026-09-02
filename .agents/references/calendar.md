# Canonical campaign weekday

`data/status.json` stores the current campaign day number in `Day` and its weekday in `day_of_week`.

Use exactly this ordered cycle:

1. Sunday
2. Monday
3. Tuesday
4. Wednesday
5. Thursday
6. Friday
7. Saturday

Every new campaign starts on Sunday. Its initial status therefore includes:

```json
{
  "Day": 1000,
  "day_of_week": "Sunday"
}
```

Advance both fields atomically whenever campaign chronology crosses one or more day boundaries. For an elapsed whole-day count `n`, add `n` to `Day` and move `n mod 7` positions forward through the ordered cycle. Never derive a migrated campaign's weekday from its numeric Day alone.

For backward compatibility, `session-resume` assigns `Sunday` to the current numeric day when `day_of_week` is missing, without changing `Day`. Read-only workflows may treat a missing value as Sunday for display until that migration runs. A present value outside the seven exact names is a conflict; never silently replace it.
