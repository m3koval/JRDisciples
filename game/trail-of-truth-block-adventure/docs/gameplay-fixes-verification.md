# Gameplay and three-cave chapter verification — 2026-09-24

> Historical initial-chapter verification below. Current combat uses attacker HP and decisive defeat with a non-graphic poof, not unharmed retreat. See [cave-combat.md](cave-combat.md) for the current mechanics, content direction, fresh tests and build handoff. The original art and test counts below describe that earlier snapshot.

## Implemented

The original tracks → bridge → lamb rescue continues into the existing flock scaffold: gather three sheep, pasture escort, two-board fence repair, shelter/gate, return and counting. Completion now offers the three-cave chapter as its primary next action; optional garden exploration remains available.

The new `scripts/cave_campaign.gd` adds a bounded native arena with three entrances, real doorway collisions, sequential clue/encounter gates, lion and bear warning → lunge → recovery → drive-away loops, wool clue → lamb discovery/call → collision-based escort to safe camp. Animals retreat unharmed. Health, temporary invulnerability, camp healing, exhaustion recovery and pause guards are implemented. Warnings only start inside the wide chamber, not the entrance choke point. Camp has a return-to-clearing action. Objectives, progress, notices, save errors and chapter panels have EN/RU strings.

This is explicitly fictional shepherd practice inspired by young David, not a purported Bible episode. No new Scripture quotation was invented. Existing rescue/reward Scripture remains unchanged. Cave art is licensed source art with runtime transforms, not newly generated art; see `assets/caves/CREDITS.md`.

## Persistence

Strict integer/prerequisite validation rejects malformed and out-of-order saves. A saved stage restages its authored safe checkpoint; partial encounters and clue/call state restart rather than persisting arbitrary physics state. A failed write does not undo a successful in-session action. New rescue must persist its reset successfully before reload; failed replay restores cave state, health and lamb position. Lifetime reward/banner state remains preserved. Paused cave panels display failed-save notices rather than silently hiding the HUD warning.

## Verified execution

Canonical engine: `/home/helper/tools/godot-4.7.2/godot`.

An isolated HEAD snapshot received only the candidate gameplay files and cave assets. It deliberately excluded unrelated dirty `player.gd`, carry models/weights, world/scenery code and web exports. Clean native editor import reported no errors. Tests used separate temporary `XDG_DATA_HOME` directories and native headless `--fixed-fps 60` (accelerated deterministic engine execution, not a device-performance measurement).

All 18 suites passed:

- `cave_campaign_test`: ordering, malformed checkpoints, prerequisites, completion, invulnerability, paused damage, healing, exhaustion, save/reload, failed replay, explicit reset, RU copy, clue destination and failed-save modal visibility.
- `cave_input_playthrough`: real native key/action events traverse both cave encounters and escort the lamb through actual colliders to camp. Only the prerequisite completed-flock state is seeded; cave stages are not assigned to skip the mission.
- `cave_ui`: 408 EN/RU native layout checks across portrait, short landscape and desktop at simulated DPR 1/2.
- `flock_campaign_test`, `flock_progression`, `flock_ui` (288 checks), `escort_collisions`.
- `search_regressions`, `rewards`, `edge_cases`, `review_regressions`, `world_tap_ui`, `mobile_ui_readability`, `rewards_mission`, `reward_layout`, `terrain_surfaces`, `scenery_clearance`, `ipad_player_test`.

The name `ipad_player_test` denotes simulated native input regressions, NOT a physical iPad test.

Native Xvfb/OpenGL llvmpipe rendering separately passed cave UI (408 checks) and the complete input-driven cave route. Actual native screenshots were inspected: Russian introduction, portrait HUD, cave/lamb milestone and camp overview. Small environment warnings concerned unavailable X input method / VSync; no script failures. Render-loop drawing is disabled between milestone captures in the input fixture, then enabled for real engine captures.

Evidence on this machine: `/tmp/jd-cave-final-tests/results.json`, per-suite logs alongside it, `/tmp/jd-cave-play-*.png`, `/tmp/jd-cave-native.png`, `/tmp/jd-cave-ui-*.png`. The UI fixtures are posed layout checks; the input playthrough screenshots are separate traversal evidence. These temporary paths are not deployment artifacts.

## Repeat

From the project root, use a fresh temporary data directory per test:

```sh
XDG_DATA_HOME="$(mktemp -d /tmp/jd-cave-qa-XXXXXX)" /home/helper/tools/godot-4.7.2/godot --headless --fixed-fps 60 --path . --script tests/cave_campaign_test.gd
XDG_DATA_HOME="$(mktemp -d /tmp/jd-cave-input-XXXXXX)" /home/helper/tools/godot-4.7.2/godot --headless --fixed-fps 60 --path . --script tests/cave_input_playthrough.gd
XDG_DATA_HOME="$(mktemp -d /tmp/jd-cave-ui-XXXXXX)" /home/helper/tools/godot-4.7.2/godot --headless --fixed-fps 60 --path . --script tests/cave_ui.gd
XDG_DATA_HOME="$(mktemp -d /tmp/jd-cave-render-XXXXXX)" timeout 90s xvfb-run -a /home/helper/tools/godot-4.7.2/godot --path . --rendering-method gl_compatibility --fixed-fps 60 --script tests/cave_input_playthrough.gd
```

Legacy `edge_cases.gd` writes under `../../docs/games/block-evidence`; create that evidence directory when testing a game-only archive rather than the full repository.

## Limits / preserved work

Playable prototype, not final art/animation polish. Lion/bear models have no skeletal animation clips; encounter movement uses whole-model transforms. Cave geometry remains simple. The existing map does not draw the new arena. No browser, WKWebView, physical iPad, touch full-route, device performance, sound, or child playtest claim. No clothing, rig, weights, player carry implementation or carry assets were edited. Sleeve dragging remains deferred. No paid APIs, export, sync, deployment or push. Commit scope is gameplay, its tests/docs and licensed cave assets only; unrelated work remains uncommitted.
