# Junior Disciples Site Review Triage - 2026-06-03

Gate: PLAN

## Source Review
- `docs/site-reviews/2026-06-03-holistic-site-gameplay-review.md`

## Top Priorities

### 1. Update stale home quest availability copy
- Priority: P1
- Risk: LOW
- Why it matters: The home page currently says `Playable now: Courage Quest` even though the quest index exposes multiple playable quests. This understates available content and may reduce family/teacher engagement with the strongest gameplay lane.
- Likely files to inspect/edit: `app/page.tsx`; `lib/translations.ts` only if this copy is moved into translations.
- Acceptance criteria: Home quest promo copy accurately signals multiple playable Bible Quests without implying accounts, streaks, or competitive rewards; English/Russian behavior is not regressed.
- Suggested verification command: `npm run lint && npm run build`

### 2. Add quiz category metadata before adding lesson reviews
- Priority: P1
- Risk: LOW
- Why it matters: `/quiz` is now correctly labeled as `Story Quiz`, but the data model still assumes every quiz is tied to a story. A typed category is the cleanest next step before adding `Lesson Review` items.
- Likely files to inspect/edit: `data/quizzes.ts`, `data/quizzes-ru.ts`, `app/quiz/page.tsx`, `app/quiz/[id]/page.tsx`, `components/QuizGame.tsx`.
- Acceptance criteria: Existing six story quizzes still render and play; each quiz has a category/type label; `/quiz` can display story and future lesson review labels without relying only on `storyId`; no existing quiz IDs or routes break.
- Suggested verification command: `npm run lint && npm run build`

### 3. Add first lesson-review quiz for Can We Trust the Bible?
- Priority: P1
- Risk: LOW
- Why it matters: Lesson pages contain rich internal checks, but `/quiz` does not surface lesson review. The Bible trust lesson is a strong first low-risk candidate because it can focus on evidence categories, eyewitness meaning, manuscripts, honest questions, and humility.
- Likely files to inspect/edit: `app/lessons/case-for-christ-bible/page.tsx`, `data/quizzes.ts`, `data/quizzes-ru.ts`, `app/quiz/page.tsx`, `app/quiz/[id]/page.tsx`.
- Acceptance criteria: A `Lesson Review` entry appears on `/quiz`; it has five child-appropriate questions with short explanations; it does not oversell apologetics; RU content is either provided with parity or clearly not published until parity is ready.
- Suggested verification command: `npm run lint && npm run build`

### 4. Audit Holy Spirit lesson wording before quiz expansion
- Priority: P1
- Risk: MEDIUM
- Why it matters: The review flags older centralized wording such as “The Holy Spirit is a power,” while route-level content appears more careful. Public review content should consistently teach Him as a Person, not an impersonal force.
- Likely files to inspect/edit: `data/lessons.ts`, `data/lessons-ru.ts`, `app/lessons/holy-spirit/page.tsx`, `docs/lesson-quality-standard.md`.
- Acceptance criteria: EN/RU lesson index and route copy use orthodox, child-clear wording; no quiz or promotional summary calls the Holy Spirit an impersonal power; doctrinal review notes are captured before publication.
- Suggested verification command: `npm run lint && npm run build`

### 5. Prepare a public tracks/path hub MVP after content review
- Priority: P2
- Risk: MEDIUM
- Why it matters: The site is still activity-first. A lightweight `/tracks` or `/paths` hub would give parents, teachers, and children a clear “start here / next step” map while keeping existing routes intact.
- Likely files to inspect/edit: `docs/plans/2026-06-02-matthew-track-mvp.md`, `app/page.tsx`, `components/NavBar.tsx`, `lib/translations.ts`; likely new file `app/tracks/page.tsx` or `app/paths/page.tsx`.
- Acceptance criteria: A small path hub lists reviewed guided paths only; the Matthew MVP is labeled as a guided selection, not a full curriculum; parent/teacher note and EN/RU labels are handled; navigation remains simple.
- Suggested verification command: `npm run lint && npm run build`

### 6. Add consistent next-activity links to completed activities
- Priority: P2
- Risk: MEDIUM
- Why it matters: The site has many good activity lanes, but endings are inconsistent. One recommended next step per story, quiz, lesson, puzzle, memory item, and quest would reduce decision friction without adding manipulative engagement loops.
- Likely files to inspect/edit: `app/stories/[id]/page.tsx`, `app/quiz/[id]/page.tsx`, `app/lessons/*/page.tsx`, `app/memory/[id]/page.tsx`, `app/puzzles/[id]/page.tsx`, `app/rebus/[id]/page.tsx`, `app/quests/components/QuestAdventure.tsx`.
- Acceptance criteria: Each completed activity has one clear, age-appropriate next step; links point only to existing reviewed routes; copy avoids streaks, urgency pressure, or guilt language.
- Suggested verification command: `npm run lint && npm run build`

## Safe Auto-Implementation Candidates
- Update the home quest pill from `Playable now: Courage Quest` to copy that reflects multiple playable quests.
- Add non-breaking quiz category/type metadata with default `story`/`Story Quiz` values for existing quizzes.
- Add display support for quiz category labels while preserving all current story quiz behavior.
- Add one low-risk `Lesson Review` quiz for `case-for-christ-bible` if EN/RU parity is handled or the implementation keeps unpublished/missing translations from appearing.
- Add a docs-only checklist for route discoverability, EN/RU parity, Scripture reference review, image/cast consistency, accessibility, lint, and build checks.

## Human Review Needed
- Any Holy Spirit wording changes, especially language around Personhood, power, gifts, indwelling, and child-facing explanation.
- Any `case-for-christ-gods-son` quiz or track content involving Trinity, Son of God language, John 1, incarnation, or worship of Jesus.
- Resurrection lesson-review content that could imply evidence alone forces faith or that belief is merely intellectual assent.
- The public Matthew track route and parent note before publishing.
- Any visual redesign, route metadata strategy, or navigation change that affects brand direction, SEO posture, or public discoverability.
- Any Russian direct Scripture quotations or theology-heavy localized wording.

## Do Not Do Yet
- Do not build a full Matthew curriculum or verse-by-verse Matthew route before the four-session MVP is reviewed.
- Do not add accounts, child profiles, saved progress, public leaderboards, streaks, loot loops, chat, or daily-obligation mechanics.
- Do not mass-convert all lessons into quizzes before the quiz type model and first lesson-review pattern are proven.
- Do not centralize or refactor all inline lesson/page UI into shared components until the stable content patterns are clearer.
- Do not attempt route metadata changes without first reading the installed Next.js docs under `node_modules/next/dist/docs/`.
- Do not publish draft/generated media or content drafts without image/cast canon, accessibility, and content QA checks.
