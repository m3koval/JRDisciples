extends "res://tests/cave_recovery_capture.gd"
func run() -> void:
    var game = load("res://scripts/main.gd").new()
    root.add_child(game)
    await physics_frame
    game._apply_progress(null)
    game.campaign.stage = 6
    game.reward_saved = true
    game.completed = true
    game.modal_kind = "flock_complete"
    game._primary_action()
    game._primary_action()
    await shot(game, "1-entrance", game.caves.ENTRANCES[0] + Vector3(0,0,6), -.14)
    root.size = Vector2i(1280,720)
    await process_frame
    var camera: Camera3D = game.player.get_camera()
    print("PILOT_CAMERA ",camera.global_transform)
    for pixel in [Vector2(1220,250),Vector2(300,5)]:
        var origin := camera.project_ray_origin(pixel)
        var direction := camera.project_ray_normal(pixel)
        var distance := 10000.0
        var target := "BACKGROUND"
        for node in game.find_children("*", "MeshInstance3D", true, false):
            if not node.is_visible_in_tree() or node.mesh == null: continue
            var inv: Transform3D = node.global_transform.affine_inverse()
            var local_origin: Vector3 = inv * origin
            var local_direction: Vector3 = inv.basis * direction
            if not node.mesh.get_aabb().intersects_ray(local_origin,local_direction): continue
            var faces: PackedVector3Array = node.mesh.get_faces()
            for i in range(0,faces.size(),3):
                var hit: Variant = Geometry3D.ray_intersects_triangle(local_origin,local_direction,faces[i],faces[i+1],faces[i+2])
                if hit != null:
                    var d: float = origin.distance_to(node.global_transform * hit)
                    if d < distance:
                        distance = d
                        target = str(node.get_path())
        print("PIXEL_RAY ",pixel," target=",target," distance=",distance)
    quit(0)
