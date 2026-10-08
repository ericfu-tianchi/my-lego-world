# Gwanghwamun: build notes (element test scene)
2026-10-06 (r9 2026-10-07: 34 × 14 base, G + 64) · scene `?scene=ko-palace&noglobe` · tags `base`, `gate`, `roof`, `haechi`, `wall` (whole gate: `?only=base,gate,roof`) · scheme `SCHEME.md` (signed off: eave A, arches 1×8×2 + 1×6×2, plaque 光化門 upright) · renders `build/` · authoring script `tools/ldraw/asm-ko-palace.mjs`

## 00000. r10 (2026-10-07, lead: finish pass; r9 approved as the base — GATE constants, origin and footprint unchanged)
- **Eave curve:** each strip's lift and hinge angle are solved together (`solve` in the authoring script) so its eave tip lands on one
  smooth curve from the flat middle to the corner strip (ease over 14 studs; tips upper 55.7 → 56.0 → 56.7 → 57.6 → 58.7 → 60.1, lower
  39.0 → 39.3 → 39.8 → 40.4 → 41.3 → 42.4). A lift is paid back by a steeper angle, so the steps sit at the strips' inner ends, under
  the hips, not at the eave edge. Angles ≥ 8° upper, ≥ 5° lower (≥ 12° on the lower short faces and the strips on the corner quadrant:
  flatter ones met the upper lattice).
- **Fascia:** every strip plate and its eave tile are Black — a dark eave line along every eave and over the risers.
- **Hips:** the corner strips are White (plain tiles), so each hip is white from the ridge end to the tip; japsang at 2 / 3 / 4 (upper),
  2 / 3 (lower).
