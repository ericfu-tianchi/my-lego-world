# Pattaya: the real places (research notes, 2026-10-05)

Facts are tagged by source:
- **[W]** English Wikipedia (and Wikipedia-sourced travel pages)
- **[TH]** Thai sources (Thai Wikipedia, Thai press, Pattaya Mail)
- **[OSM]** OpenStreetMap geometry / Nominatim coordinates, measured by me
- **[P]** read off the photos in this folder. Ratios are pixel measurements from one photo and carry perspective error. Colour hexes are the median of a sampled patch ("med"), plus the median of its brightest 30 % ("lit", i.e. the sunlit face); both depend on light, haze and white balance.
- **[M]** from memory, travel blogs or general knowledge, not checked against a primary source this round. Verify before relying on it.

LEGO colours are the ones in `src/core/colors.ts`; "d" is the RGB Euclidean distance from the sampled hex. Distances above ~40 mean "no good match in our palette".

Scale note: at minifig scale 1 stud ≈ 0.35 m. The Sanctuary is 105 m tall = 300 studs, so everything here is compressed hard. Real metres below are for proportions only.

---

## 0. Geography (distances from Nominatim/OSM coordinates, straight line) [OSM]

| Place | Lat, lon | From Sanctuary | From Bali Hai Pier |
|---|---|---|---|
| Sanctuary of Truth (Laem Ratchawet, Naklua) | 12.9728, 100.8890 | — | 5.5 km |
| Lan Pho Naklua market (seafood) | 12.9734, 100.9064 | 1.9 km | 6.6 km |
| Pattaya Beach (midpoint) | 12.9395, 100.8835 | 3.7 km | 2.1 km |
| Walking Street | 12.9274, 100.8746 | 5.3 km | 0.7 km |
| Bali Hai Pier | 12.9277, 100.8679 | 5.5 km | — |
| "Pattaya city" sign (north slope of Pratumnak) | 12.9257, 100.8644 | 5.9 km | 0.45 km |
| Big Buddha, Wat Phra Yai (top of Pratumnak) | 12.9141, 100.8687 | 6.9 km | 1.5 km |
| Thepprasit night market | 12.9084, 100.8930 | 7.2 km | 3.5 km |
| Koh Larn (centre) / Tawaen Beach | 12.9175, 100.7782 | 13.5 km | 9.8 km |
| Pattaya Floating Market | 12.8686, 100.9065 | 11.7 km | 7.8 km |
| Nong Nooch Tropical Garden | 12.7682, 100.9300 | 23.2 km | 19.0 km |

Reading the map, north to south: **Naklua headland with the Sanctuary → Pattaya Bay (Beach Road, a 2.7 km crescent) → Bali Hai Pier + Walking Street at the south end → Pratumnak Hill (sign on its north face, Big Buddha on top) → Jomtien → (inland/south) Floating Market, Nong Nooch.** Koh Larn is 7–7.5 km offshore west [W]. Everything faces west onto the Gulf of Thailand (sunsets over the sea).

Photo proof of the north–south line: `bay-aerial-looking-north.jpg` looks north along Pattaya Beach; the Sanctuary's spire is visible on the horizon above the Dusit headland, with the Laem Chabang port cranes across the water behind it [P].

---

## 1. Sanctuary of Truth (ปราสาทสัจธรรม, Prasat Sut Ja Tum) — THE hero

### Basic facts
- Height of the central spire: **105 m** [W][TH press]. Interior floor area **2,115 m²** [W]. Site 13 ha [W].
- Thai Wikipedia gives the roof as roughly **100 × 100 m in plan and 100 m high** (a round number, probably including the eaves) [TH].
- OSM building footprint: bounding box **74 m E–W × 78 m N–S** [OSM]. The trace is crude (48 nodes): a square core with lobes sticking out on the four diagonals, i.e. corner towers/pavilions, plus the four wings. Treat it as "about square, 75–100 m across", not as an exact plan.
- Started **31 August 1981** by **Lek Viriyaphant** (also built the Ancient City and Erawan Museum near Bangkok) [W][TH]. Still under construction; completion dates quoted range from 2025 to 2050 [W][M] — the honest answer is "never quite finished".
- All wood: Xylia xylocarpa (mai daeng), takhian (main posts, "600-year" wood), panchaat, teak [W]; Thai sources say ~170 hardwood pillars and traditional Thai mortise-and-dowel joinery without metal, except a concrete foundation [TH].
- Province: **Chonburi** (Bang Lamung district, Na Kluea subdistrict). One fetched Thai summary said Chachoengsao — that is wrong.
- It is a museum ("castle"/vihara hybrid), not a working temple. Visitors wear **hard hats** on site [W] — a usable minifig detail.

