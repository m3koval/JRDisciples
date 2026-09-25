extends Node3D
## Fictional shepherd adventure: defeat attackers and protect the flock.
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
var animal_reveals: Array = []
var lamb_reveal
var lantern: OmniLight3D
var animal_rigs: Array[Node3D] = []
var lamb_model: Node3D
var campfire: OmniLight3D
var base_ambient := -1.0
var lamb: CharacterBody3D
var wool_read := false
var warning_mark: MeshInstance3D
var message := ""
var message_time := 0.0
const STAFF_REACH := 2.8
const STAFF_COOLDOWN := .75
var staff_cooldown := 0.0
var staff_swing := 0.0
var staff: Node3D
var bodies: Array[CharacterBody3D] = []
const VICTORY_TIME := .65
var poof: Node3D
const ANIMAL_MAX_HEALTH := 2
var animal_health_bars: Array[Sprite3D] = []
var health_textures: Array[Texture2D] = []

func animal_health(i: int) -> int:
    if completed_steps.has(STEPS[i*2+1]): return 0
    return maxi(0,ANIMAL_MAX_HEALTH-drive_count) if animal_index == i else ANIMAL_MAX_HEALTH

func build_health_bars() -> void:
    for hp in range(ANIMAL_MAX_HEALTH+1):
        var image := Image.create(128,18,false,Image.FORMAT_RGBA8)
        image.fill(Color("242c31"))
        for segment in range(ANIMAL_MAX_HEALTH):
            var color := Color("edba58") if hp == 1 else Color("87c77b")
            image.fill_rect(Rect2i(3+segment*62,3,60,12),color if segment < hp else Color("4a5052"))
        health_textures.append(ImageTexture.create_from_image(image))
    for animal in animals:
        var bar := Sprite3D.new()
        bar.name = "AttackerHealth"
        bar.pixel_size = .012
        bar.position.y = 2.2
        bar.billboard = BaseMaterial3D.BILLBOARD_ENABLED
        bar.texture_filter = BaseMaterial3D.TEXTURE_FILTER_NEAREST
        animal.add_child(bar)
        animal_health_bars.append(bar)
    sync_health_bars()

func sync_health_bars() -> void:
    for i in range(animal_health_bars.size()):
        animal_health_bars[i].texture = health_textures[animal_health(i)]
        animal_health_bars[i].visible = active and animal_index == i and animal_health(i) > 0

func build_poof() -> void:
    poof = Node3D.new()
    poof.name = "VictoryPoof"
    add_child(poof)
    var material := StandardMaterial3D.new()
    material.albedo_color = Color("eee4ce")
    material.roughness = 1.0
    for n in range(12):
        var puff := MeshInstance3D.new()
        var box := BoxMesh.new()
        box.size = Vector3.ONE * (.32 if n % 3 else .43)
        puff.mesh = box
        puff.material_override = material
        poof.add_child(puff)
    poof.hide()

func pose_poof() -> void:
    var progress := clampf(1.0-timer/VICTORY_TIME,0,1)
    for n in range(poof.get_child_count()):
        var puff := poof.get_child(n) as MeshInstance3D
        var angle := float(n)*TAU/12.0
        var radius := .18+progress*(.65+float(n % 3)*.14)
        puff.position = Vector3(cos(angle)*radius,.35+float(n % 3)*.3+progress*.55,sin(angle)*radius)
        puff.rotation = Vector3(progress*.6,angle+progress*.8,progress*.4)
        puff.scale = Vector3.ONE * maxf(.001,1.0-smoothstep(.25,1,progress))

func defeat_animal() -> void:
    if animal_index < 0 or animal_health(animal_index) > 0: return
    var won_step: String = STEPS[animal_index*2+1]
    # Award the actual win immediately, independent of effect duration or leash.
    poof.position = animals[animal_index].position
    animals[animal_index].hide()
    phase = "victory"
    timer = VICTORY_TIME
    warning_mark.hide()
    poof.show()
    pose_poof()
    drive_count = 0
    animal_index = -1
    message = "victory"
    message_time = 4
    earn(won_step)
    sync_health_bars()

