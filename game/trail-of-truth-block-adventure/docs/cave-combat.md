# Cave combat: victory and protection

## Content direction

Defeat the attacking predators and protect the flock. This is not an unharmed-retreat mechanic. A defeated animal disappears into a short block-style poof; there is no blood, corpse, loot or graphic injury. Player-facing English and Russian text no longer promises that no animal is hurt or adds unsolicited wilderness-safety warnings. Readable attack anticipation remains a gameplay cue, not a disclaimer.

The biblical basis is [1 Samuel 17:34–37, ESV](https://www.bible.com/bible/59/1SA.17.34-37.ESV), verified against Bible.com: David describes killing predators while rescuing sheep and credits the Lord with delivering him. Non-graphic presentation must not change that outcome into harmless retreat. The three caves, exact hit count, staff controls and checkpoint system are fictional game design, not details asserted by the passage. Existing quoted Scripture in the rescue/reward flow is unchanged.

## Mechanics

- Lion → bear → wool clue → lamb discovery/call → escort home remains the saved sequence. Existing `lion_safe` / `bear_safe` save IDs remain compatible; they now mean the threat is defeated.
- Each attacker has **2 HP**. A compact two-segment, camera-facing bar appears above only the active attacker. First landed staff strike reduces HP to 1, interrupts its attack and collision-sweeps knockback; it withdraws to reset before attacking again. The final landed strike reduces HP to 0 and wins immediately.
- Final defeat hides the animal and HP bar, clears the attack cue, and plays a **0.65-second poof** at its position. Twelve original block puffs expand and shrink without blood, explosions, flashing or borrowed Minecraft assets. The visual is driven by simulation delta, not an autonomous tween.
- Victory text: **“Victory! You protected the flock.” / “Победа! Ты защитил стадо.”** The objective and notice do not repeat the same message simultaneously.
- The winning hit saves the completed encounter immediately, before the visual ends. Moving out of the arena or pausing cannot cancel an earned victory; extra taps cannot grant more progress.
- Existing WASD/joystick movement, Space/Jump and contextual **Defend · staff** action remain. Reach is 2.8 m, cooldown 0.75 s. Misses consume cooldown but no enemy HP; walls block both strikes and attacks.
- Lion: pursuit 3.2 m/s, anticipation 1.1 s, locked-target pounce 10 m/s for 0.45 s. Bear: pursuit 1.9 m/s, anticipation 1.4 s, 2.8 m ground swipe for 0.22 s. Both recover for 2.2 s.
- Run sideways or time a jump to clear attacks. Grounded damage requires feet below 0.85 m, horizontal overlap and clear line of sight. Camp remains outside the attack leash.
- Player HP remains 3. At zero, return to camp and reset the unfinished encounter to full enemy HP. Previously completed encounters remain completed. This is checkpoint recovery, not victory for losing.
- Pause freezes attacks, cooldown, animation and poof. Restore clears transient effects; a new adventure restores both attackers.

## Integration and boundaries

`cave_campaign.gd` owns combat, HP bar and poof. `cave_block_animal.gd` provides original articulated animal meshes under `cave_animal_motion.gd`. No changes to player, clothing, carry assets, village code or the main app shell were needed for this pass. The staff is still a simple independent visual, not a hand-rigged swing; this pass does not claim to fix that limitation.

## Verified source tests

Canonical engine: Godot 4.7.2. Each headless suite uses a fresh `XDG_DATA_HOME` and `--fixed-fps 60`.

**23/23 suites passed:** `cave_victory_test`, `cave_combat_test`, `cave_block_animal_test`, `cave_animal_motion_test`, `cave_campaign_test`, `cave_input_playthrough`, `cave_ui`, `flock_campaign_test`, `flock_ui`, `flock_progression`, `escort_collisions`, `search_regressions`, `review_regressions`, `rewards`, `world_tap_ui`, `mobile_ui_readability`, `reward_layout`, `terrain_surfaces`, `scenery_clearance`, `ipad_player_test`, `rewards_mission`, `edge_cases`, `village_interiors`.

The new victory suite checks HP changes and bar textures, no premature completion, immediate checkpoint readback, poof placement/visibility, pause, effect expiry outside the arena, duplicate-hit prevention, restore, loss/reset and EN/RU content. It passed **30 checks** both headlessly and under the native renderer. The first batch caught an old Russian assertion for “Выдуманная”; the revised copy uses “Выдуманное приключение пастуха,” and its exact-text assertion now passes.

Reproduce from this game directory:

```sh
XDG_DATA_HOME=$(mktemp -d) /path/to/godot --headless --fixed-fps 60 --path . --script tests/cave_victory_test.gd
XDG_DATA_HOME=$(mktemp -d) /path/to/godot --headless --fixed-fps 60 --path . --script tests/cave_input_playthrough.gd
```

For native visual evidence, run `cave_victory_test.gd` with a renderer and set `JD_VICTORY_EVIDENCE` to an isolated output directory. It captures full HP, first hit and defeat for each species. These are posed visual fixtures, separate from the native input-driven full-route test. No physical iPad or WKWebView claim.

## Build handoff

Source changes only. Mike will have Claude build and deploy to the iPads. **The checked-in `public/games/trail-of-truth-block-adventure/build/` bundle was not regenerated in this pass** and must not be mistaken for the new gameplay. Claude should pull the pushed source branch, rerun the source tests, then use the established Godot export/app sync/Xcode workflow. No paid APIs, export, app build, app sync or device deployment was performed by this pass.
