# Seoul island v2: layout and height table v3 (blockout, 2026-10-06)

v1 scored 30/100. The gate, Bugaksan and the stage were all about one height, the tower was taller than its hill, the visitor stood out of sight, and the outline had a notch. v2 starts from a blockout (CLAUDE.md rule 13, "Layering is read from the hero camera"): scene `?scene=seoul-blockout` (`src/scenes/seoul-blockout.ts`, every number is in `BLOCK`).

Compare images: `build/v2-blockout-compare.png` (blockout | reference) and `build/v2-blockout-compare3.png` (v1 | blockout | reference).

## Hero camera
`az −0.32, el 0.38, dist 122` (r1: 132, on the wider island) (from the south-south-west, about 22° up), matched to `docs/refs/seoul-composition.png`. The camera sits closer to the SW corner, so the front edge rises gently to the right and a sliver of the west face shows. At el 0.30 the stage starts to cover the arches, and at 0.45 or above the depth spreads out much more than in the reference.

## Measured from the reference (pixels on the 1536 × 1024 image; gate height = 340 px is the unit)
| Mass | Screen position | Height relative to the gate | Notes |
| --- | --- | --- | --- |
| Gwanghwamun | centre x ≈ 0.40 of the image, width 0.37 × island | 1.00 (ridge) · base 0.40 | the axis of the composition |
| Stage frame | centred on the gate axis, width ≈ 0.83 × gate | ≈ 0.40 (top beam at the arch springing) | arch crowns show above it |
| Bugaksan peak | x ≈ 0.31, left of the gate axis | screen top 0.63 gate-heights above the ridge | broad, granite crown, the ridge runs right into Namsan |
| Namsan hill | back-right, behind Bukchon | hill ≈ tower (310 px vs 275 px) | the hill's top is at about the gate ridge on screen |
| N Seoul Tower | x ≈ 0.75 | 0.8; tip slightly above the peak on screen | the tallest point in the frame |
| Hanok (2) | mid-right on a granite terrace | 0.37 | the front one sits by the road |
| Ginkgo (2) | flanking the hanok | 0.6 | |
| Figures | visitor in front of the hanok, guard west of the gate, picnic front-left, fans in front of the stage | 0.15 | all face the camera |
| River / park / road | the front quarter; water widens to the right, lawn widens to the left | — | |

## Height table v3, round 2 (plates above the square G; island 68 × 64, G = 10, base 3)
Changes from round 1, after the lead's review: the back is **one massif** across the whole width, no longer a pyramid plus a dome. The island is narrower (76 → 68) and the gate sits further forward, so the gate dominates the middle and the square is shallow.
| Tier | Element | Footprint (studs) | Height |
| --- | --- | --- | --- |
| Hero | N Seoul Tower tip (east shoulder 39 + tower 42) | axis (56, 7), on the range's east shoulder | **81** |
| Skyline | Range crest: west 30 → 44 → **peak 75** at x 20 (behind-left of the gate axis x 27) → 54 → saddle 34 at x 43 (behind the gate's east half) → shoulder 39 (x 53–60, the tower's pad Ø 5) → 28 at the east edge | crest z 5–8; front foot at z 17 (behind the gate), z 20 (behind Bukchon), z 22 (west, behind the wall stub); back held at 0.6 × crest as a rock face | 75 |
| | Rock: the cells above 60 and the steep faces above 40; green everywhere else; the City Wall is a 3-plate grey course on the crest from x 18 to the shoulder | | |
| Historic | Gwanghwamun ridge · upper roof 38–44 · lower roof 24–30 · base 16 | base (14, 18) 26 × 12; eaves 30 wide = 0.44 × island; wall stubs x 2–14 and 40–43 | **50** |
| Low set piece | Stage: frame top · deck 3 | (16, 37) 22 × 7, centred on the gate axis, 7 studs in front of the base | **16** (= the base top; it covers the lower centre, and the arch crowns show) |
| Trees | Ginkgo ×2 | (46, 38), (64, 24), on the terrace | 33 |
| Houses | Hanok ×2: walls 9, ridge 18 | (45, 21) 12 × 9, (52, 32) 14 × 9 | 21 (terrace + 18) |
| Ground | Bukchon terrace x ≥ 43, z 18–45 | | 3 |
| Ground | Square / forecourt (depth: 7 studs gate→stage, 3 stage→path) | | 0 |
| Ground | Cycle path z 47–48, lawn widening west, bank coping | | 0 |
| Water | Han, first row z = 55 − 4x/68 | | −2 |
| Figures | visitor (50, 43) facing the camera in front of hanok 2; guard (9, 32) west of the stage; picnic (7–10, 51) on the lawn; fans (25 / 29, 45); 7 idols on the deck | | 12 |

