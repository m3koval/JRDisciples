extends CharacterBody3D
## Feet-origin, camera-relative adventure controller. Quest/actions belong to main.

const WALK_SPEED: float = 4.5
const CARRY_SPEED: float = 3.1
const JUMP_SPEED: float = 6.2
const GRAVITY: float = 18.0
const JOYSTICK_RADIUS: float = 64.0

var carrying: bool = false
var carry_socket: Node3D
var move_input: Vector2 = Vector2.ZERO
var _enabled: bool = true
var _keys: Dictionary = {}
var _jump_buffer: float = 0.0
var _coyote: float = 0.0
var _stick_id: int = -1
var _look_id: int = -1
var _stick_origin: Vector2 = Vector2.ZERO
var _stick_vector: Vector2 = Vector2.ZERO
var _mouse_look: bool = false
var _yaw: float = 0.0
var _pitch: float = -0.40
var _visual: Node3D
var _animation: AnimationPlayer
var _animations: Dictionary = {}
var _current_animation: StringName = &""
var _camera: Camera3D
var _camera_pivot: Node3D
var _arm: SpringArm3D
var _joystick: JoystickDisplay

class JoystickDisplay extends Control:
	var active: bool = false
	var origin: Vector2 = Vector2.ZERO
	var displacement: Vector2 = Vector2.ZERO
	func _draw() -> void:
		# Resting affordance is visible before the first touch; purely decorative.
		draw_circle(origin + Vector2(0, 3), 66.0, Color(0.02, 0.07, 0.06, 0.25))
		draw_circle(origin, 64.0, Color(0.06, 0.18, 0.16, 0.65 if active else 0.46))
		draw_arc(origin, 64.0, 0.0, TAU, 64, Color(1.0, 0.91, 0.66, 0.85), 2.0, true)
		for direction: Vector2 in [Vector2.UP, Vector2.RIGHT, Vector2.DOWN, Vector2.LEFT]:
			var tip: Vector2 = origin + direction * 53.0
			var side: Vector2 = direction.orthogonal() * 5.0
			draw_polyline(PackedVector2Array([tip - direction * 6.0 + side, tip, tip - direction * 6.0 - side]), Color(1, 0.94, 0.77, 0.7), 2.0, true)
		draw_circle(origin + displacement, 25.0, Color(1.0, 0.91, 0.66, 0.95 if active else 0.78))
		draw_arc(origin + displacement, 25.0, 0.0, TAU, 32, Color(1, 1, 0.92, 0.9), 2.0, true)

func _ready() -> void:
	floor_snap_length = 0.25
	floor_max_angle = deg_to_rad(48.0)
	var shape: CapsuleShape3D = CapsuleShape3D.new()
	shape.radius = 0.27
	shape.height = 1.25
	var collider: CollisionShape3D = CollisionShape3D.new()
	collider.shape = shape
	collider.position.y = 0.625
	add_child(collider)
	_visual = Node3D.new()
	_visual.name = "Facing"
	add_child(_visual)
	# Accepted model already has feet at origin and correct human scale.
	var scene: PackedScene = load("res://assets/michael.glb") as PackedScene
	if scene != null:
		var model: Node = scene.instantiate()
		_visual.add_child(model)
		_animation = _find_animation(model)
		if _animation != null:
			for animation_name: StringName in _animation.get_animation_list():
				for wanted: String in ["Idle", "Run", "Jump"]:
					if String(animation_name).to_lower().contains(wanted.to_lower()):
						_animations[wanted] = animation_name
						if wanted != "Jump":
							_animation.get_animation(animation_name).loop_mode = Animation.LOOP_LINEAR
	carry_socket = Node3D.new()
	carry_socket.name = "CarrySocket"
	carry_socket.position = Vector3(0.0, 0.82, 0.48)
	_visual.add_child(carry_socket)
	_camera_pivot = Node3D.new()
	_camera_pivot.name = "CameraFollow"
	add_child(_camera_pivot)
	_camera_pivot.top_level = true
	_camera_pivot.global_position = global_position + Vector3.UP * 1.05
	_arm = SpringArm3D.new()
	_arm.name = "CameraCollision"
	_arm.spring_length = 5.8
	_arm.margin = 0.18
	_arm.collision_mask = collision_mask
	var camera_shape: SphereShape3D = SphereShape3D.new()
	camera_shape.radius = 0.20
	_arm.shape = camera_shape
	_camera_pivot.add_child(_arm)
	_arm.add_excluded_object(get_rid())
	_camera = Camera3D.new()
	_camera.name = "AdventureCamera"
	_camera.fov = 58.0
	_camera.near = 0.08
	_camera.far = 140.0
	_arm.add_child(_camera)
	_camera.position.z = _arm.spring_length
	_camera.current = true
	_camera_pivot.rotation = Vector3(_pitch, _yaw, 0.0)
	var layer: CanvasLayer = CanvasLayer.new()
	layer.name = "JoystickLayer"
	layer.layer = 2
	add_child(layer)
	_joystick = JoystickDisplay.new()
	_joystick.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_joystick.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	layer.add_child(_joystick)
	get_viewport().size_changed.connect(_clear_input)
	_refresh_joystick()

