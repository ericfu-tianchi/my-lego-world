# Santa Monica Pier — analysis + build scheme (for Eric's sign-off; no brick placed)
2026-10-04 · sources: `NOTES.md` (this folder), `docs/countries/usa.md` §1, `docs/countries/china.md` §1.9 (format) · reference render `../la-pier-lego.png`
Units: 1 stud = 2.5 plates. **G** = island surface, **w** = water surface = G − 1 (the brief's assumption: usa.md does not fix it yet), **D** = pier deck surface = w + 8 = G + 7.
All part numbers below were checked in the vendored LDraw library (`head -1`). "cat" = already in our catalogue; "bake" = to bake.

## 0. Decisions for Eric (top of page)
1. **The West Coaster decides the pier's size.** The only official coaster curve is 90° R12 (`25061`): any 180° turn is **27.4 studs wide**. A closed circuit round the wheel needs a **32 × 48 park deck**, so the pier comes out **≈ 32 × 62**, not 14 × 30, and the island will have to grow (my estimate ≈ 96 × 64).
   **A (recommended):** a full circuit (an oval with an S-ramp on each side), the wheel standing inside it as on the real pier. **B:** keep a 16-wide pier with one straight run of real track (a single S-hump) in front of the wheel, both ends buried in a station shed. B reads as "a coaster part", not the West Coaster.
2. **A Ø 22 wheel cannot be built as a 20-gon.** With real joints the chord must be a whole number of studs: chord 3 → Ø 19.2 (plates on single-stud swivels only), chord 4 → **Ø 25.6** (Technic). **Recommended: Ø 25.6, Technic**, the way 10247 and 31389 do it. It is the only route with true pin pivots for level gondolas. The wheel top moves from 66 to **≈ G + 83** (it is the hero; 0.42 × an 80-wide island is still under the playbook's 0.5–0.6).
3. **Where does the pier land?** The deck is 7 plates above the sand. Either (a) a strip of **Palisades bluff** at G + 7 carries the arch (true geography: the arch stands on Ocean Ave above the beach), or (b) the arch stands on the deck's land end with a flat stair of equal 2-plate steps down to the walk. Recommended: (a) if the island layout allows it.

## 1. Pacific Wheel (hero)

### 1.1 Real proportions (NOTES §0.1, measured on `real-wheel-front.jpg`)
- Ø 85 ft. Hub ≈ 0.65 D above the deck, rim bottom ≈ 0.14 D (the coaster runs through that gap). A-frame legs splay ≈ 0.6 D at the deck.
- **20 gondolas** hang **between two rims** spaced ≈ 0.12 D apart (`real-wheel-profile.jpg`). Each is an octagonal tub, **alternating Red / Yellow**, with a dark band at the top edge, a round boss underneath, and a flat **grey octagonal canopy on a central pole**.
- White tubular spokes, dense and **tangential** (the front photo shows a crisscross, with no line through the centre). White lattice truss rims with a steel outer band. The hub is a white disc drum.
- **Signature:** the dense white crisscross disc, the ring of red/yellow tubs, the white A-frame, and the yellow coaster passing in front of its lower half.

### 1.2 Brick versions → conclusion
| Version | What it does for the signature |
| --- | --- |
| 10247 Ferris Wheel (official) | Two white rim planes with the gondolas hung between them on cross-members (the real arrangement); Technic spokes; A-frames from hinge-angled bricks. 12 gondolas, Ø ≈ 60 |
| 31389 Iconic Ferris Wheel (official, 2026) | White Technic rim with **silver accents at every joint**, two-tone tubs, Dark Blue legs; the closest official look |
| 31119 Ferris Wheel (official) | A big brick hub disc carries the name; 8 gondolas (toy simplification) |
| LEGOLAND San Diego fair wheel (Merlin) | **16-gon of straight chords reads as a circle**; one gondola per vertex; tubs with a flat canopy on a pole; solid A-frame splayed ≈ 0.6 D |
| 40758 / 41689 (official, small) | Below Ø 16, LEGO drops the rim and uses 4–6 arms, which loses the identity. Counter-example |
| LEGO Masters US S1E1 "Spaceland" | The wheel is the hero and the tallest working thing in the park |

**Ours:** take 10247's two rim planes with the gondolas on cross-members, 31389's white Technic rim with silver joint dots, Miniland's chord polygon (one gondola per vertex) and canopy-on-pole tubs. **We do better on the spokes.** None of the versions has the real tangential crisscross; ours does, because the front plane's spokes lean one way and the back plane's lean the other. We also keep the real 20 gondolas.

### 1.3 Geometry (solved exactly; the LDraw assembly reproduces it)
- **Rim:** 20-gon, chord 4 studs → pivot radius R = 4 / (2 sin 9°) = **12.785 studs**. Vertices sit at 9° + 18k, so the top and bottom are flat segments with two gondolas symmetric about the axis (mirror-symmetric).
- **Hub drum:** a 10-gon of chord 2 → r = 1 / sin 18° = **3.236 studs**, vertices at 18° + 36j (so the two lowest are at 252° / 288°, 2 studs apart).
- **Spokes:** drum vertex j → rim vertex 27° further on. Length = √(R² + r² − 2Rr cos 27°) = **10.009 studs (0.2 LDU off)**, so an **11L beam is pinned exactly at both ends**. Front-plane spokes go +27° to the even rim vertices; back-plane spokes go −27° to the odd ones. Seen from the front, 20 spokes cross: the real pattern. Inside one plane they never cross (their angular ranges, 0–27° and 36–63°, do not overlap).
- **Legs:** a 15L beam (end holes 14 apart) from a lowest drum vertex at x = ±1 to a foot hole at x = ±8. That is 60° to the deck; the splay at the deck is 17 studs = 0.66 D (real 0.6). Hole k from the top sits at x = ±(1 + k/2), so **every pair of holes is a whole number of studs apart**: the A's crossbar at k = 10 is exactly 12 → a 13L beam.
- **Heights above the deck D:** foot holes ≈ D + 5 (foot raised one brick, see the table); drum's lowest vertices ≈ D + 35; **hub centre D + 42.7** (0.67 D, real 0.65); rim bottom D + 9.7 (0.15 D, real 0.14); bottom gondola tub ≈ D + 3; **rim top ≈ D + 76 = G + 83**.
- **Depth (z, from the wheel's centre plane; the centre plane sits on a cell centre so every layer lands on whole cells):**

| z (studs) | layer |
| --- | --- |
| ±3.5 … ±4.5 | A-frame legs + crossbar (front and back) |
| ±2.5 … ±3.5 | spokes (front: even rim vertices; back: odd) |
| ±1.5 … ±2.5 | rims: two thin layers each, alternating segments |
| ±0.5 … ±2.5 | drum rings (two thick layers each) |
| −1.5 … +1.5 | gondola zone: the hanger on the vertex axle, ½-bush spacers, a tub 2 wide with 0.5 clearance to each rim |

Overall depth is 9 studs including the legs; the rims sit 4 studs apart centre to centre (0.16 D; real 0.12).

### 1.4 Stud-grid sketch (front, from the south; 1 char = 1 stud across, 1 row = 2.5 plates = 1 stud up)
```
 D+76  .              ______________                  rim = thin 5L liftarms (White), silver ½-bush at each vertex (o)
       .          o--'  G      G    '--o              G  = gondola: canopy (round plate, LBG) on a pole, tub (2×2 round, Red/Yellow)
       .       o-'    \ \      / /     '-o
       .     o'   G    \ \    / /    G   'o           spokes = 11L beams, front plane leaning one way,
       .    /    \  \   \ \  / /   /  /    \          back plane the other (crisscross)
       .   o  G   \  \   \_\/_/   /  /  G   o
 D+43  .   |       ----- (drum) -----       |         drum = 10-gon of 3L beams, r 3.2; legs pinned on its two lowest vertices
       .   o  G   /  /   /\  /\   \  \  G   o
       .    \    /  /   / /\/\ \   \  \    /
       .     o.  G    / /  ||  \ \    G  .o           legs = 15L beams at 60° (White), crossbar 13L at hole 10
       .       o-.   / /   ||   \ \   .-o
 D+10  .          o--./____||____\.--o                rim bottom D+9.7
 D+9   =ooooooooooooooooo coaster south straight (track top ≈ D+9) oooooooooooooooo=
 D+3   .               G  /      \  G                 bottom tubs ≈ D+3
 D     ===============[f]========[f]===============   f = foot: Technic brick 1×2 with hole on a 1×2 brick, on deck studs
```
Top view of the wheel (1 char = 1 stud): it occupies x −13.3…+13.3 and z −4.5…+4.5, a 27 × 9 block with feet at x = ±8, z = ±4.

### 1.5 Scheme table (plates above the deck D; bottom → top)
| Plates | Element | Part types (verified LDraw no., first pick → fallback) | Colour |
| --- | --- | --- | --- |
| 0–3 | 4 leg feet, on deck-plate studs (plank tile left out) | Brick 1×2 `3004` [cat] + Technic Brick 1×2 with Hole `3700` [cat] | White |
| ≈5 → ≈35 | 4 legs at 60° (two A-frames, front and back) | Technic Beam 15 `32278` [bake], Pin with friction `2780` [bake] | White |
| ≈14 | A crossbar between each pair of legs (hole 10, exactly 12 apart) | Technic Beam 13 `41239` [bake] | White |
| 35–51 | hub drum: two 10-gons, 2 layers each, joined by 10 axles along z; the two lowest axles extend to the legs | Technic Beam 3 `32523` ×20, Axle 8 `3707` ×8 + Axle 10 `3737` ×2 [bake], ½ bush `32123a` [bake] | White · LBG axles |
| 10–76 | 20 spokes, tangential ±27° | Technic Beam 11 `32525` ×20 [bake] → fallback (if they read heavy): LBG Axle 10 `3737` in Cross Block 1×2 `6536` at each end (the axle slides, so length is free) | White |
| 9.7–76 | two rims, each a 20-gon of thin 5-hole liftarms in 2 alternating layers | Technic Beam 5 × 0.5 (round holes) `32017` ×40 [bake] → fallback: 1×4 swivel hinges `2429`/`2430` + 1×4 plates + tiles (no axle for the gondolas: hangers on clips) | White |
| vertices | 20 cross-axles through both rims; caps | Axle 7 `44294` [bake]; ½ bush `32123a` ×2 as caps (the 31389 silver dots) | LBG axle · **Flat Silver** caps (colour unverified → LBG) |
| hanging | 20 gondolas, top → bottom: hanger on the vertex axle (pin hole, so it hangs level), pole, canopy, dark band, tub, boss | Cross Block 1×2 (axle/pin) `6536` [bake] · Axle 4 `3705` [cat] · Plate 2×2 Round with Axlehole `4032a` [cat] (canopy) · `4032a` (band) · Brick 2×2 Round `3941` [cat] (tub, axle hole through) · ½ bush `32123a` (boss) | LBG · LBG · LBG · Dark Bluish Gray · **Red / Yellow alternating** · tub colour → LBG |
| ≈43, front | hub disc "PACIFIC PARK" (reserve print, 2 words) | **unsolved**: nothing on the drum's axis to mount it on (see risks); without it the white drum reads as the hub | White |

### 1.6 Footprint, height, budget, bake list, risks
- **Footprint** 27 × 9 inside the coaster oval; **height ≈ G + 83** (usa.md §1.5 says 66; changes for the reason in decision 2). It stays the tallest thing: hills + mast reach ≈ 60.
- **Parts ≈ 350:** rim 40 + vertex axles 20 + bushes ≈ 60 + spokes 20 + drum 20 + 10 axles + legs 4 + crossbars 2 + feet 8 + pins ≈ 16 + gondolas 6 × 20 = 120.
- **Bake:** `32017 32523 32525 32278 41239 3707 3737 44294 32123a 6536 2780` (cat already has `3700 3705 3941 4032a 3004`). The gate's Technic-pin connectors cover every joint.
- **Risks.**
  - *Colours:* White `32017` is the old thin 5L (unsure it exists in White; fallback LBG, or the hinge-plate rim). Flat Silver ½ bushes are unverified.
  - *Weight:* thick 11L spokes may read heavy next to the real thin tubes; the judge decides, and the fallback is axles.
  - *Rigidity:* 20 single-direction spokes leave the pin-jointed 20-gon under-braced in reality (friction pins hold it). The frozen assembly is what we render, so this does not affect the gate.
- **Open (hardest):** the **hub centre**. No LEGO part has 10-fold holes, and the drum's radius (3.236) and apothem (3.078) are not whole studs, so no beam reaches the axis. The wheel therefore hangs on the A-frames at the drum's two lowest vertices (structurally real). The printed hub disc has nothing on the centre to clip to.

## 2. Pier deck + timber pile bents

### 2.1 Real
- The deck is **≈ 28 ft above the water** on **timber pile bents**: 3–4 near-vertical round piles per bent (more across the wide Pacific Park section), bents ≈ 0.28 D apart, X-bracing between some of them.
- The piles are dark creosote (**Dark Brown**). The fascia and edge beam are weathered timber (**Reddish Brown**). The planks are grey-brown, laid **across** the pier.
- A blue pipe railing and lamp posts line the edge. The pier crosses the beach before it reaches the water (`real-wheel-pier.jpg`).
- **Signature:** the long dark row of bents standing in the surf, seen side-on from the beach.

### 2.2 Brick versions → conclusion
No Santa Monica Pier MOC exists (NOTES "Not found"). The closest:
- **Miniland Coronado boathouse** (`../la-venice`): dark round columns under a timber deck.
- **Flickr micro beach**: pier on posts.
- The **gpt-image-2 reference** (`../la-pier-lego.png`): a single row of round brick piles and a Reddish Brown edge beam. It reads well.

**Ours:** piles in **bents** (rows across the pier, as the real one has), not one row. Each pile goes **through the water layer**: the trans tile is left out and the pile stands on the Sand Blue sea-bed plate, so it rises out of the sea and is stud-connected.

### 2.3 Top view (1 char = 2 studs; W = sea end at the island edge, E = land end; north up)
```
 x(studs) 0   8   16  24  32  40  48  56 62
          |   |   |   |   |   |   |   |  |
 z 0       ==========================                 == railing on the deck edge (Dark Blue)
   2       |    .-oooooooo-.        |                 o  = coaster centreline (north straight = S-ramp, high W → low E)
   4       |  .o            o.      |
   6       | o    [=wheel=]   o     |    ==========   approach (12 wide), lamps L
 11 ===    | o   f  27×9   f  o     |    |  L     A|  A = arch (pylons on a 14-wide landing)
 16 tail   | o    [=======]   o     |====|  66     A|  66 = Route 66 sign (faces south)
 21 ===    | o   f         f  o     |    |  L     A|
   26      |  'o            o'      |    ==========
   28      |    '-oooooooo-'        |                 south straight = S-ramp (low E → high W), in front of the wheel
   32      ==========================                 f = wheel feet (x 20 / 36)
          tail 0–4 | Pacific Park deck 4–52 (32 × 48) | approach 52–62
```
Bents (rows of piles across the pier) every 6 studs along x: x = 4, 10, … 52 → 9 bents × 5 piles (z = 0.5, 8, 16, 24, 31.5) on the park deck; 3 piles per bent on the 12-wide approach and tail.

### 2.4 Side (from the south, at a bent)
```
 D   = w+8  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔  plank tiles across the pier
     w+7    ████████████████████  deck plates (Reddish Brown; edge row = fascia)
     w+6    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄  cap plate across the bent (Dark Brown)
     w+5     ‖      ‖      ‖      piles: 1×1 round brick ×2 (Dark Brown)
     w      ~‖~~~~~~‖~~~~~~‖~~~   sea tile layer (trans tile left out at each pile)
     w−1     ▀      ▀      ▀      Sand Blue sea-bed plate: the pile's stud joint
```

### 2.5 Scheme table (plates; absolute)
| Plates | Element | Part types | Colour |
| --- | --- | --- | --- |
| w−1 → w+5 | piles (≈ 55): two round bricks on the sea-bed plate; over the sand (approach) G → w+5 = round brick + round plate | Brick 1×1 Round `3062b` [cat], Plate 1×1 Round `6141` [cat] | Dark Brown |
| w+5 → w+6 | cap beam per bent, across the pier | Plate 1×8 `3460` / 1×6 `3666` [cat] | Dark Brown |
| w+6 → w+7 | deck frame along the pier, spanning the 6-stud bays; the outer rows form the fascia line | Plate 2×16 `4282` / 2×12 `2445` / 2×8 `3034` [cat] | Reddish Brown |
| w+7 → w+8 = D | planks laid across the pier; tiles left out wherever a foot, post or lamp stands | Tile 1×8 `4162` / 1×6 `6636` / 1×4 `2431` [cat] | Dark Tan, with every ~7th row Medium Nougat for plank variety (swatch-test) |
| D → D+3 | railing on every deck edge: posts + plate handrail, equal segments via `railing()` | `6141` ×2 per post + Plate 1×N / Tile 1×N [cat] → fallback Fence Lattice 1×4×1 `3633` [cat] | Dark Blue (swatch vs Sand Blue) |
| D → D+21 | 4 lamps: two on the approach, two on the south edge | Lamppost 2×2×7 `2039` [cat] | Black |
| optional | X-bracing on the south-face bents only | Bar 3L `87994` [cat] in Brick 1×1 with Clip `60476` [bake] | Dark Brown |

- **Footprint:** deck ≈ 32 × 62 (park 32 × 48 + approach 12 × 10 + tail 10 × 4), ≈ 1,700 studs². The approach overlaps the beach band; the tail runs off the island edge "as if it continues".
- **Height:** D = G + 7.
- **Parts ≈ 600:** piles ≈ 110 + caps ≈ 45 + deck plates ≈ 85 + planks ≈ 210 + railing ≈ 150 + lamps 4. **Bake:** none (all in the catalogue), except the optional bracing.
- **Risks:** the deck is the biggest part sink on the pier (the build grows with the coaster decision). **Open:** the land end (decision 3).

## 3. West Coaster — official coaster track

### 3.1 Real
- A steel family coaster (1996 [M]) looping round the wheel's base and through the gap under the rim.
- **Mustard-yellow track** on thick tubular posts, **each post one colour with a matching cap**: Red, Magenta, Bright Green, Blue.
- Crest ≈ 0.35 D above the deck.
- **Signature:** white wheel + yellow track + rainbow posts. Without the coaster the wheel reads as "a fair".

### 3.2 Brick versions → conclusion
- **10261 Roller Coaster:** red track on white Technic towers, a lift hill.
- **10303 Loop Coaster:** **Bright Light Orange track** on Dark Blue towers, which proves the colour exists.
- **No MOC** of the West Coaster.

**Ours:** real track in **Bright Light Orange** (the official colour nearest the real mustard; Yellow availability for these moulds is unverified), on **single-colour 2×2 round-brick posts**, which is the real scheme and better than either set's white or blue towers.

### 3.3 Layout (verified from the moulds' connection points)
- **Pieces:** 4 × Curve 90° R12 `25061` (centreline radius 12, envelope 13.7 × 13.7) + 2 × Ramp 4×16×3 S-shape `34738` (rise 72 LDU = **9 plates** over 16 studs) = a closed oval, **43.4 × 27.4** studs.
- **Turn centres** at x = ±8 from the wheel's centre. The east turn (land end) is low and the west turn (sea end) is high. Each straight is one S-ramp: the south straight climbs westward in front of the wheel, the north straight drops eastward behind it.
- **Every joint lies on a grid axis** (each curve's ends sit at 0° / 90° / 180°): 2 joints per turn end + 1 mid-turn joint per turn = **6 joints**. Each joint carries 2 studs on top and a tube underneath, so a 2×2 post under it takes both pieces' tubes. Add 2 mid-ramp posts → **8 posts**. The 45° mid-curves are left unsupported, as in the official sets.
- **Heights:** low joints at D+6, track top D+9.25. High joints at D+15, **crest D+18.25** (usa.md ≈ 20 ✓; 0.29 D, real 0.35).
- **Clearance:** the oval's inner edge is ≥ 10.3 studs from the wheel's plane; the wheel's feet and legs stay within ±4.5. The bottom tubs (≈ D+3 at x = ±2) are 10 studs away from the track. No clash.

### 3.4 Scheme table (plates above D)
| Plates | Element | Part types | Colour |
| --- | --- | --- | --- |
| 0–6 / 0–15 | 8 posts: 2×2 round bricks on deck studs, a 2×4 plate under the track joint | Brick 2×2 Round `3941` [cat] ×2 or ×5, Plate 2×4 `3020` [cat] | one colour per post: **Red, Magenta, Bright Green, Blue**, repeated round the oval |
| 6–9.25 / 15–18.25 | track oval; joints locked on top with a 2×2 plate across both pieces' end studs | `25061` ×4, `34738` ×2 [bake]; Plate 2×2 `3022` [cat] | **Bright Light Orange** (fallback Yellow, if it exists) |
| on track, south side | train of 2 cars | Train Base 4×5 Roller Coaster `26021c01` [bake] ×2 + seat bricks | Red / Blue cars [M] |

- **Footprint** 43.4 × 27.4 inside the 32 × 48 park deck. **Height** ≈ D+18. **Parts ≈ 70.** **Bake:** `25061 34738 26021c01` (plus `25059` / `26022` only if a longer layout is wanted later).
- **Risks:** a single rise reads simpler than the real multi-level West Coaster. If the judge asks, a second, inner level is possible only by making the deck longer. B (decision 1) removes the oval.

## 4. Entrance arch (1941) and the Route 66 sign

### 4.1 Real
- **Arch:** a broad **Dark Blue** band arched top and bottom. On top sits a white crest panel lettered "SANTA MONICA". At either end is a **pylon head** with **three mustard horizontal stripes top and bottom** and three vertical mustard bars between, on a slimmer blue post; one post is backed by a lattice. Pylon width ≈ 0.2 span, rise ≈ 0.35 span, crest ≈ 0.45 span.
- **66 sign:** a white stretched shield (a "SANTA MONICA" bar, a circle with a black **66**, an "End of the Trail" bar) on a dark grey square post. Only the "66" would read at our scale.

### 4.2 Brick versions → conclusion
None of the pier sign exists anywhere. Gate precedents:
- **10261** (entrance arch over a queue).
- The **gpt-image-2 ref**: Dark Blue arch with stripes; it reads, but its band lettering is illegible at our scale.

**Ours:** a real raised-arch mould for the band (top and underside both curve, exactly like the sign). Stripes are brick-built plate courses in **Bright Light Orange**, the coaster track's colour, which ties the pier's accents together. The only print is the crest, if it passes the thumbnail test.

### 4.3 Sketch (west face, as seen from the sea; 1 char = 1 stud, 1 row = 2.5 plates)
```
 D+27        _(SANTA MONICA)_          crest: Arch 1×6 Raised, White (printed, or plain if illegible)
 D+23  [=]  /================\  [=]    band: Arch 1×12×3 Raised, Dark Blue; heads cap D+23
 D+20  [≡] /                  \ [≡]    ≡ = top stripes: 3 Bright Light Orange plates between Dark Blue plates
 D+17  [ ]/                    \[ ]    plain Dark Blue (the 3 vertical bars need a print slot; see risks)
 D+14  [≡]                      [≡]    lower stripes; the band's feet sit on the inner columns
 D+0   [|]  (12-wide approach)  [|]    posts: Dark Blue 1×2 bricks; 14-wide landing
```
The 66 sign stands on the approach's south edge, facing the camera: a post of three Dark Bluish Gray 1×1 bricks, a White face 3 studs wide at D+9…D+16 (bar / "66" disc / bar).

### 4.4 Scheme table
| Plates (above D) | Element | Part types | Colour |
| --- | --- | --- | --- |
| 0–9 | two posts, 1×2 | Brick 1×2 `3004` [cat] | Dark Blue |
| 9–14 | lower stripe group (BLO / DB / BLO / DB / BLO) | Plate 1×2 `3023` [cat] | Bright Light Orange + Dark Blue |
| 14–23 | band, its feet on the heads' inner columns; outer columns rise: 14–17 plain, 17–22 top stripes, 22–23 tile cap | Arch 1×12×3 Raised `14707` [bake] → `18838` (ribbed version) [bake]; Brick 1×1 `3005`, Plate 1×1 `3024`, Tile 1×1 `3070b` [cat] | Dark Blue (`14707` in Dark Blue unverified) |
| 23–27 | crest on the band's 6 centre studs; "SANTA MONICA" in Dark Blue geometric 1940s capitals on the flat face (L2; 2 words; canvas px ≥ 320) | Arch 1×6 Raised `92950` [cat] | White |
| 0–9 | 66 sign post | Brick 1×1 `3005` ×3 + Brick 1×1 with Stud on 1 Side `87087` [cat] | Dark Bluish Gray |
| 9–16 | 66 face: a disc printed "66" (black numerals, black ring) between two plain bars | Bracket 1×2-1×2 Up `99780` [cat], Tile 2×2 Round `14769` [cat] (print), Plate 1×3 `3623` + Tile 1×3 `63864` [cat] | White |

- **Footprint:** arch 1 × 14 across the approach landing; sign 3 × 1. **Height:** arch D+27; sign D+16.
- **Parts:** arch ≈ 40, sign ≈ 10. **Bake:** `14707` (or `18838`). **Prints:** "66" (already planned in usa.md §1.8) + the crest (would be design no. 12, the last slot).
- **Risks.**
  - The default south camera sees the arch almost **edge-on**, because the sign spans the approach and faces along the pier; the crest reads only from the south-west quadrant view.
  - The real reverse face's lettering is unverified [M].
  - The three vertical bars on each head need a print (Dark Blue 2×2 tile with three BLO bars), and there is no slot left. Without them the heads carry 3 + 3 stripes only.
  - `14707` studs: the crown carries 8 studs at the top and 2 + 2 lower down each side, so the 6-wide crest seats on the centre 6 ✓.

## 5. End building
**Cut.** The real pier ends in a yellow-roofed harbour office ≈ 300 m beyond the park (`santa-monica-pier-aerial.jpg`). Our deck runs 4 studs past the coaster's west turn and off the island edge, so the pier visibly continues. Adding the building would cost ≈ 150 parts and 10 more studs of length for something nobody identifies the pier by.

## 6. Totals
| Element | Footprint (studs) | Height | Parts | New moulds to bake |
| --- | --- | --- | --- | --- |
| Pacific Wheel | 27 × 9 (inside the oval) | **G + 83** | ≈ 350 | 32017 32523 32525 32278 41239 3707 3737 44294 32123a 6536 2780 |
| Deck + bents + rail + lamps | 32 × 62 | D = G + 7 | ≈ 600 | (60476 only for optional bracing) |
| West Coaster | 43.4 × 27.4 | D + 18 | ≈ 70 | 25061 34738 26021c01 |
| Arch + 66 sign | 14 × 1, 3 × 1 | D + 27 / D + 16 | ≈ 50 | 14707 (→ 18838) |
| **Pier total** | **≈ 32 × 62** | | **≈ 1,070** (specialty ≈ 28 %) | 15 moulds |

## 7. Reference image `../la-pier-lego.png` (gpt-image-2, 1536 × 1024)
- **Right:** the white Technic-beam wheel (the beam holes read as a lattice truss), silver bushes at the vertices, grey canopies on poles over red/yellow tubs, Bright Light Orange track on single-colour round posts, a long row of Dark Brown round piles out of grey-blue tiles with a Reddish Brown edge beam, and a Dark Blue arch with stripes.
- **Wrong against the scheme:** one rim plane with ≈ 16 gondolas hanging *outside* it (ours: 20, between two rims); radial spokes (ours: tangential crisscross); no A-frame splay; an open-ended track (ours: a closed oval round the wheel); a single row of piles, not bents; and band lettering that would be illegible at our scale.
