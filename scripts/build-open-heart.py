"""Rebuild bilingual print deliverables and shared deterministic puzzle data."""
from pathlib import Path
import json,random,hashlib,shutil
import pymupdf as fitz
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.lib.colors import HexColor
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing
from reportlab.graphics import renderPDF
import zxingcpp
ROOT=Path(__file__).resolve().parents[1]; DATA=ROOT/'app/lessons/open-heart'
OUT=ROOT/'public/printables/open-heart';OUT.mkdir(parents=True,exist_ok=True)
ART=ROOT/'public/images/lessons/open-heart';ART.mkdir(parents=True,exist_ok=True)
QA=ROOT/'docs/open-heart/qa';QA.mkdir(parents=True,exist_ok=True)
for name in ['cover.webp','coloring.webp']:shutil.copyfile(ROOT/'public/images/lessons/words-and-deeds'/name,ART/name)
b=json.loads((DATA/'booklet.json').read_text());s=json.loads((DATA/'scripture.json').read_text())
emphasis=json.loads((DATA/'emphasis.json').read_text())
def story(text,lang):
 for phrase in emphasis[lang]:text=text.replace(phrase,'<b>'+phrase+'</b>')
 return text
for name,file in [('DV','DejaVuSans.ttf'),('DVB','DejaVuSans-Bold.ttf')]:pdfmetrics.registerFont(TTFont(name,'/usr/share/fonts/truetype/dejavu/'+file))
pdfmetrics.registerFontFamily('DV',normal='DV',bold='DVB')
W,H=420.945,595.276;M=26;CW=W-2*M;INK='#203F45';RED='#8C2633'
URL='https://www.juniordisciples.com/lessons/open-heart'
def para(c,text,y,size=10.5,color=INK,bold=False,gap=7):
 p=Paragraph(text,ParagraphStyle('p',fontName='DVB' if bold else 'DV',fontSize=size,leading=size*1.29,textColor=HexColor(color)))
 _,h=p.wrap(CW,900);assert y-h>29,(text,y,h);p.drawOn(c,M,y-h);return y-h-gap
def start(c,n,title,lang):
 c.setFillColor(HexColor(INK));c.setFont('DV',8);c.drawString(M,H-20,'JUNIOR DISCIPLES');c.drawRightString(W-M,16,str(c.getPageNumber()));c.setFont('DV',7);c.drawString(M,16,b[lang]['version']);return para(c,title,H-36,20,bold=True)
def image(c,name,y,maxh):
 im=Image.open(ART/name);w,h=im.size;hh=min(maxh,CW*h/w);ww=hh*w/h
 c.drawImage(str(ART/name),M+(CW-ww)/2,y-hh,ww,hh);return y-hh-7
DIRS=[(dr,dc) for dr in [-1,0,1] for dc in [-1,0,1] if dr or dc]
def puzzle(words,alphabet,seed):
 rng=random.Random(seed);N=12
 for attempt in range(300):
  g=[['']*N for _ in range(N)];manifest=[]
  for word in sorted(words,key=len,reverse=True):
   opts=[]
   for r in range(N):
    for col in range(N):
     for dr,dc in DIRS:
      pts=[(r+i*dr,col+i*dc) for i in range(len(word))]
      if all(0<=a<N and 0<=bb<N and g[a][bb] in ('',ch) for (a,bb),ch in zip(pts,word)):opts.append(pts)
   if not opts:break
   pts=rng.choice(opts)
   for (a,bb),ch in zip(pts,word):g[a][bb]=ch
   manifest.append({'word':word,'cells':pts})
  if len(manifest)!=len(words):continue
  for row in g:
   for i,ch in enumerate(row):
    if not ch:row[i]=rng.choice(alphabet)
  counts={}
  for word in words:
   hits=0
   for r in range(N):
    for col in range(N):
     for dr,dc in DIRS:
      pts=[(r+i*dr,col+i*dc) for i in range(len(word))]
      if all(0<=a<N and 0<=bb<N for a,bb in pts) and ''.join(g[a][bb] for a,bb in pts)==word:hits+=1
   counts[word]=hits
  if all(n==1 for n in counts.values()):return {'grid':g,'words':manifest,'occurrences':counts}
 raise RuntimeError('puzzle generation failed')
def grid(c,p,y,marked=False):
 cell=18;left=(W-cell*12)/2
 if marked:
  c.setStrokeColor(HexColor('#d4dfc2'));c.setLineWidth(11)
  for item in p['words']:
   (r,a),(ss,bb)=item['cells'][0],item['cells'][-1];c.line(left+(a+.5)*cell,y-(r+.5)*cell,left+(bb+.5)*cell,y-(ss+.5)*cell)
 c.setFillColor(HexColor(INK));c.setFont('DV',11)
 for r,row in enumerate(p['grid']):
  for col,ch in enumerate(row):c.drawCentredString(left+(col+.5)*cell,y-(r+.5)*cell-4,ch)
 c.setStrokeColor(HexColor('#b9c6c1'));c.setLineWidth(.5);c.rect(left,y-216,216,216);return y-223
