# Faithful Archer live 3D pilot — asset provenance

This is a live Three.js/WebGL presentation adapter at the existing game route, not rendered image cards. Physics and scoring remain in page.tsx/physics.ts. Owner visual approval is pending; do not propagate this art to the remaining games or replace production before that checkpoint.

## Reused assets

- `michael.glb`: byte-identical owned Trail of Truth runtime asset, `game/trail-of-truth-block-adventure/assets/michael.glb` (SHA256 `fddb290aae7b65da54640c1f67821a0c93940fccd89f5c3d88848a86ad88756d`). Inspection proved matching UV/material bindings and a correct recognizable rest pose. The rejected pilot's arbitrary two-bone IK pulled pouch/hem surfaces into the arms; this was a skin/pose defect, not a missing texture. The correction uses the asset's authored Idle clip, same body height and original texture/material slots, restrained normal strength, and a three-quarter facing. The independently aimed bow is visibly mounted on a practice stand. **No hand-contact archery animation or repaired source skin weights are claimed.** Masters are unchanged; no speculative runtime reweighting or sprite replacement.
- `rock_moss_a.glb`, `rock_moss_c.glb`, `boulder_01.glb`, `rocky_trail_albedo.jpg`, `hessian_230_albedo.jpg`: existing curated Poly Haven CC0 derivatives. Upstream https://polyhaven.com/ ; source/provenance remains in `game/trail-of-truth-block-adventure/assets/scans/PROVENANCE.md`.
- `plant_bushDetailed.glb`: Kenney Nature Kit, CC0, https://kenney.nl/assets/nature-kit . Existing curated source and license in Trail environment assets.
- `timber.jpg`: derivative of Quaternius Medieval Village MegaKit Standard FREE CC0 wood trim texture, https://quaternius.com/packs/medievalvillagemegakit.html . Crop source `environment/T_WoodTrim_BaseColor.png` to `(0,0,512,150)`, rotate 90 degrees, JPEG quality90. Source unchanged; unused full atlas excluded from this runtime directory.
- Bow, arrows, target props, gallery, platform, terrain and masonry: original authored live geometry in `range-3d.ts`, using licensed material derivatives above. Not purchased/sculpted hero-prop assets. No competitor artwork or ripped models.

## Generated tree

- Endpoint: `fal-ai/hunyuan-3d/v3.1/pro/text-to-3d` (actual mesh generation).
- Request ID: `01a10bc1-7738-7540-be67-0331372e01bd`.
- Original text-only prompt and raw response/source: `/mnt/hermes-storage/jd-small-games-3d/assets/grove-oak-01/`.
- Settings: Normal, PBR enabled, 40000 requested faces.
- Provider pricing page: https://fal.ai/models/fal-ai/hunyuan-3d/v3.1/pro/text-to-3d . Commercial-use label recorded at submission; generated from original text with no third-party image input.
- Runtime `grove-oak.glb`: source mesh retained; embedded textures resized to max1024 and JPEG88. 1,503,904 bytes; SHA256 `e057690d2e942b51656a641a9b91c9b68f82caec865d2ce9bc49e4ce47d0e8fb`.
- Single original ledger: `/mnt/hermes-storage/jd-games-overnight/budget.json`. 68 cents reserved BEFORE submission under file lock. Actual provider charge remains unconfirmed; reservation is not released or described as zero cost.
- Generated tree was rejected by parent visual review and is **no longer loaded or rendered**. The source and derivative are retained for provenance; the 68-cent reservation remains. The Kenney bush is also no longer loaded. Replacement foliage adapts the owned Trail `scripts/opening_trees.gd` tapered fork/folded-leaf approach into batched Three.js geometry with varying crowns and sparse meadow blades. This is authored procedural geometry, not a newly purchased/sculpted tree pack and not owner-approved.

## Correction evidence and remaining visual limits

The parent evidence folder `/mnt/hermes-storage/jd-small-games-3d/evidence/correction/` contains the rejected-pose diagnostic, intact character closeups, iterative ordinary-camera views, and final matched landscape/portrait. The original `evidence/final/matched` screenshots remain untouched. The launch/collision plane and camera tilt are unchanged. World-space gravel UVs remove the stretched wood-like path appearance; continuous masonry, an approach opening and varied foliage replace the old sparse wall and lobe trees. Tablet portrait uses a full-width playfield and compact lower HUD. Scene composition remains an elevated side-on archery range, not an explorable premium environment. Art acceptance and physical iPad performance remain separate pending gates.

## Dependency

Three.js 0.180.0, MIT, bundled locally by Next.js. GLTFLoader and RoundedBoxGeometry use the same pinned package. No runtime CDN or paid runtime service.
