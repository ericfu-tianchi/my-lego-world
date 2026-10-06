# Santa Monica Pier: reference notes
2026-10-04 · research only, no code · images in this folder · [M] = from memory, not verified in a source

## 0. Real pier: proportions to hit

**Files (all Wikimedia Commons unless stated):**
| File | What | Author · licence |
|---|---|---|
| `real-wheel-front.jpg` | Pacific Wheel straight-on from the beach, West Coaster in front, deck rail along the bottom. **Used for measuring.** | Laura Choate · CC BY-SA 3.0 |
| `real-wheel-pier.jpg` | Pier side-on from the south: wheel, coaster, deck on timber pile bents, beach, a lifeguard tower, the bay | John Salatas · CC BY-SA 4.0 |
| `real-wheel-profile.jpg` | Wheel edge-on from below: two rims, gondolas hung between them, octagonal tubs and canopies | Sharon Mollerus · CC BY 2.0 |
| `real-wheel-coaster.jpg` | Wheel with the West Coaster | Ian D. Keating · CC BY 2.0 |
| `real-wheel-night.jpg` | LED show at night | Krigore · CC BY-SA 4.0 |
| `real-entrance-sign.jpg` | The arched entrance sign, close-up | YosemiteYamper · CC BY-SA 4.0 |
| `real-entrance-sign2.jpg` | Entrance sign, wider | APK · CC BY-SA 4.0 |
| `real-66-sign.jpg` | "Santa Monica 66 End of the Trail" sign | Alexis Doine · CC0 |
| `real-hippodrome.jpg` | Looff Hippodrome carousel (interior) | Bruceb Boehner · CC BY-SA 3.0 |
| `real-pier-deck.jpg` | Down the deck: the Hippodrome's exterior (left, "MERRY GO-ROUND"), the 66 sign kiosk, the wheel, the harbor office at the end | Alex Proimos · CC BY 2.0 |

**Method.** I measured pixels on `real-wheel-front.jpg` (a near-straight-on view with the deck rail visible) and calibrated on the published wheel diameter of 85 ft (pacpark.com). That gives 0.0895 ft/px. Check: wheel top ≈ 99 ft above the deck; add a deck ≈ 28 ft above the water (measured on `real-wheel-pier.jpg` at the same scale) and the top is ≈ 127 ft above the water. The park publishes "more than 130 feet above the pier"; the two figures agree within the measuring error if "pier" means the water level.

### 0.1 Pacific Wheel (opened May 2008; solar-powered; pacpark.com)
| Feature | Real | ÷ D (85 ft) | Note |
|---|---|---|---|
| Wheel Ø (rim) | 85 ft / 26 m | 1.00 | published |
| Hub above deck | ≈ 55 ft | 0.65 | measured |
| Rim bottom above deck | ≈ 12 ft | 0.14 | measured; the coaster runs through this gap |
| A-frame leg spread at the deck (front view) | ≈ 50 ft | ≈ 0.6 | measured, legs partly hidden by the coaster |
| Gondola width | ≈ 8 ft | ≈ 0.09 | measured |
| Gondolas | **20** | — | published |
| Rims | **2**, ≈ 0.12 D apart | — | `real-wheel-profile.jpg`: gondolas hang *between* the two rim planes, not outside them |
| Spoke lines visible | ≈ 60 | — | polar scan of the front photo; both rim planes overlap, so ≈ 30 per plane (≈ 1.5 per gondola). Treat as "dense, fine white". |

