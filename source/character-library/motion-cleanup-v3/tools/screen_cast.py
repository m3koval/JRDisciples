import bpy,json,math
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
S=Path('/home/helper/work/JRDisciples/source/character-library/revision-v2');R=Path('/home/helper/jd_motion_cleanup');R.mkdir(exist_ok=True)
N=['michael','gracie','simeon','anna','tobias']
results={'method':'Every integer frame at 30 fps. Sole regions >0.5 foot/toe weights; hand regions >0.5 hand weights. Triangle surface overlap with torso/leg dominant-weight regions; excludes forearms and boundary-crossing triangles. Not volumetric cloth simulation.','characters':{}}
for name in N:
 results['characters'][name]={}
 for kind in ['walk','run']:
  bpy.ops.wm.read_factory_settings(use_empty=True);bpy.context.scene.render.fps=30;bpy.ops.import_scene.gltf(filepath=str(S/name/(kind+'.glb')))
  arm=next(o for o in bpy.context.scene.objects if o.type=='ARMATURE');ob=next(o for o in bpy.context.scene.objects if o.type=='MESH' and any(m.type=='ARMATURE' for m in o.modifiers));act=next(iter(bpy.data.actions));start,end=map(round,act.frame_range)
  groups={g.index:g.name for g in ob.vertex_groups};regions={'body':set(),'LeftHand':set(),'RightHand':set(),'LeftFoot':set(),'RightFoot':set()}
  for v in ob.data.vertices:
   w={groups[g.group]:g.weight for g in v.groups};dominant=max(w,key=w.get) if w else ''
   if dominant not in ['Head','head_end','headfront','neck','LeftShoulder','RightShoulder','LeftArm','RightArm','LeftForeArm','RightForeArm','LeftHand','RightHand']:regions['body'].add(v.index)
   for side in ['Left','Right']:
    if w.get(side+'Hand',0)>.5:regions[side+'Hand'].add(v.index)
    if w.get(side+'Foot',0)+w.get(side+'ToeBase',0)>.5:regions[side+'Foot'].add(v.index)
  polys={key:[list(p.vertices) for p in ob.data.polygons if all(i in ids for i in p.vertices)] for key,ids in regions.items() if key in ['body','LeftHand','RightHand']}
  samples=[]
  for f in range(start,end+1):
   bpy.context.scene.frame_set(f);dg=bpy.context.evaluated_depsgraph_get();ev=ob.evaluated_get(dg);verts=[ob.matrix_world@v.co for v in ev.data.vertices]
   body=BVHTree.FromPolygons(verts,polys['body'],all_triangles=True)
   row={'frame':f,'feet':{},'hand_body_triangle_overlaps':{}}
   for side in ['Left','Right']:
    foot=[verts[i] for i in regions[side+'Foot']];mn=min(v.z for v in foot);sole=[v for v in foot if v.z<mn+.01];center=sum(sole,Vector())/len(sole)
    row['feet'][side]={'min_z':mn,'sole_center':list(center)}
    bvh=BVHTree.FromPolygons(verts,polys[side+'Hand'],all_triangles=True);row['hand_body_triangle_overlaps'][side]=len(bvh.overlap(body))
   samples.append(row)
  mins=[min(row['feet'][s]['min_z'] for s in ['Left','Right']) for row in samples]
  results['characters'][name][kind]={'frames':[start,end],'sample_count':len(samples),'lower_sole_range':[min(mins),max(mins)],'hand_collision_frames':sum(any(v>0 for v in row['hand_body_triangle_overlaps'].values()) for row in samples),'max_overlap_pairs':max(sum(row['hand_body_triangle_overlaps'].values()) for row in samples),'samples':samples}
  (R/'cast-screen.json').write_text(json.dumps(results,indent=2));print(name,kind,'sole_range',min(mins),max(mins),'hand_collision_frames',results['characters'][name][kind]['hand_collision_frames'],flush=True)
