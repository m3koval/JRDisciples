extends SceneTree
var failures := 0
func check(ok: bool, label: String) -> void:
    print(("PASS " if ok else "FAIL ")+label)
    if not ok: failures += 1
func _initialize() -> void: call_deferred("run")
func run() -> void:
    var game = load("res://scripts/main.gd").new()
    root.add_child(game)
    await physics_frame
    game._apply_progress(null)
    game.campaign.stage = 6
    game.reward_saved = true
    game.completed = true
    game.modal_kind = "flock_complete"
    game._primary_action()
    game._primary_action()
    var c = game.caves
    game.player.position = c.ENTRANCES[0]+Vector3(0,0,6)
    for n in range(4): await physics_frame
    check(c.active and not game.target_marker.visible, "active cave has no floating waypoint cube")
    for i in range(3):
        var post = c.get_node("CaveCluePost%d"%i)
        var offset: Vector3 = post.position-c.ENTRANCES[i]
        check(offset.z <= -1.3 and offset.z >= -1.4 and offset.x+.70 <= -.40 and offset.x-.70 >= -1.9,"clue in clear throat with central route clearance %d"%i)
        check(c.signs[i].position.z>post.position.z,"clue lettering on board front %d"%i)
        var support := post.get_child(0) as MeshInstance3D
        var support_front: float = post.position.z + support.position.z + support.get_aabb().end.z
        check(c.signs[i].position.z - support_front > .03,"support cannot z-fight with clue lettering %d"%i)
    check(not c.animal_rigs[0].visible and c.animals[0].visible,"hidden model does not mark living animal defeated")
    game.player.position = c.ENTRANCES[0]+Vector3(0,0,-1)
    c.sync_darkness(1.0/60)
    check(c.animal_reveals[0].alpha>0 and c.animal_reveals[0].alpha<.2,"entry starts gradual actual material reveal")
    c.sync_darkness(.5)
    check(c.animal_reveals[0].alpha == 1,"entry completes reveal")
    game.player.position = c.CAMP
    c.sync_darkness(1.0/60)
    check(not c.animal_rigs[0].visible,"courtyard does not expose cave contents")
    game.queue_free()
    await process_frame
    print("CAVE_PRESENTATION_FAILURES=",failures)
    quit(0 if failures == 0 else 1)
