extends Node3D
## Hand-built clearing. Public mutations are safe both before and after _ready.
## All dimensions use feet-origin ground Y=0; water deliberately has no collider.

const VillageFinish = preload("res://assets/environment/village_finish.gd")

var _bridge_stage: int = 0
var _camp_restored: bool = false
var _panels: Array[Node3D] = []
var _panel_shapes: Array[CollisionShape3D] = []
var _reward: Node3D
var _materials: Dictionary = {}
var _batches: Dictionary = {}
var _banner: Node3D
var _banner_material: StandardMaterial3D
var _banner_color := ""

func _ready() -> void:
	_make_palette()
	_make_lighting()
	_make_land()
	_make_bridge()
	_make_camp()
	_make_trees_and_landmarks()
	VillageFinish.setup(self)
	_flush_batches()
	set_bridge_stage(_bridge_stage)
	set_camp_restored(_camp_restored)
	set_camp_banner(_banner_color)

func set_bridge_stage(stage: int) -> void:
	_bridge_stage = clampi(stage, 0, 2)
	for i: int in range(_panels.size()):
		_panels[i].visible = i < _bridge_stage
		_panel_shapes[i].set_deferred("disabled", i >= _bridge_stage)

func set_camp_restored(value: bool) -> void:
	_camp_restored = value
	if is_instance_valid(_reward):
		_reward.visible = value
	if is_instance_valid(_banner):
		_banner.visible = value and not _banner_color.is_empty()

func set_camp_banner(color_id: String) -> void:
	var colors := {"gold": Color("efbc51"), "blue": Color("448cb8"), "green": Color("58915c")}
	_banner_color = color_id if colors.has(color_id) else ""
	if is_instance_valid(_banner):
		_banner.visible = _camp_restored and not _banner_color.is_empty()
		if not _banner_color.is_empty():
			_banner_material.albedo_color = colors[_banner_color]

func _make_palette() -> void:
	var colors: Dictionary = {
		"grass": Color("78945d"), "grass_light": Color("90aa6c"),
		"earth": Color("806347"), "earth_light": Color("a0835c"),
		"stone": Color("8c9182"), "stone_light": Color("afb2a0"),
		"path": Color("c4ae7e"), "wood": Color("765037"),
		"plank": Color("c99a5c"), "plank_light": Color("e0b777"),
		"leaf": Color("547d51"), "leaf_light": Color("719257"),
		"pine": Color("426c57"), "water": Color("559dba"),
		"water_light": Color("92c5cb"), "cloth": Color("e8d3a0"),
		"roof": Color("9f6848"), "hay": Color("d8b95e"),
		"flower": Color("edbe77"), "hill": Color("72866f")
	}
	for key: String in colors:
		var material: StandardMaterial3D = StandardMaterial3D.new()
		material.albedo_color = colors[key]
		material.roughness = 0.9
		_materials[key] = material
	var glow: StandardMaterial3D = StandardMaterial3D.new()
	glow.albedo_color = Color("ffd48a")
	glow.emission_enabled = true
	glow.emission = Color("ffb956")
	glow.emission_energy_multiplier = 1.1
	_materials["glow"] = glow
	_materials["path"] = VillageFinish.path_material()
	_materials["grass"] = VillageFinish.ground_material(Color("91a673"))
	_materials["grass_light"] = VillageFinish.ground_material(Color("a2b47a"))

func _make_lighting() -> void:
	var environment: WorldEnvironment = WorldEnvironment.new()
	var settings: Environment = Environment.new()
	settings.background_mode = Environment.BG_COLOR
	settings.background_color = Color("b8d4d1")
	settings.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	settings.ambient_light_color = Color("dce6f0")
	settings.ambient_light_energy = 0.35
	settings.tonemap_mode = Environment.TONE_MAPPER_FILMIC
	settings.tonemap_exposure = 0.7
	environment.environment = settings
	add_child(environment)
	var sun: DirectionalLight3D = DirectionalLight3D.new()
	sun.name = "LateAfternoonSun"
	sun.rotation_degrees = Vector3(-48.0, -32.0, 0.0)
	sun.light_color = Color("fff2df")
	sun.light_energy = 0.65
	sun.shadow_enabled = true
	sun.directional_shadow_max_distance = 65.0
	add_child(sun)

