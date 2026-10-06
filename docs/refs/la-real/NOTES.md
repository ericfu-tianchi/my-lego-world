# Los Angeles: the real place (research notes, 2026-10-04)

Facts are tagged by source:
- **[W]** English Wikipedia (Hollywood Sign, Griffith Observatory, Santa Monica Pier, Venice Beach Boardwalk, TCL Chinese Theatre, Washingtonia robusta, Jacaranda mimosifolia, June Gloom)
- **[S]** a web search snippet (city / tourism pages), weaker than [W]
- **[P]** read off or sampled from the photos in this folder (median RGB of a hand-picked region, nearest LDraw colour by weighted RGB distance)
- **[C]** computed (great-circle bearing and distance from the coordinates below)
- **[M]** from memory or general knowledge, not checked against a source this round. Verify before relying on it.

Eric's brief (usa.md §1.0): sun, beach, palms, a free, sporty, outdoor life by the sea; must carry the Hollywood Sign, Santa Monica Pier and the beach. Everything below is filtered through that.

---

## 1. Geography for the island outline

### 1.1 Where things are

| place | lat, lon | source |
|---|---|---|
| Hollywood Sign (south face of Mount Lee, summit 481 m) | 34.1341, −118.3216 | [W] |
| Griffith Observatory (south slope of Mount Hollywood, 346 m) | 34.1183, −118.3003 | [W] |
| TCL Chinese Theatre, Hollywood Blvd | 34.1019, −118.3410 | [W] |
| Downtown (City Hall) | 34.0537, −118.2427 | [M] |
| Santa Monica Pier (500 m long) | 34.0086, −118.4986 | [W] |
| Venice Beach Boardwalk (3.2 km of concrete promenade) | 33.983, −118.4703 | [W] |

Local grid, Santa Monica Pier at the origin, x east, y north [C]:

```
                         N
 Hollywood Sign  (16.3, 13.9)    Griffith Obs (18.3, 12.1)
 Chinese Theatre (14.5, 10.3)
                                              Downtown (23.6, 5.0)
 SM Pier (0, 0)
   Venice (2.6, −2.8)
 coast runs NW→SE through the pier, bearing 137°/317°
```

Bearings and distances [C]:
- Sign → Observatory 2.6 km @ 132° (the Observatory is on the next spur to the south-east, lower, and looks straight at the sign).
- Sign → Chinese Theatre 4.0 km @ 207° (Hollywood Blvd sits at the foot of the hills, just south-south-west).
- Sign → Downtown 11.5 km @ 141°. Downtown is off the beach–hills axis, far to the east.
- Sign → Santa Monica Pier 21.5 km @ 230°; → Venice 21.7 km @ 219°. The beach is due south-west of the hills.
- Chinese Theatre → Pier 17.8 km @ 234°. Downtown → Pier 24.1 km @ 258°.
- Pier → Venice 3.9 km @ 137°, which is the line of the coast.

So the core of the place is one **south-west → north-east axis**: sea and pier → flat basin → Hollywood at the hills' foot → the hills with the sign and the Observatory. Downtown is a side branch to the east and is the first thing to cut.

