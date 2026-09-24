extends RefCounted
## Scene-local stepped storage geometry. Solver owns heights and wetness.
const CENTERS := [Vector3(160,0,-8.5),Vector3(160,0,-5),Vector3(160,0,2),Vector3(155.2,0,6.375),Vector3(149.2,0,6.375)]
const SIZES := [Vector3(1.6,.012,3),Vector3(1.6,.012,4),Vector3(1.6,.012,10),Vector3(8,.012,1.25),Vector3(4,.012,.8)]
var drops: Array[MeshInstance3D] = []
var lips: Array[MeshInstance3D] = []
var finishes := {}
# Authored bevel silhouette with UVs; no hydraulic dimensions are rescaled.
func finish(timber := false) -> StandardMaterial3D:
    var key := "timber" if timber else "stone"
    if finishes.has(key): return finishes[key]
    var m := StandardMaterial3D.new()
    m.albedo_color = Color("ad946f") if timber else Color("c8c4b8")
    m.roughness = .92
    var noise := FastNoiseLite.new()
    noise.seed = 37
    noise.frequency = .045 if timber else .08
    noise.fractal_octaves = 3
    var texture := NoiseTexture2D.new()
    texture.width = 128
    texture.height = 128
    texture.noise = noise
    var ramp := Gradient.new()
    ramp.set_color(0,Color("5b4936") if timber else Color("aaa68d"))
    ramp.set_color(1,Color("c8a16a") if timber else Color("dedcc8"))
    texture.color_ramp = ramp
    m.albedo_texture = texture
    m.uv1_triplanar = true
    m.uv1_scale = Vector3(3,.20,3) if timber else Vector3(1.8,1.8,1.8)
    finishes[key] = m
    return m

func dressed(parent: Node3D, at: Vector3, size: Vector3, timber := false) -> MeshInstance3D:
    var b: float = minf(.045,minf(size.x,minf(size.y,size.z))*.18)
    var x := size.x/2
    var z := size.z/2
    var y := size.y/2
    var ring := [Vector2(-x+b,-z),Vector2(x-b,-z),Vector2(x,-z+b),Vector2(x,z-b),Vector2(x-b,z),Vector2(-x+b,z),Vector2(-x,z-b),Vector2(-x,-z+b)]
    var vertices: Array[Vector3] = []
    for layer in range(4):
        for v in ring:
            var inset: float = b if layer == 0 or layer == 3 else 0.0
            vertices.append(Vector3(v.x-signf(v.x)*inset,[-y,-y+b,y-b,y][layer],v.y-signf(v.y)*inset))
    var st := SurfaceTool.new()
    st.begin(Mesh.PRIMITIVE_TRIANGLES)
    for layer in range(3):
        for j in range(8):
            var a := layer*8+j
            var n := layer*8+(j+1)%8
            for index in [a,n,n+8,a,n+8,a+8]:
                st.set_uv(Vector2(vertices[index].x,vertices[index].y))
                st.add_vertex(vertices[index])
    for j in range(1,7):
        for index in [0,j+1,j,24,24+j,24+j+1]:
            st.set_uv(Vector2(vertices[index].x,vertices[index].z))
            st.add_vertex(vertices[index])
    st.generate_normals()
    var node := MeshInstance3D.new()
    node.mesh = st.commit()
    node.position = at
    node.material_override = finish(timber)
    # Beveled cap/ring winding is intentionally two-sided for internal trough faces.
    node.material_override.cull_mode = BaseMaterial3D.CULL_DISABLED
    parent.add_child(node)
    return node

