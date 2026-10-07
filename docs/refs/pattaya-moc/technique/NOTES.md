# Technique research: upswept eaves + ornate density (2026-10-06)

Target: Sanctuary of Truth at minifig scale, wood palette (Reddish Brown / Medium Nougat / Dark Brown, no gold).
Part check: LDraw = `My Lego World/vendor/ldraw-lib/ldraw/parts`; "baked" = `src/parts/ldraw/p<num>.ts` exists in lego-pattaya.

## Key observation first
Thai roofs (Jonsgard *Wat Lek*, Vestergard *Holy Redeemer Bangkok*, Miniland Wat Arun) are built with **straight** slopes.
The "upswept" read comes from (a) stacked, telescoping roof tiers, each overhanging the one below, and (b) a curled
finial at every end of every bargeboard/eave (hang hong) plus the chofa at the ridge ends. Nobody in the Thai references
curves the slope itself. The real Chinese-style sweep (80105, 71741, 21060) is a different idiom; borrow its *end piece*,
not its whole roof.

## Problem 1: upswept eaves (ranked)

1. **Curled end finial on every eave/bargeboard end** (Thai idiom; Jonsgard Wat Lek, Holy Redeemer).
   Images: `jonsgard-wat-lek.jpg` (gold curved horns at every tier end and along bargeboards),
   `bb-holy-redeemer-bangkok.jpg` (white horns = bai raka/hang hong along every gable edge).
   Parts: Bar 0.5L with curved blade 2L **87747** (baked) in a clip (plate 1x1 with clip 4081b, tile 1x1 with clip 15712,
   plate 1x2 with 2 clips 60470a baked) -> small hang hong; Flame 5L curved with bar **18395** (baked) / Viking horn
   **53451** (baked) / cow horn **13564** (baked) / flexible claw 4L with bar **11089** -> tall chofa at ridge ends.
   Attachment: bar into a horizontal clip at the eave end, rotated so the tip points up. Cheapest (1-2 parts per end), and
   the one that reads as *Thai*.
2. **Curved upturned end piece at the corners** (Chinese/Japanese idiom; 71741 temple lower roof, 21060/10315).
   Images: `ne-71741-temple-lower-roof.jpg`, `ne-asian-upturned-roof.jpg`, `ne-pagoda-plates.jpg`, `ne-pagoda-himeji.jpg`.
   Parts: Slope curved 1x3 with 1x2 inverted cutout **70681** (baked) as the lofted corner tip (stud on the tip takes a
   finial); 4x4 macaroni tile **27507** (baked) on its edge as the sagging eave fascia between corners; "Pagoda plate"
   2x2 with slope inverted corner **4190** (21060 Himeji, 10315) for small corners; Slope curved 2x1 with cutout L/R
   **29119/29120** clipped at an angle for the hips (71741 upper roof).
   Attachment: clips / plates with clips on the eave fascia (71741); 4190 sits on a single stud.
3. **Hinged roof panels, end panel at a shallower angle** (80105 Temple Fair main gate).
   Images: `bb-80105-main-5.jpg` (roof panels off the model, wedge plate under the end panel), `bb-80105-roof-1.jpg`.
   Parts: hinge plates 1x2 locking **44301a/44302a** (baked) or hinge 1x2 **3937/3938** (baked), wing/wedge plates
   2x4 **41769a/41770a** (baked) or 2x3 **43722a/43723a** under the last bay, finial at the tip.
   Each tier = 3 panels (centre + two ends) and two hinge lines; the end panel kinks up 10-15 deg -> a two-segment "curve"
   that reads as a sweep from 1 m. Also: inverted curved slopes **13547 / 42023 / 24201** (baked) as the underside
   (soffit) of the last 4-6 studs of the eave so the *underside* curves up even if the top stays stepped.

Reject: stepping 45 deg slopes up 1-3 plates (staircase; what we have). Flexible hose/tube sweeps (Monkie Kid teal) read toy-like
in wood colours and need clips every 2 studs.

## Problem 2: ornate density (ranked by "reads as carving at 1 m" per part)

Principle (Miniland Wat Arun `../miniland-my-watarun-commons.jpg`, Wat Lek): density = **rhythm**. Thin horizontal bands every
2-3 plates (a ledge/cornice of tiles or 1x1s) + one repeated motif per band. Random greebles read as noise; a repeated
1x1 motif in a band reads as carving.

1. Repeated **figure band**: Minifig statuette **90398** (baked) on studs, every 2 studs along a ledge (Miniland Wat Arun's
   yellow yaksha/garuda bands). The Sanctuary's hundreds of figures, at 1 part each.
2. **Petal / leaf rosettes**: Plate 1x1 with 5 petals **24866** (baked), plate 1x1 round with 3 leaves **32607** (baked) on
   SNOT brick faces (brick 1x1 studs 4 sides **4733**, baked) -> carved flowers / kranok flames (Wat Lek gable).
3. **Bargeboard teeth**: plate 1x1 with tooth **49668 / 15070** (baked) in a row along every gable rake = bai raka serration.
4. **Scroll bricks**: Brick 1x1 with scroll **20310** (baked) in alternating rows -> carved panel texture.
5. **Turned / ribbed columns**: Brick 1x1 round with fins **4588**, stacked with plate 1x1 round **6141** / cone **4589** (baked)
   (Wat Lek's ribbed gilt columns).
6. **Ornamental arches & fences**: Arch 2x6x5 ornamented **2145**, arch 3x6x5 ornamented **30613**, fence ornamented 1x4x2
   **19121** (baked) / with circles **5103** -> pierced carved gables and balustrades.
7. **Lever bases / ingots / grille tiles as studs-out texture**: Hinge control stick base **4592**, ingot (tile 1x2 chamfered)
   **99563**, tile 1x2 grille **2412b** (baked), Slope 50 1x1 x 2/3 quadruple **22388** (baked) -> ribbed carved friezes on
   SNOT walls (Classical Bricks Ta Prohm `classicalbricks-ta-prohm.jpg`).
8. **Curls**: Minifig whip **2488**, plant vine curled with bar **1997** in clips -> kranok scroll fretwork on gables (Wat Lek).
9. **Roof tile texture**: tile 1x1 rounded end **24246** / tile 1x1 round **98138** (baked) shingled in rows (Holy Redeemer).

## Images in this folder
ne-* (New Elementary: pagoda plate, 71741 roofs), bb-80105-* (Brothers Brick 80105), jonsgard-wat-lek.jpg (Flickr birgburg),
bb-holy-redeemer-bangkok.jpg, classicalbricks-ta-prohm.jpg.
Sources: newelementary.com/2023/07/lego-part-4109-pagoda-plate.html; newelementary.com/2021/09/lego-review-71741-ninjago-city-gardens.html;
brothers-brick.com/2020/01/10/lego-80105-...-review; brothers-brick.com/2025/01/18/whats-that-a-lego-wat;
brothers-brick.com/2024/08/28/thai-style-church-gets-the-lego-architecture-treatment; flickr.com/photos/birgburg/54262812061.
