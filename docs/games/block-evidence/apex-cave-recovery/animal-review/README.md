# Archived cave animal acceptance gate — NO-GO

**Recommendation: do not integrate either archived GLB as a replacement for the articulated actors.** No production adapter was installed. No main, campaign, motion, original animal or scenery scripts were edited.

## Actual native previews

- [Lion three-quarter](lion_three_quarter.png) / [front](lion_front.png)
- [Bear three-quarter](bear_three_quarter.png) / [front](bear_front.png)

Left is the current articulated animal. Right is the unmodified archived GLB, uniformly height-matched and grounded. Same camera and light per comparison. These are isolated studio comparisons, NOT integrated cave/gameplay evidence or owner approval. Both models face the same +Z direction without additional rotation.

## Findings

| Asset | Triangles | Vertices | Meshes / primitives | Skins / clips |
|---|---:|---:|---:|---:|
| Lion | 1,350 | 3,098 | 1 / 1 | 0 / 0 |
| Bear | 946 | 1,876 | 1 / 1 | 0 / 0 |

Both have no JOINTS_0 vertex attributes and no independent limb mesh nodes. Their SHA-256 hashes exactly match `assets/caves/CREDITS.md`. Each is a valid renderable static mesh, not a compatible animated replacement. `cave_animal_motion.gd` calls `pose(delta,state,remaining,speed)` on presentation children. Applying whole-object bobbing to these archives would discard the existing independently articulated hips, knees, head and tail, including the lion pounce and bear single-paw reach. A method-shaped no-op adapter would not preserve that behavior.

The archived lion has a more organic low-poly silhouette but a narrow body and coarse faceted mane; the bear has a recognizable hunched profile but very dark simplified face/underside. Neither establishes the requested warm polished animated quality. Do not treat the original block rigs as approved either: the current mismatch remains unresolved.

Uniformly matching the existing 1.66 m presentation height grounds the archived feet to within 0.001 m, but does NOT preserve the full envelope:

| Species | Current width × height × depth | Archive at matched height |
|---|---|---|
| Lion | 1.140 × 1.660 × 2.7635 | 0.8353 × 1.660 × 3.5501 |
| Bear | 1.120 × 1.660 × 2.4485 | 0.9708 × 1.660 × 3.0607 |

Full-envelope scaling would distort their anatomy. No collider, health, movement or attack-timing changes were attempted. Recovering these assets for articulated use would need deliberate retopology/rigging/weighting and motion authoring rather than a bounded adapter. Preferred next lane: a reviewed warm stylized rigged quadruped pilot, with actual walk/pounce/reach clips and temporal bounds proof, before integration.

## Verification

`tests/cave_archived_animal_review.gd` loads GLBs directly using GLTFDocument (no competing editor import), checks generation success, zero skins/clips, equal height and floor contact, then writes four actual native captures plus bounds JSON. Run from the Godot project:

```sh
mkdir -p /tmp/apex-animal-xdg /tmp/apex-cave-animal-review
XDG_DATA_HOME=/tmp/apex-animal-xdg LP_NUM_THREADS=2 xvfb-run -a \
  /home/helper/tools/godot-4.7.2/godot --path . \
  --rendering-method gl_compatibility --fixed-fps 60 \
  --script tests/cave_archived_animal_review.gd
```

Actual result: exit 0; `ARCHIVED_ANIMAL_REVIEW_PASS`; four 1100×650 PNGs. See `render.log`, `bounds.json`, `archive-audit.json`. No script/engine errors; the native Xvfb session emitted nonblocking XIM/VSync warnings. Three-quarter previews were visually inspected. Front views are supplementary captures, not separately reviewed motion evidence.

## License

Existing credit record retained unchanged: Lion by Poly by Google, CC BY 3.0, https://poly.pizza/m/3XAJojWxSWz ; Bear by madtrollstudio, CC BY 3.0, https://poly.pizza/m/kLLBpmcw0w . No paid requests, downloads or new third-party assets.
