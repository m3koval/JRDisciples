extends SceneTree
## Offline 2D derivatives of the owned Trail models; does not modify engine sources.
var output := OS.get_environment("SHEPHERD_SPRITE_DIR")
func _initialize() -> void:
    run.call_deferred()
func run() -> void:
    if output.is_empty():
        push_error("SHEPHERD_SPRITE_DIR is required")
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
    var env_node := WorldEnvironment.new()
    var env := Environment.new()
    env.background_mode = Environment.BG_CLEAR_COLOR
    env.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
    env.ambient_light_color = Color("fff1d8")
    env.ambient_light_energy = .4
    env.tonemap_mode = Environment.TONE_MAPPER_FILMIC
    env_node.environment = env
    world.add_child(env_node)
    var key := DirectionalLight3D.new()
    key.rotation_degrees = Vector3(-45, -30, 0)
    key.light_energy = .85
    world.add_child(key)
    var fill := DirectionalLight3D.new()
    fill.rotation_degrees = Vector3(-25, 140, 0)
    fill.light_energy = .5
    world.add_child(fill)
    var camera := Camera3D.new()
    camera.projection = Camera3D.PROJECTION_ORTHOGONAL
    camera.size = 1.95
    world.add_child(camera)
    camera.position = Vector3(0, 2.6, 5)
    camera.look_at(Vector3(0, .7, 0))
    for actor in ["michael", "lamb"]:
        var model: Node3D = load("res://assets/" + actor + ".glb").instantiate()
        world.add_child(model)
        var animations := model.find_children("*", "AnimationPlayer", true, false)
        var animation: AnimationPlayer = animations[0] if not animations.is_empty() else null
        var run_name := ""
        var idle_name := ""
        if animation:
            print(actor, " animations: ", animation.get_animation_list())
            for clip in animation.get_animation_list():
                if String(clip).to_lower().contains("run"): run_name = clip
                if String(clip).to_lower().contains("idle"): idle_name = clip
        if actor == "lamb":
            camera.size = 1.9
            camera.position = Vector3(0, 2.5, 5)
            camera.look_at(Vector3(0, .45, 0))
        for direction in range(4):
            model.rotation.y = direction * PI / 2
            for frame in range(9):
                if animation and not run_name.is_empty():
                    var clip_name := idle_name if frame == 0 else run_name
                    animation.play(clip_name)
                    animation.seek(0 if frame == 0 else animation.get_animation(clip_name).length * (frame - 1) / 8.0, true)
                    animation.pause()
                elif actor == "lamb":
                    var leg_names := ["FrontL", "HindR", "FrontR", "HindL"]
                    for i in range(4):
                        var leg := model.find_child(leg_names[i], true, false) as Node3D
                        if leg: leg.rotation.x = 0 if frame == 0 else sin((frame - 1) * TAU / 8 + (0 if i < 2 else PI)) * .23
                await process_frame
                await RenderingServer.frame_post_draw
                var error := viewport.get_texture().get_image().save_png(output.path_join("%s-%d-%d.png" % [actor, direction, frame]))
                if error != OK:
                    push_error("Could not save sprite")
                    quit(1)
                    return
        model.queue_free()
        await process_frame
    print("OWNED_SPRITES_RENDERED 72")
    quit(0)
