# Gwanghwamun: landmark analysis and build scheme (for Eric's sign-off; no brick placed)

2026-10-06 · research only, nothing built · format follows `docs/refs/la-santa-monica/SCHEME.md`
Sources: `NOTES.md` (this folder), `docs/refs/seoul-real/NOTES.md`, `docs/countries/korea.md` §1 (approved). Reference image `../seoul-palace-lego.png` (gpt-image-2, see §9).

## Units and levels used on this page
- Heights are in plates **above the island surface G** (the scene has base 3 and surface top G = 10, as Shanghai and LA). A minifig is ≈ 12.5 plates tall; with hair it is ≈ 13.5.
- ASCII: 1 char = 1 stud. North is up in top views, and the default camera looks from the south.
- **Element-local grid:** x runs west → east and z runs north → south, as on the island. The granite base covers x 0..25, z 0..11, so its **south face (front) is the row z = 11**. The gate axis lies between x 12 and x 13. Island position is decided at the island stage.
- Part status: **L** = baked (`src/parts/ldraw/index.ts`) with a catalogue key; **L·cat** = baked but needs a catalogue entry; **P** = procedural catalogue brick or plate; **bake** = must be baked. Every number was checked against `vendor/ldraw-lib/ldraw/parts/<n>.dat` (geometry rasterised with `tools/ldraw/bbox.mjs`, `studs.mjs` and a silhouette script). Colours were checked against BrickLink "Known Colors" pages fetched 2026-10-06 **[BL]**; **[M]** means from memory.

