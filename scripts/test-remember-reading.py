"""Bilingual reading and six-stage regression. Requires Python Playwright + Chromium."""
import json
import sys
from playwright.sync_api import sync_playwright, expect

base = sys.argv[1].rstrip('/')
results = []
with sync_playwright() as p:
    browser = p.chromium.launch()
    for lang in ['en', 'ru']:
        context = browser.new_context(viewport={'width': 390, 'height': 844})
        context.add_init_script(f"localStorage.setItem('language', '{lang}')")
        page = context.new_page()
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(base + '/lessons/remember-the-giver', wait_until='networkidle')
        expect(page.locator('article')).to_have_attribute('lang', lang)
        title = 'BEWARE!' if lang == 'en' else 'БЕРЕГИСЬ!'
        expect(page.locator('h1')).to_have_text(title)
        assert page.url.rstrip('/').endswith('/lessons/remember-the-giver')
        page.get_by_test_id('start').click()
        expect(page.locator('h1')).to_have_text('Michael’s new car' if lang == 'en' else 'Новая машинка Мишутки')
        for scene, answer in enumerate([1, None, 0, None, 2, 1]):
            expect(page.get_by_test_id('play')).to_be_visible()
            text = page.locator('article').inner_text()
            assert 'Remember the Giver' not in text
            assert 'Have you remembered the person' not in text
            if scene == 0:
                phrase = '“Michael, did you say thank you to Grandma?” Rosie asks.' if lang == 'en' else '«Мишутка, а ты бабушке спасибо сказал?» — спрашивает Рози.'
                expect(page.get_by_text(phrase, exact=True)).to_be_visible()
                page.wait_for_function("document.querySelector('h1').getBoundingClientRect().top >= 140")
                page.screenshot(path=f'/tmp/remember-reading-{lang}.png')
            if scene == 2:
                expect(page.locator('article h2:visible')).to_have_count(3)
                example = 'A real man named Jack Whittaker' if lang == 'en' else 'Вот история из жизни. Джек Уиттакер'
                expect(page.locator('article p').filter(has_text=example)).to_be_visible()
                question = 'Imagine getting every toy and game' if lang == 'en' else 'Представь, что у тебя появились все игрушки и игры'
                expect(page.locator('article p').filter(has_text=question)).to_be_visible()
                page.screenshot(path=f'/tmp/remember-example-{lang}.png', full_page=True)
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
            page.get_by_test_id('play').click()
            if scene in [1, 3]:
                for i in range(4 if scene == 1 else 3):
                    page.get_by_test_id(f'tile-{i}').click()
                page.get_by_test_id('check').click()
            else:
                assert answer is not None
                page.get_by_test_id(f'option-{(answer + 1) % 3}').click()
                expect(page.get_by_test_id('next')).to_have_count(0)
                page.get_by_test_id(f'option-{answer}').click()
            expect(page.get_by_test_id('next')).to_be_visible()
            page.get_by_test_id('next').click()
        expect(page.locator('input[type=radio]')).to_have_count(3)
        page.locator('input[type=radio]').first.check()
        page.get_by_text('Parent & teacher guide' if lang == 'en' else 'Родителям и учителям', exact=True).click()
        source = page.locator('a[href="https://abcnews.com/2020/powerball-winner-cursed/story?id=3012631"]')
        expect(source).to_be_visible()
        assert not errors, errors
        results.append({'language': lang, 'title_and_route': 'PASS', 'jack_example_and_adult_source': 'PASS', 'six_stages': 'PASS', 'dialogue_and_headings': 'PASS', 'wrong_answer_retries': 'PASS', 'errors': errors})
        context.close()
    browser.close()
print(json.dumps(results, ensure_ascii=False, indent=2))
