extends RefCounted
## Authored stratified sandstone envelope. Art only: cave_scenery owns physics.
## Profiles are deliberately asymmetric, not circular tunnel/noise samples.
## All coordinates are entrance-local; negative Z leads into the chamber.
const DEPTHS := [1.15, 0.35, -0.65, -1.65, -3.2, -5.0, -7.3, -9.5, -11.6, -13.48]
# left width, right width, left shoulder height, crown height, crown offset
const SECTIONS := [
    [2.18, 2.32, 3.52, 4.12, -.28],
    [1.94, 2.04, 3.46, 3.92, -.16],
    [1.92, 1.95, 3.45, 3.82, .10],
    [4.25, 4.24, 3.50, 4.26, .35],
    [4.18, 4.29, 3.20, 4.32, .22],
    [4.29, 4.16, 3.46, 4.16, -.38],
    [4.16, 4.30, 3.12, 4.34, -.52],
    [4.30, 4.18, 3.38, 4.20, .32],
    [4.20, 4.28, 3.24, 4.30, .15],
    [4.16, 4.21, 3.42, 4.12, -.25],
]

static func profile(i: int, variant: int = 0) -> PackedVector3Array:
    var s: Array = SECTIONS[i]
    var l: float = s[0]
    var r: float = s[1]
    var shoulder: float = s[2]
    var crown: float = s[3]
    var shift: float = s[4] * (-1.0 if variant == 1 else 1.0)
    var z: float = DEPTHS[i]
    # Vertical doorway sides guarantee 3.6m width through 3.4m headroom.
    # Chamber haunches remain outside the +/-3.8m combat envelope.
    var ledge: float = 0.0 if i < 3 else [.10, .27, .04, .21, .08, .25, .12][i-3]
    if i >= 3:
        # Keep rendered side faces behind the unchanged 4.3m inner collider
        # plane, including the ledge. Free walking must not enter visible rock.
        l = maxf(l, 4.34 + ledge)
        r = maxf(r, 4.36)
    var pts := PackedVector3Array([
        Vector3(-l, -.06, z), Vector3(-l-.04, .55, z),
        Vector3(-l+ledge, 1.65+float(i%3)*.14, z), Vector3(-l, shoulder, z),
        Vector3(-l*.73, maxf(3.51, crown-.32), z),
        Vector3(-l*.36+shift*.3, crown-.08, z),
        Vector3(shift, crown, z),
        Vector3(r*.43+shift*.2, crown-.13, z),
        Vector3(r*.78, maxf(3.52, crown-.29), z),
        Vector3(r, maxf(3.45, shoulder-.16), z),
        Vector3(r-.02, 1.74, z), Vector3(r+.035, .48, z),
        Vector3(r, -.06, z)
    ])
    return pts

static func _triangle(st: SurfaceTool, a: Vector3, b: Vector3, c: Vector3, toward: Vector3) -> void:
    # Godot front faces are clockwise. Explicit normal + checked winding.
    var n := (b-a).cross(c-a).normalized()
    if n.dot(toward) < 0:
        var swap := b
        b = c
        c = swap
        n = -n
    for p in [a, c, b]:
        st.set_normal(n)
        st.set_uv(Vector2(p.x + p.z*.37, p.y + p.z*.61))
        st.add_vertex(p)

static func _surface(parent: Node3D, label: String, st: SurfaceTool, mat: Material) -> MeshInstance3D:
    st.index()
    st.generate_normals()
    var instance := MeshInstance3D.new()
    instance.name = label
    instance.mesh = st.commit()
    instance.material_override = mat
    parent.add_child(instance)
    return instance

