extends RefCounted
## Original opaque, texture-free botanical geometry for the irrigation garden.
## Coordinates are world/site coordinates. No collision, scripts, lights or gameplay state.
## Usage: preload("res://scripts/garden_foliage.gd").build(world)
## Five authored branch skeletons; crowns are thousands of folded individual leaves.

static func build(parent: Node3D) -> void:
	if parent.has_node("GardenFoliage"):
		return
	var root := Node3D.new()
	root.name = "GardenFoliage"
	parent.add_child(root)
	var rng := RandomNumberGenerator.new()
	rng.seed = 731904
	var green := _material()
	var bark := _material()
	var leaves: Array[Transform3D] = []
	var leaf_colors: Array[Color] = []
	var wood := SurfaceTool.new()
	wood.begin(Mesh.PRIMITIVE_TRIANGLES)
	var trees: Array[Vector4] = [Vector4(145, 12, 1.0, 0.3), Vector4(145, -12, 1.08, 1.8), Vector4(163.8, -10.5, 0.88, 2.6), Vector4(166, 4, 1.05, 0.8), Vector4(165, 13, 1.12, 2.1)]
	for spec: Vector4 in trees:
		_tree(wood, leaves, leaf_colors, Vector3(spec.x, 0, spec.y), spec.z, spec.w, rng)
	wood.generate_normals()
	var trunk := MeshInstance3D.new()
	trunk.name = "FiveBranchingTrunks"
	trunk.mesh = wood.commit()
	trunk.material_override = bark
	root.add_child(trunk)
	_batch(root, "IndividualCrownLeaves", _leaf_mesh(), green, leaves, leaf_colors)
	var grasses: Array[Transform3D] = []
	var grass_colors: Array[Color] = []
	# Authored curved ribbons, not uniform scattered points. Negative spaces are deliberate.
	var ribbons: Array[PackedVector2Array] = [
		PackedVector2Array([Vector2(154.7,-8),Vector2(155.0,-6.7),Vector2(154.8,-5.2)]),
		PackedVector2Array([Vector2(154.8,-2.7),Vector2(155.0,-.8),Vector2(154.7,1.2)]),
		PackedVector2Array([Vector2(152.3,-3),Vector2(153.3,-1),Vector2(152.5,.7)]),
		PackedVector2Array([Vector2(163.4,-8.5),Vector2(163.1,-6),Vector2(163.4,-3.5)]),
		PackedVector2Array([Vector2(162.9,-1.5),Vector2(163.4,1),Vector2(163.1,4.3)]),
		PackedVector2Array([Vector2(150.2,12.8),Vector2(153.1,12.7),Vector2(155.7,12.8)]),
		PackedVector2Array([Vector2(146,-13.7),Vector2(149,-13.9),Vector2(152.8,-13.5)]),
		PackedVector2Array([Vector2(145.1,-10),Vector2(147.2,-6.5),Vector2(146.1,-2)]),
		PackedVector2Array([Vector2(145.4,0),Vector2(146.7,2.3),Vector2(145.6,4.6)]),
		PackedVector2Array([Vector2(145.3,8.5),Vector2(147.5,12.8),Vector2(153.8,13.7)]),
		PackedVector2Array([Vector2(162.7,-13.7),Vector2(166.8,-14.5),Vector2(170.3,-12.8)]),
		PackedVector2Array([Vector2(164,-7.8),Vector2(167.5,-5.3),Vector2(166.6,-1.8)]),
		PackedVector2Array([Vector2(167.7,1.2),Vector2(168.9,5),Vector2(166.9,8.2)]),
		PackedVector2Array([Vector2(163,11.8),Vector2(168,14.4),Vector2(173.5,12.2)])]
	for ribbon: PackedVector2Array in ribbons:
		for i: int in range(62):
			var t: float = (float(i) + rng.randf_range(-0.25,0.25)) / 61.0
			var p: Vector2 = ribbon[0] * pow(1.0-t,2) + ribbon[1] * 2.0*t*(1.0-t) + ribbon[2]*t*t
			var tangent: Vector2 = ((ribbon[1]-ribbon[0])*(1.0-t)+(ribbon[2]-ribbon[1])*t).normalized()
			p += Vector2(-tangent.y,tangent.x)*rng.randf_range(-0.47,0.47)*sin(PI*clampf(t,0,1))
			if not _clear(p,0.55):
				continue
			var size: float = rng.randf_range(0.65,1.28)
			grasses.append(_transform(Vector3(p.x,0.012,p.y), rng.randf()*TAU, Vector3(size,size,size)))
			grass_colors.append(Color.from_hsv(rng.randf_range(0.205,0.26),0.54,rng.randf_range(0.76,1.0)))
	# Low meadow undergrowth ties the authored drifts to the terrain instead of
	# presenting isolated decorative clumps. One shared batch, no extra draw calls.
	for i: int in range(2800):
		var p := Vector2(rng.randf_range(144.6,173.5),rng.randf_range(-15.0,15.0))
		if not _clear(p,.16): continue
		var distance: float = preload("res://scripts/garden_terrain.gd").path_distance(p)
		if distance < 1.10: continue
		var reserved := false
		for station in [Vector2(153,-9),Vector2(154,-4),Vector2(153,-12),Vector2(150,7)]:
			if p.distance_to(station) < 1.25: reserved = true
		if reserved: continue
		var density: float = .55+.25*sin(p.x*.83+sin(p.y*.65))
		if rng.randf() > density: continue
		var size: float = rng.randf_range(.3,.70)
		grasses.append(_transform(Vector3(p.x,.018,p.y),rng.randf()*TAU,Vector3(size,size,size)))
		grass_colors.append(Color(.80,.91,.74))
	_batch(root,"CurvingGrassDrifts",_grass_mesh(),green,grasses,grass_colors)
	var ferns: Array[Transform3D] = []
	var fern_colors: Array[Color] = []
	var flowers: Array[Transform3D] = []
	var flower_colors: Array[Color] = []
	var beds: Array[Vector2] = [Vector2(146.0,-10.4),Vector2(146.7,-4.9),Vector2(145.5,3.5),Vector2(147.3,12.7),Vector2(162.8,-12.8),Vector2(165.9,-6.8),Vector2(167.8,5.9),Vector2(165.8,12.5)]
	for bed: Vector2 in beds:
		for i: int in range(4):
			var p: Vector2 = bed + Vector2(cos(i*2.4),sin(i*2.4))*rng.randf_range(0.3,0.85)
			if _clear(p,0.85):
				var size: float = rng.randf_range(0.62,0.95)
				ferns.append(_transform(Vector3(p.x,0.025,p.y),rng.randf()*TAU,Vector3.ONE*size))
				fern_colors.append(Color(0.68,0.91,0.62))
		for i: int in range(3):
			var p: Vector2 = bed + Vector2(0.7+i*0.33,-0.6+sin(i*1.9)*0.4)
			if _clear(p,0.55):
				flowers.append(_transform(Vector3(p.x,0.018,p.y),rng.randf()*TAU,Vector3.ONE*rng.randf_range(0.8,1.15)))
				flower_colors.append(Color.WHITE)
	_batch(root,"FeatheredGroundFerns",_fern_mesh(),green,ferns,fern_colors)
	_batch(root,"MeadowFlowerBouquets",_flower_mesh(),green,flowers,flower_colors)
	root.set_meta("budget", {"trees":5,"crown_leaves":leaves.size(),"grass_clumps":grasses.size(),"ferns":ferns.size(),"flower_bouquets":flowers.size(),"multimeshes":4,"materials":2,"collision_shapes":0})

