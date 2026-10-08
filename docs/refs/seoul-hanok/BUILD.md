# Bukchon hanok, alley, neighbour, ginkgo: build notes (2026-10-06)

Scheme: `SCHEME.md` (signed off). Scene `?scene=ko-hanok&noglobe` (`src/scenes/ko-hanok.ts`), assemblies `tools/ldraw/asm-ko-hanok.mjs`, ginkgo `ginkgo()` at the end of `src/scenes/lib.ts`, prints `ko_meander`, `ko_gate_leaf` (`src/core/prints.ts`). Renders `build/`; judge reports `build/judge-r1.md` (6.31), `judge-r2.md` (6.83), `judge-r3.md` (6.94).

## r6 (lead, after judge r5 7.17: ridges still thick)
- **Gable ridges (gate wing, neighbour) low and slim**: a plate lower (yR 25 / 22); layer A only on the crest row (hidden between the planes), layer B across flush with the planes' top course, flat tiles on its outer cells, and on the crest row one White plate line under a Dark Bluish Gray tile cap with a White round tile at each end. Visible crest ≈ 2 plates over the planes (≈ 1/5 of the roof), 1 stud wide. No curved-slope kicks.
- **Anchae hips**: caps flush (no sweep riser), White plate + tile per row. Still two diagonal steps, not one continuous line — a true continuous hip needs a 45° member (hinge/clip) and is open.
- **Tile ends facing out — tried, dropped**: brackets hung under the one-row eave collide with the wall heads and hinge bases (check-assemblies, 0.28). The ends stay as flat White round tiles on every second column (`endsOut: false`).
- Parts: anchae 337, gate wing 165, neighbour 200 (test scene 1,663). Renders `build/r6-hero.png`, `r6-corner.png`, `r6-side.png`. No judge run (lead).

## r5 (Eric, 2026-10-07: "像小孩戴了个巨大的帽子" — roofs out-scaled the house and Gwanghwamun)
- **Smaller roofs**: pitch 35° → 30°, eave 2 rows → 1 (overhang ≈ 1.5 studs), sweep lifts 1 plate at the corners only. Anchae eave now ≈ C+21, ridge top ≈ C+32 (was eave ≈ 17 with fascia, kicks 34): roof visible height ≈ 0.7 × the wall.
- **Fine tile texture**: `plane()` takes `fine` (default on): every column a run of 1×2 grille tiles (2412b) down the slope, as Gwanghwamun r8; the old curved-top ribs, tiled troughs and the Reddish Brown fascia/rafter-end row are kept behind `fine: false`.
- **One small row of white ends**: a White round tile 1×1 on the eave cell of every second column (`dots`, symmetric per roof; anchae hip planes at u 1 and 4), the corner end on the hip cap.
- **Thin ridges and hips**: crests are flat tiles on a White line with curved-slope 2×1 kicks; 3-wide gable ridges have the white line on the crest only and cheese-slope shoulders a plate lower; hip caps are a White plate + flat tile (no curved bricks); verges White plate + tile. Courtyard wall copings: White line + tile cap instead of curved ribs.
- Anchae king post one plate lower (jumper on the panel) for the flatter planes.
- Parts: anchae 516 → 341, gate wing 234 → 182, neighbour 305 → 221 (test scene 2,064 → 1,705). Footprints, `placeBukchon` and `VISITOR_SPOT` unchanged.
- Renders: `build/r5-hero.png`, `r5-close.png`, `r5-corner.png`, `r5-side.png`, `r5-island-mid.png` (beside Gwanghwamun), `r5-compare.png` (real · r4 · r5). Judge: `build/judge-r5.md`.

