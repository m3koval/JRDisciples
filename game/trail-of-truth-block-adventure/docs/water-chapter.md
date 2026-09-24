# Water for the Village — playable prototype

## Status

A working source-level chapter following completed caves. This is a prototype milestone, NOT final art, a shipped iPad build, or evidence that children find it captivating. No paid generation was used. Main character/carry/clothing assets are unchanged.

## Implemented

- Cave completion leads into an offset irrigation yard; completed-cave legacy saves can enter from camp.
- Mira (gardener) and Oren (waterkeeper): original fictional roles and bilingual dialogue, using existing Anna/Tobias model instances and role props. These are NOT newly modeled characters.
- Follow dry channel, speak to keeper, clear branches, fit a sluice board, close spill, open spring, open garden, return to keeper/gardener.
- Wrong-order spring operation visibly spills and remains recoverable. Water sections appear downstream, gates rise/lower, leaves recover and a harvest basket appears.
- State-driven flow presentation, not hydraulic simulation. Repair is contextual interaction, not free construction. The ordered gate exercise is guided and linear, not an open-ended spatial puzzle.
- EN/RU, independent ordered water checkpoints, legacy save loading, explicit unsaved feedback, pause, return/resume, replay reset while retaining existing earned rewards.
- Existing late-game villager/door routing repaired; cave completion copy now says protection, not all predators unharmed.

## Verification performed by parent

Godot 4.7.2, fresh isolated XDG_DATA_HOME per suite:

- water_campaign_test: WATER_FAILURES=0. Covers host actions, checkpoints/readback, invalid saves, legacy loading, pause, wrong order, return/resume, villagers/doors, replay.
- water_input_playthrough via xvfb/llvmpipe: WATER_INPUT_FAILURES=0. Real keyboard navigation/collisions through the chapter and E interactions, seeded at already-earned cave completion; not a fresh rescue-to-water end-to-end run.
- Existing suites passed: cave_victory_test, cave_campaign_test, cave_combat_test, flock_campaign_test, flock_progression, escort_collisions, village_interiors, world_tap_ui, rewards_mission, edge_cases, mobile_ui_readability.
- Initial shared-XDG multi-suite run contaminated escort fixture state; fresh per-suite XDG run passed. Keep test saves isolated.
- Native screenshots inspected: dry garden, restored overview, Russian completion landscape and portrait. Removed rigid costume-proxy panels and replaced plank-like leaf geometry. Russian completion fits both tested viewport sizes.

Commands:

```sh
XDG_DATA_HOME=$(mktemp -d) /home/helper/tools/godot-4.7.2/godot --headless --path game/trail-of-truth-block-adventure --script res://tests/water_campaign_test.gd --fixed-fps 60
XDG_DATA_HOME=$(mktemp -d) xvfb-run -a /home/helper/tools/godot-4.7.2/godot --path game/trail-of-truth-block-adventure --script res://tests/water_input_playthrough.gd --fixed-fps 60 --rendering-method gl_compatibility
```

## Remaining acceptance work

- Environment remains a flat enclosed blockout, not the accepted textured village standard. Needs authored terrain, connected setting, readable plant/gate assets and appealing composition before release.
- New character identities need distinct approved visual designs and meaningful animation, not only reused models/props.
- Actual iPad multitouch, device performance and child playtesting outstanding. Button-signal tests and keyboard walkthrough do not establish complete physical touch QA.
- The original clearing map is hidden in the offset yard; keyboard map request opens chapter guidance instead. A real chapter map remains outstanding.
- Add deeper discovery/choice and natural pacing; current gate labels/objectives reveal the sequence.
- Fictional service adventure, not a Bible event. No new Scripture quotes authored; existing verified Scripture remains unchanged. A new chapter-specific learning/payoff moment requires separately verified ESV/RST text.
- Exported playable bundle NOT rebuilt. Do not present this branch as iPad release-ready.
