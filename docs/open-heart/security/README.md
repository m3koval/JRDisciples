# Open Heart release security verification

## Outcome

Next.js and eslint-config-next are pinned to registry-confirmed **16.4.6** (previously installed/locked 16.4.2). Clean `npm ci`, production webpack build (177 static pages), and final browser regressions pass. The security reminder is absent without disabling it. No auth, framework configuration, firewall, deployment, print/art or lesson implementation changed. Work is isolated on `fix/open-heart-next-security`, based on lesson commit `34501cf`.

## Advisory provenance

The old warning comes from installed Next.js `dist/lib/upgrade/nudge.js`; `prepare-upgrade.js` POSTs `{next: versions}` to npm's bulk advisory endpoint. That endpoint URL is not itself an advisory identifier. Independently, `npm audit` and GitHub's upstream `vercel/next.js/security-advisories` API agree on seven moderate advisories affecting 16.4.2, all patched in **16.4.5**:

| GHSA | CVE | Affected Next 16 range |
|---|---|---|
| GHSA-mfr8-8qww-v76h | CVE-2026-119790 | >=16.3.0 <=16.4.4 |
| GHSA-vc7v-qv4w-wrv8 | CVE-2026-119351 | >=16.2.0 <=16.4.4 |
| GHSA-7qx7-33qx-rqx2 | CVE-2026-119347 | >=16.0.0 <=16.4.4 |
| GHSA-f3mh-rxg3-f5g2 | CVE-2026-119346 | >=16.0.0 <=16.4.4 |
| GHSA-pc58-hwjq-p385 | CVE-2026-119348 | >=16.0.0 <=16.4.4 |
| GHSA-rhh4-g77r-r9qj | CVE-2026-119349 | >=16.0.0 <=16.4.4 |
| GHSA-vvgp-ww4w-46vf | CVE-2026-119350 | >=16.4.0 <=16.4.4 |

Full authoritative URLs, titles, ranges and patch versions are in `upstream-advisories.json`. This is package applicability, not a claim that every issue is reachable in this application. npm confirmed 16.4.6 as stable latest and the matching eslint package before installation; no version was guessed.

## Audit limits

Before: 14 vulnerable dependency nodes (13 moderate, 1 high). After: 13 development-tool dependency nodes (12 moderate, 1 high). **Production-only audit: zero vulnerabilities**, including Next.js. Remaining findings concern Capacitor/xcode/uuid, TypeScript ESLint/minimatch, glob/rimraf and zod; exact evidence is preserved in the audit JSON files. This scoped patch does not claim a completely clean development dependency audit or undertake unrelated native tooling upgrades.

## Verification and additional release defects

`checks.json` preserves the initial run, including two genuine failures reproduced unchanged in the original lesson worktree:

- Prayer guard still required the removed compact feature and old latest lesson ordering. Updated only its expectations to the already-approved full feature and six-item ordering.
- The new route was missing from the explicit SEO sitemap inventory. Added `/lessons/open-heart` without changing configuration or weakening the coverage checker.

After those fixes: final build, lint (existing image warnings only), prayer guard and independent SEO check pass (156 public URLs). All other workflow checks passed in the initial run, including bilingual, Scripture, assets, games, WHY, lesson checks and offline integrity. `python scripts/check-open-heart.py` passes.

Final browser suites run against rebuilt production server at `http://127.0.0.1:3218`: Open Heart EN/RU phone/iPad/desktop interactions, persistence, private-text non-storage, bad/blocked storage and eight PDF downloads; accessibility and full rendered Scripture equality; 36 catalog/layout regression cases. Logs end in `-final.log`. Browser evidence remains under `../qa/` and `catalog/` (screenshots are local, ignored). Device emulation is not physical iPad/printer testing.

## Publication handoff — NOT deployed

Remote read-only `git ls-remote` confirmed main at `3da9be5b32249136d1563b52330bbfd9f016a8ad`; lesson base is exactly one commit ahead, with no remote lesson branch returned. Recheck remote immediately before any push. No push, merge, production mutation or deployment occurred.

`.github/workflows/quality.yml` runs on PRs and main pushes: Node 20, npm ci, lint, content guards, production build, SEO check. No deployment workflow is tracked; README only describes Vercel conventionally. Provider auto-deployment configuration has not been independently verified. Parent must approve lesson/art and these commits, obtain publication authorization, and verify CI plus actual hosted deployment and QR URL after publication. Local green results do not establish live readiness or visibility.
