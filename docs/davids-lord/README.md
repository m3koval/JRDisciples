# David’s Lord — approved v6 print-to-web lesson

Route: `/lessons/davids-lord` (public, EN/RU). Listed first in both lesson directories, retaining Why Did Jesus Come → Who Am I → Alone with God immediately afterward. No existing homepage feature was removed.

## Source boundary

Exact approved source: `/home/helper/outputs/jd-davids-lord-v6`. `booklet.json`, `puzzles.json`, `scripture.json`, `luke.json` preserve the approved content byte-for-byte. `teacher.json` contains the actual teacher-note literals extracted from v6 `build.py`. Scripture is dark red; approved story emphasis is highlighted. The four approved story sections and headings are unchanged.

Only `complete-scene.png` and final v6 `odd-scene.png` were converted to lossless WebP; decoded RGB pixels were verified identical. The final odd-scene source SHA-256 is `fddec951bd00e558ad064a546bc4b9dc84690c40a9e69a528b483a7b1ac60ce0`. No rejected earlier page-3 art is published. `assets.json` records source/output hashes. `source-lock.json` locks copied content and all seven v6 PDFs for portable CI verification.

## Interaction contract

1. Draw actual touch/mouse strokes on the shared paper, clipped to its blank region; six crayons, adjustable width, undo, optional accessible flower stamp; explicitly finish the drawing.
2. Independent EN/RU hard 15×15 searches, 12 words, all eight directions. Drag or tap endpoints; keyboard arrows/Enter; mobile horizontal-pan controls. Selection is validated against exact approved endpoints in either order.
3. Color with actual strokes and find/circle all four absurd objects on final art. Crocodile, rocket+astronaut counted together, firework, octopus. Hitboxes use original 1024×768 coordinates. Keyboard search cursor and keyboard color dots; enlargement with pan controls. Completion needs coloring AND all four objects.
4. Match each number to its letter, then separately solve every numbered message cell. Full alphabet code is available, but the message and answer key stay collapsed initially. Explicit validation requires both matching and message completion.

All puzzle resets and a confirmed whole-lesson reset are present. Optional hints and answers are distinct. Four activity completions unlock the final completion action, which leads back to the lesson library. Reflection is not submitted anywhere. EN/RU work is independent while the page is open; **no persistent save is implemented**. The UI explicitly says reloading starts fresh.

## Verification

- `node scripts/check-davids-lord.mjs`: source locks, exact source equality when available, 15×15 grids, twelve targets, eight directions, decoder consistency, four hitboxes, final-art hashes, seven original PDFs.
- `node scripts/test-davids-lord-browser.mjs`: Chromium touch events, drawing/undo, all word paths, keyboard endpoints, four coordinate hits, real coloring, decoder pairs/cells, wrong attempts, completion, resets, language independence, fresh reload, mobile pan controls, enlargement, 32 phone/tablet portrait/landscape screenshots, served asset/PDF hashes, no runtime errors.
- `npm run check:bilingual`, `npm run check:scripture`, `node scripts/check-alone-with-god.mjs`, `npm run lint -- --max-warnings=32`, `npm run build`.
- Hosted execution: `BASE_URL=https://www.juniordisciples.com EVIDENCE_DIR=<output-directory> node scripts/test-davids-lord-browser.mjs`.

Local evidence is under `/home/helper/outputs/jd-davids-lord-web-qa/`; failed early runs are retained separately. The initial dev-server failure was Turbopack rejecting a dependency symlink; local webpack and the production build work normally. Touch/keyboard interleaving exposed stale compatibility-click suppression; pointer selection now happens on pointer-up, with click handling reserved for keyboard activation. A sticky site header initially covered the active heading after navigation; a scoped scroll margin fixes it.

Device boundary: touch/browser emulation is tested, not physical iPad Safari. Existing unrelated repository image warnings remain; no new lint errors or warnings are introduced.
