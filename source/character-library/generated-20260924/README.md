# Junior Disciples generated game character assets

This versioned source library contains six reference images, six 24-joint rig GLBs, six walking GLBs, six running GLBs and 32 shared animation-only motion sources. Joseph is explicitly registered as blocked rather than silently omitted.

Start with `manifest.json`: all paths are relative to this directory, all binary assets have SHA-256 and byte-length records, and `runtime_enabled` / character `game_ready` flags are false.

- `michael/`, `rosie/`, `gracie/`, `simeon/`, `anna/`, `tobias/`: `reference.png`, `rig.glb`, `walk.glb`, `run.glb`.
- `joseph/RECOVERY-QA.md`: missing reference/model blocker.
- `motion-sources/`: 32 animation-only GLBs plus candid visual-review notes. They need retargeting and contact validation; they are not 32 finished gameplay interactions.
- `six-models-preview.jpg`, `six-models-side-back.jpg`: actual model renders. Panel framing is independent, not a relative-height chart.
- `MOVEMENT_ACCEPTANCE.md`: runtime and physical-contact requirements.
- `RECOVERY_RESULT.md`: historical generation/QA report. Workspace paths it mentions are provenance, not required dependencies of this committed library.

Raw FBX masters, provider responses, unrigged PBR masters and experimental retarget files remain in the generation workspace `/home/helper/jd_character_batch_20260924/`; they are not runtime dependencies. The failed/experimental carry and kneel retargets are excluded from this reusable pack.

No character replacement, Godot import, web build change, deployment, finger rig, facial system or game-ready certification is implied. See `docs/games/character-asset-library.md` in the repository for integration instructions.
