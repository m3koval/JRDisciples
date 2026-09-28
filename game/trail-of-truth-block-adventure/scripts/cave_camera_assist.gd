extends RefCounted
## Portrait encounter framing only. Never moves the camera or changes the spring
## arm: the controller retains collision, recovery and camera-relative movement.
var manual_hold := 0.0
var framing_active := false

func step(player, caves, paused: bool, viewport: Vector2, delta: float) -> void:
    if paused: return
    var camera: Camera3D = player.get_camera()
    var portrait := viewport.y > viewport.x
    var inside := -1
    if caves.active:
        for i in range(caves.animals.size()):
            if caves.in_arena(player.position, i) and caves.animals[i].visible:
                inside = i
                break
    var eligible := portrait and inside >= 0 and not paused
    if eligible: framing_active = true
    if framing_active:
        camera.fov = lerpf(camera.fov, 66.0 if eligible else 58.0, 1.0-exp(-3.0*delta))
        if not eligible and absf(camera.fov-58.0) < .01:
            camera.fov = 58.0
            framing_active = false
    if not eligible:
        manual_hold = 0.0
        return
    if player._look_id != -1 or player._mouse_look or player._look_pending.length() > .001:
        manual_hold = 3.0
        return
    manual_hold = maxf(0.0, manual_hold-delta)
    if manual_hold > 0.0: return
    # Never rotate the movement basis under either keyboard or touch walking.
    if not player._keys.is_empty() or player._stick_vector.length() > .12 or player.move_input.length() > .01:
        return
    var offset: Vector3 = caves.animals[inside].position-player.position
    if Vector2(offset.x,offset.z).length() < 1.2: return
    # Slight three-quarter angle separates silhouettes without strafing the
    # camera through walls. No forced turn when the player looks away.
    var desired := atan2(-offset.x,-offset.z)+.18
    var error := wrapf(desired-player._yaw,-PI,PI)
    if absf(error) > 1.15: return
    if absf(error) > .06:
        player._yaw += clampf(error*1.2,-.30,.30)*delta
    player._pitch = move_toward(player._pitch,-.24,.10*delta)
