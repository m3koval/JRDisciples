extends SceneTree
## Real combat entry points; native renders are posed visual evidence, not input QA.
var game
var c
var failures := 0
var checks := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, label: String) -> void:
    checks += 1
    print(("PASS " if ok else "FAIL ")+label)
    if not ok: failures += 1
func fixture(i: int) -> void:
    c.completed_steps.clear()
    for n in range(i*2+1): c.completed_steps.append(c.STEPS[n])
    c.restore()
    game.paused = false
    c.animal_index = i
    c.phase = "warn"
    c.timer = 1.0
    game.player.position = c.ENTRANCES[i]+Vector3(0,0,-6)
    c.animals[i].position = c.ENTRANCES[i]+Vector3(0,0,-7)
    c.lunge_from = c.animals[i].position
    c.lunge_to = game.player.position
    c.sync_health_bars()
func ready_next_hit(i: int) -> void:
    for n in range(180):
        c.tick(1.0/60)
        if c.phase == "idle": break
    game.player.position = c.animals[i].position+Vector3(0,0,1.5)
    c.tick(1.0/60)
func capture(label: String) -> void:
    if DisplayServer.get_name() == "headless": return
    game._refresh_ui()
    await process_frame
    await RenderingServer.frame_post_draw
    var out := OS.get_environment("JD_VICTORY_EVIDENCE")
    if out.is_empty(): out = "/tmp/jd-victory-evidence"
    DirAccess.make_dir_recursive_absolute(out)
    root.get_texture().get_image().save_png(out+"/"+label+".png")
func run() -> void:
    root.size = Vector2i(1280,720)
    game = load("res://scripts/main.gd").new()
    root.add_child(game)
    game.set_process(false)
    game.set_physics_process(false)
    game.player.set_physics_process(false)
    await physics_frame
    c = game.caves
    game.campaign.stage = 6
    c.start()
    game.modal_kind = ""
    var camera := Camera3D.new()
    game.add_child(camera)
    camera.current = true
    camera.fov = 48
    for i in range(2):
        fixture(i)
        camera.position = c.ENTRANCES[i]+Vector3(2.8,3.4,-2.8)
        camera.look_at(c.ENTRANCES[i]+Vector3(0,1,-7.8))
        check(c.animal_health(i) == 2 and c.animal_health_bars[i].visible,"full HP only on active attacker %d"%i)
        check(not c.animal_health_bars[1-i].visible,"other attacker bar hidden %d"%i)
        await capture("%d-full-hp"%i)
        c.defend()
        check(c.animal_health(i) == 1 and c.animals[i].visible and c.stage == i*2+1,"first hit lowers HP without granting victory %d"%i)
        check(c.animal_health_bars[i].texture == c.health_textures[1],"visible HP falls to one segment %d"%i)
        await capture("%d-first-hit"%i)
        await ready_next_hit(i)
        c.defend()
        check(c.stage == i*2+2 and c.animal_health(i) == 0,"final hit defeats and advances once %d"%i)
        check(not c.animals[i].visible and not c.animal_health_bars[i].visible and c.poof.visible,"animal replaced by poof, HP bar gone %d"%i)
        check(c.phase == "victory" and c.message == "victory" and c.context() == "","clear victory state %d"%i)
        var saved: Dictionary = JSON.parse_string(FileAccess.get_file_as_string("user://block_save.json"))
        check(saved.caves.steps.size() == c.stage,"victory checkpoint saved before effect finishes %d"%i)
        c.tick(.12)
        await capture("%d-poof"%i)
        var timer: float = c.timer
        var pose: Transform3D = c.poof.get_child(0).transform
        game.paused = true
        c.tick(5)
        c.defend()
        check(c.timer == timer and c.poof.get_child(0).transform == pose,"pause freezes poof and defeat %d"%i)
        game.paused = false
        game.player.position = c.CAMP
        for n in range(60):
            c.defend()
            c.tick(1.0/60)
        check(c.stage == i*2+2 and not c.poof.visible and c.phase == "idle","effect expires away from arena, no repeated awards %d"%i)
        c.restore()
        check(not c.animals[i].visible and not c.poof.visible,"restore preserves victory without stale effect %d"%i)
    # Losing an unfinished fight restores its HP; completed fights stay completed.
    fixture(1)
    c.defend()
    c.health = 1
    c.invulnerability = 0
    c.hurt()
    check(c.stage == 3 and c.health == 3 and c.animal_health(1) == 2,"zero player HP resets unfinished fight, not progression")
    check(not c.animals[0].visible and c.animals[1].visible and not c.poof.visible,"previous victory remains earned on loss")
    check(game.player.position.distance_to(c.CAMP) < .3,"loss returns to checkpoint camp")
    for language in ["en","ru"]:
        game.language = language
        var intro: String = c.intro_text()
        check("unharmed" not in intro and "невредим" not in intro and "never approach" not in intro and "попроси взрослого" not in intro,"no unsolicited no-harm/safety copy "+language)
        c.message = "victory"
        c.message_time = 4
        check(("protected the flock" if language == "en" else "защитил стадо") in c.notice_text(),"victory is protection "+language)
    c.completed_steps.clear()
    c.restore()
    check(c.animal_health(0) == 2 and c.animal_health(1) == 2 and not c.poof.visible,"new adventure resets both attackers")
    print("CAVE_VICTORY_CHECKS=",checks," CAVE_VICTORY_FAILURES=",failures)
    game.queue_free()
    await process_frame
    quit(failures)
