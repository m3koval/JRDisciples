extends RefCounted
## Existing garden waterway stays open beneath a real walkable timber crossing.
const CENTER_X := 157.0
const WIDTH := 2.2
const DECK_TOP := .82
const DECK_UNDERSIDE := .65
const PROFILE := [Vector2(3.85,.025),Vector2(5.35,DECK_TOP),Vector2(7.40,DECK_TOP),Vector2(8.90,.025)]
static func build(parent: Node3D, geometry) -> void:
    var root := Node3D.new()
    root.name = "GardenFootbridge"
    parent.add_child(root)
    var st := SurfaceTool.new()
    st.begin(Mesh.PRIMITIVE_TRIANGLES)
    for i in range(PROFILE.size()-1):
        var a: Vector2 = PROFILE[i]
        var b: Vector2 = PROFILE[i+1]
        var length: float = a.distance_to(b)
        var angle: float = -atan2(b.y-a.y,b.x-a.x)
        var count: int = int(ceil(length/.22))
        for n in range(count):
            var mid: Vector2 = a.lerp(b,(n+.5)/count)
            var plank: MeshInstance3D = geometry.dressed(root,Vector3(CENTER_X,mid.y-.045*cos(angle),mid.x),Vector3(WIDTH,.09,length/count-.01),true)
            plank.rotation.x = angle
        var left: float = CENTER_X-WIDTH*.5
        var right: float = CENTER_X+WIDTH*.5
        for v in [Vector3(left,a.y,a.x),Vector3(right,a.y,a.x),Vector3(right,b.y,b.x),Vector3(left,a.y,a.x),Vector3(right,b.y,b.x),Vector3(left,b.y,b.x)]: st.add_vertex(v)
        # Side stringers hold the deck; low timber rails show the crossing direction.
        for side in [-1,1]:
            var x: float = CENTER_X+side*(WIDTH*.5-.08)
            var beam: MeshInstance3D = geometry.dressed(root,Vector3(x,(a.y+b.y)*.5-.10,(a.x+b.x)*.5),Vector3(.14,.14,length+.06),true)
            beam.rotation.x = angle
            var rail: MeshInstance3D = geometry.dressed(root,Vector3(x,(a.y+b.y)*.5+.53,(a.x+b.x)*.5),Vector3(.085,.085,length+.06),true)
            rail.rotation.x = angle
    for p: Vector2 in PROFILE:
        for side in [-1,1]:
            geometry.dressed(root,Vector3(CENTER_X+side*(WIDTH*.5-.08),p.y+.25,p.x),Vector3(.12,.63,.12),true)
    # Bearing blocks sit beside—not inside—the furrow's wet footprint.
    for z in [5.18,7.57]:
        for side in [-1,1]:
            geometry.dressed(root,Vector3(CENTER_X+side*.99,.32,z),Vector3(.30,.64,.26))
    st.generate_normals()
    var deck_mesh: ArrayMesh = st.commit()
    var body := StaticBody3D.new()
    body.name = "WalkableDeckAndRamps"
    body.collision_layer = 1
    body.collision_mask = 0
    var shape := CollisionShape3D.new()
    shape.shape = deck_mesh.create_trimesh_shape()
    body.add_child(shape)
    root.add_child(body)
    root.set_meta("deck_top",DECK_TOP)
    root.set_meta("clear_underside",DECK_UNDERSIDE)
