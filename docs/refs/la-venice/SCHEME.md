# Venice beachfront: landmark analysis and build schemes

2026-10-04 · research only, nothing built · format follows `docs/countries/china.md` §1.9.2–§1.9.7
Reference image: `docs/refs/la-venice-lego.png` (gpt-image-2, see §7). Source photos and brick versions: `NOTES.md` in this folder.

## Units and levels used on this page
- Heights are in plates **above the island surface** (sand / apron top = 0). In absolute scene plates the surface top is at 10, the base at 3, and the earth runs from plate 3 to plate 9 (as in Shanghai: `BASE = 3`, `G = 10`).
- A minifig is ≈ 12.5 plates tall (`fig_legs` h 6, plus torso and head). The usa.md §1.5 row "figures 6" undercounts this; every height below is checked against 12.5.
- In the ASCII sketches, 1 char = 1 stud. North is up in top views, and the default camera looks from the south.
- Part status: **L** = already baked (`src/parts/ldraw/index.ts`); **P** = in the catalogue as procedural geometry; **bake** = must be baked. Every number on this page was checked against `vendor/ldraw-lib/ldraw/parts/<n>.dat` (header quoted where it matters).

## 0. Corrections to NOTES.md and usa.md that this pass found
1. **Inverted curved slopes cannot make a skate transition.** The geometry of 24201 shows why. Its curved face is a 45° arc whose centre lies on the solid's side (above the part), and the arc sags *away* from the solid, so the face is **convex**, like a boat hull. A quarter-pipe is **concave**. No rotation changes convex to concave, so stacking 13547 / 24201 / 11301 / 45410 builds a hull, not a bowl. (The Vert-Ramp MOC's smooth transitions are large moulded panels or faceted slopes, not inverted curves.) The scheme below builds the concave transition as **two facets**, shallow below and steep above, which is the standard LEGO way.
2. **43085 / 43086 are 6 bricks (18 plates) tall.** Our bowl can be at most ≈ 5 plates deep (the earth is 6 plates thick, and the floor needs one plate under it). Both moulds are out.
3. **The Muscle Beach gate is not a "barbell with dark-blue plates".** `real-musclebeach.jpg` and `real-musclebeach2.jpg` show a warm-grey concrete **portal** (two square piers and a lintel). It carries two **royal-blue boxes** (≈ LEGO **Blue**, not Dark Blue) and, on a **slanted concrete arm**, a huge **black weight-plate disc**. A second black disc with a hub sits on the side of the pavilion.
4. **29592 is a dumbbell, not a barbell.** Its mould is two Ø 22.6 LDU spheres on a 46 LDU bar, held in one hand. The lifter therefore holds **two dumbbells**, one per hand, which `minifig2` can already do.
5. **The skateboarder cannot be "in the air over the lip"** (usa.md §1.7): rule 2 needs both feet on studs. §1.3 gives the legal moment.
6. **Heights:** the lifeguard tower is ≈ 23 plates, not 16, because a near-cubic cabin that a minifig fits next to cannot be 16. The art walls are ≈ 17 plates, not 6–8, because a wall lower than a minifig reads as a bench. Both stay below the palms (30–36), so the height tiers hold.
7. **Roller skates (11253) put the feet on wheels.** The mould's stud plugs into the foot, so the figure no longer stands on studs. See §5 for the risk and a fallback.

---

## 1. Skate bowl: 19 × 12 studs, sunk 5 plates, ≈ 290 parts

### 1.1 Real proportions and signature
- Venice Skatepark (2009): 16,000 sq ft on the sand at Windward Ave. A 9-ft clover bowl, a shallower flow bowl, a snake run and a street section.
- **Kidney and clover bowls are dug into a flat concrete apron.** There are no raised ramps.
- Smooth transitions run from a flat bottom to near-vertical at the lip. The deep end has a short vertical wall.
- A **coping line** runs round every rim. It is a slightly darker rounded lip, with a band of decorative pool tiles just under it (`real-skatepark.jpg`).
- Plain grey concrete everywhere (Light Bluish Gray). **No graffiti in the bowl.** A pipe railing stands on the boardwalk side, and sand comes right up to it.
- **Signature details:** (a) the kidney plan, two lobes with a pinched waist; (b) the dark coping ring; (c) the *sunk* read, with the apron flush with the beach; (d) a skater inside the bowl.

### 1.2 Brick versions and conclusion
| Version | What it does for the signature |
| --- | --- |
| 41751 Skate Park (official) | Curved-slope dip and coral half-pipe. Transitions are one large moulded panel, so the shape reads at once, but it is raised and pink |
| 60364 Street Skate Park (official) | Grey/orange street furniture. The rails and ledges read well; the half-pipe is a raised panel |
| 60290 Skate Park (official) | A quarter pipe ≈ 4–5 bricks tall on a road plate. Gives the scale of a transition at minifig size |
| 41099 / 30633 (official) | Small curved panels, raised |
| Jason W. Ellis Vert Ramp (MOC) | Tan transitions, dark coping bricks, tiled flat. **A figure waits on the deck holding the board**: the legal "about to drop in" moment |
| JangBricks skatepark (MOC) | All-grey concrete with accents only on props. **The right palette** |
| Nybohov sunken bowl (MOC) | A bowl **sunk** into a grey plate field, its walls sloping in. **The right arrangement** |
| Palm Hill (MOC) | Palms inside the park footprint say "California" |

**Conclusion.** Copy the arrangement from Nybohov (sunk into the island's earth), the palette from JangBricks (all Light Bluish Gray, with the colour on the skater's board), and the coping line from Vert Ramp (a darker or raised lip that draws the outline).

We do better than all of them on the profile. Every MOC above either uses a single moulded ramp, which is too tall for us, or a single straight slope, which reads as a pyramid pit. Ours is a two-facet concave profile: shallow cheese slopes at the foot and 45° slopes at the top under a proud coping. From 30° above, that reads as a transition.

