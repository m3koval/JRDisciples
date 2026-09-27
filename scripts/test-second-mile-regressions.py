#!/usr/bin/env python3
"""Regression fixtures for damaged checkpoints and read-allowed/write-denied storage."""
import argparse
import json
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

parser = argparse.ArgumentParser()
parser.add_argument('--base-url', default='http://127.0.0.1:3108')
args = parser.parse_args()
rows = []
with sync_playwright() as pw:
    browser = pw.chromium.launch()
    for state in [
        {'scene': 2, 'phase': 'do', 'sorted': [0, 1, 2, 3]},
        {'scene': 3, 'phase': 'do', 'matched': [0, 1, 2]},
    ]:
        context = browser.new_context()
        context.add_init_script('localStorage.setItem("second-mile-progress", ' + json.dumps(json.dumps(state)) + ')')
        page = context.new_page()
        page.goto(args.base_url + '/lessons/second-mile')
        expect(page.get_by_test_id('next')).to_be_visible()
        page.get_by_test_id('next').click()
        expect(page.get_by_test_id('play')).to_be_visible()
        rows.append({'name': 'completed-checkpoint-scene-' + str(state['scene']), 'passed': True})
        context.close()
    context = browser.new_context(viewport={'width': 820, 'height': 1180}, has_touch=True)
    context.add_init_script('''
        localStorage.setItem('second-mile-progress', JSON.stringify({scene:0,phase:'learn'}));
        Storage.prototype.setItem = function(){throw new DOMException('QA full quota','QuotaExceededError')};
    ''')
    page = context.new_page()
    page.goto(args.base_url + '/lessons/second-mile')
    page.get_by_test_id('start').tap()
    page.get_by_test_id('play').tap()
    for i in range(5):
        page.get_by_test_id(f'tile-{i}').tap()
    page.get_by_test_id('check').tap()
    expect(page.get_by_test_id('next')).to_be_visible()
    page.get_by_test_id('next').tap()
    expect(page.get_by_role('heading', name='What is moving my heart?')).to_be_visible()
    rows.append({'name': 'stale-readable-storage-write-denied-touch-progression', 'passed': True})
    context.close()
    browser.close()
out = Path(__file__).resolve().parents[1] / 'docs/second-mile-browser-qa/regressions.json'
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps({'url': args.base_url, 'checks': rows}, indent=2) + '\n')
print(json.dumps(rows, indent=2))
