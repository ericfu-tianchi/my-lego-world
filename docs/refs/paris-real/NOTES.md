# Paris: the real landmarks (research notes, 2026-10-03)

Facts are tagged by source:
- **[W]** English Wikipedia
- **[FR]** French Wikipedia
- **[P]** read off the photos in this folder. Measured ratios are pixel measurements from one photo and carry perspective error. Colour hexes are the median of a sampled patch, so they depend on light and white balance.
- **[M]** from memory or general knowledge, not checked against a source this round. Verify before relying on it.

LEGO colour hexes are the ones in `src/core/colors.ts`. Our palette has no Pearl Dark Gray yet; it would need adding.

Scale note: at minifig scale 1 stud ≈ 0.35 m, so every landmark here has to be heavily compressed. The real metres below are for proportions, not for counting studs.

---

## 1. Eiffel Tower (Tour Eiffel)

**Dimensions**
- Height: **330 m** with antennas (2022 measurement) [FR][W]. Base: square, **125 m** a side [W]. The distance between the outer corners of two pillars is 124.90 m, and between their inner corners **74.24 m** [FR].
- Platform heights above ground [FR]:

  | Level | Height | Ratio to total | Floor side | Ratio to base |
  |---|---|---|---|---|
  | 1st | 57.63 m | 0.17 | 70.69 m | 0.57 |
  | 2nd | 115.73 m | 0.35 | 40.96 m | 0.33 |
  | 3rd | 276.13 m | 0.84 | 18.65 m | 0.15 |
- Proportions read off `eiffel-frontal-autumn.jpg` (a long-lens shot from far away, so little perspective) [P]:
  - 1st level 0.17, 2nd level 0.36 and top platform about 0.88 of the total height. The first two match [FR]; the top platform reads a little high.
  - Base width to height is **0.37**, which matches the real 125 : 330.
  - Above the 2nd level the upper shaft is long and very thin. It makes up more than half of the total height.

**Leg curve** [P]
- The outer edge is a **concave curve**. It is **flattest (most splayed) at the ground** and grows steadily steeper with height:
  - ground → 1st level: about 72° from horizontal
  - 1st → 2nd level: about 77°
  - above the 2nd level: about 87°, nearly vertical
- The four legs are separate lattice piers up to the 1st level. Between the 1st and 2nd levels the opening between them narrows to a tall slot, a "Λ" with a flat top [P] (`eiffel-frontal-summer.jpg`). Above the 2nd level the four legs merge into a single shaft.

**Base arches**
- On each face a **decorative semicircular-segment arch** spans between the legs under the 1st level [P]. The arches are purely decorative [M].
- The arch springs low on the inner faces of the legs. Its crown reaches about half the 1st-level height [P].
- The arch is a deep girder with **lacy cast-iron scroll infill (circles and fans)**, visible in `eiffel-first-level.jpg` and `eiffel-pillar-north-structure.jpg` [P].

**1st level**
- A deep horizontal frieze band with the **72 scientists' names in gold letters** on the outward faces [FR][W][P]. The names are legible in `eiffel-first-level.jpg`: CAUCHY … MONGE.
- Below the frieze are short bracket "corbels". Above it is a glazed gallery with a flat canopy that overhangs the legs [P].
- The level reads as a **wide, flat, heavy band**, the boldest horizontal line of the tower [P].

**Lattice**
- Every leg face is made of panels with **big X-bracing**, and each panel is subdivided again into smaller Xs [P].
- Along the leg edges the box girders read as solid lines [P]. Between the 1st and 2nd levels there is a horizontal "lace" band of small X-panels under the platform [P].

**Top**
- The 3rd level is a narrow platform with a small enclosed room. Above it sits a short stack (the campanile/lantern) and then a **thin white-grey antenna mast** [P].
- In `eiffel-frontal-summer.jpg` green safety netting from a paint campaign is visible on the upper shaft. It is not part of the design [P].

**Colour**
- History: originally reddish brown. Since 1968 a bronze called "Eiffel Tower Brown" [W]; brown remains the colour [FR]. Yellow-brown in 2010 [W]. The 2019–24 campaign aimed at a "more golden" colour for the Olympics [FR].
- Painted in **three shades, darker at the bottom, lighter at the top** [W].
- Measured [P]:
  - a sunlit girder on the arch: **#8D7B6A**, a warm taupe-bronze
  - shaded members: #2D231B to #38332E
