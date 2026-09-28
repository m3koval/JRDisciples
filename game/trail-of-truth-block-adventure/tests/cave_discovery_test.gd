extends SceneTree
var failures := 0
var checks := 0
var game
var c
func _initialize() -> void: call_deferred("run")
func check(ok: bool, label: String) -> void:
    checks += 1
    print(("PASS " if ok else "FAIL ")+label)
    if not ok: failures += 1
func run() -> void:
    game = load("res://scripts/main.gd").new()
    root.add_child(game)
    game.set_process(false)
    game.set_physics_process(false)
    game.player.set_physics_process(false)
    await physics_frame
    c = game.caves
    game.campaign.stage = 6
    c.start()
    game.paused = false
    var d = c.discovery
    check(c.warning_mark.material_override.albedo_color.a < .4,"warning leaves ground readable")
    check(d.evidence.size() == 3,"three independent physical evidence trails")
    check(d.evidence[0].get_child_count() == 40 and d.evidence[1].get_child_count() == 40 and d.evidence[2].get_child_count() == 24,"paw pads, toes and wool tufts are actual 3D meshes")
    check(c.STAFF_REACH == 2.8 and c.ANIMAL_MAX_HEALTH == 2 and c.health == 3,"reach and HP contracts unchanged")
    for language in ["en","ru"]:
        game.language = language
        check(c.intro_text().length() < 350,"concise localized intro "+language)
        game.player.position = c.ENTRANCES[2]
        d.tick(.016)
        check(("Wool" if language == "en" else "Шерсть") in d.cue.text,"proximity wool teaching "+language)
        game.player.position = c.ENTRANCES[0]
        d.tick(.016)
        check(("Paw prints" if language == "en" else "Следы") in d.cue.text,"proximity paw teaching "+language)
    game.language = "en"
    c.completed_steps.assign(["lion_clue","bear_clue"])
    for i in range(2):
        c.restore()
        game.player.position = c.ENTRANCES[i]+Vector3(0,0,-6)
        c.animals[i].position = c.ENTRANCES[i]+Vector3(0,0,-8)
        c.tick(.016)
        c.tick(.016)
        check(c.phase == "warn" and is_equal_approx(c.timer,c.WINDUP[i]),"species windup "+str(i))
        check(c.warning_mark.visible,"cue visible on first windup frame "+str(i))
        check(c.warning_mark.mesh is BoxMesh if i == 0 else c.warning_mark.mesh is CylinderMesh,"lane versus radial telegraph "+str(i))
        if i == 0:
            check(c.warning_mark.mesh.size.z >= c.lunge_from.distance_to(c.lunge_to)+2.7-.001,"charge cue includes both endpoint damage radii")
        var target: Vector3 = c.lunge_to
        game.player.position.x += .4
        c.tick(.1)
        check(c.lunge_to == target,"committed attack target does not track dodge "+str(i))
        c.timer = 0
        c.tick(.016)
        check(c.phase == "lunge" and is_equal_approx(c.timer,c.ATTACK_TIME[i]),"species attack duration "+str(i))
        game.player.position = c.animals[i].position+Vector3(0,0,.4)
        c.invulnerability = 0
        c.tick(.016)
        check(c.health == 2,"attack still damages player "+str(i))
        c.timer = 0
        c.tick(.016)
        check(c.phase == "recover" and is_equal_approx(c.timer,c.RECOVERY[i]),"species recovery window "+str(i))
        check(not c.warning_mark.visible,"attack cue ends on recovery "+str(i))
    c.completed_steps.clear()
    c.restore()
    game.player.position = c.ENTRANCES[2]
    c.interact()
    game.player.position = c.lamb.position+Vector3(0,0,1)
    c.tick(.016)
    check(c.completed_steps == ["lamb_found"] and not c.safe_to_escort(),"lamb first remains legal, escort still gated by protection")
    check(d.lamb_cue.visible and d.lamb_cue.text == "You found me!","early rescue recognition without premature escort")
    var saved: Dictionary = c.snapshot()
    check(saved.keys().size() == 4 and saved.version == 2,"unchanged version two save schema")
    c.completed_steps.assign(["lamb_found","bear_clue","bear_safe","lion_clue","lion_safe"])
    c.restore()
    game.player.position = c.lamb.position+Vector3(0,0,1)
    c.tick(.016)
    c.interact()
    check(c.phase == "following","call starts escort after both victories")
    var before: Vector3 = c.lamb.position
    game.player.position += Vector3(0,0,2)
    c.tick(.1)
    check(c.lamb.position != before and d.lamb_cue.text == "I'm with you!","moving lamb reacts and follows")
    var pose: Transform3D = c.lamb_model.transform
    game.paused = true
    c.tick(2)
    check(c.lamb_model.transform == pose,"pause freezes presentation")
    game.paused = false
    game.player.position = c.CAMP
    c.lamb.position = c.CAMP+Vector3(.8,0,0)
    c.interact()
    check(c.stage == 6 and game.modal_kind == "cave_complete" and d.lamb_cue.text == "Home together!","home action shows reunion alongside existing completion")
    check(is_zero_approx(c.lamb_model.position.y) and is_zero_approx(c.lamb_model.rotation.z),"paused reunion has grounded settled lamb")
    c.restore()
    game.paused = false
    c.tick(.016)
    check(d.lamb_cue.text == "Home together!" and c.lamb.position.distance_to(c.CAMP) < 2,"completed checkpoint restores reunion")
    print("CAVE_DISCOVERY_CHECKS=",checks," CAVE_DISCOVERY_FAILURES=",failures)
    game.queue_free()
    await process_frame
    quit(failures)
