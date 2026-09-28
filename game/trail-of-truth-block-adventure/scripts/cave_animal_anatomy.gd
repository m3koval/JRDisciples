extends RefCounted
## Original authored cross-section anatomy; no external assets or textures.
## Each profile is (longitudinal z, center y, half width, half height).
## Keep species forms intentional: feline waist / ursine shoulder hump and snout.
static func torso(bear: bool) -> Array:
    if bear:
        return [Vector4(-.92,.88,.04,.09),Vector4(-.83,.91,.24,.24),
            Vector4(-.65,.96,.43,.34),Vector4(-.40,.97,.49,.37),
            Vector4(-.14,.97,.49,.37),Vector4(.10,1.04,.50,.43),
            Vector4(.32,1.06,.49,.45),Vector4(.49,1.01,.42,.39),
            Vector4(.64,.98,.30,.30),Vector4(.76,1.02,.17,.20)]
    return [Vector4(-.91,.94,.05,.09),Vector4(-.81,.95,.23,.22),
        Vector4(-.63,.97,.36,.29),Vector4(-.44,1.0,.35,.27),
        Vector4(-.20,1.01,.29,.23),Vector4(.02,.98,.32,.29),
        Vector4(.24,.96,.40,.35),Vector4(.43,.95,.40,.35),
        Vector4(.60,1.0,.29,.28),Vector4(.72,1.07,.17,.20)]

static func face(bear: bool) -> Array:
    if bear:
        return [Vector4(-.12,.10,.14,.19),Vector4(.02,.14,.27,.26),
            Vector4(.18,.13,.32,.26),Vector4(.31,.09,.28,.23),
            Vector4(.42,.015,.21,.17),Vector4(.56,-.055,.16,.115),
            Vector4(.69,-.055,.13,.10)]
    return [Vector4(-.06,.10,.13,.19),Vector4(.06,.14,.27,.27),
        Vector4(.23,.12,.32,.27),Vector4(.37,.065,.29,.22),
        Vector4(.45,.01,.23,.17),Vector4(.53,-.05,.19,.115)]

static func limb(front: bool, bear: bool, lower: bool) -> Array:
    # Authored longitudinal anatomy, later rotated onto the downward leg axis.
    # Off-axis centers form the elbow / calf rather than a straight sausage.
    if lower:
        return [Vector4(-.16,0,.085,.09),Vector4(-.12,0,.11 if bear else .085,.10),
            Vector4(-.04,-.018,.105 if bear else .073,.085),
            Vector4(.065,-.025,.09 if bear else .067,.074),Vector4(.15,0,.09,.08)]
    return [Vector4(-.27,0,.10,.11),Vector4(-.20,.025,.19 if bear else .16,.19 if front else .22),
        Vector4(-.08,.01,.17 if bear else .135,.17 if front else .20),
        Vector4(.06,-.02,.13 if bear else .10,.12),Vector4(.23,0,.10,.10)]

static func paw(bear: bool) -> Array:
    return [Vector4(-.15,.0,.075,.045),Vector4(-.10,.0,.13 if bear else .115,.070),
        Vector4(.02,-.008,.16 if bear else .14,.067),
        Vector4(.14,-.012,.15 if bear else .135,.060),Vector4(.22,-.014,.095,.04)]
