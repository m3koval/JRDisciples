extends RefCounted
## Connected authored stone vaults plus Poly Haven CC0 hillside scans (see
## assets/scans/PROVENANCE.md). Legacy box colliders remain authoritative;
## their chamber/jamb/roof meshes are replaced by inward-facing irregular art.
## Shell geometry and atmosphere live in cave_shell_art.gd.
const SCANS := "res://assets/scans/"
const DOOR_HALF := 1.8
const DOOR_TOP := 3.4
const WALL_TOP := 4.4
const CHAMBER_HALF := 5.3
const CHAMBER_DEPTH := 14.0

static func material(id: String, scale: float, tint: Color = Color.WHITE) -> StandardMaterial3D:
    var m := StandardMaterial3D.new()
    m.albedo_texture = load(SCANS + "textures/" + id + "_albedo.jpg")
    m.albedo_color = tint
    m.normal_enabled = true
    m.normal_texture = load(SCANS + "textures/" + id + "_normal.jpg")
    m.roughness_texture = load(SCANS + "textures/" + id + "_rough.jpg")
    m.uv1_triplanar = true
    m.uv1_world_triplanar = true
    m.uv1_scale = Vector3.ONE * scale
    return m

static func solid(parent: Node3D, center: Vector3, size: Vector3, mat: Material, visual: bool = true) -> StaticBody3D:
    var body := StaticBody3D.new()
    body.position = center
    parent.add_child(body)
    var shape := CollisionShape3D.new()
    var box := BoxShape3D.new()
    box.size = size
    shape.shape = box
    body.add_child(shape)
    if not visual:
        body.set_meta("collision_authority_only", true)
        return body
    var mesh := MeshInstance3D.new()
    var cube := BoxMesh.new()
    cube.size = size
    mesh.mesh = cube
    mesh.material_override = mat
    body.add_child(mesh)
    return body

static func scan(parent: Node3D, id: String, at: Vector3, scale: float, yaw: float) -> Node3D:
    var node := (load(SCANS + id + ".glb") as PackedScene).instantiate() as Node3D
    node.position = at
    node.scale = Vector3.ONE * scale
    node.rotation_degrees.y = yaw
    parent.add_child(node)
    return node

static func build(parent: Node3D, entrances: Array) -> void:
    var rock := material("rock_face_03", .22, Color(.86, .8, .72))
    var inner := material("rock_face_03", .26, Color(.70, .63, .53))
    inner.roughness = .97
    inner.normal_scale = .65
    var ground := material("rocky_trail", .16, Color(.95, .9, .82))
    solid(parent, Vector3(100, -.5, 0), Vector3(40, 1, 32), ground)
    # Courtyard perimeter; the hill hides most of it.
    for x in [80.0, 120.0]: solid(parent, Vector3(x, 3, 0), Vector3(1, 6, 32), rock)
    for z in [-16.0, 16.0]: solid(parent, Vector3(100, 3, z), Vector3(40, 6, 1), rock)
    # Solid rock between and beside the chambers: no walkable slots into the hill.
    for span in [Vector2(80.5, 82.7), Vector2(93.3, 94.7), Vector2(105.3, 106.7), Vector2(117.3, 119.5)]:
        solid(parent, Vector3((span.x + span.y) * .5, WALL_TOP * .5, -8), Vector3(span.y - span.x, WALL_TOP, 16), rock)
    for e: Vector3 in entrances:
        # Same authoritative boxes, with their obsolete visible cubes removed.
        for side in [-1, 1]:
            solid(parent, e + Vector3(side * (CHAMBER_HALF - .5), WALL_TOP * .5, -CHAMBER_DEPTH * .5), Vector3(1, WALL_TOP, CHAMBER_DEPTH), inner, false)
        solid(parent, e + Vector3(0, WALL_TOP * .5, -CHAMBER_DEPTH), Vector3(CHAMBER_HALF * 2, WALL_TOP, 1), inner, false)
        solid(parent, e + Vector3(0, WALL_TOP + .3, -(CHAMBER_DEPTH + .6) * .5 - .3), Vector3(CHAMBER_HALF * 2, .6, CHAMBER_DEPTH + .6), inner, false)
        var jamb := CHAMBER_HALF - DOOR_HALF
        for side in [-1, 1]:
            solid(parent, e + Vector3(side * (DOOR_HALF + jamb * .5), WALL_TOP * .5, 0), Vector3(jamb, WALL_TOP, 1.2), rock, false)
        solid(parent, e + Vector3(0, (DOOR_TOP + WALL_TOP) * .5, 0), Vector3(DOOR_HALF * 2, WALL_TOP - DOOR_TOP, 1.2), rock, false)
        preload("res://scripts/cave_shell_art.gd").build(parent, e, inner, rock, entrances.find(e))
        _dress_entrance(parent, e)
    _dress_hill(parent)

static func _dress_entrance(parent: Node3D, e: Vector3) -> void:
    # Scanned faces frame the doorway; the crown cliff sits on the lintel.
    # z = 1.3 keeps the jamb scans' back faces in front of the chamber.
    scan(parent, "rock_face_02", e + Vector3(-DOOR_HALF - 1.5, 0, 1.3), 1.45, 0)
    scan(parent, "rock_face_02", e + Vector3(DOOR_HALF + 1.5, 0, 1.3), 1.45, 180)
    # Three seated fractured faces break up the broad apron. Their minimum
    # heights stay above the 3.4m doorway; no suspended rectangular lintel.
    scan(parent, "rock_face_02", e + Vector3(-1.35, 3.85, 1.28), .60, 180)
    scan(parent, "rock_face_02", e + Vector3(1.68, 3.98, 1.18), .64, 0)
    scan(parent, "rock_face_02", e + Vector3(.25, 4.50, .72), .72, 12)
    scan(parent, "namaqualand_boulder_05", e + Vector3(-DOOR_HALF - .8, 0, 1.3), 1.1, 30)
    scan(parent, "boulder_01", e + Vector3(DOOR_HALF + 1.2, 0, 1.5), .9, -40)

static func _dress_hill(parent: Node3D) -> void:
    for x in [82.0, 94.0, 106.0, 118.0]:
        scan(parent, "namaqualand_cliff_01", Vector3(x, .0, 2.6), .7, 0)
    for x in [88.0, 100.0, 112.0]:
        # Sits on the roof (top at WALL_TOP + .6), never below it.
        scan(parent, "namaqualand_cliff_02", Vector3(x, WALL_TOP + .6, -8), .9, 180)
