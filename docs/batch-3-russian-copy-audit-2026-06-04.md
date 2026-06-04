# Batch 3 Audit — Russian Copy Cleanup

Date: 2026-06-04

Commits:

- `4b32cda fix: translate Russian quest story copy`
- `7f80c93 fix: translate Case for Christ Russian support copy`

## Goal

Remove the worst English/Russian mixed copy and improve Russian-mode content quality in the areas most affected by prior automation: quests and Case for Christ lesson support sections.

## Changes made

### Quests

Fully translated the Russian `RU` scene arrays for these quests:

- `app/quests/forest-of-lies/page.tsx`
- `app/quests/forgiveness-bridge/page.tsx`
- `app/quests/storm-rescue/page.tsx`

Before Batch 3, these Russian quest scenes had Russian character names inserted into mostly English prose. Example pattern:

```txt
Мишутка, Рози, and Йосик enter...
```

After Batch 3, scene places, titles, body copy, captions, danger whispers, echo text, thought prompts, question prompts, choices, responses, truths, verse references, and alt text are Russian.

### Existing Russian quests checked

Confirmed `courage-quest` and `wise-builder` already had real Russian scene copy rather than mixed English prose. Remaining Latin text there is structural IDs/image keys such as `entrance`, `rock-foundation`, or `bottom-right`, not user-facing copy.

### Case for Christ lesson support copy

Translated remaining visible Russian-mode support sections in:

- `case-for-christ-bible`
- `case-for-christ-gods-son`
- `case-for-christ-resurrection`
- `case-for-christ-cross`

Fixed/translated:

- parent/teacher guidance paragraphs
- honest question explanation paragraphs
- parent/teacher bullet points
- prayer blocks
- feedback text in resurrection detective cards
- back-to-lessons link where needed
- Bible lesson hero alt text

## Verification

Passed after Batch 3 changes:

```txt
npm run check:bilingual
npm run check:scripture
npm run lint
npm run build
```

Output summary:

- Bilingual parity: passed for `7 lessons, 6 stories, and core activity data`
- Scripture/localization: passed for `4 Case for Christ lessons`
- Lint: `0 errors`, `33 warnings`
- Build: successful, `24/24` pages

## Remaining risks

1. Some English text still exists in source files by design because English and Russian branches live together in the same page components.
2. Some Russian copy could still benefit from a native-speaker polish pass, but the worst automation failure — mixed English/Russian user-facing quest scenes — is corrected.
3. Visual canon/image consistency remains the next major issue.
4. The `no-img-element` lint warnings remain. They are performance warnings, not Russian-content blockers.

## Next batch

Batch 4: visual canon/image cleanup.

Recommended focus:

1. Verify all referenced image assets exist.
2. Identify repeated/generic thumbnails.
3. Replace obviously wrong Russian/listing images with existing better assets where possible.
4. Document any images that need future generation instead of forcing low-quality swaps.