func masonry(parent: Node3D, at: Vector3, size: Vector3) -> void:
    var along_z := size.z > size.x
    # Recessed continuous mortar closes daylight/water cracks through bevel joints.
    # It stays inside the lining thickness, outside the authoritative wet footprint.
    if not finishes.has("mortar"):
        var mortar := StandardMaterial3D.new()
        mortar.albedo_color = Color("817e68")
        mortar.roughness = 1.0
        finishes["mortar"] = mortar
    var core := MeshInstance3D.new()
    core.name = "MortarCore"
    var core_mesh := BoxMesh.new()
    core_mesh.size = Vector3(size.x*.66,size.y-.016,size.z+.008) if along_z else Vector3(size.x+.008,size.y-.016,size.z*.66)
    core.mesh = core_mesh
    core.position = at
    core.material_override = finishes["mortar"]
    parent.add_child(core)
    var length := size.z if along_z else size.x
    var courses := maxi(1,int(ceil(size.y/.26)))
    for course in range(courses):
        var count := maxi(1,int(ceil(length/.72)))
        for n in range(count+1):
            var nominal := length/count
            var first := maxf(-length/2,-length/2+n*nominal-(nominal*.5 if course%2 else 0.0))
            var last := minf(length/2,-length/2+(n+1)*nominal-(nominal*.5 if course%2 else 0.0))
            var span := last-first
            if span < .02: continue
            var offset := (first+last)/2
            var pos := at+Vector3(0,(course+.5)*size.y/courses-size.y/2,0)
            if along_z: pos.z += offset
            else: pos.x += offset
            var block := Vector3(size.x,size.y/courses-.008,span-.012) if along_z else Vector3(span-.012,size.y/courses-.008,size.z)
            dressed(parent,pos,block)

func lift_gate(parent: Node3D, width: float) -> Node3D:
    var root := Node3D.new()
    parent.add_child(root)
    var board := Node3D.new()
    root.add_child(board) # Only the board/handle moves; guides stay fixed.
    for n in range(4):
        dressed(board,Vector3(0,(n-1.5)*.21,0),Vector3(width,.205,.16),true)
    for side in [-1,1]:
        dressed(board,Vector3(side*width*.32,0,-.105),Vector3(.09,.80,.055),true)
        # Two cheeks leave a visible groove around the sliding board.
        for cheek in [-1,1]:
            dressed(root,Vector3(side*(width/2+.05),.92,cheek*.145),Vector3(.16,1.84,.10),true)
        dressed(board,Vector3(side*.23,.50,0),Vector3(.065,.20,.08),true)
    dressed(board,Vector3(0,.59,0),Vector3(.64,.09,.11),true)
    # Open-top grooves leave the manual lifting handle unobstructed.
    return root

func planting_bed(parent: Node3D, at: Vector3, size: Vector3) -> void:
    # Broad soft earth shoulders, not individual raised wooden planter boxes.
    var st := SurfaceTool.new()
    st.begin(Mesh.PRIMITIVE_TRIANGLES)
    var outer: Array[Vector3] = []
    var inner: Array[Vector3] = []
    for n in range(24):
        var a := n*TAU/24
        var x := signf(cos(a))*pow(absf(cos(a)),.35)*size.x*.5
        var z := signf(sin(a))*pow(absf(sin(a)),.35)*size.z*.5
        outer.append(Vector3(x,.018,z))
        inner.append(Vector3(x*.88,.09,z*.88))
    for n in range(24):
        var next := (n+1)%24
        for v in [outer[n],outer[next],inner[next],outer[n],inner[next],inner[n],Vector3(0,.09,0),inner[n],inner[next]]:
            st.set_uv(Vector2(v.x,v.z))
            st.add_vertex(v)
    st.generate_normals()
    var node := MeshInstance3D.new()
    node.mesh = st.commit()
    node.position = Vector3(at.x,0,at.z)
    node.material_override = preload("res://assets/environment/village_finish.gd").ground_material(Color("6b543b"))
    node.material_override.cull_mode = BaseMaterial3D.CULL_DISABLED
    parent.add_child(node)