## 0. Decisions for Eric (top of page)
1. **Eave sweep technique (the make-or-break): A, stepped rib lifts with curved step pieces (recommended), or B, hinged eave segments.**
   - A: every rib + channel pair along the eave is raised by whole plates toward the corners: 0 across the middle ≈ 40 %, then +1 / +2 / +3, and +5 at the upper corners. Each 1-plate step is made by a **2×1 inverted curved slope (24201)**, whose top steps exactly one plate and whose underside curves (§3.3). The eave reads as a row of round rib ends and white rafter dots climbing into the corners, with a curved soffit under every step. Everything stays on the stud grid, so the validator and `check-asm-studs` can check every joint.
   - B: hinges (2429/2430) tilt the outer thirds up. This gives a straight kink (a flick, Kyoto's look), the faces fight at the hips, and the joints sit off the grid.
2. **Arch sizes.** The arch moulds in NOTES (6060, 2339) turn out to be **one-legged half arches** (§1). Recommended: centre **6 wide** (Arch 1×8×2, clear 14.5 plates, so a minifig walks through) and sides **4 wide** (Arch 1×6×2, clear 13). That makes the centre 1.5 × the sides (real 1.24): a slight exaggeration of the hero opening. The alternative is three equal 4-wide arches with the centre on taller piers, which is closer to the real ratio but reads flatter.
3. **Plaque mount.** The real board tilts forward. At our camera height (looking down 20–30°), a tilted board under a 3-stud eave disappears. Recommended: **vertical, studs-out**, set one course lower than on the real gate (top at G + 32), with the rafter dots left out in front of it. **Keep all three characters 光化門** (the default already taken in korea.md); cut the board if it fails the thumbnail test.

## 1. Corrections to NOTES.md / korea.md found in this pass
1. **6060 and 2339 are not round arches; they are half arches with one leg.** In the LDraw geometry, 6060 has a single 1-stud leg at z −100..−80, curves up, and ends in a flat 2-stud top with both studs (z ±10) over nothing. 2339 has its studs at five heights (y 48 / 24 / 0 / 8 / 8) and one leg at z −10..10 ("continuous bow"). 80543, 3572, 5850, 6005 and 14395 are the same type. So the "centre 6060, 4-wide; sides 2339, 3-wide" plan does not work. The symmetric round arches in the library are 3659 / 6182 (2-wide opening), **3307 / 15254 / 6183 (4-wide)**, **3308a / 16577 (6-wide)** and 6184 (10-wide). None has a 3-wide opening.
2. **61409b's grille grooves run *across* the slope.** Its groove primitives are `rect` × 6 in x, stacked along z, so on a roof it shows horizontal courses, not sugiwa ribs running down. The ribs come from columns instead (§3.2).
3. **15070 (Plate 1×1 with Tooth) is not made in Dark Bluish Gray** [BL: known colours include Black, LBG, White, Pearl Gold; no DBG]. Japsang and ridge-end beaks use **Black** 15070; the haechi uses **LBG**.
4. **42023 (6×1 inverted curve) has a flat top** (studs level, y 0) and a single 3-plate rise underneath. It cannot follow a stepped sag. **24201** can: its two studs sit at y 0 and y 8, so its top is a one-plate step, and its underside curves from 2 plates down to ≈ 0.4. It is the part that turns each plate step into a curve (§3.3).
5. **Pavilion plan.** The hipped roofs need their faces at 45°. A 4-stud ring between the lower eave (28 × 14) and the upper-storey wall, plus a 3-stud upper overhang, fixes the storeys at **lower 20 × 8, upper 20 × 6** (NOTES had 18 × 8). The upper storey stays at 0.77 × the base width (real 0.69).
6. **4190** is listed on BrickLink as "Arch 2 x 2 Inverted Corner with Recessed Stud". It is the same element as LDraw's "Plate 2×2 with Slope Inverted Corner": one stud on the inner cell, with the outer corner sweeping up 1.25 plates above the plate top (bbox y −10..8). DBG exists [BL].
7. **3308 (Arch 1×8×2) went out of production in 2015** [BL]. It exists in LBG, but only on the secondary market. 16577 (1×8×2 raised) is the in-production fallback.
8. **Minifig clearance.** The centre opening needs ≥ 14 plates (13.5 for a minifig with hair). NOTES' "≈ 14 plates" was written against the 6060, whose opening does not exist. The figures here use the real moulds.

## 2. Real proportions and signature (NOTES §0.1, re-measured on `real-gwanghwamun-piotrus.jpg`, ground 820 px, ridge ornaments 190 px = 47 plates)
| Band | px | plates (scaled) | ours |
| --- | --- | --- | --- |
| Granite wall + parapet | 280 | 20 | 0–17 + 17–20 |
| Lower storey band + brackets | 70 | 5 | 17–24 |
| Lower roof | 65 | 4.6 | 24–29 |
| Upper storey + brackets + plaque | 70 | 5 | 29–35 |
| Upper roof to ridge top | 120 | 8.6 | 35–45 |
| Ridge-end ornaments | 25 | 1.8 | 45–47 |

**Signature, in order of how people recognise it:**
1. The wide pale granite base with **three round-topped arches**, the centre one bigger.
2. **Two grey hipped roofs whose eaves sag and sweep up into the corners**, with **white mortar on the ridge and every hip** and dark figurines on the hips.
3. The **green dancheong band** with a row of light rafter ends under each eave, and **red** frames.
4. The **black-and-gold plaque** 光化門, read right to left (it shows 門 化 光 from left to right).
5. The dark parapet band with framed panels.
6. Two seated haechi, and the palace wall running off each side.

**Not Kyoto** (`docs/countries/japan.md`): Kyoto's eaves were `spanPlates` one stud out, straight, with a curved-slope flick at the tips; it had dark ridges, Bright Red posts, white plaster and a vermilion palette. Ours has a sag across the whole eave, White ridges and hips, Sand Green bands, Dark Red frames, rafter dots and a granite base. Rule: the corner flick part (4190) never appears without the white hip end and the sag beside it.

## 3. Brick versions → what we copy
| Version | What it does for the signature | Take |
| --- | --- | --- |
| **21016 Sungnyemun** (official, micro) | grey ashlar + dark layered roofs + white ridge dots + green/red band; straight eaves; corners = clip plates | colour layering and band order |
| **Seon-Bi Won** (Ideas 2025, minifig) | the only sagging, swept Korean eave: **separate tile ribs, each set a little higher toward the corner**, white rafter dots under the ribs, green bracket band, round rib ends | **the eave technique: rib-by-rib lift, dots per rib** (§3.2) |
| ABSAddict Namdaemun | one-plate stepped sag (reads stair-stepped up close), white round plates on hips, plaque on clip | sag by plate steps, but on separate ribs and with curved step undersides; two-grey ashlar |
| jjukjang Geunjeongjeon (32k) | Sand Green dancheong ground, grille-tile lattice, inverted curves for the sweep; straight eaves | Sand Green ground, SNOT grille lattice |
| LEGOLAND Korea Miniland | paired round-brick columns, balustrade posts | (hall only) |

**Conclusion:** copy Seon-Bi Won's proven idea. The eave is not a solid edge but a **row of separate ribs**, so a one-plate step between neighbouring ribs reads as a curve of beads, not as a staircase (ABSAddict's solid stepped edge is what looked stepped). We add what Seon-Bi Won's hinged planes do not give us on a grid: a **curved underside at every step** (24201) and a **white hip** coming down into each corner.

