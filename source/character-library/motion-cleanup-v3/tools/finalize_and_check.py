import bpy,json,shutil
from pathlib import Path
exec(compile(Path('/home/helper/jd_character_revision/optimized/build.py').read_text().split('args=sys.argv')[0],'helpers','exec'))
R=Path('/home/helper/jd_motion_cleanup');D=R/'final';D.mkdir(exist_ok=True)
for n in ['michael','gracie','simeon','anna','tobias']:
 (D/n).mkdir(exist_ok=True)
 for k in ['walk','run']:shutil.copy2(R/'selected'/n/(k+'.glb'),D/n/(k+'.glb'))
for n,folder in [('rosie','rosie-repaired'),('joseph','joseph-envelope')]:
 out=D/n;out.mkdir(exist_ok=True);shutil.copy2(R/folder/'rig.glb',out/'rig.glb')
 for k in ['walk','run']:
  bpy.ops.wm.read_factory_settings(use_empty=True);bpy.context.scene.render.fps=60;bpy.ops.import_scene.gltf(filepath=str(R/folder/(k+'.glb')))
  arm=next(o for o in bpy.context.scene.objects if o.type=='ARMATURE');ob=next(o for o in bpy.context.scene.objects if o.type=='MESH' and any(m.type=='ARMATURE' for m in o.modifiers));act=arm.animation_data.action;start,end=map(round,act.frame_range);feet=[]
  for v in ob.data.vertices:
   if sum(g.weight for g in v.groups if ob.vertex_groups[g.group].name in ['LeftFoot','RightFoot','LeftToeBase','RightToeBase'])>.5:feet.append(v.index)
  baked=[]
  for f in range(start,end+1):
   bpy.context.scene.frame_set(f);dg=bpy.context.evaluated_depsgraph_get();vs=ob.evaluated_get(dg).data.vertices;z=min((ob.matrix_world@vs[i].co).z for i in feet);delta=-z if k=='walk' else max(0,-z);hip=arm.pose.bones['Hips'];world=arm.matrix_world@hip.matrix;world.translation.z+=delta;hip.matrix=arm.matrix_world.inverted()@world;bpy.context.view_layer.update();baked.append((f,hip.location.copy()))
  for f,loc in baked:hip.location=loc;hip.keyframe_insert(data_path='location',frame=f)
  bpy.ops.object.select_all(action='DESELECT');arm.select_set(True);ob.select_set(True);bpy.ops.export_scene.gltf(filepath=str(out/(k+'.glb')),export_format='GLB',use_selection=True,export_animations=True,export_animation_mode='ACTIONS',export_skins=True,export_all_influences=True,export_force_sampling=True,export_optimize_animation_size=False,export_image_format='AUTO')
src=(R/'screen_cast.py').read_text().replace("S=Path('/home/helper/work/JRDisciples/source/character-library/revision-v2')","S=Path('/home/helper/jd_motion_cleanup/final')").replace("N=['michael','gracie','simeon','anna','tobias']","N=['michael','rosie','joseph','gracie','simeon','anna','tobias']").replace('for f in range(start,end+1):','for tick in range(start*2,end*2+1):\n   f=tick/2').replace('bpy.context.scene.frame_set(f);','bpy.context.scene.frame_set(int(f),subframe=f-int(f));').replace("'cast-screen.json'","'final-screen.json'")
src=src.replace("'frames':[start,end]","'region_vertex_counts':{key:len(val) for key,val in regions.items()},'bones':len(arm.data.bones),'unweighted_vertices':sum(not any(g.weight>0 for g in v.groups) for v in ob.data.vertices),'frames':[start,end]")
exec(compile(src,'final_scan','exec'))
