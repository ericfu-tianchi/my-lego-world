# Seoul: the real place (research notes, 2026-10-06)

Facts are tagged by source:
- **[W]** Wikipedia / Wikidata (Gyeongbokgung, N Seoul Tower, Han River, Banpo Bridge, Bukchon Hanok Village, Cheonggyecheon, Dongdaemun Design Plaza; Korean Wikipedia for 북악산 / 남산; Wikidata P625 coordinates)
- **[S]** a web search snippet or news page (Korea Times on the Gwanghwamun plaque; guard-ceremony and festival listings; Seoul street-tree counts), weaker than [W]
- **[P]** read off or sampled from the photos in this folder (median RGB of a hand-picked region, or of the pixels passing a hue filter; nearest LEGO colour by weighted RGB distance against `LDConfig.ldr`, restricted to ~45 colours in current production)
- **[C]** computed (great-circle bearing and distance from the coordinates below)
- **[M]** from memory or general knowledge, not checked against a source this round. Verify before relying on it.

No brief from Eric yet. These notes assume the series brief: 4–5 iconic places, 2–3 figures, one floating island, palette from photographs.

---

## 1. Geography for the island outline

### 1.1 Where things are

| place | lat, lon | elevation / size | source |
|---|---|---|---|
| Gwanghwamun (south gate of Gyeongbokgung) | 37.5760, 126.9770 | — | [W] |
| Geunjeongjeon (throne hall) | 37.5783, 126.9769 | — | [W] |
| Gyeonghoeru (pond pavilion) | 37.5798, 126.9759 | — | [W] |
| Cheong Wa Dae (former presidential house, at the foot of Bugaksan) | 37.5867, 126.9749 | — | [W] |
| Bugaksan (Baegaksan) summit | 37.6061, 126.9832 per Wikidata — **probably off; my estimate 37.593, 126.981** | 342 m, granite | [W] elev. ko-wiki; coord [M] |
| Inwangsan | 37.5847, 126.9586 | 338 m, granite | [W] |
| Bukhansan (Baegundae) | 37.6608, 126.9933 | 836 m | [W] |
| Bukchon Hanok Village | 37.5831, 126.9836 | — | [W] |
| Gwanghwamun Square | 37.5728, 126.9767 | — | [W] |
| Sungnyemun (Namdaemun) | 37.5600, 126.9753 | — | [W] |
| N Seoul Tower | 37.5512, 126.9883 | tower 236 m, antenna to 279 m; on Namsan, 270.85 m | [W] |
| DDP | 37.5669, 127.0094 | 280 m long | [W] |
| Cheonggyecheon | 37.570, 127.006 (mid-point) | 10.9 km long | [W] |
| Banpo Bridge | 37.5157, 126.9959 | 1,495 m long | [W] |
| Hannam / Dongjak / Mapo bridges | 37.5273, 127.0129 / 37.5112, 126.9822 / 37.5336, 126.9364 | — | [W] |
| Yeouido (island) | 37.5266, 126.9230 | — | [W] |
| Lotte World Tower | 37.5125, 127.1025 | 555.7 m | [W] |
| Hongik University (Hongdae) | 37.5506, 126.9258 | — | [W] |

Local grid, Gwanghwamun at the origin, x east, y north, km [C]:

```
                          N
                Bukhansan (1.4, 9.4)  — far ridge, 836 m
          Bugaksan  (~0.3, ~1.9)  — directly behind the palace, 342 m
 Inwangsan (−1.6, 1.0)     Cheong Wa Dae (−0.2, 1.2)
        Gyeonghoeru (−0.1, 0.4)   Bukchon (0.6, 0.8)    Changdeokgung (1.4, 0.4)
        Geunjeongjeon (0.0, 0.25)
 GWANGHWAMUN (0, 0) ──── faces south down the square
        Gwanghwamun Sq (0.0, −0.4)                Cheonggyecheon (2.6, −0.7)  DDP (2.9, −1.0)
        Namdaemun (−0.2, −1.8)    Myeongdong (0.6, −1.4)
                              N SEOUL TOWER (1.0, −2.8)
 Hongdae (−4.5, −2.8)
 Mapo Br (−3.6, −4.7)                                   Hannam Br (3.2, −5.4)
 Yeouido (−4.8, −5.5)   63 Bldg (−3.3, −6.3)   Banpo Br (1.7, −6.7)   Dongjak Br (0.5, −7.2)
                                                                    Lotte WT (11.1, −7.1) →
```

