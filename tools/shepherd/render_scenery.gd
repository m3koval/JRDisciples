extends SceneTree
## Reproducible transparent portraits of already licensed Trail scenery.
## This authoring tool does not modify the Trail game or its export.
func _initialize() -> void:
    run.call_deferred()

func run() -> void:
    var output := OS.get_environment("SHEPHERD_SCENERY_DIR")
    if output.is_empty():
        quit(1)
        return
    DirAccess.make_dir_recursive_absolute(output)
    var viewport := SubViewport.new()
    viewport.size = Vector2i(256, 256)
    viewport.transparent_bg = true
    viewport.own_world_3d = true
    viewport.render_target_update_mode = SubViewport.UPDATE_ALWAYS
    root.add_child(viewport)
    var world := Node3D.new()
    viewport.add_child(world)
    var environment := WorldEnvironment.new()
    var env := Environment.new()
    env.background_mode = Environment.BG_CLEAR_COLOR
    env.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
    env.ambient_light_color = Color("fff1d8")
    env.ambient_light_energy = .55
    env.tonemap_mode = Environment.TONE_MAPPER_FILMIC
    environment.environment = env
    world.add_child(environment)
    var key := DirectionalLight3D.new()
    key.rotation_degrees = Vector3(-45, -30, 0)
    key.light_energy = .9
    world.add_child(key)
    var camera := Camera3D.new()
    camera.projection = Camera3D.PROJECTION_ORTHOGONAL
    world.add_child(camera)
    var sources := {
        "bush": "res://assets/environment/plant_bushDetailed.glb",
        "flowers": "res://assets/environment/flower_yellowC.glb",
        "rock": "res://assets/scans/rock_moss_b.glb",
        "tree": "original-rounded-tree",
    }
    for name in sources:
        var model: Node3D = rounded_tree() if name == "tree" else load(sources[name]).instantiate()
        world.add_child(model)
        var meshes := model.find_children("*", "MeshInstance3D", true, false)
        var bounds := AABB()
        var first := true
        for mesh: MeshInstance3D in meshes:
            var box: AABB = mesh.global_transform * mesh.get_aabb()
            bounds = box if first else bounds.merge(box)
            first = false
        if first:
            push_error("Empty scenery: " + name)
            quit(1)
            return
        var span: float = max(bounds.size.x, max(bounds.size.y, bounds.size.z))
        var center := bounds.get_center()
        camera.size = span * 1.65
        camera.position = center + Vector3(0, span * 2, span * 3)
        camera.look_at(center)
        await process_frame
        await RenderingServer.frame_post_draw
        var error := viewport.get_texture().get_image().save_png(output.path_join(name + ".png"))
        if error != OK:
            quit(1)
            return
        model.queue_free()
        await process_frame
    print("OWNED_SCENERY_RENDERED 4")
    quit(0)

func rounded_tree() -> Node3D:
    var tree := Node3D.new()
    var trunk := MeshInstance3D.new()
    var wood := CylinderMesh.new()
    wood.bottom_radius = .18
    wood.top_radius = .1
    wood.height = 1.6
    trunk.mesh = wood
    var bark := StandardMaterial3D.new()
    bark.albedo_color = Color("6e5035")
    trunk.material_override = bark
    trunk.position.y = .8
    tree.add_child(trunk)
    var crowns := [Vector3(-.45, 1.6, .1), Vector3(.5, 1.75, .1), Vector3(0, 2.1, -.25), Vector3(-.05, 2.45, 0)]
    for index in range(crowns.size()):
        var crown := MeshInstance3D.new()
        var mesh := SphereMesh.new()
        mesh.radius = .8 if index < 3 else .63
        mesh.height = mesh.radius * 1.6
        crown.mesh = mesh
        crown.position = crowns[index]
        var leaves := StandardMaterial3D.new()
        leaves.albedo_color = Color("547642").lerp(Color("83a65a"), float(index) / 4)
        leaves.roughness = .95
        crown.material_override = leaves
        tree.add_child(crown)
    return tree

