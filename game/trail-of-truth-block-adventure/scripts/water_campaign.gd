extends Node3D
## Original fictional village service adventure, not a Bible event.
const START := Vector3(150, .15, 10)
const GARDENER := Vector3(150, 0, 7)
const KEEPER := Vector3(156, 0, -11)
const SLUICE := Vector3(158, 0, -5)
const SPILL := Vector3(158, 0, -2)
const FEED := Vector3(158, 0, -8)
const GATE := Vector3(158, 0, 4)
const STEPS := ["need", "plan", "cleared", "repaired", "spill_closed", "feed_open", "garden_open", "keeper_thanked", "garden_thanked"]
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
    completed_steps.clear()
    if cave_stage != 6 or not data is Dictionary: return
    if not data.get("active") is bool or not data.get("steps") is Array: return
    var values: Array = data.steps
    if values.size() > STEPS.size(): return
    for i in range(values.size()):
        if not values[i] is String or values[i] != STEPS[i]: return
    active = data.active
    for value in values: completed_steps.append(value)

func snapshot() -> Dictionary:
    return {"active": active, "steps": completed_steps.duplicate()}

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
    label.font_size = 36
    label.pixel_size = .008
    label.billboard = BaseMaterial3D.BILLBOARD_ENABLED
    label.no_depth_test = false
    label.visibility_range_end = 13
    add_child(label)
    labels.append(label)
    return label

func make_person(file: String, at: Vector3, gardener: bool) -> void:
    # Existing lawful generated adult rigs, instanced without touching shared resources.
    var actor := Node3D.new()
    actor.name = "Mira_Gardener" if gardener else "Oren_Waterkeeper"
    actor.position = at
    add_child(actor)
    var model := (load("res://assets/villagers/" + file + ".glb") as PackedScene).instantiate() as Node3D
    model.scale = Vector3.ONE * (.615 if gardener else .66)
    model.position.y = .615 if gardener else .66
    actor.add_child(model)
    var animations := model.find_children("*", "AnimationPlayer", true, false)
    if not animations.is_empty():
        var anim := animations.front() as AnimationPlayer
        if not anim.get_animation_list().is_empty():
            anim.play(anim.get_animation_list()[0])
            anim.advance(0)
            anim.stop(false)
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
    capsule.height = 1.7
    collision.shape = capsule
    collision.position.y = .85
    body.add_child(collision)
    actor.add_child(body)
    actors.append(actor)
    sign_at(at + Vector3.UP*2.25)

