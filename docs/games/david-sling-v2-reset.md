# David Sling Challenge v2 Reset

Status: visual/gameplay reset plan for Junior Disciples.

## Why reset

The current David Sling Challenge proves a route and basic timing idea, but it is not the quality bar. It still feels like a web prototype with CSS placeholders. The v2 must feel like a real child-facing Bible adventure game: bright, dimensional, character-driven, touch-first, and Scripture-powered inside the play loop.

## Visual target

Reference direction: polished 3D animated/block-style Bible adventure scene.

Required feel:

- Bright blue sky, puffy clouds, warm sunlight.
- Playful block/toy-like environment pieces without turning the main characters into LEGO/minifigs.
- Rounded expressive human child David / Junior Disciples-style hero.
- Goliath/giant as child-safe opponent/obstacle: imposing, armored, not horror, no gore, no graphic injury.
- Wide cinematic side-view game camera, readable on desktop and mobile.
- Strong foreground/midground/background separation: player foreground left, valley/action lane center, giant/target right, hills/crowd/background behind.
- Saturated colors, warm Scripture-light accents, soft shadows, high-detail 3D animated movie still quality.

Avoid:

- Emoji figures.
- Flat CSS blob characters as final visuals.
- Pull-back slingshot / Angry Birds visual language.
- Dark horror, monster-smashing tone, graphic violence, scary faces.
- Readable text inside generated images.
- Copying third-party game UI, characters, levels, or art.

## Gameplay target

The v2 should be a real game loop, not button-plus-side-card UI.

### Core loop

1. Player taps rhythmically to build sling rotation speed.
2. Player holds to keep the sling spinning.
3. A dotted curved trajectory rotates from the sling, showing approximate throw line.
4. Player releases at the right angle/timing.
5. Stone flies through the lane toward a target/giant shield/armor plate.
6. Hit feedback happens in the playfield: shield clang, light burst, target stagger, score pop, crowd reaction.
7. Difficulty increases through distance, wind, narrower timing windows, moving shield/target, or level hazards.
8. Short Scripture gate appears between attempts/levels or before power-ups.
9. Correct Scripture answer gives real gameplay help.
10. Wrong answer gently re-shows the verse and allows retry without shame.

### Controls

Mobile-first:

- Tap rhythm: increase sling speed.
- Hold: maintain spin.
- Release: throw.
- Large touch zones, no tiny UI.

Desktop:

- Space / pointer-down rhythm.
- Hold Space / hold pointer.
- Release Space / pointer-up to throw.

### Scripture-powered mechanics

Primary Scripture: 1 Samuel 17:47.

Gameplay power-ups earned by Scripture understanding:

- **Wisdom Focus**: slows time for one throw.
- **Steady Hand**: widens the release window.
- **Trust Shield**: gives one safe retry after a miss.
- **Courage Wind**: reduces wind drift.

Scripture prompt pattern:

- Show exact quote + reference in active game overlay.
- Ask one short question.
- Correct answer unlocks a power-up.
- Wrong answer: “Good try. Read the verse again and choose the truth.”

EN quote must use exact Bible.com ESV. RU quote must use exact Bible.com Russian Synodal/RST.

## Asset list for first real visual pass

Generate and approve still art before building the canvas scene.

1. **Source still / style target** — side-view David vs. Goliath valley game scene.
2. David idle pose.
3. David sling-spinning pose.
4. David release pose.
5. Stone projectile / trail sprite.
6. Dotted trajectory / UI overlay style.
7. Goliath idle / shield pose.
8. Goliath hit/stagger pose, child-safe.
9. Valley background layer.
10. Foreground block/grass props.
11. Shield/target hit burst.
12. Wisdom Focus power-up icon.
13. Reward badge icon.

## Technical approach

Recommended v2 lane:

- Use a canvas/game layer for the playfield.
- Keep React/Next for shell, language switcher, route, score panels, and accessibility overlays.
- Use generated PNG/WebP sprites and layered backgrounds rather than CSS-drawn people.
- Keep localStorage best score.
- Keep EN/RU parity.
- Do not add online leaderboard until the core game is fun and parent-safe.

## First milestone

Do not rebuild the whole game yet.

Milestone 1 is approval of one source still:

- If approved, use it as the art direction anchor for sprites and scene layers.
- If rejected, iterate the still prompt before coding.

## Quality bar

A child should look at the playfield and immediately think: “This is a real game I want to try.”

The Bible learning must not be outside the game. Scripture must change the outcome inside the game.