### 3.1 Eave cross-section (mid-span, south face of the upper roof; the lower roof is the same with E = 24)
```
 plates   z: 7   8   9   10  11        (south = right; upper-storey wall face at z 8)
 42                 cheese
 40           [11477 c2 ]              rib columns sit 1 plate higher (on a plate)
 38                   [11477 c1 ]      c1 lip = the eave edge, z 11
 36  ======== P plate (Sand Green, 2×6 along z, anchored over the storey) ========
 35  bracket |         |  ○  |         ○ = rafter dot: White round tile 1×1 on a Sand Green
 33  band    |         | 87087 |         brick 1×1 with stud on side, hung from P's underside (z 10)
 32  (wall)  |   plaque on z 8 face (centre bay only; no dots in front of it)
```
E (upper) = 35 = P bottom. The eave edge is P (1 plate) + c1 lip; the dots hang one stud behind the edge, as real rafter ends do. The bracket band sits back on the wall line, so the dots add no height.

### 3.2 Tile field: ribs and channels
- **Courses** run eave → ridge, each a **Slope Curved 2×1 (11477, L `curve_1x2`)** facing down the slope: 2 studs deep, 2 plates tall, convex top, no studs. They are stepped like giwa courses. Pitch is 22° per course, the Korean shallow eave.
- **Ribs:** alternate columns (1 stud wide) carry their 11477 on an extra plate, so they stand **1 plate proud** of the channel columns. That gives vertical ribs with scalloped course joints. Ribs are mirror-symmetric about the axis. The upper roof has a double channel at the centre (x 12, 13); the lower roof has a double rib at the centre. Both put a rib at each hip end.
- The **last course** before the ridge (or the wall) is **Cheese Slope 1×1 (54200, L `cheese_1x1`)**, 1 stud and 2 plates, since a 2-deep 11477 does not fit.
- DBG for all tiles [BL: 11477 DBG yes; 54200 DBG [M] – universal].

### 3.3 The sweep: lift table and step pieces
The eave is cut into **pairs (rib inside, channel outside)**, counted from the corner. Each pair is raised by L plates. Steps fall between a channel (L) and the next rib outward (L + 1), so every rib still stands at least 1 plate above both neighbours.

| Pair from corner | Upper roof (eave 26 × 12) columns | L (plates) | Lower roof (eave 28 × 14) columns | L |
| --- | --- | --- | --- | --- |
| 0 (corner block) | x 0–1 / 24–25 · z 0–1 / 10–11 | **5** | x −1–0 / 25–26 · z −1–0 / 11–12 | **3** |
| 1 | x 2–3 · z 2–3 | 3 | x 1–2 · z 1–2 | 2 |
| 2 | x 4–5 · z 4–5 | 2 | x 3–4 · z 3–4 | 1 |
| 3 | x 6–7 (long faces only) | 1 | x 5–20, z 5–6 | 0 |
| ≥ 4 | x 8–17 (flat middle, 10 of 26 = 38 %) | 0 | (flat middle 16 of 28 = 57 %) | |

- Rise at the corner block: **upper 5 plates over 13 studs ≈ 15 %** (real 13 %); **lower 3 over 14 ≈ 9 %** (real 7 %). The corner block's 4190 tip adds another 1.25 plates.
- The **short (east/west) faces** use the same pairs counted from both corners: upper 5 / 3 / 2 | 2 / 3 / 5. Their whole eave is a sag with no flat part, as on the real short sides. Hip blocks are shared by both faces, so the four corners agree.
- **Step piece:** at every step, the front row of the P layer (z 11) under the two columns that straddle the step is one **Slope Curved 2×1 Inverted (24201, L `nd_curve_inv_2x1`)**. Its low stud is under the channel (top = E + 1 + L) and its high stud under the next rib (top = E + 2 + L). Its underside drops 2 plates under the high stud and curves up to ≈ 0.4 plate at the far end. The soffit therefore reads *flat → curve up 1.6 → drop 0.6 → flat → curve up …*: a rising, wavy line instead of plate stairs. The 24201 is also the joint that **ties the two P levels together** (stud-in-tube at both heights). DBG/Sand Green both exist [BL: 24201 has 35 colours incl. Sand Green, DBG].
- **Per long face**, each half has 3 step pieces on the upper roof and 2 on the lower; the 2-plate jump into the corner block is part of the corner assembly (§3.4).

