extends SceneTree
func _initialize() -> void:
	call_deferred("run")
func run() -> void:
	root.size = Vector2i(1100, 800)
	var world = load("res://scripts/world.gd").new()
	root.add_child(world)
	var camera := Camera3D.new()
	world.add_child(camera)
	camera.current = true
	var views := {"west-cottage": [Vector3(-8,8,11),Vector3(-17.8,2,4.3)], "north-cottage": [Vector3(1,8,-6),Vector3(-6.5,2,-14.2)], "world-overhead": [Vector3(0,44,14),Vector3(0,0,0)]}
	var out := ProjectSettings.globalize_path("res://../../docs/games/block-evidence/stabilization")
	DirAccess.make_dir_recursive_absolute(out)
	for label in views:
		camera.position = views[label][0]
		camera.look_at(views[label][1])
		for i in range(8): await process_frame
		await RenderingServer.frame_post_draw
		root.get_texture().get_image().save_png(out + "/" + label + ".png")
		print("RENDER ",label)
	world.free()
	quit()
