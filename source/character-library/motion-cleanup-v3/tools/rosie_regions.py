exec(open('/home/helper/jd_character_revision/optimized/build.py').read().split('args=sys.argv')[0])
import numpy as np
from mathutils.bvhtree import BVHTree
OUT=Path('/home/helper/jd_motion_cleanup/rosie');SRC=Path('/home/helper/work/JRDisciples/source/character-library/revision-v2/rosie')
def regions(o):
 im=next(i for i in bpy.data.images if i.size[0]>100);w,h=im.size;pix=np.array(im.pixels[:]).reshape(h,w,4);uv=o.data.uv_layers.active.data
 dress=[]
 for p in o.data.polygons:
  cols=[]
  for li in p.loop_indices:
   u,v=uv[li].uv;cols.append(pix[min(h-1,int(v*h))%h,min(w-1,int(u*w))%w,:3])
  r,g,b=np.mean(cols,axis=0)
  if b>r*.67 and r>g*1.13 and b>g*1.2:dress.append(p.index)
 dv=set(v for i in dress for v in o.data.polygons[i].vertices)
 hand={}
 for side in ['Left','Right']:
  gi=o.vertex_groups[side+'Hand'].index
  hand[side]=set(v.index for v in o.data.vertices if any(g.group==gi and g.weight>.80 for g in v.groups))-dv
 return dress,dv,hand
if __name__=='__main__':
 o=load(SRC/'walk.glb')[0];d,dv,ha=regions(o)
 print('REGIONS',len(d),len(dv),{k:len(v) for k,v in ha.items()},flush=True)
 sums={g.name:sum(w.weight for vi in dv for w in o.data.vertices[vi].groups if w.group==g.index) for g in o.vertex_groups};print('DRESSWEIGHTS',sums,flush=True)
 print('REST',[(ax,min((o.matrix_world@o.data.vertices[i].co)[ax] for i in dv),max((o.matrix_world@o.data.vertices[i].co)[ax] for i in dv)) for ax in range(3)],flush=True)
