extends Node3D
## Presentation only: clues and rescue reactions never add save prerequisites.
var cave
var evidence: Array[Node3D] = []
var cue: Label3D
var lamb_cue: Label3D
var elapsed := 0.0
var last_lamb_position := Vector3.ZERO
var reunion_time := 0.0
var lion_lane := BoxMesh.new()
var bear_disc := CylinderMesh.new()

func setup(owner_cave) -> void:
    cave = owner_cave
    name = "CaveDiscovery"
    for i in range(3):
        var trail := Node3D.new()
        trail.name = ["LionPawprints", "BearPawprints", "WoolTrail"][i]
        add_child(trail)
        evidence.append(trail)
        # Real ground evidence on both sides of the arch, not just a sign.
        for n in range(8):
            var pos: Vector3 = cave.ENTRANCES[i]+Vector3(.42 if n%2 else -.42,.045,2.0-float(n)*1.35)
            if i == 2:
                for tuft in range(3):
                    blob(trail,pos+Vector3(float(tuft-1)*.10,.04,.035*tuft),Vector3(.16,.12,.23),Color("eee6ce"))
            else:
                var size := 1.0 if i == 0 else 1.3
                blob(trail,pos,Vector3(.29,.025,.32)*size,Color("786044"))
                for toe in range(4):
                    blob(trail,pos+Vector3((float(toe)-1.5)*.105*size,0,-.23*size),Vector3(.095,.026,.12)*size,Color("786044"))
    cue = label(self,Vector3.ZERO,26)
    cue.name = "ContextTeaching"
    lamb_cue = label(cave.lamb,Vector3(0,1.55,0),25)
    lamb_cue.name = "LambReaction"
    bear_disc.top_radius = 2.8
    bear_disc.bottom_radius = 2.8
    bear_disc.height = .025
    # Telegraph the actual danger footprint without painting over the terrain.
    var warning_material := StandardMaterial3D.new()
    warning_material.albedo_color = Color(1.0,.68,.18,.28)
    warning_material.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
    warning_material.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
    cave.warning_mark.material_override = warning_material
    cave.warning_mark.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
    reset()

func blob(parent: Node3D, pos: Vector3, size: Vector3, color: Color) -> void:
    var mesh := MeshInstance3D.new()
    var sphere := SphereMesh.new()
    sphere.radius = .5
    sphere.height = 1.0
    sphere.radial_segments = 8
    sphere.rings = 4
    mesh.mesh = sphere
    mesh.position = pos
    mesh.scale = size
    var material := StandardMaterial3D.new()
    material.albedo_color = color
    material.roughness = 1.0
    mesh.material_override = material
    mesh.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
    parent.add_child(mesh)

func label(parent: Node3D, pos: Vector3, font_size: int) -> Label3D:
    var result := Label3D.new()
    result.position = pos
    result.font_size = font_size
    result.pixel_size = .006
    result.outline_size = 7
    result.modulate = Color("fff1cc")
    result.billboard = BaseMaterial3D.BILLBOARD_ENABLED
    parent.add_child(result)
    return result

func reset() -> void:
    elapsed = 0
    reunion_time = 0
    last_lamb_position = cave.lamb.position
    cave.lamb_model.position.y = 0
    cave.lamb_model.rotation.z = 0
    cue.text = ""
    lamb_cue.text = ""

func reunite() -> void:
    reunion_time = 3.0
    cave.lamb.position = cave.CAMP+Vector3(1,0,0)
    cave.lamb_model.position.y = 0
    cave.lamb_model.rotation.z = 0
    lamb_cue.text = cave.host.t("Home together!", "Мы снова вместе!")
    lamb_cue.visible = true

func guidance() -> String:
    var h = cave.host
    if cave.phase == "warn":
        return h.t("Lion crouches — step sideways!", "Лев пригнулся — отойди в сторону!") if cave.animal_index == 0 else h.t("Bear rises — leave the circle!", "Медведь встал — выйди из круга!")
    if cave.phase == "lunge": return h.t("Dodge now!", "Уклоняйся!")
    if cave.phase == "recover": return h.t("Now! Move close · use your staff", "Сейчас! Подойди · ударь посохом")
    if cave.phase == "chase": return h.t("Watch its pose · keep room to dodge", "Следи за зверем · оставь место для прыжка")
    if cave.stage == 6: return h.t("Home together!", "Мы снова вместе!")
    if cave.stage == 5:
        return h.t("Stay close · lead me to camp", "Будь рядом · веди меня в лагерь") if cave.phase == "following" else h.t("Call the lamb to follow", "Позови ягнёнка с собой")
    if cave.near(cave.lamb.position,3) and cave.completed_steps.has("lamb_found"):
        return h.t("I will wait here. Make the path safe!", "Я подожду. Защити дорогу!")
    var clue: int = cave.nearby_clue()
    if clue == 2: return h.t("Wool on the stones — inspect it", "Шерсть на камнях — изучи её")
    if clue >= 0: return h.t("Paw prints — inspect the trail", "Следы лап — изучи их")
    if cave.near(cave.CAMP,3): return h.t("Green camp restores health · choose any cave", "Зелёный лагерь лечит · выбери пещеру")
    return ""

func tick(delta: float) -> void:
    elapsed += delta
    reunion_time = maxf(0,reunion_time-delta)
    cue.text = guidance()
    cue.visible = not cue.text.is_empty() and cave.phase != "victory"
    cue.position = cave.host.player.position+Vector3(0,2.8,0)
    cave.warning_mark.visible = cave.animal_index >= 0 and cave.phase in ["warn","lunge"]
    if cave.warning_mark.visible:
        if cave.animal_index == 1:
            cave.warning_mark.mesh = bear_disc
            cave.warning_mark.scale = Vector3.ONE
            cave.warning_mark.rotation = Vector3.ZERO
            cave.warning_mark.position = cave.animals[1].position+Vector3.UP*.055
        else:
            var line: Vector3 = cave.lunge_to-cave.lunge_from
            lion_lane.size = Vector3(2.7,.025,maxf(.1,line.length())+2.7)
            cave.warning_mark.mesh = lion_lane
            cave.warning_mark.scale = Vector3.ONE
            cave.warning_mark.position = (cave.lunge_from+cave.lunge_to)*.5+Vector3.UP*.055
            cave.warning_mark.rotation.y = atan2(line.x,line.z)
    var found: bool = cave.completed_steps.has("lamb_found")
    lamb_cue.visible = cave.stage == 6 or cave.chamber_of(cave.host.player.position) == 2 or (found and cave.stage == 5)
    if cave.stage == 6:
        lamb_cue.text = cave.host.t("Home together!", "Мы снова вместе!")
    elif found:
        lamb_cue.text = cave.host.t("I'm with you!", "Я с тобой!") if cave.phase == "following" else cave.host.t("You found me!", "Ты меня нашёл!")
    else:
        lamb_cue.text = cave.host.t("Baa…", "Бе-е…")
    var movement: Vector3 = cave.lamb.position-last_lamb_position
    movement.y = 0
    if movement.length() > .001:
        cave.lamb.rotation.y = lerp_angle(cave.lamb.rotation.y,atan2(movement.x,movement.z),minf(1,delta*9))
    var moving := movement.length() > .001
    cave.lamb_model.position.y = absf(sin(elapsed*(9 if moving else 3)))*(.09 if moving or reunion_time > 0 else .018)
    cave.lamb_model.rotation.z = sin(elapsed*4)*(.045 if found else .012)
    last_lamb_position = cave.lamb.position