func set_enabled(value: bool) -> void:
	_enabled = value
	if _animation != null:
		_animation.speed_scale = 1.0 if value else 0.0
	_clear_input()
	velocity.x = 0.0
	velocity.z = 0.0

func queue_jump() -> void:
	if _enabled:
		_jump_buffer = 0.16

func get_camera() -> Camera3D:
	return _camera

func _clear_input() -> void:
	_keys.clear()
	_jump_buffer = 0.0
	_stick_id = -1
	_look_id = -1
	_stick_vector = Vector2.ZERO
	_mouse_look = false
	move_input = Vector2.ZERO
	_refresh_joystick()

func _notification(what: int) -> void:
	if what == NOTIFICATION_APPLICATION_FOCUS_OUT or what == NOTIFICATION_WM_WINDOW_FOCUS_OUT or what == NOTIFICATION_APPLICATION_PAUSED:
		_clear_input()

func _input(event: InputEvent) -> void:
	# Cleanup must run even if GUI consumes releases (including release over buttons).
	# Only already-owned pointer motion is processed here; acquisition is unhandled.
	if event is InputEventKey and not event.pressed:
		_keys.erase(event.physical_keycode)
	if event is InputEventScreenTouch and (not event.pressed or event.canceled):
		if event.index == _stick_id:
			_stick_id = -1
			_stick_vector = Vector2.ZERO
			_refresh_joystick()
		if event.index == _look_id:
			_look_id = -1
	if event is InputEventMouseButton and not event.pressed and event.button_index in [MOUSE_BUTTON_LEFT, MOUSE_BUTTON_RIGHT]:
		_mouse_look = false
	if not _enabled:
		return
	if event is InputEventScreenDrag:
		if event.index == _stick_id:
			_stick_vector = ((event.position - _stick_origin) / JOYSTICK_RADIUS).limit_length()
			_refresh_joystick()
			get_viewport().set_input_as_handled()
		elif event.index == _look_id:
			_rotate_camera(event.relative, 0.005)
			get_viewport().set_input_as_handled()
	if event is InputEventMouseMotion and _mouse_look and event.device != -1:
		_rotate_camera(event.relative, 0.004)
		get_viewport().set_input_as_handled()

func _unhandled_input(event: InputEvent) -> void:
	if not _enabled:
		return
	if event is InputEventKey and event.pressed and not event.echo:
		var key: int = event.physical_keycode
		if key in [KEY_W, KEY_A, KEY_S, KEY_D, KEY_UP, KEY_DOWN, KEY_LEFT, KEY_RIGHT]:
			_keys[key] = true
			get_viewport().set_input_as_handled()
		elif key == KEY_SPACE:
			queue_jump()
			get_viewport().set_input_as_handled()
	# Supports a parent-defined jump action without registering global mappings.
	if InputMap.has_action("jump") and event.is_action_pressed("jump"):
		queue_jump()
		get_viewport().set_input_as_handled()
	if event is InputEventScreenTouch and event.pressed and not event.canceled:
		var size: Vector2 = get_viewport().get_visible_rect().size
		if event.position.x < size.x * 0.45 and event.position.y > size.y * 0.40 and _stick_id == -1:
			_stick_id = event.index
			_stick_origin = event.position
			_stick_vector = Vector2.ZERO
			_refresh_joystick()
			get_viewport().set_input_as_handled()
		elif event.position.x >= size.x * 0.45 and event.position.y > size.y * 0.20 and _look_id == -1:
			_look_id = event.index
			get_viewport().set_input_as_handled()
	if event is InputEventMouseButton and event.pressed and event.device != -1:
		if event.button_index in [MOUSE_BUTTON_LEFT, MOUSE_BUTTON_RIGHT]:
			_mouse_look = true
			get_viewport().set_input_as_handled()

