# Opening bridge visual pilot — verified source handoff

## User direction applied selectively
Practical guide: `docs/visual-direction-practical-guide.md`.
Original supplied document preserved unchanged: `docs/visual-direction-user-source.rtf`.

This pass applies shape/material/composition and physical-purpose guidance to a previously untouched opening bridge corner. It does not replace accepted characters, restyle the whole game or claim that the reference-quality floor has been met.

## Before / after evidence
Directory: `/tmp/jd-opening-evidence/`.
- `opening-before-after-landscape.jpg`
- `opening-before-after-portrait.jpg`
- Raw `jd-opening-before-{1280,720}.png` and `jd-opening-after-{1280,720}.png`.

Both captures show bridge stage **0**, player position `(0,0,1.8)`, yaw `-1.22`, pitch `-.45`, unchanged native player camera/character/lighting/UI. The same fresh-save capture script is used. The camera/player are positioned for this visual fixture; these pictures are not a continuous playthrough. Original routed playthrough is tested separately.

## Actual changes
- Soft dirt-path / grass blend on both bridge approaches, instead of the disconnected cobble strip.
- Grouped riverbank grass and ferns, reusing authored shared foliage meshes rather than importing another incompatible free pack.
- Sculpted scenic soil-bank faces transitioning into water, with explicit openings for the stone bridge abutments.
- Rounded worn timber marker posts, seated pins, shaped stone supports and torn deck/stringer ends. The broken pieces disappear independently as each original repair panel is installed.
- Animated stylized river shading with subtle highlights and authored shallow/deep color cues. The depth cue is not depth-buffer water or a fluid simulation.
- Old marker and water/ripple-box visuals removed; original bank, post and repair-panel collisions retained. No new bridge-spanning collision in the broken state.

Source under `game/trail-of-truth-block-adventure/`:
- Modified `scripts/world.gd` (presentation integration and broken-art state projection).
- Added `scripts/bridge_craft.gd`, `scripts/opening_river_art.gd`.
- Added `assets/opening_art/river.gdshader`, `shore.gdshader`.
- Added `tests/opening_art_test.gd`, `opening_art_playthrough.gd`, `opening_art_capture.gd`.
- Repro runner: `/tmp/jd-next-adventure/tools/verify_opening_art.py`.

Original mesh generators/shaders and local generated noise textures; no paid generation or new downloaded assets. Existing free asset provenance remains under `assets/environment/PROVENANCE.md`. No commit/push or protected repository edits.

## Real verification
All returned exit 0 under native Xvfb Godot 4.7.2, GL Compatibility, fixed FPS 60 and separate XDG directories. Logs checked for engine/script errors as well as completion markers:
- `terrain_surfaces.log`: original terrain/collider/bridge-width assertions true.
- `opening_art_test.log`: `OPENING_ART_FAILURES=0`; damage visibility follows stages 0/1/2; original panel collision/visibility authority retained; art adds no colliders across river.
- `opening_art_playthrough.log`: inherits the unchanged full opening test; gathering both boards, repairing, crossing, finding/calling/escorting the lamb, rescue/reward and Russian localization passed. Rendering is disabled between checkpoints; no continuous-motion/device-performance claim.
- `irrigation_site_playthrough.log`: `CONSTRUCTION_HOST_FAILURES=0`, including all inherited original construction/geometry checks, actual bidirectional walking over the garden bridge without jumping, deck height, clearance and stray-block removal.
- `capture.log`: `UNREPAIRED_STAGE=0` and matching camera/player metadata.

Machine-readable results and tested source hashes: `results.json`, `tested-source-sha256.json`. The capture fixture was copied byte-for-byte into the repository after the main run and its res:// launch verified separately in `capture-res-path.log`.

## Previous irrigation correction closed
The garden road now crosses on a supported timber footbridge with walkable ramps and verified clearance over the furrow. The old west path through the channel and always-visible loose yellow block were removed. Mortar backing closes gaps in the lining. Native site images are included as `jd-site-crossing-*`; this is actual routed gameplay evidence, not an overview camera.

## Limits
This is a visible local improvement, not reference-quality completion. The surrounding old sphere-canopy trees, broad background terrain and overall lighting still set a lower visual ceiling. The water remains an illustrative opaque shader. Sloped bank dressing is scenic, not newly walkable terrain; collision stays on the established bank boundary. No new physics, structural validity, character remodeling, full UI redesign, physical iPad performance or owner approval claimed.
