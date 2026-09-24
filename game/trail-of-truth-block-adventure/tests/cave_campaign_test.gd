extends SceneTree
var game
var c
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, label: String) -> void:
    print(("PASS " if ok else "FAIL ")+label)
    if not ok: failures += 1
func run() -> void:
    game = load("res://scripts/main.gd").new()
    root.add_child(game)
    game.set_physics_process(false)
    game.player.set_physics_process(false)
    c = game.caves
    await physics_frame
    game._apply_progress(null)
    check(not c.start(),"locked before flock completion")
    for data in [{"active":true,"steps":["bear_safe"]},{"active":true,"steps":[1]},{"active":[],"steps":[]},{"active":true,"steps":"bad"}]:
        c.load_checkpoint(data,6)
        check(not c.active and c.stage == 0,"malformed or skipped checkpoint rejected")
    c.load_checkpoint({"active":true,"steps":["lion_clue"]},5)
    check(not c.active,"save cannot bypass flock")
    game.campaign.stage = 6
    game.reward_saved = true
    game.modal_kind = "flock_complete"
    game._refresh_ui()
    check(game.primary.text == "Continue to caves","explicit next chapter CTA")
    game._primary_action()
    check(c.active and game.modal_kind == "cave_intro" and game.paused,"CTA enters paused cave instructions")
    game._primary_action()
    check(game.player.position.x == 100,"offset camp transition")
    game.player.position = c.ENTRANCES[2]+Vector3(0,0,-10)
    c.tick(.01)
    check(c.stage == 0,"remote lamb cannot skip animals")
    for i in range(2):
        game.player.position = c.ENTRANCES[i]
        game._interact()
        check(c.stage == i*2+1,"clue unlocks corresponding animal")
        for turn in range(2):
            game.player.position = c.ENTRANCES[i]+Vector3(0,0,-4)
            for frame in range(240):
                c.tick(1.0/60)
                if c.phase == "warn": break
            check(c.phase == "warn","pursuit leads to readable warning before attack")
            var before: float = c.timer
            game.paused = true
            c.tick(10)
            check(c.timer == before,"pause freezes encounter timer")
            game.paused = false
            check(c.health == 3,"warning never damages player")
            game.player.position.x += 3
            c.tick(1.7)
            c.tick(.71)
            check(c.phase == "recover" and c.health == 3,"sideways dodge avoids damage")
            game.player.position = c.animals[i].position + Vector3(1.5,0,0)
            game._interact()
            check(c.phase == "retreat","in-reach staff defense drives away")
            for frame in range(180):
                c.tick(1.0/60)
                if c.phase == "idle": break
        check(c.stage == (i+1)*2 and not c.animals[i].visible,"animal retreats unharmed and checkpoint advances")
    game.player.position = c.ENTRANCES[2]+Vector3(0,0,-10)
    c.tick(.01)
    check(c.stage == 4,"last clue required before discovery")
    check(c.destination() == c.ENTRANCES[2],"marker points to required wool clue before lamb")
    game.player.position = c.ENTRANCES[2]
    game._interact()
    game.player.position = c.ENTRANCES[2]+Vector3(0,0,-10)
    c.tick(.01)
    check(c.stage == 5 and c.context() == "call_lamb","physical lamb discovery")
    game._interact()
    check(c.phase == "following","lamb call starts escort")
    c.hurt()
    c.hurt()
    check(c.health == 2,"invulnerability prevents repeated contact damage")
    c.invulnerability = 0
    game.paused = true
    c.hurt()
    check(c.health == 2,"paused damage is rejected")
    game.paused = false
    game.player.position = c.CAMP
    game._interact()
    check(c.health == 3,"safe camp heals")
    c.health = 1
    c.invulnerability = 0
    c.hurt()
    check(c.health == 3 and c.stage == 5 and game.player.position.distance_to(c.CAMP) < 1,"zero health retries at safe checkpoint")
    c.lamb.position = c.CAMP
    game._interact()
    check(c.stage == 6 and game.modal_kind == "cave_complete","home gate requires lamb at camp")
    var saved: Variant = JSON.parse_string(FileAccess.get_file_as_string("user://block_save.json"))
    check(saved.caves.steps.size() == 6,"main save readback includes cave checkpoint")
    c.load_checkpoint(saved.caves,6)
    check(c.active and c.stage == 6,"completed checkpoint reload")
    game.language = "ru"
    game._refresh_ui()
    check(game.modal_title.text == "Ягнёнок в безопасности!" and c.intro_text().contains("Выдуманная"),"Russian completion and instructions")
    game.saves_ok = false
    game._refresh_ui()
    check(game.modal_body.text.contains("Не сохранено"),"save failure remains visible on paused cave completion")
    check(game._prepare_replay() and c.stage == 0 and not c.active,"new rescue clears cave progress")
    print("CAVE_FAILURES=",failures)
    quit(failures)
