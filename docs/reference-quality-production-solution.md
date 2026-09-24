# Junior Disciples: reference-quality production solution

## Decision
The supplied image `/home/helper/.hermes/cache/images/img_218666fd9684.png` is the MINIMUM acceptable whole-game runtime quality, not a premium aspiration. The current chapter does not pass. Replace the environment presentation approach, not the gameplay implementation. This document is an implementation specification, not a claim that its proposed assets or shaders are finished.

Constraints retained: only `/tmp/jd-next-adventure`; protected `/home/helper/work/JRDisciples` untouched; preserve dirty work; no commit/push, paid API or purchase without new authorization. Existing accepted human rigs/scales, solver, construction, saves, crops and input behavior are protected. Manual grooved lift gates remain the current authorized mechanism. An unused irrigation_winch.gd exists on disk; its presence is not approval to reintegrate it.

## Diagnosed causes from live source
1. `water_environment.gd` assembles flat ground, independent ribbon overlays and primitive vegetation. Added detail does not create shaped, connected ground.
2. Ribbon surfaces explicitly disable receiving shadows to avoid acne. Crop leaves also disable shadows. These workarounds remove grounding; fixing shadow bias and overlapping geometry must precede restoring appropriate shadow reception.
3. `project.godot` uses GL Compatibility and a 1024 directional shadow setting. `world.gd` spans a 65-unit shadow distance. That combination merits a local shadow-quality probe; raising resolution alone is not an art solution.
4. `irrigation_geometry.gd` improves block edges, but long repeated courses and surface noise do not provide the shape variation and composed material treatment in the reference.
5. The existing kit provides reusable cottage components, shrubs and flowers. It is not a complete stylistically reconciled environment kit. Runtime assets must be reviewed, not accepted because a model imports.
6. Camera FOV is currently 58 degrees. Do not change accepted player scales or globally widen FOV to conceal oversized scenery.
7. The solver's stepped channel levels and geometry constrain its visible shape. Concealing a raised trough with non-colliding berms can create false walkable terrain. Terrain must meet real bed heights and any newly walkable slopes need matching collision and route tests.
8. `blender` was not found on PATH during this inspection. Editable DCC authoring needs a verified local toolchain; do not claim Blender-generated assets already exist.

## Target rendering lane
Stay with native Godot and the current Compatibility renderer for the first proof. No engine migration is justified by the present evidence. Use UV-authored stylized materials, baked material AO where appropriate, one warm directional light, coherent ambient fill, limited real-time shadows and deliberate scene composition. Avoid depending on screen-space effects unavailable in the chosen renderer. Validate quality on target hardware separately from llvmpipe/Xvfb correctness.

Do not bake the reference image into scenery or substitute a concept render for runtime. Do not fake hydraulic wetness or make vegetation cover up missing joints.

## Implementation packages, in dependency order

### A. Shared visual foundation (single owner)
Create reusable world-space scale/material/light presets plus deterministic capture checkpoints. Keep gameplay host and state authorities intact. Split authored visual scenes/assets out of the monolithic construction methods so chapters instantiate an inspected kit instead of spawning hundreds of bespoke boxes. One integrator owns water_campaign.gd and the final scene; other workers may deliver separate asset files only. Record source hashes before a run and check them afterward; discard mixed-revision evidence.

Deliverables: stone, timber, dirt/grass, foliage and water material families; one daylight setup; reproducible ordinary-camera capture route. These become shared resources across chapters.

### B. Ground and silhouettes FIRST
Replace overlapping ground ribbons with a continuous triangulated terrain patch carrying grass/dirt/soil blend masks and unified UV scale. Keep the existing walkable plane where required; model deliberate banks and connect them continuously to that plane. Add collisions only where terrain is actually intended to support the player and prove navigation there.

Compose an intact route from gardener to work area, repair crossing, source and downstream drain. Path width, ground wear and planting follow use. Broad forms should read without flowers, pebbles or UI. Use recognizable pale stone channel segments with a few intentionally varied silhouettes, end conditions and elbow pieces; no rows of uniformly tiny blocks as a replacement for asset design.

Do not rescale hydraulic dimensions silently. If the inherited raised channel still fails the reference at correct character scale, flag a separate model-and-site redesign: reviewed grading changes, consistent cell volumes/areas and migration handling, with conservation and old-save tests. Never change only water visuals to imply a shallower system.

