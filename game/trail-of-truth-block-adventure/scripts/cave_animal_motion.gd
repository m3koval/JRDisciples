extends Node3D
## Presentation only: never moves the gameplay actor or advances the campaign.
## The licensed source meshes are unrigged. No fabricated skeletal clips.
var body := Node3D.new()
var species := "lion"
var clock := 0.0
var stride := 0.0
var previous_position := Vector3.ZERO
var last_phase := "idle"
var phase_age := 0.0

func attach(actor: Node3D, animal_species: String) -> void:
    species = animal_species
    name = "AnimalMotion"
    body.name = "BodyMotion"
    var original_children := actor.get_children()
    actor.add_child(self)
    add_child(body)
    for child in original_children:
        child.reparent(body, false)
    reset_pose()

func reset_pose() -> void:
    transform = Transform3D.IDENTITY
    body.transform = Transform3D.IDENTITY
    clock = 0
    stride = 0
    last_phase = "idle"
    phase_age = 0
    previous_position = get_parent().position

func step(delta: float, state: String, remaining: float, facing: Vector3) -> void:
    if delta <= 0: return
    clock += delta
    if state != last_phase:
        phase_age = 0
        last_phase = state
    phase_age += delta
    var actor_position: Vector3 = get_parent().position
    var travelled := actor_position.distance_to(previous_position)
    previous_position = actor_position
    # Distance-driven retreat cadence does not keep stepping when stationary.
    if travelled < 2.0: stride += travelled * (7.0 if species == "lion" else 5.5)
    facing.y = 0
    if facing.length_squared() > .0001:
        # Both imported animals face +Z. Keep facing separate from body lean.
        rotation.y = lerp_angle(rotation.y, atan2(facing.x, facing.z), 1.0-exp(-delta*12.0))
    var lean := Vector3.ZERO
    var offset := Vector3.ZERO
    var stretch := Vector3.ONE
    var breath := sin(clock*(2.0 if species == "lion" else 1.6))
    stretch.y += breath*.007
    match state:
        "warn":
            var charge := smoothstep(0.0, 1.0, clampf(1.0-remaining/1.6, 0, 1))
            # Gather weight before moving, without violent shaking/flashes.
            stretch.y = 1.0-charge*.045
            stretch.z = 1.0+charge*.018
            offset.z = -charge*.10
            lean.x = charge*.025
        "lunge":
            var progress := clampf(1.0-remaining/.7, 0, 1)
            var arc := sin(progress*PI)
            offset.y = arc*(.19 if species == "lion" else .08)
            lean.x = sin(progress*TAU)*(.055 if species == "lion" else .035)
        "recover":
            var settle := exp(-phase_age*5.0)
            stretch.y = 1.0-.035*settle + breath*.010
            lean.x = .035*sin(phase_age*12.0)*settle
        "retreat":
            var moving := clampf(travelled/maxf(delta,.0001)/2.0, 0, 1)
            offset.y = (1.0-cos(stride*2.0))*.022*moving
            lean.z = sin(stride)*.018*moving
            lean.x = -.025*moving
    # Conservative foot clearance for the normalized 2.5 × 1.8 × 3 envelope.
    offset.y += absf(sin(lean.x))*1.5 + absf(sin(lean.z))*1.25
    var blend := 1.0-exp(-delta*20.0)
    body.position = body.position.lerp(offset, blend)
    body.rotation = body.rotation.lerp(lean, blend)
    body.scale = body.scale.lerp(stretch, blend)
