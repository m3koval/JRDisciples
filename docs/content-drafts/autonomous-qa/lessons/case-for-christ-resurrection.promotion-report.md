# Promotion Report: case-for-christ-resurrection

Lane: lessons
Gate: PASS

## Selected draft

- `docs/content-drafts/lessons/case-for-christ-resurrection.md`
- Content QA: `docs/content-drafts/autonomous-qa/lessons/case-for-christ-resurrection.content-qa.md` (PASS)

## Files changed

- `app/lessons/case-for-christ-resurrection/page.tsx`
- `data/lessons.ts`
- `docs/content-drafts/autonomous-qa/lessons/case-for-christ-resurrection.promotion-report.md`

## Verification markers

- No Scripture verification markers found in the selected draft.
- No verification markers found in the promoted route.

## App promotion notes

- Created `/lessons/case-for-christ-resurrection` as an interactive lesson page.
- Added the lesson to `lessonTopics` so it appears on the lessons hub.
- Reused the existing Case for Christ topic image already present in `public/images/jr/` to avoid adding unverified media assets.

## Checks

- `npm run lint`: PASS with existing repository warnings only; no errors from the promoted route after fixes.
- `npm run build`: PASS. Route `/lessons/case-for-christ-resurrection` generated successfully as static content.

## Risks / follow-up

- Existing repository lint warnings remain in unrelated files, mostly `@next/next/no-img-element` and unused eslint-disable directives. These were not changed because they pre-existed this promotion.
- The lessons hub uses the existing Case for Christ Bible topic image for this lesson until dedicated resurrection artwork is added.
