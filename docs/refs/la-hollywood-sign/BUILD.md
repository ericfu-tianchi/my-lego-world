# Hollywood Sign · build notes (letters, mast, hill sample)
2026-10-05 · v3 · scene `?scene=la-sign&noglobe` (tags `letters`, `mast`, `hill`, `scrub`, `oak`, `trail`) · code `src/scenes/la-sign.ts` (letters, hill), `tools/ldraw/asm-la-sign.mjs` (mast) · scheme `SCHEME.md` §1–2

## v3 (current) — after the lead's review of v2: copy Brickman
v1/v2 (sideways-plate letters clipped to a girt frame, below) did not read: Y and W illegible, the frame showed as dark bars, the hill a red-brown patchwork; judge 5.3. Per the project rule (two failed rounds → copy a proven build) v3 copies Brickman's minifig-scale sign (`brickman-ryanmcnaught-front.jpg`).

| Element | Parts | Footprint | Height (plates above G) |
| --- | --- | --- | --- |
| 9 letters + legs | 171 | row 38 studs (x 2–40), 1 stud deep | bottoms 29 → 33, tops 39 → 43 |
| Mast `la_mast` (assembly) | 22 | 4 × 2 | summit 46 → tower 64 → whip tip 76 |
| Hill sample (terrain 1,893, scrub 219, oak 5, trail ramps 2) | 2,119 | 50 × 26 | treads 3 → bench 26–30 → ridge 40–43, summit 46 |
| Test scene | 2,340 | | |

**Letters.** White 1 × N plates studs-up, the letter face = their sides, 1 stud thick; each letter a bitmap 1 stud across × 1 plate up, 10 plates (4 studs) tall: H/O/L/D 3 wide, Y 4, W 5, 1-stud gaps. Every plate row is laid as 1 × N runs whose split alternates by row, so overhangs (Y's arms, W's outer strokes, O's sides) are carried by the row below. O and D corners are rounded by leaving the corner plate out (a 1 × 1-stud × 1-plate step; finer than Brickman's 1-stud steps); W has real V notches (outer strokes rows 2–9, feet 0–3, middle peak 2–6); Y = two arms (rows 5–9) on a two-wide stem. Studs show on the tops, as Brickman's. Legs: two Light Bluish Gray 1 × 1 round bricks per letter (3 plates), plus round plates where a column starts a plate up (O, D, W). Benches 26, 26, 27, 27, 28, 28, 28, 29, 30: the row climbs 4 plates west → east, the 2nd O level with the W (the dip). Row length 38 studs = 9.5 H (approved by the lead; real 7.9 H). No brace behind (open).

**Mast.** Slender: a 2 × 2 lattice of four 1 × 1 round-brick legs in two 4-plate bands (Red legs under a White 2 × 2 plate, White legs under a Red 2 × 2 jumper), a Red / White / Red 1 × 1 round-brick column on the jumper's centre stud, a thin Red Antenna 4H whip; a low dish rack beside it (Light Bluish Gray round-brick post, two White side-stud bricks with radar dishes facing south and west, a round tile cap).

**Hill palette (v3).** Treads Dark Tan (Tan 8 %), riser courses Dark Tan, every riser covered by a Dark Tan slope (33° / 45° / 65°, curved on the ridge) — Tan slopes rendered near white and were dropped. Dark scrub only from plant pieces: Dark Green 3-leaf plates (single or a Dark Green + Olive Green pair), Olive Green singles, 4 × 3 leaves on lips, and in gully bands below the letters compact shrubs of two round plates (Dark Green, an Olive top in 15 %). Trail: Medium Nougat tiles along the letters' feet (z 7, behind them) and a lower switchback tread with two Medium Nougat 33° ramps. Reddish Brown / Dark Brown blocks and Olive slopes of v2 dropped. Columns solid (below).

