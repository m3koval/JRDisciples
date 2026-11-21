from pathlib import Path
import requests,json,re,concurrent.futures
from bs4 import BeautifulSoup
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'app/lessons/open-heart'; OUT.mkdir(parents=True,exist_ok=True)
CACHE=Path('/home/helper/.hermes/cache/scratch/open-heart-scripture');CACHE.mkdir(exist_ok=True)
def fetch(item):
 lang,n=item; version,abbr=('59','ESV') if lang=='en' else ('167','RST')
 url=f'https://www.bible.com/bible/{version}/MAT.23.{n}.{abbr}'
 r=requests.get(url,timeout=45);r.raise_for_status();(CACHE/f'{lang}-{n}.html').write_text(r.text)
 if lang=='en' and n==13:
  chapter=requests.get('https://www.bible.com/bible/59/MAT.23.ESV',timeout=45);chapter.raise_for_status();(CACHE/'en-chapter.html').write_text(chapter.text)
 soup=BeautifulSoup(r.text,'html.parser'); data=soup.find('script',id='__NEXT_DATA__'); found=[]
 if data:
  def walk(o):
   if isinstance(o,dict):
    if isinstance(o.get('verses'),list):
     for v in o['verses']:
      if v.get('content'): found.append(BeautifulSoup(v['content'],'html.parser').get_text(' ',strip=True))
    for v in o.values():walk(v)
   elif isinstance(o,list):
    for v in o:walk(v)
  walk(json.loads(data.string))
 if not found:
  ps=[p.get_text(' ',strip=True) for p in soup.find_all('p')]
  desc=soup.find('meta',attrs={'name':'description'})
  candidates=[p for p in ps if len(p)>45 and (p.startswith('“') or p.startswith('Woe') or p.startswith('Горе') or p.startswith('Слеп') or p.startswith('Вы') or p.startswith('Итак') or p.startswith('Безум') or p.startswith('Кто') or p.startswith('Так') or p.startswith('You') or p.startswith('So') or p.startswith('And'))]
  if desc and ps and desc.get('content','').strip().startswith(ps[0][:45]): candidates=[ps[0]]
  if not candidates: raise ValueError((url,ps[:8],str(desc)))
  found=[candidates[0]]
 return lang,n,{'text':found[0],'url':url}
result={'en':{},'ru':{}}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
 for l,n,v in ex.map(fetch,[(l,n) for l in ['en','ru'] for n in range(13,27) if not(l=='en' and n==14)]):result[l][str(n)]=v
(OUT/'scripture.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(result,ensure_ascii=False,indent=2))
