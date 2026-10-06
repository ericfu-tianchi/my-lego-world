# Griffith Observatory + Walk of Fame: build notes (v4, 2026-10-05)

Scheme: `../la-hollywood-sign/SCHEME.md` §3–4 (signed off). Code: `tools/ldraw/asm-la-griffith.mjs` → assemblies `griffith`, `griffith_monument`
(exploded, rule 12); test scene `src/scenes/la-griffith.ts` (`?scene=la-griffith&noglobe`, tags `griffith`, `walkoffame`); print `walk_star`
(`src/core/prints.ts`). Renders: `build/v4-*.png` (current), `build/v3-*.png` (previous); judge reports `build/judge-r1.md` (5.8),
`judge-r2.md` (6.1), `judge-r3.md`.

## r2b (lead review of r2, 2026-10-05): no steps; near-hemisphere telescope domes
- **Telescope domes**: back to v3's build in Dark Bluish Gray — four 5906 2×2 quarter domes (DBG: 3 sets), pairs a stud apart, a 1×4 plate +
  two 5907 back to back as the shutter band, 16–21. A near-hemisphere; no 4×4 hemisphere is made in DBG (86500, 30208, 24130/24132 checked).
- **Main dome**: 87559 ring + 8×8 dish 3961 + 2×2 dish 4740 vent (DBG), rise 10.5 on 12. The nested 6×6 / 2×2 cake is gone; stepped
  pilaster heads (1×1 brick + tile) over the middle column pair of each face rise round the dome's foot, as on the real drum.
  **Still short of the brief** (height ≈ 0.5 W, one curve): no 10–12-stud hemisphere mould exists in DBG — 76776 (RB, Nougat, SG, White,
  BLO, Reddish Orange), 49612 (no grey but LBG/Black), 98107, 4413, 87375, 88067 checked. Tried in this round: 87559 + 10×10 dish 50990b
  (rim skirt = saucer lid on a bun); 87559 + 4× 88293 (DBG, rise 12 but a ball on a bun); Black 87559 + 4× 49612 (rise 14, a waist at the
  joint, and black). Ways to a true hemisphere: 4× 76776 in Reddish Brown (r1 shape, wrong colour), 4× 49612 in Black / LBG (8 studs), or a
  radial SNOT dome (no proven build found). Silhouette vs photo: `../la-island/r2/griffith-before-after.png`, side `griffith-side.png`.

## r2 (Eric's island review, 2026-10-05): dome colours from daylight photos, a banded main dome, an octagonal rotunda roof
Eric: "3 个棕色过深，绿有点廉价，有些圆表面有质感". Renders `../la-island/r2/griffith-*.png` (`griffith-before-after.png` puts the r1 and r2 fronts under a July 2023 photo).

**Photos** (`daylight/`, Wikimedia Commons): `july-2023.jpg`, `entrance-2023.jpg` (CC0, 2023-07); `park-2024.jpg`, `downtown-2024.jpg`, `telescope-dome-2024.jpg`
(CC0, The Fun Chronicles, 2024-10); `may-2022.jpg`, `may-2022-5.jpg` (CC BY-SA 2.0, 2022-05); `dome-2022.jpg` (CC0, Andrek02, 2022-07); `facade-2026.jpg` (CC0, 2026-07);
`front-2018.jpg` (CC BY-SA 4.0, Codera23); `right-2024.png` (CC BY-SA 4.0, night). Samples are 20–80 % trimmed means, white-balanced on the wall in the same photo.

