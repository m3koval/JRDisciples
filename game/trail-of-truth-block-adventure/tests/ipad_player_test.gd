extends SceneTree
## Synthetic native events: ownership/anchoring, not physical WKWebView certification.
var failures := 0
var player
func _initialize() -> void:
	call_deferred("run")
func check(ok: bool, label: String) -> void:
	print(("PASS " if ok else "FAIL ") + label)
	if not ok: failures += 1
func touch(id: int, point: Vector2, pressed := true) -> void:
	var e := InputEventScreenTouch.new()
	e.index = id
	e.position = point
	e.pressed = pressed
	player._input(e)
	if pressed: player._unhandled_input(e)
func drag(id: int, point: Vector2, relative: Vector2) -> void:
	var e := InputEventScreenDrag.new()
	e.index = id
	e.position = point
	e.relative = relative
	player._input(e)
func run() -> void:
	root.size = Vector2i(1280, 720)
	player = load("res://scripts/player.gd").new()
	root.add_child(player)
	player.set_physics_process(false)
	var anchor: Vector2 = player._joystick.origin
	var size := root.get_visible_rect().size
	touch(1, anchor + Vector2(20, 0))
	check(player._joystick.origin == anchor, "stick remains at visible resting anchor")
	drag(1, anchor + Vector2(64, 0), Vector2(44, 0))
	check(player._stick_vector.is_equal_approx(Vector2.RIGHT), "fixed stick reaches full right from anchor")
	var yaw: float = player._yaw
	# Duplicate delivery must not give the movement pointer a second role.
	touch(1, Vector2(size.x * 0.8, size.y * 0.6))
	check(player._look_id == -1, "owned movement pointer cannot acquire look")
	var mouse := InputEventMouseButton.new()
	mouse.button_index = MOUSE_BUTTON_LEFT
	mouse.pressed = true
	mouse.device = 0
	player._unhandled_input(mouse)
	var motion := InputEventMouseMotion.new()
	motion.relative = Vector2(90, 20)
	player._input(motion)
	check(is_equal_approx(player._yaw, yaw), "mouse stream cannot orbit during owned touch")
	touch(2, Vector2(size.x * 0.8, size.y * 0.6))
	drag(1, Vector2(size.x * 0.8, size.y * 0.6), Vector2(40, 0))
	check(is_equal_approx(player._yaw, yaw), "joystick crossing right half never rotates camera")
	drag(2, Vector2(size.x * 0.8, size.y * 0.6), Vector2(20, 0))
	check(not is_equal_approx(player._yaw, yaw), "independent right pointer still orbits")
	touch(1, Vector2.ZERO, false)
	check(player._stick_id == -1 and player._look_id == 2, "release movement preserves independent look")
	player.set_enabled(false)
	check(player._look_id == -1 and player._stick_vector == Vector2.ZERO, "pause clears both pointer owners")
	player.set_enabled(true)
	mouse.device = -1
	player._unhandled_input(mouse)
	check(not player._mouse_look, "engine emulated mouse cannot acquire orbit")
	check(player.carry_socket.position.z <= 0.45, "carried board stays close to torso")
	check(player.get_camera().get_parent() == player._camera_pivot, "camera distance is filtered independently of instantaneous spring arm")
	var skeleton: Skeleton3D = player._visual.find_children("*", "Skeleton3D", true, false)[0]
	var modifier: SkeletonModifier3D = skeleton.get_node("CarryPose")
	player.carrying = true
	var socket_before: Transform3D = player.carry_socket.transform
	for clip: String in ["Idle", "Run", "Jump"]:
		player._animation.play(player._animations[clip])
		player._animation.advance(0.25)
		modifier._process_modification()
		for side: String in ["L", "R"]:
			var hand: Vector3 = player._visual.to_local(skeleton.to_global(skeleton.get_bone_global_pose(skeleton.find_bone("hand." + side)).origin))
			print("CARRY_HAND ", clip, " ", side, " ", hand)
			check(hand.z > 0.20 and hand.y > 0.55 and hand.y < 1.2, clip + " " + side + " hand holds forward instead of swinging")
	check(player.carry_socket.transform == socket_before, "board attachment does not bob with locomotion clips")
	var lantern: int = skeleton.find_bone("lantern")
	check(skeleton.get_bone_global_pose(lantern).basis.x.length() < .01, "hand lantern is stowed during two-handed carrying")
	player.carrying = false
	var arm: int = skeleton.find_bone("upper_arm.L")
	var before: Transform3D = skeleton.get_bone_global_pose(arm)
	modifier._process_modification()
	check(skeleton.get_bone_global_pose(arm) == before, "carry override stops after release")
	player.set_process(false)
	await physics_frame
	await physics_frame
	player.get_camera().position.z = 1.0
	player._process(1.0 / 60.0)
	print("CAMERA_RECOVERY ", player.get_camera().position.z, " hit=", player._arm.get_hit_length())
	check(player.get_camera().position.z > 1.0 and player.get_camera().position.z < 5.8, "camera recovers gradually instead of snapping outward")
	print("IPAD_PLAYER_TEST_FAILURES=", failures)
	quit(1 if failures else 0)
