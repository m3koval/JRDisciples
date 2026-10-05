from pathlib import Path
from PIL import Image,ImageDraw
import json,numpy as np,hashlib
ROOT=Path(__file__).resolve().parents[1]
OUT=Path('/mnt/hermes-storage/jd-games-overnight/evidence/pass-09/spot-art');OUT.mkdir(parents=True,exist_ok=True)
manifest=json.loads((ROOT/'app/games/spot-the-difference/object-edits.json').read_text())
art=ROOT/'public/images/jr/games/spot'; sheet=Image.new('RGB',(1200,4*290),'#edf0e5');draw=ImageDraw.Draw(sheet); results=[]
for n,s in enumerate(manifest):
 before=Image.open(art/s['source']).convert('RGB');after=Image.open(art/s['output']).convert('RGB')
 assert hashlib.sha256((art/s['source']).read_bytes()).hexdigest()==s['sourceSha256']
 assert hashlib.sha256((art/s['output']).read_bytes()).hexdigest()==s['outputSha256']
 d=next(d for d in s['differences'] if 'materialPattern' in d)
 poly=np.array(d['polygon']); bounds=(max(0,int(poly[:,0].min())-25),max(0,int(poly[:,1].min())-25),min(768,int(poly[:,0].max())+25),min(1024,int(poly[:,1].max())+25))
 row,col=divmod(n,2); left=col*600;top=row*290;draw.text((left+10,top+6),s['id']+' | A / B',fill='#123c30')
 for i,im in enumerate([before,after]):
  crop=im.crop(bounds);crop.thumbnail((284,255));sheet.paste(crop,(left+i*300+(300-crop.width)//2,top+28+(255-crop.height)//2))
 b=np.array(before.convert('L')).astype(int);a=np.array(after.convert('L')).astype(int)
 mask=Image.new('1',before.size);ImageDraw.Draw(mask).polygon([tuple(p) for p in d['polygon']],fill=1)
 contrast=int(np.count_nonzero((np.abs(a-b)>25)&np.array(mask)))
 assert contrast>100,(s['id'],contrast)
 results.append({'scene':s['id'],'patterned_object':d['nameEn'],'pattern':d['materialPattern'],'pixels_grayscale_difference_gt25':contrast,'source_and_output_hashes':'PASS'})
assert len(results)==8
sheet.save(OUT/'pattern-contact.png');sheet.convert('L').save(OUT/'pattern-contact-grayscale.png')
(OUT/'results.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
