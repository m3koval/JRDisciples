from pathlib import Path
import hashlib,json,os
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[2]
source=Path(os.environ['SHEPHERD_SCENERY_DIR'])
assets={'tree':('tools/shepherd/render_scenery.gd','Original procedural rounded tree; not generated premium art'),'rock':('game/trail-of-truth-block-adventure/assets/scans/rock_moss_b.glb','Existing CC0 scan; Trail THIRD_PARTY_NOTICES.md'),'flowers':('game/trail-of-truth-block-adventure/assets/environment/flower_yellowC.glb','Kenney Nature Kit CC0; assets/environment/PROVENANCE.md')}
manifest={'kind':'Transparent 2D scenery derivatives; not live 3D','renderer':'Godot 4.7.2 Compatibility','new_asset_spend_usd':0,'assets':{}}
sheet=Image.new('RGB',(768,280),'#748864')
for index,(name,(path,license)) in enumerate(assets.items()):
 im=Image.open(source/f'{name}.png').convert('RGBA'); assert im.getbbox()
 out=ROOT/f'public/images/jr/games/shepherd-light-adventure/scenery-{name}.webp';im.save(out,quality=90,method=6)
 sheet.paste(im,(index*256,0),im); ImageDraw.Draw(sheet).text((index*256+12,260),name,fill='white')
 manifest['assets'][name]={'source':path,'license':license,'source_sha256':hashlib.sha256((ROOT/path).read_bytes()).hexdigest(),'output':str(out.relative_to(ROOT)),'sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'bytes':out.stat().st_size}
(ROOT/'tools/shepherd/scenery-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
sheet.save(source/'accepted-contact.png')
print(json.dumps(manifest,indent=2))
