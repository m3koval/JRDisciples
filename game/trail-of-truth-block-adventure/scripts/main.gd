extends Node3D
## A complete small adventure: free exploration, physical repair, and rescue.
const SPAWN := Vector3(-11, 0.15, 7)
const CAMP := Vector3(-11, 0, 7)
const LAMB_DISCOVERY_RADIUS := 2.6
const LAMB_ALCOVE := Vector3(18.5, .02, -11)
const VillageFinish = preload("res://assets/environment/village_finish.gd")
const TALK_RADIUS := 2.1
const DOOR_RADIUS := 1.8
# Small talk: one line for the current story stage, then a chat line on repeat visits.
# Hints never gate progress; every line stays short enough to read aloud to a 6-year-old.
const VILLAGER_LINES := {
    "elder": {
        "start": ["Peace to you, little shepherd! One of my lambs slipped out of the fold. Look for tiny hoofprints by the path.", "Мир тебе, маленький пастух! Один мой ягнёнок выбежал из загона. Поищи маленькие следы у тропинки."],
        "bridge": ["The tracks cross the creek, but the old bridge is broken. Two strong logs would fix it.", "Следы ведут за ручей, но старый мостик сломан. Его починят два крепких бревна."],
        "search": ["Listen for its little bell. Lambs hide in quiet places — maybe behind the big rock.", "Прислушайся к колокольчику. Ягнята прячутся в тихих местах — может быть, за большим камнем."],
        "follow": ["You found it! Walk slowly so it can keep up with you.", "Ты нашёл его! Иди не спеша, чтобы он поспевал за тобой."],
        "done": ["Jesus told a story like this: the shepherd was so glad, he called his friends to celebrate!", "Иисус рассказывал такую историю: пастух так радовался, что позвал друзей праздновать!"],
        "chat": ["I have cared for sheep my whole life. Every single one has a name.", "Я всю жизнь пасу овец. У каждой из них есть имя."],
    },
    "mother": {
        "start": ["Welcome! Come in and warm up by the fire.", "Добро пожаловать! Заходи, погрейся у огня."],
        "bridge": ["The storm broke the creek bridge. Look for logs lying near the cottages.", "Буря сломала мостик через ручей. Поищи брёвна возле домиков."],
        "search": ["Once I lost a silver coin. I swept the whole house until I found it!", "Однажды я потеряла серебряную монету. Я подмела весь дом, пока не нашла её!"],
        "follow": ["Oh, the little lamb! Take it home to Grandpa Simeon.", "Ах, ягнёночек! Отведи его домой к дедушке Симеону."],
        "done": ["The lamb, the coin, and you — every one matters to God!", "И ягнёнок, и монета, и ты — каждый дорог Богу!"],
        "chat": ["The fire keeps us warm, and the table has room for one more.", "Огонь нас греет, а за столом всегда найдётся место ещё для одного."],
    },
    "baker": {
        "start": ["Fresh bread, right from the oven! God gives us our daily bread.", "Свежий хлеб, прямо из печи! Бог даёт нам хлеб наш насущный."],
        "bridge": ["This morning I saw a little lamb run past my door toward the creek.", "Утром я видел, как маленький ягнёнок пробежал мимо моей двери к ручью."],
        "search": ["Across the creek the trail bends round a big rock. Keep your ears open!", "За ручьём тропинка огибает большой камень. Слушай внимательно!"],
        "follow": ["There it is! I will save a crust of bread for your lamb.", "Вот он! Я оставлю корочку хлеба для твоего ягнёнка."],
        "done": ["A lamb found and bread to share — what a good day!", "Ягнёнок нашёлся, и есть хлеб, чтобы поделиться, — какой хороший день!"],
        "chat": ["I knead the dough before sunrise. The oven has to be very hot.", "Я замешиваю тесто ещё до рассвета. Печь должна быть очень горячей."],
    },
}
var lamb_exit_route: Array[Vector3] = []
var villagers: Array[Dictionary] = []
var talk_index := -1
var _inside_cottage := -1
const LUKE_EN := "Luke 19:10 · ESV\n“For the Son of Man came to seek and to save the lost.”"
const LUKE_RU := "Луки 19:10 · Синодальный перевод\n«ибо Сын Человеческий пришел взыскать и спасти погибшее»."
const JOHN_EN := "John 10:11 · ESV\n“I am the good shepherd. The good shepherd lays down his life for the sheep.”"
const JOHN_RU := "Иоанна 10:11 · Синодальный перевод\n«Я есмь пастырь добрый: пастырь добрый полагает жизнь свою за овец»."
signal camp_banner_changed(color_id: String)
var rewards = preload("res://scripts/adventure_rewards.gd").new()
var campaign = preload("res://scripts/flock_campaign.gd").new()
var caves = preload("res://scripts/cave_campaign.gd").new()
var water_chapter = preload("res://scripts/water_campaign.gd").new()
var adventure_points: int:
    get: return rewards.total()
var camp_banner_color: String:
    get: return rewards.banner_color
var world
var player
var language := "en"
var bridge_stage := 0
var trail_found := false
var crossing_found := false
var lamb_found := false
var trail_marks: Array[Node3D] = []
var carrying := -1
var following := false
var completed := false
var reward_saved := false
var garden_saved := false
var seeds_found: Array[int] = []
var boards: Array[Node3D] = []
var seeds: Array[Node3D] = []
var lamb: Node3D
var lamb_model: Node3D
var lamb_legs: Array[Node3D] = []
var lamb_stride := 0.0
var context_kind := ""
var context_index := -1
var recoveries := 0
var saves_ok := true
var paused := true
var modal_kind := "intro"
var notice_timer := 0.0
var notice_key := ""
var telemetry_timer := 0.0
var preview: MeshInstance3D
var highlight: MeshInstance3D
var hud: Control
var header: PanelContainer
var objective: Label
var counter: Label
var notice: Label
var action_button: Button
var jump_button: Button
var language_button: Button
var pause_button: Button
var rewards_button: Button
var banner_choices: GridContainer
var banner_buttons: Array[Button] = []
var map_button: Button
var trail_map: Control
var modal: PanelContainer
var modal_tail: ColorRect
var modal_content: VBoxContainer
var shade: ColorRect
var modal_title: Label
var modal_body: Label
var primary: Button
var secondary: Button
var input_hint: Label
var garden: Node3D
var target_marker: MeshInstance3D
var bell: AudioStreamPlayer3D
var cue: AudioStreamPlayer
var bell_timer := 3.0
var _tap_candidates: Dictionary = {}
var _tap_touches: Dictionary = {}
var _ui_ratio := 1.0

func _clear_world_taps() -> void:
    _tap_candidates.clear()
    _tap_touches.clear()

func _notification(what: int) -> void:
    if what in [NOTIFICATION_APPLICATION_FOCUS_OUT, NOTIFICATION_WM_WINDOW_FOCUS_OUT, NOTIFICATION_APPLICATION_PAUSED]:
        _clear_world_taps()

class WorldTapObserver extends Node:
    var controller: Node
    func _input(event: InputEvent) -> void:
        controller._observe_world_tap(event)

func _tap_blocked(at: Vector2) -> bool:
    var viewport_size := get_viewport().get_visible_rect().size
    # Match the player's broad movement pad, not just the visible joystick.
    if at.x < viewport_size.x * .45 and at.y > viewport_size.y * .40:
        return true
    for control in [header, language_button, pause_button, map_button, rewards_button, jump_button, action_button]:
        if control.is_visible_in_tree() and control.get_global_rect().has_point(at):
            return true
    return paused

func _observe_world_tap(event: InputEvent) -> void:
    # Track even GUI-owned fingers: a held button plus a look tap is not a pickup.
    if event is InputEventScreenTouch:
        if event.pressed and not event.canceled:
            _tap_touches[event.index] = true
        else:
            _tap_touches.erase(event.index)
    if paused or _tap_touches.size() > 1:
        _tap_candidates.clear()
        return
    var id := -2
    var at := Vector2.ZERO
    var down := false
    var released := false
    var canceled := false
    if event is InputEventScreenTouch:
        id = event.index
        at = event.position
        down = event.pressed
        released = not event.pressed
        canceled = event.canceled
    elif event is InputEventScreenDrag:
        id = event.index
        at = event.position
    elif event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.device != -1:
        id = -1
        at = event.position
        down = event.pressed
        released = not event.pressed
    elif event is InputEventMouseMotion and event.device != -1:
        id = -1
        at = event.position
    else:
        return
    if down:
        # Never turn a second-finger look gesture into an interaction.
        if not _tap_candidates.is_empty() or player._stick_id >= 0 or player._look_id >= 0:
            _tap_candidates.clear()
            return
        if not _tap_blocked(at):
            var target := _world_tap_target()
            if not target.is_empty() and Vector2(target.position[0], target.position[1]).distance_to(at) <= target.radius:
                _tap_candidates[id] = {"start": at, "time": Time.get_ticks_msec(), "kind": context_kind, "index": context_index}
    elif _tap_candidates.has(id):
        var candidate: Dictionary = _tap_candidates[id]
        if canceled or at.distance_to(candidate.start) > 12.0 * _ui_ratio or _tap_blocked(at):
            _tap_candidates.erase(id)
        elif released:
            _tap_candidates.erase(id)
            if Time.get_ticks_msec() - candidate.time <= 350:
                _choose_context()
                if context_kind == candidate.kind and context_index == candidate.index:
                    _try_world_tap(at)

