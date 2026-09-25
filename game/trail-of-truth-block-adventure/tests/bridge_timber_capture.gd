extends SceneTree
## Seeded composition-only comparison. Physical mission is a separate test.
func _initialize() -> void: call_deferred("run")
func run() -> void:
    var game = load("res://main.tscn").instantiate()
    root.add_child(game)
    await physics_frame
    game.primary.pressed.emit()
    game.player.position = Vector3(0,0,1.8)
    game.player.velocity = Vector3.ZERO
    game.player._yaw = -1.22
    game.player._pitch = -.45
    for n in range(20): await physics_frame
    for stage in [0,1,2,0]:
        game.bridge_stage = stage
        game.world.set_bridge_stage(stage)
        game._refresh_ui()
        for shape in [Vector2i(1280,720),Vector2i(720,1280)]:
            root.size = shape
            for n in range(12): await process_frame
            await RenderingServer.frame_post_draw
            var path := "/tmp/jd-bridge-stage-"+str(stage)+"-"+str(shape.x)+".png"
            root.get_texture().get_image().save_png(path)
            print("CAPTURE ",path)
    print("BRIDGE_TIMBER_CAPTURE_COMPLETE")
    quit()
