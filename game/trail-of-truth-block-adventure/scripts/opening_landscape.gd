extends RefCounted
## Project-authored landscape kit: continuous escarpment, distant ridges and
## layered sandstone outcrops. Runtime triangle meshes, not scaled primitives.
## Scenic relief stays outside the retained playable rectangle/collision limits.
const LIMITS := Rect2(-22, -17, 45, 34)

static func build(host: Node3D) -> void:
    var root := Node3D.new()
    root.name = "OpeningLandscape"
    host.add_child(root)
    _escarpment(root)
    for layer in range(3):
        _horizon(root, layer)
    rock(root, "MeadowOutcrop", Vector3(17.6,0,-9), Vector3(3.0,2.6,2.45), 7)
    # Smaller seams of the same local stone at bends, not uniform pebble noise.
    for item in [[Vector3(2.38,-.33,-6.4),Vector3(1.2,.65,2.2),2],
        [Vector3(7.48,-.37,5.8),Vector3(1.4,.7,2.8),4],
        [Vector3(2.42,-.44,9.2),Vector3(.9,.65,1.6),11],
        [Vector3(7.7,-.22,-10.2),Vector3(1.4,.8,2.1),13]]:
        rock(root,"CreekLedge",item[0],item[1],item[2])

static func _material() -> ShaderMaterial:
    var m := ShaderMaterial.new()
    m.shader = preload("res://assets/opening_art/landscape.gdshader")
    m.set_shader_parameter("painted_ground",load("res://assets/garden_art/painted_ground.png"))
    return m

static func _mesh(parent: Node3D, label: String, st: SurfaceTool) -> MeshInstance3D:
    st.generate_normals()
    var node := MeshInstance3D.new()
    node.name = label
    node.mesh = st.commit()
    node.material_override = _material()
    parent.add_child(node)
    return node

static func _tri(st: SurfaceTool, a: Vector3, b: Vector3, c: Vector3, color: Color) -> void:
    st.set_color(color)
    for p in [a,b,c]:
        st.set_uv(Vector2(p.x,p.z)*.25)
        st.add_vertex(p)

static func _boundary(angle: float) -> Vector3:
    var v := Vector2(cos(angle),sin(angle))
    var r := minf(22.5/maxf(absf(v.x),.0001),17/maxf(absf(v.y),.0001))
    return Vector3(.5+v.x*r,0,v.y*r)

static func _escarpment(parent: Node3D) -> void:
    var st := SurfaceTool.new()
    st.begin(Mesh.PRIMITIVE_TRIANGLES)
    var count := 192
    var rings: Array[PackedVector3Array] = []
    for j in range(8):
        var row := PackedVector3Array()
        for i in range(count+1):
            var angle: float = float(i)*TAU/count
            var p := _boundary(angle)
            var outward := Vector3(cos(angle),0,sin(angle))
            # Broad irregular ridgelines with small erosion breaks, no domes.
            var h := 4.6+1.05*(sin(angle*5+.8)+1)+.55*sin(angle*11)
            var crease := sin(angle*31+.7)*.25+sin(angle*17)*.35
            var offsets := [0.0,.35,.65,1.0,2.2,6.0,13.0,24.0]
            var heights := [-.12,.65,1.8,3.0,h,h*.89,h*.4,-.7]
            # Recessed buttresses break the straight wall without projecting
            # inside the retained collision boundary or across walking ground.
            var buttress := (.5+.5*sin(angle*19+.7))*.85 + (.5+.5*sin(angle*37))*.24
            var relief: float = [0.0,.25,.9,1.0,.7,.35,.1,0.0][j]
            p += outward*(float(offsets[j])+crease*float(j)/7.0+buttress*relief)
            p.y = float(heights[j]) + (sin(angle*23)*.16 if j in [1,2,3] else 0.0)
            # A downstream/upstream cleft beyond the non-walkable river,
            # rather than a scenic green plug across the creek's vanishing point.
            if absf(p.z)>16.8:
                var channel := 1.0-smoothstep(2.1,5.8,absf(p.x-5))
                p.y = lerpf(p.y,-1.0,channel)
            row.append(p)
        rings.append(row)
    for j in range(7):
        for i in range(count):
            var a: Vector3 = rings[j][i]
            var b: Vector3 = rings[j][i+1]
            var c: Vector3 = rings[j+1][i+1]
            var d: Vector3 = rings[j+1][i]
            var stone := Color("9b9a7b").lerp(Color("777c69"),.5+.25*sin(i*.41+j))
            var col: Color = stone if j < 4 else Color("657d49").lerp(Color("899958"),.5+.25*sin(i*.19))
            # Low grassy toe breaks the edge; broken stratified faces carry the boundary.
            if j == 0: col = Color("72884c")
            _tri(st,a,c,b,col)
            _tri(st,a,d,c,col)
    _mesh(parent,"ContinuousEscarpment",st)