func _world_tap_target() -> Dictionary:
    # Read-only, in engine viewport pixels. Telemetry never chooses/mutates context.
    if paused:
        return {}
    var target: Vector3
    match context_kind:
        "pickup": target = boards[context_index].global_position + Vector3.UP * .15
        "seed": target = seeds[context_index].global_position
        "place": target = preview.global_position + Vector3.UP * .20
        "door": target = VillageFinish.door_point(world.cottages[context_index])
        "talk": target = villagers[context_index].node.global_position + Vector3.UP * 1.3
        _: return {} # No hitting animals, scenery, or remote rewards.
    var camera: Camera3D = player.get_camera()
    if camera.is_position_behind(target):
        return {}
    var projected := camera.unproject_position(target)
    if not get_viewport().get_visible_rect().has_point(projected) or _tap_blocked(projected):
        return {}
    # Projection alone would allow picking through walls. Check both sightlines.
    for origin in [camera.global_position, player.global_position + Vector3.UP]:
        var ray := PhysicsRayQueryParameters3D.create(origin, target)
        var excluded: Array[RID] = [player.get_rid()]
        if context_kind == "door":
            excluded.append((world.cottages[context_index].get_meta("door_body") as StaticBody3D).get_rid())
        elif context_kind == "talk":
            excluded.append((villagers[context_index].body as StaticBody3D).get_rid())
        ray.exclude = excluded
        if not get_world_3d().direct_space_state.intersect_ray(ray).is_empty():
            return {}
    return {"kind": context_kind, "index": context_index, "position": [projected.x, projected.y], "radius": 32.0 * _ui_ratio}

func _try_world_tap(at: Vector2) -> bool:
    if _tap_blocked(at):
        return false
    _choose_context() # Same distance, inventory and chapter gates as E/button.
    var target := _world_tap_target()
    if target.is_empty() or Vector2(target.position[0], target.position[1]).distance_to(at) > target.radius:
        return false
    _interact()
    return true

func t(en: String, ru: String) -> String:
    return ru if language == "ru" else en

func _ready() -> void:
    if OS.has_feature("web"):
        language = "ru" if str(JavaScriptBridge.eval("new URLSearchParams(location.search).get('lang') || 'en'")) == "ru" else "en"
    _load_progress()
    world = preload("res://scripts/world.gd").new()
    add_child(world)
    world.set_camp_restored(reward_saved)
    _apply_banner_to_world()
    player = preload("res://scripts/player.gd").new()
    player.position = SPAWN
    add_child(player)
    player.set_enabled(false)
    _build_objects()
    campaign.host = self
    add_child(campaign)
    if campaign.stage > 0:
        completed = true
        following = true
        lamb.position = CAMP
        bridge_stage = 2
        world.set_bridge_stage(2)
        for board in boards:
            board.visible = false
    caves.host = self
    add_child(caves)
    water_chapter.host = self
    add_child(water_chapter)
    _build_ui()
    var observer := WorldTapObserver.new()
    observer.controller = self
    add_child(observer)
    get_viewport().size_changed.connect(_layout_ui)
    get_viewport().size_changed.connect(_clear_world_taps)
    _layout_ui()
    _refresh_ui()

func _material(color: Color) -> StandardMaterial3D:
    var m := StandardMaterial3D.new()
    m.albedo_color = color
    m.roughness = 0.85
    return m

func _box(parent: Node3D, pos: Vector3, size: Vector3, color: Color) -> MeshInstance3D:
    var node := MeshInstance3D.new()
    var mesh := BoxMesh.new()
    mesh.size = size
    node.mesh = mesh
    node.material_override = _material(color)
    node.position = pos
    parent.add_child(node)
    return node

func _build_objects() -> void:
    # Split hoofprints form a readable trail, rather than a spoiler waypoint.
    for origin in [Vector3(-10, 0, 3), Vector3(-8, 0, 1), Vector3(-5, 0, 0), Vector3(-2, 0, 0), Vector3(9, 0, 0), Vector3(12, 0, -2), Vector3(13, 0, -5), Vector3(13.5, 0, -8), Vector3(14.8, 0, -10.7), Vector3(17, 0, -11)]:
        var marks := Node3D.new()
        marks.position = origin
        add_child(marks)
        trail_marks.append(marks)
        for side in [-1, 1]:
            for toe in [-1, 1]:
                _box(marks, Vector3(side * .19 + toe * .046, .028, side * .19), Vector3(.065, .026, .18), Color("66503d"))
    for pos in [Vector3(-7, 0.23, -2), Vector3(-15, 0.23, -5)]:
        var board := Node3D.new()
        board.position = pos
        add_child(board)
        # A tapered cut log, sized against Michael's own height, reads as
        # something a boy can shoulder better than a flat plank did.
        board.add_child(preload("res://assets/log.glb").instantiate())
        boards.append(board)
    var seed_positions := [Vector3(-17, .3, 10), Vector3(-13, 1.3, -10), Vector3(18, .3, 7)]
    for pos in seed_positions:
        var pouch := Node3D.new()
        pouch.position = pos
        add_child(pouch)
        # A sculpted drawstring sack (see assets/opening_art/PROVENANCE.md), not the
        # earlier flat two-box placeholder. glTF export does not carry
        # Blender's node-graph material edits into a Godot-readable form
        # (confirmed with the opening-scene rocks too), so colors are
        # reapplied directly by mesh name instead of trusting the import.
        var sack := preload("res://assets/seed_pouch.glb").instantiate() as Node3D
        sack.scale = Vector3.ONE * .25
        # Scanned burlap weave (Poly Haven hessian_230), mapped in the sack's
        # own space so the weave stays sized to the pouch.
        var burlap: StandardMaterial3D = preload("res://scripts/cave_scenery.gd").material("hessian_230", 1.4, Color("fff3dc"))
        burlap.uv1_world_triplanar = false
        for mesh in sack.find_children("*", "MeshInstance3D", true, false):
            if mesh.name.begins_with("PouchBody"): mesh.material_override = burlap
            elif mesh.name.begins_with("PouchTie"): mesh.material_override = _material(Color("57402b"))
            elif mesh.name.begins_with("PouchLeaf"): mesh.material_override = _material(Color("6b9a48"))
        pouch.add_child(sack)
        seeds.append(pouch)
    # A non-blocking companion still sweeps against world solids. Layer zero
    # keeps it out of player movement, camera and discovery sightline queries.
    lamb = CharacterBody3D.new()
    lamb.collision_layer = 0
    lamb.collision_mask = 1 | VillageFinish.INTERIOR_LAYER
    lamb.add_collision_exception_with(player)
    var lamb_shape := CollisionShape3D.new()
    var footprint := CylinderShape3D.new()
    footprint.radius = .35
    footprint.height = .7
    lamb_shape.shape = footprint
    lamb_shape.position.y = .5
    lamb.add_child(lamb_shape)
    lamb.position = LAMB_ALCOVE
    add_child(lamb)
    lamb_model = preload("res://assets/lamb.glb").instantiate()
    lamb_model.scale = Vector3.ONE * .82
    lamb.add_child(lamb_model)
    bell = AudioStreamPlayer3D.new()
    bell.stream = preload("res://scripts/audio.gd").tone(880.0, .42)
    bell.unit_size = 4.0
    bell.max_distance = 14.0
    bell.volume_db = -10.0
    lamb.add_child(bell)
    cue = AudioStreamPlayer.new()
    cue.volume_db = -12.0
    add_child(cue)
    for label in ["FrontL", "HindR", "FrontR", "HindL"]:
        lamb_legs.append(lamb_model.find_child(label, true, false))
    preview = _box(self, Vector3(3.85, .07, 0), Vector3(2.25, .15, 1.9), Color(.45, .95, .72, .35))
    preview.material_override.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
    preview.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
    highlight = MeshInstance3D.new()
    var ring := TorusMesh.new()
    ring.inner_radius = .66
    ring.outer_radius = .72
    highlight.mesh = ring
    highlight.material_override = _material(Color("ffdc80"))
    highlight.material_override.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
    add_child(highlight)
    highlight.visible = false
    target_marker = _box(self, Vector3.ZERO, Vector3(.18, .18, .18), Color("ffe09b"))
    target_marker.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
    garden = Node3D.new()
    garden.position = Vector3(-14, 0, 7)
    add_child(garden)
    for i in range(6):
        var at := Vector3((i % 3) * .38, .18, (i / 3) * .45)
        _box(garden, at, Vector3(.08, .36, .08), Color("5b8b4c"))
        _box(garden, at + Vector3(0, .23, 0), Vector3(.28, .16, .28), Color("eebf5f"))
    garden.visible = garden_saved
    _build_villagers()

