extends SceneTree
var game
func _initialize() -> void:
    call_deferred("run")
func frames(n: int) -> void:
    for i in range(n): await physics_frame
func run() -> void:
    game = load("res://main.tscn").instantiate()
    root.add_child(game)
    await frames(5)
    game._primary_action()
    await frames(20)
    game.player.queue_jump()
    await frames(10)
    game._toggle_pause()
    var p: Vector3 = game.player.position
    var vy: float = game.player.velocity.y
    await frames(90)
    if game.player.position.distance_to(p) > .001 or absf(game.player.velocity.y-vy) > .001:
        print("FAIL midair pause changes position/vertical velocity")
        quit(1)
        return
    game._primary_action()
    await frames(90)
    if game.player.position.y > .02:
        print("FAIL resume did not land")
        quit(1)
        return
    if not game.has_method("_apply_progress"):
        print("FAIL missing independently testable save validator")
        quit(1)
        return
    for invalid in [null, [], {}, "true", 1, 1.0, [true], {"nested":true}]:
        game._apply_progress({"rescued":invalid,"garden":true})
        if game.reward_saved or not game.garden_saved:
            print("FAIL malformed rescued blocks valid garden")
            quit(1)
            return
        game._apply_progress({"rescued":true,"garden":invalid})
        if not game.reward_saved or game.garden_saved:
            print("FAIL malformed garden accepted")
            quit(1)
            return
    game._apply_progress({"rescued":true,"garden":true})
    if not game.reward_saved or not game.garden_saved:
        quit(1)
        return
    game._apply_progress(null)
    if game.reward_saved or game.garden_saved:
        quit(1)
        return
    print("PASS midair pause/resume; malformed fields independently rejected; valid booleans; missing save reset")
    quit(0)
