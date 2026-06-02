# Autonomous QA Reports

Reports for the autonomous content factory.

Naming:
- `lessons/<slug>.content-qa.md`
- `lessons/<slug>.fix-notes.md`
- `lessons/<slug>.promotion-report.md`
- `lessons/<slug>.app-qa.md`
- `lessons/<slug>.app-fix-notes.md`
- `lessons/<slug>.publish-gate.md`

Same pattern for `stories/` and `quests/`.

Every QA-style report must include one line exactly like:

`Gate: PASS`

Allowed gates: `PASS`, `FAIL`, `BLOCKED`, `HUMAN REVIEW`.
