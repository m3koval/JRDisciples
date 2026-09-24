extends SceneTree
## Native simulated viewport layout; no browser or iPad-device claim.
var failures := 0
var checks := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, label: String) -> void:
    checks += 1
    if not ok:
        failures += 1
        print("FAIL " + label)
func run() -> void:
    var game = load("res://scripts/main.gd").new()
    root.add_child(game)
    game.set_physics_process(false)
    game.player.set_physics_process(false)
    for size in [Vector2i(320,568), Vector2i(390,783), Vector2i(667,300), Vector2i(1280,720)]:
        root.size = size
        for language in ["en","ru"]:
            game.language = language
            for stage in range(1,7):
                game.campaign.stage = stage
                game.campaign.restore()
                game.campaign.held = stage == 3
                game.paused = stage == 6
                game.modal_kind = "flock_complete" if game.paused else ""
                game.player.position = game.campaign.HOME
                game._choose_context()
                game._refresh_ui()
                for i in range(8): await process_frame
                var tag: String = str(size) + "/" + language + "/" + str(stage)
                var bounds := Rect2(Vector2.ZERO, Vector2(size))
                if game.paused:
                    check(bounds.encloses(game.modal.get_global_rect()),tag+" modal bounds")
                    for button in [game.primary,game.secondary]:
                        check(game.modal.get_global_rect().encloses(button.get_global_rect()),tag+" fixed footer")
                    var scroll: ScrollContainer = game.modal_content.get_parent()
                    check(scroll.size.y >= 28,tag+" scroll area")
                else:
                    check(bounds.encloses(game.header.get_global_rect()),tag+" header bounds")
                    for button in [game.language_button,game.pause_button,game.map_button,game.rewards_button,game.jump_button,game.action_button]:
                        if button.visible:
                            check(not game.header.get_global_rect().intersects(button.get_global_rect()),tag+" header separate "+button.text)
                if DisplayServer.get_name() != "headless" and size == Vector2i(390,783) and stage in [3,6]:
                    await RenderingServer.frame_post_draw
                    var path: String = "/tmp/jd-flock-portrait-"+language+"-"+str(stage)+".png"
                    root.get_texture().get_image().save_png(path)
                    print("CAPTURE "+path)
    print("FLOCK_UI_CHECKS=",checks," FLOCK_UI_FAILURES=",failures)
    quit(failures)
