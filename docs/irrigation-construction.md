# First playable irrigation construction slice

## Scope delivered (bounded, not full redesign)
The normal cave → village chapter now uses `irrigation_construction.gd` and the public API of `irrigation_flow.gd`. The former prescribed CLOSE/OPEN/OPEN puzzle is replaced. Mira states the need; Oren explains two finite model trays beside the in-world plan; a nearby finite repair stock supplies one stone, board and clay seal. Context actions fit these at the broken crossing. Unsupported/duplicate/remote placements and insufficient inventory cannot consume or bypass materials. Cancel is a no-op before placement; there is no hidden reservation.

The repaired channel has a visible adjustable outlet lip. Its low setting is 0.65 m, its deliberately wrong high setting 2 m, exactly the alternative solver-link sills; setting either opening is geometry selection, not a story-stage unlock. The finite source contains 3.84 m³. Gates can be toggled freely after repair. Head, not button order, determines delivery. Five cell surfaces use `cell_state().head_m`; visibility uses actual surface storage. A wet-soil cue and success use the same row soil store; downstream catchment arrival must also have occurred. Crops do **not** grow/change in response to this model. The harvest remains a narrative reward, not a computed agricultural yield.

This is explicitly the allowed **first repair + finite materials + physical-flow test slice**. Building new branching furrows, a player-built collection drain, multiple independent graded row cells, lateral wetting, an independent second construction problem, and a fully surveyed continuous tail-channel mesh are **outstanding**. The test currently serves one existing row and an existing lower catchment/outfall. Existing planted ridges and character rigs/scales remain. No structural support-strength simulation is claimed. Some inherited environment channel trim still needs an art pass to match the new raised beds.

## Model and limits
Read `irrigation-engineering.md` for the solver's public contract and research. Dimensions, soil capacity (0.08 m³), infiltration (0.002 m/s) and conductance (0.8 / 0.25 m²/s) in this short, fast demonstration are **authored simplified coefficients**, not validated agronomic dimensions or recommendations. Runtime uses real seconds, without acceleration; only the test harness fast-forwards. This is linear lumped reservoir exchange, instantaneous routed overflow, and free outfall without river tailwater. No erosion, crop response, structural strength, lateral root-zone or pump model. Water is not returned uphill. The initial source is finite, not an infinite blue reveal.

## Persistence / migration
The chapter's old ordered `steps` remains only as a compatible narrative/reward envelope. The new versioned construction history records valid construction actions and coalesced simulation intervals. Restore validates a disposable instance, then deterministically reconstructs soil, water, ledger and inventory through public solver calls, never writing private solver state. Invalid histories fail atomically. Old completed saves keep all earned steps and visible harvest while offering fresh construction. Cave prerequisites and main.gd/save version remain unchanged. Pause freezes simulation. Gate and geometry revisions do not delete water. Long play accumulates a replay log; periodic compact public solver snapshots are future optimization work.

## Verification and evidence
Commands from repository root:

```
/home/helper/tools/godot-4.7.2/godot --headless --path game/trail-of-truth-block-adventure --script res://tests/irrigation_construction_test.gd
/home/helper/tools/godot-4.7.2/godot --path game/trail-of-truth-block-adventure --rendering-method gl_compatibility --script res://tests/irrigation_construction_playthrough.gd
```

The unit regression covers invalid placement, insufficient supply, finite material exhaustion, dependencies, cancel/retry, high-sill ponding versus lowered-sill row delivery, catchment arrival, conservation, save/replay, corrupt replay and arbitrary gate toggles. Native walkthrough routes **host action-button signals**, not direct construction calls, at fixture player positions; this is NOT keyboard navigation, collision-traversal, touch-device or browser evidence. Simulation advances through the campaign's real `tick` entry. It also verifies cave entry, model-to-render height (1e-6 tolerance because transform coordinates are float32), pause, harvest, reload and old completed-save migration.

Captures: `/tmp/jd-irrigation-ponding.png`, `/tmp/jd-irrigation-flow-en.png`, `/tmp/jd-irrigation-flow-ru.png`. These are deliberately posed native overview cameras, not player-camera traversal proof. Existing `water_input_playthrough.gd` / old stage-order assertions are **superseded expectations**, not weakened or silently rewritten. Their replacement traversal equivalent remains to be authored. No claim of full redesign completion.
