extends SceneTree
var game
var results := {}
var keys := {}
func _initialize() -> void:
    call_deferred("run")
func frames(n: int) -> void:
    for i in range(n): await physics_frame
func key(code: int, down: bool) -> void:
    if keys.get(code, false) == down: return
    keys[code] = down
    var event := InputEventKey.new()
    event.physical_keycode = code
    event.pressed = down
    Input.parse_input_event(event)
func check(name: String, value: bool) -> void:
    results[name] = value
    print(name, " ", value, " at=", game.player.position)
    if not value:
        quit(1)
func walk(target: Vector3) -> void:
    for i in range(1600):
        var d: Vector3 = target - game.player.position
        d.y = 0
        if d.length() < .35: break
        key(KEY_D, d.x > .20)
        key(KEY_A, d.x < -.20)
        key(KEY_S, d.z > .20)
        key(KEY_W, d.z < -.20)
        await frames(1)
    for k in [KEY_W,KEY_A,KEY_S,KEY_D]: key(k,false)
    await frames(12)
    check("walk_"+str(target), Vector2(target.x-game.player.position.x,target.z-game.player.position.z).length()<.8)
func interact() -> void:
    key(KEY_E,true)
    await frames(4)
    key(KEY_E,false)
    await frames(8)
func shot(name: String) -> void:
    if not "--capture" in OS.get_cmdline_user_args(): return
    RenderingServer.render_loop_enabled = true
    await process_frame
    await RenderingServer.frame_post_draw
    root.get_texture().get_image().save_png(ProjectSettings.globalize_path("res://../../docs/games/block-evidence/"+name+".png"))
    RenderingServer.render_loop_enabled = false
func run() -> void:
    root.size = Vector2i(1280,720)
    game = load("res://main.tscn").instantiate()
    root.add_child(game)
    await frames(4)
    await shot("intro")
    game._primary_action()
    await frames(10)
    await shot("start")
    await interact()
    check("invalid_action_no_reward", game.bridge_stage==0 and not game.completed)
    check("search_assignment", game.objective.text.contains("tracks") and not game.lamb_found)
    check("idle_joystick_visible", game.player._joystick.visible and not game.player._joystick.active)
    game._open_map()
    await frames(4)
    check("map_no_spoiler", game.modal_kind == "map" and game.paused and game.trail_map._lamb_position == Vector3.ZERO)
    var map_position: Vector3 = game.player.position
    key(KEY_W,true)
    await frames(30)
    key(KEY_W,false)
    check("map_blocks_walking", game.player.position.distance_to(map_position) < .01)
    game._primary_action()
    await frames(4)
    await walk(Vector3(-10,0,3))
    check("tracks_discovered", game.trail_found)
    await walk(Vector3(1.2,0,0))
    check("bridge_motivated", game.crossing_found and game.objective.text.contains("Repair"))
    await walk(Vector3(-7,0,-2))
    await interact()
    check("carrying_first",game.carrying==0)
    await walk(Vector3(1.2,0,0))
    await interact()
    check("first_board",game.bridge_stage==1 and game.carrying==-1)
    await walk(Vector3(-15,0,-5))
    await interact()
    check("carrying_second",game.carrying==1)
    await walk(Vector3(1.5,0,0))
    await interact()
    check("bridge_complete",game.bridge_stage==2)
    await shot("bridge")
    await walk(Vector3(9,0,0))
    check("no_lamb_spoiler_marker", not game.target_marker.visible and not game.lamb_found)
    await walk(Vector3(14,0,-6))
    check("old_lamb_spot_still_searching", not game.lamb_found and game.context_kind != "call")
    await walk(Vector3(14,0,-10.8))
    await walk(Vector3(18.5,0,-11))
    check("lamb_discovered", game.lamb_found)
    game._open_map()
    check("map_discovered_lamb", game.trail_map._lamb_discovered and game.trail_map._lamb_position == game.lamb.position)
    game._primary_action()
    await interact()
    check("lamb_called",game.following)
    await shot("lamb")
    await walk(Vector3(14,0,-11))
    await walk(Vector3(13,0,-6))
    await walk(Vector3(8,0,0))
    await frames(90)
    await walk(Vector3(1.8,0,0))
    await frames(90)
    await walk(Vector3(-6,0,5))
    await frames(90)
    await walk(Vector3(-10,0,7))
    await frames(180)
    check("rescued",game.completed and game.reward_saved)
    await shot("completed")
    game._set_language()
    await shot("completed-ru")
    check("localized",game.language=="ru" and game.objective.text.contains("Вместе"))
    var file := FileAccess.open("user://native-checks.json", FileAccess.WRITE)
    if file:
        file.store_string(JSON.stringify(results,"  "))
        file.close()
    else:
        check("native_results_writable", false)
    quit(1 if results.values().has(false) else 0)
