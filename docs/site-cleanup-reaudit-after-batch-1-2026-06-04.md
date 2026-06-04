# Junior Disciples Cleanup Re-Audit After Batch 1

Date: 2026-06-04

## Batch 1 completed

Commit: `cb22524 fix: localize visible Russian UI labels`

Batch 1 targeted the most visible Russian-mode UI bleed without doing a full content rewrite. It fixed English labels/microcopy on:

- Homepage activity CTAs and featured quest CTA labels
- Quiz listing card question-count label
- Shared quest component comic bubble labels and final truth/reference label
- Case for Christ lesson section labels in:
  - `case-for-christ-bible`
  - `case-for-christ-gods-son`
  - `case-for-christ-resurrection`
  - `case-for-christ-cross`

## Verification

These checks passed after Batch 1:

```txt
npm run check:bilingual
npm run check:scripture
npm run lint
npm run build
```

Observed output summary:

- Bilingual content parity: passed for `7 lessons and 6 stories`
- Lesson Scripture/localization: passed for `4 Case for Christ lessons`
- Lint: `0 errors`, existing warnings only
- Build: compiled successfully, generated `24/24` pages

## What is better now

### Russian mode no longer fails immediately above the fold

The previous mobile issue showed the Russian switcher selected while lesson hero/labels stayed English. The hero fix was already pushed earlier, and Batch 1 extended the same idea into visible labels and CTAs.

### The shared quest shell is safer

`QuestAdventure` now gets language-aware fallback labels for:

- Echo / Эхо
- Truth Light / Огни истины
- Guide / Помощь
- Think / Подумай
- final truth/reference label
- badge image alt text

That reduces repeated English bleed across multiple quest pages without touching every quest file yet.

### Internal automation risk was reduced

Separate internal cleanup commit: `e92d6af docs: deprecate overbuilt Junior Disciples automation`

Actions completed:

- Confirmed Hermes cron jobs: `0`
- Confirmed background processes: `0`
- Quarantined active JR scripts from `~/.hermes/scripts` into:
  - `/home/helper/.hermes/scripts/quarantine_jr_automation_2026-06-04/`
- Updated Hermes skills/references so future sessions do not restore the old broad cron factory.
- Marked repo automation docs deprecated:
  - `docs/autonomous-content-factory.md`
  - `docs/plans/2026-06-01-autonomous-lesson-production-pipeline.md`

## Remaining site issues

Batch 1 fixed visible labels. It did **not** finish full Russian content quality or architecture cleanup.

### 1. Case for Christ pages still need full RU content extraction

Some lessons still keep English teaching arrays and paragraphs while rendering Russian labels around them. The right fix is not to keep patching labels forever. The right fix is to move each lesson toward a clean shape:

```ts
const copy = {
  en: { ...complete lesson text... },
  ru: { ...complete lesson text... },
}
```

or a separate data/module pair if the lesson is large.

Priority pages:

1. `app/lessons/case-for-christ-cross/page.tsx`
2. `app/lessons/case-for-christ-bible/page.tsx`
3. `app/lessons/case-for-christ-gods-son/page.tsx`
4. `app/lessons/case-for-christ-resurrection/page.tsx`

### 2. Quest RU story copy still needs review

The shared quest UI is better, but several quest files previously showed Russian branches that included English sentence bodies with only character names localized. These need full Russian rewrite, not only UI label fixes.

Priority pages:

1. `app/quests/forgiveness-bridge/page.tsx`
2. `app/quests/storm-rescue/page.tsx`
3. `app/quests/forest-of-lies/page.tsx`
4. `app/quests/wise-builder/page.tsx`
5. `app/quests/courage-quest/page.tsx`

### 3. Detail route ID parity is still fragile

Historical Russian data uses IDs like:

```txt
john-3-16-ru
```

while English uses:

```txt
john-3-16
```

That can break or redirect when a user switches language on detail pages such as memory verses, word puzzles, rebus puzzles, and quizzes.

Best fix:

- make IDs canonical and matching across EN/RU files
- if old RU URLs exist, support redirects/aliases temporarily

### 4. Russian copy needs a human-quality pass

Known examples from prior audit:

- typo/awkward phrasing such as `боца`
- unnatural Russian like `Бог всё ещё в контроле`
- English idioms copied too literally

This needs a Russian copy pass after the architecture is less scattered.

### 5. Visual canon cleanup remains

Some assets are generic or automation-looking. Do this after content and route architecture are stable, otherwise image work will distract from the learning path.

## Recommended Batch 2

Fix the data/route parity issue next.

Why Batch 2 should be route/data parity before full copy rewrite:

- It affects multiple existing sections, not only Case for Christ.
- It is structural and testable.
- It protects language switching.
- It restores the original clean bilingual discipline Mike remembered.

Batch 2 scope:

1. Inventory IDs in EN/RU files:
   - stories
   - quizzes
   - memory verses
   - word puzzles
   - rebus puzzles
2. Normalize IDs where safe.
3. Add compatibility lookup/redirect behavior for old `-ru` IDs if needed.
4. Verify listing pages and detail pages in both languages.
5. Run checks/lint/build.
6. Commit/push.

## Recommended Batch 3

After route/data parity, do full Russian copy cleanup for quests and Case for Christ lessons.

## Recommended Batch 4

After Russian content is structurally clean, do visual canon/image cleanup.
