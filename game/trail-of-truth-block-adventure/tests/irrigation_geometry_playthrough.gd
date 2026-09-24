extends "res://tests/irrigation_construction_playthrough.gd"
## All chapter travel uses real input after prerequisite entry fixture.
func use_at(at: Vector3) -> void:
    game.player._yaw = 0
    var target := at+Vector3(0,0,.9)
    if at == c.GARDENER:
        check(await walk(Vector3(148,0,5),.3),"route around Mira collider")
        target = at+Vector3(-1.2,0,0)
    check(await walk(target,.28),"routed walk to "+str(at))
    game._refresh_ui()
    var before := 0.0
    if at == c.FEED:
        before = c.gates[1].get_child(0).position.y
        await gate_capture("closed")
    await action()
    if game.paused: game.primary.pressed.emit()
    if at == c.FEED:
        check(not is_equal_approx(before,c.gates[1].get_child(0).position.y),"host action lifts actual inlet board")
        await gate_capture("open")

func gate_capture(state: String) -> void:
    if DisplayServer.get_name() == "headless": return
    game.player.get_camera().current = true
    # Look along the approach toward the gate so its handle/opening stay in portrait.
    game.player._yaw = -1.02
    game.player._pitch = -.45
    for shape in [Vector2i(1280,720),Vector2i(720,1280)]:
        root.size = shape
        RenderingServer.render_loop_enabled = true
        for n in range(15): await process_frame
        await RenderingServer.frame_post_draw
        var path := "/tmp/jd-visual-manual-gate-"+state+"-"+str(shape.x)+".png"
        root.get_texture().get_image().save_png(path)
        print("CAPTURE ",path)
        RenderingServer.render_loop_enabled = false
    game.player._yaw = 0
func capture(label: String) -> void:
    var geometry = c.channel_geometry
    for i in range(5):
        var size: Vector3 = geometry.SIZES[i]
        check(absf(size.x*size.z-c.construction.flow.cell_state(i).area)<.00001,"cell footprint agrees "+str(i))
    check(is_equal_approx(geometry.CENTERS[0].z+1.5,geometry.CENTERS[1].z-2),"source/intake shared edge")
    check(is_equal_approx(geometry.CENTERS[1].z+2,geometry.CENTERS[2].z-5),"crossing shared edge")
    check(is_equal_approx(geometry.CENTERS[2].x-.8,geometry.CENTERS[3].x+4),"furrow shared edge")
    check(is_equal_approx(geometry.CENTERS[3].x-4,geometry.CENTERS[4].x+2),"catchment shared edge")
    for index in [1,2]:
        var gate: Node3D = c.gates[index]
        var board: Node3D = gate.get_child(0)
        check(board.get_child_count() == 9,"sliding planks braces and lifting handle retained")
        check(gate.get_child_count() == 5,"manual gate uses board and four fixed groove cheeks")
        for mesh in gate.find_children("*","MeshInstance3D",true,false):
            check(not mesh.mesh is TorusMesh,"no cosmetic gate wheel")
        check(is_equal_approx(board.position.y,1.30 if index == 1 and c.construction.inlet else (1.0 if index == 2 and c.construction.outlet else .425)),"opening follows authoritative gate state")
    if DisplayServer.get_name() == "headless": return
    game.player.get_camera().current = true
    game.player._yaw = 0
    check(await walk(Vector3(157,0,-3.5),.3),"walk to ordinary camera observation")
    game.player._yaw = -.55
    game.player._pitch = -.65
    for shape in [Vector2i(1280,720),Vector2i(720,1280)]:
        root.size = shape
        RenderingServer.render_loop_enabled = true
        for n in range(15): await process_frame
        await RenderingServer.frame_post_draw
        var path := "/tmp/jd-visual-intake-"+label+"-"+str(shape.x)+".png"
        root.get_texture().get_image().save_png(path)
        print("CAPTURE ",path)
        RenderingServer.render_loop_enabled = false
    game.player._yaw = 0
    check(await walk(Vector3(158,0,9.5),.3),"walk to downstream ordinary camera corner")
    game.player._yaw = -.2
    game.player._pitch = -.55
    for shape in [Vector2i(1280,720),Vector2i(720,1280)]:
        root.size = shape
        RenderingServer.render_loop_enabled = true
        for n in range(15): await process_frame
        await RenderingServer.frame_post_draw
        var path := "/tmp/jd-visual-garden-"+label+"-"+str(shape.x)+".png"
        root.get_texture().get_image().save_png(path)
        print("CAPTURE ",path)
        RenderingServer.render_loop_enabled = false
    game.player._yaw = 0
