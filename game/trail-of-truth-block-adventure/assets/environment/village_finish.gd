extends RefCounted
## CC0 scenic assets plus walk-in cottage interiors (doors, furniture).
const BASE := "res://assets/environment/"

static func place(parent: Node3D, file: String, pos: Vector3, size: Vector3 = Vector3.ONE, yaw: float = 0.0) -> Node3D:
	var node := (load(BASE + file) as PackedScene).instantiate() as Node3D
	node.position = pos
	node.scale = size
	node.rotation_degrees.y = yaw
	parent.add_child(node)
	return node

# Walls and furniture block the player (layer 2) but not the camera arm while
# the player is indoors, so the camera can lift above the walls.
const INTERIOR_LAYER := 2
const DOOR_HINGE := Vector3(-1.55, 0, 4.12)
const DOOR_SIZE := Vector3(1.12, 2.35, 0.14)
const WOOD := Color("7a5236")
const DARK_WOOD := Color("4e3322")
const STONE := Color("8e8a80")
const CLOTH := Color("d9c9a3")
const MADDER := Color("9a3b28")
const INDIGO := Color("3f4f7a")
const CLAY := Color("b26b45")
const BREAD := Color("c98a3e")

static func cottage(host: Node3D, pos: Vector3, yaw: float, size: float, style: String) -> Node3D:
	var house := Node3D.new()
	house.name = "TimberPlasterCottage"
	house.set_meta("scenery_kind", "cottage")
	host.add_child(house)
	house.position = pos
	house.rotation_degrees.y = yaw
	house.scale = Vector3.ONE * size
	for i in range(4):
		var offset := -3.0 + float(i) * 2.0
		place(house, "Wall_Plaster_" + ("Door_Round" if i == 1 else "Window_Wide_Round") + ".gltf", Vector3(offset,0,4))
		place(house,"Wall_Plaster_Straight.gltf",Vector3(offset,0,-4),Vector3.ONE,180)
		place(house,"Wall_Plaster_Window_Wide_Round.gltf",Vector3(-4,0,offset),Vector3.ONE,-90)
		place(house,"Wall_Plaster_Straight.gltf",Vector3(4,0,offset),Vector3.ONE,90)
	# Walk-in walls: the doorway collision gap is a little wider than the frame so
	# a joystick-steered player slides through instead of snagging.
	for wall in [[Vector3(0, 1.6, -4.1), Vector3(8.4, 3.2, 0.4)], [Vector3(-4.1, 1.6, 0), Vector3(0.4, 3.2, 8.4)],
			[Vector3(4.1, 1.6, 0), Vector3(0.4, 3.2, 8.4)], [Vector3(-2.975, 1.6, 4.1), Vector3(2.45, 3.2, 0.4)],
			[Vector3(1.95, 1.6, 4.1), Vector3(4.5, 3.2, 0.4)]]:
		_collider(house, wall[0], wall[1])
	# Plank floor over the grass inside; the ground below stays the physics floor.
	_prop(house, Vector3(0, 0.02, 0), Vector3(7.6, 0.04, 7.6), WOOD)
	# The door swings on a pivot at its hinge; its collider moves with it.
	var pivot := Node3D.new()
	pivot.name = "DoorPivot"
	pivot.position = DOOR_HINGE
	house.add_child(pivot)
	place(pivot, "Door_1_Round.gltf", Vector3.ZERO)
	var door_body := _collider(pivot, Vector3(DOOR_SIZE.x * 0.5, DOOR_SIZE.y * 0.5, 0), DOOR_SIZE)
	house.set_meta("door_pivot", pivot)
	house.set_meta("door_body", door_body)
	house.set_meta("door_open", false)
	var roof: Array[Node3D] = []
	roof.append(place(house,"Roof_Front_Brick8.gltf",Vector3(0,3.12,4.02)))
	roof.append(place(house,"Roof_Front_Brick8.gltf",Vector3(0,3.12,-4.02),Vector3.ONE,180))
	roof.append(place(house,"Roof_RoundTiles_8x8.gltf",Vector3(0,3.92,0)))
	roof.append(place(house,"Prop_Chimney.gltf",Vector3(2.35,4.25,-0.7)))
	house.set_meta("roof", roof)
	if style == "home":
		_furnish_home(house)
	elif style == "bakery":
		_furnish_bakery(house)
	return house

