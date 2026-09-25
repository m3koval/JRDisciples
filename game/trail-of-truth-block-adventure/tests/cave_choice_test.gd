extends SceneTree
var game
var c
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, label: String) -> void:
    print(("PASS " if ok else "FAIL ")+label)
    if not ok: failures += 1
func read_clue(i: int) -> void:
    game.player.position = c.ENTRANCES[i]
    c.interact()
func roundtrip() -> void:
    var before: Dictionary = c.snapshot()
    c.load_checkpoint(JSON.parse_string(JSON.stringify(before)),6)
    check(c.snapshot() == before,"JSON checkpoint roundtrip")
    c.restore()
func fight(i: int) -> void:
    read_clue(i)
    game.player.position = c.ENTRANCES[i]+Vector3(0,0,-6)
    c.tick(.01)
    check(c.animal_index == i,"chosen encounter starts")
    for hit in range(2):
        c.phase = "recover"
        c.staff_cooldown = 0
        game.player.position = c.animals[i].position+Vector3(0,0,1.5)
        c.defend()
    check(c.completed_steps.has(c.STEPS[i*2+1]),"two valid strikes win chosen encounter")
    c.tick(1)
func run() -> void:
    game = load("res://scripts/main.gd").new()
    root.add_child(game)
    game.set_physics_process(false)
    game.player.set_physics_process(false)
    await physics_frame
    c = game.caves
    game.campaign.stage = 6
    game.paused = false
    for route in [[2,1,0],[2,0,1],[1,0,2],[1,2,0],[0,2,1],[0,1,2]]:
        c.load_checkpoint(null,6)
        c.start()
        for i in route:
            if i == 2:
                read_clue(2)
                roundtrip()
                check(c.wool_read,"wool clue persists before discovery")
                game.player.position = c.ENTRANCES[2]+Vector3(0,0,-10)
                c.tick(.01)
                check(c.completed_steps.has("lamb_found"),"early or late physical discovery")
                if not c.safe_to_escort():
                    check(c.context() != "call_lamb","no unsafe escort bypass")
                    c.sync_darkness(1.0)
                    check(c.lamb_model.visible,"early lamb visible inside its chamber")
                    game.player.position = c.CAMP
                    c.sync_darkness(1.0)
                    check(not c.lamb_model.visible,"early lamb concealed outside chamber")
                    roundtrip()
                    check(not c.lamb_model.visible,"early lamb stays concealed after reload at camp")
                    for lang in ["en","ru"]:
                        game.language = lang
                        check(c.objective().contains("Lamb found") if lang == "en" else c.objective().contains("Ягнёнок найден"),"localized return-after-combat guidance")
                    game.language = "en"
            else: fight(i)
            roundtrip()
        check(c.stage == 5 and c.safe_to_escort(),"all choices converge on escort")
        game.player.position = c.lamb.position
        c.tick(.01)
        c.interact()
        check(c.phase == "following","discovered lamb callable after either combat order")
        game.player.position = c.CAMP
        check(c.context() != "home","home requires physical companion")
        c.lamb.position = c.CAMP
        c.interact()
        check(c.stage == 6,"one home completion")
        c.interact()
        check(c.stage == 6,"no duplicate completion")
        game.paused = false
        c.earn("home")
        check(c.stage == 6,"earned completion is idempotent even while unpaused")
        roundtrip()
        game.paused = false
    c.load_checkpoint(null,6)
    c.start()
    game.paused = false
    read_clue(0)
    read_clue(1)
    game.player.position = c.ENTRANCES[0]+Vector3(0,0,-6)
    c.tick(.01)
    c.phase = "recover"
    game.player.position = c.animals[0].position+Vector3(0,0,1.5)
    c.defend()
    check(c.drive_count == 1,"unfinished lion hit recorded")
    game.player.position = c.ENTRANCES[0]
    c.tick(.01)
    game.player.position = c.ENTRANCES[1]+Vector3(0,0,-6)
    c.tick(.01)
    check(c.animal_index == 1 and c.animal_health(1) == 2,"switching caves cannot transfer staff damage")
    roundtrip()
    check(c.stage == 2 and c.animal_health(0) == 2 and c.animal_health(1) == 2,"multiple clues persist while unfinished fights reset")
    c.animals[0].position = c.ENTRANCES[0]+Vector3(2,0,-4)
    game.player.position = c.CAMP
    for tick in range(240): c.tick(1.0/60.0)
    check(c.animals[0].position.distance_to(c.ENTRANCES[0]+Vector3(0,0,-8)) < .01,"unfinished animal returns all the way home after departure")
    check(c.phase == "idle" and c.animal_index == -1 and c.animal_health(0) == 2,"returned animal is healthy and cannot attack from courtyard")
    for n in range(7):
        var steps := []
        for i in range(n): steps.append(c.STEPS[i])
        c.load_checkpoint({"active":true,"steps":steps},6)
        check(c.stage == n,"legacy prefix migration %d"%n)
        roundtrip()
    for steps in [["bear_safe"],["lion_clue","lion_clue"],["lamb_found","home"],["home"]]:
        c.load_checkpoint({"version":2,"active":true,"steps":steps,"wool_read":true},6)
        check(not c.active and c.stage == 0,"invalid nonlinear dependency rejected")
    for version in [[], {}, "2", true, 2.5, null]:
        c.load_checkpoint({"version":version,"active":true,"steps":[],"wool_read":false},6)
        check(not c.active and c.stage == 0,"malformed checkpoint version rejected")
    for invalid_wool in [[], {}, "true", 1, null]:
        for version in [1,2]:
            c.load_checkpoint({"version":version,"active":true,"steps":[],"wool_read":invalid_wool},6)
            check(not c.active and c.stage == 0,"malformed clue state rejected before typed assignment")
    for i in range(3):
        var post = c.get_node("CaveCluePost%d"%i)
        check(is_equal_approx(post.position.z,1.9) and post.position.x+.7 <= c.ENTRANCES[i].x-1.1,"board outside entrance camera corridor")
        check(c.signs[i].font_size == 24 and is_equal_approx(c.signs[i].pixel_size, .008) and not c.signs[i].double_sided,"readable front-facing clue retained")
    print("CAVE_CHOICE_FAILURES=",failures)
    quit(failures)
