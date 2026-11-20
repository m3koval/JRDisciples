# Technical SEO

Submit `https://www.juniordisciples.com/sitemap.xml` in Google Search Console.
This repository does not submit to Search Console or promise indexing.

- `app/sitemap.ts` generates URLs from `lib/seo-pages.ts`: a reviewed static-page allowlist plus the same published story, quiz, verse, word-search, rebus, and WHY data used by the routes.
- New static public pages must be added to `staticPublicPaths`. New data-driven pages are included automatically. The rendered coverage check fails if a built HTML page is omitted unexpectedly.
- `/quest` is a redirect, not a sitemap destination. `/progress` and `/practice` are personal-state screens, omitted and marked `noindex, follow`. They remain crawlable so crawlers can read the noindex instruction. Robots is not access control.
- Language selection uses the same URL. Do not invent `/en`, `/ru`, or hreflang URLs. No last-modified dates are emitted without reliable content modification evidence.
- `lib/seo.ts` builds absolute canonical, Open Graph, and Twitter metadata. The root layout deliberately has no canonical; each indexable route supplies its own. Server layouts wrap existing client pages without changing their content or interactions.
- The homepage client implementation is preserved in `app/HomePage.tsx`; `app/page.tsx` supplies server metadata. Its content-placement guard follows that explicit import.
- Existing lesson/story images are reused; the Bible-adventure hub image is the default social preview. No image-generation service is needed.

## Verification

```sh
npm ci
npm run lint -- --max-warnings=32
npm run check:bilingual
npm run check:scripture
npm run check:case-russian
npm run check:assets
npm run check:why
npm run build
python3 scripts/check-seo.py
python3 scripts/check-seo.py https://www.juniordisciples.com
```

Run the remaining repository content gates in `.github/workflows/quality.yml` as well. The SEO check parses the actual generated XML, compares its unique destinations with every built HTML route minus explicit exclusions, and checks rendered metadata on every destination. With a base URL it reads every destination over HTTP, checks for redirects/status errors, verifies robots and personal-page noindex, and compares coverage with the local production build. Run against the exact deployed commit. It outputs a JSON evidence manifest with URLs, titles, canonicals, images, count, and section totals.

Initial verified coverage: 155 unique URLs (58 static and 97 data-driven). Do not freeze this count in tests; compare actual route coverage so legitimate additions are supported.

Deployment uses the existing GitHub main → Vercel integration. A successful push is not live verification: check the exact commit's Vercel status and read the production sitemap/robots/page metadata afterward. Keep unrelated local work isolated and content automation paused.
