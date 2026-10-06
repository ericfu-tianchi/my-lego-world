# Neuschwanstein in LEGO: how other builders did it (research notes, 2026-10-05)

Scope: the official set (LEGO Architecture 21063), LEGOLAND Deutschland Miniland, fan MOCs at micro / mid / minifig scale, and the surroundings (Hohenschwangau, alpine houses, carriages, swans, waterfall, forest).
Confidence tags (same as Paris): **[S]** = stated by the source page (URL given); **[P]** = I read it off the photo myself (image file named); **[M]** = memory / LEGO knowledge, unverified. Part numbers appear only where a source states them, or where I checked the number against the vendored LDraw library (`vendor/ldraw-lib/ldraw/parts`, tagged **[L]** = "title confirmed in LDraw"), or tagged [M].
Access: New Elementary, The Brothers Brick, Brickset (article, images **and the full inventory**), LEGO.com (product page **and the 360-page instruction PDF**), Wikimedia Commons, Brickshelf, Flickr search pages, Eurobricks and felixmezei.eu all worked. Brick Fanatics returns an empty shell to scripts. Rebrickable, LEGO Ideas and BrickLink were not tried for photos (blocked in the Paris round); not needed this time because the official inventory came from Brickset.

**Scale reminder for us.** Island 56–86 studs wide → landmark ≤ 0.6 × width ≈ 34–52 studs ≈ 27–41 cm. **21063 is 46 × 20 × 31 cm on a 58 × 26-stud base**, i.e. already exactly the size of one of our hero landmarks (base included). The real castle is long and narrow on a ridge (about 130–150 m long [M]); every build below compresses it lengthwise far more than minifigs would allow (at minifig scale ≈ 1:42 the castle would be 3+ m long — Mezei's 160 cm replica is still under minifig scale). So, as with the Eiffel Tower, the castle is a compressed micro landmark and only the life layer is minifig scale.

---

## 0. Bottom line

**Best template: 21063 itself.** Same size as our slot, LEGO-designed, built from real parts we can resolve in LDraw, and we hold its full inventory (`official-21063-inventory.csv`, 435 lots / 3,438 pcs, from Brickset) and the full instruction PDF (360 pages; key pages saved as `official-21063-instr-p*.jpg`). Borrow its massing, its tower recipes and its rock wholesale; replace only its printed windows (240 printed parts, far over our L2 budget of ≤ 40 printed pieces) with brick-built openings, and decide the roof colour.

What each build does for the signature details:

| Signature | 21063 (46 cm) | t-brick / Thilo Schön (70 cm, 4,300 pcs) | Mezei (160 cm, 57,640 pcs) | Carney (52,461 pcs) | Miniland (1:30, 4.5 m) |
|---|---|---|---|---|---|
| Stair-tower cluster with slender cones | **2 × 2 round bricks threaded on a Technic axle; tan Z20 bevel gears = galleries; black 2 × 2 × 2 cone + a 1 × 1 cone turret** | white round bricks, two **tan gallery rings of stacked plates**, dark-grey cones with sand-green finials | tall white round tower, tan crenellated gallery, slim dark-grey cone stack + tiny side turret | octagon of hinged white wall panels, inverted-slope corbel band, spindle-fence gallery, black stepped cones | turned-white round tower, sand-green cones |
| White walls + roof colour | white 1 × 1 bricks + headlight bricks; **black roofs** | white; **dark bluish grey roofs** | white running bond; **light bluish grey shingle roofs** | white running bond, dark-grey plate string courses; black/dark-grey roofs | off-white; **sand green roofs** |
| Palas windows | printed half-round 1 × 1 tiles on headlight bricks (raised; reviewers dislike it) | 1 × 1 openings | brick-built arched openings with lattice | deep arched openings with white baluster columns | 400 windows in 30 shapes |
| Gatehouse | **dark red** + tan round corner towers + tan gear crowns | bright light orange + tan towers | red + tan, stepped crenellated gable | — | bright red + tan |
| Cliff | hollow shell of olive-green / dark-tan / dark-grey slopes (45°, 65°, 75°) on long dark-grey bricks | dark green / grey slopes | green plates + grey rock | dark-grey brick crags | sculpted (not LEGO) rock face with waterfall |
| Bridge + gorge view | **not built** | not built | not built | not built | rock backdrop with a waterfall, no bridge |

**Top techniques to borrow** (details §1):
1. **Round towers as stacks of 2 × 2 round bricks on a Technic axle**, with Technic Z20 bevel gears (tan) and a wedge-belt wheel (dark grey) as the corbelled galleries, 4 × 4 round plates + quarter-round tiles as the gallery floor rings, and cones on top. Strong, real, and reads as Neuschwanstein instantly. [S NE, P instr p330–337]
2. **Buttresses from long thin slopes** (1 × 6 and 1 × 4 slopes with cutout, 18° 2 × 1 slopes) leaning against the base of the Palas and towers — the tall white "fins" are a Neuschwanstein signature. [S NE]
3. **Off-grid wings on hinge plates + jumpers**: the angled western Palas and the winding access road both turn on 1 × 4 hinge plates, locked by correctly placed jumpers. [S NE, TBB]
4. **The rock as a hollow slope shell** in three earth colours (olive green, dark tan, dark bluish grey) on long bricks and 4 × 12 plates, with 75° slopes for the vertical faces and 45°/65° slopes for the grassy ledges. [S NE, TBB; P `official-21063-ne-rock-parts.jpg`, instr p205]
5. **Square-tower corbel** of inverted curved/tapered slopes under a square cap, with a round turret on top (gear crown + cone). [P `official-21063-ne-squaretower.jpg`]
Also: the gatehouse's **round corner towers with tan gear crowns** and **semicircular bastion** of light-grey quarter-round bricks; **stepped/bowed courtyard**; **fork chimneys**; **two-storey balcony of headlight-brick rows on wedge-plate brackets**.

**Decisions this research surfaces for Eric** (not answered here): roof colour (21063 black · real slate is dark grey-blue · Miniland sand green · t-brick dark bluish grey); gatehouse colour (21063 dark red · real brick is an orange-red, closer to dark orange / red per reviewers); whether to add the Marienbrücke + Pöllat gorge (nobody has built it in LEGO — ours to design).

**First list of candidate part types** (resolve in LDraw; [L] = number and title already confirmed in our LDraw copy):
- Towers: Brick 2 × 2 Round 6143 [L] / 3941 [L]; Brick 3 × 3 × 2 Round with Recessed Centre 73111 [L] (21063's big round tower); Technic Gear 20 Tooth Bevel 32198b [L] and Double Bevel 18575 [L] (gallery crowns); Technic Wedge Belt Wheel (21063 element 49750; in LDraw as 4185a [L-title]); Plate 4 × 4 Round with Hole and Snapstud 60474 [L]; Tile 2 × 2 Corner Round 27925 [L]; Plate 2 × 2 with Rod Frame Octagonal 75937 [L]; Technic axle 12L / 8L (spine); Brick 1 × 1 Round 3062b [L].
- Cones / finials: Cone 2 × 2 × 2 with Hollow Stud Open 3942c / 14918 [L]; Cone 1 × 1 with Stop 59900 [L]; Cone 1 × 1 4589 [L]; Cone 2 × 2 Truncated 98100 [L]; Cone 3 × 3 × 2 6233 [L] and Cone 4 × 4 × 3 272 [L] (for a larger main cone); Slope Brick 50 1 × 1 × 0.667 Quadruple 35344 / 22388 [L] (pyramid caps); spike finial (21063 uses dark-grey element 34078 "conical horn", number not in LDraw — find the LDraw equivalent).
- Walls / windows: Brick 1 × 1 with Headlight 4070 [L]; Technic Brick 1 × 1 with Hole 6541 [L]; Brick 1 × 1 with Half Arch on Opposite Sides 38583 [L] and on Two Adjacent Sides 38585 [L]; Panel 1 × 2 × 2 Hollow Stud with Arched Window Opening 90195 [L]; Brick 1 × 2 with Centred Stud on Long Side 86876 [L]; Brick 1 × 2 with Embossed Bricks 98283 [L] (grey stone plinth); Tile 1 × 1 with Rounded End 24246 [L] (unprinted half-round, if we want the arch heads without print).
- Buttresses / corbels: Slope Brick 10 6 × 1 4569 [L]; Slope Brick 13 4 × 1 5654 [L]; Slope Brick 18 2 × 1 × 0.667 5404 [L]; Slope Brick 75 2 × 1 × 3 Inverted 2449 [L]; Arch 1 × 3 × 2 Ogee 88292 [L]; Arch 1 × 4 3659 [L].
- Roofs: Slope Brick 45 2 × 1 3040b [L], 2 × 2 3039 [L], 1 × 1 Double 35464 [L]; Slope 31 1 × 1 × 0.667 54200 [L] and 1 × 2 × 0.667 85984 [L]; Slope 45 2 × 2 Double 3043 [L]; Slope 45 1 × 2 Triple 15571 [L]; Slope 65 2 × 2 × 2 3678a [L]; Slope 75 2 × 1 × 3 4460a/b [L]; Slope Brick 18 2 × 1 × 0.667 Grille 61409 [L] (dormer lattice); Minifig Cutlery Fork 79741 [L] (chimneys).
- Gatehouse / bastion: Brick 4 × 4 Corner Round 48092 [L] / 2577 [L] (bastion; 21063 uses element 72140 "bow 1/4 4 × 4 × 1"); Brick 1 × 2 Log 30136 [L]; Arch 1 × 3 × 3 Pointed 13965 [L]; Wing/wedge plates 24299 [L].
- Rock: Slope 45 2 × 1 3040b, Slope 65 2 × 1 × 2 60481a [L], Slope 75 2 × 1 × 3 4460a [L], Slope 75 2 × 2 × 3 3684c [L], Slope 31 54200/85984; Hinge Plate 1 × 4 1927 [L] (road angles).
- Trees: Plant Flower Stem with Bar and 6 Stems 19119 [L] + Plate 1 × 1 with 5 Petals 24866 [L] (deciduous); 21063's pines = brown 3L bar + green "Plant w/ 3.2 shaft no. 1" (Brickset 24855; LDraw 24855 is titled "Plant Flower Stem with Bar and Hole" — check it is the same mould before using).
- Life layer: Animal Horse (Complete) 4493c00 [L]; Animal Horse Hitching with Hinge 4587 [L]; Wheel 3.2 × 43 / 3.2 × 56 with 10 Spokes Wooden 33211 / 33212 [L]. **No swan mould exists in LDraw** (title search for swan/goose: none) — see §4.

---

## 1. LEGO Architecture 21063 Neuschwanstein Castle (2025) — the template

**Facts.** 3,455 pcs, 18+, US$279.99 / £239.99 / €269.99, released 1 Aug 2025; second-largest Architecture set after 21061 Notre-Dame (4,383). [S https://www.newelementary.com/2025/07/review-21063-neuschwanstein-castle-from.html ; https://brickset.com/article/122731/lego-architecture-21063-neuschwanstein-castle-revealed!]
- Dimensions **"over 12 in. (31 cm) high, 18 in. (46 cm) wide and 8 in. (20 cm) deep"**. [S https://www.lego.com/en-us/product/neuschwanstein-castle-21063]
- Base **58 × 26 studs** [S Brickset reader comment, RichardOfNuadha; consistent with 46 × 20 cm ÷ 0.8 cm]. Scale not stated; ≈ 1:300–1:350 by length [M estimate].
- Designer **Rok Žgalin Kobe** (Slovenia; also designed 10307 Eiffel Tower); visited the castle; project took almost half a year; two priorities: the castle–landscape connection and the visitor experience. [S press-release summary, https://www.mobiflip.de/lego-fordert-bluebrixx-heraus-lego-architecture-schloss-neuschwanstein-vorgestellt/amp/]
- No new moulds, no recolours; **9 new prints on 240 elements**, all windows (+ the name tile). 354-page book, 23 bags, no stickers. [S NE] Build time ~9 h. [S https://www.brothers-brick.com/2025/07/17/lego-architecture-21063-neuschwanstein-castle-bavarian-cream-of-the-crop-review]
- Two tree options: **summer and autumn foliage** swap on 4L bars. [S NE, Brickset; P `official-21063-seasons.jpg`]
- Interior only in two places: the Palas living rooms with the **Tannhäuser grotto** (geode/rock-with-crystal elements, trans-orange) and a **swan** (white rounded 1 × 2 plate 35480 + 1 × 1 cheese slope + cow horn 67258), and the **Singers' Hall/Throne Hall** (tan arches, gold columns). [S NE; P `official-21063-grotto-swan.jpg`, `official-21063-singershall-interior.jpg`]
- **Inventory** (Brickset, 435 lots): saved as `official-21063-inventory.csv` (element id, qty, LEGO colour name, category, design no., LEGO part name). LEGO colour names: Brick Yellow = Tan, Sand Yellow = Dark Tan, Dark/Medium Stone Grey = Dark/Light Bluish Grey, New Dark Red = Dark Red, Earth Green = BL Dark Green, Dark Green = BL Green, Flame Yellowish Orange = Bright Light Orange. Colour totals: White 939, Olive Green 354, Black 327, Dark Stone Grey 311, Medium Stone Grey 296, Tan 277, Dark Tan 219, foliage greens ~325, Dark Red 107, Reddish Brown 98. [S https://brickset.com/inventories/21063-1]
- **Instructions**: full PDF fetched from LEGO's CDN (`https://www.lego.com/cdn/product-assets/product.bi.core.pdf/6592611.pdf`, 133 MB, 360 pp; not committed). Sequence [P contact sheets]: rock in sections front→back (pp ~20–240, interleaved), gatehouse, lower courtyard + square tower, Bower, Palas, western Palas, stair tower (pp 329–338), trees (pp 343–353), inventory (pp 355–358).

### 1.1 Massing (read off the official photos) [P]
`official-21063-front34.jpg`, `-box-back.jpg`, `-side-road.jpg`, `-top34.jpg`, `-tbb-long-side.jpg`
- Long, narrow composition on a ridge: **gatehouse at one end (dark red + tan towers, on a light-grey bastion), lower courtyard, square tower, Bower, upper courtyard, then the tall Palas block at the other end with the stair tower rising above it.** The Palas is the tallest mass (about 2.5× the gatehouse); the stair tower tops it by roughly a third again. The rock takes about the lower third of the total height under the Palas and drops to a low lip at the gatehouse end.
- The **road** climbs along the long side as a light-grey ribbon, switching back once near the gatehouse.
- **Light-grey stone plinth** (masonry-profile bricks, medium/dark stone grey) under the white walls where they meet the rock — matches the real rusticated base. [P `-tbb-rock-squaretower.jpg`; S inventory: 23 × Medium Stone Grey 98283]
- **Horizontal grey bands** (dark-grey plates / tiles) as string courses every few courses on the white walls and towers. [P]

### 1.2 Stair tower (the tallest turret cluster) [S NE; P instr p330–337, `official-21063-ne-stairtower.jpg`]
- **Built lying down on a Technic axle**: a black 12L axle is the spine; parts are threaded on in order — a white Technic 1 × 1 brick turret head + black 2 × 2 × 2 cone at the top, then a **dark-grey wedge-belt wheel** + **tan Z20 bevel gear** (the upper gallery crown), white 2 × 2 round bricks / round plates, then a gallery of **two tan 4 × 4 round plates with snap** capped with **four black 2 × 2 quarter-round tiles** (black ring), more white round bricks with **dark-grey round plates as bands**, then a red 8L axle extends the spine for the lower shaft (instr p330, p331, p333).
- A small **stair turret** clings to the top: 1 × 1 round bricks stacked with a black **1 × 1 cone** (59900) and a bar spike. [P `-ne-stairtower`]
- The base flares with **white long slopes (1 × 6 and 1 × 4 with cutout, 18° 2 × 1)** as buttresses on all sides, attached via plates on a small sub-assembly (instr p337). [S NE]
- Decoration: **Technic Z20 gear (18575)**, **pulley wheel (49750)**, **2 × 2 octagonal frame plate (75937)**. [S NE]
- Read: the tower is ~2 studs wide and ~12 bricks tall in the set; gallery crowns read as gold rings — the most recognisable Neuschwanstein cue. Reviewers note this tower **wobbles** (Brick Fanatics BrickScore summary, via search snippet [S weak]). On a Technic axle spine it is still physically legal — good for our "real connections" rule.

### 1.3 Other towers and roofs [P]
- **Square tower** (`official-21063-ne-squaretower.jpg`): white square shaft of 1 × 1 / 1 × 2 bricks with printed window tiles, one grey band; top **corbelled out on inverted curved slopes** in white, square cap of plates; a round turret (printed 2 × 2 round brick, light-grey round plate) with a **white 4 × 4 round plate between two tan Z20 gears** and a **black faceted cap** (cone 2 × 2 truncated / quadruple slopes — exact parts not checked). Decoration: tan Z20 bevel gears 32198 and pulley wheel 49750. [S NE]
- **Big round tower** (on the Palas north side): **white 3 × 3 round bricks** (TBB: "large 3 × 3 round pieces"; inventory: 5 × White 73111 "Brick 3 × 3 × 2 Round with Recessed Centre" [L]) — no printed windows, the joints read as slits. [S TBB]
- **Gatehouse towers** (`official-21063-ne-gatehouse-bastion.jpg`): **tan 2 × 2 round bricks** with printed windows, tan Z20 gear crown, black 4 × 4 round plate, **black pyramid cap**; white base. [P]
- **Palas roof**: steep **black** roof of 45° slopes (1 × 2, 2 × 2, 1 × 1 double), cheese slopes, ridge pieces; **dormers in dark tan 65° slopes + reddish-brown openings**; **dark-grey spike finials** at the gable corners; **knight/lion statuettes (minifig statuette 90398)** on the gable peaks; **chimneys = metallic silver forks (79741)**; small **corner turrets** = tan 1 × 1 round bricks with black 1 × 1 cones. [S NE; P `official-21063-courtyard-closeup.jpg`, instr p277]
- Roof colour in 21063 is **black** (325 black parts), with **dark tan** for the dormers and gables' ornament. Reader comment: roof "should be Dark Blue instead of Dark Bluish Grey" [S NE comment, Jamie]. Real roofs are slate grey-blue [M] — decide from photos.

### 1.4 Walls and windows [S NE, TBB; P `official-21063-ne-window-parts.jpg`]
- Window solutions at micro scale: **1 × 1 headlight brick (4070)** using all three apertures (front hole, rear opening, side), **1 × 1 Technic brick (6541)**, and the new prints: 134 × white 1 × 1 half-circle tile (double window), 16 × dark red (single), 10 × tan (double), 19 × white 1 × 2 brick single window, 36 × 1 × 2 triple window, round 2 × 2 bricks with 1/2/3 windows (tan + white).
- The half-round printed tiles sit on headlight bricks or on **1 × 2 bricks with centred side stud (86876)**, so they **project** from the wall — both reviewers call this the weak point (real windows are recessed). The flush option is the headlight brick's rear opening, which lacks the arch. [S NE, TBB]
- For us: prints are L2 and capped at ≤ 40 pieces per country → **use the flush headlight-rear-opening, Technic-hole and half-arch-brick (38583/38585) openings** for most windows; a printed half-round tile only on the one or two façades that need the twin-arch read, if at all.

### 1.5 Palas details [S NE, TBB; P `official-21063-ne-westpalas-balcony.jpg`]
- The **western Palas is angled** to the rest: 1 × 4 hinge plates, two hinge plates joined by a plate and locked by jumpers. [S NE, TBB]
- **Two-storey balcony** over the Alpsee side: two rows of **1 × 1 headlight bricks** (tan) on a bracket of **2 × 2 wedge plates**; **buttresses = 1 × 6 cutout slopes**. [S NE; P]
- A **bower** wall is set at an angle with **espresso bars (32828) in 1 × 1 round plates with hole (28626)**. [S NE]
- Subtle-angle corner: headlight brick bar-hole + 1 × 1 round plate with hole + 1 × 1 round plate with hollow stud. [S TBB]
- **D-SNOT**: "Brick Round 1 × 1 × 2/3 Half Circle Extended with Stud on Side" holds angled slopes on the walls; gatehouse roof angle = D-SNOT + wedge tiles. [S TBB]
- Courtyard: white tiles mark the footprint of the **never-built keep**. [S NE]

### 1.6 Gatehouse and bastion [P `official-21063-gatehouse-end.jpg`, `-ne-gatehouse-bastion.jpg`]
- **Dark red** brick body (reviewers: too dark; real is an orange-red brick; suggested dark orange / medium nougat) [S NE, TBB]; **tan** central gate frame with arched opening, tan stepped gable with tan 1 × 2 wedge tiles; **two tan round corner towers** on white bases; windows = dark-red printed half-round tiles.
- **Bastion** below: semicircular wall of **light-grey 4 × 4 quarter-round bricks** with notches (slit windows) and **light-grey 1 × 1 / 1 × 2 buttress blocks**; bright-green 4 × 4 round lawn on top. [P] Brackets + 2 × 2 triangular tiles detail the 4 × 4 round corner pieces at the foundation. [S TBB]

### 1.7 Rock and road [S NE, TBB; P `official-21063-ne-rock-parts.jpg`, instr p205, `-tbb-rock-squaretower.jpg`]
- "**Quite a variety of olive green, dark tan and dark bluish grey slopes**", balanced between detail and large slopes. [S NE] Rock is **mostly hollow**, with long bricks for the castle modules to plug into; built in sections interleaved with the castle. [S TBB]
- [P] Construction: a skeleton of dark-grey long bricks/plates; faces of **dark-grey 75° slopes (2 × 1 × 3, 2 × 2 × 3)** as the vertical rock, **dark-tan 65°/45° slopes** as bare earth, **olive-green 45° slopes and 1 × 1/1 × 2 cheese slopes** as grass ledges; **dark-tan 1 × 1 round plates** studs-up as tree sockets; a few light-grey bricks as stone outcrops. Colour logic: grey = cliff, olive = grass, dark tan = soil. Inventory: 87 × olive 3040, 61 × olive 60481, 39 × dark-tan 3678, 30 × dark-tan 3039, 16 × dark-grey 98560 (2 × 2 × 3 75°), 13 × dark-grey 4460.
- **Road**: light-grey; gradient from **1 × 6 slopes (4569)** (NE first wrote 4659, corrected in comments), angles from **1 × 4 hinge plates (1927)**; one hinge plate + jumper tile against a wedge plate. Manicured gardens in **bright green** vs **olive** wild landscape. [S NE, TBB]
- Weak spot named by reviewers: the fortified wall + lawn in front of the gatehouse is plain; the road ends abruptly at the base edge. [S NE, TBB]

### 1.8 Trees [S NE; P `official-21063-ne-trees.jpg`]
- **Deciduous**: reddish-brown 3L bar trunk → **flower stem with 6 stems (19119)** → six **1 × 1 five-petal flowers (24866)**; 58 such stems. Summer: green / dark green; autumn: orange / bright light orange / dark red.
- **Evergreen**: reddish-brown bar trunk + stacked green leafy sprigs ("Plant w/ 3.2 shaft no. 1", 24855). Each tree stands on a white 1 × 2 tile with a bar holder underneath? [P unclear].
- Trees sit only on the slopes — none on the castle terraces except one in the lower courtyard.

---

## 2. LEGOLAND Deutschland (Günzburg) Miniland Neuschwanstein

- In Miniland since **April 2003**; **1:30**; **> 300,000 bricks**; **4.5 m long, 3 m tall**; > 300 kg; **> 400 windows in 30 different shapes**; six model designers, six months; first model produced entirely in Günzburg; Ludwig II's **golden ceremonial carriage** stands in front; an animation shows **Sissi and Ludwig waltzing in the throne room**. [S https://www.legoland.de/en/explore-legoland/the-park/park-areas/miniland/ ; https://legoland.de/en/lp/chronology ; https://www.legoland.de/media/fjtezq5c/04-legoland-deutschland-miniland-2026-english.pdf]
- Photos (Commons, CC BY-SA 4.0 / CC BY 2.0 / CC BY-SA 3.0): `miniland-gt1976-026.jpg`, `miniland-gt1976-154.jpg`, `miniland-gzen92.jpg`, `miniland-bagl8.jpg`, `miniland-flickr-10089273374.jpg`. [P]
  - Walls **off-white / very light cream**, smooth (studs hidden), with **tan/beige trim bands, gable edges and the two-storey balcony**; deep-set windows with dark backs, many arched and paired.
  - **Roofs and cones sand green** (a patina reading; the real slate is grey-blue — Miniland's colour is a choice, not a fact).
  - **Gatehouse bright red** with tan towers and tan stepped gable (`miniland-flickr-10089273374.jpg`).
  - Stair tower = tall round white tower with **two corbelled galleries** and a sand-green cone; square tower with **machicolated (arched-corbel) crown** and a round turret on top.
  - **The rock is a sculpted artificial cliff, not bricks**, with a thin waterfall down it (`miniland-gzen92.jpg` left) — the Pöllat gorge hinted, no Marienbrücke.
  - The Palas wall on one side is **cut open to show the throne room** (`miniland-gt1976-154.jpg`).
  - Golden coach with horses and minifig-size Miniland figures on the gravel path in front (`miniland-gt1976-026.jpg` lower left).
- Other Miniland versions: none found (Windsor / Billund / Florida have no Neuschwanstein that I could find) [M — searched only briefly].

---

## 3. Fan MOCs

### 3.1 Felix Mezei, Neuschwanstein Replica (2019–2022) — largest and most faithful
160 × 63 × 92 cm, **57,640 pcs**, 42 kg, 6,280-page instructions for sale (€174), three modules (Gate, Courtyard, Body), 30 months' work; builder "not a big fan of SNOT", builds walls course by course. [S https://felixmezei.eu/works/the-neuschwanstein-castle/neuschwanstein-replica-by-felix-mezei/ ; https://felixmezei.eu/orders/] Images (© Félix Mezei, reference only): `moc-mezei-overall-1.jpg`, `-overall-3.jpg`, `-gate-1.jpg`, `-details-8.jpg`.
- [P] **White running-bond walls** (1 × 2 / 1 × 4 bricks, studs hidden), **light-bluish-grey shingle roofs made of overlapping rows of tiles/plates** (each row a plate step, joints staggered), dormers of **tan frames with a dark-grey lattice window** under small grey gables; chimneys = **stacked light-grey round elements (bars + round plates / gears)** on a tan stack with a dark band; under the eaves a **tan corbel band of inverted curved pieces** (scalloped).
- Gatehouse: **red** brick, **tan quoins and towers**, **crenellated tan stepped gable**, arched windows with **tan frames + lattice**, coat-of-arms relief over the gate; dark-grey caps on the corner towers.
- Stair tower: tall white round tower with a **tan crenellated gallery** and a very slender dark-grey cone stack; Palas west front with the two-storey tan balcony; knight statue on the gable.
- Ground: green 1 × 2 plates scattered at angles (rough turf), grey rock patches, **wooden fence along the path** (Marienbrücke-side path implied), flagpoles at the entrance.
- Scale lesson: even at 160 cm this is still below minifig scale (minifigs would be too big for the doors) — confirms that compression is unavoidable.

### 3.2 Robert (Bob) Carney, Neuschwanstein #127 (BrickWorld 2010) — minifig-ish, 52,461 pcs
[S http://www.carneycastle.com/Neuschwanstein/index.htm , /palas.htm ; https://www.brothers-brick.com/2010/07/04/neuschwanstein-by-bob-carney/] Brick count stated: white bricks 13,970; other white 9,845; dark grey 8,789; black slopes 3,205; other 16,652; total 52,461. Built Jan–May 2010, started with the tallest tower. Images: `moc-carney-bw3.jpg`, `-detail11.jpg`, `-detail13.jpg`, `-detail14.jpg`.
- [P] **White ashlar from staggered 1 × 2 / 1 × 4 bricks**, **dark-grey plate string courses**; **arched windows with white turned balusters** (1 × 1 round + candlestick-like columns) on dark sills; corbelled bay windows on **inverted-slope brackets**.
- **Stair tower = octagon of hinged white wall panels** (vertical hinge seams visible), a **corbel band of white inverted slopes**, a **dark-grey spindle-fence gallery**, crenellated crown in dark grey, **black cones built from stepped slopes/cones** with a dark-grey bar finial (`-detail11`).
- **Roof = rows of dark-grey/black plates and slopes overlapped like slates**, ridge chimneys of white bricks with dark caps (`-detail14`); winter garden as a trans-clear glazed box with plants.
- Rock: **dark bluish grey bricks stacked into crags** with a few conifers (`-bw3`).

### 3.3 Adolfo (LUG Brasil), minifig-scale Gatehouse (2013)
Flickr "Neuschwanstein Castle - Gatehouse 1–7" and Expo LUG Brasil 2013 shots [S https://www.flickr.com/photos/adolfolugbrasil/8745819755 ; /10915883293]. Images: `moc-adolfo-gatehouse-front.jpg`, `-courtyard.jpg`, `-gate.jpg`. Only the gatehouse; figures parade through the arch (`-gate`).
- [P] **Bright red** walls, **light-bluish-grey** quoins, gate frame and **square** corner towers (not round — a simplification), **stepped crenellated gable**, corbelled crenellations; **light-grey frames round paired arched windows**, black shields between windows; tile-topped courtyard wall. At minifig scale the gatehouse alone is ~ 50 studs wide [P estimate] — the whole castle at this scale would be several metres.

### 3.4 Thilo Schön ("t-brick"), Neuschwanstein (2013) — mid scale, closest larger reference
~70 cm long, 40 cm high; LDD design first, then built; scale chosen so (nearly) all windows fit; king's golden carriage with four white horses on the road; instructions sold. [S https://www.eurobricks.com/forum/forums/topic/84461-moc-castle-neuschwanstein ; Flickr thilo.schoen 48152229341] Built by others from his instructions: samiam391, ~4,300 pcs, **72 × 26 × 42 cm** [S https://www.eurobricks.com/forum/forums/topic/118766-lego-neuschwanstein-castle-moc-4300-pieces/]; Felix Mezei, 4,588 pcs, **76 × 26 × 45 cm**, €1,600, added gatehouse ornaments, knights and lion on the roof, St George relief [S https://felixmezei.eu/works/the-neuschwanstein-castle/neuschwanstein-replica-by-thilo-schon/]. Images: `moc-tbrick-p01.jpg`, `-p02.jpg`, `-p04.jpg`, `-p05.jpg`, `moc-tbrick-render-2019.jpg`, `moc-thilo-mezei-towers-1.jpg`.
- [P] **White walls with 1 × 1 window openings**, light-grey string courses; **dark-bluish-grey roofs** of 45° slopes, ridge in dark grey, **sand-green finials** on every cone; **tan corner turrets** on the Palas gables; **tan stair-tower galleries of stacked plates stepping out (two rings)**, slender dark-grey cones; square tower with crenellated white crown + round turret; gatehouse **bright light orange** with tan towers and gate; **light-grey bastion** ring with buttresses; **white stair flights** in the courtyards; a dark-green tree in the lower courtyard; buttress fins along the Palas base on dark-green turf (no rock; it sits on a flat board, `-p04`).
- Tower close-up (`moc-thilo-mezei-towers-1.jpg`): white 2 × 2 round bricks with small gaps as slit windows; gallery = **tan plates laid out in a rough octagon with 1 × 1 plates as corbel teeth**; **conical roofs = stacked dark-grey cones (2 × 2 × 2 + 1 × 1)** with a bar finial; a smaller turret beside it with its own cone.
- Why it matters: 72 cm × 42 cm is 1.5 × our slot — the closest MOC between 21063 and the minifig-scale giants.

### 3.5 Micro / Architecture-style builds
- **Jonas Kramm (Legopard), "Castle Neuschwanstein"** (Architecture-style, MOCpages contest entry, 2013) [S https://www.flickr.com/photos/legols/9983487394]. `moc-kramm-micro.jpg` [P]: white walls studs-out, **sand-blue / grey roofs**, tall white stair tower of round bricks with a sand-blue cone; **light-grey rock of slopes and wedges on a dark-green base**, bastion = light-grey curved bricks; reddish-brown gatehouse with tan towers; trees from minifig hair pieces and round bricks.
- **BenBuildsLEGO, Micro Neuschwanstein** (2020, render) [S https://www.flickr.com/photos/benbuildslego/49869696448]. `moc-benbuildslego-micro.jpg` [P]: **headlight bricks studs-out as windows** (round holes), grey roofs, tan gear crown on the stair tower, light-grey cone, square tower with inverted-curved-slope corbel and a 2 × 2 round grille brick turret; **masonry-profile bastion**, gatehouse in dark orange/reddish brown with tan towers; autumn trees from round plates, pines from green cones/horns.
- **Geneva Durand, microscale Neuschwanstein** (2024) [S https://www.brothers-brick.com/2024/08/06/hats-off-to-this-microscale-neuschwanstein-castle/ : "many different sizes of cone-shaped elements forming the tower roofs … gears and teacups for the towers", forest from archer hats, ranger hoods, a dinosaur jaw]. `moc-durand-micro.jpg` [P]: dark-grey cones of several sizes, **tan Z20 gears as gallery crowns** (same trick as 21063), white round elements, dark-orange gatehouse.
- **LEGO Ideas**: several submissions (1,824-pc mini, 22 × 14 base, a "castle rock" variant) [S search snippets: ideas.lego.com/projects/776ee056…, 65306bf4…, 79c111e5…]; pages not opened (Ideas blocks scripts).
- **BlueBrixx** sells a Neuschwanstein (clone brand, own moulds) [S mobiflip headline] — not a source for us (rule 1: real LEGO moulds only).

### 3.6 Common vocabulary across builds (my synthesis)
- Every builder at every scale uses **round towers with a gold/tan corbelled gallery ring + a slender dark cone** for the stair tower; gears (21063, Durand, Ben) or stepped plate rings (Thilo, Mezei) for the gallery.
- **White walls + one dark roof colour + tan accents + red/orange gatehouse** is universal; roof colour is the only real disagreement (black, dark grey, light grey, sand green, sand blue).
- **Buttress fins** at the Palas base appear in 21063, Thilo and Mezei — they sell the "castle on a cliff" silhouette.
- **No one built the Marienbrücke or the Pöllat gorge** in LEGO (Miniland hints the gorge in sculpted rock).

---

## 4. Surroundings in LEGO

- **Hohenschwangau Castle** (yellow, neo-Gothic, below Neuschwanstein): no LEGO model found in any search (TBB, Eurobricks, Flickr "lego hohenschwangau" returned only Neuschwanstein). Ours to design. [S searches, 2026-10-05]
- **Alpine houses — 10325 Alpine Lodge** (Icons / Winter Village, 2023, 1,517 pcs, 21 × 22 cm): ground floor of **masonry bricks in light + dark bluish grey** with scattered 1 × 1 round plates; upper floor of **dark-orange interlocking logs from 1 × 1, 1 × 2 and 1 × 4 "bows"** overlapping at the corners; shutters, balcony, flower boxes, snow on roof. [S https://brickset.com/article/100244/review-10325-alpine-lodge] `official-10325-alpine-lodge-15.jpg`, `-19.jpg` [P: logs = rounded curved-slope rows laid sideways, round ends proud at the corners; white lattice windows; dark-brown balcony with turned spindles; dark-red window boxes]. Log technique is exactly what a Bavarian farmhouse / Allgäu chalet needs. (Exact log mould: likely "Slope Curved 1 × N" laid studs-out [M] — check in the 10325 inventory before baking.)
- **Brick 1 × 2 Log 30136** [L] is in 21063 itself (8 tan) — simpler timber texture at small scale.
- **Oktoberfest / maypole / beer garden**: only forum threads (Eurobricks "LEGO Oktoberfest" topic 11893, tags oktoberfest/brewery) and the LEGO Store Munich "Brezelfest" mosaic; no notable maypole MOC found. [S search snippets] A maypole (blue-white spiral pole with guild signs) is ours to design.
- **Horse + carriage**: official **Animal Horse 4493c00** [L] and **Horse Hitching with Hinge 4587** [L]; **wooden spoked wheels 33211 / 33212** [L]. Ludwig's **golden carriage with four white horses** appears in Miniland [S legoland.de] and in Thilo Schön's MOC [S Eurobricks] — a natural life-layer element (Neuschwanstein's road really carries horse-drawn carriages up from Hohenschwangau village [M]).
- **Swans**: **no swan mould in LDraw** (title search: no swan, goose; available birds: seagull 12891, duckling 49661, flamingo 57798, songbird, crow, parrot) [L]. 21063 builds a micro swan from **white rounded 1 × 2 plate (35480) + 1 × 1 cheese slope + cow horn (67258)** as the neck [S NE; P `official-21063-grotto-swan.jpg`]. A minifig-scale brick-built swan (white curved slopes + a bent bar/horn neck + orange beak) is needed for the Alpsee / Schwansee — design it.
- **Waterfall / lake**: no Neuschwanstein-specific LEGO waterfall found. Generic approach [M]: trans-clear / trans-light-blue 1 × 2 tiles and quarter-round tiles stacked studs-out down a grey rock face, white 1 × 1 round plates for foam at the base; lake as trans-light-blue / trans-clear tiles over a dark base (and note the renderer draws trans at 0.62 opacity — CLAUDE.md pipeline trap).
- **Alpine forest**: 21063's two tree recipes (§1.8). Mezei and Kramm use green plates/hair pieces; Durand uses minifig hats and hoods. For minifig-scale firs we already have the `tree(kind)` armature; 21063's stacked leaf-sprig pine is the closest official look at small size.

---

## 5. Gaps (candid)

- **No Marienbrücke, no Pöllat gorge, no Hohenschwangau, no Alpsee in any LEGO build found.** These are ours to design; references must come from photographs of the real places.
- **Designer interview**: only a press-release summary (mobiflip) names Rok Žgalin Kobe; no LEGO designer video/interview read. Brick Fanatics' review pages return empty shells to scripts.
- **Exact parts of a few 21063 details not resolved**: the square-tower turret cap, the gatehouse tower caps, the dark-grey spike finial (element 34078, number absent from LDraw), the evergreen-sprig part (Brickset 24855 vs LDraw title). The CSV and the instruction PDF hold the answer — check the relevant instruction pages (page ranges not mapped yet; use the contact-sheet approach: render all 360 pages as thumbnails and find the section) before baking.
- **LEGO element → LDraw number mapping**: the CSV lists LEGO design numbers; most match LDraw directly (checked ~70 of them, §0), but some moved (e.g. 3040 → 3040b, 4460 → 4460a/b, 3678 → 3678a, 98560 → probably 3684c, 72140 → Brick 4 × 4 Corner Round 48092/2577?, 49750 → 4185a). Verify each when baking.
- **Real proportions** (ridge length, Palas height, stair-tower height, gatehouse width) are not in this file; take them from photos/plans in the country page. Rough [M]: castle ~130–150 m long; stair tower ~65 m; Palas roof ridge ~45–50 m above the courtyard.
- **Colour of the real roofs and gatehouse** should be settled from photographs (rule 11), not from the sets: builders split five ways on the roof.
- **LEGO Ideas, Rebrickable, BrickLink** not opened (bot protection last round); the Ideas mini (1,824 pcs) and any Rebrickable MOCs are unseen.
- Mezei's 6,280-page instructions and Thilo's instructions are paid; not obtained.
- The 21063 instruction PDF (133 MB) was downloaded to the session scratchpad only; it is not committed. Re-download from the LEGO CDN URL in §1 when needed.

---

## 6. Image index

| File | What | Author / source | Licence note |
|---|---|---|---|
| official-21063-front34.jpg | 21063 three-quarter front (autumn) | LEGO via Brickset 122731 | reference only |
| official-21063-box-front.jpg | box front | LEGO via Brickset | reference only |
| official-21063-box-back.jpg | box back: west/Palas side, real-castle photo, dims inset | LEGO via Brickset | reference only |
| official-21063-side-road.jpg | long side with road, buttresses, Palas | LEGO via Brickset | reference only |
| official-21063-top34.jpg | high view: courtyards, roofs, dormers | LEGO via Brickset | reference only |
| official-21063-gatehouse-end.jpg | gatehouse end on: dark red + tan towers, bastion, rock | LEGO via Brickset | reference only |
| official-21063-courtyard-closeup.jpg | upper courtyard, Palas gable, square-tower turret | LEGO via Brickset | reference only |
| official-21063-singershall-interior.jpg | Singers' Hall interior, roof structure | LEGO via Brickset | reference only |
| official-21063-grotto-swan.jpg | grotto + micro swan | LEGO via Brickset | reference only |
| official-21063-seasons.jpg | summer vs autumn trees | LEGO via Brickset | reference only |
| official-21063-scale-person.jpg | scale vs a person | LEGO via Brickset | reference only |
| official-21063-ne-stairtower.jpg | stair tower detached + in place | New Elementary | reference only |
| official-21063-ne-squaretower.jpg | square tower with corbel + gear turret | New Elementary | reference only |
| official-21063-ne-rock-parts.jpg | rock section + the slope vocabulary | New Elementary | reference only |
| official-21063-ne-window-parts.jpg | window solutions (headlight, Technic, prints) | New Elementary | reference only |
| official-21063-ne-gatehouse-bastion.jpg | gatehouse, round tan towers, grey bastion | New Elementary | reference only |
| official-21063-ne-westpalas-balcony.jpg | western Palas, balcony on wedge plates | New Elementary | reference only |
| official-21063-ne-trees.jpg | tree recipes (pine, two deciduous × 2 seasons) | New Elementary | reference only |
| official-21063-ne-road-hinge.jpg | road angles on hinge plates | New Elementary | reference only |
| official-21063-tbb-side.jpg / -tbb-long-side.jpg | long side (two angles) | The Brothers Brick | reference only |
| official-21063-tbb-rock-squaretower.jpg | rock face + square-tower base, stone plinth | The Brothers Brick | reference only |
| official-21063-instr-p205.jpg | instructions: rock section build | LEGO instructions | reference only |
| official-21063-instr-p277.jpg | instructions: Palas roof | LEGO instructions | reference only |
| official-21063-instr-p330/331/333/337.jpg | instructions: stair tower on an axle | LEGO instructions | reference only |
| official-21063-inventory.csv | full parts list (435 lots) | Brickset inventory | data |
| official-10325-alpine-lodge-15.jpg / -19.jpg | Alpine Lodge whole + log/masonry detail | Brickset review 100244 | reference only |
| miniland-gt1976-026.jpg | Miniland, Palas west + artificial rock + carriage | GT1976, Commons | CC BY-SA 4.0 |
| miniland-gt1976-154.jpg | Miniland, open throne room, gatehouse beyond | GT1976, Commons | CC BY-SA 4.0 |
| miniland-gzen92.jpg | Miniland long side, waterfall on rock | Gzen92, Commons | CC BY-SA 4.0 |
| miniland-bagl8.jpg | Miniland, square tower + Palas | Bagl8, Commons | CC BY-SA 3.0 |
| miniland-flickr-10089273374.jpg | Miniland gatehouse (bright red) | Flickr via Commons | CC BY 2.0 |
| moc-mezei-overall-1.jpg / -overall-3.jpg | Mezei replica, two views | Félix Mezei | © reference only |
| moc-mezei-gate-1.jpg | Mezei gatehouse | Félix Mezei | © reference only |
| moc-mezei-details-8.jpg | Mezei shingle roof, dormers, chimney | Félix Mezei | © reference only |
| moc-thilo-mezei-towers-1.jpg | Thilo-design stair tower close-up | Félix Mezei | © reference only |
| moc-carney-bw3.jpg | Carney castle at BrickWorld 2010 | R. Carney | © reference only |
| moc-carney-detail11.jpg | Carney stair-tower top | R. Carney | © reference only |
| moc-carney-detail13.jpg | Carney octagonal tower panels | R. Carney | © reference only |
| moc-carney-detail14.jpg | Carney roof, winter garden, windows | R. Carney | © reference only |
| moc-tbrick-p01/p02/p04/p05.jpg | Thilo Schön MOC, four views | t-brick, Brickshelf | © reference only |
| moc-tbrick-render-2019.jpg | Thilo Schön render | thilo.schoen, Flickr | © reference only |
| moc-adolfo-gatehouse-front/-courtyard/-gate.jpg | minifig-scale gatehouse | Adolfo LUG Brasil, Flickr | © reference only |
| moc-kramm-micro.jpg | Architecture-style micro | Jonas Kramm, Flickr | © reference only |
| moc-benbuildslego-micro.jpg | micro render | BenBuildsLEGO, Flickr | © reference only |
| moc-durand-micro.jpg | microscale with gear crowns | Geneva Durand, Flickr | © reference only |
