"""Pack offline renders of owned Trail assets; no generation API or new licensing."""
from pathlib import Path
import argparse, hashlib, json
from PIL import Image, ImageDraw
p=argparse.ArgumentParser();p.add_argument('frames',type=Path);args=p.parse_args()
root=Path(__file__).resolve().parents[2]
out=root/'public/images/jr/games/shepherd-light-adventure';out.mkdir(exist_ok=True)
manifest={'kind':'2D sprite derivatives of existing owned 3D models','renderer':'Godot 4.7.2 Compatibility; tools/shepherd/render_owned_sprites.gd','license_source':'game/trail-of-truth-block-adventure/THIRD_PARTY_NOTICES.md','new_asset_spend_usd':0,'columns':9,'rows':4,'frame_px':192,'motion':'Michael original Idle/Run; lamb original separate leg nodes posed by sine; not new skeletal animation','assets':{}}
contact=Image.new('RGB',(768,384),'#56754f')
for ai,actor in enumerate(['michael','lamb']):
 atlas=Image.new('RGBA',(192*9,192*4))
 for direction in range(4):
  for frame in range(9):
   im=Image.open(args.frames/f'{actor}-{direction}-{frame}.png').convert('RGBA')
   assert im.size==(256,256) and im.getchannel('A').getextrema()==(0,255)
   atlas.paste(im.resize((192,192),Image.Resampling.LANCZOS),(frame*192,direction*192))
  tile=Image.open(args.frames/f'{actor}-{direction}-0.png').convert('RGBA').resize((192,192),Image.Resampling.LANCZOS)
  contact.paste(tile,(direction*192,ai*192),tile)
 path=out/f'{actor}-trail-sprite.webp';atlas.save(path,lossless=True,method=6)
 source=root/f'game/trail-of-truth-block-adventure/assets/{actor}.glb'
 manifest['assets'][actor]={'source':str(source.relative_to(root)),'source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'output':str(path.relative_to(root)),'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'bytes':path.stat().st_size}
contact.save(args.frames.parent/'owned-sprite-contact.png')
(root/'tools/shepherd/owned-sprites.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps(manifest,indent=2))
