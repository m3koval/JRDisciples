extends SceneTree
# Native layout fixtures, including simulated DPR backing pixels; not browser QA.
class DensityGame extends "res://scripts/main.gd":
    var density := 1.0
    func _ui_pixel_ratio() -> float:
        return density
var failures: Array[String] = []
var checks := 0
func _initialize() -> void:
    call_deferred("run")
func check(label: String, ok: bool) -> void:
    checks += 1
    if not ok:
        failures.append(label)
        print("FAIL ", label)
func settle() -> void:
    for i in 5:
        await process_frame
func run() -> void:
    var game := DensityGame.new()
    root.add_child(game)
    game.set_process(false)
    game.set_physics_process(false)
    game.player.set_physics_process(false)
    game.rewards.award("rescue") # Layout fixture, not earned-play evidence.
    for css in [Vector2i(320, 568), Vector2i(390, 783), Vector2i(844, 332), Vector2i(667, 300)]:
        for density in [1.0, 2.0, 3.0]:
            game.density = density
            root.size = Vector2i(Vector2(css) * density)
            game._layout_ui()
            for lang in ["en", "ru"]:
                game.language = lang
                for state in ["intro", "pause", "map", "rewards", "complete", ""]:
                    var tag: String = str(css) + "@" + str(density) + "/" + lang + "/" + state
                    game.paused = state != ""
                    game.modal_kind = state
                    game.crossing_found = true
                    game.carrying = 0
                    game.context_kind = "place"
                    game.notice_key = "crossing"
                    game.notice_timer = 5
                    game._refresh_ui()
                    await settle()
                    var bounds := Rect2(Vector2.ZERO, Vector2(root.size))
                    check(tag + "/body22", game.modal_body.get_theme_font_size("font_size") == 22)
                    check(tag + "/objective22", game.objective.get_theme_font_size("font_size") == 22)
                    var controls: Array = [game.language_button]
                    if game.paused:
                        check(tag + "/modal_bounds", bounds.encloses(game.modal.get_global_rect()))
                        controls.append_array([game.primary, game.secondary])
                        if game.banner_choices.visible:
                            controls.append_array(game.banner_buttons)
                        var scroll: ScrollContainer = game.modal_content.get_parent()
                        check(tag + "/scroll_visible", scroll.size.y >= 28)
                        check(tag + "/no_horizontal_overflow", game.modal_content.size.x <= scroll.size.x + 1)
                        if state == "map":
                            check(tag + "/map_width", game.trail_map.size.x <= scroll.size.x)
                            check(tag + "/map_legend_fits", ThemeDB.fallback_font.get_string_size(game.trail_map._t("You · use the bridge", "Ты · иди по мосту"), HORIZONTAL_ALIGNMENT_LEFT, -1, 18).x + 40 <= game.trail_map.size.x)
                        scroll.scroll_vertical = 10000
                        await settle()
                        check(tag + "/footer_after_scroll", game.modal.get_global_rect().encloses(game.primary.get_global_rect()))
                        scroll.scroll_vertical = 0
                    else:
                        controls.append_array([game.pause_button, game.map_button, game.rewards_button, game.jump_button, game.action_button])
                        check(tag + "/header_bounds", bounds.encloses(game.header.get_global_rect()))
                        check(tag + "/notice_bounds", bounds.encloses(game.notice.get_global_rect()))
                        check(tag + "/hud_no_overlap", not game.header.get_global_rect().intersects(game.map_button.get_global_rect()))
                    if not game.paused:
                        for button: Button in controls:
                            check(tag + "/header_separate/" + button.text, not game.header.get_global_rect().intersects(button.get_global_rect()))
                            check(tag + "/scaled_hit/" + button.text, game._tap_blocked(button.get_global_rect().get_center()))
                            check(tag + "/notice_separate/" + button.text, not game.notice.get_global_rect().intersects(button.get_global_rect()))
                    for button: Button in controls:
                        if not button.is_visible_in_tree():
                            continue
                        check(tag + "/button_bounds/" + button.text, bounds.encloses(button.get_global_rect()))
                        check(tag + "/touch44/" + button.text, button.size.y >= 44 and button.size.x >= 44)
                        check(tag + "/button_text/" + button.text, button.get_theme_font("font").get_string_size(button.text, HORIZONTAL_ALIGNMENT_LEFT, -1, button.get_theme_font_size("font_size")).x + 24 <= button.size.x + 1)
                        for other: Button in controls:
                            if other != button and other.is_visible_in_tree():
                                check(tag + "/buttons_separate/" + button.text + "/" + other.text, not button.get_global_rect().intersects(other.get_global_rect()))
    print("MOBILE_UI_READABILITY checks=", checks, " failures=", failures.size())
    game.queue_free()
    await process_frame
    quit(1 if not failures.is_empty() else 0)
