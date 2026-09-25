# Claude: Junior Disciples opening-art / Blender takeover

Mike requested this committed remote handoff so Claude can take over on his Mac. Read before building or deploying. This is Junior Disciples / Trail of Truth, NOT Venture Valley.

## Branch and build state

- Handoff branch: `apex/jd-claude-blender-handoff`.
- Native-tested opening source milestone included: `4c9b75d1c624a00fbea9b12c76833f01cf0cecc7`, based on `d3d482e88baacb5291b082eac11f2cbaaf118c1b` from draft PR #7 (`apex/jd-six-run-improvements`).
- SOURCE HANDOFF ONLY: the embedded Web export predates this opening-recovery source. Rebuild Godot Web and app sync before installing with Xcode; NEVER restamp stale exports.
- No main merge or deployment performed. Preserve newer main/Claude work and Apple signing settings.
- The separate six-hour sprint final-QA run was active in `/tmp/jd-next-adventure`; inspect later PR #7 commits before reconciling. Its old-source QA does not cover these new meshes.

## Owner direction

The garden is accepted; the opening is not. Preserve the garden, accepted human character rigs/scales, free walking/jumping/camera, touch controls, saved progress, EN/RU and irrigation/bridge state authority. Replace weak shapes, not just decorate them.

Reference floor: `docs/claude-opening-handoff/owner-quality-reference.png`. This is an owner-supplied visual reference, NOT a license to reuse its depicted assets.

Current source milestone: new generated landscape/rock meshes and creek-bank geometry. Native tests pass, but inspected art remains below the reference: pale enclosing faceted cliff walls, simplistic rock shapes, flat grass/path materials, coarse foliage, weak shore/water transition and oversized HUD. Do not confuse functionality with art approval.

Evidence: `docs/games/block-evidence/opening-recovery/README.md`; final images under `final/jd-foliage-final-{bridge,grove}-{1280,720}.png`. Those seeded normal-camera renders prove composition only; original physical opening-route proof is separate. Seven native jobs recorded passing (route, terrain, clearance, bridge states, foliage, garden preservation, capture). No physical iPad, Mac/Xcode or child-enjoyment validation.

## Blender-first environment work

Mac Blender availability has NOT been checked. Inspect/install through the user's approved local workflow.

1. Bring existing character scale, bridge supports, bank bounds and walking/collision footprints into Blender as references.
2. Model one coherent opening corner: broken bridge, shaped banks, nearby rocks and background hillside. Avoid the straight trench and uniform enclosing quarry-wall silhouette. Use varied earth-topped forms and a believable distant horizon.
3. Author meaningful asymmetric shapes, coherent UVs/materials and vegetation volume. Merely running a primitive-generating script inside Blender will reproduce the current quality problem.
4. Preserve editable `.blend` sources; export real `.glb` meshes and materials into Godot. Keep collisions, repair stages, saves and input authoritative in Godot. Do not bury the character, walking route or exposed bridge supports.
5. Review in the REAL gameplay camera, same viewport and repair state, portrait AND landscape. A beautiful Blender render is not in-game approval.
6. Refine the HUD for more visible world, preserving readable English/Russian copy, visible resting joystick and usable touch targets. Keep chapter/modal behavior intact.
7. Do not expand unfinished art into more levels before this opening earns acceptance.

## Interrupted candidates preserved separately — not applied

Mike requested takeover during further environment/HUD passes. Workers were asked to stop. Their captured unfinished work is in this branch as optional patches, NOT silently mixed into the tested runtime:

- `docs/claude-opening-handoff/environment-unfinished.patch`
- `docs/claude-opening-handoff/hud-unfinished.patch`
- `docs/claude-opening-handoff/opening_hud_capture.gd.txt` (unfinished additive test fixture, intentionally outside engine source)
- `docs/claude-opening-handoff/pending-manifest.json` (patch hashes)

Review these before use. `git apply --check` proves applicability, not correctness. Apply deliberately only if beneficial, place the capture fixture in tests as appropriate, and rerun tests/recapture. Reject poor candidates rather than retaining them for sunk effort. These snapshots are not covered by the native-pass claims above.

## Source / verification locations

Game: `game/trail-of-truth-block-adventure/`
- `scripts/opening_landscape.gd`, `scripts/opening_river_art.gd`, `scripts/world.gd`
- `assets/opening_art/landscape.gdshader`
- `scripts/main.gd` (HUD)
- `tests/opening_terrain_test.gd` (additive geometry assertions)

Read `docs/main-ipad-handoff.md`, AGENTS.md and actual verification scripts before execution. Linux engine was Godot 4.7.2 at `/home/helper/tools/godot-4.7.2/godot`; use the appropriate Mac binary and matching export templates. Test saves must be isolated per test with fixed 60 Hz; renderer-dependent tests cannot be treated as headless verification.

After integrated art/UI changes: inspect matched captures, rerun original opening rescue/repair/terrain/clearance/input checks without weakening assertions, freeze source for final evidence, genuinely rebuild Web export, then `python3 tools/trail_of_truth/check_block_release.py --stamp`, its release guard, `node scripts/check-trail-of-truth.mjs`, and `npm run app:sync`. Existing Next builds use webpack. Verify exact exported engine hashes in the synced app. Preserve signing; test touch, multitouch, orientation, map/pause, repairs, rescue and saved progression on iPad.

## Budget

Existing model/asset cap is $10 USD TOTAL, not per pass. Last verified ledger: $0 spent, $0 pending. Latest user permits generating needed models/shapes but did not increase the cap. Check `docs/hourly-model-budget.json` and newer PR #7 changes before paid requests. Record charges and pending reservations; no subscriptions/unrelated purchases.

## Local recovery note

The new handoff worktree was checksum-verified and relocated to `/mnt/hermes-storage/jd-handoffs/claude-opening` after the root disk filled. This did not remove source, candidate patches or accepted evidence. GitHub branch is the Mac handoff; Linux absolute paths are not Mac requirements.
