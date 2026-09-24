extends RefCounted
## Presentation only. All coordinates match water_campaign's authoritative stations.
## Hide old PLAN slab and two demo floor slabs. RETAIN demo_water and supply_meshes.
## No water, transfer connection, collision, animation, or gameplay state is authored here.

static func build(parent: Node3D) -> void:
	var root := Node3D.new()
	root.name = "GardenWorkshopArt"
	parent.add_child(root)
	var oak := _material("a87842")
	var edge := _material("c79b61")
	var dark := _material("65472d")
	var iron := _material("4a5554")
	var paper := _material("e8d5a0")
	var ink := _material("38646b")
	var clay := _material("af8052")
	_table(root, oak, edge, dark, iron, paper, ink)
	_supply(root, oak, edge, dark, iron)
	_tray(root, Vector3(153, .7, -12), "HighTray", oak, edge, dark, iron, clay)
	_tray(root, Vector3(154.1, .3, -12), "LowTray", oak, edge, dark, iron, clay)

static func _material(hex: String) -> StandardMaterial3D:
	var m := StandardMaterial3D.new()
	m.albedo_color = Color(hex)
	m.roughness = .86
	return m

# A true bevelled solid: eight-sided perimeter and inset top/bottom rings.
# No atlas, UV stretching, runtime dependencies or imported primitive silhouettes.
static func _timber(p: Node3D, label: String, at: Vector3, size: Vector3, mat: Material, bevel: float = .014) -> MeshInstance3D:
	var b: float = minf(bevel, minf(size.x, minf(size.y, size.z)) * .22)
	var hx: float = size.x * .5
	var hz: float = size.z * .5
	var ring: Array[Vector2] = [Vector2(-hx+b,-hz),Vector2(hx-b,-hz),Vector2(hx,-hz+b),Vector2(hx,hz-b),Vector2(hx-b,hz),Vector2(-hx+b,hz),Vector2(-hx,hz-b),Vector2(-hx,-hz+b)]
	var st := SurfaceTool.new()
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	var layers: Array[PackedVector3Array] = []
	for j: int in range(4):
		var inset: float = b if j == 0 or j == 3 else 0.0
		var y: float = [-size.y*.5, -size.y*.5+b, size.y*.5-b, size.y*.5][j]
		var layer := PackedVector3Array()
		for v: Vector2 in ring:
			layer.append(Vector3(v.x * (hx-inset)/hx, y, v.y * (hz-inset)/hz))
		layers.append(layer)
	for j: int in range(3):
		for i: int in range(8):
			var k: int = (i+1)%8
			_quad(st, layers[j][i], layers[j+1][i], layers[j+1][k], layers[j][k])
	for i: int in range(8):
		var k: int = (i+1)%8
		_triangle(st, Vector3(0,size.y*.5,0), layers[3][k], layers[3][i])
		_triangle(st, Vector3(0,-size.y*.5,0), layers[0][i], layers[0][k])
	st.generate_normals()
	var mesh := MeshInstance3D.new()
	mesh.name = label
	mesh.mesh = st.commit()
	mesh.material_override = mat
	mesh.position = at
	p.add_child(mesh)
	return mesh

static func _triangle(st: SurfaceTool, a: Vector3, b: Vector3, c: Vector3) -> void:
	st.add_vertex(a)
	st.add_vertex(c)
	st.add_vertex(b)

static func _quad(st: SurfaceTool, a: Vector3, b: Vector3, c: Vector3, d: Vector3) -> void:
	_triangle(st,a,b,c)
	_triangle(st,a,c,d)

static func _beam(p: Node3D, label: String, a: Vector3, b: Vector3, width: float, depth: float, mat: Material) -> void:
	var mesh := _timber(p,label,(a+b)*.5,Vector3(width,a.distance_to(b),depth),mat,.008)
	var direction: Vector3 = (b-a).normalized()
	mesh.quaternion = Quaternion(Vector3.UP,direction)

static func _table(p: Node3D, oak: Material, edge: Material, dark: Material, iron: Material, paper: Material, ink: Material) -> void:
	var root := Node3D.new()
	root.name = "RepairPlanTable"
	root.position = Vector3(153,0,-9)
	p.add_child(root)
	# Finished slab spans the old slab's exact .74-.86 vertical envelope.
	for i: int in range(4):
		_timber(root,"TopPlank",Vector3(0,.8,-.3+float(i)*.2),Vector3(1.4,.12,.194),edge,.016)
	for x: float in [-.54,.54]:
		for z: float in [-.27,.27]:
			_timber(root,"TenonedLeg",Vector3(x,.38,z),Vector3(.105,.76,.105),oak)
			_timber(root,"Foot",Vector3(x,.035,z),Vector3(.14,.07,.14),dark)
			_timber(root,"SquarePeg",Vector3(x,.66,z+signf(z)*.056),Vector3(.027,.027,.009),dark,.002)
		_timber(root,"TrestleStretcher",Vector3(x,.23,0),Vector3(.09,.09,.64),oak)
	_timber(root,"LongStretcher",Vector3(0,.23,0),Vector3(1.22,.09,.085),oak)
	for z: float in [-.285,.285]:
		_timber(root,"Apron",Vector3(0,.67,z),Vector3(1.18,.14,.072),oak)
		for x: float in [-.53,.53]:
			_beam(root,"KneeBrace",Vector3(x,.46,z),Vector3(x-signf(x)*.2,.71,z),.06,.065,edge)
	# Paper repair plan is laid flat, with line geometry rather than raster text.
	_timber(root,"PlanSheet",Vector3(-.045,.867,-.015),Vector3(.94,.012,.56),paper,.004)
	var y: float = .875
	for z: float in [-.16,.12]:
		_beam(root,"PlanChannelEdge",Vector3(-.4,y,z),Vector3(.27,y,z),.009,.009,ink)
	for x: float in [-.39,-.14,.1,.27]:
		_beam(root,"PlanJoint",Vector3(x,y,-.16),Vector3(x,y,.12),.007,.007,ink)
	# Distinct repair board across the channel and paired diagonal fastening marks.
	_timber(root,"PlanRepairMember",Vector3(.11,y+.002,-.02),Vector3(.038,.006,.33),oak,.001)
	for z: float in [-.19,.15]:
		_beam(root,"PlanFastener",Vector3(.085,y+.01,z-.012),Vector3(.13,y+.01,z+.012),.006,.006,ink)
	_beam(root,"PlanDimension",Vector3(-.37,y,.205),Vector3(.27,y,.205),.004,.004,ink)
	for x: float in [-.37,.27]:
		_beam(root,"DimensionTick",Vector3(x,y,.19),Vector3(x,y,.22),.004,.004,ink)
	_timber(root,"PaperWeight",Vector3(-.43,.884,-.24),Vector3(.08,.025,.055),iron,.009)
	_timber(root,"CarpenterPencil",Vector3(.53,.882,.035),Vector3(.025,.023,.36),oak,.004)
	_timber(root,"PencilPoint",Vector3(.53,.882,-.154),Vector3(.015,.016,.028),dark,.005)
	# Fine lengthwise grain is intentionally sparse and dimensioned, not atlas-mapped.
	for z: float in [-.363,.325,.347]:
		_beam(root,"TimberGrain",Vector3(-.55,.861,z),Vector3(.57,.861,z+.008),.002,.002,oak)

