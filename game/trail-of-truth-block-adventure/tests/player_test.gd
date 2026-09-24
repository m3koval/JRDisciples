extends SceneTree
## Native controller contract tests; browser pointer delivery remains separate QA.
var failures: int = 0
var player: CharacterBody3D

func _initialize() -> void:
	call_deferred("_run")

func check(value: bool, label: String) -> void:
	print(("PASS " if value else "FAIL ") + label)
	if not value:
		failures += 1

func frames(count: int) -> void:
	for index: int in range(count):
		await physics_frame

func key(code: Key, pressed: bool) -> void:
	var event: InputEventKey = InputEventKey.new()
	event.physical_keycode = code
	event.pressed = pressed
	if pressed:
		player._unhandled_input(event)
	else:
		player._input(event)

func touch(index: int, point: Vector2, pressed: bool, canceled: bool = false) -> void:
	var event: InputEventScreenTouch = InputEventScreenTouch.new()
	event.index = index
	event.position = point
	event.pressed = pressed
	event.canceled = canceled
	if pressed and not canceled:
		player._unhandled_input(event)
	else:
		player._input(event)

func _run() -> void:
	var world: Node3D = Node3D.new()
	root.add_child(world)
	var floor_body: StaticBody3D = StaticBody3D.new()
	var collision: CollisionShape3D = CollisionShape3D.new()
	var box: BoxShape3D = BoxShape3D.new()
	box.size = Vector3(100.0, 1.0, 100.0)
	collision.shape = box
	floor_body.add_child(collision)
	floor_body.position.y = -0.5
	world.add_child(floor_body)
	player = load("res://scripts/player.gd").new()
	player.position = Vector3(0.0, 0.15, 0.0)
	world.add_child(player)
	await frames(20)
	check(player.is_on_floor(), "feet-origin capsule rests on ground")
	check(player.get_camera() != null and player.carry_socket != null, "public camera/socket API")
	check(player._animations.has("Idle") and player._animations.has("Run") and player._animations.has("Jump"), "accepted rig Idle Run Jump found")
	var start: Vector3 = player.position
	key(KEY_W, true)
	await frames(35)
	key(KEY_W, false)
	check(player.position.z < start.z - 1.5, "W traverses negative world Z at default yaw")
	await frames(15)
	start = player.position
	key(KEY_D, true)
	await frames(35)
	key(KEY_D, false)
	check(player.position.x > start.x + 1.5, "D freely traverses positive X")
	await frames(15)
	player.carrying = true
	key(KEY_W, true)
	await frames(20)
	check(absf(player.velocity.z + 3.1) < 0.1, "carrying reduces speed to 3.1")
	key(KEY_W, false)
	player.queue_jump()
	await frames(12)
	check(player.position.y > 0.4, "queued jump lifts feet off ground")
	await frames(50)
	player._yaw = PI * 0.5
	start = player.position
	key(KEY_W, true)
	await frames(30)
	key(KEY_W, false)
	check(player.position.x < start.x - 1.0, "movement rotates with orbit camera yaw")
	await frames(15)
	var size: Vector2 = root.get_visible_rect().size
	var origin: Vector2 = Vector2(size.x * 0.2, size.y * 0.7)
	touch(2, origin, true)
	var drag: InputEventScreenDrag = InputEventScreenDrag.new()
	drag.index = 2
	drag.position = origin + Vector2(64.0, 0.0)
	player._input(drag)
	await frames(3)
	check(player.move_input.x > 0.9, "floating touch stick supplies movement")
	touch(2, origin, false, true)
	await frames(2)
	check(player.move_input == Vector2.ZERO and player._stick_id == -1, "touch cancel clears movement")
	var yaw: float = player._yaw
	touch(4, Vector2(size.x * 0.7, size.y * 0.5), true)
	drag.index = 4
	drag.relative = Vector2(45.0, 0.0)
	player._input(drag)
	check(player._yaw != yaw and player._stick_id == -1, "right touch owns look only")
	touch(4, Vector2.ZERO, false)
	key(KEY_A, true)
	player._notification(Node.NOTIFICATION_APPLICATION_FOCUS_OUT)
	await frames(3)
	check(player.move_input == Vector2.ZERO and player._look_id == -1, "focus loss clears all owned input")
	# A GUI-consumed press only reaches _input, never _unhandled_input.
	var gui_touch: InputEventScreenTouch = InputEventScreenTouch.new()
	gui_touch.index = 9
	gui_touch.position = origin
	gui_touch.pressed = true
	player._input(gui_touch)
	check(player._stick_id == -1, "GUI-consumed press does not acquire joystick")
	player.set_enabled(false)
	key(KEY_W, true)
	player.queue_jump()
	await frames(3)
	check(player.move_input == Vector2.ZERO and player._jump_buffer == 0.0, "disabled controller ignores movement and jumps")
	await frames(20)
	var obstruction: StaticBody3D = StaticBody3D.new()
	var obstruction_shape: CollisionShape3D = CollisionShape3D.new()
	var obstruction_box: BoxShape3D = BoxShape3D.new()
	obstruction_box.size = Vector3(1.2, 1.2, 1.2)
	obstruction_shape.shape = obstruction_box
	obstruction.add_child(obstruction_shape)
	world.add_child(obstruction)
	var pivot_position: Vector3 = player._camera_pivot.global_position
	obstruction.global_position = pivot_position + (player.get_camera().global_position - pivot_position).normalized() * 2.8
	await frames(8)
	check(player._arm.get_hit_length() < 3.0, "camera sphere arm retracts before obstruction")
	obstruction.queue_free()
	await frames(8)
	check(player._arm.get_hit_length() > 5.0, "camera arm recovers after obstruction removed")
	print("PLAYER_TEST_FAILURES=", failures)
	quit(1 if failures > 0 else 0)
