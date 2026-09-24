# Connected irrigation environment — runtime build

## Scope and authority
Built in `/tmp/jd-next-adventure`; protected `/home/helper/work/JRDisciples` was not targeted. No purchase, paid API, commit, or push. Existing uncommitted work retained. This is an integrated irrigation-chapter visual build, not a whole-game rollout or owner visual approval.

User-supplied reference `/home/helper/.hermes/cache/images/img_218666fd9684.png` remains the minimum acceptance target, not an optional aspiration.

## Implemented
- Continuous shared-vertex terrain with world-space grass/dirt/cultivated-soil blending, curved walking paths, restrained scenic relief, and flat house pads. The playable core stays 0.015 m above the retained flat collider. No new walkable hills or bank collisions are claimed.
- Existing CC0 Quaternius cottages retained. Old irrigation sphere-canopy assembly replaced with original branching/root meshes, individual folded leaves, ferns, flowers, short grass drifts and low meadow transitions. Four MultiMesh batches share plant geometry; station exclusion zones leave work areas clear.
- Stone and timber material calibration, original beveled masonry retained, plus animated bounded water shading with subtle streaks. Surface heights/openings remain driven by the existing solver. Shader animation is illustrative, not computed fluid velocity.
- Original supported plan bench with schematic, joinery and tool; finite-supply rack; supported demonstration trays aligned to existing demo beds. Existing finite inventory meshes still disappear from authoritative collection state.
- Chapter-scoped sunlight/shadow treatment restores the prior light/environment settings on deactivation; no character, animation or input changes.
- Shorter contextual labels and EN/RU action-button width checks. Nearby 3D labels have a reduced visibility range to avoid distant text clutter.
- Manual gate board/grooves/handle retained with no rendered wheel. Capture approach yaw/pitch improved to show the opening and handle in portrait without an overview camera.

## Source changes in this pass
Runtime (`game/trail-of-truth-block-adventure/`):
- `scripts/water_campaign.gd`
- `scripts/water_environment.gd`
- `scripts/irrigation_geometry.gd`
- `scripts/garden_terrain.gd` (new)
- `scripts/garden_foliage.gd` (new)
- `scripts/garden_lighting.gd` (new)
- `scripts/garden_workshop_art.gd` (new)
- `assets/garden_art/ground.gdshader`, `water.gdshader`, `painted_ground.png`, `make_ground_texture.py`, `PROVENANCE.md` (new)
- `project.godot` (directional-shadow atlas presentation setting)

Evidence/test tooling:
- `tests/garden_art_test.gd` (additive integration/terrain/material/lighting/layout assertions)
- `tests/garden_art_capture.gd` (explicit seeded visual fixture)
- `tests/irrigation_geometry_playthrough.gd` (only gate-capture yaw/pitch/comment changed this pass; no assertion removed or weakened)
- `/tmp/jd-next-adventure/tools/verify_irrigation_art.py` (isolated native suites, strict error scanning, exact source manifest)

The original construction and host tests, solver, construction state/save implementation, accepted human rigs/scales, crops, player and main input router were not edited by this pass.

## Reproduce
From repo root:

```
python3 tools/verify_irrigation_art.py
```

Each process uses `/home/helper/tools/godot-4.7.2/godot`, `xvfb-run -a`, native GL Compatibility, `--fixed-fps 60`, separate temporary XDG data/config/cache directories, and a bounded timeout. Logs and captures live under `/tmp/jd-reference-quality-evidence/`. The runner checks exit codes, expected pass markers, any engine/script errors or failed assertions, and unchanged source hashes from start to finish. Merely exiting Godot with code 0 is not sufficient.

### Evidence distinctions
- `normal-route/`: original host inheritance plus real walking/input between irrigation stations and observation positions. Cave-completion prerequisites are seeded. Simulation is fast-forwarded through real campaign ticks, and rendering is disabled between capture checkpoints. These are ordinary-player Camera3D screenshots and routed-input/state evidence, **not continuous-motion or device-performance proof**.
- `seeded-study-fixture/`: directly constructs a valid repair through existing construction commands, sets a chapter-stage fixture, advances eight simulated seconds, and positions the player for repair/garden/workshop studies. These images are **not** proof of an independent playthrough.
- `garden_art_test.gd`: additive component/layout checks, including station-positioned EN/RU label measurements. The separate original walking route remains navigation authority.

## Honest visual/integration limits
This is materially different runtime geometry/presentation, but it is not yet equivalent to the supplied reference. Terrain still needs a richer authored ground treatment; foliage crown density/silhouette and lighting lack the reference's finish. Large channel dimensions remain conspicuous beside the accepted human scale; cosmetic shrinking would contradict the solver footprint, so this pass does not hide that site-design issue. Raised gate handle reach also needs an authored access/site solution rather than changing character size.

The pre-existing limitations in `irrigation-geometry-handoff.md` still apply:
- No visible routed leakage/overflow bypass; opening before sealing remains prohibited, so leak correctness is not proven by this route.
- Outfall grate marks a solver boundary, not a modeled downstream stream.
- Channel dressing/banks/scenic relief are not new solid traversable terrain.
- Demo trays now have proper modeled supports and lining, but the two-tray hydraulic transfer is still not a fully visible, hands-on mentor demonstration. No full teaching-sequence acceptance claimed.
- No structural simulation, agronomic validation or new crop-growth response.
- No physical iPad/Xcode export, device performance, child enjoyment or whole-game visual approval established.

## Verification result
See `results.json`, individual `.log` files and `tested-source-sha256.json` in the evidence directory for the final frozen-source execution. The final result and screenshot index are recorded alongside the comparison artifact after that run completes.