func _build_villagers() -> void:
    # Quaternius CC0 villagers, adult-sized next to Michael. Indoor positions are
    # in cottage-local units; the elder waits by the shelter's east post, facing
    # spawn and clear of the westward seed route.
    # Generated to match Michael's own style (see docs/junior-disciples-character-library.md).
    # Source rig's feet sit below its own origin, not at it; foot_offset (raw
    # units × scale) lifts each model so its feet land on the floor at y=0.
    var specs := [
        {"id": "elder", "model": "res://assets/villagers/simeon.glb", "en": "Grandpa Simeon", "ru": "Дедушка Симеон", "house": -1, "at": Vector3(-9.9, 0, 9.8), "yaw": -158.0, "scale": .63, "foot_offset": .63},
        {"id": "mother", "model": "res://assets/villagers/anna.glb", "en": "Aunt Anna", "ru": "Тётя Анна", "house": 0, "at": Vector3(-0.4, 0, -1.3), "yaw": 0.0, "scale": .615, "foot_offset": .615},
        {"id": "baker", "model": "res://assets/villagers/tobias.glb", "en": "Tobias the baker", "ru": "Пекарь Товия", "house": 1, "at": Vector3(0.4, 0, -1.2), "yaw": 0.0, "scale": .625, "foot_offset": .625},
    ]
    for spec in specs:
        var root := Node3D.new()
        root.name = "Villager_" + spec.id
        add_child(root)
        var yaw: float = deg_to_rad(spec.yaw)
        if spec.house >= 0:
            var house: Node3D = world.cottages[spec.house]
            root.global_position = house.to_global(spec.at)
            yaw += house.rotation.y
        else:
            root.global_position = spec.at
        root.rotation.y = yaw
        var model: Node3D = (load(spec.model) as PackedScene).instantiate()
        model.scale = Vector3.ONE * spec.scale
        model.position.y = spec.foot_offset
        root.add_child(model)
        # Source rig ships one rest-pose keyframe, not a loopable idle clip;
        # play it once to strike that pose, then rely on the gentle sway in
        # _process(delta) below for a little life.
        var anim: AnimationPlayer = model.find_children("*", "AnimationPlayer", true, false).front()
        if anim != null and not anim.get_animation_list().is_empty():
            anim.play(anim.get_animation_list()[0])
            anim.advance(0)
            anim.stop(false)
        # Blocks the player (layer 2) so nobody walks through a villager.
        var body := StaticBody3D.new()
        body.collision_layer = VillageFinish.INTERIOR_LAYER
        body.collision_mask = 0
        var shape := CollisionShape3D.new()
        var capsule := CapsuleShape3D.new()
        capsule.radius = .28
        capsule.height = 1.6
        shape.shape = capsule
        shape.position.y = .8
        body.add_child(shape)
        root.add_child(body)
        villagers.append({"id": spec.id, "en": spec.en, "ru": spec.ru, "node": root, "model": model, "base_y": spec.foot_offset, "body": body, "yaw": yaw, "talks": 0, "sway_seed": randf() * TAU, "greet_t": 0.0})

func _physics_process(delta: float) -> void:
    if paused:
        return
    if water_chapter.active:
        water_chapter.tick(delta)
        if Input.is_action_just_pressed("interact"): _interact()
        _choose_context()
        return
    if caves.active:
        caves.tick(delta)
        if Input.is_action_just_pressed("interact"): _interact()
        _choose_context()
        return
    campaign.tick(delta)
    if not trail_found and player.position.distance_to(Vector3(-10, 0, 3)) < 3.2:
        trail_found = true
        _earn("tracks")
        _notice("tracks")
    if not crossing_found and player.position.distance_to(Vector3(1.5, 0, 0)) < 5.0:
        crossing_found = true
        trail_found = true
        _earn("tracks")
        _notice("crossing")
    if not lamb_found and bridge_stage == 2 and _can_reach_lamb():
        lamb_found = true
        _earn("lamb")
        _notice("found")
    bell_timer -= delta
    if bell_timer <= 0.0 and not following:
        bell.play()
        bell_timer = 5.0
    if Input.is_action_just_pressed("interact"):
        _interact()
    if player.position.y < -0.8 or absf(player.position.x) > 26 or absf(player.position.z) > 21:
        player.position = Vector3(9, .3, 0) if following and lamb.position.x > 7.3 else SPAWN
        player.velocity = Vector3.ZERO
        recoveries += 1
        _notice("water")
    if following and not completed:
        _follow_lamb(delta)
        if player.position.distance_to(CAMP) < 3.0 and lamb.position.distance_to(CAMP) < 3.1:
            _complete()
    _choose_context()

func _process(delta: float) -> void:
    if Input.is_action_just_pressed("pause"):
        _toggle_pause()
    if notice_timer > 0:
        notice_timer = maxf(0, notice_timer - delta)
    _update_interior()
    for v in villagers:
        var node: Node3D = v.node
        var to_player: Vector3 = player.global_position - node.global_position
        var want: float = v.yaw if Vector2(to_player.x, to_player.z).length() > 3.5 else atan2(to_player.x, to_player.z)
        node.rotation.y = lerp_angle(node.rotation.y, want, 1.0 - exp(-5.0 * delta))
        # Source rig has no idle loop; a slow breathing bob and a little bow
        # when greeted keep a standing villager from reading as a statue.
        var model: Node3D = v.model
        var breathe: float = sin(Time.get_ticks_msec() * .0011 + v.sway_seed) * .012
        var greet: float = maxf(0.0, v.greet_t)
        if greet > 0.0:
            v.greet_t = greet - delta
        var bow: float = sin(minf(greet, .6) / .6 * PI)
        model.position.y = v.base_y + breathe - bow * .05
        model.rotation.x = -bow * .12
    preview.visible = carrying >= 0 and not paused
    preview.position.x = 3.85 if bridge_stage == 0 else 6.15
    if not paused:
        _refresh_ui()
    telemetry_timer -= delta
    if telemetry_timer <= 0:
        telemetry_timer = .15
        _telemetry()

func _update_interior() -> void:
    var inside := -1
    for i in range(world.cottages.size()):
        if VillageFinish.is_inside(world.cottages[i], player.global_position):
            inside = i
    if inside == _inside_cottage:
        return
    if _inside_cottage >= 0:
        VillageFinish.set_roof_visible(world.cottages[_inside_cottage], true)
    if inside >= 0:
        VillageFinish.set_roof_visible(world.cottages[inside], false)
    _inside_cottage = inside
    player.set_interior(inside >= 0)

func _can_reach_lamb() -> bool:
    if player.position.distance_to(lamb.position) >= LAMB_DISCOVERY_RADIUS:
        return false
    var ray := PhysicsRayQueryParameters3D.create(player.global_position + Vector3(0, 1.0, 0), lamb.global_position + Vector3(0, .6, 0))
    ray.exclude = [player.get_rid()]
    return get_world_3d().direct_space_state.intersect_ray(ray).is_empty()

