extends SceneTree
var checks := 0
var failed := false
func check(label: String, ok: bool) -> void:
    checks += 1
    print(label, ": ", ok)
    if not ok: failed = true
func _initialize() -> void:
    call_deferred("run")
func run() -> void:
    var r = preload("res://scripts/adventure_rewards.gd").new()
    check("invalid and locked", r.award("bogus") == 0 and not r.choose_banner("blue") and r.total() == 0)
    for id in r.VALUES:
        check("award " + id, r.award(id) == r.VALUES[id])
        check("duplicate " + id, r.award(id) == 0)
    var sum := 0
    for value in r.VALUES.values(): sum += int(value)
    check("exact cap", sum == 130 and r.total() == sum and r.CAP == sum)
    check("deliberate choice", r.banner_color == "" and r.choose_banner("blue") and not r.choose_banner("invalid") and r.banner_color == "blue")
    var saved = JSON.parse_string(JSON.stringify({"rewards": r.snapshot()}))
    r.load_save(saved)
    check("roundtrip", r.total() == 130 and r.banner_color == "blue" and r.award("rescue") == 0)
    r.load_save({"rescued": true, "garden": false})
    check("legacy rescue", r.total() == 100 and r.banner_color == "" and not r.earned.has("garden"))
    r.load_save({"rescued": false, "garden": true})
    check("legacy garden", r.total() == 30 and not r.choose_banner("gold"))
    r.load_save({"rescued": true, "garden": true})
    check("legacy full", r.total() == 130)
    for bad in [null, [], "bad", 999, {"rescued": "true", "garden": 1}, {"rewards": []}, {"rewards": {"earned": ["rescue"], "banner_color": "blue"}}, {"rewards": {"earned": {"rescue": 1, "tracks": "true", "garden": false, "bogus": true}, "total": 99999, "banner_color": "gold"}}]:
        r.load_save(bad)
        check("corrupt fields", r.total() == 0 and r.banner_color == "")
    var game = load("res://main.tscn").instantiate()
    root.add_child(game)
    await process_frame
    var original = FileAccess.get_file_as_string("user://block_save.json") if FileAccess.file_exists("user://block_save.json") else ""
    game._apply_progress(null)
    game._primary_action()
    game._interact()
    check("invalid interaction earns nothing", game.adventure_points == 0)
    check("locked main choice", not game.choose_camp_banner("gold"))
    for seed in game.seeds:
        game.player.position = seed.position
        game._interact()
    check("garden gameplay awards once", game.adventure_points == 30 and game.garden_saved)
    game._interact()
    check("garden cannot be farmed", game.adventure_points == 30)
    game._apply_progress(null)
    game._earn("tracks")
    game._earn("tracks")
    game._load_progress()
    check("native partial save reload", game.adventure_points == 10)
    game._apply_progress({"rescued": true, "garden": true})
    game._save_progress()
    check("main choice", game.choose_camp_banner("green"))
    game._load_progress()
    check("native cosmetic reload", game.adventure_points == 130 and game.camp_banner_color == "green")
    game._earn("rescue")
    check("reload duplicate", game.adventure_points == 130)
    game._open_rewards()
    check("book pauses", game.paused and game.modal_kind == "rewards" and game.modal_body.text.contains("130 / 130"))
    game._set_language()
    check("RU book", game.modal_body.text.contains("Очки приключения") and game.banner_buttons[0].text.contains("Синий"))
    game.free()
    var replay = load("res://main.tscn").instantiate()
    root.add_child(replay)
    await process_frame
    check("scene reload resumes shepherd checkpoint", replay.campaign.stage == 1 and replay.bridge_stage == 2 and replay.completed)
    check("explicit new rescue prepares replay", replay._prepare_replay())
    replay.free()
    replay = load("res://main.tscn").instantiate()
    root.add_child(replay)
    await process_frame
    print("REPLAY ", replay.adventure_points, " ", replay.camp_banner_color, " ", replay.bridge_stage, " ", replay.completed)
    check("scene replay retains lifetime awards", replay.adventure_points == 130 and replay.camp_banner_color == "green" and replay.bridge_stage == 0 and not replay.completed)
    replay.free()
    if original.is_empty(): DirAccess.remove_absolute(ProjectSettings.globalize_path("user://block_save.json"))
    else:
        var file := FileAccess.open("user://block_save.json", FileAccess.WRITE)
        file.store_string(original)
        file.close()
    print("REWARD_CHECKS=", checks, " FAILED=", failed)
    quit(1 if failed else 0)
