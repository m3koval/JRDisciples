extends Node3D
## Original fictional village service adventure, not a Bible event.
const START := Vector3(150, .15, 10)
const GARDENER := Vector3(150, 0, 7)
const KEEPER := Vector3(156, 0, -11)
const SLUICE := Vector3(158, 0, -5)
const SPILL := Vector3(158, 0, -2)
const FEED := Vector3(158, 0, -8)
const GATE := Vector3(158, 0, 5.1)
const STEPS := ["need", "plan", "cleared", "repaired", "spill_closed", "feed_open", "garden_open", "keeper_thanked", "garden_thanked"]
const Construction = preload("res://scripts/irrigation_construction.gd")
const PLAN := Vector3(153,0,-9)
const SUPPLY := Vector3(154,0,-4)
var construction = Construction.new()
var channel_geometry = preload("res://scripts/irrigation_geometry.gd").new()
var garden_lighting = preload("res://scripts/garden_lighting.gd").new()
var supply_meshes: Array[MeshInstance3D] = []
var support_mesh: MeshInstance3D
var crest: MeshInstance3D
var seal_mesh: MeshInstance3D
var soil_mesh: MeshInstance3D
var demo
var demo_water: Array[MeshInstance3D] = []
var host
var active := false
var completed_steps: Array[String] = []
var stage: int:
    get: return completed_steps.size()
var actors: Array[Node3D] = []
var labels: Array[Label3D] = []
var gates: Array[Node3D] = []
var water: Array[MeshInstance3D] = []
var ripples: Array[MeshInstance3D] = []
var plants: Array[Node3D] = []
var debris: Node3D
var repair: MeshInstance3D
var produce: Node3D
var spill_water: MeshInstance3D
var clock := 0.0
var wrong_time := 0.0
var message_en := ""
var message_ru := ""
var dialogue_en := ""
var dialogue_ru := ""
var speaker := 0
var spilling := false

func t(en: String, ru: String) -> String: return host.t(en, ru)

func load_checkpoint(data: Variant, cave_stage: int) -> void:
    active = false
    construction = Construction.new()
    completed_steps.clear()
    if cave_stage != 6 or not data is Dictionary: return
    if not data.get("active") is bool or not data.get("steps") is Array: return
    var values: Array = data.steps
    if values.size() > STEPS.size(): return
    for i in range(values.size()):
        if not values[i] is String or values[i] != STEPS[i]: return
    active = data.active
    for value in values: completed_steps.append(value)
    if data.has("construction"): construction.restore(data.construction)
    # Old earned steps remain; construction starts fresh without losing harvest.

func snapshot() -> Dictionary:
    return {"active": active, "steps": completed_steps.duplicate(), "construction":construction.snapshot()}

func solid(pos: Vector3, size: Vector3, color: Color, show_mesh := true) -> void:
    if show_mesh: host._box(self, pos, size, color)
    var body := StaticBody3D.new()
    body.position = pos
    var shape := CollisionShape3D.new()
    var box := BoxShape3D.new()
    box.size = size
    shape.shape = box
    body.add_child(shape)
    add_child(body)

func sign_at(pos: Vector3) -> Label3D:
    var label := Label3D.new()
    label.position = pos
    label.font_size = 28
    label.pixel_size = .004
    label.billboard = BaseMaterial3D.BILLBOARD_ENABLED
    label.no_depth_test = false
    label.visibility_range_end = 7.5
    add_child(label)
    labels.append(label)
    return label

