extends Node3D
## Fictional practice, not a retelling of David's life. No animal is killed.
const CAMP := Vector3(100, 0, 10)
const ENTRANCES := [Vector3(88,0,0), Vector3(100,0,0), Vector3(112,0,0)]
const STEPS := ["lion_clue", "lion_safe", "bear_clue", "bear_safe", "lamb_found", "home"]
var host
var active := false
var completed_steps: Array[String] = []
var health := 3
var invulnerability := 0.0
var phase := "idle"
var timer := 0.0
var drive_count := 0
var animal_index := -1
var lunge_from := Vector3.ZERO
var lunge_to := Vector3.ZERO
var retreat_from := Vector3.ZERO
var animals: Array[Node3D] = []
var animal_motion: Array[Node3D] = []
var signs: Array[Label3D] = []
var lamb: CharacterBody3D
var wool_read := false
var warning_mark: MeshInstance3D
var message := ""
var message_time := 0.0
var stage: int:
    get: return completed_steps.size()

func load_checkpoint(data: Variant, flock_stage: int) -> void:
    active = false
    completed_steps.clear()
    health = 3
    if flock_stage != 6 or not data is Dictionary: return
    if not data.get("active") is bool or not data.get("steps") is Array: return
    var values: Array = data.steps
    if values.size() > STEPS.size(): return
    for i in range(values.size()):
        if not values[i] is String or values[i] != STEPS[i]: return
    active = data.active
    for value in values: completed_steps.append(value)

func snapshot() -> Dictionary:
    return {"active": active, "steps": completed_steps.duplicate()}

func _ready() -> void:
    solid(Vector3(100,-.5,0), Vector3(40,1,32), Color("b49a74"))
    for pos in [Vector3(80,3,0),Vector3(120,3,0)]: solid(pos,Vector3(1,6,32),Color("756b61"))
    for pos in [Vector3(100,3,-16),Vector3(100,3,16)]: solid(pos,Vector3(40,6,1),Color("756b61"))
    for i in range(3):
        var e: Vector3 = ENTRANCES[i]
        # Three real, walk-in chambers. Open roofs keep the orbit camera usable.
        for side in [-1,1]:
            solid(e+Vector3(side*4.8,2,-7),Vector3(1,4,14),Color("bd8e65"))
        solid(e+Vector3(0,2,-14),Vector3(10,4,1),Color("b98b64"))
        # Terraced mountain crowns are visual only, above the navigable chambers.
        host._box(self,e+Vector3(0,6,-11),Vector3(10,3,5),Color("bd8e65"))
        host._box(self,e+Vector3(0,8,-12),Vector3(6,2,3),Color("d3a77b"))
        var gate_art := add_asset("gate-rock",e+Vector3(0,0,-.2),Vector3(10,8.1,5))
        for mesh in gate_art.find_children("*","MeshInstance3D",true,false): mesh.create_trimesh_collision()
        # Corridor asset is decoration; hand-built solids define safe navigation.
        var corridor := add_asset("corridor",e+Vector3(0,-.12,-12),Vector3(8,5,6))
        corridor.rotation.y = PI/2
        var sign := Label3D.new()
        sign.position = e+Vector3(0,2.7,1)
        sign.font_size = 46
        sign.pixel_size = .014
        add_child(sign)
        signs.append(sign)
    animals.append(make_animal("lion",ENTRANCES[0]+Vector3(0,0,-8)))
    animals.append(make_animal("bear",ENTRANCES[1]+Vector3(0,0,-8)))
    lamb = CharacterBody3D.new()
    lamb.collision_layer = 0
    lamb.collision_mask = 1
    var shape := CollisionShape3D.new()
    var capsule := CapsuleShape3D.new()
    capsule.radius = .3
    capsule.height = .8
    shape.shape = capsule
    shape.position.y = .4
    lamb.add_child(shape)
    lamb.add_child(preload("res://assets/lamb.glb").instantiate())
    add_child(lamb)
    host._box(self,CAMP+Vector3(0,.08,0),Vector3(5,.16,4),Color("72935f"))
    var camp_sign := Label3D.new()
    camp_sign.position = CAMP+Vector3(0,2.5,0)
    camp_sign.name = "CampSign"
    camp_sign.font_size = 40
    camp_sign.pixel_size = .006
    add_child(camp_sign)
    warning_mark = host._box(self,Vector3.ZERO,Vector3(2.6,.04,2.6),Color("edb453"))
    warning_mark.visible = false
    restore()

