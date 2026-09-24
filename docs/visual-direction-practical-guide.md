# Junior Disciples — practical visual direction

Authority: Mike's supplied `visual-direction-user-source.rtf`, existing reference images, and his clarification: apply guidance only where it genuinely improves the accepted work. This is an acceptance guide, not an instruction to rebuild everything or pile on effects.

## Non-negotiable principle
A beautiful, deliberately art-directed stylized adventure engineered to run on mobile. Mobile constrains implementation cost, not perceived art quality. Reference images are the minimum acceptance target. Functional tests, extra polygons, free provenance and technical novelty do not establish visual approval.

## Preserve before improving
Keep accepted human identities, rigs, scale, animations, controls, story/state and saves unless a specific defect requires an approved correction. Preserve existing uncommitted work. No paid services, purchases, commit/push or protected-tree edits in this lane. Free assets earn their place through style/quality fit; build custom connective geometry where stock fails.

## Art decisions by surface
| Surface | Spend effort on | Reject |
|---|---|---|
| Protagonist / nearby cast | Identity, appealing face/eyes, hair silhouette, cloth construction, hands/feet, grounded animation | Generic mannequins, procedural faces, visible quality discontinuity. This pilot preserves existing characters; it is not a character-remodel pass. |
| Gameplay objects | Readable purpose, load paths, joins, damaged/repaired parts, correct human-relative proportions | Mystery wheels, floating supports, random blocks, decorative parts suggesting nonexistent mechanics |
| Stone / wood | Intentional silhouette, softened edge highlights, directional grain, end grain, mortar, restrained local variation | Uniform glossy response, stretched noise, repeated boxes posing as craftsmanship |
| Terrain | Connected routes, worn dirt/grass transition, bank-to-water contact, grounded objects | Roads through water channels, rectangular texture strips, random clutter, broad green slabs |
| Vegetation | Grouped silhouettes framing work areas, restrained flowers, varied height/density | Uniform scattering, alpha-overdraw excess, giant sphere crowns, obscured targets |
| Water | Restrained movement/highlights, shallow/deep color cues, real containment and visible contact | Flat blue planes, swimming-pool dot patterns, water through joints, foam without a cause |
| Light | Warm key, cooler fill, readable shadows, contact and depth | Overexposure, black shadows, green ambient wash, effects added just because available |
| Camera / UI | Normal third-person readability, clear focus and unobstructed context; concise matching EN/RU | Overview-only proof, excessive field labels, clipped text, UI covering the actual work |

## Spatial review before decoration
For every object: what is it, why is it here, what supports it, how is it reached, and what does it do? For each route: where does it start/end, can the player actually traverse it, and what happens where it meets water? Keep visual water boundaries aligned to solver/collision authority. A footbridge needs real clearance and walkable approaches, not merely planks painted over a ditch.

## Invisible optimization
Prioritize the protagonist, important NPCs and manipulated objects, then nearby architecture/vegetation and lighting. Share materials and meshes, batch plants, use controlled shadow distance, bake where appropriate, cull unseen surfaces and author LODs without conspicuous transitions. No device-performance claim without a device run. Do not add topology that produces no visible benefit.

## Controlled before/after gate
1. Choose one untouched scene corner and preserve baseline files/screenshots.
2. Capture both orientations from the same actual player camera, pose, gameplay state and UI state.
3. Fix the strongest underlying model/material/lighting/composition problem; avoid compensating with more props.
4. Inspect actual native output, including close enough views to expose seams, floating parts and material problems.
5. Rerun original state/input/collision tests; add assertions for the specific new behavior.
6. Keep only a demonstrable improvement. Report component, integrated runtime, owner acceptance and physical-device performance separately.

## Current pilot
Opening chapter's broken bridge and river approach, bridge stage zero in BOTH images. Goals: make the missing span legible through actual damaged timber, connect the path and abutments to their banks, replace primitive water/ripple decoration with controlled surface treatment, and give the bank deliberate planting. Preserve the river gap, existing bank/panel colliders and repair progression. Capture fixtures are not independent playthroughs.

## Definition of acceptance
Would this stand beside the user's reference without looking like a cheaper game? Does it still look designed at close gameplay distance? Does its physical arrangement make sense? Are lighting/materials coherent? If not, name and repair the underlying deficit. 'Better than before' is progress, not automatic reference-quality acceptance.
