# Promotion Report — Why Did Jesus Have to Die?

Gate: PROMOTED_TO_APP

## Selected item

- Lane: lessons
- Slug: `case-for-christ-cross`
- Route: `/lessons/case-for-christ-cross`
- Draft: `docs/content-drafts/lessons/case-for-christ-cross.md`

## Required gates

- Content QA: PASS (`case-for-christ-cross.content-qa.md`)
- Visual QA: PASS (`case-for-christ-cross.visual-qa.md`)

## Promotion work completed

- Created lesson route: `app/lessons/case-for-christ-cross/page.tsx`
- Wired passed visual pack into the page:
  - `/images/jr/lessons/case-for-christ-cross/hero.png`
  - `/images/jr/lessons/case-for-christ-cross/bible-truth.png`
  - `/images/jr/lessons/case-for-christ-cross/artifact-reconstruction.png`
  - `/images/jr/lessons/case-for-christ-cross/justice-mercy-cards.png`
- Added English lesson topic card in `data/lessons.ts`.
- Added matching Russian lesson topic card in `data/lessons-ru.ts` for bilingual listing parity.
- Added a Russian language branch and substantive Russian family-summary content in the route.
- Preserved child-safe atonement framing: sin, substitution, justice, mercy, willing love, and resurrection hope without graphic detail or fear pressure.
- Used passage citations and summaries only; no direct Scripture quotations were added.
- Added ESV summary label and avoided WEB/public-domain wording.
- Included required visual caption note for the artifact/history reconstruction.

## Verification run

- `npx eslint app/lessons/case-for-christ-cross/page.tsx`
  - Result: PASS with 4 warnings for existing project pattern of using `<img>` rather than `next/image`.
- `npm run check:scripture`
  - Result: selected item passes its scripture/localization checks after adding `ESV` label and Russian branch.
  - Overall command still fails on pre-existing/other in-progress Case for Christ pages: `case-for-christ-bible`, `case-for-christ-gods-son`, and `case-for-christ-resurrection` missing ESV labels and/or undefined `scriptureEn`/`scriptureRu`.
- `npm run check:bilingual`
  - Result: selected item no longer appears in failures.
  - Overall command still fails on pre-existing/other in-progress Case for Christ pages for missing substantive Russian page content and undefined scripture constants.
- `npx tsc --noEmit --pretty false`
  - Result: blocked by pre-existing/other in-progress pages with undefined `scriptureEn`/`scriptureRu` in Bible, God’s Son, and Resurrection routes.
- `git diff -- app/lessons/case-for-christ-cross/page.tsx data/lessons.ts data/lessons-ru.ts --check`
  - Result: PASS; no whitespace errors.

## Publish status

Not published. Not pushed. Promotion only.
