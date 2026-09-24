# Junior Disciples — Guided Disciple Journey

## Product decision

The app is not a catalog of unrelated Bible activities. It has one guided core path, while an optional Explore library keeps every activity available without weakening the main journey.

The child-facing loop is:

**Story → Truth → Scripture → Practice → Check → Live It → Progress**

Home always presents one primary **Next Step**. Category browsing is secondary.

## Navigation

1. **Today** — one Next Step, current unit, short Scripture, visible progress.
2. **Journey** — the ordered discipleship road and unit map.
3. **Practice** — unlocked memory, puzzles, quizzes, and games matched to completed/current units.
4. **Progress** — units, badges, mastery stars, and completed steps.
5. **Explore** — the complete optional library of stories, lessons, quests, games, and activities.

Explore never becomes the default landing screen.

## Unit structure

Each unit may use fewer than seven steps when the existing content does not yet support all seven. Missing slots are explicit content gaps, not filler.

1. **Discover** — story or short Scripture-led setup.
2. **Learn** — focused truth lesson.
3. **Remember** — exact EN/RU Scripture practice.
4. **Practice** — puzzle, rebus, or guided interaction.
5. **Check** — knowledge/mastery check with hint-before-help recovery.
6. **Live It** — quest, game, or real-life choice challenge.
7. **Complete** — unit truth, badge, and next-unit preview.

## Core journey map

### Unit 1 — God Made Me and His World

**Big truth:** God made everything, and every person bears His image.

1. Story: `/stories/creation`
2. Check: `/quiz/quiz-creation`
3. Practice: `/puzzles/creation-week`
4. Truth lesson: `/lessons/whose-mark`
5. Complete: Creator / Image Bearer unit badge

Content gap: add an exact Genesis 1:27 EN/RU memory activity.

### Unit 2 — Trust God and Obey

**Big truth:** God keeps His promises, and wise disciples trust and obey Him.

1. Story: `/stories/noah`
2. Check: `/quiz/quiz-noah`
3. Practice: `/rebus/rebus-covenant`
4. Remember: `/memory/proverbs-3-5-6`
5. Live It: `/quests/wise-builder`
6. Complete: Trust and Obey badge

### Unit 3 — God Is Faithful in Hard Things

**Big truth:** God remains present and can use suffering, repentance, and forgiveness for good.

1. Story: `/stories/joseph`
2. Truth lesson: `/lessons/gods-cutting`
3. Check: `/quiz/quiz-joseph`
4. Live It: `/quests/forgiveness-bridge`
5. Complete: Faithful Through Hard Things badge

### Unit 4 — Courage Comes from God

**Big truth:** Courage trusts God rather than our own size, strength, or equipment.

1. Story: `/stories/david-goliath`
2. Check: `/quiz/quiz-david-goliath`
3. Remember: `/memory/philippians-4-13`
4. Practice: `/puzzles/bible-heroes`
5. Live It: `/games/david-sling-challenge`
6. Reinforcement: `/games/faith-over-giants`
7. Complete: Courageous Faith badge

### Unit 5 — God Seeks the Lost

**Big truth:** God shows mercy to sinners and teaches us to notice, seek, and love others.

1. Story: `/stories/jonah`
2. Truth lesson: `/lessons/jonah-big-fish`
3. Check: `/quiz/quiz-jonah`
4. Remember: `/memory/psalm-23-1`
5. Live It: `/quests/lost-sheep`
6. Mission: `/quests/good-samaritan`
7. Complete: Mercy for the One badge

### Unit 6 — Meet Jesus

**Big truth:** Jesus is the promised Son of God and Savior.

1. Story: `/stories/birth-of-jesus`
2. Check: `/quiz/quiz-birth-of-jesus`
3. Practice: `/puzzles/christmas-story`
4. Truth lesson: `/lessons/who-is-jesus`
5. Evidence lesson: `/lessons/case-for-christ-gods-son`
6. Remember: `/memory/john-3-16`
7. Practice: `/puzzles/jesus-is`
8. Complete: Meet Jesus badge

### Unit 7 — The Gospel: Cross, Resurrection, and Grace

**Big truth:** Sin is serious; Jesus willingly died and rose; salvation is God's gift received through faith.

1. Remember: `/memory/romans-3-23`
2. Remember: `/memory/romans-6-23`
3. Truth lesson: `/lessons/case-for-christ-cross`
4. Evidence lesson: `/lessons/case-for-christ-resurrection`
5. Truth lesson: `/lessons/grace-in-the-kingdom`
6. Remember: `/memory/ephesians-2-8-9`
7. Practice: `/rebus/rebus-grace`
8. Practice: `/puzzles/easter`
9. Complete: Gospel Truth badge

### Unit 8 — Follow Jesus

**Big truth:** Disciples trust Jesus, obey Him, pray, serve His people, and hold possessions with open hands.

1. Story: `/stories/jesus-baptism`
2. Truth lesson: `/lessons/baptism-prep`
3. Truth lesson: `/lessons/how-to-pray`
4. Practice: `/puzzles/lords-prayer`
5. Truth lesson: `/lessons/jesus-builds-his-church`
6. Truth lesson: `/lessons/one-thing-you-lack`
7. Truth lesson: `/lessons/every-one-matters`
8. Remember: `/memory/james-1-22`
9. Complete: Follow Jesus badge

### Unit 9 — Walk by the Holy Spirit

**Big truth:** The Holy Spirit helps believers become like Jesus and stand firm in God's strength.

1. Truth lesson: `/lessons/holy-spirit`
2. Practice: `/puzzles/fruits-of-the-spirit`
3. Live It: `/quests/fruit-of-spirit`
4. Practice: `/puzzles/gods-armor`
5. Live It: `/quests/armor-of-god`
6. Reinforcement: `/games/shield-of-faith`
7. Complete: Walk by the Spirit badge

## Progression rules

- Unit 1 is open on first launch.
- The current unit's next required step is always the primary Home action.
- Completing a required step opens the next required step.
- Previously completed steps remain replayable.
- Optional reinforcement never blocks progress.
- Explore is always available and does not silently advance the guided journey.
- A parent-gated override may open a later unit without fabricating completion.
- Storage failure keeps the current session usable in memory and explains that durable progress could not be saved.
- EN/RU share the same journey state; changing language never loses or duplicates progress.

## Completion contracts

A visit is not completion.

- Story: child reaches the end and chooses **Story Complete / Next Step**.
- Lesson: existing lesson mastery completion signal.
- Quiz: result screen reached after all questions.
- Memory: verse challenge success state.
- Puzzle/rebus: solved state.
- Quest: quest completion/badge state.
- Game: defined mission or level outcome; free-play scores do not block the journey.

Every completion writes one stable step ID and timestamp. Progress derives from completed stable IDs, never from page order or localized labels.

## Content-quality rule

Activities belong in a unit only when they reinforce that unit's truth. Do not fill an empty slot with an unrelated challenge merely to create more steps.
