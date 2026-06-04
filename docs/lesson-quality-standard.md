# Junior Disciples Lesson Quality Standard

This standard defines what “better than what we have” means for Junior Disciples lessons. Scheduled agents should use it as the shared rubric for draft creation, QA, fixes, promotion, app QA, and retrospectives.

## Core Goal

Every lesson should help a child understand biblical truth clearly, trust God more deeply, and take one faithful next step. A scheduled workflow does not need to make each lesson perfect in one pass, but each pass should preserve at least a small measurable improvement.

## Non-Negotiables

1. Bible truth first.
2. Quote real Scripture when using Scripture.
3. For English Junior Disciples lessons, quote/cite ESV as the normal Bible text. Do not swap to WEB/public-domain wording just to avoid verification work.
4. Do not invent simplified “kid translation” Bible text; quote Scripture, then explain it in child-clear language.
5. Russian-capable lesson features need Russian user-facing cards/content parity before publish, or an explicit human-approved exception.
6. Explain hard words immediately in child-clear language.
7. Do not overstate evidence, mock doubters, or use fear pressure.
8. Keep the tone warm, truthful, parent-safe, and age-appropriate.
9. Do not publish a lesson while Scripture verification markers such as `[VERIFY ESV QUOTE BEFORE PUBLISHING]` remain.
10. Do not publish if content QA, visual QA, app QA, Scripture/version QA, or localization parity has blocker findings.
11. Preserve repeated QA findings into templates/checklists so the next lesson gets better.

## Content Quality Rubric

Score each category from 1 to 5.

### 1. Biblical Faithfulness

5: Scripture is accurately quoted/cited; doctrine is sound; explanations are clear and faithful.
4: Mostly strong with minor wording improvements needed.
3: Acceptable but thin, vague, or missing needed nuance.
2: Risk of confusion, overstatement, or unsupported claims.
1: Biblically inaccurate, invented Scripture wording, or unsafe theology.

### 2. Child Clarity

5: Hard ideas are explained with simple definitions, concrete examples, and short reasoning steps.
4: Mostly clear; a few hard words or long sections need simplification.
3: Understandable for older kids but may lose younger readers.
2: Too abstract, adult-coded, or jargon-heavy.
1: Confusing or misleading for children.

### 3. Apologetics Strength

5: Gives honest, age-appropriate reasons for confidence without pretending evidence replaces faith.
4: Strong but could define evidence or limits more clearly.
3: Helpful but basic; needs stronger examples or clearer reasoning.
2: Weak, vague, or overconfident.
1: Misleading, combative, or unsupported.

### 4. Engagement and Interaction

5: Activity reinforces the lesson and invites real participation.
4: Good activity with minor improvement needed.
3: Activity exists but feels generic.
2: Activity is disconnected from the lesson.
1: No meaningful interaction.

### 5. Parent / Teacher Usefulness

5: Helps adults guide conversation, answer honest questions, and avoid common misunderstandings.
4: Useful but could be more specific.
3: Basic discussion questions only.
2: Thin or unclear.
1: Missing or unhelpful.

### 6. Site Readiness

5: Lesson structure is easy to promote into a route; title, slug, anchors, sections, and publishing notes are clear.
4: Nearly ready with minor cleanup.
3: Needs organization work before route promotion.
2: Missing important route/publishing data.
1: Not ready for promotion.

## Gate Rules

A draft passes content QA only when:

- average score is 4.0 or higher
- no category is below 3
- no blocker findings remain
- Scripture handling is safe
- all hard words used in the main lesson are defined or explained
- the QA report explicitly says `Gate: PASS`

A draft fails content QA when:

- any blocker exists
- average score is below 4.0
- any category is below 3
- Scripture wording is invented, mislabeled, WEB-swapped, or presented as a quote without verification
- Russian parity is missing for a lesson feature that supports Russian
- tone becomes combative, fear-based, or shallow

A draft is blocked from promotion when:

- Scripture verification markers such as `[VERIFY ESV QUOTE BEFORE PUBLISHING]` appear anywhere
- WEB/public-domain substitution appears in published English lesson text unless Mike explicitly approves that exception
- Russian card/content parity is missing for bilingual lesson surfaces
- content QA has not passed
- required sections are missing
- the latest QA report says `Gate: FAIL` or `Gate: HUMAN REVIEW`

## App / Route Quality Standard

A promoted lesson route must:

- load at `/lessons/<slug>`
- appear in the lessons index when intended
- preserve lesson title, big question, big truth, anchors, sections, activity, discussion, and prayer
- render Scripture quotes as site text, not inside generated images
- avoid broken links and missing image references
- work on mobile-ish and desktop widths
- avoid decorative overlays blocking clicks
- pass `npm run lint`
- pass `npm run build`

## App QA Gate

A promoted lesson passes app QA only when:

- lint passes
- build passes
- route file exists
- lesson index entry exists
- basic route smoke test passes or a browser/manual limitation is clearly documented
- report explicitly says `Gate: PASS`

## Repeatable QA Checklist for New Lessons, Quizzes, and Tracks

Use this checklist before promoting any new lesson, quiz, or learning track into the app.

### Scripture and Doctrine

- Scripture references are real, correctly cited, and fit the teaching point.
- Direct Scripture quotes are exact ESV in English lessons unless Mike explicitly approves another translation.
- No invented Bible wording is presented as a quotation.
- Do not use WEB/public-domain wording as a workaround for ESV verification.
- Doctrinal claims are clear, orthodox, and not overstated beyond the passage.
- Salvation, Trinity, Holy Spirit, resurrection, prophecy, and spiritual-gifts wording receives human review when needed.

### Child Fit and Family Use

- The big truth can be understood by a child without flattening the biblical meaning.
- Hard words are defined near where they appear.
- Activities reinforce the lesson instead of becoming disconnected entertainment.
- Parent / teacher prompts help adults ask one concrete follow-up question.
- The tone is warm, truthful, and free from mockery, fear pressure, or manipulation.

### Translation and Route Readiness

- English and Russian user-facing labels are both present when the feature supports both languages.
- Any missing translation parity is clearly noted before release.
- Links point to existing routes and do not create dead ends.
- The lesson, quiz, or track is discoverable from an appropriate index or next-step link.
- Page structure uses accessible headings, readable button/link text, and mobile-safe layout.

### Technical Gate

- Content QA report exists and has no blocker findings.
- App QA or route smoke check is documented.
- `npm run lint` passes.
- `npm run build` passes.
- The final diff is limited to the intended content, route, data, or documentation files.

## Improvement Loop

Every QA or retrospective should include:

- one thing this lesson did well
- one thing to improve in this lesson
- one lesson learned for the next run
- one checklist/template/prompt improvement if a repeated weakness appears

The goal is compounding faithfulness and quality: even 1% better per run matters if the gain is preserved.