- **Structure:** white tubular spokes, a white lattice truss around each rim, and a polished-steel outer rim band. The hub carries a round white "PACIFIC PARK" disc (`real-wheel-pier.jpg`); the 2014 photo shows a black LED screen there instead. Two white A-frame legs per side splay down onto the deck.
- **Gondolas:** **octagonal tubs, alternating Red and Yellow** around the wheel, with a darker band at the top edge and a hub-like boss underneath. Each has a flat **octagonal grey canopy on a central pole** (`real-wheel-profile.jpg`), which reads as a small umbrella. They are open sided, with glass panels at waist height.
- **LED rim:** 174,000 LEDs (pacpark.com) across the spokes and rims. By day this does not read at all; by night it is the whole image (`real-wheel-night.jpg`). Our renderer has no night mode for LA, so ignore it.
- **Colours** (photo samples in sun unless noted → nearest LEGO):
  - spokes and legs, white with a blue-sky cast (148,171,189) → **White**;
  - gondolas, red (171,43,47) → **Red**; yellow (visual; 122,104,1 in shade) → **Yellow**;
  - canopies, warm grey → **Light Bluish Gray**;
  - outer rim, steel → **Flat Silver** or Light Bluish Gray.

### 0.2 West Coaster (steel family coaster, 1996 [M])
- A yellow track loops around the base of the wheel and through the gap under the rim. The **supports are brightly coloured tubes**, each column a single colour with a matching cap:
  - red (182,50,41) → **Red**;
  - purple (111,42,92) → **Magenta** / Dark Purple;
  - green (76,171,84) → **Bright Green**;
  - blue (16,129,212) → **Blue** / Dark Azure;
  - track and rails → **Yellow**.
- The coaster's top is ≈ 0.35 D above the deck.
- Together, **white wheel, yellow track, rainbow posts** are the pier's silhouette from the beach. The wheel alone reads as "a Ferris wheel"; the wheel with the coaster reads as "Santa Monica".

### 0.3 Deck and piles
- The deck sits **≈ 28 ft (8.5 m) above the water** at the tide in `real-wheel-pier.jpg`. It is carried on **timber pile bents**: three or four near-vertical round piles per bent, with a cross-cap and X-bracing between some bents. Bents are ≈ 0.28 D apart (≈ 24 ft; 20 ft per [M]).
- The piles are dark creosote: (31,32,33)–(57,56,51) → **Black / Dark Brown**. The deck fascia and edge beam are weathered timber (130,102,78) → **Dark Tan / Medium Nougat / Reddish Brown**. The deck planks are grey-brown (69,74,77 in shade) → **Dark Bluish Gray / Dark Tan** tiles.
- A blue pipe railing runs along the deck edge, with lamp posts carrying banners (`real-pier-deck.jpg`).
- Upstream, a long ramp (the Colorado Ave bridge) runs from the bluff down to the deck, and the entrance sign spans it.

### 0.4 Entrance sign (1941 [M])
- **Form:** an arch made from a broad blue band with a white border, curving up between **two pylons**. On top of the arch sits a separate white crest panel lettered "SANTA MONICA" in blue capitals.
  - The band carries white neon lettering: "YACHT HARBOR", "SPORT FISHING ★ BOATING", with "cafes" in yellow script.
  - Each pylon is blue with **three gold horizontal stripes at the top and three at the bottom**, and three gold vertical bars between them. One pylon is backed by a blue steel lattice.
- **Measured** (`real-entrance-sign.jpg`, slightly oblique): pylon width ≈ 0.2 × clear span; arch rise ≈ 0.35 × span; the crest panel is ≈ 0.45 × span wide.
- **Colours:** blue (13,48,101) → **Dark Blue**; gold stripes (129,94,40 backlit) → **Bright Light Orange** or **Pearl Gold** (it is a mustard yellow); lettering and border → **White**.
- **Lettering culture:** neon tube script on painted metal. The capitals are geometric 1940s sans; "cafes" is a looping script.

### 0.5 "Santa Monica 66 End of the Trail" sign
- A white sign shaped like a stretched shield: a top bar "SANTA MONICA", a circle with **"66"** in the middle, and a bottom bar "End of the Trail". It has black outlines and black sans lettering and stands on a dark grey square post. The white is (≈ 235,235,230) → **White**; the post → **Dark Bluish Gray**.
- It stands mid-deck by a small white kiosk (`real-pier-deck.jpg`). At thumbnail size only the **"66"** would read.

