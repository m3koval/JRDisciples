"""Blender 4.5: immutable input -> decimated 2K GLBs -> fresh-import QA + actual renders.
Run: blender -b -t 6 --python build.py -- [character ...]
"""
import bpy, bmesh, json, math, sys, hashlib, struct, time
from pathlib import Path
from mathutils import Vector
ROOT=Path('/home/helper/jd_character_revision/optimized')
SOURCE=Path('/home/helper/work/JRDisciples/source/character-library/generated-20260924')
NAMES=['michael','rosie','gracie','simeon','anna','tobias']

def glb_metrics(path):
 b=path.read_bytes();n=struct.unpack_from('<I',b,12)[0];g=json.loads(b[20:20+n]);acc=g.get('accessors',[])
 return dict(bytes=len(b),sha256=hashlib.sha256(b).hexdigest(),triangles=sum(acc[p['indices']]['count']//3 for m in g.get('meshes',[]) for p in m['primitives']),joints=[len(s['joints']) for s in g.get('skins',[])],joint_names=[[g['nodes'][j].get('name') for j in s['joints']] for s in g.get('skins',[])],animations=[dict(name=a.get('name'),channels=len(a['channels']),duration=max(acc[s['input']].get('max',[0])[0] for s in a['samplers'])-min(acc[s['input']].get('min',[0])[0] for s in a['samplers'])) for a in g.get('animations',[])],skin_attributes=all('JOINTS_0' in p['attributes'] and 'WEIGHTS_0' in p['attributes'] for m in g.get('meshes',[]) for p in m['primitives']))

def load(path):
 bpy.ops.wm.read_factory_settings(use_empty=True)
 bpy.context.scene.render.fps=30
 bpy.ops.import_scene.gltf(filepath=str(path))
 # Importer creates a hidden custom bone-shape Icosphere, not asset geometry.
 for o in list(bpy.data.objects):
  if o.type=='MESH' and not any(m.type=='ARMATURE' for m in o.modifiers): bpy.data.objects.remove(o,do_unlink=True)
 return [o for o in bpy.context.scene.objects if o.type=='MESH']

def frame(f):
 bpy.context.scene.frame_set(int(f),subframe=f-int(f));bpy.context.view_layer.update()

def points(meshes):
 dg=bpy.context.evaluated_depsgraph_get()
 return [o.matrix_world@v.co for o in meshes for v in o.evaluated_get(dg).data.vertices]

def bounds(meshes):
 p=points(meshes);return [min(v[i] for v in p) for i in range(3)],[max(v[i] for v in p) for i in range(3)]

def render_setup(meshes):
 s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.samples=8;s.cycles.use_denoising=True
 s.render.resolution_x=320;s.render.resolution_y=420;s.render.resolution_percentage=100
 s.world=bpy.data.worlds.new('QA world');s.world.use_nodes=True;s.world.node_tree.nodes['Background'].inputs[0].default_value=(.36,.39,.43,1);s.world.node_tree.nodes['Background'].inputs[1].default_value=.65
 s.view_settings.view_transform='AgX'
 lo,hi=bounds(meshes);h=hi[2]-lo[2];target=Vector(((lo[0]+hi[0])/2,(lo[1]+hi[1])/2,lo[2]+h*.50))
 bpy.ops.object.camera_add();cam=bpy.context.object;s.camera=cam;cam.data.type='ORTHO';cam.data.ortho_scale=h*1.22
 for pos,power,size in [((3,-4,5),450,4),((-3,-2,2),220,3),((1,3,4),400,3)]:
  bpy.ops.object.light_add(type='AREA',location=target+Vector(pos)*h);o=bpy.context.object;o.data.energy=power*h*h;o.data.shape='DISK';o.data.size=size*h;o.rotation_euler=(target-o.location).to_track_quat('-Z','Y').to_euler()
 # Fixed ground at source mesh baseline, not re-snapped for each animation sample.
 bpy.ops.mesh.primitive_plane_add(size=h*200,location=(0,0,lo[2]-.003*h));ground=bpy.context.object
 mat=bpy.data.materials.new('QA ground');mat.diffuse_color=(.16,.19,.22,1);ground.data.materials.append(mat)
 return cam,target,h,lo[2]

def render(cam,target,h,path,side=False):
 cam.location=target+Vector((3,0,.05) if side else (0,-3,.05))*h
 cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler()
 bpy.context.scene.render.filepath=str(path);bpy.ops.render.render(write_still=True)

def qa_render(path,outdir,kind):
 meshes=load(path);actions=list(bpy.data.actions);r=list(actions[0].frame_range) if actions else [0,0]
 frame(r[0]);lo,hi=bounds(meshes)
 report=dict(mesh_objects=len(meshes),blender_triangles=sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in meshes),bones=[len(o.data.bones) for o in bpy.context.scene.objects if o.type=='ARMATURE'],images=[dict(name=i.name,width=i.size[0],height=i.size[1]) for i in bpy.data.images if i.size[0]],actions=[dict(name=a.name,frames=list(a.frame_range)) for a in actions],bounds=[lo,hi])
 # Full motion sample envelope is a screening statistic, not a collision/foot-lock proof.
 report['motion_samples']=[]
 for k in range(9):
  f=r[0]+(r[1]-r[0])*k/8;frame(f);a,b=bounds(meshes)
  report['motion_samples'].append(dict(frame=f,min_z=a[2],max_z=b[2]))
 frame(r[0]);cam,target,h,ground=render_setup(meshes);report['ground_z']=ground
 if kind=='rig':
  render(cam,target,h,outdir/'front.png');render(cam,target,h,outdir/'side.png',True)
 else:
  for phase in ([.25,.75] if kind=='walk' else [.25]):
   frame(r[0]+(r[1]-r[0])*phase)
   render(cam,target,h,outdir/(kind+str(int(phase*100))+'.png'),kind=='run')
 return report

def optimize(src,dst):
 meshes=load(src);initial=sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in meshes)
 # Weld duplicate UV-seam vertices without changing per-loop UVs. Keeps skin groups.
 for o in meshes:
  bpy.context.view_layer.objects.active=o;o.select_set(True)
  bm=bmesh.new();bm.from_mesh(o.data);bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=0.000001);bm.to_mesh(o.data);bm.free();o.data.update()
  # Skin-derived head weighting retains substantially more head detail.
  head=o.vertex_groups.get('Head');protect=o.vertex_groups.new(name='QA_decimate_body')
  for v in o.data.vertices:
   hw=next((g.weight for g in v.groups if head and g.group==head.index),0)
   protect.add([v.index],max(.03,1-hw*.97),'REPLACE')
  mod=o.modifiers.new('Runtime candidate 24k','DECIMATE');mod.decimate_type='COLLAPSE';mod.ratio=min(1,24000/initial);mod.use_collapse_triangulate=True;mod.vertex_group=protect.name;mod.vertex_group_factor=5
  bpy.ops.object.modifier_move_up(modifier=mod.name)
  bpy.ops.object.modifier_apply(modifier=mod.name)
  group=o.vertex_groups.get('QA_decimate_body')
  if group:o.vertex_groups.remove(group)
 for i in bpy.data.images:
  if i.size[0]>2048 or i.size[1]>2048:i.scale(2048,2048);i.pack()
 bpy.ops.object.select_all(action='DESELECT')
 for o in bpy.context.scene.objects:
  if o.type in ('ARMATURE','MESH'):o.select_set(True)
 bpy.ops.export_scene.gltf(filepath=str(dst),export_format='GLB',use_selection=True,export_animations=True,export_animation_mode='ACTIONS',export_skins=True,export_all_influences=True,export_image_format='JPEG',export_jpeg_quality=90,export_keep_originals=False,export_force_sampling=True,export_frame_step=1,export_optimize_animation_size=False,export_anim_slide_to_zero=False,export_negative_frame='SLIDE',export_lights=False,export_cameras=False)

