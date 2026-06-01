# Case for Christ Kids — Lesson Queue

Purpose: build a kid-language apologetics track that teaches children not only what Christians believe, but why belief in Jesus is historically, logically, biblically, and theologically grounded.

Tone: child-safe and child-clear. Do not merely make the wording cute or soft. Explain difficult theological, historical, and logical ideas in simple concrete language a child can actually understand. Keep the depth, but translate it into examples, pictures, comparisons, and short reasoning steps. Be warm, truthful, non-combative, and never fear-based. Show evidence as reasons to trust Jesus, not as a replacement for faith.

Clarity standard: after each major point, a child should be able to say, “Oh, that means...” in one simple sentence. If the lesson uses a hard word such as manuscript, eyewitness, resurrection, prophecy, sin, justice, evidence, faith, or miracle, define it immediately in kid language.

Recurring lesson structure:
1. Big Question
2. Big Truth
3. Evidence Trail
4. Bible Anchor
5. Think It Through
6. Objection / honest question
7. Kid-friendly answer
8. Interactive activity
9. Parent / teacher discussion
10. Short prayer

Initial lesson queue:
1. Can We Trust the Bible?
   - Focus: manuscripts, eyewitness testimony, careful copying, why the Bible is not just a made-up story.
   - Anchor: Luke 1:1–4; 2 Timothy 3:16.
2. Did Jesus Really Live?
   - Focus: historical Jesus, early sources, friends and enemies knew He existed.
   - Anchor: Luke 2:1–7; John 1:14.
3. Did Jesus Really Rise from the Dead?
   - Focus: empty tomb, eyewitnesses, changed disciples, best explanation.
   - Anchor: 1 Corinthians 15:3–8; Luke 24.
4. Is Jesus Really God’s Son?
   - Focus: Jesus’ claims, miracles, authority, worship, resurrection confirmation.
   - Anchor: Matthew 16:15–16; John 20:28–31.
5. Why Did Jesus Have to Die?
   - Focus: sin, justice, love, substitution, forgiveness.
   - Anchor: Isaiah 53:5–6; Romans 5:8.
6. Is Christianity Just Blind Faith?
   - Focus: faith as trust based on good reasons; evidence plus trust.
   - Anchor: Hebrews 11:1; John 20:29–31.
7. Why Are There Four Gospels?
   - Focus: four witnesses, complementary testimony, different audiences.
   - Anchor: Luke 1:1–4; John 21:24–25.
8. What About Miracles?
   - Focus: if God created the world, miracles are possible; miracles as signs.
   - Anchor: John 20:30–31.
9. Why Is There Suffering?
   - Focus: honest grief, sin-broken world, Jesus enters suffering, future restoration.
   - Anchor: John 11:35; Revelation 21:4.
10. How Do We Know God Created Everything?
   - Focus: creation, design, cause, order, worship; age debates avoided unless needed.
   - Anchor: Genesis 1:1; Psalm 19:1.
11. Can Science and Christianity Be Friends?
   - Focus: God made an orderly world we can study; science answers many how questions, Scripture reveals ultimate who/why.
   - Anchor: Psalm 111:2; Colossians 1:16–17.
12. What Makes Jesus Different?
   - Focus: grace, fulfilled prophecy, resurrection, Lord and Savior not merely teacher.
   - Anchor: John 14:6; Acts 4:12.

Cron worker notes:
- Create exactly one lesson per run.
- Pick the first queued topic that does not already have a route under `app/lessons/`.
- Use stable slugs like `case-for-christ-bible`, `case-for-christ-jesus-lived`, etc.
- Add it to English and Russian lesson topic indexes when feasible, or English first if time is tight.
- Generate/save prompts before generating images.
- If image generation is unavailable, use a temporary CSS/gradient visual and clearly note that image assets are pending.
- Run `npm run lint` and `npm run build`.
- Commit only if verification passes.