**v3 open issues.** The hill is paler and barer than the real one (Brickman's palette, as briefed): scrub density can rise at the island stage. Y reads as a tuning fork rather than a V at 4 studs. No hiker figure (minifig2 left to the island stage). No brace behind the letters.

---
## v1/v2 notes (superseded, kept for the record)
## What was built
| Element | Parts | Footprint | Height (plates above G) |
| --- | --- | --- | --- |
| 9 letters + frames (9 assemblies `hw_h … hw_d`, exploded) | 243 (≈ 108 white, 135 frame) | row 27.4 × 3.6 studs (letters 1 deep, posts 2.6 behind) | bottoms 31.5 → 35, tops 39 → 42.5 |
| Mast `la_mast` | 22 | 3 × 3 | summit 44 → lattice 56 → column 62 → whip tip 74 |
| Hill sample (terrain 1,830, scrub 84, oak 5, trail ramps 2) | 1,921 | 40 × 26 | treads 12 → bench 30–33 → ridge 40–41, summit 44 |
| Test scene total | 2,206 | | |

Real-letter proportions held: letters 0.8 H wide (W 1.07 H), 3-column grid 0.8 + 0.8 + 0.8 studs, climb 3.5 plates = 0.47 H (real 0.45 H), the 2nd O does not rise (dip). Row 27.4 studs = 9.1 H (real 7.9 H): gaps are 0.6 (0.2 H), fixed by the frame (below); the scheme's 25.6 assumed 0.4 gaps.

## Letters — technique
- **Sideways White plates**, one plate = one 0.4-stud layer along x. Each letter is **two halves**: the west half's studs point west, the east half's east, so both outer faces end in a tile (or a corner piece) and no stud or underside faces out. Inner faces (counter walls) show plate undersides edge-on — invisible from the front.
- There is no 0.4-stud part with studs on both faces, so **the halves are not joined to each other; each half is clipped to the frame** by a Plate 1×1 with vertical clip (turned on its side) gripping a horizontal girt.
- **Frame** (Dark Bluish Gray): two posts per letter = round plate on a bench stud + Bar 3L, 2 studs apart under the letter's outer layers; per girt, on each post a Plate 1×1 with vertical clip (grips the post) carrying a Plate 1×1 with horizontal clip (grips the girt, a Bar 3L). Clips slide on bars, so a letter sits at any height (legs show 1.5–2 plates) and any x along its girt. Girts at the bottom and top rows only.
- **O / D middle-row strokes** hang on a Bar 1.5L with Clip (clipped to the bottom girt, bar up) via a Plate 1×1 with horizontal clip: a middle-row girt ran straight across the O's counter and turned the O into an 8.
- **O / D corners: Slope 30 1×1×⅔ (cheese) on its side** — chamfered corners (an octagonal O), both sides, real parts.
- **W** stands on two 1×2 jumpers (its posts are half a stud off the 3-stud pitch); outer arms hang on 1×2 tiles from the middle row.
- **Y stem** stands free (both faces outward): one face must be a plate underside — the west one (default view from the south-east). Known limitation.

## Mast — technique
Four leg columns (1×1 round bricks) on the corners of 3×3 plates, three 4-plate bands Red / White / Red (open lattice between the legs), a red-white 1×1 column, a red whip (Antenna 4H). Dishes: 1×1 bricks with a side stud in four legs carry two radar dishes (Dish 2×2) and two round 1×1 tiles. No separate dish rack (scheme listed one) — open.

## Hill — technique (for the island stage)
1. **Heightmap** per cell, plates above G: south face `bench − 3 − 1.55·(z − z_face) + noise(scale 5, ±2.4)`, quantised to **3-plate treads** (whole brick courses); ridge behind the trail `bench + 2 + 1.9·dz + noise`, quantised to **2-plate treads**, capped 40–41; summit plateau 44 round the mast; the bench under the letters is a flat terrace per letter (30, 30, 30, 31, 31, 31 + jumper, 32, 33, 33); then lift any cell more than 6 plates below a neighbour.
2. **Columns are solid** from the island top (Dark Bluish Gray core). Top plate = tread colour; the 3-plate course under it = riser colour. **The hollow shell was measured and rejected**: 3-plate treads and the 30–33 bench do not share brick courses, so the packer splits a shell into 1×1 / 1×2 fragments that clutch nothing below — shell 6 deep: 2,047 parts / 436 floating; 12 deep: 2,284 / 125 floating; solid: 2,118 / 0. At island scale, keep the hill solid, or make every tread height ≡ 0 mod 3 (incl. the bench) and re-measure the shell.
3. **Riser covers** (≈ 5 in 6, by a coarse patch): on the lower tread against a 3-plate riser, Slope 33° 3×1 where the tread is 3 deep, else Slope 45° 2×1; 6-plate drops get a 65° slope 2×1×2 (two wide); ridge risers (2 plates) get Slope Curved 2×1. Slope backs carry scrub clumps.
4. **Colour by zone** (low-frequency blobs ≈ 40 % of the face, denser low down): **scrub zones** = Reddish Brown / Dark Brown floor and riser courses, slopes Reddish Brown 40 % / Dark Brown 25 % / Dark Green 35 %, dense clumps; **dirt zones** = Dark Tan treads (Medium Nougat 12 %), Dark Tan slopes (Reddish Brown 15 %), sparse clumps. The scheme's Olive Green 60 % slopes rendered as a light khaki hill — dropped.
5. **Chaparral** (84 parts in the sample): Plate 1×1 Round with 3 Leaves in Dark Green (single, or a Dark Green + Olive Green pair turned 180°), Olive Green singles, a Plant Leaves 4×3 lying downhill on some lips. Each leaf plate is turned so its leaves reach only toward lower ground (otherwise its hull runs into the riser). Sand Green read as snow — dropped. The scheme's large plants (3-large-leaf plant, Plant Bush) are 4–5 studs wide / 13 plates tall — far over scale (a shrub is ≈ 1 plate at this scale) — dropped.
6. **Trail**: Medium Nougat tiles flush in the top course along the bench behind the posts and along a tread at 24; two-wide Slope 33° 3×2 ramps in Medium Nougat for the switchback.
7. **Live oak**: 1×1 round brick trunk (Dark Brown) + three crossed Leaves 4×3 (Dark Green / Olive Green) + a 3-leaf plate — ≈ 6 plates tall, 0.8 H, real-scale. The scheme's `tree(kind 'oak')` would be 3× too large.

## Tried and rejected
- **Round O/D corners (Brick 1×1×⅔ curved top)**: a round corner needs an outward stud; with only 2-layer strokes the O needs ≥ 8 layers (3.2 studs = 1.07 H, real 0.72 H) for a tie layer + corner per side. Built at 6 layers with clipped halves instead — but that mould's top is a half-round, not a quarter: four of them made the O read as an 8. Replaced by cheese chamfers. A true quarter-round 1×1 at 2 plates does not exist in the library (searched: 1×1 curved / quarter / round-corner).
- **Reversal parts** (Brick 1×1 with studs on two opposite sides, 1×2×⅔ with side studs, Bar 1L with side studs): ≥ 1 stud thick or round; every placement left a stud or an open underside on the letter face or top.
- **Antenna posts** (scheme): 12 plates tall, they stood above the letter tops. **Bar holder with clip as girt holder**: coplanar with the post, the girt ran into the other post. **Light Bluish Gray frame** read as a second grey band across the gaps — Dark Bluish Gray.
- Letter clips gripping vertical posts directly: needs posts 1.2 apart (not on the stud grid).

## Deviations from the SCHEME
Letter gaps 0.6 not 0.4 (row 27.4); corners chamfered not round; frame Dark Bluish Gray, posts = round plate + Bar 3L; girts on clip holders; small-scale scrub and oak (above); hill solid not shelled; mast tip 74 (scheme 62 without the whip); no dish rack.

## Open issues
- O and D read octagonal, not rounded; Y's stem shows one underside on its west face.
- Hill sample cut faces show the grey core (test scene only).
- **Judge round 1 (lego-judge, v2 pack): weighted 5.3** — not at the done bar. Its fixes, in order: (1) Y and W do not read (Y = two posts and a block, W ≈ H) → diagonal strokes from wedge plates / slopes on their side, open the O's counter; (2) frame reads as thick dark bars and big round feet → thinner, further back; (3) mast is a squat cage → a slender tapering red/white lattice (ladder / fence pieces), dishes clustered on a low white rack; (4) hill palette too busy → Dark Tan / Medium Nougat dirt + Olive / Dark Green scrub in bands along gullies, a little Reddish Brown; (5) life layer: continuous trail along the letters' feet with a hiker minifig, and a proper armature oak. Not yet done. Note on (1): the W's middle row cannot be split (to open its V notches) without a clip at the posts' layers — the frame needs a rethink (posts not tied to the 5-layer spacing) before the W can change.
- Pipeline touched: `scripts/check-assemblies.ts` interlock pairs (clip plate beside clip plate / under a tile on one bar) and BARS `3484`; `scripts/check-asm-studs.ts` BY_DESIGN `3484`.
