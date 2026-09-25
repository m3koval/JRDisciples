# Cave evidence for asset comparison (commit 071d4d5)

Native Godot 4.7.2 captures, Mac, `--rendering-driver opengl3` (Compatibility).
Not iPad or browser evidence. The Web export was not rebuilt, so the synced
app and the iPads still run the older caves.

Recapture after swapping assets (same player position and camera):

```
JD_CAVE_EVIDENCE_DIR=<folder> Godot --path game/trail-of-truth-block-adventure \
  --rendering-driver opengl3 --script res://tests/cave_evidence_capture.gd
```

Clear `user://block_save.json` first. All shots are at the lion cave (entrance 0,
x=88) at the start of the chapter (stage 0).

| View | Player | Landscape | Portrait |
| --- | --- | --- | --- |
| Entrance | e + (0, 0, 6) | `cave-1-entrance-1280.png` | `cave-1-entrance-720.png` |
| Threshold (in the doorway, still outside) | e + (0, 0, 0.2) | `cave-2-threshold-1280.png` | `cave-2-threshold-720.png` |
| Inside, lantern lit | e + (0, 0, -5) | `cave-3-inside-1280.png` | `cave-3-inside-720.png` |

## Cave model and source files

Code:
- `game/trail-of-truth-block-adventure/scripts/cave_scenery.gd`: builds the
  shell, facade and hill. Replaces the old `gate-rock.glb` arch, crown boxes
  and `corridor.glb` placement.
- `game/trail-of-truth-block-adventure/scripts/cave_campaign.gd`: gameplay;
  calls `cave_scenery.build()`, owns clue signs, camp, lantern light,
  darkness/visibility (`sync_darkness`, `chamber_of`) and hiding the
  opening's distant-hills ring (`sync_backdrop`).

Structural geometry (collision authority) is **box geometry** with tileable
scanned textures applied triplanar: ground, perimeter walls, chamber side
walls, back wall, roof (layer 1, stops the camera arm), facade jambs and
lintel, and the solid rock fillers between chambers.

| Role | File (`game/trail-of-truth-block-adventure/assets/scans/`) | Poly Haven source | Tris | Instances |
| --- | --- | --- | --- | --- |
| Door jambs | `rock_face_02.glb` | https://polyhaven.com/a/rock_face_02 | 6,000 | 6 |
| Crown over each doorway | `namaqualand_cliff_02.glb` | https://polyhaven.com/a/namaqualand_cliff_02 | 10,000 | 3 |
| Hill mass on the roofs | `namaqualand_cliff_02.glb` | same | 10,000 | 3 |
| Boulder piles between and beside caves | `namaqualand_cliff_01.glb` | https://polyhaven.com/a/namaqualand_cliff_01 | 8,999 | 4 |
| Doorway boulders | `namaqualand_boulder_05.glb`, `boulder_01.glb` | https://polyhaven.com/a/namaqualand_boulder_05, https://polyhaven.com/a/boulder_01 | 4,999 / 7,000 | 3 each |
| Camp fire pit | `stone_fire_pit.glb` | https://polyhaven.com/a/stone_fire_pit | 3,887 | 1 |
| Cave walls, roof, facade texture | `textures/rock_face_03_*.jpg` | https://polyhaven.com/a/rock_face_03 | tileable, 512 px | |
| Courtyard and cave floor texture | `textures/rocky_trail_*.jpg` | https://polyhaven.com/a/rocky_trail | tileable, 512 px | |

All CC0, $0. Scanned triangles in the cave area: about 172k (102k at the
three entrances, 66k hill, 4k fire pit). Processing:
`tools/trail_of_truth/blender/optimize_polyhaven.py`. Full table:
`game/trail-of-truth-block-adventure/assets/scans/PROVENANCE.md`.

Swap points: every scan is placed by one `scan(parent, id, position, scale,
yaw)` call in `cave_scenery.gd` (`_dress_entrance`, `_dress_hill`); scans are
visual only, so a replacement cannot break navigation. Dimensions are in
`cave_scenery.gd` constants (`DOOR_HALF`, `DOOR_TOP`, `WALL_TOP`,
`CHAMBER_HALF`, `CHAMBER_DEPTH`).

## Verified

- `cave_input_playthrough`: all walk-ins, both fights, lamb search and
  escort pass with the enclosed chambers.
- 34/35 native tests pass; `player_test` "right touch owns look only" fails
  the same way on the branch before this commit.
- Nothing inside a cave is visible from the courtyard: animal and lamb
  models are hidden until the player is inside (z < -0.4 within the
  chamber); `animals[i].visible` still means "undefeated" for tests.

## Remaining defects

1. **Chamber interiors are textured boxes.** Flat walls and ceiling, straight
   edges, no rock relief, no props. Most visible defect inside (see
   `cave-3-inside-*`). The storyboard has uneven rock, hay, barrels, cobwebs.
2. **The doorway is a hard-edged rectangle** cut in a flat textured facade;
   the scans frame it but don't read as a natural cave mouth.
3. **The empty back wall is faintly visible from the threshold**
   (`cave-2-threshold-*`). Contents are hidden, but the mouth isn't black.
4. **Sudden reveal.** Animal/lamb models switch on when crossing z < -0.4
   with no fade. Lantern and ambient dimming ease in (0.2 s time constant,
   about 0.6 s to settle).
5. **Blocky animals.** The lion/bear are the existing procedural block rigs
   (`cave_block_animal.gd`), a strong style clash with scanned rock.
6. **Waypoint marker** (the floating cube in the doorway and near the
   ceiling inside) is the pre-existing `main.gd` `target_marker`.
7. **Clue signs:** box post plus `Label3D`. Nearby rock geometry partly hides
   the text ("Pav prints" in the entrance shot); portrait crops the label.
8. **No greenery.** Rock-only hilltop; the storyboard has grassy tops,
   bushes and trees.
9. **Camp** is a flat green disc plus the scanned fire pit, no flame.
10. **512 px textures** blur at close range; decimated `boulder_01` looks
    speckled at distance (it was pulled from the meadow for that reason).
11. **Performance unmeasured on device:** about 172k scanned triangles in 23
    scan instances in the cave area; no iPad frame-rate check yet.
12. **Backdrop:** only the 95m ring (`DistantRidge1`) is hidden while caves
    are active; whether the 125m ring crosses other chapter areas (e.g. the
    water chapter near x=150) is unchecked.
13. **Leftovers:** `assets/caves/gate-rock.glb` and `corridor.glb` are no
    longer referenced but still in the repo; `tests/villager_lineup.gd`
    still loads the renamed `elder.glb` and hangs (predates this work).
14. **Gameplay flow differs from the storyboard:** caves are sequential
    (lion, bear, lamb) rather than "pick a cave". Not changed here.
