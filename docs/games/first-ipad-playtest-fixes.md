# First iPad playtest fixes

## Feedback addressed

1. Walking/camera: fixed resting joystick anchor near visible control; exclusive touch ownership; a movement pointer cannot also acquire look; mouse orbit cannot acquire while either touch pointer is active. Camera retracts immediately from obstacles but recovers outward smoothly instead of snapping. These reproduce code-level failure mechanisms, not a claim that physical iPad behavior has already been requalified.
2. Grass/earth flicker: bank tops and grass caps were coplanar, as were the terrace cap and earth. Recessed only the supporting brown render surfaces; physics ground heights remain unchanged.
3. Oversized boards: bridge width reduced from 4 to 2 world units with matching collider/map/preview. Pickup/carry plank changed from 1.8x0.22x0.52 to 1.6x0.12x0.26.
4. Carry motion: stable two-handed arm pose over locomotion, lower/closer plank socket, no hand-swing attachment bob; hand lantern stowed during carrying. Original Michael model bytes unchanged. This is a runtime pose correction, not a newly authored carry animation; accessory/clothing skinning may still merit dedicated rig polish.
5. Lamb too obvious: hoofprints bend beyond the bridge around the raised outcrop into an alcove. Discovery and calling require close distance plus unobstructed sight. Bell is local rather than map-wide. Map stays approximate until discovery. Lamb returns around the rock before crossing. No forced clue-click gates or new grind; existing points remain unchanged.

## Verification

- Native full mission, reward mission, reward unit suite, edge cases, player regression, iPad pointer/carry/camera regressions, terrain geometry, search/LOS/escort and modal layout all exited 0.
- Headless search test emitted the existing-style ObjectDB cleanup warning (2 instances); no script errors. Full touch browser run captured no runtime errors.
- Integrated offline app full TOUCH mission: 63 unique checks PASS in `block-evidence/ipad-control-fixes/checks.json`. Includes camera-yaw invariance during each joystick route, new search route, rescue, points, banner, reload, EN/RU, portrait and short-landscape controls.
- That full touch run used PCK `024676115b3b0d37ffe00175ec44d3cb1814fddb73905e6dbf8021ece4889fa3` before the final lower carry socket/lantern-stow visual refinement.
- After that visual refinement, native pointer/carry regression and full reward mission reran successfully; the final build has a separate trusted browser pickup/carry smoke test in `block-evidence/ipad-final-carry/`.
- `carry-pose-fixture.png` is an explicitly posed native visual fixture, not input-driven gameplay evidence.
- Final export/source fingerprint guard and `npm run app:sync` PASS. Exact artifact copies verified in public/out/iOS bundle; 99 offline index routes.
- Bilingual and Scripture checks PASS. Full lint: 0 errors, 36 pre-existing image warnings.

Final PCK SHA-256: `0aa1ab842e9c6225ea2e3b266f07ad05673e5dac0f2e5eb39db0e09e47a80857`.

## Device acceptance still required

Pull the app branch, sync/build and run the updated app on the same iPad. Recheck walking while dragging the view with the second finger, walking beside cottages/trees, rotation, grass while moving, and carrying while turning/jumping. The user's prior physical playtest proves the earlier app launched; this revision has not been physically retested here. Do not claim fixed iPad performance based on software-rendered Linux browser FPS.