static func is_inside(house: Node3D, world_pos: Vector3) -> bool:
	var local := house.to_local(world_pos)
	return absf(local.x) < 3.8 and absf(local.z) < 3.9

static func door_point(house: Node3D) -> Vector3:
	# Center of the doorway, used for proximity and tap targeting.
	return house.to_global(DOOR_HINGE + Vector3(DOOR_SIZE.x * 0.5, 1.1, 0))

static func set_door_open(house: Node3D, open: bool) -> void:
	house.set_meta("door_open", open)
	var body: StaticBody3D = house.get_meta("door_body")
	# Swing inward; the collider is off while open so the door never shoves the player.
	body.collision_layer = 0 if open else INTERIOR_LAYER
	var pivot: Node3D = house.get_meta("door_pivot")
	var tween := pivot.create_tween()
	tween.tween_property(pivot, "rotation_degrees:y", 95.0 if open else 0.0, 0.35).set_trans(Tween.TRANS_SINE)

static func set_roof_visible(house: Node3D, visible: bool) -> void:
	for node: Node3D in house.get_meta("roof"):
		node.visible = visible

static func _collider(parent: Node3D, center: Vector3, size: Vector3) -> StaticBody3D:
	var body := StaticBody3D.new()
	body.collision_layer = INTERIOR_LAYER
	body.collision_mask = 0
	var shape := CollisionShape3D.new()
	var box := BoxShape3D.new()
	box.size = size
	shape.shape = box
	body.position = center
	body.add_child(shape)
	parent.add_child(body)
	return body

static func _prop(parent: Node3D, center: Vector3, size: Vector3, color: Color, solid: bool = false) -> MeshInstance3D:
	var node := MeshInstance3D.new()
	var mesh := BoxMesh.new()
	mesh.size = size
	node.mesh = mesh
	node.material_override = _flat(color)
	node.position = center
	parent.add_child(node)
	if solid:
		_collider(parent, center, size)
	return node

static func _round(parent: Node3D, center: Vector3, radius: float, height: float, color: Color, sphere: bool = false) -> MeshInstance3D:
	var node := MeshInstance3D.new()
	var mesh: PrimitiveMesh
	if sphere:
		mesh = SphereMesh.new()
		mesh.radius = radius
		mesh.height = height
		mesh.radial_segments = 14
		mesh.rings = 7
	else:
		mesh = CylinderMesh.new()
		mesh.top_radius = radius
		mesh.bottom_radius = radius
		mesh.height = height
		mesh.radial_segments = 12
	node.mesh = mesh
	node.material_override = _flat(color)
	node.position = center
	parent.add_child(node)
	return node

static func _flat(color: Color) -> StandardMaterial3D:
	var m := StandardMaterial3D.new()
	m.albedo_color = color
	m.roughness = 0.9
	return m

static func _table(house: Node3D, center: Vector3, size: Vector2) -> void:
	# Top at ~1.1 local units (~0.7 m at cottage scale), four legs, one collider.
	_prop(house, center + Vector3(0, 1.08, 0), Vector3(size.x, 0.1, size.y), WOOD)
	for sx in [-1, 1]:
		for sz in [-1, 1]:
			_prop(house, center + Vector3(sx * (size.x * 0.5 - 0.12), 0.52, sz * (size.y * 0.5 - 0.12)), Vector3(0.12, 1.04, 0.12), DARK_WOOD)
	_collider(house, center + Vector3(0, 0.56, 0), Vector3(size.x, 1.12, size.y))

