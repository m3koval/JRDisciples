extends SceneTree
## Deterministic fixtures exercising the real Godot swept collision solver.
var game
var failed := false

func _initialize() -> void:
    call_deferred("run")

func check(label: String, ok: bool) -> void:
    print(label, " ", ok)
    failed = failed or not ok

func run() -> void:
    var had_save := FileAccess.file_exists("user://block_save.json")
    var saved := FileAccess.get_file_as_string("user://block_save.json") if had_save else ""
    game = load("res://main.tscn").instantiate()
    root.add_child(game)
    await physics_frame
    await physics_frame
    game.set_physics_process(false)
    game.set_process(false)
    game.player.set_enabled(false)
    game.player.set_physics_process(false)
    game._apply_progress(null)
    game.paused = false
    game.following = true
    game.bridge_stage = 2
    game.world.set_bridge_stage(2)
    await physics_frame
    game.lamb.position = Vector3(-14, .03, 4.3)
    game.player.position = Vector3(-21, .15, 4.3)
    var clear := true
    var bounded := true
    for frame in range(300):
        var before: Vector3 = game.lamb.position
        game._follow_lamb(1.0 / 60)
        var p: Vector3 = game.lamb.position
        clear = clear and not (p.x < -15.08 and p.x > -20.52 and p.z > 1.58 and p.z < 7.02)
        bounded = bounded and p.distance_to(before) <= 4.1 / 60 + .002
    check("cottage_sweep_never_enters_solid", clear)
    check("cottage_stops_at_near_wall", game.lamb.position.x > -14.74 and game.lamb.position.x < -14.6)
    check("swept_steps_are_speed_bounded", bounded)
    check("blocked_escort_does_not_complete", not game.completed)
    # Oblique pursuit slides along the actual cottage, then clears its corner.
    game.player.position = Vector3(-18, .15, 8.5)
    for frame in range(300):
        game._follow_lamb(1.0 / 60)
    check("oblique_follow_slides_around_cottage", game.lamb.position.distance_to(game.player.position) < 1.5)
    # A long render/physics stall cannot become a teleport.
    game.lamb.position = Vector3(-11, .03, 0)
    game.player.position = Vector3(-11, .15, 3)
    var before: Vector3 = game.lamb.position
    game._follow_lamb(5.0)
    check("long_delta_is_bounded", game.lamb.position.distance_to(before) <= .206)
    game.player.position = Vector3(-11, .15, 15)
    before = game.lamb.position
    game._follow_lamb(1.0)
    check("distant_player_does_not_drag_lamb", game.lamb.position == before)
    # The player stops 2.9 units from camp; arrival must be physical, not a gate bypass.
    game.player.position = Vector3(-11, 0, 4.1)
    game.lamb.position = Vector3(-11, .03, 1.5)
    game._physics_process(1.0 / 60)
    check("camp_does_not_complete_before_lamb_arrives", not game.completed)
    for frame in range(240):
        game._physics_process(1.0 / 60)
    check("camp_edge_wait_completes", game.completed and game.lamb.position.distance_to(game.CAMP) < 3.1)
    check("camp_edge_player_was_not_moved", game.player.position == Vector3(-11, 0, 4.1))
    check("rescue_reward_earned", game.reward_saved and game.adventure_points >= 50)
    if had_save:
        var file := FileAccess.open("user://block_save.json", FileAccess.WRITE)
        file.store_string(saved)
        file.close()
    else:
        DirAccess.remove_absolute(ProjectSettings.globalize_path("user://block_save.json"))
    game.queue_free()
    await process_frame
    quit(1 if failed else 0)
