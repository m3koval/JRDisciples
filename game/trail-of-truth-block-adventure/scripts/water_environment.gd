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
    preload("res://scripts/garden_terrain.gd").build(self)
    # Tapered earth shoulders meet the lining base. No solver bed is lowered.
    # These are scenic shoulders outside the existing walking corridor.
    earth_bank(161.02,163.2,-10.2,-7,.96,.96)
    earth_bank(161.02,162.8,-7,-3,.66,.66)
    earth_bank(161.02,162.4,-3,7.2,.36,.36)
    earth_bank(158.98,158.45,-10.2,-7,.96,.96)
    earth_bank(158.98,158.45,-3,5.55,.36,.36)
    # The spring is nested in rock and planting rather than a blue rectangle.
    for n in range(15):
        var angle := n*PI/14
        piece(Vector3(164+cos(angle)*4.6,.25,-13-sin(angle)*1.7),Vector3(1.25,.7,1),["a49d83","b5ad90"][n%2],true)
    # Buildings are beyond the bank/walking routes. Reuse only the CC0 kit.
    KIT.cottage(self,Vector3(138,0,-6),90,.85,"")
    KIT.cottage(self,Vector3(169,0,-21),0,.95,"")
    KIT.cottage(self,Vector3(181,0,4),-90,.80,"")
    preload("res://scripts/garden_foliage.gd").build(self)
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

func earth_bank(inner: float, outer: float, start: float, end: float, high: float, low: float) -> void:
    var st := SurfaceTool.new()
    st.begin(Mesh.PRIMITIVE_TRIANGLES)
    var count := 12
    for n in range(count):
        var z0 := lerpf(start,end,float(n)/count)
        var z1 := lerpf(start,end,float(n+1)/count)
        var y0 := lerpf(high,low,float(n)/count)
        var y1 := lerpf(high,low,float(n+1)/count)
        var edge0 := outer+sin(n*1.7)*.08
        var edge1 := outer+sin((n+1)*1.7)*.08
        var points: Array[Vector3] = [Vector3(inner,y0,z0),Vector3(edge0,.018,z0),Vector3(edge1,.018,z1),Vector3(inner,y0,z0),Vector3(edge1,.018,z1),Vector3(inner,y1,z1)]
        if outer < inner: points.reverse()
        for v in points:
            st.set_color(Color(.18,0,0,1))
            st.set_uv(Vector2(v.x,v.z)*.4)
            st.add_vertex(v)
    st.generate_normals()
    var node := MeshInstance3D.new()
    node.mesh = st.commit()
    node.material_override = preload("res://scripts/garden_terrain.gd").material()
    node.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
    add_child(node)

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
