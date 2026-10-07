# K-pop comeback stage · build notes
2026-10-06 · r4 · scene `?scene=ko-stage&noglobe` (tags `frame`, `towers`, `deck`, `figs`, `standin`) · code `src/scenes/ko-stage.ts` (`placeStage`, `STAGE`, `STAGE_FIGS`), `tools/ldraw/asm-ko-stage.mjs` (assemblies `ko_frame`, `ko_tower`) · scheme `SCHEME.md` option B, re-proportioned by the lead in r4

## Result (r4)
| | Parts | Footprint (stage-local) | Height above G |
|---|---|---|---|
| Frame `ko_frame` (exploded) | 445 | 18 × 5 at x 4–22, z 0–5 (face tiles to z 4.8, beads to x 3.2 / 22.8) | 41 (face top 40.5) |
| 2 × tower `ko_tower` | 32 | 2 × 4 at x 0–2 and 24–26, z 0–4 | 46 |
| Deck + thrust + 2 monitors + barrier | 74 | deck x 2–24 × z 5–12, thrust x 11–15 × z 12–15, fences x 7–19 at z 16 | 3 (deck top) |
| 9 stand-in figures | 45 | see `STAGE_FIGS` | 3 + 12.5 |
| **Element** | **596** (≈ 610 with the real figures and props) | **26 × 18** | 46 |

The test plate (30) and the gate stand-in (273) are not counted. The scheme estimated ≈ 400; the frame grew to the real proportions (see r4 below).

Renders (`build/`): hero **`v5-hero.png`** · `v5-through.png` (low SSW: the gate's pavilion inside the opening) · `v5-face.png` (straight on) · `v5-default.png` (default camera with the gate stand-in) · `v5-back.png` (north face) · earlier rounds `v1`–`v4`, swatch `swatch-compare.png`.

## r4: proportions (lead, 2026-10-06)
At r3 the opening was 1.3 minifigs tall inside a thick border, so the frame read as a chunky doorway round a crowd. r4 copies `real-frame-gate-through.jpg`:
- **Face:** 18 × 15 pixels, border 3 (1/6 of the width). The opening is 12 studs × 30 plates (2.4 minifigs). The height/width ratio is 0.83, as on the real 15 × 18 m frame.
- **Top:** a flat tile rim at G + 41, with no studded cap.
- **Towers:** 46 plates.
- **Idols:** a V. The lead stands on the thrust and the others stand in pairs 3, 6 and 9 studs either side, each pair two rows further back. Every figure is in its own column, so none hides another from the south.
- **Deck:** 2 studs deeper.
- **Bead edge:** a bead on every pixel row (2.5 plates).
- **North face:** a panel grid. Every brick course's back row is Dark Bluish Gray between black plate lines.

## Swatch (first risk test)
I tried Red, Coral and two-tone Dark Red / greys against the real photo:
- Bright Red shouts.
- Coral (#FF698F, Vibrant Coral) reads pink.
- **Two-tone Dark Red / greys is the pick:** bands run Dark Red / LBG / Dark Red / DBG, and the 2-px bands read as chevrons, not a checker.

## Technique
- **Legs** are 3 × 4 cores of courses running along x, with plate pairs along z between them. Brick courses sit at p 0 / 10 / 20 / 30 and side-stud courses at p 5 / 15 / 25.
- **Face anchoring uses side-stud bricks only.** A side stud on a brick at plate p sits at 8p + 14 LDU, and pixel row k is centred at 34 + 20k LDU, so side-stud courses at p 5 / 15 / 25 / 35 hold rows 1 / 5 / 9 / 13.
  - Each leg column is a vertical 1×12 plate held at rows 1, 5 and 9.
  - The top band is 2×3 plates held at row 13 by the beam's front course (four 1×4 side-stud bricks plus two 2-adjacent-side corners).
  - There is one 1×1 tile per pixel, 126 in all.
- **Bead edge:** the front corners of each side-stud course are bricks with studs on two adjacent sides. These hold a vertical studs-out 1×12 plate (1×3 at the beam ends) up the outer and inner edges, with a black 1×1 round plate on every stud. That gives 54 beads; the face stays 18 wide.
- **Inner LED strips:** a vertical 2×12 plate on the inner side studs, carrying a 1×1 tile checker. The west strip is Dark Purple / Medium Lavender, the east strip Dark Turquoise / Dark Azure.
- **Moving heads:** an even row of 10 headlight bricks hung by their own stud in the beam's underside (plates 30–33), each with a clear round tile on the lens.
- **Towers:** two 2×2 ballast plates, then a triangular girder (plates 2–32) and four 2×2 bricks, topped by a 2×4 plate cantilevered south and a tile (46). Seven grille bricks hang under the cantilever on the crowd side, a stud clear of the truss.
- **Deck:** voxels in compact packing — two plate layers and a tile top. Under each idol's feet a 2×1 window of studs is left untiled. Two black 45° floor monitors sit at the front edge, facing the performers, with their studs capped.
- **Checks:** `validate` passes, `check-asm-studs` and `check-assemblies` are clean, and `npm run gate` is green.

## Deviations from the scheme
1. **No brackets.** A bracket's studs stand 4 LDU proud of a side-stud brick's face, so the two families cannot share one face plane.
2. **Moving heads hang upright from their own stud.** The scheme had them upside down, but an inverted headlight brick's stud points away from the beam.
3. **The frame is 18 × 15 pixels / 41 plates instead of 16 × 11 / 31, and the towers are 46 instead of 35** (lead r4). The stage grew from 20 × 16 to 26 × 18, and the deck from 4 to 7 rows deep.
4. **Bead edge and back-face panel grid added.** The colour came from the swatch.
5. **Figure positions changed** (`STAGE_FIGS`).

## Judge
The judge scored r1 6.3, r2 6.5 and r3 6.8. In r3 compliance and regularity passed, but life layer, detail and composition were below 7. r4 is the lead's proportion pass and has not been judged; it goes to Eric's checkpoint.

Open issues:
- **Props:** the idols' mics and the fans' light sticks (ko-life).
- **Deck skirt:** the plate seams show on the deck's sides.
- **Line array:** no J-curve.
- **Inner strips:** the inner bead columns partly hide them from straight ahead; they show from oblique views.
- **Lenses:** trans-clear renders grey (a renderer issue).

## For the island stage
- Call `placeStage(bp, ox, oz, G, { figs: false })`. Stage-local (0, 0) maps to grid (ox, oz); the stage needs flat studded paving at G.
- Leave the barrier cells (x 7–19, z 16) as studded plates.
- The stage occupies 26 × 18. The frame's centre is stage-local x 13; the LED face looks +z (south) at z 4.8.
- Real figures go at `STAGE_FIGS`: idols at y = G + 3 on the deck windows, fans at y = G.
- Assemblies: `ko_frame`, and `ko_tower` ×2 (the same assembly, rot 0, at x 0 and x 24).
- **Gate (SCHEME §6.1):** its front face 8 studs north of the LED face, its axis 10 studs east of the frame's centre. Heights: frame 41 and towers 46, both below the gate's 47 at the ornaments.
- **Sightlines:** the gate stand-in confirms the low SSW view shows the gate's pavilion framed in the opening. From the default camera the roofs show above and the portal through.
