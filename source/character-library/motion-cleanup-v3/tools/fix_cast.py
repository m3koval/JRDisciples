import bpy,math,json,sys
from pathlib import Path
from mathutils import Matrix,Vector
from mathutils.bvhtree import BVHTree
S=Path('/home/helper/work/JRDisciples/source/character-library/revision-v2');R=Path('/home/helper/jd_motion_cleanup/cast-fixed');R.mkdir(parents=True,exist_ok=True)
def load(n,k):
 bpy.ops.wm.read_factory_settings(use_empty=True);bpy.context.scene.render.fps=60;bpy.ops.import_scene.gltf(filepath=str(S/n/(k+'.glb')))
 arm=next(o for o in bpy.context.scene.objects if o.type=='ARMATURE');ob=next(o for o in bpy.context.scene.objects if o.type=='MESH' and any(m.type=='ARMATURE' for m in o.modifiers));a=next(iter(bpy.data.actions));return arm,ob,a

def regions(ob):
 groups={g.index:g.name for g in ob.vertex_groups};reg={'body':set(),'LeftHand':set(),'RightHand':set(),'feet':set()}
 for v in ob.data.vertices:
  w={groups[g.group]:g.weight for g in v.groups};dom=max(w,key=w.get) if w else ''
  if dom not in ['Head','head_end','headfront','neck','LeftShoulder','RightShoulder','LeftArm','RightArm','LeftForeArm','RightForeArm','LeftHand','RightHand']:reg['body'].add(v.index)
  for s in ['Left','Right']:
   if w.get(s+'Hand',0)>.5:reg[s+'Hand'].add(v.index)
  if sum(w.get(g,0) for g in ['LeftFoot','LeftToeBase','RightFoot','RightToeBase'])>.5:reg['feet'].add(v.index)
 polys={k:[list(p.vertices) for p in ob.data.polygons if all(i in ids for i in p.vertices)] for k,ids in reg.items() if k!='feet'}
 return reg,polys

def measure(ob,reg,polys):
 bpy.context.view_layer.update();dg=bpy.context.evaluated_depsgraph_get();verts=[ob.matrix_world@v.co for v in ob.evaluated_get(dg).data.vertices];body=BVHTree.FromPolygons(verts,polys['body'],all_triangles=True)
 contacts={s:len(BVHTree.FromPolygons(verts,polys[s+'Hand'],all_triangles=True).overlap(body)) for s in ['Left','Right']}
 return contacts,min(verts[i].z for i in reg['feet'])

def offset(arm,angle,forearm=0):
 for side in ['Left','Right']:
  bone=arm.pose.bones[side+'Arm'];world=arm.matrix_world@bone.matrix;head=world.translation.copy();sign=1 if head.x>(arm.matrix_world@arm.pose.bones['Hips'].matrix).translation.x else -1
  rot=Matrix.Rotation(math.radians(-sign*angle),4,'Y');bone.matrix=arm.matrix_world.inverted()@Matrix.Translation(head)@rot@Matrix.Translation(-head)@world
 bpy.context.view_layer.update()
 if forearm:
  for side in ['Left','Right']:
   bone=arm.pose.bones[side+'ForeArm'];world=arm.matrix_world@bone.matrix;head=world.translation.copy();sign=1 if head.x>(arm.matrix_world@arm.pose.bones['Hips'].matrix).translation.x else -1
   rot=Matrix.Rotation(math.radians(-sign*forearm),4,'Y');bone.matrix=arm.matrix_world.inverted()@Matrix.Translation(head)@rot@Matrix.Translation(-head)@world
  bpy.context.view_layer.update()

report={}
for name in sys.argv[sys.argv.index('--')+1:]:
 report[name]={};out=R/name;out.mkdir(exist_ok=True)
 for kind in ['walk','run']:
  arm,ob,a=load(name,kind);start,end=map(round,a.frame_range);reg,polys=regions(ob);trials=[]
  for angle,forearm in [(0,0),(4,0),(8,0),(12,0),(8,6),(12,6),(12,12),(16,8),(20,8)]:
   rows=[]
   for f in range(start,end+1):
    bpy.context.scene.frame_set(f);offset(arm,angle,forearm);c,z=measure(ob,reg,polys);rows.append({'frame':f,'overlap_pairs':c,'lower_sole_z':z})
   score=sum(sum(x['overlap_pairs'].values()) for x in rows);trials.append({'angle':angle,'forearm':forearm,'pairs':score,'collision_frames':sum(any(x['overlap_pairs'].values()) for x in rows)})
   if score==0:break
  best=min(trials,key=lambda t:(t['pairs'],t['angle']));angle=best['angle'];forearm=best['forearm'];baked=[]
  for f in range(start,end+1):
   bpy.context.scene.frame_set(f);offset(arm,angle,forearm);c,z=measure(ob,reg,polys)
   # Grounding: walk always retains a support foot; run retains positive airborne phase.
   dz=-z if kind=='walk' else max(0,-z)
   hip=arm.pose.bones['Hips'];world=arm.matrix_world@hip.matrix;world.translation.z+=dz;hip.matrix=arm.matrix_world.inverted()@world;bpy.context.view_layer.update()
   baked.append((f,{s+t:arm.pose.bones[s+t].rotation_quaternion.copy() for s in ['Left','Right'] for t in ['Arm','ForeArm']},hip.location.copy(),dz))
  for f,rots,loc,dz in baked:
   for s,q in rots.items():
    b=arm.pose.bones[s];b.rotation_mode='QUATERNION';b.rotation_quaternion=q;b.keyframe_insert(data_path='rotation_quaternion',frame=f)
   b=arm.pose.bones['Hips'];b.location=loc;b.keyframe_insert(data_path='location',frame=f)
  bpy.ops.object.select_all(action='DESELECT');arm.select_set(True);ob.select_set(True)
  dst=out/(kind+'.glb');bpy.ops.export_scene.gltf(filepath=str(dst),export_format='GLB',use_selection=True,export_animations=True,export_skins=True,export_all_influences=True,export_animation_mode='ACTIONS',export_force_sampling=True,export_frame_step=1,export_optimize_animation_size=False,export_image_format='AUTO')
  report[name][kind]={'trials':trials,'selected_abduction_degrees':angle,'forearm_degrees':forearm,'max_ground_correction':max(abs(x[3]) for x in baked),'status':'candidate_pending_independent_reimport_contact_scan','source':str(S/name/(kind+'.glb')),'output':str(dst)}
  (R/'changes.json').write_text(json.dumps(report,indent=2));print(name,kind,best,flush=True)
