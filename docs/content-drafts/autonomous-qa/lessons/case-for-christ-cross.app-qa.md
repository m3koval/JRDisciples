# App QA — Why Did Jesus Have to Die?

Gate: FAIL

## Selected item

- Lane: lessons
- Slug: `case-for-christ-cross`
- Route: `app/lessons/case-for-christ-cross/page.tsx`
- Content QA: PASS (`case-for-christ-cross.content-qa.md`)
- Visual QA: PASS (`case-for-christ-cross.visual-qa.md`)

## Commands run

### `npm run lint`

Result: PASS with warnings.

- Exit code: 0
- Warnings: project-wide `<img>`/`next/image` warnings and two existing unused eslint-disable warnings.
- Selected route warnings: four `<img>` warnings at `app/lessons/case-for-christ-cross/page.tsx` lines 124, 165, 197, and 231.
- No lint errors.

### `npm run build`

Result: BLOCKED by another route.

- Build compiled successfully, then failed TypeScript checking.
- Blocking error: `app/lessons/case-for-christ-bible/page.tsx:91:41` — `Cannot find name 'scriptureRu'. Did you mean 'scripture'?`
- This prevents a full production build verification for the selected item.

## App QA checks

### Route and listing wiring

Result: PASS.

- Route exists: `app/lessons/case-for-christ-cross/page.tsx`.
- English listing exists in `data/lessons.ts` with href `/lessons/case-for-christ-cross` and image `/images/jr/topic-case-for-christ-cross.png`.
- Russian listing exists in `data/lessons-ru.ts` with matching href, image, section count, color, and emoji.
- Dev route returned HTTP 200 at `http://localhost:3000/lessons/case-for-christ-cross`.

### Visual wiring, captions, and alt text

Result: PASS.

- Route references existing images:
  - `/images/jr/lessons/case-for-christ-cross/hero.png`
  - `/images/jr/lessons/case-for-christ-cross/bible-truth.png`
  - `/images/jr/lessons/case-for-christ-cross/artifact-reconstruction.png`
  - `/images/jr/lessons/case-for-christ-cross/justice-mercy-cards.png`
- Topic thumbnail exists: `/images/jr/topic-case-for-christ-cross.png`.
- Images include meaningful alt text.
- Required artifact caption is present: “Original child-safe reconstruction of first-century Roman crucifixion context; not a photograph and not a graphic depiction.”
- UI renders required labels/hard words, including Justice, Mercy, Sin, Substitute, and Peace with God.

### Child-safe interaction and content framing

Result: PASS.

- Content remains warm and child-safe for atonement teaching.
- No gore, fear-pressure appeal, graphic crucifixion description, or angry-Father/unwilling-Son framing was found.
- Activity is hands-on and low-risk: cards, marker, toy/paper person, paper heart.

### Verification markers / Scripture handling

Result: PASS.

- No `VERIFY`, `TODO`, `FIXME`, `PLACEHOLDER`, WEB/public-domain, or scripture-verification markers found in the selected route.
- Route uses citations and summaries only; no direct English Scripture quotation was added.
- ESV summary label is present.

### Browser/user-flow check

Result: FAIL for Russian route parity.

- English dev route renders correctly and is reachable.
- Russian language toggle works for some top-level copy: title, intro, hero caption, big question, big truth, recap, Russian summary, and back link.
- However, most visible route content remains English in Russian mode, including:
  - `CASE FOR CHRIST KIDS · LESSON 5`
  - `ESV summaries`
  - `BIG QUESTION`
  - `BIBLE ANCHOR`
  - `Love, substitution, and rescue`
  - Bible anchor summaries and helps
  - teaching trail headings/body text
  - hard word labels and definitions
  - honest question section
  - interactive activity instructions/challenge
  - parent/teacher talk and conversation questions
  - image alt text/captions beyond the hero caption

## Blocking / failing issues

1. FAIL — selected route does not meet Russian parity for bilingual surfaces. The listing parity is present, but the route surface is only partially localized.
2. BLOCKED — full production build cannot be verified because `case-for-christ-bible` currently has an unrelated TypeScript error.

## Recommendation

Do not publish this item yet.

Next wise fix:

1. Complete Russian parity for `app/lessons/case-for-christ-cross/page.tsx` or explicitly mark the route as English-only if that becomes an approved product decision.
2. Fix the unrelated `scriptureRu` TypeScript blocker in `app/lessons/case-for-christ-bible/page.tsx` so `npm run build` can verify the app.
3. Re-run app QA after both fixes.