- **Doors:** the folded Dark Red leaves run from the floor to the arch's spring (side 11, centre 12).
- **Plaque:** hinges Dark Red (black showed past the board's end), tilt 10°, lighter gilt in `ko_plaque26`.
- `tagGate`: Black members are roof, except the board (3034 / 69729).
- **Still not done:** the corner fan is still separate hinged strips — from close up each strip's edge shows as a card; no wedge plates
  between strips at different angles (no clean seat). From the hero camera the eave reads as one rising dark line.
- Gate assembly 2,303; scene 2,434; validate ko-palace PASS, check-assemblies / check-asm-studs green. Renders `build/r10-hero.png`,
  `r10-front.png`, `r10-corner.png`.

## 0000. r9 (2026-10-07, after Eric's review): gongpo band, readable plaque, ×1.3 scale
Eric: (1) the white dots under the eaves are wrong — the real gate has densely packed painted bracket clusters (공포); (2) the corner upturn
reads rough; (3) 光化門 must be there and readable (the island showed a blank black slab: it mapped the print to `6636|Black`, r8 had moved
the board to 4162); (4) 比例再放大一点 — clearly the biggest building, ≈ 1.25–1.3× wide and tall.
- **Scale ×1.3 wide and tall, ×1.17 deep:** base **34 × 14** (r8 26 × 12), eave footprint **36 × 16** (gate frame x −1..34 × z −1..14),
  top **G + 64** (cheese ridge ends; white ridge top 62; r8 50). Levels: granite 0–21 (deck plates 20), parapet 21–25, lower posts 21–30,
  lower band 30–35, lower eave plates 35, upper storey 41 (lattice 41–44, green beam 44–47), upper band 47–52, upper eave plates 52,
  hips' white top 61, ridge white 62. Base + parapet = 25 / 64 = 0.39 of the height (r7 target 0.4). Depth grew less than width so the
  roofs stay thin and long (the upper roof's height comes from its depth); the deeper roof's ridge is 4 rows (dark rows z 5 / 8, a White
  core z 6..7 showing 3 plates), and each short face gained a middle strip pair and a gable block between the corner kits.
- **Tunnels:** piers 5 wide; tunnels x **5–8, 14–19, 25–28** (all z), centre Arch 1×8×2 seated at 12, sides Arch 1×6×2 at 11 (real
  tunnels ≈ 0.39 of the base width; ours 0.41). Mask = the base walls only (catalog `KO_GATE_STANDS`).
- **Gongpo bracket band** (both storeys, 5 plates, replaces every pin dot): a Sand Green beam plate (평방) on the wall ring; every second
  stud a **Dark Turquoise inverted slope 2×1 (3665a)** standing on the wall row and corbelling a stud out — the bracket arm's stepped
  underside; **Dark Green** 1×1 bricks between them as the recessed panels (포벽); a Sand Green cap plate on the wall row and a **Red
  round plate on each bracket tip** (the red-tipped 쇠서); the eave plates on top. Clusters where a cell's distance from the face's ends is
  odd, so every face is symmetric. The lower storey above the parapet now shows lattice panels and a green beam course, not a red slab.
  Reference logic: the Chinese New Year sets (80105 / 80107) build their under-eave bands as Dark Turquoise corbels on the wall line.
- **Plaque:** a **2 × 8 board** in the centre bay (x 13..20) over the upper lattice — four Black hinge bricks 1×2 on Sand Green side-stud
  bricks in the beam course, a Black 2×8 plate on the hinge tops, the printed **2×6 tile** (`ko_plaque26`, 960 px, gilt 門 化 光 left →
  right on black, Dark Red frame with a gilt line) and Dark Red 1×2 tiles standing at its ends; leaning 15° forward. Its top sits ≈ 49,
  3 plates under the upper eave, so the whole board shows from a 30–38° camera. **`GATE_PRINTS`** in `src/scenes/ko-palace.ts` is the
  one print map (`{ '69729|Black': 'ko_plaque26' }`); the island now imports it and `tagGate`.
- **Corner sweep:** finer hinge-angle steps over the longer faces (upper 18 → 17.5 / 16.5 / 15 / 13 / 11 / 9 / 6°, lower 22 → 21 / 19.5 /
  17.5 / 15.5 / 13 / 11 / 8°), lifted pairs only next to the corner kits; the corner support stacks are Sand Green (the bracket zone) instead
  of roof grey, so the corners no longer read as grey blocks under the tiles. **Not done:** wedge plates filling the fan between strips at
  different angles (no clean seat; same as r8b).
- **Exports for the island** (`src/scenes/ko-palace.ts`): `GATE` (base, eave, tunnels, axis 17, levels deck 21 / lowerEave 35 /
  upperStorey 41 / upperEave 52 / ridge 62 / top 64), `GATE_PRINTS`, `tagGate(parts, G)`. Placement unchanged:
  `bp.assembly('ko_gwanghwamun', X − 1, G, Z − 1, 'LightBluishGray', 0, GATE_PRINTS)` with (X, Z) the base's NW corner. Palace-wall
  stubs now at gate z 6..7. **The island does not fit yet:** at GX 16 the 34-wide base runs into Bukchon and the range (validate seoul:
  overlaps) — the island's layout must move/grow (lead).
- Parts: gate assembly 2,289 (r8b 1,537); test scene 2,420. validate ko-palace PASS; check-assemblies / check-asm-studs green.
- Renders: `build/r9-hero.png` (34°), `r9-hero30.png`, `r9-front.png`, `r9-compare-front.png` (ours | real), `r9-eave.png`, `r9-corner.png`.
- **Judge r9: 6.8** (`build/judge-r9.md`; r8 6.6). Solved: the dots (the band reads as dancheong brackets), the plaque reads at 30° and
  34°, the proportion and scale. Open, its top fixes: (1) corners still a fan of cards with wedge gaps and a block under each — pad the fan
  with mirrored wing plates, a curved-slope tip over an inverted curve, the support as 2–3 stepped inverted slopes in the bracket colour;
  (2) white hips with 3–5 japsang to each tip; (3) full red doors in the arches; (4) a dark fascia tile line over the grille ends with red
  round rafter ends, a darker parapet so roof / parapet / base separate; (5) hide the plaque's left hinge, brighter gold. Bracket band:
  keep, make denser / more tiers.

## 000. r8b (2026-10-07, lead after judge r8): hinge plaque, fascia, dots every stud
- **Plaque** on four Black hinge bricks 1×2 (3937 / 3938) on the band's side studs, a Black 1×8 plate and the printed 1×8 tile on the hinge tops, turned 18° so the top leans out (as the real board). Readable in front and 3/4 close-ups (`build/r8b-corner.png`); from 35° straight-on only the lower edge of the glyphs clears the upper eave (`build/r8b-plaque35.png`) — the r7 heights still hide it there.
- **Fascia:** the eave cell of every strip is a plain 1×1 tile, grille tiles above — a smooth dark line along each eave instead of the grille comb.
- **Dots** on every stud: Sand Green Technic bricks 1×1 (6541) with a White half pin each (20 per long face; the upper south band skips x 9–16 for the plaque).
- **Not done:** wedge plates filling the corner fans (the gaps sit between strips at different hinge angles; no clean seat found in this pass). Corner support stacks unchanged.
- Gate assembly 1,537 members, scene 1,664; validate PASS, check-assemblies / check-asm-studs green. Renders `build/r8b-hero.png`, `r8b-plaque35.png`, `r8b-corner.png`.

## 00. r8 (2026-10-07): finish pass — roof surface, eave, plaque, haechi
Brief (lead, after island judge seoul-v2-r2): keep r7 proportions (base, storeys, G + 50, `ko_gwanghwamun`, footprint, tunnel mask); fix what reads crude.
- **Roof surface:** the curved-slope ribs and rounded channel tiles are gone. Every column of every strip carries **1×2 grille tiles laid down the slope** (a 1×1 tile closes an odd run), so each face reads as fine, even, parallel tile lines; the grille ends make a comb of tile ends along the eave. Ridge white held at r7's 47 (`RT = max(47, …)`), top still G + 49.95.
- **Corner sweep:** the hinge angle now flattens toward each corner (`SWEEP` upper 18° → 15 / 14 / 14 / 10 / 6°, `SWEEPL` lower 22° → 18 / 17 / 12 / 12 / 8°), so each strip's eave end climbs a little more than its neighbour's (upper tips ≈ +2.1 / 2.6 / 3.8 / 5.4 / 7.3 / 8.6 plates over E) — one accelerating curve instead of 1.8-plate shelves. Upper u 8–9 / 16–17 dropped their lift plate (their rise comes from the angle). The corner support stack itself is unchanged and still shows as layered plates from straight ahead (open).
- **Eave dots:** the 1-stud round tiles (rib ends on top and the bracket-band discs) are gone; one row per eave of **White Technic half pins (4274) in Sand Green Technic bricks 1×2 (3700)** along the bracket bands, every second stud, mirrored about the axis — a 0.8-stud flange + stud. 4274 is BY_DESIGN in check-asm-studs (pin in hole); its stud is meant to be exposed (the 36 "exposed side studs" in the authoring log are these dots).
- **Plaque:** 1×6 → **1×8 board** (x 9..16) in the upper band, print at 960 px, glyphs 80 % of the board height, brighter gilt with thickened strokes. Readable in front / low views. **Not visible from a 30–38° camera:** with r7's storey and eave heights the upper eave (≈ 4 studs overhang) hides everything above ≈ 31–35 plates at that elevation, i.e. the whole upper storey; a readable plaque from there needs a taller upper storey or a shorter centre overhang (proportion change — Eric's call).
- **Haechi:** one more attempt (curved-top haunches, round forelegs, chest, raised head) still read as a post at 2 × 4 → **cut from the scene** per the brief; `ko_haechi` stays baked.
- Parts: gate assembly 1,360 (r7 1,574); scene 1,487. Checks: validate PASS, check-assemblies / check-asm-studs green.
- **Judge r8: 6.6** (`build/judge-r8.md`): roof reads as fine tile lines for the first time; still open — corners stepped with blocks under them and wedge gaps in the fan, comb-toothed eave edge (wants a dark tile fascia), pin dots read as washers and hide under the eave at 30–38°, plaque gold too dark. Its fixes: wedge plates to fill the fan + curved/inverted-curved slope tips, white tile hips to the tip, a dark tile fascia over the grille ends, a dot every stud, plaque on a hinge leaning 15–20° forward. Past the three-round cap → Eric.
- Renders: `build/r8-hero.png` (34°), `r8-hero30`, `r8-front`, `r8-corner`, `r8-plaque`, `r8-compare-hero.png`.

## 0. r6–r7 (2026-10-06): proportion and weight, not more detail
Brief: r5 (6.5) failed on proportion: thick, steep roofs of round-brick "logs" squeezed the upper storey into a slit and dwarfed the base. Two build rounds, one judge run.

**Measured on `real-gwanghwamun-piotrus.jpg`** (ground 820 px, ridge 215 px; base 26 studs ≈ 1,000 px → 15 px a plate, real total ≈ 40 plates at that scale):
| Band | share of height | target at ≤ 50 | r5 | r7 |
| --- | --- | --- | --- | --- |
| Granite + parapet | 0.48 (granite alone 0.39) | 20–24 | 0–20 | 0–20 (0.40) |
| Lower storey: red posts + green bracket band | 0.10 | ≈ 5 | hidden behind the parapet | 20–26 visible (posts 20–23, band 23–26) |
| Lower roof (eave edge to the upper wall) | 0.12 | ≈ 6 | 23–36 (13) | 26–32 (6) |
| Upper storey + plaque | 0.12 | ≈ 6 | a slit | 32–38 (lattice 32–35, band + plaque 35–38) |
| Upper roof to ridge top | 0.17 | ≈ 8.5 | 38–54.5 | 38–50 (eave plates to cheese ends; white ridge 48) |
Eave overhang: real ≈ 3.5 studs past the storey wall (lower), ≈ 4 (upper); ours 3 / 4. Roof pitch at the eave ≈ 20° (sag then a steeper top near the ridge).

**What changed**
- **Ribs:** a 6-stud test strip of three low ribs side by side (round plates under round tiles / a 1×n plate under round tiles / curved slopes 1×2 chained down the slope), chosen by eye: **curved slopes**, which read as overlapping convex tiles; the other two read as coins and as a ridge. Rib ≈ 1 plate proud of the rounded channel tiles (r5: a full stud). Each rib ends in **one White round tile** at the eave (r5's stacked ends read as marshmallows).
- **Pitch** 30° → 22° (lower) / 18° (upper). **Rib spacing** even, a channel pair at the centre of every face (r5's touching centre ribs are gone).
- **Sag and sweep:** upper long face 0 across the middle 6 studs, +1 on the flanks, +2 / +3 in the corner pairs, the corner rib strip +4; lower 0 across 12, +1, +2, corner strip +3.
- **Lower storey** one course taller (LE 23 → 26), so the red posts and the green band show between the parapet and the lower eave. **Plaque** moved up into the upper bracket band, right under the upper eave (as on the real gate; in the lattice row the lower roof hid it).
- **Soffit colour:** hinge bases and the lift plates along the long faces are Sand Green (the bracket zone), so each roof reads as a thin dark sheet over a green band. r7: the corner kits went back to Dark Bluish Gray (judge r6: the Sand Green corner blocks read as boxes).
- **Ridge and hips:** ridge white band a plate over the hips (r7); White 1×1 stacks close the diagonal between the two hip blocks, so each upper hip is one white line from the ridge to the corner (judge r6: gaps showed the soffit from above). Japsang are small dark round plates (r5's black cones read as chimney caps). Ridge ends (취두) are dark cheese slopes rising outward; the tooth plates hung into the hips.
- Parts: gate assembly 1,574 (r5 1,481), scene 1,733. Height **G + 50** (cheese tops 49.95; white ridge top 48), under the Bugaksan crest.

**Judge r6: 6.5** (`build/judge-r6.md`). Proportion now matches the photo (dim 1 6.5 → 7.0; "r6-compare-front is the most convincing image"); technique 7.0 → 6.5 for new faults: the eave reads as three stair steps with a block under each corner, ridge/hip white too faint, Sand Green the largest flat light area, two-tone tiles look like fish scale up close, technic holes on the hinge bases at the corners. r7 fixed the hip gaps, the ridge white and the corner-block colour; **not re-judged** (one judge run per the brief).

**Open (for Eric):** (1) corners are still stepped shelves, not a continuous sweep; the fix the judge names (each corner rib on its own plate step, inverted slopes under the corners, hinge holes turned inward) is a structural rebuild of the corner kit. (2) Bracket-band dots read large (1×1 round tiles are the smallest dot). (3) Base 0.40 of the height vs 0.46–0.48 real (the arches fix it; a taller base would push the ridge past 50). (4) Unchanged since r5: doors, wall coping, haechi; small gold specks between the plaque characters (print `ko_plaque`).

Renders: `build/r7-hero.png` (checkpoint shot), `r7-front`, `r7-right`, `r7-side-eave`, `r7-corner`, `r7-top`, `r7-compare-front.png` / `r7-compare-hero.png` (ours | real photo); r6 set + `judge-r6.md`.

## 1. What was built (r5)
| Block | Parts | Footprint (studs) | Height (plates above G) |
| --- | --- | --- | --- |
| Granite base, three vaults, folded doors, deck, tunnel floors | 293 | 26 × 12 | 0–17 |
| Parapet, lower storey + band, upper storey + plaque + band (`gate`) | 290 | 26 × 12 / 20 × 8 / 20 × 6 | 17–38 |
| Both roofs: eave plates, hinged strips, ribs, hips, ridge (`roof`) | 1,159 | eave 28 × 14 (strip ends and rib tips reach ≈ 33 × 19) | 23–54.5 |
| Haechi × 2 | 32 | 2 × 4 each | 0–13 |
| Palace-wall stubs × 2 (`copingWall`) | 82 | 8 × 4 each | 0–14 |
| **Total** | **1,856** | **28 × 18** gate + haechi; **44 × 18** with the stubs | **G + 54.5** (ridge-end teeth; ridge white top 51) |

Levels (r5): lower band 20–23, lower eave plates 23, lower ribs' top 36; upper storey 32–35 (lattice + plaque), band 35–38, upper eave plates 38; ridge white to 51, cap 51–52, 취두 teeth to 54.

### Assemblies
- `ko_gwanghwamun` (1,481 members): the whole gate. Proxy 28 × 14 × 50, LDraw origin = bottom centre of the eave footprint (gate frame x −1..26, z −1..12; base x 0..25, z 0..11). Place with `bp.assembly('ko_gwanghwamun', X − 1, G, Z − 1, …, { '6636|Black': 'ko_plaque' })` where (X, Z) is the base's NW corner. Its `mask` occupies only the base walls: the three tunnels (gate x 3–6, 10–15, 19–22, all z) stay free for tunnel-floor tiles and a walking minifig. The scene retags members by height/part into `base` / `gate` / `roof`.
- `ko_haechi` (16 members), 2 × 4, faces +z; placed at gate (0, 14) and (24, 14).
- `copingWall(bp, x0, z0, len, y)` is exported from `src/scenes/ko-palace.ts` for Bukchon: 2 thick along x, body 0–9 masonry (LBG with mirrored pale stones), coping 9–14 (DBG plate proud both sides, cheese slopes facing out, White mortar plate, DBG tile cap). Pass a `body` colour function to change the wall below.

## 2a. Roofs since r4 (the lead's call: copy Seon-Bi Won after three rounds at 6.5)
- **Hinged strips.** Every rib + channel pair is one 2-wide strip on a hinge 1×2 (base brick on the eave plate, top plate turned 30° about its axle, 10 LDU under the base's top). On the strip plate: the **rib**, a 1×1 brick with side stud (capped with a 1×1 tile) at the top and round 1×1 bricks chained stud-to-tube down the slope, ending in a **White round tile** — the white dot along every eave; the **channel**, rounded-end 1×1 tiles, round ends down the slope. Upper strips 2×6 hinged at z 9 (seesaw: the outer part overhangs the eave, the inner part runs up to the ridge); lower strips 2×4 hinged at z 10 running up to the upper storey; corner strips 2×4 / 2×3 hinged nearer the eave.
- **Sweep:** strips sit on the lift table (upper: flat 0, pair 3 +1, pair 2 +2, pair 1 and the corner rib +3; lower 0 / +1 / +2 / +2), so the ribs climb plate by plate into each corner. r4's corner rib at +5 (and a 45° horizontal corner rib) read as horns and was cut in r5.
- **Hips** are dark stacks under a White 2×2 cap at the tile plane where the faces meet (computed from the strip geometry), with black 1×1 cone japsang; the ridge is a solid White band (yangseong) with a dark tile cap and black tooth-plate 취두.
- **Colour:** eave plates, strips, ribs and channels Dark Bluish Gray; Sand Green only in the 3-plate bracket bands, which carry the White rafter dots (8 per long face).
- Gone since r3: 24201 step pieces, 4190 corner tips, 61678 / 50950 rib slopes, the upper beam plates.

## 2. Technique per signature detail
- **Eave sag and sweep (eave A, as signed off).** Columns along each eave in rib/channel pairs, lifted by the scheme's table (upper: corner 5, pairs 3 / 2 / 1, flat middle 0; lower: 3 / 2 / 1 / 0). Where a pair steps up, the front cell is a Sand Green 2×1 inverted curved slope, so the soffit reads as a rising curve, not a stair (front and side renders). Ribs (r2) are one continuous curved slope (4×1 upper, 3×1 lower) a plate proud of stepped 2×1 / cheese channels. Corner tip: Plate 2×2 with inverted slope corner (bake `4190`), White since r3 so the hip's white line runs to the tip, a Black round plate on its stud.
- **Corners** are one authored kit placed four times through mirror frames (parts are never mirrored; `Frame` maps positions and directions). Everything is stud-joined; the corner quadrant is a corbelled stack of Sand Green plates cantilevered from the storey corner.
- **White ridge and hips:** White plates under a DBG tile cap on the ridge; White 2×2 hip blocks j1 / j2 with White tiles and Black round-plate japsang (3 + tip per upper hip, 1 + tip per lower); 취두 = DBG plates two proud with Black tooth plates curling down outward.
- **Rafter dots:** 1×1 brick with side stud hung under the eave plate, White round tile; under a step piece the dot hangs a row back (the 24201's curved underside comes down 1.7 plates); no dots in front of the plaque or on touching centre ribs.
- **Dancheong:** Sand Green bracket bands with Dark Red / Dark Blue round tiles on side studs; Dark Red round posts; lattice = Sand Green grille tiles on Dark Red side-stud bricks; upper storey has Dark Red + Sand Green beams (r2).
- **Plaque:** print `ko_plaque` on a Black 1×6 tile on three side-stud bricks, upright; gilt bold brush regular script (Kyoto `PLAQUE` stack), read right to left (門 化 光 from the left), thin Dark Red frame. Lettering record: gold brush script on black lacquer.
- **Base:** hollow masonry shell (98283 / 15533, 8 % White mirrored about the axis), 12 × Arch 1×8×2 (centre, opening 6, on 10-plate piers) and 24 × Arch 1×6×2 thick (sides, opening 4, on 9), deck plates at 16; parapet DBG with 7 + 7 + 2 + 2 White grille / plain panels on side-stud bricks, tile cap.

## 3. Deviations from the scheme (and why)
1. **Upper storey 2 plates taller** (beams 32–34, band 34–37, E = 37 not 35): judge r1 found the storey squashed and the plaque hidden. Top is G + 50.5, not 47 (still at the Bugaksan rim).
2. **Ribs are continuous 4×1 / 3×1 curved slopes** instead of per-course 2×1s (judge r1–r2: the per-course ribs read as scales).
3. **Steps inside the corners are plain plates**, 24201 only where pair 2 meets the flat (both faces): a 24201 front cell and the corner's corbel plates cannot share cells. Corner tip course dropped (4190 sits directly on the corner block) so the corner is not a box; tips at 43.25 (upper) / 30.25 (lower), not 45.25 / 32.25.
4. **Japsang are Black 1×1 round plates**, not tooth plates (the tooth plate's hanging tooth clashes on a 2×2 hip block). Tooth plates kept for the 취두 and nowhere else.
5. **Plaque 1×6** (scheme 1×4) across the centre bay, for thumbnail legibility.
6. **Doors** are Dark Red 1×3 / 1×2 brick leaves folded against the tunnel walls (scheme: side-stud nail bricks) — simpler; still read as posts from straight ahead.
7. **Wall stubs 8 long** (scheme 4): at 4 they read as a box. Footprint with stubs 44 wide — island stage decides (fallback: 4, or let the rim wall continue them).
8. **Shared checks touched (one line each, commented):** `check-assemblies.ts` INTERLOCK `24201|11477`, `4190|6141` and SPLIT `15070` (box artifacts of the stepped top / upturn / hanging tooth); `check-asm-studs.ts` SEAT_BOTTOM `15070`.

## 4. Judge rounds
| Round | Score | Main points |
| --- | --- | --- |
| r1 | 6.1 | per-course ribs read as scales; storey squashed; hips not continuous; haechi a hydrant; bracket dots loud; asymmetric pale stone |
| r2 | 6.5 | ribs continuous, symmetry passes; corner tips still read as a flat horn on a flat fascia; hip line broken; haechi a mailbox; walls too short |
| r3 | 6.5 | plaque and walls fixed; still: corner fascia flat for its last cells so the eave reads "sag + two horns", hip white broken by 2–3 grey ribs between blocks, haechi not a beast in profile, coping a flat awning, rafter dots read large. Compliance pass; regularity fails on colour layering (hip line) and real proportion (corner). Three-round cap reached → Eric. |

| r5 | 6.5 | Seon-Bi Won copy: ribs, white eave dots and corner sweep now read Korean (technique 7.0), but the eave lost its sag, the round-brick ribs read as logs at this scale with the centre pair touching, hips are white only at the top with cone japsang like chimney caps, the steep thick roofs squeeze the upper storey, side-view corner bundles look like barrels. Compliance pass; regularity fails (rib spacing, hip colour line, proportion). |

| r6 | 6.5 | proportion fixed (thin low roofs, storeys and plaque visible; dim 1 → 7.0); new: stepped corners with blocks under them, faint white ridge/hips, Sand Green the largest light area. r7 fixed hips, ridge, corner colour — not re-judged. |

## 5. Open issues / for Eric (r5; superseded by §0 for the roofs)
r5 (judge-r5.md), ranked: (1) open up the upper storey (roofs 2–3 bricks apart or one rib segment shorter, a larger plaque); (2) thinner, evenly spaced ribs — round 1×1 plates instead of round bricks, or a bigger gate; (3) eave sag by a two-pitch strip (steep above, ≈ 15° at the eave) and only the last 2–3 ribs lifted, corner ribs fanned on hinge plates and kept inside the outline; (4) continuous white hips and small DBG japsang, tiled ridge ends; (5) doors, ribbed wall coping, a crouching haechi. Height G + 54.5 is 3.5 over the ≈ 51 crest; fix (1) adds to it unless the roofs get shorter.

r3 notes (superseded roof issues):
- **Corner fascia:** the Sand Green eave edge is flat through the last 4 cells of each corner (the corbel base), so the very corner reads "flat edge + upturned tip". The fix the judge names (each corner cell's fascia lifted a plate on its own inverted curve) needs the corner kit's support redone — one more round.
- Haechi at 2 × 4 is still more block than beast up close.
- Plaque visible from the front and low 3/4; from the default 0.3-rad camera the upper eave hides its top third.

## 6. For the island stage
- Ground level expected: G (the gate stands on island surface studs; tunnel floors are separate White 2×4 tiles in the masked tunnel cells).
- Gate occupies base x 0..25 × z 0..11 (walls only); eave overhangs to x −1..26 × z −1..12 (strip tips ≈ 2 studs further) from plate ≈ 26 up (r7). Haechi at gate (0–1, 14–17) and (24–25, 14–17). Stubs at gate x −8..−1 and 26..33, z 4..7 (wall z 5–6), top G + 14.
- Guard room: gate (14–20, 12–13) beside the east pier is clear; the centre tunnel takes a walking minifig (clear ≥ 14 plates).
- Keep the K-pop stage west of gate x 9 (scheme risk 6).