func _follow_lamb(delta: float) -> void:
    var to_player: Vector3 = player.position - lamb.position
    to_player.y = 0
    if to_player.length() > 10:
        return
    var target: Vector3 = player.position
    # Leave the alcove along its open west side before turning toward the bridge.
    # These are navigation waypoints, not extra discovery/reward gates.
    while not lamb_exit_route.is_empty() and Vector2(lamb.position.x - lamb_exit_route[0].x, lamb.position.z - lamb_exit_route[0].z).length() < .18:
        lamb_exit_route.pop_front()
    # Explicit bridge waypoints keep the companion on real ground in both directions.
    if not lamb_exit_route.is_empty():
        if to_player.length() <= 1.35:
            return
        target = lamb_exit_route[0]
    elif lamb.position.x > 7.3 and player.position.x < 7.3:
        target = Vector3(8.0, 0, 0) if absf(lamb.position.z) > .4 else Vector3(1.8, 0, 0)
    elif lamb.position.x < 2.7 and player.position.x > 2.7:
        target = Vector3(2.0, 0, 0) if absf(lamb.position.z) > .4 else Vector3(8.2, 0, 0)
    elif lamb.position.x >= 2.7 and lamb.position.x <= 7.3:
        target = Vector3(1.8 if player.position.x < 5 else 8.2, 0, 0)
    elif player.position.distance_to(CAMP) < 3.0:
        # Walk home even when the player stops at the entrance. Do not enlarge
        # the rescue gate or teleport the trailing lamb into its radius.
        target = CAMP
    var direction: Vector3 = target - lamb.position
    direction.y = 0
    var routing: bool = target.distance_to(player.position) > .1
    var walking: bool = direction.length() > (.18 if routing else 1.35) or (lamb.position.x > 2.5 and lamb.position.x < 7.5)
    if walking:
        var before: Vector3 = lamb.position
        var motion := direction.normalized() * minf(4.1 * clampf(delta, 0, .05), direction.length())
        # At most three swept contacts per tick; no direct position correction
        # through cottages/rocks, and no unbounded catch-up on a slow frame.
        for contact in range(3):
            if motion.length_squared() < .000001:
                break
            var collision := (lamb as CharacterBody3D).move_and_collide(motion)
            if collision == null:
                break
            motion = collision.get_remainder().slide(collision.get_normal())
            motion.y = 0
        var step: Vector3 = lamb.position - before
        walking = step.length_squared() > .000001
        lamb.rotation.y = lerp_angle(lamb.rotation.y, atan2(-step.z, step.x), minf(delta * 8, 1))
        lamb_stride += step.length() * 11
    for i in range(lamb_legs.size()):
        if is_instance_valid(lamb_legs[i]):
            lamb_legs[i].rotation.z = sin(lamb_stride + (PI if i >= 2 else 0.0)) * .27 if walking else 0.0

func _choose_context() -> void:
    context_kind = ""
    context_index = -1
    highlight.visible = false
    if water_chapter.active or water_chapter.entry_available():
        context_kind = water_chapter.context()
        target_marker.position = water_chapter.destination() + Vector3.UP * 2.5
        target_marker.visible = water_chapter.stage < 9
        return
    if caves.active or caves.context() == "caves":
        context_kind = caves.context()
        target_marker.position = caves.destination() + Vector3.UP * 2.5
        # Cave guidance is carried by the map, nearby clue and objective.
        # The old floating cube spoiled the mouth silhouette and lantern view.
        target_marker.visible = not caves.active
        return
    if campaign.stage > 0:
        context_kind = campaign.context()
        target_marker.position = campaign.destination() + Vector3.UP * 2.5
        target_marker.visible = campaign.stage < 6
        if campaign.stage == 6 and not garden_saved:
            var best_seed := INF
            for i in range(seeds.size()):
                if not seeds_found.has(i):
                    var distance: float = player.position.distance_to(seeds[i].position)
                    if distance < best_seed:
                        best_seed = distance
                        target_marker.position = seeds[i].position + Vector3.UP * 2.5
                        target_marker.visible = true
        # Optional seeds remain available without bypassing a flock action.
        if context_kind == "":
            for i in range(seeds.size()):
                if not seeds_found.has(i) and player.position.distance_to(seeds[i].position) < 2.2:
                    context_kind = "seed"
                    context_index = i
                    highlight.global_position = seeds[i].position - Vector3(0, .2, 0)
                    highlight.visible = true
                    break
        if context_kind != "" or campaign.stage < 6: return
    var pos: Vector3 = player.position
    if carrying >= 0:
        if pos.distance_to(Vector3(1.5 if bridge_stage == 0 else 3.6, 0, 0)) < 3.2:
            context_kind = "place"
            highlight.global_position = Vector3(1.4, .15, 0)
    elif bridge_stage < 2:
        for i in range(boards.size()):
            if is_instance_valid(boards[i]) and boards[i].visible and boards[i].get_parent() == self and pos.distance_to(boards[i].position) < 2.7:
                context_kind = "pickup"
                context_index = i
                highlight.global_position = boards[i].position - Vector3(0, .2, 0)
                break
    if context_kind == "":
        for i in range(seeds.size()):
            if not seeds_found.has(i) and pos.distance_to(seeds[i].position) < 2.2:
                context_kind = "seed"
                context_index = i
                highlight.global_position = seeds[i].position - Vector3(0, .2, 0)
                break
    if context_kind == "" and bridge_stage == 2 and not following and _can_reach_lamb():
        context_kind = "call"
        highlight.global_position = lamb.position + Vector3(0, .12, 0)
    if context_kind == "":
        for i in range(villagers.size()):
            if pos.distance_to(villagers[i].node.global_position) < TALK_RADIUS:
                context_kind = "talk"
                context_index = i
                highlight.global_position = villagers[i].node.global_position + Vector3(0, .05, 0)
                break
    if context_kind == "":
        for i in range(world.cottages.size()):
            var door: Vector3 = VillageFinish.door_point(world.cottages[i])
            if Vector2(pos.x - door.x, pos.z - door.z).length() < DOOR_RADIUS:
                context_kind = "door"
                context_index = i
                highlight.global_position = Vector3(door.x, .05, door.z)
                break
    highlight.visible = context_kind != ""
    var destination := CAMP
    if carrying >= 0:
        destination = Vector3(1.3, 0, 0)
    elif bridge_stage < 2:
        var best := INF
        for board in boards:
            if is_instance_valid(board) and board.visible and board.get_parent() == self:
                var distance: float = pos.distance_to(board.position)
                if distance < best:
                    best = distance
                    destination = board.position
    elif not following:
        destination = Vector3(11, 0, -2)
    if not trail_found and carrying < 0 and bridge_stage < 2:
        destination = Vector3(-10, 0, 3)
    elif not crossing_found and carrying < 0 and bridge_stage < 2:
        destination = Vector3(1.5, 0, 0)
    target_marker.position = destination + Vector3(0, 2.5 + sin(Time.get_ticks_msec() * .002) * .12, 0)
    target_marker.rotation.y += .015
    target_marker.visible = not completed and (bridge_stage < 2 or following)

func _interact() -> void:
    if paused:
        return
    _choose_context()
    if water_chapter.active or context_kind == "water_start":
        water_chapter.interact()
        _choose_context()
        _refresh_ui()
        return
    if caves.active or context_kind == "caves":
        caves.interact()
        _choose_context()
        _refresh_ui()
        return
    if campaign.stage > 0 and context_kind not in ["seed", "talk", "door"]:
        campaign.interact()
        _choose_context()
        _refresh_ui()
        return
    _choose_context()
    match context_kind:
        "pickup":
            carrying = context_index
            boards[carrying].reparent(player.carry_socket, false)
            boards[carrying].position = Vector3.ZERO
            # Log's long axis is local X at rest; turning it 90° lays it
            # front-to-back along the shoulder, the way a log is really carried.
            boards[carrying].rotation = Vector3(0, deg_to_rad(90), 0)
            player.carrying = true
            _notice("carry")
        "place":
            if carrying < 0 or bridge_stage >= 2:
                return
            boards[carrying].visible = false
            carrying = -1
            player.carrying = false
            bridge_stage += 1
            world.set_bridge_stage(bridge_stage)
            if bridge_stage == 2:
                _earn("bridge")
            _notice("bridge" if bridge_stage == 2 else "placed")
        "seed":
            if seeds_found.has(context_index):
                return
            seeds_found.append(context_index)
            seeds[context_index].visible = false
            if seeds_found.size() == 3:
                garden_saved = true
                garden.visible = true
                _earn("garden")
                _save_progress()
            _notice("garden" if seeds_found.size() == 3 else "seed")
        "door":
            var house: Node3D = world.cottages[context_index]
            VillageFinish.set_door_open(house, not house.get_meta("door_open"))
        "talk":
            _start_talk(context_index)
        "call":
            following = true
            lamb_exit_route.assign([Vector3(14.8, 0, -11), Vector3(14, 0, -7)])
            _notice("follow")
    _choose_context()
    _refresh_ui()

func _story_stage() -> String:
    if completed:
        return "done"
    if following:
        return "follow"
    if bridge_stage == 2:
        return "search"
    if trail_found or crossing_found or carrying >= 0 or bridge_stage > 0:
        return "bridge"
    return "start"

func _start_talk(i: int) -> void:
    talk_index = i
    villagers[i].talks += 1
    villagers[i].greet_t = .6
    paused = true
    modal_kind = "talk"
    player.set_enabled(false)

