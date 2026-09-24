extends SceneTree
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, label: String) -> void:
    print(("PASS " if ok else "FAIL ")+label)
    if not ok: failures += 1
func run() -> void:
    var world = preload("res://scripts/world.gd").new()
    root.add_child(world)
    await physics_frame
    var craft: Node3D = world.get_node("BridgeCraft")
    check(craft.find_children("*","CollisionShape3D",true,false).is_empty(),"new bridge craft does not introduce crossing collider")
    check(world.get_node("OpeningRiverArt").find_children("*","CollisionShape3D",true,false).is_empty(),"riverbank art preserves collision contract")
    for stage in range(3):
        world.set_bridge_stage(stage)
        await physics_frame
        await physics_frame
        check(craft.get_node("LeftBreak").visible == (stage < 1),"left damage follows repair stage "+str(stage))
        check(craft.get_node("RightBreak").visible == (stage < 2),"right damage follows repair stage "+str(stage))
        for i in range(2):
            check(world._panels[i].visible == (i < stage),"original panel visibility retained")
            check(world._panel_shapes[i].disabled == (i >= stage),"original panel collision authority retained")
    var river: MeshInstance3D = world.get_node("OpeningRiverArt/FlowingRiver")
    check(is_equal_approx(river.position.y,-.675),"water remains below authoritative deck")
    check(is_equal_approx(river.mesh.size.x,4.6),"river opening footprint retained")
    print("OPENING_ART_FAILURES=",failures)
    quit(failures)
