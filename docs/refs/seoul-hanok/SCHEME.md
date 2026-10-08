# Bukchon hanok, hanbok visitor, ginkgo (+ pojangmacha option): analysis + build scheme
2026-10-06 · research and design only, nothing built · sources: `NOTES.md` (this folder), `../seoul-real/NOTES.md`, `docs/countries/korea.md` §1 (approved) · format after `../la-santa-monica/SCHEME.md` · reference image `../seoul-hanok-lego.png` (§7)

## Units used on this page
- Heights are in plates above the **courtyard level C** of the hanok lot (Bukchon stands on rising ground; the island stage sets C = G + k). A minifig is ≈ 12.5 plates; a 36036 skirt figure is the same height as one on 970c00 legs (both moulds: y −11 … 40 LDU).
- ASCII: 1 char = 1 stud, north up, default camera from the south. Plan origin = the north-west corner of the courtyard.
- **L** = already baked (`src/parts/ldraw/`); **bake** = must be baked; every number checked in `vendor/ldraw-lib/ldraw/parts/<n>.dat` (first line quoted where it matters). Colours: **[BL]** = present in BrickLink's colour list for that mould (fetched today); **[M]** = from memory.
- Roof geometry below was computed (section of a hinged plane: axis, pitch, plate stack, line tops, eave edge); the asm script reproduces it from the moulds' boxes, as `asm-mbs.mjs` / `asm-paris-eiffel.mjs` do for 3937.

## 0. Decisions for Eric (top of page)
1. **The L costs room: ≈ 19 × 16 studs, not 16 × 14.** Two hinged roofs cannot share a valley (rectangular planes would cut through each other), so the L is built as two wings whose roofs step past each other with a 0.4–1.4 stud gap. This is what NOTES §3 proposed and what Bukchon's stepped lots look like anyway.
   **A (recommended):** the L as drawn in §2.4: main wing (anchae, hip-and-gable) along the alley + a lower gate wing (daemun-chae) facing the camera, ≈ 19 × 16, ≈ 880 parts.
   **B:** one straight wing + a tile-capped courtyard wall with the gate in it, ≈ 15 × 12, ≈ 650 parts. Cheaper, but loses the stepped second roof that makes "Bukchon" read.
2. **Pojangmacha: cut (recommended).** It does not earn ≈ 180 parts and a fourteenth figure on this island (§6). Keep it as the first addition if the island review finds the alley foot empty.
3. **Ginkgos: two (recommended).** One tall tree at the alley head (L) and one beside the palace's east wall on Samcheong-dong-gil (M), the real ginkgo street between the palace and Bukchon. A third (M, palace wall west) only if the island needs balance.

## 1. Corrections to NOTES.md / korea.md found by this pass
1. **Rafter ends are white, not natural wood.** `real-bukchon-05.jpg` shows two rows of white discs on every eave: the white mortar ends of the cover-tile lines on top, and below them a **Reddish Brown fascia** with a staggered row of white rafter ends. NOTES §2.1 has "Medium Nougat 6141 rafter ends". We build both white rows (§2.6). This is the strongest "Korea, not Japan" cue we have, and the target image confirms it reads.
2. **No lattice mould exists in Medium Nougat.**
   - 2529 "Window 1 x 2 x 3 Pane Latticed" [BL]: Black, Blue, Brown, Green, Light Gray, Pink, Red, Reddish Brown, White, Yellow. No Medium Nougat, Tan or Dark Tan.
   - 60593 frame [BL]: Tan / Dark Tan / Reddish Brown, no Medium Nougat.
   - The square grid we need is **32932 "Fence Ornamented 1 x 4 x 2 with Square Lattice"**. In **Tan** [BL] it reads as honey wood. With a White brick row behind, the paper (hanji) shows through the grid.
   - This also separates us from Kyoto's tea house, which has White 2529 shoji in Dark Brown 60593 frames.
