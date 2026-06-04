# Batch 4 Audit — Visual Asset Guardrails and Story Polish

Date: 2026-06-04

Commit: `a967cc3 fix: guard Junior Disciples image assets`

## Goal

Stabilize the visual/image lane without forcing low-quality replacement art. The earlier visible image issue was primarily caused by wrong/missing references and repeated thumbnails, not by a safe inventory/check process.

## Changes made

### Added deterministic image asset checker

New script:

```txt
scripts/check-image-assets.mjs
```

New package script:

```txt
npm run check:assets
```

The checker scans source directories for `/images/jr/...` references and verifies each referenced asset exists under `public/`.

It intentionally scans app/source/data files rather than docs/drafts so historical notes and deprecated draft references do not fail production checks.

### Verified production image references

`npm run check:assets` passed:

```txt
Junior Disciples image asset check passed for 80 unique referenced assets.
```

This means current production source references do not point at missing Junior Disciples images.

### Corrected Russian David/Goliath copy polish found during image/data audit

While checking story image references, polished obvious Russian copy errors in `data/stories-ru.ts`:

- `боца` → `бойца`
- `боцом` → `бойцом`
- `со мечом` style issue fixed to natural phrasing
- replaced awkward wording around David, Goliath, warrior/fighter language

This was tied to the same story whose image reference had previously been wrong.

## What was not forced

No new AI image generation was attempted in this batch.

Reason: the safest fix was to stabilize references/checks first. Replacing visual canon art requires human-approved source stills and character consistency. Forcing new generated art now could reintroduce the same automation problem Mike called out.

## Verification

Passed after Batch 4:

```txt
npm run check:bilingual
npm run check:scripture
npm run check:assets
npm run lint
npm run build
```

Output summary:

- Bilingual parity: passed for `7 lessons, 6 stories, and core activity data`
- Scripture/localization: passed for `4 Case for Christ lessons`
- Image assets: passed for `80 unique referenced assets`
- Lint: `0 errors`, `33 warnings`
- Build: successful, `24/24` pages

## Remaining visual/canon notes

1. Some images may still be stylistically generic compared to the Junior Disciples cast canon.
2. Current checks can verify existence, not artistic consistency.
3. Future image replacement should be done from approved character/source stills, not broad unattended generation.
4. The homepage hero video remains intentionally unchanged per Mike's preference until a stronger approved still/source exists.

## Final recommended standard

Production visual changes should require:

1. source/reference image exists,
2. path referenced by app/data source,
3. `npm run check:assets` passes,
4. visual QA against Junior Disciples canon,
5. no automation-only image swaps without human review.
