extends SceneTree
func _initialize() -> void:
    call_deferred("run")
func run() -> void:
    var game = load("res://scripts/main.gd").new()
    root.add_child(game)
    game.set_process(false)
    game.set_physics_process(false)
    game.rewards.award("rescue")
    DirAccess.make_dir_recursive_absolute("/tmp/jd-ui-readability")
    for fixture in [[390, 783, "en", "intro"], [390, 783, "ru", "rewards"], [390, 783, "ru", ""], [844, 332, "ru", "pause"], [390, 783, "ru", "map"], [320, 568, "ru", ""], [667, 300, "ru", ""], [667, 300, "ru", "complete"]]:
        root.size = Vector2i(fixture[0], fixture[1])
        game.language = fixture[2]
        game.modal_kind = fixture[3]
        game.paused = fixture[3] != ""
        game.crossing_found = true
        game.carrying = 0
        game.context_kind = "place"
        game.notice_key = "crossing"
        game.notice_timer = 5
        game._layout_ui()
        game._refresh_ui()
        for i in 6:
            await process_frame
        await RenderingServer.frame_post_draw
        var path := "/tmp/jd-ui-readability/%s-%s-%s.png" % [fixture[0], fixture[2], "play" if fixture[3] == "" else fixture[3]]
        root.get_texture().get_image().save_png(path)
        print(path)
    game.queue_free()
    await process_frame
    quit()
