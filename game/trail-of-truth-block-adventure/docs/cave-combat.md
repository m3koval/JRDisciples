# Bounded cave defense

Original child-safe encounter rules, not Minecraft code/assets or a Bible retelling. Lion → bear → lamb clue/discovery → escort/home remains the strict saved prefix. No animal health, killing, loot or lamb damage was added. Existing three-heart player health, invulnerability, camp healing and checkpoint retry remain.

## Controls and rules

- Existing movement (WASD / joystick) runs; Space / Jump uses the actual player jump physics.
- One contextual **Defend · staff** action (E / action button), available during chase, warning, attack and recovery in the active chamber. Reach is 2.8 m with line of sight. Any valid swing consumes a 0.75 s cooldown, including a miss. Feedback distinguishes misses, readying and successful defense.
- Successful defense interrupts attacks, collision-sweeps 1.4 m knockback and initiates retreat. Two defenses finish an encounter without harming the animal.
- Staff is a standalone cave-node visual following player position and visual facing. It is NOT hand-rig/arm animation; no player, clothing, carry or skeleton files changed.
- Lion pursues at 3.2 m/s, warns 1.1 s, then pounces toward a locked target at 10 m/s for 0.45 s. Bear pursues at 1.9 m/s, warns 1.4 s, then performs a stationary 2.8 m ground swipe for 0.22 s. Both recover for 2.2 s.
- Warning never damages. Actual attack requires feet below 0.85 m, horizontal overlap and clear world LOS. Running sideways and timed run/jump are verified; jumping too early or landing in the pounce can still bump the player.
- Animal CharacterBody proxies sweep capsule motion against world geometry. Pursuit stops when LOS is obstructed; there is deliberately no navigation/pathfinding through obstacles. Movement, knockback and retreat are clamped inside each chamber. Leaving its inner bounds cancels the attack and returns the animal toward home. Camp is outside every leash.
- Pause freezes cooldowns, staff swing, encounter motion and attacks. Restore clears transient combat state while preserving the validated checkpoint prefix.

## Integration

`main.gd` already ticks caves before recomputing context; no main changes needed. Existing internal action key `drive` is retained, now labeled Defend. `make_animal` instantiates the original `cave_block_animal.gd` rig beneath the presentation wrapper. Its independent head, tail, hip and knee poses receive encounter state and measured movement speed; pause and checkpoint reset also freeze/reset those poses. EN/RU credits describe the original articulated art; archived GLB credits remain in assets/caves/CREDITS. Retreat completion now requires reaching the chamber retreat point, not just a timer expiring.

## Verification

Canonical command (use a separate temporary save directory per test):

```sh
XDG_DATA_HOME=$(mktemp -d) /home/helper/tools/godot-4.7.2/godot --headless --fixed-fps 60 --path . --script tests/cave_combat_test.gd
```

Also run `tests/cave_campaign_test.gd` and `tests/cave_input_playthrough.gd` with the same options.

- Combat: warning safety; grounded-hit and airborne controls for each animal; real native Space+D run/jump physics versus stationary grounded-hit controls; reach misses/cooldown spam/knockback; pause; wall-blocked staff, damage and pursuit; clamp/leash/reset.
- Campaign: strict save validation and order, warning/dodge/close defense, animal completion, lamb clue/discovery/escort, health/retry, save readback, Russian UI and replay reset.
- Input playthrough: real native movement/interact through both caves, close staff approach, lamb discovery and real-collider escort home. No browser/touch-device evidence is claimed.

Verified on the isolated HEAD-plus-candidate source tree with Godot 4.7.2: **21/21 native regression suites passed**, including combat, articulated rig (2,729 checks), animation, campaign, full cave input route, EN/RU cave layout (408 checks), flock, rewards, world-tap, mobile layout, terrain, scenery, player and replay/water/jump edge cases. Each suite used an isolated save directory. The first isolated edge-case attempt lacked the expected evidence output directory; rebuilding the fixture with the repository's directory shape resolved that harness error.

The full input route also passed under the native OpenGL renderer (`CAVE_INPUT_FAILURES=0`), with fresh lamb-discovery and completion captures. A separate native posed animation study produced 378 frames; sampled idle/warning/lunge/recovery/retreat frames and a pounce close-up were inspected. The block animals are identifiable and limb-articulated; this remains procedural prototype animation, not authored skeletal clips or foot IK. Staff presentation is not yet a hand-attached swing animation.

No browser, physical iPad, export, app sync, push or deployment was performed. Native layout/input evidence is not device-performance or child-playtest approval.