Steps from front to back: water < park < stage 16 = gate base < hanok 21 < gate 50 < shoulder 39 + tower (tip 81) ≈ peak 75. Outline: a rounded rectangle, corner radius 7, no notch.

## Part estimate (detailed build)
Blockout r2: 4,071 parts. The range is 2,377 of them, solid, with risers in the zone colour.
| Block | Estimate |
| --- | --- |
| The range (one massif: packed solid DBG core in 2 × 8 bricks, a riser course + top plate in the zone colour, slopes on the risers, pines, scrub, granite, the City Wall) | ≈ 3,700 |
| Gwanghwamun r7 + stubs + haechi | 1,700 |
| Stage + idols + fans | 600 |
| Bukchon: 2 smaller hanok, ginkgos, terrace walls | 1,300 |
| Tower, rescaled to 42 plates (from 87) | 60 |
| Han strip + boat + picnic | 900 |
| Terrain and paving | 1,200 |
| Plinth | 130 |
| **Total** | **≈ 9,600**: over the 8,000 target, under the 10,000 cap |

Accepted by Eric through the lead: grow rather than cut quality, but stay under 10,000. The range is built as packed solid earth (the LA hollow-hill failure left parts floating). If the count runs over, the fallback is a shell on an inner stepped core where every part stands on studs.

## Departures from the reference
- **Tower tip.** It sits a little above the peak (81 vs 75), as in the reference. The east shoulder is 39, so hill ≈ tower holds. The tower is rebuilt at about half of v1's 87 plates.
- **Square depth.** 7 studs from the gate to the stage, so the stage only covers the lower centre of the base at el 0.38. Any shallower and it reaches the arch crowns.
- **Water.** The reference's high exposed earth bank and riverside pier are left out. The river stays two plates below the land, as in the series DNA.
- **Hanok.** The reference shows a red-brick kkotdam band. It is kept for the detail pass.
- **City Wall.** The reference runs it down the right flank toward the tower. Here it follows the crest from the peak to the shoulder, and the detail pass decides the route down.

## r8 (Eric's review of r7, 2026-10-07)
- **N Seoul Tower:** 58.5 plates on the 44-plate shoulder, so the tip is at G + 102.5, clearly above the peak (74). Shaft 2 × 2 round, 23 plates, with two flush ring bands; Ø4 pod 8 plates; mast in four red/white bands plus a bar.
- **Stage:** the LED wall is 10 rows tall, so its top is G + 31. The chevron face reads fully from the hero camera. It is still centred on the gate's axis, 7 studs in front of the base.
- **Square:** one tone of Light Bluish Gray slabs in regular two-stud courses; only the raised royal road on the axis is darker.
- **Plaque:** mapped to `4162|Black` (r8's 1 × 8 board). Switch to the palace worktree's `GATE_PRINTS` when it merges.

### Plan for the scaled gate (≈ 1.3×; being built in the palace worktree)
| | Now | After the merge |
| --- | --- | --- |
| Gate base | 26 × 12 at (16, 18), axis x 29 | ≈ 34 × 16, axis still x 29 → base x 12–45, front kept at z 30, so GZ ≈ 14 |
| Ridge / lower eave | G + 50 / G + 24 | ≈ G + 62–65 / ≈ G + 31 |
| Stage | 24 wide, frame z 37, top G + 31 | unchanged: centred on x 29, 7 studs in front of the base, top at or below the new lower eave |
| Range foot behind the gate (`lim`) | z 17 | GZ − 1 ≈ z 13; `underEave` widened to the new eave line |
| Peak | 74 | ≈ 86–90, so it still clears the ridge by about 20+ plates (tower tip G + 102.5 stays above) |
| Bukchon | x 44–73 | must start east of the new eave line (x ≥ 48). The smaller hanok being rebuilt should fit 26 wide; otherwise W grows 74 → 78 |
| Palace wall stubs | x 0–15 | x 0–11 |
