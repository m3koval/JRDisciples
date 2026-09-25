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

## Remaining dependency/backlog (not silently completed)
1. Run-1 terrain card complete; next dependency is stronger bank/tree/broken-span composition, not another terrain-plan document.
2. Opening foliage/tree silhouettes, broken timber readability and composition still owner-rejected; preserve garden.
3. Audit canonical next-level transitions and implement bounded connected progression improvements after opening card.
4. Meaningful hands-on challenge and exploration improvements; retain EN/RU, saves and exact Scripture.
5. Further scene coverage and normal input-route checks; no child-enjoyment claim from tests.
6. Final pass: freeze, genuine Web rebuild, export stamp/guard, webpack app sync, native/browser QA and consolidated PR handoff. Claude owns Xcode/device acceptance.
