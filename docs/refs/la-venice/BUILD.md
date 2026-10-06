# Venice beachfront: build notes (round 3, 2026-10-05)

Test scene `?scene=la-venice&noglobe` (`src/scenes/la-venice.ts`). Assemblies live in `tools/ldraw/asm-la-venice.mjs`: run it, then `bake.mjs la_*.ldr --force`. Prints are the LA block at the end of `src/core/prints.ts`; I drew and checked them in a browser harness first.

The ground is the island's own section: BASE 3, earth to plate 9, sand top at G = 10.

Gates: `npm run gate` passes with LDRAW_DIR set. `validate la-venice` passes: 1,989 parts in the scene, 975 of them in the elements.

Round 3 follows the lead review of v2 (the "copy proven builds" rule). Side-by-side renders against the real photos are in `build/cmp-*.jpg`.

## What was built
| Element (tag) | Parts | Footprint | Top (plates above G) | Technique |
| --- | --- | --- | --- | --- |
| Skate bowl `bowl` | 246 (bowl 241, rail 2, placeholder board 3) | 19 × 12 | floor −5, apron/plateau +3, coping +4, riser +5 | One assembly on the island base. The concrete plateau stands one brick above the sand, and its outer face is a retaining edge. The profile is a quarter-pipe in three facets, 8 plates deep: cheese 31° (85984), then Slope 45 2×1 (3040b), then a vertical upper wall. Inside corners are Slope 45 2×2 double concave (3046), rounded above by macaroni bricks (3063b) and macaroni coping tiles (27925). The waist is a double convex slope (3045). The coping ring is Dark Bluish Gray. The deep lobe has a 4 × 4 floor; the shallow lobe is 6 plates deep, reached over the cheese row. |
| Art walls `walls` | 41 | three 8 × 1 walls in an echelon, plus a 22 × 2 path | +17 | Unchanged from v2. Each wall is Brick 1×6×5 (3754) with the same print on both long faces, ends of Brick 1×1×5 in the wall colour, a 1×8 footing and a 1×8 tile cap. |
| Muscle Beach `gym` | 138 (gate 40) | 14 × 10 | fence +10, weight plate ≈ +25 | Pen: pad, black mats, a 3-plate plinth, a square-lattice steel fence (32932) with tiled top rails and capped corner posts, a pull-up bar, and a bench with a blue pad. Gate (v3, scaled down): a 10-plate concrete portal. The west blue box hangs under the lintel; the east box stands on it, with a hinge (3937/3938) in its top course. The arm is a 2×4 plate and a Technic brick 1×2, turned 25°. A 2L axle carries Brick 2×2 round (3941) on edge with a Dish 2×2 face and a steel hub. |
| Lifeguard tower `tower` | 115 | 19 × 7 | +29 | v3 proportions follow real-tower-19, real-tower-a and the official 60328. Four slim 1×1 stilts, 3 apart, lift the deck 13 plates, about one cabin height. Each side face has a Technic beam X: thin 6-long beams pinned into Technic bricks 1×1 at foot and head, 3 across and 10 plates up, so the 3-4-5 triangle puts the end holes exactly on the pins. The two beams sit in two layers so they cross clear. Deck Plate 6×6 with spindle-fence rails (Fence 1×4×2) and round posts. Cabin 4 × 4, narrower than the deck: the sea face is a Window 1×4×3 on two 1×2 hinges raked 10° out; east is a Panel 1×2×3 with the stencil "2"; west is a Window 1×2×3. White roof Plate 6×6 with an eave one stud out all round, tiled. The ramp is 4 wide and 12 long: two 2×12 plates on two hinges on a post at the deck edge, solved to 27.7° so its foot rests on the sand. It has Fence Lattice 1×4×1 guards and grille/plain treads, and a foot-wash bucket at its foot (a permanent fixture per lamag.com, NOTES §0.1). |
| Ocean Front Walk `walk` | 435 | full width × 11 | lamps +28 | The walk is a curb one plate proud of the sand: plates, then tiles. A Sand Blue wave of macaroni tiles lies flush in the tile course. Lamps (v3): the official fluted lamppost (2039) in grey with two white saucer shades and a cone; this follows the Muscle Beach photo, while the boardwalk photo's single bell lamp is a second Venice type. Benches (v3) are an assembly: grey 1×2 ends, a green seat, and a backrest on two brackets. Palm pockets are sunk 2×2 Tan plates. The bike path is Dark Bluish Gray. |