func in_arena(p: Vector3, i: int) -> bool:
    return p.z <= -3.5 and p.z >= -12.5 and absf(p.x-ENTRANCES[i].x) <= 3.8

func clear_path(a: Vector3, b: Vector3) -> bool:
    var ray := PhysicsRayQueryParameters3D.create(a+Vector3.UP*.8,b+Vector3.UP*.8,1)
    ray.exclude = [host.player.get_rid()]
    return get_world_3d().direct_space_state.intersect_ray(ray).is_empty()

func move_animal(i: int, target: Vector3, distance: float) -> void:
    target = Vector3(clampf(target.x,ENTRANCES[i].x-3.5,ENTRANCES[i].x+3.5),0,clampf(target.z,-12,-3.5))
    var body := bodies[i]
    body.position = animals[i].position
    body.move_and_collide(body.position.direction_to(target)*minf(distance,body.position.distance_to(target)))
    animals[i].position = body.position

func defend() -> void:
    if host.paused or not active or animal_index < 0 or phase not in ["chase","warn","lunge","recover"]: return
    if staff_cooldown > 0:
        message = "cooldown"
        message_time = .5
        return
    staff_cooldown = STAFF_COOLDOWN
    staff_swing = .3
    if not can_drive():
        message = "miss"
        message_time = 1.2
        return
    drive_count += 1
    sync_health_bars()
    var away: Vector3 = animals[animal_index].position-host.player.position
    away.y = 0
    if away.length() < .1: away = Vector3.FORWARD
    move_animal(animal_index,animals[animal_index].position+away.normalized()*1.4,1.4)
    if drive_count >= ANIMAL_MAX_HEALTH:
        defeat_animal()
        return
    retreat_from = animals[animal_index].position
    phase = "retreat"
    timer = 1.2
    message = "defended"
    message_time = 1.2
var stage: int:
    get: return completed_steps.size()

func load_checkpoint(data: Variant, flock_stage: int) -> void:
    active = false
    completed_steps.clear()
    wool_read = false
    health = 3
    if flock_stage != 6 or not data is Dictionary: return
    if not data.get("active") is bool or not data.get("steps") is Array: return
    var values: Array = data.steps
    if values.size() > STEPS.size(): return
    var version: Variant = data.get("version", 1)
    if not (version is int or version is float): return
    if version != 1 and version != 2: return
    var nonlinear: bool = version == 2
    if (nonlinear or data.has("wool_read")) and not data.get("wool_read") is bool: return
    var checked: Array[String] = []
    for i in range(values.size()):
        if not values[i] is String or values[i] not in STEPS or values[i] in checked: return
        if not nonlinear and values[i] != STEPS[i]: return
        if values[i] == "lion_safe" and "lion_clue" not in checked: return
        if values[i] == "bear_safe" and "bear_clue" not in checked: return
        if values[i] == "lamb_found" and nonlinear and not data.wool_read: return
        if values[i] == "home" and checked.size() != 5: return
        checked.append(values[i])
    active = data.active
    for value in values: completed_steps.append(value)
    wool_read = data.get("wool_read", completed_steps.has("lamb_found"))

func snapshot() -> Dictionary:
    return {"version": 2, "active": active, "steps": completed_steps.duplicate(), "wool_read": wool_read or completed_steps.has("lamb_found")}

