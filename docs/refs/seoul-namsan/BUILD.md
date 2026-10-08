# N Seoul Tower · Namsan · red pine · City Wall · Bugaksan — build notes
2026-10-06 · r4 (after the lead's review) · scenes `?scene=ko-namsan-hill&noglobe` (Namsan + tower), `?scene=ko-bugaksan&noglobe`, `?scene=ko-namsan&noglobe` (both) · tags `tower`, `namsan`, `pine`, `wall`, `bugaksan`, `scrub` · code `src/scenes/ko-namsan.ts`, `tools/ldraw/asm-ko-namsan.mjs`, `sonamu()` at the end of `src/scenes/lib.ts` · scheme `SCHEME.md`

## What was built
| Element | Parts | Footprint | Height (plates above G) |
| --- | --- | --- | --- |
| N Seoul Tower (`seoul_tower`, exploded, 56 real parts) | 56 | Ø8 ring, box 8 × 8, axis at hill-local (22, 9) | foot T = G + 20, pod 42–58 above T, tip **T + 86.5 = G + 106.5** (5.3 × the hill) |
| Namsan hill + plateau + 9 pines + canopy / scrub + 2 maples + wall run (4 modules) | **≈ 969** (scene 1,020 − 51 test plates) | **32 × 22** (dome, corners rounded) | plateau **+20**, treads +2 … +17 |
| Bugaksan + wall (11 modules) + 5 pines + canopy / scrub | **≈ 892** (915 − 23) | **44 × 10**, 13 deep at the peak (x 14–29) | crest 17 → 44 (peak, x 20–23) → 38 → east shoulder 29 / 26 / 26 / 23; wall top +51 |

## r4 — the lead's calls (2026-10-06)
1. **`sonamu` kind exception: a 1 × 1 round trunk** (precedent: LA `palm`) — Dark Brown base segment, Reddish Brown above, on a 2 × 2 jumper's centre stud; each fork a 2 × 2 round plate on the trunk's stud, four corner limbs, a 2 × 2 jumper on their inner ends carrying the next segment. The 2 × 2 trunk read as a baobab beside the tower's 2 × 2 shaft. Every side where the ground rises within the crown's reach is left bare; leaves never fan toward a bare side (leaf rot → fan direction fixed: rot 0 +z, 1 −x, 2 −z, 3 +x).
2. **Namsan taller**: plateau +20, a rounded dome (west flank ≈ 3 studs a tread, the camera's south face ≈ 1.3 with granite patches, north and east steeper). Wall bins now +5 / +8 / +11 / +14, its top level with the summit. Nine small pines (1 M, 1 S, 7 XS) on forced level 2 × 2 seats, no riser cover under their pads.
3. **Cheap fixes**: base roof = a White 6 × 6 round plate inside four 4 × 4 corner-round macaroni tiles (`27507`, rim r 3–4: no exposed studs on the rim); mast = five 1 × 1 round bricks, then three open-stud rings on a red bar 4L (thinner tip); Bugaksan's steep front quantised to 6-plate risers on 2-deep treads, each covered by a 65° slope or a granite dome (brick + plate + curved slope).
4. No summit life (figures are elsewhere; love locks stay out).

## r5 — the lead's last pass (2026-10-06, no judge run)
1. **No pot under the pines**: the 2 × 2 jumper that carries the 1 × 1 trunk's half-stud offset is in the ground colour (Dark Green, `sonamu(..., ground)`), not Dark Brown.
2. **Namsan reads as wood**: a low canopy — a 3-leaf plate and a 4 × 3 leaf lying downhill — on slope backs and on the lips of bare treads, hanging over the riser below, wherever its footprint (4 downhill, ±1 across) has no higher ground, cover or wall (`terrain({ canopy })`; Namsan 0.95, Bugaksan 0.4). Pine seats now take a 4 × 4 cell; the next ring takes no riser cover but may grow leaves. ≈ +100 parts.
3. **Granite gathered** on one rocky face toward the camera: the south face under the tower (an ellipse x 18–27, z 13–19), as curved-slope domes; the rest of the hill is green.

## For the island stage
- `namsan(bp, ox, oz, G)`: hill-local (0, 0) at world (ox, oz); columns stand on the studs at plate G (the island surface top). Occupies 32 × 22 minus rounded corners (`namsanH(x, z)` → null outside). Tower axis = (ox + 22, oz + 9); tower proxy box x ox+18..ox+25, z oz+5..oz+12, from G + 20. Returns the claimed cell set.
- `bugaksan(bp, ox, oz, G)`: local z 0 = the island's back edge, camera at +z; x 0..43; depth 10, 13 behind x 14–29. Peak bin x 20–23 = put the gate's axis there.
- `cityWall(bp, x0, z, modules, treadOf)` (exported): modules along +x, outer face +z, each needs 4 level cells (throws). To descend Namsan's spur westward to the gate, continue it on 4-stud level treads.
- `sonamu(bp, x, y, z, 'XS' | 'S' | 'M' | 'L', reserve?, turn, skip?, ground)`: tag `pine`, axis = a grid corner, 1 × 1 trunk on a 2 × 2 jumper in the `ground` colour. Pass every uphill side as `skip` (`uphillDirs` in ko-namsan.ts); pads never fan toward a skipped side.
- Assembly id: `seoul_tower` (catalogue entry at the end of `catalog.ts`; re-bake: `node tools/ldraw/asm-ko-namsan.mjs && node tools/ldraw/bake.mjs seoul_tower.ldr --force --hull`). New baked mould: `3706` (Technic Axle 6); `27507` was already baked.

## Deviations from the scheme (and why)
1. **Hill 32 × 22, not 28 × 22.** The wall needs level 4-stud treads; four bins (+2, +5, +8, +11) on the west spur at 4 studs per tread put the plateau at x 16. Plateau 12 × 10 as drawn.
2. **Shaft 24 plates (8 round bricks), not 18**; tip G + 106.5 with the +20 plateau (height table 96). Judge r1: 18 read short beside Miniland. Pod bottom now 0.47 H.
3. **Pod glass Black, lower and upper drum** (scheme: Dark Bluish Gray), glass rows 2 plates / floors 1 (the scheme's own fallback): 1:1 grey stripes read as a striped drum.
4. **Pines.** No `L` on Namsan (its crown hit the tower and dwarfed it); r4: Namsan 1 M + 1 S + 7 XS, Bugaksan 4 XS + 1 S (new `XS` size, forced perspective). Pads: 4 × 3 leaves, sideways on upper tiers (6 × 5 outward made 18-stud crowns). Trunk all Reddish Brown over a Dark Brown base: the Dark Orange top segment read as a painted band. Olive Green dropped everywhere: it renders khaki-yellow; Green + Dark Green instead.
5. **Granite as domes**: a plate + curved slope (2 × 1 / 3 × 1) on 3-plate risers, not `15068` (not baked; not needed).
6. **North and east faces of Namsan, Bugaksan's front**: 1-deep treads keep bare riser courses where no slope fits (granite-coloured on the north face).
7. **Pipeline**: `scripts/check-assemblies.ts` INTERLOCK `4032a|4285b` and `11213|27507` (two lines): the webbed dish's lip hangs a plate below its seat, far outside the Ø2 spacer; the roof's macaroni tiles ring the 6 × 6 plate flush — in both cases the parts' square boxes overlap where the round parts do not. The axle is `3706` (already in BARS), not `44294`.

## Judge
r1 **6.6** (tower short, grey stripes, pines too big, Bugaksan a stepped pyramid) → fixed above. r2 **6.8**: tower proportion now passes (silhouette); upper drum still grey → made Black after r2. Its remaining asks: cap the exposed studs on the pod ring / base roof with round tiles, taper the mast further, break Bugaksan's stair face into larger granite masses with a long low east shoulder. Below 8 mainly because of three scheme-level choices it flags for Eric: the 2 × 2 tree trunk (as thick as the tower shaft), no life on the summit, hill only +14.

r3 **6.9** (upper drum Black, Bugaksan east shoulder lowered, wider face noise): dimension 2 now 8; remaining cheap fixes = round-tile caps (≈ +0.15), mast taper, curved slopes between Bugaksan's granite steps. The judge estimates ≈ 7.2 even with all three: dimensions 4 (life) and 7 (composition) sit at 5.5–6.5 because of the scheme decisions below.

r4 (after the lead's pass) **7.2**: silhouette 8, form 8, technique 7, life 6 (by decision), colour 7.5, finish 6.5, composition 7.5, buildability 7.5. Not at the bar: dimension 4 (no summit life, the lead's call) and 6. The judge's remaining items, not done (the lead closed the loop): cap the studs inside the base roof, on the pod ring and the upper drum with round tiles; base glass band Black like the pod; the 2 × 2 round-plate forks look heavy on a 1 × 1 trunk (bar + clip limbs); Bugaksan's west wall steps still even.

**Decision for Eric:** allow a 1 × 1 round-brick trunk for background / tower-scale pines (rule 11 mandates 2 × 2)? Secondary: summit life (love-lock railing) and a taller hill, both cut / fixed by the signed-off scheme.

## Renders (`build/`)
hero.png (checkpoint shot, r4), bugaksan.png (r4), pine-close.png (r4), pod-close.png (r4: base building), tower-sil.png and wall-front.png (r2/r3 state, mast and hill since changed), wall-close.png, top-namsan.png, namsan-back.png, bugaksan.png, pine-L-close.png / pine-r4.png (pine risk test).

## Open issues
- Exposed studs remain inside the base roof's rim and on the pod's ring (no round tile of the right size).
- Bugaksan's front is still a regular stair in places.