### 1.3 The skater: the legal "skating" moment
The 42511 mould, read from the LDraw file:
- The deck is 2 × 1 studs, with **two top studs at x = ±10 LDU**. That is exactly the spacing of the two anti-studs on `fig_legs`, so the figure stands **across** the board, which is the real skating stance. It is side-on to the board's direction and faces the camera.
- The underside has a **centre tube (stud3a)**, the same as a 1 × 2 plate, so the deck clutches a 1 × 2 stud pair.
- The wheels (2496 ×4, in the deck's clips at x = ±29.6) hang 16.3 LDU (2.04 plates) below the deck bottom and have no stud.

**First pick, "riding the flat bottom":**
- The board runs east–west on the deep lobe's floor. Under its centre, a **hidden Black 1 × 2 riser of 2 plates** sits on the floor plate, in place of two floor tiles. That lifts the deck so the four wheels **kiss the floor tiles** (wheel bottoms 0.04 plate above the tile tops, inside `VSKIN`).
- From any angle the riser hides between the trucks and reads as truck shadow.
- The figure's legs go on the deck's two studs. Arm poses: front arm `f`, back arm `h` (arms out for balance).
- Kit: skate helmet 46303, a printed tee (shared torso design, §2.5), deck in **Red** with Black wheels (42511c01, exploded into 42511 + 4 × 2496).
- Seen from 30° above, the head (≈ +8 plates) stands well over the coping (+0.67), so the skater reads as "in the bowl".

**Alternative (Vert-Ramp moment), "waiting to drop in":**
- The figure stands on the apron at the coping. The apron there is plates, not tiles, so there are studs.
- The board is held upright in one hand, gripped at its nose (`gp` at the deck end, pose `d`).
- It is less dynamic, and needs one more `HOLD_DEFAULTS` entry.

### 1.4 Stud-grid sketch
**Top view** (19 × 12). `C` = coping over the high cell of a 45° slope; `s` = the sloped cell of the 45° slope; `c` = cheese slope; `F` = floor tile; `K` = skateboard + rider (riser under the centre two cells); `A` = apron tile; `R` = railing post; `=` = rail bar; `.` = sand.
```
   x 0123456789012345678
z0   R===R===R===R===R..   pipe rail, boardwalk side (north)
z1   AAAAAAAAAAAAAAAAA..
z2   ACCCCCCCCCCAAAAAAA.
z3   ACsssssssssCCCCCCA.
z4   ACscccccccsssssssCA      deep lobe (W)          shallow lobe (E)
z5   ACscFFFFFFccccccsCA
z6   ACscFKKKKFFFFFFcsCA   <- rider on the deep-lobe floor, board along x
z7   ACscFFFFFFccccccsCA
z8   ACscccccccsssssssCA
z9   ACsssssssssCCCCCCA.
z10  ACCCCCCCCCCAAAAAAA.
z11  AAAAAAAAAAAA.......   apron melts into sand on the beach side (south)
```
The sketch shows the ring logic only. In the build, the lobes have **cut corners**: 3046 *Slope 45 2 × 2 Double Concave* at every inside corner and 3045 *Double Convex* at the waist. That turns the rectangle into a kidney: a deep lobe ≈ 10 × 8 with a 4 × 4 floor, and a shallow lobe ≈ 8 × 6, one plate shallower, with a 2 × 4 floor.

**Section** through the wall (scale: 1 char = ½ stud horizontally, 1 row = 1 plate):
```
 +0.67  ▄▄▄▄                         coping tile (proud lip, Light Bluish Gray)
  0    ████▓▓                        apron tile | coping sits on the 45° slope's high-cell stud
 −1    ████▓▓▓╲                      45° slope 3040b: high cell under coping,
 −2    ████▓▓▓▓╲                       sloped cell over the cheese
 −3    ████▓▓▓▓▓▓╲___                 ← facet break (steep above, shallow below)
 −4    ████░░░░░░░░╲__                cheese 85984 (31°) on the floor plate studs
 −5    ████░░░░░░░░░░░╲▁▁▁▁▁▁▁▁▁     floor tiles
 −6..−7 ███████████████████████████   floor plate = island bottom layer (runs 2 cells under the rim)
       earth  support   C   s   c   F
```

### 1.5 Scheme table
| Plates | Element | Part types: first pick → fallback (status) | Colour |
| --- | --- | --- | --- |
| −7 … −6 | Floor plate: the island's bottom layer under the bowl. It **runs 2 cells under the rim** so the earth above clamps it; on its own it would be a loose sheet | Plate 6×8 3036 (L), 4×6 / 2×8 3034 (L) | Light Bluish Gray |
| −6 … −5 | Floor finish; 2 cells left as studs for the rider's riser | Tile 2×2 3068b (L), 2×4 87079 (bake) → 1×2 3069b (L) | Light Bluish Gray |
| −6 … −3 | Support column under every 45° slope's high cell | Brick 1×N 3010 / 3009 / 3622 (L) | Light Bluish Gray |
| −5 … −3 | Lower facet: shallow transition | Slope 31 1×2×⅔ cheese **85984** (P → bake from LDraw), corners 1×1 cheese **54200** (L) | Light Bluish Gray |
| −3 … 0 | Upper facet: steep transition, 2 deep (high cell + sloped cell) | Slope 45 2×1 **3040b** (L); inside corners **3046** 2×2 double concave (bake), waist **3045** 2×2 double convex (L) | Light Bluish Gray |
| 0 … +0.67 | **Coping ring**: a proud lip on the high-cell studs | Tile 1×2 / 1×4 3069b / 2431 (L), round corners Tile 1×1 corner round 25269 (L), 2×2 corner round 27925 (L) | **Dark Bluish Gray** if the ring needs to read at thumbnail (judge call), else Light Bluish Gray |
| −1 … 0 | Apron round the bowl, flush with the sand | Tile 2×2 / 2×4 (L / bake) on the earth | Light Bluish Gray |
| 0 … +7 | Pipe rail on the north (boardwalk) side: posts every 4 studs, one bar run | Brick 1×1 round 3062b ×2 (L) + Plate 1×1 clip vertical 4085c (L) + Bar 6L **63965a** (bake); `railing()` helper | Flat Silver bars, Light Bluish Gray posts |
| −6 … −3 | Rider's hidden riser | Plate 1×2 3023 ×3 (L) | Black |
| −3 … +9.5 | Skateboarder | 42511 deck + 2496 wheels ×4 (both bake), `minifig2` with helmet **46303** (bake), pose `f`/`h` | Red deck, Black wheels |

### 1.6 Footprint, height, budget, risks
- **Footprint 19 × 12** (brief said ≈ 16 × 11). The 4-stud floor is the reason: the board with its wheels spans 3.96 studs, and each wall takes 3 studs (coping cell, 45° slope, cheese). Rule 13: grow rather than squeeze.
- **Height:** floor −5, coping +0.67, rail +7, skater's head ≈ +9.5.
- **Budget:**

  | Group | Pieces |
  | --- | --- |
  | Floor plates and tiles | 30 |
  | Supports | 20 |
  | Cheese slopes | 45 |
  | 45° slopes and corners | 55 |
  | Coping | 35 |
  | Apron | 70 |
  | Rail | 20 |
  | Rider (with board and riser) | 15 |
  | **Total** | **≈ 290** |
- **Bake:** 3046, 85984 (from LDraw; it is procedural today), 87079, 63965a, 42511, 2496, 46303.
- **Risks:**
  - The two-facet profile may read as "stepped pit" rather than "transition" from the hero distance. Test a close-up and the hero view in round 1. If it fails, a third facet (Slope 33 / 18° plates under the cheese) needs one more plate of depth, which the earth does not have. The fallback is to raise the whole park on a 2-plate concrete deck with a Light Bluish Gray curb to the sand. Venice's apron does sit slightly proud of the beach.
  - Light Bluish Gray on Light Bluish Gray hides the wall shape in flat light. The renderer's shading of the 31° and 45° faces must differ; check in round 1.
- **Open question:** the coping colour (Light Bluish Gray as real vs Dark Bluish Gray for the read). Decide on the round-1 render, not now.

---

## 2. Graffiti art walls: three walls 8 × 1 × 17, ≈ 25 parts, 3 print designs

### 2.1 Real proportions and signature
- These are the surviving walls of the 1961 Venice Pavilion ("The Pit"); painting there has been legal since 2000.
- **Free-standing straight concrete walls standing directly in the sand**, ≈ 2–2.5 m high and 10–20 m long, plus one tall painted pylon.
- **Every face is fully covered** and repainted constantly: wildstyle pieces with black outlines and white highlights, plus characters.
- A concrete path crosses the sand to them, and palms stand behind.
- **Signature:** a slab of colour standing in bare sand. The wall is plain, the paint is everything.

### 2.2 Brick versions and conclusion
| Version | What it does |
| --- | --- |
| PriBri custom-print graffiti alley (MOC) | Wildstyle printed on grey brick walls. Graffiti at minifig scale is **a print, not a mosaic** |
| LEGO DOTS tile mosaics | A studs-out tile mural. Readable, but it reads as "mural", not spray paint |
| 60364 "SKATE" panel, 41751 graffiti wall, 10297 mosaic (official) | LEGO prints graffiti on **one large flat element** |
| JangBricks / Nybohov skateparks (MOC) | Printed walls beside the bowl, which is the real Venice arrangement |

**Conclusion.** Follow the official route: **one printed large element per wall**, framed by plain concrete.
- The element is **Brick 1 × 6 × 5 (3754, "Brick 1 x 6 x 5")**. Its long faces are flat on both sides, so it can be printed front and back.
- We prefer it to Panel 1 × 6 × 5 (59349), whose back shows the panel's lips.
- We do better than the official panels by making three different designs in three different styles (wildstyle, character, motif), the way the real Pit mixes them, and by keeping the concrete edges bare.

### 2.3 Sketch
**Front view** of one wall (1 char = 1 stud wide, 1 row = 3 plates):
```
 +16.67  ▔▔▔▔▔▔▔▔   Tile 1×8 cap (4162) Light Bluish Gray
 +15     ┃██████┃   ┐
 +12     ┃██████┃   │ Brick 1×6×5 (3754), printed both faces
 +9      ┃██████┃   │ (the brick colour is the print's ground)
 +6      ┃██████┃   │ end posts: Brick 1×1×5 (2453b) Light Bluish Gray, bare concrete edges
 +3      ┃██████┃   ┘
 +1      ▀▀▀▀▀▀▀▀   Plate 1×8 footing (3460) on the sand studs
```
**Top view** of the group, beside the bowl's west end, staggered as in the Pit, prints facing south (toward the camera) and north:
```
   x 0         1
     0123456789012
z0   WWWWWWWW.....     wall 1  G1 wildstyle
z1   .............
z2   .............
z3   ....WWWWWWWW.     wall 2  G2 character
z4   .............
z5   .............
z6   WWWWWWWW.....     wall 3  G3 sun & palms
z7   ..pppppp.....     concrete path (Light Bluish Gray 1×N tiles on Tan) leading to them
```
Gaps are 2 studs, so a camera between them sees the next print.

### 2.4 Scheme table (per wall)
| Plates | Element | Part types (status) | Colour |
| --- | --- | --- | --- |
| 0 … +1 | Footing on the sand | Plate 1×8 3460 (L) | Light Bluish Gray |
| +1 … +16 | Body | Brick 1×6×5 **3754** (bake), printed; flanked by Brick 1×1×5 **2453b** (L) | Ground colour per design (below) |
| +16 … +16.67 | Cap | Tile 1×8 4162 (L) | Light Bluish Gray |

The painted pylon (a stack of coloured round bricks) is **left out**. Plain colour bands would read as a toy totem (rule 6: unreadable set dressing is worse than nothing), and printing it would cost a fourth design.

### 2.5 Print designs (L2: flat faces only, ≤ 4 print colours, no gradients, no words, nothing over studs)
All three go on the long face of 3754: 6 × 6 studs, rect ≈ 5.88 × 5.88, `px` 160, so the canvas is ≈ 940 × 940.
- The faces are vertical, so no print covers a stud.
- Each design is printed **on both faces**, the back mirrored. Wordless shapes survive mirroring, and this is how printed cloth already works in prints.ts.
- *Code note:* `both` is implemented only for `face: 'side'` in `decalGeometry`. Bake 3754 so that its long axis is `d` and use `face: 'side', both: true`, or extend `both` to `front`.
- **Legibility rule for all three:** no shape narrower than 0.25 stud, black outlines ≈ 0.08 stud, at most ~5 big masses per face, so it still reads as graffiti at the hero distance.

| Key | Brick ground | Print colours (≤ 4) | Motif |
| --- | --- | --- | --- |
| `graffiti_wild` | **Medium Azure** | Bright Light Orange, Red, Black, White | **Wordless wildstyle.** Four interlocking angular "letter" masses that are deliberately not letters: chunky blocks with forked serifs, two arrows breaking out (one up-right, one down-left), overlaps shown by a thicker black outline. Fill: top half Bright Light Orange, bottom half Red, split by one hard diagonal; no gradient. A black drop-shadow offset down-right (the 3D block). White highlight dashes on the upper-left edges and three 4-point sparkle stars |
| `graffiti_char` | **Lime** | Black, White, Medium Azure, Bright Pink | **Character.** A round-headed cartoon "sun-kid" filling ~70 % of the face: a backwards cap (Bright Pink), wide Medium Azure sunglasses with white glints, a big white-toothed grin, a black outline throughout, one hand making a peace sign, and two drips running off the chin. No lettering, no real person |
| `graffiti_sun` | **Medium Lavender** | Yellow, Bright Light Orange, Black, White | **Motif: sunset with palms.** A big Yellow half-disc sun sitting on the horizon (40 % of the width), cut by three Bright Light Orange horizontal bars (the retro-sunset stripes). Two Black *Washingtonia* silhouettes: tall thin trunks and small fan crowns, matching our palm kind. A White wave line along the bottom and two White gulls (ticks) |

**Print budget** (usa.md §1.8 plans 11; adding two more graffiti designs and the tower numeral would make 14). Proposal, to stay at **12 designs / ≤ 40 pieces**:

| Group | Designs | Pieces |
| --- | --- | --- |
| Faces | 3 (surfer, skater, lifter; roller-skater reuses the skater's) | 4 |
| Torsos | 3 (wetsuit, tee shared by skater and roller-skater, tank top) | 4 |
| Graffiti | **3** | **3** |
| Walk of Fame star | 1 | 4 |
| "66" shield | 1 | 1 |
| Tower numeral | **1** | **1** |
| **Total** | **12** | **17** |

The trade is one face and one torso design. The alternative is two graffiti designs if Eric would rather keep four distinct faces.

### 2.6 Footprint, height, budget, risks
- **Footprint:** each wall 8 × 1; the group with gaps and the path ≈ 13 × 8.
- **Height:** +16.67, with a 1 × 1 × 5 post edge. This needs usa.md §1.5 changed from 6–8; the reason is in §0.
- **Budget:** 5 parts per wall × 3 = 15, plus a path of ≈ 8 tiles: **≈ 25 parts**.
- **Bake:** 3754.
- **Risks:**
  - The wildstyle must not accidentally spell a word. Check the render by eye.
  - Medium Azure / Lime / Medium Lavender bricks next to Light Bluish Gray concrete are the loudest colours in the set. They are acceptable because the real walls are louder. Check against the "never louder than Kyoto" rule in the hero render.
- **Open question:** two or three walls (the budget trade above).

---

## 3. Muscle Beach pen: 12 × 8 studs, gate ≈ 28 plates, ≈ 150 parts

### 3.1 Real proportions and signature
- A rectangular pen on a concrete pad, on the sand side of Ocean Front Walk. Black rubber matting.
- **Stainless post-and-mesh fence** ≈ 1.2 m on a chunky concrete plinth. The real plinth carries bronze dumbbell plaques; we cut them.
- Inside: steel racks and gantries, pull-up bars, benches with **blue pads**.
- The curved-roof "MUSCLE BEACH VENICE" pavilion is cut: it is a building with lettering.
- **Signature:** the **gate sculpture**. A concrete portal (two square piers, lintel), **two royal-blue boxes** riding high on it, and a **huge black weight-plate disc** on a slanted concrete arm. From the boardwalk it reads as "giant gym equipment".

### 3.2 Brick versions and conclusion
**No brick version of Muscle Beach exists** (Flickr, The Brothers Brick, Rebrickable and LEGO Ideas all searched; see NOTES §3). Equipment precedents:
- 41744 Sports Centre: rings hanging from a bar.
- 60372 Police Training Academy: an outdoor bar gantry on grey plates.
- CMF Weightlifter / Fitness Instructor: carry the 29592 dumbbell and a bar.

**Conclusion.** This is our own design from real moulds. What we take:
- the gantry construction from 60372 (posts with a bar in clips);
- the minifig dumbbell 29592;
- for the disc, the classic MOC wheel trick: **Brick 4 × 4 Round with Pinhole (87081)** turned on edge on a Technic pin, which gives a thick drum like the real disc rather than a thin plate.

The fence is **Fence 1 × 4 × 2 Ornamented with Square Lattice (32932)**: its square grid is the closest LEGO mould to the real wire mesh, and the mould has top studs (stug2-1x4).

### 3.3 Sketch
**Top view** (12 × 8): `P` = plinth; `f` = fence over the plinth; `G` = gate pier; `.` = black mat floor; `g` = pull-up gantry posts; `b` = bench; `L` = lifter.
```
   x 0         1
     012345678901
z0   PPPPGG..GGPP      north side = boardwalk; gate opening 2 studs between 2×2 piers
z1   fff.GG..GG.f      (fence runs over the plinth except at the piers)
z2   f..........f
z3   f.g..g.....f      pull-up gantry (posts 3 apart, bar between)
z4   f.......bbbf      bench (1×4) along the east fence
z5   f...LL.....f      lifter facing south (toward the camera), dumbbells overhead
z6   f..........f
z7   ffffffffffff
```
(Fence segments are 4 long: 3 on the south side, 2 on each short side, 1 on each side of the gate.)

**Front view** of the gate (looking south from the boardwalk; 1 char = 1 stud, 1 row = 3 plates):
```
 +28                 ▄▄▄
 +25               ▟█████▙         black disc: Brick 4×4 round 87081 on edge,
 +22               ██ ◉ ██           pinned (2780) to a Technic brick 1×2 (3700)
 +19     ▄▄▄▄     ▝▜███▛▘  ▄▄▄▄     at the top of the slanted arm
 +17     ████   ╱╱         ████     blue boxes: 2×2 bricks ×2 on a 2×3 plate,
 +15     ████ ╱╱           ████       1 stud proud of each pier
 +14   ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀    lintel: 1×8 brick + 2×8 plate
 +12     ██            ██           piers 2×2, opening 4 studs (incl. pier inset) × 14 plates
  …      ██            ██
  0      ██            ██
```
The arm is a 1 × 2 strut of three 1 × 4 bricks rising ≈ 35° from the east end of the lintel to centre. It is an **LDraw assembly** on a locking hinge brick (30389b) and is exploded into its bricks in the scene.

### 3.4 Scheme table
| Plates | Element | Part types (status) | Colour |
| --- | --- | --- | --- |
| 0 … +1 | Pad | Plates 2×8 / 6×8 (L) | Light Bluish Gray rim |
| +1 … +1.67 | Mat floor | Tiles 2×2 / 2×4 (L / bake) | Black, with a few Dark Bluish Gray |
| 0 … +3 | Plinth | Brick 1×4 / 1×6 3010 / 3009 (L) | Light Bluish Gray |
| +3 … +9 | Fence | **32932** Fence 1×4×2 square lattice (bake) → 3185 lattice (L) | Light Bluish Gray (Flat Silver availability unknown) |
| 0 … +14 | Gate piers | Brick 2×2 3003 ×4 + Plate 2×2 (L) | Light Bluish Gray |
| +14 … +17 | Lintel | Plate 2×8 3034 + Brick 1×8 3008 (L) | Light Bluish Gray |
| +17 … +24 | Blue boxes ×2 | Plate 2×3 (overhang) + Brick 2×2 ×2 + Tile 2×2 (L) | **Blue** |
| +17 … +23 | Slanted arm | Hinge Brick 2×2 locking **30389b** (bake) + Brick 1×4 ×3 + Technic Brick 1×2 3700 (L), as an assembly | Light Bluish Gray |
| ≈ +18 … +28 | Disc | Brick 4×4 round **87081** (L) on Technic Pin **2780** (bake), centre Tile 2×2 round 14769 (L) as the hub | Black, hub Light Bluish Gray |
| +1.67 … +14 | Pull-up gantry | Brick 1×1 round 3062b ×4 per post (L) + Plate 1×1 clip vertical 4085c (L) + Bar 4L 30374 (L) | Light Bluish Gray posts, Flat Silver bar |
| +1.67 … +4.33 | Bench | Brick 1×1 legs ×2 + Plate 1×4 + Tile 1×4 2431 (L) | Light Bluish Gray frame, **Blue** pad |
| +1.67 … ≈ +16 | Lifter | `minifig2`, both arms `u`, Dumbbell **29592** ×2 (bake), `gp` at the bar centre; tank-top torso print | — |

### 3.5 Footprint, height, budget, risks
- **Footprint 12 × 8.** The gate overhangs the north edge by 1.
- **Height:** fence +9, gantry +14, disc top ≈ +28. The disc is between the tower (23) and the palms (30–36) and becomes the Venice cluster's local landmark. Without the arm the disc would sit at ≈ +24.
- **Budget:**

  | Group | Pieces |
  | --- | --- |
  | Pad and mats | 30 |
  | Plinth | 12 |
  | Fence | 9 |
  | Gate | 30 |
  | Gantry | 12 |
  | Bench | 5 |
  | Lifter | 10 |
  | Spare for the gantry | ~40 |
  | **Total** | **≈ 150** |
- **Bake:** 32932, 30389b, 2780, 29592.
- **Risks:**
  - The disc on a 35° arm off a single locking hinge needs its centre of mass checked in the assembly. Fallback: the disc straight on a 1 × 2 × 2 upright at the lintel's centre (loses the real asymmetry).
  - The two-handed overhead press needs a `HOLD_DEFAULTS` entry per hand for 29592. That is one key held twice; check that `minifig2` accepts two holds of the same key.
  - Rings (41744 style): **cut.** No LDraw mould reads as gymnastic rings at this scale (11010 is a finger ring, 30340 a life ring).
  - The barbell on a rack: **cut.** Round tiles and wheels on a bar or axle slide without a stud joint, and an axle does not fit a clip.
- **Open question:** whether 32932 exists in Flat Silver. If not, use Light Bluish Gray, which still reads as steel.

---

## 4. LA County lifeguard tower: deck 6 × 6 + ramp, ≈ 15 × 6 footprint, ≈ 23 plates, ≈ 140 parts

### 4.1 Real proportions and signature
Sources: `real-tower-19.jpg` (measured on the lifeguard) and `real-tower-a.jpg`.
- A near-cubic cabin, ≈ 2.25 m tall × 2.1 m wide, on stilts ≈ 1 m. **Cabin ≈ 2.2 × stilt height.**
- The deck projects ≈ 0.6 m front and side. A wraparound plank rail.
- **Four squat stilts with X-bracing in both planes.**
- A **long ramp** at ≈ 22–30°, ≈ 2.5–3 × the stilt height long, with rails.
- A **flat roof with deep eaves** all round, deepest over the sea face. **Glass leaning outward** (raked).
- Baby blue (LEGO **Bright Light Blue**), with white trim.
- A black stencil numeral or name on the side ("BRKWTR" on the Breakwater tower). Two red-orange rescue cans hang from the eave; a foot-wash bucket stands at the ramp foot.
- **Signatures:** the raked windows under a deep flat eave, the long ramp, the stilts with X-braces, and the baby blue.

### 4.2 Brick versions and conclusion
| Version | What it does |
| --- | --- |
| 60328 Beach Lifeguard Station (official) | Cabin ≈ 6 studs, which confirms minifig scale. Ladder, not ramp; white/red; grey legs |
| 41028 Emma's Lifeguard Post (official) | Pastel hut: colour alone says "beach" |
| 41710 Surfer Beach Fun (official) | Four posts and a deck, the minimum readable tower |
| 31118 Surfer Beach House (official) | **A stair/ramp of stepped plates down from a raised deck**: our ramp technique |
| 60453 Lifeguard Truck (official) | The truck parked by the ramp (optional life detail; not taken) |
| LEGO Ideas "Iconic LA County Lifeguard Tower" | A whole AFOL project on this subject, with ramp and eaves as the LA tell |
| 6736 / 1815 / 4937 (older official) | Generic towers |

**Conclusion.**
- Copy the scale from 60328, the stepped ramp from 31118, and the colour logic from 41028.
- Do better than every official tower on the three things that make it *LA*:
  - **raked glass**: a 1 × 4 × 3 window on a friction hinge tilted ≈ 10° out;
  - **deep White eaves**: 2 studs over the sea face;
  - **a long ramp**: an 8-long plate on two locking hinges at 22.5°, instead of a ladder.
- The gpt-image reference (§7) still drew stairs and vertical glass, which is the generic version we must avoid.

### 4.3 Sketch
**Top view** (deck 6 × 6; the ramp runs east off the back corner). `D` = deck tile; `#` = cabin 4 × 4 (back flush with the deck's north edge); `r` = rail; `o` = stilt (deck corners); `R` = ramp; `j` = ramp foot plate on the sand; `b` = bucket; `L` = lifeguard.
```
   x 0         1
     012345678901234
z0   o####Do.......     cabin x1..4 z0..3; deck ring 1 stud on E/W, 2 on S (sea)
z1   r####DRRRRRRRRj    ramp: 2 wide (z0..1), hinged at the deck's east edge,
z2   r####Dr........      running 8 studs east, down 7 plates (22.5°)
z3   r####Dr.......b    bucket at the ramp foot
z4   rDLLDDr.......     lifeguard on the front deck, facing the sea (south)
z5   orrrrro........    front rail
```
**Front view** (from the south; 1 char = 1 stud, 1 row = 2 plates):
```
 +22.7 ▔▔▔▔▔▔▔▔        White roof slab 6×8, eave 2 studs over the sea face, 1 at the sides
 +21   ▀▀▀▀▀▀▀▀        ceiling plate 4×4 + White tile fascia
 +19    ╱████╲         front window 1×4×3 tilted 10° OUT on a 1×4 friction hinge (2429/2430);
 +15    ▕████▏           top edge 0.6 stud forward of the base
 +11    ▕▔▔▔▔▏         hinge line at +10…+11
 +9     █ ██ █         1×4 base course (Bright Light Blue)
 +7  r r r L r r       deck rail (posts + 2 bars) and lifeguard
 +6  ▀▀▀▀▀▀▀▀▀▀        deck plate 6×6 + tiles
 +3  ┃╳╳╳╳┃            stilts 1×1×3 ×2 at the corners; lattice brace 1×4×2 between
 0   ┃╳╳╳╳┃
```
On the east side wall, a Panel 1 × 4 × 3 carries the **big black numeral**, read from the camera.

### 4.4 Scheme table
| Plates | Element | Part types: first pick → fallback (status) | Colour |
| --- | --- | --- | --- |
| 0 … +6 | Four stilts at the deck corners | Brick 1×1×3 14716 ×2 each (L), on the sand plate's studs | Bright Light Blue |
| 0 … +6 | X-bracing on all four faces, between the posts (4-stud bays) | Fence Lattice 1×4×2 **3185** (L; bottom tubes only, so the deck rests on the posts) → upgrade: a true single X per face from Bar 6L 63965a in clips on locking hinge plates 30383 at ±31° (assembly) | Bright Light Blue |
| +6 … +7 | Deck | Plate 6×6 3958 (L) | Bright Light Blue |
| +7 … +7.67 | Deck finish on the ring | Tiles 1×2 / 1×4 / 1×6 (L) | Bright Light Blue |
| +7 … +11 | Deck rail (S, E, W; open where the ramp joins) | Brick 1×1 round 3062b (L) + Plate 1×1 clip vertical 4085c (L) + Bar 4L 30374 / Bar 6L 63965a; `railing()` with posts at both ends | Bright Light Blue posts, White bars |
| +7 … +10 | Cabin base course | Brick 1×4 / 1×2 (L) | Bright Light Blue |
| +10 … +11 | Front window hinge | Hinge Plate 1×4 base **2429** + top **2430** (bake; friction, any angle) | White |
| +11 … +20 | **Raked front window**, tilted 10° out | Window 1×4×3 frame **60594** (bake) + Glass 1×4×3 **60603 → 86210** (bake) | White frame, **Trans-Black** glass if the colour exists (unsure), else Trans-Clear over a Black back wall |
| +10 … +19 | West side: a vertical window | Window 1×2×3 60593 (L) + glass + 1×1×3 posts | White frame, Bright Light Blue |
| +10 … +19 | East side: **numeral panel** | Panel 1×4×3 **4215b** (bake), print `tower_numeral` | Bright Light Blue |
| +10 … +19 | Back wall (door side, unseen) | Brick 1×4 ×3 / Panel 1×4×3 | Bright Light Blue |
| +19 … +20 | Wall top | Plate 1×4 ring (L) | Bright Light Blue |
| +20 … +21 | Ceiling | Plate 4×4 3031 (L) | Bright Light Blue |
| +21 … +22 | **Roof slab**: deep eaves (2 studs S, 1 E/W/N) | Plate 6×8 3036 (L) | White |
| +22 … +22.67 | Roof finish and fascia | Tiles 2×4 / 1×6 6636 / 1×8 4162 (L / bake) | White |
| +7.67 → 0 | **Ramp**: 2 wide, 8 long, 22.5° | Plate 2×8 3034 (L) on Hinge Plate 1×2 Locking **30383** ×2 at the deck edge (bake) and ×2 on a Plate 2×2 jumper on the sand (assembly, exploded); treads Tile 1×2 grille 2412b alternating with Tile 1×2 | Bright Light Blue, grille treads Light Bluish Gray |
| ramp + 4 | Ramp rails ×2 | Brick 1×1 round + clip 4085c + Bar 6L 63965a, parallel to the ramp (clip axis along the plate, so no angle problem) | White |
| 0 … +2 | Foot-wash bucket | Bucket 1×1×1 cylindrical **12884** (bake) on a sand stud | White |
| +7.67 … +20 | Lifeguard (optional 5th figure) | `minifig2`, Binoculars **30162** (bake) raised, pose `h`; red trunks | — |

Prints: one design, `tower_numeral`, on the outer face of 4215b. Spec:
- ground Bright Light Blue (the part colour); print colour **Black** only;
- **one numeral, "2"**, as **black stencil paint**: a condensed bold sans with stencil bridges, ≈ 75 % of the panel height, centred;
- `px` 320 (the lettering rule); canvas ≈ 4 × 3.6 studs → ≈ 1250 × 1150;
- lettering culture recorded for usa.md: county towers carry stencil-painted numerals or short names in black.

### 4.5 Footprint, height, budget, risks
- **Footprint:** deck 6 × 6 + ramp 8 + foot plate → **15 × 6**.
- **Height:** roof top **+22.67**. This needs usa.md §1.5 changed from 16; the reason is cabin = 2.2 × stilts with a minifig-scale cabin.
- **Budget:**

  | Group | Pieces |
  | --- | --- |
  | Stilts and bracing | 12 |
  | Deck and tiles | 15 |
  | Rail | 25 |
  | Cabin | 30 |
  | Roof | 12 |
  | Ramp with rails and hinges | 25 |
  | Bucket, lifeguard and binoculars | 10 |
  | **Total** | **≈ 130–140** |
- **Bake:** 2429, 2430, 60594, 60603 / 86210, 4215b, 30383, 63965a, 12884, 30162.
- **Risks:**
  - **Raked glass leaves triangular slivers** where the tilted front pane passes the vertical side walls. The 2-stud eave hides the top. If it still reads as broken, put 1 × 1 × 3 White corner posts at the front corners: the real frames do that.
  - **The lattice bracing reads as a trellis**, not an X. The bar-X upgrade is an assembly with four hinges per face; decide on the round-1 close-up.
  - Trans colours render at 0.62 opacity. Glass over a Black back wall avoids the frost read (Shanghai pipeline trap).
- **Open problem:** the **red rescue cans**. LDraw has no rescue-can mould (no "torpedo" or "rescue" part). Stand-ins (a Red 1 × 1 round brick on a bar hanging from a clip) may read as a fire extinguisher or nothing. **Cut** unless a mould turns up; the bucket carries the "beach service" read instead.

---

## 5. Ocean Front Walk and bike path strip: 5 + 3 studs wide, ≈ 40 long, ≈ 230 parts (palms separate)

### 5.1 Real proportions and signature
- **Ocean Front Walk** is a wide paved promenade (concrete, not timber). At Windward its paving carries a **blue painted wave pattern**.
- A **row of tall fan palms in small sand pockets** along the sand side, at even spacing.
- Venice's **twin-saucer lamp standards** (a grey pole with two dish shades; `real-musclebeach.jpg`, left).
- **Green slatted benches** on concrete ends.
- The separate **bike path** (the Strand) runs seaward of the skatepark and Muscle Beach [M — check on a map before layout]. The shops on the land side are cut (rule 13).
- **Signature:** the palm row over a pale promenade, the blue wave line in the paving, and people moving along it.

### 5.2 Brick versions and conclusion
**No brick version of the boardwalk exists** (NOTES "Not found"). Transferable pieces:
- Shanghai's Bund promenade (our own): pale slabs with dark cross bands, a railing, slim lamps.
- 10232 Palace Cinema's sidewalk: a tile strip with inset prints.
- LEGOLAND Miniland San Diego: palms with 1-stud trunks in a row.

**Conclusion.**
- Tile the strip in Light Bluish Gray. Draw the **wave line** as a continuous one-stud Sand Blue line of **2 × 2 corner-round (macaroni) tiles 27925 and 1 × 1 corner-round tiles 25269**, which gives smooth arcs with no print.
- Put palms in 2 × 2 Tan sand pockets every 6 studs, a Venice twin-saucer lamp every 12, and two green benches.
- Keep a **Dark Bluish Gray bike path** with **no** dashed line: Shanghai's judge round showed a dashed white line reads as scattered bricks.

### 5.3 Sketch
**Top view** of a 24-stud slice (1 char = 1 stud; north = land, up). `.` = Light Bluish Gray walk tile; `~` = Sand Blue wave (macaroni tiles); `P` = palm pocket (2 × 2 Tan); `l` = Venice lamp; `B` = bench (1 × 4); `b` = bike path; `s` = sand.
```
   x 0         1         2
     012345678901234567890123
z0   ........................   walk (land edge)
z1   ..~~~.......~~~.......~~   wave line, period 12, amplitude 1
z2   .~...~.....~...~.....~..
z3   ~.....~~~~~.....~~~~~...
z4   PP..l.PP....BBBBPP..l.PP   sand-side edge: palm pockets every 6, lamps every 12, a bench
z5   PP....PP..........PP....
z6   bbbbbbbbbbbbbbbbbbbbbbbb   bike path (3 wide)
z7   bbbbbbbbbbbbbbbbbbbbbbbb
z8   bbbbbbbbbbbbbbbbbbbbbbbb
z9   ssssssssssssssssssssssss   beach
```
**Venice lamp** (side view, 1 row = 2 plates):
```
 +20  ◡◡◡   Dish 2×2 inverted 4740 (shade) on a 1×1 round brick
 +18   │
 +14  ◡◡◡   second shade lower (the twin-saucer read)
  …    │    Brick 1×1 round 3062b stack, Light Bluish Gray
  0   ▄█▄   Plate 2×2 round 4032a base
```

### 5.4 Scheme table
| Plates | Element | Part types (status) | Colour |
| --- | --- | --- | --- |
| −1 … 0 | Walk | Tiles 2×4 87079 (bake) / 2×2 3068b / 1×2 (L) | Light Bluish Gray |
| −1 … 0 | Wave line | Tile 2×2 corner round 27925 + Tile 1×1 corner round 25269 + Tile 1×2 (L) | **Sand Blue** |
| −1 … 0 | Bike path | Tiles 2×4 / 2×2 (L / bake) | Dark Bluish Gray |
| −1 … 0 | Palm pockets | Plate 2×2 (studs for the trunk) | Tan |
| 0 … +20 | Venice lamps ×3 | Plate 2×2 round 4032a + Brick 1×1 round ×6 + Dish 2×2 inverted 4740 ×2 + Cone 1×1 4589 finial (L) | Light Bluish Gray, shades White |
| 0 … +4 | Benches ×2 | Brick 1×1 ends (Light Bluish Gray) + Plate 1×4 + Tile 1×4 + Tile 1×4 back on a bracket 99780 (L) | **Dark Green** slats |
| 0 … +30–36 | Palm row ×6–7 | The new `palm` kind (usa.md §1.3, a separate scheme); 2 studs of air round each pocket per `Sites` | Dark Tan trunk, Olive Green + Green fronds, Dark Tan skirt |
| 0 … ≈ +13 | Roller-skater (4th figure) | `minifig2` + Roller Skate **11253** ×2 (bake). **See risk** | — |

### 5.5 Footprint, height, budget, risks
- **Footprint:** 8 studs wide (walk 5 + bike path 3) × ≈ 40 long. That is ≈ 320 cells, mostly tiles that replace the sand surface anyway, so they add little net.
- **Height:** lamps +20; palms 30–36.
- **Budget:**

  | Group | Pieces |
  | --- | --- |
  | Walk tiles | 110 |
  | Wave tiles | 30 |
  | Bike path | 50 |
  | Lamps | 3 × 11 |
  | Benches | 2 × 6 |
  | **Total (palms not counted)** | **≈ 230** |
- **Bake:** 87079, 11253.
- **Risks:**
  - **Diagonal coast.** usa.md §1.4 draws the coast as a south-west arc. A strip laid diagonally on the grid comes out jagged. **Recommendation:** run the walk and bike path straight along grid x through the middle band and let the beach widen toward the bay corner. Decide this in the island layout sketch.
  - **Roller-skater physics.** 11253's stud plugs into the foot from below and the skate's wheels hang below it, so the figure stands on wheels, not studs. Possible fix: the same hidden-riser trick as the skateboard does not work, because the skate has no underside tube. **Fallback:** a **cyclist on the bike path** using the existing `bike` assembly (Shanghai), which already passes the gate. Or a busker standing on the walk.

---

## 6. Totals for the Venice beachfront
| Element | Footprint | Top (plates) | Parts | New bakes |
| --- | --- | --- | --- | --- |
| Skate bowl + skater | 19 × 12 | −5 floor / +9.5 skater | ≈ 290 | 3046, 85984, 87079, 63965a, 42511, 2496, 46303 |
| Art walls ×3 | 13 × 8 | +16.67 | ≈ 25 | 3754 |
| Muscle Beach | 12 × 8 | +28 (disc) | ≈ 150 | 32932, 30389b, 2780, 29592 |
| Lifeguard tower | 15 × 6 | +22.67 | ≈ 140 | 2429, 2430, 60594, 86210, 4215b, 30383, 12884, 30162 |
| Walk + bike path | 8 × 40 | +20 (lamps) | ≈ 230 | 11253 |
| **Total** | | | **≈ 835** + palms | 21 moulds |

- Height table changes for usa.md §1.5: tower 16 → **23**; art walls 6–8 → **17**; Muscle Beach "gantry 10" → **gantry 14, gate disc 28**; bowl −6 → **−5**.
- The tiers still hold: wheel 66 > palms 30–36 > gate 28 > tower 23 > walls 17 > figures 12.5.
- Specialty share of this district (slopes, fences, hinges, windows, minifig accessories) ≈ 30 %, well above the 8 % floor.

## 7. Reference image
`docs/refs/la-venice-lego.png` (gpt-image-2, 1536 × 1024).
- **Right:** a sunk kidney bowl with a coping ring and a rider on the flat; three walls in exactly the three print styles (wildstyle, sunglasses character, lavender sunset with palms) staggered on the sand; the gate composition (blue boxes, a black disc on a slanted arm) reads as giant gym gear; the tower's side ramp in profile with a big "2"; a grey walk with a Sand Blue wave and a palm row.
- **Wrong vs this scheme:**
  - The bowl walls are one smooth moulded curve, which cannot be built here (§0.1).
  - The ramp is drawn as stairs, and the cabin glass is vertical, not raked.
  - The bowl is far too big for the island, and the wildstyle reads as letters ("DEM"), which we must avoid.
  - The palms are chunky with fat crowns, and the bike path has a dashed line.
  - The walls stand straight on a plain baseplate with no concrete edge posts.
