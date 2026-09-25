extends "res://tests/cave_evidence_capture.gd"
## Identical six positions/orientations to the Mac fixture. Advance the same
## fixed simulation ticks without software-drawing every intermediate frame.
## Checkpoint renders only: not full-motion or hardware-performance evidence.
func shot(game, label: String, pos: Vector3, pitch: float) -> void:
    RenderingServer.render_loop_enabled = false
    game.player.position = pos
    game.player.velocity = Vector3.ZERO
    game.player._yaw = 0.0
    game.player._pitch = pitch
    for n in range(90): await physics_frame
    for shape in [Vector2i(1280,720), Vector2i(720,1280)]:
        root.size = shape
        for n in range(20): await process_frame
        RenderingServer.render_loop_enabled = true
        for n in range(3): await process_frame
        await RenderingServer.frame_post_draw
        var path := OUT + "cave-%s-%d.png" % [label, shape.x]
        var error := root.get_texture().get_image().save_png(path)
        if error != OK:
            push_error("Capture failed: "+path)
            quit(1)
            return
        print("CAPTURE ",path," player=",game.player.position," chamber=",game.caves.chamber_of(game.player.position)," lantern=",snappedf(game.caves.lantern.light_energy,.01))
        RenderingServer.render_loop_enabled = false
