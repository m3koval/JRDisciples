# Junior Disciples Holistic Site/GamePlay Review - 2026-06-02

Gate: REVIEW

## Executive Summary
- The site has a strong child-facing activity hub: stories, quizzes, memory, puzzles, rebus, lessons, and Bible Quests are all reachable from the home page and main navigation.
- Bible Quests are the most mature engagement lane: five playable quest routes use choices, progress, truth lights, Scripture anchors, completion badges, and parent discussion prompts.
- Stories and quizzes are well aligned: all six current story records have matching five-question quizzes, with explanatory feedback rather than raw scoring only.
- Lessons are becoming a separate discipleship ecosystem, but lesson-to-quiz discoverability is split: rich lesson-specific checks exist inside lesson pages, while the `/quiz` hub only exposes story quizzes.
- The biggest product opportunity is to make tracks explicit: "Story Path," "Bible Skills," "Evidence Lessons," "Jesus/Matthew Track," and "Quests" so parents, teachers, and children know where to start and what to do next.
- Current interaction is wholesome overall, but rewards should stay tied to truth, practice, obedience, memory, and parent conversation rather than streak pressure or endless replay loops.
- Content needs a lightweight biblical/content QA gate before publication, especially for doctrinally sensitive topics like the Holy Spirit, salvation invitations, apologetics claims, and future Matthew teaching.

## Highest-Leverage Improvements
1. Add a simple "Learning Paths" layer above the existing activities: Beginner Bible Stories, Know Jesus, Follow Jesus, Bible Skills, and Quests. This reduces overlap between lessons, quizzes, memory, puzzles, and quests without rebuilding the site.
2. Create lesson companion quizzes/checkpoints for the four published lesson topics and surface them from both `/lessons` and `/quiz` with a clear label such as "Lesson Review" versus "Story Quiz."
3. Launch a Matthew study track as a child-friendly sequence that connects lesson pages, memory verses, puzzles, and quests around Jesus' identity, kingdom teaching, prayer, obedience, compassion, cross, and resurrection.
4. Add parent/teacher support affordances to index pages: age range, estimated time, big truth, Scripture reference, discussion prompt, and suggested next activity.
5. Establish a content-quality gate that checks Scripture references, theological wording, child comprehension, Russian/English parity, accessibility, and route discoverability before new content is promoted.

## Site Structure Findings
- Current top-level routes discovered in `app/`: `/`, `/stories`, `/stories/[id]`, `/quiz`, `/quiz/[id]`, `/memory`, `/memory/[id]`, `/puzzles`, `/puzzles/[id]`, `/rebus`, `/rebus/[id]`, `/lessons`, four lesson routes, `/quests`, five quest routes, plus `/quest` redirecting to `/quests`.
- The main navigation in `components/NavBar.tsx` includes Home, Stories, Quizzes, Memory, Puzzles, Rebus, Quests, and Lessons. That is complete but broad; for children, eight peer-level labels can feel like a toy shelf with no suggested order.
- The home page activity cards make every major lane findable and give Quests a featured visual treatment. This is good for child engagement, but Quests may visually outrank Lessons even when a parent is seeking structured teaching.
- `/lessons` lists four visible lesson topics: "Can We Trust the Bible?," "The Holy Spirit," "The Transfiguration," and "Who Is Jesus?" The topic cards communicate section counts and activity flavor well.
- `/quiz` only lists story-based quizzes by story reference. It does not reveal lesson review checks, quest reflection questions, memory-verse reviews, or puzzle-based reviews. The label "Quizzes" therefore means "Bible story quizzes" in practice, not all review activities.
- `/quest` redirects to `/quests`, which is helpful for older links and not a dead end.
- There is no obvious site-level "start here" path for different users: a six-year-old child, a parent doing bedtime Bible time, a Sunday school teacher, and a returning child all see the same activity shelf.
- Suggested structure improvement: keep the existing activity routes, but add labels/cards like "Start with a Story," "Review with a Quiz," "Memorize a Verse," "Go on a Quest," and "Study a Lesson" with next-step links at the bottom of each content page.

