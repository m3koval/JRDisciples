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
    game.set_process(false)
    game.set_physics_process(false)
    var p = game.player
    p.set_process(false)
    p.set_physics_process(false)
    var c = game.caves
    c.active = true
    p.position = c.ENTRANCES[0]+Vector3(0,0,-4)
    c.animals[0].show()
    c.animals[0].position = c.ENTRANCES[0]+Vector3(0,0,-8)
    p._yaw = 0.0
    p._pitch = -.40
    var assist = preload("res://scripts/cave_camera_assist.gd").new()
    var portrait := Vector2(720,1280)
    var arm: SpringArm3D = p._arm
    var length := arm.spring_length
    var mask := arm.collision_mask
    var shape := arm.shape
    var camera_position: Vector3 = p.get_camera().position
    for n in range(120): assist.step(p,c,false,portrait,1.0/60)
    check(p._yaw > .10 and p._yaw < .19,"gentle three-quarter encounter framing")
    check(p.get_camera().fov > 65.0,"portrait encounter expands field of view")
    check(arm.spring_length == length and arm.collision_mask == mask and arm.shape == shape and p.get_camera().position == camera_position,"spring shape mask length and camera collision position untouched")
    p._yaw = 0.0
    p._look_id = 4
    for n in range(60): assist.step(p,c,false,portrait,1.0/60)
    check(p._yaw == 0.0,"touch look owns yaw")
    p._look_id = -1
    for n in range(120): assist.step(p,c,false,portrait,1.0/60)
    check(p._yaw == 0.0,"manual release retains three-second grace")
    p._mouse_look = true
    assist.step(p,c,false,portrait,1.0/60)
    check(p._yaw == 0.0,"mouse look owns yaw")
    p._mouse_look = false
    assist.manual_hold = 0
    p._keys[KEY_W] = true
    for n in range(60): assist.step(p,c,false,portrait,1.0/60)
    check(p._yaw == 0.0,"keyboard movement heading never steered")
    p._keys.clear()
    p._stick_vector = Vector2(.5,0)
    assist.step(p,c,false,portrait,1)
    check(p._yaw == 0.0,"touch movement heading never steered")
    p._stick_vector = Vector2.ZERO
    p._yaw = PI
    assist.step(p,c,false,portrait,1)
    check(p._yaw == PI,"looking away is not force-recentered")
    p._yaw = 0.0
    for n in range(120): assist.step(p,c,false,Vector2(1280,720),1.0/60)
    check(p._yaw == 0.0 and p.get_camera().fov < 58.1,"landscape unchanged and FOV restored")
    c.active = false
    assist.step(p,c,false,portrait,1)
    check(p._yaw == 0.0,"outside caves untouched")
    game.queue_free()
    await process_frame
    print("CAVE_CAMERA_ASSIST_FAILURES=",failures)
    quit(failures)