func _ready() -> void:
    # Enclosed, scanned-rock chambers: see cave_scenery.gd.
    preload("res://scripts/cave_scenery.gd").build(self, ENTRANCES)
    visibility_changed.connect(sync_backdrop)
    for i in range(3):
        var e: Vector3 = ENTRANCES[i]
        # Wooden clue board beside (not in) the walk-in line at x = e.x.
        var post := Node3D.new()
        # Courtyard-side station forward of the rock apron: outside the
        # interior camera sightline, retaining the original readable scale.
        post.name = "CaveCluePost%d" % i
        post.position = e+Vector3(-1.8,0,1.9)
        add_child(post)
        host._box(post,Vector3(0,.65,-.08),Vector3(.14,1.3,.14),Color("5c4530"))
        host._box(post,Vector3(0,1.25,0),Vector3(1.40,.50,.10),Color("765038"))
        var sign := Label3D.new()
        sign.position = post.position+Vector3(0,1.25,.07)
        sign.font_size = 24
        sign.pixel_size = .008
        sign.modulate = Color("fff4df")
        sign.outline_size = 4
        sign.double_sided = false
        add_child(sign)
        signs.append(sign)
    lantern = OmniLight3D.new()
    lantern.light_color = Color("ffc47a")
    lantern.light_energy = 0.0
    lantern.omni_range = 7.5
    lantern.position = Vector3(.3,1.1,.35)
    host.player.add_child(lantern)
    animals.append(make_animal("lion",ENTRANCES[0]+Vector3(0,0,-8)))
    animals.append(make_animal("bear",ENTRANCES[1]+Vector3(0,0,-8)))
    build_health_bars()
    for rig in animal_rigs:
        animal_reveals.append(preload("res://scripts/cave_reveal.gd").new(rig))
    for animal in animals:
        var body := CharacterBody3D.new()
        body.collision_layer = 0
        body.collision_mask = 1
        var collider := CollisionShape3D.new()
        var capsule := CapsuleShape3D.new()
        capsule.radius = .55
        capsule.height = 1.4
        collider.shape = capsule
        collider.position.y = .75
        body.add_child(collider)
        add_child(body)
        body.add_collision_exception_with(host.player)
        bodies.append(body)
    staff = Node3D.new()
    staff.name = "DefenseStaff"
    add_child(staff)
    host._box(staff,Vector3(.55,1,1),Vector3(.12,.12,2),Color("a36c38"))
    staff.visible = false
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
    lamb_model = preload("res://assets/lamb.glb").instantiate()
    lamb.add_child(lamb_model)
    lamb_reveal = preload("res://scripts/cave_reveal.gd").new(lamb_model)
    add_child(lamb)
    # Green grass ring marks the healing camp; the fire pit sits to one side
    # so the camp spawn point never lands in it.
    var ring := MeshInstance3D.new()
    var disc := CylinderMesh.new()
    disc.top_radius = 2.8
    disc.bottom_radius = 2.9
    disc.height = .02
    ring.mesh = disc
    ring.material_override = preload("res://assets/environment/village_finish.gd").ground_material(Color("5f7d45"))
    ring.position = CAMP+Vector3(0,.01,0)
    add_child(ring)
    var fire := preload("res://scripts/cave_scenery.gd").scan(self,"stone_fire_pit",CAMP+Vector3(-2.4,.19,.8),1.0,20)
    campfire = OmniLight3D.new()
    campfire.light_color = Color("ffa050")
    campfire.light_energy = 1.6
    campfire.omni_range = 6.0
    campfire.position = Vector3(0,.7,0)
    fire.add_child(campfire)
    var camp_sign := Label3D.new()
    camp_sign.position = CAMP+Vector3(0,2.5,0)
    camp_sign.name = "CampSign"
    camp_sign.font_size = 40
    camp_sign.pixel_size = .006
    add_child(camp_sign)
    warning_mark = host._box(self,Vector3.ZERO,Vector3(2.6,.04,2.6),Color("edb453"))
    warning_mark.visible = false
    build_poof()
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


func make_animal(id: String, pos: Vector3) -> Node3D:
    var node := Node3D.new()
    add_child(node)
    node.position = pos
    var rig := preload("res://scripts/cave_block_animal.gd").new()
    node.add_child(rig)
    animal_rigs.append(rig)
    rig.configure(id)
    var motion := preload("res://scripts/cave_animal_motion.gd").new()
    motion.attach(node,id)
    animal_motion.append(motion)
    return node

