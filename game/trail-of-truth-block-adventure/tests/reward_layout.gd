extends SceneTree
var failed := false
func _initialize() -> void:
    call_deferred("run")
func check(label: String, ok: bool) -> void:
    print(label, " ", ok)
    failed = failed or not ok
func run() -> void:
    var game = load("res://scripts/main.gd").new()
    root.add_child(game)
    await process_frame
    game._primary_action()
    game.rewards.award("rescue") # Explicit earned-state layout fixture, not playthrough evidence.
    game.reward_saved = true
    for viewport in [Vector2i(390, 783), Vector2i(844, 332)]:
        root.size = viewport
        await process_frame
        game._layout_ui()
        game._open_rewards()
        for i in 3:
            await process_frame
        var rect: Rect2 = game.modal.get_global_rect()
        for control in [game.primary, game.banner_choices, game.secondary]:
            if control.visible:
                check(str(viewport) + "_" + str(control.get_class()) + "_inside_modal", rect.encloses(control.get_global_rect()))
        check(str(viewport) + "_primary_touch_size", game.primary.size.y >= 44)
        game._primary_action()
    game.queue_free()
    await process_frame
    quit(1 if failed else 0)
