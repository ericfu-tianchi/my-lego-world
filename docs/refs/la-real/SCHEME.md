# LA · palms + life layer — analysis and build scheme (2026-10-04, for Eric's sign-off)

Research only: no code, no scene edits. Part numbers checked against `My Lego World/vendor/ldraw-lib/ldraw/parts/*.dat` (headers below); geometry read from the moulds with `tools/ldraw/bbox.mjs`, `tools/ldraw/studs.mjs` and orthographic renders of the moulds. Colours checked on buka-atlas (BrickLink mirror) where marked ✓c; [?c] = not confirmed. Units: 1 stud = 2.5 plates; LDU 20 = 1 stud, 8 = 1 plate.

Reference image: `docs/refs/la-figures-lego.png` (gpt-image-2, three palms + the four figures). Notes on it at the end.

---

## A. Palm — *Washingtonia robusta* (new kind `fan`)

### A.1 Real proportions (from `la-venice/NOTES.md` §0.6, `la-real/NOTES.md` §4, `real-palms-washingtonia-closeup.jpg`)
- Pencil trunk, Ø ≈ 0.03–0.04 H, straight, barely tapering; a slightly swollen, darker foot. Pruned trunks are pale grey-brown (Dark Tan).
- Green crown ≈ 0.25 H tall, spread ≈ 0.27–0.29 H: a round, spiky ball of fan fronds on petioles.
- Directly under it, the **skirt** of dead fronds ≈ 0.10–0.12 H, hanging, straw to brown (Dark Tan / Reddish Brown in shade). The lowest live fronds droop and yellow (Olive Green).
- Rows, not singles: evenly spaced along Ocean Front Walk, tallest thing after the heroes.
- **Signature:** a very thin, very tall stick with a small round ball on top and a brown collar under the ball. Every LEGO palm that fails, fails by making the crown too wide (a coconut palm).

### A.2 Brick versions and what each does for the signature
1. **Official palm system** (2563a base, 2536b/6135b trunk segments, 2566b top, 2518 / 6148 / 30339 leaves; City 60328, Friends 41710, Creator 31118, 41751 boxes): segmented bark reads "palm", but 2×2 stubby segments + leaves reaching 7–9 studs = the coconut silhouette. Our Singapore `palm()` is this.
2. **Full Plate Builds tutorial (2018)** (`la-venice/moc-palm-fullplate.png`): flex-tube trunk with cones; crown of swordleaves clipped round life-ring hubs; **an upside-down Dark Tan bush under the crown as the skirt**; one olive leaf per hub as the yellowing lower frond. The only version that builds the skirt — the idea we copy.
3. **LEGOLAND Miniland San Diego** (`miniland-sd-coronado-palms.jpg`): 1-stud brown trunks ≈ 3–4 × a figure, small tufts on top. Proves the thin tall ratio reads at minifig scale.
4. **Ben Andrews, Palm Hill Skate Park** (`moc-lego-palm-hill-skate-park.jpg`): tall, slightly curved trunks in a skate deck — palms inside the park sell California.
5. **City / Friends beach sets** (60328, 41710, 31118): Bright Green, chunky; what to avoid.
6. **Our Singapore `palm()`** (`src/scenes/lib.ts`): 2536b segments + 2×2 hub + 2518/6148 crossed pairs — works, but it is a coconut palm.

**Conclusion.** Copy Miniland's 1-stud trunk and Full Plate's skirt-under-the-crown; do better than both by sizing the crown with real moulds that reach ≈ 3 studs, not 7–9. The measured reach of every classic palm leaf rules them out: **2518 reaches 8.8 studs, 6148 7.0, 30339 is 17 studs across, swordleaf 10884 4.3 from its base** → crowns Ø 9–17 on a 14-stud palm (0.6–1.2 H). The crown is built instead from small round-leaf and lanceolate-leaf moulds on the trunk's own axis:
- **6255** *Plant 1×1×0.667 Round with 3 Large Leaves*: three round leaves on curved petioles, Ø 4.6 studs — the closest LEGO shape to a palmate fan frond on its petiole, and it ends the axis (no top stud).
- **30176** *Plant Brick 1×1 Round with 3 Bamboo Leaves*: three drooping lanceolate leaves fanning to one side, reach 2.45 studs. Four in a pinwheel give a ring of 12 fronds.
- **49309** *Cone 2×2×2 Inverted*: a bell from a 1×1 anti-stud (on the trunk stud) to a 2×2 stud top — exactly the skirt's shape, 6 plates tall, and it doubles as the 1→2 width change (rule 7: on one axis, no corner-riding).
- **32607** *Plate 1×1 Round with 3 Leaves* in Olive Green: the yellowing lowest fronds, between skirt and green.

