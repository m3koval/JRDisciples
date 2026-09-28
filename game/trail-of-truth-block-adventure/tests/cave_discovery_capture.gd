extends SceneTree
## Seeded normal-camera encounter states; not routed play or device evidence.
var out := OS.get_environment("JD_CAVE_EVIDENCE_DIR").trim_suffix("/")
func _initialize() -> void: call_deferred("run")
func run() -> void:
    if out.is_empty() or DisplayServer.get_name() == "headless":
        push_error("Native renderer and output directory required")
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
    game.set_physics_process(false)
    var c = game.caves
    for which in range(3):
        c.completed_steps.clear()
        c.wool_read = which == 2
        if which < 2: c.completed_steps.append(c.STEPS[which*2])
        else: c.completed_steps.append("lamb_found")
        c.restore()
        game.player.position = c.ENTRANCES[which]+Vector3(1.4,0,-4.9)
        game.player.velocity = Vector3.ZERO
        game.player._yaw = .12
        game.player._pitch = -.24
        c.animal_index = which if which < 2 else -1
        c.phase = "warn" if which < 2 else "idle"
        c.timer = .8
        if which < 2:
            c.lunge_from = c.animals[which].position
            c.lunge_to = game.player.position
            for n in range(20): c.animal_motion[which].step(1.0/60.0,"warn",.8,c.lunge_to-c.lunge_from)
        c.sync_darkness(10)
        c.sync_health_bars()
        c.discovery.tick(0)
        game._choose_context()
        for shape in [Vector2i(1280,720),Vector2i(720,1280)]:
            root.size = shape
            for n in range(40): await physics_frame
            game._refresh_ui()
            RenderingServer.render_loop_enabled = true
            for n in range(3): await process_frame
            await RenderingServer.frame_post_draw
            var path := out+"/state-%d-%d.png"%[which,shape.x]
            if root.get_texture().get_image().save_png(path) != OK:
                push_error("Cannot save "+path)
                quit(1)
                return
            print("CAPTURE ",path)
            RenderingServer.render_loop_enabled = false
    print("CAVE_DISCOVERY_CAPTURE_PASS")
    quit(0)
