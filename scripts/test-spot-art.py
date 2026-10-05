"""Verify all 24 actual object derivatives, including hue-independent visibility.
The grayscale gate is a contrast regression, not a claim of clinical accessibility.
Contact sheets must also be inspected; numeric contrast cannot certify artwork.
"""
from pathlib import Path
from PIL import Image,ImageDraw
import json,numpy as np,hashlib,os,base64
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('SPOT_ART_EVIDENCE','/mnt/hermes-storage/jd-games-overnight/evidence/pass-11/spot-art'));OUT.mkdir(parents=True,exist_ok=True)
manifest=json.loads((ROOT/'app/games/spot-the-difference/object-edits.json').read_text())
art=ROOT/'public/images/jr/games/spot';results=[]
assert len(manifest)==8
for index in range(3):
 sheet=Image.new('RGB',(1200,4*290),'#edf0e5');draw=ImageDraw.Draw(sheet)
 for n,s in enumerate(manifest):
  before=Image.open(art/s['source']).convert('RGB');after=Image.open(art/s['output']).convert('RGB')
  assert before.size==after.size==(768,1024)
  assert hashlib.sha256((art/s['source']).read_bytes()).hexdigest()==s['sourceSha256']
  assert hashlib.sha256((art/s['output']).read_bytes()).hexdigest()==s['outputSha256']
  assert len(s['differences'])==3
  d=s['differences'][index];assert d.get('materialPattern')
  poly=np.array(d['polygon']);bounds=(max(0,int(poly[:,0].min())-25),max(0,int(poly[:,1].min())-25),min(768,int(poly[:,0].max())+25),min(1024,int(poly[:,1].max())+25))
  row,col=divmod(n,2);left=col*600;top=row*290;draw.text((left+10,top+6),s['id']+' #'+str(index+1)+' | A / B',fill='#123c30')
  for i,im in enumerate([before,after]):
   crop=im.crop(bounds);crop.thumbnail((284,255));sheet.paste(crop,(left+i*300+(300-crop.width)//2,top+28+(255-crop.height)//2))
  b=np.array(before.convert('L')).astype(int);a=np.array(after.convert('L')).astype(int)
  mask=Image.new('1',before.size);ImageDraw.Draw(mask).polygon([tuple(p) for p in d['polygon']],fill=1)
  contrast=int(np.count_nonzero((np.abs(a-b)>25)&np.array(mask)))
  assert contrast>100,(s['id'],d['id'],contrast)
  # At 2x inspection on a phone, small objects still need multiple visible pixels.
  small_b=np.array(before.convert('L').resize((384,512),Image.Resampling.LANCZOS)).astype(int)
  small_a=np.array(after.convert('L').resize((384,512),Image.Resampling.LANCZOS)).astype(int)
  small_mask=np.array(mask.resize((384,512),Image.Resampling.NEAREST))
  detail_contrast=int(np.count_nonzero((np.abs(small_a-small_b)>20)&small_mask))
  assert detail_contrast>25,(s['id'],d['id'],'detail contrast',detail_contrast)
  hit=np.unpackbits(np.frombuffer(base64.b64decode(d['hitMask']),dtype=np.uint8)).reshape(128,96)
  x,y=d['anchor'];assert hit[y//8,x//8],(s['id'],d['id'],'anchor outside hit mask')
  assert np.any(np.abs(a-b)[max(0,y-8):y+9,max(0,x-8):x+9]>25),(s['id'],d['id'],'anchor not at visible change')
  results.append({'scene':s['id'],'object':d['nameEn'],'pattern':d['materialPattern'],'pixels_grayscale_difference_gt25':contrast,'detail_pixels_gt20':detail_contrast,'source_and_output_hashes':'PASS','anchor_at_visible_edit':'PASS'})
 sheet.save(OUT/f'pattern-contact-{index+1}.png');sheet.convert('L').save(OUT/f'pattern-contact-{index+1}-grayscale.png')
# Regressions for the former floating speckles in the sky/building.
for slug,box in [('empty-tomb',(381,0,430,100)),('good-samaritan',(50,60,65,85))]:
 b=np.array(Image.open(art/f'spot-{slug}-before.png'));a=np.array(Image.open(art/f'spot-{slug}-objects.png'));x0,y0,x1,y1=box
 assert np.array_equal(a[y0:y1,x0:x1],b[y0:y1,x0:x1]),(slug,'non-object spill')
assert len(results)==24
(OUT/'results.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2));print('PASS all24 object/hash/grayscale/detail/anchor checks; two non-object spill regressions')
