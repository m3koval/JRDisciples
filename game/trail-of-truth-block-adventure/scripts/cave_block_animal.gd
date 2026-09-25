extends Node3D
## Authored continuous sculpted quadrupeds, with independently articulated joints.
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
    # One continuous barrel: tapered haunch, tucked belly, broad shoulder hump.
    var width := 1.0 if bear else .84
    _loft(rig, "Torso", Vector3.ZERO, [
        Vector4(-.90,.91,.12,.16), Vector4(-.78,.93,.37*width,.30),
        Vector4(-.52,.94,.49*width,.35), Vector4(-.15,.94,.48*width,.34),
        Vector4(.20,1.00,.52*width,.36 if bear else .32),
        Vector4(.43,.99,.53*width,.34), Vector4(.64,.91,.32*width,.27),
        Vector4(.68,.91,.06,.12)], fur, 20)
    _block(rig, "ChestBib", Vector3(0,.83,.59), Vector3(.45,.35,.13), light)
    for i in range(4):
        var front := i < 2
        var x := -.39 if i % 2 == 0 else .39
        var hip := _pivot(rig, ["FrontLeft", "FrontRight", "RearLeft", "RearRight"][i], Vector3(x,.65,.47 if front else -.65))
        legs.append(hip)
        _block(hip, "UpperLeg", Vector3(0,-.09,0), Vector3(.34 if bear else .28,.52,.34), fur)
        var knee := _pivot(hip, "Knee", Vector3(0,-.31,0))
        knees.append(knee)
        _block(knee, "Shin", Vector3(0,-.11,0), Vector3(.27 if bear else .22,.30,.25), fur)
        _block(knee, "Paw", Vector3(0,-.265,.065), Vector3(.34 if bear else .29,.15,.40), dark if bear else light)
    head = _pivot(rig, "HeadPivot", Vector3(0,1.10,.62))
    if not bear:
        # Continuous swept ruff; angular locks are part of the surface, not boxes.
        _loft(head, "Mane", Vector3.ZERO, [Vector4(-.20,.02,.22,.28),
            Vector4(-.08,.01,.48,.43), Vector4(.08,-.015,.54,.49),
            Vector4(.22,.015,.46,.42), Vector4(.28,.04,.31,.30)], dark, 24, true)
    # Skull narrows into the cheek plane in a single sculpted surface.
    _loft(head, "Face", Vector3.ZERO, [Vector4(-.01,.12,.12,.15),
        Vector4(.10,.13,.33 if bear else .29,.29),
        Vector4(.31,.11,.375 if bear else .34,.29),
        Vector4(.46,.055,.29,.22), Vector4(.54,-.025,.19,.15)], fur, 20)
    for side in [-1,1]:
        var ear := _pivot(head, "EarLeft" if side < 0 else "EarRight", Vector3(side*.30,.43,.18))
        _block(ear, "EarBase", Vector3.ZERO, Vector3(.23,.26,.19), fur)
        _block(ear, "EarInner", Vector3(0,0,.101), Vector3(.12,.11,.018), light)
        _block(head, "Eye", Vector3(side*.20,.14,.491), Vector3(.085,.10,.025), Color("282626"))
        _block(head, "EyeGlint", Vector3(side*.20-.014,.165,.505), Vector3(.024,.028,.012), Color("fff4d5"))
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
    # Rounded anatomically tapered cross sections, with a flatter paw sole.
    var rings: Array = []
    for pair in [[-.5,.05],[-.43,.58],[-.25,.91],[0.0,1.0],[.25,.91],[.43,.58],[.5,.05]]:
        rings.append(Vector4(float(pair[0])*size.z, 0, size.x*.5*float(pair[1]), size.y*.5*float(pair[1])))
    if label in ["UpperLeg", "Shin"]:
        rings.clear()
        for pair in [[-.5,.72],[-.38,.91],[0.0,1.0],[.38,.91],[.5,.72]]:
            rings.append(Vector4(float(pair[0])*size.y, 0, size.x*.5*float(pair[1]), size.z*.5*float(pair[1])))
    _loft(parent,label,at,rings,color,16)
    if label in ["UpperLeg", "Shin"]:
        (parent.get_child(parent.get_child_count()-1) as Node3D).rotation.x = PI*.5

func _loft(parent: Node3D, label: String, at: Vector3, rings: Array, color: Color, segments: int = 20, fur_locks: bool = false) -> void:
    var mesh := MeshInstance3D.new()
    mesh.name = label
    var vertices := PackedVector3Array()
    var normals := PackedVector3Array()
    var colors := PackedColorArray()
    var indices := PackedInt32Array()
    for j in range(rings.size()):
        var ring: Vector4 = rings[j]
        for i in range(segments):
            var theta := TAU*float(i)/segments
            var lock := (1.0 if i%2 == 0 else .91) if fur_locks else 1.0
            vertices.append(Vector3(cos(theta)*ring.z*lock,ring.y+sin(theta)*ring.w*lock,ring.x))
            var prev: Vector4 = rings[maxi(0,j-1)]
            var next: Vector4 = rings[mini(rings.size()-1,j+1)]
            var slope := ((next.z-prev.z)*cos(theta)*cos(theta)+(next.w-prev.w)*sin(theta)*sin(theta)+(next.y-prev.y)*sin(theta))/maxf(.001,next.x-prev.x)
            normals.append(Vector3(cos(theta)/maxf(.01,ring.z),sin(theta)/maxf(.01,ring.w),-slope/maxf(.01,(ring.z+ring.w)*.5)).normalized())
            var shade := 1.0
            if fur_locks: shade = .87 + .13*float((i+j)%3)/2.0
            colors.append(Color(shade,shade,shade))
            if j < rings.size()-1:
                var a := j*segments+i
                var b := j*segments+(i+1)%segments
                var c := (j+1)*segments+i
                var d := (j+1)*segments+(i+1)%segments
                indices.append_array(PackedInt32Array([a,c,b,b,c,d]))
    # Close both ends; all runtime surfaces are authored, connected topology.
    for end in [0,rings.size()-1]:
        var base: int = end*segments
        for i in range(1,segments-1):
            indices.append_array(PackedInt32Array([base,base+i,base+i+1] if end == 0 else [base,base+i+1,base+i]))
    var arrays := []
    arrays.resize(Mesh.ARRAY_MAX)
    arrays[Mesh.ARRAY_VERTEX] = vertices
    arrays[Mesh.ARRAY_NORMAL] = normals
    arrays[Mesh.ARRAY_COLOR] = colors
    arrays[Mesh.ARRAY_INDEX] = indices
    var surface := ArrayMesh.new()
    surface.add_surface_from_arrays(Mesh.PRIMITIVE_TRIANGLES,arrays)
    mesh.mesh = surface
    var key := color.to_html()
    if not _materials.has(key):
        var material := StandardMaterial3D.new()
        material.albedo_color = color
        material.vertex_color_use_as_albedo = true
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