- Against the sky the whole tower reads as a dark warm brown-grey lace, lighter where the sun hits [P].
- LEGO mapping:
  - **Dark Tan (#958A73)** is the closest official colour to the sunlit bronze. It is within about 15 of the measured value on every channel.
  - **Dark Brown (#352100)** is close to the shade tone.
  - **Reddish Brown (#582A12)** is too red. That is the 1889 colour, not today's.
  - Pearl Dark Gray is too cold and neutral.
  - Recommendation: Dark Tan for the tower, with Dark Brown or Pearl Gold only as accents. What colour LEGO itself used for set 10307 is [M]: check Rebrickable before deciding.
- Three-quarter view (`eiffel-spring-34view.jpg`) [P]: the 1st-level frieze reads as a deep box, and from that angle the arches on two faces are visible at once. The silhouette is less "A"-shaped and more like a **square-based obelisk on four splayed feet**.

**Ground**
- The **Champ de Mars** runs from the tower to the École Militaire as a long axis [P] (`champ-de-mars-from-tower.jpg`):
  - a central strip of **rectangular lawn panels separated by beige paths**
  - flanked by **double rows of trees clipped into flat-sided "curtain" walls**
  - outside those, informal lawns with curving beige gravel paths
- Colours there [P]: gravel **#ECDCC8** (pale beige → Tan), lawn **#6D7C27** (olive → Green or Olive Green; not Bright Green).
- In the frontal photos the Trocadéro (Palais de Chaillot: two pale wings and a terrace) shows through the base arch, across the river [P].
- Small **cone-clipped yews** stand in a row along the lawn edge [P].
- **Signature: the splayed concave legs and the arch under a heavy 1st-level band, tapering to a needle.**

## 2. Notre-Dame de Paris

**West façade**
- Towers **69 m** [W][FR]. The tops are flat lead-covered terraces with a pierced balustrade; there are **no spires** on the towers [FR][P].
- The **north tower (left as you face the façade) is slightly wider and stronger** than the south tower [FR]. In photos the difference is barely visible [P].
- Façade width about **40–41 m** [M]. Width to tower height is about 0.6 [M].
  - In `notre-dame-west-facade.jpg` the façade reads about 1 : 1. That photo is shot from low and close, so perspective inflates the width; do not use its ratio.
  - `notre-dame-facade-2025.jpg`, taken from farther away, reads width : height ≈ 0.62 [P].
- Horizontal bands from the ground up [P][FR] (heights are shares of tower height, read off `notre-dame-west-facade.jpg`):
  1. **Three portals.** All are pointed arches with deep layered archivolts. The centre portal (Last Judgement) is the tallest. The left portal (the Virgin) has a **triangular gable** over it. This zone takes about 0.33.
  2. The **Gallery of Kings**: a horizontal frieze of **28 standing statues** in niches. The 28 is [FR] (21 of the 28 original heads were found). It is a slim band, about 0.08.
  3. The **rose window**, **9.6 m** across [FR], with paired lancet windows under each tower on either side. The Virgin's balcony runs along the bottom of this band. This zone takes about 0.21.
  4. The **open arcade gallery**: a screen of tall, thin colonnettes that crosses the whole width and links the towers. It takes about 0.14.
  5. The **two towers**, each with **two tall lancet openings** (louvred, dark). They take about 0.23, and the gap between them is open sky.
- Four strong vertical buttresses divide the façade into three bays. Small statues and pinnacles sit on the buttress offsets [P].

**Flèche (spire)**
- 96 m, a 19th-century oak-and-lead design by Viollet-le-Duc [FR], rebuilt to the same design after the 2019 fire [FR]. The cathedral reopened on 7 December 2024 [W].
- Seen from the east and the river [P] (`notre-dame-east-spire-scaffold.jpg`, `notre-dame-fleche-2025.jpg`):
  - It rises from the crossing as a **very thin, dark lead-grey needle** with crockets all along its edges.
  - At the base is an **open octagonal lantern ringed by statues** (the apostles; green copper figures on the roof slopes [M]).
  - It is topped by a gilded cockerel [W].
  - The tip stands roughly **as far again above the tower tops as the towers' own top stage** [P].
- Lead measured [P]: spire **#4E5052**, roof **#78787C**. The roof is a steep, pale-grey ridge.
- LEGO: **Dark Bluish Gray** for the spire. Light Bluish Gray or Flat Silver for the lit roof slopes.

**Body and stone**
- Roof: steep and continuous over the nave and choir. The apse end is a **rounded, pyramidal/conical hip** [P].
- **Flying buttresses** are long single-span arcs around the choir and apse, readable from the east [P]. They were used to bring rainwater down to the gargoyles [W].
- Stone [P]:
  - overcast 2025: **#C1B194**, a warm cream
  - 2014 in light: **#D4C8BE**, a greyish cream
  - The cleaned stone reads **very light cream, close to Tan, verging on off-white**.
  - LEGO: **Tan** for the walls, **Light Bluish Gray** for shaded or recessed tracery. Avoid Dark Tan; it would look like dirty pre-2019 stone.
- Doors are dark wood with **ornamental wrought-iron hinges** [P][M].
- Setting: the east end of the **Île de la Cité**, with stone quays, trees and the Seine on both sides [P]. The square in front (the parvis) is wide and paved [P].
- **Signature: two flat-topped square towers over a rose window and three pointed portals.** Seen from the side or the river, the black needle spire over the crossing.

## 3. Arc de Triomphe (de l'Étoile)

**Dimensions**
- **49.54 m high × 44.82 m wide × 22.21 m deep** [W][FR]. Ratios: height : width ≈ 1.1; depth : width ≈ 0.5.
- **Main arch** (on the wide faces): **29.19 m high × 14.62 m wide** [W][FR]. Its height is 0.59 of the total, its width 0.33 of the façade, and the opening is 2 : 1 tall.
- **Transverse arch** (on the narrow faces): **18.68 m × 8.44 m** [W][FR], about 2.2 : 1. It springs at the main impost line [P].

**Elevation, three registers** [FR][P]
1. **Piers.** Each holds one of four huge high-relief groups (18 m tall) on a raised plinth [FR], for example Rude's *Départ des Volontaires*. They sit in front of the piers on the main faces [P].
2. A **frieze band**, a horizontal sculpted procession under a projecting cornice. Under it, above the arch, are two framed relief panels on each face [P].
3. The **attic**: a tall plain block carrying **30 round shields** with victory names [W][FR], and a row of small palmettes or acroteria along the top edge [P].

**Colour, details and signature**
- Stone: Château-Landon lacustrine limestone, chosen because it **does not blacken** [FR]. Measured overcast **#C4BAB4**, a slightly warm pale grey-white [P]. At night it is floodlit gold.
- LEGO: White for the main body, with **Light Bluish Gray** for the reliefs, frieze and recesses. Tan reads too yellow for this stone.
- The inside of the arch is a coffered barrel vault with rosettes [P]. On its inner walls are engraved names [W].
- Setting: the centre of the paved Étoile roundabout. Low bollards with chains surround it [P].
- **Signature: a blocky square-ish mass, one tall round arch per face, sculpture groups on the piers and a heavy attic.**

## 4. Louvre Pyramid and Cour Napoléon

**The pyramid**
- **21.64 m high on a 35.42 m square base** [FR] ([W] says 34 m). The face angle is **51.52°** [W]. Height : base ≈ 0.61.
- **603 rhombus and 70 triangular glass panes** [W][FR]. Three faces carry 171 panes each; the entrance face has fewer [W].
- Structure: steel and aluminium, 200 t [FR].
- The pattern reads as a **diamond grid**: diagonal mullions running parallel to both sloping edges, with triangles along the edges [P]. The entrance is a low glazed notch at the base of one face [P].
- Daytime the glass reflects grey sky (**#92979A**) [P]. At night it glows warm.
- LEGO: **Trans-Clear** (or Trans-Black for grey reflection) with **Light Bluish Gray / Flat Silver** mullions.

**Around it**
- **Three small pyramids**, the same style and roughly 1/3 the height [P][W]. They stand off three sides.
- **Triangular reflecting basins** with jet fountains on three sides [W][P]:
  - The water is shallow, pale grey-green (#74786B) [P].
  - The basins have granite edges and are flush with the dark grey-beige paving [P].
- The palace around it is a U-shape of pale honey-cream stone, 3 storeys plus a high roof [P]:
  - The corner/centre **pavilions** have **tall, curved, square-domed roofs in dark slate-blue-grey (#282D32)** with sculpted dormers.
  - The long wings have arcades on the ground floor and statues in niches [P].
- The **equestrian statue of Louis XIV** (dark) stands off-axis in the court [P].
- The pyramid's apex is a little lower than the palace roof ridge seen behind it [P].
- **Signature: a sharp glass diamond-grid pyramid in front of an ornate cream palace with dark domed pavilion roofs.**

## 5. Seine banks and bridges

**Quays**
- Two levels [P] (`vert-galant-pont-neuf.jpg`, `pont-neuf.jpg`):
  - a **high street-level quay** with a stone parapet
  - a **low cobbled bank (bas-port)** at the water, reached by stone ramps or stairs
- Between the two levels is a tall sloped retaining wall of cream-grey ashlar [P].
- Trees (plane trees, poplars) line the low and high quays. **Weeping willows** grow at the island tip (Square du Vert-Galant) [P].
- Moored barges and houseboats (péniches) line the bank [P].

**Bouquinistes**
- About **900 "boîtes vertes"**, in a regulated colour called **"vert wagon"**. It is the same green as the Wallace fountains and Morris columns [FR].
- Box size: **2 m long, 0.75 m wide, 0.6 m high on the Seine side and 0.35 m on the street side** (closed, lid included). Maximum 8.6 m of boxes per stall [W].
- They sit on top of the parapet. Open, the lid swings up behind the box like a canopy; the inside is dark wood stacked with books, posters and postcards [P] (`bouquinistes-montebello.jpg`). In that photo the shaded exterior reads near-black brown (#362819). The green is from [FR], not confirmed by this photo.
- LEGO: **Dark Green**.

**Pont Neuf**
- **238 m long, 20.5 m wide** [FR]. Two arms: **7 arches** over the main channel (spans 16.4–19.4 m) and **5 arches** over the small channel [FR][W].
- The arches are nearly **semicircular to slightly elliptical** [W][P]. The thick piers have pointed cutwaters.
- Above each pier, a **half-round bastion (demi-lune)** projects out to parapet level as a rounded balcony with a stone bench [W][P].
- The cornice runs on corbels carved with **381 mascarons**, each one different [W][P].
- Black cast-iron lantern lamps on pedestals at the bastions [P]. The equestrian Henri IV statue stands at the island tip [P].
- Stone: pale cream-grey, darker and stained at the waterline. A shaded patch measured #68645A [P].

**Pont Alexandre III**
- A **single low steel arch of 107.5 m**: 160 m long overall, 45 m wide, rise-to-span 1/17 [FR]. The arch is three-hinged [FR] and about 6 m high [W].
- At its ends stand four **17 m masonry pylons** [W], each crowned by a **gilt-bronze winged Fame with a horse** [W][FR]. Gold measured #DAB77D [P] → **Pearl Gold**.
- Ornate **bronze multi-globe candelabra** stand along the white-grey stone balustrade, which has gilded details [P].
- The steel arch and spandrels are **pearl grey** with gilded garlands. The current colours were restored in 1998 [FR][P].

**Pont des Arts** [M]
- A pedestrian bridge of 7 shallow steel arches with a timber deck. No photo was taken this round.

**Water**
- Measured overcast #7C7C77 (grey-olive) and with sky reflection #959FA9 [P]. The Seine reads **grey-green to grey-blue, never bright blue**.
- LEGO: **Sand Blue** or Dark Bluish Gray for the water base, with **Sand Green** as an option. Avoid Blue and Medium Azure.

**Boats**
- **Bateaux-mouches / Vedettes**: long, low, glass-roofed tour boats in white and dark blue [P] (`pont-neuf.jpg`, `pont-alexandre-iii-invalides.jpg`).
- Péniches: dark hulls with white superstructure [P].

**Signatures**
- the bank: **green bookseller boxes on a cream stone parapet under plane trees**
- Pont Neuf: **round bastions over every pier**
- Pont Alexandre III: **gold winged horses on tall pylons**

## 6. Haussmann building, café and street furniture

**Façade grammar, bottom to top** [W]
1. Ground floor and **entresol** (mezzanine): shops, often with rusticated stone.
2. **2nd floor, the "noble" floor**, with a **balcony**, usually continuous.
3. 3rd and 4th floors: same style, with less elaborate window surrounds. Balconies are often single (balconettes) [P].
4. **5th floor: a single continuous, plain balcony.**
5. **Mansard roof at 45°**, with garret rooms and **dormer windows**.

**Rules and details**
- Façades are cut stone, typically cream Lutetian limestone. Balconies and cornices line up from building to building [W].
- The pre-Haussmann height limit was 22.41 m [W]. Under Haussmann façades were up to about 20 m on wide streets [M].
- Seen in the photos [P]:
  - balconies with **black wrought-iron railings** with scroll patterns
  - tall French windows with grey or white shutters
  - stone consoles carved as scrolls under balconies and bays
  - roofs of **grey-blue zinc** (#686F83) with dormers and **chimney stacks topped by rows of terracotta pots** (`haussmann-59-bd-haussmann.jpg`)
- Measured [P]: sunlit stone **#C8B092** → **Tan**. Roofs → **Dark Bluish Gray**, or **Sand Blue** for the bluer zinc look. Railings → Black.

**Café**
- From `cafe-deux-magots.jpg` [P]:
  - **dark green awnings** (#01393E → Dark Green) with the name in gold letters and a scalloped gold fringe
  - rows of **woven rattan bistro chairs** (cream-yellow, #E3CB92 → Tan, with green weave bands), **all facing the street**
  - **small round marble-top tables** on a single pedestal
  - a waiter in a black waistcoat and white apron
- Café awnings in red and dark red are also common [M]. Deux Magots happens to be green.

**Wallace fountain**
- Large model: 2.71 m and 610 kg, cast iron, **dark green** [W]. The same "vert wagon" [FR].
- Structure [P][W]: an octagonal pedestal → **four caryatids** back to back → a small fish-scale **dome** with a finial spike. Green measured #3C523C → **Dark Green**.

**Morris column**
- Green cast iron [FR], measured #1A3026 → **Dark Green** [P].
- Structure [P][FR]:
  - a cylinder carrying posters
  - a fluted base ring
  - a **hexagonal canopy** with lion heads at the corners and the word "SPECTACLES" on the frieze
  - a fish-scale **onion-ish dome** with a finial

**Guimard Métro entrance** (Abbesses, which has a glass canopy) [P]
- **Green cast-iron** plant-stem posts (#43564E → Dark Green, slightly lighter than the Wallace green).
- A fan-shaped glass canopy.
- A cream-yellow enamel sign (#BBB88A) with **"METROPOLITAIN" in dark green Art Nouveau letters**.
- Twin **amber/orange lamps** on curved stalks. The Abbesses photo shows white/amber bulbs at the stair railing; the classic tall red-orange "eye" lamps are on the canopy-less entrances [M].
- A green iron railing with shield motifs.

**Lamp posts**
- Black/very dark green cast iron, fluted shafts, ornate bases, lantern heads [P] (`pont-neuf.jpg`, `lamp-pont-neuf.jpg` (Marville, 19th c.), `pont-alexandre-iii-pillar.jpg`).
- LEGO: Black.

**Signature**: cream stone, black iron balconies, grey zinc roof with chimney pots; a green awning with chairs facing the street.

## 7. Sacré-Cœur, Montmartre

- **Château-Landon travertine** [W], the same stone as the Arc. It exudes calcite in rain, so it stays **exceptionally white** [W]. Measured on the shaded dome **#B3ACA2** [P]. LEGO: **White**.
- Massing [P]:
  - a large **elongated (egg-shaped) central dome** with a ribbed scale pattern
  - a colonnaded drum and a **lantern with a cross**
  - **two smaller domes on square towers** flanking it
  - smaller turret domes between them
  - a triple-arched portico with **two bronze equestrian statues** (Joan of Arc, Saint Louis [W]). The statues read green-patina [P] → Sand Green.
- Below it: terraces and balustrades over arched retaining walls, then the long stairs and lawns of the butte [P].
- **Signature: a cluster of white egg-shaped domes on a hill.**

## 8. Trees and ground

**Trees**
- **Plane trees (platanes)**: mottled cream-grey-olive bark and a broad, high canopy [P] (`metro-abbesses-guimard.jpg`, `pont-neuf.jpg`). Mid-green summer foliage.
- **Horse chestnuts** [M]: denser, darker canopy, with white flower candles in spring.
- **Paulownia** (purple blossom) near the tower in spring [P] (`eiffel-spring-34view.jpg`).
- Along the Champ de Mars and the Trocadéro, trees are **clipped into flat-faced rectangular "curtains"** (tree walls with a flat top and vertical sides) [P]. This is a distinctly French formal look and a gift for bricks. Small **cone-shaped clipped yews** also appear [P].

**Ground**
- Park paths are **stabilised beige sand/gravel**, measured #ECDCC8 → **Tan** [P].
- Quays: grey granite setts → Dark Bluish Gray / Light Bluish Gray [P].
- Streets and pavements: grey asphalt and large grey stone slabs [P].
- Tree pits have **round cast-iron grilles** [P] (`wallace-fountain.jpg`).
- Lamp posts: black or dark green [P].

---

## Colour summary → LEGO

| Element | Measured [P] | LEGO colour |
|---|---|---|
| Eiffel Tower | #8D7B6A sun / #2D231B shade | **Dark Tan** (main); Dark Brown accents; not Reddish Brown |
| Notre-Dame stone | #C1B194–#D4C8BE | **Tan**; Light Bluish Gray tracery |
| Notre-Dame lead spire / roof | #4E5052 / #78787C | Dark Bluish Gray / Light Bluish Gray |
| Arc de Triomphe, Sacré-Cœur | #C4BAB4 / #B3ACA2 | **White** + Light Bluish Gray |
| Haussmann stone | #C8B092 | **Tan** |
| Zinc mansards | #686F83 | Dark Bluish Gray or **Sand Blue** |
| Louvre pavilion roofs | #282D32 | Dark Bluish Gray / Black |
| Street iron (balconies, lamps) | near-black | Black |
| Wallace / Morris / Guimard / bouquinistes / café awning | #1A3026–#43564E, #01393E | **Dark Green** |
| Gilding (Pont Alexandre III Fames, Eiffel names) | #DAB77D | **Pearl Gold** |
| Seine | #7C7C77 / #959FA9 | Sand Blue / Dark Bluish Gray / Sand Green |
| Park gravel | #ECDCC8 | Tan |
| Lawn | #6D7C27 | Green or Olive Green |

## Official / reference LEGO builds to look up (all [M], not checked this round)

- 10307 Eiffel Tower (2022, 149 cm)
- 21044 Architecture Paris skyline
- 21036 Arc de Triomphe
- 21061 Notre-Dame de Paris (2024)

Check each set's colours and techniques on Rebrickable before borrowing anything.

## What this means for the build

Keep these proportions:
- **Eiffel Tower**:
  - base width : height ≈ 0.38
  - 1st level at 0.17 of the height, 2nd at 0.35
  - the concave leg curve, flattest at the ground
  - the base arch rising to about half the 1st-level height
  - Compressing the height is fine. Flattening the curve into a straight-sided pyramid is not: the curve and the heavy 1st-level band are the identity.
- **Notre-Dame**:
  - façade width : tower height ≈ 0.6
  - five stacked bands: portals 1/3, kings, rose, arcade, towers
  - flat-topped towers
  - the dark needle spire at the crossing, about 1.4× tower height
- **Arc de Triomphe**: about 1.1 : 1 (height : width); arch opening 2 : 1 and a third of the width; the attic band is about 1/6 of the height.
- **Louvre Pyramid**: height : base ≈ 0.61.

Colours:
- Paris is **cream + grey-blue + dark green + one bronze tower**.
- Avoid:
  - Reddish Brown for the tower
  - bright Blue or Medium Azure water
  - Bright Green lawns
  - red-tile roofs (that is Prague, not Paris)
  - Dark Tan stone (dirty pre-restoration look)
- Gold only as small accents: the Pont Alexandre III Fames, the cockerel, the frieze names.
- Dark Green street furniture repeated in small doses (bouquiniste boxes, a Wallace fountain, a Morris column, an awning) is the cheapest way to read "Paris" at minifig scale.

---

## Photo sources (Wikimedia Commons, 1280 px thumbnails, downloaded 2026-10-03)

| File | Commons title | Author | Licence | Source |
|---|---|---|---|---|
| `arc-de-triomphe-2023.jpg` | The Arc de Triomphe in 2023.jpg | Sanjay ach | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:The_Arc_de_Triomphe_in_2023.jpg |
| `arc-de-triomphe.jpg` | Arc Triomphe.jpg | Benh LIEU SONG | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Arc_Triomphe.jpg |
| `bouquinistes-montebello.jpg` | Paris 75005 Quai de Montebello Bouquinistes 20071014.jpg | Benh LIEU SONG | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Paris_75005_Quai_de_Montebello_Bouquinistes_20071014.jpg |
| `cafe-deux-magots.jpg` | Les Deux Magots, 25 September 2019.jpg | Cheng-en Cheng from Taichung City, Taiwan | CC BY-SA 2.0 | https://commons.wikimedia.org/wiki/File:Les_Deux_Magots,_25_September_2019.jpg |
| `champ-de-mars-from-tower.jpg` | Champ de Mars from the Eiffel Tower - July 2006 edit.jpg | Diliff, edited by Fir0002 | CC BY 2.5 | https://commons.wikimedia.org/wiki/File:Champ_de_Mars_from_the_Eiffel_Tower_-_July_2006_edit.jpg |
| `eiffel-first-level.jpg` | Tour Eiffel 1er étage vu du Champ de Mars.jpg | Jebulon | CC0 | https://commons.wikimedia.org/wiki/File:Tour_Eiffel_1er_%C3%A9tage_vu_du_Champ_de_Mars.jpg |
| `eiffel-frontal-autumn.jpg` | Tour Eiffel vue du Champ-de-Mars.jpg | Jebulon | CC0 | https://commons.wikimedia.org/wiki/File:Tour_Eiffel_vue_du_Champ-de-Mars.jpg |
| `eiffel-frontal-summer.jpg` | Tour Eiffel Wikimedia Commons.jpg | Benh LIEU SONG | Public domain | https://commons.wikimedia.org/wiki/File:Tour_Eiffel_Wikimedia_Commons.jpg |
| `eiffel-pillar-north-structure.jpg` | Structure Tour Eiffel pilier nord.jpg | Jebulon | CC0 | https://commons.wikimedia.org/wiki/File:Structure_Tour_Eiffel_pilier_nord.jpg |
| `eiffel-spring-34view.jpg` | Paris - The Eiffel Tower in spring - 2307.jpg | Jorge Royan | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Paris_-_The_Eiffel_Tower_in_spring_-_2307.jpg |
| `haussmann-59-bd-haussmann.jpg` | Immeuble 59 boulevard Haussmann Paris 1.jpg | Chabe01 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Immeuble_59_boulevard_Haussmann_Paris_1.jpg |
| `haussmann-building-047.jpg` | Haussmannian apartment building in Paris 047.jpg | Vania Teofilo | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Haussmannian_apartment_building_in_Paris_047.jpg |
| `haussmann-immeuble.jpg` | Immeuble haussmannien à Paris (52169315349).jpg | besopha | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:Immeuble_haussmannien_%C3%A0_Paris_(52169315349).jpg |
| `lamp-pont-neuf.jpg` | Réverbère, Pont-Neuf, 6ème arrondissement, Paris. PH1656.jpg | Marville, Charles (Charles-François Bossu, dit) (17–07–1813 - 01–06–1879), photographe | CC0 | https://commons.wikimedia.org/wiki/File:R%C3%A9verb%C3%A8re,_Pont-Neuf,_6%C3%A8me_arrondissement,_Paris._PH1656.jpg |
| `louvre-courtyard-pyramid.jpg` | Louvre Museum Wikimedia Commons.jpg | Benh LIEU SONG (Flickr) | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Louvre_Museum_Wikimedia_Commons.jpg |
| `louvre-pyramid-fountain.jpg` | Paris 75001 Cour Napoléon Louvre Fontaine de la Pyramide 01.jpg | Kapsuglan | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Paris_75001_Cour_Napol%C3%A9on_Louvre_Fontaine_de_la_Pyramide_01.jpg |
| `metro-abbesses-guimard.jpg` | Paris (75018) Métro Abbesses Édicule Guimard.jpg | Alexander Baranov from Montpellier, France | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:Paris_(75018)_M%C3%A9tro_Abbesses_%C3%89dicule_Guimard.jpg |
| `morris-column-1860s-marville.jpg` | Colonne Morris, avenue de l'Observatoire, 14ème arrondissement, Paris. PH4157.jpg | Marville, Charles (Charles-François Bossu, dit) (17–07–1813 - 01–06–1879), photographe | CC0 | https://commons.wikimedia.org/wiki/File:Colonne_Morris,_avenue_de_l%27Observatoire,_14%C3%A8me_arrondissement,_Paris._PH4157.jpg |
| `morris-column-2020s.jpg` | Paris 16e Colonne Morris 717.jpg | GFreihalter | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Paris_16e_Colonne_Morris_717.jpg |
| `notre-dame-east-spire-scaffold.jpg` | Notre-Dame de Paris 01.jpg | FreCha | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Notre-Dame_de_Paris_01.jpg |
| `notre-dame-facade-2025.jpg` | Notre Dame Cathedral in Paris July 2025.jpg | Dmarcovitz | CC0 | https://commons.wikimedia.org/wiki/File:Notre_Dame_Cathedral_in_Paris_July_2025.jpg |
| `notre-dame-fleche-2025.jpg` | Flèche de Notre-Dame de Paris, novembre 2025 07.jpg | Ibex73 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Fl%C3%A8che_de_Notre-Dame_de_Paris,_novembre_2025_07.jpg |
| `notre-dame-south-side-2014.jpg` | Paris, Notre Dame -- 2014 -- 1477.jpg | Dietmar Rabich | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Paris,_Notre_Dame_--_2014_--_1477.jpg |
| `notre-dame-west-facade.jpg` | Notre-Dame de Paris, facade.jpg | Gerda Arendt | CC0 | https://commons.wikimedia.org/wiki/File:Notre-Dame_de_Paris,_facade.jpg |
| `pont-alexandre-iii-invalides.jpg` | Pont-Alexandre-III-et-Invalides.jpg | Dimitri Destugues | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Pont-Alexandre-III-et-Invalides.jpg |
| `pont-alexandre-iii-pillar.jpg` | Paris, Pont Alexandre III -- 2014 -- 1316.jpg | Dietmar Rabich | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Paris,_Pont_Alexandre_III_--_2014_--_1316.jpg |
| `pont-neuf.jpg` | Pont Neuf - Paris - France.jpg | Sumit Surai | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Pont_Neuf_-_Paris_-_France.jpg |
| `sacre-coeur.jpg` | Basilique du Sacré-Cœur de Montmartre - Paris - GT-01 - 2024.jpg | Terragio67 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Basilique_du_Sacr%C3%A9-C%C5%93ur_de_Montmartre_-_Paris_-_GT-01_-_2024.jpg |
| `vert-galant-pont-neuf.jpg` | Square du Vert-Galant and Pont Neuf, Paris 11 July 2014 002.jpg | Connie Ma from Chicago, United States of America | CC BY-SA 2.0 | https://commons.wikimedia.org/wiki/File:Square_du_Vert-Galant_and_Pont_Neuf,_Paris_11_July_2014_002.jpg |
| `wallace-fountain.jpg` | Sir Richard Wallace drinking fountain, Paris May 2014.jpg | David McSpadden from Daly City, United States | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:Sir_Richard_Wallace_drinking_fountain,_Paris_May_2014.jpg |
