# Small-games release QA

This release integrates four Archer pilot/history commits and bounded improvements across Archer, Sling, Runner, Shield, Shepherd, Giants, Manna, Daniel, Spot, and the Trail launch shell. It is not a completed visual overhaul or owner art approval.

## Verification

Deterministic regression coverage includes Archer physics/review; Sling timing/recovery; Runner engine/scripture/projection; Shield rules/readability; Shepherd mechanics/guidance; Giants course/scripture/world; Manna mechanics/scripture; Daniel reducer progression; Spot masks/detail; Trail static wiring; A/B/C improvement and refinement checks. Two stale harness assumptions were repaired without removing gameplay assertions: Sling now explicitly checks pause OR renderer-not-ready; Manna imports the real new art module into its VM harness.

Latest aspect-fix browser evidence binds nine current source files (Sling/Runner, landscape/portrait). Refinement evidence binds current Manna/Daniel source; its older shared-renderer hash is superseded by aspect-fix evidence. Inspected the composite captures: Runner's newer portrait proportions are corrected, Sling corridor is visible, Manna remains small in portrait, Daniel first-room controls are readable. Evidence remains outside runtime/repository under `all-games-pass/aspect-fix`, `refinement-qa`, and `release` in the release workspace. The Archer alignment validator requires actual browser snapshots and is not a standalone unit test; missing default snapshots are not a passing browser result.

## Limitations and preserved history

Canonical Michael remains SHA-256 `fddb290aae7b65da54640c1f67821a0c93940fccd89f5c3d88848a86ad88756d`. Sling/Runner use static presentation; Archer's mounted bow and idle presentation do not implement accepted hand-contact archery. Rejected rig experiments remain archival documentation, not active code. No paid generation was run.

The earlier Archer provenance records rejection of the generated grove tree for that scene. The existing Sling/Runner branch reuses that tree as shoulder scenery; this does not reverse its visual rejection or establish owner approval. Manna, Shepherd, Shield and Spot remain 2D/mixed presentation; Trail changes affect the web launch shell, not its embedded Godot build.

No full ten-game browser playthrough, physical iPad/Xcode performance, comprehensive touch/multitouch, RU browser matrix, premium visual approval, or complete source-only/offline export verification is claimed. Existing scoped browser startup/input and GLB failure/retry checks are not those gates. Push, CI success and production deployment must be reported separately.