Why a palm cannot use `tree()`: the armature is a 2×2 trunk that forks into four limbs at every tier and hangs leaf clusters off limb tips. A Washingtonia has no branches: one 1-stud axis, all foliage at the top, and the crown must be narrower than any `tree()` tier (the smallest limb plate is 2 long, the crown would be ≥ 6 studs before any leaf). It needs its own function — extend Singapore's `palm()` with `kind: 'coconut' | 'fan' | 'date'` (one function, three crowns) rather than a fourth tree grammar.

### A.3 Stud-grid sketch (1 char = 1 stud horizontally; side view 1 row ≈ 2 plates)
Axis at a grid corner (`+`), so the 2×2 skirt cone sits centred on it.

```
SIDE (south)                         TOP (crown)
      .‿‿6255‿‿.        35            . . o o o . .
   ‿‿‿  |  ‿‿‿          32 jumper     . / B B B \ .      B = 30176 bamboo fronds (Green), pinwheel
 ‿‿  30176 ring ‿‿      29            o B b[++]b B o     b = 32607 (Olive) under them
     ~olive ring~       26            o B [+  +] B o     [++] = 49309 skirt top, 2×2
       \####/           25            o B b[++]b B o     o = 6255 round leaves above (Ø 4.6)
        \##/  skirt     22            . \ B B B / .
         \/  49309      20            . . o o o . .
         ||             19            crown Ø ≈ 6.3 studs (≈ 0.45 H; trunk 1 stud ≈ 0.07 H:
         ||  1×1 round  ..              crown/trunk ≈ 6.3, real ≈ 7.7)
         ||  bricks ×6  ..
         ||  Dark Tan   ..
         ##  Dark Brown  4
        [==] jumper 2×2  1
   ~~~~~~~~~~~~~~~~ sand pocket in the walk (Tan), 0
```

### A.4 Scheme table (plates above the ground it stands on)
| Plates | Element | Part type → verified LDraw (first pick → fallback) | Colour |
| --- | --- | --- | --- |
| 0–1 | foot: puts the 1-stud trunk on the grid corner | jumper 2×2 **87580** (in catalogue) | Dark Tan |
| 1–4 | trunk foot, darker | round brick 1×1 **3062b** (catalogue `round_1x1`) | Dark Brown |
| 4–19 | trunk ×5, straight, one axis | **3062b** | Dark Tan |
| 19–25 | dead-frond skirt, bell 1 → 2 studs; its bottom tube takes the trunk stud | cone 2×2×2 inverted **49309** → fallback brick 2×2 round with grille **92947** on a 2×2 jumper | Reddish Brown ✓c (Dark Tan not produced; Medium Nougat is the other choice) |
| 25–26 | yellowing lower fronds, one on each skirt stud, pinwheel | plate 1×1 round with 3 leaves **32607** (catalogue) ×4 | Olive Green ✓c |
| 26–29 | live fronds ring, pinwheel (each leaf fan points along one of +x, −z, −x, +z, one per stud) | plant brick 1×1 round with 3 bamboo leaves **30176** ×4 | Green ✓c (Olive Green not produced) |
| 29–30 | width change back to the axis | jumper 2×2 **87580** | Green |
| 30–32 (+3.4 leaves) | crown top: three round fan fronds rising and arching | plant 1×1×0.667 round with 3 large leaves **6255** | Green ✓c (only Green / Bright Green exist) |

Top of silhouette ≈ **35 plates** (usa.md §1.5: 30–36 ✓). Trunk 0.54 H, skirt 0.17 H, crown 0.29 H (real 0.64 / 0.11 / 0.25): the skirt is a little long because 49309 is the only bell; accepted, and the alternative below is shorter.