static func _supply(p: Node3D, oak: Material, edge: Material, dark: Material, iron: Material) -> void:
	var root := Node3D.new()
	root.name = "FiniteSupplyRack"
	root.position = Vector3(154,0,-4)
	p.add_child(root)
	# Slatted pad stays below the existing collectibles (whose bottoms are y=0).
	# Rack cheeks frame stock without creating false extra collectible inventory.
	for i: int in range(8):
		_timber(root,"GroundPadSlat",Vector3(-.31+float(i)*.217,-.018,0),Vector3(.207,.036,.96),edge,.006)
	for x: float in [-.47,1.36]:
		_timber(root,"RackFoot",Vector3(x,.036,0),Vector3(.13,.072,1.04),dark)
		for z: float in [-.44,.44]:
			_timber(root,"RackPost",Vector3(x,.24,z),Vector3(.085,.48,.085),oak)
			_timber(root,"PostCap",Vector3(x,.49,z),Vector3(.11,.04,.11),edge)
		_timber(root,"RackCheek",Vector3(x,.19,0),Vector3(.055,.12,.88),oak)
		_timber(root,"RackCheekUpper",Vector3(x,.37,0),Vector3(.055,.09,.88),edge)
		for z: float in [-.445,.445]:
			_timber(root,"JoineryPin",Vector3(x,.36,z),Vector3(.018,.018,.014),iron,.003)
	_timber(root,"BackRail",Vector3(.445,.26,-.46),Vector3(1.86,.1,.055),oak)

static func _tray(p: Node3D, origin: Vector3, label: String, oak: Material, edge: Material, dark: Material, iron: Material, clay: Material) -> void:
	var root := Node3D.new()
	root.name = label
	root.position = origin
	p.add_child(root)
	# Bed top = local y=0; floor centre = bed-.06. Clear wet area 1 x .4.
	# Walls end at bed+.3, outside the solver's footprint. No link/flow invented.
	_timber(root,"Floor",Vector3(0,-.06,0),Vector3(1.12,.12,.52),clay,.012)
	for z: float in [-.235,.235]:
		_timber(root,"LongWall",Vector3(0,.12,z),Vector3(1.12,.36,.07),oak,.012)
		_timber(root,"Rim",Vector3(0,.285,z),Vector3(1.15,.03,.082),edge,.006)
	for x: float in [-.535,.535]:
		_timber(root,"EndWall",Vector3(x,.12,0),Vector3(.07,.36,.4),oak,.009)
		_timber(root,"EndRim",Vector3(x,.285,0),Vector3(.082,.03,.4),edge,.006)
		for z: float in [-.242,.242]:
			_timber(root,"CornerStrap",Vector3(x,.1,z),Vector3(.07,.26,.013),iron,.003)
			for h: float in [.01,.2]:
				_timber(root,"StrapPin",Vector3(x,h,z+signf(z)*.009),Vector3(.018,.018,.008),edge,.003)
	var leg_h: float = origin.y-.13
	for x: float in [-.42,.42]:
		for z: float in [-.17,.17]:
			_timber(root,"SupportedLeg",Vector3(x,-origin.y+leg_h*.5,z),Vector3(.085,leg_h,.085),oak,.012)
			_timber(root,"Foot",Vector3(x,-origin.y+.025,z),Vector3(.12,.05,.12),dark,.01)
		_timber(root,"Bearer",Vector3(x,-.145,0),Vector3(.115,.05,.53),dark,.008)
		_timber(root,"TrestleRail",Vector3(x,-origin.y+.08,0),Vector3(.065,.055,.43),edge,.008)
	if origin.y > .5:
		for z: float in [-.17,.17]:
			_timber(root,"LowerStretcher",Vector3(0,-origin.y+.18,z),Vector3(.92,.065,.065),oak,.008)
			_beam(root,"DiagonalBrace",Vector3(-.4,-origin.y+.18,z),Vector3(.4,-.18,z),.047,.048,edge)
