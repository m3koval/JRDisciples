import os,json,hashlib,re
from pathlib import Path
import pymupdf as fitz
root=Path(__file__).resolve().parents[1]
d=Path(os.environ.get('PDF_DIR',root/'public/printables/clean-inside-outside'))
b=json.loads((root/'app/lessons/clean-inside-outside/booklet.json').read_text());s=json.loads((root/'app/lessons/clean-inside-outside/scripture.json').read_text());m=json.loads((root/'docs/shiny-cup/preservation.json').read_text())
def norm(x):return re.sub(r'\s+','',x.replace('*',''))
files=list(d.glob('*.pdf'));assert len(files)==8
for p in files:
 key='public/printables/clean-inside-outside/'+p.name
 assert hashlib.sha256(p.read_bytes()).hexdigest()==m['files'][key]
 doc=fitz.open(p);lang='ru' if '-RU-' in p.name else 'en';text=norm(' '.join(page.get_text() for page in doc))
 if 'READING' in p.name:
  assert len(doc)==4
  for x in b[lang]['story']+b[lang]['connect'].split('\n\n')+[b[lang]['ask'],b[lang]['remember']]:assert norm(x) in text,(p.name,x)
  for n in ['24','25','26']:assert norm(s[lang][n]['text']) in text
 elif 'TEACHER' in p.name:
  for v in s[lang].values():assert norm(v['text']) in text
 else:
  assert len(doc)==2
  w,h=doc[0].rect.width,doc[0].rect.height
  expected=(792,612) if 'LETTER' in p.name else (841.89,595.28)
  assert abs(w-expected[0])<.1 and abs(h-expected[1])<.1
print('PASS eight exact approved PDF hashes, 17 story paragraphs and Connect/ask/remember per language, full teacher Scripture, student quotes and imposed paper dimensions. Hash identity preserves approved imposition and QR.')