func build(c) -> void:
    for i in range(5):
        var s: Dictionary = c.construction.flow.cell_state(i)
        var p: Vector3 = CENTERS[i]+Vector3.UP*s.bed
        var size: Vector3 = SIZES[i]
        if i != 1: c.host._box(c,p-Vector3.UP*.06,Vector3(size.x,.12,size.z),Color("715d45"))
        c.water.append(c.host._box(c,p,size,Color("4ba9bb")))
        var height: float = s.rim-s.bed+.06
        # Leave actual openings at the two elbows; no inherited cross-dams.
        if i < 3:
            for side in [-1,1]:
                var length: float = size.z-1.25 if i == 2 and side == -1 else size.z
                var z: float = p.z-.625 if i == 2 and side == -1 else p.z
                masonry(c,Vector3(p.x+side*(size.x/2+.11),s.bed+height/2,z),Vector3(.22,height,length))
        elif i == 3:
            for side in [-1,1]: masonry(c,p+Vector3(0,height/2,side*(size.z/2+.11)),Vector3(size.x,height,.22))
        else:
            for side in [-1,1]: masonry(c,p+Vector3(0,height/2,side*.51),Vector3(4,height,.22))
    # Separate coping stones and recessed joints break the toy-like slab silhouette.
    for cell in range(3):
        var state: Dictionary = c.construction.flow.cell_state(cell)
        var length: float = SIZES[cell].z
        for side in [-1,1]:
            var count := int(ceil(length/.5))
            for n in range(count):
                var z: float = CENTERS[cell].z-length/2+(n+.5)*length/count
                if cell == 2 and side == -1 and z > 5.7: continue
                dressed(c,Vector3(160+side*.91,state.rim+.07,z),Vector3(.29,.11,length/count-.025))
    for i in range(c.water.size()):
        var material := ShaderMaterial.new()
        material.shader = preload("res://assets/garden_art/water.gdshader")
        material.set_shader_parameter("flow_direction",Vector2(0,1) if i < 3 else Vector2(-1,0))
        c.water[i].material_override = material
    # Closed main end makes the westward elbow the only open route.
    masonry(c,Vector3(160,.63,7.11),Vector3(2.04,.56,.22))
    for side in [-1,1]:
        c.host._box(c,Vector3(151.2,.355,6.375+side*.5125),Vector3(.16,.41,.225),Color("b7a181"))
    # Source back wall. Step faces are physical sills, not floating water sheets.
    masonry(c,Vector3(160,1.38,-10.11),Vector3(2.04,.86,.22))
    for spec in [Vector3(160,.8,-7),Vector3(160,.5,-3)]:
        c.host._box(c,spec,Vector3(1.6,.3,.08),Color("715d45"))
    c.host._box(c,Vector3(159.2,.25,6.375),Vector3(.08,.2,1.25),Color("715d45"))
    c.host._box(c,Vector3(151.2,.085,6.375),Vector3(.08,.13,.8),Color("715d45"))
    # Four zero-length step waterfalls, driven by the same link head/opening.
    for i in range(4):
        var drop: MeshInstance3D = c.host._box(c,Vector3.ZERO,Vector3.ONE,Color("4ba9bb"))
        var drop_material := ShaderMaterial.new()
        drop_material.shader = preload("res://assets/garden_art/water.gdshader")
        drop_material.set_shader_parameter("falling",true)
        drop.material_override = drop_material
        drops.append(drop)
    # Existing lower open drain ends at a visible free-outfall grate, not an uphill return.
    c.host._box(c,Vector3(146.8,.014,6.375),Vector3(.8,.012,.8),Color("493b2e"))
    for x in range(5): c.host._box(c,Vector3(146.48,.026,6.015+x*.18),Vector3(.35,.035,.045),Color("806343"))
func sync(c) -> void:
    var states: Array = []
    for i in range(5): states.append(c.construction.flow.cell_state(i))
    var opened := [c.construction.inlet,c.construction.installed.channel and c.construction.low,c.construction.outlet,true]
    var points := [Vector3(160,0,-7),Vector3(160,0,-3),Vector3(159.2,0,6.375),Vector3(151.2,0,6.375)]
    for i in range(4):
        var mat: ShaderMaterial = c.water[i].material_override as ShaderMaterial
        var difference: float = states[i].head_m-states[i+1].head_m
        mat.set_shader_parameter("flow_speed",clampf(difference,-.3,.3) if opened[i] else 0.0)
        var high: float = states[i].head_m
        var low: float = maxf(states[i+1].head_m,states[i+1].bed)
        drops[i].visible = opened[i] and high > states[i].bed+.00001 and high > low+.00001
        drops[i].position = points[i]+Vector3.UP*((high+low)/2)
        drops[i].scale = Vector3(1.6, maxf(.001,high-low),.018) if i < 2 else Vector3(.018,maxf(.001,high-low),1.25 if i == 2 else .8)