func solid(pos: Vector3, size: Vector3, color: Color) -> void:
    var body := StaticBody3D.new()
    add_child(body)
    body.position = pos
    var shape := CollisionShape3D.new()
    var box := BoxShape3D.new()
    box.size = size
    shape.shape = box
    body.add_child(shape)
    host._box(body,Vector3.ZERO,size,color)

func add_asset(id: String, pos: Vector3, bounds: Vector3) -> Node3D:
    var path := "res://assets/caves/"+id+".glb"
    var wrapper := Node3D.new()
    add_child(wrapper)
    wrapper.position = pos
    if ResourceLoader.exists(path):
        var model: Node3D = load(path).instantiate()
        wrapper.add_child(model)
        var box := AABB()
        var first := true
        for mesh in model.find_children("*","MeshInstance3D",true,false):
            var a: AABB = model.global_transform.affine_inverse()*mesh.global_transform*mesh.get_aabb()
            box = a if first else box.merge(a)
            first = false
        if not first:
            var factor := minf(bounds.x/maxf(box.size.x,.01),minf(bounds.y/maxf(box.size.y,.01),bounds.z/maxf(box.size.z,.01)))
            model.scale *= factor
            model.position = -Vector3(box.get_center().x,box.position.y,box.get_center().z)*factor
    return wrapper

func make_animal(id: String, pos: Vector3) -> Node3D:
    var node := add_asset(id,pos,Vector3(2.5,1.8,3))
    if node.get_child_count() == 0:
        host._box(node,Vector3(0,.8,0),Vector3(1.2,1.2,2),Color("bd9558") if id == "lion" else Color("785a46"))
    var motion := preload("res://scripts/cave_animal_motion.gd").new()
    motion.attach(node,id)
    animal_motion.append(motion)
    return node

func restore() -> void:
    visible = active
    health = 3
    invulnerability = 0
    phase = "idle"
    wool_read = false
    warning_mark.visible = false
    animal_index = -1
    drive_count = 0
    timer = 0
    for i in range(animals.size()):
        animals[i].position = ENTRANCES[i]+Vector3(0,0,-8)
        animals[i].rotation = Vector3.ZERO
        animal_motion[i].reset_pose()
        animals[i].visible = stage < (2 if i == 0 else 4)
    lamb.position = CAMP+Vector3(1,0,0) if stage == 6 else ENTRANCES[2]+Vector3(0,0,-10)
    if active: teleport_camp()
    sync_labels()

func teleport_camp() -> void:
    host.player.position = CAMP+Vector3(0,.2,0)
    host.player.velocity = Vector3.ZERO

func start() -> bool:
    if host.campaign.stage != 6: return false
    active = true
    restore()
    host._save_progress()
    return true

func near(pos: Vector3, radius: float = 2.4) -> bool:
    return host.player.position.distance_to(pos) < radius

func context() -> String:
    if not active: return "caves" if host.campaign.stage == 6 and near(host.CAMP,3) else ""
    if near(CAMP,3):
        if stage == 5 and lamb.position.distance_to(CAMP) < 3: return "home"
        if health < 3: return "heal"
        if stage == 6: return "return"
    if can_drive(): return "drive"
    if stage in [0,2,4] and near(ENTRANCES[stage/2]): return "clue"
    if stage == 4 and message_time > 0: return "" # clue is the only entrance action
    if stage == 5 and near(lamb.position,3) and phase == "waiting": return "call_lamb"
    return ""

func can_drive() -> bool:
    if phase != "recover" or animal_index < 0: return false
    var p: Vector3 = host.player.position
    if p.z > -1 or p.z < -13 or absf(p.x-ENTRANCES[animal_index].x) > 4: return false
    if not near(animals[animal_index].position,4.5): return false
    var ray := PhysicsRayQueryParameters3D.create(p+Vector3.UP*.8,animals[animal_index].position+Vector3.UP*.8)
    ray.exclude = [host.player.get_rid()]
    return get_world_3d().direct_space_state.intersect_ray(ray).is_empty()

func advance() -> void:
    if stage >= 6: return
    completed_steps.append(STEPS[stage])
    host._save_progress()

func interact() -> void:
    if host.paused: return
    match context():
        "caves":
            start()
            host.modal_kind = "cave_intro"
            host.paused = true
            host.player.set_enabled(false)
        "clue":
            if stage == 4:
                # Last clue points inside; discovery requires actually reaching lamb.
                wool_read = true
                message = "wool"
                message_time = 6
            else:
                advance()
                message = "tracks"
                message_time = 5
        "heal":
            health = 3
            invulnerability = 2
            message = "healed"
            message_time = 3
        "drive":
            drive_count += 1
            retreat_from = animals[animal_index].position
            phase = "retreat"
            timer = 1.2
        "call_lamb": phase = "following"
        "home":
            advance()
            host.modal_kind = "cave_complete"
            host.paused = true
            host.player.set_enabled(false)
        "return":
            active = false
            visible = false
            host.player.position = host.SPAWN
            host.player.velocity = Vector3.ZERO
            host._save_progress()

