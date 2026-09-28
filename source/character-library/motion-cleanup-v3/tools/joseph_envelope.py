import bpy,json,math
from pathlib import Path
exec(compile(Path('/home/helper/jd_character_revision/optimized/build.py').read_text().split('args=sys.argv')[0],'helpers','exec'))
R=Path('/home/helper/jd_motion_cleanup');O=R/'joseph-envelope';O.mkdir(exist_ok=True);report={}
def smooth(t):t=max(0,min(1,t));return t*t*(3-2*t)
for kind in ['rig','walk','run']:
 meshes=load(R/'joseph-repair'/(kind+'.glb'));o=meshes[0];arm=next(x for x in bpy.context.scene.objects if x.type=='ARMATURE');count=0
 for v in o.data.vertices:
  # Continuous pelvis garment envelope; full binding in belt/pouch band,
  # feathered to original shorts, upper torso and anatomically separate hands.
  x,y,z=v.co;alpha=smooth((z-38)/6)*smooth((69-z)/5)*smooth((25-abs(x))/3)
  # Keep actual arm anatomy out of the garment envelope.
  def segment_distance(p,a,b):
   ab=b-a;t=max(0,min(1,(p-a).dot(ab)/ab.length_squared));return (p-(a+ab*t)).length
  distance=min(segment_distance(v.co,arm.data.bones[side+first].head_local,arm.data.bones[side+second].head_local) for side in ['Left','Right'] for first,second in [('Arm','ForeArm'),('ForeArm','Hand')])
  alpha*=smooth((distance-4)/2)
  if alpha<=0:continue
  old={g.group:g.weight for g in v.groups};hip=o.vertex_groups['Hips'].index
  for g in list(v.groups):o.vertex_groups[g.group].remove([v.index])
  for gi in old.keys()|{hip}:
   w=old.get(gi,0)*(1-alpha)+(alpha if gi==hip else 0)
   if w>0:o.vertex_groups[gi].add([v.index],w,'REPLACE')
  count+=1
 if kind!='rig':
  oldobjects=set(bpy.context.scene.objects);bpy.ops.import_scene.gltf(filepath=str(R/'joseph'/(kind+'.glb')));newobjects=set(bpy.context.scene.objects)-oldobjects;na=next(x for x in newobjects if x.type=='ARMATURE');act=na.animation_data.action;slot=na.animation_data.action_slot;arm.animation_data.action=act;arm.animation_data.action_slot=slot
  for x in newobjects:bpy.data.objects.remove(x,do_unlink=True)
  for a in list(bpy.data.actions):
   if a!=act:bpy.data.actions.remove(a)
 bpy.ops.object.select_all(action='DESELECT');o.select_set(True);arm.select_set(True);out=O/(kind+'.glb');bpy.ops.export_scene.gltf(filepath=str(out),export_format='GLB',use_selection=True,export_animations=kind!='rig',export_animation_mode='ACTIONS',export_skins=True,export_all_influences=True,export_image_format='AUTO',export_force_sampling=True,export_optimize_animation_size=False)
 meshes=load(out);a=bpy.data.actions[0] if bpy.data.actions else None;start,end=a.frame_range if a else (0,0);frame(start);cam,target,h,z=render_setup(meshes);bpy.context.scene.cycles.samples=3;bpy.context.scene.render.resolution_x=288;bpy.context.scene.render.resolution_y=384
 for tag,phase in ([('front',0)] if kind=='rig' else [('quarter',.25),('threequarter',.75)]):frame(start+(end-start)*phase);render(cam,target,h,O/(kind+'-'+tag+'.png'))
 report[kind]={'envelope_vertices':count,'metrics':glb_metrics(out)};(O/'repair.json').write_text(json.dumps(report,indent=2))