# CPU skin evaluation also works before the render server registers the skin.
# Imported mesh AABBs omit bind transforms (these rigs differ by 100x there).
static func posed_bounds(mesh: MeshInstance3D) -> AABB:
    if mesh.skin == null: return mesh.global_transform * mesh.get_aabb()
    var skeleton := mesh.get_node(mesh.skeleton) as Skeleton3D
    var skin := mesh.skin
    var transforms: Array[Transform3D] = []
    for bind in range(skin.get_bind_count()):
        var bone := skin.get_bind_bone(bind)
        if bone < 0: bone = skeleton.find_bone(skin.get_bind_name(bind))
        transforms.append(skeleton.global_transform * skeleton.get_bone_global_pose(bone) * skin.get_bind_pose(bind))
    var result := AABB()
    var first := true
    for surface in range(mesh.mesh.get_surface_count()):
        var arrays := mesh.mesh.surface_get_arrays(surface)
        var vertices: PackedVector3Array = arrays[Mesh.ARRAY_VERTEX]
        var bones: PackedInt32Array = arrays[Mesh.ARRAY_BONES]
        var weights: PackedFloat32Array = arrays[Mesh.ARRAY_WEIGHTS]
        var stride := bones.size() / vertices.size()
        for v in range(vertices.size()):
            var point := Vector3.ZERO
            for k in range(stride):
                var i := v*stride+k
                if weights[i] > 0: point += (transforms[bones[i]] * vertices[v]) * weights[i]
            result = AABB(point, Vector3.ZERO) if first else result.expand(point)
            first = false
    return result

func make_person(file: String, at: Vector3, gardener: bool) -> void:
    # Existing lawful generated adult rigs, instanced without touching shared resources.
    var actor := Node3D.new()
    actor.name = "Mira_Gardener" if gardener else "Oren_Waterkeeper"
    actor.position = at
    add_child(actor)
    var model := (load("res://assets/villagers/" + file + ".glb") as PackedScene).instantiate() as Node3D
    # Source rigs are already feet-origin adults, not centered unit proxies.
    # Normalize their authored mesh bounds, never offset by half the scale.
    actor.add_child(model)
    var animations := model.find_children("*", "AnimationPlayer", true, false)
    if not animations.is_empty():
        var anim := animations.front() as AnimationPlayer
        if not anim.get_animation_list().is_empty():
            anim.play(anim.get_animation_list()[0])
            anim.advance(0)
            anim.stop(false)
    var extent := AABB()
    var first := true
    for item in model.find_children("*", "MeshInstance3D", true, false):
        var mesh := item as MeshInstance3D
        var b: AABB = actor.global_transform.affine_inverse() * posed_bounds(mesh)
        extent = b if first else extent.merge(b)
        first = false
    var stature := 1.70 if gardener else 1.78
    var factor := stature / extent.size.y
    model.scale = Vector3.ONE * factor
    model.position.y = -extent.position.y * factor
    actor.set_meta("stature", stature)
    # Preserve authored clothing instead of covering it with rigid proxy panels.
    # Role props distinguish these model variants until new character art is approved.
    if gardener:
        preload("res://scripts/garden_detail.gd").basket(actor,Vector3(.70,0,.1))
    else:
        host._box(actor, Vector3(.65,.85,0), Vector3(.09,1.7,.09), Color("bb945e"))
        for n in range(4): host._box(actor,Vector3(.65,.4+n*.3,.05),Vector3(.17,.035,.03),Color("f0e0b8"))
    var body := StaticBody3D.new()
    body.collision_layer = 2
    var collision := CollisionShape3D.new()
    var capsule := CapsuleShape3D.new()
    capsule.radius = .3
    capsule.height = stature
    collision.shape = capsule
    collision.position.y = stature * .5
    body.add_child(collision)
    actor.add_child(body)
    actors.append(actor)
    sign_at(at + Vector3.UP*(stature + .25))

