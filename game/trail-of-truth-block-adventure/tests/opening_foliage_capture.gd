extends SceneTree
## Matched seeded normal-player-camera views; not routed play or device evidence.
func _initialize() -> void: call_deferred("run")
func run() -> void:
	var game = load("res://main.tscn").instantiate()
	root.add_child(game)
	await physics_frame
	game.primary.pressed.emit()
	var tag := OS.get_environment("JD_ART_TAG")
	for view: String in ["bridge", "grove"]:
		game.player.position = Vector3(0,0,1.8) if view == "bridge" else Vector3(14,0,7)
		game.player.velocity = Vector3.ZERO
		game.player._yaw = -1.22 if view == "bridge" else -0.9
		game.player._pitch = -.45 if view == "bridge" else -.26
		for n in range(20): await physics_frame
		for shape in [Vector2i(1280,720),Vector2i(720,1280)]:
			root.size = shape
			for n in range(12): await process_frame
			await RenderingServer.frame_post_draw
			var path := "/tmp/jd-foliage-"+tag+"-"+view+"-"+str(shape.x)+".png"
			root.get_texture().get_image().save_png(path)
			print("CAPTURE ",path)
		assert(game.bridge_stage == 0, "Comparison must remain broken")
	print("OPENING_FOLIAGE_CAPTURE_COMPLETE")
	quit()