func _villager_line(v: Dictionary) -> String:
    var lines: Dictionary = VILLAGER_LINES[v.id]
    # First visit (and every other one after) answers the current stage.
    var line: Array = lines[_story_stage()] if v.talks % 2 == 1 else lines["chat"]
    return line[1] if language == "ru" else line[0]

func _complete() -> void:
    if completed:
        return
    completed = true
    reward_saved = true
    _earn("rescue")
    world.set_camp_restored(true)
    _apply_banner_to_world()
    _save_progress()
    modal_kind = "complete"
    campaign.stage = 1
    campaign.restore()
    _save_progress()
    paused = true
    player.set_enabled(false)
    _refresh_ui()

func _notice(key: String) -> void:
    notice_key = key
    notice_timer = 4.0
    cue.stream = preload("res://scripts/audio.gd").tone(660.0 if key in ["bridge", "garden", "follow"] else 440.0)
    cue.play()

func _toggle_pause() -> void:
    if modal_kind in ["intro", "complete", "flock_complete", "cave_intro", "cave_complete", "water_intro", "water_complete", "water_talk"]:
        return
    paused = not paused
    modal_kind = "pause" if paused else ""
    player.set_enabled(not paused)
    _refresh_ui()

func _open_map() -> void:
    if paused:
        return
    if water_chapter.active:
        # The old map covers only the clearing. Show current chapter guidance,
        # never a misleading marker off its map.
        _toggle_pause()
        return
    paused = true
    modal_kind = "map"
    player.set_enabled(false)
    trail_map.set_language(language)
    trail_map.set_state(player.position, bridge_stage, lamb_found, lamb.position, completed)
    _refresh_ui()

func _primary_action() -> void:
    if modal_kind == "cave_complete" or (modal_kind == "intro" and caves.stage == 6 and not water_chapter.active):
        if water_chapter.start():
            modal_kind = "water_intro"
            _refresh_ui()
            return
    if modal_kind == "flock_complete":
        if caves.start():
            modal_kind = "cave_intro"
            _refresh_ui()
            return
    paused = false
    modal_kind = ""
    player.set_enabled(true)
    _refresh_ui()

func _secondary_action() -> void:
    if water_chapter.active and modal_kind == "pause":
        water_chapter.active = false
        water_chapter.hide()
        player.position = SPAWN
        player.velocity = Vector3.ZERO
        _save_progress()
        _primary_action()
        return
    if modal_kind == "flock_complete":
        paused = false
        modal_kind = ""
        player.set_enabled(true)
        _refresh_ui()
        return
    if caves.active and modal_kind == "pause":
        caves.active = false
        caves.visible = false
        player.position = SPAWN
        player.velocity = Vector3.ZERO
        _save_progress()
        _primary_action()
        return
    if not _prepare_replay():
        _refresh_ui()
        return
    get_tree().reload_current_scene()

func _prepare_replay() -> bool:
    var previous_stage: int = campaign.stage
    var previous_caves: Dictionary = caves.snapshot()
    var previous_water: Dictionary = water_chapter.snapshot()
    var previous_health: int = caves.health
    water_chapter.load_checkpoint(null, 0)
    caves.load_checkpoint(null, 0)
    campaign.stage = 0
    _save_progress()
    if not saves_ok:
        campaign.stage = previous_stage
        caves.load_checkpoint(previous_caves, previous_stage)
        water_chapter.load_checkpoint(previous_water, caves.stage)
        caves.health = previous_health
        return false
    return true

func _set_language() -> void:
    language = "en" if language == "ru" else "ru"
    _refresh_ui()

func _earn(id: String) -> void:
    if rewards.award(id) > 0:
        _save_progress()

func _apply_banner_to_world() -> void:
    if world != null and world.has_method("set_camp_banner"):
        world.set_camp_banner(camp_banner_color)

func choose_camp_banner(color_id: String) -> bool:
    if not rewards.choose_banner(color_id):
        return false
    _save_progress()
    _apply_banner_to_world()
    camp_banner_changed.emit(color_id)
    _refresh_ui()
    return true

func _open_rewards() -> void:
    if paused:
        return
    paused = true
    modal_kind = "rewards"
    player.set_enabled(false)
    _refresh_ui()

func _reward_summary() -> String:
    var names := {"tracks": t("Tracks found", "Следы найдены"), "bridge": t("Bridge repaired", "Мостик починен"), "lamb": t("Lamb found", "Ягнёнок найден"), "rescue": t("Home together", "Вместе дома"), "garden": t("Camp garden", "Сад в лагере")}
    var text := t("Adventure Points: %d / %d", "Очки приключения: %d / %d") % [adventure_points, rewards.CAP]
    for id in rewards.VALUES:
        text += "\n" + ("+ " if rewards.earned.has(id) else "- ") + names[id] + " · " + str(rewards.VALUES[id])
    text += t("\nEach adventure task earns points once. Replay freely!", "\nОчки за каждое дело — один раз. Играй снова просто так!")
    if rewards.earned.has("rescue"):
        text += t("\nYour camp banner is unlocked. Choose its color below!", "\nТебе открыт флаг лагеря. Выбери цвет ниже!")
    else:
        text += t("\nBring the lamb home to unlock a camp banner.", "\nПриведи ягнёнка домой, чтобы открыть флаг лагеря.")
    if not garden_saved:
        text += t("\nNext: find 3 seed pouches to grow the camp garden.", "\nДальше: найди 3 мешочка семян для сада в лагере.")
    else:
        text += t("\nThe garden is blooming! Explore or replay the rescue.", "\nСад цветёт! Гуляй или начни спасение заново.")
    return text

func _load_progress() -> void:
    var data: Variant = null
    if OS.has_feature("web"):
        var raw: Variant = JavaScriptBridge.eval("(function(){try{return localStorage.getItem('jd.block.v1')||''}catch(e){return ''}})()")
        if raw is String and not raw.is_empty() and raw.length() < 2048:
            var parser := JSON.new()
            if parser.parse(raw) == OK:
                data = parser.data
    else:
        if FileAccess.file_exists("user://block_save.json"):
            var parser := JSON.new()
            if parser.parse(FileAccess.get_file_as_string("user://block_save.json")) == OK:
                data = parser.data
    _apply_progress(data)

func _apply_progress(data: Variant) -> void:
    rewards.load_save(data)
    reward_saved = rewards.earned.has("rescue")
    garden_saved = rewards.earned.has("garden")
    if data is Dictionary:
        var rescued: Variant = data.get("rescued")
        var planted: Variant = data.get("garden")
        if rescued is bool:
            reward_saved = reward_saved or rescued
        if planted is bool:
            garden_saved = garden_saved or planted
    campaign.load_checkpoint(data.get("campaign") if data is Dictionary else null, reward_saved)
    caves.load_checkpoint(data.get("caves") if data is Dictionary else null, campaign.stage)
    water_chapter.load_checkpoint(data.get("water") if data is Dictionary else null, caves.stage)
    if water_chapter.active: caves.active = false

func _save_progress() -> void:
    var text := JSON.stringify({"version": 4, "rescued": reward_saved, "garden": garden_saved, "rewards": rewards.snapshot(), "campaign": {"stage": campaign.stage}, "caves": caves.snapshot(), "water": water_chapter.snapshot()})
    if OS.has_feature("web"):
        saves_ok = JavaScriptBridge.eval("(function(){try{localStorage.setItem('jd.block.v1'," + JSON.stringify(text) + ");return true}catch(e){return false}})()") == true
    else:
        var file := FileAccess.open("user://block_save.json", FileAccess.WRITE)
        saves_ok = file != null
        if file:
            file.store_string(text)
            file.flush()
            saves_ok = file.get_error() == OK
            file.close()

func _panel() -> StyleBoxFlat:
    var style := StyleBoxFlat.new()
    style.bg_color = Color(.075, .17, .14, .94)
    style.set_corner_radius_all(18)
    style.content_margin_left = 18
    style.content_margin_right = 18
    style.content_margin_top = 12
    style.content_margin_bottom = 12
    return style

func _label(size: int) -> Label:
    var label := Label.new()
    label.add_theme_font_size_override("font_size", size)
    label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
    label.mouse_filter = Control.MOUSE_FILTER_IGNORE
    return label

func _button(parent: Node, callback: Callable) -> Button:
    var button := Button.new()
    var normal := _panel()
    normal.content_margin_left = 12
    normal.content_margin_right = 12
    button.add_theme_stylebox_override("normal", normal)
    var pressed := _panel()
    pressed.content_margin_left = 12
    pressed.content_margin_right = 12
    pressed.bg_color = Color("487a52")
    button.add_theme_stylebox_override("pressed", pressed)
    button.add_theme_font_size_override("font_size", 20)
    button.focus_mode = Control.FOCUS_NONE
    button.pressed.connect(callback)
    parent.add_child(button)
    return button

