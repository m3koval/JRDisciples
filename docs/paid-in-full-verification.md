# Paid in Full — verification and operation

## Reproduce

- `npm run check:paid-in-full`: field/array EN–RU parity, exact published Bible.com ESV/RST fixtures, verse-excerpt containment, activity counts/answers, images and primary placement.
- Standard repository gate: lint with the existing 32-warning cap, quest links, bilingual, Scripture localization, Russian copy, assets, games, production build.
- Start built application on loopback: `npm start -- --hostname 127.0.0.1 --port 3147`.
- With Python Playwright installed, `python scripts/qa-paid-in-full.py` runs both languages through all five discoveries; validates retries/hints/explicit timeline grading/verse assembly/six quiz explanations; completes and reloads; reviews notebook; verifies four assets and first homepage link; tests malformed JSON and blocked/quota-limited storage. Override `JD_BASE` to test a hosted release. Tests use only browser-local learning state and no production database writes.

## Evidence already exercised

Parent Playwright browser run completed English and Russian flows at 390×844 with no uncaught page errors. All four artwork paths loaded. Reload retained completed discoveries. Corrupt progress and both storage failure modes remained playable and advanced to the next discovery. Screenshots inspected for both mobile languages, desktop second discovery, mobile completion and homepage placement.

The first implementation worker completed the bilingual content file but timed out before writing the UI. The parent completed and exercised the page, CSS, registration, homepage feature and regression checks directly. An independent content reviewer read the full source sermon and lesson and found no doctrinal/localization blockers. The parent subsequently removed internal editorial review notes from public copy, corrected the HTTP-only historical source link, and added the class prayer to the completion screen.

## Intentional boundaries

- Progress is local learning progress, not attendance, salvation, or spiritual standing.
- Completed discoveries persist; unfinished puzzles restart. Browser-storage failure falls back to memory within the current page session.
- English and Russian discovery progress are separate. The existing site-wide mastery mechanism reports the lesson's learning stars.
- Device emulation is not a physical iPad/Safari test.
- Historical and source-review notes live in `docs/`, not in public assets. The published teacher guide contains useful classroom notes, Scripture and source links only.
- Four original FAL images are optimized to WebP and referenced in the route and feature. There are no placeholder graphics and no new video.
