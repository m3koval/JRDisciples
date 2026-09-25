extends SceneTree
const Art = preload("res://scripts/cave_botanical_art.gd")
func _initialize() -> void:
    var holder := Node3D.new()
    root.add_child(holder)
    var art := Art.build(holder,[Vector3(88,0,0),Vector3(100,0,0),Vector3(112,0,0)])
    assert(art.get_meta("art_only"))
    assert(art.get_child_count() == 4)
    var triangles := 0
    for node in art.get_children():
        assert(node is MeshInstance3D)
        var a: Array = node.mesh.surface_get_arrays(0)
        var vertices: PackedVector3Array = a[Mesh.ARRAY_VERTEX]
        triangles += (a[Mesh.ARRAY_INDEX] as PackedInt32Array).size()/3
        for v in vertices:
            assert(v.is_finite())
            for x in [88.0,100.0,112.0]:
                assert(not (absf(v.x-x) < 1.8 and v.y < 3.4 and absf(v.z) < 1.5),"entry corridor preserved")
        for n in a[Mesh.ARRAY_NORMAL]: assert(n.is_finite() and n.length() > .95)
    assert(triangles < 30000)
    print("CAVE_BOTANICAL_ART_PASS triangles=",triangles," four batched materials; no added colliders")
    holder.free()
    quit(0)
