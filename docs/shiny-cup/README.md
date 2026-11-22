# Shiny Cup v3 web release

Canonical: https://www.juniordisciples.com/lessons/clean-inside-outside

## Source and scope
Approved `/home/helper/outputs/jd-shiny-cup-flow-v3/` is authoritative, not the earlier Open Heart prototype. `booklet.json`, `scripture.json`, `puzzles.json`, three original PNGs and eight PDFs are copied byte-for-byte. `preservation.json` locks their hashes. All 17 narrative paragraphs in each language, expanded no-applause ending, three Connect paragraphs, gospel and messenger teaching remain. Artwork retains 1024×768 proportions. Picture boxes come from v3's `build_v2.py` key: toothbrush, mitten, fish, teapot.

Five navigable story/activity stages offer Bible study and answer-hidden recall, the original 15×15 twelve-target eight-direction searches, three virtue/repair scenarios acknowledging overlap, coordinate picture search with enlargement and keyboard cursor, correction sequencing, and private response. Adult notes contain the eight-minute Find the Camel activity, full Matthew 23:13–36 and edition-specific verse 14 explanation. ESV English and RST 167 Russian quotations are unchanged.

Progress alone persists per language; reflection stays in component memory and clears on language switch/reload. Storage is normalized and tolerates malformed data, blocked reads and stale data with failing writes.

The new lesson leads both catalogs and data-driven homepage latest links. Open Heart remains accessible and in the catalog at position nine, not a competing latest promotion; its route/content were not deleted. Prior adjacent lesson feature order is guarded.

## Verification
- Production build passed on Next 16.4.6; lint has zero errors and 31 existing image warnings (within hosted gate).
- Every command in `.github/workflows/quality.yml` passed locally, including SEO, older lesson guards, bilingual, Scripture, games and assets.
- Production dependency audit: zero vulnerabilities. Initial full install reported development-tool vulnerabilities; no unrelated dependency changes made.
- `node scripts/check-shiny-cup.mjs`: byte preservation, exact counts, independent word search solution, bilingual fields, catalog and sitemap.
- `BASE_URL=... QA_DIR=... node scripts/test-shiny-cup-browser.mjs`: 22 cases; both languages at desktop, iPad and phone portrait/landscape; wrong/right paths, every word and object, study/recall, scenarios, sequence, reset/reload, privacy, storage faults, full rendered quotes/narrative, all eight downloaded PDF signatures/hashes, canonical, sitemap and latest links.
- `BASE_URL=... QA_DIR=... node scripts/test-shiny-cup-inputs.mjs`: real CDP touch drag → keyboard → touch transitions; successful keyboard picture selection; language progress isolation and transient reflection.
- `PDF_DIR=... python scripts/check-shiny-cup-pdfs.py`: downloaded exact approved PDFs, narrative/Scripture extraction and page dimensions.
- `BASE_URL=... node scripts/test-layout-latest-browser.mjs`: shared feature/catalog layout and video failure regression passed.

Local final evidence: `qa-release/`; earlier initial failure retained in `qa-local/failure.json` (test targeted an offscreen picture point in phone landscape; harness now scrolls the actual coordinate into view and asserts hit-testing). A later visual review corrected completed picture feedback so extra exploratory taps do not replace success with retry.

Screenshots visually reviewed for Russian phone hero, iPad story, Russian selected scenario controls, phone word grid, and four correctly marked picture objects. Actual production evidence and deployment handles are recorded in `publication.json` after release.

## Limits
Browser emulation is not physical iPad/iPhone testing. No physical printing or child-comprehension trial was performed. Bilingual expansion is editorially reviewed, not independently native-speaker certified. Approved teacher PDFs deliberately retain their historical print-first note; website copy clarifies that the QR lesson is now live without modifying approved bytes. No new art generation or spending.

Executed by Hermes Agent under the user's scoped publication approval; existing configured Git attribution retained.