func hurt() -> void:
    if host.paused or not active or invulnerability > 0: return
    health -= 1
    invulnerability = 2.2
    message = "ouch"
    message_time = 3
    if health <= 0: retry_checkpoint()

func retry_checkpoint() -> void:
    # Completed clues/encounters stay earned; only this encounter restarts.
    restore()
    invulnerability = 3
    message = "retry"
    message_time = 5

func tick(delta: float) -> void:
    if host.paused or not active: return
    _tick_gameplay(delta)
    for i in range(animals.size()):
        var state := phase if i == animal_index and stage in [1,3] else "idle"
        var facing := Vector3.BACK
        if state in ["warn","lunge","recover"]: facing = lunge_to-lunge_from
        elif state == "retreat": facing = ENTRANCES[i]+Vector3(0,0,-12)-animals[i].position
        animal_motion[i].step(delta,state,timer,facing)

func _tick_gameplay(delta: float) -> void:
    invulnerability = maxf(0,invulnerability-delta)
    message_time = maxf(0,message_time-delta)
    var p: Vector3 = host.player.position
    if p.y < -.8 or p.x < 80 or p.x > 120 or absf(p.z) > 16:
        retry_checkpoint()
        return
    warning_mark.visible = phase in ["warn", "lunge"]
    warning_mark.position = lunge_to + Vector3.UP*.04
    if stage == 4 and wool_read and near(lamb.position,2.5):
        advance()
        phase = "waiting"
    if stage == 5:
        if phase not in ["waiting","following"]: phase = "waiting"
        if phase == "following":
            var target: Vector3 = host.player.position
            # Exit through the opening first, then follow across the courtyard.
            if lamb.position.z < 1 and host.player.position.z > 1: target = ENTRANCES[2]+Vector3(0,0,2)
            elif near(CAMP,3): target = CAMP
            var direction: Vector3 = target-lamb.position
            direction.y = 0
            if direction.length() > .7 and lamb.position.distance_to(p) < 10:
                lamb.move_and_collide(direction.normalized()*minf(delta*3,direction.length()))
        return
    if stage not in [1,3]: return
    var i := 0 if stage == 1 else 1
    # Let the child clear the narrow rock arch before asking for a sideways
    # dodge. The fight takes place in the wider chamber, not in its doorway.
    if not near(ENTRANCES[i]+Vector3(0,0,-7),8) or p.z > -3.5:
        phase = "idle"
        animals[i].position = ENTRANCES[i]+Vector3(0,0,-8)
        return
    animal_index = i
    timer -= delta
    var animal := animals[i]
    match phase:
        "idle":
            phase = "warn"
            timer = 1.6
            lunge_from = animal.position
            lunge_to = Vector3(clampf(p.x,ENTRANCES[i].x-3.4,ENTRANCES[i].x+3.4),0,clampf(p.z,-12,-3.5))
        "warn":
            if timer <= 0:
                phase = "lunge"
                timer = .7
        "lunge":
            animal.position = lunge_from.lerp(lunge_to,smoothstep(0,1,clampf(1-timer/.7,0,1)))
            if near(animal.position,1.3): hurt()
            if phase == "lunge" and timer <= 0:
                phase = "recover"
                timer = 3.5
        "recover":
            if timer <= 0: phase = "idle"
        "retreat":
            # Reach the exit before hiding; the old constant-speed retreat could
            # disappear several metres short of it. Ease start/stop, face travel.
            animal.position = retreat_from.lerp(ENTRANCES[i]+Vector3(0,0,-12),smoothstep(0,1,clampf(1-timer/1.2,0,1)))
            if timer <= 0:
                if drive_count >= 2:
                    animal.visible = false
                    advance()
                    drive_count = 0
                    message = "safe"
                    message_time = 4
                phase = "idle"
    sync_labels()

func destination() -> Vector3:
    if not active: return host.CAMP
    if health < 3 and near(CAMP,5): return CAMP
    if stage == 6 or (stage == 5 and phase == "following"): return CAMP
    if stage == 4 and not wool_read: return ENTRANCES[2]
    if stage >= 4: return lamb.position
    return ENTRANCES[stage/2]+Vector3(0,0,-4 if stage%2 == 1 else 0)

