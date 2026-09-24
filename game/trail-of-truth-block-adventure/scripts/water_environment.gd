extends Node3D
## Original non-colliding connective landscape; existing CC0 kit dressing.
const KIT = preload("res://assets/environment/village_finish.gd")
var materials := {}
var batches := {}
var cube := BoxMesh.new()
var orb := SphereMesh.new()

func mat(color: String) -> StandardMaterial3D:
    if not materials.has(color):
        var m := StandardMaterial3D.new()
        m.albedo_color = Color(color)
        m.roughness = .95
        materials[color] = m
    return materials[color]

func piece(at: Vector3, size: Vector3, color: String, round_shape := false, yaw := 0.0) -> void:
    var key := color + ("o" if round_shape else "b")
    if not batches.has(key): batches[key] = {"color": color, "round": round_shape, "transforms": []}
    var basis := Basis(Vector3.UP, yaw).scaled(size)
    batches[key].transforms.append(Transform3D(basis, at))

func ribbon(points: Array, width: float, color: String, height := .07) -> void:
    var s := SurfaceTool.new()
    s.begin(Mesh.PRIMITIVE_TRIANGLES)
    var edges: Array[Vector3] = []
    for i in range(points.size()):
        var previous: Vector3 = points[maxi(0,i-1)]
        var following: Vector3 = points[mini(points.size()-1,i+1)]
        var side := (following-previous).normalized().cross(Vector3.UP)
        var w := width * (1.0 + .10*sin(i*2.3))
        edges.append(points[i]-side*w)
        edges.append(points[i]+side*w)
    for i in range(points.size()-1):
        for index in [i*2,i*2+1,i*2+3,i*2,i*2+3,i*2+2]:
            var v: Vector3 = edges[index]
            s.set_uv(Vector2(v.x,v.z)*.4)
            s.add_vertex(Vector3(v.x,height,v.z))
    s.generate_normals()
    var node := MeshInstance3D.new()
    node.mesh = s.commit()
    node.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
    # Match the meadow's fine material variation rather than a flat yellow strip.
    node.material_override = KIT.ground_material(Color(color).darkened(.18))
    node.material_override.cull_mode = BaseMaterial3D.CULL_DISABLED
    # Compatibility renderer produces terrain shadow acne on shallow overlays.
    node.material_override.disable_receive_shadows = true
    add_child(node)

func tree(at: Vector3, size: float, phase: float) -> void:
    piece(at+Vector3(0,1.5*size,0),Vector3(.36,3,.4)*size,"806343",false,.1)
    for n in range(5):
        var angle := n*TAU/5+phase
        piece(at+Vector3(cos(angle)*.8,3.1+sin(n*1.9)*.35,sin(angle)*.8)*size,Vector3(2.3,2.0,2.2)*size,["749451","8caa5d","a3b96b"][n%3],true)

