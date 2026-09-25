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
    var landscape := world.get_node("OpeningLandscape")
    var cliff: MeshInstance3D = landscape.get_node("ContinuousEscarpment")
    var cliff_points: PackedVector3Array = cliff.mesh.surface_get_arrays(0)[Mesh.ARRAY_VERTEX]
    var outside := true
    for p in cliff_points:
        outside = outside and (p.x <= -21.999 or p.x >= 22.999 or absf(p.z) >= 16.999)
    check(outside, "scenic cliff relief stays outside walkable rectangle")
    check(cliff_points.size() < 9000, "continuous cliff bounded vertex budget")
    var fixture := Node3D.new()
    root.add_child(fixture)
    var rock = preload("res://scripts/opening_landscape.gd").rock(fixture,"NormalProbe",Vector3.ZERO,Vector3.ONE,7)
    var arrays: Array = rock.mesh.surface_get_arrays(0)
    var normals: PackedVector3Array = arrays[Mesh.ARRAY_NORMAL]
    var points: PackedVector3Array = arrays[Mesh.ARRAY_VERTEX]
    var cap_up := true
    var sides_out := true
    for i in range(points.size()):
        if i >= 192:
            cap_up = cap_up and normals[i].y > .5
        else:
            sides_out = sides_out and normals[i].dot(Vector3(points[i].x,0,points[i].z)) > 0.0
    check(cap_up, "rock cap normals face upward")
    check(sides_out, "rock side normals face outward")
    fixture.queue_free()
    print("OPENING_TERRAIN_FAILURES=", failures)
    quit(failures)
