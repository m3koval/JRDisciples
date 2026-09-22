# Lost Lamb earned rewards — integrated app acceptance

## Implemented

- Existing Junior Disciples app integration, first Games card in EN/RU; no separate hosting.
- Rescue sequence: tracks -> crossing -> repair -> find lamb -> lead it home.
- Adventure Points: tracks 10, bridge 20, lamb 20, home 50; optional garden 30.
- One-time accomplishments; duplicate awards and replay cannot farm points.
- Camp flag color selection after rescue (blue/gold/green), saved locally.
- Reward book and sticky return/choice footer, EN/RU.
- Camp flock, earned flag and optional garden visibly change home area.

## Verified

- Final integrated static app at localhost:8117: browser test process exited 0, 42 unique checks PASS, no captured runtime errors.
- Browser exercised full keyboard rescue, 100 rescue points, selecting flag, replay/reload persistence, Russian completion, and portrait/landscape touch movement, jumping, camera, map/pause controls. This is NOT a full touch-only mission playthrough.
- Native reward suite: 36 checks PASS, including duplicate award rejection, corrupt save handling, garden award, persistence and legacy migration.
- Native mission traversal and edge-case suite PASS, including optional seed-jump route and water recovery.
- Native sticky-footer fixture: 8 geometry/touch-size checks PASS at 390x783 and 844x332. Earned state is an explicit fixture for layout only.
- Visual review: integrated app game entry and final portrait reward footer inspected. Choices and return action are visible without scrolling.
- App bundle checker: 99 offline index routes PASS, exact engine artifact hashes match public/out/synced iOS bundle.
- Parent reran source/export guard, bilingual, Scripture, Games checks and git diff whitespace checks: PASS.

## Evidence

Primary browser JSON and screenshots: `docs/games/block-evidence/ios-bundle-rewards/` in the source game workspace `/home/helper/work/JRDisciples-trail-of-truth`.
Final integrated PCK SHA-256: `fe9a56660d2c05f65f16d68b15099245e63ab4ed174deba9b39f3e25eb1c5ad6`.

## Boundaries before children play

This is the existing app's integrated source/static bundle, not an installed update or signed IPA. No deployment, push, Xcode build or physical iOS test was performed. Build/run the updated project on the family's iPad and confirm WKWebView WebGL/WASM load, smoothness, touch camera, audio, save/reopen, rotation/safe areas and offline launch.

Progress is local to the app/browser installation and shared by siblings on that installation. There are no separate child profiles or cloud sync. Saved rewards persist; unfinished missions restart. Points track adventure actions, not salvation or God's approval.
