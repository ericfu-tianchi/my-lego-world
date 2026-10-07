# K-pop comeback stage (Gwanghwamun Square, 2026-03-21) — analysis + build scheme (for Eric's sign-off; no brick placed)
2026-10-06 · sources: `NOTES.md` (this folder), `docs/countries/korea.md` §1 (approved: decision 1 = A), real photos `real-*.jpg`, official sets `lego-*.jpg` / `ne-21339-*.jpg` · target image `../seoul-kpop-lego.png`
Units: 1 stud = 2.5 plates. **G** = island surface (base 3, G = 10 absolute). **D** = deck top = G + 3. A minifig is 12.5 plates. SNOT "pixel" = 1 stud wide × 2.5 plates tall (a 1 × 1 tile on a studs-out plate: square).
Every part number was checked against the vendored LDraw library (first line quoted where it matters). **L** = already baked in `src/parts/ldraw/` (catalogue key given where one exists), **bake** = must be baked. Colours marked **BL ✓** were read from the BrickLink catalogue today; [M] = not verified.

## 0. Decisions for Eric (top of page)
1. **Frame height — 26 plates (approved table) or 31.** At 26 the opening is only **15 plates = 1.2 minifigs** tall: the idols fill it like a doorway, and the "giant LED frame" signature turns into a portal round seven figures. At **31** (frame 16 wide, opening 10 × 20 plates = 1.6 minifigs, real band and leg ratios), it reads as a stage set, still below the gate's ridge (45) and well below the tower (96). It costs **+60 parts and 4 studs of width** (≈ 400 parts in all, inside the approved 440). Towers go from 30 to 35.
   **Recommended: 31** (option B below). The target image shows why: the frame works when it dwarfs the figures.
2. Nothing else needs Eric: placement, poses, props and mosaic follow from the approved decisions and are argued below.

