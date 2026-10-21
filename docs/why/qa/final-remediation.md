# WHY final code remediation — verified

## Final gate

Fresh production-build browser run completed **2026-10-21T11:09:15.549Z** (started 11:06:22.387Z): **104/104 unique bilingual cases passed, zero failed or pending, zero page errors, zero missing art**. All four EN/RU phone/tablet layouts passed. Content gate PASS; visual **readiness** PASS, not art-direction approval. `npm run test:why` exited 0. Supplemental chain exited 0 with `labs=0 details=0 storage=0`. Lint finished with **0 errors, 31 warnings**, below the 32-warning ceiling. `check:why` verifies 52 lessons (22 choose, 14 sequence, 16 sort), zero errors, releasePass=true.

B1 fresh-code evidence gate and B2/F2/F3/F4 remediation are verified; **F1 is explicitly deferred/nonblocking below**. No blocker remains in this scoped code gate. Server remains available at **http://127.0.0.1:41927** for parent inspection.

Evidence: `all-browser-check.json`, `all-browser-report.md`, `browser-check.json`, `detail-check.json`, `storage-check.json`, `final-*.log`, and mobile storage screenshots in this directory. Earlier launch failures remain retained separately; no product/test failures were hidden or retries merged into green.

Final tested source SHA-256:
```
bc9dc480d8f29ada205e84c3ffc67a66ca1536d4ebc4e93da00a5523e225ff87  components/why/store.ts
24a157ef38bae3550bd16def1767922306169c96bae23820bc80eb947f512bdd  components/why/WhyHub.tsx
a617f17b083b8dd8715cfba5790ae8f90fa127928fb84c5b22c69a98001ce067  context/LanguageContext.tsx
aedc8ac6cf5474d351e0fc2032a521488b7f58176aac67aefb491907573f830c  components/why/Observatory.tsx
4ff8028cd2726759c579757d270c351a9e9706f6b2d0c8f9a23e10c0cab82058  components/why/LessonPlayer.tsx
4af674a80a5a7390867031d011cecf9a50b0683d4661eddc252f3b4336b9e794  scripts/check-why.mjs
1ab6925b741d5acd54dc2249b7f54fb9025e2a625775cc2223c1d4ce2cb3df21  scripts/test-why-storage.mjs
```

The checkpoint below records the work as it happened; its last in-progress line is superseded by the verified final gate above.

Scope: `/home/helper/work/JRDisciples-why-release` only. No data/art edits, commit, push, deploy, or workflow edit by this agent. Publication and art approval remain parent-owned.

## Changes
- Reviewed existing B2 store/hub fix: storage failure remains sticky for this visit; notebook exposes it and map overrides mobile hiding only for temporary notice.
- Reviewed existing F2 LanguageContext fix: failed writes select the in-memory preference instead of rereading stale EN. Successful writes can resume persistent snapshots.
- F3 fixed `components/why/Observatory.tsx`: store target index, `-1` for background, or null; derive all feedback in current language on render (including accessible no-aim buttons).
- F4 fixed `components/why/LessonPlayer.tsx`: optional lab CTA now “Continue to the activity →” / “Перейти к заданию →”, not a false recording promise. Assessment remains required; exploration intentionally optional and ephemeral.
- Added `scripts/test-why-storage.mjs`: two isolated phone contexts, stale readable EN with writes blocked and reads+writes blocked; actual UI language switches, background/target feedback localization, assessment completion, client navigation identity, visible temporary map notice, count 1, reload count 0. Errors/results checkpoint to storage-check.json.
- Removed unused `root` in `scripts/check-why.mjs`, preserving workflow warning ceiling.

## Explicit nonblocking residuals
- F1 remains: map trusts stored completion/pass/reflection flags whereas player validates answers against current activity. A corrupt/stale version-1 flag-only save can show map completion but is rejected in player. Normal UI completions are validated. Not an authorization gate, cloud record, or security issue. Proper fix needs shared answer-validation metadata passed into hub (currently summary-only), not a superficial shape check that still permits stale solutions. Deferred rather than broaden this final release patch or import every lesson into the client. Existing review documents reproduction.
- F5 future checker/keyboard/reduced-motion coverage suggestions remain outside this focused remediation. Browser image readiness is not art-direction approval.

## Commands and results so far
All commands from the scoped repository.
- `npm run build > docs/why/qa/final-build.log 2>&1` — exit 0, production compilation and TypeScript passed, 170 static pages generated.
- `npm run start -- --hostname 127.0.0.1 --port 41927 > docs/why/qa/final-server.log 2>&1` — fresh production server; process session `proc_6173418a36b3`; `curl --fail --silent --output /dev/null --write-out 'HTTP %{http_code}\n' http://127.0.0.1:41927/why/01` returned HTTP 200.
- Initial browser attempts without CHROME_PATH failed before test actions because Playwright expected missing headless-shell revision 1248. Retained exact errors in `final-{all-browser,labs,details,storage}-launch-failure.log`. Used installed `/usr/bin/google-chrome`, not fabricated output or altered assertions.
- For browser reruns: `export CHROME_PATH=/usr/bin/google-chrome WHY_BASE_URL=http://127.0.0.1:41927`.
- `npm run test:why-labs > docs/why/qa/final-labs.log 2>&1` — PASS four real-UI lesson completion/reload flows covering all activity mechanisms plus telescope/layout/corruption checks.
- `node scripts/test-why-details.mjs > docs/why/qa/final-details.log 2>&1` — PASS single main, scene scroll, Escape dialog, EN/RU copy lab wrong retry and layouts.
- `node scripts/test-why-storage.mjs > docs/why/qa/final-storage.log 2>&1` — PASS both isolated cases; zero runtime errors. Screenshots `storage-writes-blocked-stale-en-mobile.png` and `storage-reads-and-writes-blocked-mobile.png`; first screenshot visually inspected: full temporary notice readable, not clipped, under 1/52 progress.
- `npm run check:why > docs/why/qa/final-content.log 2>&1` — exit 0.
- `npm run lint -- --max-warnings 32 > docs/why/qa/final-lint.log 2>&1` — exit 0.
- `git diff --check` — exit 0.
- `npm run test:why > docs/why/qa/final-all-browser.log 2>&1` — fresh full 104-case run in progress at checkpoint; do not infer final green from partial results. Final result appended below after completion.
