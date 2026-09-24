# Irrigation redesign: researched, executable foundation (not integrated)

## Status and purpose

`game/trail-of-truth-block-adventure/scripts/irrigation_flow.gd` is an isolated educational storage-network model. The existing campaign, its switches, scenes, character scaling, and rendering are **unchanged by this work**. This is not a claim that the playable irrigation redesign is finished. It is not CFD, a Saint-Venant solver, validated irrigation sizing, a structural aqueduct design, or a historical reconstruction. Simplify controls, not the causal lesson: children inspect, plan, build, test, observe and improve a real gravity-water path rather than discover a prescribed switch sequence.

## Primary-source grounding

Read directly from FAO:

1. [Irrigation Water Management: Irrigation Methods, Chapter 3: Furrow irrigation](https://www.fao.org/4/s8684e/s8684e04.htm), especially §§3.1–3.4 and 3.6. Furrows are parallel channels with crops generally on ridges; grade, soil, inflow, length, shape and spacing interact. Soil wetting moves both downward and laterally. An uneven grade can cause uneven wetting. Large inflows can overtop or erode; undersupply can advance too slowly; excessive duration wastes runoff or waterlogs crops. A tail drain and checking downstream arrival matter. The table is expressly an approximate field-experience guide, requiring local installation and evaluation—not a universal prescription.
2. [Guidelines for Designing and Evaluating Surface Irrigation Systems, Chapter 2](https://www.fao.org/4/t0231e/t0231e04.htm), §§2.1–2.4. Free-surface flow responds to gravitational gradient; irrigation combines supply, conveyance, use and drainage. Advance, wetting, depletion and recession are distinct observations. Furrow outlets can be independently controlled; infiltration varies significantly. §2.3.2 distinguishes reuse in lower fields from pumping tailwater back uphill. §§2.4.2–2.4.3 describe elevated or ground-level lined channels and head-ditch distribution.

No FAO slope/flow recommendation is hard-coded as suitable for all gardens. No empirical model coefficient below is represented as an FAO value. Lateral wetting is an important lesson but **is not simulated by this foundation**; a soil-storage meter must not be labeled proof that all roots received enough water.

## Explicit hypothetical first lesson

Use a fictional small garden, not a claimed ancient engineering reconstruction. Proposed scene geometry (not yet wired): one head ditch feeding three 4 m rows, each represented by eight 0.5 m rectangular cells, 0.20 m wide and 0.10 m bank depth. Set bed fall at 0.001 m per metre for this authored example only. Choose a hypothetical homogeneous soil with constant infiltration parameter 0.000005 m/s and 0.004 m³ local soil-store capacity per row cell. These are **illustrative scenario assumptions**, not recommendations or calibrated soil properties. The coefficient of each connection must be clearly marked an authored response-rate parameter; start with 0.005 m²/s and examine time-refinement behavior before integration. Supply can be a prescribed 0.0002 m³/s small test inflow, then deliberately varied. Simulated time stays in seconds; if accelerated for play, display that fact.

Route excess through a visibly lower tail ditch into a finite pond with a lower free outfall to the river boundary. Default outside-domain spills should be visible in the accounting panel, never silently disappear. Raise a channel only where a specific obstacle or gully requires a crossing; an elevated aqueduct does not make water climb above its available upstream water surface. A pipe/siphon/pump lesson is outside this scope. Reuse may serve lower ground; there is no free uphill return.

## Model contract and equations

Each cell has horizontal rectangular geometry: bed elevation `z` (m, relative datum, negative elevations valid), length `L` and width `w` (m), bank depth `d_max` (m). Plan area `A=L*w` (m²), capacity `C=A*d_max` (m³), stored surface water `V` (m³), depth `d=V/A`, cross-section `w*d` (m²), water-surface head `H=z+d` (m). A sloping channel is a chain of short stepped storage cells, not one long sloping cell. Longer cells instantaneously mix their water internally; cell size therefore affects apparent advance.

A connection has a sill `s` at least as high as both cell beds, empirical conductance `K` (m²/s), and opening fraction `g` in [0,1]. Flux is

`Q = K*g*(max(H_a-s,0) - max(H_b-s,0))` in m³/s.

This is a **linear reservoir exchange law**, not Manning friction or a calibrated gate/orifice equation. It conserves volume and uses available surface head rather than bed direction alone. It permits backwater/reverse exchange and level equilibration above the sill. Water below a high sill can remain pooled; a dry uphill cell remains dry until the supplying head clears the sill. A one-way link clips reverse flux; use that only for explicitly free-falling outlets/leaks, not ordinary channels. `set_broken` disables a connection completely. A missing aqueduct span should disable its downstream connection AND expose a separate leak/drop link to the local lower catchment. Rebuilding restores connectivity; sealing closes the leak. Broken does not automatically invent a leak path.

At each substep:

1. Add prescribed external inflow, then route capacity excess.
2. Calculate all link transfers from the same water snapshot; proportionally limit total outgoing transfer by the donor's available water. Apply transfers simultaneously, avoiding a privileged branch order.
3. Route excess to designated catchments; recursively cascade through finite capacity stores, with any ultimate outside-domain spill accumulated in `overflow_out_m3`.
4. Move `min(surface water, infiltration_rate*A*dt, remaining soil capacity)` into retained soil storage. Remove drain demand up to available water above the drain sill into `sink_m3`.

Spill targets must have strictly lower bank rims, prohibiting cycles and uphill spill. This is instantaneous idealized overflow routing, **not a spillway discharge law or travel-time model**. It cannot represent a submerged spillway or pond backwater into the spilling channel; use ordinary head-based links where backwater matters. Every cell defaults to `overflow=-1`, explicitly meaning an external spill boundary; integrators must assign internal catchments deliberately. External inflow is a declared supply crossing the model boundary, not a gravity link from an unmodeled source. Free-outfall drains have no river tailwater and no pump energy model.

Mass identity, all in m³:

`initial + cumulative_source = surface_storage + soil_storage + cumulative_drain + cumulative_external_spill`.

Infiltration is an internal transfer, not unexplained loss. Soil storage does not evaporate, percolate further, drain or support uptake in this short lesson; saturation stops its infiltration. Surface-water subtraction is donor bounded. Public snapshots are deep copies; internal `_cells` and `_links` must not be mutated by integrators.

## Time, bounds and validation

Each `step(seconds)` uses equal internal substeps no larger than 0.05 s and no larger than `0.2 / max_i(sum_active(K*g)/A_i)`. For wet linear exchanges this is a conservative explicit relaxation bound; sill clipping and donor limits prevent dry-cell overdrafts. Boundary/infiltration/overflow operator splitting is first-order, not exact: repeat refinement tests for every authored scenario. Finite scalar inputs are bounded (generally magnitude at most 10^6, positive dimensions at least 10^-4 m); opening is limited to [0,1], initial water to capacity. Signed bed/sill elevations are valid. Invalid configuration returns -1/false with `last_error`, without applying that operation. Steps requiring over 10,000 substeps reject **before** changing state; callers must handle false rather than assume time advanced. Geometry is immutable through the public API; rebuilding a grade currently requires constructing a new network with explicitly preserved water accounting.

Determinism is for an identical configuration, input sequence and runtime; no randomness is used. Different timestep partitions are approximately—not bitwise—equivalent. No momentum, waves, turbulence, erosion rates, sediment, structural loading, historical material strengths, evapotranspiration, unsaturated soil transport, lateral/root-zone distribution, crop yield, groundwater or calibrated infiltration curves are solved. The model illustrates storage/head/connected-path causality, not a license to size a real irrigation system.

## Practical learning progression for later integration

1. **Inspect:** walk the source, route, obstacle, head ditch, ridges, dry row ends and lower drain. Compare marked bed and water-surface heights. Locate the cracked joint and missing span; show that these are different defects.
2. **Mentor demonstration:** one short level-trough/tilted-trough example. Predict pooling, open a small outlet, observe head falling and soil slowly wetting. Show a high sill blocking low water even when a gate is open. Demonstrate a small repaired joint, then let the child repeat.
3. **Plan:** place stakes/string/level markers and draw source→channel→head ditch→row→tail drain→pond/outfall. Calculate fall as slope times horizontal length. Count channel segments and joints from the plan; estimate rectangular trough capacity with length×width×depth. Show units. Match material quantities to an explicit authored bill of materials, not a decorative collect quota. No universal safe slope or structural recipe.
4. **Gather:** stone for the planned support/lining positions, boards for the planned gates/forms/trough pieces, and seal material for actual joints. Permit revising the plan and material list; don't punish sensible alternate solutions. Material strength is not simulated.
5. **Build guided positions:** grade a ground channel and parallel furrows with ridges; place an elevated crossing only over the identified obstacle; restore the missing connection, seal the leaking joint and build the lower tail drain before full inflow. Construction should change geometry/connectivity/leak parameters, not increment a hidden switch-order counter.
6. **Small test inflow:** predict which segment fills first, then watch heads, pooling, leaks, branch delivery and soil-storage changes. Provide a pause/time-scale control and a simple volume ledger. Do not render water downstream of a broken span just because the route is highlighted.
7. **Observe and revise:** pooling before a high sill suggests regrading or changing the plan, not a magical gate order; leaking suggests sealing; dry row ends suggest inspecting supply/path/infiltration rather than blindly turning everything on. Excess overflow calls for inflow cutback and a working lower drainage route. Warn about overtopping qualitatively; don't claim computed erosion damage.
8. **Independent row:** mentor removes placement hints. Child surveys, plans quantities, builds a second route, makes a prediction, tests and explains one revision. Assess causal evidence (connected path, suitable heads, captured runoff, soil wetting observation), not the exact order of gate presses. Repeat with a changed source level or a different illustrative soil parameter to check transfer rather than memorization.

Any real-world follow-up is a supervised small clean-water tray/garden observation, not unsupervised excavation, river diversion or structural building. Child-facing EN/RU copy, touch/keyboard controls, visible water/soil cues, actual material inventory, build interactions, mentor dialogue and independent assessment are still integration work. Preserve the old campaign until a complete replacement is reviewed; do not relabel its existing switch puzzle as physics.

## Executable verification

From the repository root:

```
/home/helper/tools/godot-4.7.2/godot --headless --path game/trail-of-truth-block-adventure --script res://tests/irrigation_flow_test.gd
```

Final real execution: Godot 4.7.2, **514 checks, 0 failures**, exit 0 (including soil saturation and repeated stiff multi-branch strict-nonnegative checks). Timestep comparison (10 s total, 0.05 s maximum internal vs 0.01 s requests) differed by **0.00054242379436 m³**, below the explicitly selected 0.001 m³ test tolerance. Tests cover dry start, conservation, finite storage, level equilibration and reverse head, uphill sill threshold, closed gate, break/rebuild, leak/seal, simultaneous branched furrow infiltration, finite overflow pond then river drain, rejected uphill overflow, timestep refinement and rejected negative/nonfinite inputs. These are model tests, not scene/playability, agronomic calibration or real-world engineering validation.
