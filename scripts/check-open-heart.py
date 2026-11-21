from pathlib import Path
import json,re,hashlib
import pymupdf as fitz
from bs4 import BeautifulSoup
from PIL import Image,ImageChops,ImageStat
R=Path(__file__).resolve().parents[1];D=R/'app/lessons/open-heart';Q=R/'docs/open-heart/qa';O=R/'public/printables/open-heart'
b=json.loads((D/'booklet.json').read_text());s=json.loads((D/'scripture.json').read_text());puzzles=json.loads((D/'puzzles.json').read_text())
assert b['en'].keys()==b['ru'].keys()
for k in b['en']:
 if isinstance(b['en'][k],list):assert len(b['en'][k])==len(b['ru'][k]),k
normalize=lambda t:' '.join(t.split())
cache=Path('/home/helper/.hermes/cache/scratch/open-heart-scripture');report={}
for lang in ['en','ru']:
 L=lang.upper();src=fitz.open(O/f'Open-Heart-{L}-READING.pdf');teacher=fitz.open(O/f'Open-Heart-{L}-TEACHER.pdf');texts=[normalize(page.get_text()) for page in src];tt=normalize(' '.join(page.get_text() for page in teacher));assert len(src)==4
 assert list(map(int,s[lang]))==[i for i in range(13,27) if not(lang=='en' and i==14)]
 for n,v in s[lang].items():
  html=BeautifulSoup((cache/f'{lang}-{n}.html').read_text(),'html.parser');ps=[normalize(x.get_text(' ',strip=True)) for x in html.find_all('p')]
  assert normalize(v['text']) in ps,(lang,n,'rendered Bible.com mismatch')
  assert normalize(v['text']) in tt,(lang,n,'teacher quote missing')
 for i,story in enumerate(b[lang]['story']):assert normalize(story) in texts[i],(lang,i,'narrative drift')
 for page,n in [(0,'13'),(1,'23'),(3,'26')]:assert normalize(s[lang][n]['text']) in texts[page],(lang,n,'child quote drift')
 for doc in [src,teacher]:
  for page in doc:
   assert '\ufffd' not in page.get_text()
   for block in page.get_text('dict')['blocks']:
    for line in block.get('lines',[]):
     for sp in line['spans']:
      x0,y0,x1,y1=sp['bbox'];assert x0>=0 and y0>=0 and x1<=page.rect.width+1 and y1<=page.rect.height+1
 # Independently scan every direction; require exact once-only matches.
 g=puzzles[lang]['grid'];N=len(g)
 for word in b[lang]['words']:
  matches=[]
  for rr in range(N):
   for cc in range(N):
    for dr in [-1,0,1]:
     for dc in [-1,0,1]:
      if not(dr or dc):continue
      cells=[(rr+j*dr,cc+j*dc) for j in range(len(word))]
      if all(0<=r<N and 0<=c<N for r,c in cells) and ''.join(g[r][c] for r,c in cells)==word:matches.append(cells)
  assert len(matches)==1,(lang,word,matches)
  expected=next(v['cells'] for v in puzzles[lang]['words'] if v['word']==word);assert [list(x) for x in matches[0]]==expected
 # Raster compare each imposed panel with independently transformed reading page.
 errors=[]
 for paper in ['A4','LETTER']:
  imposed=fitz.open(O/f'Open-Heart-{L}-{paper}-LONG-EDGE.pdf')
  for pn,pair in enumerate([(3,0),(2,1)]):
   for panel,reading in enumerate(pair):
    pw,ph=imposed[pn].rect.width,imposed[pn].rect.height;clip=fitz.Rect(panel*pw/2,0,(panel+1)*pw/2,ph)
    pix=imposed[pn].get_pixmap(clip=clip);actual=Image.frombytes('RGB',(pix.width,pix.height),pix.samples)
    expected=fitz.open();page=expected.new_page(width=pw/2,height=ph);page.show_pdf_page(page.rect,src,reading,rotate=180 if pn else 0);pix=page.get_pixmap();want=Image.frombytes('RGB',(pix.width,pix.height),pix.samples)
    if actual.size!=want.size:actual=actual.resize(want.size)
    err=sum(ImageStat.Stat(ImageChops.difference(actual,want)).mean)/3;assert err<5,(paper,pn,panel,err);errors.append(round(err,3))
 for i,page in enumerate(teacher):page.get_pixmap(matrix=fitz.Matrix(1.25,1.25)).save(Q/f'{L}-teacher-{i+1}.png')
 report[lang]={'scriptureVerses':len(s[lang]),'BibleComRenderedParagraphs':'PASS','printedStoryPreservation':'PASS','childFullQuotes':[13,23,26],'teacherFullPassage':'PASS','teacherPages':len(teacher),'independentWordSearchScan':'PASS','impositionPanelMeanPixelErrors':errors,'allPDFTextBounds':'PASS'}
chapter=BeautifulSoup((cache/'en-chapter.html').read_text(),'html.parser').get_text(' ',strip=True)
assert 'Some manuscripts add here (or after verse 12) verse 14' in chapter
report['verse14FootnoteVerified']=True
report['preservation']={'bookletSHA256':hashlib.sha256((D/'booklet.json').read_bytes()).hexdigest(),'scriptureSHA256':hashlib.sha256((D/'scripture.json').read_bytes()).hexdigest(),'websiteUsesSharedNarrative':"import booklet from './booklet.json'" in (D/'page.tsx').read_text()}
(Q/'content-results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False,indent=2))