func restore() -> void:
    visible = active
    health = 3
    invulnerability = 0
    phase = "idle"
    warning_mark.visible = false
    poof.hide()
    animal_index = -1
    drive_count = 0
    timer = 0
    staff_cooldown = 0
    staff_swing = 0
    staff.visible = false
    message_time = 0
    sync_health_bars()
    for i in range(animals.size()):
        animals[i].position = ENTRANCES[i]+Vector3(0,0,-8)
        animals[i].rotation = Vector3.ZERO
        animal_motion[i].reset_pose()
        animals[i].visible = not completed_steps.has(STEPS[i*2+1])
    lamb.position = CAMP+Vector3(1,0,0) if stage == 6 else ENTRANCES[2]+Vector3(0,0,-10)
    if active: teleport_camp()
    sync_darkness(1.0)
    sync_labels()

func sync_backdrop() -> void:
    # The opening meadow's 95m distant-hills ring runs straight through this
    # courtyard; hide it whenever the caves are shown.
    var ridge := host.find_child("DistantRidge1", true, false) as Node3D
    if ridge: ridge.visible = not visible

func chamber_of(p: Vector3) -> int:
    for i in range(ENTRANCES.size()):
        if p.z < -.4 and absf(p.x-ENTRANCES[i].x) < 5.3: return i
    return -1

func sync_darkness(delta: float) -> void:
    # Chambers are dark: what is inside only shows once you step in, by
    # lantern light, so the courtyard never gives away which cave holds what.
    # Only the models hide; animals[i].visible stays the "undefeated" state.
    var inside := chamber_of(host.player.position) if active else -1
    for i in range(animal_reveals.size()):
        animal_reveals[i].update(inside == i, delta, inside != i)
    # Leaving hides contents immediately; entering reveals them with the lamp,
    # rather than a one-frame pop. Logical animal victory visibility is untouched.
    lamb_reveal.update(stage >= 5 or inside == 2, delta, stage < 5 and inside != 2)
    var blend := 1.0-exp(-5.0*delta)
    lantern.light_energy = lerpf(lantern.light_energy, 2.6 if inside >= 0 else 0.0, blend)
    var env: Environment = get_world_3d().environment
    if env == null: return
    if base_ambient < 0: base_ambient = env.ambient_light_energy
    env.ambient_light_energy = lerpf(env.ambient_light_energy, base_ambient*(.3 if inside >= 0 else 1.0), blend)

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
    if phase == "victory": return ""
    if near(CAMP,3):
        if stage == 5 and lamb.position.distance_to(CAMP) < 3: return "home"
        if health < 3: return "heal"
        if stage == 6: return "return"
    if animal_index >= 0 and phase in ["chase","warn","lunge","recover"] and in_arena(host.player.position,animal_index): return "drive"
    if nearby_clue() >= 0: return "clue"
    if stage == 5 and near(lamb.position,3) and phase == "waiting": return "call_lamb"
    return ""

func can_drive() -> bool:
    if phase not in ["chase","warn","lunge","recover"] or animal_index < 0: return false
    var p: Vector3 = host.player.position
    if not in_arena(p,animal_index): return false
    if not near(animals[animal_index].position,STAFF_REACH): return false
    return clear_path(p,animals[animal_index].position)

func earn(step: String) -> void:
    if completed_steps.has(step): return
    completed_steps.append(step)
    host._save_progress()

func nearby_clue() -> int:
    for i in range(3):
        if (near(ENTRANCES[i]) or near(signs[i].position)) and (not wool_read if i == 2 else not completed_steps.has(STEPS[i*2])):
            return i
    return -1

func safe_to_escort() -> bool:
    return completed_steps.has("lion_safe") and completed_steps.has("bear_safe")

