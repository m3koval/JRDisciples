# Motion cleanup v3 — controlled review candidates

These files are NOT automatically enabled in the game. Preserve revision-v2 and the high-resolution masters for rollback.

## Work performed
- Scanned complete imported walk/run timelines at 60 Hz rather than relying only on a few screenshots.
- Adjusted arm swing/forearm flexion to clear body/clothing while retaining the original gait. Michael's excessive sideways-arm attempt was replaced with a more natural elbow-flexion correction.
- Baked a vertical support correction at 60 fps: walking retains a supporting sole on the zero plane; running retains its positive airborne phase. This is flat-ground source animation cleanup, NOT terrain IK or runtime foot locking.
- Rosie: preserved original skirt weighting after rejecting the broad skirt-reweight experiment. Retained the improved arm animation and removed selected covered upper-thigh faces that poked through the opaque outfit. Her matching rig must travel with these clips; the high-resolution source was not destructively changed.
- Joseph: confirmed leather pouch vertices followed arm bones. Repaired anatomical wrist/hand assignments and pelvis garment weighting with arm-region protection. Matching rig must travel with these clips.
- Kept all 24-joint skins and explicit review-only status. No paid generation was used for this cleanup.

## Evidence and meaning of PASS
`full-cycle-screen.json` contains actual measurements after importing the final GLBs, including selected-region sizes, joint counts, weighted vertices, floor extrema and every sampled pose. `manifest.json` binds the files to SHA-256 checksums. Run `python tools/trail_of_truth/check_character_motion.py` from the repository root.

The contact screen constructs BVHs from evaluated triangles in hand-dominant (>0.5 hand weight) regions versus torso/lower-body-dominant regions. It excludes arm/forearm and mixed-weight boundary triangles. Zero reported intersections means **zero intersections among these selected surfaces at these sampled times**, not universal collision freedom. Fully contained surfaces, excluded seams, transitions, hand-to-hand contact and intervals between samples are not certified. Floor measurements use foot/toe-weighted vertices, not gameplay colliders.

## Remaining visual/gameplay gates
- Long robes/dress hems on Simeon and Anna still distort during running. Do not promote their running clips as finished clothing animation.
- Tobias's running shoulder/sleeve balloons; this remains a visual failure even when the hand-contact test passes.
- Rosie retains a rough side slit/hem and seam artifacts; the rejected skirt experiment is not used. Close-up cloth polish remains outstanding.
- Joseph requires close-up shoulder/wrist and garment-boundary review; full-motion numerical checks cannot replace this.
- Gait style/blend transitions, slope/stair handling, controller speed matching, planted-foot sliding and loop-seam behavior need in-engine validation.
- Lamb carrying, tool grips, baking, giving and other hand-to-object interactions are NOT addressed by locomotion clearance and remain separate tasks.
- No physical iPad test, runtime integration, game build, deployment or live replacement was performed.

## Files
Each character folder has `walk.glb` and `run.glb`. Rosie and Joseph additionally have matching revised `rig.glb`; other rigs remain from revision-v2. Preview sheets show actual exported meshes, not reference illustrations. Source scripts are archived for inspection, but retain explicit original workspace paths and require those source inputs to reproduce; the registry checker is repo-relative.