### 0.6 Looff Hippodrome (1916; the carousel is a 1922 Philadelphia Toboggan Co. [M]; National Historic Landmark [M])
- Inside: a carousel with a red-and-cream canopy ringed by bulbs, white and painted horses, and a mirrored centre (`real-hippodrome.jpg`).
- Outside (`real-pier-deck.jpg`, left): a two-storey peach/sand stucco building, sampled (226,173,129) → **Nougat** / Light Nougat. It has rows of **round-arched windows**, a projecting cornice, corner pavilions with hipped roofs, and "MERRY GO-ROUND" lettered on the frieze.
- It stands at the land end of the pier, beside the ramp.

### 0.7 Water and sand
- **Santa Monica Bay** reads hazy grey-blue. Samples: (87,101,117) far out, (84,103,133) near the pier, (75,82,104) under the pier → nearest **Sand Blue** (96,116,161). Dark Blue is too saturated; Dark Bluish Gray is too dead. The surf line is white foam (208,208,208) → **White**. *Mood note:* Eric's brief is "阳光" (sunshine). A sunnier reading such as Medium Azure / Dark Azure would flatter the scene but is not what the bay looks like. **Decide with the Venice notes.**
- **Sand:** sunlit (224,193,167)–(231,201,173) → **Tan**; shaded or overcast (175,160,142) → between Tan and Dark Tan. Wet sand near the water (125,122,128) → **Dark Tan**.

## 1. LEGO Creator Expert 10247 Ferris Wheel (2015), official
URL: https://bricknerd.com/home/bricknerd-reviews-the-lego-creator-ferris-wheel-17-2015 · file `lego-10247-box.jpg`
- 2,464 pieces; ≈ 2 ft tall on a 48 × 48 footprint (Bricknerd). **12 gondolas** in Lime, Yellow and Purple.
- **Wheel:** the spokes are **axles held in 1 × 5 Technic plates with a centre axle hole**, with Trans-Yellow and Orange fins along them (Bricknerd). There are two white rim planes, and the gondolas hang between them on bars. The Sky Blue A-frame trusses are joined with hinge plates.
- **Gondolas:** a 4 × 4 plate with the centre 2 × 2 removed, L-brackets and hinge plates, and 2 × 2 curved slopes for the tub. Each holds 3 minifigs. Each has a small dish canopy.
- Reads well: a true two-plane wheel with gondolas between the rims, which is the real arrangement. Too big for us: Ø ≈ 60+ studs [estimate from the 2 ft height].
- **Lesson:** two rim planes with the gondolas between them; A-frame legs from hinge-angled plates; the gondola as a ring of curved slopes on a cut plate.

## 2. LEGO Creator 3in1 31119 Ferris Wheel (2021), official
URL: https://brickset.com/article/59488/review-31119-ferris-wheel · files `lego-31119-box.jpg`, `lego-31119-wheel.jpg`
- 1,002 pieces; **8 gondolas** in red and green; Yellow spokes; Medium Azure supports; a brick-built "FUN" sun at the hub (Brickset).
- **Lesson:** a big printed or brick-built **hub disc** is how LEGO puts a name on a wheel. It maps onto Pacific Park's white "PACIFIC PARK" disc as an L2 print on a round tile. Eight gondolas is the toy simplification; the real wheel has 20.

## 3. LEGO Creator 3in1 31389 Iconic Ferris Wheel (2026), official
URL: https://news.brickfanatics.com/lego-creator-31389-iconic-ferris-wheel-review · file `lego-31389-box.jpg`
- 916 pieces; 8 gondolas; ≈ 28 × 16 × 25 cm. **Dark Blue** supports, a **white rim with "drum-lacquered silver tiles"**, and a pointed hub instead of a face (Brick Fanatics).
- From the box image: the gondolas are Red and Blue tubs with white canopies, and the rim is White with silver tile accents.
- **Lesson:** the closest official look to the Pacific Wheel: white wheel, two-tone gondolas, steel accents. **Flat Silver tiles on a White rim** is an official precedent for the polished steel outer band.

