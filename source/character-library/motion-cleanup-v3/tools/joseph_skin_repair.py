import bpy,math,json,numpy as np,os,time
from mathutils import Vector
from mathutils.bvhtree import BVHTree
exec(open('/home/helper/jd_motion_cleanup/joseph/cleanup.py').read().split('for clip in [')[0].replace("P='/home/helper/jd_motion_cleanup/joseph'","P='/home/helper/jd_motion_cleanup/joseph-repair'").replace('sc.cycles.samples=4','sc.cycles.samples=2').replace('resolution_y=384','resolution_y=320'))
report={}
def regions(a,m,fix=False):
 im=next(im for im in bpy.data.images if im.size[0]>64);pix=np.array(im.pixels[:]).reshape(im.size[1],im.size[0],4);col=np.zeros((len(m.data.vertices),3));cnt=np.zeros(len(col))
 for l in m.data.loops:
  u,v=m.data.uv_layers.active.data[l.index].uv;col[l.vertex_index]+=pix[int(v*(im.size[1]-1)),int(u*(im.size[0]-1)),:3];cnt[l.vertex_index]+=1
 col/=np.maximum(cnt[:,None],1)
 welded={}
 for v in m.data.vertices:welded.setdefault(tuple(round(x,4) for x in v.co),[]).append(v.index)
 for ids in welded.values():col[ids]=col[ids].mean(axis=0)
 names={g.index:g.name for g in m.vertex_groups};pouch=[];hands=[];changes=[];body=set();diagn=[]
 for v in m.data.vertices:
  x,y,z=v.co;r,g,b=col[v.index];w={names[q.group]:q.weight for q in v.groups};nw=None
  # Leather below belt, separate from outer skin hand columns.
  leather=(r>g*1.35 and g>b*1.25)
  isp=42<z<64 and 8<abs(x)<21 and leather
  if isp:
   pouch.append(v.index);nw={'Hips':1.0}
   if sum(w.get(s+k,0) for s in ('Left','Right') for k in ('Arm','ForeArm','Hand'))>.01:
    nw={'Hips':1.0};diagn.append({'id':v.index,'co':list(v.co),'rgb':col[v.index].tolist(),'weights':w})
  skin=r>.55 and g>.27 and b>.13 and r>g*1.15 and g>b*1.1
  for side in ('Left','Right'):
   wrist=a.data.bones[side+'Hand'].head_local;elbow=a.data.bones[side+'ForeArm'].head_local;direction=(wrist-elbow).normalized();t=(v.co-wrist).dot(direction)
   if abs(x)>21 and z<64 and (v.co-wrist).length<15 and x*wrist.x>0:
    alpha=max(0,min(1,(t+3)/6))
    if alpha>0:
     nw={side+'Hand':alpha,side+'ForeArm':1-alpha}
     if t>2:hands.append(v.index)
  if 38<z<87 and abs(x)<21:body.add(v.index)
  if fix and nw is not None:
   changes.append({'id':v.index,'old':w,'new':nw})
   for q in list(v.groups):m.vertex_groups[q.group].remove([v.index])
   for name,val in nw.items():
    if val>0:(m.vertex_groups.get(name) or m.vertex_groups.new(name=name)).add([v.index],val,'REPLACE')
 polys=[tuple(p.vertices) for p in m.data.polygons if all(i in body for i in p.vertices)]
 return hands,polys,{'pouch_vertices':len(pouch),'arm_weighted_pouch':diagn,'hand_samples':len(hands),'changes':changes,'bones':{n:list(a.data.bones[n].head_local) for n in ['LeftHand','RightHand','LeftForeArm','RightForeArm']}}
def scan(m,h,p,frames):
 rows=[];edges=np.array([e.vertices[:] for e in m.data.edges]);rest=np.array([v.co[:] for v in m.data.vertices]);lens=np.linalg.norm(rest[edges[:,0]]-rest[edges[:,1]],axis=1);mask=lens>.01
 for f in frames:
  bpy.context.scene.frame_set(f);row={'frame':f,**metric(m,h,p)};ev=m.evaluated_get(bpy.context.evaluated_depsgraph_get());me=ev.to_mesh();co=np.array([v.co[:] for v in me.vertices]);ratio=np.linalg.norm(co[edges[:,0]]-co[edges[:,1]],axis=1)[mask]/lens[mask];row.update(finite=bool(np.isfinite(co).all()),edge_ratio_max=float(ratio.max()),edges_over_2=int((ratio>2).sum()));ev.to_mesh_clear();rows.append(row)
 return rows
for clip in ['run','walk','rig']:
 a,m=load(clip);h,p,diag=regions(a,m);frames=[0] if clip=='rig' else list(range(math.floor(a.animation_data.action.frame_range[0]),math.ceil(a.animation_data.action.frame_range[1])+1));bpy.context.scene.frame_start=frames[0];bpy.context.scene.frame_end=frames[-1]
 before=scan(m,h,p,frames);worst=max(before,key=lambda r:r['edge_ratio_max'])['frame'];bpy.context.scene.frame_set(worst);render(P+'/'+clip+'_before.png',m)
 h,p,diag=regions(a,m,True);json.dump(diag,open(P+'/'+clip+'_changes.json','w'),indent=2);after=scan(m,h,p,frames);bpy.context.scene.frame_set(worst);render(P+'/'+clip+'_after.png',m)
 if clip!='rig':
  for j,f in enumerate([frames[0],frames[len(frames)//4],frames[len(frames)//2],frames[3*len(frames)//4]]):bpy.context.scene.frame_set(f);render(P+'/'+clip+'_phase'+str(j)+'.png',m)
 bpy.ops.object.select_all(action='DESELECT');a.select_set(True);m.select_set(True);bpy.context.view_layer.objects.active=a;out=P+'/'+clip+'.glb';bpy.ops.export_scene.gltf(filepath=out,export_format='GLB',use_selection=True,export_animations=clip!='rig',export_frame_range=True,export_force_sampling=True,export_all_influences=True)
 report[clip]={'before':before,'after':after,'worst_frame':worst,'changed_vertices':len(diag['changes']),'arm_weighted_pouch':len(diag['arm_weighted_pouch']),'hand_samples':len(h)};json.dump(report,open(P+'/evidence.json','w'),indent=2)
 bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=out);a=next(o for o in bpy.context.scene.objects if o.type=='ARMATURE');m=next(o for o in bpy.context.scene.objects if o.type=='MESH');h,p,d=regions(a,m);report[clip]['reimport']=scan(m,h,p,frames);report[clip]['bones']=len(a.data.bones);json.dump(report,open(P+'/evidence.json','w'),indent=2)
print('FINISHED')
