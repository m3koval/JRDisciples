extends SceneTree
## Native input events and real player/colliders, not browser/device evidence.
var game
var c
var failures := 0
var held: Array[int] = []
func _initialize() -> void: call_deferred("run")
func check(ok: bool, label: String) -> void:
    print(("PASS " if ok else "FAIL ")+label)
    if not ok: failures += 1
func keys(wanted: Array[int]) -> void:
    for key in [KEY_W,KEY_A,KEY_S,KEY_D]:
        if held.has(key) == wanted.has(key): continue
        var event := InputEventKey.new()
        event.physical_keycode = key
        event.keycode = key
        event.pressed = wanted.has(key)
        Input.parse_input_event(event)
    held = wanted
func walk(target: Vector3, tolerance: float = .35) -> bool:
    for frame in range(1400):
        var d: Vector3 = target-game.player.position
        d.y = 0
        if d.length() < tolerance:
            keys([])
            for n in range(3): await physics_frame
            return true
        var wanted: Array[int] = []
        if absf(d.x) > tolerance*.6: wanted.append(KEY_D if d.x > 0 else KEY_A)
        if absf(d.z) > tolerance*.6: wanted.append(KEY_S if d.z > 0 else KEY_W)
        keys(wanted)
        await physics_frame
    keys([])
    print("WALK BLOCKED ",game.player.position," target ",target)
    return false
func action() -> void:
    var event := InputEventAction.new()
    event.action = "interact"
    event.pressed = true
    Input.parse_input_event(event)
    await physics_frame
    await physics_frame
    event = InputEventAction.new()
    event.action = "interact"
    event.pressed = false
    Input.parse_input_event(event)
    await physics_frame
func wait_phase(value: String) -> bool:
    for n in range(500):
        if c.phase == value: return true
        await physics_frame
    return false
func capture(label: String) -> void:
    if DisplayServer.get_name() == "headless": return
    RenderingServer.render_loop_enabled = true
    await process_frame
    await RenderingServer.frame_post_draw
    var path := "/tmp/jd-cave-play-" + label + ".png"
    root.get_texture().get_image().save_png(path)
    print("CAPTURE ", path)
    RenderingServer.render_loop_enabled = false
func run() -> void:
    if DisplayServer.get_name() != "headless": RenderingServer.render_loop_enabled = false
    root.size = Vector2i(1280,720)
    game = load("res://scripts/main.gd").new()
    root.add_child(game)
    await physics_frame
    c = game.caves
    game._apply_progress(null)
    game.campaign.stage = 6 # Fixture prerequisite only; all cave progress uses input.
    game.reward_saved = true
    game.completed = true
    game.modal_kind = "flock_complete"
    game._primary_action()
    game._primary_action()
    game.player._yaw = 0
    for i in range(2):
        check(await walk(Vector3(c.ENTRANCES[i].x,0,5)),"walk courtyard to cave %d"%i)
        check(await walk(c.ENTRANCES[i]),"walk through real entrance %d"%i)
        await action()
        check(c.stage == i*2+1,"input reads clue %d"%i)
        for turn in range(2):
            check(await walk(c.ENTRANCES[i]+Vector3(0,0,-5)),"enter wide encounter chamber")
            check(await wait_phase("warn"),"input encounter warning")
            check(await walk(c.ENTRANCES[i]+Vector3(3,0,-5)),"dodge clear of the rock doorway")
            check(await wait_phase("recover"),"input dodge reaches recovery")
            await action()
            check(c.phase == "retreat","input action drives animal away")
            check(await wait_phase("idle"),"retreat finishes")
        check(c.stage == (i+1)*2,"input encounter complete")
        await capture("animal-"+str(i)+"-safe")
        await walk(c.ENTRANCES[i]+Vector3(0,0,-5))
        await walk(c.ENTRANCES[i]+Vector3(0,0,5))
    check(await walk(Vector3(112,0,5)),"walk to lamb cave")
    await walk(c.ENTRANCES[2])
    await action()
    check(await walk(Vector3(112,0,-8)),"enter third cave")
    check(c.stage == 5,"input discovers lamb")
    await capture("lamb-found")
    await action()
    check(c.phase == "following","input calls lamb")
    # Keep pace with companion instead of leaving it behind.
    for z in range(-6,5,2): await walk(Vector3(112,0,z))
    for x in range(110,99,-2): await walk(Vector3(x,0,4))
    for z in range(6,11,2): await walk(Vector3(100,0,z))
    for n in range(240): await physics_frame
    await action()
    check(c.stage == 6,"real collider input escort finishes at camp")
    await capture("complete")
    if DisplayServer.get_name() != "headless":
        RenderingServer.render_loop_enabled = true
        game._primary_action()
        game.player.position = Vector3(100,.2,9) # Posed final overview, not traversal evidence.
        game.player._yaw = 0
        for n in range(12): await process_frame
        await RenderingServer.frame_post_draw
        root.get_texture().get_image().save_png("/tmp/jd-cave-native.png")
    print("CAVE_INPUT_FAILURES=",failures)
    quit(failures)