func _ready() -> void:
    name = "WaterForTheVillage"
    # Offset chapter uses its own floor, beyond the old world and cave colliders.
    solid(Vector3(160,-.5,0),Vector3(32,1,32),Color("a5aa70"))
    for x in [144,176]: solid(Vector3(x,1,0),Vector3(.6,2,32),Color("9b9477"),false)
    for z in [-16,16]: solid(Vector3(160,1,z),Vector3(32,2,.6),Color("9b9477"),false)
    var landscape := preload("res://scripts/water_environment.gd").new()
    add_child(landscape)
    # Continuous watercourse leads visibly uphill from the dry beds to the source.
    host._box(self,Vector3(160,.025,-2),Vector3(1.8,.05,22),Color("715d45"))
    for x in [159,161]:
        for z in [-7,6]: solid(Vector3(x,.15,z),Vector3(.18,.3,10),Color("c5b89a"),false)
    solid(Vector3(160,.12,0),Vector3(3,.24,2),Color("a98455"))
    host._box(self,Vector3(164,.04,-13),Vector3(9,.08,3),Color("397a99"))
    host._box(self,Vector3(156,.03,8),Vector3(8,.06,1.4),Color("715d45"))
    for z in [-11,-7,-3,1,6]:
        var flow: MeshInstance3D = host._box(self,Vector3(160,.08,z),Vector3(1.65,.07,6 if z == 6 else 4),Color("4ba9bb"))
        water.append(flow)
        var ripple: MeshInstance3D = host._box(self,Vector3(160,.13,z),Vector3(1.2,.025,.1),Color("c1eef0"))
        ripples.append(ripple)
    water.append(host._box(self,Vector3(156,.1,8),Vector3(8,.08,1.25),Color("4ba9bb")))
    spill_water = host._box(self,Vector3(164,.08,-2),Vector3(7,.08,1),Color("4ba9bb"))
    host._box(self,Vector3(164,.02,-2),Vector3(7,.04,1.2),Color("715d45"))
    for pos in [SPILL,FEED,GATE]:
        var gate := Node3D.new()
        gate.position = pos + Vector3(2,0,0)
        add_child(gate)
        host._box(gate,Vector3(0,.5,0),Vector3(1.75,.85,.16),Color("885334"))
        # Wheel on the accessible west bank, not across the water.
        var wheel := MeshInstance3D.new()
        var torus := TorusMesh.new()
        torus.inner_radius = .22
        torus.outer_radius = .34
        wheel.mesh = torus
        wheel.rotation.x = PI/2
        wheel.position = Vector3(-1.6,1,0)
        wheel.material_override = host._material(Color("edc06d"))
        gate.add_child(wheel)
        for spoke in range(4):
            var bar: MeshInstance3D = host._box(gate,Vector3(-1.6,1,0),Vector3(.055,.60,.055),Color("b58e54"))
            bar.rotation.z = spoke*PI/4
        gates.append(gate)
        sign_at(pos+Vector3(0,1.9,0))
    debris = Node3D.new()
    debris.position = SLUICE+Vector3(2,0,0)
    add_child(debris)
    for n in range(4):
        var stick: MeshInstance3D = host._box(debris,Vector3(0,.25+n*.15,0),Vector3(1.7,.18,.25),Color("66503d"))
        stick.rotation.y = -.4+n*.25
    repair = host._box(self,SLUICE+Vector3(2,.25,.55),Vector3(1.9,.5,.13),Color("d5a75f"))
    host._box(self,SLUICE+Vector3(-.4,.12,.7),Vector3(.4,.18,1.4),Color("d5a75f"))
    sign_at(SLUICE+Vector3(0,2,0))
    var detail = preload("res://scripts/garden_detail.gd")
    for x in [151.5,154.0]:
        for segment in [Vector2(6.65,7.0),Vector2(9.15,11.3)]:
            var length: float = segment.y-segment.x
            host._box(self,Vector3(x,.055,(segment.x+segment.y)*.5),Vector3(1.85,.11,length+.35),Color("6b513c"))
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
    var points := [GARDENER,KEEPER,SLUICE,SPILL,FEED,GATE]
    var kinds := ["water_gardener","water_keeper","water_sluice","water_spill","water_feed","water_gate"]
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
    return [GARDENER,KEEPER,SLUICE,SLUICE,SPILL,FEED,GATE,KEEPER,GARDENER,GARDENER][stage]

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
            if stage == 8:
                advance()
                host.paused = true
                host.modal_kind = "water_complete"
                host.player.set_enabled(false)
            else:
                talk(0,"I'm Mira. These beds are dry. Follow the empty channel to Oren. Can we bring water back together?" if stage < 7 else "The leaves are lifting! Thank Oren upstream, then come share our harvest.","Я Мира. Грядки засохли. Иди вдоль пустого канала к Орену. Вернём воду вместе?" if stage < 7 else "Листья поднимаются! Поблагодари Орена у истока, потом приходи за урожаем.")
                if stage == 9:
                    dialogue_en = "Water for every row, vegetables to share. Thank you for helping our village!"
                    dialogue_ru = "Вода для каждой грядки, овощи для всех. Спасибо за помощь нашей деревне!"
        "water_keeper":
            if stage == 1: advance()
            if stage == 7:
                advance()
                talk(1,"You followed the water, not a guess! Every row has enough. Mira has a basket to share with you.","Ты проследил путь воды! Теперь её хватит всем грядкам. Мира приготовила корзину овощей.")
            else:
                talk(1,"I'm Oren, the waterkeeper. Clear the branches and fit the board at the sluice. Then CLOSE the spill, OPEN the spring, and OPEN the garden — in that order. Watch where the water goes!","Я Орен, смотритель воды. Убери ветки и поставь доску в шлюз. Потом ЗАКРОЙ сброс, ОТКРОЙ родник и ОТКРОЙ сад — по порядку. Смотри, куда идёт вода!")
        "water_sluice":
            if stage == 2:
                advance()
                say("Branches cleared! Fit the board beside you to seal the leak.","Ветки убраны! Поставь доску рядом, чтобы закрыть щель.")
            elif stage == 3:
                advance()
                say("Sluice repaired. First close the spill wheel downstream.","Шлюз починен. Сначала закрой колесом сброс ниже по течению.")
            else: say("Ask Mira and Oren about the dry channel first." if stage < 2 else "The sluice is ready. Follow the gate signs.","Сначала спроси Миру и Орена о сухом канале." if stage < 2 else "Шлюз готов. Следуй указателям у ворот.")
        "water_spill":
            if stage == 4:
                advance()
                say("Spill CLOSED. Now walk upstream to open the spring.","Сброс ЗАКРЫТ. Теперь иди вверх и открой родник.")
            else: say("Repair the sluice first." if stage < 4 else "Spill stays closed: water belongs in the garden.","Сначала почини шлюз." if stage < 4 else "Сброс закрыт: вода нужна саду.")
        "water_feed":
            if stage == 5:
                advance()
                say("Spring OPEN! Water reaches the last gate. Follow it to the garden wheel.","Родник ОТКРЫТ! Вода дошла до последних ворот. Иди к колесу сада.")
            else:
                if stage == 4: spilling = true
                say("Water would escape! Repair the sluice, then close the spill first." if stage < 5 else "The spring is already feeding the channel.","Вода убежит! Почини шлюз и сначала закрой сброс." if stage < 5 else "Родник уже наполняет канал.")
        "water_gate":
            if stage == 6:
                advance()
                say("Water is flowing to the roots! Go thank Oren, then return to Mira.","Вода течёт к корням! Поблагодари Орена и вернись к Мире.")
            else: say("No water yet. Close spill, open spring, then open garden." if stage < 6 else "Every bed has water now!", "Воды ещё нет. Закрой сброс, открой родник, потом сад." if stage < 6 else "Теперь вода есть на каждой грядке!")
    sync()

