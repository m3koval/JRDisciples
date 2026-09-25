extends SceneTree
var failures := 0
func check(value: bool, label: String) -> void:
	print("PASS " if value else "FAIL ",label)
	if not value: failures += 1
func _initialize() -> void: call_deferred("run")
func run() -> void:
	var world = load("res://scripts/world.gd").new()
	root.add_child(world)
	await process_frame
	var trees: Array[Node] = world.find_children("OpeningTree*", "Node3D", false, false)
	check(trees.size() >= 6, "Opening uses authored branching trees, not orb crowns")
	var total_leaves := 0
	for tree in trees:
		var leaves = tree.get_node("CrownLeaves")
		var trunk = tree.get_node("BranchingTrunk")
		check(leaves.multimesh.instance_count >= 700, "Readable individual leaf sprays")
		total_leaves += leaves.multimesh.instance_count
		check(trunk.mesh is ArrayMesh, "Tapered forked trunk is actual mesh")
		check(tree.find_children("*", "CollisionShape3D", true, false).is_empty(), "Presentation does not duplicate collision")
		for i in range(leaves.multimesh.instance_count):
			var box: AABB = leaves.multimesh.get_instance_transform(i) * leaves.multimesh.mesh.get_aabb()
			if box.position.x < -2.05 or box.end.x > 2.05 or box.position.z < -1.75 or box.end.z > 1.75:
				check(false, "Canopy violates preserved cottage clearance envelope")
				break
		var material: StandardMaterial3D = leaves.material_override
		check(material.transparency == BaseMaterial3D.TRANSPARENCY_DISABLED, "Opaque leaves avoid alpha overdraw")
	check(total_leaves > 0 and total_leaves <= 20000, "Finite whole-opening leaf budget")
	var colliders := 0
	for child in world.get_children():
		if child is StaticBody3D and child.get_child(0) is CollisionShape3D and is_equal_approx(child.get_child(0).shape.size.x, .65):
			colliders += 1
			check(is_equal_approx(child.get_child(0).shape.size.z, .65), "Accepted trunk collision width preserved")
	check(colliders == trees.size(), "Exactly one existing collider per tree")
	print("OPENING_FOLIAGE_FAILURES=", failures)
	world.free()
	quit(1 if failures else 0)
