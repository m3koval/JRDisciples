extends SceneTree
## Doors, walk-in interiors and villager small talk, driven by real key input.
const VillageFinish = preload("res://assets/environment/village_finish.gd")
var game
var failures := 0
var keys := {}
func _initialize() -> void:
	call_deferred("run")
func frames(n: int) -> void:
	for i in range(n): await physics_frame
func key(code: int, down: bool) -> void:
	if keys.get(code, false) == down: return
	keys[code] = down
	var event := InputEventKey.new()
	event.physical_keycode = code
	event.pressed = down
	Input.parse_input_event(event)
func check(ok: bool, label: String) -> void:
	print(("PASS " if ok else "FAIL ") + label)
	if not ok: failures += 1
func walk(target: Vector3, limit: int = 900) -> void:
	for i in range(limit):
		var d: Vector3 = target - game.player.position
		d.y = 0
		if d.length() < .25: break
		key(KEY_D, d.x > .15)
		key(KEY_A, d.x < -.15)
		key(KEY_S, d.z > .15)
		key(KEY_W, d.z < -.15)
		await frames(1)
	for k in [KEY_W, KEY_A, KEY_S, KEY_D]: key(k, false)
	await frames(10)
func interact() -> void:
	key(KEY_E, true)
	await frames(3)
	key(KEY_E, false)
	await frames(6)
func shot(name: String) -> void:
	if not "--capture" in OS.get_cmdline_user_args(): return
	await RenderingServer.frame_post_draw
	root.get_texture().get_image().save_png(ProjectSettings.globalize_path("res://../../docs/games/block-evidence/village-" + name + ".png"))
func house_point(house: Node3D, local: Vector3) -> Vector3:
	var p: Vector3 = house.to_global(local)
	return Vector3(p.x, 0, p.z)
func run() -> void:
	root.size = Vector2i(1100, 750)
	game = load("res://main.tscn").instantiate()
	root.add_child(game)
	await frames(4)
	game._primary_action()
	game.player._yaw = 0.0
	await frames(4)
	check(game.world.cottages.size() == 2 and game.villagers.size() == 3, "two walk-in cottages and three villagers exist")

	# Elder by the shelter answers with the opening hint.
	await walk(game.villagers[0].node.global_position + Vector3(1.2, 0, -1.0))
	game._choose_context()
	check(game.context_kind == "talk" and game.context_index == 0, "standing by the elder offers Talk")
	await interact()
	check(game.paused and game.modal_kind == "talk" and game.modal_body.text.contains("hoofprints"), "elder shares the start-of-story hint")
	await shot("talk-elder")
	game._primary_action()
	await frames(4)
	check(not game.paused and game.modal_kind == "", "Thank you closes the talk panel")

	# Family home: closed door blocks, opening lets the player in.
	var home: Node3D = game.world.cottages[0]
	var outside := house_point(home, Vector3(-1.0, 0, 6.2))
	var threshold := house_point(home, Vector3(-1.0, 0, 5.3))
	var inside := house_point(home, Vector3(-1.0, 0, 0.2))
	await walk(outside)
	await walk(threshold)
	game._choose_context()
	check(game.context_kind == "door" and game.action_button.text == "Open", "door offers Open while closed")
	await walk(inside, 240)
	check(not VillageFinish.is_inside(home, game.player.global_position), "closed door keeps the player outside")
	await walk(threshold)
	await interact()
	await frames(30)
	check(home.get_meta("door_open") and absf((home.get_meta("door_pivot") as Node3D).rotation_degrees.y - 95.0) < 1.0, "door swings open on its hinge")
	await shot("door-open")
	await walk(inside)
	await frames(40)
	check(VillageFinish.is_inside(home, game.player.global_position), "open door lets the player walk inside")
	check(game.player._interior and not (home.get_meta("roof")[0] as Node3D).visible, "inside: roof hidden and indoor camera active")
	check(game.player._arm.spring_length < 4.5 and game.player._pitch <= -0.8, "indoor camera pulls in and looks down into the room")
	await shot("home-inside")
	game._choose_context()
	check(game.context_kind == "talk" and game.villagers[game.context_index].id == "mother", "Aunt Anna is reachable inside")
	await interact()
	check(game.modal_kind == "talk" and game.modal_title.text == "Aunt Anna", "talk panel is titled with her name")
	await shot("talk-mother")
	game._primary_action()
	await frames(2)
	await interact()
	check(game.modal_body.text.contains("fire keeps us warm"), "second visit gives her chat line")
	game._primary_action()
	await frames(4)

	# Walk out, roof returns; close the door behind.
	await walk(threshold)
	await frames(10)
	check(not game.player._interior and (home.get_meta("roof")[0] as Node3D).visible, "leaving restores roof and outdoor camera")
	await walk(outside)
	await walk(threshold)
	await interact()
	await frames(30)
	check(not home.get_meta("door_open"), "door closes again")

	# Bakery and the baker, in Russian.
	game.language = "ru"
	var bakery: Node3D = game.world.cottages[1]
	await walk(house_point(bakery, Vector3(-1.0, 0, 6.2)))
	await walk(house_point(bakery, Vector3(-1.0, 0, 5.3)))
	await interact()
	await frames(30)
	await walk(house_point(bakery, Vector3(-1.0, 0, 0.3)))
	await frames(30)
	check(VillageFinish.is_inside(bakery, game.player.global_position), "player can enter the bakery")
	await shot("bakery-inside")
	game._choose_context()
	check(game.context_kind == "talk" and game.villagers[game.context_index].id == "baker", "baker is reachable inside")
	await interact()
	print("BAKER_SAYS stage=", game._story_stage(), " title=", game.modal_title.text, " body=", game.modal_body.text)
	var expected: String = game.VILLAGER_LINES["baker"][game._story_stage()][1]
	check(game.modal_title.text == "Пекарь Товия" and game.modal_body.text == expected, "baker speaks his stage line in Russian when RU is chosen")
	await shot("talk-baker-ru")
	game._primary_action()
	print("VILLAGE_INTERIORS_FAILURES=", failures)
	quit(1 if failures else 0)