## Gameplay / Interaction Findings
- Bible Quests have the strongest game loop: narrative scene, moral/spiritual pressure, choice, feedback, progress, truth lights, final badge, parent questions, prayer, and replay. This is a healthy direction because progress is tied to Scripture-informed choices.
- Quest choices are currently binary enough to work for younger kids, but future quests can become more meaningful by including "good but incomplete" choices, repair choices after wrong answers, and reflection checkpoints that ask kids to name the truth in their own words.
- Completion badges are useful when they represent learned truth. Keep badges as printable/shareable encouragement, not as scarcity, streaks, leaderboards, or pressure mechanics.
- Quizzes offer immediate explanations and score feedback. That is stronger than trivia-only play. The next step is to add application questions after factual questions: "What would trusting God look like today?" or "Which choice shows forgiveness?"
- Memory challenges and word puzzles can become part of tracks rather than isolated activities. Example: after a Matthew lesson on wise/foolish builders, route to Matthew 7:24 memory and a "Build on the Rock" word puzzle.
- Rebus puzzles are wholesome vocabulary builders. Add a short "Why this word matters" explanation after solving so the puzzle teaches doctrine/devotion, not only wordplay.
- Consider light persistence only if privacy-safe and parent-friendly: local progress per device, no account requirement, no public rankings. Let children reset progress easily.
- Add reduced-motion and accessibility checks to interactive pages where animations, fixed gameplay views, focus movement, and hidden overflow are used.

## Lesson + Quiz Opportunities
- Story quizzes are complete for current story data: Creation, Noah, Joseph, David and Goliath, Jonah, and Birth of Jesus each have a matching five-question quiz.
- Published lesson topics that need discoverable companion review from the quiz ecosystem: "Can We Trust the Bible?," "The Holy Spirit," "The Transfiguration," and "Who Is Jesus?"
- "Who Is Jesus?" already contains rich internal interactions: Lord/liar/lunatic cards, prophecy matching, word search, true/false resurrection evidence, and a John 14:6 scramble. It should have a short summary review in `/quiz` or a `/lessons/who-is-jesus/review` endpoint so kids can revisit without replaying the entire long lesson.
- "Can We Trust the Bible?" already contains evidence cards and a short detective check. Add a companion quiz format focused on evidence categories, Bible anchor verses, honest questions, and how to respond humbly when someone asks whether the Bible is trustworthy.
- "The Transfiguration" should have a review that emphasizes Jesus' glory, the Father's command to listen to Him, Moses/Elijah, Peter/James/John as witnesses, and application: listening to Jesus when distracted or afraid.
- "The Holy Spirit" should have a review that avoids vague mysticism. Best format: match roles/symbols/fruit to Scripture anchors, then choose practical responses like prayer, obedience, repentance, comfort, service, and self-control.
- Good kid quiz structure: 3 factual recall questions, 1 Scripture/truth connection, 1 application/reflection question. Include explanations, not just right/wrong.
- Add parent discussion after quiz completion: one question for comprehension, one for heart/application, one for prayer.
- Add memory verse tie-ins: Holy Spirit → Galatians 5:22-23 or John 14:26; Transfiguration → Matthew 17:5; Who Is Jesus → John 14:6 or Matthew 16:16; Trust the Bible → 2 Timothy 3:16 or Psalm 119:105.

## Matthew Study Track Recommendation
- Fit the Matthew track as a new learning path rather than a single large lesson. Suggested route shape: `/tracks/matthew` or `/lessons/matthew`, with child-sized sessions linking to existing activities.
- Recommended sequence: 1) Jesus the promised King, 2) Birth and worship of Jesus, 3) Baptism and temptation, 4) Sermon on the Mount: kingdom hearts, 5) The Lord's Prayer, 6) Treasure and worry, 7) Wise builder obedience, 8) Jesus' compassion and miracles, 9) Parables of the kingdom, 10) Peter's confession, 11) Transfiguration, 12) Cross and resurrection, 13) Great Commission.
- Each session should include: Bible passage, big truth, short story explanation, one interactive check, one memory/action step, and parent/teacher prompt.
- Existing assets align well: Wise Builder Quest already anchors Matthew 7:24, word puzzle data includes the Lord's Prayer and parables, memory verses include obedience/trust passages, and the Transfiguration lesson can become part of the Matthew path.
- Keep the track church-family aligned: avoid presenting it as a replacement for parents or church teaching. Use language like "read with a grown-up," "talk together," and "ask your teacher/pastor if you have questions."
- Sermon resources may inspire themes or sequence, but the actual site content should be newly written for children, with direct Scripture work and no copied wording.
- A strong first MVP would be four Matthew sessions: The King Arrives, Jesus Teaches Us to Pray, Build on the Rock, and Go Make Disciples.

