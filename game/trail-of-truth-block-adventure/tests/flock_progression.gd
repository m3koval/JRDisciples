extends SceneTree
## Native real-collider traversal with scripted player waypoints, not device/input QA.
var game
var c
var failures := 0
var previous_save := ""
var had_save := false
func _initialize() -> void:
    had_save = FileAccess.file_exists("user://block_save.json")
    if had_save: previous_save = FileAccess.get_file_as_string("user://block_save.json")
    call_deferred("run")
func check(ok: bool, label: String) -> void:
    print(("PASS " if ok else "FAIL ") + label)
    if not ok: failures += 1
func walk(to: Vector3) -> void:
    for frame in range(900):
        game.player.position = game.player.position.move_toward(to, .025)
        c.tick(1.0/60.0)
        if frame % 20 == 0: await physics_frame
        if game.player.position.distance_to(to) < .02: break
    for frame in range(180):
        c.tick(1.0/60.0)
        if frame % 20 == 0: await physics_frame
func capture(label: String) -> void:
    game._choose_context()
    game._refresh_ui()
    if DisplayServer.get_name() == "headless": return
    RenderingServer.render_loop_enabled = true
    for frame in range(8): await process_frame
    await RenderingServer.frame_post_draw
    root.get_texture().get_image().save_png("/tmp/jd-flock-" + label + ".png")
    print("CAPTURE /tmp/jd-flock-" + label + ".png")
    RenderingServer.render_loop_enabled = false
func run() -> void:
    root.size = Vector2i(1280,720)
    RenderingServer.render_loop_enabled = false
    game = load("res://scripts/main.gd").new()
    root.add_child(game)
    game.set_physics_process(false)
    game.player.set_physics_process(false)
    c = game.campaign
    game._apply_progress(null)
    c.restore()
    await physics_frame
    for value in [2.5, -1, 7, "4", [], true]:
        c.load_checkpoint({"stage":value}, false)
        check(c.stage == 0, "reject malformed checkpoint " + str(value))
    c.load_checkpoint({"stage":4}, false)
    check(c.stage == 0, "cannot skip rescue via checkpoint")
    game.completed = false
    for id in ["tracks", "bridge", "lamb"]: game._earn(id)
    game._complete()
    game._primary_action()
    game.player.set_physics_process(false)
    game.player.position = Vector3(-11,0,5)
    c.interact()
    check(c.stage == 2, "gather all nearby sheep")
    await walk(Vector3(-7,0,8))
    await walk(c.PASTURE)
    check(c.stage == 3, "real colliders: all three walk to pasture")
    if c.stage != 3:
        print("SHEEP ", c.sheep.map(func(s): return s.position))
        finish()
        return
    game.player.position = c.patches[0].position
    c.interact()
    check(c.repairs == 0, "cannot repair without a board")
    game.player.position = c.supplies[1].position
    # Second supply is close to the first, so check the selected target, not a false distance assumption.
    check(c.destination() == c.supplies[0].position, "repair order points to first supply")
    for i in range(2):
        game.player.position = c.supplies[i].position
        c.interact()
        game._choose_context()
        game._refresh_ui()
        check(c.held and game.counter.text.contains("board"), "persistent board inventory feedback")
        await capture("board-en" if i == 0 else "board-2")
        game.player.position = c.patches[1-i].position
        c.interact()
        check(c.held and c.repairs == i, "wrong rail cannot consume board")
        game.player.position = c.patches[i].position
        c.interact()
    check(c.stage == 4, "repair both rails before shelter")
    game.player.position = c.PASTURE
    c.interact()
    await walk(c.ENTRY + Vector3(0,0,1))
    await walk(c.FOLD)
    check(c.all_at(c.FOLD,1.8), "real colliders: all three enter fold")
    c.interact()
    check(c.shelter_time > 0 and c.context() == "", "safe closure hides duplicate action")
    var remaining: float = c.shelter_time
    game.paused = true
    c.tick(1.0)
    check(c.shelter_time == remaining, "pause freezes shelter beat")
    game.paused = false
    c.tick(2.1)
    check(c.stage == 5, "shelter unlocks return")
    c.interact()
    check(c.counted.count(true) == 0, "cannot count sheep at the fold")
    await physics_frame
    await walk(Vector3(-4,0,10))
    await walk(Vector3(-7,0,8))
    await walk(c.HOME)
    check(c.all_at(c.HOME,3), "real colliders: three sheep exit and return home")
    for i in range(3): c.interact()
    check(c.stage == 6 and game.modal_kind == "flock_complete" and game.paused, "counting opens chapter celebration")
    await capture("complete-en")
    game.language = "ru"
    await capture("complete-ru")
    check(game.modal_title.text == "Все овечки дома!", "Russian completion parity")
    check(game.primary.text == "Дальше: пещеры" and game.secondary.text == "Гулять на поляне", "next chapter and optional exploration stay available")
    game._secondary_action()
    check(not game.caves.active and not game.paused, "explore clearing does not start caves")
    game.player.set_physics_process(false)
    for i in range(3):
        game.player.position = game.seeds[i].position
        game._interact()
    check(game.garden_saved and game.seeds_found.size() == 3, "garden remains playable after flock completion")
    game.choose_camp_banner("blue")
    game._save_progress()
    var points: int = game.adventure_points
    game._load_progress()
    check(c.stage == 6 and game.camp_banner_color == "blue", "completed checkpoint and chosen banner reload")
    check(game._prepare_replay(), "replay checkpoint saves")
    game._load_progress()
    check(c.stage == 0 and game.adventure_points == points and game.camp_banner_color == "blue", "replay stays reset after reload and retains rewards")
    c.stage = 4
    c.shelter_time = 1
    c.restore()
    check(c.shelter_time == 0 and not c.gate.visible, "restore clears stale gate timer")
    # Real native write failure: a directory cannot be opened as a save file.
    DirAccess.remove_absolute(ProjectSettings.globalize_path("user://block_save.json"))
    DirAccess.make_dir_absolute(ProjectSettings.globalize_path("user://block_save.json"))
    c.stage = 1
    c.advance()
    check(c.stage == 2 and not game.saves_ok, "failed save does not undo a successful stage")
    check(not game._prepare_replay() and c.stage == 2, "failed replay save retains live checkpoint")
    check(not c.progress_text().is_empty(), "failed save has visible guidance")
    DirAccess.remove_absolute(ProjectSettings.globalize_path("user://block_save.json"))
    game._save_progress()
    c.stage = 4
    c.restore()
    game.language = "ru"
    game._choose_context()
    game._refresh_ui()
    await capture("shelter-ru")
    finish()
func finish() -> void:
    if had_save:
        var file := FileAccess.open("user://block_save.json", FileAccess.WRITE)
        file.store_string(previous_save)
        file.close()
    else: DirAccess.remove_absolute(ProjectSettings.globalize_path("user://block_save.json"))
    print("FLOCK_PROGRESSION_FAILURES=", failures)
    quit(failures)
