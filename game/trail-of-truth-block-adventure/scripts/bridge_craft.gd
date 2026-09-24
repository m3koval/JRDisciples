extends RefCounted
## Visual-only bank joinery. World coordinates; no ownership of host state.
## Broken members alone live under LeftBreak / RightBreak.

static func build(parent: Node3D) -> Node3D:
	var root := Node3D.new()
	root.name = "BridgeCraft"
	parent.add_child(root)
	var wood := _material(Color("786047"), 0.83, true)
	var fresh := _material(Color("9b805d"), 0.94, true)
	var stone := _material(Color("999486"), 0.96, false)
	var capstone := _material(Color("aaa494"), 0.91, false)
	var iron := _material(Color("373a37"), 0.57, false)
	iron.metallic = 0.72
	for side: int in range(2):
		var bank_x: float = 2.5 if side == 0 else 7.5
		var direction: float = 1.0 if side == 0 else -1.0
		var broken := Node3D.new()
		broken.name = "LeftBreak" if side == 0 else "RightBreak"
		root.add_child(broken)
		# Two staggered courses. Joints remain hairline, not separated toy blocks.
		for course: int in range(2):
			var cuts: Array = [-1.48, -0.55, 0.49, 1.48] if course == 0 else [-1.48, -0.95, 0.02, 0.96, 1.48]
			for j: int in range(cuts.size() - 1):
				var width: float = cuts[j + 1] - cuts[j] - 0.012
				var block := _member(root, "DressedBankStone", Vector3(bank_x, -0.55 + course * 0.28, (cuts[j] + cuts[j + 1]) * 0.5), Vector3(0.44, 0.274, width), 0.035, stone)
				block.rotation.x = 0.003 * sin(float(j * 4 + side))
		# Coping sits below the road, supporting all timber and marker feet.
		_member(root, "WornCoping", Vector3(bank_x, -0.075, 0), Vector3(0.44, 0.12, 2.96), 0.025, capstone)
		for z: float in [-1.25, 1.25]:
			var post_x: float = 2.45 if side == 0 else 7.55
			var post := _member(root, "MarkerTimber", Vector3(post_x, 0.4, z), Vector3(0.8, 0.35, 0.35), 0.034, wood)
			post.rotation.z = PI * 0.5
			_member(root, "WeatheredPostCap", Vector3(post_x, 0.83, z), Vector3(0.44, 0.12, 0.44), 0.034, wood)
			# One seated forged pin on the riverward face, not decorative studs.
			var pin := MeshInstance3D.new()
			var cylinder := CylinderMesh.new()
			cylinder.top_radius = 0.026
			cylinder.bottom_radius = 0.029
			cylinder.height = 0.014
			cylinder.radial_segments = 12
			pin.mesh = cylinder
			pin.material_override = iron
			pin.position = Vector3(post_x + direction * 0.176, 0.48, z)
			pin.rotation.z = PI * 0.5
			root.add_child(pin)
		# Longitudinal stringers: embedded tails, progressively torn tips.
		for j: int in range(2):
			var z: float = -0.8 if j == 0 else 0.8
			var beam := _member(broken, "TornStringer", Vector3(bank_x + direction * 0.15, -0.235, z), Vector3(0.76, 0.18, 0.20), 0.019, wood, fresh, j + side * 3 + 1)
			if side == 1:
				beam.rotation.y = PI
		# Short surviving deck fingers form a ragged bank edge, never a span.
		for j: int in range(7):
			var length: float = 0.49 + 0.06 * sin(float(j * 7 + side * 3))
			var plank := _member(broken, "SplitDeckEnd", Vector3(bank_x + direction * 0.07, -0.065, -0.87 + j * 0.29), Vector3(length, 0.105, 0.277), 0.012, wood, fresh, j + 11 + side * 9)
			if side == 1:
				plank.rotation.y = PI
	return root

