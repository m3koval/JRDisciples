extends SceneTree
var failed := false
func _initialize() -> void:
    call_deferred("run")
func check(label: String, value: bool) -> void:
    print(label, " ", value)
    failed = failed or not value
func run() -> void:
    var world = load("res://scripts/world.gd").new()
    root.add_child(world)
    await process_frame
    world.set_camp_banner("blue")
    check("banner_locked_before_rescue", not world._banner.visible)
    world.set_camp_restored(true)
    check("earned_blue_banner", world._banner.visible and world._banner_material.albedo_color == Color("448cb8"))
    world.set_camp_banner("green")
    check("earned_green_banner", world._banner_material.albedo_color == Color("58915c"))
    world.set_camp_banner("invalid")
    check("invalid_choice_hidden", not world._banner.visible)
    world.queue_free()
    await process_frame
    quit(1 if failed else 0)
