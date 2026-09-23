extends Node3D
## A complete small adventure: free exploration, physical repair, and rescue.
const SPAWN := Vector3(-11, 0.15, 7)
const CAMP := Vector3(-11, 0, 7)
const LAMB_DISCOVERY_RADIUS := 2.6
const LAMB_ALCOVE := Vector3(18.5, .02, -11)
var lamb_exit_route: Array[Vector3] = []
const LUKE_EN := "Luke 19:10 · ESV\n“For the Son of Man came to seek and to save the lost.”"
const LUKE_RU := "Луки 19:10 · Синодальный перевод\n«ибо Сын Человеческий пришел взыскать и спасти погибшее»."
const JOHN_EN := "John 10:11 · ESV\n“I am the good shepherd. The good shepherd lays down his life for the sheep.”"
const JOHN_RU := "Иоанна 10:11 · Синодальный перевод\n«Я есмь пастырь добрый: пастырь добрый полагает жизнь свою за овец»."
signal camp_banner_changed(color_id: String)
var rewards = preload("res://scripts/adventure_rewards.gd").new()
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
var banner_choices: HBoxContainer
var banner_buttons: Array[Button] = []
var map_button: Button
var trail_map: Control
var modal: PanelContainer
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
    _build_ui()
    get_viewport().size_changed.connect(_layout_ui)
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
        _box(pouch, Vector3.ZERO, Vector3(.42, .48, .33), Color("e4bd6a"))
        _box(pouch, Vector3(0, .29, 0), Vector3(.26, .12, .23), Color("557a44"))
        seeds.append(pouch)
    lamb = Node3D.new()
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

func _physics_process(delta: float) -> void:
    if paused:
        return
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
    preview.visible = carrying >= 0 and not paused
    preview.position.x = 3.85 if bridge_stage == 0 else 6.15
    if not paused:
        _refresh_ui()
    telemetry_timer -= delta
    if telemetry_timer <= 0:
        telemetry_timer = .15
        _telemetry()

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
    var direction: Vector3 = target - lamb.position
    direction.y = 0
    var routing: bool = target.distance_to(player.position) > .1
    var walking: bool = direction.length() > (.18 if routing else 1.35) or (lamb.position.x > 2.5 and lamb.position.x < 7.5)
    if walking:
        var step: Vector3 = direction.normalized() * minf(4.1 * delta, direction.length())
        lamb.position += step
        lamb.position.y = .03
        lamb.rotation.y = lerp_angle(lamb.rotation.y, atan2(-step.z, step.x), minf(delta * 8, 1))
        lamb_stride += step.length() * 11
    for i in range(lamb_legs.size()):
        if is_instance_valid(lamb_legs[i]):
            lamb_legs[i].rotation.z = sin(lamb_stride + (PI if i >= 2 else 0.0)) * .27 if walking else 0.0

func _choose_context() -> void:
    context_kind = ""
    context_index = -1
    highlight.visible = false
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
        "call":
            following = true
            lamb_exit_route.assign([Vector3(14.8, 0, -11), Vector3(14, 0, -7)])
            _notice("follow")
    _choose_context()
    _refresh_ui()

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
    paused = true
    player.set_enabled(false)
    _refresh_ui()

func _notice(key: String) -> void:
    notice_key = key
    notice_timer = 4.0
    cue.stream = preload("res://scripts/audio.gd").tone(660.0 if key in ["bridge", "garden", "follow"] else 440.0)
    cue.play()

func _toggle_pause() -> void:
    if modal_kind == "intro" or modal_kind == "complete":
        return
    paused = not paused
    modal_kind = "pause" if paused else ""
    player.set_enabled(not paused)
    _refresh_ui()

func _open_map() -> void:
    if paused:
        return
    paused = true
    modal_kind = "map"
    player.set_enabled(false)
    trail_map.set_language(language)
    trail_map.set_state(player.position, bridge_stage, lamb_found, lamb.position, completed)
    _refresh_ui()

