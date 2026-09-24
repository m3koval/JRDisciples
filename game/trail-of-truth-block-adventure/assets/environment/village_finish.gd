extends RefCounted
## CC0 scenic assets only. No changes to collision or quest authority.
const BASE := "res://assets/environment/"

static func place(parent: Node3D, file: String, pos: Vector3, size: Vector3 = Vector3.ONE, yaw: float = 0.0) -> Node3D:
	var node := (load(BASE + file) as PackedScene).instantiate() as Node3D
	node.position = pos
	node.scale = size
	node.rotation_degrees.y = yaw
	parent.add_child(node)
	return node

static func cottage(host: Node3D, pos: Vector3, yaw: float, size: float) -> void:
	var house := Node3D.new()
	house.name = "TimberPlasterCottage"
	house.set_meta("scenery_kind", "cottage")
	host.add_child(house)
	house.position = pos
	house.rotation_degrees.y = yaw
	house.scale = Vector3.ONE * size
	var body := StaticBody3D.new()
	var collision := CollisionShape3D.new()
	var shape := BoxShape3D.new()
	shape.size = Vector3(8, 3.2, 8)
	collision.shape = shape
	collision.position.y = 1.6
	body.add_child(collision)
	house.add_child(body)
	for i in range(4):
		var offset := -3.0 + float(i) * 2.0
		place(house, "Wall_Plaster_" + ("Door_Round" if i == 1 else "Window_Wide_Round") + ".gltf", Vector3(offset,0,4))
		place(house,"Wall_Plaster_Straight.gltf",Vector3(offset,0,-4),Vector3.ONE,180)
		place(house,"Wall_Plaster_Window_Wide_Round.gltf",Vector3(-4,0,offset),Vector3.ONE,-90)
		place(house,"Wall_Plaster_Straight.gltf",Vector3(4,0,offset),Vector3.ONE,90)
	place(house,"Door_1_Round.gltf",Vector3(-1.55,0,4.12))
	place(house,"Roof_Front_Brick8.gltf",Vector3(0,3.12,4.02))
	place(house,"Roof_Front_Brick8.gltf",Vector3(0,3.12,-4.02),Vector3.ONE,180)
	place(house,"Roof_RoundTiles_8x8.gltf",Vector3(0,3.92,0))
	place(house,"Prop_Chimney.gltf",Vector3(2.35,4.25,-0.7))

static func setup(host: Node3D) -> void:
	# Cottage facades and sheepfold frame the existing shelter; front remains open.
	cottage(host,Vector3(-17.8,0,4.3),90,0.68)
	cottage(host,Vector3(-6.5,0,-14.2),0,0.62)
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