func action_text() -> String:
    match context():
        "water_start": return t("Next: village water", "Дальше: вода для сада")
        "water_gardener": return t("Talk to Mira", "К Мире")
        "water_keeper": return t("Talk to Oren", "К Орену")
        "water_sluice": return t("Fit board", "Поставить доску") if stage == 3 else t("Clear sluice", "Расчистить шлюз")
        "water_spill": return t("Close spill", "Закрыть сброс")
        "water_feed": return t("Open spring", "Открыть родник")
        "water_gate": return t("Open garden", "Открыть сад")
    return ""

func objective() -> String:
    var en := ["Meet Mira by the dry garden", "Follow the dry channel · meet Oren", "Clear branches from the sluice", "Fit the board · seal the sluice", "1 · CLOSE the spill", "2 · OPEN the spring upstream", "3 · OPEN the garden downstream", "Water flows! Thank Oren", "Return to Mira · share the harvest", "A growing garden · water for everyone"]
    var ru := ["Найди Миру у сухого сада", "Иди вдоль канала к Орену", "Убери ветки из шлюза", "Поставь доску · почини шлюз", "1 · ЗАКРОЙ сброс", "2 · ОТКРОЙ родник выше", "3 · ОТКРОЙ сад ниже", "Вода течёт! Поблагодари Орена", "Вернись к Мире за урожаем", "Сад растёт · вода для всех"]
    return t(en[stage],ru[stage])

func sync() -> void:
    visible = active
    if debris == null: return
    debris.visible = stage < 3
    repair.visible = stage >= 4
    produce.visible = stage >= 9
    gates[0].position.y = 0 if stage >= 5 else .65
    gates[1].position.y = .8 if stage >= 6 else 0
    gates[2].position.y = .8 if stage >= 7 else 0
    for i in range(water.size()): water[i].visible = stage >= (6 if i < 4 else 7) or (spilling and wrong_time > 0 and i < 3)
    for i in range(ripples.size()): ripples[i].visible = water[i].visible
    spill_water.visible = spilling and wrong_time > 0
    if spilling and wrong_time > 0: gates[1].position.y = .4
    for plant in plants:
        plant.scale.y = 1 if stage >= 7 else .72
        preload("res://scripts/garden_detail.gd").set_watered(plant,stage >= 7)
    labels[0].text = t("1 · SPILL", "1 · СБРОС") + (t(" · closed", " · закрыт") if stage >= 5 else t(" · open", " · открыт"))
    labels[1].text = t("2 · SPRING", "2 · РОДНИК")
    labels[2].text = t("3 · GARDEN", "3 · САД")
    labels[3].text = t("SLUICE", "ШЛЮЗ")
    labels[4].text = t("Mira · gardener", "Мира · садовница")
    labels[5].text = t("Oren · waterkeeper", "Орен · смотритель воды")

func tick(delta: float) -> void:
    if host.paused or not active: return
    clock += delta
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
    host.counter.text = t("Water for the village", "Вода для деревни")
    host.counter.visible = true
    host.notice.text = t(message_en,message_ru) if wrong_time > 0 else ""
    host.action_button.text = action_text()
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
