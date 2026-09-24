# Recovery and QA result

## Verified
- Six of seven characters have reference PNGs, textured geometry, skinned rigs and real animated mesh exports: Michael, Rosie, Gracie, Grandpa Simeon, Aunt Anna, Tobias.
- GLB structural validation: meshes, materials, 24-joint skins, nonempty animation channels; hashes saved in asset-inventory.json.
- Actual front, side and back model renders inspected: recognizable canon, no obvious duplicate faces or major silhouette defects.
- Actual skinned walk samples inspected for all six. Michael walk/run/idle and Rosie additional stock gestures/kneel/jump also inspected. Coherent gross body deformation; cloth folds, hems and leg contact still need polish, especially long adult garments. This is not exhaustive animation QA.
- All 32 custom motion FBX sources import in Blender and have distinct file hashes. Lightweight animation-only GLB derivatives retain real animation channels and contain no mesh. Four actual skeletal pose sheets reviewed; weak/mismatched actions documented in motions/VISUAL_REVIEW.md.
- Three initial delivery ZIPs passed archive CRC integrity checks. A compact animation-only ZIP also passed CRC checks.

## Not complete / release blockers
- Joseph: repeated provider content-checker rejection; old reference fails pose/resolution suitability. No fresh model or rig; no additional paid retries during recovery.
- Custom interactions are NOT finished gameplay. Some generated source motions miss their intended action.
- Michael shoulder-carry retarget exists as experimental preview only: feet hover and hands are not calibrated against an animal; one hand is near the head and the other near the chin. NOT approved as finished lamb carry.
- Michael kneel/pet retarget is withheld from GLB release because ground support/wrist/contact quality fails. Experimental Blender source retained for correction.
- No articulated fingers, facial system, clothing collision, iPad optimization, controller integration, tool contact or full seven-character interaction verification.
- No existing game files changed and no deployment performed.

## Render recovery
An overbroad stock-animation render pass was stopped after producing Michael and Rosie inspection sheets. A bounded three-frame walking pass completed for Gracie, Simeon, Anna and Tobias. Some incomplete draft render files remain outside the inspected sheets; they are not QA evidence.

## Delivery
- delivery/junior-disciples-six-character-rigs.zip
- delivery/junior-disciples-six-character-walk-run.zip
- delivery/junior-disciples-32-animation-only-sources.zip
- Raw FBX masters and experimental retarget files remain in this source workspace.