args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else NAMES
for name in args:
 out=ROOT/name;out.mkdir(parents=True,exist_ok=True);report={'name':name,'status':'candidate_pending_visual_review','method':'Blender collapse 24k target, welded UV duplicate vertices, skin-derived head weighting, JPEG90 2048px','files':{}}
 for kind in ['rig','walk','run']:
  src=SOURCE/name/(kind+'.glb');dst=out/(kind+'.glb');before=glb_metrics(src)
  optimize(src,dst);after=glb_metrics(dst)
  q={}
  for version,path in [('original',src),('optimized',dst)]:
   rd=out/'renders'/version;rd.mkdir(parents=True,exist_ok=True);q[version]=qa_render(path,rd,kind)
  unchanged=before['sha256']==hashlib.sha256(src.read_bytes()).hexdigest()
  checks=dict(source_unchanged=unchanged,triangle_budget=after['triangles']<=25000,joints_preserved=before['joint_names']==after['joint_names'],animation_count_preserved=len(before['animations'])==len(after['animations']),skinned=after['skin_attributes'],reimported=True,textures_within_2k=all(i['width']<=2048 and i['height']<=2048 for i in q['optimized']['images']))
  report['files'][kind]=dict(before=before,after=after,checks=checks,qa=q)
  (out/'qa.json').write_text(json.dumps(report,indent=2))
  print('ASSET_FINISHED',name,kind,checks,flush=True)
 print('CHARACTER_FINISHED',name,flush=True)
