# Junior Disciples — six-pass improvement sprint

## Finite execution authority
- Repository: m3koval/JRDisciples; worktree `/tmp/jd-next-adventure` only.
- Branch: `apex/jd-six-run-improvements`, based on remote main `36aae66a0a8cc194dfd97663d0de533f8f7ec153` (includes later footbridge/dialogue corrections).
- Exactly SIX implementation passes including manual trigger **run 1**. Before starting any future pass, read this ledger. After run 6, do not implement a seventh pass even if a scheduler tick remains. Do not create schedules or extend cadence.
- No main merge, live deployment or signing changes. Preserve pre-existing untracked merge evidence.
- Aggregate asset cap $10 USD; sole authority `hourly-model-budget.json`.

## Run 1 — completed bounded terrain milestone (2026-09-25)
- Implemented continuous terrain across both opening banks, finite connected worn paths with rounded ends, and aligned the shoreline lip to remove the visible dotted daylight seam. Removed four obsolete rectangular path overlays. Collision/repair authority, rigs/scales, controls, garden, solver, saves and EN/RU were not changed.
- Latest remote main baseline retained, including Claude/user footbridge and water-dialogue changes. No protected worktree edits; its existing Godot process was left alone.
- RED: additive `opening_terrain_test` failed against baseline. GREEN: terrain bounds, river gap, flat ground, vertex budget, finite route ends and shore join checks now pass. Original assertions unchanged.
- Native: `verify_opening_art.py` PASS (terrain, repair states, physical opening rescue route, irrigation crossing route, captures). Additional scenery clearance, search, world-tap and player-input regressions pass with isolated XDG state and fixed 60 Hz.
- Expanded `verify_irrigation_art.py` was interrupted by the 420-second tool timeout after four recorded passes (construction model, construction host, geometry route, site route). This is NOT a full irrigation-suite pass; final garden test/capture completion unverified. No repeated full suite launched.
- Inspected matched stage-0 landscape and portrait before/after renders in `docs/games/block-evidence/hourly-run-1/native/jd-opening-{before,after}-{1280,720}.png`. Final captures follow the seam correction. Seeded camera positioning is composition evidence, separate from the physical rescue route.
- Review: rectangular grass cutoff/path ends and seam corrected. Broad flat banks, primitive canopy silhouettes, limited broken-timber readability and surrounding scenery STILL fall below the reference floor. No owner approval, child enjoyment or iPad performance claimed.
- Genuine Godot 4.7.2 Web export succeeded; initial relative-path invocation failed, then absolute destination succeeded. Fresh export stamped and guarded; `npm run app:sync` passed webpack/TypeScript, 99 offline routes and exact copied-engine hashes. No signing/device/live deployment.
- Browser: current exported app `/games/trail-of-truth/`, real touch start → map pause/close → walking/clues → bridge discovery → world-tap stock pickup: 17 checks pass, no runtime errors. `BLOCK_CARRY_ONLY=1` intentionally ends at pickup, NOT full browser rescue/replay. Native route does complete rescue. Browser carry screenshot inspected; existing carrying pose and terrace silhouettes still need visual refinement.
- Bilingual and Scripture guards pass; no Scripture changed. ESLint passes existing ceiling: 0 errors, 32 warnings.
- Frozen-source recheck: 76 recorded files unchanged; release manifest separately covers game assets/shaders. `tools/trail_of_truth/verify_hourly_snapshot.py hourly-run-1` validates native/browser evidence and budget.
- Spend: $0 actual; $0 pending; $10 unused. No paid requests or purchases.
- Run count: 1/6 complete, five implementation passes remain. A later tick after run 6 must not create a seventh pass. No scheduler created, duplicated or extended; scheduler repeat state not modified in this run.
- Handoff: implementation commit `8bbac69c9228f3e95d9964b7cf63af48b450a51f` pushed and exact remote SHA read back. One draft review PR: https://github.com/m3koval/JRDisciples/pull/7 (OPEN, draft; GitHub Quality Gates and automatic Vercel preview pending at readback). Future runs update this PR; do not open duplicates. No main merge. Working tree retains only the pre-existing untracked merge evidence after the milestone.

