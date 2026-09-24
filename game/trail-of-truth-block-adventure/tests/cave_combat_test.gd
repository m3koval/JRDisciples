extends SceneTree
var game
var c
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, label: String) -> void:
    print(("PASS " if ok else "FAIL ")+label)
    if not ok: failures += 1
func fixture(i: int = 0) -> void:
    c.completed_steps.clear()
    for n in range(i*2+1): c.completed_steps.append(c.STEPS[n])
    c.restore()
    game.paused = false
    game.player.set_enabled(true)
    game.player.position = c.ENTRANCES[i]+Vector3(0,0,-6)
    c.animal_index = i
    c.phase = "warn"
    c.timer = .25
    c.animals[i].position = c.ENTRANCES[i]+Vector3(0,0,-7)
    c.lunge_from = c.animals[i].position
    c.lunge_to = game.player.position
func run() -> void:
    game = load("res://scripts/main.gd").new()
    root.add_child(game)
    game.set_physics_process(false)
    game.player.set_physics_process(false)
    await physics_frame
    c = game.caves
    game.campaign.stage = 6
    c.start()
    for i in range(2):
        fixture(i)
        c.tick(.1)
        check(c.health == 3,"warning is harmless %d"%i)
        c.tick(.2)
        c.tick(.1)
        check(c.health == 2,"grounded attack hits %d"%i)
        fixture(i)
        game.player.position.y = 1.1
        c.tick(.3)
        c.tick(.1)
        check(c.health == 3,"airborne feet clear attack %d"%i)
    fixture()
    c.defend()
    check(c.drive_count == 1 and c.phase == "retreat","staff interrupts warning, nonlethal knockback")
    check(c.animals[0].position.z < -7,"staff knockback moves animal away")
    c.phase = "recover"
    for n in range(30): c.defend()
    check(c.drive_count == 1 and c.message == "cooldown","spam cannot bypass cooldown")
    fixture()
    c.animals[0].position.z = -11
    c.defend()
    check(c.drive_count == 0 and c.message == "miss" and c.staff_cooldown > 0,"out of reach misses and consumes cooldown")
    fixture()
    var before: Vector3 = c.animals[0].position
    game.paused = true
    c.defend()
    c.tick(5)
    check(c.health == 3 and c.drive_count == 0 and c.timer == .25 and c.animals[0].position == before,"pause freezes attack, staff, movement")
    # Native Space and D events exercise the actual player jump/run physics.
    for i in range(2):
        for jumping in [false,true]:
            fixture(i)
            game.player.set_physics_process(true)
            for n in range(12): await physics_frame
            var start: Vector3 = game.player.position
            var event := InputEventKey.new()
            event.physical_keycode = KEY_SPACE
            event.keycode = KEY_SPACE
            event.pressed = jumping
            Input.parse_input_event(event)
            var move := InputEventKey.new()
            move.physical_keycode = KEY_D
            move.keycode = KEY_D
            move.pressed = jumping
            Input.parse_input_event(move)
            var high := 0.0
            for n in range(48):
                await physics_frame
                c.tick(1.0/60)
                high = maxf(high,game.player.position.y)
            event.pressed = false
            move.pressed = false
            Input.parse_input_event(event)
            Input.parse_input_event(move)
            if jumping:
                check(high > .85 and game.player.position.x > start.x+.5 and c.health == 3,"native run + Space dodges attack %d"%i)
            else:
                check(c.health == 2,"native grounded control takes hit %d"%i)
            game.player.set_physics_process(false)
    fixture()
    c.solid(Vector3(88,1,-6.5),Vector3(7,2,.2),Color.GRAY)
    await physics_frame
    c.defend()
    check(c.drive_count == 0 and c.message == "miss","wall blocks staff")
    c.phase = "lunge"
    c.timer = .4
    c.tick(.1)
    check(c.health == 3,"wall blocks attack damage")
    c.phase = "chase"
    for n in range(60): c.tick(1.0/60)
    check(c.animals[0].position.z < -6.5,"pursuit cannot cross wall")
    c.move_animal(0,Vector3(95,0,-7),20)
    check(c.animals[0].position.x <= 91.5,"arena clamps movement")
    game.player.position = c.CAMP
    c.tick(1)
    check(c.phase == "idle" and c.context() != "drive" and c.health == 3,"camp leash cancels attacks")
    c.staff_cooldown = .5
    c.restore()
    check(c.staff_cooldown == 0 and c.staff_swing == 0 and not c.staff.visible,"checkpoint resets transient defense")
    print("CAVE_COMBAT_FAILURES=",failures)
    quit(failures)