func _primary_action() -> void:
    paused = false
    modal_kind = ""
    player.set_enabled(true)
    _refresh_ui()

func _secondary_action() -> void:
    get_tree().reload_current_scene()

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

func _save_progress() -> void:
    var text := JSON.stringify({"version": 2, "rescued": reward_saved, "garden": garden_saved, "rewards": rewards.snapshot()})
    if OS.has_feature("web"):
        saves_ok = JavaScriptBridge.eval("(function(){try{localStorage.setItem('jd.block.v1'," + JSON.stringify(text) + ");return true}catch(e){return false}})()") == true
    else:
        var file := FileAccess.open("user://block_save.json", FileAccess.WRITE)
        saves_ok = file != null
        if file:
            file.store_string(text)
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
    button.add_theme_font_size_override("font_size", 18)
    button.focus_mode = Control.FOCUS_NONE
    button.pressed.connect(callback)
    parent.add_child(button)
    return button

func _build_ui() -> void:
    var layer := CanvasLayer.new()
    layer.layer = 20
    add_child(layer)
    hud = Control.new()
    hud.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
    hud.mouse_filter = Control.MOUSE_FILTER_IGNORE
    layer.add_child(hud)
    header = PanelContainer.new()
    header.mouse_filter = Control.MOUSE_FILTER_IGNORE
    header.add_theme_stylebox_override("panel", _panel())
    hud.add_child(header)
    var stack := VBoxContainer.new()
    stack.mouse_filter = Control.MOUSE_FILTER_IGNORE
    header.add_child(stack)
    objective = _label(21)
    stack.add_child(objective)
    counter = _label(14)
    stack.add_child(counter)
    language_button = _button(hud, _set_language)
    pause_button = _button(hud, _toggle_pause)
    map_button = _button(hud, _open_map)
    rewards_button = _button(hud, _open_rewards)
    jump_button = _button(hud, func(): player.queue_jump())
    action_button = _button(hud, _interact)
    notice = _label(17)
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
    modal_body = _label(18)
    content.add_child(modal_body)
    trail_map = preload("res://scripts/trail_map.gd").new()
    content.add_child(trail_map)
    banner_choices = HBoxContainer.new()
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

func _layout_ui() -> void:
    var size := get_viewport().get_visible_rect().size
    var narrow := size.x < 700
    header.position = Vector2(14, 14)
    header.size = Vector2(maxf(160, size.x - 176), 100 if narrow else 76)
    objective.add_theme_font_size_override("font_size", 17 if narrow else 21)
    counter.add_theme_font_size_override("font_size", 12 if narrow else 14)
    pause_button.add_theme_font_size_override("font_size", 16 if narrow else 18)
    language_button.position = Vector2(size.x - 150, 18)
    language_button.size = Vector2(62, 52)
    pause_button.position = Vector2(size.x - 80, 18)
    pause_button.size = Vector2(66, 52)
    map_button.position = Vector2(size.x - 150, 78)
    map_button.size = Vector2(136, 48)
    rewards_button.position = Vector2(size.x - 150, 134)
    rewards_button.size = Vector2(136, 48)
    jump_button.position = Vector2(size.x - 96, size.y - 185)
    jump_button.size = Vector2(80, 74)
    action_button.position = Vector2(size.x - 216, size.y - 98)
    action_button.size = Vector2(200, 74)
    if size.y < 430:
        map_button.position = Vector2(size.x - 216, 98)
        map_button.size = Vector2(80, 48)
        rewards_button.position = Vector2(size.x - 128, 98)
        rewards_button.size = Vector2(114, 48)
    notice.position = Vector2(20, 190 if narrow else 150)
    notice.size = Vector2(size.x - (40 if narrow else 240), 65)
    input_hint.position = Vector2(size.x * .28, size.y - 34)
    input_hint.size = Vector2(size.x * .40, 30)
    var width := minf(530, size.x - 32)
    modal_title.add_theme_font_size_override("font_size", 22 if size.y < 500 else 28)
    modal_body.add_theme_font_size_override("font_size", 15 if size.y < 500 else 18)
    modal_content.add_theme_constant_override("separation", 8 if size.y < 500 else 16)
    var height := minf(460, size.y - 28)
    modal.position = Vector2((size.x - width) * .5, (size.y - height) * .5)
    modal.size = Vector2(width, height)

