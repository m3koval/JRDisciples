extends SceneTree
## Visual iteration fixture ONLY: seeded completed repair, normal player camera.
## Functional continuous route is independently tested by irrigation_geometry_playthrough.
func _initialize() -> void: call_deferred("run")
func run() -> void:
    root.size = Vector2i(1280,720)
    var game = load("res://scripts/main.gd").new()
    root.add_child(game)
    await physics_frame
    game._apply_progress({"rescued":true,"campaign":{"stage":6},"caves":{"active":true,"steps":Array(game.caves.STEPS)}})
    game.caves.restore()
    game.modal_kind = "cave_complete"
    game.paused = true
    game.primary.pressed.emit()
    game.primary.pressed.emit()
    var c = game.water_chapter
    c.completed_steps.assign(["need","plan"])
    c.construction.act("plan")
    for item in ["stone","board","seal"]: c.construction.act("gather",item)
    for item in ["support","channel","seal"]: c.construction.act("place",item)
    c.construction.act("inlet")
    c.construction.act("grade")
    c.tick(8)
    game._refresh_ui()
    var points := [Vector3(157,0,-3.5),Vector3(156.8,0,10),Vector3(155,0,-8)]
    var names := ["repair","garden","workshop"]
    for i in range(points.size()):
        game.player.position = points[i]
        game.player.velocity = Vector3.ZERO
        game.player._yaw = [-.55,.40,.45][i]
        game.player._pitch = -.60
        for shape in [Vector2i(1280,720),Vector2i(720,1280)]:
            root.size = shape
            for n in range(8): await process_frame
            await RenderingServer.frame_post_draw
            var path: String = "/tmp/jd-art-study-"+names[i]+"-"+str(shape.x)+".png"
            root.get_texture().get_image().save_png(path)
            print("FIXTURE_CAPTURE ",path)
    print("ART_FIXTURE_COMPLETE")
    quit()
