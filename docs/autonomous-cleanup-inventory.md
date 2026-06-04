# Junior Disciples Automation Cleanup Inventory

Date: 2026-06-04

## Decision

Mike judged the broad Hermes cron automation for Junior Disciples as harmful overall: it created too much unattended surface area, produced inconsistent work, broke/consumed Codex usage lanes, and required manual recovery. The project is moving back to manual, focused, verified work.

## Automation purged

All 18 Hermes cron jobs for Junior Disciples were removed on 2026-06-04:

1. Case for Christ draft builder
2. Case for Christ content QA
3. Case for Christ draft fixer
4. Case for Christ promotion builder
5. Case for Christ app QA
6. Holistic site/gameplay review
7. Site review triage planner
8. Low-risk site improvement worker
9. Medium-high preview improvement worker
10. Autonomous content draft builder
11. Autonomous content QA
12. Autonomous content fixer
13. Autonomous promotion builder
14. Autonomous app QA
15. Autonomous app fixer
16. Autonomous publish gate
17. Autonomous visual brief builder
18. Autonomous visual asset QA

Verification after purge: Hermes cron list returned `count: 0`; no background processes were running.

## Inert helper scripts still present

The cron jobs are gone, but helper scripts remain under `~/.hermes/scripts/` as historical references only. They should not run unless manually invoked or wired into a new job:

- `jr_case_for_christ_next_topic.py`
- `jr_case_for_christ_next_content_qa.py`
- `jr_case_for_christ_next_draft_fix.py`
- `jr_case_for_christ_next_promotion.py`
- `jr_case_for_christ_next_app_qa.py`
- `jr_case_for_christ_next_app_fix.py`
- `jr_case_for_christ_next_publish_gate.py`
- `jr_autonomous_content_next.py`
- `jr_autonomous_content_draft.py`
- `jr_autonomous_content_content_qa.py`
- `jr_autonomous_content_content_fix.py`
- `jr_autonomous_content_visual_brief.py`
- `jr_autonomous_content_visual_qa.py`
- `jr_autonomous_content_promotion.py`
- `jr_autonomous_content_app_qa.py`
- `jr_autonomous_content_app_fix.py`
- `jr_autonomous_content_publish.py`
- `jr_autonomous_content_publish_gate.py`

## Useful artifacts produced by the automation

Keep these for now because they may be useful, even if they need human review:

- `app/lessons/case-for-christ-cross/page.tsx`
- `public/images/jr/lessons/case-for-christ-cross/`
- `public/images/jr/topic-case-for-christ-cross.png`
- `public/images/jr/lessons/case-for-christ-resurrection/`
- `public/images/jr/topic-case-for-christ-resurrection.png`
- `docs/content-drafts/autonomous-qa/lessons/case-for-christ-cross.*.md`
- `docs/content-drafts/autonomous-qa/lessons/case-for-christ-resurrection.*.md`
- `docs/content-drafts/autonomous-qa/stories/daniel-lions-den.content-qa.md`
- `scripts/check-bilingual-content-parity.mjs`
- `scripts/check-lesson-scripture-localization.mjs`

## Lessons learned

1. Broad unattended cron pipelines were too much throttle too early.
2. Cron agents lacked live steering and made mistakes that looked polished enough to slip through.
3. The workflow consumed or destabilized Codex/provider usage and created recovery work.
4. Deterministic checks are valuable; broad autonomous content production is not trusted right now.
5. Future automation should start smaller: one task, one artifact, one verification gate, one human review point.
6. If co-agents are needed, prefer setting them up directly through Codex/Codex-native workflows when possible, with Hermes used for status, summaries, and independent verification.

## Current operating mode

Manual lane only unless Mike explicitly re-enables automation.

Recommended next line:

1. Review visible site issues on mobile.
2. Fix one issue at a time.
3. Run `npm run check:bilingual`, `npm run check:scripture`, `npm run lint`, and `npm run build` before pushing.
4. Keep commits small and reversible.