puzzles={l:puzzle(d['words'],d['alphabet'],20261+i) for i,(l,d) in enumerate(b.items())}
(DATA/'puzzles.json').write_text(json.dumps(puzzles,ensure_ascii=False,indent=2)+'\n')
report={}
for lang,d in b.items():
 L=lang.upper();path=OUT/f'Open-Heart-{L}-READING.pdf';c=canvas.Canvas(str(path),pagesize=(W,H));c.setTitle(d['title']);c.setAuthor('Junior Disciples')
 y=start(c,1,d['title'],lang);y=para(c,d['ref']+' · '+d['subtitle'],y,10,RED);y=para(c,story(d['story'][0],lang),y);y=image(c,'cover.webp',y,220);y=para(c,d['coverTask'],y,10)
 y=para(c,s[lang]['13']['text'],y,10,RED);y=para(c,('Матфея' if lang=='ru' else 'Matthew')+' 23:13',y,8.5,RED);c.showPage()
 y=start(c,2,d['headings'][1],lang);y=para(c,story(d['story'][1],lang),y);y=para(c,s[lang]['23']['text'],y,10,RED);y=para(c,('Матфея' if lang=='ru' else 'Matthew')+' 23:23',y,8.5,RED);y=para(c,d['find'],y,9.5);y=grid(c,puzzles[lang],y);y=para(c,' • '.join(d['words']),y,9.5,bold=True);c.showPage()
 y=start(c,3,d['headings'][2],lang);y=para(c,story(d['story'][2],lang),y);y=para(c,d['color'],y,9.5);y=image(c,'coloring.webp',y,285);y=para(c,d['decode'],y,9)
 xx=M
 for ch in d['message']:
  if ch==' ':xx+=14;continue
  c.setStrokeColor(HexColor(INK));c.rect(xx,y-21,25,22);c.setFont('DV',8);c.setFillColor(HexColor(INK));c.drawCentredString(xx+12.5,y-32,str(d['alphabet'].index(ch)+1));xx+=30
 assert y-32>28;c.showPage()
 y=start(c,4,d['headings'][3],lang);y=para(c,story(d['story'][3],lang),y);y=para(c,s[lang]['26']['text'],y,10,RED);y=para(c,('Матфея' if lang=='ru' else 'Matthew')+' 23:26',y,8.5,RED);y=para(c,d['sequence'],y,10,bold=True)
 for event in d['events']:y=para(c,'___ '+event,y,9.5,gap=5)
 y=para(c,d['grace'],y,10);y=para(c,d['response'],y,9.5);y=para(c,d['prayer'],y,9.5)
 assert y>111,('QR clearance',lang,y)
 qr=QrCodeWidget(URL,barLevel='M',barBorder=4);bounds=qr.getBounds();side=76;scale=side/(bounds[2]-bounds[0]);drawing=Drawing(side,side,transform=[scale,0,0,scale,0,0]);drawing.add(qr);renderPDF.draw(drawing,c,M,30)
 c.setFillColor(HexColor(INK));c.setFont('DVB',10);c.drawString(M+82,85,d['online']);c.setFont('DV',8);c.drawString(M+82,67,'www.juniordisciples.com');c.drawString(M+82,53,'/lessons/open-heart');c.linkURL(URL,(M,30,W-M,106),relative=0);c.save()
 src=fitz.open(path);assert len(src)==4
 for paper,pw,ph in [('A4',841.89,595.276),('LETTER',792,612)]:
  out=fitz.open()
  for pair in [(3,0),(1,2)]:
   page=out.new_page(width=pw,height=ph)
   for k,pno in enumerate(pair):page.show_pdf_page(fitz.Rect(k*pw/2,0,(k+1)*pw/2,ph),src,pno)
  baked=fitz.open()
  for p in out:
   page=baked.new_page(width=pw,height=ph);page.show_pdf_page(page.rect,out,p.number,rotate=180 if p.number==1 else 0)
  baked.save(OUT/f'Open-Heart-{L}-{paper}-LONG-EDGE.pdf')
  dirs=[ln['dir'] for bl in baked[1].get_text('dict')['blocks'] if 'lines' in bl for ln in bl['lines']];assert all(x[0]<-.99 for x in dirs)
  pix=baked[0].get_pixmap(matrix=fitz.Matrix(2,2));im=Image.frombytes('RGB',(pix.width,pix.height),pix.samples);assert URL in [x.text for x in zxingcpp.read_barcodes(im)]
  for i in range(2):baked[i].get_pixmap(matrix=fitz.Matrix(1,1)).save(QA/f'{L}-{paper}-spread-{i+1}.png')
 # Teacher notes and entire passage are intentionally separate from activity-first child pages.
 c=canvas.Canvas(str(OUT/f'Open-Heart-{L}-TEACHER.pdf'),pagesize=(W,H));y=start(c,1,d['adult'],lang)
 for text in [d['ref'],d['notes'],d['textual'],d['answers']]:
  if y<190:c.showPage();y=start(c,2,d['adult'],lang)
  y=para(c,text,y,10)
 c.showPage();y=start(c,3,'Шесть предупреждений' if lang=='ru' else 'Six connected warnings',lang)
 for ref,title,body in d['outline']:
  y=para(c,ref+' · '+title,y,11,bold=True);y=para(c,body,y,10)
 c.showPage();y=start(c,4,'Ключ к поиску слов' if lang=='ru' else 'Word-search answer key',lang);y=grid(c,puzzles[lang],y,True);y=para(c,' • '.join(d['words']),y,10)
 c.showPage();y=start(c,5,'Ключ к картинке' if lang=='ru' else 'Picture answer key',lang)
 top=y;bottom=image(c,'coloring.webp',y,350);side=350;left=(W-side)/2
 c.setStrokeColor(HexColor(RED));c.setLineWidth(1.5)
 for a,bb,cc,dd in [[0,64,7,76],[58,11,65,22],[69,37,74,45],[8,52,18,60],[66,79,83,95],[87,9,94,29]]:c.roundRect(left+a*side/100,top-dd*side/100,(cc-a)*side/100,(dd-bb)*side/100,4)
 y=para(c,d['message'],bottom,12,bold=True)
 c.showPage();y=start(c,6,d['ref'],lang)
 for n,v in s[lang].items():
  p=Paragraph(n+' '+v['text'],ParagraphStyle('v',fontName='DV',fontSize=10.5,leading=13.5));_,hh=p.wrap(CW,900)
  if y-hh<42:c.showPage();y=start(c,6,d['ref']+' · '+d['version'],lang)
  y=para(c,n+' '+v['text'],y,10.5,RED)
 if lang=='en':
  c.showPage();y=start(c,7,'Sources & printing',lang);y=para(c,'Scripture quotations marked ESV are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.',y,10)
 else:c.showPage();y=start(c,7,'Источники и печать',lang)
 y=para(c,'Bible.com: '+('https://www.bible.com/bible/59/MAT.23.ESV' if lang=='en' else 'https://www.bible.com/bible/167/MAT.23.RST'),y,9)
 y=para(c,'Landscape duplex, flip LONG edge. Outside [4|1]; inside [2|3] rotated 180°. Print at 100% (or fit if printer margins require it). Fold once. The QR route is prepared locally and must be deployed before distribution.' if lang=='en' else 'Печать: альбомная, с двух сторон, переворот по ДЛИННОМУ краю. Снаружи [4|1]; внутри [2|3], разворот повёрнут на 180°. Масштаб 100% (или по области печати). Согнуть один раз. Страница QR подготовлена локально: до раздачи нужно опубликовать урок.',y,10);c.save()
 thumbs=[]
 for page in src:
  for bl in page.get_text('dict')['blocks']:
   for ln in bl.get('lines',[]):
    for sp in ln['spans']:
     x0,y0,x1,y1=sp['bbox'];assert x0>=0 and x1<=W+1 and y0>=0 and y1<=H
  pix=page.get_pixmap(matrix=fitz.Matrix(1.5,1.5));im=Image.frombytes('RGB',(pix.width,pix.height),pix.samples);im.save(QA/f'{L}-page-{page.number+1}.png');thumbs.append(im)
 assert URL in [x.text for x in zxingcpp.read_barcodes(thumbs[3])]
 sheet=Image.new('RGB',(thumbs[0].width*2,thumbs[0].height*2),'#ddd')
 for i,im in enumerate(thumbs):sheet.paste(im,(i%2*im.width,i//2*im.height))
 sheet.save(QA/f'{L}-contact.png')
 report[L]={'reading_pages':len(src),'QR':URL,'imposition':'[4|1], rotate180([2|3]); A4 and Letter; back text direction verified','bounds':'PASS','word_unique_occurrences':puzzles[lang]['occurrences']}
manifest={'qr':URL,'art':{n:{'reusedFrom':'words-and-deeds/'+n,'sha256':hashlib.sha256((ART/n).read_bytes()).hexdigest(),'scene':'Cover: Michael watches Joseph carrying books and Rosie arranging supplies before Gracie joins. Coloring: later repair scene, boys carry a box while Rosie handles papers; Gracie is off-frame.'} for n in ['cover.webp','coloring.webp']},'pdfs':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in OUT.glob('*.pdf')}}
(DATA/'assets.json').write_text(json.dumps(manifest,indent=2)+'\n');(QA/'print-results.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
