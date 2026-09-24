extends Node3D
## Fictional shepherd practice. Stage is the persisted checkpoint authority.
var host
var stage := 0
var sheep: Array[CharacterBody3D] = []
var called: Array[bool] = [false, false, false]
var counted: Array[bool] = [false, false, false]
var repairs := 0
var held := false
var supplies: Array[Node3D] = []
var patches: Array[Node3D] = []
var gate: StaticBody3D
var warning: Label3D
var shelter_time := 0.0
const HOME := Vector3(-11, 0, 7)
const PASTURE := Vector3(-4, 0, 10)
const FOLD := Vector3(-4, 0, 14)
const ENTRY := Vector3(-4, 0, 12)

func load_checkpoint(data: Variant, rescued: bool) -> void:
    stage = 1 if rescued else 0
    if data is Dictionary:
        var value: Variant = data.get("stage")
        if (value is int or value is float) and is_finite(float(value)) and value == floor(value) and value >= 0 and value <= 6 and (rescued or value == 0):
            stage = int(value)

func _ready() -> void:
    for i in range(3):
        var body := CharacterBody3D.new()
        body.collision_layer = 0
        body.collision_mask = 1
        var shape := CollisionShape3D.new()
        var capsule := CapsuleShape3D.new()
        capsule.radius = .28
        capsule.height = .65
        shape.shape = capsule
        shape.position.y = .4
        body.add_child(shape)
        body.add_child(preload("res://assets/lamb.glb").instantiate())
        add_child(body)
        body.scale = Vector3.ONE * .7
        sheep.append(body)
    for pos in [Vector3(-6.5,.5,14), Vector3(-1.5,.5,14), Vector3(-4,.5,16)]:
        solid(pos, Vector3(.2,1,4) if pos.x != -4 else Vector3(5,1,.2))
    solid(Vector3(-6,.5,12), Vector3(1,1,.2))
    solid(Vector3(-2,.5,12), Vector3(1,1,.2))
    gate = solid(ENTRY + Vector3(0,.5,0), Vector3(3,1,.2))
    for i in range(2):
        supplies.append(host._box(self, Vector3(-8+i*2,.18,10), Vector3(1.4,.22,.3), Color("c99a5c")))
        patches.append(host._box(self, Vector3(-6.4+i*4.8,.6,14), Vector3(.3,.25,2), Color("e0b777")))
    warning = Label3D.new()
    warning.position = Vector3(0,2,14)
    warning.font_size = 40
    warning.pixel_size = .012
    add_child(warning)
    restore()

func solid(pos: Vector3, size: Vector3) -> StaticBody3D:
    var body := StaticBody3D.new()
    body.position = pos
    add_child(body)
    var shape := CollisionShape3D.new()
    var box := BoxShape3D.new()
    box.size = size
    shape.shape = box
    body.add_child(shape)
    host._box(body, Vector3.ZERO, size, Color("876346"))
    return body

func restore() -> void:
    visible = stage > 0
    shelter_time = 0.0
    repairs = 2 if stage >= 4 else 0
    held = false
    for i in range(3):
        sheep[i].position = (HOME + Vector3(i*1.3-1.3,0,-2)) if stage <= 2 else PASTURE + Vector3(i-1,0,0)
        if stage >= 5:
            sheep[i].position = FOLD + Vector3(i-1,0,0)
        if stage == 6:
            sheep[i].position = HOME + Vector3(i-1,0,0)
        called[i] = stage > 1
        counted[i] = stage == 6
    sync()

func sync() -> void:
    for child in get_children():
        if child is StaticBody3D:
            child.collision_layer = 1 if stage > 0 else 0
    for i in range(2):
        patches[i].visible = repairs > i
        supplies[i].visible = stage == 3 and repairs <= i and not (held and repairs == i)
    gate.visible = shelter_time > 0
    gate.get_child(0).set_deferred("disabled", shelter_time <= 0)
    warning.visible = stage == 4
    warning.text = host.t("Distant lion · prototype marker", "Лев вдали · временный знак")

func advance() -> void:
    if stage >= 6: return
    stage += 1
    host._save_progress()
    # A storage failure must not undo the child's successful physical action.
    # Keep this run playable; the HUD explains that this checkpoint is unsaved.
    host._notice("flock_step")
    sync()
    if stage == 6:
        host.modal_kind = "flock_complete"
        host.paused = true
        host.player.set_enabled(false)
        host._refresh_ui()

func near(pos: Vector3, radius: float = 2.3) -> bool:
    return host.player.position.distance_to(pos) < radius

func can_call(i: int) -> bool:
    if not near(sheep[i].position, 4.2): return false
    var ray := PhysicsRayQueryParameters3D.create(host.player.position + Vector3.UP*.7, sheep[i].position+Vector3.UP*.5)
    ray.exclude = [host.player.get_rid()]
    return get_world_3d().direct_space_state.intersect_ray(ray).is_empty()

func context() -> String:
    if stage == 0 or stage == 6 or shelter_time > 0: return ""
    if stage == 3:
        if held and near(patches[repairs].position): return "repair"
        if not held and near(supplies[repairs].position): return "wood"
        return ""
    if stage == 4 and near(ENTRY) and all_at(FOLD, 1.8) and host.player.position.z > 12.6:
        return "close"
    for i in range(3):
        if stage == 5 and not counted[i] and near(HOME, 3) and sheep[i].position.distance_to(HOME) < 3 and near(sheep[i].position):
            return "count"
        if can_call(i) and (not called[i] or sheep[i].position.distance_to(host.player.position) > 2): return "flock_call"
    return ""