func interact() -> void:
    if host.paused: return
    match context():
        "caves":
            start()
            host.modal_kind = "cave_intro"
            host.paused = true
            host.player.set_enabled(false)
        "clue":
            var clue := nearby_clue()
            if clue == 2:
                # Last clue points inside; discovery requires actually reaching lamb.
                wool_read = true
                host._save_progress()
                message = "wool"
                message_time = 6
            else:
                earn(STEPS[clue*2])
                message = "tracks"
                message_time = 5
        "heal":
            health = 3
            invulnerability = 2
            message = "healed"
            message_time = 3
        "drive":
            defend()
        "call_lamb": phase = "following"
        "home":
            earn("home")
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
    staff_cooldown = maxf(0,staff_cooldown-delta)
    staff_swing = maxf(0,staff_swing-delta)
    staff.visible = staff_swing > 0
    staff.position = host.player.position
    staff.rotation.y = host.player._visual.rotation.y + sin((1-staff_swing/.3)*PI)*1.2-.6
    _tick_gameplay(delta)
    sync_health_bars()
    sync_darkness(delta)
    var t := Time.get_ticks_msec()
    campfire.light_energy = 1.5+.25*sin(t*.011)*sin(t*.0037)
    for i in range(animals.size()):
        var state := phase if i == animal_index else "idle"
        var facing := Vector3.BACK
        if state == "chase": facing = host.player.position-animals[i].position
        elif state in ["warn","lunge","recover"]: facing = lunge_to-lunge_from
        elif state == "retreat": facing = ENTRANCES[i]+Vector3(0,0,-12)-animals[i].position
        animal_motion[i].step(delta,state,timer,facing)

func _tick_gameplay(delta: float) -> void:
    invulnerability = maxf(0,invulnerability-delta)
    message_time = maxf(0,message_time-delta)
    if phase == "victory":
        timer = maxf(0,timer-delta)
        pose_poof()
        if timer <= 0:
            poof.hide()
            phase = "idle"
        return
    var p: Vector3 = host.player.position
    if p.y < -.8 or p.x < 80 or p.x > 120 or absf(p.z) > 16:
        retry_checkpoint()
        return
    warning_mark.visible = phase in ["warn", "lunge"]
    warning_mark.position = (animals[1].position if animal_index == 1 else lunge_to) + Vector3.UP*.04
    warning_mark.scale = Vector3(5.6/2.6,1,5.6/2.6) if animal_index == 1 else Vector3.ONE
    if wool_read and not completed_steps.has("lamb_found") and near(lamb.position,2.5):
        earn("lamb_found")
        if safe_to_escort(): phase = "waiting"
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
    var i := chamber_of(p)
    # Return every unfinished attacker in an unoccupied chamber on every tick,
    # not just the departure frame before animal_index is cleared.
    for other in range(animals.size()):
        if other != i and not completed_steps.has(STEPS[other*2+1]):
            move_animal(other,ENTRANCES[other]+Vector3(0,0,-8),delta*4)
    if i < 0 or i > 1 or not completed_steps.has(STEPS[i*2]) or completed_steps.has(STEPS[i*2+1]):
        animal_index = -1
        drive_count = 0
        phase = "idle"
        warning_mark.hide()
        return
    if animal_index >= 0 and animal_index != i:
        drive_count = 0
        phase = "idle"
    # Let the child clear the narrow rock arch before asking for a sideways
    # dodge. The fight takes place in the wider chamber, not in its doorway.
    if not in_arena(p,i):
        drive_count = 0
        phase = "idle"
        animal_index = -1
        warning_mark.visible = false
        move_animal(i,ENTRANCES[i]+Vector3(0,0,-8),delta*4)
        return
    animal_index = i
    timer -= delta
    var animal := animals[i]
    match phase:
        "idle":
            phase = "chase"
        "chase":
            if not clear_path(animal.position,p): return
            var flat := Vector3(p.x,0,p.z)
            move_animal(i,flat,delta*(3.2 if i == 0 else 1.9))
            if animal.position.distance_to(flat) > (3.2 if i == 0 else 2.5): return
            phase = "warn"
            timer = 1.1 if i == 0 else 1.4
            lunge_from = animal.position
            lunge_to = Vector3(clampf(p.x,ENTRANCES[i].x-3.4,ENTRANCES[i].x+3.4),0,clampf(p.z,-12,-3.5))
        "warn":
            if timer <= 0:
                phase = "lunge"
                timer = .45 if i == 0 else .22
        "lunge":
            if i == 0: move_animal(i,lunge_to,delta*10)
            # Attack volumes are grounded: feet above this height clear either attack.
            var flat_distance := Vector2(p.x-animal.position.x,p.z-animal.position.z).length()
            if p.y < .85 and flat_distance < (1.35 if i == 0 else 2.8) and clear_path(animal.position,p): hurt()
            if phase == "lunge" and timer <= 0:
                phase = "recover"
                timer = 2.2
        "recover":
            if timer <= 0: phase = "idle"
        "retreat":
            # Retreat stays collision swept, just like pursuit and knockback.
            move_animal(i,ENTRANCES[i]+Vector3(0,0,-12),delta*5)
            if timer <= 0 and animal.position.distance_to(ENTRANCES[i]+Vector3(0,0,-12)) < .001:
                phase = "idle"
    sync_labels()

