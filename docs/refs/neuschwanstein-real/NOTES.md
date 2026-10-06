# Neuschwanstein and surroundings: the real places (research notes, 2026-10-05)

Facts are tagged by source:
- **[S]** stated by a source; the URL is given in the line or in the source list at the end.
- **[P]** read off a photo in this folder (file named). Ratios are pixel measurements from one photo and carry perspective error. Colour hexes are the median of a small sampled patch, so they depend on light, white balance and JPEG processing. Several photos here are shot under a cool (blue) white balance (sky #83B8FC in `ns-marienbruecke-2024.jpg`), so greys read bluer than they are.
- **[M]** memory or general knowledge, not checked against a source this round. Verify before relying on it.

Colour caution: hexes below are measured numbers, not impressions. Twice this round the measured value disagreed with how the photo looked (a carriage tarp that "looks teal" measures light cyan-blue in sun; the gatehouse roof that "looks green" measures blue-grey). Map by the numbers, then check the render against the photo.

LEGO hexes are the ones in `src/core/colors.ts`.

Scale note: at minifig scale 1 stud ≈ 0.35 m. The castle complex is 150 m long and the tallest tower 65 m [S], so it must be compressed hard (roughly 1:10 to 1:15 against minifig scale). The metres are for proportions, not for counting studs.

Main sources:
- [S-deWP] https://de.wikipedia.org/wiki/Schloss_Neuschwanstein
- [S-enWP] https://en.wikipedia.org/wiki/Neuschwanstein_Castle
- [S-Marien] https://de.wikipedia.org/wiki/Marienbrücke_(Neuschwanstein)
- [S-HS] https://de.wikipedia.org/wiki/Schloss_Hohenschwangau, https://en.wikipedia.org/wiki/Hohenschwangau_Castle
- [S-Col] https://de.wikipedia.org/wiki/St._Coloman_(Schwangau)
- [S-Mai] https://de.wikipedia.org/wiki/Maibaum
- [S-Säul] https://de.wikipedia.org/wiki/Säuling
- [S-Forg] https://de.wikipedia.org/wiki/Forggensee
- [S-Alp] https://en.wikipedia.org/wiki/Alpsee

---

## 1. Neuschwanstein Castle (Schloss Neuschwanstein)

### 1.1 Plan and massing

- Several separate buildings strung along **about 150 m** of a cliff ridge (the "Jugend") [S-deWP][S-enWP]. Total floor area almost 6,000 m² [S-deWP]. Built 1869–1886, simplified completion by 1892 [S-enWP]. Elevation about 1,008 m [S-enWP]. Brick core, cased in stone [S-enWP].
- Order from **west to east** (`ns-plan.jpg`, the official plan, letters as on it) [S][P]:
  1. **Palas** (g), the main residential block at the west end, on the highest point of the rock. Stair towers (a, k) on its north and south sides; kitchen (m) and vestibule (f) inside.
  2. **Upper courtyard** (Oberer Hof, h), in front of the Palas's east gable.
  3. **Bower / Kemenate** (l) on the south side of the upper courtyard; **Knights' house / Ritterhaus** (b) on the north side.
  4. **Square tower / Viereckturm** (c) at the north-east corner of the upper court, joined to the gatehouse by a **connecting wing** (Verbindungsbau, d) along the north edge.
  5. **Lower courtyard** (Unterer Hof, i), a step lower, with a broad stair up to the upper court.
  6. **Gatehouse / Torbau** (j) closing the east end, with **round towers at both outer corners** (plan; `ns-from-north.jpg`).
- The **unbuilt keep (Bergfried)**: a **90 m** round tower with a three-aisled chapel in its base was planned for the upper courtyard; it was never built; its outline is marked in the courtyard paving [S-deWP][S-enWP]. There is no "unfinished stub" standing today; the stub is only a ground marking. The brief's "square tower (unfinished stub)" is two different things: the square tower (45 m) is complete; the keep was never begun above ground.
- Rough plan dimensions, scaled off `ns-plan.jpg` with the 150 m overall length [P, ±15 %]:
  - overall N–S depth of the complex ≈ 50–55 m (the plan is long and thin, length : depth ≈ 3 : 1)
  - Palas footprint ≈ 60 × 25 m (the west ~40 % of the length)
  - upper courtyard ≈ 40 m long; lower courtyard ≈ 30 m; gatehouse ≈ 12 m deep × 40 m wide (N–S)
- `ns-helicopter.jpg` (a near-broadside view from the south, slightly above) [P]: over the full length the Palas takes the west **0.44**; the square tower stands at 0.17–0.25 from the east end; the gatehouse is a low block at the far east with a road curling round it.

### 1.2 Heights

| Element | Height | Tag |
|---|---|---|
| North stair tower of the Palas (the tallest, with the needle spire) | **65 m**, "several storeys above the roof" | [S-deWP][S-enWP] |
| Square tower (Viereckturm) | **45 m** | [S-deWP][S-enWP] |
| Planned keep (never built) | 90 m | [S] |
| Palas eaves | ≈ 0.42 × 65 m ≈ **27 m** above the south foot of the wall | [P] `ns-marienbruecke-may.jpg` |
| Palas roof ridge | ≈ 0.6 × 65 m ≈ **40 m** | [P] same photo |
| Throne hall | 20 × 12 m, 13 m high, through the 3rd and 4th floors | [S] |
| Singers' hall | 27 × 10 m | [S] |

No source this round gives the Palas height directly; the two [P] rows are estimates from one photo. The Palas has **five main storeys** above the rock on its south and west faces [M; count windows in `ns-aerial-northwest.jpg`].

### 1.3 Towers and turrets (what you see from Marienbrücke)

From `ns-marienbruecke-may.jpg` / `ns-marienbruecke-2024.jpg`, left to right [P]:
1. **The north stair tower** behind the Palas roof, left of centre: a slender round shaft rising well above the ridge, a **corbelled machicolated gallery ring**, then a **tall needle spire** with a smaller spired turret clinging to its side, topped by a weathervane. Tallest point of the castle.
2. **The south stair tower** in the middle of the Palas south face: a round turret running the full height of the wall, with its own spire reaching about two-thirds of the north tower's height above the ridge.
3. **Corner turrets** (oriels) at the Palas corners and gable ends: small round turrets hung from the wall, each with a steep spire; four or more read in the view.
4. A small round turret with a short spire on the Bower.
5. **The square tower**: a square shaft (with tall pointed blind arches near the top, `ns-tower-closeup.jpg`) carrying a **round drum** with machicolations, a **crenellated parapet** and a **low dark conical roof** with a chimney. Its top sits at about the level of the Palas ridge in the Marienbrücke view.
6. The gatehouse far right, mostly hidden by trees: a crenellated **round corner tower** with a dark cap.

Spires are steep (height ≈ 2.5–3 × base diameter) and often have small gabled lucarnes; they end in finials or weathervanes [P]. No gold on the spire tips is visible in any photo here [P]; finials and statues read dark grey-green (cast metal).

### 1.4 Palas façades

- **West and south faces**: sheer white walls straight up from the rock, with rows of **small round-arched windows, often paired or tripled** (Romanesque Revival), on five storeys [P]. A few balconies; the Palas south face has a **two-storey balcony/oriel** over the centre [P] (`ns-marienbruecke-may.jpg`).
- **West gable**: a steep stepped/straight gable crowned by a **knight statue** [P] (`ns-marienbruecke-2024.jpg`, top-left of the Palas). The east gable on the courtyard side carries a **lion** statue [P] (same photo, right end of the roof).
- The **Throne hall** occupies the west part of the Palas on the 3rd–4th floors [S]; its windows face west over the Alpsee [M]. In `ns-aerial-northwest.jpg` the west end shows a tall bay with stacked arcaded windows [P].
- **Roof**: one big **steep pitched roof** with gables at both ends, a row of **small dormers** along each slope, and white chimneys [P]. Dormer faces are **ochre-gold** (#CFAC82 in sun) [P] (`ns-marienbruecke-2024.jpg`), the one warm accent on the roof.
- **East (courtyard) gable** (`ns-courtyard-winter.jpg`, `ns-upper-courtyard.jpg`, `ns-palas-courtyard-gable-stereo.jpg`, `ns-gatehouse-east.jpg`) [P]:
  - a tall steep triangular gable with arched arcade windows in rows (3-light arcades, a balcony in the middle)
  - two big **painted murals** either side of the balcony: St George and the dragon (left) and the Patrona Bavariae (right) [M for identification]
  - **two round corner turrets** in **warm sandstone** (#C5B59F) with spires, hung on corbels
  - triple arched windows with grey marble colonnettes and leaded glass (`ns-courtyard-winter-2.jpg`, on the gatehouse's yellow court side)
- Windows read as **dark recesses** in the white wall from any distance [P].

### 1.5 The gatehouse (Torbau)

- Exterior walls cased in **red brick**, the courtyard fronts in **yellow limestone** [S-deWP][S-enWP]: "Außenmauern sind mit roten Ziegeln, die Hoffassaden mit gelbem Kalkstein verkleidet."
- `ns-from-north.jpg` (the outer, east face from the approach road) [P]:
  - red brick wall (#895C50 lit, #6C4B44 shade) with **pale limestone dressings**: pilaster strips, quoins, window surrounds, the arched gate portal, a coat of arms panel
  - a **stepped gable** and a **crenellated parapet on corbel arches**
  - a **corbelled round oriel turret** without a roof beside the gable
  - two **round corner towers**, crenellated, with no conical roofs on this side
  - a big round-arched gate with a dark wooden door; iron wall anchors in fleur-de-lis shapes
- From Marienbrücke (`ns-marienbruecke-2024.jpg`, crop at x 1350–1920) [P]: the gatehouse reads **ochre/yellow** (the court side) with a stepped gable, a roof measured **#567586** (blue-grey; it looks greener than the Palas roof but the numbers say slate/zinc; verify), a white crenellated round tower with a black conical cap, and **red brick visible on its east flank**.
- `ns-from-east.jpg`, `ns-november-east.jpg`, `ns-autumn-sun.jpg` [P]: from the east the red gatehouse with its stepped gable sits at the left, the square tower dominates, and a long plain white curtain wall on a battered stone base runs to the Palas.

### 1.6 Rock and setting

- The castle stands on a **steep grey limestone crag** that drops straight into the Pöllat Gorge on the south side; mixed spruce and beech cling to it [P] (`ns-marienbruecke-may.jpg`, `ns-aerial-northwest.jpg`). The masonry base below the Palas and the lower courtyard is a **tall battered retaining wall** in grey stone (#78726F) [P].
- Behind (south-east) rise **Tegelberg** and **Säuling**: Säuling **2,047 m**, Wetterstein limestone, "pyramid-like silhouette" [S-Säul]; Tegelberg 1,881 m [M]. They read as grey rock and dark forest, snow-capped in winter and spring (`ns-saeuling.jpg`, `ns-below-tegelberg.jpg`, `schwansee-tegelberg.jpg`) [P].
- North of the castle the land drops to the flat Füssen plain with **Forggensee** (15.2 km² reservoir, built 1950–54, drawn down 8–15 m in winter so it is half-empty until spring) [S-Forg] and the **Alpsee** below to the west [P].

### 1.7 Proportions usable for scaling

| View | Photo | Measurement [P] |
|---|---|---|
| **Marienbrücke (from the south-east across the gorge)**, the iconic one | `ns-marienbruecke-may.jpg` | Castle silhouette (Palas west wall to gatehouse tower) **W : H ≈ 1.75 : 1** (height = needle tip to the foot of the Palas wall). Including the visible crag below, **≈ 1.3 : 1**. Palas block alone: width ≈ 2 × wall height. Vertical split of the total height: **wall 0.40, roof 0.21, spire above ridge 0.39**. The Palas and its spire occupy the left **45 %** of the silhouette; the square tower stands at **0.67–0.75**; the gatehouse at the far right is low (its tower top at 0.25 of the total height above the Palas foot). |
| **Broadside from the south, above** | `ns-helicopter.jpg` | Length : tallest-tower height **≈ 2.0 : 1**. Palas roof : wall ≈ 0.5. |
| **From the gate (east)** | `ns-from-north.jpg`, `ns-gatehouse-east.jpg` | Gatehouse front is wider than tall (≈ 1.4 : 1 to the top of the stepped gable); the Palas gable looms behind the upper courtyard, roughly twice the gatehouse height [P, rough]. |
| **From the north-west (aerial)** | `ns-aerial-northwest.jpg` | Shows the north side: the 65 m stair tower rises from the north face; the square tower and the gatehouse's red brick show at the east end. |
| **Distant, with mountains** | `ns-saeuling.jpg`, `ns-below-tegelberg.jpg`, `st-coloman-neuschwanstein.jpg` | Castle is a small white block half-way up a dark forested mountainside; it reads by colour contrast, not by detail. |

Compression advice: keep the **Palas spire ≈ 1.5 × Palas ridge height** and **square tower top ≈ Palas ridge**; these two relations are what make the Marienbrücke silhouette recognisable.

### 1.8 Iconic views (ranked)

1. **From Marienbrücke**, looking roughly north across the Pöllat Gorge: Palas on the left with its needle spire, square tower on the right, crag and forest below, the flat plain and Forggensee behind (`ns-marienbruecke-may.jpg`, `ns-marienbruecke-2024.jpg`, `ns-marienbruecke-autumn.jpg`). This is the postcard.
2. **Winter** from the same spot or from below: white castle in snow-covered forest (`ns-winter-classic.jpg`, `ns-winter-marienbruecke.jpg`).
3. **From the valley / St. Coloman**: the castle small against the mountains, with the onion-tower church in the meadow in front (`st-coloman-neuschwanstein.jpg`, `ns-saeuling.jpg`).
4. **Aerial** (Tegelberg / paragliders): the whole elongated plan on the ridge, Alpsee and Forggensee beyond (`ns-aerial-northwest.jpg`, `ns-helicopter.jpg`).

**Signature**: a white Romanesque palace on a sheer rock, a needle-spired round stair tower rising far above a steep dark roof, a square tower with a round crenellated top, and a red-brick gatehouse at the far end.

## 2. Marienbrücke (Mary's Bridge) and the Pöllat Gorge

- Built **1866**, an iron bridge by Heinrich Gerber, erected by cantilevering from rock anchors on both sides without scaffolding [S-Marien]. Restored 1984; 2015–16 (€650,000: anchors, coating, **wooden deck**); anchors replaced 2021–22 [S-Marien].
- **About 90 m above the Pöllat waterfall** [S-Marien]. **About 35 m long** [S, secondary: https://www.wandernundmehr.at/faq/wie-hoch-ist-die-brucke-bei-neuschwanstein].
- Form [P] (`marienbruecke-gorge.jpg`, `marienbruecke.jpg`, `poellat-gorge.jpg`, `marienbruecke-from-castle.jpg`):
  - a straight flat deck spanning between two rock faces
  - **under-deck truss**: a shallow polygonal (fish-belly) truss hanging below the deck, deepest at mid-span, with diagonal bracing; inclined struts at each end run down into the rock
  - **railings**: a lattice of thin diagonal bars (X pattern), about chest high
  - colour: **light grey** painted iron (measured #6E7375 on thin members against the dark wood, so lighter in reality) → **Light Bluish Gray** (Flat Silver as an option)
  - deck: timber planks [S]
- The bridge is always crowded with tourists [P] (`marienbruecke.jpg`): a natural spot for a minifigure taking a photo of the castle.
- **Pöllat Gorge**: a narrow slot with near-vertical **grey limestone walls** (#969998), moss and spruce on ledges; the **waterfall** drops in a narrow white ribbon (#E6E9F3) directly below the bridge [P] (`poellat-gorge.jpg`, `marienbruecke-gorge.jpg`). Fall height is given variously as ~30 m or ~45–50 m in secondary sources [S, inconsistent; treat as unknown]. In `poellat-gorge.jpg` the visible fall is about 0.45 of the bridge height above it [P].
- Lower in the gorge: cascades over pale boulders and fallen logs, clear green-tinged water (`poellat-waterfall.jpg`) [P].
- **Signature**: a thin grey truss bridge high across a vertical grey rock slot with a white waterfall below.

## 3. Hohenschwangau Castle

- Rebuilt 1833–37 in Gothic Revival style for Crown Prince Maximilian (Ludwig's father); the old outer walls and towers kept [S-HS]. "Gelbe Fassadenfarbe" (yellow façade) [S-HS]. Main building with "drei Rundtürme mit polygonalen Aufbauten" (three round towers with polygonal tops); a three-storey gatehouse [S-HS]. More than 90 wall paintings including Lohengrin, the Swan Knight [S-HS].
- Stands on a low wooded hill above the Alpsee, below and about 1 km from Neuschwanstein [S][M for distance].
- From `hohenschwangau-castle.jpg` [P]:
  - a compact block, roughly **as wide as tall** without the towers (≈ 1.2 : 1)
  - **round corner towers** that rise a storey above the main block, each with a **crenellated parapet on corbels** and no roof; a taller central tower carries the flagpole (blue-and-white Bavarian flag)
  - crenellations everywhere: on the towers, the main cornice and the **curtain wall** that rings the hill
  - rectangular windows with Gothic hood mouldings; a central balcony/porch with arches
  - colour: **warm ochre-yellow** (#FCD799 / #E9CE8C sunlit, #C3A478 shade), white window trims
- Seen from the Alpsee (`alpsee-two-castles.jpg`), it is a small yellow block on a green hill, with Neuschwanstein white high on the mountain to the right. Distant measured #C9B08B [P].
- **Signature**: a yellow crenellated block with round towers, all flat-topped, no spires: the exact opposite of Neuschwanstein's white and spiky silhouette.

## 4. Lakes and swans

- **Alpsee**: 88 ha, max. depth 62 m [S-Alp], below Hohenschwangau, ringed by steep forest and rock on the south and west (`alpsee-aerial.jpg`, `alpsee.jpg`, `alpsee-two-castles.jpg`, `alpsee-dusk.jpg`) [P]. Clear water [S]. Colour [P]: from the air deep blue (#18568B), turquoise along the shallow shore; at eye level a calm grey-blue (#537386) with mirror reflections of the forest.
- **Schwansee** (Swan Lake): smaller, shallower, north of Hohenschwangau in a park landscape with reed beds and meadows, Tegelberg behind (`schwansee-tegelberg.jpg`) [P].
- **Forggensee**: bright blue in the plain north of the castle (#4582C1 under a blue sky) [P] (`ns-marienbruecke-2024.jpg`).
- The Lech in Füssen is milky turquoise (#2C867C) [P] (`fuessen-altstadt.jpg`): an Alpine glacier-silt colour, not the Alpsee's.
- **Swans**: mute swans (Cygnus olor) [P] (`swan-mute-adult.jpg`, `swan-mute-lyngby.jpg`; generic, not taken at the Alpsee): pure white, a long S-curved neck, an **orange beak with a black knob** and black face mask; the cygnet is grey. The swan is the emblem of the Schwangau knights and of Ludwig II (the "Swan King"); swan motifs fill both castles, and Lohengrin, the Swan Knight, is painted inside [S-HS][M for "Swan King"].
- LEGO: the swan is White with an Orange beak and Black knob; the official swan mould exists [M: check LDraw]. Two swans on the Alpsee are the cheapest way to say "Schwan-stein".

## 5. Horse-drawn carriages

- Run from Hohenschwangau (in front of Hotel Müller) up to the castle restaurant below Neuschwanstein; about 20 min uphill; the last stretch is on foot [S, secondary: https://www.wandernundmehr.at/faq/was-kostet-eine-kutschfahrt-nach-neuschwanstein].
- Form [P] (`carriage-2.jpg` summer, `carriage.jpg` winter):
  - **two heavy chestnut horses with flaxen (blond) manes and tails** (a cold-blood type; the breed is [M], possibly Black Forest Chestnut or Haflinger-type) in black leather harness with collars; in winter they wear olive-tan blankets (#807155)
  - a **long open wagon with bench seats** for 8–12 people, a dark-wood body (#6F524A), steel wheels with rubber tyres
  - a **teal/blue-green tarpaulin canopy** on hoops over the whole wagon (measured #96D0ED in sun, which is over-bright; #84A0A0 under overcast; visually it reads as a teal-green tarp)
  - newer carriages have an **electric assist drive at the rear** [S, from the Commons file title of `carriage-2.jpg`]
- Not a fairy-tale coach: it is a working people-mover. For the life layer: two chestnut horses (Reddish Brown with Tan manes), a coachman, an open bench wagon in Reddish Brown / Dark Brown with a **Sand Green or Dark Turquoise** canopy.

## 6. Bavarian village elements

### 6.1 Farmhouses in Schwangau (`schwangau-mitteldorf-house.jpg`, `schwangau-farmhouse-cows.jpg`) [P]
- **White rendered** ground and first floor (#FFFFFD), a **dark timber gable floor** with a **wooden balcony** under the eaves (#B17B56 → Medium Nougat), a **wide, low-pitched roof** (≈ 25–30°) with deep overhangs; window shutters in **reddish brown** (#9C4A28 → Dark Orange / Reddish Brown); grey plinth; a picket fence. The house and the barn sit under one long roof.
- Red geraniums on the balconies: typical in summer [M]. None of this round's photos shows them clearly (the Mitteldorf photo is early spring). Verify with a summer photo before using red as an accent.

### 6.2 Lüftlmalerei (painted façades) (`lueftlmalerei-oberammergau.jpg`, `garmisch-ludwigstrasse-houses.jpg`) [P]
- Oberammergau and Garmisch, not Schwangau: whole-façade frescoes of figures and scenes on white render, **trompe-l'œil window frames** in rococo scrolls, and **green shutters** (#5E6F6F → Sand Green or Dark Green). The Garmisch street shows pastel façades (white, salmon, pale blue), carved wrought-iron inn signs and green shutters.
- In LEGO this is a print (L2) job: one or two designs at most.

### 6.3 St. Coloman (`st-coloman-neuschwanstein.jpg`) [P][S-Col]
- A Baroque pilgrimage church (1678, tower 1682) alone in **open meadows** east of Schwangau, famously photographed with Neuschwanstein behind [S-Col].
- Tall white tower with an octagonal upper stage and a **dark onion dome** (#181719 → Black / Dark Bluish Gray) [S-Col][P]. The nave is long, **white**, with tall round-headed windows and a steep **reddish-brown tiled roof** (#573C3B → Reddish Brown). A low white wall encloses the churchyard; a few big trees around it.
- Correction to the brief: it is **white**, not yellow-and-white [P].
- Every October the **Colomansritt** horse procession circles it [S-Col].

### 6.4 Maibaum (maypole) (`maibaum-strasslach.jpg`) [P][S-Mai]
- A stripped conifer trunk painted in a **white-and-blue spiral**, the Bavarian colours; in Bavaria the spiral runs from bottom left to top right [S-Mai]. Measured blue #305A83–#3E6995 [P] → **Bright Blue** or Medium Blue; stripes are about as wide as the white bands.
- **Side arms** carrying painted cut-out **guild figures** (craftsmen, a horse and plough, dancers) in pairs, staggered up the pole [S-Mai][P]. Topped by a **wreath and the green tree tip** [S-Mai]. Heights up to 30–40 m in villages [S-Mai].
- In LEGO: a 1 × 1 round stack alternating White / Bright Blue with clip-and-tile arms; the guild signs are the print candidates.

### 6.5 Beer garden (`biergarten-hirschgarten.jpg`, Munich) [P]
- Long natural-wood **tables and benches** (Bierbank) in rows on **pale gravel** under big shady trees (chestnuts [M]); **blue umbrellas**; litre mugs. A beer garden in Schwangau itself is [M].

### 6.6 Cows (`allgaeu-cow.jpg`, `schwangau-farmhouse-cows.jpg`) [P]
- **Allgäu Brown cattle (Braunvieh)**: a uniform mouse-brown coat (#7E6F58 → **Dark Tan**), paler muzzle, a **bell on a red/leather collar**. Herds graze the meadows right up to the lake shores.
- Not black-and-white Holsteins: they would read as "generic farm".

### 6.7 Füssen (`fuessen-altstadt.jpg`) [P]
- A compact old town of **orange-red tile roofs** (#AF6B59 → Dark Nougat / Dark Orange) and pastel walls on the turquoise Lech, with the High Castle and St. Mang's Abbey above. Useful only as background; not part of the castle scene.

## 7. Nature

- **Spruce and fir** dominate the slopes: very dark green, almost black in shade (#1D1F12), olive-green where lit (#606931) [P] → **Dark Green** (Earth Green) with **Green** highlights.
- **Beech and other broadleaves** mixed in, bright fresh green in May (`ns-marienbruecke-may.jpg`) and **gold-orange in October** (`ns-marienbruecke-autumn.jpg`, `ns-autumn-sun.jpg`) [P]; bare grey-brown in winter.
- **Meadows**: lush yellow-green (#96A017 sunlit, #7F9455 softer light) [P] → **Green** with Olive Green patches; Bright Green for the sunlit valley meadow if the render looks dead.
- **Rock**: grey limestone cliffs, pale where fresh (#969998), darker in shade (#555553) [P] → Light Bluish Gray / Dark Bluish Gray.
- Reed beds (tan-gold) round the Schwansee and the small lakes (`schwangau-farmhouse-cows.jpg`, `schwansee-tegelberg.jpg`) [P] → Tan / Dark Tan.

## 8. Season recommendation

**Late spring / early summer (May–June).** Reasons [P]:
- The **white castle reads best against green** forest (`ns-marienbruecke-may.jpg`): maximum contrast, the shape is crisp.
- In **winter** the white castle sits in white snow under a white sky (`ns-winter-classic.jpg`) and the silhouette dissolves; the iconic winter postcard works through mood and falling snow, which bricks cannot carry.
- **Autumn** is beautiful (`ns-marienbruecke-autumn.jpg`) but turns half the island orange-gold; with Hohenschwangau's yellow and the gatehouse's red it becomes louder than Kyoto (rule 5). A few gold beeches as accents are fine; an autumn island is not.
- Summer also gives the life layer its best props: carriages, cows in the meadow, a maypole, swans on a blue lake, geraniums.
- Optional: keep a little snow on the far peaks (Säuling's top in spring).

---

## Colour summary → LEGO

| Element | Measured [P] | LEGO colour |
|---|---|---|
| Palas / castle walls (white limestone) | sun #E4E0D2, #DAD3C2, #C8C8C6; shade #AAACAE–#BFB4A9 | **White**; Light Bluish Gray for recesses and the stone base |
| Courtyard sandstone turrets, window dressings | #C5B59F, #BFB2A3 | **Tan** (courtyard side only) |
| Main roof (slate) | #2B374D shade, #4D6881 sun (cool white balance) | **Dark Bluish Gray**; Sand Blue only if the render reads dead |
| Turret spires | #5B6774, #545D69, #576262 | **Dark Bluish Gray** (same family as the roof) |
| Dormer faces | #CFAC82 | Tan, or **Pearl Gold** for small accents |
| Square tower cap, round-tower caps | #202126 | Black / Dark Bluish Gray |
| Gatehouse outer walls (red brick) | #976352, #895C50, #6C4B44 | **Dark Nougat** (closest); Light Bluish Gray / White stone dressings |
| Gatehouse court side (yellow limestone) | #A0906D (shade), #C6C3BC | Tan |
| Gatehouse roof | #567586 | Dark Bluish Gray (verify; may be copper) |
| Statues, finials | #585E5F | Dark Bluish Gray |
| Rock and base wall | #78726F, #969998, #555553 | Light Bluish Gray + Dark Bluish Gray |
| Marienbrücke iron | #6E7375 (on thin members, reads lighter) | Light Bluish Gray / Flat Silver; timber deck Reddish Brown / Dark Tan |
| Waterfall | #E6E9F3 | White / Trans-Clear |
| Hohenschwangau | #FCD799, #E9CE8C sun; #C3A478 shade | **Tan** (closest measured); Bright Light Orange if it must read "yellow" from far away |
| Alpsee | #537386 eye level; #18568B from the air | **Sand Blue**; Dark Azure / Trans-Dark Blue for depth |
| Forggensee | #4582C1 | Sand Blue / Medium Blue (background only) |
| Spruce forest | #1D1F12 shade, #606931 sun | **Dark Green** + Green |
| Meadow | #96A017, #7F9455 | **Green** + Olive Green |
| Autumn beech (accent only) | gold-orange | Bright Light Orange / Dark Orange |
| St. Coloman | walls white; onion #181719; roof #573C3B | White; Black onion; Reddish Brown roof |
| Farmhouse | render #FFFFFD; timber #B17B56; shutters #9C4A28 | White; **Medium Nougat**; Dark Orange / Reddish Brown |
| Lüftlmalerei shutters | #5E6F6F | Sand Green / Dark Green |
| Maypole | blue #305A83–#3E6995 + white | Bright Blue (or Medium Blue) + White |
| Braunvieh cow | #7E6F58 | **Dark Tan** |
| Carriage horses | chestnut, flaxen mane | Reddish Brown + Tan |
| Carriage canopy | #84A0A0 (overcast) | Sand Green / Dark Turquoise |
| Swan | white; beak orange, black knob | White, Orange, Black |

## Do not use

- **Disney palette**: Neuschwanstein inspired Sleeping Beauty Castle, and Disney's LEGO castle (71040) uses blue roofs, pink and gold [M]. The real roofs are dark slate grey; **no Dark Blue / Medium Blue / Earth Blue roofs, no gold spire tips, no pink**.
- **Light Bluish Gray walls**: the castle is white, not grey stone; grey makes it read as a medieval fortress.
- **Tan or Light Nougat walls** for Neuschwanstein: that is Hohenschwangau's colour. The two castles must contrast.
- **Bright Light Yellow / Yellow** for Hohenschwangau: far too lemon against the measured ochre.
- **Bright Red / Red** for the gatehouse brick: the brick is a muted salmon-brown.
- **Medium Azure / Dark Turquoise water** for the Alpsee: that is the Lech in Füssen, not the castle lakes.
- **Black-and-white cows**.
- **Sand Green turret roofs**: the measured spires are grey; a copper-green would be a Prague look.

## Official / reference LEGO builds to look up (all [M], not checked this round)

- There is no official LEGO set of Neuschwanstein [M].
- **LEGOLAND Deutschland (Günzburg) Miniland**: a large Neuschwanstein model [M]. The best "how other builders do it" reference; look for photos.
- Rebrickable / Flickr MOCs of Neuschwanstein at micro and minifig scale [M].
- 71040 Disney Castle: use only for spire and turret techniques, never for colours [M].
- 21060 Himeji / 10305 Lion Knights' Castle: rock and cliff techniques [M].

## What this means for the build

- **Keep these relations**:
  - the Palas spire about 1.5 × the Palas ridge height
  - the square tower top level with the Palas ridge
  - the Palas in the west 40–45 % of the length; the red gatehouse low at the east end
  - Marienbrücke silhouette W : H ≈ 1.75 : 1 for the castle alone, ≈ 1.3 : 1 with the crag
  - a sheer drop from the Palas wall into the rock and gorge on the south side
- **Three colour stories that must not blur**: Neuschwanstein white + slate grey; Hohenschwangau ochre (Tan); the gatehouse red-brown brick (Dark Nougat). Everything else is green forest, grey rock and a blue-grey lake.
- **Life layer candidates**: a photographer on the Marienbrücke; a carriage with two chestnut horses on the road up; swans on the Alpsee; a brown cow with a bell in the meadow by St. Coloman; a maypole. Two or three of these, not all (rule 6).
- **Gaps to close before building**: the Palas height (no direct source), the gatehouse roof material (copper or slate?), a summer photo of a Schwangau house with geraniums, Miniland/MOC references, and the swan mould in LDraw.

---

## Photo sources (Wikimedia Commons, 1920 px thumbnails, downloaded 2026-10-05)

`ns-palas-courtyard-gable-stereo.jpg` is a side-by-side stereo pair of the Palas east gable from the upper courtyard (despite "Hohenschwangau" in its Commons title). `alpsee-dusk.jpg` was searched for swans but shows none; it is kept for the lake's mood and reflections.

| File | Commons title | Author | Licence | Source |
|---|---|---|---|---|
| `allgaeu-cow.jpg` | Kuh auf Allgäuer Weide.jpg | CHK46 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Kuh_auf_Allg%C3%A4uer_Weide.jpg |
| `alpsee-aerial.jpg` | Aerial image of the Alpsee (view from the southwest).jpg | Carsten Steger | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Aerial_image_of_the_Alpsee_(view_from_the_southwest).jpg |
| `alpsee-dusk.jpg` | Lake at Hohenschwangau.jpg | William Chizek | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Lake_at_Hohenschwangau.jpg |
| `alpsee-two-castles.jpg` | Alpsee - Hohenschwangau Castle - Alpenrose - Neuschwanstein Castle 01.jpg | Llez | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Alpsee_-_Hohenschwangau_Castle_-_Alpenrose_-_Neuschwanstein_Castle_01.jpg |
| `alpsee.jpg` | Alpsee, Schwangau, Alemania, 2012-10-06, DD 01.jpg | Diego Delso | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Alpsee,_Schwangau,_Alemania,_2012-10-06,_DD_01.jpg |
| `biergarten-hirschgarten.jpg` | München-Nymphenburg Biergarten Hirschgarten Schotten 826.jpg | GFreihalter | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:M%C3%BCnchen-Nymphenburg_Biergarten_Hirschgarten_Schotten_826.jpg |
| `carriage-2.jpg` | Ostallgaeu-Schwangau-Neuschwanstein Horse-drawn carriage with additional electric drive at the rear-01ASD.jpg | Asurnipal | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Ostallgaeu-Schwangau-Neuschwanstein_Horse-drawn_carriage_with_additional_electric_drive_at_the_rear-01ASD.jpg |
| `carriage.jpg` | Neuschwanstein Kutsche.JPG | Benreis | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Neuschwanstein_Kutsche.JPG |
| `fuessen-altstadt.jpg` | Füssen - Altstadt.JPG | C.Stadler/Bwag | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:F%C3%BCssen_-_Altstadt.JPG |
| `garmisch-ludwigstrasse-houses.jpg` | Garmisch-Partenkirchen, die Häuser Ludwigstraße 68 und 70.JPG | Dguendel | CC BY 4.0 | https://commons.wikimedia.org/wiki/File:Garmisch-Partenkirchen,_die_H%C3%A4user_Ludwigstra%C3%9Fe_68_und_70.JPG |
| `hohenschwangau-castle.jpg` | Schloss Hohenschwangau 2021.jpg | Thomas Wolf, www.foto-tw.de | CC BY-SA 3.0 de | https://commons.wikimedia.org/wiki/File:Schloss_Hohenschwangau_2021.jpg |
| `lueftlmalerei-oberammergau.jpg` | Oberammergau Lüftlmalerei Straßenszene.jpg | Andreas Praefcke | CC BY 3.0 | https://commons.wikimedia.org/wiki/File:Oberammergau_L%C3%BCftlmalerei_Stra%C3%9Fenszene.jpg |
| `maibaum-strasslach.jpg` | Bayern - Maibaum in Strasslach.jpg | Fischer.floriana | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Bayern_-_Maibaum_in_Strasslach.jpg |
| `marienbruecke-from-castle.jpg` | BAVIERA. MARIENBRÜCKE desde Neuschwanstein.jpg | Tony Castle | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:BAVIERA._MARIENBR%C3%9CCKE_desde_Neuschwanstein.jpg |
| `marienbruecke-gorge.jpg` | Marienbrücke und Pöllatschlucht - panoramio.jpg | qwesy qwesy | CC BY 3.0 | https://commons.wikimedia.org/wiki/File:Marienbr%C3%BCcke_und_P%C3%B6llatschlucht_-_panoramio.jpg |
| `marienbruecke.jpg` | Marienbrücke (Neuschwanstein).jpg | Wikitarisch | CC BY 4.0 | https://commons.wikimedia.org/wiki/File:Marienbr%C3%BCcke_(Neuschwanstein).jpg |
| `ns-aerial-northwest.jpg` | Aerial image of Neuschwanstein Castle (view from the northwest).jpg | Carsten Steger | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Aerial_image_of_Neuschwanstein_Castle_(view_from_the_northwest).jpg |
| `ns-autumn-sun.jpg` | Schloss Neuschwanstein at autumn sunlight.jpg | Christoph Strässler | CC BY-SA 2.0 | https://commons.wikimedia.org/wiki/File:Schloss_Neuschwanstein_at_autumn_sunlight.jpg |
| `ns-below-tegelberg.jpg` | Neuschwanstein castle below the Tegelberg.jpg | Wilfredor | CC0 | https://commons.wikimedia.org/wiki/File:Neuschwanstein_castle_below_the_Tegelberg.jpg |
| `ns-courtyard-winter-2.jpg` | Neuschwanstein, Schwangau, Alemania, 2015-02-15, DD 37.JPG | Diego Delso | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Neuschwanstein,_Schwangau,_Alemania,_2015-02-15,_DD_37.JPG |
| `ns-courtyard-winter.jpg` | Neuschwanstein, Schwangau, Alemania, 2015-02-15, DD 35.JPG | Diego Delso | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Neuschwanstein,_Schwangau,_Alemania,_2015-02-15,_DD_35.JPG |
| `ns-from-east.jpg` | Neuschwanstein from east 01.JPG | sailko | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Neuschwanstein_from_east_01.JPG |
| `ns-from-north.jpg` | Neuschwanstein from north 00.JPG | sailko | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Neuschwanstein_from_north_00.JPG |
| `ns-gatehouse-east.jpg` | Neuschwanstein Castle as seen from east-gate 20101114 3550.jpg | Pcs34560 from jawp | Public domain | https://commons.wikimedia.org/wiki/File:Neuschwanstein_Castle_as_seen_from_east-gate_20101114_3550.jpg |
| `ns-helicopter.jpg` | Neuschwanstein Castle helicopterflight.jpg | Mario Lang | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Neuschwanstein_Castle_helicopterflight.jpg |
| `ns-marienbruecke-2024.jpg` | Neuschwanstein Castle 2024-02.jpg | Wilfredor | CC0 | https://commons.wikimedia.org/wiki/File:Neuschwanstein_Castle_2024-02.jpg |
| `ns-marienbruecke-autumn.jpg` | Castillo de Neuschwanstein desde Marienbrücke, Füssen, Alemania, 2012-10-06, DD 07.jpg | Diego Delso | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Castillo_de_Neuschwanstein_desde_Marienbr%C3%BCcke,_F%C3%BCssen,_Alemania,_2012-10-06,_DD_07.jpg |
| `ns-marienbruecke-may.jpg` | Neuschwanstein Castle from Marienbrücke, 2011 May.jpg | Ximonic, Simo Räsänen (post-processing) & Tauno Räsänen (photograph) | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Neuschwanstein_Castle_from_Marienbr%C3%BCcke,_2011_May.jpg |
| `ns-november-east.jpg` | Schloss Neuschwanstein im November 2020 (12).jpg | Cmcmcm1 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Schloss_Neuschwanstein_im_November_2020_(12).jpg |
| `ns-palas-courtyard-gable-stereo.jpg` | Hohenschwangau - Schloss Neuschwanstein5-retouched.jpg | Taxiarchos228 | FAL | https://commons.wikimedia.org/wiki/File:Hohenschwangau_-_Schloss_Neuschwanstein5-retouched.jpg |
| `ns-plan.jpg` | Schloss Neuschwanstein - Grundriss der Gesamtanlage.jpg | Unknown author | Public domain | https://commons.wikimedia.org/wiki/File:Schloss_Neuschwanstein_-_Grundriss_der_Gesamtanlage.jpg |
| `ns-saeuling.jpg` | Schloss Neuschwanstein am Fuße des Säulings.jpg | Rolf Kranz | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Schloss_Neuschwanstein_am_Fu%C3%9Fe_des_S%C3%A4ulings.jpg |
| `ns-tower-closeup.jpg` | Tower of Neuschwanstein Castle.jpg | Wilfredor | CC0 | https://commons.wikimedia.org/wiki/File:Tower_of_Neuschwanstein_Castle.jpg |
| `ns-upper-courtyard.jpg` | Oberer Schlosshof Neuschwanstein.jpg | Naturliebhaberin | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Oberer_Schlosshof_Neuschwanstein.jpg |
| `ns-winter-classic.jpg` | Castle Neuschwanstein Winter.jpg | Bstlee | Public domain | https://commons.wikimedia.org/wiki/File:Castle_Neuschwanstein_Winter.jpg |
| `ns-winter-marienbruecke.jpg` | Neuschwanstein, Schwangau, Alemania, 2015-02-15, DD 16.JPG | Diego Delso | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Neuschwanstein,_Schwangau,_Alemania,_2015-02-15,_DD_16.JPG |
| `poellat-gorge.jpg` | Pöllat-Schlucht 2013 Sept 01.jpg | Bonnlander | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:P%C3%B6llat-Schlucht_2013_Sept_01.jpg |
| `poellat-waterfall.jpg` | Pöllat.jpg | Günter Seggebäing | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:P%C3%B6llat.jpg |
| `schwangau-farmhouse-cows.jpg` | Schwangau - Hergratsriedsee mit Weiderindern, Bauernhaus.JPG | Franzfoto | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Schwangau_-_Hergratsriedsee_mit_Weiderindern,_Bauernhaus.JPG |
| `schwangau-mitteldorf-house.jpg` | Schwangau - Mitteldorf Nr 20 v S.JPG | Flodur63 | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Schwangau_-_Mitteldorf_Nr_20_v_S.JPG |
| `schwansee-tegelberg.jpg` | Schwansee mit Tegelberg.jpg | Thomas Gretoire | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Schwansee_mit_Tegelberg.jpg |
| `st-coloman-neuschwanstein.jpg` | St. Coloman (Schwangau) und Neuschwanstein.jpg | Rolf Kranz | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:St._Coloman_(Schwangau)_und_Neuschwanstein.jpg |
| `swan-mute-adult.jpg` | Mute swan (Cygnus olor), adult with chick.jpg | Hobbyfotowiki | CC0 | https://commons.wikimedia.org/wiki/File:Mute_swan_(Cygnus_olor),_adult_with_chick.jpg |
| `swan-mute-lyngby.jpg` | Cygnus olor Adult Lyngby Denmark.jpg | Christian Lylloff | Public domain | https://commons.wikimedia.org/wiki/File:Cygnus_olor_Adult_Lyngby_Denmark.jpg |