func _build_ui() -> void:
    var layer := CanvasLayer.new()
    layer.layer = 20
    add_child(layer)
    hud = Control.new()
    hud.set_anchors_and_offsets_preset(Control.PRESET_TOP_LEFT)
    hud.mouse_filter = Control.MOUSE_FILTER_IGNORE
    layer.add_child(hud)
    header = PanelContainer.new()
    header.mouse_filter = Control.MOUSE_FILTER_IGNORE
    var objective_style := _panel()
    objective_style.content_margin_left = 14
    objective_style.content_margin_right = 14
    objective_style.content_margin_top = 8
    objective_style.content_margin_bottom = 8
    objective_style.set_corner_radius_all(14)
    header.add_theme_stylebox_override("panel", objective_style)
    header.minimum_size_changed.connect(func():
        header.size.y = header.get_combined_minimum_size().y
        # Wrapped text settles after container layout; reposition utility buttons
        # again instead of retaining a stale first-frame portrait height.
        if is_instance_valid(modal): _layout_ui.call_deferred(false)
    )
    hud.add_child(header)
    var stack := VBoxContainer.new()
    stack.mouse_filter = Control.MOUSE_FILTER_IGNORE
    header.add_child(stack)
    objective = _label(21)
    stack.add_child(objective)
    counter = _label(18)
    stack.add_child(counter)
    language_button = _button(hud, _set_language)
    pause_button = _button(hud, _toggle_pause)
    map_button = _button(hud, _open_map)
    rewards_button = _button(hud, _open_rewards)
    jump_button = _button(hud, func(): player.queue_jump())
    action_button = _button(hud, _interact)
    # One useful action, not a combat/tool grid. Keep the thumb anchors intact.
    var action_style := _panel()
    action_style.bg_color = Color("f2cc76")
    action_style.set_border_width_all(2)
    action_style.border_color = Color("fff0bd")
    action_style.content_margin_left = 12
    action_style.content_margin_right = 12
    action_button.add_theme_stylebox_override("normal", action_style)
    action_button.add_theme_color_override("font_color", Color("183c33"))
    action_button.add_theme_color_override("font_hover_color", Color("183c33"))
    action_button.add_theme_stylebox_override("hover", action_style)
    var action_pressed := action_style.duplicate() as StyleBoxFlat
    action_pressed.bg_color = Color("d9ad51")
    action_pressed.border_color = Color("183c33")
    action_button.add_theme_stylebox_override("pressed", action_pressed)
    action_button.add_theme_color_override("font_pressed_color", Color("183c33"))
    var jump_style := _panel()
    jump_style.bg_color = Color("244f62")
    jump_style.content_margin_left = 12
    jump_style.content_margin_right = 12
    jump_button.add_theme_stylebox_override("normal", jump_style)
    notice = _label(20)
    # Scene lighting can put white paving behind this floating text.
    notice.add_theme_color_override("font_outline_color", Color("102d23"))
    notice.add_theme_constant_override("outline_size", 6)
    notice.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
    hud.add_child(notice)
    input_hint = _label(13)
    input_hint.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
    hud.add_child(input_hint)
    shade = ColorRect.new()
    shade.color = Color(0, .07, .05, .65)
    shade.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
    hud.add_child(shade)
    modal = PanelContainer.new()
    modal.add_theme_stylebox_override("panel", _panel())
    hud.add_child(modal)
    # Small triangular tail for the compact "talk" speech bubble: a square
    # rotated 45°, half-hidden behind the bubble's bottom edge.
    modal_tail = ColorRect.new()
    modal_tail.color = Color(.075, .17, .14, .94)
    modal_tail.size = Vector2(22, 22)
    modal_tail.pivot_offset = Vector2(11, 11)
    modal_tail.rotation_degrees = 45
    modal_tail.mouse_filter = Control.MOUSE_FILTER_IGNORE
    modal_tail.visible = false
    hud.add_child(modal_tail)
    var modal_column := VBoxContainer.new()
    modal_column.add_theme_constant_override("separation", 8)
    modal.add_child(modal_column)
    var scroll := ScrollContainer.new()
    scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
    scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
    modal_column.add_child(scroll)
    var content := VBoxContainer.new()
    modal_content = content
    content.size_flags_horizontal = Control.SIZE_EXPAND_FILL
    content.add_theme_constant_override("separation", 16)
    scroll.add_child(content)
    modal_title = _label(28)
    modal_title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
    content.add_child(modal_title)
    modal_body = _label(22)
    content.add_child(modal_body)
    trail_map = preload("res://scripts/trail_map.gd").new()
    content.add_child(trail_map)
    banner_choices = GridContainer.new()
    banner_choices.add_theme_constant_override("separation", 8)
    modal_column.add_child(banner_choices)
    for id in ["blue", "gold", "green"]:
        var button := _button(banner_choices, choose_camp_banner.bind(id))
        button.custom_minimum_size.y = 52
        button.size_flags_horizontal = Control.SIZE_EXPAND_FILL
        banner_buttons.append(button)
    primary = _button(modal_column, _primary_action)
    primary.custom_minimum_size.y = 54
    language_button.move_to_front()
    secondary = _button(modal_column, _secondary_action)
    secondary.custom_minimum_size.y = 46

func _ui_pixel_ratio() -> float:
    # With stretch disabled, Web canvas pixels can be DPR-scaled backing pixels.
    # Size UI in CSS pixels, independently of the 3D viewport and player input.
    if OS.has_feature("web"):
        var css_width = JavaScriptBridge.eval("document.querySelector('canvas')?.getBoundingClientRect().width || 0")
        if css_width is float or css_width is int:
            if css_width > 0:
                return maxf(1.0, get_viewport().get_visible_rect().size.x / float(css_width))
    return 1.0

func _layout_ui(update_density: bool = true) -> void:
    if update_density:
        _ui_ratio = _ui_pixel_ratio()
    var ratio := _ui_ratio
    var size := get_viewport().get_visible_rect().size / ratio
    hud.scale = Vector2.ONE * ratio
    hud.size = size
    var short_screen := size.y < 430
    var narrow := size.x < 700 and not short_screen
    header.position = Vector2(12, 12)
    # Size the world objective to its content, never to the entire landscape.
    # Keep type fixed and allow longer translations to wrap naturally.
    var text_width := objective.get_theme_font("font").get_string_size(objective.text, HORIZONTAL_ALIGNMENT_LEFT, -1, 22).x
    if counter.visible:
        text_width = maxf(text_width, counter.get_theme_font("font").get_string_size(counter.text, HORIZONTAL_ALIGNMENT_LEFT, -1, 18).x)
    var card_limit := minf(440, size.x - 24 if narrow else size.x - 264)
    header.size = Vector2(minf(card_limit, maxf(220, text_width + 28)), 0)
    objective.add_theme_font_size_override("font_size", 22)
    counter.add_theme_font_size_override("font_size", 18)
    # Portrait: one readable objective, then a single utility row. No narrow
    # text column beside a tower of buttons. Landscape leaves the view open.
    var row_y := header.position.y + header.get_combined_minimum_size().y + 8.0 if narrow else 12.0
    language_button.position = Vector2(12 if narrow else size.x - 188, row_y)
    language_button.size = Vector2(60, 48)
    pause_button.position = Vector2(80 if narrow else size.x - 120, row_y)
    pause_button.size = Vector2(108, 48)
    map_button.position = Vector2(196 if narrow else size.x - 244, row_y if narrow else 68)
    map_button.size = Vector2(112 if narrow else 88, 48)
    rewards_button.position = Vector2(12 if narrow else size.x - 148, row_y + 56 if narrow else 68)
    rewards_button.size = Vector2(136, 48)
    jump_button.position = Vector2(size.x - 124, size.y - 182)
    jump_button.size = Vector2(112, 68)
    action_button.position = Vector2(size.x - 212, size.y - 102)
    action_button.size = Vector2(200, 68)
    if short_screen:
        map_button.position = Vector2(size.x - 332, 12)
        map_button.size = Vector2(136, 48)
        rewards_button.position = Vector2(size.x - 188, 68)
        header.size.x = minf(header.size.x, size.x - 356)
        jump_button.position.y = size.y - 168
        jump_button.size.y = 56
    notice.position = Vector2(12, row_y + 114 if narrow else header.position.y + header.get_combined_minimum_size().y + 8)
    notice.size = Vector2(size.x - 24 if narrow else minf(500, size.x - 356), 80)
    notice.horizontal_alignment = HORIZONTAL_ALIGNMENT_LEFT
    input_hint.visible = false # Instructions remain in Pause; do not crowd play.
    # Short lines (a villager greeting, Mira's one-liner) read as a comic
    # bubble; longer instructional text (Oren's tutorial, chapter intros)
    # keeps the full panel so it is not clipped into a tiny box.
    var is_talk := modal_kind in ["talk", "water_talk"] and modal_body.text.length() <= 180
    var width := minf(340, size.x - 40) if is_talk else minf(620, size.x - 24)
    modal_title.add_theme_font_size_override("font_size", 17 if is_talk else 28)
    modal_body.add_theme_font_size_override("font_size", 16 if is_talk else 22)
    modal_content.add_theme_constant_override("separation", 4 if is_talk else 12)
    primary.custom_minimum_size.y = 38 if is_talk else 54
    primary.add_theme_font_size_override("font_size", 15 if is_talk else 20)
    banner_choices.columns = 1 if width < 420 else 3
    # Fixed, not auto-sized: a wrapped Label's minimum height isn't reliably
    # known the same frame its width changes, so auto-sizing clipped text.
    var height := 220.0 if is_talk else minf(660, size.y - 84)
    modal.size = Vector2(width, height)
    if is_talk:
        # A speech bubble near the top of the screen, tail pointing down at
        # the scene below, rather than a screen-covering panel for one line.
        modal.position = Vector2((size.x - width) * .5, 96)
        modal_tail.position = Vector2(size.x * .5 - 11, 96 + height - 3)
    else:
        modal.position = Vector2((size.x - width) * .5, 72 + (size.y - 84 - height) * .5)
    # Language remains reachable above modals without obscuring their text.
    if paused:
        language_button.position = Vector2(size.x - 76, 16)
        modal_content.add_theme_constant_override("separation", 12)