**Part count: 18 per palm** (2 jumpers, 6 round bricks, 1 cone, 4 + 4 leaves, 1 top). Row of 6 = 108, row of 7 = 126, row of 8 = 144.

### A.5 Footprint, rows, budget, bakes, risks
- **Footprint** 2×2 at the foot (a Tan sand pocket in the Light Bluish Gray walk); crown Ø ≈ 6.3. With `Sites` radius 3 the minimum pitch is 3 + 3 + 2 = **8 studs**: a row of 6 spans ≈ 46 studs, a row of 7 ≈ 54. If the boardwalk is shorter, radius 2.5 → pitch 7 (crowns 0.7 apart; LA street rows really do nearly touch). Rows along the boardwalk only, never on the hills (usa.md).
- **Variation without breaking regularity**: equal pitch, equal height in a row (planted together); each palm's pinwheel `turn` differs (0–3) so crowns are not clones. No lean (rule 7; a lean reads as a mistake, Kyoto v4).
- **New to bake**: 49309, 6255, and the real **30176** (the catalogue's `bamboo_leaves` is a hand-made `def()` primitive, not the LDraw mould — rule 1 says replace it). 3062b, 87580, 32607 are in.
- **Grammar**: `palm(bp, x, y, z, { kind: 'fan', bricks: 6, turn })` in `lib.ts`; tag `palm` so its leaves may interleave only with its own parts.
- **Risks**: (1) 49309 has a smooth surface — it may read as an ice-cream cone (LEGO literally printed it as one, 49309p01). Mitigation: the Olive ring overhangs its rim; if it still reads as a cone in the close-up, swap to **92947** (2×2 round with grille, vertical ribs = hanging fronds) on a jumper, colour [?c]. (2) 30176 Green is a forest green; the photo's fronds are olive-green in shade — the Olive 32607 ring under it carries the olive. (3) Crown Ø 6.3 is 0.45 H — wider than the real 0.27 H but it keeps the real crown-to-trunk ratio for a 1-stud trunk; anything smaller is a pompom at hero distance. Check in the render pack beside `real-palms-washingtonia-closeup.jpg`.
- **Open question**: the real skirt *hangs* (fronds pointing down along the trunk). No small official leaf hangs from a stud: every leaf mould droops from a stud at ≤ 40°, and a leaf on a side stud curls back into the trunk (it droops toward its anti-stud side). The bell is a silhouette answer, not a texture answer. If the judge asks for texture, the next candidate is a ring of **88964** (bar 0.5L with curved leaf 2L) pushed up into the bar tubes of a **20612** holder ring — needs an assembly and colour checks.

### A.6 Optional: one Canary Island date palm (`kind: 'date'`)
Thick trunk (Ø ≈ 1 m) with a diamond leaf-base pattern, a huge round crown of arching feathery fronds (≈ 0.6–0.8 H). One at most — the "fat palm" foil at Palisades Park end of the row.
| Plates | Element | Part types | Colour |
| --- | --- | --- | --- |
| 0–1 | foot | plate 2×2 round **4032a** | Dark Tan |
| 1–19 | trunk 2×2, alternating textured / plain | brick 2×2 round with grille **92947** ×3 + brick 2×2 round **6143** ×3 | Dark Tan [?c for 92947] |
| 19–20 | hub | plate 2×2 round **4032a** | Olive Green |
| 20–24 | 4 layers × 2 fronds, each pair crossing the one below, stacked on the leaf bases' own studs (the Singapore `palm()` technique) | swordleaf 6×5 **10884** ×8 (lower 4 Olive Green, upper 4 Green ✓c — Dark Tan also exists for one dry frond) | Olive Green / Green |
| 24–25 | top | 32607 | Green |
Crown Ø ≈ 9.6 (10884 reaches 4.3 studs from its base) on ≈ 25 plates ≈ 0.95 H — the right "ball on a pillar" read. **17 parts.** New: 10884, 92947, 6143. My recommendation: leave it out unless the row needs a full stop at its end — it is the second-best palm and the set is stronger with one species.

---

## B. Figures — the free, sporty LA mood

### B.0 What the rig can and cannot do (read before the figures)
From `minifig2()` in `src/scenes/lib.ts`, `RIG` (`src/parts/ldraw/minifig-rig.ts`) and `tools/ldraw/minifig-asm.mjs`:
- Legs: one mould only (970c00/3815c01, standing straight). No walking, crouching or skating legs. Feet snap to the stud grid; both feet must be supported.
- Arms: four elevations per side — **d** 0° (down), **f** −45° (forearm level, grip 1.5 studs forward at waist), **h** −90° (upper arm level, grip at chin height), **u** −135° (forearm vertical, grip just above the forehead, x ±0.77). The wrist never turns.
- The hand clip's axis follows the forearm: computed from 3820's grip hole (hand-local y) through `Rx(pose + 45°)`: **f = vertical**, d and h = tilted 45°, **u = horizontal front-to-back**. So a vertical handle goes in **f**; nothing in **u** can run left-right.
- A held part is placed with a **yaw only** (`bp.part` rot 0–3). A part whose handle is not vertical in its own frame needs a pre-rolled bake.
- Gates: grip offset ≤ 0.35 stud; `grip buried` > 0.45 inside; `grip off-part` > 0.25 outside; hands may touch only their own figure.

Consequences found while designing (each one changed a figure below):
1. **Barbell overhead is not buildable on our rig.** 29592 is a 3.26-stud bar with two Ø 1.13 balls; the bare bar between them is only **1 stud**, but the hands sit 1.5–1.75 studs apart in every pose, so two hands cannot share it. One hand in **u** puts the bar at forehead height 0.28 forward: upright, the lower ball enters the head; front-to-back, the rear ball enters the hair; sideways, the inner ball passes over the head. The CMF Weightlifter does it with fully raised arms and a turned wrist, which our rig does not have.
2. **Surfboard under the arm needs the board on edge** (a 90° roll), and the **d** clip is tilted 45°, so the rail would run nose-down. Not buildable without a roll and a wrist turn.
3. **The skateboard and the skates have no anti-stud of the usual kind**, but both have a real connection we can use (below).

### B.1 Skateboarder (mandatory) — at the bowl lip, about to drop in
Real: Venice skaters wear helmets in the bowl; the drop-in from the coping is the most legible moment that keeps the board on the deck (no mid-air figure allowed).
Brick versions: City 60364 / 60290 skaters and Friends 41751 (figure on the board's two studs, helmet), CMF skater figures [M]; all stand on the 42511 board's studs.
| Item | Scheme |
| --- | --- |
| Board | **42511c01** skateboard complete, black wheels (or 42511 + trolley wheels 2496 at bake). Deck 5 × 2 studs, **2 studs on top at ±0.5 along its length** = the two foot holes, so the figure stands side-on to the direction of travel, like a real skater. ✓c Orange (also Red, Lime, Blue, Yellow). |
| How the board connects | Its underside is a **1×2 plate underside with a centre post** (box under the deck, x ±1 stud): it clicks onto a 1×2 stud pair. Deck top is 3 plates above the floor (wheels to 24.3 LDU), the underside 2 plates up → a hidden **post of two 1×2 plates** (3023b ×2, Light Bluish Gray) between the trucks. Wheels touch the deck tiles; the post carries it. |
| Feet | leg holes on the board's two studs; figure at deck + 3 plates. |
| Pose | arms **L h, R f** (one high, one low — balance as he tips in); head turned one quarter toward the bowl (the nose of the board points over the coping). |
| Headgear | helmet **46303** (sits on the head stud like hair). Red ✓c (Dark Azure / White also exist) — red on Light Bluish Gray concrete is the strongest read at thumbnail. |
| Torso / legs | torso White, legs Dark Blue. |
| Print (L2) | **Face**: focused grin, small tongue out — Black, White, Coral (3). **Torso**: white tee with a wordless sunset-and-palm disc on the chest (Coral sun, Black palm silhouette, Dark Azure sea band) — 3 colours on White. |
| Coordinate with the bowl agent | needs a flat 6 × 3 stud strip of deck at the coping with one 1×2 stud pair left untiled under the board's centre; the board's nose may overhang the coping by ≤ 2 studs. Board rot along the coping. |

### B.2 Surfer — walking out of the surf, board on his head
Real: the surfer coming up the beach from the waterline is the beach's most legible figure; carrying the board on the head is common with longboards and is the one carry our rig can build honestly.
Brick versions: CMF Surfer (S1, 2010) and Friends 41710 Surf Shop / City beach sets — the board carried in one hand at the side, which needs the roll we do not have [M]; gpt-image-2 ref shows the on-head carry reading clearly.
| Item | Scheme |
| --- | --- |
| Board | **90397** surfboard 2 × 6.5, **White** ✓c (Coral / Medium Azure also exist). It has **4 anti-stud tubes along its centre line** (z +1, 0, −1, −2 studs) → the head's top stud **3626c** goes into the tube at 0 (near the balance point). A real stud joint, no hold needed. Board 1.4 × figure height = a mid-length board. (6075 longboard has no underside tubes: cannot be used this way.) |
| Pose | arms **u / u**: the hands come up under the board's rails (grip 0.77 out vs rail 0.95; 0.45 plate under the board's underside, inside `VSKIN`). If the close-up shows the hands through the board, fall back to **h / h**. |
| Hair | **none** — the head stud carries the board. A bald head under a board is the honest consequence; the face print gives wet hair a hint (see print). |
| Torso / legs | full wetsuit: torso **Black**, legs **Black**, hands Yellow. |
| Print | **Face**: squint against the sun, wet fringe painted at the top edge of the face — Black, White, Dark Brown (3). **Torso**: Dark Azure chest-and-shoulder panel, white zip cord down the back shown at the collar, thin Coral seam — 3 colours on Black. |
| Place | standing on the wet-sand strip (Dark Tan studs), facing inland, sea behind him; feet on studs. |

### B.3 Muscle Beach lifter — hammer curls with two dumbbells
Real: Muscle Beach is free weights in an open pen by the sand (`real-musclebeach*.jpg`).
Brick versions: CMF Weightlifter (8684-10, 2010), Wondrous Weightlifter (8909-7, 2012), CMF Fitness Instructor (71045-7, 2024), gym gantries in 41744 / 60372.
Because of B.0 (1), the lifter holds **one 29592 in each hand, upright, arms forward (f/f)**: the clip axis in **f** is vertical, so the mould needs no roll; it reads as a pair of dumbbells in front of a tank top. Clearances (from the mould): balls at y −0.68 ± 1.06 from the neck → top ball at shoulder height, bottom ball 1.3 studs off the ground; inner edges at x ±0.5 (1 stud apart); back of the balls 0.94 in front of the torso face (0.5). Nothing touches.
| Item | Scheme |
| --- | --- |
| Prop | **29592** ×2, Black [?c — buka returned 404; the CMF barbell was black]. `HOLD_DEFAULTS.barbell = { pose: 'f', gp: [0, 0, 0], shaft: true }` — the hand closes on the 1-stud bare bar at its centre, the only place a hand can go. |
| Pose | **f / f**. |
| Hair | `hair_short` (40233, in catalogue), Black. |
| Torso / legs | torso **Yellow** (bare arms) with the tank top printed; legs Black (gym shorts read as dark legs at distance). |
| Print | **Face**: effort face, teeth gritted, one bead of sweat — Black, White, Medium Azure (3). **Torso**: White tank top with racer straps, pec and ab lines in Black over the yellow — 2 colours. |
| Place | inside the Muscle Beach pen on its pad, facing the walk; one stud between him and the rack. |
| If Eric wants the overhead press | add a rig pose **v** (−180°, arms straight up) and a wrist quarter-turn to `minifig-asm.mjs`, plus pre-rolled bakes (`models/<key>_x.ldr`, one part each). Even then 29592's 1-stud bare bar takes only one hand — a one-arm press. |

### B.4 Roller-skater — roller dance on Ocean Front Walk
Real: the Venice skate-dance plaza; afros, tube socks, rainbow tees [M].
Brick versions: CMF roller-skater figures with 11253 (several series) [M]; Friends roller-disco sets [M].
| Item | Scheme |
| --- | --- |
| Skates | **11253** ×2, **White** ✓c (Dark Pink / Yellow / Blue also exist). Mould: a stud on top for the foot; underneath, **four wheels whose inner faces are exactly 12 LDU apart (x = ±6)** with 6 LDU clear under the body — a scene stud (Ø 12, 4 tall) fits between the wheel pairs. So each skate straddles one stud of the walk, and the foot sits on the skate's stud: both feet supported, both skates connected. Verify in the first close-up; if the validator does not recognise the straddle, give `11253` a declared bottom anti-stud at its origin (the mould's own geometry), not a hidden plate. |
| Feet | each leg hole on its skate's stud (skates at the two foot cells); figure at walk + 1 plate. |
| Pose | arms **L u, R h** — one arm up, one out front: dancing. Head turned a quarter toward the camera side if the figure stands side-on. |
| Hair | Afro **87995** (Hair Bubble Style), Black [to bake]. |
| Torso / legs | torso White, legs Medium Azure. |
| Print | **Face**: wide open smile, round sunglasses — Black, White, Dark Brown (3). **Torso**: white tee with a three-band rainbow sweep across the chest — Red, Yellow, Dark Azure (3 + white ground = 4). |
| Place | on the paved walk with a 3-stud clear ring, near the palm row. |

