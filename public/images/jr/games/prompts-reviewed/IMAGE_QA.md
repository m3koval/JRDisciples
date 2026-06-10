# Apex-reviewed image QA

Branch: `claude/mobile-hero-image-layout-MYuSB`

## Global prompt corrections applied

- Shifted from generic watercolor toward Junior Disciples game art: polished child-safe 3D animated Bible storybook, warm Pixar-like emotion, subtle Minecraft/block-world forms where fitting, original IP.
- Required no readable text/logos/watermarks in generated art.
- Added safety negatives: no demons, occult symbols, horror, gore, threatening expressions, distorted faces/hands.
- Kept Bible tension parent-safe: Daniel/lions imagery uses calm lions and rescue light, not horror.
- Spot-the-difference pairs were generated as base FAL scenes, then the `after` images were derived from the matching `before` image with five visible overlay differences near the configured game hotspots so the puzzle remains playable.

## Assets approved/wired

### Games hub cards

- `/images/jr/games/shield-of-faith-hero.png`
- `/images/jr/games/manna-trail/hero-manna-trail.png`
- `/images/jr/games/shepherd-light-adventure/hero-shepherd-light.png`
- `/images/jr/games/spot/spot-water-to-wine-after.png`
- `/images/jr/games/escape-room/escape-room-daniel-den.png`

### Spot the Difference

Saved under `/images/jr/games/spot/`:

- `spot-water-to-wine-before.png`
- `spot-water-to-wine-after.png`
- `spot-feeding-5000-before.png`
- `spot-feeding-5000-after.png`
- `spot-calm-storm-before.png`
- `spot-calm-storm-after.png`
- `spot-zacchaeus-before.png`
- `spot-zacchaeus-after.png`

QA: child-safe, no creepy imagery, no readable text/logos/watermarks. The after images use visible marked changes at the configured hotspot regions. Some derived differences are graphic overlays rather than fully regenerated character-expression edits; acceptable for playable v1.

### Daniel Escape Room

Saved under `/images/jr/games/escape-room/`:

- `escape-room-daniel-decree.png`
- `escape-room-daniel-window.png`
- `escape-room-daniel-den.png`
- `escape-room-daniel-victory.png`

QA: child-safe Daniel 6 atmosphere, lions calm/not scary, no occult/horror framing, suitable as low-opacity puzzle-panel backgrounds.

## Notes

- Shield of Faith still uses “fiery darts” because that is biblical Ephesians 6 language, but the generated art shows harmless stylized darts deflecting from a shield, with no injury or enemies.
- The distant shepherd silhouette in Shepherd Light is symbolic/reverent and not a generated close-up face of Jesus.