func _refresh_ui() -> void:
    var goal := t("Find the lamb's tracks", "Найди следы ягнёнка")
    if trail_found:
        goal = t("Follow the tracks", "Иди по следам")
    if crossing_found:
        goal = t("Repair the bridge", "Почини мостик")
    if carrying >= 0:
        goal = t("Log to the bridge", "Неси бревно к мостику")
    elif bridge_stage == 2:
        goal = t("Follow the bell · find the lamb", "Иди на звон · найди ягнёнка")
        if lamb_found:
            goal = t("Call the lamb gently", "Ласково позови ягнёнка")
    if following:
        goal = t("Bring the lamb home", "Приведи ягнёнка домой")
        if player.position.distance_to(lamb.position) > 9:
            goal = t("The lamb is waiting · return to it", "Ягнёнок ждёт · вернись к нему")
    if completed:
        goal = t("Home together · explore the clearing", "Вместе дома · исследуй поляну")
    objective.text = goal
    if campaign.stage > 0:
        objective.text = campaign.objective()
        if campaign.stage == 6:
            objective.text = t("Next: find 3 seed pouches for the garden", "Дальше: найди 3 мешочка семян для сада") if not garden_saved else t("Everyone home · explore or start a new rescue", "Все дома · гуляй или начни спасение заново")
        campaign.warning.text = t("Distant lion · prototype marker", "Лев вдали · временный знак")
    counter.text = ""
    counter.visible = crossing_found and bridge_stage < 2
    if crossing_found and bridge_stage < 2:
        counter.text = t("Bridge logs %d/2", "Брёвна для моста: %d/2") % bridge_stage
    # Persistent equipped-state feedback survives the short pickup toast.
    # No fictitious slots or new inventory mechanics: only the actual held log.
    if carrying >= 0:
        counter.visible = true
        counter.text = t("Holding: log · bridge %d/2", "В руках: бревно · мост %d/2") % bridge_stage
    counter.add_theme_color_override("font_color", Color("ffe09b") if carrying >= 0 else Color.WHITE)
    if campaign.stage > 0:
        counter.text = campaign.progress_text()
        if campaign.stage == 6 and not garden_saved:
            counter.text = t("Seed pouches: %d/3", "Мешочки семян: %d/3") % seeds_found.size()
        counter.visible = not counter.text.is_empty()
    language_button.text = "EN" if language == "ru" else "RU"
    pause_button.text = t("Pause", "Пауза")
    map_button.text = t("Map", "Карта")
    map_button.visible = not paused and not caves.active and not water_chapter.active
    rewards_button.visible = not paused
    rewards_button.text = t("Book · %d", "Книга · %d") % adventure_points
    banner_choices.visible = modal_kind in ["complete", "rewards"] and rewards.earned.has("rescue")
    var color_ids := ["blue", "gold", "green"]
    var color_names := [t("Blue", "Синий"), t("Gold", "Золотой"), t("Green", "Зелёный")]
    for i in range(banner_buttons.size()):
        banner_buttons[i].text = color_names[i]
        banner_buttons[i].modulate = Color("ffe09b") if camp_banner_color == color_ids[i] else Color.WHITE
    trail_map.visible = modal_kind == "map"
    modal_body.visible = modal_kind != "map"
    jump_button.text = t("Jump", "Прыжок")
    action_button.visible = context_kind != "" and not paused
    action_button.text = {"pickup":t("Pick up", "Взять"), "place":t("Place log", "Положить бревно"), "seed":t("Collect", "Собрать"), "call":t("Call", "Позвать"), "talk":t("Talk", "Поговорить"), "door":(t("Close", "Закрыть") if context_kind == "door" and world.cottages[context_index].get_meta("door_open") else t("Open", "Открыть"))}.get(context_kind, "")
    if campaign.stage > 0 and context_kind not in ["seed", "talk", "door"]:
        action_button.text = campaign.action_text()
    if caves.active or context_kind == "caves": action_button.text = caves.action_text()
    if water_chapter.active or context_kind == "water_start": action_button.text = water_chapter.action_text()
    input_hint.text = t("WASD · drag to look · Space · E", "WASD · веди, чтобы осмотреться · Пробел · E") if not DisplayServer.is_touchscreen_available() else t("Left: move · Right: look", "Слева: идти · справа: смотреть")
    var notices := {"water":t("Back on shore. Log safe!", "Ты на берегу. Бревно цело!"), "carry":t("Walk to the glowing outline by the crossing.", "Иди к светлому контуру у мостика."), "placed":t("One more log!", "Нужно ещё одно бревно!"), "bridge":t("You made a way across. Listen for the lamb!", "Теперь можно перейти. Прислушайся к ягнёнку!"), "seed":t("A seed pouch for the camp garden.", "Семена для сада в лагере."), "garden":t("The camp garden is growing!", "В лагере появился сад!"), "follow":t("It trusts you. Stay close and lead it home.", "Он доверяет тебе. Будь рядом и веди домой.")}
    notice.text = notices.get(notice_key, "") if notice_timer > 0 else ""
    var flock_notices := {"flock_step":t("Well done! Follow your next goal.", "Получилось! Смотри на следующую цель."), "flock_wood":t("Board collected. Follow the marker to the fence.", "Доска у тебя. Иди к метке у ограды."), "flock_repair":t("One rail repaired!", "Одна секция готова!"), "flock_call":t("They heard you. Walk slowly and stay close.", "Овечки услышали. Иди медленно и будь рядом."), "flock_count":t("One more sheep counted safely home.", "Ещё одна овечка дома. Посчитали!")}
    if notice_timer > 0 and flock_notices.has(notice_key):
        notice.text = flock_notices[notice_key]
    var discoveries := {"tracks": t("Little hoofprints! Where do they lead?", "Маленькие следы! Куда они ведут?"), "crossing": t("The tracks cross the creek! Let's fix the bridge.", "Следы ведут через ручей! Починим мостик."), "found": t("You found it! Get close and call gently.", "Ты нашёл ягнёнка! Подойди и ласково позови.")}
    if notice_timer > 0 and discoveries.has(notice_key):
        notice.text = discoveries[notice_key]
    # A previous discovery must not contradict the child's latest action.
    if carrying >= 0 and notice_key in ["tracks", "crossing", "carry"] and notice_timer > 0:
        notice.text = t("Take it to the bridge outline.", "Неси к контуру мостика.")
    if paused:
        _tap_candidates.clear()
    shade.visible = paused
    modal.visible = paused
    jump_button.visible = not paused
    secondary.visible = modal_kind in ["pause", "flock_complete"]
    modal_body.add_theme_font_size_override("font_size", 22)
    if modal_kind == "intro":
        modal_title.text = t("The Lost Lamb", "Потерявшийся ягнёнок")
        modal_body.text = t("A lamb is missing! Follow the tracks and bell. Bring it home.\n\n", "Ягнёнок потерялся! Иди по следам и на звон. Приведи его домой.\n\n") + (LUKE_RU if language == "ru" else LUKE_EN)
        primary.text = t("Let’s find it!", "Найти малыша!")
        if campaign.stage > 0:
            modal_title.text = t("Care for the flock", "Позаботься о стаде")
            modal_body.text = t("A make-believe shepherd adventure. Walk close, call gently, and move slowly so every sheep can follow. Return for waiting sheep.\n\n", "Это выдуманное приключение пастуха. Подойди, позови и иди медленно. Вернись за отставшими овечками.\n\n") + campaign.objective()
            primary.text = t("Continue", "Продолжить")
    elif modal_kind == "map":
        modal_title.text = t("Find the way home", "Найди дорогу домой")
        if campaign.stage > 0: modal_title.text = campaign.objective()
        trail_map.set_language(language)
        primary.text = t("Continue", "Продолжить")
    elif modal_kind == "complete":
        modal_title.text = t("Home together!", "Вместе дома!")
        modal_body.text = t("The lamb is home! Choose your camp banner.\n\n", "Ягнёнок дома! Выбери флаг лагеря.\n\n") + (JOHN_RU if language == "ru" else JOHN_EN)
        modal_body.text += "\n\n" + t("Adventure Points: %d / %d", "Очки приключения: %d / %d") % [adventure_points, rewards.CAP]
        modal_body.text += t("\nJesus saves us. Rescue is not a prize we earn with points.", "\nИисус спасает нас. Спасение нельзя заработать очками.")
        if not saves_ok:
            modal_body.text += t("\nThis browser could not save your camp reward.", "\nБраузер не смог сохранить награду лагеря.")
        primary.text = t("Care for the flock", "Позаботиться о стаде")
    elif modal_kind == "flock_complete":
        modal_title.text = t("Every sheep is home!", "Все овечки дома!")
        modal_body.text = t("You gathered, guided, repaired, sheltered, and counted the flock. Thank you for caring for every sheep!\n\n", "Ты собрал стадо, починил ограду, укрыл овечек и привёл всех домой. Спасибо за заботу!\n\n") + (JOHN_RU if language == "ru" else JOHN_EN)
        modal_body.text += t("\n\nNext: follow the clues in three caves and bring another lamb home. You can also explore the clearing. Your earned rewards stay with you.", "\n\nДальше: изучи следы в трёх пещерах и приведи домой ещё одного ягнёнка. Можно и погулять на поляне. Твои награды останутся.")
        if not saves_ok: modal_body.text += "\n" + campaign.progress_text()
        primary.text = t("Explore the clearing", "Исследовать поляну")
    elif modal_kind == "talk":
        var v: Dictionary = villagers[talk_index]
        modal_title.text = t(v.en, v.ru)
        modal_body.text = _villager_line(v)
        primary.text = t("Thank you!", "Спасибо!")
    elif modal_kind == "rewards":
        modal_title.text = t("My adventure book", "Моя книга приключений")
        modal_body.text = _reward_summary()
        if not saves_ok:
            modal_body.text += t("\nCould not save on this device.", "\nНе удалось сохранить на этом устройстве.")
        primary.text = t("Continue", "Продолжить")
    else:
        modal_title.text = t("Take a breath", "Передохни")
        modal_body.text = (LUKE_RU if language == "ru" else LUKE_EN) + t("\n\nWalk: WASD / left joystick\nLook: drag on the right\nJump: Space / Jump\nInteract: tap a nearby log, seed pouch, bridge outline, door or villager / E / action button", "\n\nИдти: WASD / левый джойстик\nСмотреть: вести справа\nПрыгать: Пробел / Прыжок\nДействовать: коснись бревна, семян, контура моста, двери или жителя рядом / E / кнопка")
        primary.text = t("Continue", "Продолжить")
    secondary.text = t("New rescue", "Начать заново")
    if modal_kind == "flock_complete": secondary.text = t("Explore clearing", "Гулять на поляне")
    if caves.active and modal_kind == "pause": secondary.text = t("Return to clearing", "На поляну")
    if not saves_ok and modal_kind == "pause":
        modal_body.text += t("\nCould not save. New rescue will wait until saving works.", "\nНе удалось сохранить. Начнём заново, когда сохранение заработает.")
    if caves.active:
        objective.text = caves.objective()
        counter.text = caves.progress_text()
        counter.visible = true
        notice.text = caves.notice_text()
        caves.sync_labels()
        if modal_kind in ["intro", "cave_intro", "pause"]:
            modal_title.text = t("The three caves", "Три пещеры")
            modal_body.text = caves.intro_text() + caves.credits()
            primary.text = t("Continue", "Продолжить")
        elif modal_kind == "cave_complete":
            modal_title.text = t("The lamb is safe!", "Ягнёнок в безопасности!")
            modal_body.text = t("You protected the flock and brought the lamb home. Next, Mira needs help bringing water to the village garden.", "Ты защитил стадо и привёл ягнёнка домой. Теперь Мире нужна помощь: вернуть воду в деревенский сад.") + "\n\n" + (JOHN_RU if language == "ru" else JOHN_EN)
            primary.text = t("Next: water for the village", "Дальше: вода для деревни")
    elif campaign.stage == 6:
        objective.text = t("Next: return to camp for the three caves", "Дальше: вернись в лагерь к трём пещерам") if caves.stage < 6 else t("All safe · explore for garden seeds", "Все в безопасности · ищи семена для сада")
        if modal_kind == "flock_complete":
            primary.text = t("Continue to caves", "Дальше: пещеры")
    if caves.active and paused and not saves_ok:
        modal_body.text += t("\n\nNot saved on this device. Keep playing; leaving may lose this checkpoint.", "\n\nНе сохранено на устройстве. Можно играть дальше, но при выходе этот шаг может потеряться.")
    if caves.stage == 6 and not water_chapter.active:
        objective.text = t("Next: village water · return to camp", "Дальше: вода для сада · вернись в лагерь")
        if modal_kind == "intro":
            modal_title.text = t("Next: water for the village", "Дальше: вода для деревни")
            modal_body.text = t("The flock is safe. A dry garden needs your help. Meet Mira and Oren in a new fictional village adventure.", "Стадо в безопасности. Сухому саду нужна помощь. Встреть Миру и Орена в новом выдуманном приключении.")
            primary.text = t("Continue", "Продолжить")
    water_chapter.refresh_ui()
    shade.visible = paused and modal_kind != "talk"
    modal_tail.visible = paused and modal_kind == "talk"
    header.visible = not paused
    pause_button.visible = not paused
    notice.visible = not paused
    _layout_ui(false)

