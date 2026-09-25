"""Headless Blender build of an original drawstring seed-pouch pickup,
replacing the flat two-box placeholder in main.gd (_build_objects()).
Run with: blender --background --python build_seed_pouch.py
No source assets, no paid generation. Flat per-part Base Color materials
(no vertex-color attribute trick needed -- glTF baseColorFactor survives
the export/import round trip natively, unlike a Color-Attribute node).
"""
import bpy, bmesh, math, os, mathutils

GAME = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "game", "trail-of-truth-block-adventure")
OUT = os.path.join(GAME, "assets", "seed_pouch.glb")

def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for block_type in (bpy.data.meshes, bpy.data.materials, bpy.data.images):
        for block in list(block_type):
            if block.users == 0:
                block_type.remove(block)

def flat_material(name, color, roughness=0.85):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    if "Specular IOR Level" in bsdf.inputs:
        bsdf.inputs["Specular IOR Level"].default_value = 0.2
    return mat

def sack_body():
    """Cloth sack: wide gathered belly, cinched neck, small folded-over
    mouth above the tie -- a lathed profile (height bands, not a box)."""
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=3, radius=1.0)

    # Radial profile by normalized height z in [-1,1]: belly wide, waist
    # cinched near the top, small flared mouth above that.
    def profile(z):
        t = (z + 1.0) * 0.5  # 0 at base, 1 at very top
        if t < 0.66:
            # Rounded belly: widest a little below the middle.
            k = t / 0.66
            return 0.60 + 0.44 * math.sin(k * math.pi * 0.78)
        elif t < 0.80:
            # Cinch: pinches in sharply to a narrow gathered neck.
            k = (t - 0.66) / 0.14
            return 0.86 - 0.72 * k
        else:
            # Small bunched cloth poof above the tie, tapering back down
            # (not flaring out wide again) so it reads as a gathered mouth.
            k = (t - 0.80) / 0.20
            return 0.14 + 0.10 * math.sin(k * math.pi) - 0.09 * k

    for v in bm.verts:
        z = v.co.z
        r = math.sqrt(v.co.x * v.co.x + v.co.y * v.co.y)
        if r < 1e-6:
            continue
        target_r = profile(z)
        scale = target_r / max(r, 1e-6)
        v.co.x *= scale
        v.co.y *= scale

    # Soft cloth-fold noise: gentle, not faceted-stone amplitude.
    for i, v in enumerate(bm.verts):
        n = math.sin(v.co.x * 5.1 + v.co.z * 3.3) * 0.02 + math.sin(v.co.y * 6.7 - v.co.z * 2.1) * 0.018
        d = v.co.normalized()
        v.co += d * n

    # A shallow vertical seam crease on one side (stitched edge).
    for v in bm.verts:
        ang = math.atan2(v.co.y, v.co.x)
        seam = math.exp(-((ang - 0.35) ** 2) * 30.0)
        r = math.sqrt(v.co.x ** 2 + v.co.y ** 2)
        if r > 1e-6:
            pull = 1.0 - 0.05 * seam
            v.co.x *= pull
            v.co.y *= pull

    # Flatten the base so it rests on the ground instead of a round point.
    min_z = min(v.co.z for v in bm.verts)
    settle = min_z + 0.12
    for v in bm.verts:
        if v.co.z < settle:
            v.co.z = settle - (settle - v.co.z) * 0.08

    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bmesh.ops.triangulate(bm, faces=bm.faces)
    mesh = bpy.data.meshes.new("PouchBody")
    bm.to_mesh(mesh)
    bm.free()
    mesh.update()
    obj = bpy.data.objects.new("PouchBody", mesh)
    bpy.context.collection.objects.link(obj)
    mat = flat_material("BurlapMat", (0.80, 0.66, 0.40), roughness=0.92)
    obj.data.materials.append(mat)
    return obj

def tie_rope(z_height, radius, tube_radius):
    bm = bmesh.new()
    bmesh.ops.create_circle(bm, cap_ends=False, radius=1.0, segments=24)
    # Build a torus manually by sweeping a small circle around the big one.
    big_segs = 24
    small_segs = 8
    verts = []
    for i in range(big_segs):
        a = i / big_segs * math.tau
        cx, cy = math.cos(a) * radius, math.sin(a) * radius
        ring = []
        for j in range(small_segs):
            b = j / small_segs * math.tau
            ox = math.cos(a) * math.cos(b) * tube_radius
            oy = math.sin(a) * math.cos(b) * tube_radius
            oz = math.sin(b) * tube_radius
            ring.append(bm.verts.new((cx + ox, cy + oy, z_height + oz)))
        verts.append(ring)
    bm.verts.ensure_lookup_table()
    for i in range(big_segs):
        ni = (i + 1) % big_segs
        for j in range(small_segs):
            nj = (j + 1) % small_segs
            a, b, c, d = verts[i][j], verts[ni][j], verts[ni][nj], verts[i][nj]
            bm.faces.new((a, b, c, d))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bmesh.ops.triangulate(bm, faces=bm.faces)
    mesh = bpy.data.meshes.new("PouchTie")
    bm.to_mesh(mesh)
    bm.free()
    mesh.update()
    obj = bpy.data.objects.new("PouchTie", mesh)
    bpy.context.collection.objects.link(obj)
    mat = flat_material("RopeMat", (0.34, 0.24, 0.15), roughness=0.85)
    obj.data.materials.append(mat)
    return obj

def leaf(seed_x, seed_y, seed_z, yaw, lean, s):
    bm = bmesh.new()
    pts = [(0, 0, 0), (0.18 * s, 0.12 * s, 0.55 * s), (0, 0, 1.0 * s), (-0.18 * s, 0.12 * s, 0.55 * s)]
    vs = [bm.verts.new(p) for p in pts]
    face = bm.faces.new(vs)
    ext = bmesh.ops.extrude_face_region(bm, geom=[face])
    for e in ext["geom"]:
        if isinstance(e, bmesh.types.BMVert):
            e.co.y += 0.03 * s
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bmesh.ops.triangulate(bm, faces=bm.faces)
    mesh = bpy.data.meshes.new("PouchLeaf")
    bm.to_mesh(mesh)
    bm.free()
    mesh.update()
    obj = bpy.data.objects.new("PouchLeaf", mesh)
    bpy.context.collection.objects.link(obj)
    mat = flat_material("LeafMat", (0.42, 0.60, 0.30), roughness=0.7)
    obj.data.materials.append(mat)
    obj.location = (seed_x, seed_y, seed_z)
    obj.rotation_euler = (math.radians(lean), 0, math.radians(yaw))
    return obj

def main():
    clear_scene()
    body = sack_body()
    # Cinch waist sits at t=.80 in the [-1,1]-mapped z used by profile().
    cinch_z = 0.80 * 2.0 - 1.0
    tie = tie_rope(z_height=cinch_z, radius=0.155, tube_radius=0.035)
    l1 = leaf(0.10, 0.30, cinch_z + 0.10, 18, 8, 0.30)
    l2 = leaf(-0.05, 0.31, cinch_z + 0.02, -14, 10, 0.26)

    objs = [body, tie, l1, l2]
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = body
    bpy.ops.export_scene.gltf(
        filepath=OUT,
        use_selection=True,
        export_format='GLB',
        export_yup=True,
        export_apply=True,
        export_materials='EXPORT',
    )
    tris = sum(len(o.data.polygons) for o in objs)
    print("EXPORTED", OUT, "tris=", tris)


main()
