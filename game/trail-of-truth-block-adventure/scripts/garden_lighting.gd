extends RefCounted
## Scene-scoped daylight preset; restore previous lighting when leaving chapter.
var saved: Dictionary = {}
var active := false
func apply(host: Node, enabled: bool) -> void:
    if enabled == active: return
    active = enabled
    var sun: DirectionalLight3D = host.find_child("LateAfternoonSun",true,false) as DirectionalLight3D
    if sun == null: return
    var environments: Array[Node] = host.find_children("*","WorldEnvironment",true,false)
    if enabled:
        saved = {"energy":sun.light_energy,"color":sun.light_color,"rotation":sun.rotation_degrees,"range":sun.directional_shadow_max_distance,"bias":sun.shadow_bias,"normal":sun.shadow_normal_bias}
        sun.light_energy = .65
        sun.light_color = Color("fff0d2")
        sun.rotation_degrees = Vector3(-52,-34,0)
        sun.directional_shadow_max_distance = 38.0
        sun.shadow_bias = .04
        sun.shadow_normal_bias = .65
        if not environments.is_empty():
            var env: Environment = (environments[0] as WorldEnvironment).environment
            saved["environment"] = env
            saved["ambient"] = env.ambient_light_energy
            saved["exposure"] = env.tonemap_exposure
            saved["background"] = env.background_color
            env.ambient_light_energy = .35
            env.tonemap_exposure = .7
            env.background_color = Color("a8c8ce")
    elif not saved.is_empty():
        sun.light_energy = saved.energy
        sun.light_color = saved.color
        sun.rotation_degrees = saved.rotation
        sun.directional_shadow_max_distance = saved.range
        sun.shadow_bias = saved.bias
        sun.shadow_normal_bias = saved.normal
        if saved.has("environment"):
            var env: Environment = saved.environment
            env.ambient_light_energy = saved.ambient
            env.tonemap_exposure = saved.exposure
            env.background_color = saved.background
