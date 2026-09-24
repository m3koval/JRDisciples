extends RefCounted
## State-linked manual winch illustration; not a mechanical force solver.
static func rod(parent: Node3D, a: Vector3, b: Vector3, radius: float, color: Color) -> MeshInstance3D:
    var mesh := CylinderMesh.new()
    mesh.top_radius = radius
    mesh.bottom_radius = radius
    mesh.height = a.distance_to(b)
    mesh.radial_segments = 12
    var node := MeshInstance3D.new()
    node.mesh = mesh
    node.material_override = StandardMaterial3D.new()
    node.material_override.albedo_color = color
    node.material_override.roughness = .9
    parent.add_child(node)
    node.position = (a+b)/2
    var direction := (b-a).normalized()
    var cross := Vector3.RIGHT if absf(direction.dot(Vector3.RIGHT)) < .9 else Vector3.FORWARD
    var z := cross.cross(direction).normalized()
    node.basis = Basis(direction.cross(z).normalized(),direction,z)
    return node

static func ring(parent: Node3D, at: Vector3, inner: float, outer: float, material: Material) -> void:
    var node := MeshInstance3D.new()
    var mesh := TorusMesh.new()
    mesh.inner_radius = inner
    mesh.outer_radius = outer
    mesh.rings = 24
    mesh.ring_segments = 8
    node.mesh = mesh
    node.rotation.z = PI/2
    node.position = at
    node.material_override = material
    parent.add_child(node)

static func build(root: Node3D, width: float, geometry) -> void:
    var x := -width/2-.52
    geometry.dressed(root,Vector3(0,1.89,0),Vector3(width+.36,.14,.30),true)
    geometry.dressed(root,Vector3(x,.55,0),Vector3(.19,1.10,.24),true)
    rod(root,Vector3(x-.27,.99,0),Vector3(x+.36,.99,0),.065,Color("62472f"))
    var wheel := Node3D.new()
    wheel.position = Vector3(x-.28,.99,0)
    root.add_child(wheel)
    ring(wheel,Vector3.ZERO,.35,.44,geometry.finish(true))
    for n in range(8):
        var angle := n*TAU/8
        rod(wheel,Vector3(0,sin(angle)*.09,cos(angle)*.09),Vector3(0,sin(angle)*.385,cos(angle)*.385),.026,Color("9a744b"))
    rod(wheel,Vector3(-.07,0,0),Vector3(.07,0,0),.115,Color("674d36"))
    rod(wheel,Vector3(-.06,.31,0),Vector3(-.24,.31,0),.035,Color("6a4b30"))
    rod(root,Vector3(x+.08,.99,0),Vector3(x+.30,.99,0),.12,Color("876242"))
    for n in range(7): ring(root,Vector3(x+.095+n*.027,.99,0),.117,.133,geometry.finish(true))
    var rope_x := x+.2
    rod(root,Vector3(rope_x,.99,.13),Vector3(rope_x,2.10,.13),.018,Color("c5b185"))
    rod(root,Vector3(rope_x,2.10,.13),Vector3(0,2.10,.13),.018,Color("c5b185"))
    for px in [rope_x,0.0]:
        geometry.dressed(root,Vector3(px,2.0,0),Vector3(.12,.22,.13),true)
        rod(root,Vector3(px,2.10,-.02),Vector3(px,2.10,.18),.075,Color("6b5137"))
    var lifting := rod(root,Vector3(0,1.02,.13),Vector3(0,2.10,.13),.018,Color("c5b185"))
    root.set_meta("handwheel",wheel)
    root.set_meta("lifting_rope",lifting)

static func sync(root: Node3D) -> void:
    var lift: float = root.get_child(0).position.y
    var wheel: Node3D = root.get_meta("handwheel")
    wheel.rotation.x = -(lift-.425)/.12
    var rope: MeshInstance3D = root.get_meta("lifting_rope")
    var bottom := lift+.59
    rope.position.y = (2.10+bottom)/2
    rope.scale.y = maxf(.01,2.10-bottom)/1.08
