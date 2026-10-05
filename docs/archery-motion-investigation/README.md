# Archery motion investigation — REJECTED, not implemented completion

2026-10-05. Runtime restored byte-for-byte to feature base `1166d83e0e5bf2c3a140ad73ee3fe9ca32722e2c` after the motion experiment failed visual acceptance. The original accepted Michael model was never overwritten. No main merge/deployment.

## What actually ran

Inspected all 19 joints, hierarchical rest transforms, inverse binds, per-material skin influences, welded mesh components, and four source clips (`Idle`, `Jump`, `LanternRaise`, `Run`). None is an archery clip. Rendered original front/back/side and ten sampled Three.js pose studies. Implemented an experimental offline derivative and fixed-length analytic arm solver; connected its draw/release state to validated gameplay fire events. These edits are **archived and removed from the active runtime**, not claimed as shipped animation.

Two distinct blockers remained:

1. **Skin ownership/continuity:** source material regions are not anatomical regions; the lantern/brass primitive includes hand vertices, and sleeve/forearm surfaces cross material boundaries. Broad lateral masks moved pouch/hem vertices; isolated per-material corrections introduced hard weight discontinuities. Welded component selection and surface diffusion improved the pouch but left collapsed/fragmented bent sleeves. A tiny endpoint error is not a valid skinned-contact test. Source geometry and texture preservation did not establish deformation quality.
2. **Reach/pose:** the presentation's fixed bow pivot and fixed torso location cannot accommodate all supported aiming angles with these measured fixed-length arms. Latest high-angle fixture requested right reach 37.90 versus 29.63 available, and left 37.46 versus 29.01. The solver clamped length (did not scale bones) but left contacts about 8.27/8.45 scene units away. Low-angle left contact missed by about 5.02 units. A corrected torso/stance and bow/launch relationship is required; narrowing authoritative aiming or changing ballistics to conceal this was not done.

An absolute hand-world frame also forced excessive wrist rotation; a minimal-swing inherited frame was tested, but did not resolve sleeve collapse. This is not a validated wrist/skin repair.

Blender 4.2.23 direct automatic weights failed with all 84,329 visual vertices unweighted. A closed voxel proxy also failed with all 22,584 proxy vertices unweighted. No failed automatic-weight output was promoted. The precise reason for the heat solver's failure remains unproven; do not claim a diagnosed Blender fix.

## Evidence and preservation

Included `aim-close.png`, `high-close.png`, `ready-close.png`, `poses.json`, and `rig-audit.json` are **rejected sampled renderer fixtures**, not normal gameplay, continuous-motion, frame-rate, or physical-device evidence. They are intentionally not public web assets.

Complete experiment preserved locally:
`/mnt/hermes-storage/jd-small-games-3d/archived-experiments/archery-motion-20261005/`

Its `manifest.json` binds source, runtime candidate, derivative GLB, and restored files by SHA-256. Final candidate GLB: `ce5c819658adbf5a49e6eed66df4c8172cd538afefda7d4fc190ad8a1b0d9b79`. Original runtime GLB: `fddb290aae7b65da54640c1f67821a0c93940fccd89f5c3d88848a86ad88756d`.

`runtime.patch.zip` preserves the rejected integration patch without normalizing its whitespace. `derive-archery-rig.py.txt` and `archery-pose.ts.txt` are archival text, deliberately not active runtime/generators. Do not apply or run them as a validated repair. The candidate derivation's per-primitive changed-vertex report predates its final surface diffusion and is not a complete final-vertex audit.

## Current application and open gates

The restored application still shows intact Michael beside the mounted bow. That remains Mike's **rejected substitute for actual archery**, retained only to avoid shipping a newly deformed character. Idle is not completion.

No current normal-input gameplay video was produced in this attempt. No release/recovery frame inspection, normal portrait/landscape motion acceptance, or continuous actual-input sequence was completed. After byte-exact runtime restoration, `node scripts/test-archer-physics.mjs` passed 31 checks and `node scripts/test-archer-review.mjs` passed all 7 groups. No new browser campaign/control/save-recovery, full build, offline app sync or signing-hash gate is claimed. Prior baseline results remain historical; the original handoff lists their exact partial coverage.

Primary remains unfinished. All eight subsequent games remain pending pilot approval: david-sling-challenge, truth-runner, shield-of-faith, shepherd-light-adventure, faith-over-giants, manna-trail, escape-room-daniel, spot-the-difference. Optional scenery work was not allowed to displace the failed motion gate.

Budget: original shared $25 ledger only; no paid calls in this pass. $0 settled, $0.68 existing unknown-billing reservation, $24.32 unreserved. No second allowance or reservation release.
