import bpy,json,math
from pathlib import Path
R=Path('/home/helper/jd_character_revision');report={}
for name in ['michael','rosie','joseph','gracie','simeon','anna','tobias']:
 root=R/('optimized-revised' if name in ['rosie','joseph'] else 'optimized')/name
 report[name]={}
 for kind in ['rig','walk','run']:
  bpy.ops.wm.read_factory_settings(use_empty=True);bpy.context.scene.render.fps=30;bpy.ops.import_scene.gltf(filepath=str(root/(kind+'.glb')))
  meshes=[o for o in bpy.context.scene.objects if o.type=='MESH' and any(m.type=='ARMATURE' for m in o.modifiers)]
  arms=[o for o in bpy.context.scene.objects if o.type=='ARMATURE'];acts=list(bpy.data.actions)
  assert len(arms)==1 and len(arms[0].data.bones)==24
  unweighted=sum(not any(g.weight>0 for g in v.groups) for o in meshes for v in o.data.vertices)
  start,end=acts[0].frame_range;samples=[]
  for i in range(9):
   f=start+(end-start)*i/8;bpy.context.scene.frame_set(int(f),subframe=f-int(f));dg=bpy.context.evaluated_depsgraph_get()
   ps=[o.matrix_world@v.co for o in meshes for v in list(o.evaluated_get(dg).data.vertices)[::30]]
   assert all(math.isfinite(c) for p in ps for c in p)
   samples.append(ps)
  motion=max(((a-b).length for ps in samples[1:] for a,b in zip(samples[0],ps)),default=0)
  if kind!='rig':assert end>start and motion>.01
  report[name][kind]={'bones':24,'unweighted_vertices':unweighted,'frame_range':[start,end],'max_sample_motion':motion,'finite':True,'reimported':True,'game_ready':False}
 (R/'final-verification.json').write_text(json.dumps(report,indent=2));print('VERIFIED',name,flush=True)