### 1.2 Coast, beach, hills
- **Santa Monica Bay** is a bight between Point Dume (Malibu) and the Palos Verdes Peninsula [W]. Those two points lie 46.5 km apart on a 128° chord [C], and the shore bows inland between them. The bay is **concave and opens to the south-west**. Santa Monica and Venice sit near the bottom of the curve, where the shore runs almost straight NW→SE [C][P `beach-aerial-sm-venice.jpg`].
- **North of the pier** the city stands on low bluffs (the Palisades), with the coast road below them [M]. **South of the pier** to Venice the shore is flat [P].
- **The beach is very wide.** "Hundreds of feet from the bike path to the water" [S]. The aerials show the sand at roughly 3–5× the width of the promenade-plus-first-buildings strip [P `santa-monica-beach-pier.jpg`, `beach-aerial-sm-venice.jpg`]. It owes its width to a breakwater and decades of sand nourishment [S]. Cross-section from the sea inland: surf line → wet sand strip → wide dry sand (lifeguard towers about every 200–300 m [M]) → bike path (Marvin Braude trail, also used by skaters [W]) → Ocean Front Walk concrete promenade with palms and lawn → buildings [P `venice-ocean-front-walk.jpg`].
- **The pier** runs out to the south-west, perpendicular to the beach. It has a fat amusement deck (Pacific Park: Ferris wheel, roller coaster, a yellow-roofed building at the end) set out from the shore, then a long thin deck on piles. The arch gate stands at the city end [P `santa-monica-pier-aerial.jpg`][W].
- **The hills** rise straight out of the flat basin with no foothills. Mount Lee (481 m) has a rounded, lumpy summit with a radio mast. The sign stands **below the summit on the steep south face**, its letters facing south [W][P `hollywood-sign-mount-lee-2.jpg`]. The face is cut by switchback fire roads, which read as pale lines on dark scrub [P]. The ridge runs east–west with several rounded peaks: Cahuenga, Burbank, Lee, Hollywood [P `hollywood-hills-peaks.jpg`]. The Observatory is a white Art Deco building with three domes, set on a levelled terrace on a lower spur with lawns in front [P `griffith-observatory-slope.jpg`][W].

### 1.3 Compressing it into an island
The real core is ~22 km between the pier and the sign, and the island is ~50 studs. Layout distances are pure compression; only the elements keep minifig-scale detail. The order and the facing must survive the compression:
1. The sea and pier sit on the **south-west** side.
2. The beach is the **widest ground band**.
3. Ocean Front Walk + palms + a slice of flat city sit in the middle.
4. The hills rise at the back, with the **sign on their south face, which faces the default camera (camera looks from the south)**. This is a gift: the real sign faces south, so it faces the viewer without any cheating.
5. The Observatory goes on a lower spur to the right (east) of the sign, just as in reality.

**Option A — "true diagonal" (recommended).** Keep north at the back. The coast cuts the island's **front-left (SW) corner** as a gentle concave arc (the bay), the hills fill the **back-right (NE)**, and the city fills the band between them.
- Pros: the geography is literally right. The beach faces the camera at about 45°, so the pier is seen three-quarter: its length and the Ferris wheel both read. The height tiers climb front-left → back-right (sea < beach < palms/city < hills + sign), which fits the "three height tiers from any angle" rule. The sign, on the south face of the hills, looks at the camera.
- Cons: a diagonal shoreline is harder on a stud grid (wedge plates or a staircase smoothed by curved tiles). The water share is lopsided, all in one corner. The outline is unlike any island so far, which is a plus under rule 5 but costs some design time.

**Option B — "sea on the west edge, pier side-on".** Rotate the map ~40° clockwise. The coast runs straight back-to-front along the **left (west) edge**, slightly concave. The pier points left, out of the island, and is seen **side-on** from the camera. The hills form a ridge across the **back edge**, with the sign facing the camera.
- Pros: the pier gets its most legible silhouette (long deck on piles + wheel + coaster), and the arch gate faces inland where a figure can stand under it. Rows are easy to grid.
- Cons: the beach is seen edge-on, so the wide sand reads as a thin strip from the default camera, and Eric's "sun and beach" is the heart of the brief. Sea on one side only gives less "sea at your feet". The layout reads more like a map than a diorama.

Rejected variant: **sea along the whole front edge**. The pier would point straight at the camera and foreshorten to a stub. The beach would dominate, but the hero landmark (the sign) would end up the furthest thing from the viewer.

---

## 2. Ground per district (sampled from photos → LEGO)

