extends SceneTree
## Native physics fixtures: discovery requires sight, not clue visits; escort clears rock.
var game
var failed := false
var saved := ""
var had_save := false

func _initialize() -> void:
    call_deferred("run")

func check(label: String, ok: bool) -> void:
    print(label, " ", ok)
    failed = failed or not ok

func run() -> void:
    had_save = FileAccess.file_exists("user://block_save.json")
    if had_save:
        saved = FileAccess.get_file_as_string("user://block_save.json")
    game = load("res://main.tscn").instantiate()
    root.add_child(game)
    await physics_frame
    await physics_frame
    game._apply_progress(null)
    game.set_physics_process(false)
    game.set_process(false)
    game.player.set_enabled(false)
    game.player.set_physics_process(false)
    game.paused = false
    game.bridge_stage = 2
    game.world.set_bridge_stage(2)
    game.player.position = Vector3(19.25, .15, -8.6)
    await physics_frame
    check("hidden_fixture_inside_discovery_radius", game.player.position.distance_to(game.lamb.position) < 2.6)
    check("rock_blocks_physical_sight", not game._can_reach_lamb())
    game._physics_process(1.0 / 60)
    game._interact()
    check("hidden_lamb_cannot_discover_or_call", not game.lamb_found and not game.following and game.adventure_points == 0)
    game.player.position = Vector3(14, .15, -6)
    game._physics_process(1.0 / 60)
    check("old_spot_does_not_discover", not game.lamb_found)
    game._open_map()
    check("map_search_only", game.trail_map._lamb_position == Vector3.ZERO and game.trail_map.SEARCH_AREA.has_point(Vector2(18.5, -11)))
    game.paused = false
    game.player.position = Vector3(17, .15, -11)
    game._physics_process(1.0 / 60)
    check("open_sight_discovers_without_clue_gate", game.lamb_found and not game.trail_found and game.adventure_points == 20)
    for i in range(10):
        game._physics_process(1.0 / 60)
    check("discovery_awards_once", game.adventure_points == 20)
    check("bell_is_local", game.bell.max_distance == 14)
    check("narrow_bridge_preview", game.preview.mesh.size == Vector3(2.25, .15, 1.9))
    for direct in [false, true]:
        game.lamb.position = game.LAMB_ALCOVE
        game.following = false
        game.player.position = Vector3(17, .15, -11)
        game._interact()
        check("call_starts_escort_" + str(direct), game.following)
        var route: Array[Vector3] = [Vector3(14, .15, -11), Vector3(13, .15, -6), Vector3(8, .15, 0)]
        if direct:
            route = [Vector3(18.5, .15, -6), Vector3(14, .15, -4), Vector3(8, .15, 0)]
        var clear := true
        for target in route:
            game.player.position = target
            for frame in range(240):
                game._follow_lamb(1.0 / 60)
                # Conservative footprint includes the rounded visual and lamb body margin.
                var p: Vector3 = game.lamb.position
                if p.x > 15.7 and p.x < 19.5 and p.z > -10.65 and p.z < -7.35:
                    clear = false
        check("escort_clears_rock_" + str(direct), clear)
        check("escort_reaches_bridge_bank_" + str(direct), game.lamb.position.distance_to(Vector3(8, .03, 0)) < 1.5)
    if had_save:
        var file := FileAccess.open("user://block_save.json", FileAccess.WRITE)
        file.store_string(saved)
        file.close()
    else:
        DirAccess.remove_absolute(ProjectSettings.globalize_path("user://block_save.json"))
    quit(1 if failed else 0)
