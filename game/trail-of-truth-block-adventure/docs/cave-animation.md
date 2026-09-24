# Cave animal animation pass

## Scope

Lion/bear animation improvements on top of the sequential cave campaign. Source GLBs are unchanged and contain no skins or animation clips. This is procedural whole-body animation, not newly rigged limb animation. Player, clothing, carry, weights, source textures and unrelated local work are untouched.

`cave_animal_motion.gd` owns presentation only: subtle idle breathing, target-facing rotation, gathering weight before the warning ends, species-specific lunge arcs, damped recovery, and distance-driven retreat weight shift. Exponential pose blending avoids abrupt phase changes. The visual wrapper never moves the gameplay actor. Pose offsets use a conservative ground-clearance envelope; collision and damage remain with the campaign actor.

Campaign movement now eases the existing lunge across the same 0.7-second interval. Retreat is an eased 1.2-second trip to the authored rear position, rather than constant-speed movement that could hide an animal before reaching it. Existing warning and recovery windows, prerequisites and health rules are unchanged. Pause stops simulation-driven animation time; restoring a checkpoint clears residual facing, lean and stride.

## Verification

Canonical native Godot 4.7.2. An isolated HEAD archive received only these candidate changes; unrelated dirty player/world/carry/export work was excluded. Native editor import had no errors. All 19 native headless regression suites passed using isolated save directories and `--fixed-fps 60`, including the full input-driven cave mission and original rescue route. This deterministic mode is not performance/device evidence.

New `tests/cave_animal_motion_test.gd` verifies both species' idle/anticipation/lunge/recovery, target-facing orientation, finite bounded poses, no animation-side gameplay movement, reset, pause freezing, the real drive-away window, and exit arrival before hiding/advancing.

`tests/cave_animal_preview.gd` generates a native-rendered animation study under `/tmp/jd-animal-animation-review/`. It deliberately poses the actual game models to inspect the motion; it is not input traversal evidence. The rendered study contains 378 frames at 30 frames/second across lion and bear, and sampled warning/lunge/recovery/retreat frames were visually inspected. Native full-route input coverage is separate. Preview MP4 has no audio.

Evidence: `/tmp/jd-animation-tests/results.json`, per-suite logs alongside it, and `/tmp/jd-animal-animation-review/animal-motion.mp4` (temporary local review artifacts, not a game export).

```sh
XDG_DATA_HOME="$(mktemp -d /tmp/jd-motion-XXXXXX)" /home/helper/tools/godot-4.7.2/godot --headless --fixed-fps 60 --path . --script tests/cave_animal_motion_test.gd
XDG_DATA_HOME="$(mktemp -d /tmp/jd-motion-render-XXXXXX)" timeout 90s xvfb-run -a /home/helper/tools/godot-4.7.2/godot --path . --rendering-method gl_compatibility --fixed-fps 30 --script tests/cave_animal_preview.gd
```

## Remaining limits

The models still lack independent articulated legs, head and tail, so this is a motion/readability improvement rather than final quadruped locomotion. Genuine gait cycles require a properly authored animal rig or replacement licensed rigged assets. No browser, WKWebView, physical-iPad, device-performance or child-playtest claim. No paid APIs, export, sync, deployment or push.
