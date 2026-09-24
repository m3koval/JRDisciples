extends SceneTree
const Animal = preload("res://scripts/cave_block_animal.gd")
var failures: Array[String] = []
var checks := 0

func _initialize() -> void:
    call_deferred("run")

func check(ok: bool, message: String) -> void:
    checks += 1
    if not ok:
        failures.append(message)
        push_error(message)

func bounds(animal: Node3D) -> AABB:
    var result := AABB()
    var first := true
    for node in animal.find_children("*", "MeshInstance3D", true, false):
        var box: AABB = animal.global_transform.affine_inverse() * node.global_transform * node.get_aabb()
        result = box if first else result.merge(box)
        first = false
    return result

func pose_snapshot(animal: Node3D) -> Array[Transform3D]:
    var result: Array[Transform3D] = []
    for leg in animal.legs: result.append(leg.transform)
    for knee in animal.knees: result.append(knee.transform)
    result.append(animal.head.transform)
    result.append(animal.tail.transform)
    return result

func run() -> void:
    for species in ["lion", "bear"]:
        var animal := Animal.new()
        root.add_child(animal)
        animal.configure(species)
        check(animal.legs.size() == 4 and animal.knees.size() == 4, species+": four articulated leg chains")
        var rest := pose_snapshot(animal)
        var box := bounds(animal)
        check(absf(box.position.y) < .0001, species+": rest feet at ground zero")
        check(box.size.x <= 2.5 and box.size.y <= 1.8 and box.size.z <= 3, species+": rest envelope")
        for frame in range(60): animal.pose(1.0/60,"retreat",1.0,0.0)
        check(pose_snapshot(animal) == rest and animal.stride == 0, species+": stationary has no foot cycle")
        for frame in range(8): animal.pose(1.0/60,"retreat",1.0,3.0)
        check(absf(animal.legs[0].rotation.x) > .1, species+": visible moving front leg")
        check(animal.legs[0].rotation.x * animal.legs[1].rotation.x < 0, species+": opposite independent forelegs")
        check(absf(animal.knees[1].rotation.x) > .01, species+": independent knee articulation")
        var moving_pose := pose_snapshot(animal)
        animal.pose(0,"lunge",.3,6)
        check(pose_snapshot(animal) == moving_pose, species+": zero delta freezes")
        animal.reset_pose()
        check(pose_snapshot(animal) == rest and animal.stride == 0, species+": exact reset")
        for state in ["warn","lunge","recover","retreat","idle"]:
            for frame in range(90):
                var remaining := maxf(0,.7-float(frame)/60) if state == "lunge" else 1.0
                animal.pose(1.0/60,state,remaining,3 if state == "retreat" else 0)
                box = bounds(animal)
                check(box.position.is_finite() and box.size.is_finite(), species+": finite "+state)
                check(box.position.y >= -.0001, species+": paws above ground "+state)
                check(box.size.x <= 2.5 and box.size.y <= 1.8 and box.size.z <= 3, species+": animated envelope "+state)
                if state == "lunge" and frame == 20:
                    check(absf(animal.head.rotation.x) > .05, species+": lunge head intent")
                    check(animal.legs[0].rotation.x < -.35, species+": front paw reach")
                    if species == "bear": check(absf(animal.legs[0].rotation.x-animal.legs[1].rotation.x) > .3, "bear: distinct forward paw swipe")
        animal.pose(.016,"reset_pose",0,0)
        check(pose_snapshot(animal) == rest, species+": reset state alias")
        animal.pose(.016,"idle",NAN,INF)
        check(bounds(animal).size.is_finite(), species+": malformed input bounded")
        animal.configure(species)
        check(pose_snapshot(animal) == rest and animal.get_child_count() == 1, species+": reconfigure no duplicates")
        print("ANIMAL_BOUNDS ",species," ",bounds(animal))
        animal.free()
    print("CAVE_BLOCK_ANIMAL_TEST checks=",checks," failures=",failures.size())
    quit(0 if failures.is_empty() else 1)
