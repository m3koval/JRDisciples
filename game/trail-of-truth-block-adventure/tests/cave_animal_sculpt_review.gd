extends SceneTree
## Same-camera integrated actor study; seeded composition, not routed play.
func _initialize() -> void: call_deferred("run")
func run() -> void:
    root.size = Vector2i(960,600)
    var output := OS.get_environment("JD_ANIMAL_PREVIEW_DIR")
    DirAccess.make_dir_recursive_absolute(output)
    var game = load("res://scripts/main.gd").new()
    root.add_child(game)
    game.set_process(false)
    game.set_physics_process(false)
    game.player.set_physics_process(false)
    game.player.hide()
    game.hud.hide()
    var c = game.caves
    c.active = true
    c.restore()
    c.lamb.hide()
    for sign in c.signs: sign.hide()
    c.get_node("CampSign").hide()
    var camera := Camera3D.new()
    game.add_child(camera)
    camera.position = Vector3(103.6,2.7,5.3)
    camera.look_at(Vector3(100,.8,0))
    camera.fov = 34
    camera.current = true
    for index in range(2):
        c.animals[1-index].hide()
        var actor: Node3D = c.animals[index]
        actor.show()
        actor.position = Vector3(100,0,0)
        c.animal_reveals[index].update(true, 10.0, false)
        if OS.get_environment("JD_ANIMAL_BASELINE") == "1":
            var source := GDScript.new()
            source.source_code = FileAccess.get_file_as_string("/tmp/animal-original.gd")
            source.reload()
            var body: Node3D = c.animal_motion[index].body
            for child in body.get_children():
                body.remove_child(child)
                child.free()
            var original = source.new()
            body.add_child(original)
            original.configure("lion" if index == 0 else "bear")
        c.animal_motion[index].reset_pose()
        for n in range(3): await process_frame
        await RenderingServer.frame_post_draw
        root.get_texture().get_image().save_png(output+("/lion.png" if index == 0 else "/bear.png"))
    print("SCULPT_REVIEW_COMPLETE")
    quit(0)