## r4 (lead's targeted pass, 2026-10-06, no judge round)
- **Kkotdam band in Sand Red**: `SandRed` appended to `src/core/colors.ts` (LEGO Sand Red, hex = LDConfig Sand_Red, LDraw code 335 mapped in `bake.mjs`); the meander print unchanged. Deviation 5 below is resolved.
- **Hapgak end + narrow ridge**: the long planes now have 5 rows (2 in) at 35° and close to 1.5 studs of the middle, so the main ridge is 2 wide (crossing 2-wide plates, a White line, two crest lines, kicked ends) on centred round posts over 2 × 2 jumpers. Each short end has a white gable panel with a Medium Nougat sill line and a white king post, framed by the long planes' honey soffits.
- **Hip lines**: each row's cap is now a White plate (the hip's mortar line) with one curved-top brick on the diagonal cell and a tile on the row's last stud: one even stepped line instead of a doubled one.
- **Corner sweep**: hip-plane lines lift 2 / 3 plates toward the corners, the long planes' last lines 1 / 2 and the hip caps 1 / 2 / 3, so the white ends rise in one row. The wall copings lost their sideways end discs.
- Renders: `build/r4-hero.png`, `r4-gate.png`, `r4-gable.png` (south end), `r4-corner.png`.
- Still open: the gable panel shows mostly as the king post above the hip plane; the corner shows the tile-end row and the rafter-end row one above the other (not a fan of single ribs).

