# Opening landscape recovery — bounded native milestone

Recovered the interrupted worker's landscape/shore implementation, inspected the `before/` and `pilot2/` captures against `/home/helper/.hermes/cache/images/img_218666fd9684.png`, then corrected the candidate before final verification.

## Integrated changes

- Replaced rounded perimeter scenery with continuous authored escarpment and distant ridge meshes; retained original physical boundaries.
- Added layered local outcrops, corrected rock side/cap winding (outward/upward normals), and added regression assertions for both.
- Added recessed cliff buttresses outside the playable rectangle and reduced artificial uniform horizontal shader striping.
- Recovered the scalloped, stepped shore shelves and dry-bank transitions, retaining the bridge exclusion, flat walkable terrain and original bridge stages.
- Added cliff footprint and mesh-budget assertions without replacing original terrain assertions.

## Frozen-source native evidence

Engine: `/home/helper/tools/godot-4.7.2/godot`; llvmpipe GL compatibility; `LP_NUM_THREADS=2`; `--fixed-fps 60`; independent temporary XDG directories. This is simulation-clock evidence, **not a measured 60 FPS/device-performance claim**.

Run with `LP_NUM_THREADS=2 FOLIAGE_EVIDENCE=opening-recovery JD_ART_TAG=<tag> python tools/trail_of_truth/verify_opening_foliage.py <tests>`:

- `final-checks`: `opening_terrain_test scenery_clearance opening_art_playthrough bridge_timber_test` — all PASS.
- `final`: `opening_foliage_capture` — PASS; four images inspected.
- `final-preservation`: `opening_foliage_test garden_art_test` — all PASS.

Each directory includes per-job logs, `results.json`, and `tested-source-sha256.json`. All three source manifests match; runner verifies no source drift across each run. Exits are zero, required completion markers are present, and no script/engine errors or failed assertions were found. X11 input-method and unsupported VSync warnings are retained in logs.

The original opening playthrough physically walks the route, gathers both logs, completes/crosses the bridge, discovers/calls/escorts the lamb, rescues it, and verifies localization. It uses checkpoint-only rendering; the separate captures use seeded positioning through the normal main scene/player camera and preserve broken bridge stage 0. Captures are not continuous-route or hardware evidence.

Final images:
- `final/jd-foliage-final-bridge-1280.png` (1280×720)
- `final/jd-foliage-final-bridge-720.png` (720×1280)
- `final/jd-foliage-final-grove-1280.png` (1280×720)
- `final/jd-foliage-final-grove-720.png` (720×1280)

## Remaining scope — not whole-opening visual approval

- HUD untouched: broad dark objective panel, bulky right-side buttons, floating story text, portrait composition and contextual hierarchy need the parent-owned HUD pass.
- Materials still below the supplied target: pale/chalky rock, visibly triangulated broad cliffs, flat grass/path appearance and simple water/shore blending need coordinated material/lighting refinement. Cliff geometry is improved, not final premium environment art.
- Existing foliage silhouettes, sparse grove planting and yellow block-like object remain visible; no accepted rigs/crops or task objects were replaced to disguise these gaps.
- No full web/app build, export, physical-device test, merge, push or deployment performed. Parent owns those gates.
- No purchases or paid generations. Existing garden, rigs, gameplay collision/state/save/localization authority retained.

`before/`, `pilot/`, and `pilot2/` are recovered historical evidence, not current-source verification. The failed pilot is preserved honestly.
