# Irrigation garden art provenance

Zero paid APIs, purchases, or generated-image/model services used for this pass.

## Reused lawful kit
Existing environment assets remain curated from Quaternius Medieval Village MegaKit Standard FREE (CC0) and Kenney Nature Kit (CC0). Source URLs, archive license copies and curation details remain in `../environment/PROVENANCE.md`. No new third-party assets were downloaded. Existing cottage models/materials and a few selected understory plants were retained; the old irrigation sphere-tree assembly was replaced.

## Original production sources
- `make_ground_texture.py` → `painted_ground.png`: deterministic original soft pigment/grain data made locally with NumPy/Pillow. Not a photograph or a reference-image derivative.
- `ground.gdshader`: shared grass/path/cultivated-soil blend in world coordinates.
- `water.gdshader`: bounded animated surface/drop shading; no authority over solver volumes or bed heights.
- `../../scripts/garden_terrain.gd`: shared-vertex terrain mesh, path-distance blend, scenic perimeter relief, house pads. Flat walkable core preserves the existing collider.
- `../../scripts/garden_foliage.gd`: original branch/root geometry, folded leaf crowns, short grass, ferns and flower meshes, batched using MultiMesh. Deterministic authored placement with low meadow transitions and station exclusion zones. No downloaded textures or alpha foliage cards.
- `../../scripts/garden_workshop_art.gd`: original framed plan bench, repair rack and supported demonstration trays. Illustration on the bench is object geometry, not an instructional-method certification.
- `../../scripts/garden_lighting.gd`: chapter-scoped lighting preset, restores the prior environment/light settings when deactivated.

The user-supplied reference is visual direction only, not imported game artwork. These editable Godot mesh generators are production source; this pass does not include a separately authored Blender/GLB environment pack. Device performance and owner visual approval remain separate acceptance gates.
