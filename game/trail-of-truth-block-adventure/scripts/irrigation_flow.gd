extends RefCounted
## Educational lumped storage network, NOT CFD or an irrigation sizing tool.
## SI: m, m², m³, s. Conductance is an empirical m²/s parameter.
const MAX_VALUE := 1.0e6
const MAX_SUBSTEPS := 10000
var _cells: Array[Dictionary] = []
var _links: Array[Dictionary] = []
var initial_m3 := 0.0
var source_m3 := 0.0
var sink_m3 := 0.0
var overflow_out_m3 := 0.0
var last_error := ""

func _valid(x: float, low: float = 0.0, high: float = MAX_VALUE) -> bool:
	return is_finite(x) and x >= low and x <= high

func _fail(message: String) -> bool:
	last_error = message
	return false

func _id(i: int) -> bool:
	return i >= 0 and i < _cells.size()

# Rectangular, horizontal storage cell: plan area = length * width;
# cross-section = width * water depth. Subdivide a sloping row into cells.
func add_cell(bed_m: float, length_m: float, width_m: float, bank_depth_m: float,
		water_m3: float = 0.0, soil_capacity_m3: float = 0.0,
		infiltration_m_s: float = 0.0) -> int:
	if not _valid(bed_m, -MAX_VALUE) or not _valid(length_m, 0.0001) or not _valid(width_m, 0.0001) or not _valid(bank_depth_m, 0.0001):
		_fail("Invalid cell geometry")
		return -1
	var area := length_m * width_m
	var capacity := area * bank_depth_m
	if not _valid(capacity, 0.00000001) or not _valid(water_m3, 0.0, capacity) or not _valid(soil_capacity_m3) or not _valid(infiltration_m_s):
		_fail("Invalid cell storage or infiltration")
		return -1
	_cells.append({"bed": bed_m, "area": area, "width": width_m, "capacity": capacity,
		"rim": bed_m + bank_depth_m, "water": water_m3, "soil": 0.0,
		"soil_capacity": soil_capacity_m3, "infiltration": infiltration_m_s,
		"overflow": -1, "source": 0.0, "drain": 0.0, "drain_sill": bed_m})
	initial_m3 += water_m3
	return _cells.size() - 1

# -1 is an explicit external spill boundary; descending rims prevent cycles
# and prevent spill being deposited above the supplying water surface.
func set_overflow(cell: int, catchment: int) -> bool:
	if not _id(cell) or (catchment != -1 and not _id(catchment)):
		return _fail("Invalid overflow target")
	if catchment != -1 and _cells[catchment].rim >= _cells[cell].rim:
		return _fail("Overflow catchment rim must be lower")
	_cells[cell].overflow = catchment
	return true

func add_link(a: int, b: int, sill_m: float, conductance_m2_s: float,
		opening: float = 1.0, one_way: bool = false) -> int:
	if not _id(a) or not _id(b) or a == b or not _valid(sill_m, -MAX_VALUE) or not _valid(conductance_m2_s) or not _valid(opening, 0.0, 1.0):
		_fail("Invalid link")
		return -1
	_links.append({"a": a, "b": b, "sill": maxf(sill_m, maxf(_cells[a].bed, _cells[b].bed)),
		"k": conductance_m2_s, "opening": opening, "broken": false, "one_way": one_way})
	return _links.size() - 1

func set_opening(link: int, opening: float) -> bool:
	if link < 0 or link >= _links.size() or not _valid(opening, 0.0, 1.0):
		return _fail("Invalid opening")
	_links[link].opening = opening
	return true

func set_broken(link: int, broken: bool) -> bool:
	if link < 0 or link >= _links.size():
		return _fail("Invalid broken link")
	_links[link].broken = broken
	return true

# Prescribed inflow is an EXTERNAL supply, not a gravity connection or pump.
# Drain is a one-way free outfall; no river tailwater is represented here.
func set_boundary(cell: int, inflow_m3_s: float, drain_m3_s: float = 0.0,
		drain_sill_m: float = -MAX_VALUE) -> bool:
	if not _id(cell) or not _valid(inflow_m3_s) or not _valid(drain_m3_s) or not _valid(drain_sill_m, -MAX_VALUE):
		return _fail("Invalid boundary")
	_cells[cell].source = inflow_m3_s
	_cells[cell].drain = drain_m3_s
	_cells[cell].drain_sill = maxf(drain_sill_m, _cells[cell].bed)
	return true

