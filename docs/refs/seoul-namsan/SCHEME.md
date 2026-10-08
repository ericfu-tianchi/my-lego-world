# N Seoul Tower on Namsan · Namsan hill · Bugaksan + City Wall — analysis and build scheme
2026-10-06 · research and design only, no brick placed · sources: `NOTES.md` (this folder), `../seoul-real/NOTES.md`, `docs/countries/korea.md` §1 (approved) · reference render `../seoul-namsan-lego.png` (§7)

## Units and conventions
- Heights in plates. **G** = island surface (absolute plate 10; base 3). **T** = the tower foot = Namsan plateau top = **G + 14**. Tower rows are given above T, hill rows above G. A minifig is ≈ 12.5 plates.
- ASCII: 1 char = 1 stud, north up, the default camera looks from the south. Hill-local frames are given per element; island placement is fixed at the island stage.
- Status: **L** = baked LDraw mould (`src/parts/ldraw/index.ts`); **P** = catalogue entry (procedural or ldrawPart); **bake** = to bake. Every number was checked against `vendor/ldraw-lib/ldraw/parts/<n>.dat` (first line quoted where it matters). Connectors come from `tools/ldraw/studs.mjs`; shell clearances from the mould's vertices (radius × height profile, scratch script). Colours: **[BL]** = in BrickLink's known-colours list (fetched 2026-10-06); **[M]** = from memory, unchecked.

