extends SceneTree
## Matched cave views (entrance, threshold, inside) in landscape and portrait,
## for comparing cave assets. JD_CAVE_EVIDENCE_DIR sets the output folder.
var OUT := OS.get_environment("JD_CAVE_EVIDENCE_DIR").trim_suffix("/") + "/" if OS.get_environment("JD_CAVE_EVIDENCE_DIR") != "" else "/tmp/"
func _initialize() -> void: call_deferred("run")
func shot(game, label: String, pos: Vector3, pitch: float) -> void:
    game.player.position = pos
    game.player.velocity = Vector3.ZERO
    game.player._yaw = 0.0
    game.player._pitch = pitch
    for n in range(90): await physics_frame
    for shape in [Vector2i(1280,720), Vector2i(720,1280)]:
        root.size = shape
        for n in range(20): await process_frame
        await RenderingServer.frame_post_draw
        var path := OUT + "cave-%s-%d.png" % [label, shape.x]
        root.get_texture().get_image().save_png(path)
        print("CAPTURE ", path, " player=", game.player.position, " chamber=", game.caves.chamber_of(game.player.position), " lantern=", snappedf(game.caves.lantern.light_energy, .01))
func run() -> void:
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
    var e: Vector3 = game.caves.ENTRANCES[0]
    await shot(game, "1-entrance", e + Vector3(0, 0, 6), -.14)
    await shot(game, "2-threshold", e + Vector3(0, 0, .2), -.14)
    await shot(game, "3-inside", e + Vector3(0, 0, -5), -.2)
    quit(0)