### B.5 Optional fifth: lifeguard on the tower deck
| Item | Scheme |
| --- | --- |
| Prop | binoculars **30162**, Black ✓c. Mould box 1.2 × 0.6 × 1.4 studs (eyepieces at one end). `HOLD_DEFAULTS.binoculars = { pose: 'h', gp: [−0.55, 0, −0.25] }` estimate: the right hand on the barrel's side near the eyepiece end; the h grip sits at chin height 1.27 in front, which puts the eyepieces at the face (≈ 0.65). Check the eyepiece end in the bake, then confirm in a side close-up that it touches the face, not the head inside. |
| Pose | **R h** (binoculars), **L d**; head turned toward the sea. |
| Headgear | cap **86035** (short arched peak), Red. |
| Torso / legs | Red jacket, Red legs (LA County red trunks). |
| Print | **Torso**: white zip line and a small white chest patch (no emblem, no words) — 1 colour. **Face**: reuse the roller-skater's sunglasses face (print budget). |

### B.6 Figures — summary
| Figure | Pose | Held / under the feet | Head | Prints | New bakes |
| --- | --- | --- | --- | --- | --- |
| Skateboarder | h / f | 42511c01 on a 2-plate 1×2 post | helmet 46303 Red | face + tee | 42511c01, 46303 |
| Surfer | u / u | 90397 on the head stud | none | face + wetsuit | 90397 |
| Lifter | f / f | 29592 ×2, gp = bar centre | hair_short | face + tank | 29592 |
| Roller-skater | u / h | 11253 ×2 straddling studs | afro 87995 | face + tee | 11253, 87995 |
| Lifeguard (opt.) | h / d | 30162 | cap 86035 | torso only | 30162, 86035 |