### 3.4 Corner block and hips (one LDraw assembly per roof, placed four times mirrored by a `hipCorners`-style helper, rule 7)
Top view of the SW upper corner (x 0–7, z 4–11; numbers are L; H = White hip block; K = corner tip):
```
 z\x  0 1 2 3 4 5 6 7
  4   . . . . H H 2 1       ridge core starts at x 6 (z 5–6)
  5   . . . . H H . .
  6   2 2 . . H H 2 1       H at (4–5, 6–7) = hip block j2, L 2
  7   2 2 . . H H 2 1
  8   3 3 H H 3 3 2 1       H at (2–3, 8–9) = hip block j1, L 3
  9   3 3 H H 3 3 2 1
 10   K K 3 3 2 2 1 1       K = corner block (0–1, 10–11), L 5
 11   K K 3 3 2 2 1 1   ← eave row (south)
```
| Plates (upper SW corner) | Piece | Connection |
| --- | --- | --- |
| P at 40–41 | corner plate 4×4 (x 0–3, z 8–11), L5 | sits on the W-face P plates of pairs z 8–9 (L3) and z 10–11, which cantilever along x from over the storey (x 3–5) |
| 41–43 | corner course (DBG plates 2×2 ×2) | stud-in-tube |
| 43–44 | **4190 Plate 2×2 with Slope Inverted Corner** (DBG, **bake**), upturn pointing SW; tip to 45.25 | on the course, studs into its tubes |
| 44–45 | White Round Plate 1×1 (6141) on 4190's single stud: the hip end | stud |
| 45–46 | **Black 15070** Plate 1×1 with Tooth, tooth pointing out along the hip: the 토수 / dragon-head end | stud |
| hip j1 (43–44) | White Plate 2×2 Corner (2420, L `plate_corner_2x2`, [BL White yes]) on a DBG 2-plate stack; **2 × Black 15070** japsang on it | studs |
| hip j2 (44–45) | White 2420 + **1 × Black 15070** japsang; top meets the ridge cap (45) | studs |
The hip line runs ridge 45 → j2 45 → j1 44 → corner 45–46. It sags slightly and kicks up at the tip, as the real 추녀 does. **3 japsang per upper hip; 1 per lower hip** (on lower j1).

The lower corner block is the same with L3: P 27–28, course 28–30, 4190 at 30–31 (tip 32.25), White 6141 31–32, Black 15070 32–33. It has one hip block j1 (x 1–2, z 9–10, top 32) with one japsang.

### 3.5 Ridge
Upper ridge core x 6–19, z 5–6 (14 long = 0.54 W; real 0.51), DBG bricks to 42. Then **White yangseong**: 2 × N plates ×2 (42–44, L/P) and a DBG 2 × N tile cap (44–45). **취두** at both ridge ends (x 6 and x 19): DBG Plate 1×2 (45–46) + 2 × Black 15070 beaks facing outward (46–47). **Top = G + 47.**

The lower roof's top row against the upper-storey wall (z 9 on the south; x 2 / 23 on the sides) is a **White strip** (DBG support + White plate on top, 28–29): the white mortar line where the lower roof meets the wall (`seoul-real/gwanghwamun-plaque-roof.jpg`).

## 4. Stud-grid sketches

