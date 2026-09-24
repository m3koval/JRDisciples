# Source-motion review

All 32 FBX files imported successfully in Blender with armature, animation, nonzero frame range and finite sampled joint transforms. This is structural validation only.

Four contact sheets were inspected after fixing the visualizer to connect joint heads to their parent heads (FBX bone tail display is not an anatomical connection).

## Findings
- `lamb_shoulder_carry`: hands visibly elevated near head/shoulder region while stepping. Candidate for retarget pilot. Does not establish actual lamb contact, grip, load support, or head clearance.
- `kneel_pet`, `plant`, `hammer`: visible kneeling/lowered posture. Candidate task sources, require hand contact calibration and full playback.
- `lamb_lift`: sampled sequence does not clearly complete a controlled shoulder placement. Not accepted as finished lift.
- `lamb_release`: lowering/squatting motion present, but release location and continuity with carry unverified.
- `sweep`, `dig`, `give_receive`, `gather`: pose intent is weak or inconsistent with requested tasks. Hold from game integration; do not relabel as finished interactions.
- `run`: sampled poses do not demonstrate a convincing run cycle; prefer rig provider's walking/running exports pending their independent visual review.
- `idle`, `walk`, `wave_beckon`, `reach_high`, `push`, `pickup_place`: recognizable general intent in sampled poses, not certified smooth or contact-correct.
- Remaining clips: source candidates only; temporal smoothness and task fidelity not established by four sampled frames.

No source FBX in this folder is automatically game-ready. Rig-retargeting, ground contacts, clothing deformation and actual object interactions are separate gates. No generated skeleton is a substitute for the canonical character mesh.