Bearings and distances [C]:
- Gwanghwamun → Geunjeongjeon 0.25 km @ 358°: the palace is one straight **north–south axis**, every gate and hall facing south.
- Gwanghwamun → Bugaksan ≈ 1.9 km @ ≈ 10° (my coordinate; Wikidata's gives 3.4 km @ 9°, which puts the summit too far — the photos show the peak rising right behind Cheong Wa Dae) [C][M][P `gyeongbokgung-bukhansan.jpg`].
- Gwanghwamun → Bukchon 0.97 km @ 37° (north-east, on the slope between Gyeongbokgung and Changdeokgung).
- Gwanghwamun → N Seoul Tower 2.9 km @ 160°. The tower is south and slightly **east** of the palace axis.
- N Seoul Tower → Banpo Bridge 4.0 km @ 170°; → Dongjak Bridge 4.5 km @ 187°; → Hannam Bridge ≈ 3.6 km @ 140°. Namsan stands between the old city and the river.
- Gwanghwamun → Banpo Bridge 6.9 km @ 166°. **Mountain → palace → Namsan → river all line up on one N–S axis within ~10°.**
- Lotte World Tower is 11 km @ 113° from the tower, far east — off the axis, first to cut.
- Yeouido is 6.4 km @ 245° from the tower — off the axis to the south-west.

So the core is one **north → south line: Bugaksan → Gyeongbokgung → (downtown) → Namsan + tower → Han River**, about 9 km long. This is also the founding logic of the city: the palace was sited with "a mountain behind it and water to the front" (baesanimsu, feng shui) [W Gyeongbokgung].

### 1.2 River, hills, sightlines
- **The Han is wide**: "within Seoul city limits, more than 1 km wide" [W]. It flows east → west through the city and has 31 bridges in the capital area [W]. Through the centre it makes a **southward loop**: Hannam Br (3.2, −5.4) → Banpo (1.7, −6.7) → Dongjak (0.5, −7.2) → Mapo (−3.6, −4.7) [C]. Seen from the palace side, the north bank is **concave, bowing away to the south**, then turns north-west past Yeouido.
- The banks are **engineered**: concrete revetment, a riverside expressway on both banks, and between road and water a continuous strip of park (Hangang Park: lawn, cycle path, walkways) [W][P `han-river-aerial.jpg`, `yeouido-hangang-park.jpg`]. The river reads as a **flat, calm, very wide sheet with long low bridges on piers**, with no rocks or natural beaches.
- **Banpo Bridge** is a double deck: the low Jamsu Bridge (795 m, submerges in floods) under the upper bridge [W][P `banpo-bridge-day.jpg`]. Its Moonlight Rainbow Fountain (380 nozzles, Guinness 2008) runs April–October, and the rainbow colours are **night only** [W][P].
- **Namsan** is a single round-shouldered wooded hill, 271 m, with the tower and a mast on the summit; apartment slabs line its foot in views from the south [P `namsan-han-river.jpg`][W].
- **Bugaksan** is a steeper **granite peak** with bare pale rock outcrops and pine forest. Behind it rise the jagged white granite of Bukhansan [P `gyeongbokgung-overview.jpg`, `hyangwonjeong.jpg`]. The **Seoul City Wall** runs along its crest, built of dressed granite blocks with a crenellated parapet [P `bugaksan.jpg`][M].
- **Classic sightlines** (all looking north, i.e. away from a camera standing in the south):
  1. **Gwanghwamun Square → the gate → Bugaksan** rising right behind it [P `gwanghwamun-2023.jpg`].
  2. **Geunjeongjeon over the stone courtyard with the granite peaks behind** [P `geunjeongjeon-front.jpg`, `gyeongbokgung-overview.jpg`].
  3. **Namsan and the tower across the Han**, seen from the south bank or the bridges [P `namsan-han-river.jpg`, `seongsu-bridge-namsan.jpg`].
  4. **N Seoul Tower down a Bukchon alley over hanok roofs** (looking south) [P `bukchon-alley.jpg`]. This view joins old and new in one frame.
- A gift, like LA's sign: every palace building faces south, and the classic views of the tower look north across the river. **A default camera in the south sees all four sightlines the right way round.**

### 1.3 Compressing it into an island
The real axis is ~9 km; the island is ~50–60 studs. What must survive:
1. **The mountain is behind the palace** (north = back edge).
2. **The palace faces the camera** (south), on its N–S axis.
3. **Namsan and the tower stand between the palace and the river**, offset to the east (right).
4. **The river is in front**, wide and calm, and the tower is seen across it.
5. Bukchon sits north-east of the palace (back-right).

**Option A — "baesanimsu axis", river along the front (recommended).** North at the back. The **back edge follows Bugaksan's ridge**: the outline bulges back where the peak rises, with the City Wall on its crest and red pines on its slope. **Gwanghwamun** stands back-centre, slightly left, on its granite base, facing the camera, with a stretch of palace wall. **Bukchon** fills the back-right on rising ground: two hanok along one sloping alley. **Namsan** is a wooded hill at mid-right with the **tower** as the tallest element. The **Han** fills the front as a wide band whose north bank **bows toward the camera in the middle** (the real southward loop seen from the north, mirrored for the view). It leaves through the left and right plinth faces. Along the bank runs a strip of Hangang Park: lawn, cycle path, one bridge pier stub and a boat.
- Pros: the geography is literally right. All four sightlines read from the default camera. The height tiers climb from front to back (water < park < palace/hanok < Namsan + tower), with the tower as the hero and Bugaksan as the backdrop. The outline is new for the series: a mountain-shaped back edge and a curved river front. The baesanimsu story explains the set in one sentence.
- Cons: two hills (Bugaksan and Namsan) cost earth parts (rule 10), so they have to be shells on the 2-layer earth, not solid. The tower at mid-right can hide Bukchon from some angles, so the two must be offset on x. A river band across the whole front risks the "default water at the front" look: the curved bank, the park strip and the bridge stub must break it.

**Option B — "river through the middle, a Gangnam sliver".** The Han crosses the island W → E, with a bridge spanning it. The north bank holds the palace, Bukchon and Namsan; the south bank is a thin strip of park and apartments.
- Pros: shows Seoul as a city split by its river (Gangbuk / Gangnam), and a real bridge spans real water.
- Cons: **echoes Shanghai** (river through the middle, two banks) and **Prague / Paris** (river + bridge). A 1 km river at the right proportion eats a third of the island. The south bank adds nothing iconic.

**Option C — "tower on the water", diagonal.** The river cuts the front-left corner as a concave arc, Namsan + tower stand at the front-right on the bank, and the palace + Bugaksan sit back-left with Bukchon back-right.
- Pros: the tower is seen across water from the default camera (sightline 3 at its strongest), and the corner diagonal gives a three-quarter view of the river.
- Cons: the map is rotated ~45°, so the palace faces the diagonal unless it is turned against its real axis. It puts the tower at the waterfront, which is **exactly the Shanghai Pearl composition** (tall TV tower on the bank of a wide grey river). A diagonal bank is harder on the stud grid.

Rejected: Lotte World Tower, Yeouido or the 63 Building on the island. They are off-axis by 5–11 km and would turn the set into "skyscraper + river", which is Shanghai's.

---

## 2. Ground per district (sampled from photos → LEGO)

| ground | sample (photo) | RGB | nearest LEGO | recommendation |
|---|---|---|---|---|
| **Bakseok** palace courtyard: irregular, hand-split granite slabs, rough, laid with wide joints [W "bakseok"][P] | `geunjeongjeon-courtyard.jpg`, `geunjeongjeon-front.jpg` | #C2B8AA, #BAAEB6 | Very Light Bluish Gray (rare), Tan | **Light Bluish Gray** irregular mosaic (1×2, 2×2, 2×3 tiles + quarter/round tiles, gaps showing Dark Bluish Gray). The real stone is lighter and warmer, so flag this to the judge. The raised central royal path (eodo) and two rows of rank stones (pumgyeseok) are the signature [M][P]. |
| Granite terrace (woldae) + balustrade | `geunjeongjeon-courtyard.jpg` | #AF9D84 (warm, sunlit) | Light Bluish Gray, Medium Tan | **Light Bluish Gray**, balusters 1×1 round + plate rail |
| Gwanghwamun base (dressed granite ashlar, three arched portals) | `gwanghwamun-2023.jpg` | #E0E0D6 | (nearly white) | **Light Bluish Gray** for consistency with the courtyard, or **White** if the base must pop at distance. Decide on a render. |
| Palace outer wall | `gwanghwamun-2023.jpg`, `hanbok-tourists.jpg` | #DCD8CC (plaster/stone face) | White / LBG | Dressed stone lower course **Light Bluish Gray**; upper **White** or LBG; giwa coping **Dark Bluish Gray** |
| Bukchon garden walls: granite blocks | `bukchon-alley.jpg` | #8E8582 | Light Bluish Gray | **Light Bluish Gray** with a 1-plate **Sand Red** brick-pattern band (sampled #935D55 → Sand Red d=23) under the coping |
| Bukchon alley | `bukchon-alley.jpg` | #858388 | Light Bluish Gray / Sand Blue | **Light Bluish Gray** tiles, sloping in flat plate steps |
| Hangang Park lawn | `yeouido-hangang-park.jpg` (December) | #A38269 (dormant zoysia, brown) | Medium Nougat, Dark Tan | In autumn the lawn is turning: **Green + Olive Green**, with **Dark Tan** patches. Not December brown. [M on timing] |
| Cycle path | `han-bike-path.jpg` | #2A2420 (asphalt at sunset) | — | **Dark Bluish Gray** tiles, a **Yellow** 1-wide dashed centre line and White edge lines (both visible in the photo) [P] |
| River revetment, bridge concrete | `banpo-bridge-day.jpg` | #797D84 | Sand Blue / LBG | **Light Bluish Gray** piers and deck |
| City road (Sejong-daero) | `gwanghwamun-2023.jpg` | #404246 | Dark Bluish Gray | **Dark Bluish Gray** with White zebra-crossing tiles, only if a road strip goes in front of the gate |
| Namsan forest floor, trails | — | — | — | Earth under trees is covered; a stair path of **Light Bluish Gray** plates up to the tower [M] |
| Bugaksan granite outcrops | `hyangwonjeong.jpg` | #5B676E (in shade) | Dark Bluish Gray | **Light Bluish Gray** slopes for the pale sunlit rock (the photo is in shade), Dark Bluish Gray for shadowed faces |

## 3. Water — the Han

Samples [P]:
- Near the bank at Banpo in October: #545A61 (ripples, overcast-ish).
- Mid-river at Banpo: #797F81 (grey, a little green).
- From the south bank in December, under a blue sky: #466987 (blue reflection).
- From the air: steel grey and backlit.

The Han is a **calm, grey-blue, opaque sheet**. It is never turquoise, and greener only near the banks. The colour follows the sky.

Recommendation:
- **Sand Blue** base under Trans-Clear tiles. **Dark Bluish Gray** works for a deep channel line or a shadow band under a bridge.
- Differ from Shanghai's Huangpu ("murky grey-green") by being **bluer and calmer**: no Sand Green field.
- No surf, no foam. A wake behind one boat (White 1×2 curved tiles) is the only white on the water.
- **Not**: Medium Azure, Trans-Light-Blue, or the fountain's rainbow (night only).

## 4. Trees and plants

| plant | real form | where | LEGO direction |
|---|---|---|---|
| **Ginkgo** (eunhaeng) — Seoul's city tree since 1971 [S]; ~102,800 of ~303,000 street trees, about a third [S] | Upright, oval-to-conical crown on a straight grey-brown trunk. Fan-shaped leaves turn an **even butter-yellow** in late Oct–Nov and drop almost together, leaving yellow carpets [M][P `ginkgo-autumn-*.jpg`]. Sampled sunlit #D2CC33, shaded #B8942B [P] | Palace walls, avenues, Bukchon edges | `tree(kind 'ginkgo')`, a new foliage kind: **upright** armature (taller than wide, 3 forks, short limbs). Leaves **Yellow** with some **Bright Light Yellow**, no orange (that is Shanghai's plane). Trunk **Dark Bluish Gray** or Medium Nougat. A few fallen-leaf 1×1 round Yellow tiles under each tree. 2–3 trees. |
| **Korean red pine** (sonamu, *Pinus densiflora*) | Crooked, leaning trunks with **orange-red upper bark** and grey-brown lower bark; flat, layered crowns [P `red-pine-seoul.jpg`, `bugaksan.jpg`]. Bark sample #6E5241, needles #6B794D [P]. The pine "on Namsan" is in the national anthem [M]. | Bugaksan crest, Namsan, palace grounds | `tree(kind 'pine')` with **Olive Green + Dark Green** clouds and **Reddish Brown** upper trunk. Evergreen mass that holds the hills green in autumn. 3–4 small ones on the hills. |
| Zelkova (neutinamu) | Broad vase crown; the village guardian tree; orange-brown in autumn [M] | Bukchon, villages | Optional, one at most |
| Maple (danpung) | Red in late Oct–Nov on Namsan and in palace gardens [M] | Namsan slopes | **Accent only**: 1–2 Dark Red / Red leaf clusters among pines, or nothing (louder than Kyoto otherwise) |
| King cherry | Near-white bloom, early April; ~1,600–1,900 trees along Yeouido's Yunjung-ro [S]. Petals #EDE2DE → White [P] | Yeouido, Namsan road | **Spring only.** It echoes Kyoto's sakura directly. Skip in autumn. |
| Forsythia (gaenari) | Yellow spring shrub on embankments [M] | riverbanks | Spring only; skip |

