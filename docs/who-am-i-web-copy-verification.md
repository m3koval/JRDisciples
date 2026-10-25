# Website copy verification (unreleased)

Worktree: `/home/helper/work/JRDisciples-web-copy-review`
Branch: `review/who-am-i-web-copy`, based on fresh origin/main `2703ec4`.
Preview: http://127.0.0.1:3107/lessons/who-am-i (production Next server).
Homepage: http://127.0.0.1:3107/

## Executed gates
- `node scripts/check-who-am-i.mjs`: PASS. Full exact ESV/RST source remains bound to original v18 fixture, while all web copy is bound to a new website-specific fixture. Independent plot/gospel phrase guards retained; exact recall reconstruction and eight bilingual challenge mappings verified.
- `npm run check:bilingual`: PASS, 24 lessons, 7 stories and core activity data.
- `npm run check:scripture`: PASS, 4 Case for Christ and 7 guarded sermon lessons.
- `npm run lint`: exit 0, 0 errors, 31 existing repository warnings (image usage etc.). Log `/tmp/jd-web-lint.log`.
- `npm run build`: exit 0, route prerendered successfully. Log `/tmp/jd-web-build.log`.
- `QA_URL=http://127.0.0.1:3107 QA_DIR=/home/helper/outputs/jd-who-am-i-web-copy-review node scripts/test-who-am-i-browser.mjs`: PASS, phone 390×844 and tablet 820×1180, EN/RU. All eight activities in every combination, wrong attempts and retries, hints, success, keyboard Continue, full recall quote hidden in practice, return to study, completion, reset/language persistence, PDF links, no console errors or horizontal overflow.
- Live published route independently inspected with local Playwright after browser-use and web gateway were unavailable; baseline still showed older 15–20-minute/two-mirrors copy, as expected. No release performed.
- Mobile homepage exact CTA checked in both languages: `New lesson: Who Am I? →` / `Новый урок: Кто я? →`, href `/lessons/who-am-i`. Prayer lesson links remain present.
- Visual review: cropped phone EN/RU expanded soccer passages and tablet EN/RU priesthood passages. Readable dark text on opaque light panels, separate paragraphs and speakers, natural growing panels, no clipped copy. Existing stylesheet needed no modification.
- `git diff --check`: PASS. No diff in Scripture source or `public/printables`; PDFs untouched.

## Evidence
`/home/helper/outputs/jd-who-am-i-web-copy-review/browser-results.json`
Screenshots in the same directory: each device/language intro; story-0 through story-7; feedback; recall; completion; `home-en.png` and `home-ru.png`.

## Review handoff
Full before/after string inventory and editorial rationale: `docs/who-am-i-web-copy-audit.md`.
Website authoritative text fixture: `scripts/fixtures/who-am-i-web-copy.json` (editorial candidate for parent review, not authorization to publish).
No push or public deployment. Parent owns prose approval and eventual release. The page intentionally scrolls for expanded reading; it is not a forced single-viewport booklet.
