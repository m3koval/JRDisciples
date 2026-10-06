exec(open('/home/helper/jd_motion_cleanup/rosie/cleanup.py').read().split("for kind in ['walk'")[0])
from mathutils.kdtree import KDTree
report=json.loads((OUT/'metrics.json').read_text())
for kind in ['walk','run','rig']:
 o=load(OUT/(kind+'.glb'))[0];reg=setup(o);arm=next(x for x in bpy.context.scene.objects if x.type=='ARMATURE');acts=list(bpy.data.actions);r=list(acts[0].frame_range) if acts else [1,1];frames=[r[0]+i*.5 for i in range(int((r[1]-r[0])*2)+1)]
 skirt=[i for i in reg[1] if .36<(o.matrix_world@o.data.vertices[i].co).z<.69];kd=KDTree(len(skirt))
 for i in skirt:kd.insert(o.matrix_world@o.data.vertices[i].co,i)
 kd.balance();n=0
 for v in o.data.vertices:
  p=o.matrix_world@v.co;leg=sum(g.weight for g in v.groups if o.vertex_groups[g.group].name in ['LeftUpLeg','RightUpLeg'])
  if v.index in reg[1] or not (.42<p.z<.68 and abs(p.x)<.20 and leg>.5):continue
  co,idx,dist=kd.find(p)
  if dist>.09:continue
  mix=min(1,max(0,(p.z-.42)/.06));mix=mix*mix*(3-2*mix)
  orig={g.group:g.weight for g in v.groups};target={g.group:g.weight for g in o.data.vertices[idx].groups}
  for g in list(v.groups):o.vertex_groups[g.group].remove([v.index])
  for gi in orig.keys()|target.keys():
   w=orig.get(gi,0)*(1-mix)+target.get(gi,0)*mix
   if w>0:o.vertex_groups[gi].add([v.index],w,'REPLACE')
  n+=1
 report[kind]['inner_thigh_follow_skirt_vertices']=n
 if kind=='run':
  cache={}
  for f in range(int(r[0]),int(r[1])+1):
   frame(f);cache[f]={s:(arm.pose.bones[s+'ForeArm'].rotation_quaternion.copy(),arm.pose.bones[s+'ForeArm'].matrix.to_quaternion().inverted()@Vector((1,0,0))) for s in ['Left','Right']}
  for deg in [-12,12,-24,24]:
   for f,vals in cache.items():
    frame(f)
    for s,(q,axis) in vals.items():
     b=arm.pose.bones[s+'ForeArm'];b.rotation_quaternion=q@Quaternion(axis,math.radians(deg));b.keyframe_insert('rotation_quaternion',frame=f)
   ss=sweep(o,reg,frames);print('ELBOW',deg,ss['contact_frames'],ss['intersection_pairs_sum'],flush=True)
   if ss['contact_frames']==0:break
  report[kind]['elbow_adjustment_degrees']=deg
 save(OUT/(kind+'.glb'))
 oo=load(OUT/(kind+'.glb'));o=oo[0];reg=setup(o);report[kind]['final_contacts']=sweep(o,reg,frames);report[kind]['validation']={'gltf':glb_metrics(OUT/(kind+'.glb')),'unweighted_vertices':sum(not any(g.weight>0 for g in v.groups) for ob in oo for v in ob.data.vertices),'armature_modifiers':all(any(m.type=='ARMATURE' for m in ob.modifiers) for ob in oo),'actions':[{'name':a.name,'frames':list(a.frame_range)} for a in bpy.data.actions]};(OUT/'metrics.json').write_text(json.dumps(report,indent=2))
 if kind!='rig':
  frame(r[0]);cam,target,h,z=render_setup([o]);bpy.context.scene.cycles.samples=2;bpy.context.scene.render.resolution_x=288;bpy.context.scene.render.resolution_y=384
  for tag,f in [('worst',report[kind]['final_contacts']['worst']['frame']),('before_worst',report[kind]['before']['worst']['frame']),('quarter',r[0]+(r[1]-r[0])*.25),('threequarter',r[0]+(r[1]-r[0])*.75)]:
   frame(f);render(cam,target,h,OUT/(kind+'_final_'+tag+'.png'))
 print('FINAL',kind,n,report[kind]['final_contacts']['contact_frames'],flush=True)
