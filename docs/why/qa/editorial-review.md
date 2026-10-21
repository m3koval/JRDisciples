# WHY — bounded editorial review

## Verdict and scope
Content/logic check **PASS**, with one minor Russian copy fix and two pedagogical follow-ups below. **Not release approval**: the checker reports 135 missing images and `releasePass: false`. No lesson data or components were edited, no images generated, and nothing published.

The prior reviewer's full EN/RU read of all 52 lessons is **handoff context**, not a fresh full reread certified here. This pass compares every actual lesson against `baseline.json` and `proposed.json`, reviews all changed narrative/activity/mission wording, and manually inspects the theological teaching scenes, activities and adult notes in lessons **1, 10, 22, 25, 26, 27, 29, 30, 32, 33, 42, 45, 49, 50, 51, 52**. `editorial-review.json` contains exactly 52 individually scoped records; `reviewed: true` means the stated bounded scope, not a complete source audit.

## Verified changes and checks
- 52/52 lesson objects differ from baseline; **19** have changes beyond source cards: 1, 2, 5, 6, 9, 17, 22, 25, 26, 29, 30, 32, 33, 37, 42, 47, 48, 50, 52.
- **50 primary source cards** were rewritten; 51 lesson source arrays changed (including the added Galatians card in lesson 25).
- Actual data differs from `proposed.json` only in **33** (clearer Russian Holy Spirit answer) and **50** (Russian source title now specifies Revelation 21:4). Both inspected; neither changes primary Scripture.
- Every entire `scripture` object is unchanged from baseline. All **52 EN + 52 RU primary texts and URLs match saved evidence fixtures exactly**.
- Ran `node scripts/check-why.mjs --content-only`: **exit 0**, `errors: []`, `contentAndLogicPass: true`. This checks bilingual fields/array lengths, minimum English story length, activities/progress logic, and exact primary verse text/URL equality. It does not measure reading level or validate every reference label.
- Freshly extracted and read relevant ESV text for added supporting passages: [Acts 17:24–25](https://www.bible.com/bible/59/ACT.17.ESV), [Romans 8:18–25,38–39](https://www.bible.com/bible/59/ROM.8.ESV), [Galatians 1:18–19](https://www.bible.com/bible/59/GAL.1.ESV), and [Luke 24:1–12](https://www.bible.com/bible/59/LUK.24.ESV). Added prose corresponds to these passages; no wrong new Scripture attribution identified. This is semantic review, not exact quotation certification of the paraphrases; fresh RST supporting-passages retrieval was not performed.
- Lesson-file SHA-256 values remained unchanged throughout this audit.

## Editorial findings
The revised material strengthens positive reasons for belief without turning illustrations into proof. Lesson 1 distinguishes dependence reasoning from observation and revelation; 22 keeps suffering/hope separate from guesses about an individual's illness; 25 uses Paul's reported contacts rather than pretending the Pilate stone names Jesus; 29 separates Paul, Luke, and a later P46 leaf. Trinity (10), incarnation (26), voluntary atonement (27), grace and works (30/32), and the Spirit's personal deity (33) retain careful boundaries. Baptism/communion (42) centers Christ without buying salvation or caricaturing church differences. Lessons 45 and 49–52 preserve conviction, consent, grief, judgment/renewal and grace-based growth. Several focus lessons changed only source cards, not their underlying theology.

Changed EN/RU wording is meaningfully parallel and generally clearer. This is textual readability review, not rendered Cyrillic/mobile QA or certification of independent reading by young children.

### Needed fixes / follow-up (not applied)
1. **Minor copy fix — 52, `fieldMission.ru`:** add a comma after «поговорить»: «С надёжным человеком, который согласен поговорить, обсуди…». The replacement closed neither the Russian relative clause nor its punctuation correctly.
2. **Pedagogical improvement — 1:** «несотворённый источник бытия» / «основание существования» remain abstract for younger readers. Use adult scaffolding or a short concrete gloss in a later approved pass; do not weaken the argument's stated limits.
3. **Pedagogical improvement — 29:** the question asks why “only warm memories” is inadequate, but the distractors are exaggerated evidence claims, not alternative explanations. Align the choices or question in a later pass. This is not a false-Scripture finding.

## Evidence limits and remaining gates
Exact primary Scripture checking is **deterministic comparison against existing retrieval fixtures**, not a new online audit of every verse or every narrative claim. Claim-specific source cards now explain support/limits rather than generic archaeological boilerplate, but this pass did **not** independently reopen museum/library records, validate all historical dates, evaluate manuscript scholarship/canon history, or audit image rights. The recorded Pilate office distinction and P46 dating/contents caveats are retained, not independently reconfirmed here. Lessons 6, 25 and 29 still need that independent source work if a comprehensive historical-source audit is required.

No theology blocker was found in the inspected passages; that is a bounded editorial conclusion, not blanket doctrinal or historical certification. Browser/read-aloud review, broader source verification and the missing-media release gate remain outside this no-edit pass. The existing checker regenerated `content-check.json`; the audit adds only this report and its per-lesson JSON within the repository.
