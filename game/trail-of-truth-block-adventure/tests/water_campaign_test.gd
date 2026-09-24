extends SceneTree
var game
var w
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, label: String) -> void:
    print(("PASS " if ok else "FAIL ")+label)
    if not ok: failures += 1
func act(at: Vector3) -> void:
    game.player.position = at + Vector3(0,.1,1)
    game._choose_context()
    game.action_button.pressed.emit() # Real host contextual-button binding.
func dismiss() -> void:
    if game.paused: game.primary.pressed.emit()
func run() -> void:
    game = load("res://scripts/main.gd").new()
    root.add_child(game)
    game.set_physics_process(false)
    game.player.set_physics_process(false)
    w = game.water_chapter
    await physics_frame
    game._apply_progress(null)
    check(not w.start(),"locked before cave victory")
    for data in [{"active":true,"steps":["feed_open"]},{"active":1,"steps":[]},{"active":true,"steps":"bad"},{"active":true,"steps":[1]}]:
        w.load_checkpoint(data,6)
        check(not w.active and w.stage == 0,"invalid/skipped checkpoint rejected")
    w.load_checkpoint({"active":true,"steps":["need"]},5)
    check(not w.active,"cannot bypass caves through save")
    game._apply_progress({"rescued":true,"campaign":{"stage":6},"caves":{"active":true,"steps":Array(game.caves.STEPS)}})
    check(w.stage == 0 and game.caves.stage == 6,"legacy v3 complete-caves migration")
    game.caves.restore()
    game.modal_kind = "cave_complete"
    game.paused = true
    game._refresh_ui()
    check(game.primary.text == "Next: water for the village","ordinary cave completion CTA")
    game.primary.pressed.emit()
    check(w.active and not game.caves.active and game.modal_kind == "water_intro","CTA routes to water not completed cave")
    game._toggle_pause()
    check(game.paused,"intro protected from pause key")
    dismiss()
    check(game.player.position.distance_to(w.START)<1,"chapter spawn overrides village bounds")
    game._physics_process(.01)
    check(game.player.position.x > 144,"host physics does not reset water to village")
    act(w.GATE)
    check(w.stage == 0 and w.wrong_time > 0,"wrong early gate gives feedback without skip")
    act(w.GARDENER)
    check(w.stage == 1 and game.paused and game.modal_kind == "water_talk","button talks to named gardener")
    game._toggle_pause()
    check(game.paused,"dialogue protected from modal clickthrough")
    dismiss()
    act(w.KEEPER)
    check(w.stage == 2 and game.modal_title.text.contains("Oren"),"distinct keeper reached through host")
    dismiss()
    var actions := [w.SLUICE,w.SLUICE,w.SPILL,w.FEED,w.GATE,w.KEEPER,w.GARDENER]
    for i in range(actions.size()):
        var before: int = w.stage
        if before == 4:
            act(w.FEED)
            check(w.stage == 4 and w.wrong_time > 0,"wrong gate order recoverable")
        act(actions[i])
        check(w.stage == before+1,"physical ordered task advances %d"%before)
        var saved: Variant = JSON.parse_string(FileAccess.get_file_as_string("user://block_save.json"))
        check(saved.version == 4 and saved.water.steps.size() == w.stage,"exact checkpoint native save readback")
        var checkpoint: Dictionary = saved.water
        w.load_checkpoint(checkpoint,6)
        w.sync()
        check(w.stage == before+1 and w.active,"checkpoint reload restores every stage")
        if w.stage == 6: check(w.water[0].visible and not w.water[5].visible,"spring fills upstream but garden stays dry")
        if w.stage == 7: check(w.water[5].visible and w.plants[0].scale.y == 1,"garden water and restored plants visible")
        dismiss()
    check(w.stage == 9 and w.produce.visible,"return to both people earns visible shared harvest")
    act(w.GARDENER)
    check(w.stage == 9,"repeat talk cannot duplicate completion")
    dismiss()
    game._toggle_pause()
    var clock: float = w.clock
    w.tick(10)
    game._interact()
    check(w.clock == clock and w.stage == 9,"pause freezes flow and interactions")
    game.language = "ru"
    game._refresh_ui()
    check(game.modal_title.text == "Вода для деревни" and w.labels[4].text.contains("Мира"),"Russian modal and world labels")
    game.saves_ok = false
    game._refresh_ui()
    check(game.modal_body.text.contains("Не сохранено"),"save failure visible")
    game.secondary.pressed.emit()
    check(not w.active and game.player.position.distance_to(game.SPAWN)<1,"pause return preserves clearing access")
    game._choose_context()
    check(game.context_kind == "water_start","water resume wins context over completed caves")
    # Existing NPCs and doors remain reachable after stage-six flock.
    game.player.position = game.villagers[2].node.global_position + Vector3(0,0,1)
    game._interact()
    check(game.modal_kind == "talk","late-game ordinary villager routing restored")
    dismiss()
    var house = game.world.cottages[1]
    game.player.position = game.VillageFinish.door_point(house) + Vector3(0,-1,1)
    game._interact()
    check(house.get_meta("door_open"),"late-game ordinary cottage door routing restored")
    # Read-before-ready reload uses real main scene lifecycle and persisted checkpoint.
    game.player.position = game.CAMP
    game._interact()
    dismiss()
    game._save_progress()
    var fresh = load("res://scripts/main.gd").new()
    root.add_child(fresh)
    fresh.set_physics_process(false)
    fresh.player.set_physics_process(false)
    check(fresh.water_chapter.active and fresh.water_chapter.stage == 9 and fresh.player.position.x > 144,"normal launch restores water before world construction safely")
    fresh.queue_free()
    await process_frame
    check(game._prepare_replay() and w.stage == 0 and not w.active and game.caves.stage == 0,"new rescue resets water while retaining earned rewards")
    print("WATER_FAILURES=",failures)
    quit(failures)
