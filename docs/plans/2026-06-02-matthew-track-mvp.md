# Matthew Track MVP Plan

Gate: PLAN

## Purpose

Create a small, reviewable Matthew learning track before adding a public route. This plan organizes existing Junior Disciples activities around Matthew while keeping the first coded version narrow, child-sized, and easy for a parent or teacher to review.

## Guardrails

- Draft and review content before building a new `/tracks` or `/paths` route.
- Use real Scripture references and verify any direct quotations before publication.
- Keep doctrine wording simple, orthodox, and tied to the selected passage.
- Do not add ranking, streak pressure, accounts, child profiles, or saved child data.
- Reuse existing activities where possible before creating new mechanics.
- Keep English/Russian parity notes visible if a public track is later added.
- Require human review before publishing new teaching on salvation, Trinity, prophecy, resurrection, or spiritual gifts.

## MVP Shape

- Audience: children with parent/teacher support.
- Length: 4 short sessions.
- Public implementation target, after review: one lightweight track card or path section linking to existing routes plus any approved future lessons.
- Success measure: a child can follow a clear path through Matthew from Jesus the King to hearing and obeying Him.

## Session Outlines

### 1. Jesus the Promised King

- Passage: Matthew 1:1, 1:22-23; Matthew 2:1-11.
- Big truth: Jesus is the promised King God sent.
- Activity tie-in: connect to an existing `Who Is Jesus?` lesson if used in the final track.
- Memory/action step: thank Jesus for coming as the King God promised; ask one family member what promise of God helps them trust Him.
- Parent prompt: “What does it mean that God keeps His promises?”
- Review needed: verify quote handling and keep prophecy wording child-clear.

### 2. Jesus Teaches Us to Pray

- Passage: Matthew 6:9-13.
- Big truth: Jesus teaches His disciples to talk to the Father with trust and worship.
- Activity tie-in: existing Lord's Prayer word puzzle from `data/word-puzzles.ts`.
- Memory/action step: pray one line of the Lord's Prayer slowly and name one way to honor God today.
- Parent prompt: “Which line of the Lord's Prayer helps you most today, and why?”
- Review needed: ensure prayer language invites trust, not performance pressure.

### 3. Listen to Jesus

- Passage: Matthew 17:1-8.
- Big truth: Jesus is God's beloved Son, and we should listen to Him.
- Activity tie-in: existing `Transfiguration` lesson.
- Memory/action step: choose one command of Jesus to obey this week with help from a parent or teacher.
- Parent prompt: “What is one thing Jesus says that our family can practice today?”
- Review needed: preserve clear Trinity wording and avoid adding unreviewed doctrinal explanation.

### 4. Build on the Rock

- Passage: Matthew 7:24-27.
- Big truth: Wise disciples hear Jesus' words and do them.
- Activity tie-in: existing `/quests/wise-builder` quest.
- Memory/action step: name one wise choice that obeys Jesus before starting the quest.
- Parent prompt: “Where do we need to obey Jesus instead of only hearing His words?”
- Review needed: keep application concrete and grace-shaped, not moralistic.

## Future Implementation Checklist

- Link only to routes that already exist or have passed content/app QA.
- Label the track as a guided path, not a new curriculum until reviewed.
- Include both EN/RU user-facing labels if the page supports language switching.
- Add a short parent note explaining that the path uses selected Matthew passages, not the whole Gospel.
- Run `npm run lint` and `npm run build` after any route or data change.
