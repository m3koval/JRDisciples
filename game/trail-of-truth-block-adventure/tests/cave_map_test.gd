extends SceneTree
## Normal host map routing, state projection and spoiler protection.
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, label: String) -> void:
    print(("PASS " if ok else "FAIL ")+label)
    if not ok: failures += 1
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
    var c = game.caves
    check(game.map_button.is_visible_in_tree(),"cave map button is discoverable")
    game.map_button.pressed.emit()
    check(game.paused and game.modal_kind == "map", "map pauses the real host")
    check(not c.discovery.cue.visible,"paused map hides floating teaching text")
    check(game.modal_title.text == "Follow the clues","map title describes current chapter")
    var map = game.trail_map
    if not map.has_method("set_cave_state"):
        check(false,"cave-specific map API exists")
        print("CAVE_MAP_FAILURES=",failures)
        quit(failures)
        return
    check(map._cave_mode,"normal cave Map opens cave geography, not clearing")
    check(not map._lamb_discovered and map._lamb_position == Vector3.ZERO,"hidden lamb position discarded")
    for shape in [Vector2(320,330),Vector2(660,390)]:
        map.size = shape
        for p in [c.CAMP,c.ENTRANCES[0],c.ENTRANCES[1],c.ENTRANCES[2],Vector3(88,0,-12)]:
            check(map.map_rect().has_point(map.world_to_map(p)),"cave landmarks inside map %s %s"%[shape,p])
        var a: Vector2 = map.world_to_map(c.ENTRANCES[0])
        var b: Vector2 = map.world_to_map(c.ENTRANCES[1])
        check(a.x < b.x,"distinct cave positions do not clamp to same edge")
    var before: Dictionary = c.snapshot().duplicate(true)
    game._primary_action()
    check(not game.paused,"closing cave map resumes")
    check(c.snapshot() == before,"map does not mutate progress")
    c.completed_steps.assign(["lamb_found"])
    game._open_map()
    check(map._lamb_discovered and map._lamb_position == c.lamb.position,"only discovered lamb is shown")
    check(not map._rescued,"discovery is not reunion")
    game._primary_action()
    map.set_state(Vector3(-11,0,7),0,false,Vector3(999,0,999),false)
    check(not map._cave_mode and map._lamb_position == Vector3.ZERO,"clearing resets cave state and hides secret")
    for lang in ["en","ru"]:
        map.set_language(lang)
        check(not map._t("Camp","Лагерь").is_empty(),"localized map label "+lang)
    print("CAVE_MAP_FAILURES=",failures)
    quit(failures)