static func _material(color: Color, roughness: float, grain: bool) -> StandardMaterial3D:
	var mat := StandardMaterial3D.new()
	mat.albedo_color = color
	mat.roughness = roughness
	mat.cull_mode = BaseMaterial3D.CULL_DISABLED
	var noise := FastNoiseLite.new()
	noise.seed = 739 if grain else 193
	noise.noise_type = FastNoiseLite.TYPE_SIMPLEX_SMOOTH
	noise.frequency = 0.035 if grain else 0.12
	var image := Image.create(256, 128, false, Image.FORMAT_RGB8)
	for y: int in range(128):
		for x: int in range(256):
			# UV.x follows each timber's length, including the upright posts.
			var n: float = noise.get_noise_2d(float(x) * (0.13 if grain else 1.0), float(y) * (3.8 if grain else 1.0))
			var value: float = 0.87 + n * (0.19 if grain else 0.085)
			image.set_pixel(x, y, Color(value, value, value))
	image.generate_mipmaps()
	mat.albedo_texture = ImageTexture.create_from_image(image)
	mat.texture_filter = BaseMaterial3D.TEXTURE_FILTER_LINEAR_WITH_MIPMAPS
	return mat

# Rounded rectangular section with six samples per quarter; beveled end rings.
# Torn end uses an inset jagged ring and a separately shaded end-grain cap.
static func _member(parent: Node3D, label: String, position: Vector3, size: Vector3, radius: float, material: Material, end_material: Material = null, tear: int = 0) -> MeshInstance3D:
	var section: Array[Vector2] = []
	for corner: int in range(4):
		var angle: float = float(corner) * PI * 0.5
		var cy: float = (size.y * 0.5 - radius) * (1.0 if corner == 0 or corner == 3 else -1.0)
		var cz: float = (size.z * 0.5 - radius) * (1.0 if corner < 2 else -1.0)
		for step: int in range(7):
			var a: float = angle + float(step) / 6.0 * PI * 0.5
			section.append(Vector2(cy + cos(a) * radius, cz + sin(a) * radius))
	var rings: Array[PackedVector3Array] = []
	for ring: int in range(4):
		var points := PackedVector3Array()
		for i: int in range(section.size()):
			var p: Vector2 = section[i]
			var x: float = -size.x * 0.5
			if ring == 1:
				x += radius
			elif ring == 2:
				x = size.x * 0.5 - radius - (0.11 if tear > 0 else 0.0)
			elif ring == 3:
				x = size.x * 0.5
				if tear > 0:
					x -= 0.025 + 0.10 * (0.5 + 0.5 * sin(float(i * 13 + tear * 17)))
			if ring == 0 or ring == 3:
				p *= 0.94 if tear > 0 and ring == 3 else 0.88
			points.append(Vector3(x, p.x, p.y))
		rings.append(points)
	var st := SurfaceTool.new()
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	st.set_smooth_group(0)
	for ring: int in range(3):
		for i: int in range(section.size()):
			var next: int = (i + 1) % section.size()
			_quad(st, rings[ring][i], rings[ring + 1][i], rings[ring + 1][next], rings[ring][next], float(i) / section.size(), float(i + 1) / section.size(), size.x)
	st.generate_normals()
	st.set_material(material)
	var mesh: ArrayMesh = st.commit()
	st = SurfaceTool.new()
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	for end: int in [0, 3]:
		var center := Vector3.ZERO
		for p: Vector3 in rings[end]:
			center += p
		center /= float(section.size())
		for i: int in range(section.size()):
			var a: Vector3 = rings[end][i]
			var b: Vector3 = rings[end][(i + 1) % section.size()]
			for p: Vector3 in ([center, b, a] if end == 3 else [center, a, b]):
				st.set_uv(Vector2(p.y * 3.0, p.z * 3.0))
				st.add_vertex(p)
	st.generate_normals()
	st.set_material(end_material if end_material != null else material)
	st.commit(mesh)
	var instance := MeshInstance3D.new()
	instance.name = label
	instance.mesh = mesh
	instance.position = position
	parent.add_child(instance)
	return instance

static func _quad(st: SurfaceTool, a: Vector3, b: Vector3, c: Vector3, d: Vector3, v0: float, v1: float, length: float) -> void:
	var vertices: Array[Vector3] = [a, b, c, a, c, d]
	var vs: Array[float] = [v0, v0, v1, v0, v1, v1]
	for i: int in range(6):
		st.set_uv(Vector2(vertices[i].x / length + 0.5, vs[i]))
		st.add_vertex(vertices[i])
