"""Verify built SEO coverage, or read back every URL from a deployed base URL.
Run after npm run build: python3 scripts/check-seo.py [https://www.juniordisciples.com]
"""
import json
import sys
import xml.etree.ElementTree as ET
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
from urllib.request import Request, urlopen

ORIGIN = 'https://www.juniordisciples.com'
base = sys.argv[1].rstrip('/') if len(sys.argv) > 1 else None
build = Path('.next/server/app')


def fetch(path):
    with urlopen(Request(base + path, headers={'User-Agent': 'JuniorDisciples-SEO-QA/1.0'}), timeout=45) as response:
        assert response.status == 200, (path, response.status)
        assert urlsplit(response.url).path == path, (path, response.url)
        return response.read().decode()


def content(path):
    if base:
        return fetch(path)
    return (build / ('index.html' if path == '/' else path.lstrip('/') + '.html')).read_text()


class Head(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.meta = {}
        self.canonical = []
        self.title = ''
        self.in_title = False
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'meta':
            self.meta[attrs.get('name', attrs.get('property'))] = attrs.get('content', '')
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonical.append(attrs['href'])
        if tag == 'title':
            self.in_title = True

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data


xml = fetch('/sitemap.xml') if base else (build / 'sitemap.xml.body').read_text()
root = ET.fromstring(xml)
assert root.tag == '{http://www.sitemaps.org/schemas/sitemap/0.9}urlset'
urls = [node.text for node in root.findall('{*}url/{*}loc')]
assert urls and len(urls) == len(set(urls)), 'Missing or duplicate URLs'
paths = []
for url in urls:
    assert isinstance(url, str)
    parsed = urlsplit(url)
    assert parsed.scheme + '://' + parsed.netloc == ORIGIN
    assert not parsed.query and not parsed.fragment
    assert '[' not in url and parsed.path not in ['/quest', '/progress', '/practice']
    paths.append(parsed.path)
# Independently compare with every actual prerendered HTML page, not the SEO catalog.
expected = {
    '/' if file.name == 'index.html' and file.parent == build else '/' + str(file.relative_to(build))[:-5]
    for file in build.rglob('*.html')
} - {'/_not-found', '/_global-error', '/quest', '/progress', '/practice'}
assert set(paths) == expected, {'missing': sorted(expected-set(paths)), 'extra': sorted(set(paths)-expected)}
robots = fetch('/robots.txt') if base else (build / 'robots.txt.body').read_text()
assert 'Sitemap: ' + ORIGIN + '/sitemap.xml' in robots
assert 'Disallow: /\n' not in robots


def check(path):
    head = Head(content(path))
    canonical = ORIGIN if path == '/' else ORIGIN + path
    assert head.canonical == [canonical], (path, head.canonical)
    assert head.title and head.title.endswith(' | Junior Disciples'), (path, head.title)
    assert len(head.meta.get('description', '')) > 30, path
    assert head.meta.get('og:url') == canonical, path
    assert head.meta.get('og:title') == head.title, path
    assert head.meta.get('twitter:title') == head.title, path
    assert head.meta.get('twitter:card') == 'summary_large_image', path
    assert head.meta.get('og:description') == head.meta['description'], path
    assert 'noindex' not in head.meta.get('robots', ''), path
    image = head.meta.get('og:image', '')
    assert image.startswith(ORIGIN + '/'), (path, image)
    assert head.meta.get('twitter:image') == image, path
    assert (Path('public') / urlsplit(image).path.lstrip('/')).is_file(), image
    return {'path': path, 'title': head.title, 'canonical': head.canonical[0], 'image': image}


with ThreadPoolExecutor(max_workers=4) as pool:
    checked = list(pool.map(check, paths))
for path in ['/progress', '/practice']:
    assert 'noindex' in Head(content(path)).meta.get('robots', ''), path
report = {'base': base or 'production build', 'count': len(checked),
          'sections': dict(sorted(Counter(path.split('/')[1] or 'home' for path in paths).items())),
          'pages': checked}
print(json.dumps(report, indent=2))