func cell_state(cell: int) -> Dictionary:
	if not _id(cell):
		return {}
	var result: Dictionary = _cells[cell].duplicate(true)
	result["head_m"] = result.bed + result.water / result.area
	result["cross_section_m2"] = result.width * result.water / result.area
	return result

func stored_m3() -> float:
	var total := 0.0
	for c in _cells:
		total += c.water + c.soil
	return total

func balance_error_m3() -> float:
	return initial_m3 + source_m3 - sink_m3 - overflow_out_m3 - stored_m3()

func _spill(cell: int, amount: float) -> void:
	var target: int = _cells[cell].overflow
	while amount > 0.0 and target != -1:
		var room: float = maxf(0.0, _cells[target].capacity - _cells[target].water)
		var accepted := minf(room, amount)
		_cells[target].water += accepted
		amount -= accepted
		target = _cells[target].overflow
	overflow_out_m3 += amount

func _limit_capacity() -> void:
	for i in range(_cells.size()):
		var excess: float = maxf(0.0, _cells[i].water - _cells[i].capacity)
		_cells[i].water -= excess
		_spill(i, excess)

# Reject rather than silently truncate an unreasonable requested interval.
func step(seconds: float) -> bool:
	if not _valid(seconds):
		return _fail("Invalid timestep")
	if seconds == 0.0:
		return true
	var stiffness: Array[float] = []
	stiffness.resize(_cells.size())
	stiffness.fill(0.0)
	for e in _links:
		if not e.broken:
			stiffness[e.a] += e.k * e.opening / _cells[e.a].area
			stiffness[e.b] += e.k * e.opening / _cells[e.b].area
	var max_dt := 0.05
	for rate in stiffness:
		if rate > 0.0:
			max_dt = minf(max_dt, 0.2 / rate)
	if seconds / max_dt > MAX_SUBSTEPS:
		return _fail("Timestep needs too many substeps")
	var count := maxi(1, int(ceil(seconds / max_dt)))
	var dt := seconds / count
	for unused in range(count):
		_substep(dt)
	return true

func _substep(dt: float) -> void:
	for c in _cells:
		var supplied: float = c.source * dt
		c.water += supplied
		source_m3 += supplied
	_limit_capacity()
	var outgoing: Array[float] = []
	outgoing.resize(_cells.size())
	outgoing.fill(0.0)
	var transfers: Array[Dictionary] = []
	for e in _links:
		if e.broken or e.opening == 0.0:
			continue
		var a: Dictionary = _cells[e.a]
		var b: Dictionary = _cells[e.b]
		var ha: float = maxf(0.0, a.bed + a.water / a.area - e.sill)
		var hb: float = maxf(0.0, b.bed + b.water / b.area - e.sill)
		var amount: float = e.k * e.opening * (ha - hb) * dt
		if e.one_way and amount < 0.0:
			continue
		var donor: int = e.a if amount >= 0.0 else e.b
		var receiver: int = e.b if amount >= 0.0 else e.a
		amount = absf(amount)
		outgoing[donor] += amount
		transfers.append({"from": donor, "to": receiver, "amount": amount})
	var available: Array[float] = []
	for c in _cells:
		available.append(c.water)
	var remaining := available.duplicate()
	for transfer in transfers:
		var donor: int = transfer.from
		var scale := 1.0
		if outgoing[donor] > available[donor]:
			scale = available[donor] / outgoing[donor]
		# Final min handles floating-point roundoff in many donor transfers.
		var amount: float = minf(remaining[donor], transfer.amount * scale)
		remaining[donor] -= amount
		_cells[donor].water -= amount
		_cells[transfer.to].water += amount
	_limit_capacity()
	for c in _cells:
		var soaked: float = minf(c.water, minf(c.infiltration * c.area * dt, c.soil_capacity - c.soil))
		c.water -= soaked
		c.soil += soaked
		var drainable: float = maxf(0.0, c.water - (c.drain_sill - c.bed) * c.area)
		var drained: float = minf(drainable, c.drain * dt)
		c.water -= drained
		sink_m3 += drained