static func _material() -> StandardMaterial3D:
	var m := StandardMaterial3D.new()
	m.vertex_color_use_as_albedo = true
	m.vertex_color_is_srgb = true
	m.albedo_color = Color("b0bbaa")
	m.roughness = 0.92
	m.cull_mode = BaseMaterial3D.CULL_DISABLED
	return m

static func _clear(p: Vector2, r: float) -> bool:
	if p.x-r < 144.0 or p.x+r > 175.5 or absf(p.y)+r > 15.6:
		return false
	# Conservative margins include geometry footprint, not just instance origin.
	for rect: Rect2 in [Rect2(155.7,-12.4,2.6,24.8),Rect2(150.2,6.7,5.1,5.1),Rect2(158.9,-10.3,2.2,17.6),Rect2(146.7,5.3,12.8,2.2)]:
		if rect.grow(r).has_point(p):
			return false
	return true

static func _transform(p: Vector3, yaw: float, size: Vector3) -> Transform3D:
	return Transform3D(Basis(Vector3.UP,yaw).scaled(size),p)

static func _tri(st: SurfaceTool, a: Vector3, b: Vector3, c: Vector3, ca: Color, cb: Color, cc: Color) -> void:
	st.set_color(ca)
	st.add_vertex(a)
	st.set_color(cb)
	st.add_vertex(b)
	st.set_color(cc)
	st.add_vertex(c)