## Risks / Guardrails
- Data split risk: some lessons use centralized `data/lessons.ts`, while newer rich lessons are implemented directly in route files. This can make indexes, quizzes, translations, and QA checks drift.
- Discoverability risk: lesson-specific interactive checks are hidden inside lesson pages and not connected to the quiz hub. Parents may assume quizzes do not exist for lessons.
- Maintenance risk: English/Russian parity appears important, but new lesson depth may not always have matching RU content or route behavior.
- Content integrity risk: doctrinally dense topics need careful wording. For example, the Holy Spirit lesson should consistently speak of Him as personal, not merely "a power," and should avoid encouraging children to identify spiritual gifts in a way that creates pressure or confusion.
- Apologetics risk: evidence lessons should avoid overstated claims, unverifiable numbers, or adult-level arguments presented too confidently for kids. Keep confidence rooted in Scripture and honest reasoning.
- UX/accessibility risk: heavy images, autoplay video, fixed full-screen quest mode, animations, and dynamic focus changes need ongoing mobile, reduced-motion, and keyboard checks.
- SEO/discoverability risk: pages have global metadata but could use stronger per-route metadata for lessons, stories, quizzes, and quests.
- Child safety/privacy guardrail: do not add accounts, public leaderboards, chat, personal profile collection, or manipulative streaks without a clear parent-first safety plan.
- Content-quality gate needed: Scripture reference verification, Bible translation attribution, doctrine review, age-fit reading level, application tone, parent prompt, image/cast canon check, accessibility pass, and build/type check.

## Suggested Next Tasks
- Add a learning-paths entry point. Inspect/edit likely files: `app/page.tsx`, `components/NavBar.tsx`, `lib/translations.ts`; optionally create `app/tracks/page.tsx` or `app/paths/page.tsx`.
- Add lesson review cards to the quiz hub. Inspect/edit likely files: `app/quiz/page.tsx`, `data/quizzes.ts`, `data/quizzes-ru.ts`, and lesson route files for source questions.
- Create a companion review for `case-for-christ-bible`. Inspect/edit likely files: `app/lessons/case-for-christ-bible/page.tsx`, `data/quizzes.ts`, `app/quiz/[id]/page.tsx`, `components/QuizGame.tsx`.
- Create a short Transfiguration review. Inspect/edit likely files: `app/lessons/transfiguration/page.tsx`, `data/quizzes.ts`, `data/memory-verses.ts`.
- Create a Holy Spirit review with doctrinal QA. Inspect/edit likely files: `app/lessons/holy-spirit/page.tsx`, `data/lessons.ts`, `data/quizzes.ts`, `docs/lesson-quality-standard.md`.
- Add "next activity" links at the bottom of stories, lessons, puzzles, and memory pages. Inspect/edit likely files: `app/stories/[id]/page.tsx`, `app/lessons/*/page.tsx`, `app/memory/[id]/page.tsx`, `app/puzzles/[id]/page.tsx`.
- Draft Matthew track MVP plan before coding. Likely new/edit files: `docs/plans/`, `app/tracks/matthew/page.tsx`, `data/memory-verses.ts`, `data/word-puzzles.ts`, `app/quests/wise-builder/page.tsx`.
- Add a repeatable publication checklist. Inspect/edit likely files: `docs/lesson-quality-standard.md`, `docs/plans/2026-06-01-autonomous-lesson-production-pipeline.md`, `docs/content-drafts/*/qa/`.
- Improve route metadata for discoverability. Inspect/edit likely files: `app/layout.tsx`, individual route `page.tsx` files, and any Next.js metadata docs required by the current installed Next version.
