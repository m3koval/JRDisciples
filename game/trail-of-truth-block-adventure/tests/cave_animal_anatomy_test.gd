extends SceneTree
const Animal = preload("res://scripts/cave_block_animal.gd")
var checks := 0
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, label: String) -> void:
    checks += 1
    if not ok:
        failures += 1
        push_error(label)
func run() -> void:
    for kind in ["lion","bear"]:
        var animal = Animal.new()
        root.add_child(animal)
        animal.configure(kind)
        var vertices := 0
        for node in animal.find_children("*","MeshInstance3D",true,false):
            check(node.mesh is ArrayMesh,"authored array geometry")
            var data: Array = node.mesh.surface_get_arrays(0)
            vertices += data[Mesh.ARRAY_VERTEX].size()
            for normal in data[Mesh.ARRAY_NORMAL]:
                check(normal.is_finite() and absf(normal.length()-1.0)<.001,"unit finite normal")
        check(vertices < 8000,"bounded geometry budget")
        for frame in range(180):
            animal.pose(1.0/60.0,"chase",1,2.2)
            var planted := 0
            var lifted := 0
            for paw in animal.paws:
                var box: AABB = paw.global_transform * paw.get_aabb()
                check(box.position.y >= -.0001,"no local floor penetration")
                if absf(box.position.y) < .0001: planted += 1
                if box.position.y > .005: lifted += 1
                check(absf(paw.global_basis.y.dot(Vector3.UP)-1)<.001,"level stance wrist")
            check(planted >= 2,"two diagonal contacts")
            # At diagonal exchange all feet may be within the contact tolerance.
            if absf(sin(animal.stride)) > .1:
                check(lifted >= 1,"swing clearance away from contact exchange")
        for frame in range(35): animal.pose(1.0/60.0,"warn",.5,0)
        check(animal.jaw.rotation.x > .15,"warning jaw opens")
        check(animal.ears[0].rotation.x < -.2,"warning ears fold")
        animal.reset_pose()
        check(animal.jaw.rotation == Vector3.ZERO and animal.ears[0].rotation == Vector3.ZERO,"expression reset")
        for paw in animal.paws: check(paw.rotation == Vector3.ZERO,"wrist reset")
        print("ANATOMY ",kind," vertices=",vertices)
        animal.free()
    print("CAVE_ANIMAL_ANATOMY_TEST checks=",checks," failures=",failures)
    quit(0 if failures == 0 else 1)