### 4.1 Front elevation (south face, 1 char = 1 stud across; rows ≈ 2 plates; corners show the sweep)
```
 47        ▀                                     ▀              취두 (DBG plate + Black tooth plates)
 45 K       ███████████ white ridge ███████████       K        K = upper corner tip (4190 + white + tooth)
 43  K\   ^^ j1/j2 white hips + japsang     ^^   /K
 41  ▔▔\_▄▄▄▄▄▄▄▄ tile ribs (11477) ▄▄▄▄▄▄▄▄_/▔▔         eave row: flat x 8–17, +1/+2/+3 then +5 at corners
 36  ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○       ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○    rafter dots (none in front of the plaque)
 33  ▓▓▓▓▓▓▓▓▓ bracket band ▓▓[門 化 光]▓▓▓▓▓▓▓▓▓▓▓    plaque 1×4 tile on x 11–14, 29–32
 29  |  ▒▒▒▒  |  ▒▒▒▒▒  |  ▒▒▒▒  |  ← Dark Red posts x 3,9,16,22; Sand Green lattice; White strip below
 28 K\___ lower ribs (flat x 5–20) ___/K            lower corners +3 (tip 32)
 24  ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○
 20 ██▢██▢██▢██▢██▢██▢██▢██  parapet (DBG, 7 White panels: grille / plain alternating)
 17 ░░░░░░░░░░░░░░░░░░░░░░░░░░  masonry above the crowns
 15 ░░░▄▀▀▀▀▄░░░▄▀▀▀▀▀▀▄░░░▄▀▀▀▀▄░░░   3307 (4-wide) · 3308a (6-wide) · 3307
 10 ░░░|    |░░░|      |░░░|    |░░░   centre clear 14.5, sides 13
  0 ░░░|    |░░░|  ☺   |░░░|    |░░░   x: pier 0–2 · arch 3–6 · pier 7–9 · arch 10–15 · pier 16–18 · arch 19–22 · pier 23–25
```

### 4.2 Plan (G level, whole element; 1 char = 1 stud; north up)
```
 x:   -4   0         10        20      26  29
 z -1      ┌·························┐            · = lower eave outline 28 × 14 (x −1..26, z −1..12)
   0   ....│##########################│....       ## granite base 26 × 12 (hollow shell, three tunnels N–S)
   4   ====│##[ tunnel ]#[ tunnel ]#[  ]│====      == palace-wall stubs 4 × 2 at z 5–6 (coping 4 wide, z 4–7)
   6   ====│###|    |###|      |###|  |#│====
  11       │###|    |###|      |###|  |#│         tunnels: x 3–6, 10–15, 19–22 (open N to S)
  12       └·························┘
  14     [hh]                          [hh]       haechi plinths 2 × 4 at x 0–1 / 24–25, z 14–17
  17     [hh]                          [hh]
```
Footprint: core **28 × 19** (lower eave + haechi). With wall stubs and their coping, **34 × 19** (approved: ≈ 30 × 18; the stubs add 6 in x, see §7 risk 5).