func _ready() -> void:
    name = "WaterForTheVillage"
    # Offset chapter uses its own floor, beyond the old world and cave colliders.
    solid(Vector3(160,-.5,0),Vector3(32,1,32),Color("a5aa70"))
    for x in [144,176]: solid(Vector3(x,1,0),Vector3(.6,2,32),Color("9b9477"),false)
    for z in [-16,16]: solid(Vector3(160,1,z),Vector3(32,2,.6),Color("9b9477"),false)
    var landscape := preload("res://scripts/water_environment.gd").new()
    add_child(landscape)
    # All water surfaces below are solver cells, not story-stage reveals.
    channel_geometry.build(self)
    preload("res://scripts/garden_footbridge.gd").build(self,channel_geometry)
    soil_mesh = host._box(self,Vector3(155.2,.10,6.375),Vector3(8,.06,1.25),Color("715d45"))
    support_mesh = channel_geometry.dressed(self,Vector3(160,.30,-5),Vector3(2,.6,.7))
    crest = channel_geometry.dressed(self,Vector3(160,2,-3),Vector3(1.7,.12,.15),true)
    seal_mesh = host._box(self,Vector3(160,.65,-3.1),Vector3(1.7,.04,.16),Color("584a3b"))
    for i in range(3):
        supply_meshes.append(channel_geometry.dressed(self,SUPPLY+Vector3(i*.45,.2,0),Vector3(.35,.4,.7),i == 1))
        if i == 2: supply_meshes[i].material_override = host._material(Color("8c684c"))
    preload("res://scripts/garden_workshop_art.gd").build(self)
    sign_at(PLAN+Vector3.UP*1.4)
    sign_at(SUPPLY+Vector3.UP*1.4)
    # Oren's real finite two-tray demonstration, independent of the garden test.
    demo = preload("res://scripts/irrigation_flow.gd").new()
    demo.add_cell(.7,1,.4,.3,.12)
    demo.add_cell(.3,1,.4,.3)
    demo.add_link(0,1,.7,.08)
    for i in range(2):
        var at := Vector3(153+i*1.1,.7-i*.4,-12)
        demo_water.append(host._box(self,at,Vector3(1,.03,.4),Color("4ba9bb")))
    for pos in [SPILL,FEED,GATE]:
        var gate: Node3D = channel_geometry.lift_gate(self,1.25 if pos == GATE else 1.6)
        gate.position = pos + Vector3(2,0,0)
        gates.append(gate)
        sign_at(pos+Vector3(0,1.9,0))
    debris = Node3D.new()
    debris.position = SLUICE+Vector3(2,0,0)
    add_child(debris)
    for n in range(4):
        var stick: MeshInstance3D = host._box(debris,Vector3(0,.25+n*.15,0),Vector3(1.7,.18,.25),Color("66503d"))
        stick.rotation.y = -.4+n*.25
    repair = host._box(self,SLUICE+Vector3(2,.25,.55),Vector3(1.9,.5,.13),Color("d5a75f"))
    repair.material_override = channel_geometry.finish(true)
    # Retired always-visible loose yellow placeholder; finite stock remains on rack.
    sign_at(SLUICE+Vector3(0,2,0))
    var detail = preload("res://scripts/garden_detail.gd")
    for x in [151.5,154.0]:
        for segment in [Vector2(7.5,7.85),Vector2(9.15,11.3)]:
            var length: float = segment.y-segment.x
            channel_geometry.planting_bed(self,Vector3(x,.055,(segment.x+segment.y)*.5),Vector3(2.1,.11,length+.50))
            for row in [-.55,0,.55]:
                var ridge := CylinderMesh.new()
                ridge.top_radius = .095
                ridge.bottom_radius = .095
                ridge.height = length+.22
                ridge.radial_segments = 8
                var r = detail.mesh(self,ridge,Vector3(x+row,.11,(segment.x+segment.y)*.5),"876849")
                r.rotation.x = PI/2
            var count := 1 if length < 1 else 3
            for j in range(count):
                for row in [-.53,.53]:
                    var at := Vector3(x+row,.15,segment.x+j*.8)
                    var plant: Node3D = detail.cabbage(self,at,.85) if x < 153 else detail.carrot(self,at)
                    plants.append(plant)
    detail.bench(self)
    produce = detail.basket(self,Vector3(149,0,6))
    make_person("anna",GARDENER,true)
    make_person("tobias",KEEPER,false)
    restore()

func restore() -> void:
    wrong_time = 0
    spilling = false
    message_en = ""
    message_ru = ""
    sync()
    if active: teleport_start()

func teleport_start() -> void:
    host.player.position = START
    host.player.velocity = Vector3.ZERO

func start() -> bool:
    if host.caves.stage != 6: return false
    host.caves.active = false
    host.caves.visible = false
    active = true
    restore()
    host._save_progress()
    return true

func near(pos: Vector3) -> bool:
    return host.player.position.distance_to(pos) < 2.1

