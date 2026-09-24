# Water chapter scale / distance review

Measured from actual `main.gd`, Godot 4.7.2 native GL compatibility / llvmpipe, after 30 physics frames of idle. Rendered skinned bounds use `bake_mesh_from_current_skeleton_pose`; raw imported mesh AABBs are NOT reliable for these rigs (100x bind-transform discrepancy).

| Person | Before rendered height | Before feet Y | After height | After feet Y |
|---|---:|---:|---:|---:|
| Michael (unchanged) | 1.3405 | -0.00017 | 1.3405 | -0.00017 |
| Mira | 1.0333 | 0.61502 | 1.7000 | ~0 |
| Oren | 1.1878 | 0.66027 | 1.7800 | ~0 |

Root cause: water NPCs were treated as centered unit models with arbitrary `.615/.66` scale AND half-scale vertical offsets. Actual rigs are feet-origin adults. Production now computes posed skin bounds on CPU (including bone bind transforms, available during ready/headless), normalizes stature, and subtracts measured minimum Y. Independent rendered-bake test verifies the result. No player asset, clothing, rig, carry, movement or camera changes. Shared village instances untouched.

Player capsule remains height 1.25, radius .27, center .625. Water NPC capsules already existed on layer 2 and already blocked the player; preserve radius .30, match heights to 1.70/1.78. Only newly added collision is exact individual bench timber boxes, not a blanket underside box. Bed crossing at z8.5 remains clear and tested. Context remains 2.1m: reachable outside NPC capsule and absent at 2.2m; existing full keyboard traversal passes. This is a scale/grounding and local collision correction, not a physics overhaul.

## Props / projection

Measured filled harvest basket bounds .795 x .611 x .754m (rim diameter .754m), an intentionally large shared harvest container, not a handheld cup. Dry mature cabbage bounds .735 x .274 x .716m; soil top .11m. Potting bench timber top .855m, appropriate working height; keep existing dimensions and bed arrangement. No indiscriminate shrinking. Decorative baskets/leaves remain non-solid to avoid closing the accepted garden route.

Perspective camera unchanged: FOV58, spring5.8, pivot1.05 above feet. Normal depth can still make the closer child appear relatively larger; same-depth calibration removes that ambiguity. Bench approach camera distance measured 5.7999997m, no new retraction there. This is a bounded approach test, not an exhaustive orbit test. Label font36→28, pixel size .008→.004, distance13→10m; label height follows adult stature +.25m.

## Evidence / reproduction

Fresh XDG_DATA_HOME per process. Native tests: `xvfb-run -a /home/helper/tools/godot-4.7.2/godot --rendering-method gl_compatibility --path game/trail-of-truth-block-adventure --script res://tests/scale_distance_test.gd`. Requires renderer: headless intentionally rejected because renderer skin bake is unavailable there.

- `/tmp/scale_distance_test.log`: stature, grounding, body collision, bed corridor, contextual reach.
- `/tmp/water_campaign_test.log`: WATER_FAILURES=0.
- `/tmp/water_input_playthrough.log`: WATER_INPUT_FAILURES=0 (real input / physics, headless execution).
- `tests/scale_distance_capture.gd`: actual main scene native landscape, portrait, bench approach, and explicitly staged same-depth camera; outputs `/tmp/jd-scale-{landscape,portrait,bench-approach,same-depth}.png`.

Normal screenshots visually inspected: feet grounded, adult silhouette larger, readable non-dominant labels; foreground cabbage still enlarged by perspective. No claim of physical-device validation. No publishing or commits.