| ground | sample (photo) | RGB | nearest LDraw | recommendation |
|---|---|---|---|---|
| Dry beach sand | Venice aerial; SM pier aerial; ground level at a lifeguard tower | #D3BB9E, #C8B69F, #E1D0BC | Tan, Light Nougat | **Tan**. The real sand is paler and greyer than Tan, but Light Nougat reads pink. |
| Wet sand at the waterline | — | (darker beige) [M] | — | **Dark Tan**, one or two studs wide |
| Dune / vacant scrub (Ballona) | Venice aerial | #96826D | Dark Tan, Medium Nougat | Dark Tan if needed |
| Ocean Front Walk concrete | `venice-ocean-front-walk.jpg` | #A2A39D | Light Bluish Gray | **Light Bluish Gray** tiles |
| Venice skatepark bowls | `venice-skatepark.jpg` | #979897 | Light Bluish Gray | **Light Bluish Gray** (curved slopes / quarter tiles for the bowl lips) |
| Bike path | — | grey asphalt with a yellow centre line [M] | — | Dark Bluish Gray tiles, one Yellow 1×1 dash line optional |
| City street asphalt | `palms-washingtonia-street.jpg` | #888686 (sun-bleached) | Light Bluish Gray, Flat Silver | **Dark Bluish Gray** for contrast against the LBG sidewalks. The real asphalt is lighter; flag this to the judge. |
| Sidewalk | same | #E5DCC6 (warm pale concrete) | White, Light Aqua | **Light Bluish Gray**, or Tan where it meets sand |
| Observatory plaza | `griffith-observatory-slope.jpg` | #EAEAEC | White | White / Light Bluish Gray |
| Park lawn (Venice, Observatory) | two photos | #4F5D27, #6F7A4F | olive greens | Series lawn **Green**, with **Olive Green** patches. LA lawns are drier and more olive than Kyoto's. |
| Chaparral, dense (south face of Mt Lee) | `hollywood-sign-mount-lee-2.jpg`, Observatory aerial | #342F28, #414540 (in shade) | near black | **Olive Green** + **Dark Green** clumps (plant 1×1 / 2417 / 6255). Never Bright Green. |
| Chaparral, sunlit upper slope | same | #59524C | Dark Bluish Gray / Medium Brown | Mix in **Dark Tan** dry grass |
| California sage scrub (grey-green) | `griffith-chaparral-trail.jpg` (scrub oak/toyon in shade #2D2A12) | grey-green [M] | — | **Sand Green** accents, sparingly |
| Fire roads, trails (decomposed granite) | two photos | #856346, #B5894C | Medium Nougat, Nougat | **Medium Nougat** 1-wide tiles snaking up the face (the switchbacks are signature) |
| Exposed rock / cut on Mt Lee | `hollywood-hills-peaks.jpg` | #646871 | Dark Bluish Gray | a few **Dark Bluish Gray** slopes near the summit |

Seasonal note [M]: the hills are green from about February to April after the winter rains, and gold and brown from June to November. In the dry season the slope reads as dark olive scrub on golden-brown grass, so use **Dark Tan + Olive Green**, not Green.

---

## 3. Water — Santa Monica Bay
Samples:
- Offshore, from the air: #2D5261 (Venice aerial).
- Mid-bay from the shore: #647884, with the far bay at #576B80 (`santa-monica-bay.jpg`).
- Near the pier: grey-green #536864 (`santa-monica-pier-aerial.jpg`).
- Surf foam: #C3C6C7.
- The Hollywood Reservoir, for comparison: #708997.

The bay is a **muted blue-grey-green**: cold California Current water with no tropical turquoise anywhere [P].

Recommendation:
- **Offshore**: Sand Blue base with a Dark Blue deep band at the island edge, under Trans-Clear tiles. Trans-Clear, not Trans-Light-Blue, keeps it as muted as Kyoto's pond.
- **Nearshore** (inside the surf line): **Sand Green** under Trans-Clear. This matches the grey-green at the pier.
- **Surf**: two or three broken **White** lines (1×2 / 1×3 curved tiles or quarter-round tiles) parallel to the shore, plus a Very Light Bluish Gray foam fringe. The real beach shows 2–3 parallel white bands [P `beach-aerial-sm-venice.jpg`].
- **Not**: Medium Azure, Dark Turquoise, Trans-Light-Blue over white. That is the tropical look (Singapore / Maldives) and would be louder than Kyoto's pond, against rule 5.

---

## 4. Trees and plants

| plant | real form | LA district | LEGO direction |
|---|---|---|---|
| **Mexican fan palm** *Washingtonia robusta* — the icon | Up to 25 m, rarely 30 m [W]. A pencil-thin trunk with a small round fan crown. In the street photo the crown is ~15–17 % of total height and about as wide as it is tall, and the trunk barely tapers [P `palms-washingtonia-street.jpg`]. Fan leaves to 1 m on 1 m petioles [W]. LA palms are pruned **bare and pale grey-brown** (#7D7A75 → Dark Tan) [P]. Unpruned ones keep a "skirt" of dead fronds [W][P `palm-washingtonia-single.jpg`]. The "sky dusters" go back to c. 1875 [W]. | Everywhere: Ocean Front Walk rows, Hollywood streets, the pier approach | Trunk:crown height ≈ 6:1, the tallest thing after the hero landmarks. Thin trunk = stacked 1×1 round bricks in **Dark Tan** (2536b palm-trunk segments are Reddish Brown and stubby, which reads Singapore-coconut). Crown = 5–7 **Green** fan leaves (6148 small / 2518 large / 30339 quad, all in LDraw) on a 1×1 top. Plant in **rows of 3–5 at equal spacing**: rows of palms are the LA signature, not single palms. |
| Canary Island date palm *Phoenix canariensis* | Thick trunk (≈1 m) with a diamond leaf-base pattern and a huge round crown of arching feathery fronds, 6–10 m across [M]. Parks, boulevards, older estates. | Palisades Park above the beach, Hollywood | Optional single specimen: 2×2 round trunk, Dark Tan, with many Green large palm leaves in a ball. It reads as "fat palm" next to the skinny ones; one at most. |
| Jacaranda *J. mimosifolia* | Up to 20 m, a spreading crown of violet panicles [W]. Blooms in spring to early summer for up to two months [W], late May–June in LA [M]. Flowers poorly right on the coast [W]. Sampled bloom (overcast photo) #786C98 [P `jacaranda-hollywood.jpg`]. | Inland streets: Hollywood, not the beach | `tree(kind)` with Medium Lavender flower plates. **Only valid if the season is late May–June** (see §5). |
| California sycamore, coast live oak | Sycamore has white mottled bark and grows in canyon bottoms. The oak is dark, rounded and evergreen, on slopes [M]. | Griffith Park canyons, behind the Observatory | One or two dark round oaks (Dark Green / Olive Green 2417 clusters) on the hills. They mark the hills as wild, not a park. |
| Bird of paradise *Strelitzia reginae* | Orange sepals and a blue tongue on a beak-like bract, with paddle leaves [P `bird-of-paradise.jpg`]. Official flower of the City of LA [M]. | Front gardens, Hollywood, by the Walk of Fame | A clump of swordleaf (10884 / 30239) in Green with one Orange flower each. Life-layer dressing near a house, ≤ 2 clumps. |

**Most iconic per district**: beach and Ocean Front Walk → rows of Washingtonia. Hollywood streets → Washingtonia rows, plus jacaranda only in season. Hills → chaparral scrub and one live oak. Observatory lawn → nothing tall (the real lawn is open). Planting rule: trees never touch, and palms are spaced evenly, as LA plants them.

---

## 5. Light and season
- **Golden hour**: the sun sets over the bay to the west-south-west. The late light comes off the sea, warm and low, and lights the sign's south face. A haze band sits over the basin [P `griffith-park-sw-view.jpg`: horizon band #FEDCA8 (Light Nougat), sky blending to pale blue above]. Daytime sky: clear #8AA5CD, hazy #6C96CC; overcast "May Gray" #A3B2C1 [P].
- **June Gloom**: low marine stratus covers coastal LA in late spring and early summer. May and June are the cloudiest months on the coast, and the cloud usually burns off between mid-morning and early afternoon [W]. **Autumn (Sept–Nov) has the clearest skies**, summer-like warmth and the Santa Ana winds [S].
- **Recommended season: late summer to early autumn (September).** Reasons:
  1. Eric wants "阳光很好", and September is reliably sunny on the coast, while May–June is grey.
  2. Beach life is at its peak, with warm water, surfers and skaters.
  3. The hills are golden (Dark Tan + Olive Green), the look of LA in every reference photo here.
  4. It doesn't fight the palette: no green spring hills, no snow.

  Cost: **no jacaranda bloom**. Do not sneak in a purple tree out of season; that is the "palette from photographs" rule. If Eric wants the jacaranda, the season becomes late May–early June with a hazy sky, and the hills stay part-green.
- Renderer suggestion: a warm key light from the sea side (west-south-west) and a soft cool fill. No night mode needed.

---

## 6. Whole-island palette (LEGO names)
- **Ground**: Tan (sand), Dark Tan (wet sand, dry grass, palm trunks), Light Bluish Gray (promenade, sidewalks, skatepark), Dark Bluish Gray (roads, bike path, rock), Medium Nougat (fire roads), White (plaza, surf).
- **Green**: Green (lawn, palm fronds), Olive Green (chaparral, dry lawn patches), Dark Green (oaks, dense scrub), Sand Green (sage scrub, nearshore water).
- **Water**: Sand Blue + Dark Blue under Trans-Clear; Sand Green nearshore; White surf.
- **Buildings and landmarks**:
  - Hollywood Sign: **White** letters on dark scrub.
  - Griffith Observatory: **White** walls, domes **Dark Bluish Gray / Flat Silver** (copper roofs gone grey; sampled #838589) [P].
  - Pier arch: **Dark Blue** (navy) with a White cartouche and **mustard-yellow banded pylons** (Bright Light Orange / Yellow; the photo is backlit, so verify) [P].
  - Pier deck: Dark Tan / Reddish Brown timber on Dark Bluish Gray piles [M].
  - Pacific Park: a Yellow roof at the pier end [P aerial]; Ferris wheel White spokes [M].
  - Lifeguard towers: pale blue (#829DAE → **Medium Blue**; Bright Light Blue is the alternative) with a White rail [P].
  - Venice boardwalk shops: one muted aqua or Sand Green facade at most (sampled #3F555B in shade) [P].
- **Small accents**: Red only for a rescue can or a flag; Orange (bird of paradise); Black (Route 66 numerals).
- **Do not use**:
  - Medium Azure, Dark Turquoise or Trans-Light-Blue tropical water.
  - Bright Green lawns or hills.
  - Bright Red or vermilion as a primary (Kyoto's).
  - A row of pastel facades in Bright Pink, Coral, Light Aqua or Bright Light Yellow (Singapore's shophouses). Venice has pastels, but at most one, muted.
  - Magenta (Shanghai's Pearl).
  - Dark Orange terracotta roof fields (Prague's).
  - Lime, neon colours, Trans-Neon anything. LA's neon is at night, and we render in daylight.

---

## 7. Lettering culture (rule 1, L2)
| object | how it is really lettered | legible at thumbnail? |
|---|---|---|
| **Hollywood Sign** | Nine separate **white sans-serif block capitals**, tall and slightly condensed. Each letter is 13.7 m tall and 9.4–11.9 m wide, and the run is 137 m long [W], so length : height ≈ 10 : 1. The letters are steel panels on steel columns over concrete footings [W] and sit on the slope at slightly different heights [P]. | Yes, it is the landmark. Treat it as **structure, not print**: each letter is a separate brick-built white glyph (plates and tiles, studs-out on brackets) standing on the slope, ~2 studs wide with gaps. If the letters are too small to build, print the six distinct glyphs (H O L Y W D) on white tiles, which is within the ≤ 12-design budget. Decide at the landmark checkpoint. |
| **Santa Monica Pier arch** (1941 [M]) | A navy arch. "SANTA MONICA" in **dark-blue capitals on a white cartouche** on top; "YACHT HARBOR ★ SPORT FISHING ★ BOATING" in **white neon-tube capitals**; "Cafes" in **yellow script** [P both sign photos]. Mustard-yellow stepped Deco pylons. | Only the white cartouche reads at thumbnail. The neon lines blur into a texture. |
| **Route 66 "End of the Trail"** | A **white US-highway shield with black "66"**, "SANTA MONICA" in a black sans on a white panel above, and "End of the Trail" below [P `route66-end-sign.jpg`]. | **Yes**: "66" is two characters, black on white, and fits rule 1 exactly. |
| **Lifeguard towers** | One or two **large black numerals painted on the pale-blue cabin** (e.g. "8") [P `lifeguard-tower-sm.jpg`]. | **Yes**: one character on a flat face, true to the object. |
| Venice sign | "VENICE" in white letters ringed with light bulbs, hung on a steel frame across Windward Ave [M]. | 6 letters; at the island's scale it is a thin line. Skip unless Venice becomes a hero. |
| Googie neon | Mid-century coffee-shop signs (boomerangs, starbursts) [M]. | Not on the beach–hills axis; skip. |
| Walk of Fame star | A **coral-pink terrazzo star with a brass border on a charcoal square** [W][P `walk-of-fame-star.jpg`]. The name is too small to read. | Yes as a **no-text print** (star only) on a 2×2 Dark Bluish Gray tile, and only if Hollywood Blvd is in the set. |

**Worth printing (pick 2–3)**: (1) the **Route 66 shield "66"**, (2) a **lifeguard tower numeral**, (3) the **pier cartouche "SANTA MONICA"**. The pier cartouche is a two-word phrase; it is real, but ask Eric if it breaks "1–2 characters or a short word". The alternative (3b) is the Walk of Fame star, which needs no text. The Hollywood letters are built, not printed, by default.

---

## 8. Life layer (rule 6: 2–3 figures, each legible)
Mood check: sun, beach, free, sporty, outdoors (Eric). Part numbers were checked against `My Lego World/vendor/ldraw-lib/ldraw/parts/*.dat` headers.

| action | why it is LA | props in LDraw (verified) |
|---|---|---|
| **Surfer walking out of the surf, board under arm** | Santa Monica / Venice surf. It reads at any distance. | **90397** Minifig Surf Board 2×6.5; **6075** Minifig Surf Board 2×10 (longboard). How the board attaches to the hand clip is not checked [M]: verify `gp` at bake. |
| **Roller-skater dancing on the promenade** | Venice skate culture [W]. | **11253** Minifig Roller Skate (×2, one per foot). |
| **Skateboarder in the Venice bowl** | Venice Beach Skatepark [W][P]. Eric named skate culture. | **42511** Minifig Skateboard (also **42511c01** complete with black wheels, 45917 / 45918), **46303** skate helmet. The bowl is built from Light Bluish Gray curved slopes. |
| **Muscle Beach lifter** | "people working out by the sea" (Eric). Muscle Beach Venice [W]. | **29592** Minifig Sports Barbells. |
| Lifeguard on the tower deck with binoculars | The pale-blue tower is a beach icon. | **30162** Minifig Binoculars with round eyepiece. |
| Cyclist on the bike path | Marvin Braude trail [W]. | **4719c01** Minifig Bicycle (complete). |
| Tourist photographing the Hollywood Sign | Classic, but a tourist on a hill is far from the beach mood. | **30089a / 30089b** Minifig Camera Snapshot. |
| Street musician on Ocean Front Walk | Venice buskers [M]. | **25975** Acoustic Guitar, **11640** Electric Guitar, **13808** Saxophone. |
| Dog walker | Everyday LA. | Dogs: **26078** Terrier, **29602** French Bulldog, **12888** Chihuahua. **No leash mould found**: a string part would be needed. |
| Taco-truck vendor | Very LA, but needs a vehicle build (scope). | **No taco mould** in LDraw. Food stand-ins: 25386 bread bun, 33078 sausage, 11252 / 29635 trays. Weak, so skip. |

**Recommended three**: the **surfer** (beach), the **roller-skater or skateboarder** (promenade or bowl; pick one), and the **Muscle Beach lifter**. The **lifeguard with binoculars** is the fourth if Eric grants one more. Each is paired with a place: surf ↔ beach, skate ↔ promenade/bowl, lifter ↔ Muscle Beach pen, lifeguard ↔ tower.

Other moulds checked and present: **14045** headphones, **39144** megaphone (lifeguard), **15396c01** scooter, **12885** paint roller (a mural painter, if murals go in). No spray-can mould was found (only 94724 spray bottle with heart).

---

## 9. Photos in this folder (28, all verified JPEG with `file`)

| file | shows | licence | author | source |
|---|---|---|---|---|
| hollywood-sign-mount-lee.jpg | Sign + Mt Lee from the air, golden hour (**heavily colour-graded: shapes only, not for colour**) | CC0 | Sasha (Instagram sanfrancisco) | https://commons.wikimedia.org/wiki/File:The_Hollywood_sign_on_Mount_Lee_(2017-05-01).jpg |
| hollywood-sign-mount-lee-2.jpg | Mt Lee south face, sign below the summit, fire-road switchbacks, chaparral | CC BY-SA 3.0 | Downtowngal | https://commons.wikimedia.org/wiki/File:Mount_Lee_and_Hollywood_sign.jpg |
| hollywood-hills-peaks.jpg | The ridge of peaks with the sign, from the Hollywood Reservoir | CC BY-SA 3.0 | Downtowngal | https://commons.wikimedia.org/wiki/File:View_of_peaks_and_Hollywood_Sign_from_Hollywood_Reservoir.JPG |
| griffith-observatory-slope.jpg | Observatory aerial: three domes, white walls, terrace lawns, chaparral | Public domain | Carol M. Highsmith | https://commons.wikimedia.org/wiki/File:Griffith_Observatory_on_the_south-facing_slope_of_Mount_Hollywood_in_L.A.%27s_Griffith_Park_(LC-DIG-highsm-_22255).tif |
| griffith-observatory-front.jpg | Observatory front elevation | CC BY 3.0 | RogerHam | https://commons.wikimedia.org/wiki/File:Griffith_Observatory_2-_July_11,_2008.jpg |
| griffith-park-sw-view.jpg | Sunset over the basin toward the bay (golden-hour band) | Public domain | Serouj | https://commons.wikimedia.org/wiki/File:Griffith_Park_south_west_view.jpg |
| downtown-from-griffith.jpg | Downtown skyline from Griffith Park | Public domain | Serouj | https://commons.wikimedia.org/wiki/File:Downtown_LA_from_Griffith_Park.jpg |
| la-basin-panorama.jpg | Basin panorama | CC BY-SA 3.0 | A. Novati | https://commons.wikimedia.org/wiki/File:Los_Angeles_Basin_panorama.jpg |
| griffith-chaparral-trail.jpg | Decomposed-granite trail through scrub oak and toyon | CC BY-SA 3.0 | Billy Hathorn | https://commons.wikimedia.org/wiki/File:Rugged_hiking_trail_in_Griffith_Park,_Los_Angeles_DSCN0101.JPG |
| santa-monica-pier-aerial.jpg | Pier aerial: amusement deck, Ferris wheel, yellow roof, beach, bay colour | Public domain | Carol M. Highsmith | https://commons.wikimedia.org/wiki/File:Aerial_view_of_Santa_Monica_Pier,_Santa_Monica,_California_LCCN2013632670.tif |
| santa-monica-beach-pier.jpg | Wide beach + pier from the air, bay to the horizon | CC BY-SA 3.0 | JCS | https://commons.wikimedia.org/wiki/File:Santa_Monica_Beach_with_pier_2.JPG |
| santa-monica-pier-sign.jpg | Arch gate by day (navy, cartouche, yellow pylons; backlit) | CC BY-SA 4.0 | APK | https://commons.wikimedia.org/wiki/File:Santa_Monica_Pier_sign.jpg |
| santa-monica-pier-sign-night.jpg | Arch at night: neon colours and letterforms | Public domain | Carol M. Highsmith | https://commons.wikimedia.org/wiki/File:Pier_sign_at_night,_Santa_Monica,_California_LCCN2011630076.tif |
| route66-end-sign.jpg | Route 66 "End of the Trail" shield on the pier | CC BY-SA 4.0 | APK | https://commons.wikimedia.org/wiki/File:Route_66_sign_at_Santa_Monica_Pier.jpg |
| lifeguard-tower-sm.jpg | Pale-blue lifeguard tower "8", ramp, flag, Santa Monica Mts | CC BY-SA 4.0 | Cayambe | https://commons.wikimedia.org/wiki/File:Santa_Monica_%E2%80%93_Lifeguard_tower_(wide)_2017.jpg |
| lifeguard-tower-sm-2.jpg | Second tower view | CC BY-SA 4.0 | Lorie Shaull | https://commons.wikimedia.org/wiki/File:Lifeguard_tower_at_Santa_Monica_Beach,_California.jpg |
| santa-monica-bay.jpg | Bay water and surf at ground level | Public domain | Leahcim506 | https://commons.wikimedia.org/wiki/File:SantaMonicaBay.jpg |
| beach-aerial-sm-venice.jpg | Coast from the air: surf bands, sand width, Marina del Rey | CC0 | Benoît Prieur | https://commons.wikimedia.org/wiki/File:Aerial_view_of_beaches_(Santa_Monica_%26_Venice)_July_2022.jpg |
| venice-beach-aerial.jpg | Venice Beach aerial | Public domain | Carol M. Highsmith | https://commons.wikimedia.org/wiki/File:Aerial_view_of_Venice_Beach,_California_LCCN2013633204.tif |
| venice-marina-aerial.jpg | Marina del Rey + Venice aerial | CC0 | Alfred Twu | https://commons.wikimedia.org/wiki/File:Marina_Del_Rey_and_Venice_Beach_aerial_view.jpg |
| venice-ocean-front-walk.jpg | Ocean Front Walk: concrete, palm row, lawn, arcaded shops | CC0 | DanielMichaelPerry | https://commons.wikimedia.org/wiki/File:Ocean_Front_Walk_Venice_Beach.jpg |
| venice-skatepark.jpg | Venice skatepark bowls with the beach behind | CC BY-SA 4.0 | Alexander Migl | https://commons.wikimedia.org/wiki/File:Venice_Beach_Skatepark_P4070293.jpg |
| palms-washingtonia-street.jpg | LA street lined with Washingtonia (proportions, trunk colour) | CC BY-SA 4.0 | Downtowngal | https://commons.wikimedia.org/wiki/File:Washingtonia_robusta_lined_street,_Los_Angeles.jpg |
| palm-washingtonia-single.jpg | Unpruned Washingtonia with its skirt (Lanzarote; form only) | CC BY-SA 3.0 | H. Zell | https://commons.wikimedia.org/wiki/File:Washingtonia_robusta_-_Lanzarote.JPG |
| jacaranda-hollywood.jpg | Jacarandas in bloom, Hollywood pocket park | CC BY-SA 3.0 | Downtowngal | https://commons.wikimedia.org/wiki/File:Pocket_park_in_Hollywood_2.jpg |
| bird-of-paradise.jpg | Strelitzia reginae flower | CC BY-SA 4.0 | Reinhold Möller Ermell | https://commons.wikimedia.org/wiki/File:Strelitzia_reginae-20091014-RM-115622.jpg |
| chinese-theatre.jpg | TCL / Grauman's Chinese Theatre facade | Public domain | Carol M. Highsmith | https://commons.wikimedia.org/wiki/File:Grauman%27s_Chinese_Theatre,_by_Carol_Highsmith_fixed_%26_straightened.jpg |
| walk-of-fame-star.jpg | Walk of Fame star (coral star, brass border, charcoal) | CC BY-SA 4.0 | Dietmar Rabich | https://commons.wikimedia.org/wiki/File:Los_Angeles_(California,_USA),_Hollywood_Boulevard,_John_Lennon_--_2012_--_4990.jpg |

Web sources: Wikipedia articles listed at the top; Santa Monica beach width — santamonica.com / city press release (search snippet); autumn clear skies and Santa Ana — search snippet, with June Gloom confirmed on Wikipedia.

## 10. Open points for the country page
1. Outline A (true diagonal, recommended) or B (west-edge sea, pier side-on).
2. Season: September (recommended, no jacaranda) or late May–June (jacaranda, grey sky).
3. Third print: the "SANTA MONICA" cartouche (two words) or the Walk of Fame star (no text).
4. Verify before building: the arch pylon colour in a front-lit photo; how the surfboard grips in the hand clip (90397 / 6075); the bike path's real surface colour.