static func _blade(st: SurfaceTool, base: Vector3, tip: Vector3, width: float, color: Color) -> void:
	var direction: Vector3 = tip-base
	var side: Vector3 = direction.cross(Vector3.UP).normalized()
	if side.length_squared()<0.1:
		side = Vector3.RIGHT
	var left: Vector3 = base+direction*0.43+side*width
	var right: Vector3 = base+direction*0.43-side*width
	var ridge: Vector3 = base+direction*0.48+Vector3.UP*width*0.35
	var dark: Color = color.darkened(0.26)
	var light: Color = color.lightened(0.16)
	_tri(st,base,left,ridge,dark,color,light)
	_tri(st,left,tip,ridge,color,light,light)
	_tri(st,base,ridge,right,dark,light,color.darkened(0.08))
	_tri(st,ridge,tip,right,light,light,color.darkened(0.08))

static func _tube(st: SurfaceTool, a: Vector3, b: Vector3, r0: float, r1: float, color: Color, sides: int = 7) -> void:
	var axis: Vector3 = (b-a).normalized()
	var u: Vector3 = axis.cross(Vector3.FORWARD).normalized()
	if u.length_squared()<0.1:
		u = Vector3.RIGHT
	var v: Vector3 = axis.cross(u).normalized()
	for i: int in range(sides):
		var ang: float = TAU*float(i)/float(sides)
		var next: float = TAU*float(i+1)/float(sides)
		var d: Vector3 = u*cos(ang)+v*sin(ang)
		var e: Vector3 = u*cos(next)+v*sin(next)
		var tint: Color = color.lightened(0.1*cos(ang))
		_tri(st,a+d*r0,b+d*r1,b+e*r1,tint,tint,tint)
		_tri(st,a+d*r0,b+e*r1,a+e*r0,tint,tint,tint)

static func _tree(st: SurfaceTool, leaves: Array[Transform3D], colors: Array[Color], origin: Vector3, size: float, yaw: float, rng: RandomNumberGenerator) -> void:
	var lean := Vector3(0.24,0,0.12)
	var joints: Array[Vector3] = [origin,origin+Vector3(-0.09,1.05,0.04)*size,origin+(Vector3(0,2.15,0)+lean)*size,origin+(Vector3(0.08,3.15,-0.1)+lean)*size,origin+Vector3(0.4,4.15,0.12)*size]
	for i: int in range(4):
		_tube(st,joints[i],joints[i+1],(0.24-i*0.044)*size,(0.20-i*0.045)*size,Color("795438"),9)
	for i: int in range(5):
		var a: float = yaw+i*TAU/5.0
		_tube(st,origin+Vector3(cos(a)*0.65,0.025,sin(a)*0.65)*size,joints[1],0.06*size,0.15*size,Color("6e5034"))
	# Staggered scaffold branches and visibly forked secondary twigs.
	for i: int in range(11):
		var a: float = yaw+float(i)*2.39996
		var tier: float = float(i%4)
		var start: Vector3 = origin+Vector3(0.16,2.05+tier*0.43,0.06)*size
		var reach: float = (1.65-tier*0.17)*size
		var horizontal := Vector3(cos(a),0,sin(a))
		# Western framing trees lean east so the canopy stays inside the site.
		if origin.x<146.0:
			horizontal.x = absf(horizontal.x)*0.95+0.1
		var elbow: Vector3 = start+horizontal*reach*0.62+Vector3.UP*0.48*size
		var end: Vector3 = start+horizontal*reach+Vector3.UP*(0.95+tier*0.13)*size
		_tube(st,start,elbow,0.115*size,0.068*size,Color("88603d"))
		_tube(st,elbow,end,0.068*size,0.021*size,Color("926a40"))
		for fork: int in range(3):
			var fa: float = a+(float(fork)-1.0)*0.9
			var center: Vector3 = end+Vector3(cos(fa)*0.52,0.18+fork*0.1,sin(fa)*0.52)*size
			_tube(st,elbow.lerp(end,0.7),center,0.033*size,0.008*size,Color("916b40"),5)
			for j: int in range(26):
				# Flattened sprays with airy gaps; no hidden spherical crown geometry.
				var angle: float = j*2.39996+fa
				var radius: float = sqrt(float(j)/26.0)*0.72*size
				var p: Vector3 = center+Vector3(cos(angle)*radius,rng.randf_range(-0.25,0.28)*size,sin(angle)*radius)
				if not _clear(Vector2(p.x,p.z),0.43*size):
					continue
				var basis: Basis = Basis(Vector3.UP,angle).rotated(Vector3.RIGHT,rng.randf_range(-0.65,0.65))
				leaves.append(Transform3D(basis.scaled(Vector3.ONE*rng.randf_range(0.75,1.2)*size),p))
				colors.append(Color.from_hsv(rng.randf_range(0.25,0.31),rng.randf_range(0.60,0.78),rng.randf_range(0.40,0.70)))

