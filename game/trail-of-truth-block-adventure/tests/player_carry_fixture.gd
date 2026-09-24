extends SceneTree
## Native posed closeups. No quest/real-touch claims; writes only /tmp fixtures.
func _initialize() -> void:
	call_deferred("run")
func run() -> void:
	root.size = Vector2i(800, 800)
	var game = load("res://main.tscn").instantiate()
	root.add_child(game)
	game._primary_action()
	game.player.position = Vector3(-7, .1, -2)
	for i in 10: await physics_frame
	game._interact()
	assert(game.player.carrying)
	game.set_process(false)
	game.set_physics_process(false)
	var player = game.player
	player.set_physics_process(false)
	player.set_process(false)
	game.hud.visible = false
	player._joystick.visible = false
	player._visual.rotation = Vector3.ZERO
	var camera := Camera3D.new()
	root.add_child(camera)
	camera.current = true
	camera.fov = 38
	var mesh: MeshInstance3D = player._visual.find_children("*", "MeshInstance3D", true, false)[0]
	if "--original" in OS.get_cmdline_user_args():
		var original: Node = load("res://assets/michael.glb").instantiate()
		mesh.mesh = original.find_children("*", "MeshInstance3D", true, false)[0].mesh
		original.free()
	var folder := "/tmp/jd-player-fixtures/" + ("original" if "--original" in OS.get_cmdline_user_args() else "repaired")
	DirAccess.make_dir_recursive_absolute(folder)
	for clip in ["Idle", "Run", "Jump"]:
		player._animation.play(player._animations[clip])
		player._animation.advance(0.25)
		player._animation.pause()
		for view in ["front", "side", "rear"]:
			var offset: Vector3 = {"front": Vector3(0, 0.12, 2.5), "side": Vector3(2.5, 0.12, 0), "rear": Vector3(0, 0.12, -2.5)}[view]
			var target: Vector3 = player.global_position + Vector3(0, .85, 0)
			camera.position = target + offset
			camera.look_at(target)
			await process_frame
			await RenderingServer.frame_post_draw
			var file: String = folder + "/" + clip + "-" + view + ".png"
			root.get_texture().get_image().save_png(file)
			print("PLAYER_FIXTURE ", file)
	quit()
