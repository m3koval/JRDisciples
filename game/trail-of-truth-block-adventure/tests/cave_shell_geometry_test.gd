extends SceneTree
## Standalone native art proof; no scans/import/main scene dependency.
const Shell = preload("res://scripts/cave_shell_art.gd")
var checks := 0
func check(ok: bool, label: String) -> void:
    if not ok:
        push_error(label)
        quit(1)
        assert(ok, label)
    checks += 1
func _initialize() -> void:
    var holder := Node3D.new()
    root.add_child(holder)
    var mat := StandardMaterial3D.new()
    var total_triangles := 0
    for variant in range(3):
        var cave := Shell.build(holder,Vector3(88+variant*12,0,0),mat,mat,variant)
        check(cave.get_child_count() == 6,"six authored stone/atmosphere meshes")
        for i in range(Shell.DEPTHS.size()):
            var p := Shell.profile(i,variant)
            check(p[3].x <= -1.8 and p[9].x >= 1.8,"doorway width preserved")
            for k in range(4,9): check(p[k].y >= 3.4,"head clearance")
            if i >= 3:
                check(p[2].x <= -3.8 and p[10].x >= 3.8,"combat floor clear")
        for node in cave.get_children():
            check(node is MeshInstance3D,"art does not add gameplay colliders")
            var a: Array = node.mesh.surface_get_arrays(0)
            var verts: PackedVector3Array = a[Mesh.ARRAY_VERTEX]
            var normals: PackedVector3Array = a[Mesh.ARRAY_NORMAL]
            var indices: PackedInt32Array = a[Mesh.ARRAY_INDEX]
            total_triangles += indices.size()/3
            if node.name in ["ContinuousInwardStoneVault", "FracturedOverhangAndMouth"]:
                for x in [-1.4, 0.0, 1.4]:
                    for y in [.35, 1.7, 3.35]:
                        var hits := 0
                        for t in range(0,indices.size(),3):
                            var hit: Variant = Geometry3D.segment_intersects_triangle(Vector3(x,y,2),Vector3(x,y,-12),verts[indices[t]],verts[indices[t+1]],verts[indices[t+2]])
                            if hit != null: hits += 1
                        check(hits == 0,"entrance-to-arena art path unobstructed")
            for n in normals: check(n.is_finite() and n.length() > .95,"finite unit normals")
            if node.name == "ContinuousInwardStoneVault":
                for v in range(verts.size()):
                    var expected := Vector3(-verts[v].x,1.6-verts[v].y,0)
                    check(normals[v].dot(expected) > 0,"vault normals face playable interior")
            if node.name == "ClosedWeatheredBackFace":
                for n in normals: check(n.z > 0,"back face faces entrance")
                check(node.mesh.get_aabb().position.z < -13.4,"back face closes full depth")
    check(total_triangles < 1800,"mobile geometry budget")
    print("CAVE_SHELL_GEOMETRY_PASS checks=",checks," triangles=",total_triangles," caves=3")
    holder.free()
    quit(0)