## For the other builders
- **Skater:** the board (`la_skateboard`, placeholder) sits on the bowl's two stud points at bowl cells (13, 1–2), running along z. Those points are the top of a black 1×2 brick two plates proud of the apron, with its south cell at the deck edge; the nose wheels hang over the coping. The figure stands at BASE + 13 on the board's studs. The bowl apron is now G + 3.
- **Roller-skater:** a bare stud pair of plates at walk cells (21, 5)–(22, 5), studs at G + 1.
- **Lifter:** a bare Black Plate 2×2 at pen cells (6–7, 5–6), studs at G + 2.
- **Palms:** Tan 2×2 pockets at walk x 1, 13, 25, 37, 49 (z 6–7), studs at G.
- **Heights now:** tower 29 (was 23), gate ≈ 25 (was 32), lamps 28, walls 17. All are below the palms (≈ 35).

## Tried and rejected
- **Curved slopes for a smooth transition:** both normal and inverted curved slopes show a convex face, while a quarter-pipe is concave (SCHEME §0). Large ramp panels (43085) are 18 plates tall, and upside-down arches need a stack of inverted plates under them. The three-facet profile with a vertical top and macaroni corners is the buildable version.
- **Macaroni coping on a flush apron (v2):** half a stud showed at each corner. On a vertical wall course the macaroni brick covers the corner cleanly; a small sliver at each outer corner remains.
- **Tower v2 (lead review):** stubby stilts boxed in by lattice, white corner trim, and chunky bar-frame rails read as "a blue box on blocks". v3 copies real proportions instead.
- **Gate v2:** the 4×4 round brick disc read as a giant tyre and topped out at G + 32. v3 has a 2×2 plate on a shorter portal.
- **Lamps v2:** round bricks with dishes read as a stack of insulators.
- **Ramp hinge plates 1×4 (2429/2430) and hinge bricks 1×4 (3830/3831):** both swivel flat, so neither can rake a window or tilt a ramp. The 1×2 hinge (3937/3938) does both.
- **Wave tiles on plain plates:** the macaroni's far corner showed a stud. That cell is now tiled one course down; faint notches remain.
- **Bare concrete ends on the art walls (v1):** they read as framed pictures.

## Deviations from SCHEME.md
- **Muscle Beach:** 14 × 10 instead of 12 × 8, so the fence fits whole 4-long segments. The gate is shorter (piers 10 plates, not 13).
- **Tower:** 23 → 29 plates tall, because the lead asked for a deck about one cabin height up. Deck 6 × 6 and cabin 4 × 4 as in the scheme. The eave is 1 stud all round. The raked window is on 1×2 hinges, not the scheme's hinge plates.
- **Bowl:** the scheme's flush apron became a raised plateau (lead review), and a vertical top course was added: depth 8 plates, not 5.
- **Skater:** the coping riser replaces the in-bowl rider, as the figures builder asked.
- **Rail:** two Bar 1×8×2 sections stand on the sand on the north side.

## Shared-file changes (beyond the catalogue and prints blocks)
- **`src/core/prints.ts` `decalGeometry`:** a two-faced (`both`) print used `mergeGeos`, which drops the UVs, so every two-faced print drew nothing. It now uses `mergeGeometries`. Only the parts sheet uses the Kyoto nobori; the Merlion scales use the same path.
- **`tools/ldraw/bake.mjs`:** LDraw colours 1 (BrightBlue) and 212 (BrightLightBlue) added on one line.
- **`check-assemblies.ts` BARS / INTERLOCK:** adds Technic pin 2780, the skateboard wheels, the open bar-frame and spindle/lattice rails, and the window/glass pairs.
- **`check-asm-studs.ts`:** pin 2780 added to PINS. BY_DESIGN gains the glass, the skateboard deck and wheels, and the tower's thin brace beams and pins.

