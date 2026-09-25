"""Split a multi-rock scan GLB into one GLB per rock, origin at base center.

blender --background --python split_scan_set.py -- <set.glb> <out_prefix>
"""
import bpy, sys, mathutils

src, prefix = sys.argv[sys.argv.index("--") + 1:]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
rocks = [o for o in bpy.context.scene.objects if o.type == 'MESH']
for o in rocks:
    bpy.context.view_layer.objects.active = o
    o.select_set(True)
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    o.select_set(False)
rocks.sort(key=lambda o: -max(v.co.z for v in o.data.vertices))
for n, o in enumerate(rocks):
    pts = [v.co for v in o.data.vertices]
    base = mathutils.Vector((sum(p.x for p in pts) / len(pts), sum(p.y for p in pts) / len(pts), min(p.z for p in pts)))
    o.data.transform(mathutils.Matrix.Translation(-base))
    o.location = (0, 0, 0)
    bpy.ops.object.select_all(action='DESELECT')
    o.select_set(True)
    out = f"{prefix}_{chr(97 + n)}.glb"
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_yup=True, use_selection=True,
                              export_image_format='JPEG', export_jpeg_quality=85)
    dims = o.dimensions
    print("SPLIT", out, "tris", len(o.data.polygons), "dims", tuple(round(d, 2) for d in dims))