func _make_land() -> void:
	# Bank slabs end exactly at the contract river edge, with no spanning shape.
	_solid("LeftBank", Vector3(-9.65, -1.5, 0), Vector3(24.7, 3, 34), "earth")
	_solid("RightBank", Vector3(15.15, -1.5, 0), Vector3(15.7, 3, 34), "earth")
	_block(Vector3(-9.65, -0.04, 0), Vector3(24.7, 0.08, 34), "grass")
	_block(Vector3(15.15, -0.04, 0), Vector3(15.7, 0.08, 34), "grass_light")
	_block(Vector3(5, -0.72, 0), Vector3(4.6, 0.08, 38), "water")
	# Pale broken ripples are deliberately flat, opaque, shader-free decorations.
	for i: int in range(24):
		var z: float = -17.5 + float(i) * 1.5
		var x: float = 3.5 + float(i % 3) * 1.1
		_block(Vector3(x, -0.671, z), Vector3(0.65, 0.015, 0.08), "water_light")
	# Broad contiguous paths make both bridge approaches visually obvious.
	_block(Vector3(-3.2, 0.006, 0), Vector3(11.8, 0.012, 3.6), "path")
	_block(Vector3(10.2, 0.006, 0), Vector3(5.8, 0.012, 3.6), "path")
	_block(Vector3(-10.5, 0.006, 3.6), Vector3(3.6, 0.012, 9), "path")
	_block(Vector3(13.3, 0.006, -3.2), Vector3(3, 0.012, 6.6), "path")
	# Optional seed terrace: two visible step surfaces leading to Y=1.
	_solid("SeedTerrace", Vector3(-13, 0.5, -10), Vector3(5.5, 1, 4.5), "earth_light")
	_block(Vector3(-13, 0.99, -10), Vector3(5.5, 0.02, 4.5), "grass_light")
	_solid("TerraceFirstStep", Vector3(-13, 0.225, -6.65), Vector3(3.4, 0.45, 1.1), "stone")
	_solid("TerraceSecondStep", Vector3(-13, 0.4, -7.45), Vector3(3.4, 0.8, 0.5), "stone_light")
	# Low block cliffs are visible physical limits, tall enough to retain jumpers.
	_solid("WestCliff", Vector3(-23, 1.7, 0), Vector3(2, 5.4, 36), "earth")
	_solid("EastCliff", Vector3(24, 1.7, 0), Vector3(2, 5.4, 36), "earth")
	_solid("NorthCliff", Vector3(0.5, 1.7, -18), Vector3(49, 5.4, 2), "earth")
	_solid("SouthCliff", Vector3(0.5, 1.7, 18), Vector3(49, 5.4, 2), "earth")
	# Chunked caps and layered distant hills keep the clearing from reading as a slab.
	for i: int in range(10):
		var x: float = -22.0 + float(i) * 5.0
		var h: float = 1.4 + float(i % 3) * 0.65
		VillageFinish.rounded(self,Vector3(x,2.0,-20.8),Vector3(9,h+6,9),Color("82996d"))
		VillageFinish.rounded(self,Vector3(x,2.0,21.8),Vector3(9,h+6,9),Color("8a9e71"))
		VillageFinish.rounded(self,Vector3(x,3,-28),Vector3(14,h+11,12),Color("718f7c"))
	for z: float in [-14.0, -7.0, 0.0, 7.0, 14.0]:
		VillageFinish.rounded(self,Vector3(-24.5,1.5,z),Vector3(7,7,10),Color("859b70"))
		VillageFinish.rounded(self,Vector3(25.5,1.5,z),Vector3(7,7,10),Color("859b70"))
	# Stepped exposed riverbank stone, outside the crossing corridor.
	for z: float in [-14.0, -10.0, -6.0, 6.0, 10.0, 14.0]:
		_block(Vector3(2.65, -0.35, z), Vector3(0.35, 0.55, 2.7), "stone")
		_block(Vector3(7.35, -0.4, z + 0.5), Vector3(0.35, 0.45, 2.1), "stone_light")

func _make_bridge() -> void:
	for i: int in range(2):
		var panel: Node3D = Node3D.new()
		panel.name = "BridgePanel%d" % (i + 1)
		add_child(panel)
		_panels.append(panel)
		var x: float = 3.85 + float(i) * 2.3
		var body: StaticBody3D = StaticBody3D.new()
		panel.add_child(body)
		var shape: CollisionShape3D = CollisionShape3D.new()
		var box: BoxShape3D = BoxShape3D.new()
		box.size = Vector3(2.3, 0.22, 2.0)
		shape.shape = box
		shape.position = Vector3(x, -0.11, 0)
		shape.disabled = true
		body.add_child(shape)
		_panel_shapes.append(shape)
		# Fine plank seams are visual only: a single flush collider cannot snag feet.
		for plank: int in range(6):
			var px: float = x - 1.15 + (float(plank) + 0.5) * 2.3 / 6.0
			_mesh(panel, Vector3(px, -0.11, 0), Vector3(2.3 / 6.0 - 0.012, 0.22, 2), "plank_light" if plank % 2 == 0 else "plank")
		for z: float in [-.8, .8]:
			_mesh(panel, Vector3(x, -0.27, z), Vector3(2.3, 0.16, 0.18), "wood")
	# Existing abutments mark the task, but do not reach across the water.
	for x: float in [2.45, 7.55]:
		for z: float in [-1.25, 1.25]:
			_solid("BridgeMarker", Vector3(x, 0.4, z), Vector3(0.35, 0.8, 0.35), "wood")
			_block(Vector3(x, 0.83, z), Vector3(0.44, 0.12, 0.44), "plank_light")

