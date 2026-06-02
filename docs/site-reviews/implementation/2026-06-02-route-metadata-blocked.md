# Junior Disciples Site Improvement Implementation - 2026-06-02

Gate: BLOCKED

## Source Triage Plan
- docs/site-reviews/triage/2026-06-02-site-review-triage.md

## Selected Task
- Add route metadata only after reading the installed Next.js docs in `node_modules/next/dist/docs/`.

## Files Changed
- docs/site-reviews/implementation/2026-06-02-route-metadata-blocked.md

## Verification
- `npm run lint`: PASS
- `npm run build`: FAIL

## Notes
- Read the installed Next.js metadata guide at `node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md`; static `metadata` exports are supported only in Server Components.
- The high-value index pages inspected (`app/quiz/page.tsx`, `app/lessons/page.tsx`, `app/stories/page.tsx`) are Client Components, so adding `metadata` directly would violate the installed docs.
- Creating route-specific layout files or refactoring client pages may be a valid path, but that is broader than the listed likely page-file edits for this unattended low-risk run.
- Build currently fails before any metadata change because `app/lessons/case-for-christ-bible/page.tsx` references undefined `scriptureRu` at line 91.
