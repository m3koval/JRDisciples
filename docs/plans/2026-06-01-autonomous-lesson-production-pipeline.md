# Autonomous Lesson Production Pipeline Implementation Plan

> **Status: DEPRECATED / historical plan only.** This plan describes the over-engineered Hermes automation lane that is now shut down. Do not implement or restart it as-is. Current Junior Disciples work should proceed in manual Apex-supervised batches with deterministic checks and small commits; use Codex-native workers only for bounded, reviewable coding tasks.

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Build a reliable staged Junior Disciples lesson-production workflow that auto-starts, creates better-than-current lesson drafts, QA reviews them, fixes issues, re-QAs, promotes approved lessons into the site, verifies the build/browser behavior, and publishes only when ready.

**Architecture:** Use a pipeline, not one oversized cron job. Each stage produces a small artifact with clear pass/fail gates: draft -> QA report -> revised draft -> promotion branch/route -> app QA -> publish. Cron can safely start the early stages; publishing requires stricter gates and may remain manual-confirm or protected auto-publish after the workflow proves reliable.

**Tech Stack:** Hermes cron jobs, pre-run Python context scripts, Markdown draft artifacts, Next.js lesson routes, TypeScript data files, npm lint/build, optional browser QA, git commits/branches.

---

## Operating Principles

1. Drafts first, routes later.
2. One run should have one concrete finish line.
3. No publishing unless all gates pass.
4. QA must produce a written report, not just a vague approval.
5. Fixes must respond to specific QA findings.
6. Scripture must be real quoted Bible text; ESV default unless intentionally changed.
7. Child-clear does not mean shallow. Hard ideas must be explained with simple definitions and examples.
8. Every lesson should improve the system: preserve recurring QA findings and update templates/checklists.
9. Use generated media only after the written lesson and route are strong.
10. Commit small, auditable stages.

---

## Proposed Pipeline

### Stage 1: Topic Selector / Context Builder

**Auto-start:** yes, cron-safe.

**Input:**
- `docs/case-for-christ-kids-curriculum.md`
- existing drafts under `docs/content-drafts/case-for-christ/`
- existing routes under `app/lessons/`
- optional lesson quality template/checklist

**Output:** compact JSON context from:
- `/home/helper/.hermes/scripts/jr_case_for_christ_next_topic.py`

**Gate:** selects exactly one next topic or returns null.

---

### Stage 2: Draft Builder

**Auto-start:** yes, already implemented for Case for Christ.

**Input:** selector JSON.

**Output:**
- `docs/content-drafts/case-for-christ/<slug>.md`

**Requirements:**
- YAML frontmatter.
- Big Question.
- Big Truth.
- Evidence Trail.
- Bible Anchor.
- Think It Through.
- Honest Question.
- Kid-Friendly Answer.
- Interactive Activity.
- Parent / Teacher Discussion.
- Short Prayer.
- Publishing Notes.

**Gate:**
- file exists
- non-empty
- no app/data/config files changed
- commit only the draft

---

### Stage 3: Content QA Agent

**Auto-start:** yes, after a new draft exists.

**Input:** one Markdown draft.

**Output:**
- `docs/content-drafts/case-for-christ/qa/<slug>.content-qa.md`

**Checklist:**
- Biblical accuracy.
- Real Scripture references and exact quote verification status.
- No invented Bible paraphrase presented as Scripture.
- Child-clear definitions for difficult words.
- Honest apologetics without overstated claims.
- Warm tone, not combative or fear-based.
- Stronger than current baseline lessons.
- Clear activity that reinforces the lesson.
- Parent/teacher section helps adults discuss the topic.

**Scoring:** 1-5 for each category:
- Biblical faithfulness.
- Child clarity.
- Apologetics strength.
- Engagement.
- Site readiness.

**Gate:** average score >= 4 and no blocker findings.

---

### Stage 4: Draft Fixer

**Auto-start:** yes, only if QA has fixable issues.

**Input:** draft + QA report.

**Output:** revised draft at the same draft path plus:
- `docs/content-drafts/case-for-christ/qa/<slug>.fix-notes.md`

**Rules:**
- Fix only findings from QA unless a small obvious issue is discovered.
- Preserve strong material.
- Do not add fake certainty or invented source claims.
- Keep Scripture quote verification markers if exact wording has not been verified.

**Gate:** changed draft committed with fix notes.

---

### Stage 5: Re-QA Loop

**Auto-start:** yes, with max loop count.

**Input:** revised draft.

