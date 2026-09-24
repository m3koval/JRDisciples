extends RefCounted
## Continuous terrain and blended routes. Walkable core stays on existing Y=0 collider.
const PATHS := [
    [Vector2(150,16),Vector2(149.8,11),Vector2(150,8.5),Vector2(154,8.5),Vector2(157,8.5),Vector2(157,6.375),Vector2(156.7,3),Vector2(156.7,1),Vector2(157,-3),Vector2(156.8,-7),Vector2(156,-11),Vector2(155,-17)],
    [Vector2(149.5,12.5),Vector2(153,12),Vector2(157,10),Vector2(157,6),Vector2(156.7,1)],
    [Vector2(149,8.5),Vector2(152,8.5),Vector2(155,8.5),Vector2(158,8.5)],
    [Vector2(156,-10),Vector2(153,-9),Vector2(152.5,-12)],
    [Vector2(157,-4),Vector2(154,-4)]
]
static func path_distance(p: Vector2) -> float:
    var result: float = 1000.0
    for route in PATHS:
        for i in range(route.size()-1):
            var a: Vector2 = route[i]
            var b: Vector2 = route[i+1]
            var q: Vector2 = a+(b-a)*clampf((p-a).dot(b-a)/(b-a).length_squared(),0,1)
            result = minf(result,p.distance_to(q))
    return result

static func height_at(x: float,z: float) -> float:
    # Scenic relief only outside retained playable boundary; no false walkable bank.
    var outside: float = maxf(maxf(144-x,x-176),absf(z)-16)
    var fade: float = smoothstep(0,9,outside)
    for pad in [Vector2(138,-6),Vector2(169,-21),Vector2(181,4)]:
        fade *= smoothstep(4.0,8.0,Vector2(x,z).distance_to(pad))
    return .015+fade*maxf(0,1.4+sin(x*.20+z*.055)*.8+cos(z*.20)*1.1+sin(x*.09-z*.12)*.7)

static func material() -> ShaderMaterial:
    var mat := ShaderMaterial.new()
    mat.shader = preload("res://assets/garden_art/ground.gdshader")
    mat.set_shader_parameter("painted_ground",load("res://assets/garden_art/painted_ground.png"))
    return mat

static func paint_at(x: float,z: float) -> Color:
    var wobble: float = sin(x*2.1+sin(z*1.3))*.11+sin(z*4.2+x)*.045
    var d: float = path_distance(Vector2(x,z))
    var path: float = 1.0-smoothstep(.70+wobble,1.32+wobble,d)
    var cultivated: float = (1.0-smoothstep(2.0,2.60,absf(x-152.7)))*(1.0-smoothstep(1.70,2.20,absf(z-9.45)))
    cultivated *= smoothstep(.35,.70,absf(z-8.5))
    return Color(path,cultivated,0,1)

static func build(parent: Node3D) -> void:
    var st := SurfaceTool.new()
    st.begin(Mesh.PRIMITIVE_TRIANGLES)
    # Shared vertices / unified normal field avoids seams between path and meadow.
    var nx: int = 128
    var nz: int = 160
    for j in range(nz+1):
        for i in range(nx+1):
            var x: float = 128+i*.5
            var z: float = -40+j*.5
            st.set_color(paint_at(x,z))
            st.set_uv(Vector2(x,z)*.38)
            st.add_vertex(Vector3(x,height_at(x,z),z))
    for j in range(nz):
        for i in range(nx):
            var a: int = j*(nx+1)+i
            for index in [a,a+1,a+nx+2,a,a+nx+2,a+nx+1]: st.add_index(index)
    st.generate_normals()
    var terrain := MeshInstance3D.new()
    terrain.name = "ContinuousGardenTerrain"
    terrain.mesh = st.commit()
    terrain.material_override = material()
    # Receive object shadows without self-shadow acne on a broad flat plane.
    terrain.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
    parent.add_child(terrain)
    # Outlying ground continues under the scenic edge.
    var distant := MeshInstance3D.new()
    var plane := PlaneMesh.new()
    plane.size = Vector2(500,500)
    distant.mesh = plane
    distant.position = Vector3(160,-.04,0)
    var distant_mat := StandardMaterial3D.new()
    distant_mat.albedo_color = Color("668648")
    distant_mat.roughness = 1.0
    distant.material_override = distant_mat
    distant.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
    parent.add_child(distant)
