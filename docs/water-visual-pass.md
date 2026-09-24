# Water for the Village — environment visual pass

## Delivered

A continuous, variable-width garden footpath replaces the straight beige strip. Staggered two-course stone banks, a plank crossing, timber sluice frames and spoked wheels make the waterworks readable. Low timber vegetable beds, furrows, a small open potting bench and edge planting establish a working garden. Three timber/plaster cottages, rounded tree groups and scenic hills replace the rectangular enclosure silhouette. The boundary meshes are hidden; their original collision remains. The original floor, water/gate/debris state arrays, destinations, labels, objective marker, action routing and character clothing/rigs remain intact.

## Authorship / reuse

- **New original in-engine geometry:** ribbon paths, shared-resource MultiMesh stone courses/bridge/bed borders/bench, rounded tree canopies, scenic hills and wheel spokes. Deterministic placement. Box/sphere geometry and palette materials are shared and batched by mesh/material, rather than one draw per stone.
- **Existing CC0 models recombined:** Quaternius Medieval Village MegaKit Standard FREE modular architecture/fences via `assets/environment/village_finish.gd`; Kenney Nature Kit `plant_bushDetailed.glb` and `flower_yellowC.glb`. No new asset downloads, no paid APIs.
- Sources: https://quaternius.com/packs/medievalvillagemegakit.html and https://kenney.nl/assets/nature-kit . Existing provenance and full licenses remain in `assets/environment/PROVENANCE.md`, `QUATERNIUS_MEDIEVAL_VILLAGE_STANDARD_LICENSE.txt`, `KENNEY_NATURE_LICENSE.txt`.
- Existing generated adult models and protagonist unchanged. This is a composed free-kit / authored low-poly environment, not bespoke production character art or sculpted walkable terrain.

## Verification and captures

Godot 4.7.2, fresh isolated `XDG_DATA_HOME` for each run:

- Headless `res://tests/water_campaign_test.gd`: **WATER_FAILURES=0**.
- Native `res://tests/water_input_playthrough.gd` under `xvfb-run -a`, `--fixed-fps 60 --rendering-method gl_compatibility`: **WATER_INPUT_FAILURES=0**, including actual collision traversal, ordered gates, wrong-order recovery, restored beds, pause, harvest, Russian and portrait captures. Final native run occurred after all geometry/material fixes.
- Actual normal gameplay and overview images were visually inspected, not inferred from headless tests. First captures exposed shallow-overlay shadow acne and ribbon join gaps. Shared ribbon edge vertices fixed gaps; paths explicitly do not receive shadows in compatibility mode to remove severe striping. Final normal gameplay capture verified stripe removal and clear actors.

Final screenshots (native generated, temporary paths; parent should archive selected evidence):

- `/tmp/jd-water-dry-garden.png` — ordinary gameplay, dry beds, Mira, village setting.
- `/tmp/jd-water-dry-garden-portrait.png` — portrait gameplay.
- `/tmp/jd-water-overview-restored.png` — explicitly posed composition overview, separate from traversal proof.
- `/tmp/jd-water-spring-open.png` — upstream water only.
- `/tmp/jd-water-wrong-order.png` — recoverable spill.
- `/tmp/jd-water-garden-restored-ru.png` — restored garden, ordinary gameplay camera.
- `/tmp/jd-water-complete-ru-portrait.png` — completion at portrait size.

## Remaining production limitations

Scenic hills are non-colliding framing, not a walkable terrain system. Existing flat ground and invisible boundary collision are deliberately authoritative. Paths now use a darker fine-noise material (parent review refinement), with batched aggregate; they deliberately omit received shadows to avoid compatibility-renderer acne and need a production terrain/decal material later. Imported nature foliage remains rather dark and sparse against the bright meadow; tree forms are stylized low-poly clusters. Existing garden leaves/harvest props and water are still simple geometry. Backgrounds are substantially more composed than the slab prototype but not final premium art. Mobile device frame-time was not measured; test renderer is Mesa llvmpipe. Xvfb emitted harmless input-method/VSync warnings. No tests edited, no commit, no publish.
