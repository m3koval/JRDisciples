# Game character asset library

Canonical appearance and EN/RU names remain defined in [the character bible](../junior-disciples-character-library.md).

## Registered generated batch

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