func entry_available() -> bool:
    return not active and host.caves.stage == 6 and (host.player.position.distance_to(host.CAMP) < 3 or (host.caves.active and host.player.position.distance_to(host.caves.CAMP) < 3))

func context() -> String:
    if not active: return "water_start" if entry_available() else ""
    var points := [GARDENER,KEEPER,SLUICE,SPILL,FEED,GATE,PLAN,SUPPLY]
    var kinds := ["water_gardener","water_keeper","water_sluice","water_spill","water_feed","water_gate","water_plan","water_supply"]
    var best := 2.1
    var result := ""
    for i in range(points.size()):
        var distance: float = host.player.position.distance_to(points[i])
        if distance < best:
            best = distance
            result = kinds[i]
    return result

func destination() -> Vector3:
    if not active: return host.caves.CAMP if host.caves.active else host.CAMP
    if stage == 0: return GARDENER
    if stage == 1: return KEEPER
    if not construction.planned: return PLAN
    if not construction.ready_path():
        for item in ["support","channel","seal"]:
            if not construction.installed[item]:
                return SLUICE if construction.inventory[construction.COST[item]] > 0 else SUPPLY
    if not construction.inlet: return FEED
    if not construction.low: return SPILL
    return GARDENER if construction.earned else GATE

func advance() -> void:
    if stage >= STEPS.size(): return
    spilling = false
    completed_steps.append(STEPS[stage])
    sync()
    host._save_progress()

func say(en: String, ru: String) -> void:
    message_en = en
    message_ru = ru
    wrong_time = 6

func talk(who: int, en: String, ru: String) -> void:
    speaker = who
    dialogue_en = en
    dialogue_ru = ru
    host.paused = true
    host.modal_kind = "water_talk"
    host.player.set_enabled(false)

func interact() -> void:
    if host.paused: return
    match context():
        "water_start":
            if start():
                host.paused = true
                host.modal_kind = "water_intro"
                host.player.set_enabled(false)
        "water_gardener":
            if stage == 0: advance()
            if construction.earned:
                while stage < 9: advance()
                talk(0,"Water reached the row and lower catchment. We repaired a real path! Your harvest is safe; you can keep testing the gates.","Вода дошла до борозды и нижнего сборника. Мы починили путь! Урожай сохранён; можно снова проверять затворы.")
            else:
                talk(0,"Our garden is dry. Follow the channel to Oren. Today we repair one crossing and test one existing furrow. Your earlier harvest stays yours.","Сад сухой. Иди вдоль канала к Орену. Сегодня починим переход и проверим одну готовую борозду. Прежний урожай остаётся у тебя.")
        "water_keeper":
            if stage == 1: advance()
            talk(1,"Watch my two trays beside the plan: high water feeds the lower tray. A lip ABOVE the water stops it. Read the plan, gather stone, a board and seal clay; fit them at the broken crossing. Test, then lower the outlet lip if water ponds. Lift the wooden gate by its handle in the side grooves to expose the opening. Seat the channel on stone, then press clay into its end seam. Gates have no special order.","Смотри на два лотка у плана: вода сверху течёт вниз. Порог ВЫШЕ воды её остановит. Прочти план, возьми камень, доску и глину; поставь их у разрыва. Проверь, затем опусти порог, если вода стоит. Подними деревянный затвор за ручку по боковым пазам, открывая проход. Уложи лоток на камень, вдави глину в торцевой шов. Порядок затворов не важен.")
        "water_plan":
            if stage < 2: say("Ask Oren to demonstrate first.","Сначала попроси Орена показать опыт.")
            else:
                construction.act("plan")
                say("PLAN: 1 stone support + 1 board channel + 1 clay seal. High source → crossing → existing furrow → LOWER catchment. Simplified model: metres, seconds; not real garden sizing.","ПЛАН: 1 камень-опора + 1 доска-лоток + 1 глина-шов. Исток → переход → готовая борозда → НИЖНИЙ сборник. Упрощённая модель: метры, секунды; не проект настоящего сада.")
        "water_supply":
            var gathered := false
            for item in ["stone","board","seal"]:
                if construction.act("gather",item):
                    gathered = true
                    break
            say("Collected one repair material. Read inventory above." if gathered else "Read the plan first; this supply is finite.","Взят один материал. Запас указан сверху." if gathered else "Сначала прочти план; запас конечный.")
        "water_sluice":
            var placed := false
            for item in ["support","channel","seal"]:
                if not construction.installed[item]:
                    placed = construction.act("place",item,near(SLUICE))
                    break
            say("Component fitted at the crossing. Stone supports the board; clay seals its joint." if placed else "Missing material? Collect it at the nearby repair stock. Nothing consumed.","Деталь на месте. Камень держит доску; глина закрывает шов." if placed else "Не хватает материала? Возьми рядом у запаса. Ничего не потрачено.")
        "water_spill":
            construction.act("grade")
            say("Outlet lip lowered: compare its height with the upstream water." if construction.low else "Outlet lip raised ABOVE available water: expect ponding, not row flow.","Порог опущен: сравни его высоту с водой выше." if construction.low else "Порог поднят ВЫШЕ воды: вода будет стоять, а не течь к грядке.")
        "water_feed": construction.act("inlet")
        "water_gate": construction.act("outlet")
    host._save_progress()

    sync()

