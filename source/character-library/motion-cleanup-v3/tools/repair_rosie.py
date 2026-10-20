import bpy,bmesh,json,numpy as np
from pathlib import Path
exec(compile(Path('/home/helper/jd_character_revision/optimized/build.py').read_text().split('args=sys.argv')[0],'helpers','exec'))
R=Path('/home/helper/jd_motion_cleanup');O=R/'rosie-repaired';O.mkdir(exist_ok=True);report={}
for kind in ['rig','walk','run']:
 src=Path('/home/helper/work/JRDisciples/source/character-library/revision-v2/rosie/rig.glb') if kind=='rig' else R/'rosie-animation-only'/(kind+'.glb')
 meshes=load(src);o=meshes[0];im=next(i for i in bpy.data.images if i.size[0]>100);w,h=im.size;pix=np.array(im.pixels[:]).reshape(h,w,4);uv=o.data.uv_layers.active.data;remove=[]
 for p in o.data.polygons:
  positions=[o.matrix_world@o.data.vertices[i].co for i in p.vertices];mid=sum(positions,Vector())/len(positions)
  if not (.48<mid.z<.67 and abs(mid.x)<.21):continue
  cols=[]
  for li in p.loop_indices:
   u,v=uv[li].uv;cols.append(pix[min(h-1,int(v*h))%h,min(w-1,int(u*w))%w,:3])
  c=np.mean(cols,axis=0)
  if not(c[0]>c[1]*1.15 and c[1]>c[2]*1.1):continue
  leg=sum(sum(g.weight for g in o.data.vertices[i].groups if o.vertex_groups[g.group].name in ['Hips','LeftUpLeg','RightUpLeg']) for i in p.vertices)/len(p.vertices)
  if leg>.9:remove.append(p.index)
 bm=bmesh.new();bm.from_mesh(o.data);bm.faces.ensure_lookup_table();bmesh.ops.delete(bm,geom=[bm.faces[i] for i in remove],context='FACES');bm.to_mesh(o.data);bm.free();o.data.update()
 arm=next(x for x in bpy.context.scene.objects if x.type=='ARMATURE');bpy.ops.object.select_all(action='DESELECT');o.select_set(True);arm.select_set(True)
 out=O/(kind+'.glb');bpy.ops.export_scene.gltf(filepath=str(out),export_format='GLB',use_selection=True,export_animations=True,export_animation_mode='ACTIONS',export_skins=True,export_all_influences=True,export_image_format='AUTO',export_force_sampling=True,export_optimize_animation_size=False)
 report[kind]={'removed_covered_upper_thigh_faces':len(remove),'source':str(src),'metrics':glb_metrics(out)}
 meshes=load(out);a=bpy.data.actions[0];start,end=a.frame_range;frame(start);cam,target,h,z=render_setup(meshes);bpy.context.scene.cycles.samples=3;bpy.context.scene.render.resolution_x=288;bpy.context.scene.render.resolution_y=384
 for tag,phase in ([('front',0)] if kind=='rig' else [('quarter',.25),('threequarter',.75)]):frame(start+(end-start)*phase);render(cam,target,h,O/(kind+'-'+tag+'.png'))
 (O/'repair.json').write_text(json.dumps(report,indent=2))
