# Junior Disciples Holistic Site/GamePlay Review - 2026-06-03

Gate: REVIEW

## Executive Summary
- The site has improved since the prior review: the home page now includes a compact learning-paths section, `/quiz` cards are labeled as `Story Quiz`, and a docs-only Matthew Track MVP plan exists.
- The public structure is strong but still activity-first: stories, quizzes, memory, puzzles, rebus, quests, and lessons are all reachable, yet the site does not yet expose a true `/tracks` or `/paths` route.
- The lesson ecosystem has expanded: published lesson cards now include Case for Christ lessons on trusting the Bible, resurrection, and Jesus as God’s Son, plus Holy Spirit, Transfiguration, and Who Is Jesus.
- The biggest discoverability gap remains lesson review: rich internal detective checks exist inside lesson pages, but `/quiz` still only surfaces six story quizzes.
- Bible Quests remain the healthiest gameplay lane: choices, truth lights, progress, Scripture feedback, badges, parent/teacher talk, prayer, replay, and next-quest routing are already working as a coherent discipleship mechanic.
- A Matthew Track should move from docs plan to a small public guided path only after content review; the current four-session MVP is sound and should reuse existing Transfiguration, Wise Builder, Lord’s Prayer, and Who Is Jesus assets.
- Guardrails are needed around bilingual parity, doctrinal wording, direct Scripture localization, media consistency, reduced-motion/accessibility, and avoiding manipulative reward loops.

## Highest-Leverage Improvements
1. Add a public guided-path hub, likely `/tracks` or `/paths`, that keeps existing activity pages intact but gives parents, teachers, and children a clear “start here / next step” map.
2. Add lesson review quiz entries to the quiz ecosystem with a distinct `Lesson Review` type, beginning with the three Case for Christ lessons and Transfiguration.
3. Turn the Matthew MVP plan into one reviewed, lightweight public path card sequence rather than a large new curriculum route.
4. Add parent/teacher metadata to index cards: age range, estimated time, Scripture anchor, big truth, and suggested next activity.
5. Convert content-quality gates into repeatable checks: Scripture references, EN/RU parity, route discoverability, accessibility, image/cast canon, and build/type validation.

## Site Structure Findings
- Current public route shape remains broad and useful: `/`, `/stories`, `/stories/[id]`, `/quiz`, `/quiz/[id]`, `/memory`, `/memory/[id]`, `/puzzles`, `/puzzles/[id]`, `/rebus`, `/rebus/[id]`, `/lessons`, individual lesson routes, `/quests`, individual quest routes, and `/quest` redirecting to `/quests`.
- `components/NavBar.tsx` exposes Home, Stories, Quizzes, Memory, Puzzles, Rebus, Quests, and Lessons. This is complete, but the navigation is still an activity shelf rather than a discipleship path.
- `app/page.tsx` now includes a learning-paths card section for kids, families, and teachers. That is a good pit stop improvement: it reduces decision friction without rebuilding the site.
- The learning-paths home section currently links to existing broad routes, not to dedicated path pages. It helps orientation, but a returning parent or teacher still cannot see a full sequence, completion expectations, or lesson-to-activity chain.
- `/lessons` now draws from `data/lessons.ts`, and the visible lesson set has grown to six topics: Is Jesus Really God’s Son?, Did Jesus Really Rise from the Dead?, Can We Trust the Bible?, The Holy Spirit, The Transfiguration, and Who Is Jesus?
- Lesson labels use sections/activity flavor well, especially the Case for Christ “evidence trail / witness trail / identity trail” pattern. This is child-friendly and gives a coherent lane for apologetics content.
- `/quiz` now clearly labels cards as `Story Quiz`, which prevents overclaiming. But this also makes the gap clearer: there is not yet a first-class place for lesson reviews, quest reviews, memory reviews, or track checkpoints.
- `/quests` is visually strong and content-rich, but the home-page featured quest pill still says “Playable now: Courage Quest” even though the quest index lists multiple playable quests. That copy can understate the available content.
- Back links are present on major pages, but “next activity” links are still inconsistent. The strongest structure would make every story, lesson, puzzle, quiz, and quest end with one recommended next step.

