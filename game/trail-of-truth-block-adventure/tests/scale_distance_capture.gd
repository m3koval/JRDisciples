extends SceneTree
var game
func _initialize() -> void: call_deferred("run")
func shot(label: String) -> void:
    for i in range(8): await process_frame
    await RenderingServer.frame_post_draw
    root.get_texture().get_image().save_png("/tmp/jd-scale-"+label+".png")
    print("CAPTURE /tmp/jd-scale-"+label+".png")
func run() -> void:
    root.size = Vector2i(1280,720)
    game = load("res://scripts/main.gd").new()
    root.add_child(game)
    game.set_physics_process(false)
    game.paused = false
    game.water_chapter.active = true
    game.water_chapter.sync()
    game.player.position = Vector3(150,0,8.5)
    game.player.set_enabled(true)
    game._refresh_ui()
    for i in range(40): await physics_frame
    await shot("landscape")
    root.size = Vector2i(768,1024)
    game._layout_ui()
    await shot("portrait")
    root.size = Vector2i(1280,720)
    game.player.position = Vector3(149,0,5.1)
    for i in range(40): await physics_frame
    print("BENCH_CAMERA_DISTANCE=",game.player._camera.position.z)
    await shot("bench-approach")
    game.player.set_enabled(false)
    game.player.position = Vector3(148,0,13)
    game.water_chapter.actors[0].position = Vector3(149.5,0,13)
    game.water_chapter.actors[1].position = Vector3(151,0,13)
    for label in game.water_chapter.labels: label.visible = false
    game.water_chapter.actors[0].rotation.y = 0
    game.water_chapter.actors[1].rotation.y = 0
    var cam := Camera3D.new()
    game.add_child(cam)
    cam.position = Vector3(149.5,1,21)
    cam.look_at(Vector3(149.5,1,13))
    cam.fov = 58
    cam.current = true
    await shot("same-depth")
    quit()
