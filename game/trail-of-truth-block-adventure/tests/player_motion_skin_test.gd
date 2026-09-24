extends SceneTree
## Native synthetic input/skin regression; not a WebView/device certification.
var failures := 0
var player
func _initialize() -> void:
	call_deferred("run")
func check(ok: bool, label: String) -> void:
	print(("PASS " if ok else "FAIL ") + label)
	if not ok: failures += 1
func run() -> void:
	player = load("res://scripts/player.gd").new()
	root.add_child(player)
	player.set_physics_process(false)
	player.set_process(false)
	player._yaw = 0.0
	player._look_pending = Vector2.ZERO
	player._rotate_camera(Vector2(120, 0), 0.005)
	var coalesced: float = player._look_pending.x
	player._look_pending = Vector2.ZERO
	for i in 6: player._rotate_camera(Vector2(20, 0), 0.005)
	check(is_equal_approx(coalesced, player._look_pending.x), "coalesced and split look deltas retain equal total rotation")
	player._camera_pivot.rotation.y = 0.0
	player._process(1.0 / 120.0)
	var first: float = player._camera_pivot.rotation.y
	player._process(1.0 / 120.0)
	check(first < 0.0 and player._camera_pivot.rotation.y < first, "look advances smoothly on render frames without a physics tick")
	player.set_enabled(false)
	var frozen: Transform3D = player._camera_pivot.transform
	player._process(0.3)
	check(player._camera_pivot.transform == frozen, "pause freezes render camera")
	player.set_enabled(true)
	var meshes: Array[Node] = player._visual.find_children("*", "MeshInstance3D", true, false)
	var mesh: MeshInstance3D = meshes[0]
	# The speculative runtime reweighting was rejected in visual QA. The safe
	# mitigation retains authored skin data and removes the extreme carry pose.
	var original = load("res://assets/michael.glb").instantiate()
	var source: MeshInstance3D = original.find_children("*", "MeshInstance3D", true, false)[0]
	check(mesh.mesh == source.mesh, "source mesh and skin data are preserved")
	original.free()
	player._input_scale = 2.0
	player._look_pending = Vector2.ZERO
	player._rotate_camera(Vector2(240, 0), .005)
	check(is_equal_approx(player._look_pending.x, coalesced), "DPR2 camera matches CSS displacement")
	player._refresh_joystick()
	check(player._joystick.scale == Vector2(2, 2), "DPR2 joystick retains CSS-sized visual")
	check((player._joystick.origin * 2).is_equal_approx(player._joystick_resting_origin()), "DPR2 visible and input joystick anchors agree")
	player._input_scale = 1.0
	var skeleton: Skeleton3D = player._visual.find_children("*", "Skeleton3D", true, false)[0]
	player.carrying = true
	skeleton.get_node("CarryPose")._process_modification()
	for surface in mesh.mesh.get_surface_count():
		var ar: Array = mesh.mesh.surface_get_arrays(surface)
		var vs: PackedVector3Array = ar[Mesh.ARRAY_VERTEX]
		var bs: PackedInt32Array = ar[Mesh.ARRAY_BONES]
		var ws: PackedFloat32Array = ar[Mesh.ARRAY_WEIGHTS]
		var indices: PackedInt32Array = ar[Mesh.ARRAY_INDEX]
		var posed := PackedVector3Array()
		for i in vs.size():
			var pos := Vector3.ZERO
			for slot in 4:
				var bind: int = bs[i * 4 + slot]
				var bone: int = skeleton.find_bone(mesh.skin.get_bind_name(bind))
				if bone < 0: bone = mesh.skin.get_bind_bone(bind)
				pos += (skeleton.get_bone_global_pose(bone) * mesh.skin.get_bind_pose(bind) * vs[i]) * ws[i * 4 + slot]
			posed.append(pos)
		var worst := 0.0
		var pair := Vector2i.ZERO
		for i in range(0, indices.size(), 3):
			for e in 3:
				var a := indices[i + e]
				var b := indices[i + (e + 1) % 3]
				var stretch: float = posed[a].distance_to(posed[b]) - vs[a].distance_to(vs[b])
				if stretch > worst:
					worst = stretch
					pair = Vector2i(a, b)
		check(worst < .10, "carry edge expansion bounded for " + mesh.mesh.surface_get_material(surface).resource_name)
		print("WORST ", mesh.mesh.surface_get_material(surface).resource_name, " ", worst, " rest=", vs[pair.x], " -> ", vs[pair.y], " weights=", bs.slice(pair.x * 4, pair.x * 4 + 4), " / ", bs.slice(pair.y * 4, pair.y * 4 + 4))
	print("PLAYER_MOTION_SKIN_FAILURES=", failures)
	quit(1 if failures else 0)
