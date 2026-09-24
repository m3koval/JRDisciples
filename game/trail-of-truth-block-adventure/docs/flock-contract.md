# Post-rescue gameplay contract

## Scope and sequence

`main.gd` orchestrates the existing tracks → bridge → lost-lamb escort. `flock_campaign.gd` continues that rescue instead of replacing it:

0. Original rescue active; flock hidden and its solids disabled.
1. Gather three sheep with nearby, line-of-sight calls.
2. Lead all three to pasture. A distant sheep waits; return and call again.
3. Collect two boards, one at a time, and fit each at its marked fence rail.
4. Lead all three inside the fold, then close the gate from inside. A short paused-safe shelter beat precedes reopening.
5. Escort everyone home and count each nearby sheep once.
6. Chapter celebration, then the three-cave chapter as the primary next action, or optional seed-pouch/garden exploration. Explicit new rescue remains in pause.

Existing `completed` means the original rescue, not the whole flock chapter. Sheep move using swept CharacterBody3D collisions; the progression fixture verifies actual movement to pasture, through the fold entrance, and back home rather than assigning sheep to successful endpoints. Its player waypoints are scripted, not hardware input.

## Guidance and child-facing feedback

EN/RU objectives, call/follow/count totals, persistent collected-board status, short success notices, waiting-sheep destination markers, and a completion panel make the next action explicit. Following uses slow walking and return-for-stragglers rather than teleportation or punishment. The next optional garden goal remains playable after the campaign and marks the nearest uncollected seed pouch. Campaign interaction has priority over optional seeds, without permanently blocking the garden.

Portrait utility controls follow the actual wrapped header height. Completion text scrolls while Continue to caves/Explore remain in the fixed footer. The map retains the existing rescue geography; its title shows the flock goal, but it does not yet draw flock/fold or cave icons.

This is fictional shepherd practice, not an event attributed to Scripture. Existing John 10:11 EN/RU text is reused on completion; no new Bible quotation or translation was invented. The distant-lion text is explicitly a prototype marker, not final lion art or an attack mechanic. No injury, killing, paid assets, or APIs were added.

## Persistence and replay

The persisted checkpoint is an integer stage, not a mid-step simulation snapshot. Loading restages sheep at safe authored positions, resets a pending shelter timer, and resets partial calls/repairs/counts to that stage's starting state. Gameplay never teleports sheep to finish an objective. Fractional, nonfinite, malformed, out-of-range and pre-rescue positive checkpoints are rejected. Old completed-rescue saves migrate to gather. An explicit saved stage 0 preserves a requested new rescue despite lifetime rescue rewards.

A failed checkpoint write does not undo the child's successful action or trap the run; the HUD reports that the device has not saved. An explicit replay must save stage 0 successfully before scene reload, otherwise the current run remains intact. Lifetime rewards and banner choices survive replay. Resume hides obsolete bridge pickup logs without changing the accepted carrying implementation.

## Verification commands

Use canonical `/home/helper/tools/godot-4.7.2/godot`. Isolate each fixture with its own temporary `XDG_DATA_HOME`; do not run save-writing tests against a player's native save. Both flock fixtures restore any save they found.

```sh
XDG_DATA_HOME=/tmp/jd-flock-qa /home/helper/tools/godot-4.7.2/godot --headless --path . --script tests/flock_progression.gd
XDG_DATA_HOME=/tmp/jd-flock-ui /home/helper/tools/godot-4.7.2/godot --headless --path . --script tests/flock_ui.gd
XDG_DATA_HOME=/tmp/jd-flock-render timeout 100s xvfb-run -a /home/helper/tools/godot-4.7.2/godot --path . --rendering-method gl_compatibility --script tests/flock_progression.gd
```

- `flock_campaign_test.gd`: original milestone fixture, now preserves pre-test save state.
- `flock_progression.gd`: actual companion collision traversal; malformed and pre-rescue saves; missing-board/wrong-rail/out-of-location actions; paused shelter; completion and Russian UI; garden after completion; checkpoint/banner readback; replay; stale-timer reset; real native save-write failure and failed-replay handling.
- `flock_ui.gd`: EN/RU stages 1–6 at native simulated 320×568, 390×783, 667×300 and 1280×720; header/control separation, bounded modal and fixed footer (288 checks).
- `rewards.gd`: reload now asserts checkpoint resume, then explicit new-rescue reset with rewards retained.
- `playthrough.gd`: Russian rescue-completion assertion includes the new next-chapter CTA instead of the obsolete free-exploration HUD objective.

## Deliberate limits

No clothing, rig, weights, player carry code or carry assets changed. Repair-board possession is logical inventory with persistent HUD feedback; no new carried-board animation/attachment was introduced. Stage 4's warning remains prototype text and the fold is simple block geometry. Partial stage actions reset on reload by design. Native rendered fixtures and native keyboard rescue coverage do not establish browser/touch/WKWebView/iPad-device behavior. Local commit is authorized; no export, sync, deployment, push or paid API use. See `gameplay-fixes-verification.md` for the subsequent cave chapter and combined verification.
