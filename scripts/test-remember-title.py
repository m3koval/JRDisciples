"""Verify the main title only is big, bold, red, and fits EN/RU screens."""
import json
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

base = sys.argv[1].rstrip('/')
tag = sys.argv[2] if len(sys.argv) > 2 else 'local'
results = []
with sync_playwright() as p:
    browser = p.chromium.launch()
    for lang, title in [('en', 'BEWARE!'), ('ru', 'БЕРЕГИСЬ!')]:
        for width in [320, 390, 1440]:
            context = browser.new_context(viewport={'width': width, 'height': 900})
            context.add_init_script(f"localStorage.setItem('language', '{lang}')")
            page = context.new_page()
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.goto(base + '/lessons/remember-the-giver', wait_until='networkidle')
            expect(page.locator('article')).to_have_attribute('lang', lang)
            heading = page.locator('h1')
            expect(heading).to_have_text(title)
            page.evaluate('document.fonts.ready')
            heading.scroll_into_view_if_needed()
            style = heading.evaluate('''el => {
                const s = getComputedStyle(el), r = el.getBoundingClientRect();
                const range = document.createRange(); range.selectNodeContents(el);
                const text = range.getBoundingClientRect();
                return {color:s.color, weight:s.fontWeight, size:parseFloat(s.fontSize),
                    font:s.fontFamily, left:r.left, right:r.right,
                    textLeft:text.left, textRight:text.right,
                    overflow:document.documentElement.scrollWidth > innerWidth};
            }''')
            assert style['color'] == 'rgb(215, 25, 32)', style
            assert int(style['weight']) >= 900, style
            assert style['size'] >= 40, style
            assert style['font'].startswith('Nunito'), style
            assert not style['overflow'], style
            assert 0 <= style['textLeft'] <= style['textRight'] <= width, style
            assert style['textRight'] <= style['right'] + 1, style
            screenshot = f'/tmp/remember-title-{tag}-{lang}-{width}.png'
            page.screenshot(path=screenshot)
            page.get_by_test_id('start').click()
            expect(heading).to_have_text('Michael’s new car' if lang == 'en' else 'Новая машинка Мишутки')
            assert heading.evaluate('el => getComputedStyle(el).color') != style['color']
            assert not errors, errors
            results.append({'language': lang, 'width': width, 'title': title, 'style': style,
                            'stage_title_not_red': 'PASS', 'screenshot': screenshot})
            context.close()
    browser.close()
output = json.dumps(results, ensure_ascii=False, indent=2)
Path(f'/tmp/remember-title-{tag}.json').write_text(output)
print(output)
