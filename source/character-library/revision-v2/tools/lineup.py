import bpy,json,math
from pathlib import Path
from mathutils import Vector
ROOT=Path('/home/helper/jd_character_revision'); SOURCE=Path('/home/helper/work/JRDisciples/source/character-library/generated-20260924')
bpy.ops.wm.read_factory_settings(use_empty=True)
scene=bpy.context.scene
rows=[]
# Proposed art-direction heights, not assertions about children's real heights.
for i,(name,height) in enumerate([('michael',1.40),('rosie',1.32),('joseph',1.34),('gracie',1.17),('simeon',1.72),('anna',1.66),('tobias',1.78)]):
 src=ROOT/'rosie/rig.glb' if name=='rosie' else ROOT/'joseph/rig-rigged_character_glb.glb' if name=='joseph' else SOURCE/name/'rig.glb'
 before=set(scene.objects);bpy.ops.import_scene.gltf(filepath=str(src));objs=set(scene.objects)-before
 for o in list(objs):
  if o.type=='MESH' and not any(m.type=='ARMATURE' for m in o.modifiers):objs.remove(o);bpy.data.objects.remove(o,do_unlink=True)
 for o in objs:
  if o.animation_data: o.animation_data_clear()
 bpy.context.view_layer.update()
 points=[o.matrix_world@Vector(v) for o in objs if o.type=='MESH' for v in o.bound_box]
 lo=Vector([min(p[j] for p in points) for j in range(3)]);hi=Vector([max(p[j] for p in points) for j in range(3)])
 scale=height/(hi.z-lo.z)
 parent=bpy.data.objects.new(name+'_scale',None);scene.collection.objects.link(parent)
 for o in objs:
  if o.parent not in objs:o.parent=parent
 parent.scale=(scale,)*3;parent.location=(i*1.22-(lo.x+hi.x)*scale/2,-(lo.y+hi.y)*scale/2,-lo.z*scale)
 rows.append({'name':name,'source_height':hi.z-lo.z,'proposed_height_m':height,'scale':scale})
 font=bpy.data.curves.new(name+'Label','FONT');font.body=name.title();font.align_x='CENTER';font.size=.105
 label=bpy.data.objects.new(name+'Label',font);scene.collection.objects.link(label);label.location=(i*1.22,-.5,-.20);label.rotation_euler=(math.pi/2,0,0)
scene.render.engine='CYCLES';scene.cycles.samples=8;scene.cycles.use_denoising=True
scene.render.resolution_x=1800;scene.render.resolution_y=700;scene.render.resolution_percentage=100
scene.world=bpy.data.worlds.new('World');scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.8,.8,.8,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.8
for x in [0,3,6]:
 data=bpy.data.lights.new('Softbox','AREA');data.energy=200;data.size=5;obj=bpy.data.objects.new('Softbox',data);scene.collection.objects.link(obj);obj.location=(x,-3,5);obj.rotation_euler=(Vector((x,0,1))-obj.location).to_track_quat('-Z','Y').to_euler()
data=bpy.data.cameras.new('Camera');cam=bpy.data.objects.new('Camera',data);scene.collection.objects.link(cam);cam.location=(3.66,-12,1);cam.rotation_euler=(Vector((3.66,0,.85))-cam.location).to_track_quat('-Z','Y').to_euler();data.type='ORTHO';data.ortho_scale=8.7;scene.camera=cam
scene.view_settings.view_transform='Standard';scene.render.filepath=str(ROOT/'seven-character-scale-lineup.png');bpy.ops.render.render(write_still=True)
(ROOT/'scale-proposal.json').write_text(json.dumps({'status':'art-direction proposal; not runtime integrated','characters':rows},indent=2))
