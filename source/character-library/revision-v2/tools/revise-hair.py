"""Hair-only surface sculpt, preserving original GLB payload except positions/normals.
No strands/tubes added. Reversible via stored original and displacement arrays.
"""
import json,struct,io
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.sparse import coo_matrix
ROOT=Path('/home/helper/jd_character_revision/rosie')
SRC=Path('/home/helper/work/JRDisciples/source/character-library/generated-20260924/rosie')
def load(path):
 b=path.read_bytes();n=struct.unpack_from('<I',b,12)[0];j=json.loads(b[20:20+n]);return j,bytearray(b[28+n:])
def arr(j,b,i):
 a=j['accessors'][i];v=j['bufferViews'][a['bufferView']];d={5126:'<f4',5123:'<u2',5121:'u1',5125:'<u4'}[a['componentType']];c={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4,'MAT4':16}[a['type']]
 return np.ndarray((a['count'],c),dtype=d,buffer=b,offset=v.get('byteOffset',0)+a.get('byteOffset',0),strides=(v.get('byteStride',np.dtype(d).itemsize*c),np.dtype(d).itemsize))
def save(j,b,path):
 s=json.dumps(j,separators=(',',':')).encode();s+=b' '*((-len(s))%4);b+=bytes((-len(b))%4);path.write_bytes(struct.pack('<III',0x46546c67,2,28+len(s)+len(b))+struct.pack('<II',len(s),0x4e4f534a)+s+struct.pack('<II',len(b),0x004e4942)+b)
def sculpt(j,b):
 a=j['meshes'][0]['primitives'][0];p=arr(j,b,a['attributes']['POSITION']).copy();uv=arr(j,b,a['attributes']['TEXCOORD_0']);tri=arr(j,b,a['indices']).reshape(-1,3)
 im=j['images'][0];v=j['bufferViews'][im['bufferView']];tex=np.asarray(Image.open(io.BytesIO(b[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']])).convert('RGB'))
 c=tex[np.clip((uv[:,1]*tex.shape[0]).astype(int),0,tex.shape[0]-1),np.clip((uv[:,0]*tex.shape[1]).astype(int),0,tex.shape[1]-1)].astype(float)
 x,h,z=p.T
 mask=(h>.97)&(c[:,0]<132)&(c[:,1]<99)&(c[:,0]>c[:,1]*1.14)&(c[:,1]>c[:,2]*1.1)&~((z>.052)&(abs(x)<.09)&(h<1.235))
 # Weld duplicated UV-seam positions for spatially continuous deformation.
 _,inv=np.unique(np.round(p,6),axis=0,return_inverse=True);N=inv.max()+1
 counts=np.bincount(inv);m=np.bincount(inv,weights=mask)/counts
 edges=np.concatenate([tri[:,[0,1]],tri[:,[1,2]],tri[:,[2,0]]]);e=inv[edges];rows=np.r_[e[:,0],e[:,1],np.arange(N)];cols=np.r_[e[:,1],e[:,0],np.arange(N)]
 A=coo_matrix((np.ones(len(rows)),(rows,cols)),shape=(N,N)).tocsr();den=np.asarray(A.sum(axis=1)).ravel()
 # Erode boundary and smooth inward only; zero non-hair vertices remain exact.
 for _ in range(7):m=np.minimum(m,(A@m)/den)
 m=m[inv]*mask
 theta=np.arctan2(x,z+.005);t=(1.245-h)/.245;fade=np.clip(t*3,0,1);fade=fade*fade*(3-2*fade)
 # Smooth interlocking S-wave locks, asymmetric rather than uniform scallops.
 phase=2*np.pi*(1.245-h)/.092 + 2.4*np.sin(theta*2)+1.3*np.sin(theta*5)
 lock=.5+.5*np.cos(13*theta+1.6*np.sin(phase))
 radial=(.003+.007*np.sin(phase)+.010*(lock-.35))*fade*m
 tang=.004*np.cos(phase+.6*np.sin(theta*3))*fade*m
 d=np.zeros_like(p);d[:,0]=radial*np.sin(theta)+tang*np.cos(theta);d[:,2]=radial*np.cos(theta)-tang*np.sin(theta)
 d[:,1]=-.012*np.clip((1.08-h)/.085,0,1)*m*(.35+.65*lock)
 return p,d,m,tri
reports=[]
for name in ['rig','walk','run']:
 j,b=load(SRC/(name+'.glb'));p,d,m,tri=sculpt(j,b);prim=j['meshes'][0]['primitives'][0];pos=arr(j,b,prim['attributes']['POSITION']);pos[:]=p+d
 # Recompute area-weighted normals only where geometry or adjacent faces changed.
 normal=arr(j,b,prim['attributes']['NORMAL']);orig=normal.copy();q=pos[tri];fn=np.cross(q[:,1]-q[:,0],q[:,2]-q[:,0]);vn=np.zeros_like(pos)
 for k in range(3):np.add.at(vn,tri[:,k],fn)
 _,inv=np.unique(np.round(p,6),axis=0,return_inverse=True);sumv=np.zeros((inv.max()+1,3));np.add.at(sumv,inv,vn);vn=sumv[inv];vn/=np.maximum(np.linalg.norm(vn,axis=1,keepdims=True),1e-15)
 affected=np.zeros(len(p),bool);affected[tri[np.any(np.linalg.norm(d[tri],axis=2)>0,axis=1)].ravel()]=True;normal[affected]=vn[affected]
 ac=j['accessors'][prim['attributes']['POSITION']];ac['min']=pos.min(axis=0).tolist();ac['max']=pos.max(axis=0).tolist()
 save(j,b,ROOT/(name+'.glb'));np.savez_compressed(ROOT/(name+'_sculpt.npz'),original=p,displacement=d,mask=m)
 reports.append({'asset':name,'vertices':len(p),'triangles':len(tri),'moved_vertices':int(np.count_nonzero(np.linalg.norm(d,axis=1))),'max_displacement_m':float(np.linalg.norm(d,axis=1).max()),'unchanged_nonhair':bool(np.array_equal(pos[m==0],p[m==0]))})
(ROOT/'sculpt_report.json').write_text(json.dumps(reports,indent=2));print(json.dumps(reports,indent=2))
