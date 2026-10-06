import bpy,json
from pathlib import Path
exec(compile(Path('/home/helper/jd_character_revision/optimized/build.py').read_text().split('args=sys.argv')[0],'helpers','exec'))
R=Path('/home/helper/jd_motion_cleanup');O=R/'final-renders';O.mkdir(exist_ok=True)
for n in ['michael','rosie','joseph','gracie','simeon','anna','tobias']:
 for k in ['walk','run']:
  meshes=load(R/'final'/n/(k+'.glb'));a=bpy.data.actions[0];start,end=a.frame_range;frame(start);cam,target,h,ground=render_setup(meshes);bpy.context.scene.cycles.samples=2;bpy.context.scene.render.resolution_x=224;bpy.context.scene.render.resolution_y=300
  plane=bpy.data.objects.get('Plane')
  if plane:plane.location.z=-.002
  frame(start+(end-start)*.25);render(cam,target,h,O/(n+'-'+k+'-front.png'))
  if n in ['rosie','joseph','michael']:
   frame(start+(end-start)*.75);render(cam,target,h,O/(n+'-'+k+'-side.png'),True)
