extends SceneTree
## Native viewport fixtures, not browser or iPad-device QA.
class DensityGame extends "res://scripts/main.gd":
    var density := 1.0
    func _ui_pixel_ratio() -> float: return density
var failures := 0
var checks := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, label: String) -> void:
    checks += 1
    if not ok:
        failures += 1
        print("FAIL " + label)
func run() -> void:
    RenderingServer.render_loop_enabled = false
    var game := DensityGame.new()
    root.add_child(game)
    game.set_physics_process(false)
    game.player.set_physics_process(false)
    game.campaign.stage = 6
    game.campaign.restore()
    game.caves.active = true
    game.caves.restore()
    for size in [Vector2i(390,783), Vector2i(667,300), Vector2i(1280,720)]:
        for density in [1.0,2.0]:
            game.density = density
            root.size = Vector2i(Vector2(size)*density)
            game._layout_ui()
            for language in ["en","ru"]:
                game.language = language
                for state in ["cave_intro","warn","recover","pause","cave_complete"]:
                    game.paused = state in ["cave_intro","pause","cave_complete"]
                    game.modal_kind = state if game.paused else ""
                    game.caves.phase = state if not game.paused else "idle"
                    game.caves.health = 2
                    game.caves.message_time = 3
                    game.caves.message = "ouch"
                    game._choose_context()
                    game._refresh_ui()
                    for i in range(6): await process_frame
                    var tag: String = str(size)+"@"+str(density)+"/"+language+"/"+state
                    var bounds := Rect2(Vector2.ZERO,Vector2(root.size))
                    if game.paused:
                        check(bounds.encloses(game.modal.get_global_rect()),tag+" modal bounds")
                        check(game.modal.get_global_rect().encloses(game.primary.get_global_rect()),tag+" fixed primary")
                        var scroll: ScrollContainer = game.modal_content.get_parent()
                        check(scroll.size.y >= 28,tag+" readable scroll area")
                        scroll.scroll_vertical = 10000
                        for i in range(3): await process_frame
                        check(game.modal.get_global_rect().encloses(game.primary.get_global_rect()),tag+" primary after scroll")
                        scroll.scroll_vertical = 0
                    else:
                        check(bounds.encloses(game.header.get_global_rect()),tag+" header bounds")
                        for button in [game.pause_button,game.language_button,game.rewards_button,game.jump_button,game.action_button]:
                            if button.is_visible_in_tree():
                                check(bounds.encloses(button.get_global_rect()),tag+" button bounds "+button.text)
                                check(not game.header.get_global_rect().intersects(button.get_global_rect()),tag+" header separation "+button.text)
                    if DisplayServer.get_name() != "headless" and density == 1.0 and size == Vector2i(390,783) and state in ["cave_intro","warn"]:
                        RenderingServer.render_loop_enabled = true
                        for i in range(3): await process_frame
                        await RenderingServer.frame_post_draw
                        var path: String = "/tmp/jd-cave-ui-"+language+"-"+state+".png"
                        root.get_texture().get_image().save_png(path)
                        print("CAPTURE "+path)
                        RenderingServer.render_loop_enabled = false
    game.queue_free()
    await process_frame
    print("CAVE_UI_CHECKS=",checks," CAVE_UI_FAILURES=",failures)
    quit(failures)
