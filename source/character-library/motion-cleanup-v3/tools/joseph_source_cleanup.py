import bpy,math,json,os,time
from mathutils import Vector,Quaternion
from mathutils.bvhtree import BVHTree
P='/home/helper/jd_motion_cleanup/joseph'; SRC='/home/helper/work/JRDisciples/source/character-library/revision-v2/joseph'
report={}; start=time.time()
def load(clip):
 bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=SRC+'/'+clip+'.glb')
 arm=next(o for o in bpy.context.scene.objects if o.type=='ARMATURE');mesh=max((o for o in bpy.context.scene.objects if o.type=='MESH'),key=lambda o:len(o.data.vertices))
 for o in list(bpy.context.scene.objects):
  if o not in (arm,mesh):bpy.data.objects.remove(o,do_unlink=True)
 return arm,mesh

def setup(arm,mesh):
 names={g.index:g.name for g in mesh.vertex_groups}; hands=[]; body=set(); weights=[]
 for v in mesh.data.vertices:
  w={names[g.group]:g.weight for g in v.groups};weights.append(w)
  for side in ('Left','Right'):
   wrist=arm.data.bones[side+'Hand']; direction=(wrist.tail_local-wrist.head_local).normalized();t=(v.co-wrist.head_local).dot(direction)
   if w.get(side+'ForeArm',0)+w.get(side+'Hand',0)>.5 and t>3 and (v.co-wrist.head_local).length<16: hands.append(v.index)
  if sum(w.get(s+b,0) for s in ('Left','Right') for b in ('Arm','ForeArm','Hand'))<.15 and 38<v.co.z<87: body.add(v.index)
 polys=[tuple(p.vertices) for p in mesh.data.polygons if all(i in body for i in p.vertices)]
 return hands,polys,weights

def metric(mesh,hands,polys):
 dg=bpy.context.evaluated_depsgraph_get();ev=mesh.evaluated_get(dg);me=ev.to_mesh();vs=[mesh.matrix_world@v.co for v in me.vertices];bvh=BVHTree.FromPolygons(vs,polys)
 ds=[]
 for i in hands:
  loc,n,idx,d=bvh.find_nearest(vs[i]);sg=d if (vs[i]-loc).dot(n)>=0 else -d;ds.append(sg)
 ev.to_mesh_clear()
 return {'negative_samples':sum(-.02<d<-.001 for d in ds),'near_samples':sum(abs(d)<.005 for d in ds),'min_signed':min(ds),'min_surface':min(abs(d) for d in ds)}

def apply(arm,base,angle):
 for side,sign in [('Left',-1),('Right',1)]:
  b=arm.pose.bones[side+'Arm']; b.rotation_mode='QUATERNION'
  axis=b.bone.matrix_local.to_quaternion().inverted()@Vector((0,1,0))
  b.rotation_quaternion=Quaternion(axis,math.radians(sign*angle))@base[side]
 bpy.context.view_layer.update()

def render(path,mesh):
 sc=bpy.context.scene;sc.render.engine='CYCLES';sc.cycles.samples=4;sc.render.resolution_x=320;sc.render.resolution_y=384;sc.render.resolution_percentage=100
 sc.world=bpy.data.worlds.new('World') if not sc.world else sc.world;sc.world.color=(.35,.35,.35)
 if not sc.camera:
  bpy.ops.object.camera_add(location=(2.3,-4.8,2.05));cam=bpy.context.object;sc.camera=cam;cam.data.type='ORTHO';cam.data.ortho_scale=1.7
  cam.rotation_euler=(Vector((0,0,.72))-cam.location).to_track_quat('-Z','Y').to_euler()
  for loc,power,size in [((2,-3,4),450,4),((-3,-1,2),250,3)]:
   bpy.ops.object.light_add(type='AREA',location=loc);li=bpy.context.object;li.data.energy=power;li.data.shape='DISK';li.data.size=size;li.rotation_euler=(Vector((0,0,.7))-li.location).to_track_quat('-Z','Y').to_euler()
 sc.render.filepath=path;bpy.ops.render.render(write_still=True)