## 5. Scheme table (plates above G, bottom → top)
| Plates | Element | Part types (LDraw no., status) | Colour | Connections |
| --- | --- | --- | --- | --- |
| 0–17 | **Granite base** 26 × 12, hollow shell 1 stud thick. Front/back/ends in ashlar coursing; pier walls line the tunnels | Brick 1×2 / 1×4 with Embossed Bricks **98283 / 15533 (L)**, plain 1×2 / 1×4 / 1×6 bricks (P) | LBG, ≈ 15 % White plain bricks for granite variation | running bond; every course stud-in-tube |
| 0 | tunnel floors | Tile 2×N (P) | White | on the island ground studs |
| 0–10 / 0–9 | piers: centre arch legs on 10-plate piers, sides on 9 | bricks (P) + 1 plate | LBG | — |
| 10–16 | **centre vault**: 12 × **Arch 1×8×2 (3308a, L `arch_1x8x2`)** back to back along z (x 9–16), opening 6 wide | 3308a ×12 | LBG [BL yes; out of production 2015 → 16577] | legs on pier studs; masonry above on its 8 top studs |
| 9–15 | **side vaults**: 12 × **Arch 1×6×2 (3307, L `arch_1x6x2_thick`)** each, opening 4 (x 2–7, 18–23) | 3307 ×24 | LBG [BL yes] | as above |
| 0–12 | **doors folded back** against the tunnel walls (leaf 1 thick: 3 long in the centre, 2 at the sides), nail-studs facing into the tunnel | Brick 1×2 with Studs on 1 Side **11211 (L·cat)** ×4 high; + 87087 for the 3-long centre leaves | Dark Red [BL yes] | on floor studs, against the pier wall; studs as door nails |
| 16–17 | masonry + deck plates over the vaults; deck tiles inside the parapet | plates 2×N, Tile 2×N (P) | LBG / White tiles | plates bridge the vault tops |
| 17–20 | **parapet (여장)** 1 stud thick on the base edge: 7 panels on the south face (2 wide, gaps 1, margins 3, centred on the axis), 2 per end face, plain back | DBG bricks; panels = Tile 1×2 Grille **2412b (L `grilletile_1x2`)** and Tile 1×2 (P) on **11211** studs-out; DBG tile cap | DBG; panels White (grille / plain alternating) [BL 2412b White yes] | SNOT tile on side studs (2.5-plate tile on a 3-plate course = a DBG frame) |
| 17–21 | **lower storey** 20 × 8 (x 3–22, z 2–9): 12 posts at x 3 / 9 / 16 / 22 (bays 5 / 6 / 5, centre bay over the centre arch) + side posts | Brick 1×1 Round **3062b (L `round_1x1`)** + Round Plate 1×1 (6141) | Dark Red [M → fallback Reddish Brown] | stacked on deck studs |
| 17–21 | infill between posts | bricks + plates (P) | Sand Green | studs |
| 21–24 | **lower bracket band** on the storey wall line | Sand Green bricks; every bay a Red and a Dark Blue Round Tile 1×1 (98138) on 87087 | Sand Green, Red / Dark Blue dots | SNOT round tiles on side studs |
| 21–24 | **lower rafter dots**, 1 stud behind the eave edge, one per rib (≈ 42) | Brick 1×1 with Stud on Side **87087 (L `brick_snot_1x1`)** hung from P + Round Tile 1×1 **98138 (L)** | Sand Green [BL yes] + **White** | 87087's top stud in P's tube; tile on the side stud |
| 24–25 (+L) | **lower P** (soffit / eave plate), 2 × 6 along the overhang, anchored over the lower storey top; steps by **24201** | plates (P), **24201 (L)** | Sand Green | stud-in-tube; 24201 ties neighbouring levels |
| 25–29 (+L) | **lower roof ring** (4 deep): c1 11477, c2 54200, White strip at the wall; ribs +1 plate | **11477, 54200 (L)**, plates | DBG; strip White | stacked; nothing rests unjoined (each slope sits on studs) |
| corners | **lower corner kit** ×4 (§3.4, L3) | plates, **4190 (bake)**, 6141, **15070 (L·cat)** | DBG / White / Black | studs |
| 29–32 | **upper storey** 20 × 6 (x 3–22, z 3–8): posts at x 3 / 9 / 16 / 22; lattice panels studs-out | 3062b posts; Tile 1×2 Grille 2412b on 11211 | Dark Red posts, **Sand Green** lattice [BL 2412b Sand Green yes] | SNOT on side studs |
| 29–32 | **plaque** 1×4 on x 11–14, south face | printed Tile 1×4 (2431, P) on 2 × **11211** in the wall course | Black ground, Pearl Gold letters (print) | tile on 4 side studs; vertical |
| 32–35 | **upper bracket band** + **upper rafter dots** (z 10, ≈ 36; none at x 11–14) | as the lower band | Sand Green / White / Red / Dark Blue | as above |
| 35–36 (+L) | **upper P** + 24201 steps | plates (P), 24201 | Sand Green | as lower |
| 36–42 (+L) | **upper roof**: c1 11477 (z 10–11), c2 11477 (z 8–9) on 2-plate supports, c3 54200 (z 7), ribs +1; mirror on the north | 11477, 54200, plates | DBG | studs |
| corners | **upper corner kit** ×4 (§3.4, L5) incl. hips j1 / j2 | plates, 4190, 2420, 6141, 15070 | DBG / White / Black | studs |
| 36–42 | **ridge core** x 6–19, z 5–6 | Brick 2×N (P) | DBG | studs |
| 42–45 | **yangseong** + cap | Plate 2×N ×2 (P), Tile 2×N (P) | **White** ×2, DBG cap | studs |
| 45–47 | **취두** ×2 | Plate 1×2 (P) + 2 × 15070 | DBG + Black | studs |

**Every connection is a stud joint.** There are no leaning members. The only cantilevers are P plates (3 studs out from a ≥ 3-stud anchor) and hung 87087 bricks (one stud each). The corner quadrants are carried by the short faces' P plates running along x. The deepest overhang is 3 studs; check it by eye in the close-up (rule 2, "nothing just lies on anything").

