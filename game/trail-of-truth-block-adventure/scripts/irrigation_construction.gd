extends RefCounted
## Bounded first lesson: finite repair inventory, selectable outlet crest,
## one existing furrow and lower catchment. Not agronomic dimensions.
const Flow = preload("res://scripts/irrigation_flow.gd")
const COST := {"support":"stone", "channel":"board", "seal":"seal"}
var inventory := {"stone":0, "board":0, "seal":0}
var supply := {"stone":1, "board":1, "seal":1}
var installed := {"support":false, "channel":false, "seal":false}
var planned := false
var low := false
var inlet := false
var outlet := true
var earned := false
var flow
var history: Array = []
var low_link := -1
var high_link := -1
var inlet_link := -1
var leak_link := -1
var row_link := -1

func _init() -> void:
    _network()

func _network() -> void:
    flow = Flow.new()
    # World metres and seconds; deliberately simplified authored response rates.
    flow.add_cell(.95,3,1.6,.8,3.84)
    flow.add_cell(.65,4,1.6,.6)
    flow.add_cell(.35,10,1.6,.5)
    flow.add_cell(.15,8,1.25,.35,0,.08,.002)
    flow.add_cell(.02,4,.8,.3)
    inlet_link = flow.add_link(0,1,.95,.8,0)
    low_link = flow.add_link(1,2,.65,.8,0)
    high_link = flow.add_link(1,2,2.0,.8,0)
    leak_link = flow.add_link(1,4,.65,.8,1,true)
    row_link = flow.add_link(2,3,.35,.8,1)
    flow.add_link(3,4,.15,.25,1,true)
    for cell in range(4): flow.set_overflow(cell,4)
    flow.set_boundary(4,0,.02,.02)
    _sync_links()

func ready_path() -> bool:
    return installed.support and installed.channel and installed.seal

func _sync_links() -> void:
    flow.set_opening(inlet_link,1.0 if inlet else 0.0)
    flow.set_opening(low_link,1.0 if installed.channel and low else 0.0)
    flow.set_opening(high_link,1.0 if installed.channel and not low else 0.0)
    flow.set_opening(leak_link,0.0 if installed.seal else 1.0)
    flow.set_opening(row_link,1.0 if outlet else 0.0)

func act(op: String, item: String = "", valid_place := true, record := true) -> bool:
    var ok := false
    match op:
        "plan":
            planned = true
            ok = true
        "gather":
            if planned and supply.has(item) and supply[item] > 0:
                supply[item] -= 1
                inventory[item] += 1
                ok = true
        "place":
            if planned and valid_place and COST.has(item) and not installed[item]:
                var material: String = COST[item]
                var supported: bool = item == "support" or installed.support
                if item == "seal": supported = installed.channel
                if supported and inventory[material] > 0:
                    inventory[material] -= 1
                    installed[item] = true
                    ok = true
        "grade":
            if ready_path():
                low = not low
                ok = true
        "inlet":
            if ready_path():
                inlet = not inlet
                ok = true
        "outlet":
            if ready_path():
                outlet = not outlet
                ok = true
        "cancel":
            return true # No reservation or consumption before actual placement.
    if ok:
        _sync_links()
        if record: history.append({"op":op,"item":item})
    return ok

func tick(seconds: float, record := true) -> void:
    if seconds <= 0 or seconds > 30: return
    if not flow.step(seconds): return
    if flow.cell_state(3).soil > .015 and flow.cell_state(4).water > .001:
        earned = true
    if record:
        if not history.is_empty() and history.back().has("seconds") and history.back().seconds + seconds < 30:
            history.back().seconds += seconds
        else: history.append({"seconds":seconds})

func snapshot() -> Dictionary:
    return {"version":1,"history":history.duplicate(true)}

func restore(data: Variant) -> bool:
    if not data is Dictionary or data.get("version") != 1 or not data.get("history") is Array: return false
    # Validate in a disposable instance: invalid saves never partially apply.
    var probe = get_script().new()
    for event in data.history:
        if not event is Dictionary: return false
        if event.has("seconds"):
            if not (event.seconds is float or event.seconds is int) or not is_finite(event.seconds) or event.seconds <= 0 or event.seconds > 30: return false
            probe.tick(event.seconds,false)
        elif event.get("op") is String and event.get("item","") is String:
            if not probe.act(event.op,event.get("item",""),true,false): return false
        else: return false
    inventory = probe.inventory
    supply = probe.supply
    installed = probe.installed
    planned = probe.planned
    low = probe.low
    inlet = probe.inlet
    outlet = probe.outlet
    earned = probe.earned
    flow = probe.flow
    history = data.history.duplicate(true)
    return true
