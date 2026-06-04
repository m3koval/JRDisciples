# Junior Disciples Site Cleanup Audit

Date: 2026-06-04

## Summary

The site is usable, but Mike is right: the automation phase left too many half-localized and inconsistent areas, especially when Russian is selected. The problem is not one single bug. It is a pattern:

1. Some pages use EN/RU data correctly.
2. Some pages switch Russian content but keep English UI labels, badges, alt text, or helper copy.
3. Some dynamic routes use different English/Russian IDs, so language switching on detail pages can lose the current item or redirect back to the index.
4. Some Russian content is awkward machine-translation style and needs human child-facing rewrite.
5. Some assets are duplicated, missing, or not aligned with the Junior Disciples character canon.

Recommended line: do not restart broad automation. Fix manually in tight batches with deterministic checks after each batch.

## Highest-priority findings

### P0 — Russian detail-page route parity is weak

These sections use different EN/RU item IDs:

- `/quiz/[id]`
- `/memory/[id]`
- `/puzzles/[id]`
- `/rebus/[id]`

Examples found:

- English memory ID: `john-3-16`; Russian memory ID: `john-3-16-ru`.
- English word puzzle ID: `books-of-the-bible`; Russian word puzzle ID: `books-of-the-bible-ru`.
- English rebus ID: `rebus-believe`; Russian rebus ID: `rebus-vera-ru`.
- Russian quizzes also suffix quiz/question IDs with `-ru`, though `storyId` mostly stays aligned.

Why this matters:

- If a user lands on `/memory/john-3-16` and switches to Russian, the Russian detail page searches only `memoryVersesRu` for `john-3-16`; it does not find it and redirects to `/memory`.
- Same risk exists for puzzles/rebus/quizzes.

Recommended fix:

- Keep stable canonical IDs across languages.
- Store localized fields in separate EN/RU data objects, but do not change the route ID.
- Add a route parity checker to fail if localized data changes IDs unexpectedly.

### P0 — Case for Christ pages still have many hard-coded English labels in Russian mode

The main hero bug was fixed, but inner sections still contain English labels/headings when Russian is selected.

Observed source examples:

#### `/lessons/case-for-christ-bible`

Hard-coded English labels remain:

- `Big Question`
- `Case File`
- `What would count as good evidence?`
- `Evidence Trail`
- `Tap each clue card`
- `Bible Anchor`
- `Think It Through`
- `Honest Answers`
- `Translations:`

#### `/lessons/case-for-christ-gods-son`

Hard-coded English labels remain:

- `Big Question`
- `Bible Anchor`
- `Peter's confession and John's testimony`
- `Visual Learning Pack`
- `Teaching Trail`
- `Identity Cards`
- `Hard Words`
- `Detective Check`

#### `/lessons/case-for-christ-resurrection`

Hard-coded English labels remain:

- `Big Truth`
- `Big Question`
- `Bible Anchor`
- `Witness Web`
- `Evidence Trail`
- `Hard Words`
- `Resurrection:`
- `Witness:`

#### `/lessons/case-for-christ-cross`

Hard-coded English labels remain:

- `Case for Christ Kids · Lesson 5`
- `ESV summaries`
- `Big Question`
- `Bible Anchor`
- `Evidence / Teaching Trail`
- `Hard Words Defined`
- `Honest Question`

Recommended fix:

- Convert each Case for Christ lesson to a single `copy.en` / `copy.ru` structure.
- Route every visible label, heading, CTA, card title, helper line, alt text, and badge through that structure.
- Add a stricter checker for Case for Christ pages: when `useLanguage` appears, common English-only section labels should not appear in rendered JSX unless guarded by an EN branch.

### P0 — Homepage has English-only CTA labels in Russian mode

`app/page.tsx` uses `useTranslation`, but some visible homepage labels are still hard-coded.

Hard-coded examples:

- Activity-card CTA: `Go! →`
- Quest feature label: `Featured Adventure`
- Quest CTA: `Start Bible Quests →`
- Quest availability badge: `Playable now: Courage Quest`
- Image alt: `Bible Quests adventure map`

Recommended fix:

- Add these labels to `lib/translations.ts`.
- Use translated alt text too.

### P1 — Quest adventure shell has English-only comic/UI micro-labels

`app/quests/components/QuestAdventure.tsx` correctly accepts EN/RU scene data and UI copy, but some component-level labels remain English-only:

