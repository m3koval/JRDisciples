# Case for Christ Draft QA Workspace

This directory stores QA, fix, promotion, app QA, publish-gate, and retrospective artifacts for the Case for Christ Kids lesson pipeline.

## File Naming

For lesson slug `<slug>`:

- `<slug>.content-qa.md` — first content QA report
- `<slug>.content-qa-r1.md` — re-QA after first fix
- `<slug>.content-qa-r2.md` — re-QA after second fix
- `<slug>.fix-notes-r1.md` — first draft-fix notes
- `<slug>.fix-notes-r2.md` — second draft-fix notes
- `<slug>.promotion-blocked.md` — why route promotion is blocked
- `<slug>.promotion-report.md` — promotion summary once route/data files are created
- `<slug>.app-qa.md` — app/lint/build/browser QA report
- `<slug>.app-fix-notes-r1.md` — first route/app fix notes
- `<slug>.publish-gate.md` — final publish-readiness report

Retrospectives live under:

- `retrospectives/YYYY-MM-DD-<slug>-retro.md`

## Required Gate Language

Reports should use one of these exact gate lines:

- `Gate: PASS`
- `Gate: FAIL`
- `Gate: BLOCKED`
- `Gate: HUMAN REVIEW`

Selector scripts use these gate lines to decide what stage should run next.

## Safety Rules

- Draft QA and draft fixes should not edit app routes or data files.
- Promotion should not proceed while `[VERIFY ESV QUOTE BEFORE PUBLISHING]` markers remain.
- App QA should not rewrite content unless content QA is reopened.
- Publish gate should not push/deploy unless Mike explicitly enables auto-publish.
- Each stage should commit only its expected files.