static func build(parent: Node3D, entrance: Vector3, stone: Material, outer_stone: Material, variant: int) -> Node3D:
    var root := Node3D.new()
    root.name = "SculptedCaveShell%d" % variant
    root.position = entrance
    root.set_meta("art_only", true)
    parent.add_child(root)
    var st := SurfaceTool.new()
    st.begin(Mesh.PRIMITIVE_TRIANGLES)
    st.set_smooth_group(0)
    for j in range(DEPTHS.size()-1):
        var a := profile(j, variant)
        var b := profile(j+1, variant)
        for k in range(a.size()-1):
            var mid := (a[k]+a[k+1]+b[k]+b[k+1])*.25
            var inward := Vector3(-mid.x, 1.6-mid.y, 0)
            _triangle(st, a[k], a[k+1], b[k], inward)
            _triangle(st, a[k+1], b[k+1], b[k], inward)
    _surface(root, "ContinuousInwardStoneVault", st, stone)
    # Closed, stepped back rock face: two nested contours, not a flat box wall.
    var back := profile(DEPTHS.size()-1, variant)
    back.append(Vector3(0,-.06,DEPTHS[-1]))
    st = SurfaceTool.new()
    st.begin(Mesh.PRIMITIVE_TRIANGLES)
    var center := Vector3(.32, 1.95, -13.16)
    for k in range(back.size()):
        var a: Vector3 = back[k]
        var b: Vector3 = back[(k+1)%back.size()]
        var ai := a.lerp(center, .48)
        var bi := b.lerp(center, .48)
        ai.z -= .19
        bi.z -= .19
        _triangle(st, a,b,ai,Vector3.BACK)
        _triangle(st, b,bi,ai,Vector3.BACK)
        _triangle(st, ai,bi,center,Vector3.BACK)
    _surface(root, "ClosedWeatheredBackFace", st, stone)
    # Deep mouth apron joins the throat to a massive asymmetric hillside crown.
    var mouth := profile(0, variant)
    var rim := PackedVector3Array([
        Vector3(-5.95,-.08,.25),Vector3(-5.82,1.1,.4),
        Vector3(-5.55,3.1,.1),Vector3(-4.8,4.9,-.35),
        Vector3(-3.95,5.92,-.6),Vector3(-2.2,6.5,-.8),
        Vector3(-.45,6.82,-.9),Vector3(2.05,6.37,-.5),
        Vector3(3.7,5.65,-.15),Vector3(5.12,4.63,.15),
        Vector3(5.64,2.8,.55),Vector3(5.9,.8,.65),Vector3(5.95,-.08,.4)
    ])
    st = SurfaceTool.new()
    st.begin(Mesh.PRIMITIVE_TRIANGLES)
    for k in range(mouth.size()-1):
        # Uneven intermediate bevel prevents a paper-thin arch silhouette.
        var a := mouth[k].lerp(rim[k], .32)
        var b := mouth[k+1].lerp(rim[k+1], .32)
        a.z += .36 if k%3 == 0 else .17
        b.z += .36 if (k+1)%3 == 0 else .17
        _triangle(st,mouth[k],mouth[k+1],a,Vector3.BACK)
        _triangle(st,mouth[k+1],b,a,Vector3.BACK)
        _triangle(st,a,b,rim[k],Vector3.BACK)
        _triangle(st,b,rim[k+1],rim[k],Vector3.BACK)
    _surface(root,"FracturedOverhangAndMouth",st,outer_stone)
    # Exterior mantle connects the crown to the hillside instead of leaving
    # a freestanding stone arch with sky visible behind its upper edge.
    st = SurfaceTool.new()
    st.begin(Mesh.PRIMITIVE_TRIANGLES)
    var previous := rim
    for station in range(3):
        var next := PackedVector3Array()
        for k in range(rim.size()):
            var p := rim[k]
            p.z = [-3.8,-8.7,-14.6][station]
            p.y = maxf(-.08, p.y*[.96,.87,.73][station])
            if k > 2 and k < 10:
                p.y += [.12,-.10,.14,-.05][(k+station)%4]
            next.append(p)
        for k in range(rim.size()-1):
            var outward := Vector3(previous[k].x,previous[k].y-1.4,0)
            _triangle(st,previous[k],next[k],previous[k+1],outward)
            _triangle(st,previous[k+1],next[k],next[k+1],outward)
        previous = next
    for k in range(previous.size()-1):
        _triangle(st, previous[k],previous[k+1],Vector3(0,0,-14.6),Vector3.FORWARD)
    _surface(root,"ConnectedExteriorRockMantle",st,outer_stone)
    _dress_floor(root, stone, variant)
    return root

static func _dress_floor(root: Node3D, stone: Material, variant: int) -> void:
    # Low talus stays at the sides, clear of the combat envelope and doorway.
    var st := SurfaceTool.new()
    st.begin(Mesh.PRIMITIVE_TRIANGLES)
    for i in range(12):
        var side := -1.0 if i%2 == 0 else 1.0
        var z := -2.9-float(i/2)*1.8
        var base := Vector3(side*4.06,.025,z)
        var radius := .14+float(i%3)*.025
        var top := base+Vector3(side*.02,.16+float(i%4)*.035,.015)
        for k in range(5):
            var angle := float(k)*TAU/5.0
            var next := float(k+1)*TAU/5.0
            var a := base+Vector3(cos(angle)*radius,0,sin(angle)*radius*1.7)
            var b := base+Vector3(cos(next)*radius,0,sin(next)*radius*1.7)
            _triangle(st,a,b,top,Vector3.UP)
    _surface(root,"GroundedEdgeTalus",st,stone)
    var straw := StandardMaterial3D.new()
    straw.albedo_color = Color("8c7750")
    straw.roughness = 1.0
    straw.cull_mode = BaseMaterial3D.CULL_DISABLED
    st = SurfaceTool.new()
    st.begin(Mesh.PRIMITIVE_TRIANGLES)
    # Small old bedding patch, not a furnished dungeon or a gameplay marker.
    for i in range(35):
        var angle := float(i)*2.39996
        var radius := sqrt(float(i)/35.0)*.72
        var p := Vector3(2.85+cos(angle)*radius,.012,-11.5+sin(angle)*radius*.65)
        var d := Vector3(cos(angle+variant)*.20,0,sin(angle+variant)*.20)
        _triangle(st,p-d,p+d,p+Vector3(.018,.013,.018),Vector3.UP)
    _surface(root,"SparseDryGrassBedding",st,straw)
