# Junior Disciples — Character and Movement Acceptance Contract

This batch creates source assets. A downloaded model, skeleton, or animation does not by itself constitute finished gameplay. Existing game characters remain untouched until integration gates pass.

## Canon and presentation
- Authoritative cast: the supplied `junior-disciples-character-library.md`.
- Four human children with stable age, skin, hair and clothing identity. Three adult villagers, clearly adult in proportion and height.
- Empty-handed front A-pose references; props remain separate assets.
- No weapons, horror, minifig bodies, readable generated text, modern adult clothing, or fused held objects.
- Generated stature is a production parameter, not a new canonical age/height assertion.

## Asset layers
1. Reference PNG: visual design, not geometry.
2. Textured source GLB: inspect front, side and back; validate actual embedded materials.
3. Rigged derivative: skin weights and usable deforming skeleton must exist.
4. Stock motion exports: verify real animation channels, duration, and skeleton compatibility.
5. Custom motion source FBXs: authored by text-to-motion; require visual review and retargeting. They are NOT already attached to the seven characters.
6. Game interaction: collision, input, object placement, animation events, inverse kinematics (IK), and state transitions require engine implementation and playtesting.

## Common controller
Joystick moves camera-relative; Jump is always recognizable. Context action offers one nearby meaningful action, with readable icon and short EN/RU label. Context priority: animal in need / active task > usable object > conversation > optional inspection. No offscreen interaction and no action through walls. Child can exit/interrupt noncritical work safely.

Locomotion state: idle / walk / run / crouch / airborne / landing. Task state: free / interacting / carrying / helping. An upper-body look/gesture layer may coexist with walking; a full-body lift cannot. Root motion must not fight the capsule controller. The controller owns travel unless a documented interaction explicitly takes over.

## Ground and traversal
Feet remain above terrain and plant without visible skating. Step-up is allowed below configured step height; mantle needs a clear destination and cannot go through walls. Jump is disabled during two-handed lifting and replaced with safe stepping during shoulder carry. Airborne landing recovers without injury imagery. Crouch stands only when there is head clearance.

## Lamb sequence — hard release gate
1. Approach within reach; lamb calms and stops locomotion before contact.
2. Kneel/squat; both hands support the animal before detaching it from ground.
3. Lift; no teleport, inverted elbows, stretched shoulder mesh or intersecting face.
4. Shoulder placement: lamb weight rests on shoulders, hand support is visibly high, head tilts naturally, and hind/front legs remain readable.
5. Walk with smaller strides, supported hands, and stable lamb/body contact.
6. Lower to a safe unobstructed ground point; do not release above a cliff or through a fence.
7. Release ownership only after feet meet ground; lamb resumes its own behavior.

Separate sockets: hand_left, hand_right, shoulder_lamb, chest_carry. Sockets need calibrated transforms for each child, not one blindly reused offset. IK targets follow contact surfaces. Animal skeleton/poses are separately required; human motion alone cannot establish believable carrying.

## Tools and tasks
- Hammer: correct grip; contact on plank; impact event occurs at contact, not merely elapsed timer.
- Dig: spade and soil contact; no anatomy passing through shaft; material appears only on completed scoop.
- Water: visible spout direction matches plant; watering consumes resource once per completed action.
- Sweep: broom touches ground, hands remain on handle.
- Plant: hands meet soil; seedling appears at placement event, not before.
- Baking: hands meet dough/table; hot-oven operations remain adult-led.
- Giving: transfer at shared contact; neither duplication nor disappearing objects.

## Character specialties, not restrictions
Michael: carrying, traversal, repair. Rosie: Scripture/clues, encouragement, practical helping. Joseph: tools and experiments. Gracie: younger-child tasks, small spaces, noticing and animal care. Simeon: shepherding demonstrations. Anna: hospitality/searching/household demonstrations. Tobias: kneading/shaping/sharing bread.

## Visual and performance gates
- Shoulder, elbow, hip and knee deformation checked in motion from front/side/back.
- Dresses, cloak and beard checked for attachment, clipping and leg separation; a successful auto-rig is not sufficient.
- Faces checked for back-of-head duplication and motion distortion.
- Low-detail meshes and texture budgets measured on target iPad; high-density source retained separately.
- Locomotion, camera, context prompts and task controls tested portrait and landscape.
- Source-motion contact sheets reveal pose intent only; they do not certify animation smoothness or prop contact.

## Release meaning
`generated`: provider output saved. `structurally_valid`: files parse with required geometry/skin/animation. `visual_reviewed`: actual output inspected. `retargeted`: motion drives intended character rig. `interaction_verified`: engine contact, controls and consequences tested. `game_ready`: all relevant gates passed. These labels must never be substituted for each other.
