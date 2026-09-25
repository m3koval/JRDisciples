extends SceneTree
## Additive visual contract; original panel physics/state checks remain unchanged.
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, label: String) -> void:
    print(("PASS " if ok else "FAIL ")+label)
    if not ok: failures += 1
func run() -> void:
    var world = preload("res://scripts/world.gd").new()
    root.add_child(world)
    await physics_frame
    var craft = world.get_node("BridgeCraft")
    for side in range(2):
        var damage = craft.get_node("LeftBreak" if side == 0 else "RightBreak")
        var planks: Array[MeshInstance3D] = []
        for child in damage.get_children():
            if child is MeshInstance3D and child.has_meta("bridge_deck"):
                planks.append(child)
        check(planks.size() == 7,"seven explicit surviving deck members bank "+str(side))
        for plank in planks:
            var box: AABB = plank.transform * plank.get_aabb()
            check(box.end.y > .028,"surviving deck top visible above terrain")
            check(box.position.x >= 1.8 and box.end.x <= 8.2,"damage remains local to bank")
            check(box.end.x < 3.25 if side == 0 else box.position.x > 6.75,"broken ends leave clear central gap")
            check(plank.mesh.get_surface_count() == 2,"separate broken end grain")
        var panel = world._panels[side]
        var timbers = panel.find_children("DeckTimber*","MeshInstance3D",true,false)
        check(timbers.size() == 7,"repair retains same longitudinal decking language")
        for timber in timbers:
            var box: AABB = timber.transform * timber.get_aabb()
            check(absf(box.end.y) < .001,"repaired surface matches original collision top")
            check(box.size.x > 2.2 and box.size.z < .30,"grain-bearing axis follows repaired span")
        check(panel.find_children("*","CollisionShape3D",true,false).size() == 1,"one original flush panel collider")
    for stage in [0,1,2,0]:
        world.set_bridge_stage(stage)
        await physics_frame
        await physics_frame
        check(craft.get_node("LeftBreak").visible == (stage < 1),"left damage replacement/replay")
        check(craft.get_node("RightBreak").visible == (stage < 2),"right damage replacement/replay")
        for i in range(2):
            check(world._panels[i].visible == (i < stage),"matching repaired visual stage")
            check(world._panel_shapes[i].disabled == (i >= stage),"unchanged authoritative collision stage")
    print("BRIDGE_TIMBER_FAILURES=",failures)
    quit(failures)