func _ready() -> void:
    name = "AuthoredVillageGardenLandscape"
    cube.size = Vector3.ONE
    orb.radius = .5
    orb.height = 1
    orb.radial_segments = 12
    orb.rings = 6
    # A scenic meadow continues beyond the retained collision rectangle.
    piece(Vector3(160,-.16,0),Vector3(110,.2,100),"8eaa6a")
    var ground := MeshInstance3D.new()
    var plane := PlaneMesh.new()
    plane.size = Vector2(500,500)
    ground.mesh = plane
    ground.position = Vector3(160,.008,0)
    ground.material_override = KIT.ground_material(Color("a4b57a"))
    add_child(ground)
    ribbon([Vector3(150,0,15),Vector3(149.8,0,11),Vector3(150,0,8),Vector3(151,0,5),Vector3(154,0,3),Vector3(156.7,0,1),Vector3(157,0,-3),Vector3(156.8,0,-7),Vector3(156,0,-11),Vector3(155,0,-15)],1.18,"c9b18a")
    ribbon([Vector3(149.5,0,12.5),Vector3(153,0,12),Vector3(156.9,0,10),Vector3(157,0,6),Vector3(156.7,0,1)],1.05,"c9b18a",.085)
    ribbon([Vector3(149,0,8.5),Vector3(152,0,8.5),Vector3(155,0,8.5),Vector3(157,0,8.5)],.48,"c9b18a",.10)
    # Tiny aggregate is batched, not hundreds of independent draw calls.
    for n in range(100):
        var z := -12.0 + float(n)*.25
        var x := 156.85 + sin(n*12.3)*.77
        piece(Vector3(x,.06,z),Vector3(.055+absf(sin(n))*.09,.025,.08),"dfc9a3",true)
    # Staggered masonry courses frame the original stateful water surfaces.
    for x in [159.0,161.0]:
        for course in range(2):
            for n in range(29):
                var z := -12.4+n*.74+course*.32
                if absf(z)<1.05: continue
                piece(Vector3(x,.10+course*.16,z),Vector3(.32,.16,.70),["b5ad90","cac1a1","a49d83"][n%3],false,sin(n*2.0)*.025)
    for z in [7.26,8.74]:
        for n in range(11):
            piece(Vector3(152.2+n*.7,.14,z),Vector3(.66,.23,.25),"b5ad90")
    # Bridge decking stays on the existing collision crossing.
    for n in range(9): piece(Vector3(158.6+n*.35,.255,0),Vector3(.32,.09,1.95),"ae8a59")
    for z in [-8.0,-2.0,4.0]:
        for x in [158.95,161.05]:
            piece(Vector3(x,.77,z),Vector3(.26,1.54,.29),"796343")
            piece(Vector3(x,.15,z),Vector3(.49,.3,.49),"b5ad90")
        piece(Vector3(160,1.53,z),Vector3(2.6,.22,.36),"90714b")
        piece(Vector3(158.4,.57,z),Vector3(.15,1.05,.15),"796343")
        piece(Vector3(159.1,1.0,z),Vector3(1.4,.10,.10),"796343")
    for z in [-2.64,-1.36]:
        for n in range(10): piece(Vector3(161.2+n*.68,.13,z),Vector3(.64,.22,.23),"b5ad90")
    # The spring is nested in rock and planting rather than a blue rectangle.
    for n in range(15):
        var angle := n*PI/14
        piece(Vector3(164+cos(angle)*4.6,.25,-13-sin(angle)*1.7),Vector3(1.25,.7,1),["a49d83","b5ad90"][n%2],true)
    # Raised vegetable plots: low borders, open cross-walking lane retained.
    for x in [151.5,154.0]:
        for z in [6.45,11.55]: piece(Vector3(x,.16,z),Vector3(2.1,.26,.16),"90714b")
        for edge in [-1.0,1.0]:
            for z in [7.35,10.2]: piece(Vector3(x+edge,.13,z),Vector3(.14,.20,1.9),"90714b")
    # Buildings are beyond the bank/walking routes. Reuse only the CC0 kit.
    KIT.cottage(self,Vector3(138,0,-6),90,.85,"")
    KIT.cottage(self,Vector3(169,0,-21),0,.95,"")
    KIT.cottage(self,Vector3(181,0,4),-90,.80,"")
    # Broad, low hills conceal the hard level edge without invading the actors.
    for n in range(14):
        var angle := float(n)*TAU/14
        var p := Vector3(160+cos(angle)*30,-1.4,-1+sin(angle)*29)
        piece(p,Vector3(19,5.5+sin(n*2.0)*1.4,17),["91a977","819d6b","a2b782"][n%3],true)
    for p in [Vector3(145,0,13),Vector3(143,0,4),Vector3(146,0,-14),Vector3(152,0,-18),Vector3(173,0,-13),Vector3(176,0,-4),Vector3(173,0,12),Vector3(165,0,18),Vector3(140,0,-16)]:
        tree(p,1.1+sin(p.x)*.17,p.z)
    # Group planting in edge drifts: leave the central yard quiet and readable.
    for n in range(36):
        var side := -1.0 if n%2==0 else 1.0
        var p := Vector3(160+side*(14+sin(n*1.7)),0,-14+float(n/2)*1.65)
        KIT.place(self,"plant_bushDetailed.glb",p,Vector3.ONE*(1.3+sin(n)*.25),n*37)
        if n%3==0: KIT.place(self,"flower_yellowC.glb",p+Vector3(-side*.9,0,.3),Vector3.ONE*1.3)
    for p in [Vector3(148,0,12.8),Vector3(153,0,13.2),Vector3(155,0,12.9),Vector3(149,0,2.5),Vector3(162,0,10.5),Vector3(163,0,-10.5)]:
        KIT.place(self,"plant_bushDetailed.glb",p,Vector3.ONE*.8)
        for n in range(3): KIT.place(self,"flower_yellowC.glb",p+Vector3(.35*n-.3,0,.45+sin(n)*.2),Vector3.ONE*.8)
    for z in [5,7,9,11]: KIT.place(self,"Prop_WoodenFence_Single.gltf",Vector3(147,0,z),Vector3.ONE*.7,90)
    flush()

func flush() -> void:
    for key in batches:
        var data: Dictionary = batches[key]
        var mesh := MultiMesh.new()
        mesh.transform_format = MultiMesh.TRANSFORM_3D
        mesh.mesh = orb if data.round else cube
        mesh.instance_count = data.transforms.size()
        for n in range(mesh.instance_count): mesh.set_instance_transform(n,data.transforms[n])
        var node := MultiMeshInstance3D.new()
        node.multimesh = mesh
        node.material_override = mat(data.color)
        add_child(node)