func _telemetry() -> void:
    if not OS.has_feature("web"):
        return
    var cam: Camera3D = player.get_camera()
    var payload := {"version":"block-1", "position":[player.position.x, player.position.y, player.position.z], "bridge":bridge_stage, "carrying":carrying, "following":following, "lamb":[lamb.position.x,lamb.position.y,lamb.position.z], "complete":completed, "paused":paused, "context":context_kind, "language":language, "seeds":seeds_found.size(), "reward_saved":reward_saved, "garden_saved":garden_saved, "save_ok":saves_ok, "recoveries":recoveries, "camera":[cam.position.x,cam.position.y,cam.position.z]}
    var points := {}
    for pair in [["primary", primary], ["secondary", secondary], ["action", action_button], ["jump", jump_button], ["language", language_button], ["pause", pause_button], ["map", map_button], ["rewards", rewards_button], ["banner_blue", banner_buttons[0]], ["banner_gold", banner_buttons[1]], ["banner_green", banner_buttons[2]]]:
        var center: Vector2 = pair[1].get_global_rect().get_center()
        points[pair[0]] = [center.x, center.y]
    payload["ui"] = points
    payload["tap_target"] = _world_tap_target()
    payload["yaw"] = player._yaw
    payload["viewport"] = [get_viewport().get_visible_rect().size.x, get_viewport().get_visible_rect().size.y]
    payload["fps"] = Engine.get_frames_per_second()
    payload["tick"] = Engine.get_physics_frames()
    payload["trail_found"] = trail_found
    payload["crossing_found"] = crossing_found
    payload["lamb_found"] = lamb_found
    payload["map_open"] = modal_kind == "map"
    payload["adventure_points"] = adventure_points
    payload["adventure_points_cap"] = rewards.CAP
    payload["earned_rewards"] = rewards.earned.keys()
    payload["camp_banner_color"] = camp_banner_color
    payload["rewards_open"] = modal_kind == "rewards"
    payload["campaign_stage"] = campaign.stage
    payload["caves"] = caves.snapshot()
    payload["cave_health"] = caves.health
    payload["cave_phase"] = caves.phase
    JavaScriptBridge.eval("window.__trailBlock=" + JSON.stringify(payload), true)
