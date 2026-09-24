extends RefCounted
## Original authored curved garden meshes; bench solids only, no bed route colliders.
static func material(color: String) -> StandardMaterial3D:
    var m := StandardMaterial3D.new()
    m.albedo_color = Color(color)
    m.roughness = .88
    m.cull_mode = BaseMaterial3D.CULL_DISABLED
    return m

static func mesh(parent: Node3D, shape: Mesh, at: Vector3, color: String) -> MeshInstance3D:
    var n := MeshInstance3D.new()
    n.mesh = shape
    n.position = at
    n.material_override = material(color)
    parent.add_child(n)
    return n

static func box(parent: Node3D, at: Vector3, size: Vector3, color: String) -> MeshInstance3D:
    var b := BoxMesh.new()
    b.size = size
    return mesh(parent,b,at,color)

static func ring(parent: Node3D, at: Vector3, radius: float, thickness: float, color: String) -> void:
    var t := TorusMesh.new()
    t.inner_radius = radius-thickness
    t.outer_radius = radius+thickness
    t.rings = 24
    t.ring_segments = 8
    mesh(parent,t,at,color)

static func leaf(parent: Node3D, angle: float, length: float, width: float, rise: float, color: String, curled := false) -> void:
    var s := SurfaceTool.new()
    s.begin(Mesh.PRIMITIVE_TRIANGLES)
    var vertices: Array[Vector3] = []
    for j in range(9):
        var t := float(j)/8
        for k in range(5):
            var u := float(k)/2-1
            var w := width * sin(PI*t) * u
            # Cupped blade: arched centerline and raised outer margins.
            vertices.append(Vector3(w, .035+(rise*(1-cos(t*PI))*.5 if curled else rise*sin(t*PI*.75))+u*u*.09*sin(PI*t),length*sin(t*PI) if curled else length*t))
    for j in range(8):
        for k in range(4):
            var a := j*5+k
            for i in [a,a+5,a+1,a+1,a+5,a+6]: s.add_vertex(vertices[i])
    s.generate_normals()
    var n := mesh(parent,s.commit(),Vector3.ZERO,color)
    n.rotation.y = angle
    # Thin overlapping blades otherwise self-shadow into dotted acne in GL.
    n.material_override.disable_receive_shadows = true
    n.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
    n.set_meta("leaf",true)
    n.set_meta("healthy",Color(color))
    # A narrow pale midrib follows the same curved blade rather than a flat decal.
    for j in range(1,1 if curled or width < .1 else 7):
        var t := float(j)/8
        var rib := box(n,Vector3(0,.041+rise*sin(t*PI*.75),length*t),Vector3(.012,.012,length/8),"93aa70")
        rib.rotation.x = -atan(rise*.75*PI*cos(t*PI*.75)/length)
        rib.set_meta("leaf",true)
        rib.set_meta("healthy",Color("93aa70"))

static func cabbage(parent: Node3D, at: Vector3, size := 1.0) -> Node3D:
    var n := Node3D.new()
    parent.add_child(n)
    n.position = at
    n.scale = Vector3.ONE*size
    for i in range(7): leaf(n,i*TAU/7,.40,.19,.16,["567451","688654","77935c"][i%3])
    for i in range(6): leaf(n,i*TAU/6+.4,.24,.16,.36,["89a46b","78985f"][i%2],true)
    for i in range(4): leaf(n,i*TAU/4,.11,.10,.35,"a0b77e",true)
    return n

static func carrot(parent: Node3D, at: Vector3, harvested := false) -> Node3D:
    var n := Node3D.new()
    parent.add_child(n)
    n.position = at
    var root := CylinderMesh.new()
    root.top_radius = .095
    root.bottom_radius = .012
    root.height = .38 if harvested else .14
    root.radial_segments = 12
    mesh(n,root,Vector3(0,.03 if not harvested else -.12,0),"c97b3f")
    for i in range(7):
        var branch := Node3D.new()
        n.add_child(branch)
        branch.rotation.y = i*TAU/7
        leaf(branch,0,.30,.045,.32,["52734a","6d8b50"][i%2])
        for side in [-1,1]:
            for j in range(3):
                var sprig := Node3D.new()
                branch.add_child(sprig)
                sprig.position = Vector3(0,.12+j*.055,.09+j*.06)
                leaf(sprig,side*.9,.14,.035,.065,"6d8b50")
    return n

