extends RefCounted
## Presentation only. Authored leaf blades, fern pinnae and rooted crevices;
## no spheres, collision, quest state, lights or imported character mutations.
const Shell = preload("res://scripts/cave_shell_art.gd")

static func _mat(color: String) -> StandardMaterial3D:
    var m := StandardMaterial3D.new()
    m.albedo_color = Color(color)
    m.roughness = .94
    m.cull_mode = BaseMaterial3D.CULL_DISABLED
    return m

static func _start() -> SurfaceTool:
    var s := SurfaceTool.new()
    s.begin(Mesh.PRIMITIVE_TRIANGLES)
    return s

static func _leaf(st: SurfaceTool, base: Vector3, tip: Vector3, width: float) -> void:
    var d := tip-base
    var crosswise := Vector3(-d.z,0,d.x).normalized()*width
    var heart := base.lerp(tip,.43)+Vector3(0,width*.42,0)
    Shell._triangle(st,base,heart-crosswise,heart,Vector3.UP)
    Shell._triangle(st,base,heart,heart+crosswise,Vector3.UP)
    Shell._triangle(st,heart-crosswise,tip,heart,Vector3.UP)
    Shell._triangle(st,heart,tip,heart+crosswise,Vector3.UP)

static func _fern(st: SurfaceTool, base: Vector3, size: float, seed: float) -> void:
    for arm in range(7):
        var angle := seed+float(arm)*TAU/7.0
        var direction := Vector3(cos(angle),0,sin(angle))
        var across := Vector3(-direction.z,0,direction.x)
        for pair in range(1,7):
            var t := float(pair)/7.0
            var stem := base+direction*(t*size*.8)+Vector3.UP*sin(t*PI*.83)*size*.65
            var reach := sin(t*PI)*size*.24
            for side in [-1.0,1.0]:
                _leaf(st,stem,stem+across*reach*side+direction*size*.12+Vector3.UP*.025,reach*.27)
        _leaf(st,base+direction*size*.62+Vector3.UP*size*.40,base+direction*size*.88+Vector3.UP*size*.31,size*.045)

static func _grass(st: SurfaceTool, base: Vector3, size: float, seed: float) -> void:
    for blade in range(9):
        var a := seed+float(blade)*2.39996
        var radial := Vector3(cos(a),0,sin(a))
        var foot := base+radial*.065
        var tip := foot+radial*size*.42+Vector3.UP*size*(.65+float(blade%3)*.16)
        _leaf(st,foot,tip,size*.045)

static func build(parent: Node3D, entrances: Array) -> Node3D:
    var root := Node3D.new()
    root.name = "CavePlantedEcology"
    root.set_meta("art_only",true)
    parent.add_child(root)
    var fern := _start()
    var grass := _start()
    var ochre := _start()
    var moss := _start()
    for e: Vector3 in entrances:
        # Plant communities at the foot of stone: the central +/-2m remains bare.
        for side in [-1.0,1.0]:
            for n in range(5):
                var p := e+Vector3(side*(2.8+float(n)*.49),.025,2.35+sin(float(n)*1.7)*.55)
                _fern(fern,p,.68+float(n%3)*.17,float(n)+side)
                for j in range(3):
                    _grass(grass,p+Vector3(side*float(j)*.21,0,.33+float(j)*.14),.24+float(j)*.09,float(n+j))
            # Rock ledge vegetation stays above the entry clearance.
            for n in range(4):
                var p := e+Vector3(side*(2.15+float(n)*.20),4.85+float(n)*.06,-.92)
                _fern(fern,p,.32+float(n%2)*.12,float(n))
        # Moss is a thin crevice-bound ribbon on the apron, not a green blob.
        var mouth := Shell.profile(0,entrances.find(e))
        for k in [3,4,7,8]:
            var a: Vector3 = mouth[k]+e+Vector3(0,.12,-.045)
            var b: Vector3 = a.lerp(mouth[k+1]+e+Vector3(0,.13,-.045),.23)
            Shell._triangle(moss,a,b,a+Vector3(0,.15,-.025),Vector3.BACK)
            Shell._triangle(moss,b,b+Vector3(0,.09,-.018),a+Vector3(0,.15,-.025),Vector3.BACK)
        # Sparse sheltered dry grasses end at the threshold: deep caves stay dark.
        for side in [-1.0,1.0]:
            for n in range(4):
                _grass(ochre,e+Vector3(side*(3.9+float(n%2)*.12),.025,-2.3-float(n)*2.2),.18+float(n%2)*.07,float(n))
    # Camp's green healing marker remains authoritative. A broken planted arc
    # grounds its edge while retaining all approach paths and the fire-pit gap.
    for n in range(13):
        var angle := -.1+float(n)*PI/12.0
        var p := Vector3(100+cos(angle)*3.8,.025,10+sin(angle)*3.0)
        _fern(fern,p,.42,float(n))
        _grass(grass,p+Vector3(.25,0,.15),.31,float(n))
    Shell._surface(root,"ShelteredFernCommunities",fern,_mat("657a39"))
    Shell._surface(root,"SunlitMeadowBlades",grass,_mat("8b9650"))
    Shell._surface(root,"ThresholdDryGrasses",ochre,_mat("a58d58"))
    Shell._surface(root,"MouthCreviceMoss",moss,_mat("607044"))
    return root
