# Villager provenance

Generated to match Michael's own style, per `docs/junior-disciples-character-library.md`
("Village adults"). Reference images were made by the project owner outside this
repo; each was then sent through an image-to-3D provider to produce a textured,
rigged model (24-joint skeleton), delivered as `junior-disciples-six-character-rigs.zip`.

- `simeon.glb` ← Grandpa Simeon reference → `rig_rigged_character_glb.glb`
- `anna.glb` ← Aunt Anna reference → `rig_rigged_character_glb.glb`
- `tobias.glb` ← Tobias the baker reference → `rig_rigged_character_glb.glb`

## Changes made here

- Decimated in Blender (Collapse, ratio 0.22) from ~99k triangles to ~21.7k each,
  and textures resized from 4096px to 1024px. Source files are ~20MB each with
  4k textures; for three background NPCs alongside Michael (~80k tris, 13.4MB)
  that was worth trimming. Un-decimated originals are not kept in this repo.
- The source rig ships one rest-pose keyframe, not a loopable idle animation
  (confirmed: single-keyframe samplers). `main.gd` plays that pose once, then
  drives a small procedural breathing sway and a greeting bow itself — there
  is no baked idle/wave clip to call.
- Each source model's own origin sits above its feet (feet land ~1 raw unit
  below origin); `main.gd`'s `foot_offset` per villager compensates so feet
  rest on the floor at y=0, the same convention Michael's model already uses.
- Scale (~0.61–0.63) was set by measuring each raw model's height in Blender
  and targeting an adult clearly taller than Michael (in-game ~1.34m).

## Known issue

Tobias's reference image gave him a modern chef's toque rather than the
"soft cloth cap" written in the character library. That came from the
reference image itself, not from 3D generation — fixing it means a new
reference image and a new model pass, not a local edit.

## Not carried over from the source pack

Rosie, Gracie, and Michael's own regenerated model/animations came in the
same delivery but are not used here: Michael already has an accepted
in-game model (see `THIRD_PARTY_NOTICES.md`), and Rosie/Gracie aren't in
this scene. Joseph's reference generation failed the provider's content
check per the source pack's own `RECOVERY_RESULT.md`; no model exists for
him. A 32-clip generic motion library was also delivered but uses a
different (52-joint) skeleton than these rigs, so nothing from it was
retargeted here.