**Output:** updated QA report:
- `docs/content-drafts/case-for-christ/qa/<slug>.content-qa-rN.md`

**Rules:**
- Max two fix/re-QA loops per lesson.
- If still blocked after two loops, mark for human review instead of spinning.

**Gate:** pass or human-review flag.

---

### Stage 6: Promotion Builder

**Auto-start:** initially manual-trigger or protected cron after confidence grows.

**Input:** approved draft.

**Output:**
- `app/lessons/<slug>/page.tsx`
- update `data/lessons.ts`
- optional update `data/lessons-ru.ts` later, not required in first pass
- optional prompt files under `public/images/jr/lessons/<slug>/prompts/`

**Rules:**
- Use a reusable lesson-page pattern instead of copying a huge one-off page every time.
- Keep interactions simple but meaningful.
- Add progressive sections, questions, activities, and completion state where appropriate.
- Do not publish Scripture until exact quotes are verified.

**Gate:** code compiles locally.

---

### Stage 7: App QA / Browser QA

**Auto-start:** yes after promotion branch exists.

**Input:** promoted route.

**Commands:**
- `npm run lint`
- `npm run build`
- optional local dev server/browser smoke test

**Browser checklist:**
- lesson route loads
- lesson listed on `/lessons`
- images load or graceful fallback exists
- interactive elements work
- completion/progress behavior works
- mobile-ish viewport still readable
- no obvious overflow/click-blocking overlay
- no broken links

**Output:**
- `docs/content-drafts/case-for-christ/qa/<slug>.app-qa.md`

**Gate:** lint/build pass and browser QA passes.

---

### Stage 8: Fix / Re-QA Loop for App

**Auto-start:** yes, max loop count.

**Input:** app QA report.

**Output:** route/data fixes and updated app QA report.

**Rules:**
- Fix only route/data/build issues.
- Do not rewrite the whole lesson unless content QA reopens.
- Max two app fix loops.

**Gate:** all app QA checks pass.

---

### Stage 9: Publish Gate

**Auto-start:** later, only after trust is established.

**Initial mode:** prepare a clean branch/commit and stop for Mike review.

**Future mode:** auto-publish only if:
- content QA passed
- app QA passed
- no Scripture verification markers remain
- git diff is limited to expected files
- build passes
- no secrets/config/auth touched
- commit message and summary are clean

**Output:**
- committed route/data files
- optional push/deploy after protected confirmation or proven policy

---

### Stage 10: Lesson Quality Retrospective

**Auto-start:** yes, after each completed lesson or batch of 3.

**Input:** QA reports, final lesson files, old baseline lessons.

**Output:**
- `docs/content-drafts/case-for-christ/qa/retrospectives/<date>-lesson-quality-retro.md`

**Purpose:** Make each run better than the last.

**Checklist:**
- What did this lesson do better than existing lessons?
- What repeated weaknesses appeared?
- What should be added to the next draft prompt/template?
- What should be added to the QA checklist?
- Which existing lessons should be upgraded using this new standard?

---

## Task 1: Create a Quality Standard Document

**Objective:** Define what “better than current lessons” means in a reusable checklist.

**Files:**
- Create: `docs/lesson-quality-standard.md`

**Content should include:**
- biblical accuracy requirements
- Scripture quotation policy
- child clarity standard
- apologetics evidence standard
- interaction standard
- parent/teacher standard
- visual/media standard
- QA scoring rubric
- publishing gate checklist

**Verify:**
- document exists
- checklist is specific enough for an unattended QA agent

**Commit:**
```bash
git add docs/lesson-quality-standard.md
git commit -m "docs: add lesson quality standard"
```

---

## Task 2: Create QA Directory Structure

**Objective:** Give every lesson a durable place for QA reports and retrospectives.

**Files:**
- Create directory: `docs/content-drafts/case-for-christ/qa/`
- Create directory: `docs/content-drafts/case-for-christ/qa/retrospectives/`
- Create placeholder: `docs/content-drafts/case-for-christ/qa/README.md`

**Verify:**
- directories exist
- README explains file naming

**Commit:**
```bash
git add docs/content-drafts/case-for-christ/qa/README.md
git commit -m "docs: add case for christ QA workspace"
```

---

## Task 3: Build the Content QA Cron Job

**Objective:** Add a scheduled or manually-triggerable job that reviews one unreviewed draft and writes a QA report.

