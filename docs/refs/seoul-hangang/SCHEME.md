# Han River, Hangang Park, Hangang Bus, chimaek pair, gate guard — analysis + build scheme (for Eric's sign-off; no brick placed)
2026-10-06 · sources: `NOTES.md` (this folder), `docs/countries/korea.md` §1, `../seoul-hanok/NOTES.md` §D, `../seoul-real/NOTES.md`, LA's sea (`src/scenes/la-island.ts`, `docs/countries/usa.md` §2), Shanghai's boats (`tools/ldraw/asm-sh-extras.mjs`) · new photos: `real-hangang-bus-a..d.jpg` (Wikimedia Commons; Republic of Korea / Korea.net and Lee Jeong Woo / MCST, CC BY-SA 4.0) · target image `../seoul-hangang-lego.png`

**Units.**
- **G** = island surface = 10 (base 3). **w** = water surface = **G − 2 = 8**: the series rule, and LA's exact levels (bed plate y 6, water tiles y 7).
- Heights are in plates above G unless marked "above w". 1 char = 1 stud; north up; the camera looks from the south.
- Island x 0..75 west → east, z 0..63 north → south. All z values here are provisional, to be fixed at the island stage.
- **L** = mould already baked (`src/parts/ldraw/p<id>.ts`); **bake** = still to bake. Every id was checked with `head -1` in the vendored LDraw library.
- Colours were checked on BrickLink's colour pages (fetched 2026-10-06). [M] = not checked.

