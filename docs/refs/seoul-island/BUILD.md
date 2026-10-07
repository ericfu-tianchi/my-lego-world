# Seoul island: build notes (2026-10-06)

Scene `?scene=seoul` (`src/scenes/seoul-island.ts`), on the globe (PLACES `korea`), in `npm run gate`. Render pack script: `docs/refs/seoul-island/pack.sh <round> [shots]` (port 8160). Renders are in `build/`.

## Result
| | |
| --- | --- |
| Island | 80 × 75 studs (about 5,300 studs² inside the outline), G = 10, base 3, two bricks of earth, a capped plinth one cell outside |
| Parts | **7,866** (target 8,000), 174 types, 32 colours |
| Checks | `validate seoul` PASS; `npm run gate` green, with Gwanghwamun r7 merged (`ce48a9c`) |
| Judge | Not run: the lead's one-hour deadline came first. The r1 pack is ready for a round. |

## Layout (grid: x west → east, z north → south)
| Element | Placement | Cells |
| --- | --- | --- |
| Bugaksan + City Wall | `bugaksan(bp, 4, 0, G, [4], eaveLine)`. Peak bin x 24–27 on the gate's axis (x 26). | x 4–47, z 0–12 |
| Gwanghwamun | base NW (13, 14), assembly at (12, G, 13), retagged base/gate/roof as `ko-palace.ts` r6 | base x 13–38, z 14–25; eaves to z 26 |
| Haechi, stubs, guard | haechi at gate z 12 (z 26–29), not z 14, so the west one clears the frame; stubs x 5–12 and 39–46 (tag `palacewall`); guard at (32, 28.5), 4 × 4 stand x 30–33 | |
| Stage | `placeStage(bp, 3, 30, G, {figs:false})`. The frame centre (x 16) is 10 west of the gate's axis, and the LED face is 8 south of the gate's front. Idols via `idol()` at `STAGE_FIGS`, fans via `fan()` | x 3–28, z 30–47 |
| Bukchon | `placeBukchon(bp, 48, 6, C = 18, 6, own)`; the alley foot (C − 8) meets the street at G. Granite masonry faces on every edge that stands above the street or the plinth. Visitor at (67, 7.5) on `VISITOR_SPOT` facing south | x 48–77, z 3–23 |
| Namsan + tower | `namsan(bp, 33, 31, G, [5], eaveLine)`. Tower axis (55, 40), west of the alley (x 65–68), so from the default SSE camera it stands between the gate and the hanok and not in front of the alley | x 33–64, z 31–52 |
| Ginkgo M | axis (44, 26) by the palace's east wall, west side bare (the eave) | |
| Han | `placeHan(... z0 53 ...)` with `look.mat: false`; `picnicPair` at (37, G, 59) on the strip's mat place | z 53–74 |
| Ground | the square, forecourt and street are a hand-laid LBG slab mosaic (2×4 / 2×2 / 1×N tiles); studded plates under everything that stands; White tunnel floors flush | |

Outline: Bugaksan's straight back with the NW corner rounded; a notch behind Bukchon's back wall; then straight runs with square corners down the east side (Bukchon's wall to z 23, in to Namsan's flank at x 66, out at z 53 for the Han) and along the front. The first version used a diagonal curve on the east side, which read as a ragged stair of earth (lead r1).

## Heights achieved (plates above G)
Tower tip 106.5 ≫ Bugaksan wall 51 ≈ gate top 50 > ginkgo L C + 47 (G + 55 on the raised ground) > stage towers 46 / frame 41 > hanok ridge C + 33 > pines > figures 12.

## Element hooks added (shared files, small)
- `ko-hangang.ts`: `HanLook.mat` (`false` = leave the mat, box and gingham to `ko_picnic`).
- `ko-namsan.ts`: `namsan` / `bugaksan` take `dropPines` and `keepClear`. Namsan's NW-foot pine stood off the hill; Bugaksan's peak-front pine and its canopy leaves reached inside the gate's eave line.

## Open issues
- The stage frame and its east tower hide the gate's west half and its centre arch from the hero camera. That follows the stage spec (axis 10 east of the frame). The gate is seen through the frame from the low SSW camera (`r1-stage-through.png`).
- From the SSE camera the tower's pod overlaps part of the anchae roof.
- The square, and the strip west of the gate, are wide plain paving with no planters or street trees.
- Bugaksan's back is a dark stone wall in the NW/NE quadrant views.
- No judge round yet.

## v2 (2026-10-07): detailed to the approved blockout (LAYOUT-v2.md)
- Scene `seoul` (`src/scenes/seoul-island.ts`) at 74 × 72 with near-square corners (R 2). 8,553 parts. `validate seoul` PASS, `npm run gate` green. Render pack: `pack.sh <round>` writes to `build/v2/`; the hero is the reference's camera (az −0.32 = 5.963, el 0.38, dist 145).
- New: `seoul_tower_s` (41.5 plates on a 44-plate shoulder), `ko_frame_s` and `ko_tower_s` (the stage, top G + 16 = the gate's base), the range built with `terrain()` from ko-namsan (now exported, with a `core` colour option), and HanLook options `buoys`, `matX`, `boatX`, `lamps`, `benches`.
- Judge: round 1 scored 6.4, round 2 scored 6.6 (`judge/rounds/seoul-v2-r1.md`, `seoul-v2-r2.md`).
- Open: the range's front still reads as terraces (needs slopes on every lip, granite domes); Gwanghwamun's roofs, plaque and haechi (element r7, approved earlier; reopening it is Eric's call); the square needs furniture and a pattern; the idols share one pose; the tower's shaft (the judge wants 2 × 2, the lead wants it slender); the Trans-Brown bottles render ghostly (pipeline: trans at 0.62 opacity); the judge reads the outline as a default rectangle.
