# Game character asset library

Canonical appearance and EN/RU names remain defined in [the character bible](../junior-disciples-character-library.md).

## Current motion cleanup: v3 review candidates

[Motion cleanup report](../../source/character-library/motion-cleanup-v3/README.md) · [Manifest](../../source/character-library/motion-cleanup-v3/manifest.json)

Updated walk/run candidates for all seven characters, plus matching revised Rosie/Joseph rigs. Final exports have complete-timeline 60 Hz hand/body surface screening and flat-ground sole checks. Joseph's pouch/wrist weight repair and Rosie's conservative geometry/animation cleanup are separate from the rejected intermediate attempts. No runtime substitution is enabled.

**Visual holds remain:** Simeon/Anna running cloth, Tobias running shoulder/sleeve, Rosie hem/seam polish. Numerical contact PASS is not game-ready certification. See the report for excluded collision regions, controller/terrain/prop-contact and device gates. Verify with `python tools/trail_of_truth/check_character_motion.py`.

## Previous revision: seven-character review candidates

[Revision v2 report](../../source/character-library/revision-v2/README.md) · [Manifest](../../source/character-library/revision-v2/manifest.json) · [Seven-character lineup](../../source/character-library/revision-v2/seven-character-scale-lineup.png)

Joseph now has a reference, rig and walk/run clips; his earlier blocker below is historical. Rosie has a non-destructive wavy-hair mesh correction. All seven have optimized 24-joint rig/walk/run candidates at approximately 24,000 triangles each, with fresh-import and sampled deformation checks. The 21 optimized GLBs total 49.91 MB. Originals are retained.

These are still **review candidates, not live-game replacements**. Device performance, full-cycle garment/foot contact and task-specific hand/prop contact remain release gates. Proposed relative heights are demonstrated in the lineup, not baked into gameplay.

## Historical generated batch

[Manifest](../../source/character-library/generated-20260924/manifest.json) · [Preview](../../source/character-library/generated-20260924/six-models-preview.jpg) · [Movement acceptance](../../source/character-library/generated-20260924/MOVEMENT_ACCEPTANCE.md)

| Character | Reference / rig / walk / run | Runtime status |
|---|---|---|
| Michael / Мишутка | Available | Review asset, not integrated |
| Rosie / Рози | Available | Review asset, not integrated |
| Joseph / Йосик | Missing; reference blocked | No replacement generated |
| Gracie / Грейси | Available | Review asset, not integrated |
| Grandpa Simeon / Дедушка Симеон | Available | Review asset, not integrated |
| Aunt Anna / Тётя Анна | Available | Review asset, not integrated |
| Tobias the baker / Пекарь Товия | Available | Review asset, not integrated |

The manifest records repo-relative asset paths, byte lengths, SHA-256 checksums and explicit readiness flags. Each available set includes a source PNG and three GLBs: rig, walk and run. These are source-library assets outside the Godot project and public web export, so adding them does not inflate the shipped build or change existing gameplay.

## Shared motion sources

The batch includes 32 lightweight animation-only GLBs. They contain real animation channels, not character meshes, and are not automatically compatible with the 24-joint character rigs. [Motion review](../../source/character-library/generated-20260924/motion-sources/VISUAL_REVIEW.md) records prompt mismatches and contact limitations.

## Integration gate

1. Preserve character identity and relative ages; normalize scale for the game.
2. Retarget compatible clips and inspect shoulder, elbow, knee and clothing deformation.
3. Optimize meshes/textures and measure on the target iPad.
4. Implement hand/tool contacts, per-character sockets, foot IK and collision transitions.
5. Test touch controls and meaningful gameplay consequences before setting `game_ready` or enabling runtime use.

Experimental Michael shoulder-carry and rejected kneel/pet retargets are deliberately not included as reusable approved clips. The currently working in-game character/carry assets are untouched.

No push or deployment is implied by registering or committing this source library.
