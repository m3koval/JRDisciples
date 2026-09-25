"""Decimate Poly Haven CC0 scans and shrink their textures for the iPad build.

blender --background --python optimize_polyhaven.py -- <src.gltf> <out.glb> <target_tris> <texture_px>
"""
import bpy, sys

src, out, target, px = sys.argv[sys.argv.index("--") + 1:]
target, px = int(target), int(px)

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH']
total = sum(len(o.data.polygons) for o in meshes)
ratio = min(1.0, target / max(total, 1))
for o in meshes:
    mod = o.modifiers.new("dec", 'DECIMATE')
    mod.decimate_type = 'COLLAPSE'
    mod.ratio = ratio
    mod.use_collapse_triangulate = True
    bpy.context.view_layer.objects.active = o
    bpy.ops.object.modifier_apply(modifier=mod.name)
for img in bpy.data.images:
    if img.size[0] > px:
        img.scale(px, px)
        img.pack()
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_yup=True,
                          export_image_format='JPEG', export_jpeg_quality=85)
after = sum(len(o.data.polygons) for o in meshes)
print("OPTIMIZED", out, total, "->", after, "tris")
