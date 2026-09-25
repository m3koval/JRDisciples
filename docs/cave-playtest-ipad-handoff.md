# Cave playtest — Mac/Xcode handoff

## Delivery owner and scope

Mike selected Claude on his Mac to build and install the merged `main` onto the children's iPads. Apex prepares the source, embedded Godot Web export, static app and verified merge on Linux. Linux checks are **not** Xcode compilation, Apple signing or physical-device acceptance.

## Build the merged revision

Preserve existing local work and Apple signing. Do not reset a dirty checkout.

```bash
git status --short --branch
git fetch origin
git switch main
git pull --ff-only origin main
git rev-parse HEAD
npm ci
python3 tools/trail_of_truth/check_block_release.py
npm run app:sync
npm run app:open
```

The checked-in game export is part of the handoff; installing Godot on the Mac is not necessary. Use the existing Xcode app project, signing team and application identity. Select each connected iPad and Build/Run. Do not delete/reinstall the app to work around a build issue without preserving saved progress first.

## Improvements to inspect

- Connected cave vaults, rock mouth transitions, restrained foliage and interior bedding/talus.
- Rounded, independently articulated lion and bear meshes, preserving existing combat.
- Courtyard clue boards with front-facing lettering, without close interior text clutter.
- Any cave can be explored first; either attacker can be fought first. Finding the lamb early is remembered. Both attackers must be defeated before escorting it home.
- Version-2 unordered cave checkpoints, backward migration of existing sequential checkpoints, and malformed-data rejection.
- Existing garden, bridge, accepted human rigs, EN/RU and rewards remain authoritative.

## Required real-device acceptance

Record the installed Git SHA, device model, iPadOS version and build outcome for each iPad.

1. Launch from the installed app, not a remote Safari preview. Confirm the game actually loads.
2. Play portrait and landscape; check safe areas and readable controls/clues. Rotate during movement and while a modal/map is open.
3. Exercise joystick + camera together, Jump, contextual action, Map/Pause and resume. No stuck movement after lifting fingers or backgrounding.
4. Confirm an existing save loads. Do not erase the children's save merely to test a fresh route.
5. In a suitable test profile, enter caves from ordinary progression. Read signs, explore the lamb cave first, leave and reopen the app. Discovery should persist without prematurely allowing escort.
6. Fight bear before lion. Check attack warning, dodge/jump, staff reach/cooldown, health, defeat poof and rest/retry.
7. Bring the lamb physically through its doorway and across the courtyard. Home completion must not award while the lamb is still in its cave.
8. Continue to the water/garden chapter. Verify no regression in bridge walking, irrigation or existing saved work.
9. Test launch and play offline after installation; force-quit/reopen and verify saved progress. Note loading time, heat, stutter, crashes and input frustration.

## Evidence boundary

Native simulated-input route tests, seeded landscape/portrait renders, nonlinear state tests and a static-app browser smoke are separate evidence. They do not prove sustained iPad performance or child enjoyment. The art is improved but remains mixed procedural/scanned styling; this is a child-playtest candidate, not owner approval of premium reference-level art. Children’s observations should determine the next bounded correction.
