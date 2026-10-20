# Character revision v2 — review candidates

## Improvements
- Joseph now has a clean source reference, a textured rig, and walk/run clips. Dark curly hair and blue outfit retained; empty hands. The older batch's blocked status is historical, not current.
- Rosie hair geometry now has a wavy side/back silhouette. Existing face, outfit, topology, skinning and non-hair vertices retained. See `rosie/hair-comparison.png`.
- All seven characters have optimized rig/walk/run GLBs: 23,998–24,000 triangles, 24-joint skins, textures capped at 2048px. Original/revised high-resolution assets are retained separately.
- The 21 optimized exports total 49.91 MB versus 448.54 MB for their high-resolution inputs (88.87% smaller). This is asset storage reduction, NOT an iPad frame-rate measurement.
- Re-imported every final GLB in Blender; no unweighted mesh vertices; finite vertex samples; nonzero walk/run deformation across nine sampled phases.
- Actual front/side and motion-pose renders inspected. Seven-character shared-scale lineup is an art-direction proposal; normalization is not baked into the candidates. Gracie is visibly younger/smaller and adults clearly taller.

## Limits / release gates
- Final corrected Rosie motion samples show hand/dress overlap and hip-area artifacts; these clips are not contact-clean.
- Final Joseph motion samples show hands crowding/intersecting belt pouches and imperfect wrist/hand silhouettes. Preserve the new identity/model, but refine skinning/contact before gameplay.
- See `revised-motion-sheet.jpg` for these actual final-model samples; these are known issues, not hidden by the structural PASS.
- REVIEW ONLY; not enabled in Godot or the shipped web/iPad build.
- No physical iPad performance test was possible here. No device-ready claim.
- Sampled poses do not prove full-cycle foot locking, garment collision, smooth transitions, or hand/prop contact. Robe/apron motion still requires gameplay-specific validation and possibly tailored weights/clips.
- Stock running is not automatically suitable for every adult's personality or long clothing.
- Fingers and faces do not gain independent controls from this optimization; 24-joint rigs remain limited.
- Lamb carrying, kneeling, tools and baking contacts remain separate integration gates.
- `motion-screening.jpg` uses the six original-character optimized bodies, before Rosie's hair revision; final Rosie/Joseph motion evidence is in their folders when present.
- Proposed heights are art-direction values, not changes to canonical ages or asserted real-world heights.
- Reproduction scripts retain original workspace paths; update those explicit path constants on another machine. Source files must be retained for reproducing the derivation.

## Structure
- `<name>/rig.glb`, `walk.glb`, `run.glb`: optimized candidates.
- `high-resolution/`: new Joseph and revised Rosie source-quality models.
- `manifest.json`: explicit disabled readiness and per-file SHA-256.
- `final-verification.json`: fresh-import deformation screening results.
- `scale-proposal.json`: lineup transforms; not applied to gameplay.

Previous `generated-20260924` assets remain unchanged for rollback/comparison.