func destination() -> Vector3:
    if not active: return host.CAMP
    if health < 3 and near(CAMP,5): return CAMP
    if stage == 6 or (stage == 5 and phase == "following"): return CAMP
    if safe_to_escort(): return lamb.position if wool_read else ENTRANCES[2]
    var nearest := -1
    var distance := INF
    for i in range(3):
        if (completed_steps.has("lamb_found") if i == 2 else completed_steps.has(STEPS[i*2+1])): continue
        var d: float = host.player.position.distance_to(ENTRANCES[i])
        if d < distance:
            distance = d
            nearest = i
    if nearest == 2: return lamb.position if wool_read else ENTRANCES[2]
    return ENTRANCES[nearest]+Vector3(0,0,-4 if completed_steps.has(STEPS[nearest*2]) else 0)

func objective() -> String:
    if phase == "victory": return host.t("Victory! You protected the flock.", "Победа! Ты защитил стадо.")
    if safe_to_escort() and not wool_read:
        return host.t("Read the wool clue at the right entrance", "Изучи шерсть у правого входа")
    if phase == "chase": return host.t("Run and make room · staff defends nearby", "Беги и держи расстояние · посох защищает вблизи")
    if phase == "warn": return host.t("Warning! Run sideways or time a jump", "Внимание! Беги в сторону или прыгни вовремя")
    if phase == "lunge": return host.t("Run · jump · defend!", "Беги · прыгай · защищайся!")
    if phase == "recover": return host.t("Come within staff reach · defend", "Подойди на длину посоха · защищайся")
    if stage == 5: return host.t("Call the lamb · walk slowly to green camp", "Позови ягнёнка · веди к зелёному лагерю")
    if stage == 6: return host.t("Safe together! Return to the clearing", "Все в безопасности! Вернись на поляну")
    if safe_to_escort(): return host.t("White wool leads inside · find the lamb", "Белая шерсть ведёт внутрь · найди ягнёнка")
    if completed_steps.has("lamb_found"):
        return host.t("Lamb found! Make both animal caves safe, then return for it", "Ягнёнок найден! Победи обоих зверей и вернись за ним")
    var inside := chamber_of(host.player.position)
    if inside in [0,1] and completed_steps.has(STEPS[inside*2]) and not completed_steps.has(STEPS[inside*2+1]):
        return host.t("Follow the tracks inside · staff ready", "Иди по следам внутрь · приготовь посох")
    return host.t("Choose any cave · read its clue and explore", "Выбери любую пещеру · изучи следы и войди")