## Run 2 — completed bridge timber milestone (2026-09-25)
- Found a concrete visual regression: surviving broken deck tops were buried beneath the continuous bank terrain. Raised them above that surface, made the short torn ends readable, and added seated cross-bearers. Repaired panels now use matching beveled lengthwise boards instead of unrelated transverse plain boxes.
- Kept original single flush panel colliders, repair stages, saved progression, rewards, accepted rigs/scales, garden, irrigation, controls and EN/RU. This is integrated bridge presentation, not a new construction mechanic.
- RED: additive `bridge_timber_test` failed four checks on the old implementation. GREEN: seven native jobs passed with isolated XDG state, Xvfb, fixed 60 Hz, explicit completion markers and no engine/script errors. Includes original physical opening rescue/Russian-completion route, terrain, clearance, damage removal/replay and new timber geometry checks. Original assertions unchanged.
- Matched normal-camera broken before/after and partial/repaired landscape/portrait evidence: `docs/games/block-evidence/hourly-run-2/`. Inspected broken, partial and repaired states. Stage fixtures are seeded composition only; their transient discovery speech is not routed narrative acceptance. Source manifest covers 137 unchanged runtime/test/asset files.
- Genuine Godot 4.7.2 Web rebuild, fresh release stamp/guard and webpack `npm run app:sync` passed; 99 offline routes and exact copied engine hashes verified. Export log has no engine/script errors. No signing/device/live deployment.
- Bilingual and Scripture guards pass; no Scripture changed. ESLint: 0 errors, 32 existing warnings; diff whitespace check passes.
- Full exported-browser touch route passed **65 checks**, exit 0, no runtime errors: normal hosted entry → map → clues → world-tap pickup → both repairs → crossing → lamb rescue → Russian completion → replay/reload → portrait move/jump/look → concurrent two-thumb inputs → landscape pause/resume. Unlike run 1, this was NOT a pickup-only smoke. Physical browser bridge and portrait replay captures inspected. Runtime Russian completion is verified; the independently English outer route shell was not localized by this game-language toggle.
- Final `check_run2_evidence.py` passes: 137 frozen game files, seven native jobs, 65 browser checks, all six current stage/orientation image files valid. The guard was first exercised against incomplete browser evidence and correctly rejected missing completion. Current Web release guard also passes.
- Run count: **2/6 complete; four runs remain**. No schedule created, duplicated, extended or modified. Existing draft review PR7 is the handoff target on `apex/jd-six-run-improvements`; main is unchanged at `36aae66a0a8cc194dfd97663d0de533f8f7ec153`. Protected-tree and pre-existing untracked evidence preserved.
- Spend: $0 actual, $0 pending, $10 unused across the sprint. No purchasing or paid generation.
- Scope: broken-span readability improved, but tree/hill silhouettes, broad banks and overall scene richness STILL fail the reference-quality floor. Owner visual approval, child enjoyment and physical-device acceptance remain open.

## Remaining dependency/backlog (not silently completed)
1. Run-1 terrain and run-2 timber presentation cards implemented; next opening dependency is stronger tree/bank composition, not another planning document.
2. Opening foliage/tree silhouettes and overall composition still owner-rejected; preserve garden. Broken-timber visibility is improved, not owner-approved.
3. Audit canonical next-level transitions and implement bounded connected progression improvements after opening card.
4. Meaningful hands-on challenge and exploration improvements; retain EN/RU, saves and exact Scripture.
5. Further scene coverage and normal input-route checks; no child-enjoyment claim from tests.
6. Final pass: freeze, genuine Web rebuild, export stamp/guard, webpack app sync, native/browser QA and consolidated PR handoff. Claude owns Xcode/device acceptance.