## 5. Light and season

- **Climate shape** [M]: spring brings yellow dust (hwangsa) and fine-dust haze (visible in `yeouido-cherry-b.jpg` [P]); summer is the monsoon (jangma, late June–July), hot and humid; autumn (late Sept–Nov) has high, clear blue skies; winter is cold, dry and brown (`yeouido-hangang-park.jpg`, December [P]).
- **Recommended season: mid-autumn, late October to early November.** Reasons:
  1. **The ginkgo is Seoul's own tree** (the city tree, a third of street trees [S]), and late October is when it turns gold along the palace walls (`ginkgo-autumn-a.jpg`, Gyeongbokgung 2012-10-26 [P]).
  2. Autumn has the clearest skies, so dancheong and the white tower read crisply.
  3. **Spring cherry would duplicate Kyoto**, which is our sakura island. It is also a less distinctive image of Seoul than of Tokyo or Kyoto.
  4. Palace and Han life peak: hanbok visitors, picnics, cycling.
- **The cost of autumn:** Shanghai is also late autumn with gold plane trees. Keep Seoul's gold **lemon-yellow (Yellow / Bright Light Yellow), upright, 2–3 trees only**. Keep the hills **evergreen** (pine, Olive Green / Dark Green) with at most one red maple accent. The set should read "green hills, grey roofs, white tower, a few yellow trees", never an orange-red autumn island (Kyoto restraint, rule 5).
- Alternative: **early summer (May–June)**, all green. It has no echo, and dancheong pops against green, but it loses the one tree that says Seoul.
- Light: a clear, cool-blue sky and a low warm sun from the south-west in late afternoon. That lights the south-facing palace and the tower's south face for a camera standing in the south. No night mode (the fountain and the tower lights are night-only).

