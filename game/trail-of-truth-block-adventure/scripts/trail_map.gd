extends Control
## North-up X/Z map of world.gd (negative Z is up). No scene or input bindings.
## Add to the modal/UI, size >= 300x290, and call set_state + set_language.
## Parent owns opening/closing and must disable player while a modal map is open.
## Lamb position is discarded until explicit discovery; search zone is broad.

const WORLD_BOUNDS := Rect2(-22.0, -17.0, 45.0, 34.0)
const CAMP := Vector3(-11.0, 0.0, 7.0)
const SEARCH_AREA := Rect2(9.0, -12.0, 12.0, 11.0)
var _language: String = "en"
var _player_position := CAMP
var _bridge_stage: int = 0
var _lamb_discovered: bool = false
var _lamb_position := Vector3.ZERO
var _rescued: bool = false

func _init() -> void:
	custom_minimum_size = Vector2(300, 290)
	# Map clicks must not become camera drags or joystick presses underneath.
	mouse_filter = Control.MOUSE_FILTER_STOP
	clip_contents = true

func _ready() -> void:
	resized.connect(queue_redraw)
	queue_redraw()

func set_language(language: String) -> void:
	_language = "ru" if language == "ru" else "en"
	queue_redraw()

func set_state(player_position: Vector3, bridge_stage: int, lamb_discovered: bool = false, lamb_position: Vector3 = Vector3.ZERO, rescued: bool = false) -> void:
	_player_position = player_position
	_bridge_stage = clampi(bridge_stage, 0, 2)
	_lamb_discovered = lamb_discovered
	_lamb_position = lamb_position if lamb_discovered else Vector3.ZERO
	_rescued = rescued
	queue_redraw()

func _t(en: String, ru: String) -> String:
	return ru if _language == "ru" else en

func map_rect() -> Rect2:
	# Uniform scale prevents the river width / crossing geometry being distorted.
	var available := Vector2(maxf(1, size.x - 32), maxf(1, size.y - 96))
	var scale_factor: float = minf(available.x / WORLD_BOUNDS.size.x, available.y / WORLD_BOUNDS.size.y)
	var extent: Vector2 = WORLD_BOUNDS.size * scale_factor
	return Rect2(Vector2((size.x - extent.x) * 0.5, 42 + (available.y - extent.y) * 0.5), extent)

func world_to_map(world_position: Vector3) -> Vector2:
	var rect: Rect2 = map_rect()
	return rect.position + (Vector2(world_position.x, world_position.z) - WORLD_BOUNDS.position) / WORLD_BOUNDS.size * rect.size

func _world_rect(rect: Rect2, color: Color, filled: bool = true) -> void:
	var start: Vector2 = world_to_map(Vector3(rect.position.x, 0, rect.position.y))
	var end: Vector2 = world_to_map(Vector3(rect.end.x, 0, rect.end.y))
	draw_rect(Rect2(start, end - start), color, filled, -1.0 if filled else 1.5)

func _text(at: Vector2, text: String, font_size: int = 14, color: Color = Color("f9edcf")) -> void:
	draw_string(ThemeDB.fallback_font, at, text, HORIZONTAL_ALIGNMENT_LEFT, -1, font_size, color)

func _tag(at: Vector2, text: String) -> void:
	var extent: Vector2 = ThemeDB.fallback_font.get_string_size(text, HORIZONTAL_ALIGNMENT_LEFT, -1, 14)
	var origin := Vector2(clampf(at.x - extent.x * 0.5, 6, size.x - extent.x - 6), at.y)
	draw_rect(Rect2(origin + Vector2(-4, -15), Vector2(extent.x + 8, 20)), Color(0.06, 0.16, 0.13, 0.9))
	_text(origin, text)

func _draw() -> void:
	var panel := StyleBoxFlat.new()
	panel.bg_color = Color("183c33")
	panel.border_color = Color("d8bc7f")
	panel.set_border_width_all(2)
	panel.set_corner_radius_all(14)
	draw_style_box(panel, Rect2(Vector2.ZERO, size))
	_text(Vector2(16, 27), _t("Clearing map", "Карта поляны"), 20)
	_text(Vector2(size.x - 38, 27), _t("N", "С"), 14)
	var rect: Rect2 = map_rect()
	draw_rect(rect, Color("78945d"))
	_world_rect(Rect2(7.3, -17, 15.7, 34), Color("90aa6c"))
	_world_rect(Rect2(2.7, -17, 4.6, 34), Color("559dba"))
	# Exact path footprints from world.gd, not an invented connecting route.
	for path: Rect2 in [Rect2(-9.1, -1.8, 11.8, 3.6), Rect2(7.3, -1.8, 5.8, 3.6), Rect2(-12.3, -0.9, 3.6, 9), Rect2(11.8, -6.5, 3, 6.6)]:
		_world_rect(path, Color("c4ae7e"))
	_world_rect(Rect2(-15.75, -12.25, 5.5, 4.5), Color("a0835c"))
	if not _lamb_discovered:
		_world_rect(SEARCH_AREA, Color(1, 0.91, 0.50, 0.24))
		_world_rect(SEARCH_AREA, Color("ffe198"), false)
		_tag(world_to_map(Vector3(15, 0, -13)), _t("Search area", "Зона поиска"))
	for stage: int in range(2):
		var crossing := Rect2(2.7 + stage * 2.3, -2, 2.3, 4)
		_world_rect(crossing, Color("e0b777") if stage < _bridge_stage else Color("304f4e"))
		_world_rect(crossing, Color("f4d396"), false)
	_tag(world_to_map(Vector3(5, 0, 4.7)), _t("Bridge %d/2", "Мост %d/2") % _bridge_stage)
	var camp: Vector2 = world_to_map(CAMP)
	draw_colored_polygon(PackedVector2Array([camp + Vector2(-8, 5), camp + Vector2(0, -9), camp + Vector2(8, 5)]), Color("ffe3a3"))
	_tag(camp + Vector2(0, 25), _t("Camp", "Лагерь"))
	if _lamb_discovered:
		var lamb: Vector2 = world_to_map(_lamb_position)
		draw_circle(lamb, 6, Color("fff7e1"))
		draw_arc(lamb, 7, 0, TAU, 24, Color("514433"), 2, true)
		_tag(lamb + Vector2(0, -12), _t("Home!", "Дома!") if _rescued else _t("Lamb", "Ягнёнок"))
	# Draw player last so it stays visible when standing at camp / near the lamb.
	var marker: Vector2 = world_to_map(_player_position).clamp(rect.position, rect.end)
	draw_circle(marker, 8, Color("153e50"))
	draw_circle(marker, 5, Color("7cecff"))
	draw_arc(marker, 8, 0, TAU, 32, Color("e7ffff"), 2, true)
	draw_circle(Vector2(21, size.y - 29), 5, Color("7cecff"))
	_text(Vector2(34, size.y - 24), _t("You · cross at the bridge", "Ты · переходи по мосту"), 14)
