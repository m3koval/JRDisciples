exec(open('/home/helper/jd_motion_cleanup/rosie/regions.py').read().split("if __name__")[0])
from mathutils import Quaternion
import time
report={}
def setup(o):
 d,dv,ha=regions(o)
 # Exclude sleeves / upper bodice and boundary wrists. Use material-colour dress triangles.
 d=[i for i in d if all((o.matrix_world@o.data.vertices[v].co).z<.82 for v in o.data.polygons[i].vertices)]
 hp={s:[p.index for p in o.data.polygons if all(v in ids for v in p.vertices)] for s,ids in ha.items()}
 return d,dv,ha,hp

def metric(o,reg):
 d,dv,ha,hp=reg;ev=o.evaluated_get(bpy.context.evaluated_depsgraph_get());vs=[o.matrix_world@v.co for v in ev.data.vertices]
 dt=BVHTree.FromPolygons(vs,[list(o.data.polygons[i].vertices) for i in d],all_triangles=True)
 result={}
 for s,ids in ha.items():
  ht=BVHTree.FromPolygons(vs,[list(o.data.polygons[i].vertices) for i in hp[s]],all_triangles=True)
  near=[dt.find_nearest(vs[i]) for i in ids];dist=min(t[3] for t in near if t[0] is not None)
  result[s]={'pairs':len(dt.overlap(ht)),'min_surface_distance':dist}
 return result

def weights(o,dv):
 n=0
 for vi in dv:
  v=o.data.vertices[vi];p=o.matrix_world@v.co
  if p.z>=.69:continue
  # Smooth continuous skirt skin: waist follows pelvis; hem blends both thighs.
  t=max(0,min(1,(.69-p.z)/.34));t=t*t*(3-2*t);leg=.48*t
  left=.5+.5*math.tanh(p.x/.075)
  for g in list(v.groups):o.vertex_groups[g.group].remove([vi])
  for name,w in [('Hips',1-leg),('LeftUpLeg',leg*left),('RightUpLeg',leg*(1-left))]:
   if w>0:o.vertex_groups[name].add([vi],w,'REPLACE')
  n+=1
 return n

def sweep(o,reg,frames):
 rows=[]
 for f in frames:
  frame(f);m=metric(o,reg);rows.append({'frame':f,'hands':m,'pairs':sum(x['pairs'] for x in m.values()),'distance':min(x['min_surface_distance'] for x in m.values())})
 return {'frames':len(rows),'contact_frames':sum(r['pairs']>0 for r in rows),'intersection_pairs_sum':sum(r['pairs'] for r in rows),'minimum_distance':min(r['distance'] for r in rows),'worst':max(rows,key=lambda r:r['pairs']),'samples':rows}

def save(dst):
 bpy.ops.object.select_all(action='DESELECT')
 for ob in bpy.context.scene.objects:
  if ob.type=='ARMATURE' or (ob.type=='MESH' and any(m.type=='ARMATURE' for m in ob.modifiers)):ob.select_set(True)
 bpy.ops.export_scene.gltf(filepath=str(dst),export_format='GLB',use_selection=True,export_animations=True,export_animation_mode='ACTIONS',export_skins=True,export_all_influences=True,export_image_format='AUTO',export_force_sampling=True,export_frame_step=1,export_optimize_animation_size=False,export_anim_slide_to_zero=False,export_lights=False,export_cameras=False)

for kind in ['walk','run','rig']:
 o=load(SRC/(kind+'.glb'))[0];reg=setup(o);arm=next(x for x in bpy.context.scene.objects if x.type=='ARMATURE');acts=list(bpy.data.actions)
 r=list(acts[0].frame_range) if acts else [1,1];frames=[r[0]+i*.5 for i in range(int((r[1]-r[0])*2)+1)]
 info={'regions':{'dress_triangles':len(reg[0]),'hand_triangles':{k:len(v) for k,v in reg[3].items()}},'before':sweep(o,reg,frames)}
 print('BEFORE',kind,info['before']['contact_frames'],info['before']['intersection_pairs_sum'],flush=True)
 if kind!='rig':
  wf=info['before']['worst']['frame'];frame(wf);cam,target,h,z=render_setup([o]);bpy.context.scene.cycles.samples=2;bpy.context.scene.render.resolution_x=288;bpy.context.scene.render.resolution_y=384;render(cam,target,h,OUT/(kind+'_before_worst.png'))
 info['reweighted_vertices']=weights(o,reg[1])
 if acts:
  # Cache original animated quaternions and armature-space local axes before key editing.
  cache={}
  for f in range(int(r[0]),int(r[1])+1):
   frame(f);cache[f]={}
   for s in ['Left','Right']:
    b=arm.pose.bones[s+'Arm'];cache[f][s]=(b.rotation_quaternion.copy(),b.matrix.to_quaternion().inverted()@Vector((0,1,0)))
  trials=[]
  for degrees in [4,8,12]:
   for f,vals in cache.items():
    frame(f)
    for s,(q,axis) in vals.items():
     b=arm.pose.bones[s+'Arm'];b.rotation_mode='QUATERNION';phase=(f-r[0])/(r[1]-r[0])*2*math.pi
     # Gentle cyclical clearance, retains original forward/back swing and elbow animation.
     angle=math.radians(degrees)*(0.85+0.15*math.cos(2*phase));b.rotation_quaternion=q@Quaternion(axis,angle*(-1 if s=='Left' else 1));b.keyframe_insert('rotation_quaternion',frame=f)
   result=sweep(o,reg,frames);trials.append({'degrees':degrees,'contact_frames':result['contact_frames'],'pairs':result['intersection_pairs_sum']});print('TRIAL',kind,trials[-1],flush=True)
   if result['contact_frames']==0:break
  info['arm_trials']=trials;info['after']=result
 else:info['after']=sweep(o,reg,frames)
 save(OUT/(kind+'.glb'));report[kind]=info;(OUT/'metrics.json').write_text(json.dumps(report,indent=2))
 if kind!='rig':
  for tag,f in [('worst',info['after']['worst']['frame']),('before_worst',info['before']['worst']['frame']),('quarter',r[0]+(r[1]-r[0])*.25),('threequarter',r[0]+(r[1]-r[0])*.75)]:
   frame(f);render(cam,target,h,OUT/(kind+'_after_'+tag+'.png'))
 # Exact exported reimport, not just exporter success.
 oo=load(OUT/(kind+'.glb'));gm=glb_metrics(OUT/(kind+'.glb'))
 info['validation']={'gltf':gm,'unweighted_vertices':sum(not any(g.weight>0 for g in v.groups) for ob in oo for v in ob.data.vertices),'armature_modifiers':all(any(m.type=='ARMATURE' for m in ob.modifiers) for ob in oo),'actions':[{'name':a.name,'frames':list(a.frame_range)} for a in bpy.data.actions]}
 if kind!='rig':info['reimport_contacts']=sweep(oo[0],setup(oo[0]),frames)
 (OUT/'metrics.json').write_text(json.dumps(report,indent=2));print('FINISHED',kind,flush=True)