## 6. Haechi, palace-wall stub
### 6.1 Haechi ×2 (mirror pair, facing south; `real-gwanghwamun-haetae-2026.jpg`)
Seated lion-dog: big grinning head, curly mane, haunches low behind, forelegs straight, on a two-step plinth. Real ≈ 3 m with the plinth. Here it is **12 plates**, between figure scale and gate scale, so it reads as a statue next to a minifig.
| Plates | Piece | Colour | Connection |
| --- | --- | --- | --- |
| 0–3, 3–4 | plinth: Brick 2×4 + Plate 2×4 (P) | LBG | island studs |
| 4–7 | forelegs: 2 × 3062b (front row); haunches: Brick 2×2 (back 2 rows) | LBG | studs |
| 7–9 | back: Slope Curved 2×2 (15068, L `curve_2x2`) facing north | LBG [BL yes] | on the haunch block |
| 7–10 | head: 11211 on the forelegs, studs south, carrying **2412b grille tile = the grin with teeth** | LBG | tile on side studs |
| 10–12 | mane / ears: Plate 1×2 + 2 × 15070 tooth plates curling up | LBG [BL 15070 LBG yes] | studs |
≈ 11 parts each. Brick-built, L1 only. **Fallback:** if it does not read as a seated beast in two render rounds, cut it (rule 6).

### 6.2 Palace-wall stub (궁장), shared with the hanok element as `copingWall(len, H)`
- Wall 2 thick × 4 long each side (x −4..−1 and 26..29, z 5–6), **0–9**: 98283 / 15533 LBG ashlar in two greys (LBG + a few White).
- **Coping** (rule 3: real moulds, stud joints):
  - 9–10: DBG Plate 4×4 overhanging 1 each side (z 4–7).
  - 10–12: the outer rows are DBG **54200** cheese slopes facing outward, a tile course with its eave line. The middle 2 rows are DBG Plate 2×4 ×2.
  - 12–13: **White** Plate 2×4: the white mortar line, the same signal as the gate.
  - 13–14: DBG Tile 2×4 cap. The open west/east end gets 2 × 54200 facing out.
- **Top 14**, below the gate base (17), as on the real wall. ≈ 30 parts per stub.
- **Reuse for the hanok:** the coping is identical. The body below swaps to granite lower courses + the kkotdam print band. That way the palace wall and Bukchon's walls read as one city.

## 7. Footprint, height, parts, bake list, risks
| Block | Parts (est.) |
| --- | --- |
| granite base shell + 36 vault arches + doors + deck | ≈ 380 |
| parapet | ≈ 70 |
| lower storey + bracket band + rafter dots | ≈ 150 |
| lower eave + roof ring + 4 corner kits | ≈ 360 |
| upper storey + bracket band + dots + plaque | ≈ 140 |
| upper eave + roof + 4 corner kits + ridge + 취두 | ≈ 500 |
| haechi ×2 | ≈ 25 |
| wall stubs ×2 | ≈ 60 |
| **Total** | **≈ 1,690 (≈ 1,850 with 10 % build contingency)**; specialty moulds ≈ 30 % |

- **Footprint** 28 × 19 core, 34 × 19 with the wall stubs. **Height G + 47** (취두), corner tips 45 (upper) / 32 (lower). Below the Bugaksan rim (≈ 50) ✓.
- **Bake / catalogue:** **bake `4190`** (DBG corner tip). **Catalogue entries for baked moulds:** `11211` (doors, parapet, lattice, plaque, haechi head), `15070` (japsang, 취두, haechi mane), and `16577` only if 3308a is swapped. Everything else is L or P: 3307, 3308a, 24201, 11477, 54200, 87087, 98138, 2412b, 3062b, 6141, 2420, 15068, 98283, 15533.
- **Print:** plaque 光化門 (design already in korea.md §1.8). Gold brush regular script (Kyoto `PLAQUE` stack: Weibei SC first), on Black, with a thin Dark Red frame line, 4 colours max. The characters read right to left (門 化 光 from the left), canvas px ≥ 320.
- **Assemblies:** base, parapet, each storey + eave + roof, the corner kits and the haechi go in as `bp.assembly()` (exploded into members). The corner kit is authored once and placed 4 × per roof by a mirror helper. Eave runs are generated from the lift table (§3.3) by one function, so the faces stay symmetric.