static func _ember_glow(house: Node3D, at: Vector3) -> void:
	var embers := _prop(house, at, Vector3(0.9, 0.14, 0.4), Color("ff8a3d"))
	embers.material_override.emission_enabled = true
	embers.material_override.emission = Color("ff7a2a")
	embers.material_override.emission_energy_multiplier = 1.6
	var light := OmniLight3D.new()
	light.light_color = Color("ffb070")
	light.light_energy = 1.4
	light.omni_range = 5.0
	light.position = at + Vector3(0, 0.6, 0.5)
	house.add_child(light)

static func _furnish_home(house: Node3D) -> void:
	# Keep the entry lane (x -2.2..0.1, z > 1.5) clear from the door.
	_prop(house, Vector3(-2.6, 0.55, -3.35), Vector3(1.8, 1.1, 0.9), STONE, true)  # hearth
	_prop(house, Vector3(-2.6, 2.0, -3.6), Vector3(1.3, 1.9, 0.5), STONE)        # chimney breast
	_ember_glow(house, Vector3(-2.6, 1.17, -3.05))
	_table(house, Vector3(1.4, 0, -0.9), Vector2(2.0, 1.1))
	for z in [-1.8, 0.0]:
		_prop(house, Vector3(1.4, 0.62, z), Vector3(1.8, 0.1, 0.42), WOOD, true)   # benches
	_prop(house, Vector3(2.75, 0.3, -2.4), Vector3(1.5, 0.6, 2.8), DARK_WOOD, true) # bed frame
	_prop(house, Vector3(2.75, 0.66, -2.05), Vector3(1.4, 0.14, 2.0), INDIGO)       # blanket
	_prop(house, Vector3(2.75, 0.7, -3.4), Vector3(1.0, 0.2, 0.5), CLOTH)          # pillow
	_prop(house, Vector3(-3.55, 1.3, 0.4), Vector3(0.4, 0.08, 1.8), WOOD)          # wall shelf
	_prop(house, Vector3(-3.55, 2.0, 0.4), Vector3(0.4, 0.08, 1.8), WOOD)
	for i in range(3):
		_round(house, Vector3(-3.55, 1.52, -0.25 + i * 0.6), 0.16, 0.36, CLAY)
		_round(house, Vector3(-3.55, 2.18, -0.1 + i * 0.5), 0.12, 0.28, CLOTH if i == 1 else CLAY)
	_prop(house, Vector3(-0.7, 0.05, -0.9), Vector3(2.2, 0.02, 1.6), MADDER)        # rug
	_round(house, Vector3(-3.25, 0.55, -1.7), 0.42, 1.1, WOOD)                      # barrel
	_collider(house, Vector3(-3.25, 0.55, -1.7), Vector3(0.84, 1.1, 0.84))

static func _furnish_bakery(house: Node3D) -> void:
	# Domed bread oven in the back corner, loaves on the table, flour stacked by the wall.
	_prop(house, Vector3(-2.4, 0.5, -2.7), Vector3(2.2, 1.0, 2.0), STONE, true)
	_round(house, Vector3(-2.4, 1.0, -2.7), 1.0, 1.7, CLAY, true)
	_prop(house, Vector3(-2.4, 1.25, -1.66), Vector3(0.7, 0.5, 0.1), Color("2b1d14"))  # oven mouth
	_ember_glow(house, Vector3(-2.4, 1.06, -1.72))
	_table(house, Vector3(1.8, 0, -2.3), Vector2(2.4, 1.2))
	for i in range(4):
		var loaf := _round(house, Vector3(1.0 + i * 0.52, 1.24, -2.3 + (0.2 if i % 2 == 0 else -0.2)), 0.22, 0.26, BREAD, true)
		loaf.scale = Vector3(1.3, 1.0, 0.9)
	for p in [Vector3(3.2, 0.45, 0.6), Vector3(3.25, 0.45, 1.4), Vector3(3.2, 1.2, 1.0)]:
		_prop(house, p, Vector3(0.7, 0.8, 0.7), CLOTH)                                 # flour sacks
	_collider(house, Vector3(3.2, 0.8, 1.0), Vector3(0.8, 1.6, 1.6))
	_prop(house, Vector3(3.55, 1.5, -1.2), Vector3(0.4, 0.08, 1.6), WOOD)              # bread shelf
	for i in range(3):
		_round(house, Vector3(3.55, 1.68, -1.7 + i * 0.5), 0.14, 0.22, BREAD, true)
	_round(house, Vector3(2.9, 0.55, 3.0), 0.42, 1.1, WOOD)                          # water barrel
	_collider(house, Vector3(2.9, 0.55, 3.0), Vector3(0.84, 1.1, 0.84))