**Implementation notes:**
- Use a pre-run script to select the first draft without a passing content QA report.
- Keep the job limited to reading one draft and writing one QA report.
- Toolsets: `file`, `terminal`.
- Workdir: `/home/helper/work/JRDisciples`.

**Files:**
- Create script: `/home/helper/.hermes/scripts/jr_case_for_christ_next_content_qa.py`
- Create cron job: `Junior Disciples Case for Christ content QA`

**Verify:**
- manual run produces one QA report
- report includes pass/fail, scores, blocker list, and fixes needed
- no app files modified

---

## Task 4: Build the Draft Fix Cron Job

**Objective:** Add a job that fixes a draft based on the latest failed QA report.

**Implementation notes:**
- Select one draft with failed QA and no newer fix attempt.
- Write fix notes.
- Commit only draft + fix notes.
- Max two loops per slug.

**Files:**
- Create script: `/home/helper/.hermes/scripts/jr_case_for_christ_next_draft_fix.py`
- Create cron job: `Junior Disciples Case for Christ draft fixer`

**Verify:**
- manual test on a known draft creates a targeted revision or reports no work
- no route/data files modified

---

## Task 5: Design Promotion Template

**Objective:** Avoid one-off giant page generation by creating a reusable lesson page pattern.

**Files to inspect first:**
- `app/lessons/who-is-jesus/page.tsx`
- `app/lessons/holy-spirit/page.tsx`
- `app/lessons/transfiguration/page.tsx`
- `data/lessons.ts`

**Possible target files:**
- Create: `lib/lessonContent.ts` or similar typed content model
- Create/modify: reusable lesson UI components
- Create: `app/lessons/<slug>/page.tsx` generated from content model

**Verify:**
- new route can be generated from structured content
- less duplicate code than current lesson pages
- still supports strong interactive sections

---

## Task 6: Build Promotion Worker

**Objective:** Convert an approved draft into a site route and lesson listing.

**Implementation notes:**
- Start manual-trigger only.
- Verify no `[VERIFY ESV QUOTE BEFORE PUBLISHING]` markers remain before promotion.
- If markers exist, stop and write a blocked report.
- Generate route and update English lesson index.
- Commit only route/data/prompt assets created for that lesson.

**Verify:**
- `npm run lint` passes
- `npm run build` passes
- git diff limited to expected files

---

## Task 7: Build App QA Worker

**Objective:** Validate a promoted lesson like a user would see it.

**Implementation notes:**
- Use terminal lint/build first.
- Use browser QA only when a route exists and app can run.
- Save report under QA directory.

**Verify:**
- app QA report includes route URL, test commands, pass/fail checklist, screenshots only if needed, and fix list

---

## Task 8: Build Publish Gate

**Objective:** Publish only ready lessons.

**Initial policy:** no auto-push. Stop with clean commit and report for Mike.

**Future policy:** allow auto-publish after several clean runs if Mike approves.

**Required gates:**
- content QA pass
- app QA pass
- no Scripture verification markers
- lint/build pass
- clean expected diff
- no credential/config changes

---

## Task 9: Current Lesson Audit

**Objective:** Review existing lessons against the new quality standard and create improvement backlog.

**Files:**
- Existing lesson routes under `app/lessons/`
- `data/lessons.ts`
- `data/lessons-ru.ts`

**Output:**
- `docs/lesson-audits/current-lessons-audit.md`

**Audit targets:**
- `holy-spirit`
- `transfiguration`
- `who-is-jesus`

**Score each lesson:**
- biblical faithfulness
- Scripture quote handling
- child clarity
- interaction quality
- visual polish
- mobile UX
- parent usefulness
- improvement priority

---

## Recommended Rollout

1. Keep the current draft-builder cron running.
2. Add the quality standard document.
3. Add QA report workspace.
4. Create and manually test content QA worker.
5. Create and manually test draft fixer worker.
6. Let the draft/QA/fix loop run on 2-3 lessons.
7. Only then build promotion worker.
8. Keep publishing manual-confirm until the system has several clean end-to-end passes.
9. Audit and upgrade current lessons using the same standard.

---

## Success Definition

The workflow is successful when a new lesson can move through this path with minimal live steering:

1. Cron selects next topic.
2. Cron writes draft.
3. QA reviews draft.
4. Fixer improves draft.
5. QA passes draft.
6. Promotion creates route.
7. App QA runs lint/build/browser checks.
8. Fixer repairs app issues.
9. App QA passes.
10. Publish gate prepares or publishes cleanly.
11. Retrospective updates standards for next lesson.

The result should be steady improvement, not just steady output.
