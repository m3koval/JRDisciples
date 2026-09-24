extends Node3D
## Original authored block-quadrupeds; no imported art, textures or skeletal claims.
## +Z forward, rest paws at y=0. Presentation only; caller owns time/pause/movement.
## configure("lion"|"bear"), pose(delta,state,remaining,speed), reset_pose().
var species := "lion"
var rig: Node3D
var head: Node3D
var tail: Node3D
var legs: Array[Node3D] = [] # front left/right, rear left/right
var knees: Array[Node3D] = []
var stride := 0.0
var phase_age := 0.0
var last_state := "idle"
var _materials: Dictionary = {}
var _rests: Dictionary = {}

func configure(animal_species: String) -> void:
    for child in get_children():
        remove_child(child)
        child.free()
    species = "bear" if animal_species == "bear" else "lion"
    legs.clear()
    knees.clear()
    _rests.clear()
    _materials.clear()
    rig = _pivot(self, "ArticulatedBody", Vector3.ZERO)
    var bear := species == "bear"
    var fur := Color("785039") if bear else Color("d6a34f")
    var light := Color("b88b60") if bear else Color("f1ce87")
    var dark := Color("4a3027") if bear else Color("89502b")
    # Intersecting inset slabs create deliberate stepped/chamfered silhouettes.
    _block(rig, "Torso", Vector3(0,.91,-.15), Vector3(1.02 if bear else .86,.65,1.48), fur)
    _block(rig, "BackCrown", Vector3(0,1.22,-.17), Vector3(.86 if bear else .70,.16,1.22), fur)
    _block(rig, "Chest", Vector3(0,.94,.39), Vector3(1.09 if bear else .94,.69,.53), fur)
    _block(rig, "ChestBib", Vector3(0,.89,.667), Vector3(.53,.37,.025), light)
    for i in range(4):
        var front := i < 2
        var x := -.39 if i % 2 == 0 else .39
        var hip := _pivot(rig, ["FrontLeft", "FrontRight", "RearLeft", "RearRight"][i], Vector3(x,.65,.47 if front else -.65))
        legs.append(hip)
        _block(hip, "UpperLeg", Vector3(0,-.15,0), Vector3(.29 if bear else .24,.36,.29), fur)
        var knee := _pivot(hip, "Knee", Vector3(0,-.31,0))
        knees.append(knee)
        _block(knee, "Shin", Vector3(0,-.11,0), Vector3(.25 if bear else .20,.26,.23), fur)
        _block(knee, "Paw", Vector3(0,-.265,.065), Vector3(.34 if bear else .29,.15,.40), dark if bear else light)
    head = _pivot(rig, "HeadPivot", Vector3(0,1.10,.62))
    if not bear:
        # A broad golden-brown ruff frames the face; stepped corners, not spikes.
        _block(head, "Mane", Vector3(0,.02,.02), Vector3(1.04,.82,.44), dark)
        _block(head, "ManeCrown", Vector3(0,.43,.03), Vector3(.72,.14,.40), dark)
        for side in [-1,1]:
            _block(head, "ManeCheek", Vector3(side*.48,-.02,.06), Vector3(.18,.58,.40), Color("a96832"))
        _block(head, "ManeBib", Vector3(0,-.40,.07), Vector3(.65,.17,.39), dark)
    _block(head, "Face", Vector3(0,.10,.25), Vector3(.75 if bear else .68,.59,.54), fur)
    _block(head, "BrowCrown", Vector3(0,.39,.24), Vector3(.59,.10,.43), fur)
    for side in [-1,1]:
        var ear := _pivot(head, "EarLeft" if side < 0 else "EarRight", Vector3(side*.34,.43,.16))
        _block(ear, "EarBase", Vector3.ZERO, Vector3(.23,.20,.19), fur)
        _block(ear, "EarCap", Vector3(0,.10,0), Vector3(.16,.06,.15), fur)
        _block(ear, "EarInner", Vector3(0,0,.101), Vector3(.12,.11,.018), light)
        _block(head, "Eye", Vector3(side*.235,.19,.527), Vector3(.085,.10,.025), Color("282626"))
        _block(head, "EyeGlint", Vector3(side*.235-.014,.215,.543), Vector3(.024,.028,.012), Color("fff4d5"))
        _block(head, "MuzzleCheek", Vector3(side*.13,-.075,.56), Vector3(.28,.22,.22), light)
    _block(head, "Nose", Vector3(0,.01,.686), Vector3(.19,.105,.065), Color("352b29"))
    _block(head, "Chin", Vector3(0,-.19,.55), Vector3(.36,.065,.18), light)
    tail = _pivot(rig, "TailPivot", Vector3(0,1.02,-.88))
    if bear:
        _block(tail, "ShortTail", Vector3(0,.015,-.10), Vector3(.23,.23,.26), fur)
    else:
        _block(tail, "TailStem", Vector3(0,.025,-.22), Vector3(.12,.12,.48), fur)
        var tip := _pivot(tail, "TailTip", Vector3(0,.025,-.43))
        _block(tip, "TailTuft", Vector3(0,.04,0), Vector3(.23,.24,.23), dark)
    _remember(rig)
    reset_pose()

