extends RefCounted
## Opening-only presentation. Reuses accepted garden mesh primitives, never its layout.
## Opaque folded leaves and tapered forks replace three solid crown orbs.
## Existing world trunk colliders, cottage clearance and gameplay remain authoritative.
const Botany = preload("res://scripts/garden_foliage.gd")

static func build(parent: Node3D, at: Vector3, height: float, variant: int) -> void:
	var root := Node3D.new()
	root.name = "OpeningTree%d" % variant
	root.position = at
	parent.add_child(root)
	var wood := SurfaceTool.new()
	wood.begin(Mesh.PRIMITIVE_TRIANGLES)
	var rng := RandomNumberGenerator.new()
	rng.seed = 9461 + variant * 177
	var joints: Array[Vector3] = [Vector3.ZERO, Vector3(.04,height*.30,-.025),Vector3(-.03,height*.58,.04),Vector3(.06,height*.85,0),Vector3(.02,height+1.15,.02)]
	_trunk(wood, joints)
	var leaves: Array[Transform3D] = []
	var colors: Array[Color] = []
	var leaf_mesh := Botany._leaf_mesh()
	for i in range(14):
		var angle: float = variant*.71 + i*2.39996
		var tier: float = float(i%4)
		var start := Vector3(.02,height*.56+tier*.34,0)
		var direction := Vector3(cos(angle),0,sin(angle))
		var reach: float = 1.04-tier*.09
		var elbow: Vector3 = start+direction*reach*.57+Vector3.UP*.44
		var tip: Vector3 = start+direction*reach+Vector3.UP*(.84+tier*.26)
		Botany._tube(wood,start,elbow,.115,.062,Color("886141"),7)
		Botany._tube(wood,elbow,tip,.062,.016,Color("987247"),7)
		for fork in range(3):
			var fa: float = angle+(fork-1)*.9
			var center: Vector3 = tip+Vector3(cos(fa)*.25,.14+fork*.12,sin(fa)*.22)
			Botany._tube(wood,elbow.lerp(tip,.7),center,.03,.006,Color("947044"),5)
			for j in range(32):
				var a: float = j*2.39996+fa
				var radius: float = sqrt(float(j)/32.0)*.53
				var pos: Vector3 = center+Vector3(cos(a)*radius,rng.randf_range(-.20,.24),sin(a)*radius)
				var basis := Basis(Vector3.UP,a).rotated(Vector3.RIGHT,rng.randf_range(-.65,.65)).scaled(Vector3.ONE*rng.randf_range(.78,1.12))
				var transform := Transform3D(basis,pos)
				var bounds: AABB = transform*leaf_mesh.get_aabb()
				# True geometry, not just origins, must fit the existing cottage envelope.
				if bounds.position.x < -2.05 or bounds.end.x > 2.05 or bounds.position.z < -1.75 or bounds.end.z > 1.75: continue
				leaves.append(transform)
				colors.append(Color.from_hsv(rng.randf_range(.235,.285),rng.randf_range(.53,.70),rng.randf_range(.48,.77)))
	wood.generate_normals()
	var trunk := MeshInstance3D.new()
	trunk.name = "BranchingTrunk"
	trunk.mesh = wood.commit()
	trunk.material_override = Botany._material()
	root.add_child(trunk)
	Botany._batch(root,"CrownLeaves",leaf_mesh,Botany._material(),leaves,colors)
	root.set_meta("leaf_count",leaves.size())

static func _trunk(st: SurfaceTool, joints: Array[Vector3]) -> void:
	# Identical rings shared by adjacent sections: no open angled tube seams.
	var radii: Array[float] = [.32,.23,.17,.10,.018]
	for tier in range(4):
		for side in range(10):
			var a: float = side*TAU/10.0
			var b: float = (side+1)*TAU/10.0
			var u := Vector3(cos(a),0,sin(a))
			var v := Vector3(cos(b),0,sin(b))
			var low_a: Vector3 = joints[tier]+u*radii[tier]
			var low_b: Vector3 = joints[tier]+v*radii[tier]
			var high_a: Vector3 = joints[tier+1]+u*radii[tier+1]
			var high_b: Vector3 = joints[tier+1]+v*radii[tier+1]
			var color := Color("826044").lightened(.06*cos(a*3))
			Botany._tri(st,low_a,high_a,high_b,color,color,color)
			Botany._tri(st,low_a,high_b,low_b,color,color,color)
