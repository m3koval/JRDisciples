# Internal Automation Risk Audit

Date: 2026-06-04

## Summary

The over-engineered risk was not one script; it was the whole hidden factory shape: many Hermes cron jobs, many script stages, prompt-level gates, generated QA artifacts, and repo docs that still looked like active authorization after Mike had decided the automation made things worse.

This cleanup keeps historical artifacts for traceability but removes the activation path.

## Current safe state

- Hermes cron jobs: `0`
- Hermes background processes: `0`
- Active JR automation scripts in `~/.hermes/scripts`: `0`
- JR automation scripts archived at:
  - `/home/helper/.hermes/scripts/quarantine_jr_automation_2026-06-04/`
- Repo docs that could be mistaken for active authorization are now marked deprecated:
  - `docs/autonomous-content-factory.md`
  - `docs/plans/2026-06-01-autonomous-lesson-production-pipeline.md`
- Skills/references updated to warn against restoring the old Hermes cron factory:
  - `children-bible-learning-workflows/references/junior-disciples-cron-lesson-builder.md`
  - `children-bible-learning-workflows/references/junior-disciples-bilingual-automation-gates.md`
  - `scheduled-agent-workflows/references/junior-disciples-autonomous-content-factory.md`

## What was over-engineered

### 1. Broad Hermes cron factory

The staged factory had too many independent moving parts: draft, QA, fix, visual brief, visual QA, promotion, app QA, app fix, and publish gates. The system looked disciplined on paper but created hidden state and review burden.

Risk:
- jobs could resume or be recreated from stale docs
- failures were hard to reason about
- output quality depended on many LLM summaries
- content drift compounded before human review

Correction:
- all cron jobs removed
- scripts quarantined
- docs marked deprecated
- future work stays manual unless Mike explicitly approves a narrow lane

### 2. Prompt-level gates pretending to be deterministic gates

`Gate: PASS` reports are useful notes but not reliable enough to publish children’s Bible content, Russian localization, Scripture wording, and visuals.

Risk:
- LLM can approve incomplete Russian pages
- LLM can miss visual/copy drift
- app can pass build while user-facing copy is wrong

Correction:
- keep deterministic checks local: `check:bilingual`, `check:scripture`, lint, build
- add/upgrade deterministic scanners before any recurring automation returns
- use human/Apex review for Russian copy and visual canon

### 3. Mixed bilingual architecture

The historical good pattern was shared routes plus separate RU data. Automation introduced more mixed inline branches and half-localized lesson pages.

Risk:
- Russian mode shows English microcopy
- detail pages can break when EN/RU IDs differ
- content review becomes harder because RU text is scattered inside TSX

Correction:
- batch cleanup should move toward stable IDs and clear EN/RU content objects or separate data files
- do not add new lesson pages without a bilingual content shape up front

### 4. Hidden scripts outside the repo

The active execution scripts lived under `~/.hermes/scripts`, outside Git review.

Risk:
- future sessions could accidentally reuse old scripts
- repo readers cannot see the real behavior
- stale paths can break silently

Correction:
- scripts quarantined outside the active scripts root
- repo docs now point out the factory is deprecated

### 5. Documentation that still sounded active

The repo contained docs saying autonomous publish was authorized.

Risk:
- future Apex/Codex/Hermes sessions could treat old authorization as current
- old plans could be implemented again after cleanup

Correction:
- deprecated warnings added to the top of the dangerous docs
- skill references updated with the new operating rule

## New operating rule

Junior Disciples production should use:

1. Mike sets direction.
2. Apex chooses the line and supervises.
3. One batch at a time.
4. Small commits.
5. Deterministic checks before push.
6. Follow-up audit after each batch.
7. No broad cron factory.
8. No hidden worker lane without explicit scope.

## Future automation allowed only if narrow

Acceptable examples:

- deterministic checker script that prints issues and exits nonzero
- scheduled status/watchdog with no content generation
- Codex-native one-file repair task with Apex review
- asset inventory script that reports missing files only

Not acceptable without fresh approval:

- unattended lesson generation
- unattended publish pipeline
- broad multi-stage cron factory
- LLM-only QA approval gates
- visual generation/promotion without human or Apex review