### C. Editable authored object kit
Audit installed assets against the reference, retaining only stylistically compatible meshes with recorded licenses. Author missing hero objects as editable textured meshes: source structure, channel/elbow/outfall pieces, grooved lift gate, damaged/repaired crossing, repair stock, supported plan table and demonstration trays. Separate moving/construction parts, stable pivots, correct collision envelopes and visible material junctions. Retain accepted characters and crop instances; improve their surroundings without regenerating identities.

Use existing lawful assets and locally authored meshes under the current no-paid constraint. If local tooling or asset quality prevents meeting the floor, report that specific blocker and propose a verified paid asset candidate/cost for authorization; do not replace it with more inadequate primitives.

### D. Foliage as composed masses
Replace sphere-cluster foreground trees where they fail silhouette review. Use a small coherent set of trunk/canopy meshes, grass clumps, shrubs and flower patches. Place by authored masks: path edge, moist edge, garden boundary and background framing. Deterministic MultiMesh distribution with varied size/orientation, not uniform random confetti. Keep interaction access, feet and water openings visible. Preserve quiet walking space. Verify alpha overdraw/shadow costs before increasing density.

### E. Water and material response
Keep solver head/storage/opening authoritative. Add renderer-compatible moving normal/UV detail, readable edge treatment and flow direction. Restrict drop/splash cues to actual active connections and available upstream water; avoid showing flow merely because the story advanced. No invented routed leak or plant growth.

Calibrate material albedo, texture scale and roughness under the shared light. Use pale stone with controlled broad color variation rather than multiplicative noise that turns it muddy. Timber grain follows the member axis. Bake local object crevice AO into assets where appropriate; keep genuine cast shadows for grounding rather than dark painted halos everywhere.

### F. Lighting and camera composition
Test a tighter useful shadow range and higher shadow resolution as a measured quality/performance variant; do not silently change the renderer or claim iPad frame rate from a software renderer. Fix z-fighting and acne causes before enabling shadow reception on ground and appropriate foliage. Maintain readable sunlit/shaded values without washing out the pale stone.

Retain ordinary player camera behavior and accepted rig scale. Frame the work object and next route in landscape and portrait. Check character silhouettes against backgrounds, gate opening visibility, horizon clutter and UI occlusion. A showcase camera cannot pass this gate.

### G. HUD finish AFTER the world reads
Retain control routing and touch target behavior. Use the reference's restrained dark panels, clear primary action and concise localized objectives as an art direction, not literal duplication. Review EN/RU layout, portrait safe areas, normal exploration, long notices and dialogue. Clipping text is not an acceptable final localization solution. Load mobile-game-ui-ux before implementation.

## First proof: complete playable irrigation area
The first proof includes gardener/garden foreground, downstream elbow, repair crossing, work area and intake, with backgrounds visible from each normal view. It is not one attractive isolated gate. Show:
- continuous walk and look through the area;
- unrepaired and repaired states;
- closed and open manual gate with unobstructed handle/grooves;
- high-sill ponding and lowered-sill delivery;
- normal landscape and portrait EN/RU views;
- unchanged construction, conservation, pause, harvest and reload behavior.

Compare to the supplied reference side by side at comparable display size. Pass/reject terrain integration, object silhouettes, material consistency, foliage composition, water readability, lighting/grounding, player-camera composition and UI. Every category must pass; an average score cannot hide a failed terrain or mechanism. User visual approval is separate from internal QA. Provide continuous native motion plus stills; scripted prerequisite state and time acceleration remain explicitly labeled.

## Whole-game rollout
After the first complete area meets the minimum, reuse the same resource families and acceptance gates across the opening/clearing, village routes/interiors, garden/water chapter and caves, with chapter-specific palettes rather than incompatible art styles. Inventory actual scene/chapter entrypoints before declaring coverage. Complete a per-area capture checklist; do not claim global completion from the irrigation sample. Preserve cave readability with intentional local lights and material contrast rather than applying outdoor daylight blindly.

## Verification gates
- Original construction and original host tests remain unchanged; rerun their native routes.
- Retain and extend geometric/state assertions, conservation, restore and old-save migration checks.
- Run normal entry and continuous physical navigation, not only action calls at fixture positions.
- Inspect landscape/portrait screenshots before and after; fix prominent issues before handoff.
- Measure draw calls, visible geometry, texture memory and frame timing on the actual target device; report Xvfb/llvmpipe separately. Set budgets from a measured first proof, not invented hardware claims.
- No function-only pass, concept image, asset download or successful import counts as visual acceptance.

## Completion definition
A solution is delivered only when the authored kit is integrated, gameplay regressions pass, the reference floor is met in normal runtime views, and performance is measured on the chosen device. This specification establishes the production approach; it does not mark any of those new implementation packages complete.