func _pivot(parent: Node3D, label: String, at: Vector3) -> Node3D:
    var node := Node3D.new()
    node.name = label
    parent.add_child(node)
    node.position = at
    return node

func _block(parent: Node3D, label: String, at: Vector3, size: Vector3, color: Color) -> void:
    var mesh := MeshInstance3D.new()
    mesh.name = label
    var box := BoxMesh.new()
    box.size = size
    mesh.mesh = box
    var key := color.to_html()
    if not _materials.has(key):
        var material := StandardMaterial3D.new()
        material.albedo_color = color
        material.roughness = .88
        _materials[key] = material
    mesh.material_override = _materials[key]
    parent.add_child(mesh)
    mesh.position = at

func _remember(node: Node3D) -> void:
    _rests[node] = node.transform
    for child in node.get_children():
        if child is Node3D and not child is MeshInstance3D: _remember(child)

func reset_pose() -> void:
    stride = 0.0
    phase_age = 0.0
    last_state = "idle"
    for node in _rests: node.transform = _rests[node]

func pose(delta: float, state: String, remaining: float, speed: float) -> void:
    if state == "reset_pose":
        reset_pose()
        return
    if not is_instance_valid(rig) or not is_finite(delta) or delta <= 0.0: return
    delta = minf(delta,.1)
    if state != last_state:
        phase_age = 0.0
        last_state = state
    phase_age += delta
    speed = clampf(absf(speed),0,15) if is_finite(speed) else 0.0
    remaining = maxf(remaining,0) if is_finite(remaining) else 0.0
    var moving := clampf(speed/2.0,0,1)
    stride = fposmod(stride + speed * delta * (5.4 if species == "lion" else 4.3), TAU)
    var blend := 1.0-exp(-delta*18.0)
    var head_target := Vector3.ZERO
    var tail_target := Vector3(0,sin(stride)*.12*moving,0)
    var targets: Array[float] = []
    var bends: Array[float] = []
    for i in range(4):
        var angle := sin(stride + (PI if i in [1,2] else 0.0))
        targets.append(angle * .46 * moving)
        bends.append(maxf(0,-angle)*.32*moving)
    match state:
        "warn":
            var gather := smoothstep(0,1,clampf(1.0-remaining/1.6,0,1))
            head_target.x = .13*gather
            for i in range(4):
                targets[i] = -.18*gather if i < 2 else .25*gather
                bends[i] = .24*gather
        "lunge", "pounce", "jump":
            var arc := sin(clampf(1.0-remaining/.7,0,1)*PI)
            head_target.x = -.16*arc
            if species == "lion":
                for i in range(4):
                    targets[i] = (-.80 if i < 2 else .52)*arc
                    bends[i] = .70*arc
            else:
                # One planted foreleg and one independently reaching, inward paw.
                targets[0] = -1.05*arc
                bends[0] = .20*arc
                targets[1] = -.12*arc
                head_target.y = -.10*arc
        "recover":
            var settle := exp(-phase_age*5.0)
            head_target.x = .12*settle
            for i in range(4):
                targets[i] = .10*settle if i < 2 else -.08*settle
                bends[i] = .10*settle
    head.rotation = head.rotation.lerp(head_target,blend)
    tail.rotation = tail.rotation.lerp(tail_target,blend)
    for i in range(4):
        legs[i].rotation.x = lerpf(legs[i].rotation.x, targets[i], blend)
        legs[i].rotation.z = lerpf(legs[i].rotation.z, -.18*sin(clampf(1.0-remaining/.7,0,1)*PI) if species == "bear" and state == "lunge" and i == 0 else 0.0, blend)
        knees[i].rotation.x = lerpf(knees[i].rotation.x,bends[i],blend)
        # Lift each hip only enough to keep its rotating paw's corners off ground.
        # Uses four lightweight box corners via native AABB, not physics or IK.
        legs[i].position.y = .65
        var paw := knees[i].get_node("Paw") as MeshInstance3D
        var box: AABB = legs[i].transform * knees[i].transform * paw.transform * paw.get_aabb()
        legs[i].position.y += maxf(0.0,-box.position.y)