func action_text() -> String:
    match context():
        "water_start": return t("Next: village water", "Дальше: вода для сада")
        "water_gardener": return t("Talk to Mira", "К Мире")
        "water_keeper": return t("Talk to Oren", "К Орену")
        "water_sluice": return t("Fit repair part", "Поставить деталь")
        "water_spill": return t("Outlet height", "Высота порога")
        "water_feed": return (t("Lower inlet", "Опустить затвор") if construction.inlet else t("Lift inlet", "Поднять затвор"))
        "water_gate": return t("Furrow gate", "Затвор борозды")
        "water_plan": return t("Repair plan", "План ремонта")
        "water_supply": return t("Take material", "Взять материал")
    return ""

func objective() -> String:
    if stage == 0: return t("Meet Mira by the garden", "Поговори с Мирой")
    if stage == 1: return t("Oren shows how high water feeds lower ground", "Орен покажет, как вода течёт вниз")
    if not construction.planned: return t("Read the plan beside Oren", "Прочти план у Орена")
    if not construction.ready_path(): return t("Gather → fit support, channel, seal at broken crossing", "Собери → поставь опору, лоток, шов у разрыва")
    if construction.earned: return t("Row wet; water reached lower catchment · tell Mira", "Борозда влажная; вода в сборнике · к Мире")
    return t("Test inlet · observe ponding · adjust outlet height", "Открой впуск · наблюдай воду · измени высоту порога")

func sync() -> void:
    visible = active
    garden_lighting.apply(host,active)
    if debris == null: return
    debris.visible = not construction.installed.channel
    repair.visible = construction.installed.channel
    repair.position = Vector3(160,.61,-5)
    repair.scale = Vector3(1.6/1.9, .16, 4/.13)
    support_mesh.visible = construction.installed.support
    seal_mesh.visible = construction.installed.seal
    crest.position.y = .59 if construction.low else 1.265
    crest.scale.y = 1.0 if construction.low else 12.25
    crest.visible = construction.installed.channel
    produce.visible = stage >= 9
    for i in range(3): supply_meshes[i].visible = construction.supply[["stone","board","seal"][i]] > 0
    gates[0].visible = false
    gates[1].position = Vector3(160,.95,-7)
    gates[2].position = Vector3(159.2,.35,6.375)
    gates[2].rotation.y = PI/2
    gates[1].get_child(0).position.y = 1.30 if construction.inlet else .425
    gates[2].get_child(0).position.y = 1.0 if construction.outlet else .425
    channel_geometry.sync(self)
    for i in range(water.size()):
        var state: Dictionary = construction.flow.cell_state(i)
        water[i].visible = state.water > .00001
        water[i].position.y = state.head_m
    var wet: bool = construction.flow.cell_state(3).soil > .015
    soil_mesh.material_override = host._material(Color("493b2e") if wet else Color("715d45"))
    # Wet soil is a storage cue, not a simulated crop-growth response.
    labels[0].text = t("Repair plan", "План ремонта")
    labels[1].text = t("Materials", "Материалы")
    labels[2].text = t("OUTLET HEIGHT", "ВЫСОТА ПОРОГА")
    labels[3].text = t("INLET", "ВПУСК")
    labels[4].text = t("FURROW", "БОРОЗДА")
    labels[5].text = t("Crossing", "Переход")
    labels[6].text = t("Mira · gardener", "Мира · садовница")
    labels[7].text = t("Oren · waterkeeper", "Орен · смотритель воды")
    for i in range(demo_water.size()):
        var state: Dictionary = demo.cell_state(i)
        demo_water[i].position.y = state.head_m
        demo_water[i].visible = state.water > .00001

