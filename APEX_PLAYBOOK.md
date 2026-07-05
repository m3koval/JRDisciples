# APEX Playbook — How to Build JRDisciples Content at the Highest Bar

> This is the standing quality system for ALL content built for JRDisciples:
> lessons, games, puzzles, images. Read this document fully before building
> anything. When your build is done, run the Definition of Done checklist at
> the bottom. "It works" is not the bar. "A 7-year-old loves it, learns from
> it, and asks to play it again" is the bar.

---

## 1. Mission & Audience

- **Audience:** kids ages 6–12 learning the Bible. The younger end (6–8) needs
  bigger targets, simpler words, more forgiveness. The older end (9–12) needs
  real substance, not baby content.
- **Goal:** kids ENJOY learning the Bible. Fun first, but the fun must carry
  the truth — never fun bolted onto a quiz.
- **Bilingual is mandatory:** every user-facing string exists in EN and RU via
  `useLanguage()` from `@/context/LanguageContext`. Russian is Synodal
  translation for scripture. Never machine-translate carelessly — read the RU
  aloud; it must sound natural to a Russian-speaking kid.
- **Theology:** faithful to the text. Kid-level does NOT mean watered down —
  it means one clear idea per activity, concrete images ("charging a prince
  rent in his father's palace"), zero jargon. Evil can exist in games (giants,
  storms, fiery darts) but is never glorified, demonic-styled, or scary for a
  6-year-old. Even lions look powerful, not terrifying.

---

## 2. The Golden Rule: Gameplay IS the Lesson

The single most important design principle. The mechanic must embody the
truth being taught, not decorate it:

- Shield of Faith: Ephesians 6:16 is literally about intercepting flaming
  darts → the game is intercepting flaming darts.
- Coin in the Fish: Peter went fishing for God's provision → the activity is
  catching fish that carry the verse about provision.
- Manna Trail: gathering daily bread from heaven → snake collects manna and
  builds "Give us this day our daily bread."

**Test:** if you could swap the Bible skin for a pirate skin and nothing about
the design would break, the design is wrong. Start over.

---

## 3. Lesson Architecture (the proven pattern)

Read the NEWEST existing lesson page first (currently
`app/lessons/coin-in-the-fish/page.tsx`) and match its structure exactly.

**Structure:**
- `'use client'`, `useState`/`useEffect`, `Link`, `useLanguage`
- Theme constants at top: `ACCENT`, `ACCENT_DARK`, `ACCENT_GLOW` — pick a
  color that MEANS something (ocean teal for a fishing story, deep purple for
  prayer, green for growth/seeds). Never reuse the previous lesson's color.
- 4 gated sections. `SECTION_REQS` record + localStorage keys
  `'<lesson-id>_unlocked'` / `'<lesson-id>_done'`.
- Progress bar (🔒 locked / 📖 active / ⭐ done) + reset button.
- Hero section: emoji, title, scripture reference, hook paragraph that
  connects to the previous lesson if it's part of a series.
- Every section: teaching text (2 short paragraphs max), a 💡 callout with the
  section's ONE big idea, a verse box with exact scripture, then the activity.
- Win screen: fixed fullscreen overlay, one-sentence takeaway a kid can
  repeat, the key verse, back-to-lesson + all-lessons buttons.
- All inline styles. No Tailwind. Fonts: `var(--font-nunito)` (headings/UI),
  `var(--font-lora)` (body/verse, italic for scripture).

