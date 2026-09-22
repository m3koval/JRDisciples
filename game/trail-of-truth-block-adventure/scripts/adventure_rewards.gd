extends RefCounted
## Lifetime chapter souvenirs, never a measure of faith or a spendable currency.
const VALUES := {"tracks": 10, "bridge": 20, "lamb": 20, "rescue": 50, "garden": 30}
const CAP := 130
const COLORS := {"blue": Color("568bc7"), "gold": Color("e9bb57"), "green": Color("75a96a")}
var earned: Dictionary = {}
var banner_color := ""

func award(id: String) -> int:
    if not VALUES.has(id) or earned.has(id):
        return 0
    earned[id] = true
    return VALUES[id]

func total() -> int:
    var result := 0
    for id in VALUES:
        if earned.has(id):
            result += int(VALUES[id])
    return result

func choose_banner(id: String) -> bool:
    if not earned.has("rescue") or not COLORS.has(id):
        return false
    banner_color = id
    return true

func load_save(data: Variant) -> void:
    earned.clear()
    banner_color = ""
    if not data is Dictionary:
        return
    var rewards: Variant = data.get("rewards")
    if rewards is Dictionary:
        var flags: Variant = rewards.get("earned")
        if flags is Dictionary:
            for id in VALUES:
                if flags.get(id) is bool and flags.get(id) == true:
                    award(id)
    # Existing completed saves prove the mandatory route, not an optional garden.
    if data.get("rescued") is bool and data.get("rescued") == true:
        for id in ["tracks", "bridge", "lamb", "rescue"]:
            award(id)
    if data.get("garden") is bool and data.get("garden") == true:
        award("garden")
    if rewards is Dictionary and rewards.get("banner_color") is String:
        choose_banner(rewards["banner_color"])

func snapshot() -> Dictionary:
    return {"version": 1, "earned": earned.duplicate(), "banner_color": banner_color}