func tick(delta: float) -> void:
    if host.paused or not active: return
    clock += delta
    construction.tick(delta)
    if stage >= 2: demo.step(delta)
    sync()
    wrong_time = maxf(0,wrong_time-delta)
    for i in range(ripples.size()):
        ripples[i].position.z = water[i].position.z + fmod(clock*1.8,2.8)-1.4
    for actor in actors:
        var d: Vector3 = host.player.position-actor.position
        if d.length() < 4: actor.rotation.y = lerp_angle(actor.rotation.y,atan2(d.x,d.z),delta*3)
    if host.player.position.y < -1 or host.player.position.x < 144 or host.player.position.x > 176 or absf(host.player.position.z) > 16: teleport_start()

func refresh_ui() -> void:
    if not active: return
    sync()
    host.objective.text = objective()
    host.counter.text = t("Stone / board / seal: ", "Камень / доска / глина: ") + "%d / %d / %d" % [construction.inventory.stone,construction.inventory.board,construction.inventory.seal]
    host.counter.visible = true
    host.notice.text = t(message_en,message_ru) if wrong_time > 0 else ""
    host.action_button.text = action_text()
    # Keep localized labels inside the existing touch target, not beyond viewport.
    host.action_button.clip_text = true
    host.action_button.add_theme_font_size_override("font_size",18 if host.language == "ru" or host.get_viewport().get_visible_rect().size.x < 800 else 22)
    host.map_button.visible = false
    if host.modal_kind in ["intro","water_intro","pause"]:
        host.modal_title.text = t("Water for the village", "Вода для деревни")
        host.modal_body.text = t("Mira's garden is drying out. Somewhere upstream, the water has stopped.\n\nMeet Mira, follow the empty channel, and help Oren bring the water back.", "Сад Миры засыхает. Где-то выше по течению вода остановилась.\n\nПоговори с Мирой, пройди вдоль пустого канала и помоги Орену вернуть воду.") + "\n\n" + objective()
        host.primary.text = t("Continue", "Продолжить")
        if host.modal_kind == "pause": host.secondary.text = t("Return to clearing", "На поляну")
    elif host.modal_kind == "water_talk":
        host.modal_title.text = t("Mira · gardener", "Мира · садовница") if speaker == 0 else t("Oren · waterkeeper", "Орен · смотритель воды")
        host.modal_body.text = t(dialogue_en,dialogue_ru)
        host.primary.text = t("Let's help!", "Поможем!")
    elif host.modal_kind == "water_complete":
        host.modal_title.text = t("Water for everyone!", "Вода для всех!")
        host.modal_body.text = t("Mira: Look at those leaves! Oren and I couldn't do this alone. Here are vegetables to share.\n\nYou repaired the channel and guided the water. The garden stays alive when we care for it together.", "Мира: Посмотри на листья! Мы с Ореном не справились бы одни. Вот овощи, чтобы поделиться.\n\nТы починил канал и направил воду. Сад живёт, когда мы заботимся о нём вместе.")
        host.primary.text = t("Enjoy the garden", "Погулять в саду")
    if host.paused and not host.saves_ok:
        host.modal_body.text += t("\n\nNot saved on this device. Leaving may lose this checkpoint.","\n\nНе сохранено на устройстве. При выходе этот шаг может потеряться.")
