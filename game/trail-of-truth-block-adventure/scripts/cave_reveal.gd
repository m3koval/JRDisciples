extends RefCounted
## Instance-local material fade for Compatibility rendering. Never modifies
## imported shared materials or the actor's authoritative defeated/visible state.
var target: Node3D
var alpha := 0.0
var surfaces: Array[Dictionary] = []

func _init(node: Node3D) -> void:
    target = node
    _collect(node)
    _apply()

func _collect(node: Node) -> void:
    if node is MeshInstance3D:
        var mesh_node := node as MeshInstance3D
        if mesh_node.mesh:
            for i in range(mesh_node.mesh.get_surface_count()):
                var original := mesh_node.get_active_material(i)
                if original is BaseMaterial3D:
                    var material := original.duplicate() as BaseMaterial3D
                    # Mesh override has precedence over surface overrides.
                    # Procedural actors use a single override; copy per surface.
                    surfaces.append({"material": material, "color": material.albedo_color,
                        "mode": material.transparency})
                    mesh_node.set_surface_override_material(i, material)
            if mesh_node.material_override is BaseMaterial3D:
                mesh_node.material_override = null
    for child in node.get_children():
        _collect(child)

func update(revealed: bool, delta: float, immediate: bool = false) -> void:
    var goal := 1.0 if revealed else 0.0
    alpha = goal if immediate else move_toward(alpha, goal, maxf(delta,0.0)*3.0)
    _apply()

func _apply() -> void:
    target.visible = alpha > .001
    for surface in surfaces:
        var material: BaseMaterial3D = surface.material
        var color: Color = surface.color
        color.a *= alpha
        material.albedo_color = color
        material.transparency = surface.mode if alpha >= .999 else BaseMaterial3D.TRANSPARENCY_ALPHA
