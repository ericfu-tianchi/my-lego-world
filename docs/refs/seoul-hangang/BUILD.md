# Han River front strip: build notes (2026-10-06)

Test scene `?scene=ko-hangang&noglobe` (`src/scenes/ko-hangang.ts`). Water swatch: `?scene=ko-hangang-swatch&noglobe`.
Assemblies: `tools/ldraw/asm-ko-hangang.mjs` → `bake.mjs hangang_bus.ldr hg_lamp.ldr hg_bench.ldr --force --hull`.
- **Ground:** the island's own section. BASE 3, earth to plate 8, surface course at G − 1 = 9, **G = 10**, water top **w = G − 2 = 8**.
- **Tags:** `river`, `bank`, `park`, `boat`, `picnic`. The test scene also has `plinth` and `verge`.

## Result
| | |
| --- | --- |
| Parts | **≈ 913** in the strip: river 484, park 197, boat 119, bank 102, picnic 11. Sitting on the ground: boat + wake ≈ 119, lamps 20, benches 10, shrubs 12, buoys 6, bank finish, mat + box 11, so ≈ 330 on top of the ground (scheme ≈ 350). The rest (water columns, earth, lawn, path) belongs to the island ground line, as in the scheme. |
| Footprint | 76 × 26: path rows z0..z0+4, lawn, coping `copingZ(x)` = z0 + 7…11, step, river to the island edge |
| Heights | lamps G + 19…21 (disc) · boat G + 11 (wheelhouse roof) · benches G + 7 · buoys G + 4 · everything else ≤ G |
| Judge | r1 6.5 → r2 6.8 → **r3 7.1** (gate 8.0). Every dimension is ≥ 7 except life layer 6.5, which waits for the picnic pair. Three rounds done, so this goes to the lead/Eric. |
| Gates | `validate ko-hangang` PASS; check-assemblies, check-studs and check-asm-studs green; `npm run gate` green |

Renders are in `build/`:
- **Checkpoint shot:** `r5-hero.png`.
- **Close-ups:** `r5-only-boat.png`, `r4-boat-bow.png`, `r5-buoy-shrub.png`, `r3-picnic.png`.
- **Other views:** `r4-top.png` (regularity) and `r5-sil-34.png`.
- **Swatches:** `swatch*-*.png`.