func _rotate_camera(relative: Vector2, sensitivity: float) -> void:
	_yaw -= relative.x * sensitivity
	_pitch = clampf(_pitch - relative.y * sensitivity, -1.05, -0.12)

func _refresh_joystick() -> void:
	if is_instance_valid(_joystick):
		var viewport_size: Vector2 = get_viewport().get_visible_rect().size
		var resting_origin := Vector2(minf(104.0, viewport_size.x * 0.24), viewport_size.y - (180.0 if viewport_size.x < 440.0 else 112.0))
		_joystick.visible = _enabled
		_joystick.active = _stick_id != -1
		_joystick.origin = _stick_origin if _joystick.active else resting_origin
		_joystick.displacement = _stick_vector * JOYSTICK_RADIUS if _joystick.active else Vector2.ZERO
		_joystick.queue_redraw()

func _physics_process(delta: float) -> void:
	# Pause freezes vertical motion too; preserve velocity to resume the jump.
	if not _enabled:
		return
	var keyboard: Vector2 = Vector2.ZERO
	if _enabled:
		keyboard.x = float(_keys.has(KEY_D) or _keys.has(KEY_RIGHT)) - float(_keys.has(KEY_A) or _keys.has(KEY_LEFT))
		keyboard.y = float(_keys.has(KEY_S) or _keys.has(KEY_DOWN)) - float(_keys.has(KEY_W) or _keys.has(KEY_UP))
		var stick: Vector2 = _stick_vector
		if stick.length() < 0.12:
			stick = Vector2.ZERO
		move_input = (keyboard + stick).limit_length()
	else:
		move_input = Vector2.ZERO
	var direction: Vector3 = Vector3(move_input.x, 0.0, move_input.y).rotated(Vector3.UP, _yaw)
	var speed: float = CARRY_SPEED if carrying else WALK_SPEED
	velocity.x = move_toward(velocity.x, direction.x * speed, 24.0 * delta)
	velocity.z = move_toward(velocity.z, direction.z * speed, 24.0 * delta)
	_coyote = 0.10 if is_on_floor() else maxf(0.0, _coyote - delta)
	_jump_buffer = maxf(0.0, _jump_buffer - delta)
	if not is_on_floor():
		velocity.y -= GRAVITY * delta
	if _jump_buffer > 0.0 and _coyote > 0.0:
		velocity.y = JUMP_SPEED
		_jump_buffer = 0.0
		_coyote = 0.0
	move_and_slide()
	if direction.length_squared() > 0.01:
		# This imported Michael faces +Z (not Godot's conventional -Z).
		_visual.rotation.y = lerp_angle(_visual.rotation.y, atan2(direction.x, direction.z), 1.0 - exp(-14.0 * delta))
	_play_animation("Jump" if not is_on_floor() else ("Run" if Vector2(velocity.x, velocity.z).length() > 0.15 else "Idle"))
	# Positional assistance keeps avatar framed without fighting manual orbit yaw.
	var target: Vector3 = global_position + Vector3.UP * 1.05
	if _camera_pivot.global_position.distance_to(target) > 8.0:
		_camera_pivot.global_position = target
	else:
		_camera_pivot.global_position = _camera_pivot.global_position.lerp(target, 1.0 - exp(-12.0 * delta))
	_camera_pivot.rotation = Vector3(_pitch, _yaw, 0.0)

func _find_animation(node: Node) -> AnimationPlayer:
	if node is AnimationPlayer:
		return node as AnimationPlayer
	for child: Node in node.get_children():
		var found: AnimationPlayer = _find_animation(child)
		if found != null:
			return found
	return null

func _play_animation(wanted: String) -> void:
	if _animation == null or not _animations.has(wanted):
		return
	var clip: StringName = _animations[wanted]
	if clip != _current_animation:
		_animation.play(clip, 0.14)
		_current_animation = clip
