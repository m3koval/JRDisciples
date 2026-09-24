extends SceneTree
# Posed visual QA fixture only; mission correctness uses separate input-driven tests.
func _initialize() -> void:
    call_deferred("run")
func run() -> void:
    root.size = Vector2i(900, 700)
    var game = load("res://main.tscn").instantiate()
    root.add_child(game)
    game._primary_action()
    game.player.position = Vector3(-7, .1, -2)
    for i in 10: await physics_frame
    game._interact()
    assert(game.player.carrying)
    game.player._yaw = 0.0 if "--front" in OS.get_cmdline_user_args() else PI
    game.player._pitch = -.18
    game.player._arm.spring_length = 3.0
    game.player.get_camera().fov = 45
    game.hud.visible = false
    game.player._joystick.visible = false
    for i in 30: await physics_frame
    var skeleton = game.player._visual.find_children("*", "Skeleton3D", true, false)[0]
    for bone_name in ["upper_arm.L", "forearm.L", "hand.L", "upper_arm.R", "forearm.R", "hand.R"]:
        var bone = skeleton.find_bone(bone_name)
        print(bone_name, " rest=", skeleton.get_bone_global_rest(bone).origin, " pose=", skeleton.get_bone_global_pose(bone).origin)
    await RenderingServer.frame_post_draw
    var file := ProjectSettings.globalize_path("res://../../docs/games/block-evidence/carry-pose-fixture.png")
    root.get_texture().get_image().save_png(file)
    print("POSED_VISUAL_FIXTURE ", file)
    quit()