static func _horizon(parent: Node3D, layer: int) -> void:
    var st := SurfaceTool.new()
    st.begin(Mesh.PRIMITIVE_TRIANGLES)
    var count := 128
    var radius := 65.0+layer*30.0
    var color: Color = [Color("748d75"),Color("829e94"),Color("9ab6b1")][layer]
    for i in range(count):
        var points: Array[Vector3] = []
        for k in [i,i+1]:
            var a := float(k)*TAU/count
            var height := 7.0+layer*3.0+4.0*sin(a*4+.6+layer)+2.3*sin(a*9+layer)+1.4*sin(a*17+.4)
            points.append(Vector3(cos(a)*radius,height,sin(a)*radius))
        var a: Vector3 = points[0]
        var b: Vector3 = points[1]
        _tri(st,Vector3(a.x,-5,a.z),b,a,color)
        _tri(st,Vector3(a.x,-5,a.z),Vector3(b.x,-5,b.z),b,color)
    var node := _mesh(parent,"DistantRidge%d"%layer,st)
    node.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF

static func rock(parent: Node3D, label: String, at: Vector3, size: Vector3, seed_value: int) -> MeshInstance3D:
    var st := SurfaceTool.new()
    st.begin(Mesh.PRIMITIVE_TRIANGLES)
    var rng := RandomNumberGenerator.new()
    rng.seed = seed_value
    # Asymmetric angular plan, stepped bedding planes and a tilted fractured cap.
    var contour := [Vector2(-.5,-.32),Vector2(-.22,-.51),Vector2(.31,-.46),Vector2(.52,-.12),Vector2(.43,.36),Vector2(.06,.52),Vector2(-.45,.39),Vector2(-.57,.02)]
    var rings: Array[PackedVector3Array] = []
    for j in range(5):
        var row := PackedVector3Array()
        var scale_xz: float = [1.0,1.06,.96,.89,.62][j]
        for i in range(contour.size()):
            var p: Vector2 = contour[i]*scale_xz
            var y: float = [-.09,.17,.46,.78,1.0][j]
            y += rng.randf_range(-.045,.045)
            row.append(at+Vector3(p.x*size.x,(y+p.x*.1)*size.y,p.y*size.z))
        rings.append(row)
    for j in range(4):
        for i in range(8):
            var n := (i+1)%8
            var col := Color("95947e").lerp(Color("bdbaa1"),rng.randf_range(.1,.65))
            # Godot front faces are clockwise: side normals face outward.
            _tri(st,rings[j][i],rings[j][n],rings[j+1][n],col)
            _tri(st,rings[j][i],rings[j+1][n],rings[j+1][i],col)
    for i in range(8):
        _tri(st,rings[4][i],rings[4][(i+1)%8],at+Vector3(-.035,size.y*.99,.025),Color("b5b297"))
    return _mesh(parent,label,st)
