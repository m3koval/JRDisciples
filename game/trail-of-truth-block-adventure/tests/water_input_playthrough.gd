extends "res://tests/cave_input_playthrough.gd"
## Native input/collider traversal; fixture only supplies already-earned caves.
func capture(label: String) -> void:
    if DisplayServer.get_name() == "headless": return
    RenderingServer.render_loop_enabled = true
    for n in range(6): await process_frame
    await RenderingServer.frame_post_draw
    var path := "/tmp/jd-water-" + label + ".png"
    root.get_texture().get_image().save_png(path)
    print("CAPTURE ",path)
    RenderingServer.render_loop_enabled = false
func run() -> void:
    if DisplayServer.get_name() != "headless": RenderingServer.render_loop_enabled = false
    root.size = Vector2i(1280,720)
    game = load("res://scripts/main.gd").new()
    root.add_child(game)
    await physics_frame
    game._apply_progress({"rescued":true,"campaign":{"stage":6},"caves":{"active":true,"steps":Array(game.caves.STEPS)}})
    game.caves.restore()
    game.modal_kind = "cave_complete"
    game.paused = true
    game._refresh_ui()
    game.primary.pressed.emit()
    await capture("intro-en")
    game.primary.pressed.emit()
    c = game.water_chapter
    game.player._yaw = 0
    check(await walk(Vector3(150,0,8.5)),"walk to gardener on real collision floor")
    await capture("dry-garden")
    root.size = Vector2i(768,1024)
    for n in range(6): await process_frame
    game._layout_ui()
    await capture("dry-garden-portrait")
    root.size = Vector2i(1280,720)
    for n in range(6): await process_frame
    game._layout_ui()
    await action()
    check(c.stage == 1 and game.paused,"keyboard meets Mira")
    game.primary.pressed.emit()
    check(await walk(Vector3(157,0,8.5)),"reach channel bank")
    check(await walk(Vector3(156,0,-10),.2),"follow dry watercourse upstream")
    await action()
    check(c.stage == 2 and game.modal_title.text.contains("Oren"),"keyboard meets Oren")
    await capture("oren")
    game.primary.pressed.emit()
    check(await walk(Vector3(157.5,0,-5)),"walk to blocked sluice")
    await action()
    check(c.stage == 3 and not c.debris.visible,"keyboard clears visible blockage")
    await action()
    check(c.stage == 4 and c.repair.visible,"keyboard seals sluice")
    check(await walk(Vector3(157.5,0,-8)),"upstream gate approached")
    await action()
    check(c.stage == 4 and c.spill_water.visible,"wrong order visibly spills without locking puzzle")
    await capture("wrong-order")
    check(await walk(Vector3(157.5,0,-2)),"walk downstream to spill wheel")
    await action()
    check(c.stage == 5,"input closes spill first")
    check(await walk(Vector3(157.5,0,-8)),"return upstream along accessible bank")
    await action()
    check(c.stage == 6 and c.water[0].visible and not c.water[5].visible,"input admits upstream water only")
    await capture("spring-open")
    check(await walk(Vector3(157.5,0,4)),"follow flowing channel to final gate")
    await action()
    check(c.stage == 7 and c.water[5].visible,"input irrigates garden")
    game._toggle_pause()
    var before: float = c.clock
    for n in range(12): await physics_frame
    check(c.clock == before,"native pause freezes moving water")
    game.primary.pressed.emit()
    check(await walk(Vector3(156,0,-10),.2),"return upstream to thank keeper")
    await action()
    check(c.stage == 8,"keeper acknowledges restored flow")
    game.primary.pressed.emit()
    check(await walk(Vector3(157,0,8.5)),"walk back beside restored watercourse")
    check(await walk(Vector3(150,0,8.5)),"return to gardener through beds")
    await action()
    check(c.stage == 9 and c.produce.visible,"native input earns visible harvest payoff")
    await capture("complete-en")
    game.language = "ru"
    game._refresh_ui()
    await capture("complete-ru")
    root.size = Vector2i(768,1024)
    for n in range(6): await process_frame
    game._layout_ui()
    await capture("complete-ru-portrait")
    root.size = Vector2i(1280,720)
    for n in range(6): await process_frame
    game._layout_ui()
    game.primary.pressed.emit()
    await capture("garden-restored-ru")
    # Explicitly posed overview, separate from traversal evidence above.
    var overview := Camera3D.new()
    game.add_child(overview)
    overview.position = Vector3(168,20,21)
    overview.look_at(Vector3(157,0,-1))
    overview.current = true
    await capture("overview-restored")
    print("WATER_INPUT_FAILURES=",failures)
    quit(failures)