---

## 6. Palette (sampled → LEGO)

### 6.1 Palace (Gyeongbokgung / Gwanghwamun)
| element | sample | RGB | nearest | recommendation |
|---|---|---|---|---|
| Giwa roof field | `gwanghwamun-plaque-roof.jpg` (sunlit) | #757984 | Sand Blue (d 39) | **Dark Bluish Gray** curved tiles / roof slopes. In shade it reads near black (#2A1E1A on Bukchon). The real roof is **grey, never black or blue** [P]. |
| Ridge plaster (yangseong: white mortar on ridges and hips) | same | #E9E7F2 | White | **White** ridge and hip lines. This is the signature that tells a Korean roof from a Japanese or Chinese one [P][M]. |
| Columns, window frames (seokganju, iron-oxide red) | Gyeonghoeru red (lit) / Gwanghwamun lower band / Geunjeongjeon (shade) | #A95A4D / #866054 / #4F261C | Sand Red / Sand Red (d 16) / Reddish Brown | **Dark Red** (hue right, reads at distance) vs **Sand Red** (closest lit match). Test both on a render. **Never Red** (Kyoto's vermilion). |
| Dancheong ground: green-blue (noerok and the bright greens) | `dancheong-closeup.jpg` (lit) / Gwanghwamun eaves (shade) / Taewonjeon | #5EA47B / #172E24 / #4A885E | Sand Green (d 52) / Dark Green | **Sand Green** for rafters and bracket ground under the eaves, with **Dark Green** where the eave shadow sits. Dark Turquoise is too loud [P]. |
| Dancheong blue | `dancheong-closeup.jpg` | #414892 | Blue | **Blue** accents (1×1 round tiles, rafter-end rings) |
| Dancheong red / orange | closeup, Taewonjeon | #C0452E, #BF3422 | Dark Orange / Red | **Red** in small print-size accents only (rafter ends, bracket tips) |
| Dancheong peach / ochre | closeup | #E7C59F, #7D7249 | Light Nougat, Olive Green | Light Nougat flower dots, optional |
| Lattice / window paper band | Gwanghwamun lower band | #C8D0BB | (pale green-grey) | Sand Green or White lattice panels |
| Bakseok, terraces, base | §2 | #C2B8AA, #AF9D84, #E0E0D6 | — | **Light Bluish Gray** (White for the gate base, an option) |
| Plaque ground / letters | `gwanghwamun-plaque-roof.jpg` | #0B0B0F / #897A42 (gold in shade) | Black / gold | **Black** ground, gold letters (print colour, §7) |

**Dancheong at minifig scale [M, design note]:** the full painting is a print-scale pattern and cannot be built. Read it as **two bands**: a Sand Green under-eave band (rafters as 1×1 round plates or tiles, ends dotted Blue / White) over **Dark Red** columns. That is how photos read at distance (`gwanghwamun-2023.jpg`: dark green band under grey roof, red posts, white base).

### 6.2 Hanok (Bukchon)
| element | RGB | recommendation |
|---|---|---|
| Granite lower wall | #8E8582 | **Light Bluish Gray** (masonry bricks) |
| Brick pattern band (geometric red-brick inlay under the coping) | #935D55 | **Sand Red** |
| Plaster upper wall (shaded) | #626061 | **White** / Light Bluish Gray (the sample is in shade; the wall is white or pale) [P] |
| Timber posts, doors | #644036 | **Reddish Brown** / Medium Nougat (natural, unpainted wood — hanok are not dancheong-painted) [P][M] |
| Roof tiles | #2A1E1A (shade) | **Dark Bluish Gray**, White ridge mortar ends (sumaksae: the round end-tiles show as a row of pale discs) [P] |

### 6.3 Namsan, tower, river
| element | RGB | recommendation |
|---|---|---|
| N Seoul Tower shaft | #E6D5BC (low sun) | **White** shaft, **Light Bluish Gray** pod bands and mast [P][M] |
| Namsan forest (December, leafless) | #52596E | autumn: **Dark Green + Olive Green** (pines) with a few Yellow / Dark Red accents |
| Bugaksan forest (summer) | #656B47 | **Olive Green** + Dark Green |
| Han water | #545A61 / #797F81 / #466987 | **Sand Blue** under Trans-Clear |
| Bridge concrete | #797D84 | **Light Bluish Gray** |

