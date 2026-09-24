extends SceneTree
func _initialize() -> void:
	call_deferred("run")
func run() -> void:
	var world = load("res://scripts/world.gd").new()
	root.add_child(world)
	await process_frame
	var houses: Array[Node] = []
	var trees: Array[Node] = []
	for child in world.get_children():
		if child.get_meta("scenery_kind", "") == "cottage": houses.append(child)
		if child is StaticBody3D:
			for shape in child.get_children():
				if shape is CollisionShape3D and shape.shape is BoxShape3D and is_equal_approx(shape.shape.size.x, .65): trees.append(child)
	var failed := false
	for house in houses:
		var bounds := AABB()
		var first := true
		for mesh in house.find_children("*", "MeshInstance3D", true, false):
			var box: AABB = mesh.global_transform * mesh.get_aabb()
			bounds = box if first else bounds.merge(box)
			first = false
		for tree in trees:
			# Full canopy envelope plus clearance, not merely the trunk collider.
			var p: Vector3 = tree.global_position
			var footprint := Rect2(Vector2(p.x-2.05,p.z-1.75),Vector2(4.1,3.5))
			var building := Rect2(Vector2(bounds.position.x,bounds.position.z),Vector2(bounds.size.x,bounds.size.z)).grow(.4)
			if footprint.intersects(building):
				print("FAIL tree ",p," intersects cottage ",house.position)
				failed = true
	if houses.size() != 2 or trees.size() < 6: failed = true
	print("SCENERY_CLEARANCE houses=",houses.size()," trees=",trees.size()," failed=",failed)
	world.free()
	quit(1 if failed else 0)
