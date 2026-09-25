# Opening landscape art provenance

Meadow and creek-bank rocks are Poly Haven CC0 scans; see
`../scans/PROVENANCE.md`. `scripts/opening_landscape.gd` places them around
`world.gd`'s unchanged `MeadowRock` collider so the lamb's alcove
(`main.gd` `LAMB_ALCOVE`) is sheltered on the east and south and open to
the west, where the trail arrives.

## Seed pouch (`../seed_pouch.glb`)

- Drawstring sack shape built in Blender by
  `tools/trail_of_truth/blender/build_seed_pouch.py`: a lathed height profile
  (rounded belly, pinched cinch, small gathered top) with gentle cloth-fold
  noise, a torus rope tie and two small leaves as a sprout. Replaces the
  two-box placeholder in `scripts/main.gd` `_build_objects()`.
- The sack body is textured with the scanned Poly Haven `hessian_230`
  burlap (CC0) in the sack's own space; tie and leaves are colored in
  `main.gd` by mesh name, since glTF drops Blender's node-based colors.