**Risks, each with a fallback**
1. **The sweep reads as stairs** (the ABSAddict trap). Test first in the test scene: one upper face + one corner kit, rendered beside `seonbiwon-ideas-2.jpg` and `real-gwanghwamun-piotrus.jpg`, front and 3/4. *Fallback 1:* halve the step (lift every rib pair 1 plate, with more pairs in the sweep zone, and the corner + 4). *Fallback 2:* hinged outer thirds (decision 1 B), on the corner kit only.
2. **The plaque is hidden by the eave or illegible** at thumbnail size. Check at el 20° / 30°. *Fallback:* a 1×6 tile with the board widened, or drop the plaque (the arches + roofs still identify the gate).
3. **3308a supply** (out of production since 2015). *Fallback:* 16577 (1×8×2 raised, same 6-wide opening), or three 3307s with the centre on taller piers.
4. **Dark Red 3062b** is [M]. *Fallback:* Reddish Brown posts (NOTES' second choice).
5. **Footprint grows to 34 × 19 with the wall stubs.** *Fallback:* stubs of 2 (32 wide), or let the island's back rim wall continue them. Decided at the island stage.
6. **K-pop stage in front** (≈ 26 plates tall, west of the axis). The gate keeps everything above G + 26: the plaque (29–32), both roofs and the upper dancheong. Keep the stage's east edge **west of local x 9** (the centre-arch pier), so the centre arch and the east haechi stay in view from the default camera. That is also the real 2026 sightline.
7. **Hollow base vs part count.** If parts run over, the back face can drop the masonry texture (plain bricks); the vaults stay.

## 8. Build order (for the next stage)
1. One upper-roof long face + one corner kit in the test scene → judge the sweep (risk 1) → Eric's checkpoint screenshot.
2. Base with the three vaults + a minifig walking through the centre.
3. Storeys, bands, plaque; then the lower ring; then the full gate, haechi and stubs.

## 9. Reference image `../seoul-palace-lego.png` (gpt-image-2, 1536 × 1024)
Prompt:
> Gwanghwamun gate of Gyeongbokgung palace, Seoul, built as a LEGO element at minifig scale, three-quarter view from the front-left, on a plain grey studio background, real visible LEGO bricks and studs, no printed textures except one small plaque. A wide light-bluish-grey granite base of masonry-textured bricks with three round-topped arches through it, the centre arch larger, dark red door leaves folded back inside the tunnels, one minifigure walking through the centre arch. On top a dark bluish grey parapet band with small white framed panels. A two-storey timber gate pavilion: short dark red round columns, sand green lattice panels, a sand green dancheong bracket band with tiny red and blue dots, and a row of white round rafter-end dots under each eave. Two hipped Korean roofs of dark bluish grey curved-slope tiles with clear vertical tile ribs; each eave is flat across the middle third and sweeps up continuously in small steps into upturned corners, the upper roof sweeping more. Bright white mortar ridge on the top ridge and white bands down every hip, three tiny dark grey figurines on each hip, dark ridge-end ornaments. A black plaque with three gold brush characters 光化門 on the upper storey. Two small brick-built grey seated haechi lion-dog statues on plinths in front, and a short light grey palace wall stub with a dark grey tiled coping on each side. Muted realistic colours, not Japanese, no bright red.

- **Right:**
  - LBG masonry base, three arches with the centre one larger, Dark Red doors folded back, a minifig in the centre arch.
  - DBG parapet with White framed panels.
  - DBG rib-field roofs with **White ridge and hip bands**.
  - **Rows of white rafter dots under both eaves**, a Sand Green bracket band with red/blue dots, Dark Red frames with lattice.
  - The black plaque reads 門化光 left to right (correct).
  - Brick-built haechi on two-step plinths, and wall stubs with DBG coping and white tile ends.
  - Overall it reads Korean, not Kyoto.
- **Wrong against the scheme:**
  - **The eaves are almost straight, with a flick only at the corners.** That is exactly the failure mode the lift table is there to avoid. Ours sags from x 8 outward.
  - Round knob finials are stacked on every corner and ridge end, which reads pagoda-like (ours: one white plate + one black tooth per hip end, beaked 취두).
  - The upper storey is too tall and windowed (ours: 3 plates of lattice with the plaque in it).
  - The haechi read as Chinese foo lions (ours: low haunches, big grinning grille head).
  - The roofs are taller and heavier than the real ones.
  - The minifig is oversized against the arch.
