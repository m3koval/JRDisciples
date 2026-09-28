extends SceneTree
## Six sparse studio captures. Presentation-only, NOT gameplay/device evidence.
## xvfb-run -a godot --path <project> --rendering-method gl_compatibility --script res://tests/cave_animal_anatomy_review.gd
func _initialize() -> void: call_deferred("run")
func run() -> void:
    if DisplayServer.get_name() == "headless":
        print("ANATOMY_REVIEW_REQUIRES_NATIVE_RENDERER")
        quit(1)
        return
    root.size = Vector2i(640,440)
    var scene := Node3D.new()
    root.add_child(scene)
    var env := WorldEnvironment.new()
    env.environment = Environment.new()
    env.environment.background_mode = Environment.BG_COLOR
    env.environment.background_color = Color("303941")
    env.environment.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
    env.environment.ambient_light_color = Color("d9e4ef")
    env.environment.ambient_light_energy = .65
    scene.add_child(env)
    var sun := DirectionalLight3D.new()
    sun.rotation_degrees = Vector3(-40,-25,0)
    sun.light_energy = 1.7
    sun.shadow_enabled = true
    scene.add_child(sun)
    var floor_mesh := MeshInstance3D.new()
    var box := BoxMesh.new()
    box.size = Vector3(12,.1,12)
    floor_mesh.mesh = box
    floor_mesh.position.y = -.05
    var material := StandardMaterial3D.new()
    material.albedo_color = Color("747b74")
    material.roughness = 1
    floor_mesh.material_override = material
    scene.add_child(floor_mesh)
    var camera := Camera3D.new()
    camera.projection = Camera3D.PROJECTION_ORTHOGONAL
    camera.size = 3.5
    scene.add_child(camera)
    camera.current = true
    var animal = load("res://scripts/cave_block_animal.gd").new()
    scene.add_child(animal)
    var output := OS.get_environment("JD_ANATOMY_REVIEW_DIR")
    if output.is_empty(): output = "/tmp/jd-anatomy-review"
    DirAccess.make_dir_recursive_absolute(output)
    for species in ["lion","bear"]:
        animal.configure(species)
        for view in ["three_quarter","side","warning"]:
            animal.reset_pose()
            camera.position = Vector3(3,2.05,4) if view != "side" else Vector3(4,1.7,.1)
            camera.look_at(Vector3(0,.8,0))
            if view == "warning":
                for frame in range(40): animal.pose(1.0/60.0,"warn",.3,0)
            await process_frame
            await RenderingServer.frame_post_draw
            var path: String = output+"/"+species+"_"+view+".png"
            var error := root.get_texture().get_image().save_png(path)
            if error != OK:
                push_error("Failed capture: "+path)
                quit(1)
                return
            print("ANATOMY_CAPTURE ",path)
    print("ANATOMY_REVIEW_COMPLETE captures=6")
    quit(0)
