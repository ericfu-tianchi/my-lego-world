# Hollywood Hills: landmark analysis and build scheme (hill, letters + mast, Griffith Observatory, Walk of Fame)
2026-10-04 · research and scheme only, no brick placed · for Eric's sign-off (CLAUDE.md checkpoint 1)
Sources: `NOTES.md` here, `../la-griffith/NOTES.md`, `../la-icons/NOTES.md` §2, `../la-real/NOTES.md`, `docs/countries/usa.md` §1. Units: 1 stud = 2.5 plates sideways; heights in plates above the island surface unless "spur-relative". Part numbers checked in the vendored LDraw library on 2026-10-04; **cat** = already in `src/core/catalog.ts`, **bake** = must be baked; **[colour?]** = I could not confirm that LEGO made that mould in that colour.

---

## 0. Decisions for Eric (read first)

1. **Height table change (needed).** usa.md §1.5 puts the Griffith dome (44) **above** the letters (34–40). In reality the sign stands ~80 m above the observatory dome, and the playbook asks for heights "ordered as in reality". Proposed: **spur 8 (not 16), Griffith main dome 37 + finial 39, letters 31–42.5, summit 44 (not 40), mast top 62 (wheel 66 stays the hero).**
2. **Footprint change (needed).** At the default camera (el ≈ 0.36), anything of Griffith standing in front of the letters hides them. A 31-plate building 13 studs in front hides everything up to ≈ 42 plates behind it. So the letters and the observatory have to sit **side by side**, the way they really do: Griffith is 2.6 km south-east of the sign. The hills therefore need **≈ 50 × 36** in the back-right, not a 27-wide third: letters on the west half, high up; Griffith on the east half, low and in front.
3. **Griffith becomes ≈ 26 × 26 with its lawn (usa.md said ≈ 22 × 10).** The only clean telescope-slit solution (§3) makes a side dome 5 wide. To keep main dome ≈ 2–2.5 × a side dome, the main dome is 10 (four 76776 quarter domes), and real plan ratios then give a 26-wide building.
4. **Five windows per wing, not seven.** Every photo here (`real-south-2006.jpg`, `real-park-view.jpg`) shows **5 tall windows per wing**. The "7" came from BenBuildsLEGO's stylisation.
5. **Star colour.** LEGO "Coral" (Vibrant Coral, #FF698F) is much louder than the real salmon terrazzo (#C98A8A). Recommendation: keep Coral, but print it on a **Black** tile (charcoal), so the star reads as a small accent rather than a pink blob. Alternative: a Medium Nougat star (truer, but it may read gold at thumbnail size).

---

## 1. The hill (terrain, chaparral, trail)

### 1.1 Real thing
- Mount Lee rises straight out of the flat basin with no foothills. The **summit is rounded and lumpy**, and the radio mast stands on it. The ridge runs E–W with several rounded peaks; Mount Hollywood (behind the observatory) is lower and further east.
- The **south face is steep, about 35–40°**. It is cut by **pale switchback fire roads** and by the contour path that runs along the letters (`real-hill-view.jpg`, `real-behind-scaffold.jpg`).
- Dry-season colour (`real-straight-on.jpg`): **dark olive scrub** (Olive Green / Dark Green clumps, densest in gullies) on **golden-brown dirt and grass** (Dark Tan; Medium Nougat in sun). There are a few grey-green sage patches and **dark scrub bands** (Reddish Brown / Dark Brown in shade). There are no palms and no bright green.
- The observatory stands on a **levelled terrace on a lower spur** with lawns in front and chaparral falling away on all sides (`real-park-view.jpg`).
- **Signature:** a dark, rounded, brushy hill with pale zigzag trails, never a smooth ramp.

### 1.2 Brick versions
| Version | What it does for the hill |
| --- | --- |
| Brickman 2016 (minifig, `brickman-sandyem-hill-detail.jpg`) | Dark Tan **plate terraces with irregular one-plate contours**, plus a gravel trail of 1×1 round plates. It reads as a hill because no two contours are parallel. Weak: no slopes, no scrub mass, so it is flat in colour. |
| LEGO Ideas imaxedlp | Tan terraces with slopes and wedges. Wrong colour (beach Tan) and palms on the hill. |
| Rebrickable MOC-25470 | Stepped Green/Dark Green slope. Wrong (spring green), and the steps read as a pyramid. |
| Ignat Britvin (Griffith) | **Olive Green rocky slopes of wedges and slopes**, Dark Green cone trees. A good scrub read. |
| BenBuildsLEGO skyline | Olive Green hill block with no texture: an Architecture abstraction. |
| LEGOLAND Miniland | Real turf, not bricks. Only the composition is useful (sign below the observatory). |

**Conclusion.** We copy Brickman's **irregular contours** and Britvin's **Olive Green slope faces**, and add what neither does:
- risers softened by real slopes chosen by riser height;
- dark scrub bands in the risers themselves;
- dense chaparral clumps on the tread edges, so the step lines break up;
- a rounded summit of curved slopes;
- pale switchbacks that climb across the face.

The hill is two bricks of shell over a hollow core (§1.4), so the series rule "about two bricks of earth" also holds for raised ground.

### 1.3 Stud-grid sketch: top view (1 char = 2 studs; local hx 0–49 west→east, hz 0–35 north→south; island x ≈ 30–79, z ≈ 0–35)
```
hz  hx 0   4   8   12  16  20  24  28  32  36  40  44  48
 0     R  R  R  R  R  R  R  R  R  R  R  ^  ^  ^  R  R  R  R  R  R  R  R  R  R  R     R ridge 34-40   ^ summit plateau 44
 2     R  R  R  R  R  R  R  R  R  R  R  ^  ^  M  ^  r  r  r  r  r  r  r  r  r  r     M mast (3x3) + dish rack
 4     s  R  R  R  R  R  R  R  R  R  R  ^  ^  ^  r  r  r  r  r  r  r  r  r  r  r     r Mt Hollywood rise 20-36 (65° rock + scrub)
 6     s  s  t  t  t  t  t  t  t  t  t  t  t  t  s  r  r  r  r  r  r  r  r  r  r     t trail (Medium Nougat 1-wide)
 8     s  s  |  |  |  |  |  |  |  |  |  |  |  t  s  s  ·  ·  ·  ·  ·  ·  ·  s  s     | letter posts on the bench (31-35)
10     s  s  H  O  L  L  Y  W  W  O  O  D  .  t  s  s  ·  ·  D  D  D  D  D  ·  s     letters hang over hz 10-11
12     s  s  t  t  t  t  t  t  t  t  t  t  t  t  s  ·  ·  D  D  D  D  D  D  ·  ·     D main drum 12x12 + dome 10
14     s  s  s  s  s  s  s  s  s  s  s  s  s  s  s  ·  ·  D  D  D  D  D  D  ·  ·
16     s  o  s  s  s  t  t  t  t  t  s  s  s  s  s  ·  ·  ·  ·  r  r  ·  ·  ·  ·     r rotunda (Sand Green) over the pavilion
18     s  s  s  s  t  s  s  s  s  s  s  s  s  s  s  d  d  w  w  P  P  P  w  w  d  d   d side drum + slit dome  w wing  P pavilion
20     .  s  s  t  s  s  s  s  s  s  s  s  s  s  s  d  d  w  w  P  P  P  w  w  d  d
22     .  .  s  t  t  t  t  t  t  s  s  s  s  s  s  ·  ·  ·  c  ·  ·  c  ·  ·  ·  ·     c cypresses at the door
24     .  .  .  s  s  s  s  s  s  t  s  s  s  s  s  g  g  g  g  =  =  g  g  g  g  g     g lawn panels (Green)  = axis path
26     .  .  .  .  s  s  s  s  s  t  s  s  s  s  s  =  =  =  =  ◎  ◎  =  =  =  =  =     ◎ round island + Astronomers Monument
28     .  .  .  .  .  s  s  s  s  t  s  s  s  s  s  g  g  g  g  =  =  g  g  g  g  g
30     .  .  .  .  .  .  .  s  s  t  s  s  s  s  s  g  g  g  g  =  =  g  g  g  g  g     spur terrace edge at hz 31
32     .  .  .  .  .  .  .  .  s  s  s  s  s  s  s  s  s  s  s  s  s  s  s  s  s  s     retaining slope 8 → 1 (65° + 45° + scrub)
34     .  .  .  .  .  .  .  .  .  ★  ·  ·  ★  ·  ·  ★  ·  ·  ★  ·  ·  ·  ·  ·  ·  ·     ★ Walk of Fame strip (island z 36-38)
```
`s` = south face (30 → 1 plates, ≈ 2 plates per stud), `o` = live oak, `·` = level terrace or tread, `.` = island ground (boulevard / lawn strip, not part of this element). The Walk of Fame strip sits at the foot, under the spur, on island ground.

### 1.4 Side profile: north–south cut through the letters (hx 12; 1 char = 1 stud across, rows = 3 plates)
```
plates
 44                                        summit 44 (behind, at hx 26-32)
 40  RR                                    ridge: 2-plate steps, curved slopes 2x1 / 2x2 (Dark Tan) → rounded crest
 37  RRR      ┌ letter top 38.5-42.5
 34  RRRs|L   │ letters hang 1-1.5 plates over the bench, posts behind
 31  RRRss|L  └ bench (contour path) 31 → 35, steps up 1 plate per letter, Medium Nougat
 28  RRRssst                               trail leg along the bench
 25  RRRsssss/                             3-plate risers: 33° 3x1/3x2 slopes (1 in 2 risers), bare Dark Tan / Reddish Brown cuts between
 19  ...    sssss/                         plant clumps on every second tread edge
 13  ...       sssss/
  7  ...          sssss/
  1  ...               sss/_  foot → boulevard (island ground 0, plinth below)
     hz 0         10          20          30
```

### 1.5 Scheme table (plates above the island surface)
| Plates | Element | Part types · first pick → fallback (LDraw, status) | Colour |
| --- | --- | --- | --- |
| island −6..0 | ordinary island earth and plinth (series) | packer bricks | series strata |
| 0 → h(x,z) | **hill shell**: every column filled only from h − 6 to h (two bricks); the core is hollow. Layer rings overlap from tread to tread, so each brick is held from below by the ring under it | packer: Brick 2×8 / 2×4 (3007 / 3001 cat); 1-plate top in tread colour (Plate 1×N, 2×N cat) | hidden: Dark Bluish Gray; top brick of each riser **Dark Tan**, ~30 % **Reddish Brown** by `patch()` (dark scrub bands) |
| 1–30 | **south face**: treads 2–3 deep, **3-plate risers** (whole bricks, packer-friendly, rule 10), contours drawn from a smooth heightmap + low-frequency noise so no two contours run parallel for > 4 studs | riser cover, chosen by tread depth: Slope 33° 3×1 / 3×2 (**4286 cat**, **3298 cat**) on ≥ 3-deep treads → Slope 45° 2×1 / 2×2 (**3040b cat**, **3039 cat**) on 2-deep treads; about 1 riser in 2 covered, the rest left as cut earth | slopes **Olive Green** (scrub-covered face) 60 %, Dark Tan 40 % |
| 8–20 | **steep cuts** under the spur and behind Griffith (rock) | Slope 65° 2×1×2 (**60481a cat**), Slope 45° 2×2 | Dark Bluish Gray (rock, a few only, per la-real) + Olive Green |
| 30–44 | **ridge and rounded summit**: 2-plate risers | Slope Curved 2×1 (**11477 cat**), Slope Curved 2×2 (**15068 cat**) → Slope Curved 3×2 (24309 bake) | Dark Tan, summit Medium Nougat dirt patch round the mast |
| treads | ground | Plate 1×N / 2×N top layer | **Dark Tan** 70 %, Medium Nougat dirt 10 %, Olive Green under clumps 20 % |
| treads | **trail**: 1 wide, foot → three switchbacks → the bench along the letters → summit (sketch `t`); crosses a riser only at a bend, by a ramp | Tile 1×2 / 1×3 / 1×4 (**3069b**, **63864**, **2431** cat); ramp = Slope 33° 3×1 (4286) | **Medium Nougat** |
| treads | **chaparral, ≈ 60 clumps** on tread edges (where step lines would show) and in gullies: A dark scrub = Plant 1×1 round 3 large leaves (6255 bake) under Plant Leaves 4×3 (**2423 cat**), ×30; B low scrub = two Plate 1×1 Round with 3 Leaves (**32607 cat**), ×15; C sage = 32607, ×6; D dry grass = Plant Grass Stem (**15279 cat**), ×8; E bush = Plant Bush (6064b bake) on gully floors, ×6 | A Olive Green over Dark Green · B Dark Green · C **Sand Green [colour?]** · D Dark Tan [colour?] → Tan · E Dark Green |
| 14–30 | **one coast live oak** on the west shoulder (sketch `o`), never touching another plant | `tree(kind 'oak', 'M')`: new foliage kind; trunk 2×2 round, two forks, crowns of Plant Leaves 6×5 (**2417 cat**) + 4×3 (2423) | trunk Dark Brown, leaves **Dark Green** + Olive Green tips |
| 8 | **Griffith spur terrace** 28 × 26 (hx 22–49, hz 6–31), level; its south edge falls 8 plates to the boulevard by one 65° row + one 45° row + scrub | as above | terrace White/LBG under the building, see §3 |

**Footprint ≈ 50 × 36 studs** (≈ 1,500 studs² with the spur; ≈ 34 % of an 80 × 56 island: the "back-right third" by area). **Summit 44**, with the mast to 62. **Budget ≈ 1,100 parts**: shell ≈ 250, tread plates ≈ 400, slopes ≈ 220, plants ≈ 160, trail ≈ 50, oak ≈ 40. A solid core would be ≈ 600–800 bricks more. Measure shell against solid on the first build, as Kyoto did.
**To bake:** 6255, 6064b, 24309 (fallback only); `tree` kind `oak`.
**Risks.**
- The shell needs every tread-to-tread height step to be ≤ 6 plates, or a ring loses its support from below. The heightmap must cap neighbour differences at 6 (one 65° row).
- 3-plate quantisation below 30 and 2-plate above is a design choice; if the face still reads as a stepped pyramid in the first render, add irregular one-plate "lips" (Brickman) on a third of the treads.

---

## 2. HOLLYWOOD letters + summit mast

### 2.1 Real thing (`real-straight-on.jpg`, measured in NOTES §0)
- 9 white block capitals, each **H = 45 ft**. The row is **7.9 H long**.
- Letters ≈ **0.7–0.8 H** wide, **W ≈ 1.0–1.3 H**, Y ≈ 0.6 H.
- A **3-column grid**: stroke ≈ counter ≈ 0.23 H.
- **O and D are rounded rectangles** with tall slot counters.
- Gaps ≈ 0.15 H, irregular.
- The row **climbs ≈ 0.45 H from H to D** along the contour, and the 2nd O dips.
- Each letter stands on **grey steel posts with girts behind**. 0–0.2 H of leg shows below; through the counters you see the grey frame.
- The **red/white lattice mast** with clusters of white dishes stands up-ridge to the right of the D.
- **Signature:** a short bright white strip of separate blocks on legs, on dark scrub, under the crest, with the mast as the vertical accent (`real-from-basin.jpg`).

### 2.2 Brick versions (8 with photos, NOTES §1–8)
| Version | What it does for the signature |
| --- | --- |
| Brickman 2016 (minifig) | **Best.** Studs-up white letters, 3-column grid, grey legs and girts behind, on a Dark Tan slope. But each letter is ≈ 6 minifigs tall: a second hero. |
| LEGOLAND "LEGOWOOD" | Letters pushed straight into turf with no legs. Reads as a garden sign. |
| Miniland USA (coastermadmatt) | 5-wide letters, stair-stepped W/Y diagonals. Stays legible with steps. |
| LEGO Ideas imaxedlp | **Keeps the mast** (lattice) and legs, letters at uneven angles. Grey letters look dirty; palms; props. |
| Rebrickable MOC-25470 | SNOT letters on a green slope. Illegible from an angle unless they stand proud. |
| BrickBlvd micro | **Real round moulds for O/D**, letters on the crest. Round beats stepped at small size. |
| BenBuildsLEGO | Two grille tiles. Abstracted away. |
| Nathan Wells | Proves a 1-stud-thick white wall letter stands. |

**Conclusion.** Copy Brickman's legs + girts + 3-column grid, BrickBlvd's round O/D, and imaxedlp's mast. Do better on scale: at the backdrop size the brief sets (≈ 24 studs), studs-up letters can only be 3 studs wide (row = 36). So **the letters are built sideways**: White plates stacked along x with their studs pointing east, each plate one layer = **0.4 stud wide**. That gives the 3-column grid at 0.8 + 0.8 + 0.8 studs, true widths, and a flat white face with panel seams, exactly like the real steel panels. **Posts are real vertical bars** and the letters **clip onto them**, so each letter hangs at any height and any 0.2-stud x position. That covers the uneven gaps and the climb, with every joint real. This also fixes the classic failure of SNOT letters (MOC-25470): ours stand proud of the slope on legs, face-on to the camera.

### 2.3 Letter grid (1 char = 1 layer 0.4 stud × 1 row 1 stud; west → east; `#` White plate/tile, `(` `)` curved corner mould, `.` open)
```
        H        O        L        L        Y        W          O        O        D
r2   ##..##   ((##))   ##....   ##....   ##..##   #..##..#   ((##))   ((##))   ####))
r1   ######   ##..##   ##....   ##....   .####.   ########   ##..##   ##..##   ##..##
r0   ##..##   ((##))   ######   ######   ..##..   .##..##.   ((##))   ((##))   ####))
layers  6        6        6        6        6         8          6        6        6     = 56 + 8 gaps × 1 = 64 layers = 25.6 studs
```
- Letter = **3 studs tall (7.5 plates) × 1 stud deep**. H/O/L/Y/D are 2.4 studs (0.8 H) and W is 3.2 (1.07 H). Length / height = 8.5 (real 7.9). Gaps are 0.4 stud (0.13 H).
- If 25.6 is too long, L and Y can drop to 5 layers (24.8). Each letter then has one post with two clips instead of two posts.
- Each pair of adjacent layers shares at least one row, so every layer has a stud joint (checked above for W and Y).
- **Climb:** letter bottoms at **31.0 / 31.5 / 32 / 32.5 / 33 / 33.5 / 33.5 (2nd O dips) / 34.5 / 35**, so tops run 38.5 → 42.5 (rise 4 plates ≈ 0.53 H; real 0.45 H).

### 2.4 Side view of one letter (1 char ≈ 1 plate; south on the right)
```
        post (LBG Antenna 4H)    letter (White, sideways plates)
 12      |
 10      |=====clip(4085c, sideways)==[######]    ← r2
  7      |---- girt: Bar 3L in two      [##..##]  ← r1, counter shows the girt behind it
         |     Bar Holders with Clip    [######]  ← r0
  2      |=====clip==================== [######]
  0  [1×1 round plate]  bench (Medium Nougat)  · 1–1.5 plates of air under the letter, the leg visible
```

### 2.5 Scheme table: letters (per letter; positions computed in one LDraw assembly `hollywood_letters`, exploded, rule 12)
| Level | Element | Part types (LDraw, status) | Colour |
| --- | --- | --- | --- |
| bench 31–35 | contour path under the letters, one 1-plate step per letter; it is also the trail's top leg | Tile 1×2/1×4 on the tread plate | Medium Nougat |
| bench | 2 post feet per letter, 2 studs apart (layers c0 and c5) | stud of the tread itself; fallback Plate 1×1 Round (**6141 cat**) | — / LBG |
| +0 → +12 | **posts** | Antenna 4H (**3957a cat** / 3957b bake): a 12-plate bar on a stud base | **Light Bluish Gray** |
| letter rows | **clip pieces inside the letter**: Plate 1×1 with Clip Vertical turned sideways, so its clip grips the vertical post. Two per letter (c0, c5; W: c1, c6) | **4085c cat** | White |
| letter | strokes and bars: sideways Plate 1×3 (row ties), Plate 1×1, last layer Tile 1×3 / 1×1 so the east face is smooth (one exposed stud where a clip is the last layer) | **3623**, **3024**, **63864**, **3070b** (all cat) | White |
| letter | **O / D corners**: Brick 1×1×⅔ with Curved Top laid sideways, so its quarter-round shows in the face (BrickBlvd's lesson, real mould) | **49307 cat** (used in the Merlion) | White |
| behind | **girt**: one horizontal bar per letter between its posts at r1, seen through the counters as in the photo | Bar 3L (**87994 cat**) in two Bar Holder with Clip (**11090 cat**) | LBG |
| summit 44 → 56 | **mast, lower stage**: four legs on the corners of a 3×3 with open sides, three bands of [1×1 round bricks + Plate 3×3] = 4 plates each, aviation stripes | Brick 1×1 Round (**3062b cat**), Plate 3×3 (**11212 cat**); fallback: Support 2×2×5 Lattice Pillar (2580 + 2579, bake; [colour?] Red) | **Red / White / Red** |
| 56 → 62 | **upper stage**: one 1×1 column, red/white, then a whip | 3062b ×2 + Antenna 4H (3957a) | White, Red, White |
| 47–53 | **dishes**: on the mast and on a 1×1 rack beside it: side studs carry small dishes | Brick 1×1 with Stud on 1 Side (**87087 cat**), Tile 1×1 Round (**98138 cat**) ×5, Dish 2×2 (**4740 cat**) ×2 | White dishes, LBG rack |

**Footprint:** letters 25.6 × 2 studs (posts 1 behind) on a bench 26 × 3. Mast 3 × 3 plus a 1 × 2 dish rack. **Heights:** letters 31–42.5, mast 44 → 62. **Budget ≈ 215** (letters 9 × ≈ 20 = 180, mast + dishes ≈ 35). **To bake:** 3957b (only if 3957a's top reads wrong); the lattice pillar fallback.
**Risks.**
1. **O's west corners (hardest letter problem).** A corner mould 49307 has no studs, only its anti-stud, which faces the counter. On a stack whose studs all point east, the east corners clutch (D is fine), but the O's west corners would need a stud pointing **west**. The fix is a stud-reversal at the O's bars: Brick 1×1 with Studs on Two Opposite Sides (47905, bake), 1 stud = 2.5 layers wide, so the O becomes 6.5 layers. It needs one 47905 upside down at the bottom bar (its top stud hidden under the letter) and a solution for the top bar (an upright 47905 shows its top stud). **Prove this on one O in the test scene first.** The fallback is stepped corners (one layer × one row notch, Brickman / Miniland), which is honest but loses the round read.
2. The clip-to-post reach (4085c's clip centre sits ≈ 0.85 stud behind the plate centre) decides how far behind the letters the posts stand; the assembly computes it. The posts must land on stud centres; the letters need not.
3. `check-asm-studs` exempts bars and clips (BY_DESIGN); 4085c members are clutched by their sideways neighbours, so the gate should pass. Verify on the first bake.
4. Trademark: the real word is kept for a personal site (usa.md §1.8).

---

## 3. Griffith Observatory

### 3.1 Real thing (`la-griffith/NOTES.md` §0; `real-south-2006.jpg`, `real-park-view.jpg`)
- A symmetric E–W white Art Deco bar.
- **Main dome Ø 0.35 W, a near-hemisphere** on a pilastered drum at the **rear**, top 77 ft.
- **Two telescope domes Ø 0.14 W** at the **front corners**, top 55 ft (main/side 2.4 in diameter, 1.4 in height). Each has a **raised shutter band with two ribs over the crown**.
- A **Sand Green octagonal rotunda roof** (the only green) in front of the main dome.
- Wings with **5 tall dark-green windows each** between flat piers, under a Greek-key frieze and cornice. The central pavilion is ≈ 0.3 W, slightly taller, with a stepped bronze portal.
- **Two Italian cypresses** at the door.
- Domes in **dark copper-brown** (2006 re-clad; Miniland recoloured to Reddish Brown).
- Front lawn ≈ building width, **4 panels on a cross of pale paths** with the **white Astronomers Monument on a round island** (≈ parapet height).
- Roof terraces are buff (Tan).
- **Signature:** one big brown dome behind, two small slit domes at the ends, white bar with a window rhythm, a lawn cross with an obelisk.

### 3.2 Brick versions (6, NOTES §1–6)
| Version | What it does for the signature |
| --- | --- |
| LEGOLAND California Miniland | **The pilastered drum** (≈ 16 pilasters above the parapet) and **the slit band on the side domes**: the two details that make it Griffith. Recoloured Reddish Brown ≈ 2014. But the domes are stepped rings ("knitted caps"). |
| Rebrickable MOC-34593 | Our size, a good plan (wings, rotunda, drum, Tan roof terraces). Stepped 10-stud domes look crude; side domes too big (0.55). |
| MOC-181533 flavorbricks | **One-piece dome moulds** give a clean hemisphere, plus the 4-panel lawn and monument. Tiny. |
| BenBuildsLEGO | **Window rhythm + two cypresses + 1×1-round pilaster drum** carry the facade. Black domes (stylisation). |
| Ignat Britvin | Grille-tile drum, an attempt at the slit, Olive rock hill. Green domes (wrong for today). |
| BrickBlvd | Confirms the composition: the observatory on the shoulder below the sign. |

**Conclusion.** Copy Miniland's pilastered drum and slit band, MOC-181533's true-curve dome moulds and lawn cross, BenBuilds' window rhythm and cypresses, and MOC-34593's plan and Tan terraces. Do better:
- real **quarter-dome moulds** at both sizes, in the real colour;
- a **slit built as a raised band of matching curved moulds**, not an offset tile;
- **5 windows per wing**, as real;
- side domes at a true ≈ 0.4–0.5 of the main dome.

### 3.3 The telescope slit, solved
LDraw has a matched pair from one 2024 family: **5906 Brick 2×2×1⅔ Corner Round with Curved Top** (a quarter dome, 5 plates, radius 2) and **5907 Brick 2×1×1⅔ with Curved Top** (the same quarter profile, 1 stud wide).
- Four 5906 make a true 4×4 hemisphere.
- Push the west pair and the east pair one stud apart. Fill the gap with **two 5907 back to back** (a 1×4 arch with the dome's own profile) standing on a **1×4 plate**.
- The band then rides **one plate proud along its whole length**: a raised shutter with a rib line down each side, running from the drum over the crown, facing the camera.
- Plan 5 (E–W) × 4 (N–S). In **Dark Brown** on Reddish Brown quarters it is the brief's "Reddish Brown + Dark Brown seams". Its read from the front: a dome with a dark vertical band, like `real-south-2006.jpg`.
- Cost: the dome is 5 wide seen from the south (real 0.14 W → ours 0.19 W). This is an exaggeration of a signature detail, chosen on purpose.

### 3.4 Stud-grid sketch: top view (1 char = 1 stud; 26 × 26, north up; local gx 0–25, gz 0–25)
```
gz  gx 0    5    10   15   20   25
 0         ..MMMMMMMMMM..              M main drum 12×12 (rounded), dome 10×10 on it (gx 8-17, gz 1-10)
 2        .MMMMMMMMMMMM.              p 16 pilasters on the drum rim
 5        pMMMMMMMMMMMMp
 9        .MMMMMMMMMMMM.
10   TTTTTTMMRRRRRRMMTTTTTT           T Tan roof terraces over the wings; R rotunda: 4×4 round drum + 6×6 Sand Green eave + 4×4 dish
11   ddddd.TTRRRRRRTT.ddddd           d side drum 5×4, slit dome on it (band = gx 2 / gx 23, N-S)
12   ddddd.TT.PPPP.TT.ddddd
14   ddddd wwwwPPPPPPPPwwww ddddd      w wing: 4 studs = 10 sideways layers, 5 windows; P pavilion 8 wide
15   ddddd wwwwPPPPPPPPwwww ddddd      (facade line gz 15; pavilion + portal project to gz 16)
16             c PPdd c                c cypress (gx 8, gx 17)   dd bronze doors
17   ===========[stp]===========      LBG forecourt + 2 steps (1 plate each)
18   gggggggggggg==gggggggggggg       g lawn (Green plates), = paths (LBG tiles)
20   gggggggggggg==gggggggggggg
21   ==========( ◎◎ )==========      ◎ round island: 4×4 round plate + monument
22   gggggggggggg==gggggggggggg
25   gggggggggggg==gggggggggggg       spur edge at gz 25 → retaining slope
```

### 3.5 Front elevation (1 char = 1 stud across, rows ≈ 2 plates; spur-relative plates)
```
 31                        .                     finial (Dark Brown 2×2 round plate + 1×1 cone)
 29                    ___/██\___                 main dome: 4 × 76776 (10 plates), Reddish Brown
 23                 p_/██████████\_p              pilasters above the drum rim (stepped caps)
 22   _|_                                  _|_    side domes: 4 × 5906 + 2 × 5907 band, top 22 (band 1 proud)
 20  /█|█\        ┌─R─┐ rotunda (Sand Green, 18-22)   /█|█\
 16  ▌   ▐ ┌──────┴───┴──────┐ main drum rim 19       ▌   ▐
 15  ▌   ▐ │      ┌─────┐    │ pavilion top 15       ▌   ▐
 12  ▌   ▐▀█▀█▀█▀█│ ▐▌▐▌│▀█▀█▀█▀█▀ wings 12 (cornice)  ▌   ▐
  8  ▌   ▐ █ █ █ █│ ▐▌▐▌│ █ █ █ █   5 windows / wing, 5 plates tall (Dark Green)
  1  ▌▁▁▁▐▁▁▁▁▁▁▁▁│▁▐▌▐▌│▁▁▁▁▁▁▁▁▁▁▐ base course 0-1
```

### 3.6 Scheme table (spur-relative plates; spur = 8 above the island, so add 8 for absolute)
| Plates | Element | Part types · first pick → fallback (LDraw, status) | Colour |
| --- | --- | --- | --- |
| 0–1 | base course and forecourt, 2 front steps of 1 plate | Plate / Tile 1×N, 2×N (cat) | LBG (forecourt), White (base) |
| 1–11 | **wing facades, 5 windows each**: a sideways stack of 10 layers (4 studs) per wing. **P W P W P W P W P W**, mirrored on the east wing, so the pavilion wall is the sixth pier. Each pier layer = Plate 1×1 + 1×2 + 1×1 standing (2.5 + 5 + 2.5 plates); each window layer has a Dark Green 1×2 in the middle. Anchored on side studs of the drum and pavilion; the wing body behind is ordinary studs-up bricks | Plate 1×1 / 1×2 / 1×4 (**3024**, **3023b**, **3710** cat), Brick 1×1 with Stud on 1 Side (**87087 cat**) as anchors | White piers, **Dark Green** windows (5 plates tall, real ≈ 0.42 of the wall) |
| 11–12 | cornice (implies the Greek-key frieze); roof terraces | Tile 1×N White on the edge; Tile 2×N | White · **Tan** terraces |
| 0–15 | **pavilion** 8 wide: stepped portal (two White 1×1×3 jambs stepping back), **bronze doors** = two 1×1×3 bricks, attic band to 15 (no lettering: two words, illegible at thumbnail, cut per rule 1) | Brick 1×1×3 (**14716 cat**), Brick 1×2 / 1×4, Tile | White · **Dark Brown** doors |
| 15–22 | **rotunda (Hall of the Eye)** on the pavilion's back half: 4×4 round brick drum → 6×6 round plate eave → 4×4 dish roof → lantern; scalloped crest = Plate 1×1 Round with Tabs on the eave's rim studs | Brick Round 4×4 (**87081 cat**), Plate Round 6×6 (**11213 cat**), Dish 4×4 (**3960 cat**), Plate 1×1 Round with Tabs (33291 bake), Cone 1×1 (**4589 cat**); fallback roof: Dish 6×6 (44375, bake) | White drum · **Sand Green** roof [colour? 3960 / 33291 in Sand Green] |
| 0–16 | **side drums 5 × 4**: front and back corners Brick 2×2 Corner Round, 1×1 bricks in the 1-stud middle; a narrow dark slit window | **3063b cat**, Brick 1×1 (**3005 cat**), Tile 1×1 Black | White |
| 16–22 | **telescope domes** (§3.3): 4 × quarter dome, 1×4 plate + 2 × curved-top band, band crown 22 | **5906 bake**, **5907 bake**, Plate 1×4 (3710) | **Reddish Brown [colour?]** quarters · **Dark Brown [colour?]** band and plate |
| 0–19 | **main drum 12 × 12**: corners Brick 4×4 Corner Round, 4-stud flats between; small dark windows on the front quarter | **2577 bake** (or 48092 bake, same shape), Brick 1×4 / 1×2 | White |
| 19–23 | **16 pilasters** on the drum rim (corners + flats, placed by a symmetric helper, never by hand) with stepped caps; dome deck 10 × 10 inside | Brick 1×1 (3005) + Plate 1×1 (3024) + Plate 1×1 Round (6141) as the stepped cap; deck plates | White |
| 19–29 | **main dome Ø 10**: four 5×5 quarter domes; the 4 crown studs carry the finial. The 76776 shell has internal tubes at several heights, so it needs a stepped core of plates inside (a "wedding cake"; real practice with these moulds) | **76776 bake** → four 49612 (4×4×2⅔, bake: Ø 8, then the building shrinks to ≈ 22) → 98107 Hemisphere 11×11 (bake) | **Reddish Brown [colour?]**; seams = the four joins |
| 29–31 | **finial** | Plate Round 2×2 (cat) + Cone 1×1 (4589) | Dark Brown |
| 1–11 | **two Italian cypresses** at the door, 1 wide | Brick Round 1×1 (**3062b**) ×3 alternating with Plate 1×1 Round with 3 Leaves (**32607**) ×3, Cone 1×1 tip (4589) | **Dark Green** |
| 0–1 | **lawn**: four panels, LBG cross paths (N–S axis 2 wide, E–W 1 wide), round island at the crossing | Plate 2×N / Tile 1×N (cat), Plate Round 4×4 (**60474 cat**) | **Green** (not Bright Green), LBG |
| 1–13 | **Astronomers Monument**: figure drum → shaft → needle → armillary | Brick 2×2 Round (**3941 cat**) + Plate Round 2×2, Brick Round 1×1 ×2, Cone 1×1, Plate 1×1 Round (6141) on top | White · **Pearl Gold** top |

**Footprint 26 × 26** on a 28 × 26 spur terrace (building 26 × 17, lawn 26 × 8). **Heights:** parapet 12 → absolute 20; side domes 22 → 30; main dome 29, finial 31 → absolute **37 / 39** (proposed; usa.md had 44 above the letters, see §0.1). Main/side top = 1.32 (real 1.4). Main/side diameter = 2.0–2.5 (real 2.4). Main dome / width = 0.38 (real 0.35). **Budget ≈ 540**: drums ≈ 200, wings ≈ 130, pavilion + rotunda ≈ 85, domes ≈ 25, lawn + monument + cypresses ≈ 100.
**To bake:** 76776, 5906, 5907, 2577 (or 48092), 33291; fallbacks 49612, 98107, 44375.
**Risks.**
1. **Colour existence** of 76776 / 5906 / 5907 in Reddish Brown and Dark Brown. All three are recent moulds (LDraw 2024–25), so verify on BrickLink first. If Reddish Brown is missing, the series rule "official colour" decides between Dark Brown domes and the next mould.
2. The 76776 underside is a shell with internal tubes, not a flat 5×5 bottom. Expect one round of fitting the inner core.
3. The wing facades are sideways curtains anchored on side studs at one end and touching at the other. Prove the clutch in `check-asm-studs`.
4. The side domes read 5 wide from the south. If the first render looks wrong, the fallback is a plain 4×4 dome of four 5906 with no band. That loses the signature, so it is a last resort.

---

## 4. Walk of Fame strip

### 4.1 Real thing (`la-icons/real-walkoffame-star.jpg`, `la-icons/NOTES.md` §2)
- A five-point **coral-pink terrazzo star with a thin brass rim**, a **round brass emblem** in the lower centre and the honoree's name in brass letters above it.
- It is set in a **3 ft charcoal terrazzo square** with fine joint lines, one every 6 ft along Hollywood Blvd, in grey pavement.
- At our scale 3 ft ≈ 2.7 studs, so a **2×2 tile**, one every ≈ 5 studs.
- **Signature:** pink stars in dark squares in a row on a pale sidewalk.
- Brick version: 10232 Palace Cinema's "sidewalk of the stars" is the only official precedent [print not verified].
- **We copy:** the printed 2×2 tile in a sidewalk row. **We do better:** the real charcoal square and brass rim, at real spacing.

### 4.2 Sketch: top view (1 char = 1 stud; island z 36–38 under the spur, x ≈ 52–71)
```
z36  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒   ▒ LBG sidewalk tiles (2×4 / 1×4)
z37  ▒★★▒▒▒★★▒▒▒★★▒▒▒★★▒   ★★ printed 2×2 star tiles, every 5 studs (×4; ×3 if the strip is 16 long)
z38  ▒★★▒▒▒★★▒▒▒★★▒▒▒★★▒
z39  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   ▓ DBG kerb tiles, then the boulevard
```

### 4.3 Scheme table
| Plates | Element | Part types (LDraw, status) | Colour |
| --- | --- | --- | --- |
| 0 | ground plate under the strip (island surface) | Plate 2×N | LBG |
| 1 | sidewalk | Tile 2×4 (**87079 cat**), Tile 1×4 (**2431 cat**), Tile 2×2 (**3068b cat**) | **Light Bluish Gray** |
| 1 | **star tiles ×4**, print `walk_star` (L2): a Coral five-point star filling ≈ 85 % of the tile, a Pearl Gold rim line (≈ 3 % of tile width), a Pearl Gold disc (≈ 22 % of tile) in the lower centre, **no name, no emblem glyph** (a name is a real person). Canvas `px ≥ 320`, 3 flat colours (tile ground + 2 printed), no gradient | Tile 2×2 (**3068b cat**) | tile **Black** (charcoal; usa.md said Dark Bluish Gray, too light against #2A2A2A) · print **Coral**, **Pearl Gold** |
| 1 | kerb | Tile 1×4 / 1×2 | **Dark Bluish Gray** |

**Footprint 20 × 4. Height 1 plate. Budget ≈ 25. Print designs: 1** (country total stays 11 of 12). **To bake:** nothing.
**Risk:** Coral is loud (see §0.5). Check the print at thumbnail size beside the real photo; if it pops, try a Medium Nougat star.

---

## 5. Totals and the one problem I could not close

| Element | Footprint (studs) | Height (plates, absolute) | Parts |
| --- | --- | --- | --- |
| Hill terrain + spur + chaparral + oak + trail | ≈ 50 × 36 | summit 44 | ≈ 1,100 |
| Letters + mast + dishes | 25.6 × 3 on the bench; mast 3 × 3 | letters 31–42.5, mast 62 | ≈ 215 |
| Griffith Observatory + lawn + monument | 26 × 26 on the spur (8) | dome 37, finial 39 | ≈ 540 |
| Walk of Fame strip | 20 × 4 | 1 | ≈ 25 |
| **Total** | | | **≈ 1,880** |

New moulds to bake: **76776, 5906, 5907, 2577, 33291** (Griffith); **6255, 6064b** (scrub); **47905** (O reversal, if proved); fallbacks 24309, 49612, 98107, 44375, 3957b, 2580/2579. New code: `tree` kind `oak`; print `walk_star`; assemblies `hollywood_letters`, `griffith_*`, `mast`.

**Hardest open problem:** rounding **both** sides of each O with a real mould. The sideways letter stack can only clutch a studless corner piece from one side, so the O's west corners need a stud-reversal brick in the counter bars. The bottom bar is solvable (hidden stud). The top bar either shows a stud on the letter's top or a nub inside the counter. Prove it on one O in the test scene before building the other eight letters; the fallback is stepped corners.

## 6. References generated (gpt-image-2, direction only)
- `../la-hollywood-lego.png`:
  - **Right:** an organic hill rather than a pyramid; dense dark olive / dark green scrub on Dark Tan treads with olive slope faces; a switchback trail that ends at the letters; letters on grey posts with a girt behind, climbing left to right; the red/white lattice mast with white dishes on the summit; one dark live oak.
  - **Wrong vs the scheme:** the letters are studs-up stepped bricks (O and D are blocky, not round) and take half the hill's width; the trail is Tan, not Medium Nougat; the scrub is a uniform polka-dot, where ours clusters on tread edges and in gullies; the summit plateau is missing.
- `../la-griffith-lego.png`:
  - **Right:** the plan (big dome behind, slit domes at the ends, Sand Green rotunda with crest in front); **the raised shutter band with ribs over each side dome**, exactly the read §3.3 aims for; the pilastered drum; two cypresses; the 4-panel lawn with the obelisk; Tan roof terraces; scrub slopes round the spur.
  - **Wrong vs the scheme:** 6–7 windows per wing (real and ours: 5); the domes are faceted tiles where ours are four smooth quarter moulds; the side drums are wider than their domes; the doors have handles; the main dome is in the right ratio but sits on a much taller drum than ours (19 plates).
