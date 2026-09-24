extends SceneTree
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, label: String) -> void:
    print(("PASS " if ok else "FAIL ")+label)
    if not ok: failures += 1
func run() -> void:
    var game = load("res://scripts/main.gd").new()
    root.add_child(game)
    game.set_physics_process(false)
    game.player.set_physics_process(false)
    var c = game.caves
    game.campaign.stage = 6
    c.active = true
    c.restore()
    game.paused = false
    for index in range(2):
        var actor: Node3D = c.animals[index]
        var motion = c.animal_motion[index]
        var origin := actor.transform
        for n in range(60): motion.step(1.0/60,"idle",0,Vector3.BACK)
        check(not motion.body.scale.is_equal_approx(Vector3.ONE),"idle breathing "+str(index))
        for n in range(96): motion.step(1.0/60,"warn",1.6-float(n+1)/60,Vector3(1,0,1))
        check(motion.body.scale.y < .97 and motion.body.position.z < -.07,"anticipation gathers weight "+str(index))
        check(motion.basis.z.normalized().dot(Vector3(1,0,1).normalized()) > .99,"faces diagonal target "+str(index))
        var max_lift := 0.0
        for n in range(42):
            motion.step(1.0/60,"lunge",.7-float(n+1)/60,Vector3(1,0,1))
            max_lift = maxf(max_lift,motion.body.position.y)
            check(motion.body.position.is_finite() and motion.body.scale.y > .9,"finite bounded pose")
        check(max_lift > (.16 if index == 0 else .07),"species-specific lunge lift "+str(index))
        for n in range(120): motion.step(1.0/60,"recover",3.5-float(n+1)/60,Vector3.BACK)
        check(absf(motion.body.rotation.x) < .005,"landing settles "+str(index))
        check(actor.transform.is_equal_approx(origin),"presentation never moves gameplay actor "+str(index))
        motion.reset_pose()
        check(motion.transform == Transform3D.IDENTITY and motion.body.transform == Transform3D.IDENTITY,"reset clears facing and residual pose "+str(index))
    # Exercise campaign-driven transitions, not only animator sampling.
    c.completed_steps.assign([c.STEPS[0]])
    c.restore()
    game.player.position = c.ENTRANCES[0]+Vector3(0,0,-5)
    c.tick(1.0/60)
    game.player.position.x += 3
    for n in range(30): c.tick(1.0/60)
    var m = c.animal_motion[0]
    var frozen: Transform3D = m.body.transform
    var frozen_clock: float = m.clock
    var frozen_timer: float = c.timer
    game.paused = true
    for n in range(60): c.tick(1.0/60)
    check(m.body.transform == frozen and m.clock == frozen_clock and c.timer == frozen_timer,"pause freezes animation and encounter")
    game.paused = false
    for n in range(180):
        c.tick(1.0/60)
        if c.phase == "recover": break
    await physics_frame
    check(c.can_drive(),"animation preserves contextual drive window")
    c.drive_count = 1
    c.interact()
    check(c.phase == "retreat","context starts retreat")
    for n in range(180):
        c.tick(1.0/60)
        if not c.animals[0].visible: break
    check(c.animals[0].position.distance_to(c.ENTRANCES[0]+Vector3(0,0,-12)) < .001,"retreat reaches exit before hiding")
    check(c.stage == 2 and not c.animals[0].visible,"retreat completes exactly one stage")
    c.restore()
    check(c.animal_motion[0].body.transform == Transform3D.IDENTITY,"checkpoint clears stale animation")
    print("ANIMAL_MOTION_FAILURES=",failures)
    quit(failures)
