"""Validate source character registry without importing assets into runtime."""
from pathlib import Path
import hashlib,json,struct
ROOT=Path(__file__).resolve().parents[2]
BASE=ROOT/'source/character-library/generated-20260924'
m=json.loads((BASE/'manifest.json').read_text())
assert m['runtime_enabled'] is False
assert {c['id'] for c in m['characters']}=={'michael','rosie','joseph','gracie','simeon','anna','tobias'}
count=0
for c in m['characters']:
 assert c['game_ready'] is False
 if c['id']=='joseph':
  assert c['status']=='blocked_reference' and not c['assets'];continue
 assert set(c['assets'])=={'reference','rig','walk','run'}
 for kind,a in c['assets'].items():
  p=BASE/a['path'];b=p.read_bytes();assert len(b)==a['bytes'];assert hashlib.sha256(b).hexdigest()==a['sha256'];count+=1
  if p.suffix=='.glb':
   magic,v,n=struct.unpack_from('<4sII',b);assert magic==b'glTF' and v==2 and n==len(b)
   l=struct.unpack_from('<I',b,12)[0];j=json.loads(b[20:20+l]);assert j['meshes'] and j['skins']
   if kind in ('walk','run'):assert any(a['channels'] for a in j['animations'])
assert len(m['motion_sources'])==32
for a in m['motion_sources']:
 b=(BASE/a['path']).read_bytes();assert len(b)==a['bytes'];assert hashlib.sha256(b).hexdigest()==a['sha256']
 l=struct.unpack_from('<I',b,12)[0];j=json.loads(b[20:20+l]);assert not j.get('meshes');assert any(x['channels'] for x in j['animations']);count+=1
print(f'PASS: 7 canonical entries, 6 reference/rig/walk/run sets, 32 motion sources; {count} asset checksums valid. Runtime disabled.')
