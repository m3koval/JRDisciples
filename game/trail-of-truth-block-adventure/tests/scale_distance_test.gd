extends SceneTree
var game
var failures := 0
func _initialize() -> void: call_deferred("run")
static func bounds(node: Node3D) -> AABB:
    var result := AABB()
    var first := true
    for item in node.find_children("*", "MeshInstance3D", true, false):
        var mesh := item as MeshInstance3D
        if not mesh.visible or mesh.mesh == null: continue
        var posed: Mesh = mesh.mesh
        if mesh.skin != null: posed = mesh.bake_mesh_from_current_skeleton_pose()
        var b: AABB = mesh.global_transform * posed.get_aabb()
        result = b if first else result.merge(b)
        first = false
    return result
func check(ok: bool, message: String) -> void:
    print(("PASS " if ok else "FAIL ")+message)
    if not ok: failures += 1
func run() -> void:
    if DisplayServer.get_name() == "headless":
        push_error("Rendered skin bounds require native renderer; use xvfb-run, not --headless")
        quit(2)
        return
    game = load("res://scripts/main.gd").new()
    root.add_child(game)
    game.set_physics_process(false)
    game.paused = false
    game.water_chapter.active = true
    game.water_chapter.sync()
    game.player.position = Vector3(148,0,7)
    game.player.set_enabled(true)
    for i in range(30): await physics_frame
    game.player.set_enabled(false)
    var player_bounds := bounds(game.player._visual)
    print("PLAYER_BOUNDS ",player_bounds)
    for actor in game.water_chapter.actors:
        print("ACTOR_BOUNDS ",actor.name," ",bounds(actor.get_child(0)))
    print("CAMERA ",game.player._camera.projection," fov=",game.player._camera.fov," spring=",game.player._arm.spring_length," pivot=",game.player._camera_pivot.global_position-game.player.global_position)
    print("PRODUCE_BOUNDS ",bounds(game.water_chapter.produce))
    print("CROP_BOUNDS ",bounds(game.water_chapter.plants[0]))
    check(player_bounds.size.y > 1.25 and player_bounds.size.y < 1.4, "accepted child stature")
    check(absf(player_bounds.position.y) < .02, "child feet on floor")
    for actor in game.water_chapter.actors:
        var b := bounds(actor.get_child(0))
        check(b.size.y > 1.65 and b.size.y < 1.81 and b.size.y > player_bounds.size.y, "adult taller than child: "+actor.name)
        check(absf(b.position.y) < .01, "adult feet on floor: "+actor.name)
        game.player.position = actor.position + Vector3(0,0,1.2)
        check(game.player.test_move(game.player.global_transform, Vector3(0,0,-1.2)), "NPC blocks body")
        check(game.water_chapter.context() != "", "context available outside capsule")
    game.player.position = Vector3(149,0,5.3)
    check(game.player.test_move(game.player.global_transform, Vector3(0,0,-1.3)), "bench blocks body at visible timber")
    game.player.position = Vector3(150,0,8.5)
    check(not game.player.test_move(game.player.global_transform, Vector3(7,0,0)), "bed corridor stays open")
    game.player.position = game.water_chapter.GARDENER + Vector3(0,0,2.2)
    check(game.water_chapter.context() == "", "out of reach has no context")
    var capsule: CapsuleShape3D = game.player.get_child(0).shape
    check(is_equal_approx(capsule.height,1.25) and is_equal_approx(capsule.radius,.27), "accepted capsule preserved")
    var crop := bounds(game.water_chapter.plants[0])
    check(crop.size.x < .8 and crop.size.y < .5, "mature cabbage dimensions bounded")
    var basket := bounds(game.water_chapter.produce)
    check(basket.size.x < .85 and basket.size.y < .7, "harvest basket dimensions bounded")
    var camera := Camera3D.new()
    game.add_child(camera)
    camera.position = Vector3(148,1,16.5)
    camera.look_at(Vector3(148,1,8.5))
    game.player.position = Vector3(146.5,0,8.5)
    var child_pixels: float = absf(camera.unproject_position(Vector3(146.5,player_bounds.size.y,8.5)).y-camera.unproject_position(Vector3(146.5,0,8.5)).y)
    for actor in game.water_chapter.actors:
        var adult_pixels: float = absf(camera.unproject_position(Vector3(148,actor.get_meta("stature"),8.5)).y-camera.unproject_position(Vector3(148,0,8.5)).y)
        check(adult_pixels > child_pixels*1.2, "equal-depth projected adult taller")
    print("SCALE_DISTANCE_FAILURES=",failures)
    quit(failures)
