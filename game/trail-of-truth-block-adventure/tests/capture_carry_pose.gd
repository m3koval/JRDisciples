extends SceneTree
var game
func frames(n: int) -> void:
	for i in range(n): await physics_frame
func key(code: int, down: bool) -> void:
	var event := InputEventKey.new()
	event.physical_keycode = code
	event.pressed = down
	Input.parse_input_event(event)
func walk(target: Vector3) -> void:
	for i in range(1200):
		var d: Vector3 = target - game.player.position
		d.y = 0
		if d.length() < .35: break
		key(KEY_D, d.x > .20)
		key(KEY_A, d.x < -.20)
		key(KEY_S, d.z > .20)
		key(KEY_W, d.z < -.20)
		await frames(1)
	for k in [KEY_W, KEY_A, KEY_S, KEY_D]: key(k, false)
	await frames(6)
func shot(name: String) -> void:
	RenderingServer.render_loop_enabled = true
	await process_frame
	await RenderingServer.frame_post_draw
	root.get_texture().get_image().save_png(ProjectSettings.globalize_path("res://../../docs/games/block-evidence/" + name + ".png"))
	RenderingServer.render_loop_enabled = false
func _initialize() -> void:
	call_deferred("run")
func run() -> void:
	root.size = Vector2i(1000, 750)
	game = load("res://main.tscn").instantiate()
	root.add_child(game)
	await frames(4)
	game._primary_action()
	await frames(4)
	# First board is at (-7, 0.32, -2); approach and face it, then pick up.
	await walk(Vector3(-7.6, 0, -1.4))
	game.player._yaw = atan2(-1.0, 1.0)
	game.player._pitch = -0.30
	await frames(6)
	key(KEY_E, true)
	await frames(4)
	key(KEY_E, false)
	await frames(20)
	print("carrying=", game.carrying, " player_at=", game.player.position)
	await shot("carry_pose_check")
	# Turn to get a clean side profile of the carried board too.
	game.player._yaw = deg_to_rad(90)
	await frames(10)
	await shot("carry_pose_side_check")
	quit(0)
