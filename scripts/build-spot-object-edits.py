"""Reproducible, local object-color edits of owned original scene art.
No provider calls. Never starts from the old after images (floating markers).
Polygon bounds are shared with gameplay, while hue masks preserve skin/shadows.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
import json, hashlib, base64
ROOT=Path(__file__).resolve().parents[1]
ART=ROOT/'public/images/jr/games/spot'
def edit(name, ru, points, hue, source=None, saturation=None):
 return dict(nameEn=name,nameRu=ru,polygon=points,hue=hue,sourceHue=source,saturation=saturation)
EDITS={
 'water-to-wine':[
 edit('The front-left jar','Передний левый сосуд',[[162,596],[277,596],[287,629],[290,704],[271,770],[233,785],[186,778],[163,755],[148,702],[149,649]],145,None,70),
 edit('The flowers above the doorway','Цветы над дверью',[[437,0],[684,0],[684,83],[539,165],[437,152]],30,[210,255],190),
 edit('The purple flowers beside the wall','Фиолетовые цветы у стены',[[680,562],[768,562],[768,646],[679,646]],145,[190,255],175)],
 'feeding-5000':[
 edit('The seated woman’s head covering','Платок сидящей женщины',[[80,548],[176,539],[197,625],[171,627],[142,564],[100,648],[79,671]],105,[155,235],130),
 edit('The boy’s tunic below the basket','Одежда мальчика под корзиной',[[302,748],[382,757],[393,819],[371,841],[249,847],[255,782],[302,781]],146,None,100),
 edit('The fish in the basket','Рыба в корзине',[[401,691],[423,648],[452,632],[463,646],[484,650],[484,678],[455,697]],8,[130,190],135)],
 'calm-storm':[
 edit('The middle disciple’s blue robe','Синяя одежда ученика в середине',[[346,686],[380,639],[409,624],[426,698],[444,741],[480,643],[508,631],[545,663],[563,740],[549,776],[513,778],[502,736],[480,721],[463,740],[402,734],[385,719],[344,719]],210,[115,185],130),
 edit('The disciple’s green sleeve on the left','Зелёный рукав ученика слева',[[81,674],[105,649],[151,630],[167,643],[150,699],[133,710],[119,685]],8,[25,110],130),
 edit('The hat on the right','Головной убор справа',[[567,556],[589,539],[620,538],[651,554],[666,579],[662,611],[646,627],[629,595],[604,579]],153,None,85)],
 'zacchaeus':[
 edit('Zacchaeus’s purple clothes','Фиолетовая одежда Закхея',[[163,171],[354,171],[354,313],[157,313]],112,[180,245],150),
 edit('The blue sash','Синяя накидка',[[540,592],[572,594],[584,655],[608,693],[641,708],[644,750],[630,763],[596,748],[571,716],[554,673]],4,[105,185],140),
 edit('The purple flowers beside the tree','Фиолетовые цветы у дерева',[[0,782],[53,782],[53,836],[0,836]],30,[185,255],185)],
 'good-samaritan':[
 edit('The Samaritan’s red headband','Красная повязка самарянина',[[258,295],[325,293],[383,301],[446,310],[450,332],[394,328],[322,319],[256,316]],146,None,135),
 edit('The case beside the road','Сундук у дороги',[[58,828],[122,792],[220,824],[211,958],[155,964],[55,920]],145,None,95),
 edit('The tree at the upper left','Дерево слева вверху',[[28,94],[58,95],[57,62],[99,48],[127,57],[128,50],[166,59],[174,90],[208,101],[232,124],[234,171],[192,176],[194,199],[160,208],[121,188],[78,188],[77,175],[31,169],[27,153],[22,152],[22,132]],5,[30,100],160)],
 'lost-sheep':[
 edit('The shepherd’s brown sash','Коричневая накидка пастуха',[[370,355],[421,352],[417,515],[392,624],[350,686],[308,698],[266,665],[256,603],[282,579],[326,561],[351,470]],147,None,110),
 edit('The tree on the upper right','Дерево справа вверху',[[605,20],[768,20],[768,163],[621,162]],5,[28,110],170),
 edit('The purple flower at the lower left','Фиолетовый цветок слева внизу',[[117,780],[156,780],[156,821],[117,821]],30,[170,255],195)],
 'daniel-lions':[
 edit('Daniel’s belt','Пояс Даниила',[[335,691],[447,693],[455,717],[419,726],[339,726]],147,None,145),
 edit('The brown fabric below the belt','Коричневая ткань под поясом',[[389,729],[417,725],[395,854],[347,869]],3,None,130),
 edit('The hanging leaves on the upper right','Свисающие листья справа вверху',[[490,10],[650,10],[650,263],[490,263]],3,[30,110],145)],
 'empty-tomb':[
 edit('The woman’s purple robe','Фиолетовая одежда женщины',[[0,405],[188,405],[188,838],[0,838]],145,[178,245],150),
 edit('The other woman’s teal head covering','Бирюзовый платок другой женщины',[[174,408],[300,408],[300,620],[174,620]],8,[95,180],160),
 edit('The purple flowers on the wall','Фиолетовые цветы на стене',[[381,0],[697,0],[697,206],[381,206]],30,[180,255],180)]}

def main():
 manifest=[]
 for slug,edits in EDITS.items():
  src=ART/f'spot-{slug}-before.png'; im=Image.open(src).convert('RGB'); out=im.copy(); hsv=np.array(im.convert('HSV')); union=np.zeros(hsv.shape[:2],dtype=bool)
  for i,e in enumerate(edits):
   mask=Image.new('L',im.size); ImageDraw.Draw(mask).polygon([tuple(p) for p in e['polygon']],fill=255)
   mask=mask.filter(ImageFilter.GaussianBlur(0.6)); alpha=np.array(mask,dtype=float)/255
   if e['sourceHue']:
    lo,hi=e['sourceHue']; alpha*=((hsv[:,:,0]>=lo)&(hsv[:,:,0]<=hi)&(hsv[:,:,1]>25))
   modified=hsv.copy(); modified[:,:,0]=e['hue']
   if e['saturation'] is not None: modified[:,:,1]=e['saturation']
   rgb=np.array(Image.fromarray(modified,'HSV').convert('RGB'),dtype=float)
   current=np.array(out,dtype=float); out=Image.fromarray(np.uint8(np.round(current*(1-alpha[:,:,None])+rgb*alpha[:,:,None])))
   union|=alpha>0
   e['id']=i+1
   small=np.array(Image.fromarray(np.uint8(alpha*255)).resize((96,128),Image.Resampling.BOX))>45
   e['hitMask']=base64.b64encode(np.packbits(small.reshape(-1)).tobytes()).decode()
   ys,xs=np.nonzero(small); cy,cx=np.mean(ys),np.mean(xs); nearest=np.argmin((ys-cy)**2+(xs-cx)**2)
   e['anchor']=[int(xs[nearest])*8+4,int(ys[nearest])*8+4]
   e['changedPixels']=int(np.count_nonzero(alpha>.5))
   if e['changedPixels']<120: raise ValueError(f'Invisible object edit: {slug}/{i}')
  path=ART/f'spot-{slug}-objects.png'; out.save(path,optimize=True)
  outside=np.array(im)!=np.array(out); assert not np.any(outside[~union]),slug
  manifest.append(dict(id=slug,source=src.name,sourceSha256=hashlib.sha256(src.read_bytes()).hexdigest(),output=path.name,outputSha256=hashlib.sha256(path.read_bytes()).hexdigest(),differences=edits))
  print(slug,[(e['nameEn'],e['changedPixels']) for e in edits])
 target=ROOT/'app/games/spot-the-difference/object-edits.json'; target.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
if __name__=='__main__':main()
