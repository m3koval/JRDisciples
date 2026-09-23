extends SceneTree
class GeometryWorld extends "res://scripts/world.gd":
    var captured := {}
    func _flush_batches() -> void:
        captured = _batches.duplicate(true)
        super._flush_batches()
var failures := 0
func _initialize() -> void:
    call_deferred("run")
func check(label: String, ok: bool) -> void:
    print(label, " ", ok)
    if not ok: failures += 1
func top_for(world: Node, batch_name: String, x: float, z: float) -> float:
    for tx: Transform3D in world.captured[batch_name.trim_prefix("Blocks_")]:
        if absf(tx.origin.x - x) < .01 and absf(tx.origin.z - z) < .01:
            return tx.origin.y + tx.basis.y.length() * .5
    return -INF
func run() -> void:
    var world = GeometryWorld.new()
    root.add_child(world)
    await process_frame
    print("surface_tops ", top_for(world,"Blocks_grass",-9.65,0), " ", top_for(world,"Blocks_earth",-9.65,0), " ", top_for(world,"Blocks_grass_light",-13,-10), " ", top_for(world,"Blocks_earth_light",-13,-10))
    check("left_bank_grass_above_earth", top_for(world,"Blocks_grass",-9.65,0) - top_for(world,"Blocks_earth",-9.65,0) >= .019)
    check("right_bank_grass_above_earth", top_for(world,"Blocks_grass_light",15.15,0) - top_for(world,"Blocks_earth",15.15,0) >= .019)
    check("terrace_grass_above_earth", top_for(world,"Blocks_grass_light",-13,-10) - top_for(world,"Blocks_earth_light",-13,-10) >= .019)
    check("bank_collision_ground_unchanged", is_equal_approx(world.get_node("LeftBank").position.y + world.get_node("LeftBank").get_child(0).shape.size.y*.5,0))
    check("bridge_child_scale", world._panel_shapes[0].shape.size.z <= 2.1 and world._panel_shapes[0].shape.size.z >= 1.8)
    world.queue_free()
    await process_frame
    quit(1 if failures else 0)
