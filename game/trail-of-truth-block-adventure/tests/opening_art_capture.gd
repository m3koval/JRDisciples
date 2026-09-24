extends SceneTree
## Visual-only fixture: fresh unrepaired opening, same player/camera in both versions.
func _initialize() -> void: call_deferred("run")
func run() -> void:
    var game = load("res://scripts/main.gd").new()
    root.add_child(game)
    await physics_frame
    game.primary.pressed.emit()
    game.player.position = Vector3(0,0,1.8)
    game.player.velocity = Vector3.ZERO
    game.player._yaw = -1.22
    game.player._pitch = -.45
    for n in range(20): await physics_frame
    var tag := OS.get_environment("JD_ART_TAG")
    for shape in [Vector2i(1280,720),Vector2i(720,1280)]:
        root.size = shape
        for n in range(12): await process_frame
        await RenderingServer.frame_post_draw
        var path := "/tmp/jd-opening-"+tag+"-"+str(shape.x)+".png"
        root.get_texture().get_image().save_png(path)
        print("CAPTURE ",path)
    print("UNREPAIRED_STAGE=",game.bridge_stage," PLAYER=",game.player.position," CAMERA_YAW=",game.player._yaw," CAMERA_PITCH=",game.player._pitch)
    quit(0 if game.bridge_stage == 0 else 1)