static func setup(host: Node3D) -> void:
	# Two walk-in cottages frame the camp: a family home facing it and the bakery.
	host.cottages.append(cottage(host,Vector3(-17.8,0,4.3),90,0.68,"home"))
	host.cottages.append(cottage(host,Vector3(-6.5,0,-14.2),0,0.62,"bakery"))
	for x in [-14.7,-12.5,-10.3,-8.1]:
		place(host,"Prop_WoodenFence_Single.gltf",Vector3(x,0,14.3),Vector3.ONE * 0.8)
	for z in [10.5,12.6]:
		place(host,"Prop_WoodenFence_Single.gltf",Vector3(-14.7,0,z),Vector3.ONE * 0.8,90)
	for p in [Vector3(-15.8,0,7.5),Vector3(-15.8,0,1.0),Vector3(-4.2,0,-9.9),Vector3(-14.7,0,13.3)]:
		place(host,"plant_bushDetailed.glb",p,Vector3.ONE*1.0)
		place(host,"flower_yellowC.glb",p+Vector3(0.6,0,0.4),Vector3.ONE*0.8)

static func rounded(host: Node3D, pos: Vector3, size: Vector3, color: Color) -> void:
	var mesh := SphereMesh.new()
	mesh.radial_segments = 18
	mesh.rings = 10
	mesh.radius = 0.5
	mesh.height = 1.0
	var mat := StandardMaterial3D.new()
	mat.albedo_color = color
	mat.roughness = 1.0
	mesh.material = mat
	var node := MeshInstance3D.new()
	node.mesh = mesh
	node.position = pos
	node.scale = size
	host.add_child(node)

static func path_material() -> StandardMaterial3D:
	var mat := StandardMaterial3D.new()
	mat.albedo_texture = load(BASE + "cobble.png")
	mat.uv1_triplanar = true
	mat.uv1_world_triplanar = true
	mat.uv1_scale = Vector3.ONE * 0.5
	mat.roughness = 0.95
	return mat

static func ground_material(color: Color) -> StandardMaterial3D:
	var mat := StandardMaterial3D.new()
	mat.albedo_color = color
	# A single moderate-frequency noise layer reads as grass variation
	# without a flat wash. (A second multiplied "detail" layer was tried
	# here but two independently-seeded noise fields at different UV
	# scales beat against each other into a shimmering moiré pattern as
	# the camera moves — one layer avoids that interference entirely.)
	var noise := FastNoiseLite.new()
	noise.frequency = 0.12
	noise.fractal_octaves = 2
	var texture := NoiseTexture2D.new()
	texture.width = 256
	texture.height = 256
	texture.noise = noise
	texture.seamless = true
	var ramp := Gradient.new()
	ramp.set_color(0,Color(0.70,0.78,0.63))
	ramp.set_color(1,Color(0.87,0.91,0.79))
	texture.color_ramp = ramp
	mat.albedo_texture = texture
	mat.uv1_triplanar = true
	mat.uv1_world_triplanar = true
	mat.uv1_scale = Vector3.ONE * 0.25
	mat.roughness = 1.0
	return mat