func action_text() -> String:
    return {"caves":host.t("Continue to caves", "Дальше: пещеры"),"clue":host.t("Read the clue", "Изучить следы"),"drive":host.t("Defend · staff", "Защита · посох"),"heal":host.t("Rest and heal", "Отдохнуть"),"call_lamb":host.t("Call the lamb", "Позвать ягнёнка"),"home":host.t("Welcome home", "Мы дома"),"return":host.t("Return to clearing", "На поляну")}.get(context(),"")

func progress_text() -> String:
    var result: String = host.t("Health %d/3 · green camp heals · %d/6", "Здоровье %d/3 · отдых в лагере · %d/6") % [health,stage]
    if not host.saves_ok: result += host.t(" · not saved", " · не сохранено")
    return result

func notice_text() -> String:
    if message_time <= 0: return ""
    if message == "victory" and phase == "victory": return "" # Victory is already the main objective.
    if message == "miss": return host.t("Staff missed · move closer with a clear path", "Посох не достал · подойди, преграда мешает")
    if message == "cooldown": return host.t("Staff is readying · keep moving", "Посох готовится · продолжай двигаться")
    if message == "defended": return host.t("Good hit! Stay ready for its next attack.", "Попал! Готовься к следующей атаке.")
    return {"wool":host.t("Soft white wool leads inside the right cave.", "Белая шерсть ведёт внутрь правой пещеры."),"tracks":host.t("Animal tracks! Wait for the warning, dodge sideways, then act.", "Следы зверя! Жди сигнала, отойди в сторону и действуй."),"healed":host.t("Rested! All three hearts restored.", "Отдохнул! Здоровье восстановлено."),"ouch":host.t("A bump! Move away; you have a moment of safety.", "Ушиб! Отойди; сейчас ты ненадолго защищён."),"retry":host.t("Safe at camp. Rested and ready; your progress is kept.", "Ты в лагере. Отдохнул! Твой успех сохранён."),"victory":host.t("Victory! You protected the flock. Follow the next clue!", "Победа! Ты защитил стадо. Ищи следующую подсказку!")}.get(message,"")

func sync_labels() -> void:
    for i in range(signs.size()): signs[i].text = [host.t("Paw prints", "Следы лап"),host.t("Big tracks", "Большие следы"),host.t("White wool", "Белая шерсть")][i]
    get_node("CampSign").text = host.t("Safe camp · rest here", "Лагерь · здесь безопасно")

func intro_text() -> String:
    return host.t("Choose any cave and read its clue. Find the lamb early or face either animal first. Defeat both attackers before escorting the lamb home.\n\nWatch the attack cue. Run sideways or jump, then strike with your staff (E / action button). Land two hits to win. Each swing takes a moment to ready again.\n\nRest at camp to recover health. If you fall, restart the unfinished fight; completed steps stay earned.\n\nA fictional shepherd adventure inspired by David.", "Выбери любую пещеру и изучи следы. Найди ягнёнка сначала или начни с любого зверя. Победи обоих нападающих, прежде чем вести ягнёнка домой.\n\nСледи за движениями зверя. Беги в сторону или прыгай, затем бей посохом (E / кнопка). Два попадания — победа. Между взмахами нужна короткая пауза.\n\nОтдых в лагере восстановит здоровье. При поражении начни незаконченный бой заново; пройденные шаги сохранятся.\n\nВыдуманное приключение пастуха, вдохновлённое Давидом.")

func credits() -> String:
    return host.t("\n\nArt credits:\nOriginal articulated animals and cave shell — project art\nRock scans and textures — Poly Haven, CC0\nLegacy cave kit — Kenney, CC0\nArchived animal GLB credits: assets/caves/CREDITS\n", "\n\nАвторы моделей:\nОригинальные подвижные звери и пещеры — графика проекта\nСканы камней и текстуры — Poly Haven, CC0\nИсходный набор пещер — Kenney, CC0\nАвторы архивных GLB: assets/caves/CREDITS\n") + "https://creativecommons.org/licenses/by/3.0/\nhttps://kenney.nl/assets\nhttps://polyhaven.com"