static func _leaf_mesh() -> ArrayMesh:
	var st := SurfaceTool.new()
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	_blade(st,Vector3(-0.19,0,0),Vector3(0.36,0.07,0),0.145,Color.WHITE)
	st.generate_normals()
	return st.commit()

static func _grass_mesh() -> ArrayMesh:
	var st := SurfaceTool.new()
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	for i: int in range(9):
		var a: float = i*2.39996
		var h: float = 0.16+0.14*(0.5+0.5*sin(i*4.1))
		var d := Vector3(cos(a),0,sin(a))
		_blade(st,d*0.035,d*(0.16+0.05*sin(i))+Vector3.UP*h,0.035,Color("99bd51"))
	st.generate_normals()
	return st.commit()

static func _fern_mesh() -> ArrayMesh:
	var st := SurfaceTool.new()
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	for i: int in range(7):
		var a: float = i*TAU/7.0
		var direction := Vector3(cos(a),0,sin(a))
		var side := Vector3(-sin(a),0,cos(a))
		var last := Vector3.ZERO
		for j: int in range(1,8):
			var t: float = j/7.0
			var p: Vector3 = direction*t*0.75+Vector3.UP*sin(t*2.0)*0.49
			_tube(st,last,p,0.009,0.005,Color("7caa43"),3)
			var length: float = sin(t*PI)*0.22+0.025
			for sign_value: float in [-1.0,1.0]:
				_blade(st,p,p+side*sign_value*length+direction*0.14+Vector3.UP*0.035,0.042*(1.0-t*0.55),Color("559745"))
			last=p
	st.generate_normals()
	return st.commit()

static func _flower_mesh() -> ArrayMesh:
	var st := SurfaceTool.new()
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	for i: int in range(5):
		var a: float = i*2.39996
		var base := Vector3(cos(a)*0.19,0,sin(a)*0.19)
		var top: Vector3 = base+Vector3(0.04*cos(a),0.27+i*0.047,0.04*sin(a))
		_tube(st,base,top,0.008,0.006,Color("5f913c"),4)
		_blade(st,base.lerp(top,0.4),base+Vector3(cos(a)*0.19,0.24,sin(a)*0.19),0.043,Color("6f9d41"))
		for j: int in range(6):
			var angle: float = j*TAU/6.0
			var tip: Vector3 = top+Vector3(cos(angle)*0.12,0.028,sin(angle)*0.12)
			_blade(st,top,tip,0.047,Color("fff3cf") if i%2==0 else Color("f3c957"))
		_tube(st,top,top+Vector3.UP*0.028,0.033,0.022,Color("cc8b27"),6)
	st.generate_normals()
	return st.commit()

static func _batch(root: Node3D, label: String, mesh: ArrayMesh, material: Material, transforms: Array[Transform3D], colors: Array[Color]) -> void:
	var mm := MultiMesh.new()
	mm.transform_format = MultiMesh.TRANSFORM_3D
	mm.use_colors = true
	mm.mesh = mesh
	mm.instance_count = transforms.size()
	for i: int in range(transforms.size()):
		mm.set_instance_transform(i,transforms[i])
		mm.set_instance_color(i,colors[i])
	var node := MultiMeshInstance3D.new()
	node.name=label
	node.multimesh=mm
	node.material_override=material
	# Tiny ground blades need no individual dynamic shadow contribution.
	if label=="CurvingGrassDrifts" or label=="MeadowFlowerBouquets":
		node.cast_shadow=GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	root.add_child(node)
