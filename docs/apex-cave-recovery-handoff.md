# Apex cave recovery — review candidate

Based on Claude's `681b4ce` on `apex/jd-claude-blender-handoff`. Work is isolated on `apex/jd-cave-quality-recovery`; no change to main, Claude's branch, signing settings, or installed iPads.

## Implemented

- Replaced the **visible** rectangular cave walls/roof/front with a continuous, asymmetric ring-built stone throat/vault and recessed back wall. The established box collision authority is retained, not represented as final art.
- Kept the original doorway opening and combat route. Chamber side faces are behind the original collision plane so ordinary side-wall movement cannot enter the new visible stone.
- Added a connected entrance stone apron, small seated fractured crown faces and perimeter talus. Reduced inter-cave scan piles and moved them away from the throat. Existing CC0 Poly Haven materials/assets are reused.
- Removed the floating waypoint cube while the cave chapter is active; objective/map/clue guidance remains.
- Repositioned and resized the clue boards into the clear side of the throat. Corrected support-post/text coplanarity. The exterior/threshold portrait fixture now contains the readable clue, instead of clipping it against stone or the screen edge.
- Added instance-local material reveal for Compatibility rendering: entering the cave blends the actual actor materials rather than suddenly popping in the whole model. Logical animal visibility/defeat state remains separate. This is unit/integration-tested; final screenshot captures are not temporal animation proof.

## Animal review: rejected alternative

The archived lion/bear GLBs were actually loaded, rendered and dimensionally inspected. Neither has skins/clips or separable limbs. A static swap would discard independently articulated walking/attacks. They were **not integrated**. See `docs/games/block-evidence/apex-cave-recovery/animal-review/README.md` and its four native comparison renders. The current block-shaped animals remain a known art limitation.

## Verification / evidence

Final evidence is in `docs/games/block-evidence/apex-cave-recovery/release/`:

- `results.json`: native job exit codes, completion checks and runtime error lists.
- `source-sha256.json`: frozen source/model/material identity; runner fails on source drift.
- Six `cave-*.png` captures: entrance, threshold and interior, each 1280×720 and 720×1280.
- `before-after.jpg` in the parent folder compares Claude's Mac captures to Apex's Linux captures. Same authored positions/viewports; different OS/renderer hosts are labelled. Seeded capture scenes are composition evidence, not input traversal.
- The independent original `cave_input_playthrough` drives the physical encounter route; combat, victory, motion, escort and garden checks are separate from the visual fixture.
- `browser-smoke/results.json` covers the rebuilt static app's real iframe boot, trusted touch start/map, keyboard movement and runtime errors. It is **not** a full browser cave playthrough or device test.

Reproduce from the repository root:

```sh
CAVE_QA_TAG=review python tools/trail_of_truth/verify_cave_recovery.py \
  cave_reveal_test cave_presentation_test cave_shell_geometry_test \
  cave_input_playthrough cave_campaign_test cave_combat_test cave_victory_test \
  cave_animal_motion_test cave_block_animal_test escort_collisions garden_art_test \
  cave_recovery_capture
python tools/trail_of_truth/check_block_release.py
npm run app:sync
```

`GODOT_BIN` overrides the Linux runner executable. Mac users should build using their installed matching Godot toolchain; existing Apple signing settings must be preserved.

## Build handoff

The embedded Web export is rebuilt from this source, not the older cave package. `release-manifest.json` binds source and engine artifacts. Static app build / Capacitor sync and exact artifact-copy checks are separate from native scene tests. Consult the included build evidence for the actual outcome; Linux sync is not Xcode compilation or installation.

## Still below the target

This is a bounded structural/readability improvement, **not owner-approved final cave art**. The entrance apron still has broad faceted surfaces; the rock palette/material transitions need more art direction; the interior remains sparse; the exterior needs coherent planted hillside/camp composition. The lion/bear finish is unresolved. A world-space clue board can still enter a close interior camera's edge; its entrance/threshold readability is improved, not globally screen-clamped. Free cave selection/new progression is unchanged. No physical iPad performance or full browser cave traversal is claimed.

No paid generation, purchase, or download was made for this pass: **$0 new spend**. Existing aggregate authorization is not increased or reset.
