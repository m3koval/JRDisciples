# Fix Notes: case-for-christ-bible r1

## Source QA
- `docs/content-drafts/case-for-christ/qa/case-for-christ-bible.content-qa.md`

## Fixes Applied
- Replaced Scripture verification markers with real quoted Scripture text from the World English Bible (WEB), clearly labeled.
- Added `translation: "WEB"` to draft frontmatter.
- Documented WEB as intentionally selected public-domain wording for safe site publishing.
- Added a concrete activity sentence: “Luke carefully checked what eyewitnesses said about Jesus.”
- Added a parent/teacher note explaining why Bible translations differ.
- Updated the shared lesson quality standard so full published Scripture blocks may intentionally use public-domain WEB while ESV remains preferred for references and short quotes when licensing permits.

## Gate Impact
- `[VERIFY ESV QUOTE BEFORE PUBLISHING]` markers removed from the draft.
- Scripture handling is now quote-based, labeled, and publishing-safe.

## Verification Needed
- Re-run content QA.
- If PASS, promote the draft into the app route.