### Setting and orientation
- It sits on the tip of a small **north-pointing headland** (Laem Ratchawet) [OSM]: sea on the north, east and west sides; Sanctuary Beach on the west flank, Wong Prachan Beach in the bay to the north-east [OSM].
- The land side is the **south**: a large **bare sand plaza** (horse carriages, elephant rides, red-white bunting) between the building and the car park/pavilions [P] (`sanctuary-plaza-cove.jpg`, `sanctuary-front-2016.jpg`, `sanctuary-front-2024.jpg`). So the "front" photos are taken from the plaza looking north, with the sea behind the building. *Inferred from OSM + photos, medium confidence.*
- Sea side: the building stands right behind a **long, low pale seawall** with a crenellated parapet (square merlons, like a battlement) [P] (`sanctuary-sea-side.jpg`, `sanctuary-seawall-pier.jpg`). The seawall runs out as a **jetty to a small red-brown tiered spire pavilion** at its end [P]. Orange-and-white buoy lines float offshore [P].
- Behind/beside it on the land side: a lagoon with Thai-style open pavilions (restaurant, boat trips) and dense trees; the building is often photographed over a hedge of greenery from a raised viewpoint [P][W].
- Which hall faces the sea: sources disagree on the four themes. TAT: "the first hall, overlooking the sea, symbolises the origin of life and the universe"; others: North = heaven/creator, South = earth, East = religion/morality, West = philosophy, and "the western hall facing the Gulf has four seated figures for sun, moon, earth and stars" [M]. Thai sources only say the theme is the "7 origins" (heaven, earth, father, mother, sun, moon, stars) and "4 virtues" [TH]. **Do not build any theme-specific figure group from these; they conflict.**

### Plan and massing [P]
- A **cruciform, four-sided building**: four wings with gabled ends (one per compass side), each ending in a **gopura-like porch** of stacked gables; a square crossing that rises in stepped roofs to the central spire [P][W ("four gopura … face the compass points" — travel sources, M)].
- Each corner has a tower or pavilion with figures from Thai, Khmer, Indian and Chinese traditions [web, M]. Seen in photos: a **four-faced Brahma tower (Bayon-style faces under a tiered cap)** at the left corner of the land façade and in the sea-side views; a lower open pavilion full of grey figures at the right corner [P].
- Wing roofs: long, **three stacked tiers** of sweeping Thai roof (each tier a shorter "skirt" below the one above), eaves slightly upturned, the gable ends crowned by figures instead of plain chofa hooks [P] (`sanctuary-elevated-34-2016.jpg`, `sanctuary-elevated-2009.jpg`).

### Silhouette and ratios
Measured on `sanctuary-sea-side.jpg` (long lens, from the water, little perspective) and checked on `sanctuary-front-2024.jpg` (ground level, from the plaza) [P]:

| Feature | Sea side | Land front 2024 |
|---|---|---|
| Total height (to the tip figure) | 1.00 | 1.00 |
| Main cruciform body width (wing end to wing end) | 0.82 of H (H : W ≈ 1.2) | 0.89 of H (H : W ≈ 1.13) |
| Including the corner Brahma tower | H : W ≈ 0.94 | — |
| Wing eave line | ≈ 0.15 | ≈ 0.12–0.15 |
| Top of the stepped roofs = base of the spire cluster | ≈ 0.55 | ≈ 0.55 |
| Tips of the four sub-spires | ≈ 0.76 | ≈ 0.77 |
| Apex of the front gable porch | — | ≈ 0.57 |
| Corner Brahma tower top | ≈ 0.41 | ≈ 0.42 |
| Brahma faces (centre) | ≈ 0.20 | ≈ 0.20 |

- So: **the building is about as tall as it is wide** (H : W ≈ 1.1–1.2 for the cruciform). The **lower 55 % is a pyramid of stepped, sweeping roofs**; the **upper 45 % is a spire cluster**.
- Front (land) façade, `sanctuary-front-2024.jpg`: the projecting porch is about **0.63 of the body width**, two nested steep gables (outer and inner) with a third mini-gable in front, and behind it **four roof tiers stepping up on each side** [P]. Gable pitch is steep, roughly **50°** from horizontal [P, rough].
- **Spire profile**: not a Khmer prang (no corn-cob) and not a bell chedi. It is a Thai **prasat/yot spire**: a square stack of **5–6 progressively smaller tiered roof modules**, each ringed with small figures, ending in a slender needle with a **figure on a mount at the very tip** [P]. Around it, on the diagonals, **four smaller spires**, each a tapering stack of ~8–10 rings/discs crowned by a standing figure [P]. From any side you see the central spire plus two (front) or three (¾) of the sub-spires.
- From every side the read is the same: **wide sweeping roof pyramid + five-spire crown**, symmetrical about both axes. Backlit (a dawn silhouette I checked but did not keep), it reads as a near-isosceles triangle with a needle on top.