func _make_camp() -> void:
	# Open-front shelter behind the spawn; camp return radius stays unobstructed.
	for x: float in [-13.2, -8.8]:
		for z: float in [10.3, 13.5]:
			_solid("ShelterPost", Vector3(x, 1.5, z), Vector3(0.25, 3, 0.25), "wood")
	_solid("ShelterRoof", Vector3(-11, 3.2, 11.9), Vector3(5.2, 0.3, 4.2), "roof")
	VillageFinish.place(self,"Roof_RoundTiles_8x8.gltf",Vector3(-11,3.8,11.9),Vector3(0.65,0.45,0.53))
	_block(Vector3(-11, 0.018, 11.7), Vector3(4.4, 0.035, 3.2), "path")
	_solid("CampBench", Vector3(-8.7, 0.3, 8.8), Vector3(2, 0.6, 0.7), "wood")
	_block(Vector3(-8.7, 0.62, 8.8), Vector3(2.15, 0.12, 0.8), "plank")
	# A stone hearth stays on the far side of camp, not under spawn.
	for i: int in range(8):
		var angle: float = float(i) * TAU / 8.0
		_block(Vector3(-6.7 + cos(angle) * 0.7, 0.13, 11.7 + sin(angle) * 0.7), Vector3(0.4, 0.26, 0.4), "stone")
	_block(Vector3(-6.7, 0.15, 11.7), Vector3(0.9, 0.3, 0.22), "wood")
	_reward = Node3D.new()
	_reward.name = "RestoredCampReward"
	add_child(_reward)
	_mesh(_reward, Vector3(-12, 0.13, 11.8), Vector3(1.8, 0.26, 1.3), "hay")
	_mesh(_reward, Vector3(-12, 0.28, 11.85), Vector3(1.5, 0.08, 0.9), "cloth")
	for x: float in [-12.6, -9.4]:
		_mesh(_reward, Vector3(x, 2.7, 10.3), Vector3(0.08, 0.65, 0.08), "wood")
		_mesh(_reward, Vector3(x, 2.3, 10.3), Vector3(0.28, 0.38, 0.28), "glow")
		_mesh(_reward, Vector3(x, 2.53, 10.3), Vector3(0.38, 0.08, 0.38), "wood")
	var lantern: OmniLight3D = OmniLight3D.new()
	lantern.position = Vector3(-11, 2.1, 11)
	lantern.light_color = Color("ffca78")
	lantern.light_energy = 1.5
	lantern.omni_range = 5.0
	lantern.shadow_enabled = false
	_reward.add_child(lantern)
	_mesh(_reward, Vector3(-6.7, 0.43, 11.7), Vector3(0.32, 0.45, 0.32), "glow")
	# Earned, child-selected home marker; no collision in the return corridor.
	_banner = Node3D.new()
	_banner.name = "EarnedCampBanner"
	add_child(_banner)
	_mesh(_banner, Vector3(-7.6, 1.8, 9.8), Vector3(.10, 3.6, .10), "wood")
	_mesh(_banner, Vector3(-6.95, 3.42, 9.8), Vector3(1.4, .08, .10), "wood")
	_banner_material = StandardMaterial3D.new()
	_banner_material.roughness = .9
	_banner_material.cull_mode = BaseMaterial3D.CULL_DISABLED
	var cloth := MeshInstance3D.new()
	var cloth_mesh := BoxMesh.new()
	cloth_mesh.size = Vector3(1.2, 1.35, .035)
	cloth.mesh = cloth_mesh
	cloth.material_override = _banner_material
	cloth.position = Vector3(-6.95, 2.72, 9.8)
	_banner.add_child(cloth)
	# Reuse the accepted lamb model as the flock awaiting its missing member.
	for at in [Vector3(-12.4, .02, 11), Vector3(-10.6, .02, 12.5)]:
		var friend: Node3D = preload("res://assets/lamb.glb").instantiate()
		friend.position = at
		friend.scale = Vector3.ONE * .8
		friend.rotation.y = .5 if at.x < -12 else -.7
		add_child(friend)

