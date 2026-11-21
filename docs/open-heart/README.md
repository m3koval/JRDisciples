# Open Heart — review handoff (not published)

## Deliverables

- Theme: **«Религия, которая закрывает Бога»**, Matthew **23:13–26 only**. No verse 27/29 lesson points.
- Canonical planned QR URL: `https://www.juniordisciples.com/lessons/open-heart`.
- Isolated worktree: `/home/helper/work/JRDisciples-open-heart`, branch `lesson/open-heart`, based on `3da9be5`.
- PDFs: `public/printables/open-heart/Open-Heart-{EN,RU}-{READING,A4-LONG-EDGE,LETTER-LONG-EDGE,TEACHER}.pdf`.
- Reading editions have four half-sheet pages. Teacher editions have seven pages, including marked word-search/picture answers and the full verified passage.
- Imposition: landscape outside `[4|1]`; inside `[2|3]` rotated **180° as a whole spread**. Flip on **LONG edge**. A4 and Letter supplied.
- Student pages quote full selected verses 13, 23, 26; the complete 13–26 passage is in the web read-together panel and separate teacher guide, not squeezed onto activity-first child pages.

## Content and design review

Connected modern illustration with Michael, Joseph, Rosie and Gracie: exclusion/taking supplies → questioning false rules and priorities → admitting pride/greed → repentance and trust in Jesus → returning supplies, welcoming Gracie and serving without praise. Both entire language narratives were read in order. No invented quotations from Jesus. Teacher notes distinguish modern application from the Bible event; explain all six source-outline points; reject anti-Jewish stereotyping and public confession pressure; explain that good works do not buy forgiveness.

All quoted verses were fetched from Bible.com ESV (59) and RST (167), compared with actual rendered verse paragraphs, and preserved including Russian stress marks. ESV verse 14 is **not fabricated**: the chapter footnote was independently retrieved and verified. RST includes verse 14. The edition difference appears in adult notes.

Reused approved `words-and-deeds` classroom artwork unchanged, with SHA-256 provenance. Cover is the setup before Gracie joins; coloring shows the later repair scene. Gracie is off-frame, not falsely counted as visible. No adult reference artwork was copied; no image-generation spend. Final print contact sheets, actual inside spreads, dense teacher page and final phone/tablet screenshots were visually inspected. The previous approved booklet was also rendered as the layout reference.

## Web expansion

The dedicated route imports the same bilingual narrative, Scripture and puzzle manifests used by print. Five sections add six-warning/action matching, true selectable bilingual word searches, coordinate-based hidden-object search with keyboard cursor and zoom/pan, number-code validation, checked event ordering, motive sorting, and private reflection. Wrong answers allow retry. Completed activities persist separately by language; reflection text is never stored. New bilingual catalog entries make this the next latest lesson while preserving older named destinations. No auth, deployment or application configuration was changed.

## Verification actually executed

- `python scripts/build-open-heart.py`: both four-page reading PDFs, four duplex PDFs, two teacher PDFs; all reading text bounds; QR decoded from both languages' reading page and A4/Letter outside spreads; back text direction `(-1,0)`.
- `python scripts/check-open-heart.py`: exact Bible.com paragraph matches; all 27 edition-specific verse entries; full passage in teacher keys; student prose preservation; independent all-direction word-search scan (one occurrence per target); every PDF text span within page bounds; independently rendered imposed panels compared to reading pages.
- `npm run check:bilingual`: pass, 28 lessons, 7 stories.
- `npm run check:scripture`: existing repository guards pass. These cover existing guarded lessons; the new lesson is additionally guarded by `check-open-heart.py` and browser Scripture equality.
- `npm run check:assets`: pass, 148 unique referenced assets.
- `npm run lint`: exit 0; 31 pre-existing image-element warnings, no errors.
- `npm run build`: final retry exit 0; compiled, TypeScript checked, 177 static pages including `/lessons/open-heart`.
- `node scripts/test-open-heart-browser.mjs`: EN/RU at phone 390×844, iPad emulation 820×1180, desktop 1366×900. Wrong/correct matching, touch-drag word selection immediately followed by keyboard then further selections, all six picture coordinates, decoding, ordering, motives, completion, reload, separate-language saves, reset, private-text non-storage, PDF signatures, no document overflow and zero page errors. Malformed storage, fully blocked storage, stale readable storage with failed writes pass.
- `node scripts/test-open-heart-accessibility.mjs`: keyboard picture search and full rendered passage equality pass EN/RU. Selected-and-hovered control contrast 10.39:1.
- `node scripts/check-layout-latest.mjs` and `BASE_URL=http://127.0.0.1:3217 QA_DIR=docs/open-heart/qa/catalog node scripts/test-layout-latest-browser.mjs`: pass; 36 recorded cases preserving prior links, catalog layouts, sticky bars and video fallback.

Machine-readable reports and final logs are under `docs/open-heart/qa/`. Local PNG evidence is ignored by Git to avoid adding a large screenshot bundle; it remains in that directory and is reproducible with the scripts. The source Bible.com HTML cache is outside the repository at `/home/helper/.hermes/cache/scratch/open-heart-scripture/`.

## Remaining release gates / limits

1. **Not pushed or deployed.** Parent review and authorized publication must precede distributing the QR booklets; production QR resolution and live interactions are not claimed.
2. Next.js **16.4.2 emitted a known-security-vulnerability warning** and initially stopped after compilation/static generation. The instructed retry completed, but this is not a security fix. No dependency upgrade was made in this lesson scope. Review/resolve the framework advisory in a separate scoped change before release.
3. Browser device emulation, not physical iPad/iPhone testing. No physical printer/duplex proof was performed.
4. Art is approved-scene reuse, not newly generated custom artwork. Parent can review whether a future Gracie-visible illustration is desirable; current captions honestly distinguish off-frame action.

## Reproduce

From this worktree: `python scripts/fetch-open-heart-scripture.py` (network/source cache), `python scripts/build-open-heart.py`, `python scripts/check-open-heart.py`, repository checks/lint/build, then `npm run start -- --hostname 127.0.0.1 --port 3217`. Browser scripts accept `BASE_URL` for the same checks against an authorized later deployment. Python dependencies: requests, beautifulsoup4, pymupdf, reportlab, pillow, zxing-cpp. The existing node_modules was reused via a local untracked symlink; no package manifest changes.