**Activity variety — the anti-template rule:**
The proven activity types are: story sequencing, flip cards, true/false quiz,
word scramble, sorting into columns, tap-to-give (worry jar), multi-step
builder (prayer builder), verse fishing. Rules:
1. Never use the same activity type twice in one lesson.
2. At least ONE activity per lesson must be NEW or a fresh twist — something
   no previous lesson has (this keeps the site feeling alive). Design it from
   the story itself (Rule #2 above).
3. The final activity should produce something the kid keeps: an assembled
   verse, a built prayer, a completed picture.

**Registration:** add the lesson to BOTH `data/lessons.ts` (`lessonTopics`)
and `data/lessons-ru.ts` (`lessonTopicsRu`), at the TOP of the list, with
matching `color`, `sections` count, unique `emoji`, and an `image` path
following `public/images/jr/lessons/<lesson-id>/topic-<lesson-id>.png`.
Generate that topic image (style guide §7) in the same delivery.

**Series awareness:** check whether the passage is adjacent to an existing
lesson (e.g., the Matthew 17 series: Transfiguration → Mustard Seed Faith →
Coin in the Fish). If yes: reference the previous lesson in the hero hook and
cross-link the truths (Coin in the Fish quotes Matthew 6:8, which the prayer
lesson teaches).

---

## 4. Game Architecture (the proven engine patterns)

Read the newest canvas game first (currently
`app/games/shield-of-faith/page.tsx` and `app/games/manna-trail/page.tsx`).

**Canvas games:**
- Fixed timestep loop: `acc += dt; while (acc >= TICK_MS) tick(TICK_MS)`,
  then `draw(now, acc / TICK_MS)` with interpolation between previous and
  current positions (`prevRef` pattern) — this is what makes movement feel
  smooth at any tick rate.
- ALL game state in `useRef`, never `useState` (zero-lag). React state is for
  UI overlays only (menus, verse screens, toasts).
- HiDPI: `canvas.width = cssWidth * devicePixelRatio`, `ctx.scale(dpr, dpr)`.
- **Canvas font gotcha:** CSS variables DO NOT work in `ctx.font`. Use
  explicit families (`'bold 18px sans-serif'`). This bug shipped once —
  never again.

**Mobile input (non-negotiable):**
- Virtual joystick with dragging anchor (hold-and-steer, anchor follows the
  thumb when it overshoots `JOY_REACH`) — NOT discrete swipe detection.
- `onPointerDown/Move/Up` + `setPointerCapture`. `touch-action: none` on the
  play surface.
- Full text-selection prevention on every game container AND its children:
  `user-select: none; -webkit-user-select: none; -webkit-touch-callout: none`,
  children of buttons `pointer-events: none`, `onContextMenu` suppressed
  during play. iOS long-press selection has broken games here twice.
- Keyboard support too (WASD + arrows) — kids play on laptops.

**Game shell:**
- Menu page (title, verse hook, how-to-play card, best score) → fullscreen
  takeover during play (`position: fixed; inset: 0; z-index: 9999`).
- Overlays (level complete, death, victory) are `position: fixed`, never
  `absolute` — absolute gets clipped by the arena on mobile.
- Best score in localStorage: `'<game-id>-best'`.
- Scripture integration: verses BETWEEN waves/levels as a breath moment, not
  interrupting the action. Death screens comfort ("Do not fear, for I am with
  you"), never mock.
- Difficulty ramps gently: level 1 must be winnable by a 6-year-old; the last
  level should challenge a 12-year-old.

**Register the game** in `app/games/page.tsx` in BOTH language arrays with a
meaningful gradient `bg`, `border`, 4 detail chips, and honest description.

---

## 5. Kid UX Rules (all content)

1. **Tap targets ≥ 44px**; moving targets get an oversized invisible hit area
   (`padding` + negative `margin`).
2. **Wrong answers are gentle:** a wiggle, a soft red flash, auto-reset.
   Never punish, never lose progress in a lesson activity.
3. **Hints exist:** if an activity requires knowledge the kid doesn't have yet
   (like word order of an unfamiliar verse), provide a peek/hint toggle.
4. **Readable timing:** anything a kid must read stays on screen ≥ 1.4s;
   answer buttons lock during feedback so double-taps don't skip content.
5. **Celebration:** every completion gets a visible reward moment (animation,
   emoji burst, encouraging line). Progress is always visible.
6. **Text sizes:** minimum `0.85rem` body on mobile; headings scale with
   `clamp()`.
7. **One idea per screen.** If a section teaches three things, it's three
   sections.

---

## 6. Code Quality Bar

- TypeScript strict — `npx tsc --noEmit` returns ZERO errors.
- `npm run build` succeeds; the new route appears.
- `npm run check:bilingual` passes — no missing routes, strings, or images.
- Straight quotes in string delimiters (smart quotes have broken the build
  before). Apostrophes inside single-quoted strings → use double quotes.
- No placeholder comments, no TODO stubs, no truncated files.
- Match the codebase idiom: inline styles, section comments with `─── ───`
  rules, bilingual data arrays side by side.

---

## 7. Image Style Guide

- Children's Bible storybook illustration: warm vibrant watercolour, bold
  clean outlines, rich colours (deep blues, warm golds, earthy greens).
- No text baked into images. No violence, no scary faces.
- Consistent recurring characters where possible (Peter looks like the same
  Peter across scenes).
- Paths are code-contracts — exact and case-sensitive:
  - Lesson topic cards: `public/images/jr/lessons/<lesson-id>/topic-<lesson-id>.png`
  - Game assets: `public/images/jr/games/<game-id>/...`
  - Spot-the-difference pairs: `public/images/jr/games/spot/spot-<scene-id>-before|after.png`
- Games/lessons are built with graceful fallbacks (SVG or gradient) so images
  can land later — but a NEW lesson/game delivery should include its images.
- For spot-the-difference style content: differences must be REAL scene
  changes (not marker overlays), positioned to match the hotspot coordinates
  in the code, clear to a 7-year-old but not instant.

---

## 8. Process: How to Build

1. **Read first.** The newest sibling page (lesson or game) + this playbook.
   Never build from memory of "how these usually look."
2. **Design the mechanic from the passage** (Golden Rule §2). Write one
   sentence: "The truth is X, so the player does Y." If Y is generic, iterate.
3. **Build complete.** Full file, both languages, all sections.
4. **Taste-test pass (mandatory).** After it compiles, re-read your own build
   as a critic: Does the signature activity feel ALIVE (motion, bob, feedback)
   or merely functional? Would a 6-year-old's thumb hit that target? Does any
   moment require knowledge the kid doesn't have? Does the copy read like a
   storyteller or like an assembler? Fix what fails. This pass is the
   difference between built-to-spec and best-you-can-do.
5. **Verify:** `npx tsc --noEmit` → `npm run build` → `npm run check:bilingual`.
6. **Register + images:** data files, index pages, topic image.
7. **Commit with a descriptive message** (what + why, structured body), push.

---

## 9. Definition of Done (run this checklist every time)

- [ ] Gameplay/activity embodies the passage (not skinned onto it)
- [ ] EN + RU complete and natural-sounding; scripture is Synodal in RU
- [ ] At least one never-seen-before activity or mechanic twist
- [ ] Mobile: tap targets ≥44px, no text selection, overlays fullscreen-fixed
- [ ] Gentle failure + available hints + celebration on completion
- [ ] `tsc --noEmit` zero errors; `npm run build` passes; `check:bilingual` passes
- [ ] Registered in data files / index pages (both languages)
- [ ] Topic/hero image generated at the exact contract path (or fallback confirmed)
- [ ] Taste-test pass done and fixes applied
- [ ] Committed and pushed with a clear message
