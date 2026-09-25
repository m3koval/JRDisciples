extends RefCounted
## Opening bridge riverbank art; preserves original bridge, bank and river physics.
const FOLIAGE = preload("res://scripts/garden_foliage.gd")
static func build(host: Node3D) -> void:
    var root := Node3D.new()
    root.name = "OpeningRiverArt"
    host.add_child(root)
    # A single material surface per physical bank, not a rectangular patch
    # floating over differently colored ground. Keep the river collision gap.
    _land(root,-22.0,2.7)
    _land(root,7.3,23.0)
    _shore(root,2.7,1.0)
    _shore(root,7.3,-1.0)
    var river := MeshInstance3D.new()
    river.name = "FlowingRiver"
    var plane := PlaneMesh.new()
    plane.size = Vector2(4.6,38)
    river.mesh = plane
    river.position = Vector3(5,-.675,0)
    var water := ShaderMaterial.new()
    water.shader = preload("res://assets/opening_art/river.gdshader")
    river.material_override = water
    river.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
    root.add_child(river)
    var rng := RandomNumberGenerator.new()
    rng.seed = 2391
    var grass: Array[Transform3D] = []
    var colors: Array[Color] = []
    for side in [0,1]:
        for i in range(420):
            var z: float = rng.randf_range(-8,8)
            if absf(z) < 2.1: continue
            var edge: float = 2.7 if side == 0 else 7.3
            var inward: float = -1.0 if side == 0 else 1.0
            var x: float = edge+inward*rng.randf_range(.18,1.55)
            if sin(z*1.7+x) < -.45: continue
            var size: float = rng.randf_range(.55,1.15)
            grass.append(Transform3D(Basis(Vector3.UP,rng.randf()*TAU).scaled(Vector3.ONE*size),Vector3(x,.028,z)))
            colors.append(Color(.79,.90,.71))
    var mat: Material = FOLIAGE._material()
    FOLIAGE._batch(root,"RiverbankGrass",FOLIAGE._grass_mesh(),mat,grass,colors)
    var ferns: Array[Transform3D] = []
    var fc: Array[Color] = []
    for p in [Vector3(2.1,0,3.2),Vector3(1.7,0,3.8),Vector3(2.0,0,-3.0),Vector3(7.9,0,3.3),Vector3(8.1,0,-3.2),Vector3(8.25,0,-3.9)]:
        ferns.append(Transform3D(Basis(Vector3.UP,p.x).scaled(Vector3.ONE*.75),p+Vector3.UP*.025))
        fc.append(Color(.83,.9,.75))
    FOLIAGE._batch(root,"BankFernGroups",FOLIAGE._fern_mesh(),mat,ferns,fc)

static func _land(parent: Node3D, x0: float,x1: float) -> void:
    var st := SurfaceTool.new()
    st.begin(Mesh.PRIMITIVE_TRIANGLES)
    var nx: int = int(ceil((x1-x0)/.25))
    var nz: int = 136
    for j in range(nz+1):
        for i in range(nx+1):
            var x: float = lerpf(x0,x1,float(i)/nx)
            var z: float = -17.0+j*.25
            var p := Vector2(x,z)
            # Finite connected routes with rounded worn ends, not infinite
            # stripes/T rectangles. The missing bridge remains an actual gap.
            var d: float = _route_distance(p,Vector2(-10.5,0),Vector2(13.3,0))
            d = minf(d,_route_distance(p,Vector2(-10.5,0),Vector2(-10.5,9.0)))
            d = minf(d,_route_distance(p,Vector2(13.3,0),Vector2(13.3,-6.5)))
            var wobble: float = sin(x*1.45+sin(z*2.0))*.12
            var path: float = 1.0-smoothstep(1.0+wobble,1.85+wobble,d)
            var bank_edge: float = 2.7 if x0 < 0 else 7.3
            var from_water: float = absf(x-bank_edge)
            var erosion: float = (1.0-smoothstep(.12,.85+.28*sin(z*.81),from_water))*smoothstep(1.55,2.7,absf(z))
            # Dry scalloped earth meets the shelf below, without moving the
            # authoritative Y=0 walking surface or narrowing either approach.
            st.set_color(Color(maxf(path,erosion*.70),erosion*.16,0,1))
            st.add_vertex(Vector3(x,.028,z))
    for j in range(nz):
        for i in range(nx):
            var a: int = j*(nx+1)+i
            for index in [a,a+1,a+nx+2,a,a+nx+2,a+nx+1]: st.add_index(index)
    st.generate_normals()
    var mesh := MeshInstance3D.new()
    mesh.name = "BlendedBridgeApproachLeft" if x0 < 0 else "BlendedBridgeApproachRight"
    mesh.mesh = st.commit()
    mesh.material_override = preload("res://scripts/garden_terrain.gd").material()
    mesh.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
    parent.add_child(mesh)

static func _route_distance(point: Vector2, start: Vector2, end: Vector2) -> float:
    var segment := end-start
    var t := clampf((point-start).dot(segment)/segment.length_squared(),0.0,1.0)
    return point.distance_to(start+segment*t)

static func shore_width(z: float, direction: float) -> float:
    # Broad alternating shelves, not a straight trench with a wavy bottom edge.
    return .93+.43*sin(z*.53+direction*.9)+.19*sin(z*1.21+.4)

static func _shore(parent: Node3D, edge: float, direction: float) -> void:
    var st := SurfaceTool.new()
    st.begin(Mesh.PRIMITIVE_TRIANGLES)
    for i in range(152):
        var za: float = -19+i*.25
        var zb: float = za+.25
        # Keep all four bearing faces and the water clearance beneath them open.
        if absf((za+zb)*.5) < 1.5: continue
        var rows: Array = []
        for z: float in [za,zb]:
            var width := shore_width(z,direction)
            var shoulder := smoothstep(1.5,2.6,absf(z))
            width *= lerpf(.18,1.0,shoulder)
            rows.append([Vector3(edge,.028,z),
                Vector3(edge+direction*width*.55,-.12-.045*sin(z*.9),z),
                Vector3(edge+direction*width*.90,-.33-.06*sin(z*.6+.7),z),
                Vector3(edge+direction*(width+.22),-.77,z),
                Vector3(edge+direction*(width+.39),-1.02,z)])
        for j in range(4):
            var vertices := [rows[0][j],rows[1][j],rows[1][j+1],rows[0][j+1]]
            for n in ([0,2,1,0,3,2] if direction > 0 else [0,1,2,0,2,3]):
                var height: float = vertices[n].y
                var wet := 1.0-smoothstep(-.80,-.25,height)
                st.set_color(Color(.63,lerpf(.15,.82,wet),0,1))
                st.add_vertex(vertices[n])
    st.generate_normals()
    var mesh := MeshInstance3D.new()
    mesh.name = "SculptedShore"
    mesh.mesh = st.commit()
    var shore_material: ShaderMaterial = preload("res://scripts/garden_terrain.gd").material()
    shore_material.shader = preload("res://assets/opening_art/shore.gdshader")
    mesh.material_override = shore_material
    mesh.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
    parent.add_child(mesh)
