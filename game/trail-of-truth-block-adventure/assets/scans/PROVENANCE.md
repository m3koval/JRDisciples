# Scanned rock provenance

All files here come from Poly Haven (https://polyhaven.com), released under
CC0 1.0 (public domain; no attribution required, credited anyway). Zero cost,
no accounts, no generated content. Downloaded 2026-09-25 at 1k texture
resolution, glTF format.

| File | Poly Haven asset | Source tris | Shipped tris |
| --- | --- | --- | --- |
| `boulder_01.glb` | https://polyhaven.com/a/boulder_01 | 66,122 | 7,000 |
| `rock_moss_a..f.glb` | https://polyhaven.com/a/rock_moss_set_01 (split per rock) | 63,127 | 5,993 total |
| `namaqualand_boulder_05.glb` | https://polyhaven.com/a/namaqualand_boulder_05 | 89,618 | 4,999 |
| `namaqualand_cliff_01.glb` | https://polyhaven.com/a/namaqualand_cliff_01 | 94,369 | 8,999 |
| `namaqualand_cliff_02.glb` | https://polyhaven.com/a/namaqualand_cliff_02 | 194,080 | 10,000 |
| `rock_face_02.glb` | https://polyhaven.com/a/rock_face_02 | 29,566 | 6,000 |
| `stone_fire_pit.glb` | https://polyhaven.com/a/stone_fire_pit | 3,887 | 3,887 |
| `textures/rock_face_03_*.jpg` | https://polyhaven.com/a/rock_face_03 | tileable | 512 px |
| `textures/rocky_trail_*.jpg` | https://polyhaven.com/a/rocky_trail | tileable | 512 px |
| `textures/hessian_230_*.jpg` | https://polyhaven.com/a/hessian_230 | tileable | 512 px |

## Processing

`tools/trail_of_truth/blender/optimize_polyhaven.py` (Blender 5.2, headless):
Collapse-decimate to a triangle budget, scale embedded textures to 512 px,
re-export as GLB with JPEG textures. `boulder_01` needed two passes (its
UV seams stalled the first). `rock_moss_set_01` was split into one GLB per
rock (origin at base center) by `split_scan_set.py`. Tileable textures were
resized with Pillow.
The `*_normal.jpg` import settings are marked as normal maps.

## Runtime notes

- `scripts/cave_scenery.gd` places the models and applies the tileable
  textures triplanar to the cave shell, ground and hillside backing boxes.