func objective() -> String:
    if stage == 4 and not wool_read:
        return host.t("3 · Read the wool clue at the right entrance", "3 · Изучи шерсть у правого входа")
    if phase == "warn": return host.t("Warning! Move sideways · do not approach", "Внимание! Отойди в сторону · не подходи")
    if phase == "lunge": return host.t("Dodge sideways!", "Отойди в сторону!")
    if phase == "recover": return host.t("Now: come close and drive it away", "Теперь подойди и отпугни зверя")
    if stage == 5: return host.t("Call the lamb · walk slowly to green camp", "Позови ягнёнка · веди к зелёному лагерю")
    if stage == 6: return host.t("Safe together! Return to the clearing", "Все в безопасности! Вернись на поляну")
    return [host.t("1 · Read tracks at the left cave", "1 · Изучи следы у левой пещеры"),host.t("Lion cave · dodge, then drive away twice", "Пещера льва · уклонись и отпугни дважды"),host.t("2 · Read tracks at the middle cave", "2 · Изучи следы у средней пещеры"),host.t("Bear cave · dodge, then drive away twice", "Пещера медведя · уклонись и отпугни дважды"),host.t("3 · White wool! Search the right cave", "3 · Белая шерсть! Ищи в правой пещере")][mini(stage,4)]

func action_text() -> String:
    return {"caves":host.t("Continue to caves", "Дальше: пещеры"),"clue":host.t("Read the clue", "Изучить следы"),"drive":host.t("Drive away", "Отпугнуть"),"heal":host.t("Rest and heal", "Отдохнуть"),"call_lamb":host.t("Call the lamb", "Позвать ягнёнка"),"home":host.t("Welcome home", "Мы дома"),"return":host.t("Return to clearing", "На поляну")}.get(context(),"")

func progress_text() -> String:
    var result: String = host.t("Health %d/3 · green camp heals · %d/6", "Здоровье %d/3 · отдых в лагере · %d/6") % [health,stage]
    if not host.saves_ok: result += host.t(" · not saved", " · не сохранено")
    return result

func notice_text() -> String:
    if message_time <= 0: return ""
    return {"wool":host.t("Soft white wool leads inside the right cave.", "Белая шерсть ведёт внутрь правой пещеры."),"tracks":host.t("Animal tracks! Wait for the warning, dodge sideways, then act.", "Следы зверя! Жди сигнала, отойди в сторону и действуй."),"healed":host.t("Rested! All three hearts restored.", "Отдохнул! Здоровье восстановлено."),"ouch":host.t("A bump! Move away; you have a moment of safety.", "Ушиб! Отойди; сейчас ты ненадолго защищён."),"retry":host.t("Safe at camp. Rested and ready; your progress is kept.", "Ты в лагере. Отдохнул! Твой успех сохранён."),"safe":host.t("The animal went away unharmed. Follow the next clue!", "Зверь ушёл невредимым. Ищи следующую подсказку!")}.get(message,"")

func sync_labels() -> void:
    for i in range(signs.size()): signs[i].text = [host.t("1 · Paw prints", "1 · Следы лап"),host.t("2 · Big tracks", "2 · Большие следы"),host.t("3 · White wool", "3 · Белая шерсть")][i]
    get_node("CampSign").text = host.t("Safe camp · rest here", "Лагерь · здесь безопасно")

func intro_text() -> String:
    return host.t("Fictional shepherd practice inspired by young David, not a Bible retelling.\nThree caves: lion, bear, then a lost lamb. Read each clue. An animal warns before moving: dodge sideways, then use Drive away during its rest. Do this twice. No animals are hurt or killed.\nGreen camp restores health. If you need another try, your completed steps stay safe.\nIn real life, never approach wild animals; ask an adult for help.", "Выдуманная игра о заботливом пастухе, вдохновлённая юным Давидом, а не пересказ Библии.\nТри пещеры: лев, медведь и потерявшийся ягнёнок. Изучи следы. Зверь предупреждает: отойди в сторону, затем нажми «Отпугнуть», пока он отдыхает. Сделай это дважды. Звери уходят невредимыми.\nЗелёный лагерь восстанавливает здоровье. При повторной попытке пройденные шаги сохраняются.\nВ жизни не подходи к диким зверям; попроси взрослого помочь.")

func credits() -> String:
    return host.t("\n\nArt credits (static models; whole-object motion):\nLion — Poly by Google, CC BY 3.0\nBear — madtrollstudio, CC BY 3.0\nCave kit — Kenney, CC0\n", "\n\nАвторы моделей (без скелетной анимации):\nЛев — Poly by Google, CC BY 3.0\nМедведь — madtrollstudio, CC BY 3.0\nПещеры — Kenney, CC0\n") + "https://creativecommons.org/licenses/by/3.0/\nhttps://kenney.nl/assets"
