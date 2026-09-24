extends "res://tests/cave_input_playthrough.gd"
## Host routed actions at fixture positions. Not a collision traversal claim.
func use_at(at: Vector3) -> void:
    game.player.position = at + Vector3(0,.15,.6)
    game.player.velocity = Vector3.ZERO
    for n in range(3): await physics_frame
    game._refresh_ui()
    game.action_button.pressed.emit()
    await process_frame
    if game.paused: game.primary.pressed.emit()
func capture(label: String) -> void:
    if DisplayServer.get_name() == "headless": return
    RenderingServer.render_loop_enabled = true
    for n in range(4): await process_frame
    await RenderingServer.frame_post_draw
    var path := "/tmp/jd-irrigation-"+label+".png"
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
    game.primary.pressed.emit()
    game.primary.pressed.emit()
    c = game.water_chapter
    check(c.active,"cave completion enters real chapter")
    await use_at(c.GARDENER)
    await use_at(c.KEEPER)
    await use_at(c.PLAN)
    check(c.construction.planned,"host input reads plan after teaching")
    await use_at(c.SLUICE)
    check(not c.construction.installed.support,"host input cannot place without material")
    for n in range(3): await use_at(c.SUPPLY)
    for n in range(3): await use_at(c.SLUICE)
    check(c.construction.ready_path(),"host input gathers and fits three finite parts")
    await use_at(c.FEED)
    # Fast-forward through chapter tick (the same entry used by the host).
    for n in range(10): c.tick(10)
    check(c.construction.flow.cell_state(3).soil == 0,"high geometry blocks row in campaign")
    var view := Camera3D.new()
    game.add_child(view)
    view.position = Vector3(169,20,19)
    view.look_at(Vector3(157,0,0))
    view.current = true
    await capture("ponding")
    await use_at(c.SPILL)
    for n in range(20): c.tick(10)
    check(c.construction.earned,"host grade action allows actual water to reach row and drain")
    check(absf(c.water[3].position.y - c.construction.flow.cell_state(3).head_m) < .000001,"render height uses model head (float32 transform tolerance)")
    game._toggle_pause()
    var stored: float = c.construction.flow.stored_m3()
    c.tick(1)
    check(stored == c.construction.flow.stored_m3(),"pause freezes model")
    game.primary.pressed.emit()
    await use_at(c.GARDENER)
    check(c.stage == 9,"real flow earns harvest")
    var saved: Dictionary = c.snapshot()
    c.load_checkpoint(saved,6)
    c.sync()
    check(c.construction.earned and c.stage == 9,"reload retains construction and reward")
    await capture("flow-en")
    game.language = "ru"
    game._refresh_ui()
    await capture("flow-ru")
    c.load_checkpoint({"active":true,"steps":Array(c.STEPS)},6)
    c.sync()
    check(c.stage == 9 and not c.construction.ready_path() and c.produce.visible,"old completed save keeps reward and offers new repair")
    print("CONSTRUCTION_HOST_FAILURES=",failures)
    quit(failures)
