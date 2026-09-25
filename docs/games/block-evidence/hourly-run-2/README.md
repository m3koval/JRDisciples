# Run 2 — bridge timber readability

## Integrated change

The opening's surviving plank tops were below the continuous bank terrain (.028 high). Their old top was negative, so the broken bridge read mostly as four posts and empty water. Raised the short surviving boards above the terrain and varied their torn ends, leaving the central gap fully open. Added a seated cross-bearer and gave the repaired panels matching lengthwise, beveled, grain-textured boards and transverse support members.

Only `scripts/bridge_craft.gd` and presentation calls in `scripts/world.gd` changed. Original collision shapes, repair-stage ownership, rewards, saves, controls, garden, characters, irrigation and Scripture remain untouched. This is **presentation improvement**, not a new engineering/construction mechanic.

## Evidence distinctions

- `bridge-comparison.png`: matched normal player camera before/after, both broken stage zero; below are partial/repaired seeded states.
- `native/jd-opening-run2-before-{1280,720}.png`: captured from this run's baseline before edits.
- `native/jd-bridge-stage-{0,1,2}-{1280,720}.png`: frozen-source normal-camera composition fixtures; same player position/yaw/pitch, landscape/portrait. Stage-zero output includes a replay-to-zero check. These are seeded presentation, not input-driven repair screenshots. In seeded stages 1/2, the transient discovery speech remains from stage zero; do not treat fixture speech as routed story acceptance.
- `native/results.json`: each original/additive test has its actual exit code, expected marker, command and error scan. `opening_art_playthrough` runs the original normal-entrypoint, physical walking, pickup, repair, rescue and Russian completion assertions; it suppresses continuous rendering for efficiency, separate from the composition captures.
- `native/tested-source-sha256.json`: game scripts, shaders, settings, tests and assets frozen before/after native tests. Release manifest independently binds the Web export to runtime sources/assets.
- `browser/checks.json`: full exported hosted route, 65 passing checks, no runtime errors. Real touch movement/pickup/repair/crossing/rescue, Russian completion, replay/reload, portrait and simultaneous two-thumb inputs. `browser/desktop-bridge.png` is the physical touch-route repair result, not seeded composition.
- `web-export.log` and `app-sync.log`: genuine Godot Web export plus webpack/TypeScript and 99 offline route bundle checks. No Xcode/device build is implied.
- Final readback: `python tools/trail_of_truth/check_run2_evidence.py` passes (137 unchanged game files, seven native jobs, 65 browser checks). It was also run while the browser was incomplete and correctly failed on missing `browser_complete`. `check_block_release.py` passes against the fresh export.

## Acceptance

Visible broken planks now explain the missing crossing; repaired panels use a consistent timber construction language. Partial/repaired stages remove their corresponding damaged members; replay restores them. Native RED→GREEN was observed for the new additive contract; existing assertions were not weakened.

This does **not** meet the whole-scene reference floor. Primitive trees/hill silhouettes, broad flat banks and overall lighting/material richness remain unfinished. No owner visual approval, child enjoyment, physical iPad performance or Xcode/device verification is claimed. Claude retains device QA. No paid requests or purchases were made.

## Reproduction

```sh
python tools/trail_of_truth/verify_bridge_timber.py
```

Uses Godot 4.7.2, Xvfb, fixed 60 Hz and fresh XDG data/config/cache per test. Historical before-images are optional on later checkouts; current captures and test completion markers are mandatory. Preserve this archived baseline before rerunning into the same evidence directory.
