extends SceneTree
func _initialize() -> void:
	call_deferred("run")
func run() -> void:
	root.size = Vector2i(1280,720)
	var game = load("res://main.tscn").instantiate()
	root.add_child(game)
	for i in range(5): await process_frame
	game._primary_action()
	for i in range(3): await process_frame
	await RenderingServer.frame_post_draw
	root.get_texture().get_image().save_png("/tmp/jd-environment-gameplay.png")
	var camera := Camera3D.new()
	game.add_child(camera)
	camera.position = Vector3(13,22,30)
	camera.look_at(Vector3(-5,0,1))
	camera.current = true
	for i in range(3): await process_frame
	await RenderingServer.frame_post_draw
	root.get_texture().get_image().save_png("/tmp/jd-environment-overview.png")
	print("ENVIRONMENT_CAPTURES_OK")
	quit()
