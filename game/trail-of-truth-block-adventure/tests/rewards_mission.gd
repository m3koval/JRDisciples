extends "res://tests/playthrough.gd"
## The existing real-keyboard full route, with exact reward checkpoints.
var save_before := ""
var had_save := false
func _initialize() -> void:
    had_save = FileAccess.file_exists("user://block_save.json")
    if had_save:
        save_before = FileAccess.get_file_as_string("user://block_save.json")
    super._initialize()
func check(label: String, value: bool) -> void:
    if label == "invalid_action_no_reward":
        game._apply_progress(null)
        game._interact()
        super.check("empty_action_zero_points", game.adventure_points == 0)
    super.check(label, value)
    var milestones := {"tracks_discovered": 10, "bridge_complete": 30, "lamb_discovered": 50, "rescued": 100}
    if milestones.has(label):
        super.check("points_" + label, game.adventure_points == milestones[label])
    if label == "rescued":
        super.check("banner_requires_choice", game.camp_banner_color == "" and game.banner_choices.visible)
        game.banner_buttons[0].pressed.emit()
        super.check("banner_button_choice", game.camp_banner_color == "blue" and game.adventure_points == 100)
        game._complete()
        game._load_progress()
        super.check("repeat_completion_reload_no_points", game.adventure_points == 100 and game.camp_banner_color == "blue")
    if label == "localized":
        if had_save:
            var file := FileAccess.open("user://block_save.json", FileAccess.WRITE)
            file.store_string(save_before)
            file.close()
        else:
            DirAccess.remove_absolute(ProjectSettings.globalize_path("user://block_save.json"))