static func set_watered(root: Node, watered: bool) -> void:
    if root is MeshInstance3D and root.has_meta("leaf"):
        root.material_override.albedo_color = root.get_meta("healthy") if watered else (root.get_meta("healthy") as Color).lerp(Color("a08a57"),.55)
    for child in root.get_children(): set_watered(child,watered)

static func basket(parent: Node3D, at: Vector3, filled := true) -> Node3D:
    var n := Node3D.new()
    parent.add_child(n)
    n.position = at
    var base := CylinderMesh.new()
    base.top_radius = .32
    base.bottom_radius = .32
    base.height = .045
    mesh(n,base,Vector3(0,.055,0),"896444")
    for i in range(24):
        var angle := i*TAU/24
        var stave := box(n,Vector3(cos(angle)*.34,.23,sin(angle)*.34),Vector3(.045,.36,.032),"b08b5b")
        stave.rotation.y = -angle
    for j in range(6): ring(n,Vector3(0,.08+j*.059,0),.35,.014,["967149","c09b68"][j%2])
    ring(n,Vector3(0,.425,0),.35,.027,"c5a16e")
    if filled:
        cabbage(n,Vector3(-.09,.28,0),.52)
        for i in range(3):
            var c := carrot(n,Vector3(.13,.35,-.14+i*.13),true)
            c.scale = Vector3.ONE*.55
            c.rotation.z = -.7
    return n

static func pot(parent: Node3D, at: Vector3, radius: float) -> void:
    # Revolved wall profile includes an actual inner lip and hollow cavity.
    var s := SurfaceTool.new()
    s.begin(Mesh.PRIMITIVE_TRIANGLES)
    var profile := [Vector2(radius*.65,0),Vector2(radius,.29),Vector2(radius*.82,.29),Vector2(radius*.56,.045)]
    for j in range(3):
        for i in range(24):
            var points: Array[Vector3] = []
            for pair in [Vector2i(i,j),Vector2i(i+1,j),Vector2i(i+1,j+1),Vector2i(i,j+1)]:
                var a: float = pair.x*TAU/24
                points.append(Vector3(cos(a)*profile[pair.y].x,profile[pair.y].y,sin(a)*profile[pair.y].x))
            for k in [0,1,2,0,2,3]: s.add_vertex(points[k])
    s.generate_normals()
    mesh(parent,s.commit(),at,"b87553")
    ring(parent,at+Vector3(0,.275,0),radius,.025,"ca8b66")
    var soil := CylinderMesh.new()
    soil.top_radius = radius*.70
    soil.bottom_radius = radius*.70
    soil.height = .015
    mesh(parent,soil,at+Vector3(0,.12,0),"544537")

static func bench(parent: Node3D) -> void:
    var n := Node3D.new()
    parent.add_child(n)
    n.name = "PottingBench"
    n.position = Vector3(149,0,4)
    for x in [-.78,.78]:
        for z in [-.34,.34]: box(n,Vector3(x,.39,z),Vector3(.11,.78,.11),"796347")
        box(n,Vector3(x,.28,0),Vector3(.09,.09,.8),"796347")
    for i in range(5):
        box(n,Vector3(0,.81,-.4+i*.2),Vector3(1.85,.09,.185),["a58a64","b2976e"][i%2])
        box(n,Vector3(0,.24,-.32+i*.16),Vector3(1.55,.055,.14),"8e7452")
    box(n,Vector3(0,.67,.35),Vector3(1.7,.16,.08),"8e7452")
    # Match reachable solid timber only; keep the open underside, not a full box.
    for timber in n.get_children():
        if not timber is MeshInstance3D: continue
        var body := StaticBody3D.new()
        body.collision_layer = 2
        body.position = timber.position
        var shape := CollisionShape3D.new()
        var volume := BoxShape3D.new()
        volume.size = timber.mesh.size
        shape.shape = volume
        body.add_child(shape)
        n.add_child(body)
    pot(n,Vector3(-.6,.86,0),.20)
    pot(n,Vector3(-.12,.86,-.15),.16)
    pot(n,Vector3(.5,.27,0),.19)
    # Hand trowel: wooden grip, steel neck and curved broad blade.
    var tool := Node3D.new()
    n.add_child(tool)
    tool.position = Vector3(.42,.88,.08)
    tool.rotation.y = -.5
    box(tool,Vector3(0,.03,0),Vector3(.07,.055,.25),"735338")
    box(tool,Vector3(0,.03,.17),Vector3(.025,.025,.14),"727f7a")
    leaf(tool,0,.27,.09,.025,"84928b")
    basket(n,Vector3(-.43,.28,0),false).scale = Vector3.ONE*.65