3. **2417 Plant Leaves 6 × 5 does not come in Yellow** [BL]. The ginkgo is built from **2423 Plant Leaves 4 × 3** only (Yellow ✓, Bright Light Yellow ✓ [BL]). 32607 (Yellow, Bright Light Yellow) and 25269 (Yellow, Bright Light Yellow) are fine.
4. **The kkotdam band is Sand Red, not Dark Orange.**
   - `seoul-real` §6 sampled the Bukchon band as #935D55, which is nearest **Sand Red**.
   - Sand Red exists in **3009 Brick 1 × 6** and **3004 Brick 1 × 2** [BL], but not in 3010 (NOTES' pick).
   - So the band is Sand Red 3009 / 3004 with a printed white meander.
5. **36036 has no Bright Pink** [BL]. The chima is **Dark Pink** (the commonest rental colour that exists).
6. **The bun hair needs another mould.** 27186 (already baked) has no Black [BL]. Use **2633** "Minifig Hair Long with Parted Bangs Swept Back in Bun", which comes in Black [BL] and must be baked.
7. **2429 / 2430 are swivel plates.** They turn in the plate's own plane, so they cannot pitch a roof (NOTES §3 table lists them for the roof planes). The roof hinge is **3937 "Hinge 1 x 2 Base" + 6134 "Hinge 2 x 2 Top"** (both in Dark Bluish Gray [BL]; 3937 also in Medium Nougat).
8. **Gate leaves 58380 / 58381 have no wood colour** [BL]: Black / grey / White / Yellow only. The leaves become **87544 Panel 1 × 2 × 3** in Medium Nougat [BL] (to bake).
9. **Pipeline gaps (code, for the build stage):**
   - `minifig2` has no skirt. It needs a `skirt` option (36036 in place of 970c00). The skirt has the legs' height and the same snap rule; its single centre tube sits on 2 × 2 studs (tube at x 0, z +10 LDU).
   - The validator's "both feet" check needs a skirt case.
   - `check-asm-studs` must add **6134** to `BY_DESIGN` (it is held by its hinge, like 3938).
   - The palace guard (36036 robe) uses the same option.
10. **Heights:**
    - The hanok's ridge is **C + 33**, with the kicked ends at C + 34.
    - The ginkgo at the alley head must clear that with a margin, so the **L ginkgo is ≈ C + 38, not 36** (korea.md §1.5). It stays below the gate (45) and far below the tower.

## 2. Bukchon hanok (hero of the district)

### 2.1 Real proportions and signature (photos `real-bukchon-01/05/11gil-a/gate/slope`, `real-ginkgo-autumn`)
- **Street wall, bottom to top:**
  - stepped granite base following the slope;
  - granite ashlar lower wall (≈ 40 % of the wall);
  - one **brick band with a white meander** (kkotdam);
  - white plaster between honey timber posts, with **high horizontal square-lattice windows**;
  - a deep eave: **white tile-end ovals** on the cover-tile lines, a Reddish Brown fascia below, and **white rafter ends** under it.
- **Roof:**
  - Dark grey giwa in alternating cover lines and troughs.
  - The eave rises toward every corner.
  - A heavy ridge with a white line, its **ends kicked up**.
  - The main wing is hip-and-gable (paljak), with a small gable triangle at the top of each end. Lesser wings are plain gables (matbae).
- **Proportions** [measured roughly on `05` with a 1.7 m tourist]:
  - wall 3.4 m: stone 1.3, band 0.4, timber zone 1.7;
  - eave projection ≈ 1 m;
  - roof rise ≈ 0.8 × wall;
  - the band is a 0.4 m strip, which is **exactly one brick course** at minifig scale.
- **Signature (must carry):** the white dots at the end of every grey tile line, the rising eave corners, the meander band over granite, and the kicked ridge. If one is missing, the house reads Japanese or Chinese (NOTES §1.1).

### 2.2 Brick versions → conclusion
| Version | What it does for the signature | We take |
| --- | --- | --- |
| LEGO Ideas *Seon-Bi Won* (2025, minifig scale) `moc-ideas-seonbiwon.jpg` | Rounded cover-tile lines running down the roof, **each ending in a White round**; lines fan into each corner; the eave rises at the corners; a tile-capped wall with the same lines | the line + white-end grammar, the corner fan, the tile-capped wall |
| Rebrickable MOC-131301 Lejoverse hanok (613 pcs) `moc-131301…jpg` | Hinged roof planes; lines with bare stud channels between them (troughs); raised corner pieces; white gable | hinged planes, stud-channel troughs |
| Official 80113 Family Reunion (2024) | Whole roof planes on **3937 / 6134 hinge bricks**; lattice fences as windows | the hinge pair |
| Official 80105 Temple Fair (2020) | **49307** curved-top 1 × 1 in lines down the roof = barrel cover tiles; brackets 36840 | 49307 as the cover tile, 36840 brackets |
| Official 80106 Story of Nian (2021) | A grey courtyard house: Dark Bluish Gray 49307 / ingots, masonry bricks 98283 / 15533 in grey | grey masonry lower walls |
| Official 21016 Sungnyemun (2012, micro) | LEGO's own Korean shorthand: White 1 × 1 rounds as tile ends and ridge accents, clip-and-handle skirts | White rounds as tile ends |
| MOC-188782 / MOC-200548 (micro) | Grey roof + white wall + tower = Seoul | nothing at our scale |

**Ours:**
- The hinged planes of 80113 / Lejoverse.
- Seon-Bi Won's lines of 49307 on alternate stud columns, each ending in a **White 98138 on a 36840 bracket** facing down the slope (the real mortar oval faces that way).
- **Better than every version:** a second, staggered row of white rafter ends on a Reddish Brown fascia (`05`); none of them has it. And the true colour layering: grey roof, Sand Red meander band, honey timber.
- Rejected: Seon-Bi Won's Dark Blue roof and dancheong, and Lejoverse's Black roof and dark timber (they read palace / Japanese).

### 2.3 Not Kyoto: differences built in
| | Our hanok | Kyoto set (`docs/countries/japan.md`) |
| --- | --- | --- |
| Roof surface | grey **lines of round cover tiles with troughs**, white disc at every line end, a second white row of rafter ends | smooth slopes, no white; pagoda corner flicks |
| Roof form | hip-and-gable with a small **white gable triangle**, eave **rising 1–2 plates into every corner**, heavy ridge with a **white stripe** and **kicked ends** | thatch hip (tea house), straight eaves |
| Walls | **granite masonry + Sand Red meander band + white plaster between honey round posts** | dark posts and white walls, no masonry, no band |
| Openings | **Tan square lattice over white** (high strips; doors in two stacked units) | White lattice in Dark Brown frames, full height |
| Base | raised **granite gidan**, ondol firebox, **separate chimney** | engawa deck on posts |
| Palette | Dark Bluish Gray, White, Medium Nougat, Tan, Sand Red, Light Bluish Gray, Reddish Brown fascia | Bright Red, Dark Red, Black, Dark Brown, Dark Tan |
| Setting | stepped grey alley, gold ginkgo | pond, pink sakura |

### 2.4 Plan (layout A)
```
      x  0    5    0    5    0    5          (x −1 … 28; z −4 … 18)
z  -4  .............CC...............   C  gulttuk chimney 2×2, standing apart, 2 studs north of the eave
z  -3  .............CC........oooo...   o  ginkgo L crown (axis T at x 24, z 2; west side bare toward the roof)
z  -2  ..................::::.oooooo.   :  alley, 4 wide (x 17–21), LBG; = a 2-plate step down (south)
z  -1  WWWWWWWWWWWaaaaaaaa:::.oooooo.   W  tile-capped courtyard wall (north, west), granite + band + coping
z   0  Wccccccccaaaaaaaaaa:::.ooooooo   a  anchae roof (hip-and-gable), x 7.94–18.06, z −1.06–14.06
z   1  WccccccccaaAAAAAAaa:VV.oTToooo   A  anchae body 6 × 11 (x 10–16, z 1–12), faces west into the courtyard,
z   2  WccccccccaaAAAAAAaa:VV.oTToooo      its back (east) is the alley facade; ridge N–S
z   3  WccccccccaaAAAAAAaa:::.ooooooo   V  hanbok visitor on the alley-head landing, facing south (down the alley,
z   4  WccccccccaaAAAAAAaa===.oooooo.      toward N Seoul Tower and the camera)
z   5  WccccccccaaAAAAAAaa:::.oooooo.   c  courtyard (madang), LBG granite pavers
z   6  WccccccccaaAAAAAAaa:::.oooo...
z   7  WgggggggcaaAAAAAAaa:::........   g  gate-wing roof (gable, ridge E–W), x −0.5–6.5, z 6.94–15.06
z   8  WgggggggcaaAAAAAAaa===........
z   9  gGGGGGGg.aaAAAAAAaa:::nnNNNNnn   G  gate wing (daemun-chae) 6 × 4 (x 0–6, z 9–13); its south face is
z  10  gGGGGGGg.aaAAAAAAaa:::nnNNNNnn      the lane facade toward the camera
z  11  gGGGGGGg.aaAAAAAAaa:::nnNNNNnn   D  the gate: two Medium Nougat leaves, 4 wide, centre bay
z  12  gGDDDDGg.aaaaaaaaaa===nnNNNNnn   N  neighbour (cut first): gable roof 4 × 9 + alley facade, one step lower
z  13  gggggggg.aaaaaaaaaa:::nnNNNNnn      (x 23–27, z 9–18; roof n over the alley's east edge)
z  14  gggggggg..........::::nnNNNNnn   the 2-stud slot x 6–8 at z 13 between the gate wing and the anchae is closed
z  15  ..................::::nnNNNNnn   by a short wall run (same build as W)
z  16  ..................====nnNNNNnn
z  17  ..................::::nnNNNNnn
```
- **Roof clearances in plan:**
  - gate-wing gable verge (x 6.5) to anchae eave (x 7.94): 1.44;
  - anchae eave corner tip (≈ 1 stud diagonal) to gate wing: ≈ 0.4;
  - anchae north eave (z −1.06) to chimney (z −2): 0.94.
  - No two roofs touch: each wing is its own assembly, so the validator sees two proxies.
- **The alley:**
  - It steps down southward in flat 2-plate risers at z 4, 8, 12, 16: alley level C, C − 2, C − 4, C − 6, C − 8. Treads and risers are both LBG (playbook: steps in one colour).
  - The head landing (z −2 … 4) keeps a 2 × 2 patch of plate studs for the visitor's skirt and the fallen leaves.
- **Footprint:**
  - Hanok lot incl. eaves ≈ 19 × 16 (x −1 … 18, z −1 … 15).
  - With alley, ginkgo and neighbour, the district is ≈ 30 × 22.

### 2.5 Sections
**Anchae, cross-section looking north** (west = courtyard on the left, east = alley on the right; 1 char ≈ ½ stud across, 1 row = 1 plate up; heights above C):
```
 34              ▲            ▲            ridge ends kicked one plate (11477, thick end out) + White disc on the end face
 33           ┌─oooooooo─┐                 cap: two 49307 lines (rounded crest), Dark Bluish Gray
 31           │▒▒▒▒▒▒▒▒▒▒│                 (31–33)
 30           │□□□□□□□□□□│                 yangseong: one White plate course, 4 wide
 28           │██████████│                 ridge base: 2 staggered DBG plate layers, 4 wide (x 11–15), on the two gable tops
 27.4       T ╱          ╲ T               the top 49307 of each line ends under the ridge (line top 27.45, ridge bottom 28)
 25.8      ╱T              T╲              plane = 2 plate layers (Medium Nougat under = soffit, DBG over), pitch 35°,
 23       ╱T                T╲               5 cells along the slope (s −50 … +50 LDU from the hinge axis)
 20.6   ○╱ ← hinge axis 18.75 → ╲○         3937 base (MN) on the wall top, 6134 top (DBG) under the plane, axis at the
 19.5 ◉─╱                        ╲─◉         wall row's cell centre; ◉ = White tile-end disc (98138 on a 36840)
 17–18.6 ╱ ▔▔▔hinge course 17–20▔▔▔ ╲      eave edge: top 18.65, bottom 17.0, 2.06 studs out from the wall face
 15  ○▔▔▔                          ▔▔▔○    ○ = White rafter ends on the Reddish Brown fascia (99781), ≈ C+15
 16–17   │═══ beam (MN plates) ═══│
 4–16    │L                      W│        L = lattice doors (2 × Tan 32932 stacked, White behind); W = east (alley) wall:
 4       │▔toenmaru (MN tiles)    │          plaster 7–10, high window 32932 10–16, band 4–7, granite below
 0–4  ▄▄▄│▓▓▓ gidan: masonry 98283/15533 LBG + LBG cap ▓▓▓│▓▓▓  granite continues down to the alley level (C … C−6)
      courtyard C                           alley (steps)
```
Numbers (computed for a 6-deep body, pitch 35°, 5 rows, axis 1.75 plates above the wall top):
- the plane's inner bottom corner stays 0.97 studs short of the centreline (no clash with the mirror plane);
- plane top at the apex: axis + 7.07;
- line tops: axis + 8.70, 1.11 studs in from the wall face, which is inside the 4-wide ridge's footprint (x 11–15) and 0.55 plates under it;
- eave: 2.06 studs overhang.

**Gate wing and neighbour** (4 deep, gable roof, pitch 40°, 5 rows):
- inner corners 0.16 studs short of the centreline (3.2 LDU each side, above the 3 LDU skin);
- apex at axis + 7.27, line tops at axis + 8.81;
- eave overhang 1.99, eave edge 0.8–2.3 plates under the axis.
- Gate wing levels:
  - floor C + 1;
  - posts 1–13, beam 13–14, hinge course 14–17, axis 15.75;
  - eave edge 13.5–15;
  - ridge: base 24–26, White 26–27, one 49307 line 27–29; **top C + 29**, kicks 30. It steps 4 plates below the anchae, as `real-bukchon-01` shows.

**Alley facade of the anchae (east, from the alley)**: granite from the alley level up to C + 4 (2–4 courses as the alley steps down; each foot levelled with LBG plates, so the masonry courses stay horizontal) → **Sand Red printed meander band C+4–7** → White plaster 7–10 → Tan 32932 high window over White 10–16 in each 4-wide bay, Medium Nougat round posts from 7 to 16 between bays → beam 16–17 → eave with both white rows. This is the `05` elevation, one-to-one.

### 2.6 The roof as an LDraw assembly (`tools/ldraw/asm-seoul-hanok.mjs`, exploded with `bp.assembly()`)
**One plane, in its own coordinates (anchae west plane; u along the eave, s up the slope; 1 char = 1 stud):**
```
 s(cells)   u →  -2 -1  0  1  2  3  4  5  6  7  8  9 10 11 12 13        ▲ toward the ridge
  +40 (5)              .  T  .  T  .  T  .  T  .  T  .  T  .          top row: gable foot to gable foot
  +20 (4)           .  T  .  T  .  T  .  T  .  T  .  T  .  T          rows shorten one stud per row at each end along the hip
    0 (3)  hinge →  .  T  .  T  .  T  .  T  .  T  .  T  .  T  .       6134 tops under cells u 0–1, 4–5, 8–9 (3 hinges)
  −20 (2)        ⁺T  .  T  .  T  .  T  .  T  .  T  .  T  .  T  ⁺T     ⁺ = corner-sweep riser plates under the last lines
  −40 (1)      ⁺⁺B  .  B  .  B  .  B  .  B  .  B  .  B  .  B  ⁺⁺B    B = eave cell: 36840 bracket + White 98138 (tile end)
   under −40:  r  R  r  R  r  R  r  R  r  R  r  R  r  R  r            fascia: Reddish Brown 99781 down-brackets, White 98138
                                                                        rafter ends (R) on alternate side studs, RB 3070b on the rest (r)
```
- **Lines:** a cover-tile line on every other column (u even), a trough of bare studs between, 2-stud pitch.
  - At 1-stud pitch the white ends would touch and read as a band (the target image's error).
  - Each line is: 36840 on the eave cell → 49307 on each cell above, barrel along the slope. Every piece sits on its own stud.
- **Corner sweep** (the "continuously curved" eave):
  - The last two lines at each end stand on risers of +1 and +2 plates (1 × N plates under the bracket and the line). The white ends climb into the corner by one and two plates.
  - At the hip foot, a **DBG 50950 Curved 3 × 1** sits on one stud, turned 45° in plan with its thick end out: the corner rafter tip.
  - Kyoto's lesson holds: 1–2 plates, never a horn.
  - The four corner units are built once and placed by rotation 0 / 1 / 2 / 3 (the asm-level `hipCorners`; the unit is mirror-symmetric about its diagonal, so rotation is enough).
- **Hips (paljak):**
  - The long planes are trapezoids and the end planes (3 rows, up to the gable foot) are short trapezoids. Each row ends one stud further in.
  - The steps are cut with **24299 / 24307 2 × 2 wedge plates** (45°). The true hip is 50.7° in the plane at 35° pitch, so a V-gap of ≤ 0.66 stud opens at the eave corner.
  - A **hip ridge** (DBG 49307 on the long plane's edge studs, stepping down) covers it, ending in the 50950 tip.
- **Gables (hapgak):**
  - The end walls continue up as White plaster triangles from the wall top (17) to the ridge base (28). Courses of White 1 × N bricks step in, with White 85984 cheese at the edges and a Medium Nougat 1 × N plate frame line.
  - They stand on the end walls' studs. The end plane covers their foot, so 23–28 shows: a 5-plate white triangle, as in the target image.
- **Ridge:**
  - It spans the two gable tops: 4 wide, two staggered DBG plate layers (28–30), then White plates (30–31), then two lines of 49307 (31–33).
  - Each end: a 1 × 2 DBG plate + **11477** (thick end outward) on the last two cells → +1 plate kick. A **36840 + White 98138** on the end face (the white ridge-end tile).
- **Every connection:**

| Member | Held by |
| --- | --- |
| 3937 hinge base | stud-in-tube on the beam plates (wall top) |
| 6134 hinge top | the hinge (BY_DESIGN) |
| plane lower layer | studs of the 6134 tops |
| plane upper layer | the lower layer, joints staggered (two-layer rule) |
| 36840 / 49307 / risers / wedges / hip-ridge pieces | plane studs |
| White 98138 | stud of a 36840 or 99781 flange |
| 99781 fascia | its own top studs **into the plane's underside** (it hangs from the plane, flange down, side studs pointing down-slope) |
| ridge layers | gable-top studs and each other |
| 11477 kicks | the 1 × 2 plate studs |
| 50950 tip | one stud (a real one-stud joint, turned 45°) |
| gable courses | end-wall studs |

  - Nothing leans or rests: every plane hangs on two or three hinges.

### 2.7 Level tables

**Anchae (6 × 11, ridge N–S)**
| Plates (above C) | Element | Part types (first pick → fallback) | Colour |
| --- | --- | --- | --- |
| C−6 … 4 | gidan: courtyard side one course + cap; alley side down to the alley | 15533 / 98283 masonry (L) on LBG levelling plates; LBG cap plates; 2-plate step block in front of the maru | **LBG** [BL] |
| 4–5 | floor; toenmaru strip on the west front | plates; Tile 1 × 4 / 1 × 6 (L) | MN floor [BL] |
| 4–16 | posts at the bay lines (front x 10: z 1, 6, 11; back x 15 above the band) | Brick 1 × 1 Round 3062b ×4 (L) | **Medium Nougat** [BL 3062] |
| 4–16 | west bay 1: lattice doors; bay 2: open maru | **32932** Fence 1 × 4 × 2 Square Lattice ×2 stacked (bake) + White 3010 ×4 behind | **Tan** lattice [BL], White |
| 4–7 | alley facade band | **3004 Brick 1 × 2** printed meander (L) ×4 (two bays) | **Sand Red** [BL] |
| 7–16 | alley facade: plaster + high window per bay | White 3010 + 32932 over a White 3010 row | White, Tan |
| 4–16 | end walls (north, south) | White bricks, one 32932 window each, MN posts at the corners | White, Tan |
| 16–17 | beam | Plate 1 × N (L), two lengths staggered over the bays | MN |
| 17–20 | hinge course: 3937 at the 10 hinge positions, bricks between | **3937** (L), Brick 1 × 2 / 1 × 4 (L) | MN |
| 17 | ceiling deck (gable seats, ties the walls) | Plate 2 × N (L) | DBG (hidden) |
| 18.75 … 27.5 | 2 long planes (5 rows) + 2 hip planes (3 rows), pitch 35° | **6134** (bake) ×10; Plate 2 × 8 / 2 × 6 / 1 × N (L); **24299 / 24307** wedge 2 × 2 (bake) | MN under, **DBG** over [BL] |
| on planes | cover-tile lines (≈ 7 + 7 long, 4 + 4 hip) | **49307** (L), **36840** (bake), **98138** (L) | DBG [BL], **White** ends |
| under eave | fascia + rafter ends | **99781** Bracket 1 × 2 Down (bake), **36841** 1 × 1 Down at odd ends (bake), 98138 / 3070b (L) | **Reddish Brown** [BL], White |
| corners | sweep risers, 4 corner tips, 4 hip ridges | Plate 1 × N (L), **50950** (L), 49307 (L) | DBG |
| 17–28 | 2 gable triangles | White 1 × N bricks / plates, White **85984** (L), MN plate trim | White [BL], MN |
| 28–34 | ridge, kicks, end discs | Plates 2 × N, White plates, 49307, **11477** (L), 36840 + 98138 | DBG, White |
| 0–1 | ondol firebox at the north end's gidan face | Brick 1 × 2 with Grille 2877 (L) | Black |

**Gate wing (6 × 4, ridge E–W, the camera-facing roof)**
| Plates | Element | Part types | Colour |
| --- | --- | --- | --- |
| C−2 … 1 | sill on the lane side (lane at C − 2), 2-plate stone step in front of the gate | masonry 98283 (L), LBG plate + Tile 1 × 4 | LBG |
| 1–13 | 4 posts (corners, gate jambs) | 3062b ×4 each | MN |
| 1–13 | gate, centre bay 4 wide: two leaves | **87544** Panel 1 × 2 × 3 ×2 (bake) + Brick 1 × 2 ×2 + plates; lintel plate | **Medium Nougat** [BL] |
| 1–13 | side bays (1 wide) and gable-end walls | White bricks over 2 masonry courses | White, LBG |
| 13–14, 14–17 | beam, hinge course (4 × 3937) | as the anchae | MN |
| 15.75 … 24.6 | 2 planes, pitch 40°, 5 rows × 7 (½-stud verge each end) | 6134 ×4, plates | MN / DBG |
| on planes | 4 + 4 lines, white ends; fascia + rafter ends; +1-plate sweep at the four eave ends | as the anchae | DBG, White, RB |
| 14–24 | 2 white gable triangles with MN frame | White bricks, 85984, MN plates | White, MN |
| 24–30 | ridge 2 wide: DBG 24–26, White 26–27, 49307 line 27–29, kicks to 30 | as the anchae | DBG, White |

**Courtyard walls (north 11, west 9, a 2-stud run at the south-east)**
- **Build:** 1 wide, 12 plates:
  - two masonry courses (LBG);
  - one Sand Red meander course (3009 1 × 6 printed ×2 + 3004 ×1);
  - one White course;
  - coping: DBG plate + a line of 49307 + White 98138 on 36840 at both ends.
- **≈ 45 parts.**

**Chimney (gulttuk)**
- **Build:** 2 × 2, standing alone:
  - three courses of 98283 in DBG (two per course);
  - a 2 × 2 DBG plate;
  - a tiny tiled cap: two 49307 on a 2 × 2 plate.
- **Size:** C + 0 … 12. **≈ 12 parts.**

**Alley:** LBG Tile 2 × 4 / 1 × 4 on the island's stepped LBG ground plates; risers are the ground's own plates. ≈ 16 parts plus the island packer.

### 2.8 Footprint, height, parts
| Item | Footprint | Height (above C) | Parts |
| --- | --- | --- | --- |
| Anchae body | 6 × 11 (+ gidan) | 20 | ≈ 125 |
| Anchae roof (planes, lines, fascia, corners, gables, ridge) | 10.1 × 15.1 | 34 | ≈ 345 |
| Gate wing | 6 × 4 → roof 7 × 8.1 | 30 | ≈ 195 |
| Courtyard walls, chimney, pavers, alley | — | 12 | ≈ 85 |
| Contingency (LA's builds grew ≈ 20 % over scheme) | | | ≈ 130 |
| **Hanok total** | **≈ 19 × 16** | **ridge C+33, kicks 34** | **≈ 880** |

Specialty moulds (49307, brackets, hinges, lattice, round tiles, curved slopes, wedges, panels) ≈ 45 % of the pieces.

### 2.9 Bake list
`32932 6134 36840 99781 36841 24299 24307 87544 2633`. Also needed:
- a catalogue entry for 36036 (the baked mould exists; no entry yet);
- `fig_skirt` in `minifig2`.

Everything else is in `src/parts/ldraw/`: 49307 98138 11477 50950 3937 98283 15533 3062b 3004 3009 3010 85984 2877 3070b 30089b 36036 2423 32607 25269.

### 2.10 Risks and fallbacks
1. **Hip corners from rectangular planes** (biggest risk).
   - Problem: the 45° wedges leave a V-gap of up to 0.66 stud at the eave corner, under the hip ridge.
   - Test: build one corner unit first in the test scene and look at it from above and from the corner.
   - **Fallback:** a gable roof (matbae) on the anchae too. It keeps the rising eave ends, the white rows and the kicked ridge, and loses the hapgak triangle at the hips.
2. **Hinge clearance at the wall top.**
   - At the wall face the plane's underside clears the hinge course by 0.6 plates.
   - Problem: the fascia brackets and the tile-end flanges stand outside the plane edge, so `check-assemblies` (oriented boxes) may flag the bracket flange against the plane's own edge plate.
   - **Fallback:** move the eave bracket one cell up the slope (the white disc then sits 0.8 stud behind the edge).
3. **Two white rows cost ≈ 110 parts.** Fallback: rafter ends only on the two camera-facing planes (anchae west + south hip, gate wing south).
4. **Tan lattice beside Medium Nougat posts** may read as two woods.
   - **Fallback:** Tan posts (3062 exists in Tan [BL]).
   - Do not use Reddish Brown lattice: it reads Kyoto.
5. **Sand Red is a retired colour.** It exists in 3009 and 3004 [BL] and the print covers its face.
   - **Fallback:** Dark Orange 3010 with the same print. NOTES' choice, one step browner.

## 3. Neighbour roof stepping down the alley (cut first if over budget)
- **What:** the gate-wing assembly re-used as a 4 × 9 gable house (ridge N–S) on the alley's east side (x 23–27, z 9–18), floor at C − 4.
  - Its alley facade (west): granite stepped with the alley, the band (3004 printed ×2), one Tan 32932 window, posts.
  - Its east side faces the island edge and gets White plaster only.
- **Height:** ridge **C + 25**, so the three ridges step 33 → 29 → 25 down the hill, the picture in `real-bukchon-01`.
- **Parts:** ≈ 225, no new moulds.

## 4. Hanbok visitor (life layer, the Bukchon figure)
- **Action:** at the alley-head landing (x 19–20, z 1–2), facing **south**, down the alley toward N Seoul Tower and toward the camera, **camera raised to the face**. This is sightline 4 in `seoul-real` §1.2, and the most legible action at minifig scale.
- **Parts:**

| Part | Mould | Colour |
| --- | --- | --- |
| chima | **36036** Minifig Hips and Skirt (L; needs `skirt` in `minifig2`) | **Dark Pink** [BL] |
| torso | 973 + arms, pose L `d` / R `h` | White (jeogori sleeves) |
| torso print (L2, country design "hanbok jeogori") | white jacket with a light-grey collar band (dongjeong), a **Red otgoreum bow** with two long ribbons on the right chest, Dark Pink from the ribs down so it runs into the skirt; ≤ 4 colours | — |
| head | shared "calm smile" face print | Yellow |
| hair | **2633** bun swept back (bake) | **Black** [BL] |
| camera | **30089b** (L), `HOLD_DEFAULTS.camera` (pose `h`, grip on the side handle) | Black |

- **Connection:** the skirt's centre tube sits on the four landing studs (a 2 × 2 patch of the landing plate left untiled). The snap rule is the legs' rule: x on a stud line, z on a cell centre.
- **Checks:** close-ups from the front and the side to see the camera in the hand and not in the face. The fallen leaves stay clear of the skirt's 2 × 2.
- **Parts:** 6.

## 5. Ginkgo: `tree(kind 'ginkgo')` recipe (to go into `docs/countries/korea.md` §2 beside Kyoto's sakura notes)
**Real:**
- Upright, egg-to-conical crown on a straight, grey-brown, limbed-up trunk.
- An even butter-yellow in late October (sampled #D2CC33 sunlit, #B8942B shade).
- The leaves drop together into a yellow carpet (`seoul-real/ginkgo-autumn-*`).
- The opposite of the sakura's broad umbrella.

**Official reference:** 10373 Mini Bonsai ginkgo = Yellow 2423 + Yellow 32607 on a Dark Tan trunk.

**Recipe:** the generic armature (2 × 2 round trunk on its axis, four corner limbs per fork, pinwheels alternating, jumper under the crown), with:

| | Ginkgo | (Sakura v5, for contrast) |
| --- | --- | --- |
| Trunk | 2 × 2 round bricks, **Dark Brown**; long clear trunk (L 6 segments = 18 plates, M 4) | Reddish Brown, L 4 |
| Limbs | **short**: L tiers `[3,2,3,2] / [3,3,3,3] / [2,2,2,2]` (lengths; lifts 0/2/4/2 staggered as in sakura), widest in the middle tier, narrow top → egg; M `[2,3,2,3] / [2,2,2,2]`; S `[2,2,2,2]`; gap 1 segment between forks (L, M), 0 (S) | 4 / 3 / 2, umbrella |
| Leader | jumper → **one extra 1 × 1 round brick** → crown cluster: the crown is taller than it is wide | jumper → cluster |
| Tip cluster | **32607 calyx in Yellow** (the 3-leaf plate reads as a ginkgo sprig) → 2423 → 2423 crossed (±1 turn) → 2423 opposite: three leaves deep, **no 6 × 5** (2417 has no yellow) | calyx Reddish Brown → 2417 → 2423 → flower |
| Along limbs | a 2423 on each middle stud of a 3-long limb (linden rule: the crown reads as one mass) | petals and flowers |
| Leaf colours | **Yellow : Bright Light Yellow = 3 : 2**, nothing else (no orange: Shanghai's planes; no green) | White / pink |
| Fallen leaves | **25269 Tile 1 × 1 Quarter Circle** (a quarter circle is a ginkgo fan), Yellow and BLY, random rot 0–3, on bare ground studs inside the crown's radius: L 12, M 8 | petals 1 × 1 |
| `skip` | the side toward a roof (alley-head tree: west) | same |

**Heights and spread:**
- L ≈ **38 plates**, crown Ø ≈ 9;
- M ≈ 28, Ø ≈ 7;
- S ≈ 18.
- All are register-checked with `Sites` (r: L 5, M 4).

**Parts:** L ≈ 100 (incl. 12 fallen), M ≈ 66.

**Placement (two trees, decision 3):**
- L at the alley head on the alley's east side (axis x 24, z 2, skip west). It is 0.9 studs clear of the anchae's eave and 2 studs clear of the neighbour's gable.
- M on Samcheong-dong-gil beside Gyeongbokgung's east wall, between the palace and Bukchon (exact cell at the island stage).

**Code:** `Foliage` += `'ginkgo'`; `GINKGO` spec table; in `cluster4` the calyx colour and the no-6 × 5 rule; leader extension and fallen leaves keyed on the kind.

## 6. Pojangmacha (optional): scheme and verdict
- **Real** (`real-pojangmacha-seoul.jpg`, `real-street-food-seoul.jpg`): an orange-red tarp tent on a pipe frame; clear vinyl roll-up windows; a stainless counter with a tteokbokki tray, an eomuk pot with skewers and sundae; plastic stools; bare bulbs; a hand-painted hangul banner.
- **Brick versions:** no pojangmacha MOC exists anywhere (NOTES §4). Copy the 80105 stall carcass (counter + canopy at ≈ 1.5 × counter height) and the 80108 vignette budget (one stall + one figure in 9 × 9).
- **Sketch, 6 × 8, ≈ 180 parts incl. figure:**
  - frame: 4 LBG 3062b posts × 4;
  - tent: **Orange 85984** courses over a ridge [BL]; **Trans-Clear 60581** Panel 1 × 4 × 3 sides [BL], one rolled up (an Orange 1 × 1 round on a bar);
  - counter: LBG tiles;
  - tteokbokki: a Red / Dark Orange tile bed in a DBG plate rim with White **35480** rice cakes [BL];
  - eomuk: **4529** pot [BL DBG] with Tan **87994** skewers;
  - sundae: Black **33078** [BL];
  - stools: Red 3062b + 6141;
  - bulbs: Trans-Yellow 6141 on **71183**;
  - lettering: **떡볶이**, red bold hand-painted gothic hangul on the White tarp band (canvas px ≥ 320, a brush-painted display face, never a UI face);
  - figure: an ajumma cook with a ladle **4337**.
  - To bake: 60581, 35480, 4529, 33078, 4337, 71183.
- **Where it would go:** the alley foot, where the alley meets the street toward the square (real pochas stand on Jongno, south of Bukchon).
- **Verdict: does not earn its parts now.**
  - The island already carries 13 figures (rule 6: people are scarce). The chimaek picnic already says "Korean food".
  - The orange tent is the loudest colour on the island, next to a district whose point is grey, white and gold.
  - 180 parts is the neighbour roof's whole budget.
  - Add it only if the island review finds the alley foot empty.

## 7. Reference image `../seoul-hanok-lego.png` (gpt-image-2, 1536 × 1024)
Prompt (gpt-image-2, `--size 1536x1024 --quality high`):
> Product photo of a LEGO model on a plain light grey studio background: a traditional Korean hanok house from Bukchon, Seoul, built from real LEGO bricks at minifigure scale, every stud visible, crisp ABS plastic. An L-shaped house: a higher main wing with a hip-and-gable roof at the back, and a lower street wing with a simple gable roof running along a narrow sloping alley paved in grey tiles that steps down toward the camera in flat two-plate steps; the two roofs step down the slope and do not touch. Roofs: dark bluish grey, built as parallel lines of small 1x1 curved-top bricks running straight down hinged roof planes, every line ending at the eave in one small white round tile; below it a reddish-brown fascia strip carrying a second, staggered row of small white round tiles (rafter ends); deep eaves that rise gently at every corner by one or two plates; a heavy dark grey ridge with one thin white stripe along it and both ridge ends kicked up slightly. A small white gable triangle framed in honey-coloured wood under the main ridge. Walls on the alley side: a lower wall of light grey masonry-profile bricks whose foot steps down with the alley, then one band of brick-red bricks printed with a white Greek-key meander, then white plaster between honey-coloured round timber posts, with high horizontal square-lattice windows in tan with white paper behind. On the courtyard side: lattice doors, a narrow wooden veranda on a grey granite base with a two-plate step. A wooden double gate in the street wing with its own small tiled roof. A separate small grey stone chimney standing apart beside the main wing. At the top of the alley a tall upright ginkgo tree with a narrow egg-shaped crown of bright yellow leaves on a dark brown trunk, yellow quarter-circle tiles fallen on the paving. One female minifigure at the top of the alley in a hanbok: long dark pink skirt, white short jacket with a red ribbon bow, black hair in a low bun, holding a camera up to her face, photographing down the alley. No text, no logos, no other figures. Soft daylight, three-quarter view from the south-west and slightly above.

**Right (matches the scheme):**
- Grey lines ending in white discs, with a second white row of rafter ends on a Reddish Brown fascia: the eave reads Korean at a glance.
- Corners rising, a heavy ridge with a white stripe and kicked ends, a small white gable with a honey frame.
- Granite masonry whose foot steps down; one meander band over it; honey posts with square-lattice windows over white.
- A wooden double gate; a separate chimney; the upright yellow ginkgo with fallen quarter-circles.
- The pink-skirted visitor photographing.
- **It does not read as Kyoto.**

**Wrong against the scheme:**
- Lines on **every** stud and dots touching (ours: 2-stud pitch with troughs).
- The street wing's roof **runs into** the main roof, and a third lean-to wing appears (ours: separate roofs with a gap, two wings).
- The alley is a broad diagonal stair plaza (ours: 4 wide, flat 2-plate treads at right angles).
- The ginkgo is a pixel blob of 1 × 1 plates on a brick-stack trunk (ours: 2423 clusters on the 2 × 2 round armature).
- The visitor stands on the plinth edge (ours: on the landing studs).
- A bench on the veranda (not planned).
- The house is wider than ours.