func _refresh_ui() -> void:
    var goal := t("Find the lamb's tracks", "Найди следы ягнёнка")
    if trail_found:
        goal = t("Follow the tracks to the creek", "Иди по следам к ручью")
    if crossing_found:
        goal = t("Repair the bridge to keep searching", "Почини мостик и продолжи поиски")
    if carrying >= 0:
        goal = t("Carry the board to the crossing", "Отнеси доску к мостику")
    elif bridge_stage == 2:
        goal = t("Follow the bell · find the lamb", "Иди на звон · найди ягнёнка")
        if lamb_found:
            goal = t("There you are! Approach and call gently", "Вот ты где! Подойди и позови")
    if following:
        goal = t("Bring your new friend back to camp", "Приведи нового друга в лагерь")
        if player.position.distance_to(lamb.position) > 9:
            goal = t("The lamb is waiting · return to it", "Ягнёнок ждёт · вернись к нему")
    if completed:
        goal = t("Home together · explore the clearing", "Вместе дома · исследуй поляну")
    objective.text = goal
    counter.text = t("THE LOST LAMB · Search, rescue, home", "ПОТЕРЯВШИЙСЯ ЯГНЁНОК · Найди и приведи домой")
    if crossing_found and bridge_stage < 2:
        counter.text = t("Bridge boards %d/2 · Tracks continue across!", "Доски %d/2 · Следы ведут на другой берег!") % bridge_stage
    language_button.text = "EN" if language == "ru" else "RU"
    pause_button.text = t("Pause", "Пауза")
    map_button.text = t("Map", "Карта")
    map_button.visible = not paused
    rewards_button.visible = not paused
    rewards_button.text = t("Book · %d", "Книга · %d") % adventure_points
    banner_choices.visible = modal_kind in ["complete", "rewards"] and rewards.earned.has("rescue")
    var color_ids := ["blue", "gold", "green"]
    var color_names := [t("Blue", "Синий"), t("Gold", "Золотой"), t("Green", "Зелёный")]
    for i in range(banner_buttons.size()):
        banner_buttons[i].text = ("* " if camp_banner_color == color_ids[i] else "") + color_names[i]
    trail_map.visible = modal_kind == "map"
    modal_body.visible = modal_kind != "map"
    jump_button.text = t("Jump", "Прыжок")
    action_button.visible = context_kind != "" and not paused
    action_button.text = {"pickup":t("Pick up", "Взять"), "place":t("Place board", "Положить доску"), "seed":t("Collect", "Собрать"), "call":t("Call gently", "Позвать ласково")}.get(context_kind, "")
    input_hint.text = t("WASD · drag to look · Space · E", "WASD · веди, чтобы осмотреться · Пробел · E") if not DisplayServer.is_touchscreen_available() else t("Left: move · Right: look", "Слева: идти · справа: смотреть")
    var notices := {"water":t("Back on safe ground. You kept your board.", "Снова на берегу. Доска осталась у тебя."), "carry":t("Walk to the glowing outline by the crossing.", "Иди к светлому контуру у мостика."), "placed":t("One more board will finish the crossing.", "Ещё одна доска — и мостик готов."), "bridge":t("You made a way across. Listen for the lamb!", "Теперь можно перейти. Прислушайся к ягнёнку!"), "seed":t("A seed pouch for the camp garden.", "Семена для сада в лагере."), "garden":t("The camp garden is growing!", "В лагере появился сад!"), "follow":t("It trusts you. Stay close and lead it home.", "Он доверяет тебе. Будь рядом и веди домой.")}
    notice.text = notices.get(notice_key, "") if notice_timer > 0 else ""
    var discoveries := {"tracks": t("Little hoofprints! Where do they lead?", "Маленькие следы! Куда они ведут?"), "crossing": t("The tracks cross the creek! Let's fix the bridge.", "Следы ведут через ручей! Починим мостик."), "found": t("You found it! Get close and call gently.", "Ты нашёл ягнёнка! Подойди и ласково позови.")}
    if notice_timer > 0 and discoveries.has(notice_key):
        notice.text = discoveries[notice_key]
    shade.visible = paused
    modal.visible = paused
    jump_button.visible = not paused
    secondary.visible = modal_kind not in ["intro", "map", "complete"]
    var short_screen := get_viewport().get_visible_rect().size.y < 500
    modal_content.add_theme_constant_override("separation", 8 if modal_kind == "complete" or short_screen else 16)
    modal_body.add_theme_font_size_override("font_size", 15 if short_screen else (16 if modal_kind == "complete" else 18))
    if modal_kind == "intro":
        modal_title.text = t("The Lost Lamb", "Потерявшийся ягнёнок")
        modal_body.text = t("One little lamb slipped out of the fold!\n\nYour assignment: follow its hoofprints, listen for its bell, and bring it safely home. Start by looking along the path.\n\n", "Один ягнёнок выбежал из загона!\n\nТвоё задание: найди следы, прислушайся к колокольчику и приведи ягнёнка домой. Начни с тропинки.\n\n") + (LUKE_RU if language == "ru" else LUKE_EN)
        primary.text = t("Find the little explorer!", "Найти малыша!")
    elif modal_kind == "map":
        modal_title.text = t("Find the way home", "Найди дорогу домой")
        trail_map.set_language(language)
        primary.text = t("Back to the adventure", "Вернуться к приключению")
    elif modal_kind == "complete":
        modal_title.text = t("Home together!", "Вместе дома!")
        modal_body.text = t("The lamb is home! Choose your camp banner.\n\n", "Ягнёнок дома! Выбери флаг лагеря.\n\n") + (JOHN_RU if language == "ru" else JOHN_EN)
        modal_body.text += "\n\n" + t("Adventure Points: %d / %d", "Очки приключения: %d / %d") % [adventure_points, rewards.CAP]
        modal_body.text += t("\nJesus saves us. Rescue is not a prize we earn with points.", "\nИисус спасает нас. Спасение нельзя заработать очками.")
        if not saves_ok:
            modal_body.text += t("\nThis browser could not save your camp reward.", "\nБраузер не смог сохранить награду лагеря.")
        primary.text = t("Keep exploring", "Исследовать дальше")
    elif modal_kind == "rewards":
        modal_title.text = t("My adventure book", "Моя книга приключений")
        modal_body.text = _reward_summary()
        if not saves_ok:
            modal_body.text += t("\nCould not save on this device.", "\nНе удалось сохранить на этом устройстве.")
        primary.text = t("Back to the adventure", "Вернуться к приключению")
    else:
        modal_title.text = t("Take a breath", "Передохни")
        modal_body.text = (LUKE_RU if language == "ru" else LUKE_EN) + t("\n\nWalk: WASD / left joystick\nLook: drag on the right\nJump: Space / Jump\nInteract: E / nearby action", "\n\nИдти: WASD / левый джойстик\nСмотреть: вести справа\nПрыгать: Пробел / Прыжок\nДействовать: E / кнопка рядом")
        primary.text = t("Continue", "Продолжить")
    secondary.text = t("Start a new rescue", "Начать спасение заново")

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
    JavaScriptBridge.eval("window.__trailBlock=" + JSON.stringify(payload), true)
