extends SceneTree
## Additive presentation checks; does not replace original solver/host/route suites.
var failures := 0
func check(ok: bool, label: String) -> void:
    print(("PASS " if ok else "FAIL ")+label)
    if not ok: failures += 1
func _initialize() -> void: call_deferred("run")
func run() -> void:
    var terrain_class = preload("res://scripts/garden_terrain.gd")
    var valid := true
    for x in range(144,177):
        for z in range(-16,17): valid = valid and is_equal_approx(terrain_class.height_at(x,z),.015)
    check(valid,"walkable core terrain matches existing flat collision height")
    valid = true
    for x in range(128,193):
        for z in range(-40,41): valid = valid and terrain_class.height_at(x,z) >= .015
    check(valid,"scenic relief never clips under base plane")
    var game = load("res://scripts/main.gd").new()
    root.add_child(game)
    await physics_frame
    var c = game.water_chapter
    var terrain: MeshInstance3D = c.find_child("ContinuousGardenTerrain",true,false)
    check(terrain != null,"continuous terrain integrated in actual chapter")
    if terrain != null:
        var arrays: Array = terrain.mesh.surface_get_arrays(0)
        check(arrays[Mesh.ARRAY_VERTEX].size() == 20769,"terrain shared-vertex budget")
        check(arrays[Mesh.ARRAY_INDEX].size() == 122880,"terrain triangle budget")
        var normals: PackedVector3Array = arrays[Mesh.ARRAY_NORMAL]
        check(normals[80*129+64].y > .99,"playable terrain normals face upward")
    var foliage: Node3D = c.find_child("GardenFoliage",true,false)
    check(foliage != null,"foliage actually integrated, not unattached module")
    if foliage != null:
        check(foliage.find_children("*","CollisionShape3D",true,false).is_empty(),"foliage adds no route collisions")
        check(foliage.find_children("*","MultiMeshInstance3D",true,false).size() == 4,"foliage uses four batched plant groups")
        print("FOLIAGE_BUDGET ",foliage.get_meta("budget"))
    check(c.find_child("GardenWorkshopArt",true,false) != null,"supported workshop integrated")
    check(c.water.size() == 5,"five authoritative water surfaces preserved")
    for i in range(5): check(c.water[i].material_override is ShaderMaterial,"animated surface material "+str(i))
    var sun: DirectionalLight3D = game.find_child("LateAfternoonSun",true,false)
    var rotation: Vector3 = sun.rotation_degrees
    c.garden_lighting.apply(game,true)
    check(is_equal_approx(sun.directional_shadow_max_distance,38),"chapter scoped shadow range")
    c.garden_lighting.apply(game,false)
    check(sun.rotation_degrees.is_equal_approx(rotation),"prior chapter lighting restored")
    c.active = true
    for language in ["en","ru"]:
        game.language = language
        for shape in [Vector2i(1280,720),Vector2i(720,1280)]:
            root.size = shape
            for n in range(3): await process_frame
            for at in [c.GARDENER,c.KEEPER,c.SLUICE,c.SPILL,c.FEED,c.GATE,c.PLAN,c.SUPPLY]:
                game.player.position = at
                game._refresh_ui()
                var button: Button = game.action_button
                var font: Font = button.get_theme_font("font")
                var font_size: int = button.get_theme_font_size("font_size")
                var width: float = font.get_string_size(button.text,HORIZONTAL_ALIGNMENT_LEFT,-1,font_size).x
                check(width <= button.size.x-24,"unclipped action label "+language+" "+str(shape.x)+" "+button.text)
    print("GARDEN_ART_FAILURES=",failures)
    quit(0 if failures == 0 else 1)