Print budget: 8 designs for the four (usa.md §1.8 planned exactly this); the lifeguard adds 1 torso → **12 with graffiti, star and "66"**, at the cap. Pieces: 8–9.
Spacing: each figure reserves 3×3 and sits ≥ 6 studs from the next (rule 6). Heights: figures 12 plates (+3 on the board, +1 on skates) — under the 16-plate tower.

---

## C. The one hardest open problem
**Holds that are not vertical.** Two of the brief's poses (barbell overhead, board under the arm) fail on the rig, not on LEGO: the wrist never turns, `u` clips run front-to-back, and held parts can only yaw. I designed around it (dumbbell curls, board on the head). If Eric wants the iconic overhead press or under-arm carry, the fix belongs in the pipeline (rule 15): a `v` arm pose + wrist quarter-turn in `minifig-asm.mjs` and one-part pre-rolled bakes — one change that serves every future country (a flag carried sideways, a pull-up bar, a guitar slung across).
Second-hardest: the palm skirt is a smooth bell, not hanging fronds; it must pass a close-up beside the real photo.

## D. Reference image `docs/refs/la-figures-lego.png`
- Right: the inverted-cone skirt under a small leafy crown reads as a fan palm at once; the four figures read as skate / surf / lift / roller-dance at thumbnail size, and the board-on-head carry is the clearest figure in the frame.
- Wrong vs the scheme: palms only ≈ 2.5 × a figure (ours ≈ 3 ×, 35 plates) and crowns built from flower plates instead of 6255; the surfer has hair (impossible — the head stud carries the board); the lifter's dumbbells are horizontal (our f grip holds them upright), the skater walks (our legs are straight), and the board has no post.