| Surface | Samples (white-balanced) | Reads as | LEGO |
| --- | --- | --- | --- |
| Main dome | 123,109,103 (sun, 2022) · 91,92,94 (overcast, 2018) · 74,69,71 / 56,54,58 (2024) | weathered warm grey-brown, 0.6–0.9 of the wall's brightness; horizontal panel courses and standing seams | **Dark Bluish Gray** (nearest: Δ≈15 to the sunlit sample; Reddish Brown Δ≈114) |
| Telescope domes | 107,96,92 / 91,83,80 (sun, 2022) · 74,71,67 (close, 2022) · 28–39 in shade | a shade darker charcoal-bronze, olive patina streaks | **Dark Bluish Gray** (Black read navy and heavier than RB, the opposite of Eric's note; no darker grey-brown exists for 3960) |
| Rotunda roof | roof slopes light sage; frieze 48,62,69 (2018), dark teal-bronze; crest pale verdigris palmettes | low octagon: dark frieze, palmette crest, stepped verdigris roof, lantern | **Sand Green** roof and eave, **Black** frieze |

**Main dome.** 76776 (r1's quarter domes) exists only in Reddish Brown, Nougat, Sand Green, White, Bright Light Orange, Reddish Orange (BrickLink), so
no grey hemisphere mould is left: the dome is brick-built in courses, which is also how the real one reads. Four **87559** (Brick 6×6×2 corner
round, curved top; DBG is a BrickLink colour) make a 12-stud springing ring (18–24) that rolls from the drum's edge to a flat ring at r ≈ 4; a 2×2
column rises through its hole; an **8×8 dish 3961** (24–27, DBG) sits on the column with its rim on the ring, a **6×6 dish 44375b** (DBG) nests on the
8×8's crown studs with its rim on the 8×8's surface, a **2×2 dish 4740** on the 6×6's flat top (to 29.5). Four seams = the real dome's courses; the
quadrant joints = standing seams. Deck B's tiled outer row (r1) is gone: the ring covers it.
Tried and rejected: four 24599 (5×5×1 curved-top ring) + a 30565 band + an 8×8 dish (a hat with a brim); 24599 + three nested dishes (a stepped cone);
87559 + one 8×8 dish (a flat bun, rise 9 on 12). Not possible: Dark Tan (the photo brightness suggests a lighter taupe) — 87559, 2577, 5651, 49612,
65617 are not made in it.

**Rotunda.** White 4×4 round drum 15–18, **Black 4×4 round plate frieze** 18–19, **Sand Green octagon of four 26601 cut-corner wedge plates** 19–20, eight
**Sand Green cheese slopes** facing out on its edge studs (the hipped eave), Sand Green 2×2 round step, lantern (Black / Sand Green 1×1 round plates) to 24.
Crest tried: 49668 tooth plates (splayed like a succulent), 4589 cones (a crown, too tall), 32607 leaf plates (a planter). 15070 (vertical tooth,
the best palmette) is not made in Sand Green; Dark Turquoise is, but LDraw colour 3 is not mapped in bake.mjs.

**Open.** The dome is 12 studs (real ratio says ≈ 10 at W 28) and its top is terraced where the real one is a smooth curve; the real telescope domes are
darker than the main dome, here they match; the crest is implied by the cheese eave, not palmettes; LA default-camera render timed out in this
worktree (island close-up rendered). Checks: 87559 | 3003/3022, 3961 | 3022/44375b added as interlocks in check-assemblies (column through the ring's
hole, nested dishes). Gate green, `la` and `la-griffith` PASS.

## v5 (lead review of v4, 2026-10-05): smooth telescope domes
v4's quarter domes + curved slopes read as lumpy cupcakes. Now each telescope dome is **one Reddish Brown Dish 4×4 inverted (3960, a
BrickLink known colour)** on a 1×2 jumper in the drum's top course (the jumper's stud is the dome's axis: middle of the 5, centre line of
the 4), rim on the drum's top course, 16–18; the shutter band is a **Reddish Brown Slope Curved 4×1 Double (93273)** laid N–S over the
crown: its only anti-stud is a centre tube recessed inside the arch, which takes the dish's crown stud, so the crown rides inside the
arch and the band's ends curve down the dome's front and back (top 18.5). check-asm-studs lists 93273 as held by design and
check-assemblies lists the 3960 | 93273 pair as an interlock. Rejected: a 2×2 dish stacked on the crown for height (the band then hovered
like a handle over the rim). The dish is lower than a hemisphere (rise 2 plates on a radius of 2 studs): smooth and brown, but flatter
than the real domes. Renders `build/v5-*.png`.