for clip in ['walk','run']:
 arm,mesh=load(clip);hands,polys,weights=setup(arm,mesh);a=arm.animation_data.action;lo,hi=a.frame_range;frames=list(range(math.floor(lo),math.ceil(hi)+1)); sc=bpy.context.scene;sc.frame_start=frames[0];sc.frame_end=frames[-1]
 bases={};before=[]
 for f in frames:
  sc.frame_set(f);bases[f]={s:arm.pose.bones[s+'Arm'].rotation_quaternion.copy() for s in ('Left','Right')};before.append({'frame':f,**metric(mesh,hands,polys)})
 worst=max(before,key=lambda r:(r['negative_samples'],-r['min_signed']))['frame'];sc.frame_set(worst);render(P+'/'+clip+'_before.png',mesh)
 trials=[];chosen=0;after=before
 for angle in [4,8,12]:
  rows=[]
  for f in frames:
   sc.frame_set(f);apply(arm,bases[f],angle);rows.append({'frame':f,**metric(mesh,hands,polys)})
  score=sum(r['negative_samples']+r['near_samples'] for r in rows);trials.append({'degrees':angle,'bounded_contact_score':score,'negative_samples':sum(r['negative_samples'] for r in rows),'near_samples':sum(r['near_samples'] for r in rows)})
  if score<sum(r['negative_samples']+r['near_samples'] for r in after):chosen=angle;after=rows
  if score==0:break
 # Retain source hand rotations: no speculative wrist geometry/weights mutation.
 for f in frames:
  sc.frame_set(f);apply(arm,bases[f],chosen)
  for side in ('Left','Right'):arm.pose.bones[side+'Arm'].keyframe_insert('rotation_quaternion',frame=f,group=side+'Arm')
 sc.frame_set(worst);render(P+'/'+clip+'_after.png',mesh)
 for j,f in enumerate([frames[0],frames[len(frames)//4],frames[len(frames)//2],frames[3*len(frames)//4]]):
  sc.frame_set(f);render(P+'/'+clip+'_motion_'+str(j)+'.png',mesh)
 bpy.ops.object.select_all(action='DESELECT');arm.select_set(True);mesh.select_set(True);bpy.context.view_layer.objects.active=arm
 out=P+'/'+clip+'.glb';bpy.ops.export_scene.gltf(filepath=out,export_format='GLB',use_selection=True,export_animations=True,export_frame_range=True,export_force_sampling=True,export_all_influences=True)
 report[clip]={'frames':frames,'hand_samples':len(hands),'body_triangles':len(polys),'arm_abduction_degrees':chosen,'trials':trials,'before':before,'after':after,'worst_before_frame':worst,'source_vertices':len(mesh.data.vertices),'source_bones':len(arm.data.bones),'world_scale':list(mesh.scale),'wrist_diagnosis':'No finger bones. Existing hand geometry and weights preserved; wrist shape not safely reconstructed in bounded pass.'}
 with open(P+'/evidence.json','w') as fp:json.dump(report,fp,indent=2)
 # Reimport actual artifact and reevaluate every frame, ensure finite geometry.
 bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=out);ar=next(o for o in bpy.context.scene.objects if o.type=='ARMATURE');me=max((o for o in bpy.context.scene.objects if o.type=='MESH'),key=lambda o:len(o.data.vertices));hh,pp,ww=setup(ar,me)
 rr=[]
 for f in frames:
  bpy.context.scene.frame_set(f);rr.append({'frame':f,**metric(me,hh,pp)})
 report[clip]['reimport']={'vertices':len(me.data.vertices),'bones':len(ar.data.bones),'actions':[(a.name,list(a.frame_range)) for a in bpy.data.actions],'metrics':rr}
 with open(P+'/evidence.json','w') as fp:json.dump(report,fp,indent=2)
print('COMPLETE',time.time()-start)
