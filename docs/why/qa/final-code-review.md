# WHY final prepublication code review

## Verdict

**Content/logic checks pass; publication still needs fresh final-build browser evidence.** No security-critical defect or inherently mouse-only required interaction found in the reviewed WHY surface. Two persistence-honesty defects should be corrected before sign-off below. This is a read-only code/evidence audit, not a deployment or a new visual approval.

## Scope and verification

- Read `app/why`, `components/why`, `data/why/index.ts`, all three WHY browser scripts, `scripts/check-why.mjs`, package scripts, and the shared language provider used by WHY.
- Ran `git diff --check`: exit 0.
- Executed the real checker in memory with only its report-directory/report-file writes removed (and TypeScript import resolved absolutely). No application/checker source was modified. Result: **52 lessons, 22 choose / 14 sequence / 16 sort, zero errors, zero missing images, contentAndLogicPass=true, releasePass=true**, exit 0. Checker verifies quote equality against local Scripture evidence, not independent live source truth.
- Programmatically verified source `/home/helper/work/JRDisciples/data/why/lesson-*.json` and release lesson bytes: **no differences** at review time.
- Parsed all three source flow reports: 01–18, 19–34, 35–52 cover **52 unique IDs, no gaps or duplicates**. Each report declares complete English/Russian story review. All 18 supplied SHA-256 hashes for 01–18 match source bytes. All 103 edit records carrying scene/paragraph/language/after coordinates match current source paragraphs. Other report formats are not represented in that 103 count; 19–52 do not supply per-file hashes. Reports explicitly do not constitute artwork/browser/source re-verification.
- Ran Node probes against transpiled `progress.ts` and the exact hub predicate: a version-1 save with true completion/pass/reflection flags but absent answers counts completed on the hub and incomplete in the player. Also reproduced the shared language-provider read/write fallback contradiction under readable-but-unwritable storage.
- Did not execute browser scripts because they write multiple files outside the sole permitted report path. Existing reports were inspected, not represented as newly passing tests. No build, deploy, or screenshot-based visual review performed here. Parent must bind its fresh browser/build results to the final synced bytes.

## Push / publication blockers

### B1 — Existing broad browser evidence is red and predates the final prose

`docs/why/qa/all-browser-check.json`; `scripts/test-why-all-browser.mjs:137–141`.

The checked-in/copy-present report finished `2026-10-20T16:59:45.387Z`: **95/104 passed; 9 failed; contentGate=FAIL; visualGate=FAIL**, with 191 missing-art paths at that historical run. Failures include EN 5 and 26; RU 22, 23, 24, 25, 26, 51, 52, with rendered copy/source-support mismatches. This does **not** establish those failures still exist: the fresh filesystem checker now finds no missing images and prose has changed. It does mean the old evidence cannot authorize publication. Run the final frozen release's canonical `test:why`, supplemental lab/detail tests, and build; require green fresh reports. Parent's concurrent fresh QA can resolve this gate without code changes.

### B2 — Hub promises persistent progress even after storage fails

`components/why/WhyHub.tsx:24`, `components/why/store.ts:26–39`, `components/why/copy.ts` saved/temporary copy.

Player correctly displays `temporary` after a failed save, but `useNotebook()` exposes no storage availability and the hub unconditionally renders `t.saved` ("Progress stays on this device" / "Прогресс хранится на этом устройстве"). With quota/storage failure, `save()` retains completion only in the module's memory; returning to the map via client navigation shows the count alongside a durability claim that is false on reload. This is the exact misleading-persistence case requested for audit. Expose the availability signal to the hub and use the temporary notice there too. Verify a complete lesson with `setItem` throwing, navigate to map, then reload: copy must explain temporary progress before it disappears. The note is hidden below 1000px, so ensure failure feedback is visible on mobile as well.

## Follow-ups / nits

### F1 — Hub and player disagree on invalid/stale completion

`components/why/WhyHub.tsx:12` versus `components/why/progress.ts:19–27`.

Hub trusts three flags; player revalidates saved answers against current activity. Node probe: `{version:1,step:7,passed:true,reflected:true,completed:true}` gives hub=true/player=false. Can arise with corruption or future changed activity solutions, not through an ordinary fresh happy path. Not an authorization/security issue: this is a local personal notebook. Prefer one validation contract (possibly minimal answer-validation metadata on hub) and a regression test. Ordinary edits limited to story paragraphs do not invalidate answers.

### F2 — Existing shared language fallback fails when reads work but writes fail

`context/LanguageContext.tsx:getLanguageSnapshot/writeLanguage`.

On RU selection, volatile language becomes RU, then failed `setItem` leaves an older EN value in storage; the subsequent snapshot reads EN and overwrites volatile state. Reproduced with readable storage containing EN and throwing writes: resulting language EN. This is outside newly added WHY code but affects its bilingual support in quota/privacy states. Preserve in-memory preference after write failure; test both getItem failure and setItem-only failure. Existing blocked-storage test only advances an English scene and does not verify switching language.

### F3 — Supplementary telescope result remains in the previous language

`components/why/Observatory.tsx:6–10` stores localized message text rather than a target/message identifier. After inspecting a target and switching language without leaving the activity, controls change but the existing feedback remains in the former language until another inspect. Use a message key and derive translated copy on render. Supplementary activity only; main assessment feedback uses current language correctly.

### F4 — Optional exploration and checking scope should remain explicit

`components/why/LessonPlayer.tsx:33–34,56–59` permits “Record your findings” before any telescope/copy work and keeps `explored` only in component memory. Reloading the assessment for lessons 1/6 presents the optional lab again. Main assessment correctness is still required to unlock mission/completion. Prefer a clear “Continue to the activity” label if these labs are intentionally optional; do not describe the button as durable recording of observations.

### F5 — Strengthen checker and accessibility evidence

`check-why.mjs:11–15,34`; browser scripts.

Checker asserts count but not exact unique IDs 1–52; its bilingual walk checks bilingual array lengths but not every paragraph's language/nonempty content; art inventory does not include notebook artifact images. Current dataset independently has exact IDs and the current tests decode notebook images, so these are future-regression gaps rather than demonstrated missing content. Browser tests exercise buttons but not a complete keyboard-only assessment flow, focus return from dialog, reduced motion, or child-element clipping. Global overflow checks alone miss clipped descendants. The full browser script's scene `art` observations are recorded but not directly part of visualGate; image readiness is not art-direction acceptance.

## Positive findings and bounded claims

- Player validates parsed progress, bounds steps, requires correct answers plus explicit check and reflection before completion, and clears completion when assessment answers reset. Corrupt JSON safely resets.
- Reflection is accurately described as thinking about a future step, not claiming real-world mission execution or spiritual mastery. No account/cloud synchronization is claimed.
- Activities use native buttons, meaningful sequence movement labels, fieldset/legend sort groups, live feedback, and a labeled checkbox. Telescope has keyboard controls plus an accessible non-aiming alternative. Sources use a native modal dialog with close button and Escape behavior; new-tab links use `noopener noreferrer`.
- WHY data renders through React text (not HTML injection); source URL protocols are checked; lesson route lookup uses exact known slug values rather than path concatenation. No WHY network mutation, credential collection, or new authorization surface was found.
- Source notebook explicitly separates fictional illustrations, real artifacts, source support, and evidentiary limits. UI copy is paired EN/RU; English legal copyright text on RU screens is explicitly introduced as the English notice.

## Writes

Only this file, `docs/why/qa/final-code-review.md`, was created by this review. All pre-existing application/data/asset changes belong to the parent or other agents. No publication was performed.
