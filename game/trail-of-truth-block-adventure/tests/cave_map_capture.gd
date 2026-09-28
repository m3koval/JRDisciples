extends SceneTree
## Seeded native modal captures, not trusted-touch or device evidence.
var out := OS.get_environment("JD_CAVE_EVIDENCE_DIR").trim_suffix("/")
func _initialize() -> void: call_deferred("run")
func run() -> void:
    if out.is_empty() or DisplayServer.get_name() == "headless":
        push_error("Native renderer and JD_CAVE_EVIDENCE_DIR required")
        quit(1)
        return
    RenderingServer.render_loop_enabled = false
    var game = load("res://scripts/main.gd").new()
    root.add_child(game)
    await physics_frame
    game._apply_progress(null)
    game.campaign.stage = 6
    game.reward_saved = true
    game.completed = true
    game.modal_kind = "flock_complete"
    game._primary_action()
    game._primary_action()
    for n in range(30): await physics_frame
    game._open_map()
    for lang in ["en","ru"]:
        game.language = lang
        game.trail_map.set_language(lang)
        for shape in [Vector2i(1280,720),Vector2i(720,1280)]:
            root.size = shape
            game._refresh_ui()
            for n in range(5): await process_frame
            RenderingServer.render_loop_enabled = true
            for n in range(2): await process_frame
            await RenderingServer.frame_post_draw
            var path := out+"/map-%s-%d.png"%[lang,shape.x]
            if root.get_texture().get_image().save_png(path) != OK:
                push_error("Capture failed: "+path)
                quit(1)
                return
            print("CAPTURE ",path)
            RenderingServer.render_loop_enabled = false
    print("CAVE_MAP_CAPTURE_PASS")
    quit(0)
