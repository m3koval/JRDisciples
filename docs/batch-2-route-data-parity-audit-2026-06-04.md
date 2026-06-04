# Batch 2 Audit — Route/Data Parity

Date: 2026-06-04

Commit: `297a0b7 fix: normalize Russian activity data parity`

## Goal

Restore the original bilingual discipline: shared routes should be able to use the same canonical IDs across English and Russian data, instead of Russian pages depending on separate `-ru` IDs that can break language switching and detail routes.

## Changes made

### Canonicalized Russian top-level IDs

Normalized Russian top-level IDs to match the English data files for:

- `data/quizzes-ru.ts`
- `data/memory-verses-ru.ts`
- `data/word-puzzles-ru.ts`
- `data/rebus-ru.ts`

This means collection/detail paths now use stable IDs regardless of selected language.

### Corrected Russian memory verse parity

Rebuilt `data/memory-verses-ru.ts` so the Russian memory verses match the English memory verse set by ID/reference:

- John 3:16 / От Иоанна 3:16
- Psalm 23:1 / Псалом 22:1
- Proverbs 3:5-6 / Притчи 3:5-6
- Romans 3:23 / К Римлянам 3:23
- Romans 6:23 / К Римлянам 6:23
- Ephesians 2:8-9 / К Ефесянам 2:8-9
- James 1:22 / Иакова 1:22
- Philippians 4:13 / К Филиппийцам 4:13

Scripture text was checked against Bible.com Russian Synodal/SYNO pages for the added/rebuilt verses.

### Fixed a missing Russian story image path

Changed Russian David/Goliath story image from missing:

```txt
/images/jr/story-david-goliath.png
```

to existing:

```txt
/images/jr/story-david.png
```

### Strengthened the bilingual checker

Updated `scripts/check-bilingual-content-parity.mjs` so it now checks more than lessons/stories:

- quiz top-level IDs
- memory verse IDs
- word puzzle IDs
- rebus IDs
- missing lesson/story image assets

This makes future drift easier to catch before publish.

## Verification

Passed after changes:

```txt
npm run check:bilingual
npm run check:scripture
npm run lint
npm run build
```

Output summary:

- Bilingual parity: `7 lessons, 6 stories, and core activity data`
- Scripture/localization: `4 Case for Christ lessons`
- Lint: `0 errors`, `33 warnings`
- Build: successful, `24/24` pages

## Remaining risks

1. Some Russian word-puzzle/rebus content is now structurally aligned by canonical ID, but the actual Russian puzzle concepts still need a content-quality pass.
2. Old `-ru` URLs may no longer be used by the app because list pages now link canonical IDs. If external users somehow bookmarked old `-ru` URLs, those can be handled later with compatibility redirects if needed.
3. Batch 2 did not rewrite quest story copy or Case for Christ lesson body copy. That is Batch 3.

## Next batch

Batch 3 should clean Russian copy quality in:

1. Quests
2. Case for Christ lesson bodies
3. Bible story awkward phrasing/typos

Keep it content-focused. No new automation. No visual work yet.