- `Echo`
- `Truth Light`
- `Guide`
- `Think`
- Completion image alt: `Michael and Rosie celebrating with the Courage Quest badge`
- Final verse reference is hard-coded as `Psalm 56:3` even in Russian mode.

Recommended fix:

- Add `echoLabel`, `truthLightLabel`, `guideLabel`, `thinkLabel`, `badgeAlt`, and `finalVerseRef` to `QuestUi`.
- Fill both EN and RU values in every quest.

### P1 — Quiz list has English-only count/reward text

`app/quiz/page.tsx` has this hard-coded card text:

- `5 Questions · Earn a ⭐`

Recommended fix:

- EN: `5 Questions · Earn a ⭐`
- RU: `5 вопросов · Получи ⭐`

### P1 — Missing Russian story asset reference

`data/stories-ru.ts` references:

- `/images/jr/story-david-goliath.png`

Existing related file found earlier:

- `/images/jr/story-david.png`

Recommended fix:

- Either change the RU story to use `/images/jr/story-david.png`, or add the missing `story-david-goliath.png` asset.

### P1 — Russian story text needs human cleanup

Russian pages are present, but several lines read awkwardly or contain mistakes. Examples from `data/stories-ru.ts`:

- `одного боца` should be `одного бойца`.
- `не боцом` should be `не бойцом`.
- `со мечом` should be `с мечом`.
- `Бог всё ещё в контроле` is unnatural Russian; better: `Бог по-прежнему управляет всем` or `Бог всё держит под Своим контролем`.
- Some phrasing feels machine-translated rather than child-facing Russian.

Recommended fix:

- Do a Russian copy pass story-by-story.
- Prioritize visible pages: Stories index/detail, Case for Christ lessons, Quests.
- Keep it child-friendly, natural, and faithful.

### P1 — Image/character canon drift

Screenshots and existing assets show inconsistent children and repeated illustrations. This conflicts with the Junior Disciples canon:

- Michael / Мишутка
- Joseph / Йосик
- Rosie / Рози
- Gracie / Грейси

Known issues:

- Some Case for Christ images show generic children rather than the canon cast.
- Some cards reused the same Bible/cross/magnifying-glass style image; one resurrection duplicate was fixed, but the wider asset set still needs review.

Recommended fix:

- Do a visual audit by section.
- Replace duplicates first where the same art appears on unrelated cards.
- Then replace character-heavy scenes with canon-consistent source stills.

## Suggested fix order

### Batch 1 — Russian UI bleed cleanup

Files:

- `app/page.tsx`
- `lib/translations.ts`
- `app/quiz/page.tsx`
- `app/quests/components/QuestAdventure.tsx`
- all four Case for Christ lesson pages

Goal:

- No obvious English UI labels when Russian is selected.
- Keep content structure unchanged.
- Run checks/build.

### Batch 2 — Route/data parity cleanup

Files:

- `data/memory-verses.ts`
- `data/memory-verses-ru.ts`
- `data/word-puzzles.ts`
- `data/word-puzzles-ru.ts`
- `data/rebus.ts`
- `data/rebus-ru.ts`
- `data/quizzes.ts`
- `data/quizzes-ru.ts`
- dynamic pages under `/memory/[id]`, `/puzzles/[id]`, `/rebus/[id]`, `/quiz/[id]`

Goal:

- Stable route IDs across languages.
- Language toggle should not lose the current item.
- Add a parity checker.

### Batch 3 — Russian copy rewrite

Files:

- `data/stories-ru.ts`
- `data/quizzes-ru.ts`
- `data/memory-verses-ru.ts`
- `data/word-puzzles-ru.ts`
- `data/rebus-ru.ts`
- Quest RU scene files

Goal:

- Natural Russian for kids.
- Remove awkward machine-translation phrasing.
- Check Scripture references against Russian Synodal/RST conventions.

### Batch 4 — Visual cleanup

Files/assets:

- `public/images/jr/**`
- lesson/story/quest data image references

Goal:

- Fix missing assets.
- Remove obvious duplicated/wrong thumbnails.
- Align character-heavy images with the Junior Disciples cast canon.

## Verification checklist for every batch

Run:

```bash
npm run check:bilingual
npm run check:scripture
npm run lint
npm run build
```

Also verify manually:

- Switch EN/RU from home, index pages, and detail pages.
- Confirm current detail page does not redirect when language changes.
- Confirm no English UI labels on Russian pages except intentional brand names like `JR Disciples`.
- Confirm mobile layout still works.

## Recommendation

Start with Batch 1. It is the most visible and lowest risk. Fix the English bleed before deeper data restructuring.