func interact() -> void:
    if host.paused or shelter_time > 0: return
    match context():
        "wood":
            held = true
            host._notice("flock_wood")
        "repair":
            held = false
            repairs += 1
            host._notice("flock_repair")
            if repairs == 2: advance()
        "close":
            # All three and player must be fully inside; no gate closing on sheep.
            gate.visible = true
            gate.get_child(0).set_deferred("disabled", false)
            shelter_time = 2.0 # shelter is visibly closed before the safe return
        "count":
            for i in range(3):
                if not counted[i] and near(sheep[i].position) and sheep[i].position.distance_to(HOME) < 3:
                    counted[i] = true
                    host._notice("flock_count")
                    break
            if counted.all(func(v): return v): advance()
        "flock_call":
            for i in range(3):
                if can_call(i): called[i] = true
            host._notice("flock_call")
            if stage == 1 and called.all(func(v): return v): advance()
    sync()

func all_at(pos: Vector3, radius: float) -> bool:
    for body in sheep:
        if body.position.distance_to(pos) > radius: return false
    return true

func tick(delta: float) -> void:
    if host.paused or stage not in [1,2,4,5]: return
    if shelter_time > 0:
        shelter_time = maxf(0, shelter_time - delta)
        if shelter_time == 0: advance()
        return
    for i in range(3):
        var body := sheep[i]
        if not called[i]: continue
        var distance: float = body.position.distance_to(host.player.position)
        if distance > (5.5 if i == 2 else 7.0):
            called[i] = false # straggler waits; return and call, never teleport
            continue
        var target: Vector3 = host.player.position
        if stage == 4:
            if body.position.z < 12.5:
                target = ENTRY + Vector3(0,0,.8) if absf(body.position.x+4) < .7 else ENTRY + Vector3(0,0,-.8)
            elif host.player.position.z > 12.6: target = FOLD + Vector3((i-1)*.75,0,0)
        elif stage == 5 and body.position.z > 11.5:
            target = ENTRY + Vector3(0,0,-1) if absf(body.position.x+4) < .6 else FOLD
        elif stage == 2 and near(PASTURE,2): target = PASTURE + Vector3((i-1)*.7,0,0)
        elif stage == 5 and near(HOME,3): target = HOME + Vector3((i-1)*.8,0,0)
        var direction := target-body.position
        direction.y = 0
        if direction.length() < (.25 if target != host.player.position else 1.2): continue
        var motion := direction.normalized()*minf(2.4*clampf(delta,0,.05),direction.length())
        for contact in range(3):
            var hit := body.move_and_collide(motion)
            if hit == null: break
            motion = hit.get_remainder().slide(hit.get_normal())
            motion.y = 0
        body.rotation.y = atan2(-direction.z,direction.x)
    if stage == 2 and all_at(PASTURE,1.8): advance()

func objective() -> String:
    if shelter_time > 0:
        return host.t("Everyone is safe · wait together", "Все в безопасности · подожди немного")
    if stage in [2,4,5] and called.has(false):
        return host.t("A sheep is waiting · follow the marker and call", "Овечка ждёт · иди к метке и позови")
    var goals := ["",host.t("1 · Call the three sheep", "1 · Позови трёх овечек"),host.t("2 · Lead everyone to pasture", "2 · Веди всех на пастбище"),host.t("3 · Repair both fence rails", "3 · Почини две секции ограды"),host.t("4 · Lead inside and close the gate", "4 · Веди внутрь и закрой ворота"),host.t("5 · Lead home and count all three", "5 · Веди домой и посчитай всех"),host.t("Chapter complete · everyone home safely!", "Глава пройдена · все благополучно дома!")]
    return goals[stage]

func action_text() -> String:
    return {"flock_call":host.t("Call sheep", "Позвать овечек"),"wood":host.t("Take board", "Взять доску"),"repair":host.t("Fit rail", "Починить ограду"),"close":host.t("Close safely", "Закрыть ворота"),"count":host.t("Count sheep", "Посчитать овечку")}.get(context(), "")

func destination() -> Vector3:
    if stage in [1,2,4,5]:
        for i in range(3):
            if not called[i]: return sheep[i].position
    if stage == 2: return PASTURE
    if stage == 3: return patches[repairs].position if held else supplies[repairs].position
    if stage == 4: return FOLD
    return HOME

func progress_text() -> String:
    if not host.saves_ok:
        return host.t("Not saved on this device · you can keep playing", "Не сохранено на устройстве · можно играть дальше")
    if stage == 1: return host.t("Called: %d/3", "Позвал: %d/3") % called.count(true)
    if stage == 3:
        return (host.t("Holding a board · rails %d/2", "Доска у тебя · ограда %d/2") if held else host.t("Rails repaired: %d/2", "Ограда починена: %d/2")) % repairs
    if stage == 5: return host.t("Counted at home: %d/3", "Посчитано дома: %d/3") % counted.count(true)
    if stage in [2,4]: return host.t("Following: %d/3 · walk slowly", "Рядом: %d/3 · иди медленно") % called.count(true)
    return ""
