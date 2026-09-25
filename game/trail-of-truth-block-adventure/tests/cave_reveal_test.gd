extends SceneTree
var failures := 0
func check(ok: bool, label: String) -> void:
    print(("PASS " if ok else "FAIL ")+label)
    if not ok: failures += 1
func _initialize() -> void:
    var actor := Node3D.new()
    root.add_child(actor)
    var mesh := MeshInstance3D.new()
    mesh.mesh = BoxMesh.new()
    var shared := StandardMaterial3D.new()
    shared.albedo_color = Color(.8,.6,.3,1)
    mesh.material_override = shared
    actor.add_child(mesh)
    var fade = preload("res://scripts/cave_reveal.gd").new(actor)
    check(not actor.visible and fade.alpha == 0, "starts hidden without changing actor parent")
    check(fade.surfaces.size() == 1, "surface material copied")
    fade.update(true, 1.0/60.0)
    check(actor.visible and fade.alpha > 0 and fade.alpha < .1, "first frame gradual reveal")
    var mat := mesh.get_active_material(0) as BaseMaterial3D
    check(mat != shared and shared.albedo_color.a == 1, "shared source material untouched")
    check(mat.albedo_color.a > 0 and mat.albedo_color.a < .1, "actual copied material fades")
    fade.update(true,0)
    check(is_equal_approx(fade.alpha,.05), "paused clock does not advance reveal")
    fade.update(true,1)
    check(fade.alpha == 1 and mat.transparency == shared.transparency, "fully visible restores opaque original")
    fade.update(false,1.0/60.0,true)
    check(not actor.visible and fade.alpha == 0, "leaving hides contents immediately")
    actor.free()
    print("CAVE_REVEAL_FAILURES=",failures)
    quit(0 if failures == 0 else 1)
