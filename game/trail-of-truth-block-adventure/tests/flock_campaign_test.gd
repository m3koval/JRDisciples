extends SceneTree
var game
var failures := 0
var saved_before := ""
var had_save := false
func check(value: bool, label: String) -> void:
    print(("PASS " if value else "FAIL ")+label)
    if not value: failures += 1
func _initialize() -> void:
    call_deferred("run")
func run() -> void:
    had_save = FileAccess.file_exists("user://block_save.json")
    if had_save: saved_before = FileAccess.get_file_as_string("user://block_save.json")
    game = load("res://scripts/main.gd").new()
    root.add_child(game)
    await physics_frame
    game.campaign.stage = 0
    game.completed = false
    game._complete()
    check(game.campaign.stage == 1, "ordinary rescue completion starts gather")
    var c = game.campaign
    c.interact()
    check(c.stage == 1, "paused interaction rejected")
    game._primary_action()
    game.player.position = Vector3(-11,0,5)
    c.interact()
    check(c.stage == 2, "nearby visible sheep calls advance gather")
    game.player.position = Vector3(-20,0,0)
    c.tick(.016)
    check(not c.called[2], "straggler waits without teleport")
    check(c.stage == 2, "remote pasture cannot complete")
    for i in range(3): c.sheep[i].position = c.PASTURE + Vector3((i-1)*.5,0,0)
    game.player.position = c.PASTURE
    c.tick(.016)
    check(c.stage == 3, "pasture requires all three physically present")
    for i in range(2):
        game.player.position = c.supplies[i].position
        c.interact()
        check(c.held, "collect board %d" % i)
        game.player.position = c.patches[i].position
        c.interact()
    check(c.stage == 4, "two separate world repairs unlock shelter")
    game.player.position = c.ENTRY
    c.interact()
    check(c.stage == 4, "unsafe gate closure rejected")
    for i in range(3): c.sheep[i].position = c.FOLD + Vector3((i-1)*.5,0,0)
    game.player.position = c.FOLD
    c.interact()
    check(c.stage == 4 and c.shelter_time > 0, "gate remains closed during shelter beat")
    c.tick(2.1)
    check(c.stage == 5, "safe gathering and gate interaction unlock return")
    for i in range(3): c.sheep[i].position = c.HOME + Vector3((i-1)*.5,0,0)
    game.player.position = c.HOME
    for i in range(3): c.interact()
    check(c.stage == 6, "three individual counts finish chapter")
    c.interact()
    check(c.stage == 6, "completion idempotent")
    game._save_progress()
    var saved = JSON.parse_string(FileAccess.get_file_as_string("user://block_save.json"))
    check(saved.campaign.stage == 6, "checkpoint readback")
    c.load_checkpoint({}, true)
    check(c.stage == 1, "old rescue save migrates to gather")
    c.load_checkpoint({"stage":[]},false)
    check(c.stage == 0, "malformed stage rejected")
    c.stage = 4
    c.restore()
    game.player.position = Vector3(-5,0,10)
    game._choose_context()
    game._refresh_ui()
    if DisplayServer.get_name() != "headless":
        for i in range(12): await process_frame
        await RenderingServer.frame_post_draw
        root.get_texture().get_image().save_png("/tmp/jd-flock-native.png")
        print("CAPTURE /tmp/jd-flock-native.png")
    print("FLOCK_FAILURES=",failures," (fixture gates, not input-driven traversal)")
    if had_save:
        var file := FileAccess.open("user://block_save.json", FileAccess.WRITE)
        file.store_string(saved_before)
        file.close()
    else:
        DirAccess.remove_absolute(ProjectSettings.globalize_path("user://block_save.json"))
    quit(failures)
