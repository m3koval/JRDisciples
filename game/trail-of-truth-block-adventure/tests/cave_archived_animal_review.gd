extends SceneTree
## Isolated archive rejection study. Never loaded by the campaign.
## Runtime GLTFDocument avoids editor-import races with concurrent workers.
var output := "/tmp/apex-cave-animal-review"
var world: Node3D
var report := {}
func _initialize() -> void:
    call_deferred("run")
func bounds(node: Node3D, parent_transform := Transform3D.IDENTITY) -> AABB:
    var result := AABB()
    var xf := parent_transform * node.transform
    if node is MeshInstance3D:
        result = xf * node.get_aabb()
    for child in node.get_children():
        if child is Node3D:
            var b := bounds(child, xf)
            if b.size != Vector3.ZERO:
                result = b if result.size == Vector3.ZERO else result.merge(b)
    return result
func vec(v: Vector3) -> Array:
    return [v.x,v.y,v.z]
func run() -> void:
    assert(DisplayServer.get_name() != "headless", "Native renderer required")
    DirAccess.make_dir_recursive_absolute(output)
    root.size = Vector2i(1100,650)
    world = Node3D.new()
    root.add_child(world)
    var env := WorldEnvironment.new()
    env.environment = Environment.new()
    env.environment.background_mode = Environment.BG_COLOR
    env.environment.background_color = Color("303b42")
    env.environment.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
    env.environment.ambient_light_color = Color("c2d7ea")
    env.environment.ambient_light_energy = .65
    world.add_child(env)
    var light := DirectionalLight3D.new()
    light.light_color = Color("ffe1b1")
    light.light_energy = 1.8
    light.rotation_degrees = Vector3(-48,-35,0)
    light.shadow_enabled = true
    world.add_child(light)
    var floor_mesh := MeshInstance3D.new()
    var plane := PlaneMesh.new()
    plane.size = Vector2(30,30)
    floor_mesh.mesh = plane
    var mat := StandardMaterial3D.new()
    mat.albedo_color = Color("665d4d")
    mat.roughness = 1
    floor_mesh.material_override = mat
    world.add_child(floor_mesh)
    var camera := Camera3D.new()
    world.add_child(camera)
    camera.position = Vector3(5.2,3.5,8.8)
    camera.look_at(Vector3(0,.75,0))
    camera.projection = Camera3D.PROJECTION_ORTHOGONAL
    camera.size = 7.4
    camera.current = true
    var layer := CanvasLayer.new()
    root.add_child(layer)
    var title := Label.new()
    title.position = Vector2(25,20)
    title.add_theme_font_size_override("font_size",25)
    layer.add_child(title)
    for species in ["lion","bear"]:
        var reference = load("res://scripts/cave_block_animal.gd").new()
        world.add_child(reference)
        reference.configure(species)
        var reference_bounds := bounds(reference)
        reference.position.x = -1.8
        var doc := GLTFDocument.new()
        var state := GLTFState.new()
        assert(doc.append_from_file("res://assets/caves/"+species+".glb",state) == OK)
        var imported := doc.generate_scene(state)
        assert(imported != null)
        var wrapper := Node3D.new()
        world.add_child(wrapper)
        wrapper.add_child(imported)
        var source := bounds(imported)
        # Diagnostic only: uniform height match, no distorted proportions.
        var factor := reference_bounds.size.y/source.size.y
        imported.scale *= factor
        var scaled := bounds(imported)
        imported.position -= Vector3(scaled.get_center().x,scaled.position.y,scaled.get_center().z)
        var normalized := bounds(imported)
        assert(absf(normalized.position.y) < .001)
        assert(absf(normalized.size.y-reference_bounds.size.y) < .001)
        wrapper.position.x = 1.8
        report[species] = {"source_bounds": {"min":vec(source.position),"size":vec(source.size)},"reference_bounds":{"min":vec(reference_bounds.position),"size":vec(reference_bounds.size)},"height_matched_archive_bounds":{"min":vec(normalized.position),"size":vec(normalized.size)},"uniform_scale":factor,"skins":state.get_skins().size(),"animations":state.get_animations().size(),"recommendation":"REJECT: monolithic static mesh cannot preserve articulated motion interface"}
        assert(state.get_skins().size() == 0)
        assert(state.get_animations().size() == 0)
        title.text = species.to_upper()+"  |  existing articulated rig (left) / archived static mesh (right)\nHeight matched; grounded; same lighting. Archive NOT integrated."
        for view in ["three_quarter","front"]:
            camera.position = Vector3(5.2,3.5,8.8) if view == "three_quarter" else Vector3(0,2.3,10)
            camera.look_at(Vector3(0,.75,0))
            await process_frame
            await RenderingServer.frame_post_draw
            assert(root.get_texture().get_image().save_png(output+"/"+species+"_"+view+".png") == OK)
        reference.free()
        wrapper.free()
    var file := FileAccess.open(output+"/bounds.json",FileAccess.WRITE)
    file.store_string(JSON.stringify(report,"  "))
    print("ARCHIVED_ANIMAL_REVIEW_PASS ",JSON.stringify(report))
    quit(0)