## 4. LEGOLAND California Miniland San Diego, County Fair wheel (2023), Merlin model shop
URL: https://www.parkjourney.com/industry-news/legoland-california-resort-unveils-the-worlds-first-lego-city-of-san-diego · file `miniland-sd-fair-wheel.jpg`
- **Rim:** a **16-sided polygon**, not a circle. Each side is a straight double chord: two parallel rails in Red with White between them, joined by a zig-zag lattice. Spokes run straight from the hub disc to each vertex.
- **Hub:** a large brick-built yellow disc, ≈ 0.4 D, lettered "San Diego Fair" in red.
- **Gondolas:** 16, round tubs (Yellow with a Red band) with a flat canopy on a short pole, hanging from each vertex.
- **Legs:** a solid Red A-frame of stacked bricks, splayed ≈ 0.6 D at the base, which is the same ratio as the real wheel.
- Scale: Miniland 1:20; Ø ≈ 60+ studs [estimate].
- **Lesson:** at display scale a **polygon of straight chords reads as a wheel** from any normal viewing distance. For us that is the buildable route: a regular N-gon of bars or plates on hinges between hub and rim, where N = the gondola count. One gondola per vertex is the clean rule.

## 5. LEGO Creator 40758 Celebration Series: Ferris Wheel with Fireworks (2025) and LEGO Friends 41689 Magical Ferris Wheel and Slide (2021), official
Files `lego-40758-box.jpg`, `lego-41689-box.jpg`
- **40758** (230 pieces, small scale): a **6-arm white wheel**. Each arm ends in a curved-slope gondola (yellow/green and teal tubs). The hub is a round piece with a printed heart. Six arms is far from the real 20, but it shows how small a readable wheel can be.
- **41689** (545 pieces): a 4-arm purple wheel whose gondolas are 2 × 2 round bricks with dome canopies.
- **Lesson:** below Ø ≈ 16 studs, LEGO drops to 4–6 arms and no rim. **We should not**: the Pacific Wheel is identified by its dense spokes and full rim.

## 6. LEGO Masters USA S1E1 "Let's Get Building" (2020): Aaron Newman & Christian Cowgill, "Spaceland"
URL: https://en.wikipedia.org/wiki/Lego_Masters_(American_TV_series)_season_1 · https://brickshow.com/2020/02/lego-masters-us-episode-1-recap (no image saved)
- An amusement-park challenge. The winning build's centrepiece was a **giant motorised Ferris wheel**, the tallest working structure in the combined park.
- **Lesson:** in the judges' reading, the wheel is the hero of an amusement pier and must be the tallest thing in it. That matches our height-tier rule.

## 7. Roller coasters: 10261 Roller Coaster (2018), 10303 Loop Coaster (2022), official
Files `lego-10261-box.jpg`, `lego-10303-box.jpg`
- Both use the official **roller-coaster track system**, which is in LDraw: straight 4 × 16 `25059`, 4 × 8 `26022`, 4 × 4 `80562`, curve 90° R12 `25061`, ramps `26559`/`26560`/`26561`/`34738`, car base `26021`, wheels `24869`.
- 10261 has red track on a white lattice of stacked Technic and bricks; 10303 has orange track on dark-blue and white towers.
- **Lesson:** the West Coaster can be **real coaster track** in Yellow on single-colour round-brick posts (Red, Magenta, Bright Green, Blue), each post one colour, which is exactly the real support scheme. The R12 curve sets the minimum loop: a 90° turn needs ≈ 12 studs of radius. That is large for our deck (check the footprint before committing).

## 8. Flickr "Lego MOC: Microscale Beach" (2013), user 100637001@N06
URL: https://www.flickr.com/photos/100637001@N06/9565704443 · file `moc-flickr-microscale-beach.jpg`
- A micro beach strip with a resort, carousel, a Ferris wheel of white clips and bars on a grey tower, a lighthouse and a pier, plus palms (small palm leaves on short brown stalks).
- **Lesson:** low quality, but it confirms that the **beach strip + pier + wheel** composition reads as "seaside resort" at a glance. That composition is our island edge.

