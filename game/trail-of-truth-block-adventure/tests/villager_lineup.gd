extends SceneTree
## Posed visual QA fixture: villagers beside Michael at in-game scale.
func _initialize() -> void:
	call_deferred("run")
func run() -> void:
	root.size = Vector2i(1100, 650)
	var scene := Node3D.new()
	root.add_child(scene)
	var env := WorldEnvironment.new()
	env.environment = Environment.new()
	env.environment.background_mode = Environment.BG_COLOR
	env.environment.background_color = Color("b8d4d1")
	env.environment.ambient_light_color = Color(0.8, 0.8, 0.8)
	env.environment.ambient_light_energy = 0.6
	scene.add_child(env)
	var sun := DirectionalLight3D.new()
	sun.rotation_degrees = Vector3(-50, 25, 0)
	scene.add_child(sun)
	var entries := [["res://assets/villagers/elder.glb", 0.9], ["res://assets/michael.glb", 1.0], ["res://assets/villagers/mother.glb", 0.88], ["res://assets/villagers/baker.glb", 0.9]]
	var x := -1.8
	for e in entries:
		var n: Node3D = (load(e[0]) as PackedScene).instantiate()
		n.scale = Vector3.ONE * e[1]
		n.position = Vector3(x, 0, 0)
		scene.add_child(n)
		var ap: AnimationPlayer = n.find_children("*", "AnimationPlayer", true, false).front() if not n.find_children("*", "AnimationPlayer", true, false).is_empty() else null
		if ap:
			var clips := Array(ap.get_animation_list())
			var idle = clips.filter(func(c): return String(c).ends_with("Idle")).front() if clips.any(func(c): return String(c).ends_with("Idle")) else clips.front()
			ap.play(idle)
			print(e[0].get_file(), " clips=", clips.size(), " playing=", idle)
		x += 1.2
	var cam := Camera3D.new()
	cam.position = Vector3(0, 1.0, 5.2)
	cam.fov = 40
	scene.add_child(cam)
	cam.current = true
	for i in 20: await process_frame
	await RenderingServer.frame_post_draw
	root.get_texture().get_image().save_png(ProjectSettings.globalize_path("res://../../docs/games/block-evidence/villager-lineup.png"))
	print("SAVED")
	quit()
