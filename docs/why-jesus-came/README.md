# Why Did Jesus Come? — release record

## Scope
- Dedicated bilingual story: `/lessons/why-did-jesus-come`.
- First homepage feature, before the existing hero, and first EN/RU lesson-directory card. Existing features remain in order after it.
- Eleven navigable stages alternate connected story and five real discovery puzzles. There is no readiness score or required pass to read the next scene.
- Five puzzles: five genuine image differences, drag/tap-endpoint word search, connected eight-entry crossword (independent Russian layout), four camouflaged hidden objects, and letter-elimination hidden message.
- Optional hints, passage revisit, separate collapsed grown-up answer keys, reset, touch/keyboard controls and independent EN/RU device progress. Private prayers are not collected.

## Sources and editorial gate
The approved printed story is retained in `booklet.json`, with the opening quotation expanded to the **full** 1 John 1:3–4. All four displayed passages are complete: 1:3–4, 2:1–2, 1:9, 5:11–13. The eight ESV/RST quotations match the Bible.com fixtures from the approved print source. `scripture-fixtures.json` retains URLs and original captured HTML hashes.

Source booklet: `/home/helper/outputs/jd-why-jesus-came-v4/`.
Source sermon: `sources/sermon-full-extracted.txt` in that directory. Its three blessings shape the story: joyful fellowship with the Father and Son; the righteous Advocate and sacrifice for sin; assurance of eternal life through faith in the Son.

Whole EN/RU narrative reviewed in scene order: birdhouse purpose → reading John's witness → fellowship/joy → Michael's unkindness → why he can come to God → cross/resurrection/Advocate → honest confession and repaired behavior → assurance grounded in God's gift in Jesus, not the afternoon's performance. The birdhouse is not an eternal-life metaphor. The modern scene is identified as imagined in grown-up notes. Exact Bible words and references are dark red, distinct from explanation.

## Artwork
Original approved art only, no generation charges. `assets.json` binds source PNGs and lossless WebP outputs by SHA-256. The two difference images preserve exactly the five changed regions; original hidden-object silhouettes/geometry are retained. Keyboard ring and optional enlargement supplement direct picture taps. No hotspot location hints appear until help is explicitly opened.

## Verification commands
- `node scripts/check-why-jesus-came.mjs`
- `node scripts/test-why-jesus-came-browser.mjs`
- `npm run lint -- --max-warnings=32`
- All existing `.github/workflows/quality.yml` checks, followed by `npm run build`.
- Hosted browser run: `BASE_URL=https://www.juniordisciples.com EVIDENCE_DIR=<output-dir> node scripts/test-why-jesus-came-browser.mjs`.

Browser evidence is outside deployable source: `/home/helper/outputs/jd-why-jesus-web-qa/`. The runner records each case, original failures, screenshots, and runtime errors. It exercises actual rendered controls rather than injecting solved state. Layout coverage includes both languages, phone and iPad portrait/landscape, all eleven stages. Storage tests cover malformed JSON, invalid structures, and readable stale storage with rejected writes. The prayer listing guard was updated to assert the new first card **plus** preserved Who Am I/prayer adjacency, not removed.

## Boundaries
Browser dimensions are emulations, not physical iPad/Safari or child usability testing. Original print files and homepage QR destination are unchanged. No separate duplicate story page was created: the lesson itself is the complete interactive story. `npm ci` reported existing dependency advisories (21 moderate, one high); no dependency/configuration changes were made in this scoped lesson release.