## Round 3 (lead review of v3, 2026-10-05)
| Lead's point | Done |
| --- | --- |
| Telescope domes copper brown like the main dome | **Reddish Brown**, 5 × 4, top 19, band to 20. BrickLink known colours checked: 5906 (2×2 quarter dome) no RB / Dark Brown; 88293 (3×3×2 quarter dome) no; 49612 (4×4 quarter dome) no; 86500 (4×4 dome) no; 30208 (4×4 hemisphere) no; 24130 (BrickLink: dragon-egg container) no; 65617 (3×3×1 curved corner) and 24599 (5×5×1) yes but 6–10 studs wide and flat; **1871 (1×1×1⅓ quarter dome, RB) and 6091 (2×1×1⅓ curved slope with recessed stud, RB, 153 sets) yes** — the same 1-stud curve. Each half: two 6091 in the middle rows curving outward (crowns against the band), a 1871 at each end of the inner column, the outer corner cells left open so the plan follows the drum's round corners; band = 1×4 plate + two 6091 back to back, a plate proud. The crowns keep their recessed studs (a tile cannot sit in the recess). |
| Monument slim, ≤ parapet, figures, armillary, round island | White 2×2 round plate + three 1×1 round bricks (12–13 plates), gold 1×1 round plate, four white statuettes facing out (a four-fold pinwheel; six do not divide the ring) and four hedge plates, on a 4×4 round plate a plate proud of a square of paving. |
| Italian cypresses, slim, symmetric, each side of the door | Plate of trunk, two Dark Green 1×1 round bricks, two cones stacked: 1 stud wide, 14 plates, mirror pair on the portal's axis-symmetric cells. |
| Round drum, ≈ 16 pilasters, cornice, no studs on top | 12 white 1×1 round columns stand a stud out from the back and side flats (t ±0.5, ±2.5), 1–16, on 1×6 plinth plates, under a 1×6 plate + tile cornice; with the 4×4 round corners the outline is near a circle of r 6.5. The front four are omitted (the pavilion's back wall is there). Deck B corners are 4×4 corner-round tiles and the outer row is tiled: no studs round the dome. The footprint grew a row at the back (gz −1) for the back pilasters. |
| Wings: frieze, projecting cornice, recessed windows, steps | Cornice: two crossing plate courses, then 1×2 jumpers carrying 1×2 tiles half a stud proud of the facade (lip top 15; the band of plate edges under it is the frieze). **Recess not done**: two-stud-deep piers (1×2 / 2×2 / 1×2 standing) showed their second column's side studs inside every bay. Steps: white landing in the portal (top 3) and a step on the forecourt row (top 2) over the lawn path (top 1). |
| Back corners | A three-plate white parapet round the rear promenade (outer columns and back row); LBG paving inside. |

## What was built
| | Footprint (studs) | Height (plates above the terrace) | Parts |
| --- | --- | --- | --- |
| Building (incl. forecourt row, rear promenade, cypresses, paving) | 28 × 20 | wing cornice lip 15 · pavilion 16 · telescope domes 19 (band 20) · main dome 28 · finial 30 | 585 |
| Astronomers Monument | 4 × 4 | 13 | 15 |
| Lawn + paths (scene) | 28 × 8 | 1 | ≈ 110 |
| Walk of Fame strip | 20 × 4 | 1 | ≈ 45 (4 printed) |

With the terrace at G + 8: **finial at 38, main dome top 36, telescope domes 27 (band 28), wing parapet 23** (scheme: 39 / 37 / 30 / 20). Element total ≈ 755 parts
(scheme ≈ 540 + 25); the test scene's earth plinth and ground plates are not part of the element.

## Technique per signature detail (v3 text; round 3 changes above supersede it)
- **Main dome**: four 76776 (Brick 5×5×3⅓ corner round, dome top) in Reddish Brown, a true 10-stud hemisphere, seams = the four joins; finial
  = a round 2×2 plate with one centre stud + a 1×1 round plate on the four crown studs. Rests on a two-layer deck (16–18) whose layers cross.
- **Drum 12 × 12**: four 2577 (4×4 corner round) per course, each flat a pilaster pair on the outer row between two panels recessed a stud
  (dark windows in the back and side panels); pilaster heads (1×1 plate + round tile) rise two plates beside the dome. Only the outer row
  can carry heads: the corner cells lie inside the quarter domes' boxes.
- **Telescope domes (the slit)**: as solved in the scheme — four 5906 quarter domes, the pairs one stud apart, a 1×4 plate between carrying
  two 5907 back to back: a raised shutter band one plate proud, running N–S over the crown. Drums 5 × 4 of 3063b round corners + a middle column,
  a black slit window.
- **Wings, five windows each**: a SNOT curtain of standing plates hung on 1×1×1⅔ side-stud bricks (32952) in the pavilion's side walls: their
  studs fall at 2.25 / 4.75 / 7.25 / 9.75 plates, exactly the 1×1 + 1×2 + 1×1 standing plates of a 10-plate wall. Fifteen layers from the
  pavilion out: W W P × 5, so each window is 0.8 × 2 studs (tall-narrow as the real ones) and the piers 0.4; the last layer is tiles.
  Cornice: 2×6 plates spanning curtain and body; Tan terrace tiles with a white edge.
- **Pavilion + rotunda**: stepped portal (white 1×1×3 jambs a stud back, Dark Brown 1×1×3 doors); rotunda = white 4×4 round brick + Sand
  Green 4×4 dish (no overhang) + lantern.
- **Cypresses**: a plate of Reddish Brown trunk, ten Dark Green three-leaf plates each turned on the last (never toward the pavilion), a cone.
- **Monument**: square 2×2 shaft four bricks tall, 75° four-sided peak (3688), gold 1×1 round plate (armillary), a ring of eight white 1×1
  round bricks at the foot (the astronomers), on a 4×4 LBG paved island.
- **Walk of Fame**: Black 2×2 tiles printed `walk_star` (Coral five-point star in a Pearl Gold rim, Pearl Gold emblem; no name), every five
  studs in a continuous Black band, LBG sidewalk, DBG kerb.

## Deviations from the scheme (and why)
1. **28 wide, not 26.** At 26 the wings were 4 studs squeezed between 5-stud drums and an 8-stud pavilion (v1). Real shares are drum 0.16 ·
   wing 0.26 · pavilion 0.17; now 5 · 6 · 6 · 6 · 5. The spur terrace needs 30 × 29 (with a rim), not 28 × 26.
2. **Window rhythm W W P**, not P W: six-stud wings fit 15 layers, and a 0.8-wide window is the real proportion (0.4 read as slits).
3. *(superseded in round 3: Reddish Brown from 1871 + 6091)* **Telescope domes Dark Bluish Gray, not Reddish Brown.** BrickLink known colours (2026-10-04): 76776 exists in Reddish Brown; **5906 does
   not exist in Reddish Brown or Dark Brown** (5907 does in Reddish Brown, not Dark Brown). Dark Red, the nearest warm colour, read crimson
   beside the main dome (v1). DBG matches `real-south-elevation.jpg` (charcoal side domes) but NOTES §0 says today's side domes are dark
   copper-brown, and judge r2 counts the grey as a colour-layering fault.
4. **Heights one plate lower** at the main dome (dome sits on a two-layer deck at 18): finial 38 absolute, still under the letters (42.5).
5. **Rotunda roof**: a 4×4 dish (v2's Sand Green 6×6 dish overhung a stud all round and read as a flying saucer). 33291 crest dropped:
   not made in Sand Green; 11213 likewise.
6. **Cypresses moved to the forecourt row** flanking the portal (in the wing angle they hid the first window).
7. **No lettering, no steps** (open issues).

## Tried and rejected
- v1 Dark Red telescope domes (crimson); v1 pilaster stubs (1×1 brick + round plate) on the drum rim: read as battlements, a castle.
- v2 parapet of bricks + tall pilaster heads on the flats: still crenellated; replaced by recessed panels in the drum wall + 2-plate heads.
- v2 drums: the 2×2 corner moulds (3063b, 79491) have a notch at the arc's centre that the automatic "cut corner" test took for the curve,
  so every corner was turned inward — square towers (judge r1). Their round corner is now given by hand.
- Round 30565 / 79491 plinth plates under the drums left the terrace showing in the corner pockets; the plinth is square (3031, 3022).
- Monument v1/v2 round drum + round shaft + cone/gold plate (lighthouse); v3 1×1×5 square shaft (chimney).
- Cypress v1 round bricks + leaf plates (palms), v2 round bricks banded by round plates (barrel).

## Judge r3: 6.2 (r2 6.1, r1 5.8); gate 8.0 not met — the 3-round cap is reached, so this goes to the lead/Eric as is
Its top remaining fixes (`build/judge-r3.md`): (1) monument as a square obelisk moved off the door axis — **conflicts with the lead's
round-3 call** (slim column ≤ parapet); the lead's call is what is built; (2) ≈ 16 flat SNOT pilasters evenly round the drum with stepped
caps and a scalloped frieze instead of the round columns (read as a Greek colonnade); (3) telescope domes as smooth hemispheres on drums a
brick above the parapet (no smooth 4-stud dome mould exists in Reddish Brown / Dark Brown — see round 3); (4) entrance: SNOT grille-faced
bronze doors, half-stud stepped frame, full-width steps; (5) wing pilasters + recessed windows in 1×2×3 frames, grille-tile frieze. It also
flags dark notches where the main dome meets the cornice in `v4-back` (the corner tiles' inner hole under the dome rim — to check).

## Open issues (after round 3)
- Windows flush (see round 3). Telescope domes read ribbed / segmented close up (built from 1×1 quarter domes and 2×1 slopes), and their crowns show recessed studs.
- The terrace for this element is now 30 × 30 (footprint 28 × 28 incl. the rear promenade row).

### Earlier open issues (judge r2: 6.1), status
- Telescope-dome colour: resolved in round 3 (lead's call: copper brown).
- Drum plan: closer to round with the standing pilasters; still built on 4×4 round corners + flats, no scalloped frieze.
- Lettering: still cut (two words illegible at thumbnail, rule 1). Steps: done.
- Back corners: rear promenade parapet done.
- Walk of Fame band mixes 1×1 / 1×2 / 2×2 fillers (packer); a 2×2-only grid would read cleaner.
