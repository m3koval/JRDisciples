extends SceneTree
## Additive geometry checks: never replace the original opening assertions.
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, label: String) -> void:
    print(("PASS " if ok else "FAIL ")+label)
    if not ok: failures += 1
func run() -> void:
    var world = preload("res://scripts/world.gd").new()
    root.add_child(world)
    await physics_frame
    var meshes := world.get_node("OpeningRiverArt").find_children("BlendedBridgeApproach*", "MeshInstance3D", true, false)
    check(meshes.size() == 2, "two continuous bank surfaces")
    var vertices := 0
    for mesh: MeshInstance3D in meshes:
        var bounds: AABB = mesh.mesh.get_aabb()
        check(bounds.size.z >= 34.0, "surface reaches bank limits without interior rectangular cutoff")
        check(bounds.end.x <= 2.701 or bounds.position.x >= 7.299, "terrain never conceals missing bridge")
        check(is_equal_approx(bounds.position.y, .028) and bounds.size.y < .001, "walkable surface retains authoritative flat ground")
        vertices += mesh.mesh.get_surface_count() * mesh.mesh.surface_get_array_len(0)
    check(vertices < 27000, "opening terrain vertex budget")
    var art = preload("res://scripts/opening_river_art.gd")
    check(is_zero_approx(art._route_distance(Vector2(5,0),Vector2(-10.5,0),Vector2(13.3,0))), "bridge approach center stays on route")
    check(art._route_distance(Vector2(13.3,-10),Vector2(13.3,0),Vector2(13.3,-6.5)) > 3.0, "path ends instead of extending infinitely")
    for child in world.get_node("OpeningRiverArt").get_children():
        if child is MeshInstance3D and child.material_override is ShaderMaterial and child.material_override.shader.resource_path.ends_with("shore.gdshader"):
            var points: PackedVector3Array = child.mesh.surface_get_arrays(0)[Mesh.ARRAY_VERTEX]
            for point in points:
                if point.y > 0.0:
                    check(is_equal_approx(point.y,.028), "shore lip joins terrain without daylight gap")
                    break
    print("OPENING_TERRAIN_FAILURES=", failures)
    quit(failures)
