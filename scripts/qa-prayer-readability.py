import asyncio,json,os
from pathlib import Path
from playwright.async_api import async_playwright
BASE=os.environ.get('JD_BASE','http://127.0.0.1:3128')
OUT=Path(os.environ.get('JD_QA_OUT','/tmp/jd-prayer-readability'));OUT.mkdir(exist_ok=True)
def lum(rgb):
 a=[v/255 for v in rgb];a=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in a]
 return sum(x*y for x,y in zip(a,[.2126,.7152,.0722]))
async def main():
 results=[]
 async with async_playwright() as pw:
  for engine in os.environ.get('JD_ENGINES','chromium').split(','):
   browser=await getattr(pw,engine).launch()
   for lang in ['en','ru']:
    for width,height in [(390,844),(1024,768)]:
     context=await browser.new_context(viewport={'width':width,'height':height},has_touch=True)
     await context.add_init_script(f"localStorage.setItem('language','{lang}')")
     page=await context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
     response=await page.goto(BASE+'/lessons/how-to-pray',wait_until='networkidle');assert response.status==200
     for id in ['father','holy','close','listening']:
      card=page.get_by_test_id('prayer-card-'+id)
      if id in ['father','close']:
       await card.tap()
      else:
       await card.focus();await page.keyboard.press('Enter')
      assert await card.get_attribute('aria-expanded')=='true'
      answer=card.get_by_test_id('prayer-card-answer');assert await answer.is_visible()
      colors=await answer.evaluate('''e=>{let c=getComputedStyle(e),b=getComputedStyle(e.parentElement),r=e.getBoundingClientRect(),p=e.parentElement.getBoundingClientRect();return {color:c.color,bg:b.backgroundColor,font:parseFloat(c.fontSize),fits:r.bottom<=p.bottom&&r.right<=p.right}}''')
      import re
      fg=list(map(int,re.findall(r'\d+',colors['color'])[:3]));bg=list(map(int,re.findall(r'\d+',colors['bg'])[:3]))
      ratio=(lum(bg)+.05)/(lum(fg)+.05)
      assert ratio>=4.5 and colors['font']>=16 and colors['fits'],colors
     await page.get_by_test_id('prayer-card-father').scroll_into_view_if_needed()
     await page.screenshot(path=str(OUT/f'{engine}-{lang}-{width}-cards.png'))
     assert not await page.evaluate('document.documentElement.scrollWidth>innerWidth')
     await page.reload(wait_until='networkidle');assert await page.get_by_test_id('prayer-card-answer').count()==4
     await page.goto(BASE+'/lessons/alone-with-god',wait_until='networkidle')
     await page.get_by_test_id('start').click()
     for step in range(5):
      await page.get_by_test_id('play').click()
      if step in [0,3]:await page.get_by_test_id(f'option-{1 if step==0 else 0}').click()
      elif step==1:
       for k in [1,2]:await page.get_by_test_id(f'option-{k}').click()
       await page.get_by_test_id('check').click()
      else:
       n=3 if step==2 or lang=='en' else 2
       if step==4:
        assert await page.get_by_test_id('challenge').locator('blockquote').count()==0
        assert await page.locator('blockquote:visible').count()==0
        await page.screenshot(path=str(OUT/f'{engine}-{lang}-{width}-memory.png'))
        # Study remains available explicitly, not beside the answer tiles.
        await page.get_by_test_id('read-again').click();assert await page.locator('blockquote:visible').count()>0
        await page.get_by_test_id('play').click()
        for k in reversed(range(n)):await page.get_by_test_id(f'tile-{k}').click()
        await page.get_by_test_id('check').click();assert await page.get_by_test_id('next').count()==0
        await page.get_by_test_id('clear').click()
       for k in range(n):await page.get_by_test_id(f'tile-{k}').click()
       await page.get_by_test_id('check').click()
      await page.get_by_test_id('next').click()
     assert not errors,errors
     results.append(dict(engine=engine,lang=lang,width=width,contrast=round(ratio,2),cards_keyboard_reload=True,memory_no_answer=True,retry_and_study=True,errors=errors))
     await context.close()
   await browser.close()
 (OUT/'results.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
asyncio.run(main())
