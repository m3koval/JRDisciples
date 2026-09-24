# Bounded native irrigation visual pass

## Runtime changes
- `game/trail-of-truth-block-adventure/scripts/irrigation_geometry.gd`: beveled, staggered stone courses with deterministic procedural material; timber grain; manual sliding plank gates, fixed paired groove cheeks, braces and lifting handles. Cosmetic wheels removed. Existing five solver footprints, levels and head-driven water/drop geometry retained. Soft planting-bed geometry retained from intervening concurrent work.
- `game/trail-of-truth-block-adventure/scripts/water_environment.gd`: earth shoulders at model-bed heights, quieter meadow palette, unified cultivated ground, removal of fragmented wooden planter borders. Existing routes/colliders retained.
- `game/trail-of-truth-block-adventure/scripts/water_campaign.gd`: gate assembly integrated with existing inlet/outlet state; stone support and timber repair materials; concise localized action text/clipping containment. Existing rigs, scales, crops, authoritative construction and solver unchanged.
- `game/trail-of-truth-block-adventure/tests/irrigation_geometry_playthrough.gd`: preserves original inherited construction assertions and footprint/edge tests; adds manual-gate checks, before/after inlet captures and ordinary-camera downstream corner captures.

## Evidence and reproducibility
Godot `/home/helper/tools/godot-4.7.2/godot`, native `xvfb-run -a`, `--rendering-method gl_compatibility --fixed-fps 60`, separate XDG_DATA_HOME and XDG_CONFIG_HOME per run.

Logs:
- `/tmp/jd-visual-unit.log`: original construction unit test, `CONSTRUCTION_FAILURES=0`.
- `/tmp/jd-manual-final-host.log`: original host fixture playthrough, `CONSTRUCTION_HOST_FAILURES=0`.
- `/tmp/jd-manual-final-route.log`: final manual-gate walking/capture route, `CONSTRUCTION_HOST_FAILURES=0`, process exit 0. Final four runtime/test files match `/tmp/jd-manual-final-source/` byte-for-byte after completion.

Ordinary player-camera evidence (not overview-camera substitutes):
- `/tmp/jd-visual-manual-gate-{closed,open}-{1280,720}.png`
- `/tmp/jd-visual-intake-{ponding,flow-en,flow-ru}-{1280,720}.png`
- `/tmp/jd-visual-garden-{ponding,flow-en,flow-ru}-{1280,720}.png`
- `/tmp/jd-irrigation-visual-comparison.jpg`: supplied baseline and updated repair, inlet, downstream views. Player positions differ; not a pixel-aligned comparison.
- `/tmp/jd-irrigation-visual-manifest.json`: source hashes and capture paths.

Fixture disclosure: prerequisite cave completion is seeded. New chapter station/observation travel uses inherited keyboard/physics walking. Host action routing is exercised; hydraulic waiting is fast-forwarded through campaign tick. Drawing is enabled at checkpoints. Camera yaw/pitch and window orientation are scripted within the normal player camera. This does not prove continuous-motion performance, physical iPad/touch operation or child enjoyment. Original host fixture uses station positioning and overview images, kept separate from the normal-camera evidence.

## Visual review and honest limits
Inspected supplied landscape/portrait baselines and native iterations. Addressed thin slab silhouette, unmotivated wheels, fragmented garden borders, visible gaps beneath bank shoulders, and long Russian action-label overflow. Gate handles and under-board openings are explicit; presentation still toggles state rather than animating the child's hands lifting a board.

This is an improvement to the existing procedural chapter, not final premium art acceptance. Large simplified channel dimensions remain imposed by the current model; long walls still dominate some angles. Earth shoulders remain visibly geometric/scenic and non-colliding. Procedural stone/wood is not bespoke authored PBR artwork. Water is a flat opaque surface with simplified head-driven drop sheets; no fluid motion simulation. Some inherited plan/supply/demo props and floating labels remain crude. Portrait must choose a local view: it does not show the full garden and intake together.

All limitations in `irrigation-geometry-handoff.md` remain: no visible routed leak/overflow bypass; inlet-before-sealing is prohibited, so baseline leak cannot be demonstrated through ordinary play; outfall grate is only a boundary marker; non-colliding dressing is not solid bank traversal; trays are not a full craftsmanship lesson; no structural strength, crop growth, lateral soil wetting or agronomic validation.

## Preservation and concurrent edits
No commit, push, paid API or access to the protected source tree. Initial visual-file copies: `/tmp/jd-visual-baseline/`. A concurrent edit added a wheel/winch and wheel-specific assertions during this pass. That conflicting version was preserved in `/tmp/jd-concurrent-wheel-snapshot/`; the requested manual-gate model was restored, while compatible planting-bed work was retained. Final tested source snapshot: `/tmp/jd-manual-final-source/`. Original construction test and original host playthrough were not edited. Prior uncommitted solver/construction work was not reset.
