# Trail of Truth in the existing Junior Disciples app

## Scope

This is an addition to the existing Capacitor iOS app, not a replacement app.
The app shell, navigation, Disciple Journey, other games, Capacitor settings,
auth, signing, and dependency versions are unchanged.

- Entry: first English/Russian card on `/games/`.
- App route: `/games/trail-of-truth/`.
- Same-origin engine: `/games/trail-of-truth-block-adventure/build/index.html?lang=en` (or `ru`).
- Content: The Lost Lamb quest, touch joystick, map, cosmetic camp flag.
  The card explicitly says salvation is not earned with points.
- Source: `game/trail-of-truth-block-adventure/`, copied without `.godot` caches.
- Web export: `public/games/trail-of-truth-block-adventure/build/`.
- Wrapper reserves top, bottom, and landscape side safe areas. Fullscreen is
  optional; its localized fallback leaves the game playable in the wrapper.
- Iframe policy stays `allow-scripts allow-same-origin allow-pointer-lock`, with
  `autoplay; fullscreen; gamepad`; no external host or parent message bridge added.

Copied from `/home/helper/work/JRDisciples-trail-of-truth`. The latest upstream
sticky-footer modal update is included. No source-workspace files were modified
by this integration. The imported engine source and export remain byte-for-byte
copies; only the host wrapper and integration checks differ.

## Build and verify the app

From this repository, with dependencies installed:

```bash
node scripts/check-trail-of-truth.mjs
npm run check:bilingual
npm run check:scripture
npm run check:games
npm run check:case-russian
npm run test:quests
npm run check:assets
npx eslint app/games/page.tsx app/games/trail-of-truth/page.tsx scripts/check-app-bundle.mjs scripts/check-trail-of-truth.mjs eslint.config.mjs
npm run lint
npm run app:sync
```

`app:sync` runs the existing `build:app` command
(`CAPACITOR_BUILD=1 NEXT_PUBLIC_APP_SHELL=1 next build`), then `cap sync ios`,
then `npm run check:app`. The resulting static content is in `out/` and the
synced native web bundle is in `ios/App/App/public/`.

The app bundle guard requires the game route and engine HTML, JS, WASM, PCK,
and release manifest. It checks exact SHA-256 equality from `public/` to both
`out/` and the iOS bundle, and checks exact route equality from `out/` to iOS.
Existing Journey/local-reference/all-exported-file checks are preserved.
The source guard independently verifies the manifest's source and artifact
fingerprints, engine formats, host policy, Scripture strings and provenance.
Its accepted Michael model hash is pinned to the upstream model fingerprint
rather than requiring the unrelated legacy 3D-proof project.

## Rebuilding the engine (only after intentional source changes)

Use Godot 4.7.2 with matching installed Web export templates. These are the
commands for this workspace; override the binary path for another machine:

```bash
export GODOT_BIN=/home/helper/tools/godot-4.7.2/godot
"$GODOT_BIN" --headless --path game/trail-of-truth-block-adventure --editor --import
"$GODOT_BIN" --headless --fixed-fps 60 --path game/trail-of-truth-block-adventure --script res://tests/playthrough.gd
"$GODOT_BIN" --headless --fixed-fps 60 --path game/trail-of-truth-block-adventure --script res://tests/edge_cases.gd
"$GODOT_BIN" --headless --fixed-fps 60 --path game/trail-of-truth-block-adventure --script res://tests/review_regressions.gd
"$GODOT_BIN" --headless --path game/trail-of-truth-block-adventure --export-release Web
python3 tools/trail_of_truth/check_block_release.py --stamp
node scripts/check-trail-of-truth.mjs
npm run app:sync
```

Do not stamp a stale export simply to bypass a source mismatch. Browser/touch
acceptance and reward tests remain separate from the fingerprint guard. Keep
Godot `.godot/` import caches out of version control and future source copies.
The copied `scripts/test-trail-block.sh` runs import, three native regression
suites and the existing release guard; it does not re-export or stamp for you.

## Executed integration results

- Source/artifact guard: PASS, including the latest sticky-footer export.
- `npm run app:sync`: PASS. Next production compilation, TypeScript, static
  generation, Capacitor asset/plugin sync and app bundle checks all completed.
  Bundle checker reported 99 offline index routes (including engine HTML).
- Targeted ESLint: PASS with no output.
- Full ESLint: exit 0, 0 errors, 36 existing image-element warnings outside the
  added files. Generated engine loader files are narrowly excluded from lint.
- Bilingual parity: PASS (18 lessons, 7 stories and core activity data).
- Scripture localization: PASS (4 Case for Christ and 6 fully guarded lessons).
- Games, Russian-copy, quest-link and image-asset gates: PASS.
- `git diff --check`: PASS.

Pinned exported engine fingerprints at integration:

```text
index.wasm  fc74679e3b97f76878947fcd4fbe1268cbfa6188182a2e33bbc3f5dc9bfa57d0
index.pck   fe9a56660d2c05f65f16d68b15099245e63ab4ed174deba9b39f3e25eb1c5ad6
```

This proves app packaging and exact copying, not an iOS runtime acceptance.
This integration ran on Linux: no Xcode/Apple SDK build, simulator/device run,
signing, archive, TestFlight or App Store submission was performed. WKWebView
WebGL/WASM loading, touch behavior, safe-area composition, save persistence and
performance still require iOS device QA. Parent workflow owns source-game
browser/reward acceptance and the integrated static-server browser check; this
note does not claim those tests ran here. No deployment, commit or push occurred.
