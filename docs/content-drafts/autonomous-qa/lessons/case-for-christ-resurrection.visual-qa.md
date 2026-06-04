# Visual QA — Did Jesus Really Rise from the Dead?

Gate: PASS

## Assets reviewed

- Hero / The Witness Trail: `public/images/jr/lessons/case-for-christ-resurrection/hero.png`
- Bible truth visual / Died, Buried, Raised, Appeared: `public/images/jr/lessons/case-for-christ-resurrection/bible-truth.png`
- Artifact/history reconstruction: `public/images/jr/lessons/case-for-christ-resurrection/artifact-reconstruction.png`
- Activity/challenge visual / Witness Web: `public/images/jr/lessons/case-for-christ-resurrection/witness-web.png`
- Topic thumbnail: `public/images/jr/topic-case-for-christ-resurrection.png`
- Asset manifest: `public/images/jr/lessons/case-for-christ-resurrection/asset-manifest.json`
- Prompt files: `public/images/jr/lessons/case-for-christ-resurrection/prompts/`

## QA findings

- Required slots: PASS — hero, Bible truth/story truth, artifact/history, activity/challenge, and thumbnail are all produced and saved.
- Child safety: PASS — visuals are hopeful, reverent, warm, parent-safe, and not scary or violent.
- Character consistency: PASS — Michael, Rosie, Joseph, and Gracie remain polished 3D human children in the main-child visuals. Toy-brick styling is limited to environments and props.
- Text/logos/watermarks: PASS — no logos or watermarks observed. The regenerated activity and thumbnail avoid problematic generated Bible-page text; Scripture and witness labels should be rendered in UI/HTML.
- Biblical/doctrinal safety: PASS — visuals support the lesson’s line that Jesus died, was buried, was raised, and appeared to witnesses without using pressure, mockery, or sensationalism.
- Historical honesty: PASS — the tomb asset is documented as an original historically informed reconstruction, not a photograph of Jesus’ tomb and not proof of the resurrection.
- Graphic imagery: PASS — no gore, weapons, blood, wound close-ups, horror framing, or occult symbols observed.
- Jesus depiction: PASS — no direct depiction of Jesus’ face/body/wounds is used.

## Caption / UI requirements

- Artifact/history caption must say: “Original reconstruction based on first-century Jewish burial practices; not a photograph of Jesus’ tomb.”
- Witness labels such as Peter/Cephas, the Twelve, 500+, James, all apostles, Paul, and Thomas should be rendered as UI/HTML, not baked into images.
- Lesson title and thumbnail text should be overlaid by the site UI, not generated in the image.

## Non-blocking notes

- The generated files are 1024×768 PNGs, consistent with the current image backend output; crop/cover behavior should be checked during app QA if the route uses wide hero containers.
- Bible truth includes small background witness figures; they are not used as Junior Disciples main-child cast and do not carry labels or claims.
- Two assets were regenerated during QA to remove fake Bible-page text risk before passing the gate.