## 0. Decisions for Eric (top of page)
1. **Bugaksan costs more than its budget.** Solid, terraced like LA's hills, at **44 × 10** with a 44-plate crest it comes out at **≈ 870 parts** (budget 700). Namsan comes in **≈ 790** (budget 1,250), so the pair is **≈ 1,660 against 1,950**. **Recommend: keep 44 × 10** and take the money from Namsan's saving. Fallback: 36 × 9 with a 40 crest (≈ 700). (Estimates ±25 %: the same estimator over-counted LA's measured hill sample by 15 %.)
2. **Palgakjeong and the cable car: cut** (recommended). The summit is at tower scale (1 plate ≈ 3 m). At that scale the pavilion would be 2 plates tall; at minifig scale it would be 15 plates beside a 7-plate tower base building. Either way, one of the two would read wrong. The cable car runs up the north face, which the default camera never sees. This applies the Neuschwanstein scale rule: **no minifig on Namsan**, and none was planned (korea.md §1.7 already cut the love-lock couple).

No other open decision: the tower stays as approved (scheme A, top **T + 82.5 = G + 96.5**).

## 1. Corrections to NOTES / korea.md found by this pass
1. **The 6 × 6 / 4 × 4 round plates have a centre *tube*, not a stud.** The underside centre of 11213 / 60474 / 18897 is `stud18a.dat`, whose LDraw title is "Stud Tube Open Snap". Our `tools/ldraw/studs.mjs` regex lists `18a` as a downward stud. This is harmless for `check-asm-studs`, which only tests upward studs, but the regex is wrong; fix it as a one-token change at build time. Consequence: a 2 × 2 round brick's four studs (±10, ±10 LDU) are clutched by the round plate's centre tube *and* its four side tubes at (±20, 0) / (0, ±20), each 14.1 LDU from every stud. This is a full 2 × 2 joint, coaxial.
2. **The pod's "dark bowl" cannot be a flipped 6 × 6 dish.** A flipped `44375b` points its four studs **down**, so it needs an upward-facing anti-stud under it. The Supertree solves that with an axle and a flipped cone (`asm-grove.mjs`). But the bowl's rim has no connector, and its inner floor is 8 LDU below the rim, so **nothing stacked above can clutch it**: the pod would just lie on it (rule 2, "nothing just lies on anything"). The Supertree gets away with it only because the dish is the last part. → The bowl is two stepped dark round plates (§2.4).
3. **The lattice rings are dishes the right way up**, threaded in the stack. They are not upside down as NOTES suggests (that is the Supertree cap). A `4285b` with its studs up has a 2 × 2 tube underneath and four studs on top, so the column continues through it. Its rim lip hangs one plate below its base at r 2.75–3 studs (LDraw: vertices y 7.5–16 at r 55–60 LDU), which clears a Ø 4 cylinder. Its shell sits 4 LDU above the support plane at r 36 LDU, exactly a stud's height, so the 4 × 4's outer studs would touch it. **A Ø 2 spacer plate under each dish** buys one plate of clearance (§2.4).
4. **The base building is round.** `real-base-plaza.jpg` shows a curved glass band wrapping the tower's foot. NOTES drew a 10 × 7 box (≈ 120 parts) and Miniland a box. → An 8 × 8 ring of `2577` *Brick 4×4 Corner Round* with a `30565` *Plate Round Corner 4×4* roof: **12 parts**, the technique used for Griffith's wings. Tower total ≈ 60 parts, not 190.
5. **Namsan's rocky face is its north face**, toward Bukchon, away from our camera. The camera sees the **wooded south face**. So granite is a light accent on Namsan, and the granite reads on **Bugaksan** (its real character: bare granite domes).
6. **The City Wall climbs Namsan's west ridge** from the Sungnyemun side (`real-citywall-ridge.jpg`). Placed on the west spur running along x, its outer face looks south, and the default camera sees it side-on, merlons stepping up: the photograph's view.
7. **Wall height.** NOTES' "2 bricks + parapet" (≈ 10 plates) would stand taller than the tower's base building. At tower scale the real 6–7 m wall is ≈ 2.5 plates. The shared module is **7 plates**, which still stays under the 7-plate base building, because it meets the plateau one tread down (+11) (§4).
8. **Korean red pines must not read as palms.** The gpt-image render (§7) turned "bare reddish trunk + top tufts" into palm trees. `sonamu` therefore carries foliage pads from mid-height and a crown wider than tall (§3.3).
9. Colour facts [BL]: `87081` is **not made in Light Bluish Gray** (White, which is what we use, is). `2577` exists in White and Dark Bluish Gray, `4285b` in Light Bluish Gray, `15533` in Light Bluish Gray, `18674` in White (BrickLink calls it "Tile, Round 2 × 2 with Open Stud").

---

## 2. N Seoul Tower (hero)

### 2.1 Real proportions and signature (NOTES §0, measured on `measure-tower-north-crop.png`, H = 236.7 m)
- Round everywhere. Lower cylinder Ø ≈ 2 × shaft. Two radial lattice rings at ≈ 25 / 31 m. Shaft Ø ≈ 0.045 H. Pod bottom 0.41 H. Pod Ø 0.127 H, its height ≈ 1.07 × Ø: a dark shallow bowl, a wide drum with 4–5 window rows, an upper drum ≈ 0.81 Ø with 2 rows, a flat roof. White collar ≈ 0.034 H. Red/white lattice mast 0.43 H, red at the bottom and at the top, narrowing twice.
- **Signature:** the slender white shaft, the banded two-tier pod, the long red-and-white mast, standing on the hill. Without the hill it is "any TV tower" (Miniland's lesson).

### 2.2 Brick versions → conclusion
| Version | What it does for the signature |
| --- | --- |
| **LEGOLAND Korea Miniland** | Near-true slenderness (pod 0.12 H, mast 0.38 H, base building 0.12 H); tower on the summit, wall on the ridge, a white base building with a dark glass band. **The proportions and composition we copy** |
| sounderTV LDD | Pod from 6 × 6 round plates in glass/floor colours; **a webbed 6 × 6 dish as the foot ring**; pod ≈ 3 × shaft |
| nakho1 Skyline | Red / White / LBG 1 × 1 rounds alternating + a bar = the mast in one stack; coloured band between white plates = the window row |
| Bertie's Bricks | Red/white 1 × 1 round plates + a red bar tip; pod too flat (counter-example) |
| Maker Ggu | Alternating band rings, **a narrower upper drum**; turquoise glass (stylisation) |
| Brian Yu, All That Bricks | Stacked round plates as floor bands; banded drum + red/white mast + green hill = the identity even at 25 parts |
| Simplick | Fat 4 × 4 shaft: counter-example |

**Ours:** Miniland's proportions, sounderTV's 6 × 6 plate pod and webbed-dish ring, nakho1's red/white round stack on a bar, Maker Ggu's two-tier drum. We add what none of them has: the dark stepped underside, the two rings stacked as on the real tower, and the round base building. **Every member sits on one vertical axis** at a grid vertex (all parts even-width, or 1 × 1 on a jumper's centre stud).

### 2.3 Sketch: side, from the south (1 char ≈ ½ stud across, plates up; T = plateau top)
```
 T+82.5        |        red bar tip (Bar 4L, red) — threaded on it: 4 open-stud round plates R R W W (73–77)
 T+73          █        mast: 6 × 1×1 round bricks R W R W R W (55–73)
 T+55        ▄▄█▄▄      2×2 round jumper (flange), White
 T+51         ███       collar: 2×2 round brick, White
 T+50       ▄▄▄▄▄▄▄     roof 4×4 round plate, White
 T+47       ▒░▒░▒░▒     upper drum Ø4: 4×4 round plates DBG / LBG / DBG
 T+38   ▓▒▓▒▓▒▓▒▓▒▓▒▓   lower drum Ø6: 9 × 6×6 round plates, LBG floor / DBG glass alternating (5 floors, 4 glass rows)
 T+37   ▀▀▀▀▀▀▀▀▀▀▀▀▀   underside: 6×6 round plate DBG (37–38)
 T+36      ▀▀▀▀▀▀▀      underside step: 4×4 round plate DBG (36–37)
               ██
 T+18          ██       shaft Ø2: 6 × 2×2 round bricks White (18–36), Axle 7 spine inside
 T+17   ‾‾‾‾‾███‾‾‾‾‾   ring 2: webbed dish 6×6, studs up, LBG (17–18), on a White 2×2 round spacer (16–17)
 T+15        ████       4×4 round plate White (15–16)
 T+14   ‾‾‾‾‾███‾‾‾‾‾   ring 1: webbed dish 6×6, LBG (14–15), on a White 2×2 round spacer (13–14)
 T+7         ████       lower cylinder Ø4: 2 × 4×4 round bricks White (7–13)
 T+6    ╭▄▄▄▄▄▄▄▄▄▄▄╮   roof: 4 × quarter round plates White (6–7)
 T+3    │▓▓▓▓▓▓▓▓▓▓▓│   glass band: 4 × 4×4 corner round bricks DBG (3–6)
 T      │███████████│   base: 4 × 4×4 corner round bricks White (0–3) — ring Ø8
```

Top view on the plateau (1 char = 1 stud; axis `+` at a grid vertex):
```
      x 13 ... 20
 z 7    ╭──────╮     base ring Ø8 (2577 ×4): outer r 4, 1 stud wall, hollow 6×6 inside
        │ ╭──╮ │     lower cylinder Ø4 on the roof's centre 4×4 (87081 ties all four quarter roof plates)
        │ │+ │ │     shaft Ø2 at the same axis
        │ ╰──╯ │     rings and pod Ø6: x 14..19, z 8..13 (overhang the Ø4 by 1, inside the Ø8 ring)
 z 14   ╰──────╯
```

### 2.4 Level table (plates above T; bottom → top)
| Plates | Element | Part (LDraw no., status) | Colour [avail.] | Connection |
| --- | --- | --- | --- | --- |
| 0–3 | base ring, lower course | 4 × `2577` Brick 4×4 Corner Round (L) | White [BL] | studs into plateau plates |
| 3–6 | glass band | 4 × `2577` | **Dark Bluish Gray** [BL] (opaque: trans renders as frost) | stud in anti-stud on the course below (quarters stack aligned; tied above) |
| 6–7 | roof = white top band | 4 × `30565` Plate Round Corner 4×4 (L) | White [BL] | on the ring's studs; the four quarters are tied together by the 87081 above |
| 7–13 | lower cylinder Ø4 | 2 × `87081` Brick 4×4 Round with Pinhole and Snapstud (L) | White [BL] | side tubes (±20, 0)/(0, ±20) + centre tube clutch studs of all four roof quarters |
| 13–14 | spacer | `4032a` Plate 2×2 Round with Axlehole (L) | White [M] | on the cylinder's centre 4 studs |
| 14–15 (lip to 13) | **ring 1** (lattice ring) | `4285b` Dish 6×6 Inverted Webbed, **studs up** (L) | Light Bluish Gray [BL] | its 2×2 tube on the spacer's 4 studs; rim lip r 2.75–3 clears the Ø4 cylinder; shell 4 LDU over the cylinder's outer studs |
| 15–16 | lower cylinder top | `60474` Plate 4×4 Round with Hole and Snapstud (L) | White [BL] | centre + side tubes on the dish's 4 studs |
| 16–17 | spacer | `4032a` | White | as above |
| 17–18 (lip to 16) | **ring 2** | `4285b` studs up | LBG | as ring 1 (lip clears the Ø4 plate) |
| 18–36 | **shaft Ø2** | 6 × `3941` Brick 2×2 Round (L) + **Axle 7** `44294` (L) inside as a spine | White [M] | stud in tube, one axis; the axle passes through the bricks' cross holes (`s/3941s01` contains `axlehole.dat`), ≤ 17.5 plates long so it stays inside the 18-plate shaft |
| 36–37 | underside step Ø4 | `60474` | **Dark Bluish Gray** [BL] | centre + side tubes on the shaft's 4 studs |
| 37–38 | underside Ø6 | `11213` Plate 6×6 Round with Hole and Snapstud (L) | Dark Bluish Gray [BL] | tubes (±20, 0)… on the 4 × 4's 12 studs |
| 38–47 | **lower drum**, 9 plates: LBG · DBG · LBG · DBG · LBG · DBG · LBG · DBG · LBG | 9 × `11213` | LBG floors / DBG glass [BL] | plate on plate, full 6 × 6 stud pattern |
| 47–50 | **upper drum Ø4**: DBG · LBG · DBG | 3 × `60474` | DBG / LBG [BL] | centre tubes on the 6 × 6's centre studs |
| 50–51 | roof | `60474` | White [BL] | — |
| 51–54 | collar | `3941` | White | on the roof's centre 4 studs |
| 54–55 | flange / axis reducer (rule 7: no 1 × 1 on a 2 × 2's corner) | `18674` Plate 2×2 Round with 1 Centre Stud (L) | White [BL] | its tube on the collar's 4 studs; one centre stud up |
| 55–73 | **mast**, 6 bands R W R W R W | 6 × `3062b` Brick 1×1 Round with Hollow Stud (L) | Red / White [M] | stud in anti-stud on the jumper's centre stud |
| 73–77 | mast head bands R R W W | 4 × `85861` Plate 1×1 Round with Open Stud (L), threaded on the bar | Red / White [BL] | stud in anti-stud on the top 3062b; the bar passes through the open studs |
| 72.5–82.5 | **tip** (the second narrowing) | `30374` Bar 4L Lightsaber Blade (L), its foot in the top 3062b's hollow stud | Red [BL] | bar in hollow stud (LA lamp precedent) |

Proportions achieved: pod bottom 36 / 82.5 = **0.44 H** (real 0.41). Pod Ø6 = 0.18 H (real 0.127: **1.4 ×**, the same factor as the shaft, 0.061 H vs 0.045). Pod height 15 plates (36–51) = 1.0 × Ø (real 1.07). Mast incl. collar from the roof = **0.38 H** (Miniland 0.38). Base ring 0.085 H. **Top G + 96.5** (height table: 96 ✓).

**How tall can the shaft be (the brief's question)?** Rules 2 and 7 set no limit. Every joint is a full 2 × 2 stud-in-tube joint on one axis, so a longer shaft is just more of the same joint. The physical limit is wobble under a 15-plate Ø 6 head. Real round-brick columns of 6–10 bricks are common, and the **Axle 7 spine** is the standard LEGO way to make one rigid. With it, the shaft could go to ≈ 24 plates (an Axle 10, `3737`, also baked) before the proportions, not the build, say stop. 18 plates gives the measured 0.44 H.

### 2.5 Footprint, height, parts, bake
- **Footprint** Ø8 base ring (8 × 8) on the plateau; pod and rings Ø6. **Height T + 82.5 = G + 96.5.**
- **Parts ≈ 58:** base 12, cylinder + rings + spacers 7, shaft 7, pod 15, collar + flange 2, mast 6 + 4 + 1, plus plateau paving (counted in the hill).
- Authored as one LDraw assembly `seoul_tower` (`tools/ldraw/asm-seoul-tower.mjs`, the Pearl's `stack()` pattern) and exploded with `bp.assembly()` (rule 12).
- **Bake: none.** Every mould is already baked: `2577 30565 87081 4032a 4285b 60474 3941 44294 11213 18674 3062b 85861 30374`.
- Pipeline: `check-assemblies` needs `INTERLOCK 44294|3941`, because the axle lies inside the bricks' boxes. `check-asm-studs` already counts `44294` as an axle joining the bricks it passes through.

### 2.6 Risks → fallback
- **Upper drum Ø4 vs real 0.81 Ø (≈ 4.9)**: the set-back may read too deep. → Ø6 upper drum (`11213` ×3) with a lighter top two rows, judged side by side.
- **1-plate stripes may read as "striped drum", not windows.** → Glass rows 2 plates (DBG ×2) / floors 1, 3 rows; pod +1 plate.
- **Base ring quarters stack aligned (no staggered joints).** Each quarter column is stud-held to the plateau and tied at the top by the roof quarters + 87081, so it is real, but the seams line up. → Insert a `30565` quarter-plate layer turned 90° between the courses if a seam shows in close-up.
- **Dish ring reads as a flat disc from 26° above** (the render turned it into a plate). The webbed `4285b` shows its radial ribs from above (Supertree experience), which is better than any flat plate. → `44375b` solid dish if the ribs read as noise.

---

## 3. Namsan hill

### 3.1 Real and signature
A lone, round-shouldered dome above downtown. Its relief (~200 m) is about the tower's height. Dense mixed forest with **Korean red pines** on the ridges (the anthem's "남산 위에 저 소나무"), granite outcrops mostly on the north face, a flat paved summit, the City Wall climbing the west ridge (`real-citywall-ridge.jpg`). Signature in the set: **a wooded hill that is plainly the tower's pedestal**, with pines that read as pines and a wall on its ridge.

### 3.2 Brick versions → conclusion
Miniland (turf hill, rock face, wall on the ridge: composition), Brian Yu (stepped green hill with offset terraces), All That Bricks / nakho1 (green block hill), and **our own LA hills** (`../la-hollywood-sign/BUILD.md`: solid columns, 3-plate treads, every riser covered by a slope facing its way, scrub of 3-leaf plates, colour by zone). **Ours = LA's technique exactly**, in Korean colours: Olive Green treads, Dark Green under pines, slopes Olive / Dark Green, a few LBG granite risers.

### 3.3 New `tree` kind: `sonamu` (Korean red pine)
A spec for `lib.ts` (`Foliage` + spec table + colour rows). The armature is unchanged (2 × 2 round trunk on its axis, four corner limbs per fork, crown on a jumper).

| | value | why |
| --- | --- | --- |
| trunk colours, per segment | `DarkBrown` (base) → `ReddishBrown` … → `DarkOrange` (top segment) | the bark is grey-brown low and orange-red high (`../seoul-real/red-pine-seoul.jpg`, `bugaksan.jpg`) |
| limb plates | `ReddishBrown` | |
| tip cluster | 3-leaf plate (Dark Brown) → **6 × 5 leaves** (L/M) or 4 × 3 (S) → **one** crossed 4 × 3. Two leaves deep, not three | flat horizontal pads, not puffs (the existing `pine` is three deep and conical) |
| leaf colours | `DarkGreen, DarkGreen, DarkGreen, OliveGreen` | dark blue-green, sun-touched olive; **no** cone tip |
| top | jumper + a flat cluster, 4 × 3 leaves **rot ±1** so the top is wide and flat | the umbrella top |
| L | trunk 3, gap 1, tiers `[[3,0],[2,2],[3,2],[2,4]]`, `[[2,2],[3,0],[2,4],[3,2]]` | ≈ 24 plates, crown ≈ 9 wide |
| M | trunk 3, gap 0, tiers `[[3,0],[2,2],[3,4],[2,2]]` | ≈ 18 plates, crown ≈ 9 wide |
| S | trunk 2, gap 0, tiers `[[2,0],[2,2],[2,4],[2,2]]` | ≈ 13 plates, crown ≈ 7 wide |
| parts | L ≈ 45 · M ≈ 30 · S ≈ 18 | |

**Anti-palm rule** (learned from the target image, §7): foliage starts at **≤ 0.55 of the tree's height**, the crown is **wider than its own height**, and limbs of unequal length show between the pads. A bare pole with a tuft on top reads as a palm. Height-table row: red pines 14–22 above their own ground ✓ (L only on low ground). All stay under the pod (G + 50).

### 3.4 Sketch, top view, hill-local 28 × 22 (x west → east, z north → south; levels above G: `1` = +2, `2` = +5, `3` = +8, `4` = +11, `5` = +14 plateau; `T` = tower base ring; `W` = City Wall on the west spur)
```
     0         1         2
     0123456789012345678901234567
  0  ...........1111111..........
  1  ........1111111111111.......
  2  ......111111111111111111....     north face (away from camera): steeper, LBG/DBG granite risers in patches
  3  .....11111222222222222221...
  4  ...11111222333333333333221..
  5  ...111122333333333333333321.
  6  ..11111233445555555555553311     plateau +14, 12 × 10 (x 11..22, z 6..15), LBG paving tiles
  7  .1111122334455TTTTTTTT553321
  8  .111112233445TTTTTTTTTT53321
  9  .111112233445TT      TT53322     T = base ring Ø8, axis at (17, 11)
 10  .111112233445TT  ++  TT53322
 11  .111112233445TT      TT53322
 12  1222333444545TTTTTTTTTT53322
 13  .WWWWWWWWWW455TTTTTTTT553321     W: wall run along z 13, outer face south, 5 modules (§4), climbing W → E
 14  .12233344455555555555553321      west spur under the wall: treads +2 → +11 in 4-stud steps
 15  ..11111233444444444444443311     south face (to camera): gentle, wooded, the pines
 16  ...111122333333333333333321.
 17  ...11111222333333333333221..
 18  .....11111222222222222221...
 19  ......111111111111111111....
 20  ........1111111111111.......
 21  ...........1111111..........
```
Pines (axis points, `Sites`-spaced, never on the plateau): L at (24, 15) on +8; M at (6, 9) and (21, 18); S at (3, 16), (12, 19), (26, 6). Two Dark Red maple shrubs (round-plate bushes) as the only autumn accent, below Kyoto's loudness (korea.md §1.6: no orange canopies).

### 3.5 Side profile, from the south through the axis (1 char = 1 stud, 1 row = 3 plates)
```
 +96.5             |                 mast tip
                   …                 (tower §2)
 +14 ......▄▄▄▄▄▄▄████▄▄▄▄▄▄▄......  plateau (paving), base ring
 +11   W▄▄▀            ▀▄▄           ◢ = slope cover (45° on the steep north, 33° 3×1 on the south)
  +8  ▄▀◢                 ◣▀▄
  +5 ▄▀◢                    ◣▀▄
  +2▀◢                        ◣▀
  G ══════════════════════════════   island surface
```

### 3.6 Level table (above G)
| Plates | Element | Part types (status) | Colour |
| --- | --- | --- | --- |
| G … tread − 1 | solid columns, packer-laid (LA lesson: a hollow shell left 125–436 floating parts) | bricks 2 × N / 1 × N (P) | Dark Bluish Gray core (hidden) |
| tread − 4 … tread − 1 | riser course (shows on faces) | bricks (P) | Dark Green under pines, Olive Green elsewhere; LBG / DBG in granite patches (north face, ≈ 15 % of risers) |
| tread − 1 … tread | top plate per cell | plates (P); the plateau in **tiles** `3068b` / `3069b` (P) | Olive Green / Dark Green; plateau Light Bluish Gray with a Dark Bluish Gray kerb ring |
| on each 3-plate riser (≈ 5 in 6) | riser cover facing downhill | Slope 33 3×1 (P, `slope_1x3`) on 2-deep treads (south); Slope 45 2×1 `3040b` (L) on 1-deep treads (north); Slope 65 2×1×2 `60481a` (L) where two risers coincide; Slope Curved 2×1 `11477` (L) on the plateau lip | same as the riser |
| on treads | scrub: single / paired 3-leaf plates, a 4 × 3 leaf on some lips, each turned downhill (LA) | `32607` (L), `2423` (L) | Dark Green / Olive Green; Dark Red on two clumps |
| — | 6 red pines (`sonamu` L 1, M 2, S 3) | §3.3 | |

- **Treads at +2, +5, +8, +11, +14** (absolute 12, 15, 18, 21, 24: ≡ 0 mod 3, so whole brick courses; the LA packer note).
- Footprint **28 × 22** (≈ 480 cells inside the outline), plateau 12 × 10 at **+14**. Average slope ≈ 35° south, ≈ 43° north. The wall spur runs x 1–10.

### 3.7 Parts and bake
| Item | Parts |
| --- | --- |
| terrain (solid columns + top plates + riser slopes) | ≈ 450 (estimator 522 × LA calibration 0.87) |
| plateau paving + kerb | ≈ 30 |
| tower assembly | ≈ 58 |
| red pines (1 L + 2 M + 3 S) | ≈ 160 |
| scrub + 2 maple bushes | ≈ 60 |
| City Wall, 5 modules + step fillers (§4) | ≈ 35 |
| **Namsan total** | **≈ 790** (budget 1,250) |
Bake: none. Every mould is baked or in the catalogue. New code is `Foliage 'sonamu'` (lib.ts) and the hill heightmap in the island scene.

### 3.8 Risks → fallback
- **Pines read as palms** (they did in the target image). → Lower the first tier (trunk 2 for M), widen the pads, judge a pine alone in the test scene before the island.
- **Terraces read as a stepped pyramid** (the target image's checkerboard). → Colour by low-frequency zone (6-stud patches by column, never per course: the Neuschwanstein lesson), with more scrub on lips.
- **Plateau too tight** (Ø8 ring in 12 × 10 leaves 1 stud north/south). → Plateau 12 × 12; the hill grows to 28 × 24.

---

## 4. Shared City Wall module (Hanyangdoseong) — used on Namsan and Bugaksan

### 4.1 Real
Light grey **granite ashlar** body. A **segmented parapet (yeojang)**: merlons wider than tall with narrow gaps (≈ 5 : 1), each with **a flat, overhanging, darker cap slab** and one small **square gun hole**. Each merlon is level and **steps with the slope**, which is what the wall reads by on a ridge (`../seoul-real/bugaksan.jpg`, `real-citywall-parapet.jpg`). Miniland's Sungnyemun wall: grey bricks, square dark holes, tile caps.

### 4.2 Module: 4 studs long, 1 stud thick, 7 plates tall, on one level tread
```
 side (outer face, from the south)          top
  ▀▀▀▀▀▀ .                                   [cap1×3][t]     cap = Tile 1×3 DBG over the merlon; t = Tile 1×1 LBG in the gap
  █ ▣ █  .        +4…+7  merlon              [ 1][hl][ 1][ ]   merlon = Brick 1×1 · Headlight 1×1 (recess out) · Brick 1×1; gap 1
  ▓▓▓▓▓▓▓▓        +0…+3  body                [ masonry 1×4 ]   body = Brick 1×4 Masonry Profile, LBG
```
| Plates (on its tread) | Part (status) | Colour [avail.] | Connection |
| --- | --- | --- | --- |
| 0–3 | body: `15533` Brick 1×4 with Masonry Profile (L, P `brick_masonry_1x4`) | Light Bluish Gray [BL] | studs of the hill's tread |
| 3–6 | merlon: `3005` + `4070` Brick 1×1 with Headlight (P) + `3005`, the headlight's recess facing outward (the gun hole, ≈ ½ stud square, shadowed) | LBG [BL for 4070] | on the body's studs; the body spans merlon + gap, so the joints are staggered |
| 6–7 | cap `63864` Tile 1×3 (P) · gap floor `3070b` Tile 1×1 (P) | cap **Dark Bluish Gray**, gap tile LBG | the cap ties the merlon's three bricks |
- **6 parts per 4 studs.** Modules sit on level treads. Where the next tread is higher, the next module starts a course higher; a 1-stud step block (`3005` ×1–2) fills under an overhanging end. Symmetric merlon (hole centred) per rule 7.
- Merlon : gap = 3 : 1 (real ≈ 5 : 1; a 1-stud gap is the grid's minimum; Miniland is similar).
- The cap is flush, not overhanging. An overhang would need a 2-wide wall (+40 % parts). → Fallback if the judge asks: wall 2 thick, cap `3023` Plate 1×2 across + walkway behind.
- Placement: a helper `cityWall(bp, x0, z, modules, treadOf)` that throws if a module's tread is not level over its 4 cells. This is a design constraint for the heightmaps: the spur and the crest are quantised in 4-stud bins along the wall.

---

## 5. Bugaksan + City Wall (the back rim)

### 5.1 Real and signature
The pointed granite mountain behind Gyeongbokgung, on the palace's own axis (배산임수). Bare pale granite domes and slabs between dark pines, the wall along its crest (`../seoul-real/gyeongbokgung-bukhansan.jpg`, `bugaksan.jpg`). Signature: **a peaked, pine-dark, granite-flecked skyline above the gate's roofs, with a crenellated line on the crest.**

### 5.2 Brick versions → conclusion
No brick Bugaksan exists. For technique: **21063 / our Neuschwanstein crag** (DBG 75° = cliff, LBG fresh rock, forested ledges), LA's hills (terraced, slope-faced), Miniland (turf hill + wall). **Ours:** LA's terraces on the camera face, **granite as rounded LBG curved slopes** (`11477` / `50950` / `15068`: rounded granite domes, not Neuschwanstein's sheer limestone), Dark Green pines, the shared wall on the crest.

### 5.3 Shape (island-back frame: x along the back edge, z 0 = back edge, camera at +z)
```
 crest height (plates above G) along x (1 char = 2 studs), wall on top:
  +51        ▄█▄                       peak + wall top (crest 44 + 7)
  +44      ▄██████▄                    peak on the gate's axis (behind Gwanghwamun, gate top 45–47)
  +32  ▄▄▄████████████▄▄▄▄            saddles ≈ 32
  +20 ███████████████████████▄▄       flanks ≈ 20 at the ends (east end behind Bukchon)
       x 0                    44

 section through the peak (1 char = 1 stud, 1 row = 3 plates):
  +44 ..W█.......          W = wall on the crest (z 2), outer face south
  +38 .████▄.....          ◢ / granite: curved LBG slopes on 1–2 risers per patch
  +29 .██████◢...          front (south) face: 3-plate risers on 1-stud treads (≈ 60°), 45° / 65° slope covers
  +20 .████████◢.
  +11 .██████████◢
  G   ███████████  z 0 … 10 (14 at the peak bulge)
      back face: 2–3 studs to the plinth, 75° Dark Bluish Gray slopes on the top courses (the back is seen only when the set is turned)
```
- **Footprint ≈ 44 × 10**, the outline bulging to 14 deep behind the peak (korea.md §1.4). **Crest 44 at the peak** (+7 wall = **51**, height table ≈ 50 ✓), saddles ≈ 32, ends ≈ 20, quantised in 4-stud bins along the crest for the wall.
- **Sightline check (default camera, el ≈ 26°):** behind the gate's ridge (45), a point d studs further back is visible above it once it is taller than 45 − 2.5·d·tan 26° ≈ 45 − 1.2 d. The peak sits ≈ 10 studs behind the ridge, so it shows ≈ 11 plates above the gate's roofs. The saddles (32) show over the lower palace walls. **It blocks nothing**: nothing stands behind it.

### 5.4 Level table (above G)
| Plates | Element | Part types (status) | Colour |
| --- | --- | --- | --- |
| G … crest | solid columns; on a 10-deep ridge every course is a long strip along x, so the packer lays long bricks | bricks (P) | DBG core |
| risers (south face) | 45° `3040b` / 65° `60481a` covers (L) | | Dark Green (pine zones), Olive Green |
| **granite patches** (≈ 25 % of risers, 3–4 blobs ≈ 5 wide) | curved slopes `11477` 2×1, `50950` 3×1, `15068` 2×2 curved (**bake** `15068`); a few `3070b` tiles on treads | (L / bake) | **Light Bluish Gray**, DBG shadow courses |
| back face | 75° slope `3685`-class / plain bricks (P) | | Dark Bluish Gray |
| crest | City Wall, **11 modules (44 studs)** | §4 | LBG / DBG caps |
| slopes | 5 pines: `sonamu` S ×4 + M ×1 (forced perspective: smaller than Namsan's) | §3.3 | |
| treads | scrub `32607` | (L) | Dark Green / Olive |

### 5.5 Parts, bake, risks
| Item | Parts |
| --- | --- |
| terrain 44 × 10, crest 44 | ≈ 620 (estimator 711 × 0.87) |
| granite curved slopes (counted as riser covers, + tiles) | + 20 |
| wall 11 modules + step fillers | ≈ 85 |
| pines (4 S + 1 M) | ≈ 100 |
| scrub | ≈ 45 |
| **Bugaksan total** | **≈ 870** (budget 700) |
- Bake: `15068` (Slope Curved 2×2×⅔). Optional: `24309` (Curved 3×2) for bigger domes.
- **Cuts if over, in order:** (1) span 44 → 36, crest 40 (−170: the 36 × 9 fallback ≈ 700); (2) scrub density (−30); (3) a hollow core under the peak with the Neuschwanstein slab (−≈ 80; risk of floating parts, LA lesson, re-measure); (4) pines S ×4 → ×3.
- **Risks.** The thin ridge reads as a wall of green, not a mountain → the skyline must vary (peak / saddles / ends: the shape above), and the granite blobs break the face. The crest wall at the back is ≈ 50 studs from the camera, so the merlon rhythm may blur into a dashed line → that is acceptable for a backdrop; if it reads as noise, drop the gun holes (plain `3005` merlons, −11 parts). The back face (75° grey) shows when the set is turned on the globe → it is finished like Neuschwanstein's crag back, not left raw.

---

## 6. Totals
| Element | Footprint | Height (above G) | Parts | Bake |
| --- | --- | --- | --- | --- |
| N Seoul Tower (assembly) | Ø8 on the plateau | **96.5** | ≈ 58 | — |
| Namsan hill + plateau + pines + scrub + wall run | 28 × 22 | 14 (plateau) | ≈ 730 | — (`sonamu` is code) |
| **Namsan + tower** | | | **≈ 790** (budget 1,250) | |
| **Bugaksan + wall + pines** | 44 × 10 (14 at the peak) | crest 44, wall 51 | **≈ 870** (budget 700) | `15068` |
| **Both** | | | **≈ 1,660** (budget 1,950) | |
| Cut | Palgakjeong (−≈ 70), cable car (−≈ 60), love locks, bongsudae, second broadcast mast | | | |
Specialty share (dishes, round corners, round plates, bars, leaves, curved slopes, headlights) ≈ 25 % of the 1,660.

## 7. Reference image `../seoul-namsan-lego.png` (gpt-image-2, 1536 × 1024)
Prompt:
> N Seoul Tower on Namsan hill, built as a LEGO element at minifig scale, on a plain light grey studio background, real visible LEGO bricks and studs, photographed like an official LEGO set product shot from the front-left, slightly above. A wooded terraced hill about 28 by 22 studs: each terrace one brick high, every riser covered by Olive Green and Dark Green LEGO slope bricks, a few pale grey granite outcrops of Light Bluish Gray slopes, five Korean red pine trees built from brick (reddish-brown round-brick trunks, tall bare trunk, flat dark green leaf-piece clouds on short branches), small dark green leaf plants. On the flat paved Light Bluish Gray summit plateau: a round white base building (two white curved brick courses with a dark grey band) from whose roof rises the tower: a white 4x4 round lower cylinder, two light grey 6x6 webbed radar-dish rings stacked near the foot like umbrellas, a slender white 2x2 round-brick shaft, then the observation pod: a dark grey 4x4 round plate and 6x6 round plate underside, a drum of stacked 6x6 round plates alternating dark bluish grey (glass) and light bluish grey (floors), a narrower 4x4 upper drum, a white 2x2 round collar, and a long thin mast of alternating red and white 1x1 round bricks ending in a red bar. The tower is very tall and slender, the pod about three times the shaft width. On the left flank a short Seoul city wall climbs the slope to the summit in steps: one-stud-thick light grey masonry-brick wall, a parapet of merlons three studs wide with a small square gun hole each and dark grey flat tile caps, one-stud gaps between merlons. Opaque colours only, no transparent glass, no people, no text.

- **Right:** the round white base building with a dark band, the tower rising from its roof, the two rings low on the shaft, the banded dark/light pod with a narrower upper tier, the white collar, the red-and-white mast with a red tip, the terraced hill with slope-covered risers and pale granite patches, the wall's merlons with small square holes.
- **Wrong against the scheme:** the tower is far too short. Its top is ≈ 2.5 × the hill's height; ours is ≈ 7 ×, with the shaft ≈ 2 × longer and the mast thinner. The rings are flat plates, not webbed dishes. The pod is fat and squat (ours is Ø6 on an 18-plate shaft). **The pines read as palm trees**: bare poles with tufts (→ the anti-palm rule, §3.3). The wall is a tall curtain along the hill's edge with wide gaps and light caps. Ours is a 7-plate wall *on* the west spur, stepping with the treads, with dark caps and 1-stud gaps. The hill is a symmetric stepped pyramid with a checkerboard of greens; ours is an asymmetric dome coloured in zones.
