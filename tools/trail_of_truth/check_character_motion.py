"""Validate motion-candidate registry without implying gameplay readiness."""
import hashlib,json,struct
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
BASE=ROOT/'source/character-library/motion-cleanup-v3'
manifest=json.loads((BASE/'manifest.json').read_text())
assert manifest['runtime_enabled'] is False and manifest['game_ready'] is False
names={'michael','rosie','joseph','gracie','simeon','anna','tobias'}
assert set(manifest['characters'])==names
clips=[]
for f in manifest['files']:
 p=ROOT/f['path'];data=p.read_bytes();assert len(data)==f['bytes'];assert hashlib.sha256(data).hexdigest()==f['sha256'],p
 if p.suffix!='.glb':continue
 assert data[:4]==b'glTF' and struct.unpack_from('<I',data,8)[0]==len(data)
 size=struct.unpack_from('<I',data,12)[0];g=json.loads(data[20:20+size]);assert [len(s['joints']) for s in g['skins']]==[24]
 assert all('JOINTS_0' in p['attributes'] and 'WEIGHTS_0' in p['attributes'] for m in g['meshes'] for p in m['primitives'])
 if p.stem in ['walk','run']:
  assert len(g['animations'])==1,(p,'Ambiguous active animation')
  assert all(g['accessors'][s['input']]['max'][0]>g['accessors'][s['input']]['min'][0] for s in g['animations'][0]['samplers'])
  clips.append((p.parent.name,p.stem))
assert set(clips)=={(n,k) for n in names for k in ['walk','run']} and len(clips)==14
screen=json.loads((BASE/'full-cycle-screen.json').read_text())
for n in names:
 for k in ['walk','run']:
  q=screen['characters'][n][k];assert q['hand_collision_frames']==0 and q['unweighted_vertices']==0 and q['bones']==24
  assert q['region_vertex_counts']['LeftHand']>100 and q['region_vertex_counts']['RightHand']>100
  assert q['sample_count']>30
  assert q['lower_sole_range'][0]>-.00001
  if k=='walk':assert q['lower_sole_range'][1]<.00001
print(f'PASS: {len(names)} characters, {len(clips)} unique locomotion clips; checksums/24-joint skins/single animations and 60 Hz contact/sole screening pass. Runtime remains disabled; visual clothing and gameplay gates are separate.')
