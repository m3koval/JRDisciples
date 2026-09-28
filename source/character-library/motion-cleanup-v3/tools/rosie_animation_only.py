import bpy,json
from pathlib import Path
R=Path('/home/helper/jd_motion_cleanup');S=Path('/home/helper/work/JRDisciples/source/character-library/revision-v2/rosie');O=R/'rosie-animation-only';O.mkdir(exist_ok=True)
exec(compile(Path('/home/helper/jd_character_revision/optimized/build.py').read_text().split('args=sys.argv')[0],'helpers','exec'))
report={}
for kind in ['walk','run']:
 meshes=load(S/(kind+'.glb'));old_objects=set(bpy.context.scene.objects);arm=next(o for o in old_objects if o.type=='ARMATURE')
 bpy.ops.import_scene.gltf(filepath=str(R/'rosie'/(kind+'.glb')));new_objects=set(bpy.context.scene.objects)-old_objects;new_arm=next(o for o in new_objects if o.type=='ARMATURE');action=new_arm.animation_data.action;slot=new_arm.animation_data.action_slot
 arm.animation_data.action=action;arm.animation_data.action_slot=slot
 for o in new_objects:bpy.data.objects.remove(o,do_unlink=True)
 for a in list(bpy.data.actions):
  if a!=action:bpy.data.actions.remove(a)
 bpy.ops.object.select_all(action='DESELECT');arm.select_set(True)
 for o in meshes:o.select_set(True)
 out=O/(kind+'.glb');bpy.ops.export_scene.gltf(filepath=str(out),export_format='GLB',use_selection=True,export_animations=True,export_animation_mode='ACTIONS',export_skins=True,export_all_influences=True,export_image_format='AUTO',export_force_sampling=True,export_optimize_animation_size=False)
 meshes=load(out);a=bpy.data.actions[0];start,end=a.frame_range;frame(start);cam,target,h,z=render_setup(meshes);bpy.context.scene.cycles.samples=3;bpy.context.scene.render.resolution_x=288;bpy.context.scene.render.resolution_y=384
 for tag,phase in [('quarter',.25),('threequarter',.75)]:frame(start+(end-start)*phase);render(cam,target,h,O/(kind+'-'+tag+'.png'))
 report[kind]=glb_metrics(out)
(O/'structural.json').write_text(json.dumps(report,indent=2))
