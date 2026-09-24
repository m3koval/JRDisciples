extends "res://tests/irrigation_geometry_playthrough.gd"
## Inherits every original construction/geometry assertion; adds real bridge walking.
func capture(label: String) -> void:
    await super.capture(label)
    var bridge: Node3D = c.get_node_or_null("GardenFootbridge")
    check(bridge != null,"footpath has integrated timber bridge")
    if bridge == null: return
    check(float(bridge.get_meta("clear_underside")) > float(c.construction.flow.cell_state(3).rim),"bridge underside clears maximum furrow water level")
    var terrain = preload("res://scripts/garden_terrain.gd")
    check(terrain.path_distance(Vector2(150,6.375)) > 1.5,"retired west path does not run through channel")
    check(terrain.path_distance(Vector2(157,6.375)) < .1,"remaining path aligns to bridge")
    var stray := false
    for child in c.get_children():
        if child is MeshInstance3D and child.position.distance_to(c.SLUICE+Vector3(-.4,.12,.7)) < .01: stray = true
    check(not stray,"obsolete loose yellow block removed")
    game.player._yaw = 0
    check(await walk(Vector3(157,0,9.5),.2),"walk to south bridge ramp")
    check(await walk(Vector3(157,0,6.375),.2),"walk uphill onto actual deck without jump")
    check(game.player.position.y > .78 and game.player.position.y < .92,"player stands on bridge, not through waterway")
    check(await walk(Vector3(157,0,3.2),.2),"walk down north bridge ramp")
    check(absf(game.player.position.y) < .12,"north approach returns to ground")
    check(await walk(Vector3(157,0,9.5),.2),"walk bridge in reverse without jump")
    check(absf(game.player.position.y) < .12,"south approach returns to ground")
    if DisplayServer.get_name() == "headless": return
    game.player._yaw = .18
    game.player._pitch = -.55
    for shape in [Vector2i(1280,720),Vector2i(720,1280)]:
        root.size = shape
        RenderingServer.render_loop_enabled = true
        for n in range(12): await process_frame
        await RenderingServer.frame_post_draw
        var path: String = "/tmp/jd-site-crossing-"+label+"-"+str(shape.x)+".png"
        root.get_texture().get_image().save_png(path)
        print("CAPTURE ",path)
        RenderingServer.render_loop_enabled = false
    game.player._yaw = 0