## Not found / not verified
- **No Santa Monica Pier MOC** on Flickr, The Brothers Brick or Rebrickable, by search. The LEGO Ideas "Los Angeles" contest entry by PositiveCoat057 (2022, includes the pier) returns 403; Rebrickable returns 403 as before.
- LEGOLAND California's **Los Angeles** Miniland section shows Hollywood, the Griffith Observatory and the Chinese Theatre, not the pier (see `../la-griffith`, `../la-hollywood-sign`). The San Diego section (2023) is the nearest Merlin build of a SoCal amusement pier and beach.
- Pacific Plunge (the blue drop tower in `real-wheel-front.jpg`): I think it was removed [M]. **Leave it out.**
- Spoke count is my estimate, not a published figure.

## Borrow / avoid
**Borrow**
- **Two-plane wheel with the gondolas between the rims** (§1, real). One gondola per spoke vertex (§4).
- **Polygon rim.** A regular N-gon of straight members reads as a circle (§4). N = 20 matches the real gondola count, and 20 is a multiple of 4, so the wheel stays symmetric under `hipCorners`-style placement. At Ø 20 studs the vertices are ≈ 3.1 studs apart, so a 2-wide gondola leaves a 1-stud gap. **The real 20 fits only at Ø ≥ 20.** Below that, drop to 16 (the Miniland count) and accept it.
- **Gondolas:** alternating **Red / Yellow** octagonal tubs, each with a **Light Bluish Gray canopy on a pole** (real; §4). A 2 × 2 round brick or a curved-slope ring under a 2 × 2 round plate on a bar is the scale-appropriate mould.
- **White spokes, white A-frames splayed ≈ 0.6 D**; hub ≈ 0.65 D above the deck; rim bottom ≈ 0.14 D above the deck, with the **yellow coaster passing under it**.
- **Hub disc** with a two-word L2 print "PACIFIC PARK" (§2, real). Check it against the lettering rule: 2 words on a round tile. It may only read as a white disc. **Flat Silver tile accents on the White rim** (§3).
- **West Coaster on real track, Yellow, on single-colour posts** (§7).
- **Deck on dark pile bents**, Black / Dark Brown 1 × 1 round columns three to a bent, with a Dark Tan fascia and a blue rail along the edge. Miniland's Coronado boathouse uses the same dark-column trick (`../la-venice/miniland-sd-coronado-palms.jpg`).
- **Entrance sign** as an arch over the ramp: **Dark Blue** band, White border, two pylons with **gold stripes**. Printed L2 crest "SANTA MONICA" on a white curved tile; the band text is not legible at our scale, so the stripes carry it.

**Avoid**
- A 4–8-arm toy wheel with no rim (§5): it loses the dense-spoke identity.
- A wheel without the coaster: it reads as a generic fair.
- Bright-blue tropical water: the bay is grey-blue.
- Any wheel Ø over 0.6 × island width.

**Scale check for the brief.** At strict minifig scale (1 stud ≈ 0.33 m) the wheel would be ≈ 78 studs across, which is impossible. **Compress to Ø 20–24 studs** (≈ 0.3–0.4 × an island 56–80 wide). Ø 24 keeps all 20 gondolas at ≈ 3.8-stud pitch; the hub then sits ≈ 16 studs (≈ 47 plates) above the deck. It should be the tallest element unless the Hollywood Sign's hill outranks it (fix that in the height table).

**For / against including each piece**
- **Wheel: include.** It is the pier.
- **Coaster: include** if the deck footprint allows an R12 loop. Otherwise use a short straight run of real track on coloured posts beside the wheel, without a loop.
- **Pier deck and piles: include.** This is where water meets the island.
- **Entrance sign: include** as a small arch at the land end; cheap and iconic.
- **66 sign:** a single 1 × 2 print reading "66", **optional**; it is an Americana footnote, not the pier's identity.
- **Hippodrome: against**, unless the deck has 8 × 8 studs to spare. Its signature, the carousel, sits inside and would not be visible.
