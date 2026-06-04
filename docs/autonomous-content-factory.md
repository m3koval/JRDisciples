# Junior Disciples Autonomous Content Factory

Goal: let Apex create, review, correct, promote, verify, and publish Junior Disciples lessons, Bible stories, and quests without waiting for live steering, while still preserving clean gates so Mike can correct afterward if needed.

## Authority

Mike has authorized autonomous publish for this pipeline. The publish gate may push to `origin/main` when all deterministic gates pass. No force push. No publish if Scripture verification markers remain. No publish if lint/build fail. No publish if dirty files fall outside the selected item scope.

## Content lanes

1. Lessons
   - Drafts: `docs/content-drafts/lessons/<slug>.md`
   - QA: `docs/content-drafts/autonomous-qa/lessons/<slug>.*.md`
   - Published route: `app/lessons/<slug>/page.tsx`
   - Index: `data/lessons.ts`

2. Bible stories
   - Drafts: `docs/content-drafts/stories/<slug>.md`
   - QA: `docs/content-drafts/autonomous-qa/stories/<slug>.*.md`
   - Published data: `data/stories.ts`
   - Existing dynamic route: `app/stories/[id]/page.tsx`

3. Quests
   - Drafts: `docs/content-drafts/quests/<slug>.md`
   - QA: `docs/content-drafts/autonomous-qa/quests/<slug>.*.md`
   - Published route: `app/quests/<slug>/page.tsx`
   - Quest hub: `app/quests/page.tsx`
   - Existing reusable component: `app/quests/components/QuestAdventure.tsx`

## Pipeline stages

1. Draft builder
   - Selector: `/home/helper/.hermes/scripts/jr_autonomous_content_next.py draft`
   - Writes exactly one draft.
   - Commits only the draft and any prompt notes created for that draft.

2. Content QA
   - Selector: `/home/helper/.hermes/scripts/jr_autonomous_content_next.py content_qa`
   - Writes a report with `Gate: PASS`, `Gate: FAIL`, `Gate: BLOCKED`, or `Gate: HUMAN REVIEW`.
   - Must check biblical faithfulness, Scripture handling, child clarity, engagement, and readiness.

3. Content fixer
   - Selector: `/home/helper/.hermes/scripts/jr_autonomous_content_next.py content_fix`
   - Fixes only findings from the QA report.
   - Writes fix notes.
   - Max two fix loops.

4. Visual brief builder
   - Selector: `/home/helper/.hermes/scripts/jr_autonomous_content_next.py visual_brief`
   - Runs after content QA PASS.
   - Uses bounded sub-agent review when helpful: one Bible/history visual researcher and one prompt/storyboard reviewer.
   - Writes a visual learning pack brief with `Gate: PASS`, including hero, Bible truth, artifact/history, challenge/activity, thumbnail, and optional video ideas.
   - Historical visuals must be either verified open-license/public-domain assets or clearly labeled original reconstructions.

5. Visual asset + QA worker
   - Selector: `/home/helper/.hermes/scripts/jr_autonomous_content_next.py visual_qa`
   - Creates/records prompt files and generated assets when needed.
   - Reviews assets for child safety, doctrinal clarity, historical honesty, character consistency, no logos/watermarks, no fake readable Bible text, and no distracting AI artifacts.
   - Writes `Gate: PASS` only when the visual pack is ready or a deliberate visual waiver is documented.

6. Promotion builder
   - Selector: `/home/helper/.hermes/scripts/jr_autonomous_content_next.py promotion`
   - Converts a passed draft into app/data files.
   - For stories, update data only; the route already exists.
   - For quests, use `QuestAdventure` and model after existing quest pages.
   - Wires passed visuals into the page instead of silently reusing weak defaults.
   - Writes a promotion report.

7. App QA
   - Selector: `/home/helper/.hermes/scripts/jr_autonomous_content_next.py app_qa`
   - Runs `npm run lint` and `npm run build`.
   - Checks route/listing/data behavior appropriate to lane.
   - Writes `Gate: PASS` only when the item is ready for publish.

8. App fixer
   - Selector: `/home/helper/.hermes/scripts/jr_autonomous_content_next.py app_fix`
   - Fixes only app QA/build/listing issues.
   - Writes app fix notes.
   - Max two fix loops.

9. Publish gate
   - Script: `/home/helper/.hermes/scripts/jr_autonomous_content_publish_gate.py`
   - Deterministic no-agent gate.
   - Requires PASS content QA, PASS visual QA, and PASS app QA.
   - Requires no verification markers.
   - Requires lint/build pass immediately before push.
   - Allows only selected item files.
   - Commits and pushes to `origin/main` without force.

## Current queue

Lessons:
- `case-for-christ-resurrection` — Did Jesus Really Rise from the Dead?
- `case-for-christ-gods-son` — Is Jesus Really God’s Son?
- `case-for-christ-cross` — Why Did Jesus Have to Die?

Bible stories:
- `daniel-lions-den` — Daniel in the Lions’ Den
- `ruth-and-naomi` — Ruth and Naomi
- `good-samaritan` — The Good Samaritan

Quests:
- `mercy-road` — Good Samaritan mercy quest
- `lion-den-courage` — Daniel 6 courage quest

Queue source of truth is currently embedded in `/home/helper/.hermes/scripts/jr_autonomous_content_next.py` so cron selectors can run without extra parsing fragility.

## Quality rules

Use `docs/lesson-quality-standard.md` as the baseline for all lanes. Additional rules:

- Do not invent Bible verses or present paraphrase as a quote.
- Use normal ESV quotes for English Junior Disciples Scripture. Do not swap to WEB/public-domain wording as a shortcut.
- If exact ESV quote wording is uncertain, use a verification marker and block publish.
- Build Russian parity for bilingual surfaces: lesson cards and user-facing lesson content should be present in Russian unless Mike explicitly approves an exception.
- Child-clear means simple, not shallow.
- Keep warm Christian conviction without scare tactics, hype, or combative apologetics.
- Quests must teach through choices, consequences, truth reminders, and a parent/teacher talk section.
- Stories must stay faithful to the biblical narrative and avoid adding speculative details as fact.
- Lessons must define hard terms and give honest answers to likely kid questions.

## Failure behavior

- If a stage has no work, it should report idle.
- If Codex/provider output becomes incomplete repeatedly, pause that stage and narrow the prompt.
- If a worker finds dirty files unrelated to its selected item, it should stop and report blocked.
- If a draft cannot pass after two fix loops, mark `Gate: HUMAN REVIEW`.
- Publish gate is deterministic and should stay no-agent to avoid spending model tokens on a simple final gate.