## Gameplay / Interaction Findings
- `app/quests/components/QuestAdventure.tsx` is the strongest interaction system: it provides scene progression, choice prompts, randomized choice order, wrong-answer repair, truth lights, progress, Scripture feedback, completion badge, parent/teacher questions, prayer, replay, and next-quest routing.
- The quest loop is wholesome because rewards are attached to truth, obedience, memory, and family discussion rather than streaks, rankings, scarcity, or public comparison.
- Wrong choices do not permanently punish a child; they invite another try. That is wise for a discipleship product because correction should be formative, not shaming.
- The quests now include Courage Quest, Forgiveness Bridge, Forest of Lies, Storm Rescue, and Wise Builder. Together they cover fear, forgiveness, truth/lies, trusting Jesus in storms, and hearing/obeying Jesus.
- Quest mechanics can become deeper without becoming manipulative: add occasional “good but incomplete” choices, repair actions after wrong choices, “say the truth in your own words” checkpoints, and optional parent/teacher reflection before the badge.
- The fixed full-screen quest mode is immersive but should continue to be tested on mobile, keyboard navigation, focus movement, and reduced-motion preferences. The component already includes reduced-motion CSS, which is a good start.
- Lesson pages increasingly use detective checks, card reveals, witness webs, and progress counts. These are better than trivia-only mechanics because they connect reasoning, Scripture, and application.
- Rebus, memory, and word puzzles should not stay isolated. They should become reusable reinforcement steps inside paths: e.g., Matthew 6 prayer puzzle after a Lord’s Prayer session, Wise Builder Quest after Matthew 7, Transfiguration memory after Matthew 17.
- Avoid adding accounts, public leaderboards, streak pressure, loot mechanics, or “daily obligation” language. Junior Disciples should encourage faithful practice, not anxiety-driven engagement.

## Lesson + Quiz Opportunities
- Current story quizzes appear complete for current story data: Creation, Noah, Joseph, David and Goliath, Jonah, and Birth of Jesus each have a matching five-question quiz in `data/quizzes.ts`.
- Published lessons needing discoverable companion review entries: Can We Trust the Bible?, Did Jesus Really Rise from the Dead?, Is Jesus Really God’s Son?, The Holy Spirit, The Transfiguration, and Who Is Jesus?.
- The three Case for Christ lessons already include internal checks and are the best first candidates for `/quiz` expansion because they follow consistent patterns: clue cards, witness/identity cards, hard words, and detective checks.
- Best quiz format for kids: 3 recall/comprehension questions, 1 Scripture/truth connection, 1 application/reflection question, each with a short explanation and a parent/teacher discussion prompt.
- Add a typed quiz category, not just more data: `Story Quiz`, `Lesson Review`, `Memory Review`, and eventually `Track Checkpoint`. This would let `/quiz` filter without confusing kids.
- Can We Trust the Bible? review should test evidence categories, eyewitness meaning, manuscripts, honest questions, and humility. Avoid overselling apologetics; keep confidence tied to God’s truthfulness and real reasons.
- Resurrection review should test death/burial/resurrection/appearances, Thomas, witness language, and the right response: worship, trust, repentance, and witness. Avoid implying that evidence alone forces faith.
- Jesus God’s Son review should test Son of God wording, John 1, Peter’s confession, the Word becoming flesh, and child-safe Trinity clarity. This needs doctrinal QA before publication.
- Holy Spirit review should be revised carefully before becoming a public quiz. Some older centralized copy in `data/lessons.ts` uses phrasing like “The Holy Spirit is a power,” while route-level content appears more careful. The review should consistently teach Him as a Person, not an impersonal force.
- Transfiguration review should connect Matthew 17: Jesus’ glory, Moses and Elijah, the Father’s voice, “Listen to Him,” the disciples’ fear, and Jesus’ comforting touch.
- Who Is Jesus? review should be shorter than the full lesson and useful for repeat play: claims, prophecy, miracles, resurrection, John 14:6, and trusting Jesus rather than merely winning arguments.

## Matthew Study Track Recommendation
- The existing `docs/plans/2026-06-02-matthew-track-mvp.md` is a good MVP foundation: four sessions, clear guardrails, and reuse of existing content before building new mechanics.
- Recommended public shape: create `/tracks` or `/paths` as a small hub, then a reviewed `/tracks/matthew` page only when the content is ready. Do not bury Matthew as one more item inside `/lessons` if the goal is a guided study sequence.
- Start with the current four-session MVP: Jesus the Promised King, Jesus Teaches Us to Pray, Listen to Jesus, and Build on the Rock.
- Each session should include: passage, big truth, one short child-facing explanation, one activity link, one memory/action step, and one parent/teacher prompt.
- Existing site tie-ins are strong: `Who Is Jesus?` for Matthew 1 and identity, Lord’s Prayer word puzzle for Matthew 6, Transfiguration lesson for Matthew 17, and Wise Builder Quest for Matthew 7.
- Add a parent note explaining that the Matthew path is a guided selection from Matthew, not a complete verse-by-verse curriculum or replacement for church/family discipleship.
- Keep all content original and adapted for children. Public sermon resources may inspire sequence and themes, but wording, activities, and explanations should be newly written and reviewed.
- Future expansion after the MVP: Beatitudes/kingdom hearts, treasure and worry, compassion and miracles, parables, Peter’s confession, cross and resurrection, and Great Commission.