## Decisions taken while building
- **Water (first risk test; three swatch rounds):**
  - Sand Green 1 × 1 flecks read as noise.
  - Banded or dominant Sand Green read patchy, pale or icy (LA's lesson again).
  - A Trans-Dark-Blue side wall read royal blue; a Trans-Black one read muddy.
  - **Kept:**
    - plain opaque **Sand Blue** in long 1 × 8/6/4/3/2 tiles along the current, joints staggered (judge r1: 2 × 2 tiles read as a grid);
    - ≈ 12 short Trans-Clear glint streaks;
    - an **opaque Sand Blue side wall** over the plinth lowered to 4.
  - It differs from LA's sea in having no Dark Blue offshore band, no surf lines and no trans side wall.
- **Boat** (`hangang_bus`, 16 × 5, 107 parts):
  - two 2-wide hulls with a 1-stud tunnel;
  - each bow is four stacked Wedge Plates 4 × 2 (41769a / 41770a), as in Shanghai's cruise. A wedge brick or 2 × 3 wing plates showed recesses;
  - Black boot-top;
  - a Blue stern block, with the fade in 1 × 1 plates stepping one stud a level;
  - Blue bulwarks round an open aft deck, and a Blue aft saloon wall;
  - a Dark Bluish Gray strake and a Black window band;
  - a roof edge in Blue 1 × 4 tile, then Blue/White round-tile dots (the halftone);
  - a grille-tile AC box on the roof;
  - a wheelhouse with Black glass two plates tall under a roof of 1 × 3 tiles;
  - an Orange fin of three 11477;
  - White lattice fences on both bows.
- **Boat heading:** the boat heads **east** (rot 0), against the scheme's west. The camera-side hull then shows the right-hand moulds, and the wake trails toward the west edge.
- **Wake:** White round 1 × 1 tiles flush on the bed plate, in two short diverging lines. Raised round tiles read as stepping stones; square tiles read as blocks.
- **Park:**
  - `hg_lamp`: LA's proven chain (round-brick collar, Bar 6L, head collar) with a White 2 × 2 round plate and round tile as the disc. A stack of round bricks read as an insulator.
  - `hg_bench`: Dark Bluish Gray legs, a Reddish Brown seat with a tile slat, and a lattice-fence back.
  - Shrub clumps at both ends of each bench.
  - Lawn plain Green, with mirrored Olive Green clumps and one worn Dark Tan cell at the mat track. Random specks failed the judge.
  - Two yellow cone buoys mid-river (judge r2).
- **Picnic:**
  - White 4 × 6 mat; Medium Azure / White checker tiles on every cell no figure needs.
  - Chicken box: a 2 × 2 brick under a printed 2 × 2 tile.
  - The lid print `ko_chicken_box` is **치킨** in Red marker strokes over a Dark Orange drumstick, drawn as stroke skeletons with no font. It reads in the close-up and as a red mark from the hero camera.
  - **Lettering record for korea.md:** delivery-box marker hangul, drawn strokes.
- **Not done:** a 한강버스 name print. The hull side is 3 plates tall, so it would not read at thumbnail size, and the judge agreed.

## For the island stage
- **Call:** `placeHan(bp, { x0, x1, z0, G, BASE, inIsland, floorOf, earth? }, own, sites)`.
  - It lays every cell x0 ≤ x < x1, z ≥ z0 that is `inIsland`, from `floorOf` up, and adds each one to `own`. The island lays nothing there.
  - It returns `{ isRiver, sideY, seats, copingZ, boat }`.
  - The island's plinth beside river cells tops out at `sideY − 1` (3) with a tile; elsewhere at 6 (see `plinth()` in the test scene).
- **Layout:** the layout is relative to the strip's axis cx = (x0 + x1 − 1) / 2, so a 76-wide island reproduces the scheme's numbers.
  - Lamps at cx ± 8.5 and cx ± 26.5, row z0 + 5.
  - Benches at cx − 17.5 and cx + 14.5 (4 wide), rows z0 + 7…8.
  - Shrubs at bench x − 2 and x + 5, row z0 + 7.
  - Mat at (cx − 2.5, z0 + 6), 6 × 4.
  - Boat at (x0 + 8, z0 + 15), rot 0, 16 × 5; wake west of it.
  - Buoys (2 × 2) at x = round(cx − 9.5) and its mirror, z0 + 18.
  - The river needs ≥ 23 rows south of z0 at the middle for the boat and buoys (the scheme has 24).
- **Seats for the picnic pair** (figures face +z, the river): stud pairs **(cx − 2.5, z0 + 8), (cx − 1.5, z0 + 8)** and **(cx + 1.5, z0 + 8), (cx + 2.5, z0 + 8)**. Each figure may cover a 2 × 3 cell block from z0 + 7, left as bare mat studs. With x0 = 0, z0 = 40: (35, 48)–(36, 48) and (39, 48)–(40, 48). The box sits at (cx − 0.5…cx + 0.5, z0 + 7…8), G + 1…G + 4.
- **Assembly ids:** `hangang_bus`, `hg_lamp`, `hg_bench`. New moulds: 41769a, 41770a and 4477 (43722a/43723a are baked but no longer used).
- **Shared-file changes:**
  - `tools/ldraw/bake.mjs`: LDraw colour 25 → Orange (one line).
  - Appended blocks at the end of `catalog.ts`, `prints.ts` and `scenes/index.ts`.

## Open issues
- **Wedge-plate recesses:** the angled face of each stacked wedge plate shows a thin dark recess per layer at close range, and the boot-top under the bow looks broken. It is a bake/renderer artefact of 41769a/41770a (and of the 2 × 3 wings and the wedge brick), not a gap in the model. **For the lead to check in the renderer.**
- **Life layer** 6.5 until the seated chimaek pair is on the mat.
- **Water colour:** Sand Blue still echoes LA's near sea. Every alternative tried was worse (see swatches).