## 0. Decisions for Eric (top of page)
1. **Guard robe colour.**
   - At Gwanghwamun itself, the guards who stand with polearms wear **red robes and black hats** (`../seoul-hanok/real-guards-gate.jpg`, the gate's own tunnel).
   - The **blue** robes in korea.md come from the flag-bearers of the changing ceremony in the Heungnyemun courtyard (`../seoul-real/guard-ceremony.jpg`).
   - **A (recommended): Red robe** (36036 in Red ✓), Black hat. It is true to the post he stands at, and it reads against grey granite.
   - **B: Blue** (36036 in Blue ✓), as korea.md §1.7 has it now.
2. **Hangang Bus livery: correct the brief.** The real boat is not a Medium Azure → Dark Azure band. It is White with a **royal Blue stern block** that fades forward into white through a diagonal halftone, a **black boot-top** at the waterline, a dark strake under the deck edge, a continuous dark window band, and an **orange fin** on the wheelhouse roof (`real-hangang-bus-b.jpg`, `-c.jpg`).
   - Recommended: build that livery in LEGO **Blue**, with the halftone as a stepped diagonal of 1×1 plates (§3).
   - One boat in the fleet (101) wears a pink character livery (`-a.jpg`). Not that one.
3. **Seated figures need a new assembly helper.** `minifig2` cannot sit (§4.1). The seated pair is built the way LA's coaster riders were (`asm-la-park.mjs`), as one exploded `hangang_picnic` assembly (≈ ½ day).
   - The fallback, if Eric would rather not: the pair stands at the mat's edge clinking drumstick and bottle. It reads weaker.

No other open choice: willows are **cut** (no proven brick willow at our scale; §2.4), and the bank, path and boat follow the photos.

## 1. Corrections found by this pass
| # | What the brief / notes say | What is true (evidence) | Consequence |
| --- | --- | --- | --- |
| 1 | Hangang Bus "White hull, Medium Azure → Dark Azure band" | White + **Blue stern block with a halftone diagonal**, black boot-top, dark strake, orange wheelhouse fin (`real-hangang-bus-b/c.jpg`) | Livery in §3; Blue, not Azure |
| 2 | Cycle path: "Yellow dashed centre line, white edge lines" | **Solid** yellow centre line, **pale-blue** edge lines (`real-hangang-bikepath.jpg`) | Solid Yellow centre line. Edge lines dropped: at 1 stud each they would be two more 33 cm stripes, and the lawn already edges the path |
| 3 | Guard "blue robe" (korea.md §1.7) | Polearm guards at Gwanghwamun wear **red**; blue is the ceremony's flag-bearers | Decision 1 |
| 4 | `30167` "a flat wide brim" (seoul-hanok NOTES) | The brim is flat at r 25 LDU **except on its +x side, which is pinned up** (sector profile: r 20 at y −5; keywords "adventure, bent"). Crown only 12 LDU above the head | Turn the pinned side to the back (§5.2). From the front it then reads flat |
| 5 | Drumstick `33057` colour unstated | BrickLink: **Dark Orange** and Earth Orange only | Dark Orange (fried-chicken brown) |
| 6 | "LA's sea lesson: Sand Blue with a scatter of Trans-Clear glints" (usa.md §2) | LA's built sea has **no Trans-Clear tiles**: `seaColour()` in `la-island.ts` returns only White / Trans-Light-Blue / Sand Blue / Dark Blue | The glint is untested. Swatch it before laying the river (§2.2 risk) |
| 7 | Hangang Bus 8 plates (korea.md §1.5) | Hull + deck + one-brick cabin + roof is already 9 plates; the raised wheelhouse makes **12 above w = G + 10** (Shanghai's cruise is 10) | Height table: Small 12 for the boat; still below the hanok and the stage |
| 8 | `36036` skirt "fine for chima" | Baked (`p36036.ts`) but **no catalogue entry**. One tube (`stud4a`) at LDraw (0, 30.4, 10): it sits between four studs, **0.5 stud behind the legs' centre**, so under `minifig2`'s snap it lands on a grid intersection ✓ | `fig_skirt` entry + a `skirt` option in `minifig2` (§5.1) |
| 9 | River colour Sand Blue | Sand Blue is LA's near-sea colour. Seoul's river differs by having no Dark Blue offshore band and no surf lines, but the swatch may still read "LA sea" | Swatch A/B in §2.2 |

## 2. The Han River and Hangang Park (one strip across the front)

### 2.1 Real thing and signature
- **What it is:** a wide, calm, opaque grey-blue river (the photos read olive-grey to grey-blue, never turquoise).
- **The bank is engineered:**
  - concrete or granite **stepped terraces** down to the water (`real-hangang-yeouido.jpg`: steps and a rail; `real-banpo-c.jpg`: people seated on the steps);
  - then lawn;
  - then the **dark asphalt cycle path** with a solid yellow centre line (`real-hangang-bikepath.jpg`);
  - tall slim grey lamp posts; wooden benches facing the water.
- **Signature at our scale:** a broad calm band, a hard stepped grey edge (not a natural shore), a dark path with a yellow line, and people on the lawn facing the water.

### 2.2 Brick versions → conclusion
| Version | What it does | Take |
| --- | --- | --- |
| Maxtud *Micro Seoul* (MOC-75983) | The Han as a broad open band the city sits along | Width over detail: a calm field |
| LA island sea (ours, built) | Opaque Sand Blue → Dark Blue tiles; side wall over a lowered plinth shows water thickness; all-trans read as ice | **Copy the levels and the side wall** exactly (bed y 6, tiles y 7, plinth along water tops at 4) |
| Shanghai river (ours) | Trans-Light-Blue over green = jade; `wet()` cells left studded so boats clutch; white round 1×1 ripples as wake | **Copy `wet()` and the wake technique** |
| Paris / Prague (ours) | Dark Blue bed + Trans-Light-Blue tiles | Not ours: both are already used |
| Official City harbour sets [M] | Water as studs-up blue plates with a few tiles; quay walls of grey bricks | Grey stepped quay = the bank |

**Ours:**
- **Water:** opaque **Sand Blue** 2×2 / 1×2 / 1×1 tiles over a Sand Blue bed plate. About 45 **Trans-Clear 1×1 tiles** sit in short sun-glitter streaks (2–4 tiles along x), mid-river only, none within 3 studs of the boat or the wake.
- **Swatch before laying** (correction 6): A = Sand Blue + Trans-Clear glints; B = A + 15 % Sand Green flecks (the photos' olive cast, and it breaks the LA echo). Pick from a 12 × 8 render beside `real-hangang-bus-b.jpg`.
- **Side walls:** the river leaves through the left and right plinth faces and meets the front plinth along its whole length. There the plinth tops out at 4, and the water's edge column shows its thickness: LA's Trans-Dark-Blue side bricks, plus a Sand Blue option in the swatch.

### 2.3 Sketch: top view of the front band (x 0..75, z 38..63; 1 char = 1 stud)
```
z38 ............................................................................
z39 ............................................................................
z40 ############################################################################
z41 ############################################################################
z42 YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
z43 ############################################################################
z44 ############################################################################
z45 ggggggggggggLgggggggggggggggggLgggggggggggggggggLgggggggggggggggggLggggggggg
z46 ggggggggggggggggggggggggggggggggggggMMMMMMgggggggggggggggggggggggggggggggggg
z47 ============ggggggggBBBBggggggggggggMMMMMMggggggggggBBBBgggggggg============
z48 ------------======ggggggggggggggggggMMMMMMgggggggggggggggg======------------
z49 ~~~~~~~~~~~~------======ggggggggggggMMMMMMgggggggggg======------~~~~~~~~~~~~
z50 ~~~~~~~~~~~~~~~~~~------======gggggggggggggggg======------~~~~~~~~~~~~~~~~~~
z51 ~~~~~~~~~~~~~~~~~~~~~~~~------================------~~~~~~~~~~~~~~~~~~~~~~~~
z52 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~----------------~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
z53 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
z54 ~~~~~~~~~~~~~~~~~~~~~~~~~~~oo~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
z55 ~~~~~~~o<HHHHHHHHHHHHHHHooo~~~~~~~~*~*~~~~~~~~~~~~~~*~*~~~~~~~~~~~~~~~~~~~~~
z56 ~~~~~~~~<HHHHHHHHHHHHHHH~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
z57 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
z58 ~~~~~~~~<HHHHHHHHHHHHHHH~~~~~~~~~~~~~~~~~~~~*~**~~~~~~~~~~~~~~~~~~~~~~~~~~~~
z59 ~~~~~~~o<HHHHHHHHHHHHHHHooo~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*~*~~~~~~~
z60 ~~~~~~~~~~~~~~~~~~~~~~~~~~~oo~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
z61 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~**~~~~~~~~~~~~~~
z62 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
z63 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```
Legend: . verge (city side) · # cycle path, Dark Bluish Gray tiles · Y solid Yellow centre line · g lawn · L lamps (x 12, 30, 48, 66)
M picnic mat (x 36–41, z 46–49) · B benches facing the river (x 20–23, 52–55) · = coping at G (LBG tiles) · - step at G − 1 · ~ water at w = G − 2
< H Hangang Bus, bow west (x 8–23; hulls z 55–56 and 58–59, tunnel z 57) · o wake and bow waves · * Trans-Clear glints

**The bow, symmetric about x = 37.5.** The coping row z_c by x:

| x | z_c |
| --- | --- |
| 0–11 and 64–75 | 47 |
| 12–17 and 58–63 | 48 |
| 18–23 and 52–57 | 49 |
| 24–29 and 46–51 | 50 |
| 30–45 | 51 |

The step sits at z_c + 1 and the water starts at z_c + 2.
- **River depth:** 15 at the plinth faces, **11** in the middle (≈ 13 mean; the brief's "≈ 14").
- **Lawn depth:** 2 at the ends, **6** in the middle, where the picnic sits.
- **Path:** dead straight, z 40–44, so its tiles never stair-step. Only the bank bows.

### 2.4 Level table (bank, path, lawn, dressing)
| Plates | Element | Part types (verified id, status) | Colour |
| --- | --- | --- | --- |
| y 6 | river bed | Plate (packer) | Sand Blue (Trans-Dark-Blue at the edge column) |
| y 7 → w 8 | water surface | Tile 2×2 `3068b` L, 1×2 `3069b` L, 1×1 `3070b` L; glints `3070b` | Sand Blue; Trans-Clear |
| y 7 → w 8 | wet cells under the hulls | Plate 1×1 / 1×2 (studs left for the boat, Shanghai's `wet()`) | Sand Blue |
| 8 → 9 (G − 1) | step: one plate course 1 stud deep, tiled | Plate 1×N + Tile 1×N `2431` / `63864` / `3069b` L | Light Bluish Gray |
| 9 → 10 (G) | coping: tiled granite edge, flush with the lawn | Tile 1×N L; **Tile 1×1 Quarter Round `25269` L** on the outer corner of every jog (LA's macaroni idea: softens the stair-stepped bow) | Light Bluish Gray |
| G | lawn (ground course) | Plates (packer), two greens only + a few Dark Tan patches (playbook ground rule) | Green 70 %, Olive Green 25 %, Dark Tan ≤ 5 % |
| G | cycle path, 5 wide | Tile 2×4 `87079` L / 1×8 `4162` L (lanes), Tile 1×8 Yellow (centre) | Dark Bluish Gray, Yellow |
| G → G + 1 | lamps ×4 on the lawn's first row | `modlamp` assembly L (Shanghai: slim grey 1×1 round column, white 2×2 round disc), ≈ 22 plates tall [M: modlamp height in its asm] | Light Bluish Gray / White |
| G | benches ×2 facing the river | `la_pierbench` assembly L (Reddish Brown slats on dark iron ends): the wooden Hangang benches | Reddish Brown, Dark Bluish Gray |

- **Connections:**
  - Every tile sits on the plate below it.
  - The step course's plates bridge the earth column below.
  - The coping tiles cover studs of the G − 1 ground plate.
  - The lamps and benches stand on lawn studs: the ground stays studded under them (the LA `propCells` rule).
- **Water steps are 1 plate each, two equal rises** (coping G → step G − 1 → water G − 2). They keep the series' "water two plates under the land"; three steps would need the water at G − 3 and change the DNA.
- **Willows: cut.** `tree()` has no hanging foliage kind, and no brick willow at minifig scale was found. A crown of 4 × 3 leaves (`2423`) hung down is untested. The open lawn and water are the point here, and three tree species are already planned (pines, ginkgo).
- **Footprint:** 76 × 26 (z 38–63). **Heights:** lamps ≈ G + 22, benches G + 4, everything else ≤ G.

## 3. Hangang Bus (catamaran, 16 × 5)

### 3.1 Real proportions and signature
- **Facts** (Wikipedia, Korea Times, mcst.go.kr):
  - catamaran **35 m × 9.5 m** (3.7 : 1), 199 seats, launched 18 Sep 2025;
  - "white base with a gradient of blue hues";
  - panoramic windows, bicycle racks.
- **From the photos** (`real-hangang-bus-b.jpg`, side; `-c.jpg`, bow quarter):
  - two **slim hulls with a tall tunnel** between them under a full-width cross-deck, each with a near-vertical blunt stem;
  - a **black boot-top** stripe at the waterline;
  - a **dark grey strake** along the deck edge;
  - the **stern ≈ 25 % solid royal blue**, its forward edge breaking into a halftone dot diagonal (high aft, low forward);
  - one long saloon with a continuous band of dark windows;
  - a **raised wheelhouse at the forward end** with wrap-round dark glass and an **orange curved fin** on its aft roof;
  - an open foredeck with white tube railings.
- **Signature (in order of reading distance):**
  1. a white low boat with a blue stern;
  2. the dark window band;
  3. the raised wheelhouse with the orange fin;
  4. twin hulls (visible only from a bow or stern quarter: from the default south camera the boat is side-on).

### 3.2 Brick versions → conclusion
| Version | What it does | Take |
| --- | --- | --- |
| Shanghai `cruise` (ours, 12 × 4) | Black plate waterline, White brick hull, black-glass saloon between white posts, `41769a/41770a` wing pair as a pointed bow | **Copy the hull-and-saloon stack and the opaque Black glass** (renderer trap: trans glass reads frosted) |
| LEGO Friends 41317 Sunshine Catamaran [M, not opened] | Two moulded pontoon hulls under a wide deck | The arrangement (two hulls, deck bridging), not the moulds (they are 6+ wide) |
| Official City boats [M] | Wedge bricks for bows, 1×N fences as railings, Black plates for the boot-top | Wedge 3×2 bows, Fence 1×4×1 railings |
| Target image `../seoul-hangang-lego.png` | Two hulls with a visible tunnel at the bow, halftone dots fading the blue | Confirms the read; its boat is 28 long (too long) and its wake far too big |

**Ours:** Shanghai's stack (proven on the globe), widened to two 2-wide hulls with a 1-stud tunnel. Each bow is a mirrored **Wedge 3×2** pair (`6564` right / `6565` left: brick height, tapering 2 → 1 stud, a blunt stem like the real one), with the straight sides facing the tunnel, so the two bows are mirror-symmetric. The halftone is a **stepped diagonal of 1×1 plates**, flush, which reads as the real boat's diagonal fade. (SNOT round-tile dots would stand 0.4 stud proud and read as portholes.)

### 3.3 Sketches (boat frame: x 0..15 stern → bow, z 0..4; placed rot so the bow faces west)
```
TOP (deck level)                         SIDE (from the south, x 0 stern … 15 bow; rows = plates above w)
z0  DDDDDDDDDDDDD\\\                     12            ┌───┐                       wheelhouse roof tile (White)
z1  ·cccccccccc..fff\                    11         ◜OOO│▓▓▓│                      O = Orange curved fin; ▓ = Black glass (2 plates)
z2  ·c         c..f .  <- tunnel row     10         ◜OOO│▓▓▓│
z3  ·cccccccccc..fff/                     9  ═══════════════════                    cabin roof plate + tiles (White)
z4  DDDDDDDDDDDDD///                      8  W▓▓▓▓▓▓▓▓▓▓▓▓W  ff                     saloon: Black 1×8 window band, White end posts; ff = Fence 1×4×1
    c = saloon wall, f = foredeck,        7  W▓▓▓▓▓▓▓▓▓▓▓▓W  ff
    D = Dark Bluish Gray strake row,      6  W▓▓▓▓▓▓▓▓▓▓▓▓W  ff
    \ / = bow wedges                      5  DDDDDDDDDDDDDDDDD                        deck plate course: DBG strake rows outside, White inside
                                          4  BBBBBWWWWWWWWWW◣                         hull brick course (3 plates): Blue x0–4,
                                          3  BBBBBBWWWWWWWWW◣                         diagonal fade x5–6 in 1×1 plates (B B B / W B B / W W B),
                                          2  BBBBBBBWWWWWWWW◣                         White x7–12, Wedge 3×2 bow x13–15
                                          1  ■■■■■■■■■■■■■■■■                         boot-top: Black plates + Black Wedge Plate 3×2 under the bow
                                          0  ~~~~~~~~~~~~~~~~ w (wet studs under both hulls)
```

### 3.4 Level table (per boat; "×2" = both hulls)
| Plates above w | Element | Part types (id, status, colour availability) | Colour | Pcs |
| --- | --- | --- | --- | --- |
| 0–1 | boot-top | Plate 2×8 `3034` L, 2×4 `3020` L, 1×2 `3023` L ×2; bow **Wedge Plate 3×2 Right/Left `43722a` / `43723a` bake** (Black ✓) | Black | 8 |
| 1–4 | hull side course | Brick 2×4 `3001` L (Blue stern, White mid), Brick 1×2 `3004` L Blue across x4; outer row x5–6 **Plate 1×1 `3024` L ×6** (the fade); inner row Brick 1×4 `3010` L; outer x7–8 Brick 1×2 White; bow **Wedge 3×2 `6564` / `6565` L** (White ✓) | Blue, White | 24 |
| 4–5 | deck / strake | Plate 1×6 `3666` L ×4 + 1×1 ×2 on the outer rows (DBG); Plate 2×8 / 2×4 / 1×N White across z1–3, joints staggered against the hull joints; bow deck Wedge Plate 3×2 `43722a/43723a` DBG ✓ | Dark Bluish Gray, White | 13 |
| 5 | aft deck x0–1 and foredeck x11–15, tiled | Tile 1×2 / 2×2 L | White | 6 |
| 5–8 | saloon x2–10, full width | Brick 1×8 `3008` L ×2 (window band, Black), Brick 1×1 `3005` L ×4 (White corner posts), Brick 1×3 `3622` L ×2 (end walls, White) | Black, White | 8 |
| 5–8 | foredeck railings | **Fence Lattice 1×4×1 `3633` L** ×2 on the inner hull rows z1 / z3, x11–14 (White ✓). Studs under them: the deck plates at x11–12 and the wedge plates' straight-side studs. **Verify the `43722a` stud map in `check-studs`** | White | 2 |
| 8–9 | saloon roof | Plate 4×10 + 1×10 [M: confirm 1×10 `4477` exists; else 1×6 + 1×4], Tile 2×4 / 1×4 on top except under the wheelhouse and fin | White | 8 |
| 9–11 | orange fin, aft of the wheelhouse | **Slope Curved 2×1 `11477` L ×3** (Orange ✓), across z1–3 at x6–7, curve falling aft | Orange | 3 |
| 9–11 | wheelhouse x8–10, z1–3 | Plates 1×3 / 1×2 L, two courses, front and sides Black (wrap-round glass), back White | Black, White | 10 |
| 11–12 | wheelhouse roof + horn | Plate 3×3? → **Plate 2×3 `3021` + 1×3 `3623`**, Tile 1×3 / 2×3 [M `26603` not baked → use 2× `63864`], Plate 1×1 Round `6141` + Cone 1×1 `4589` (horn/mast) | White | 6 |
| w | wake | **Tile 1×1 Round `98138` L ×10** in two short diverging lines astern (x 24–29) + 2 at the bows; on wet studs | White | 12 |
| | | | **Boat ≈ 88 + wake 12** | **≈ 100** |

- **Connections:**
  - Hulls clutch the wet studs.
  - Every hull brick sits on the boot-top plates; the deck plates bridge both hulls across the tunnel and are clamped by the saloon walls above. That is two layers over the tunnel, joints staggered (rule 2: long members are two staggered layers).
  - The fin and wheelhouse sit on the saloon roof's studs; the fences on deck studs.
  - Nothing leans, so no clip or hinge is needed.
- **Footprint:** 16 × 5 + wake 6 × 4. **Height:** 12 above w = **G + 10**.
- **Bake:** `43722a`, `43723a`. Authored as `tools/ldraw/asm-seoul-hangang.mjs` → `hangang_bus.ldr` (Shanghai's `building()` + `layer()` grammar), exploded with `bp.assembly`.

## 4. Chimaek picnic pair

### 4.1 Can `minifig2` sit? No.
- `minifig2` always places `fig_legs` (970c00) standing, 6 plates under the torso (`lib.ts` 142–176). `FigOpts` has no leg pose, and the rig (`minifig-asm.mjs`) only poses arms and wrists.
- **What exists:** LA's coaster riders (`tools/ldraw/asm-la-park.mjs` `riderParts` / `rider`) are seated LDraw minifigs as assembly members:
  - hips `3815` at (0, 32, 0);
  - legs `3816` / `3817` on the hip pin at (0, 44, 0), turned Rx(−90°) so the feet reach forward;
  - leg undersides 21 LDU under the hip origin, so the hips' origin sits 1.05 studs above the seat surface;
  - every figure mould already in `check-asm-studs`' BY_DESIGN.
- **What it takes:**
  1. Copy `riderParts` into `asm-seoul-hangang.mjs` as `seatedFig({ torso, legs, hair, face, poseL, poseR, hold })`. Arms at any POSE elevation (the same `Rz(tilt)·Rx(θ)` rule).
  2. Place each held part at the hand's GRIP point (`minifig-asm.mjs` `GRIP`), turned as `HELD` turns it.
  3. Seat both figures on the mat's studs in one `hangang_picnic` assembly with the mat, box and held props. Add `33057` and `95228` to BY_DESIGN (held in a clip).
  4. Printed faces and torsos go on as on LA's riders (`face_laugh` was registered on `ld_3626c`).
  - ≈ ½ day, no change to `minifig2`.
- **Fallback:** two standing `minifig2` figures at the mat's edge clinking drumstick and bottle (`h` poses). It needs no new code but reads as "standing on a blanket".

### 4.2 Real thing and brick versions
- **Real:** people sit on mats packed along the river rail facing the water (`real-hangang-yeouido.jpg`): a delivered fried-chicken box between them, beer.
- **Brick versions:** LA's seated riders (ours, built: the seat technique). Official picnic sets [M] use a printed or checkered tile blanket.
- **Ours:**
  - two seated figures **side by side facing the river** (south = the camera: rule 6 met without a back to the viewer);
  - the chicken box between them;
  - one figure lifts a **drumstick**, the other a **beer bottle**: chi + maek, legible at distance.

### 4.3 Sketch (mat 6 × 4 at x 36–41, z 46–49; figures face +z = south)
```
TOP                 x36 37 38 39 40 41          SIDE (from the south)
z46 (north)          A  A  .  .  B  B          G+12  hair
z47                  A  A  K  K  B  B          G+6   torsos, arms f; drumstick (A, right hand) / bottle (B, right hand)
z48                  a  a  K  K  b  b          G+3   hips 1.05 stud over the mat; legs forward
z49 (south)          a  a  t  t  b  b          G+1   mat: Plate 4×6 + checker tiles
A/B = hips over row 47 (legs' rear holes on the studs of row 48), a/b = legs and feet, K = chicken box 2 × 2, t = tiles
```

### 4.4 Level table
| Plates | Element | Part types (id, status) | Colour | Pcs |
| --- | --- | --- | --- | --- |
| G → G+1 | mat | Plate 4×6 `3032` L | White | 1 |
| G+1 | checker (gingham) on the cells no figure or box stands on | Tile 1×1 `3070b` L, alternate cells | Medium Azure (ties to the boat's blue; pink is Kyoto's) | ≈ 6 |
| G+1 → G+3 | chicken box | Plate 2×2 `3022` L + **Tile 2×2 `3068b` L printed** (lid) | White | 2 |
| G+1 → G+12 | figures A, B, seated | `973` torso + `3818`/`3819` arms + `3820` hands + `3815` hips + `3816`/`3817` legs + `3626c` head + hair (`40233` / `12890` L) — all L | casual (two of the planned torso prints), faces `face_smile` / `face_grin` | 20 |
| | drumstick in A's right hand (arm −45°) | **`33057` bake**, turned bone-down for the clip: LDraw matrix **Rx(−90°) = `1 0 0 0 0 1 0 -1 0`** (bone +z → +y: down in the fist, meat up) | **Dark Orange** ✓ (only Dark Orange / Earth Orange exist) | 1 |
| | beer bottle in B's right hand (arm −45°), held by the neck | `95228` L (catalogue `bottle`, gp [0, 1.2, 0]) | **Trans-Brown** ✓ (Korean beer; Trans-Green = soju as an alternative) | 1 |

- **Connections:** the mat sits on lawn studs (studded ground under it). Each figure's legs take two mat studs at the leg rears (LA's seat rule). The box plate sits on the mat studs, its lid tile on the plate. Held props are in the hand clips (BY_DESIGN).
- **The bone is not straight:** it rises ≈ 13° between z 16 and 24 LDU (zprof). In the clip it stands within 13° of the bore, |cos| 0.97.
- **Footprint:** 6 × 4. **Height:** G + 12.5 (seated heads ≈ G + 10).
- **Grip point if it is ever held standing:** `drumstick_up: { pose: 'f', gp: [0, -0.63, 0.17], shaft: true, axis: 'y' }`, computed from the bone at LDraw (0, −6, 22) after the turn.

### 4.5 Print: the chicken box (design no. 11 in korea.md §1.8; ≤ 4 colours)
- **On the 2×2 lid:** **치킨** in **Red hand-marker hangul** (round-capped, slightly uneven, heavy strokes, like the markers delivery shops scrawl on boxes), on White, with a small Dark Orange drumstick glyph under it. Three colours. Canvas px ≥ 320.
- **Drawn as stroke skeletons** (LA's lettering method: `la_arch_band`), not with a font. ㅊ ㅣ ㅋ ㅣ ㄴ are nine strokes, so no system font is assumed (Nanum Pen Script is macOS-only [M]).
- **Lettering record for korea.md:** delivery-box marker hangul, drawn strokes.
- **Risk:** the lid faces the sky. From the default camera (el 0.45) it is seen at ≈ 26°, so the two glyphs foreshorten.
  - Check at thumbnail size. If it fails, print the box's front face instead (a `1×2` brick side).
  - Else cut the print and let the drumstick carry "chicken".

## 5. The royal gate guard (sumunjang) by Gwanghwamun

### 5.1 Real thing → mapping
- **Real** (`real-guards-gate.jpg`; `real-guard-gwanghwamun.jpg`):
  - ankle-length red robe over a yellow/white undershirt, a black belt;
  - a black felt hat (jeonrip) with a wide flat brim, a rounded crown and two feathers;
  - a long polearm with a curved blade (woldo), its butt on the ground, held at the side;
  - standing still on a low granite stand at the gate tunnel, facing out.
- **Mapping:**
  | Real | Mould |
  | --- | --- |
  | Robe | **`36036` Hips and Skirt** L (Red ✓ / Blue ✓): a drop-in for the legs, same origin and height (bbox y −11..40 LDU, as 970c00), 2 × 2 footprint reaching 1 stud behind the legs |
  | Torso | the planned guard-robe print (chest panel, black belt, yellow cuffs) |
  | Hat | **`30167`** bake, Black ✓ |
  | Polearm | **`6123` Halberd** bake, Dark Bluish Gray ✓ (Black ✓): an axe-and-spike head, not a crescent woldo, but no woldo mould exists. `4497` spear is the plainer alternative |
  | Feathers | none: 30167 has no pin hole (seoul-hanok NOTES) |
  | Stand | a **Plate 2×2 `3022`** in Light Bluish Gray under the skirt (the granite stand), +1 plate |

### 5.2 Does 30167 sit on a head? Yes
- It contains an inverted `stud4` at (0, −4, 0): the socket over the head's hollow stud (head `3626c` bbox y −4..24, stud top at −4).
- Its origin is the head's top, the same origin hair uses. So it goes on as a hairpiece: `hairKey: 'hat_widebrim'`, `hair: 'Black'`, lift 0.
- Brim radius 25 LDU (Ø 2.5 studs); crown 12 LDU above the head top.
- **The pinned-up side** (+x in the part frame = the figure's left) must face the back.
  - `minifig2` turns hair with the head and cannot offset it, so add a pre-turned mould to `minifig-asm.mjs` `HELD`: `fighat_brimback: ['30167', [0, 0, -1, 0, 1, 0, 1, 0, 0]]` (Ry: +x → +z = the figure's back in LDraw).
  - Register that as `hat_widebrim`.

### 5.3 Halberd grip (from the mould)
- **6123:** the shaft is `4-4cylc` r 4 LDU (bar-size ✓) from LDraw y 70 (butt) to −70; the head runs to y −114. bbox x ±5, y −114..70, z −32.7..20 (the blade on −z).
- **In our frame:** the box centre sits 1.1 studs above the origin and 0.32 toward +z. Length 184 LDU = **23 plates**.
- **The `f` hand's clip** is 2.92 studs above the feet (`RIG.grip.rf` y −0.68 under the neck at 3.6). With the butt on the ground the hand closes 2.92 studs up the shaft: 0.58 studs below the origin, so gp y = −0.58 − 1.1 = **−1.68**.
  - Check: centre = torso + G − gp = y·0.4 + 4.6, and bottom = centre − 4.6 = the feet's level ✓ (the butt sits on the stand's studs, inside VSKIN).
- **HOLD_DEFAULTS entry:**
  ```ts
  halberd: { pose: 'f', gp: [0, -1.68, -0.32], shaft: true, axis: 'y', rotL: 1, rotR: 3 },   // the shaft in a forward fist, butt on the ground; the blade turned outward (broadside to the camera)
  ```
  - `axis 'y'`: `rf`'s bore is [−0.17, −0.99, 0], |cos| 0.99 ≥ 0.9 ✓.
  - `rotR 3` maps the blade's +z to −x (outward on the right). **Confirm both rotations in a close-up**; the sign convention of `rotv` is easy to flip.
- **Clearances:**
  - The shaft is 1.07 stud right of and 1.51 in front of the body axis: 1.85 from the head axis, outside the brim's 1.25 ✓.
  - It is 1 stud clear of the skirt's front face ✓.
  - The blade top is at G + 1 + 23 = **G + 24**, about 1.8 × the figure (photo ≈ 1.4–1.6 ×; acceptable).

### 5.4 Code needed (later, at build time)
- **Catalogue:**
  - `fig_skirt` = `ldrawPart({ key: 'fig_skirt', id: '36036', cat: 'minifig', w: 2, d: 2, h: 6, studs: 'all', accepts: true, anchor: 'origin', lift: 5, body: true, ext: [-1, 1, -1, 1] })`. The box is the tube's 2 × 2: one tube between four studs, per rule 7.
  - `hat_widebrim` (as hair, w 3 d 3).
  - `halberd` (`...ACC`, h 23).
- **`minifig2`:** a `skirt?: string` option that places `fig_skirt` at offset oz −0.5 (the tube 0.5 behind the legs' centre) instead of `fig_legs`.
- **Validator:** its "foot over nothing" check needs the skirt's 2 × 2 as the support test.
- **Placement:** the guard stands on the forecourt by the gate's **east** pier (the stage is offset west), facing south. Coordinates come from the Gwanghwamun scheme (`../seoul-palace/`). Parts ≈ 9, counted with the figures and the gate.

## 6. Totals and budget split
| Element | Footprint (studs) | Height | Parts | Bake |
| --- | --- | --- | --- | --- |
| River dressing: glints, bank step + coping + quarter tiles | 76 × 15, bank ≈ 80 long | G | ≈ 45 glints + ≈ 85 bank = **130** | — |
| Park: path (tiles), 4 lamps, 2 benches | 76 × 5 path; lawn 76 × 2–6 | lamps ≈ G + 22 | ≈ 55 + 20 + 14 = **89** | — |
| Hangang Bus + wake | 16 × 5 (+ 6 × 4) | G + 10 | **≈ 100** | 43722a, 43723a |
| Chimaek picnic (mat, box, 2 seated figures, props) | 6 × 4 | G + 12.5 | **≈ 32** | 33057 |
| **Han line in korea.md §1.10** | | | **≈ 350** (budget 500: ≈ 150 headroom) | |
| Guard (counted with Gwanghwamun / figures) | 2 × 2 + stand | G + 24 (blade) | ≈ 9 | 30167, 6123 |

**Which budget the water counts in:**
- The river's **earth columns, bed plates and surface tiles** (≈ 990 water cells: ≈ 310 tiles + ≈ 60 bed plates + ≈ 50 earth bricks after packing ≈ **420**) belong to the **island ground line (≈ 2,100)**, as LA's sea did.
- So does the lawn's ground course.
- The 500 Han line covers only what sits on or replaces the ground: glints, bank, path, lamps, benches, boat, wake, picnic.
- Specialty moulds in this strip (wedges, fences, curved slopes, quarter tiles, round tiles, figures and accessories) ≈ 25 % of its pieces.

## 7. Risks, each with a fallback
| Risk | Fallback |
| --- | --- |
| Sand Blue reads as LA's sea | Swatch B (Sand Green flecks), or Trans-Clear glints at a higher share |
| Trans-Clear glints render as white specks or frost (untested; correction 6) | Fewer, in 1×2 streaks only; or Light Aqua opaque 1×1 tiles as the sparkle |
| The front band (river + bank + lawn + path ≈ 26 deep) squeezes the gate, stage and Namsan behind it on a 64-deep island | Path 5 → keep; lawn ends 2 → 1; river edges 15 → 13. Or the island grows to 68 deep (rule 13: grow, don't squeeze) |
| The bow stair-steps read ragged | Longer straight runs (the table has 6-stud steps), quarter tiles at every jog; if it still reads ragged, a straight bank with the lawn widening by a single 6-stud jog in the middle |
| Twin hulls invisible from the default south camera | Accept: the livery reads side-on; the tunnel shows in the SE/SW quadrant renders and the hero shot |
| Wedge plate stud map under the fences | Fences 1×2 (`3633`'s 1×2 cousin [M]) or move them to x10–13 on plain plates |
| Seated asm takes longer than ½ day | Standing fallback (§4.1) |
| 30167 still reads "adventurer" even turned | Cowboy `3629` (flat brim, taller crown, Black [M]), or accept: robe + halberd carry the read |
| Halberd blade turned the wrong way | Swap rotL / rotR after the first close-up |
| The box print fails the thumbnail test | Front-face print or no print (drumstick carries it) |

## 8. Target image `../seoul-hangang-lego.png` (gpt-image-2, 1536 × 1024)
**Prompt:**
> The Han River waterfront of Seoul built as a LEGO element at minifig scale, on a plain grey studio background, real visible bricks and studs, three-quarter view from the front at about 30 degrees elevation. A rectangular baseplate section 48 studs wide and 26 studs deep, its front edge a dark bluish grey stone plinth. Front half: a calm wide river of opaque sand-blue 2x2 and 1x2 flat tiles with a sparse scatter of trans-clear 1x1 tiles as sun glints. On the river a modern Seoul river-bus catamaran about 16 studs long and 5 studs wide: two slim white hulls with a one-stud gap between them visible at the bow, black plate waterline stripe, the stern third of the hull sides solid royal blue fading into white through a few blue round 1x1 tile dots, a dark bluish grey strake under the deck edge, a long single-storey white cabin with one continuous band of black window bricks, a small raised white wheelhouse at the forward end with black windscreen and an orange curved slope on its rear roof, white lattice railings on the open foredeck, white round tiles forming a V-shaped wake behind it. The river's north bank bows gently toward the viewer in the middle: two shallow steps of light bluish grey tiles down to the water, quarter-round tiles softening each jog. Behind the bank a strip of lawn in green and olive green studded plates with a few dark tan patches, and a straight bicycle path of dark bluish grey tiles 5 studs wide with one solid yellow 1-stud centre line of tiles running the full width. On the widest part of the lawn a blue-and-white checkered picnic mat 4x6 with two seated minifigures side by side facing the river: one holds an orange-brown fried chicken drumstick, the other a brown beer bottle; between them a small white 2x2 box with red hand-lettered Korean text. Three slim grey lamp posts with white disc heads along the path, two wooden park benches facing the river. No buildings, no bridge, no fountain, no sky, crisp product photography, soft studio light.

**Right against the scheme:**
- Two slim hulls with the tunnel visible at the bow, Wedge-like blunt stems.
- The blue stern fading forward through a halftone.
- The black boot-top and the continuous dark window band.
- An orange element on the wheelhouse.
- The seated pair facing the river, drumstick and bottle, a 2 × 2 box lettered 치킨.
- The stepped grey bank; a dark path with a solid yellow line; lamps with white discs.
- It confirms that the halftone and the window band carry the boat at a glance.

**Wrong against the scheme:**
- The water is saturated Medium Blue (ours: Sand Blue, opaque, muted).
- The glints are raised 1 × 1 bricks (ours: flush tiles, far fewer).
- The wake is ≈ 60 round tiles, a fan (ours: ≈ 10).
- The boat is ≈ 28 studs long with the halftone as proud dots (ours: 16 long, a flush plate diagonal).
- The orange fin is a flat tile (ours: curved slopes falling aft).
- The bank bows **away** from the viewer (ours: toward).
- The mat sits **on the cycle path** (ours: on the lawn south of it, path clear).
- The benches stand north of the path.
- The lettering is on the box's side (ours: the lid, side as fallback).