## Open issues
- **Bowl shape:** two rounded lobes, deep now, but no flowing clover. A wider plateau (a ring of apron round the bowl) would sell the raised park better in the island.
- **Bowl rail:** it stands on the sand below the plateau; on the island it should sit on the walk at plateau height.
- **Ramp post:** the hinge post under the ramp's head is a heavy 1 × 4 column.
- **Lamp type:** the boardwalk's own lamp is a single bell on a curved arm; we built the twin-saucer type.
- **Wave:** faint notches beside the macaroni wave.

## Judge, round 3: weighted ≈ 6.3 (round 1 was 5.5); below the 8.0 done bar
Scores: tower 6.5, bowl 6.0, Muscle Beach 5.5, walls 7.0, walk 6.5. Three rounds are done, so this goes to Eric per the three-round rule.

Taken as next fixes:
- Slim the tower's ramp post: the heavy 1 × 4 column reads as a solid block under the deck.
- Glaze the cabin's west and east sides.
- Dress the plateau's sides with steps and tile trim.
- Add pen equipment (bench press, rack).
- Shorten the lamps.

Where I disagree:
- The walls are not over the colour limit. The judge counted the brick ground colour and the posts; each print has ≤ 4 colours.
- The gate should not be made symmetric. real-musclebeach.jpg shows an asymmetric portal: one box hangs, one stands, and the disc sits on a slanted arm.
- The stilts are already 1 × 1 columns with Technic X braces; what reads as a solid block is the ramp post.

## Round 2 after Eric's island review (2026-10-05)
Renders and photo pairs: `docs/refs/la-island/r2/` (`cmp-*.jpg` = photo beside render).
- **Skater (`la_skater`):** a tail stall on the coping. Two locking hinge pairs (44302b on the coping at x11 and x15, 44301b raised) sit astride the wheels. Two Plate 1×5 span the raised plates, and the board sits on their middle studs, raked 18° nose-up. The axis is 0.3 past the lip at tail-truck height, so the tail wheels rest on the coping's edge. Their tread presses 0.07 stud into the corner. No grid height gives an exact tangent: 0 overlap only happens at 0°. The skater is a minifig assembled from its real parts, and his prints sit on the members (`torso_la_skate_m`, `face_la_shades_m`). He stands side-on on the board's studs and leans back with it. The bowl's riser and the placeholder board are gone.
  - **Tried and rejected:** one hinge under the board, where the tail truck sits in the knuckle. A board offset onto one stud, where the hinge plate reaches the tail truck. Clipping the tail trolley's axle to the coping: no clip height puts the wheels on the coping, and a nose-up tilt about the truck drives the tail into the coping.
- **Walk:** Sand Blue sweeps. Each crosses the walk on 2×2 + 3×3 macaroni arcs (79393 is new), wide and thin in turn, down and up. The real paving's lines are thinner, run diagonally and cross. A tile grid has no diagonals, so ours read as bands with elbows. This is still the weakest of the five.
- **Lamps (`la_lamp`, `la_lamp2`):** these are the boardwalk's own lamps. One has a charcoal bar pole with a straight arm and a bell pendant (cone crown, dish dome, clear lens). The other is the twin with two bells on a 1×5 cross-arm. They alternate along the walk; the top is at 26 plates (it was 28).
- **Tower:** the side panel now shows "18" in stencil, the number of real Venice tower 18 (real-tower-18.jpg; Commons "Lifeguard tower 18 in Venice Beach County Park").
- **Muscle Beach:** Flat Silver lattice panels (3185) replace the chunky balustrade, so the fence reads as see-through. A rack (`la_rack`) holds three dumbbells lying across clip tiles.
  - **Still open:** the lifter's own dumbbells, upright in his fists, read as two balls. Fixing them needs `la-life.ts` / `lib.ts` changes (see report).