## 1. Corrections to NOTES / korea.md (with evidence)
| # | NOTES / korea.md said | What the photos and moulds show |
|---|---|---|
| 1 | The frame is a frame ≈ 2 storeys, "inside: a lighting truss … vertical LED strips down the inner sides" | It is a **closed black box**, about **0.6–0.7 × its width deep** (`real-aerial-stage-gate.jpg`, `real-aerial-frame-gate-bugaksan-2.jpg`, `real-frame-front-gate.jpg`: dark side wall about two thirds the face's width). The three coloured LED panels (teal / purple / blue checker) stand **at the back of the tunnel** (`real-aerial-stage-deck.jpg`), and on D-2 the tunnel was open behind them, so the gate showed through (`real-frame-gate-through.jpg`). |
| 2 | "a diagonal checker / chevron of Red and grey" | The LED face is a grid of **0.5 × 1 m cabinets** (labelled A…JJ = **36 columns** across, rows 1…≈15; zoom crop of `real-frame-gate-through.jpg`), ≈ 18 × 15 m. A large **diagonal-band design** in coral-red and grey runs across that grid. Each band crosses cabinet edges, and alternate cabinets are a lighter or darker tone, so four tones show. The bands meet in **chevrons** with an apex in the top band. It is not a pixel checker. |
| 3 | Leg ≈ 18 % of width, top band ≈ 27 % of height | Confirmed by cabinet count: legs **6 of 36 columns (17 %)**, top band **4 of ≈ 15 rows (27 %)**, opening 24 columns × ≈ 11 rows. |
| 4 | Colours Red / Dark Red / Dark Bluish Gray / Light Bluish Gray | The real tones are **muted** (sampled in sunlight ≈ #c86a64 coral-red and ≈ #b5b5bb grey). **Sand Red does not exist in Tile 1 × 1 (BL ✓, absent)**; **Coral does (BL ✓, 36 sets)**. We keep Red / Dark Red / LBG / DBG (all BL ✓ in 3070) as the default and swatch-test Coral for the light red (see risks). |
| 5 | Mic `90370` in "Pearl Gold / Black / Flat Silver" | BrickLink known colours for 90370: **Black, Dark Blue, Light Bluish Gray, Magenta** (BL ✓). No gold or silver. 21339's gold mics are a different mould [M]. **Black** is the choice. |
| 6 | Tower girder `30646` "Support 2 × 2 × 8 Girder" | BrickLink files it as **30646a** (lattice on 2 sides, Black in 3 sets). A better fit is **`30517` "Support 2 x 2 x 10 Girder Triangular"**: **Black BL ✓**, exactly **30 plates** tall (LDraw bbox y −4…240), 4 studs on top and a tube underneath (`studs.mjs`). |
| 7 | "poses vary with minifig2 arm poses: arms up, one pointing out" | `minifig2` arms swing **only forward or back** about the shoulder pin: d 0°, f −45°, h −90°, u −135° (all 16 L/R pairs baked), plus b / k in two extra torsos. **No arm goes out to the side.** Legs are one standing mould (`fig_legs` 970c00); the head turns a quarter. "Pointing out" cannot be built. Dance = arms only (§6). |
| 8 | "From the default elevated camera the gate's roof shows over and through it" | **Over: yes. Through: only the lower part of one portal, and only if the gate stands ≤ 8 studs behind the frame face** (§7 sight-line). The "gate inside the frame" press photo needs a low camera (≤ 12°) south-south-west of the frame. |
| 9 | Height table: stage 26 / 30 | Recommend 31 / 35 (decision 1). |

## 2. The LED frame (hero of the vignette)

### 2.1 Real proportions and signature
- **LED face** ≈ 18 m wide × 15 m tall, standing on the deck. Legs 17 % of the width, top band 27 % of the height, opening ≈ 12 × 11 m. A thin **black edge studded with small lamps** runs round the outside and round the opening.
- A black box ≈ 11–12 m deep [M, from the aerial ratio]. Plain black sides with one or two thin vertical light lines.
- Inside: **two rows of moving heads** hang under the inner top truss (`real-frame-lighting-rig.jpg`). Coloured LED panels in teal / purple / blue checker stand at the back.
- **Signature:** the coral-and-grey diagonal LED face round a big square-ish opening, with the moving-head row across the top of the opening. Everything else is support.

### 2.2 Brick versions → conclusion
| Version | What it does |
|---|---|
| **41254 Trolls Volcano Rock City Concert** (official) | The backdrop picture is a **studs-out wall of tiles** on a box, under black lattice truss: our screen technique |
| **41105 Pop Star Show Stage** (official) | Black lattice towers, a **row of lights under the top beam**, speakers as bricks with round grilles |
| **41106 Pop Star Tour Bus** (official) | A free-standing speaker tower = girder + stacked speaker boxes |
| **21339 BTS Dynamite** (official) | Black box deck, seven figures in a row with mics, no screen |
| 42616 Music Talent Show (official) | Clip-light spotlights on bars; light-sabre beams (rejected: clutter at island scale) |
| Singapore MBS / Merlion (ours) | Our own proven SNOT recipe: side-stud bricks and brackets in a core, plates turned studs-out on them, tiles on those |
| MOCs of the 2026 frame | **None exist** (NOTES §4). The photos are the reference |

**Ours:** 41254's studs-out tile picture, laid out as the real diagonal-band design, on a black core built the MBS way (side-stud bricks + brackets anchoring studs-out plates). 41105's light row is upgraded to real moving-head bodies. The real 11 m box depth is cut to **4 studs** so the tunnel stays open at the back: a closed 16 × 10 black box would hide the gate's west half and eat ≈ 150 parts of black wall.
**Rejected:** 2 × 2 triangular tiles `35787` [L] for the split cabinets. They give clean 45° diagonals, but force a 2-stud grid, so the legs come out 2 or 4 wide instead of 3. Their only anti-stud is a `2-4stud4t45` half-tube, which `studs.mjs` does not detect, so `check-asm-studs` would fail them.

### 2.3 Geometry (option B, recommended; A in brackets)
- Face **16 × 11 pixels** [A: 12 × 9]: legs 3 px each (19 %) [2 px], opening 10 px × 8 rows = 10 studs × 20 plates [8 × 6 = 15 plates], top band 3 rows = 27 % [33 %].
- Face bottom = D = G + 3. Face top = G + 30.5. The black core rises to **G + 31**, so a half-plate black lip shows above the mosaic: the real black top edge.
- The core is 4 studs deep (z 0…4, north → south). The mosaic sits proud on its south face: studs-out plate + tile = 0.8 stud. From any oblique view the black plate edges show as a thin outline round the mosaic, standing in for the real lamp-studded edge. We do not spend a full stud on a border.

**Mosaic (B), row 10 at the top. R Red, D Dark Red, L Light Bluish Gray, G Dark Bluish Gray, . opening.** Rule: u = distance from the axis in columns, band k = ⌊(u + row-from-top)/2⌋, colour = [R, L, D, G][k mod 4]. This gives 2-px diagonal bands meeting in a V on the axis, mirror-symmetric (rule 7). Counts: R 28, L 26, D 24, G 24 = **96 tiles**.
```
row10  G G D D L L R R R R L L D D G G
row 9  R G G D D L L R R L L D D G G R
row 8  R R G G D D L L L L D D G G R R
row 7  L R R . . . . . . . . . . R R L
row 6  L L R . . . . . . . . . . R L L
row 5  D L L . . . . . . . . . . L L D
row 4  D D L . . . . . . . . . . L D D
row 3  G D D . . . . . . . . . . D D G
row 2  G G D . . . . . . . . . . D G G
row 1  R G G . . . . . . . . . . G G R
row 0  R R G . . . . . . . . . . G R R      ← D = G+3 (deck top)
```
[A, 12 × 9: `DDLLRRRRLLDD / GDDLLRRLLDDG / GGDDLLLLDDGG / RG…GR / RR…RR / LR…RL / LL…LL / DL…LD / DD…DD`, 60 tiles.]

### 2.4 SNOT anchoring: where a pixel row can be held (exact, in LDU; 8 per plate, 20 per stud)
- Pixel row k (0 at the bottom) has its centre at **34 + 20k LDU above G**.
- **Side-stud brick** (`87087` / `30414`: side stud 10 LDU below the brick top, `studs.mjs`) on course n (bottom at 24n): the side stud sits at 24n + 14. That meets a row centre only when **k ≡ 5 (mod 6)**: in the face, **row 5 on course 5 (G + 15…18)**.
- **Bracket `99780`** (side studs at y −2, z −14): with its foot at h plates, the side-stud centre is at 8h + 10. That meets row k when **h = 3 + 2.5k**, i.e. for even k: **rows 0, 8, 10 at h = 3, 23, 28**.
- Each studs-out backing plate therefore gets ≥ 1 real stud-in-tube joint (most get 2). The tiles clutch the backing plates' studs.

### 2.5 Stud-grid sketches
Top view, local grid (1 char = 1 stud; north up; x 0…20, z 0…16; the default camera is below the page):
```
 z  x 0 2   5        15  18 20
 0    TT[ccc][  tunnel  ][ccc]TT     TT = girder tower 2×2 (x 0–2, 18–20; z 0–2), line array hung on its south face (z 2–3)
 1    TT[ccc] r r r r r r[ccc]TT     ccc = leg core 3×4 (x 2–5, 15–18), black; LED strips on the inner faces (z 1–3)
 2    ..[ccc]  floor D    [ccc]..     r = moving heads under the beam (z 1.5, x 6–13; 8 fixtures)
 3    ..[ccc]             [ccc]..     beam 16×4 over the opening at G+23…31
 4    ..======mosaic face (proud 0.8)====..
 5    ..  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ..        ▓ = deck 16 × 5 (x 2–18, z 4–9), D = G+3, black tiles
 6    ..  ▓ i     i   i  i ▓            i = idol feet (2×1 stud windows, tiles left out)
 8    ..  ▓  i         i   ▓
 9    ..  ▓▓▓▓▓▓▓[thr ]▓▓▓▓▓            thrust 4 × 3 (x 8–12, z 9–12)
11           [  i  ]                   lead idol on the thrust
13       ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─         barrier: 3 × Fence 1×4×1, Black (x 4–16, z 13)
15          f         f                fans at x 7 and 13 (z 14–15), facing north
```
Front elevation (from the south; 1 char = 1 stud across, 1 row = 2.5 plates):
```
G+35  ▄▄                  ▄▄      tower cap (2×2 plate + tile)
G+33  ██▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀██      2×4 hanger plate cantilevered south; the array hangs below it
G+31  ║║ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ ║║      black core lip (top edge)
G+30  ║║[GGDDLLRRRRLLDDGG]▐▌      top band: 3 pixel rows
      ▐▌[RGGDDLLRRLLDDGGR]▐▌      ▐▌ = line array: 5 × Brick 1×2 with Grille, Black (G+18…33)
G+23  ▐▌[RRGGDDLLLLDDGGRR]▐▌
      ▐▌[LRR rrrrrrrr  RRL]▐▌      r = moving heads hung under the beam (G+20…23)
      ▐▌[LLR|         |RLL]▐▌      | = LED strip on the inner wall (seen at an angle)
      ║║[DLL|  opening |LLD]║║      opening 10 studs × 20 plates
      ║║[DDL|  10 × 20 |LDD]║║
      ║║[GDD|         |DDG]║║      idols 12.5 plates tall stand in front
      ║║[GGD|         |DGG]║║
G+3   ║║[RRG|_________|GRR]║║      deck top D
G     ██ ▓▓▓▓ deck skirt ▓▓▓ ██     30517 girder (G…G+30) on the paving studs
```

### 2.6 Level table (B; plates above G)
| Plates | Element | Part types (verified LDraw no.; L / bake) | Colour |
|---|---|---|---|
| 0–3 | leg cores 3 × 4, course 0 | Brick 2×4 `3001` [L] + Brick 1×4 `3010` [L] | Black |
| 3–4 | bracket layer: anchors pixel row 0 | Bracket 1×2–1×2 Up `99780` [L, BOM] ×2 front + Plate 1×4 `3710` [L] behind | Black |
| 4–6 | 2 plate layers, joints staggered | Plate 2×4 `3020`, 1×4 `3710` [L] | Black |
| 6–15 | 3 brick courses | `3001` + `3010` [L], alternating orientation per course | Black |
| 15–18 | side-stud course: anchors row 5 (south face) and the LED-strip plates (inner faces) | Brick 1×1 with Stud on 1 Side `87087` [L, BOM] ×3 south ("0 Brick  1 x  1 with Stud on 1 Side") + ×2 inner; `3001` behind | Black |
| 18–23 | brick course + 2 plates | `3010`, `3001`, `3020`, `3710` [L] | Black |
| 3–23 | **leg mosaic backing**: 3 vertical studs-out plates per leg (rows 0–7), anchored at rows 0 and 5 | Plate 1×8 `3460` [L] | Black |
| 3–23 | **leg mosaic**: 24 px per leg | Tile 1×1 with Groove `3070b` [L] | per the map (BL ✓ all four) |
| 23–24 | beam layer 1 over the 10-stud opening, bearing 3 studs on each leg; front row = brackets for row 8 | Plate 2×16 `4282` [L] (back) + `99780` ×4 [L] in the front row, Plate 1×4 `3710` between | Black |
| 24–25 | beam layer 2, joints staggered against layer 1 (a long member is two staggered plate layers, rule 2) | Plate 2×12 `2445` + 2×4 `3020` ×2 [L] | Black |
| 25–28 | beam brick course | Brick 1×8 `3008` [L] ×8 (two per row, joints offset row to row) | Black |
| 28–29 | bracket layer for row 10 | `99780` ×4 [L] front + Plate 2×16 `4282` [L] back | Black |
| 29–31 | top plate + tiles = black lip and roof | Plate 2×16 `4282`, Tile 2×4 `87079` ×8 [L] | Black |
| 23–30.5 | **band backing**: row 8 horizontal, rows 9–10 one 2-row plate | Plate 1×12 `60479` + 1×4 `3710` (row 8); Plate 2×16 `4282` turned studs-out (rows 9–10) [L] | Black |
| 23–30.5 | **band mosaic**: 48 px | `3070b` [L] | per the map |
| 20–23 | **moving heads**: 8 fixtures hung by their stud in the beam's bottom tubes, lens facing south | Brick 1×1 with Headlight `4070` [L, `brick_headlight`] upside down + Tile 1×1 Round `98138` [L] on the recessed stud | Black body · Trans-Clear lens |
| 3–23 | **inner LED strips**: on each leg's inner face (z 1–3), a 2-wide studs-out plate on the inner side studs (course 15) + a bracket at h 3 turned inward; tiles in a 2-colour checker | Plate 2×8 `3034` [L]; `3070b` ×16 per side | W: **Dark Purple / Medium Lavender**; E: **Dark Turquoise / Dark Azure** (BL ✓ in 3070) |
| 3 | tunnel floor between the legs (z 0–4) | Plate 2×10 `3832` [L] + Tile 2×4 `87079` [L] | Black |

**Which side faces the camera:** the LED face faces **south**, toward the crowd, Sejong and our default camera, exactly as the real one. The back of the legs and beam is plain black brick. The back of the tunnel is open (the real panels at the back are moved onto the inner walls; correction 1).

## 3. Speaker towers (×2)
- **Real:** a black truss tower at each front corner of the box, taller than it, with a **line array** (a slightly J-curved column of black boxes) hung high, and lighting pods lower down.
- **Brick versions:** 41106 (girder + stacked speaker boxes), 41105 (girder towers carrying speakers).
- **Ours:** a single `30517` girder: Black **BL ✓**, 30 plates, the real truss look. It carries a cantilevered 2 × 4 plate, and five grille bricks hang under it (stud-in-tube downward, each held by the one above).

| Plates | Part types | Colour |
|---|---|---|
| 0–30 | Support 2×2×10 Girder Triangular `30517` [**bake**] ("0 Support  2 x  2 x 10 Girder Triangular"; its bottom tube sits on the paving studs) | Black |
| 30–33 | Brick 2×2 `3003` [L] | Black |
| 33–34 | Plate 2×4 `3020` [L], 2 studs cantilevered south | Black |
| 34–35 | Tile 2×2 `3068b` [L] + Tile 1×2 `3069b` [L] | Black |
| 18–33 | line array hung under the cantilever: 5 × Brick 1×2 with Grille `2877` [L, `brick_grille_1x2`], grille facing south | Black (BL ✓) |

- Footprint 2 × 3 each (2 × 2 girder + 1 row of array). Height **G + 35** (A: G + 30, girder alone + tile). **≈ 9 parts each.**
- **Connections:** girder tube on ground studs; brick on girder studs; hanger plate on brick studs; top grille brick's studs in the hanger's tubes, each lower grille brick's studs in the tubes of the one above. Nothing rests loose.

## 4. Deck, thrust, barrier
- **Real:** a low black main deck in front of the frame (covered white on D-2 — protective sheet [M]), a short runway, black crowd barriers.
- 21339 builds the deck as a black box; its figures stand on studs (axle ends).
- **Ours:**
  - **Deck 16 × 5 + tunnel floor 10 × 4 + thrust 4 × 3**, top at D = G + 3, Black.
  - Skirt: 1-wide Black bricks round the perimeter (`3009` 1×6, `3010` 1×4) [L], with 2 × 2 bricks `3003` as internal posts under the plate joints.
  - Top: Plates 2×8 `3034` / 2×6 `3795` [L] laid in two directions, then Black tiles `87079` / `3068b` / `3069b` [L].
  - **A 2 × 1 window is left untiled under each idol's feet**, so each figure stands on two real studs (minifig2 snaps the feet to x on a grid line and z on a cell centre). This is the LA pier "tile left out" rule.
- **Barrier:** 3 × Fence Lattice 1×4×1 `3633` [L, `fence_1x4`] (**Black BL ✓**) on the square paving studs, x 4–16, 2 studs south of the thrust. Their bottom tubes sit on the ground studs (this needs plain plates there in the island paving, a 1 × 12 strip with no tiles).
- **Stairs:** cut (the towers stand where the real side stairs were).
- **≈ 63 parts** (skirt 12, posts 4, plates 12, tiles 32, fences 3).

## 5. Figures: what minifig2 really supports

### 5.1 Arm poses (from `tools/ldraw/minifig-asm.mjs` and `src/parts/ldraw/minifig-rig.ts`)
Grip centres are in torso coordinates, measured from the neck (studs; +z = front). The head spans y 0…1.2.
| pose | elevation | R-hand grip | clip bore | reads as |
|---|---|---|---|---|
| d | 0° | (−1.24, −1.65, 0.87) | diagonal | arm down |
| f | −45° | (−1.07, −0.68, 1.51) | **vertical** | forearm level, forward: holding something upright |
| h | −90° | (−0.88, +0.45, 1.27) | 45° diagonal | arm level, forward, hand at mouth height |
| u | −135° | (−0.77, +1.08, 0.28) | **front–back** | arm straight up, hand above the head |
- No arm moves sideways, the legs are fixed, and the head turns ±90°.
- **Is a "dance" legible? Only as arms, and only if all seven do it together.** At island distance a single `u` arm is the one pose that reads (21339's figures read as a group by standing together, not by posing). K-pop's own signature is **kalgunmu**, perfectly synchronised choreography. So all seven strike **one mirrored move**: the outer arm straight up, the other down. A V of identical poses reads as choreography; seven different poses read as a crowd.
- All the pairs needed are baked: `du` (west wing: the figure's right arm, at world −x when facing south, goes up), `ud` (east wing), `uu` (the centre pair), `uf` (mic holders). `figtorso_*` / `fighands_*` ✓.

### 5.2 Formation (rot 0 = facing south, toward the camera, rule 6)
| Idol | feet (x, z) | pose L/R | holds | hair (mould · colour) |
|---|---|---|---|---|
| 1 lead, thrust tip | (10, 10.5) | u / f | mic R | 3901 · Black [L] |
| 2 | (7, 8.5) | d / u | — | 62810 · Black [L] |
| 3 | (13, 8.5) | u / f | mic R | 40233 · Dark Brown [L] |
| 4 | (4, 6.5) | d / u | — | 25409 Hair Mid-Length Tousled with Side Part · Black [bake] |
| 5 | (16, 6.5) | u / d | — | 21268 Hair Short Swept Back with Sideburns · Dark Brown [bake] |
| 6 | (8, 5.5) | u / u | — | 3277 Hair Short Wavy Parted on Right · Black [bake] |
| 7 | (12, 5.5) | u / u | — | 36762 Hair Thick and Messy · Dark Tan [bake] |
- **Outfit:** legs Black; torso Black with the one L2 print (Dark Red Joseon-military front panels, Pearl Gold buttons, black belt: 3 colours on black); arms Black; Light Nougat head and hands; the planned "idol smile" face.
- **Hair:** no mould + colour pair matches a 21339 member (RM 23186 Medium Azure, Jin 36762 Dark Orange, Jimin 25972 Dark Tan, V 26139 Dark Tan are avoided). Hair colour availability is [M] for the four to bake; fall back to Black.
- **Spacing:** ≥ 1 stud of air between any two figures' 2 × 1 boxes. Raised arms clear the beam (hand top ≈ D + 12 = G + 15 < moving heads at G + 20).
- All nine stage figures register as one `Sites` group (the Shanghai precedent).

### 5.3 Mic
- **`90370` "Minifig Microphone"** [bake], **Black (BL ✓)**. Bbox y −12.8…18 LDU: the ball at the top (centre y −7), the handle below.
- Held upright in an **f** hand: the clip bore is vertical (axis (−0.17, −0.99, 0), |dot y| 0.99 ≥ 0.9 ✓).
- New `HOLD_DEFAULTS.mic = { pose: 'f', gp: [0, -0.32, 0], shaft: true, axis: 'y' }`: the hand closes round the handle 0.32 studs below the box centre (handle mid-length y ≈ +9 LDU).
- Ball at ≈ neck height, 1.5 studs in front: exactly how 21339's figures hold theirs (`ne-21339-stage-side.jpg`).
- An `h` pose (mic to the mouth) would need a pre-turned `figheld_mic_h` (45°). Not worth it: in `h` the hand already sits at mouth height but the arm hides the face from the front.

### 5.4 Light stick: the three candidates tested against the moulds
| Candidate | What the mould says | Verdict |
|---|---|---|
| A `32828` Plate 1×1 Round with Bar | The bar (r 4 LDU, hand-sized) sticks out **sideways**, x 10…30, at plate height. Gripped, the round plate lies flat beside the fist, or stands on edge if pre-turned: a disc, not a globe | ✗ reads as nothing |
| **B `64567a` Minifig Lightsaber Hilt + globe** | **Documented grip zone**: "!HELP Grip is centered at y=19.25, between y=12.5 and y=26". The hilt top is a stud primitive (`studs.mjs`: stud at y 0 pointing up), so a round brick's underside clutches it: a real stud joint. Length 40 LDU = 2 studs. **Black BL ✓** (14 colours) | **✓ chosen** |
| C `102498` Tool Wand with Hollow Stud at Tip | Real stud at the tip (y −50), but the shaft is 58 LDU ≈ 3 studs long: a wand, not a light stick. Colours [M] | ✗ too long |
- **Globe:** **Brick 1×1 Round `3062b`** [L, `round_1x1`] on the hilt's top stud, **Trans-Purple (BL ✓)**. It is near-spherical in outline (1 × 1.2 studs) and lit-purple, as the real ARMY Bomb glows. The trans trap does not apply to one 1-stud part. Fallback: White 3062b (BL ✓) if purple reads as a sweet.
- **The pose finding:** a fan raising a stick overhead uses `u`, whose clip bore runs **front–back** (axis (0, 0, 1)). **A minifig cannot hold a stick upright with its arm raised.** The real clip makes the stick point **forward**, which is what a fan does anyway: she aims it at the stage.
  - Both parts are pre-turned the existing way (`minifig-asm.mjs` `HELD`, like `surfboard_up` / `dumbbell_x`): `armybomb_hilt_z = ['64567a', Rx(90°)]` (hilt along z, top stud forward) and `armybomb_globe_z = ['3062b', Rx(90°)]`. They are placed like `holdUmbrella`: hilt in the hand, the globe on the hilt's stud end.
  - New `HOLD_DEFAULTS.armybomb_hilt_z = { pose: 'u', gp: [0, 0, -0.16], shaft: true, axis: 'z' }` (gp = the !HELP grip centre, 3.25 LDU off the box centre, along the turned axis).
- **Fans** (rot 2, facing north, backs to the camera — allowed because watching is the action):
  - (7, 14.5): pose `du`, the stick in her R hand; Hair Long Straight `12890` Black [L]; casual torso in **Medium Lavender** (the borahae colour); legs Dark Blue.
  - (13, 14.5): pose `ud`, the stick in his L hand; `40233` Black [L]; torso Dark Bluish Gray, legs Black.
  - Both raised arms are on the **outside**, so each globe shows clear of the head from the default camera. The torsos are the two "casual" prints already budgeted in korea.md §1.8: no new print.

## 6. Placement on the island and the sight-line question

### 6.1 Placement
- On the square's paving, the **frame face 8–9 studs south of the gate's front** (a road band between, as Yulgok-ro). The frame's centre sits **≈ 10 studs west of the gate's axis**, as it really stood.
- From due south this keeps the **centre portal and the 光化門 plaque clear** (the east tower stands just west of the centre arch). The **opening frames the gate's west portal**.
- Exact x is fixed at the island stage from the palace scheme's arch positions.
- The stage is one `Sites` group of 20 × 16.

### 6.2 Does the frame read as "the gate seen through it" from the default camera? (south, el 32°, tan = 0.625)
Side section, cut along the frame's axis (1 char ≈ 1 stud along z; heights in plates):
```
 plates                                                 camera ↗ (32°, far south)
  45 .                       ___ridge___              gate roof: always visible ABOVE the frame
  31 .   ┌──────┐         ..'           '..           ray over the frame top: visible above 31 − 1.56·d plates at d studs behind the face
  23 .   │ band │ ....''''  ┌─────────────┐           at the gate face (d ≈ 8): everything above ≈ 18.5 plates shows over the band
     .   │      │''''.....  │ pavilion    │
  17 .   ├──────┤ ray below │  (visible)  │           ray under the band: at the tunnel back (d 4) ≤ 16.8 plates,
     .   │  op  │  the band │.............│           falling to ≈ 10.5 plates at the gate face
  10 .   │ ening│  ......''' │ arches (lower│           → through the opening: the bottom ≈ 10 plates of the west portal
   3 .   │_deck_│'''         │ half visible)│
   0 ....└──────┘  road     └──base────────┘
        face  back(d4)       gate face (d≈8)
```
- **Above the frame:** the gate's pavilion and both roofs show over the top band from every default view (the ridge at 45 ≫ 31).
- **Through the opening:** only the gate face below ≈ 10 plates within the opening's x-range, i.e. the **lower half of the west portal**. The band hides the gate's 10–18-plate zone in that x-range. The idols stand in front of the lower opening, so in practice the opening shows idols + light rig + paving + a sliver of granite.
- **Verdict:** from the default camera it reads as **"the stage in front of the gate, the gate rising behind it"**, which is also how the aerial press photos read. The real "gate held inside the frame" shot needs **el ≤ 12°** from **south-south-west** (az ≈ −0.6 rad, on the frame-to-portal line). Make that the **hero render** of the element pack, not a promise for the default view.
- Pulling the gate closer than 8 studs or raising the frame would not change this: the band always cuts the gate's middle at 32°.

## 7. Footprint, height, parts
| Element | Footprint | Height (above G) | Parts B | Parts A |
|---|---|---|---|---|
| Frame: mosaic 96 [60] + backing 9 + anchors ≈ 18 | 16 × 4 [12 × 4] | 31 [26] | ≈ 123 | ≈ 85 |
| Frame core: legs 2 × ≈ 24, beam ≈ 36 | — | — | ≈ 84 | ≈ 70 |
| Inner LED strips (32 tiles + 2 plates + anchors) | — | — | ≈ 38 | ≈ 28 |
| Moving heads 8 × 2 | — | 20–23 | 16 | 12 |
| Speaker towers 2 × 9 | 2 × 3 each | 35 [30] | 18 | 14 |
| Deck + thrust + barrier | 16 × 12 | 3 | ≈ 63 | ≈ 55 |
| 7 idols + 2 fans (6 each) + 2 mics + 2 hilts + 2 globes | — | 12.5 on the deck | 60 | 60 |
| **Total** | **20 × 16** [16 × 14] | **35 / 31** [30 / 26] | **≈ 400** | **≈ 325** |
- Inside korea.md's ≈ 440 in both cases.
- Specialty moulds: brackets, side-stud bricks, headlight bricks, grille bricks, girders, fences, minifig accessories ≈ 55 (≈ 14 %). That is above the 8 % floor.
- **No new print** (the idol torso, face and two casual torsos are already in the 11 planned designs).

## 8. Bake list
- **Moulds:** `30517` (girder), `90370` (mic), `64567a` (hilt), hair `25409`, `21268`, `3277`, `36762`.
- **Pre-turned held parts** (`minifig-asm.mjs` `HELD`): `armybomb_hilt_z` (64567a), `armybomb_globe_z` (3062b).
- **Catalogue entries** (`ldrawPart`) for parts baked only as BOM members so far, if they are placed outside an assembly: `99780`, `87087`, `4070` (exists), `2877` (exists), `3633` (exists).
- **Assembly:** `tools/ldraw/asm-seoul-stage.mjs` → frame + towers + deck as one LDraw model, exploded with `bp.assembly()` (rule 12). Figures stay in the scene via `minifig2`.
- **Grammar:** `HOLD_DEFAULTS` gains `mic` and `armybomb_hilt_z`, plus a `holdLightStick()` helper on the `holdUmbrella` pattern.

## 9. Risks, each with a fallback
| Risk | Fallback |
|---|---|
| Red C91A09 is louder than the real muted coral; the face may shout over the gate (rule 5: never louder than Kyoto) | Swatch-test in the first render: Coral (BL ✓ in 3070) for R, or drop to **two-tone Dark Red / LBG** with DBG as the dark-cabinet tone |
| 2-px bands on a 16-px face read as a red-grey checker, not chevrons | Widen bands to 3 px (the rule's ⌊…/2⌋ → ⌊…/3⌋); re-render the face alone with `?only=` |
| Upside-down `4070` moving heads: check-asm-studs must accept a stud pointing **down** into a tube (any orientation is supported per CLAUDE.md, but confirm) | Hang them on Plate 1×1 with Clip Light `4081b` [bake] clipped round a black Bar 3L under the beam |
| The hilt + globe pre-turn: `holdUmbrella`-style stacking assumes a vertical bar; the z-turned stick needs its globe position computed along z | Bake the globe with its offset in the same HELD entry frame, placed from `grips` + 2 studs along the facing; check a close-up from front and side (rule 8) |
| `u`-pose fans with backs to the camera: the stick points away, so only the purple end shows over the head | Turn each fan side-on (rot 1 / 3), stick toward the stage: arm, stick and globe in profile |
| Hair moulds `25409 / 21268 / 3277 / 36762` may not exist in the chosen colours | Black for all; variety comes from the mould shapes |
| 9 figures + the deck crowd the square in the island shot | korea.md trim order: one fan first, then the guard; the idols stay 7 |
| 31-plate frame (option B) competes with the hanok ridges (33) in the height table | It sits in front of the gate, not beside the hanok; check the three tiers in the quadrant renders; fall back to A |

## 10. Target image `../seoul-kpop-lego.png` (gpt-image-2, 1536 × 1024)
Prompt (verbatim):
> A concert stage built as a LEGO element at minifig scale, on a plain grey studio background, real visible LEGO bricks, studs, tiles and minifigures, studio product photo, camera from the front slightly elevated about 30 degrees. The signature: a giant square portal frame 16 studs wide and about 31 plates tall, its front face a studs-out mosaic of 1x1 square tiles forming large diagonal chevron stripes in red, dark red, light bluish grey and dark bluish grey; black sides 4 studs deep and a thin black top edge; a rectangular opening 10 studs wide in the middle. Under the top beam inside the opening hangs a row of eight small black moving-head spotlight bricks with clear lenses; the inner side walls of the opening carry vertical LED strips of 1x1 tiles in purple, lavender, dark turquoise and azure checker. Either side of the frame stands a tall slim black lattice girder tower, taller than the frame, with a hanging column of black speaker grille bricks. In front, a low black tiled stage deck with a short central thrust runway. On the deck seven minifigure idols in identical stage outfits: black jackets with dark red Korean military-style front panels and small gold buttons, black trousers, plain smiling faces, varied short black and dark brown hairpieces, standing in a V formation, all doing the same synchronised dance pose with one arm straight up; the front centre one and one other hold small black microphones in front of their chins. In front of the stage a black lattice crowd fence, and two fan minifigures seen from behind raising black light sticks with glowing purple round tops toward the stage. Behind the frame, a traditional Korean palace gate with a grey tiled hipped roof and white ridges and a granite base with three arches, partly visible through and above the frame. No logos, no text, no letters, no names.

**Right (keep):**
- the tile-mosaic face with diagonal chevron bands in red / dark red / LBG / DBG, its apex on the axis, black top edge;
- the row of black moving heads with clear lenses under the beam;
- purple / lavender / azure LED strips on the inner walls;
- slim black girder towers with hung grille-brick line arrays;
- the black tiled deck with a thrust;
- seven identical outfits (black + dark red panels + gold buttons) doing **one synchronised arm-up move**, which proves the "kalgunmu reads" argument;
- two mics held upright in front of the chin;
- fans from behind with purple globes on black handles.

**Wrong against the scheme:**
- **Mosaic scale:** the image uses ≈ ½-stud pixels (≈ 30 across). Ours has 16 one-stud pixels, so the bands will be coarser.
- **Proportion:** its frame is ≈ 3 minifigs tall, its opening ≈ 2.5. Ours is 1.6 (B) or 1.2 (A). The image is the strongest argument for decision 1 = B, and for not going below it.
- **The frame has no depth** (ours: 4 studs, black sides).
- **Legs are posed mid-stride** (ours: the one standing mould).
- **Fans hold the sticks upright with the arm raised.** No minifig clip can do that: ours point forward toward the stage (§5.4).
- **The gate sits dead centre, framed in the opening** — the low on-axis hero view, not the 32° default; and ours is offset west (§6).
- The thrust is a long runway (ours: 4 × 3).
- Floor monitors are added: cut, they read as boxes.