## For Eric's checkpoint
- Hero: `build/r4-hero.png` · close-ups: `build/r4-gate.png`, `build/r4-gable.png` (gate, meander wall, bench), `build/r2-corner.png` (eave corner), `build/r3-alley.png` (alley steps).
- Risk test (one hip corner, scheme §2.10): `build/hip-r3-corner.png`, `hip-r3-top.png`. Passed: the V between the long plane and the hip plane is closed by a raised hip ridge (a 1 × 2 plate on the long plane's last stud of each row, reaching one stud past the row over the hip plane, two curved-top bricks on it). The hip plane's lower deck reaches one stud further under that cap and closes the slit the two tilts open. No fallback to a gable roof was needed.

## What was built (`?only=` tags: `hanok` (incl. roofs, walls, chimney, jars, bench), `jars`, `neighbour`, `alley`, `ginkgo`)
| Element | Assembly / builder | Footprint (studs) | Height (plates above courtyard C) | Parts | Scheme |
| --- | --- | --- | --- | --- | --- |
| Anchae (main wing) | `ko_anchae` | gidan 7 × 11 (body 6 × 11), roof ≈ 11 × 15 | ridge crest C+32, kicks C+33 | 516 | ≈ 470, ridge 33/34 |
| Gate wing | `ko_gatewing` | 6 × 5, roof ≈ 7 × 10 | stands on the lane (C−2); crest C+29, kicks C+30 | 234 | ≈ 195, 6 × 4, top 29 |
| Courtyard walls | `ko_wall10` (N), `ko_wall8` (W), `ko_wall11` (S) | 1 wide | 12 | 65 | ≈ 45 |
| Chimney | `ko_chimney` | 2 × 2 | 19 | 16 | 12 |
| Jangdokdae + bench | scene parts | 4 × 4 / 4 × 1 | 9 / 4 | 17 | — (judge r1/r2 asked for life-layer props) |
| Neighbour | `ko_neighbour` | 5 × 9, roof ≈ 10 × 11 | base C−4; crest C+25 | 305 | ≈ 225 |
| Ginkgo L (alley head) | `ginkgo(…, 'L')` | crown Ø ≈ 9 | ≈ 47 | 113 (12 fallen) | ≈ 100, 38 |
| Ginkgo M (sample on the table) | `ginkgo(…, 'M')` | Ø ≈ 7 | ≈ 30 | 74 | ≈ 66 |
| Alley + lot ground | `placeBukchon` | 4-wide alley, district 30 × 21 | steps C → C−8 | (island earth) | — |
Hanok total ≈ 850 (scheme ≈ 880). Three ridges step 33 → 30 → 25 down the hill.

## Deviations from the scheme (and why)
1. **Walls 3 plates taller** (anchae walls 4–19, hinge course 20; gate wing posts 3–18): the courtyard walls must clear every eave, and the house read squat under the deep eave. Ridge heights land on the scheme's 33/34 and 29/30.
2. **Hinge top 3938 (1 × 2), not 6134**: same base 3937, already a declared interlock in `check-assemblies` / held-by-design in `check-asm-studs` (those scripts are outside my files).
3. **Gate wing and neighbour planes 4 rows, hip planes 3 rows (the main wing's long planes 5 rows since r4); gable roofs 35° (scheme 40°)** — computed so the planes' inner edges never cross (the scheme's 5-row count collides once the deck's thickness is counted). The 4-wide ridge covers the ~3-stud gap between the planes; its outer rows are cheese slopes so it reads as a rounded crest (judge r2).
4. **Gate wing and neighbour 5 deep** (scheme 4): an odd depth puts a gable post on the grid centreline under the ridge.
5. ~~Kkotdam band in Dark Orange~~ — r4: Sand Red (see above).
6. **Gate wing has no verge at its east end**: with the stronger corner sweep its verge reached into the anchae's south-west corner; it tucks under the anchae's eave instead.
7. **Layout** (district frame below): alley moved to x 17–20 directly against the anchae; neighbour 2 studs further east and at C−4 so the alley steps show between the two eaves; chimney moved from behind the house into the courtyard (judge: never seen).
8. **No bargeboards, no house-number plate** (judge r2 items 2–3): open.

## Island stage: how to place it
`placeBukchon(bp, ox, oz, C, base, own?)` in `src/scenes/ko-hanok.ts` lays everything: ground columns from plate `base` up (Dark Tan earth, two LBG plates, surface tiles/plates), granite masonry faces where a lot stands above the alley, all assemblies, jars, bench, the L ginkgo. It returns/fills `own` with every scene cell it laid (the island lays nothing there). District frame (x east, z south, origin = NW corner of the courtyard wall), every cell it owns:
- hanok lot x 0..16, z −3..13 at **C** (gate wing cells x 0..5, z 9..13 at C−2); lane x 0..16, z 14..15 at **C−2** (its south edge is open — the island continues the lane);
- alley x 17..20, z −3..20: `alleyLevel(z)` = C (z < 4), C−2 (4–7), C−4 (8–11), C−6 (12–15), C−8 (≥ 16; owned to z 17);
- terrace x 21..29, z −3..8 at C (ginkgo); neighbour lot x 21..29, z 9..17 at C−4.
- Anchors: `ko_anchae` proxy (10, C, 1); `ko_gatewing` (0, C−2, 9); walls `ko_wall10` (0, C, 0), `ko_wall8` (0, C, 1) rot 3, `ko_wall11` (6, C, 13); `ko_chimney` (6, C, 10); `ko_neighbour` (24, C−4, 9); ginkgo axis `GINKGO_AXIS` (24, 3) (trunk cells 23–24, 2–3, west side bare).
- **Visitor spot** (`VISITOR_SPOT`): cells x 18–19, z 0–1 at C, bare plate studs, facing south down the alley (toward N Seoul Tower and the camera). Nothing stands there; the figures worktree drops her in.
- Prints when placing by hand: `{ '3004|SandRed': 'ko_meander' }` on anchae, walls, neighbour; `{ '87544|MediumNougat': 'ko_gate_leaf' }` on the gate wing.
- Eaves are not in the proxy boxes (as LA's lamps): keep ≥ 3 studs around the district free of anything taller than C+12. The island's own earth must not rise above C−2 under the lane or the alley's lower steps.
- The second ginkgo for Samcheong-dong-gil: `ginkgo(bp, x, y, z, 'M', reserve, turn, skip, fallenCells)`; `fallenCells` must be plate studs at y − 1.

## Checks
`validate.ts ko-hanok` PASS (2,037 parts in the test scene, incl. test earth); `check-assemblies`, `check-studs`, `check-asm-studs` PASS; a member-to-member cross check between the district's assemblies (scratch, not committed) finds no clash; `npm run gate` green (needs `LDRAW_DIR`).

## Judge
r1 6.31 → r2 6.83 → r3 6.94. Done in r2/r3: tiled troughs, even single row of white rafter ends, stronger corner sweep, symmetric corners, gate leaves printed (nails, rings), jars, bench, chimney in view, taller and denser ginkgo, bevelled ridges, no bare studs on the granite faces. Open: see judge-r3.md.
Open after r3 (judge-r3.md), for the lead / Eric: (1) a true hapgak end — stop the hip planes lower on a Reddish Brown plate, a framed white gable triangle above, long planes one row higher so the ridge can drop to 2 wide (the silhouette still reads flat-topped); (2) hip lines: smoother hip ridge, and the corner tile ends read as a stack of discs; (3) more street furniture by the gate (house-number plate, wall lantern, planter); (4) finer lattice (two fences per bay), the Dark Orange band is the loudest colour. Not yet shot: a straight-on view of the anchae's gable end.