### Decoration [P]
- **Every surface is carved**: deities, apsaras, mythical animals, scrolls; from huge figures (a **multi-headed elephant / Erawan group** near the entrance, `sanctuary-carver-elephants.jpg`) down to finger-size figures [W][P].
- **Gables**: steep, with serrated, flame-like bargeboards (naga/bai raka style) and a **figure group at the apex** (a deity riding or dancing) [P] (`sanctuary-roof-closeup-2024.jpg`). Every eave end and ridge end carries a **leaping figure** rather than the standard Thai chofa hook; from a distance they read as spiky upturned finials [P].
- **Ridges**: rows of small seated/standing figures along the ridges and the spire tiers [P].
- Walls: deep-carved panels between pillars, arched (pointed, lobed) niches, open galleries [P].
- Stair approach: steep, straight flights between carved balustrades, the treads pale (whitish) [P] (`sanctuary-stair-approach.jpg`, lit #FDFDF7).

### Scaffolding — yes, it is part of the look [P]
- Every era of photo shows it: steel tube scaffold towers on the right side with **bright blue tarps** (2016), on the roof with blue and black tarps plus a yellow sheet (2024), scaffold masts on the roofline (2009) [P]. Carvers work on site [W]. A scaffold tower with a blue tarp on one corner is an honest, recognisable detail.

### Colour — the wood is a patchwork of fresh and weathered [P]
The building is continuously re-carved and re-roofed, so its colour changes by year and by patch. **Fresh wood is caramel/mid brown, not blond; weathered wood goes silver-grey.**

| Patch | Photo | med | lit | LEGO (d) |
|---|---|---|---|---|
| Fresh carved porch, lit faces | front-2016 | — | #9C7B61 | **Medium Nougat** (19 lit), Dark Tan 24 |
| Fresh carving, 2024 front | front-2024 | #3B271B | #705748 | shadow → **Dark Brown** 28 / Reddish Brown 31 |
| Fresh roof boards, 2024 | front-2024 | #8C6E5E | #947668 | **Dark Tan** 23, Medium Nougat 30 |
| Freshly carved elephant (close) | carver-elephants | #4C3218 | #917257 | shadow **Reddish Brown** 16; lit Medium Nougat 27 |
| Weathered roof shingles | front-2016 | #959E97 | #B1BBB4 | **Light Bluish Gray** 22 / Sand Green 19 (lit) |
| Weathered roof, elevated view | elevated-34-2016 | #B9C1B1 | #CEE4E5 (haze) | **Sand Green** 26 / Light Aqua 19 |
| Weathered roof, 2024 | roof-closeup-2024 | #AEB1B2 | #CACDCF | **Light Bluish Gray** 21 / Sand Green 19 |
| Weathered spire (2016) | front-2016 | #5D6566 | — | **Dark Bluish Gray** 18 |
| Weathered carving, dark | carving-closeup | #484540 | #726F69 | **Dark Bluish Gray** 6 (lit) |
| Wall depth in shade | elevated-34-2016 | #1E1714 | — | **Dark Brown** 32 / Black 37 |
| 2009 roofs (warm cast, old camera) | elevated-2009 | #C3A3A4 | — | no good match; unreliable white balance |
| Seawall concrete | sea-side | #E3C29F | #F8D9B8 | **Tan** 11, Light Nougat 6 (lit) |
| Seawall merlons | seawall-pier | #A4927B | #DAC9B0 | Dark Tan 19 / Tan 21 |

- In 2016 the front porch was fresh brown and the roofs silver-grey; by 2024 the front roofs and the Brahma tower had been redone in fresh brown, while side roofs stayed grey [P] (compare the two front photos). A model must pick one state; a mix of **brown carved walls/porches + silver-grey roofs** is the most typical across the photo record.
- No gilding or paint anywhere on the building itself [P].

### Builder's summary — Sanctuary
1. Signature: a **wooden pyramid of sweeping, stacked Thai roofs crowned by five spires** (one tall central, four lower on the diagonals), every edge bristling with upturned figure-finials; on a headland with sea behind.
2. Proportions: H ≈ 1.1–1.2 × body width; stepped roofs to 0.55 H, sub-spire tips 0.76 H; cruciform plan, three roof tiers per wing, a projecting stacked-gable porch on each side; a four-faced Brahma tower at a corner reaching 0.42 H.
3. Colours: carved walls/porches **Reddish Brown + Medium Nougat** (Dark Brown in the recesses); roofs **Light Bluish Gray / Sand Green** (weathered) or **Dark Tan** (fresh); spires **Dark Bluish Gray** (weathered) — no gold.
4. Setting: pale **Tan** crenellated seawall in front on the sea side, jetty to a small red-brown spire pavilion; sand plaza on the land side; one blue-tarped scaffold tower is true to life.
5. Misconceptions: it is not a temple, not gold, not uniformly "teak-blond", not finished; the building is roughly square in plan, not a long hall.

---

## 2. Pattaya Bay and the "PATTAYA city" sign on Pratumnak Hill

### The sign [P][TH][W]
- **Exists.** On the **north slope of Pratumnak Hill (Khao Phra Tamnak)**, about **400–450 m SW of Bali Hai Pier** [OSM][web], facing north across the bay, so it is seen from the whole of Pattaya Beach and from boats [P].
- **Exact text: `PATTAYA` + `city`** — seven big capitals, then a separate lowercase word "city" [P]. Not "PATTAYA CITY" in matching capitals.
  - **PATTAYA**: tall, **3-D extruded box letters** (you see their thickness), a plain **geometric sans-serif** (Futura-like), uniform stroke about **0.17–0.18 of the cap height**, pointed A's with a low crossbar, widely spaced [P] (`sign-from-sea-2014.jpg`). Thin lighter lines run along the letter faces: the LED strands (3 per letter) [TH: Pattaya Mail].
  - **city**: **white**, lowercase, a heavy, slightly slanted **rounded script/slab** with a swash tail on the y, mounted on a visible steel frame, set to the right of the final A and slightly higher; it is about **0.19 of the PATTAYA word width** [P].
  - Word ratio: the PATTAYA row is about **8.3 × wider than its cap height** [P].
- **Colour**: the capitals are **red** in sunlight after the 2024–25 repaint (lit **#C7534F**, shade #97221E → **Bright Red**, d 55 med; the lit sample is hazed) [P] (`sign-from-bali-hai-road-2025.jpg`). In older or hazy photos they look salmon/orange (2007 #C3787A; overcast 2014 #A48785) [P], and Pattaya Mail calls them "bright orange" [TH]. → **Bright Red** for the capitals, **White** for "city" (#ECFDFF lit, White d 16).
- The letters stand in a line on a **long steel walkway/platform** cut into the hillside; on the steep slope they step down slightly left-to-right when seen from below [P] (`sign-from-bali-hai-road-2025.jpg`). Above them, a "heart" photo frame and the hilltop viewpoint [web, M].
- **Size**: web sources say "about 3 m" letters [M]. That looks too small: against a ~2 m shed on the walkway the letters are 6–7 × taller, i.e. **~10–15 m** [P, low confidence]. Build it as a big landmark sign, not a garden ornament.
- **Age**: often said to be installed in 2012 [web] — wrong. A dated photo shows it on **3 April 2007** (`sign-2007.jpg`, EXIF) [P]; Pattaya Mail says "over 20 years" [TH].
- **Night**: 18,000 LEDs since the 2024–25 upgrade, colour programmes by weekday; white, green, or Thai-flag colours in photos [TH][P] (`sign-night-2025.jpg`).
- Hill behind: dense dark tropical scrub/forest, **#525C2A – #78824D** in sun (Olive Green 44 / Dark Bluish Gray 36 lit), much darker in haze [P]. A couple of white condo towers stand on the ridge [P]. → **Green / Dark Green** foliage with Olive Green highlights.

### The bay [W][P]
- **Pattaya Beach: about 2.7 km**, a **gentle crescent** facing west, from Pattaya Nuea (north, Dusit headland) to Pattaya Tai (south, Walking Street and Bali Hai Pier) [W]. Pratumnak Hill closes the south end; the Dusit/Naklua headland the north end [W][P] (`bay-aerial-looking-north.jpg`, `bay-from-pratumnak.jpg`).
- The beach was eroded to 2–3 m in places; a 2018–19 replenishment widened it toward 50 m [W]. Today it is a wide, pale beige strip [P].
- **Beach Road** (one-way) runs right behind the beach, Second Road parallel inland [W].
- **Sand**: **#CDBAA3 / #D6C3AC** in sun (`beach-umbrellas-promenade-aerial.jpg`) → **Tan** (d 22–30); greyer #B1977F from far → Dark Tan [P]. Not white.
- **Water**: the bay is **grey-green to grey-blue, not turquoise**: #889C9A / #99ACAA near shore (Light Bluish Gray d 10 lit, Sand Green 18), #758486 mid-bay (**Flat Silver** d 20), #5A7C99 from the hill (**Sand Blue** d 13) [P]. Turquoise belongs to Koh Larn (§4).
- **Promenade** [P] (`beach-umbrellas-promenade-aerial.jpg`):
  - grey paving with a regular **dot/diamond grid pattern**, #A4A5AB → **Light Bluish Gray** (d 4);
  - **red-and-white painted kerbs** along Beach Road;
  - a single **row of tall coconut palms** on the sea side of the walkway, plus a few shade trees;
  - a low wall/step down to the sand;
  - a Thai flag on a tall pole; small shrines; parked songthaews and motorbikes.
  - I could not confirm the "wavy promenade paving" from these photos — it may be another beach or a misremembering [M]. Do not build a wave pattern without a photo.
- **Beach umbrellas**: packed into **dense rectangular blocks** at the back of the beach, each block one colour family (**blue, white, lilac/purple-and-white**), with deck chairs under them, the front half of the beach left open [P]. Close up: navy (#215286 → no good match; Dark Blue 52) with red and white panels [P] (`beach-umbrellas-promenade-aerial.jpg` and the umbrella close-up I saw but did not keep).
- **Yellow buoy lines** mark swimming boxes off the beach; jet-skis run outside them [P] (`bay-aerial-looking-north.jpg`, `beach-umbrellas-promenade-aerial.jpg`).
- **Boats**: dozens of speedboats and longtails moored in the bay [P]; **parasailing** — a rainbow-striped canopy towed by a speedboat (`parasailing.jpg`) [P].
- **Bali Hai Pier** (south end): a long concrete pier, the departure point for Koh Larn ferries [W]. The ferries are wooden, **turquoise-green hulls** (#3B835A → Green/Bright Green d 36) with **orange-red upper decks** (#EB5E35 → Orange d 56, Bright Red), tyres hung as fenders, a Thai flag on the bow [P] (`ferries-bali-hai-pier.jpg`).
- **Skyline**: high-rise condo slabs and towers all along the bay; the tallest group is at the north end (Naklua/Wong Amat) and on Pratumnak (Waterfront Suites tower next to the sign) [P].

### Builder's summary — bay and sign
1. Signature: **red geometric capitals "PATTAYA" + a white script "city"** on a green hillside above the south end of a palm-lined crescent bay full of boats.
2. Proportions: sign word ≈ 8 : 1, "city" ≈ 1/5 of the word width, set higher; bay = gentle crescent, beach about 1/20 as wide as it is long in reality (widen it for the model).
3. Colours: sign **Bright Red + White**; hill **Green/Dark Green/Olive Green**; sand **Tan**; water **Sand Blue / Flat Silver / Light Bluish Gray** (grey-green, not azure); promenade **Light Bluish Gray** with **red/white** kerb tiles; umbrellas blue/white/lilac blocks.
4. Lettering for L2 prints: the capitals are a plain geometric sans in 3-D — the one place where a clean UI-like sans is *correct*; "city" needs a heavy rounded script.
5. Misconceptions: not white letters, not "PATTAYA CITY" in matching caps, not built in 2012, not 3 m tall; the bay is not turquoise.

---

## 3. Seafood and street food

- **Lan Pho Naklua** (ลานโพธิ์นาเกลือ): a waterfront market in the old Naklua fishing village, **1.9 km from the Sanctuary** [OSM]; known for fresh and dried seafood and grilled fish [M].
- **Thepprasit night market**: weekend night market south of Pratumnak, 3.5 km from Bali Hai [OSM][M].
- What a stall looks like (`food-grill-skewers-stall.jpg`, `food-plastic-stools-street.jpg`, `food-seafood-market-tarps.jpg`) [P]:
  - a **charcoal grill**: a steel trough with a wire mesh;
  - in front of it, a **display tray of raw skewers** (prawns, squid, octopus, sausage) laid on green leaves;
  - **whole prawns grilled in rows** on the mesh;
  - the vendor in an **orange apron** (#F46D28 → **Orange** d 35);
  - a hand-painted sign in Thai script, white on orange/red;
  - fish markets: steel tables with **fish on ice**, colourful plastic tubs, under **blue tarp canopies** (#1936BD → **Blue** d 40) or striped market tents.
- Seating: **red plastic stools** (#A52529, lit #CB302E → **Bright Red** d 43–49) and folding **steel-top tables** on the pavement [P]; the food cart is a steel cart on bicycle/motorbike wheels with a glass case and a gas burner [P][M].
- **Builder's summary**: one grill stall = charcoal grill + skewer tray + vendor in orange apron + 2–3 red stools + a steel table, under a blue tarp or a beach umbrella; prawns as orange/coral pieces in a row. Colours: Flat Silver/Dark Bluish Gray grill, **Orange** apron, **Bright Red** stools, **Blue** tarp, **White** ice.

---

## 4. Koh Larn and snorkelling

- **Koh Larn**: 4.65 × 2.15 km, 5.6 km², highest point 180 m, **7–7.5 km** off Pattaya; eight beaches mostly on the west side; **Tawaen** is the main one with a harbour [W]. Ferries from Bali Hai take about 45 min; speedboats about 15 min [M].
- Look (`koh-larn-aerial.jpg`, saturated drone image — the colours are pushed) [P]:
  - green hills with white-sand coves;
  - the water steps from **turquoise shallows** (#239F95, lit #40C5B0 → **Medium Azure** d 29, Dark Turquoise 39)
  - to **deep blue** (#055780 → Dark Turquoise 48 / Dark Blue 46).
  - A less processed shore photo I sampled but did not keep reads pale aqua: #A7D0D3 → **Light Aqua** d 24 [P].
  - Sand **#E9C29C → Tan** (d 12).
- Snorkel trips: a speedboat to a reef or pontoon; orange life jackets; masks and snorkels [M]. Reefs near Pattaya are modest (coral rubble, small heads) [M]. No CC photo of the snorkelling found this round.
- **Builder's summary**: signature = a speedboat over turquoise water with orange-life-jacketed snorkellers; colours **Medium Azure / Light Aqua** water (only here, never in the main bay), **Tan** sand, **Orange** life jackets, a **White** speedboat.

---

## 5. Pattaya Floating Market (ตลาดน้ำ 4 ภาค, "Four Regions")

- **Opened 1 Nov 2008**, about **109,000 m²** (27 acres), on an artificial lake; four zones for the four regions of Thailand [W]. It is a **modern tourist attraction**, not a historic market. A large fire hit it (Pattaya Mail report "terrifying inferno"; date not checked) [TH, M].
- Look [P] (`floating-market-stilt-houses.jpg`, `floating-market-boat-vendor.jpg`):
  - **wooden houses on stilts** over the water, joined by plank walkways and arched bridges;
  - **steep Thai roofs**, hipped or gabled, in weathered brown-grey wood/shingle (#86786D → **Dark Tan** d 24) or grey sheet;
  - tall stilt legs exposed.
- **Water**: murky brown-grey, #7F807C → **Flat Silver** (d 17), green in algae patches [P].
- **Boats**: narrow dark-wood sampans (Black/Dark Brown) loaded with flowers and fruit, a woman paddling under a wide **straw or white ngob-style hat** [P].
- **Builder's summary**: signature = a vendor in a wide hat paddling a dark sampan full of fruit beside a stilt house. Colours: **Dark Tan / Medium Nougat** wood, **Reddish Brown** roofs, **Flat Silver** water, **Tan** hat. A smaller cousin of Kyoto's lane — consider only if Sanctuary + bay leave room.

---

## 6. Nong Nooch Tropical Garden

- 2.0 km² (500 acres), opened 1980 by Nongnooch Tansacha [W]. Features [W]:
  - **French gardens** (1998);
  - a **Stonehenge replica** (2000);
  - **Dinosaur Valley** (180+ replicas, 2017);
  - elephant and Thai cultural shows;
  - a cycad gene bank.
  - It is 23 km from the Sanctuary.
- The one image everyone has: the view over the **clipped topiary parterres** — cone and spiral shrubs, low hedges in geometric beds — with rows of **white chedi-like ornaments** and red-roofed Thai pavilions [P] (`nong-nooch-french-garden.jpg`). Topiary #536B30 → **Green / Olive Green** lit; ornaments **White**.
- **Builder's summary**: a few cone topiaries and a white mini-chedi say "Nong Nooch" only to people who have been. Low recognition outside Thailand; a candidate for cutting.

---

## 7. Other candidates

- **Big Buddha, Wat Phra Yai** on top of Pratumnak: an **18 m golden seated Buddha** (1977) with seven smaller Buddhas for the days of the week [W]. Gold lit #DEC76C, med #7F6B39 → **Pearl Gold** (d 49 med; the lit face reads lighter, like Bright Light Orange); a red-and-gold stepped plinth (#9B2414 → **Dark Red/Bright Red**) [P] (`big-buddha-wat-phra-yai.jpg`). It sits 1.5 km from the sign on the same hill. A strong, simple, gold silhouette; it could crown Pratumnak behind the sign.
- **Songthaew ("baht bus")**: a pickup with a roofed rear bed, two bench seats along the sides, and a passenger step at the back [W][P]. Colours vary by era and route [P]:
  - 2010s photos show **dark navy** (#1C2544 → near Black/Dark Blue; `songthaew-beach-road.jpg`);
  - some light blue (#307BB3 → Medium Blue / Medium Azure) and black ones;
  - "blue taxis" is the local nickname [W].
  - → **Dark Blue** body with a **White/Light Bluish Gray** roof frame.
- **Tuk-tuk**: in Pattaya mostly a tourist novelty. Seen: painted **blue** (#16298C → Blue/Dark Blue) with chrome [P, photo not kept]. Weaker "Pattaya" signal than the songthaew.
- **Walking Street**: a neon canyon at night. The gate is a simple overhead sign [P, not kept]. At minifig scale it is only readable at night; skip unless night mode.
- **Spirit house (san phra phum)** [P][M] (`spirit-house.jpg`, a photo from elsewhere in Thailand):
  - a miniature gilded Thai temple on a single post or pedestal, on a white/cream base (#DFD9D5 lit → White/Light Bluish Gray);
  - gold/mustard trim (#BA9756 → Nougat/Pearl Gold) and red;
  - offerings: marigold garlands, bottles of red soda, little figurines.
  - Every hotel and shop has one, so it is the cheapest "Thailand" signal in the life layer.
- **Plants** [P][M]:
  - **coconut palms** line the beach (tall, curved trunks, crowns of long fronds);
  - frangipani (white/yellow flowers), bougainvillea (magenta) and banyan/shade trees elsewhere.
  - → palms + one Magenta bougainvillea.
- **Thai flag** (5 horizontal stripes, red-white-blue-white-red, the blue twice as tall) [M, well-known]: on Beach Road poles, on the bow of every ferry, at the sign at night [P].

---

## Colour summary → LEGO

| Element | Sampled | LEGO |
|---|---|---|
| Sanctuary fresh carved wood (lit) | #9C7B61 / #947668 | **Medium Nougat**, **Dark Tan** |
| Sanctuary carving in shade | #3B271B / #4C3218 | **Reddish Brown**, **Dark Brown** |
| Sanctuary weathered roofs | #959E97 – #AEB1B2 | **Light Bluish Gray**, **Sand Green** |
| Sanctuary weathered spires/carving | #5D6566 / #726F69 | **Dark Bluish Gray** |
| Sanctuary seawall | #E3C29F | **Tan** |
| Sign capitals | #C7534F lit / #97221E shade | **Bright Red** |
| Sign "city" | #ECFDFF | **White** |
| Pratumnak hill scrub | #525C2A / #78824D | **Green**, **Olive Green**, Dark Green |
| Pattaya beach sand | #CDBAA3 / #D6C3AC | **Tan** |
| Pattaya bay water | #889C9A, #758486, #5A7C99 | **Sand Blue**, **Flat Silver**, Light Bluish Gray |
| Koh Larn shallows / deep | #40C5B0 / #055780 | **Medium Azure**, **Light Aqua** / Dark Turquoise |
| Promenade paving | #A4A5AB | **Light Bluish Gray** |
| Ferry hull / upper deck | #3B835A / #EB5E35 | **Green / Bright Green** / **Orange** |
| Food-stall stools / apron / tarp | #A52529 / #F46D28 / #1936BD | **Bright Red** / **Orange** / **Blue** |
| Big Buddha gold | #7F6B39 – #DEC76C | **Pearl Gold** |
| Floating-market water | #7F807C | **Flat Silver** |

The palette has no true navy for the songthaew or the umbrellas (Dark Blue #0A3463 is the nearest) and no Pearl Dark Gray. If a weathered-silver Sanctuary is chosen, Light Bluish Gray + Sand Green is enough.

## What this means for the build

- The **Sanctuary carries the island**. Its identity is the roof pyramid plus the five-spire crown, both symmetrical; the corner Brahma tower, the figure finials on every eave and the crenellated seawall come next. Keep H : W ≈ 1.15, the roof pyramid to 0.55 H and the sub-spires at 0.76 H. Compressing the height is fine; losing the four sub-spires or the stepped roofs is not.
- **Decision for Eric (colour state)**: (a) the typical mix — brown carved walls and porches, silver-grey roofs (Reddish Brown / Medium Nougat + Light Bluish Gray / Sand Green); (b) the 2024 "fresh" look, almost all brown (Medium Nougat / Dark Tan), less contrast; (c) all weathered grey. Recommendation: **(a)**. It is what most photos show, and the roof/wall contrast makes the tiers readable at brick scale.
- The **sign** is the second icon: red geometric capitals + white script "city" on a green slope at the south end of the bay, with Bali Hai Pier and ferries below it. The real geography puts the Sanctuary (north tip) and the sign (south end) 6 km apart at opposite ends of the bay, which suits a crescent-shaped island: hero on one horn, sign hill on the other, beach and promenade along the curve.
- Life layer candidates, ranked by how strongly each says "Pattaya":
  1. songthaew on Beach Road
  2. seafood grill stall with red stools
  3. beach umbrella block + palms
  4. parasail / jet-ski
  5. spirit house
  6. Koh Larn snorkel boat
  7. floating-market sampan
  8. Nong Nooch topiary

  Big Buddha is a possible third landmark on the sign hill.

---

## Photo sources (Wikimedia Commons, 1280 px thumbnails, downloaded 2026-10-05)

| File | Commons title | Author | Licence | Source |
|---|---|---|---|---|
| `sanctuary-front-2016.jpg` | Sanctuary of Truth 2016-02-19-01.jpg | Rolf Heinrich, Köln | CC BY 3.0 | https://commons.wikimedia.org/wiki/File:Sanctuary_of_Truth_2016-02-19-01.jpg |
| `sanctuary-front-2024.jpg` | The Sanctuary of Truth, Pattaya, Thailand (54151119640).jpg | Mustang Joe | CC0 | https://commons.wikimedia.org/wiki/File:The_Sanctuary_of_Truth,_Pattaya,_Thailand_(54151119640).jpg |
| `sanctuary-sea-side.jpg` | The Sanctuary of Truth (51870146207).jpg | Radek Kucharski from Warsaw, Poland | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:The_Sanctuary_of_Truth_(51870146207).jpg |
| `sanctuary-seawall-pier.jpg` | 20190403 1249112 TZ41 Sanctuary of Truth.jpg | Joachim Lutz | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:20190403_1249112_TZ41_Sanctuary_of_Truth.jpg |
| `sanctuary-elevated-34-2016.jpg` | Sanctuary of Truth 2016-02-19-02.jpg | Rolf Heinrich, Köln | CC BY 3.0 | https://commons.wikimedia.org/wiki/File:Sanctuary_of_Truth_2016-02-19-02.jpg |
| `sanctuary-elevated-2009.jpg` | Santuaryoftruth2.jpg | Marlinjuice at English Wikipedia | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Santuaryoftruth2.jpg |
| `sanctuary-34-scaffold-2024.jpg` | Sanctuary of Truth 20240916-1.jpg | Suicasmo | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Sanctuary_of_Truth_20240916-1.jpg |
| `sanctuary-roof-closeup-2024.jpg` | Sanctuary of Truth 20240916-2.jpg | Suicasmo | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Sanctuary_of_Truth_20240916-2.jpg |
| `sanctuary-carving-closeup.jpg` | Sanctuary of Truth 2016-02-19-03.jpg | Rolf Heinrich, Köln | CC BY 3.0 | https://commons.wikimedia.org/wiki/File:Sanctuary_of_Truth_2016-02-19-03.jpg |
| `sanctuary-carver-elephants.jpg` | Working on The Sanctuary of Truth, Pattaya, Thailand (54152800095).jpg | Mustang Joe | CC0 | https://commons.wikimedia.org/wiki/File:Working_on_The_Sanctuary_of_Truth,_Pattaya,_Thailand_(54152800095).jpg |
| `sanctuary-stair-approach.jpg` | Sanctuary of Truth 1.jpg | zhaffsky | CC BY-SA 2.0 | https://commons.wikimedia.org/wiki/File:Sanctuary_of_Truth_1.jpg |
| `sanctuary-plaza-cove.jpg` | 20190403 130719 W.jpg | Joachim Lutz | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:20190403_130719_W.jpg |
| `sign-from-bali-hai-road-2025.jpg` | Pattaya City Sign (20250408130310).jpg | MikSed | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Pattaya_City_Sign_(20250408130310).jpg |
| `sign-from-sea-2014.jpg` | Pattaya City Sign at Pattaya Beach.jpg | SquidHomme | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Pattaya_City_Sign_at_Pattaya_Beach.jpg |
| `sign-2007.jpg` | Pattaya City Sign.jpg | TrapperFrank | CC BY 2.5 | https://commons.wikimedia.org/wiki/File:Pattaya_City_Sign.jpg |
| `sign-over-bay-boats.jpg` | Waterfront Suites and Residence and Pattaya City sign.jpg | Arthur Taksin | CC BY 4.0 | https://commons.wikimedia.org/wiki/File:Waterfront_Suites_and_Residence_and_Pattaya_City_sign.jpg |
| `sign-night-2025.jpg` | Pattaya City Sign (20250331211956).jpg | MikSed | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Pattaya_City_Sign_(20250331211956).jpg |
| `bay-aerial-looking-north.jpg` | DZ6 0639 A wide aerial view of a bustling beachfront … calm bay.jpg | PattayaPatrol | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:DZ6_0639_A_wide_aerial_view_of_a_bustling_beachfront_lined_with_high-rise_hotels_and_palm_trees_gentle_waves_lapping_the_sandy_shore_as_boats_dot_the_calm_bay.jpg |
| `beach-umbrellas-promenade-aerial.jpg` | DZ6 0614 Sunny beachfront scene with palm-lined promenade … shoreline.jpg | PattayaPatrol | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:DZ6_0614_Sunny_beachfront_scene_with_palm-lined_promenade_rows_of_beach_umbrellas_and_jet_skis_cruising_along_the_shoreline.jpg |
| `bay-from-pratumnak.jpg` | Pattaya. Beach road view from hill.JPG | RussianSpy | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Pattaya._Beach_road_view_from_hill.JPG |
| `beach-road-seawall.jpg` | Pattaya Beach, Beach Road, Thailand.jpg | Vyacheslav Argenberg | CC BY 4.0 | https://commons.wikimedia.org/wiki/File:Pattaya_Beach,_Beach_Road,_Thailand.jpg |
| `ferries-bali-hai-pier.jpg` | PATTAYA PIER THAILAND JAN 2012 (6984729685).jpg | calflier001 | CC BY-SA 2.0 | https://commons.wikimedia.org/wiki/File:PATTAYA_PIER_THAILAND_JAN_2012_(6984729685).jpg |
| `parasailing.jpg` | Parasailing near Pattaya Thailand (3179812801).jpg | SeaDave from Fairlie, Scotland | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:Parasailing_near_Pattaya_Thailand_(3179812801).jpg |
| `food-grill-skewers-stall.jpg` | DSC 9432 A busy night market vendor grills skewered seafood … cooked.jpg | PattayaPatrol | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:DSC_9432_A_busy_night_market_vendor_grills_skewered_seafood_and_meats_as_colorful_rows_of_fresh_skewers_wait_to_be_cooked.jpg |
| `food-plastic-stools-street.jpg` | DZ3 0955 Night market scene in Pattaya street food stalls plastic stools … shop signs.jpg | PattayaPatrol | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:DZ3_0955_Night_market_scene_in_Pattaya_street_food_stalls_plastic_stools_and_tables_lining_the_sidewalk_as_motorbikes_and_cars_pass_by_under_bright_shop_signs.jpg |
| `food-seafood-market-tarps.jpg` | DFC 1789 Night market fish stalls lit under tarps … customers.jpg | PattayaPatrol | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:DFC_1789_Night_market_fish_stalls_lit_under_tarps_as_vendors_arrange_fresh_seafood_and_chat_with_customers.jpg |
| `koh-larn-aerial.jpg` | Koh larn 2022.jpg | Ambralina | CC0 | https://commons.wikimedia.org/wiki/File:Koh_larn_2022.jpg |
| `floating-market-boat-vendor.jpg` | Floating Market Pattaya Thailand.jpg | Yulem | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Floating_Market_Pattaya_Thailand.jpg |
| `floating-market-stilt-houses.jpg` | Pattaya Floating Market.JPG | Horiuchi | Public domain | https://commons.wikimedia.org/wiki/File:Pattaya_Floating_Market.JPG |
| `nong-nooch-french-garden.jpg` | Nong Nooch French garden 1.JPG | Aleksasfi | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Nong_Nooch_French_garden_1.JPG |
| `big-buddha-wat-phra-yai.jpg` | Wat Khao Phra Yai (Pattaya) 04.JPG | Ruslik0 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Wat_Khao_Phra_Yai_(Pattaya)_04.JPG |
| `songthaew-beach-road.jpg` | Songthaews on Beach Road Pattaya.jpg | Ilya Plekhanov | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Songthaews_on_Beach_Road_Pattaya.jpg |
| `spirit-house.jpg` | Thai spirit houses duo.jpg | Chainwit. | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Thai_spirit_houses_duo.jpg |

Text sources: en.wikipedia.org (Sanctuary of Truth, Khao Phra Tamnak, Pattaya, Ko Lan, Nong Nooch Tropical Botanical Garden, Pattaya floating market); th.wikipedia.org (ปราสาทสัจธรรม); tatnews.org (2015, "The Sanctuary of Truth"); pattayamail.com (sign upgrade articles, 2024–25); nashaplaneta.net (sign guide, unreliable on dates); pptvhd36.com; OpenStreetMap (building way 223698118, coastline, Nominatim).
