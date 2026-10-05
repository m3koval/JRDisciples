extends "res://tests/playthrough.gd"
## Real keyboard traversal earns the east bank; a real off-bridge fall tests recovery.
func shot(name: String) -> void:
    var output := OS.get_environment("TRAIL_CAPTURE_DIR")
    if output.is_empty(): return
    RenderingServer.render_loop_enabled = true
    await process_frame
    await RenderingServer.frame_post_draw
    root.get_texture().get_image().save_png(output.path_join(name + ".png"))
    RenderingServer.render_loop_enabled = false

func run() -> void:
    root.size = Vector2i(1280,720)
    if not OS.get_environment("TRAIL_CAPTURE_DIR").is_empty():
        RenderingServer.render_loop_enabled = false
    game = load("res://main.tscn").instantiate()
    root.add_child(game)
    await frames(5)
    game._primary_action()
    await frames(5)
    check("starts_without_free_bank_checkpoint", game.shore_checkpoint == game.SPAWN)
    await shot("01-start")
    await walk(Vector3(-7,0,-2))
    await interact()
    await walk(Vector3(1.4,0,-4))
    key(KEY_D,true)
    for frame in range(160):
        await frames(1)
        if game.recoveries > 0: break
    key(KEY_D,false)
    await frames(10)
    check("unrepaired_creek_cannot_unlock_east", game.recoveries == 1 and game.player.position.x < 2 and game.bridge_stage == 0)
    check("carried_log_survives_real_fall", game.carrying == 0 and game.player.carrying)
    await walk(Vector3(1.2,0,0))
    await interact()
    await walk(Vector3(-15,0,-5))
    await interact()
    await walk(Vector3(1.5,0,0))
    await interact()
    check("bridge_earned_with_real_input", game.bridge_stage == 2)
    check("west_checkpoint_before_crossing", game.shore_checkpoint.x < 2)
    await walk(Vector3(9,0,0))
    check("search_not_skipped", not game.lamb_found and not game.following)
    await shot("02-crossing-earned")
    await walk(Vector3(9,0,4))
    var before: int = game.recoveries
    key(KEY_A,true)
    for frame in range(160):
        await frames(1)
        if game.recoveries > before: break
    check("actual_fall_recovered", game.recoveries == before + 1)
    check("earned_east_bank_not_camp", game.player.position.x >= 8.0 and absf(game.player.position.z) < 1.0)
    await shot("03-bank-recovery")
    await frames(100)
    check("held_input_does_not_repeat_fall", game.recoveries == before + 1 and game.player.position.x >= 8.0)
    key(KEY_A,false)
    check("progress_preserved_not_free_rescue", game.bridge_stage == 2 and not game.lamb_found and not game.completed)
    game._refresh_ui()
    check("no_phantom_log_copy", game.notice.text.contains("safe bank"))
    await walk(Vector3(1.2,0,0))
    await walk(Vector3(1.2,0,4))
    before = game.recoveries
    key(KEY_D,true)
    for frame in range(160):
        await frames(1)
        if game.recoveries > before: break
    key(KEY_D,false)
    await frames(10)
    check("return_trip_earns_west_bank", game.recoveries == before + 1 and game.player.position.x < 2)
    await walk(Vector3(9,0,0))
    # Preserve reach gates: regroup only after the lamb has actually been called.
    await walk(Vector3(14,0,-6))
    await walk(Vector3(14,0,-11))
    await walk(Vector3(18.5,0,-11))
    await interact()
    check("lamb_called_normally", game.following)
    # Posed negative fixture isolates directional guidance at leash distance.
    game.player.position = Vector3(8,0,5)
    await frames(2)
    game._choose_context()
    game._refresh_ui()
    check("regroup_marker_not_wrong_camp", Vector2(game.target_marker.position.x-game.lamb.position.x,game.target_marker.position.z-game.lamb.position.z).length() < .01)
    check("regroup_objective_en", game.objective.text.contains("return"))
    await shot("04-regroup-en-posed")
    game.language = "ru"
    game._refresh_ui()
    check("regroup_objective_ru", game.objective.text.contains("вернись"))
    await shot("05-regroup-ru-posed")
    check("no_remote_rescue", not game.completed)
    quit(1 if results.values().has(false) else 0)
