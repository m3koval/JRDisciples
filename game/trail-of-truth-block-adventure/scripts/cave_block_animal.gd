extends Node3D
## Authored continuous sculpted quadrupeds, with independently articulated joints.
## +Z forward, rest paws at y=0. Presentation only; caller owns time/pause/movement.
## configure("lion"|"bear"), pose(delta,state,remaining,speed), reset_pose().
const Anatomy = preload("res://scripts/cave_animal_anatomy.gd")
var paws: Array[MeshInstance3D] = []
var jaw: Node3D
var ears: Array[Node3D] = []
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
    paws.clear()
    ears.clear()
    _rests.clear()
    _materials.clear()
    rig = _pivot(self, "ArticulatedBody", Vector3.ZERO)
    var bear := species == "bear"
    var fur := Color("785039") if bear else Color("d6a34f")
    var light := Color("b88b60") if bear else Color("f1ce87")
    var dark := Color("4a3027") if bear else Color("89502b")
    _loft(rig, "Torso", Vector3.ZERO, Anatomy.torso(bear), fur, 24)
    # Neck bridges skull into the shoulder rather than a floating sphere.
    _loft(rig, "Neck", Vector3.ZERO, [Vector4(.42,1.01,.27,.26),
        Vector4(.60,1.13,.28,.29),Vector4(.81,1.20,.22,.24)], fur, 20)
    for i in range(4):
        var front := i < 2
        var x := -.39 if i % 2 == 0 else .39
        var hip := _pivot(rig, ["FrontLeft", "FrontRight", "RearLeft", "RearRight"][i], Vector3(x,.65,.47 if front else -.65))
        legs.append(hip)
        _loft(hip, "UpperLeg", Vector3(0,-.07,0), Anatomy.limb(front,bear,false), fur, 16)
        (hip.get_node("UpperLeg") as Node3D).rotation.x = PI*.5
        var knee := _pivot(hip, "Knee", Vector3(0,-.31,0))
        knees.append(knee)
        _loft(knee, "Shin", Vector3(0,-.11,0), Anatomy.limb(front,bear,true), fur, 16)
        (knee.get_node("Shin") as Node3D).rotation.x = PI*.5
        _loft(knee, "Paw", Vector3(0,-.265,.025), Anatomy.paw(bear), fur if bear else light, 16)
        var paw := knee.get_node("Paw") as MeshInstance3D
        # Profile has a genuine level sole, not an ellipsoid contacting one point.
        paw.position.y = -.34-paw.get_aabb().position.y
        paws.append(paw)
        for toe in range(3):
            _loft(paw,"ToeCrease%d"%toe,Vector3((toe-1)*.075,.025,.17),[
                Vector4(-.035,0,.006,.008),Vector4(.022,0,.004,.007)],dark,6)
    head = _pivot(rig, "HeadPivot", Vector3(0,1.10,.62))
    if not bear:
        # Continuous swept ruff; angular locks are part of the surface, not boxes.
        _loft(head, "Mane", Vector3.ZERO, [Vector4(-.20,.02,.22,.28),
            Vector4(-.08,.01,.48,.43), Vector4(.08,-.015,.54,.49),
            Vector4(.22,.015,.46,.42), Vector4(.28,.04,.31,.30)], dark, 24, true)
    _loft(head, "Face", Vector3.ZERO, Anatomy.face(bear), fur, 24)
    for side in [-1,1]:
        var ear := _pivot(head, "EarLeft" if side < 0 else "EarRight", Vector3(side*.255,.36,.12))
        ears.append(ear)
        _loft(ear,"EarBase",Vector3.ZERO,[Vector4(-.055,0,.08,.095),
            Vector4(0,.025,.115,.13),Vector4(.065,.02,.085,.095)],fur,16)
        _loft(ear,"EarInner",Vector3(0,0,.066),[Vector4(0,.025,.058,.067),Vector4(.008,.025,.055,.062)],dark,16)
        var eye_at := Vector3(side*.235,.12,.382)
        _block(head, "Eye", eye_at, Vector3(.068,.063,.047), Color("241e18"))
        _block(head, "EyeGlint", eye_at+Vector3(-.008,.013,.023), Vector3(.014,.016,.009), Color("fff4d5"))
        # Brow is an authored wedge, not a second round eye socket.
        _loft(head,"Brow",Vector3(side*.22,.175,.34),[
            Vector4(-.045,0,.08,.035),Vector4(.04,-.01,.073,.023)],fur,10)
    _loft(head,"Muzzle",Vector3.ZERO,[Vector4(.40,-.09,.19,.10),
        Vector4(.52,-.095,.215 if not bear else .155,.105),
        Vector4(.65 if not bear else .72,-.08,.145,.073)],light,20)
    _loft(head,"Nose",Vector3(0,-.03,.67 if not bear else .73),[
        Vector4(-.022,0,.105,.057),Vector4(.022,-.015,.083,.038)],Color("302720"),12)
    jaw = _pivot(head,"JawPivot",Vector3(0,-.15,.33))
    _loft(jaw,"MouthLine",Vector3.ZERO,[Vector4(.08,-.02,.15,.022),
        Vector4(.29,-.017,.13,.018)],Color("392820"),12)
    _loft(jaw,"LowerJaw",Vector3.ZERO,[Vector4(0,-.035,.12,.035),
        Vector4(.14,-.05,.16,.045),Vector4(.29,-.045,.105,.027)],light,16)
    tail = _pivot(rig, "TailPivot", Vector3(0,1.02,-.88))
    if bear:
        _block(tail, "ShortTail", Vector3(0,.015,-.10), Vector3(.23,.23,.26), fur)
    else:
        _loft(tail,"TailStem",Vector3.ZERO,[Vector4(-.57,.18,.025,.027),
            Vector4(-.49,.08,.038,.035),Vector4(-.34,-.03,.045,.04),
            Vector4(-.16,-.035,.05,.045),Vector4(0,0,.06,.055)],fur,12)
        var tip := _pivot(tail, "TailTip", Vector3(0,.18,-.57))
        _loft(tip,"TailTuft",Vector3.ZERO,[Vector4(-.12,.035,.012,.02),
            Vector4(-.055,.025,.085,.10),Vector4(.035,0,.048,.05)],dark,12,true)
    _remember(rig)
    for paw in paws: _rests[paw] = paw.transform
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
            var vertex := Vector3(cos(theta)*ring.z*lock,ring.y+sin(theta)*ring.w*lock,ring.x)
            if label == "Paw": vertex.y = maxf(vertex.y,-.060)
            vertices.append(vertex)
            var prev: Vector4 = rings[maxi(0,j-1)]
            var next: Vector4 = rings[mini(rings.size()-1,j+1)]
            var slope := ((next.z-prev.z)*cos(theta)*cos(theta)+(next.w-prev.w)*sin(theta)*sin(theta)+(next.y-prev.y)*sin(theta))/maxf(.001,next.x-prev.x)
            normals.append(Vector3(cos(theta)/maxf(.01,ring.z),sin(theta)/maxf(.01,ring.w),-slope/maxf(.01,(ring.z+ring.w)*.5)).normalized())
            var shade := 1.0
            if label in ["Torso","Face","Neck"]:
                shade = .87+.13*smoothstep(-.5,.6,sin(theta))
            if fur_locks: shade = .84 + .16*float((i+j)%3)/2.0
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
    var warning := smoothstep(0,1,clampf(phase_age/.45,0,1)) if state in ["warn","windup","telegraph"] else 0.0
    jaw.rotation.x = lerpf(jaw.rotation.x,.20*warning,blend)
    for ear in ears:
        ear.rotation.x = lerpf(ear.rotation.x,-.32*warning,blend)
    head.rotation = head.rotation.lerp(head_target,blend)
    tail.rotation = tail.rotation.lerp(tail_target,blend)
    for i in range(4):
        legs[i].rotation.x = lerpf(legs[i].rotation.x, targets[i], blend)
        legs[i].rotation.z = lerpf(legs[i].rotation.z, -.18*sin(clampf(1.0-remaining/.7,0,1)*PI) if species == "bear" and state == "lunge" and i == 0 else 0.0, blend)
        knees[i].rotation.x = lerpf(knees[i].rotation.x,bends[i],blend)
        # Wrist counter-rotation keeps the sole level; swing clears the floor.
        # This is local planar contact, not terrain IK or a world foot lock.
        var paw := paws[i]
        var walking := state in ["retreat","walk","approach","chase","idle"]
        var swing := maxf(0.0,-sin(stride+(PI if i in [1,2] else 0.0))) * moving if walking else 0.0
        paw.rotation.x = -(legs[i].rotation.x+knees[i].rotation.x) if walking else 0.0
        legs[i].position.y = .65
        var box: AABB = legs[i].transform * knees[i].transform * paw.transform * paw.get_aabb()
        if walking:
            legs[i].position.y += -box.position.y + .095*swing
        else:
            legs[i].position.y += maxf(0.0,-box.position.y)