func _make_trees_and_landmarks() -> void:
	var positions: Array[Vector3] = [
		Vector3(-19, 0, -13), Vector3(-18, 0, -8), Vector3(-20, 0, 0),
		Vector3(-19, 0, 6), Vector3(-18.8, 0, 13.8), Vector3(-4, 0, 13),
		Vector3(-2, 0, -12), Vector3(-6, 0, -14), Vector3(10, 0, -13),
		Vector3(18, 0, -12.8), Vector3(20, 0, -7), Vector3(20.5, 0, 1),
		Vector3(20.5, 0, 12), Vector3(13, 0, 13.5)
	]
	for i: int in range(positions.size()):
		var p: Vector3 = positions[i]
		var h: float = 3.1 + float(i % 3) * 0.4
		_solid("TreeTrunk", p + Vector3(0, h * 0.5, 0), Vector3(0.65, h, 0.65), "wood")
		VillageFinish.rounded(self,p + Vector3(0,h+0.25,0),Vector3(3.5,2.9,3.3),Color("638755"))
		VillageFinish.rounded(self,p + Vector3(-0.85,h+0.6,0.4),Vector3(2.4,2.2,2.6),Color("87a25d"))
		VillageFinish.rounded(self,p + Vector3(0.85,h+0.35,-0.5),Vector3(2.4,2.2,2.5),Color("74944e"))
		# Grouped understory, never random clutter across the walking routes.
		VillageFinish.place(self,"plant_bushDetailed.glb",p + Vector3(1.3,0,0.8),Vector3.ONE * 0.8)
	# The trail bends around this outcrop into the lamb's sheltered alcove.
	_solid("MeadowRock", Vector3(17.6, 1.1, -9), Vector3(2.6, 2.2, 2.0), "stone")
	VillageFinish.rounded(self, Vector3(17.6, 1.1, -9), Vector3(3, 2.6, 2.5), Color("92988a"))
	for i: int in range(12):
		var x: float = 10.5 + float(i % 6) * 1.0
		var z: float = -9.6 - float(i / 6) * 0.7
		VillageFinish.place(self,"flower_yellowC.glb", Vector3(x,0,z),Vector3.ONE * 1.6)
	# Warm garden bed beside, not on top of, the optional seed at (-17,10).
	_block(Vector3(-16.8, 0.025, 12.4), Vector3(2.4, 0.05, 1.5), "earth_light")
	for x: float in [-17.5, -16.8, -16.1]:
		_block(Vector3(x, 0.13, 12.4), Vector3(0.35, 0.26, 0.5), "leaf_light")

func _solid(label: String, center: Vector3, size: Vector3, material_key: String) -> void:
	if label not in ["WestCliff", "EastCliff", "NorthCliff", "SouthCliff", "ShelterRoof", "MeadowRock"]:
		# Grass caps used to share the exact earth top plane: visible z-fighting.
		# Recess only the brown render mesh, keeping collision ground unchanged.
		var inset: float = .08 if label in ["LeftBank", "RightBank"] else (.02 if label == "SeedTerrace" else 0.0)
		_block(center - Vector3(0, inset * .5, 0), size - Vector3(0, inset, 0), material_key)
	var body: StaticBody3D = StaticBody3D.new()
	body.name = label
	body.position = center
	var collision: CollisionShape3D = CollisionShape3D.new()
	var shape: BoxShape3D = BoxShape3D.new()
	shape.size = size
	collision.shape = shape
	body.add_child(collision)
	add_child(body)

func _block(center: Vector3, size: Vector3, material_key: String) -> void:
	if not _batches.has(material_key):
		_batches[material_key] = []
	var transforms: Array = _batches[material_key]
	transforms.append(Transform3D(Basis.from_scale(size), center))

func _flush_batches() -> void:
	for key: String in _batches:
		var transforms: Array = _batches[key]
		var cube: BoxMesh = BoxMesh.new()
		cube.size = Vector3.ONE
		cube.material = _materials[key]
		var batch: MultiMesh = MultiMesh.new()
		batch.transform_format = MultiMesh.TRANSFORM_3D
		batch.mesh = cube
		batch.instance_count = transforms.size()
		for i: int in range(transforms.size()):
			batch.set_instance_transform(i, transforms[i])
		var instance: MultiMeshInstance3D = MultiMeshInstance3D.new()
		instance.name = "Blocks_" + key
		instance.multimesh = batch
		add_child(instance)
	_batches.clear()

func _mesh(parent: Node3D, center: Vector3, size: Vector3, material_key: String) -> void:
	var cube: BoxMesh = BoxMesh.new()
	cube.size = size
	cube.material = _materials[material_key]
	var instance: MeshInstance3D = MeshInstance3D.new()
	instance.mesh = cube
	instance.position = center
	parent.add_child(instance)
