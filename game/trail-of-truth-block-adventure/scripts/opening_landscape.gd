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
    # Scanned rocks (Poly Haven CC0, assets/scans/PROVENANCE.md). The hero
    # boulder covers world.gd's MeadowRock collider (x 16.3..18.9, z -10..-8);
    # two smaller rocks close the lamb's alcove (main.gd LAMB_ALCOVE, 18.5,-11)
    # on the east and south, leaving it open to the west where the trail
    # arrives.
    var scans := preload("res://scripts/cave_scenery.gd")
    scans.scan(root, "namaqualand_cliff_01", Vector3(17.5, -.15, -9.6), .5, 180)
    scans.scan(root, "rock_moss_a", Vector3(19.8, -.12, -11.2), .6, 40)
    scans.scan(root, "rock_moss_e", Vector3(18.4, -.1, -12.5), .55, 110)
    scans.scan(root, "namaqualand_boulder_05", Vector3(15.9, -.05, -7.5), 1.3, 200)
    # Smaller mossy stones sunk into the creek banks at the bends.
    for item in [[Vector3(2.38, -.25, -6.4), "rock_moss_b", .42, 35.0],
        [Vector3(7.48, -.25, 5.8), "rock_moss_c", .4, -18.0],
        [Vector3(2.42, -.28, 9.2), "rock_moss_d", .4, 160.0],
        [Vector3(7.7, -.22, -10.2), "rock_moss_f", .42, 75.0]]:
        scans.scan(root, item[1], item[0], item[2], item[3])

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
            var h := 2.0+1.8*pow(.5+.5*sin(angle*5+.8),2.0)+.65*sin(angle*11)
            var crease := sin(angle*31+.7)*.25+sin(angle*17)*.35
            var offsets := [0.0,.8,2.2,4.2,7.5,12.0,19.0,29.0]
            var heights := [-.12,.38,.85,1.25,h,h*.89,h*.4,-.7]
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
            var stone := Color("8a8570").lerp(Color("6d6a58"),.5+.25*sin(i*.41+j))
            var col := Color("618644").lerp(Color("7a9c58"),.5+.25*sin(i*.19+j*.8))
            # Exposed rock reads where the ridge actually bulges outward
            # (same buttress term the geometry above uses), so gray stone
            # tracks real protruding relief instead of a flat painted patch
            # decoupled from the silhouette underneath it.
            var seam_angle: float = float(i)*TAU/count
            var seam_buttress := (.5+.5*sin(seam_angle*19+.7))*.85 + (.5+.5*sin(seam_angle*37))*.24
            if j in [1,2]: col = col.lerp(stone, smoothstep(.55,.95,seam_buttress))
            if j == 0: col = Color("6f8a4a")
            _tri(st,a,c,b,col)
            _tri(st,a,d,c,col)
    st.index()
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
        var scale_xz: float = [1.0,1.08,.91,.80,.51][j]
        for i in range(contour.size()):
            var p: Vector2 = contour[i]*scale_xz
            var y: float = [-.09,.17,.46,.78,1.0][j]
            y += rng.randf_range(-.045,.045)
            row.append(at+Vector3(p.x*size.x,(y+p.x*.1)*size.y,p.y*size.z))
        rings.append(row)
    for j in range(4):
        for i in range(8):
            var n := (i+1)%8
            var col := Color("555c56").lerp(Color("8a8069"),rng.randf_range(.1,.65))
            # Godot front faces are clockwise: side normals face outward.
            _tri(st,rings[j][i],rings[j][n],rings[j+1][n],col)
            _tri(st,rings[j][i],rings[j+1][n],rings[j+1][i],col)
    for i in range(8):
        _tri(st,rings[4][i],rings[4][(i+1)%8],at+Vector3(-.035,size.y*.99,.025),Color("85816a"))
    return _mesh(parent,label,st)
