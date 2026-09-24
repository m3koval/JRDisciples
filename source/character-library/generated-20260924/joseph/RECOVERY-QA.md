# Joseph recovery QA

## Outcome: blocked before paid model generation

Visually inspected `existing-joseph-front-crop.png`, the existing 163 × 413 pixel front crop. This is genuine pre-existing character artwork, not a newly generated substitute. Its provenance is recorded in `identity_edit.py` as a crop of `/home/helper/work/JRDisciples-trail-of-truth/docs/games/trail-of-truth-art/concepts/03-joseph-character-sheet.png`.

### Visual findings
- One fully clothed stylized character, frontal view, entire head and both boots visible.
- Blue tunic/trousers, dark curly hair, belt, diagonal strap, and worn hip pouches.
- Both hands appear empty; no held prop is visible. Worn pouches are not held props.
- **Fails the requested A-pose gate:** arms hang close to the body rather than approximately 30 degrees outward. Hands run alongside/partly overlap the hip-pouch silhouette, especially at image-right. Clear arm/hand-to-body separation is insufficient for the requested clean image-to-3D reference.
- Small source crop limits hand and costume detail. Merely enlarging it would not repair the pose or reveal occluded geometry.

### Action taken
Inspected the Joseph file inventory, existing status, identity-edit source/provenance, and Michael's shared `generate_pair.py` pipeline. Did not execute that script: its default main processes both Michael and Joseph, outside this lane's ownership. Did not submit any image, model, or rig requests; no new provider request IDs or charges were created by this recovery pass. Did not retry or alter prompts to work around the recorded image checker refusals. Did not access credentials or modify the game.

### Precise limitation
Joseph is not complete. This inspected reference does not satisfy the user's conditional authorization to reuse an existing A-pose/no-props image. No actual Joseph model or rig was produced or visually QAed in this recovery pass. Proceed only with a separately supplied/approved clean reference meeting the pose and silhouette requirements; do not silently substitute another character or represent this artwork as compliant.