### 6.4 Whole-island palette
- **Ground**: Light Bluish Gray (bakseok, walls, alley, bridge), Dark Bluish Gray (roofs, cycle path, rock shade), Green + Olive Green (park lawn, slopes), Dark Tan (turning grass), Sand Blue (water).
- **Green**: Dark Green, Olive Green (pines, hills); Green (lawn).
- **Buildings**: Dark Bluish Gray roofs with White ridges; Dark Red (or Sand Red) columns; Sand Green under-eave band; White plaster; Reddish Brown hanok timber; White tower.
- **Accents**: Yellow / Bright Light Yellow (ginkgo, max 3 trees); Blue (guards' robes, dancheong dots); Red (gatekeeper robe, one tent); Black (plaque).

### 6.5 Do not use
- **Red as a building colour.** Kyoto's torii and halls are vermilion; Korean columns are a duller iron-oxide red. Red is only for small dancheong dots and a costume.
- **Black roofs** (it reads Japanese / Chinese-imperial) and **Sand Blue / Medium Blue roofs**: the giwa is grey.
- **Bright Pink or White blossom trees**: Kyoto's sakura, and out of season.
- **Orange / Dark Orange autumn canopies**: Shanghai's planes; Prague's terracotta.
- **Magenta / pink tower lighting**: Shanghai's Pearl, and a night look (`n-seoul-tower-close.jpg` is lit pink, so use it for shape only).
- **Glass-tower colours** (Trans-Light-Blue, Pearl, Sand Blue facades): Shanghai's trio, and the Lotte tower we cut.
- **Rainbow fountain colours, neon**: night only.
- **Medium Azure / turquoise water**: tropical (Singapore).
- **Bright Green** lawns and hills.
- **Gold or Pearl Gold** as a structural colour. Gold appears only in the plaque print.

---

## 7. Lettering culture (rule 1, L2)

| object | how it is really lettered | legible at thumbnail? |
|---|---|---|
| **Gwanghwamun plaque (hyeonpan)** | **光化門 in gold-leaf brush calligraphy on a black field**, restored in Oct 2023 from black-on-white to match the late-Gojong original. The calligraphy is by Im Tae-young (1865 rebuilding) [S Korea Times 2023-10-15][P `gwanghwamun-plaque-roof.jpg`]. Read **right to left** (門化光 left to right on the board) [P]. A painted dancheong frame surrounds it [P]. In Jan 2026 the culture ministry proposed **adding** a hangul board below; no change had been made as of 2026-01-23 [S Korea Times 2026-01-23]. | **Yes**: three characters, gold on black, true to the object. **Top print candidate.** Brush (haeseo, regular script) with thick strokes, gold #C9A84C-ish on Black, `px ≥ 320`. 3 characters breaks "1–2 characters", so ask Eric; 門 alone loses the meaning. |
| Geunjeongjeon plaque 勤政殿 | Dark field with light characters, framed [P weak at this resolution][M] | Only if the throne hall goes in; it doesn't by default |
| Gatekeeper's hat badge 守門將 | Gold disc with red characters on a red hat [P `sumunjang-guard.jpg`] | No, too small; skip |
| Bukchon | Small carved-wood or painted shop boards in hangul, house-number plates; most walls carry nothing [M][P] | Mostly no. One 2-character hangul carved board on a guesthouse gate is possible (e.g. "한옥" or "북촌"), in brush or a carved-wood look |
| N Seoul Tower | No large lettering visible on the shaft in daylight photos [P]. The "N" brand is on signage at the base [M] | No; the tower is read by its silhouette |
| Hangang Park | Brown or blue park signs, cycle-path markings painted on the asphalt [M][P] | A painted bicycle pictogram on the path, maybe; no text |
| Pojangmacha tent | Hand-painted or marker **hangul menu words** in white or black on an orange or red tarp (e.g. 떡볶이, 오뎅, 포차) [M][P tent colour] | **Yes, as the second print**: 2–3 hangul syllables, marker-brush hand, White on Red. True to the object. |
| Seoul street signage | Seoul's own typefaces (Seoul Namsan / Hangang) on blue or brown signs [M] | Not needed |

**Worth printing (pick 1–2):** (1) **光化門 gold on black** (the hero plaque); (2) a **pojangmacha hangul word** on the tent, if the tent goes in. Decide Chinese characters versus "1–2 characters" with Eric.

---

## 8. Life layer (rule 6: 2–3 figures, each legible)

Parts checked against `My Lego World/vendor/ldraw-lib/ldraw/parts/*.dat` headers.

| action | why it is Seoul | reads at a glance? | props in LDraw (verified) |
|---|---|---|---|
| **Royal gate guard (sumunjang) on duty before Gwanghwamun**, holding a flag or a halberd | The guard-on-duty show runs at Gwanghwamun at 11:00 and 13:00. The full changing ceremony runs at Heungnyemun at 10:00 and 14:00, about 20 min, revived in 2002 [S][W]. Guards wear **blue robes** with black wide-brim hats; the chief wears a **red robe**, a red hat and peacock plumes [P both guard photos]. | **Yes**: costume + long pole + hat, framed by the gate | **30167** Hat Wide Brim Flat (a gat / jeonrip stand-in), **6123** Halberd, **4497** Spear, **2335 / 11055** flags. Robes = printed torso + **3678a** 65° slope 2×2×2 as a long robe skirt (an official long-dress technique [M], to verify). Colour: Blue robe (sampled #0F4479 incl. shade → Dark Blue / Blue), or Red for the chief. |
| **Visitor in rented hanbok photographing the gate or posing in a Bukchon alley** | Hanbok wearers enter the palaces free, so rentals around Gyeongbokgung are ubiquitous [W][P `hanbok-tourists.jpg`, `bukchon-alley.jpg`]. | Yes, if the skirt is a bell and the jeogori is a contrasting colour | **3678a** slope skirt (chima), printed jeogori torso, **30089a/b** camera. |
| **Chimaek picnic on the Han lawn**: a figure on a mat with a fried-chicken drumstick and a bottle | Fried chicken + beer delivered to Hangang Park is the Seoul summer and autumn evening ritual [M] | Medium: a sitting figure + mat + drumstick read; "chicken" needs the box | **33057** Turkey Leg (as a drumstick), **95228** Bottle, **33054** Mug; mat = a 4×6 tile in a colour |
| **Cyclist on the Hangang cycle path** | The riverside paths are Seoul's main cycling route [W Hangang Park] | Yes | **4719c01** Bicycle (complete), helmet **30273**? (a wide-brim helmet; verify a cycling-helmet mould) |
| Street-food vendor at a pojangmacha | Seoul street food; the red/orange tarp tent is iconic [P `street-food.jpg`] | Yes if the tent is built (an element, ~60 parts) | **79735** Chopsticks, **34172** Rice Bowl, **4529** Saucepan, **4528** Frypan |
| Couple hanging a love lock at Namsan | 82 tonnes of locks by 2018 [W] | **No**: no padlock mould found, and 1×1 parts on a fence read as clutter | — cut |
| K-pop busker in Hongdae | Hongdae busking culture [P `hongdae-busking.jpg`] | Yes (**90370** Microphone, **25975** guitar), but Hongdae is 5 km off the axis | Only if moved to the Han lawn (buskers do play there [M]) |

**Recommended three:** the **gate guard** (palace), the **hanbok visitor with a camera** (Bukchon alley, with the tower behind: sightline 4), and the **chimaek picnic** (Han lawn). The **cyclist** is the swap for the picnic if the picnic does not read in a close-up. Each is paired with a place, as in Kyoto.

---

## 9. Places: candidates and the recommended set

| place | worldwide recognition | buildable at minifig scale | echo risk | verdict |
|---|---|---|---|---|
| **Gyeongbokgung — Gwanghwamun** (gate on a granite base, 3 arched portals, two-tier roof, palace wall, haetae statues) | ★★★ the face of Seoul | Yes: a gate is a compact, symmetric hero (official-set-style roofs, SNOT eaves) | Kyoto temple? No: grey roof, white ridges, green/red bands, granite base read Korean | **Keep — hero (historic)** |
| **N Seoul Tower on Namsan** | ★★★ | Yes: round white shaft (round bricks / cylinders), a pod of dishes, mast | **Shanghai's Pearl / Paris's Eiffel** = "tall tower" class. Mitigate: on a wooded hill, never at the waterfront, no spheres, no lights | **Keep — tallest** |
| **Bukchon hanok alley** | ★★ (the image of traditional Seoul) | Very: low, wide hanok walls, giwa roofs, a sloping alley | Prague old-town lane? No (grey tile, granite, timber) | **Keep — life + texture** |
| **Han River + Hangang Park** (lawn, cycle path, bridge stub, one boat) | ★★ (the river is Seoul's spine) | Yes, cheap water plus a park strip | Shanghai river, Prague/Paris bridge. Mitigate: river as **park and leisure**, not an embankment of facades; no full bridge | **Keep — calm front** |
| **Bugaksan + Seoul City Wall** | ★ alone, but makes the palace "Seoul" (sightline 1) | Yes: a granite hill with a crenellated wall crest and red pines | none | **Keep as the backdrop (5th place)** |
| Geunjeongjeon throne hall | ★★ | Large (two-storey on a two-tier terrace): footprint competes with the gate | Kyoto hall | Alternative hero to Gwanghwamun; not both |
| Gyeonghoeru / Hyangwonjeong pond pavilions | ★★ | Yes | **Kyoto's pond + pavilion** | Cut |
| Sungnyemun (Namdaemun) | ★★ | Yes | Duplicates the gate type | Cut |
| Cheonggyecheon | ★ | A sunken stream with stepping stones | Kyoto's stream | Cut (or a tiny stepping-stone motif, no) |
| Banpo Rainbow Fountain bridge | ★★ (night) | The bridge is plain concrete by day | Shanghai/Paris river | A pier stub only, no fountain colours |
| Lotte World Tower | ★★ | A 555 m tapered glass needle | **Shanghai Tower** | Cut |
| DDP (Zaha Hadid, 2014) | ★★ to design fans | Doubly curved aluminium skin; LEGO would read as a grey slug | none | Cut |
| 63 Building, Yeouido | ★ | Gold glass slab | Shanghai | Cut |
| Pojangmacha tent | ★★ (street life) | ~60 parts, a red tarp box with clear flaps | none | Optional life-layer element |
| Myeongdong / Hongdae streets | ★★ (as experiences) | Neon and crowds, night | LA/Shanghai neon | Life layer only (busker) |

**Recommended 4 + 1:** **Gwanghwamun** (palace, hero historic), **N Seoul Tower on Namsan** (tallest), **Bukchon hanok alley**, **Hangang Park on the Han** (front), with **Bugaksan + the City Wall** as the backdrop that completes sightline 1. That is the whole N–S axis and the baesanimsu story in one island. Height table to set before building (playbook §2): tower > Bugaksan crest > Gwanghwamun > ginkgo / pines > hanok > figures [M, to fix in plates at the scheme stage].

---

## 10. Photos in this folder (38, all verified JPEG with `file`)

| file | shows | licence | author | source |
|---|---|---|---|---|
| gwanghwamun-2023.jpg | Gwanghwamun from the square, Dec 2023: pale granite base with three arched portals, two-tier roof, flanking palace wall, Bugaksan peak behind | CC0 | Huntsmanleader | https://commons.wikimedia.org/wiki/File:Gwanghwamun_December_2023.jpg |
| gwanghwamun-plaque-roof.jpg | Gwanghwamun close-up: 光化門 gold on black plaque (2023), grey giwa field, white ridge plaster, dancheong eave band, red columns | CC0 | Huntsmanleader | https://commons.wikimedia.org/wiki/File:Gwanghwamun_Close_Up_of_Roof_and_Title.jpg |
| gyeongbokgung-bukhansan.jpg | Gyeongbokgung and Cheong Wa Dae at the foot of the mountain (file title says Bukhansan; the peak shown is Bugaksan), early spring | CC BY-SA 2.0 | rabble | https://commons.wikimedia.org/wiki/File:Seoul_Gyeongbokgung_Blue_House_Bukhansan.jpg |
| gyeongbokgung-overview.jpg | Palace complex from the south: Gwanghwamun, courtyards, Geunjeongjeon, Bugaksan, Bukhansan granite peaks behind | CC BY-SA 2.0 | Ian Armstrong | https://commons.wikimedia.org/wiki/File:Korea-Seoul-Overview_of_Gyeongbokgung.jpg |
| geunjeongjeon-courtyard.jpg | Geunjeongjeon front elevation: two-storey hall on a two-tier granite terrace (woldae) with balustrade, bakseok courtyard | CC BY-SA 4.0 | Basile Morin | https://commons.wikimedia.org/wiki/File:Front_view_of_the_Eastern_side_of_the_Imperial_Throne_Hall_Geunjeongjeon_at_Gyeongbokgung_Palace_in_Seoul.jpg |
| geunjeongjeon-front.jpg | Geunjeongjeon across the bakseok courtyard (irregular granite slabs), mountains behind | CC BY-SA 2.0 | Josh Hallett | https://commons.wikimedia.org/wiki/File:Geunjeongjeon-02.jpg |
| dancheong-closeup.jpg | Dancheong rafter ends and beam paint close-up (green/blue/red/peach) | CC BY 4.0 | Huntsmanleader | https://commons.wikimedia.org/wiki/File:Gyeongbokgung_Close_up_details_2023-09-24.jpg |
| dancheong-taewonjeon.jpg | Dancheong bracket set and beam under an eave, Taewonjeon | CC BY-SA 4.0 | Ethan Doyle White | https://commons.wikimedia.org/wiki/File:Dancheong_Decoration_in_the_Taewonjeon_Hall,_Gyeongbokgung.jpg |
| gyeonghoeru.jpg | Gyeonghoeru banquet pavilion on its pond, stone pillars, Bugaksan behind | CC BY-SA 4.0 | kallerna | https://commons.wikimedia.org/wiki/File:Gyeonghoeru_Seoul.jpg |
| hyangwonjeong.jpg | Hyangwonjeong hexagonal pavilion, Chwihyanggyo bridge, pond, Bugaksan granite peak | CC BY-SA 4.0 | Basile Morin | https://commons.wikimedia.org/wiki/File:Hyangwonjeong_Pavilion_and_Chwihyanggyo_Bridge_at_Gyeongbokgung_Palace_with_blue_sky_in_Seoul.jpg |
| sumunjang-guard.jpg | Gatekeeper reenactor (red robe, red wide-brim hat with peacock feathers and 守門將 badge) before Heungnyemun | CC BY-SA 4.0 | Frank Schulenburg | https://commons.wikimedia.org/wiki/File:Royal_Guard_at_Gwanghwamun_Gate,_Gyeongbokgung,_Seoul.jpg |
| guard-ceremony.jpg | Changing of the guard: blue-robed guards with flags and weapons before the palace wall | CC BY-SA 4.0 | Ethan Doyle White | https://commons.wikimedia.org/wiki/File:Gyeongbokgung_Palace_Changing_of_the_Guard_Ceremony_2019_(4).jpg |
| hanbok-tourists.jpg | Visitors in rented hanbok by the palace wall | CC BY-SA 2.0 | Republic of Korea from Seoul, Republic of Korea | https://commons.wikimedia.org/wiki/File:Gyeongbokgung_Hanbok_01_(32928645842).jpg |
| bukchon-alley.jpg | Bukchon alley: granite-block walls, red-brick pattern band, giwa coping, timber; N Seoul Tower seen down the alley; hanbok tourist | CC BY-SA 4.0 | S h y numis | https://commons.wikimedia.org/wiki/File:Bukchon_Hanok_Village_%EB%B6%81%EC%B4%8C_%ED%95%9C%EC%98%A5%EB%A7%88%EC%9D%84_October_1_2020_15.jpg |
| bukchon-alley-flowers.jpg | Bukchon alley at sunrise: brick and stone garden walls, hanok eaves, a broad street tree | CC BY-SA 4.0 | Basile Morin | https://commons.wikimedia.org/wiki/File:Flowery_alley_lined_with_hanok_houses_and_red_rosebush_in_Bukchon_Hanok_Village_Seoul.jpg |
| view-from-n-seoul-tower-night.jpg | Seoul southward from N Seoul Tower at dusk (form only) | CC BY-SA 4.0 | kallerna | https://commons.wikimedia.org/wiki/File:N_Seoul_Tower_view_2.jpg |
| n-seoul-tower-close.jpg | N Seoul Tower shaft, pod and mast from the summit, octagonal pavilion (dusk, lit pink: shape only, not colour) | CC BY 2.0 | Eugene Lim from Hong Kong | https://commons.wikimedia.org/wiki/File:N_Seoul_Tower_(13952097192).jpg |
| namsan-han-river.jpg | Namsan with N Seoul Tower seen across the Han from the south, Dec: apartment band, double-deck bridge | CC BY-SA 3.0 | Ox1997cow | https://commons.wikimedia.org/wiki/File:Namsan_and_Han_River_2022.jpg |
| seongsu-bridge-namsan.jpg | Namsan and tower across the Han at night, Seongsu Bridge (form only) | Public domain | travel oriented from Seoul, South Korea | https://commons.wikimedia.org/wiki/File:Seongsu_Bridge_and_N_Seoul_Tower.jpg |
| namsan-locks.jpg | Love locks on the fence at Namsan summit | Public domain | Daderot | https://commons.wikimedia.org/wiki/File:Locks_atop_Namsan_-_Seoul,_Korea.jpg |
| yeouido-hangang-park.jpg | Yeouido Hangang Park from Mapo Bridge, Dec: brown dormant lawn, bare trees, 63 Building, river | CC BY-SA 4.0 | kallerna | https://commons.wikimedia.org/wiki/File:Yeouido_Hangang_Park_from_Mapo_Bridge_1.jpg |
| han-river-aerial.jpg | Han River through Seoul from the air (backlit): >1 km width, bridges, riverside roads, Namsan | CC BY-SA 4.0 | Brit in Seoul | https://commons.wikimedia.org/wiki/File:Han_River_aerial_view.jpg |
| banpo-bridge-day.jpg | Banpo Bridge by day (Oct): concrete double deck on piers, Han water close-up | Public domain | Glabb | https://commons.wikimedia.org/wiki/File:Banpo_Bridge-1.jpg |
| banpo-fountain-night.jpg | Moonlight Rainbow Fountain at night (colours are night-only; do not use) | CC0 | Wvdp | https://commons.wikimedia.org/wiki/File:Banpo_Bridge_Moonlight_Rainbow_Fountain_at_night_-_2023-08-14.jpg |
| han-bike-path.jpg | Han riverside cycle path at sunset: asphalt, yellow centre line, white edge line, railing | CC BY-SA 3.0 | 고영탁 | https://commons.wikimedia.org/wiki/File:Bicycle_path_of_Han_River,_Seoul.JPG |
| yeouido-cherry.jpg | King cherry in bloom, Yeouido, April | CC BY 3.0 | Alexey Komarov | https://commons.wikimedia.org/wiki/File:Cherry_Blossom_in_Yeouido_Park_-_panoramio_(1).jpg |
| ginkgo-autumn-a.jpg | Ginkgo gold over the palace wall coping, Gyeongbokgung, late Oct | CC BY-SA 2.0 | Korea.net / Korean Culture and Information Service (Jeon Han) | https://commons.wikimedia.org/wiki/File:Korea_October_01_(8124104915).jpg |
| ginkgo-autumn-b.jpg | Ginkgo leaves (fan shape) backlit, Gyeongbokgung, late Oct | CC BY-SA 2.0 | Korea.net / Korean Culture and Information Service (Jeon Han) | https://commons.wikimedia.org/wiki/File:Korea_October_02_(8124122384).jpg |
| ginkgo-autumn-c.jpg | Ginkgo avenue beside a stone wall, Seoul, late Oct | CC BY 3.0 | Jaeseop An | https://commons.wikimedia.org/wiki/File:Autumn_(126656567).jpeg |
| red-pine-seoul.jpg | Korean red pine (Pinus densiflora) forest in Seoul: crooked trunks, reddish upper bark | CC BY-SA 4.0 | Taewangkorea | https://commons.wikimedia.org/wiki/File:Pinus_densiflora_forest_in_Seoul,_South_Korea.jpg |
| lotte-world-tower.jpg | Lotte World Tower across the Han (candidate, rejected) | CC BY 3.0 | Ox1997cow | https://commons.wikimedia.org/wiki/File:Lotte_World_Tower_near_Cheongdam_Bridge.jpg |
| ddp.jpg | Dongdaemun Design Plaza aluminium skin at dusk (candidate, rejected) | CC0 | lumoplank | https://commons.wikimedia.org/wiki/File:Dongdaemun_Design_Plaza_-_DDP2376.jpg |
| cheonggyecheon.jpg | Cheonggyecheon: sunken stream, stepping stones, granite banks, office towers | CC BY-SA 4.0 | Basile Morin | https://commons.wikimedia.org/wiki/File:Cheonggyecheon_stream_at_sunrise_with_trees_in_Seoul.jpg |
| sungnyemun.jpg | Sungnyemun (Namdaemun) gate among office towers | CC0 | Bernard Gagnon | https://commons.wikimedia.org/wiki/File:Sungnyemun_Gate_in_Seoul.jpg |
| bugaksan.jpg | Bugaksan: Seoul City Wall crest and red pines on a dry slope, Nov | CC BY-SA 2.0 | Republic of Korea from Seoul, Republic of Korea | https://commons.wikimedia.org/wiki/File:Bugaksan_20161116_05_(30929019051).jpg |
| street-food.jpg | Pojangmacha street-food tent at night: red tarp, clear plastic flaps | CC BY-SA 4.0 | LinasD | https://commons.wikimedia.org/wiki/File:Seoul_street_food_2011_march_20.jpg |
| hongdae-busking.jpg | Busker with microphone, Hongdae | CC BY 4.0 | 달보드레 (Dalbodre) | https://commons.wikimedia.org/wiki/File:161029_%ED%99%8D%EB%8C%80_%EB%B2%84%EC%8A%A4%ED%82%B9_%EC%98%A4%EB%B8%8C%EB%A1%9C%EC%A0%9D%ED%8A%B8_%EC%9C%A4%EB%8B%AD_1.jpg |
| yeouido-cherry-b.jpg | Cherry in bloom against apartments, spring haze | CC BY 3.0 | Alexey Komarov | https://commons.wikimedia.org/wiki/File:Cherry_Blossom_in_Yeouido_Park_-_panoramio_(2).jpg |

Web sources: Wikipedia — Gyeongbokgung, N Seoul Tower, Han River (Korea), Banpo Bridge, Bukchon Hanok Village, Cheonggyecheon, Dongdaemun Design Plaza; ko.wikipedia 북악산 / 남산 (서울); Wikidata P625 / P2044 / P2048. Korea Times 2023-10-15 (plaque restoration) and 2026-01-23 (hangul-board proposal); guard ceremony listings (ktriptips, haniseoul); seoulz.com (street-tree counts; city tree 1971); Yeouido cherry counts (several festival pages, 1,641–1,886 trees).

## 11. Open points for the country page
1. **Palace hero: Gwanghwamun (recommended; the gate, the guards, the plaque) or Geunjeongjeon** (grander, but a bigger footprint and closer to Kyoto's hall)?
2. **Season: mid-autumn ginkgo (recommended) or early-summer green.** Both avoid Kyoto's cherry; autumn risks Shanghai's gold, so it stays restrained.
3. **N Seoul Tower vs. the "tall tower" echo** (Shanghai Pearl, Eiffel): accept it, with the tower kept on its wooded hill and away from the water?
4. Verify before building: Bugaksan's real summit coordinate (Wikidata looks off); column colour Dark Red vs Sand Red on a render; the plaque's 3 characters against the "1–2 characters" print rule; whether 3678a as a robe/chima is an official technique; whether any official LEGO set or LEGO Masters / Rebrickable MOC builds Gwanghwamun, a hanok or N Seoul Tower (not searched this round [M]).