## Risks / Guardrails
- Data drift risk: lessons are split between centralized data files and rich route-level components. Indexes, translations, reviews, and QA can drift if new lessons are not registered consistently.
- Bilingual parity risk: route-level lessons have English/Russian handling in some places, while new assets and docs may outpace RU content. Use the existing parity scripts and add route-level parity checks before publishing major lessons.
- Scripture localization risk: direct quotations and reference names need careful EN/RU handling. Do not treat paraphrase, quotation, and translation labels as interchangeable.
- Doctrinal risk: Holy Spirit, Trinity, resurrection, salvation invitation, apologetics claims, and future Matthew teaching all need review before being promoted into quiz/path content.
- UX risk: large media, autoplay hero video, image-heavy lesson pages, fixed quest gameplay, and animations can affect mobile performance and accessibility.
- SEO/discoverability risk: public routes need stronger per-route metadata for lessons, quizzes, quests, and future tracks. The prior route metadata attempt was blocked, so this needs a careful Next.js-version-aware implementation.
- Maintenance risk: as more pages use inline styles and embedded data, shared UI and content standards become harder to enforce. Consider shared card/checkpoint components after patterns stabilize.
- Child safety guardrail: keep the product account-free and parent-first unless a full privacy and safety plan exists. No public rankings, chat, child profile collection, or manipulative streak loops.
- Content gate risk: visual drafts and content drafts exist alongside published pages. Add clear promotion rules so drafts, generated media, and route registrations do not get out of sync.

## Suggested Next Tasks
- Add a public tracks/path hub MVP. Likely files to inspect/edit: `app/page.tsx`, `components/NavBar.tsx`, `lib/translations.ts`; likely new files: `app/tracks/page.tsx` or `app/paths/page.tsx`.
- Add quiz type metadata and filters. Likely files: `data/quizzes.ts`, `data/quizzes-ru.ts`, `app/quiz/page.tsx`, `app/quiz/[id]/page.tsx`, `components/QuizGame.tsx`.
- Create `Lesson Review` quiz data for `case-for-christ-bible`. Likely files: `data/quizzes.ts`, `data/quizzes-ru.ts`, `app/quiz/page.tsx`, `app/lessons/case-for-christ-bible/page.tsx` for source review.
- Create `Lesson Review` quiz data for `case-for-christ-resurrection`. Likely files: `data/quizzes.ts`, `app/lessons/case-for-christ-resurrection/page.tsx`, relevant QA docs under `docs/content-drafts/autonomous-qa/`.
- Create `Lesson Review` quiz data for `case-for-christ-gods-son` with doctrinal QA. Likely files: `data/quizzes.ts`, `app/lessons/case-for-christ-gods-son/page.tsx`, `docs/lesson-quality-standard.md`.
- Audit Holy Spirit wording before quiz expansion. Likely files: `data/lessons.ts`, `data/lessons-ru.ts`, `app/lessons/holy-spirit/page.tsx`, `docs/lesson-quality-standard.md`.
- Update home quest copy to reflect multiple playable quests. Likely files: `app/page.tsx`, `lib/translations.ts` if translated copy is centralized.
- Add consistent “next activity” links. Likely files: `app/stories/[id]/page.tsx`, `app/quiz/[id]/page.tsx`, `app/lessons/*/page.tsx`, `app/memory/[id]/page.tsx`, `app/puzzles/[id]/page.tsx`, `app/rebus/[id]/page.tsx`, `app/quests/components/QuestAdventure.tsx`.
- Implement Matthew public track after review. Likely files: `docs/plans/2026-06-02-matthew-track-mvp.md`, new `app/tracks/matthew/page.tsx`, `lib/translations.ts`, `data/word-puzzles.ts`, `data/memory-verses.ts`, `app/quests/wise-builder/page.tsx`.
- Add route metadata with installed-Next docs checked first. Likely files: `node_modules/next/dist/docs/`, `app/layout.tsx`, individual `app/**/page.tsx` route files.
