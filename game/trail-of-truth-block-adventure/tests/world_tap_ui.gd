extends SceneTree
var failures: Array[String] = []
var checks := 0
func _initialize() -> void:
    call_deferred("run")
func check(label: String, ok: bool) -> void:
    checks += 1
    print(label, " ", ok)
    if not ok:
        failures.append(label)
func touch(at: Vector2, pressed: bool, canceled: bool = false, index: int = 0) -> void:
    var event := InputEventScreenTouch.new()
    event.position = at
    event.pressed = pressed
    event.canceled = canceled
    event.index = index
    root.push_input(event, true)
func run() -> void:
    root.size = Vector2i(1280, 720)
    var game = load("res://scripts/main.gd").new()
    root.add_child(game)
    await process_frame
    game._primary_action()
    game.set_process(false)
    game.set_physics_process(false)
    game.player.set_physics_process(false)
    game.player.set_process(false)
    game.player.position = Vector3(-7, .1, -.2)
    var camera: Camera3D = game.player.get_camera()
    camera.top_level = true
    var target: Vector3 = game.boards[0].global_position + Vector3.UP * .15
    camera.global_position = target + Vector3(0, 4, 6)
    camera.look_at(target)
    await physics_frame
    var at := camera.unproject_position(target)
    game._choose_context()
    game._refresh_ui()
    await process_frame
    check("near_log_context", game.context_kind == "pickup")
    touch(at, true)
    var drag := InputEventScreenDrag.new()
    drag.position = at + Vector2(60, 0)
    drag.relative = Vector2(60, 0)
    drag.index = 0
    root.push_input(drag, true)
    touch(at, false)
    check("drag_out_and_back_does_not_pickup", game.carrying == -1)
    camera.look_at(target)
    touch(at, true)
    touch(at, false, true)
    check("canceled_touch_does_not_pickup", game.carrying == -1)
    touch(at, true)
    touch(at + Vector2(40, 0), true, false, 1)
    touch(at, false)
    touch(at + Vector2(40, 0), false, false, 1)
    check("multitouch_does_not_pickup", game.carrying == -1)
    # A first finger owned by GUI must also suppress a second world finger.
    touch(game.jump_button.get_global_rect().get_center(), true, false, 2)
    touch(at, true)
    touch(at, false)
    touch(game.jump_button.get_global_rect().get_center(), false, false, 2)
    check("gui_first_multitouch_rejected", game.carrying == -1)
    touch(at, true)
    game._notification(Node.NOTIFICATION_APPLICATION_FOCUS_OUT)
    touch(at, false)
    check("focus_loss_cancels_tap", game.carrying == -1)
    touch(at, true)
    game.paused = true
    game._refresh_ui()
    game.paused = false
    game._refresh_ui()
    touch(at, false)
    check("pause_resume_cancels_tap", game.carrying == -1)
    touch(at, true)
    game._tap_candidates[0].time -= 351
    touch(at, false)
    check("long_press_rejected", game.carrying == -1)
    var projected: Dictionary = game._world_tap_target()
    check("read_only_target_matches_projection", not projected.is_empty() and Vector2(projected.position[0], projected.position[1]).distance_to(at) < .01 and game.carrying == -1)
    check("joystick_region_rejected", not game._try_world_tap(Vector2(100, 600)))
    check("hud_rejected", not game._try_world_tap(game.map_button.get_global_rect().get_center()))
    game.player.position = Vector3(-20, .1, 7)
    check("distant_log_rejected", not game._try_world_tap(at))
    game.player.position = Vector3(-7, .1, -.2)
    var wall := StaticBody3D.new()
    var shape := CollisionShape3D.new()
    var box := BoxShape3D.new()
    box.size = Vector3(3, 4, .4)
    shape.shape = box
    wall.add_child(shape)
    game.add_child(wall)
    wall.global_position = target + Vector3(0, 1.5, 2)
    await physics_frame
    await physics_frame
    check("occluded_log_rejected", not game._try_world_tap(at))
    wall.queue_free()
    await physics_frame
    await physics_frame
    camera.look_at(target)
    var points_before: int = game.adventure_points
    touch(at, true)
    touch(at, false)
    check("real_touch_picks_up_near_log", game.carrying == 0 and game.boards[0].get_parent() == game.player.carry_socket)
    check("pickup_has_no_points", game.adventure_points == points_before)
    game.player.position = Vector3(1.5, .1, 0)
    game.preview.position.x = 3.85
    target = game.preview.global_position + Vector3.UP * .20
    camera.global_position = target + Vector3(0, 4, 6)
    camera.look_at(target)
    at = camera.unproject_position(target)
    await physics_frame
    check("near_preview_places_via_same_gate", game._try_world_tap(at) and game.bridge_stage == 1 and game.carrying == -1)
    check("cannot_repeat_placement", not game._try_world_tap(at) and game.bridge_stage == 1)
    game.player.position = game.seeds[0].position + Vector3(0, 0, 1)
    target = game.seeds[0].global_position
    camera.global_position = target + Vector3(0, 4, 6)
    camera.look_at(target)
    at = camera.unproject_position(target)
    game._choose_context()
    game._refresh_ui()
    await physics_frame
    check("seed_target_available", game._world_tap_target().get("kind", "") == "seed")
    for pressed in [true, false]:
        var mouse := InputEventMouseButton.new()
        mouse.button_index = MOUSE_BUTTON_LEFT
        mouse.position = at
        mouse.pressed = pressed
        root.push_input(mouse, true)
    check("mouse_click_collects_seed", game.seeds_found.has(0))
    game.context_kind = "call"
    check("no_animal_tap_target", game._world_tap_target().is_empty())
    game.paused = true
    check("paused_tap_rejected", not game._try_world_tap(at))
    print("WORLD_TAP_UI checks=", checks, " failures=", failures.size())
    # Let interaction cues drain before tearing down their audio playback resources.
    await create_timer(1.0).timeout
    game.queue_free()
    await process_frame
    quit(1 if not failures.is_empty() else 0)
