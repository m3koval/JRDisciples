extends SceneTree
## Deterministic native-rendered animation study, not device/input evidence.
func _initialize() -> void: call_deferred("run")
func run() -> void:
    if DisplayServer.get_name() == "headless":
        push_error("Run this fixture with a native renderer")
        quit(1)
        return
    root.size = Vector2i(640,400)
    var output := "/tmp/jd-animal-animation-review"
    DirAccess.make_dir_recursive_absolute(output)
    var game = load("res://scripts/main.gd").new()
    root.add_child(game)
    game.set_process(false)
    game.set_physics_process(false)
    game.player.set_physics_process(false)
    game.player.hide()
    game.hud.hide()
    var c = game.caves
    c.active = true
    c.restore()
    c.lamb.hide()
    for sign in c.signs: sign.hide()
    c.get_node("CampSign").hide()
    var camera := Camera3D.new()
    game.add_child(camera)
    camera.position = Vector3(105,3.3,7)
    camera.look_at(Vector3(100,.8,1))
    camera.fov = 45
    camera.current = true
    var layer := CanvasLayer.new()
    root.add_child(layer)
    var label := Label.new()
    label.position = Vector2(18,14)
    label.add_theme_font_size_override("font_size",23)
    label.add_theme_color_override("font_outline_color",Color.BLACK)
    label.add_theme_constant_override("outline_size",5)
    layer.add_child(label)
    var frame := 0
    for index in range(2):
        c.animals[1-index].hide()
        var actor: Node3D = c.animals[index]
        actor.show()
        actor.position = Vector3(100,0,0)
        var motion = c.animal_motion[index]
        motion.reset_pose()
        for sequence in [["idle",.7],["warn",1.6],["lunge",.7],["recover",1.4],["retreat",1.2],["idle",.7]]:
            var state: String = sequence[0]
            var duration: float = sequence[1]
            var count := roundi(duration*30)
            for n in range(count):
                var progress := float(n+1)/count
                var remaining := duration*(1.0-progress)
                var direction := Vector3.BACK
                if state == "lunge": actor.position.z = 3*smoothstep(0,1,progress)
                if state == "retreat":
                    actor.position.z = 3*(1.0-smoothstep(0,1,progress))
                    direction = Vector3.FORWARD
                motion.step(1.0/30,state,remaining,direction)
                label.text = ("LION" if index == 0 else "BEAR")+" · "+state.to_upper()+"\nNative animation study · unrigged source mesh"
                await process_frame
                await RenderingServer.frame_post_draw
                root.get_texture().get_image().save_png(output+"/frame%04d.png"%frame)
                frame += 1
    print("ANIMATION_PREVIEW_FRAMES=",frame)
    quit(0)
