# Junior Disciples Site Review Triage - 2026-06-02

Gate: PLAN

## Source Review
- docs/site-reviews/2026-06-02-holistic-site-gameplay-review.md

## Top Priorities

### 1. Learning paths entry point
- Priority: P1
- Risk: LOW
- Why it matters: The home page and nav expose many activity lanes, but no clear starting line for children, parents, or teachers. A small paths layer can organize existing routes without rebuilding content.
- Likely files to inspect/edit: `app/page.tsx`, `components/NavBar.tsx`, `lib/translations.ts`; optionally `app/paths/page.tsx` or `app/tracks/page.tsx`.
- Acceptance criteria: Home page includes a clearly labeled learning-paths section or route that points to existing stories, quizzes, lessons, memory, puzzles, and quests; EN/RU labels are present if user-facing strings are translated; existing activity links still work.
- Suggested verification command: `npm run lint && npm run build`

### 2. Make lesson reviews discoverable from the quiz hub
- Priority: P1
- Risk: MEDIUM
- Why it matters: `/quiz` currently maps only story quizzes from `data/quizzes.ts`, while lesson checks are hidden inside lesson pages. Parents may assume lesson review does not exist.
- Likely files to inspect/edit: `app/quiz/page.tsx`, `data/quizzes.ts`, `data/quizzes-ru.ts`, `app/quiz/[id]/page.tsx`, `components/QuizGame.tsx`, lesson route files under `app/lessons/`.
- Acceptance criteria: Quiz hub distinguishes `Story Quiz` from `Lesson Review`; at least one lesson review can be opened and completed through the existing quiz flow; story quizzes remain unchanged; RU behavior is either implemented or intentionally labeled as pending.
- Suggested verification command: `npm run lint && npm run build`

### 3. Add repeatable biblical/content QA checklist
- Priority: P1
- Risk: LOW
- Why it matters: Doctrinally sensitive lessons need a stable gate for Scripture references, theological wording, child comprehension, RU/EN parity, route discoverability, and accessibility before publication.
- Likely files to inspect/edit: `docs/lesson-quality-standard.md`, `docs/plans/2026-06-01-autonomous-lesson-production-pipeline.md`, `docs/content-drafts/*/qa/`.
- Acceptance criteria: A checklist exists for new lessons/quizzes/tracks; it covers Scripture references, doctrine review, age fit, parent prompt, accessibility, translation parity, and build/type checks; future content tasks can link to it.
- Suggested verification command: `npm run lint && npm run build`

### 4. Add low-friction “next activity” links
- Priority: P2
- Risk: LOW
- Why it matters: Stories, lessons, memory, and puzzles can feel isolated. Next-step links turn scattered activities into guided discipleship flow without new mechanics.
- Likely files to inspect/edit: `app/stories/[id]/page.tsx`, `app/lessons/*/page.tsx`, `app/memory/[id]/page.tsx`, `app/puzzles/[id]/page.tsx`, related data files if links are data-driven.
- Acceptance criteria: Selected content pages end with one sensible next action, such as story → quiz, lesson → review, memory → puzzle, or Matthew-related content → Wise Builder Quest; links are accessible and do not create dead routes.
- Suggested verification command: `npm run lint && npm run build`

### 5. Draft Matthew track MVP before coding
- Priority: P2
- Risk: MEDIUM
- Why it matters: Matthew is broad and theologically important. Planning first prevents a sprawling route and keeps the content child-sized, Scripture-grounded, and parent-friendly.
- Likely files to inspect/edit: `docs/plans/`, `data/memory-verses.ts`, `data/word-puzzles.ts`, `app/quests/wise-builder/page.tsx`, existing Matthew-adjacent lesson pages.
- Acceptance criteria: A short MVP plan defines 3-4 Matthew sessions, each with passage, big truth, activity tie-in, memory/action step, and parent prompt; no new teaching page is coded until content review is clear.
- Suggested verification command: `npm run lint && npm run build`

### 6. Add route-level metadata incrementally
- Priority: P2
- Risk: LOW
- Why it matters: Discoverability can improve with stronger per-route titles/descriptions, but the current Next.js version should be checked before using metadata APIs.
- Likely files to inspect/edit: `node_modules/next/dist/docs/`, `app/layout.tsx`, individual route `page.tsx` files.
- Acceptance criteria: Metadata pattern follows the installed Next.js docs; high-value index pages have specific titles/descriptions; build passes without metadata warnings.
- Suggested verification command: `npm run lint && npm run build`

## Safe Auto-Implementation Candidates
- Add or update a docs-only content QA checklist for lessons/quizzes/tracks.
- Add a docs-only Matthew MVP plan with session outlines and guardrails.
- Add a small home-page learning-paths card section using existing routes and existing visual styles, if translations are handled carefully.
- Add simple “next activity” links on one low-risk route family, starting with story pages linking to their existing quizzes.
- Add clear labels on `/quiz` cards such as `Story Quiz` before introducing new lesson-review data.
- Add route metadata only after reading the installed Next.js docs in `node_modules/next/dist/docs/`.

## Human Review Needed
- Writing or approving lesson review questions for `The Holy Spirit`, `Who Is Jesus?`, `The Transfiguration`, and apologetics/Bible-trust topics.
- Any doctrinal wording about salvation invitations, the person and work of the Holy Spirit, resurrection evidence, prophecy, or spiritual gifts.
- Full Matthew study track content, especially sequence, Scripture interpretation, and application tone.
- Brand/content strategy decisions about whether to add `/paths`, `/tracks`, or keep paths as a home-page-only layer.
- Visual redesigns that change the prominence of Quests versus Lessons.
- Any persistence, rewards, badges, saved progress, accounts, leaderboard, or child-data features.

## Do Not Do Yet
- Do not build a large Matthew route before the MVP plan and content QA are reviewed.
- Do not merge lesson checks into the quiz ecosystem without deciding how lesson IDs, story IDs, RU parity, and labels should work.
- Do not add public rankings, streak pressure, chat, child profiles, or account systems.
- Do not copy sermon wording or adult apologetics material directly into child lessons.
- Do not redesign the full navigation hierarchy in one pass; start with labels and paths, then evaluate.
- Do not add broad persistence until privacy, reset behavior, and parent expectations are defined.
