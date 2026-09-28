# Cave discovery and presentation polish

## Scope and delivery boundary

Implemented on `apex/cave-discovery-polish` from `main` at `3170263`. This is a **native-tested source milestone**, not a rebuilt embedded web/iOS bundle or installed iPad release. No main merge, push, paid generation or device deployment is part of this pass. Accepted human characters, existing version-2 saves, free cave choice, staff reach/health contracts and downstream chapter state remain intact.

## Implemented

- Grounded paw-pad/toe trails distinguish animal clues from white wool leading through the lamb entrance. Signs remain usable; evidence adds no new save prerequisite.
- Shorter EN/RU introduction, proximity teaching and encounter-specific prompts. Touch-facing new prompts do not include keyboard suffixes. Lamb discovery/following gets visible feedback; completion settles the lamb rather than leaving it airborne beneath a paused modal.
- Clearer lion charge lane and bear swipe circle. Translucent cues preserve visible ground; the charge cue includes both endpoint damage radii. The lion retains its fast committed attack, while the bear gets a longer windup and recovery. Original damage, jump clearance and two-hit victory remain.
- Authored cross-section torso/face/limb/paw surfaces, improved silhouette, toe separation and articulated paw positioning for both animals. These are procedural articulated meshes, **not new skinned production assets**.
- Quieter coordinated sandstone floor/wall materials and more restrained botanical/bedding/edge detail. Collision geometry and existing route tests are preserved.
- Portrait encounter assistance gently widens the field of view and reframes while stationary. Manual touch/mouse look gets priority and a grace period; keyboard/touch movement heading is not steered. Existing spring-arm collision is untouched.
- A discoverable cave Map button and a compact EN/RU map of the three caves and rest camp. Completed search sites are marked, and the lamb's exact position is discarded until discovery. This is a functional schematic, not a finished illustrated world map. Opening pauses play; closing preserves progress.

## Verification

Final frozen-source checks:

```bash
CAVE_QA_TAG=final python tools/trail_of_truth/verify_cave_discovery.py
python tools/trail_of_truth/capture_cave_discovery_review.py
git diff --check
```

- **17 headless regression jobs passed**, preserving the original 13 recovery suites and adding discovery, anatomy, camera and map coverage.
- **5 native-render jobs passed**, producing **22 fresh captures**: six ordinary cave views, four EN/RU map views, six seeded encounter/discovery views, two actor studies, and four checkpoints from an input-driven route.
- The native input route walked through the real entrances, dodged and defeated both attackers, found/called the lamb, escorted it through collision and completed at camp.
- Headless and rendered runs have identical source fingerprints. Final review included all four contact boards.
- Linux software-renderer X11/VSync warnings were present; no script errors or failed assertions were accepted.

Evidence: [verified folder](games/block-evidence/cave-discovery-polish/verified/). `tests.json`, `render-jobs.json`, logs and `source-sha256.json` record execution. The 22 WebP images are derivatives of the native PNG captures; raw intermediate PNGs remain local and are reproducible through the capture runner.

## Honest remaining limits

- The animal faces and materials still have a simplified toy-like quality; this pass does not close the premium reference-art gap. Cave silhouettes remain angular and scan/authored material differences remain visible.
- Paw prints and wool are modeled evidence, not a new tracking simulation. The lamb has visual reactions; no new bleat/voice/audio asset was added. Reunion feedback is not a new family/NPC cinematic.
- The camera assistance is modest; the two actors can still overlap from some viewpoints. Native tests/captures do not establish two-thumb comfort or sustained iPad performance.
- Bridge/irrigation instructional redesign, whole-map art replacement and additional chapters were not implemented in this bounded cave pass.
- The embedded game files and source release manifest still describe the previous export. Before a release/merge intended for the iPads, rebuild the engine using the existing pipeline, verify the source/export manifest, run app sync and its exact-copy guard, then have Claude build/install with existing signing and preserved children’s saves. Do not claim that pulling this source alone updates the installed app.
