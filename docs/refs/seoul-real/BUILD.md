# Seoul figures — build notes (ko-life, 2026-10-06)

Builder of every Seoul minifigure and the figure-pipeline changes. Schemes: `../seoul-kpop/SCHEME.md` §5, `../seoul-hangang/SCHEME.md` §4–5, `../seoul-hanok/SCHEME.md` §4, `docs/countries/korea.md` §1.7–1.8.

## Where to look
- Scene: `?scene=ko-life&noglobe` (port 8160 in this worktree). Tags for `?only=`: `idols`, `fans`, `guard`, `visitor`, `picnic` (+ `deck`, `lawn`, `ground`).
- Hero for Eric's checkpoint: `build/r4-hero.png`. Close-ups: `build/r4-idols-close.png`, `build/r4-guard-front.png`, `build/r4-visitor-front.png`, `build/r3-picnic-front.png`, `build/r4-fans-back.png`; the rest of the pack is `build/r3-*.png` (r4 = after judge round 2).

## Exported helpers (`src/scenes/ko-life.ts`) — y is the plate level the feet (or the stand / mat) stand on
| Helper | Footprint / anchor | Height above its y | Parts |
| --- | --- | --- | --- |
| `idol(bp, x, y, z, rot, i)`, i 0…6 = scheme idol 1…7 (hair, poses, mic). `IDOL_AT[i]` = the scheme's formation feet in the stage frame | minifig2 snap: feet 2 × 1 centred on (round x, ⌊z⌋ + ½) at rot 0 | 12.5 (raised hands ≈ 13.5) | 5 each (+1 mic for i 0, 2) = 37 |
| `fan(bp, x, y, z, rot, i, hand?)`, i 0 (Medium Lavender hoodie, long hair) / 1 (DBG jacket, short hair); the stick in the outer hand by default (i 0 left, i 1 right; correct for rot 2 facing north) | as idol | lamp top ≈ 14.5 | 9 each |
| `guard(bp, x, y, z, rot)` | Plate 4 × 4 stand (LBG) whose corner is (cx − 2, cz − 1.5) at rot 0 — it covers the skirt's 2 × 2 and the woldo's butt; the figure stands on the stand (y + 1) | spear tip y + 19.25 | 8 |
| `hanbokVisitor(bp, x, y, z, rot)` | skirt 2 × 2: the tube half a stud behind the feet centre, on a grid crossing | 12.5 | 6 |
| `picnicPair(bp, x, y, z, rot)`: assembly `ko_picnic` | proxy 6 × 4 (the mat), min corner (x, z); figures face +z at rot 0; their feet reach 1.8 studs past the mat's front edge, one plate above the lawn (keep those cells free) | heads ≈ 11, hair 11.9 | 37 |

## Pipeline changes (append-only blocks, each marked "Seoul" / "ko-life")
- `minifig2` (`lib.ts`): `skirt?: string` places `fig_skirt` (36036) instead of the legs, offset half a stud back so its tube sits between four studs. Two edited lines (the option and the placement), plus `wrists?: { L, R }` (hands turned a quarter without a held part: one line in minifig2) and a `HOLD_DEFAULTS` block at the end of the file: `mic`, `lightstick_hilt`, `woldo_pole`.
- `catalog.ts`: `fig_skirt` (box = the tube's 2 × 2, anchored by the bbox, front-row studs take the torso), `hat_brimback`, hair `hair_midtousled` 25409 / `hair_sweptback` 21268 / `hair_wavy` 3277 / `hair_messy` 36762 / `hair_bun` 2633, `woldo_pole` 4497 + `woldo_blade` (3757 pre-turned in the pole's frame), `mic` 90370, `lightstick_hilt` 64567a, `ko_picnic`.
- `minifig-asm.mjs`: `HELD.fighat_brimback` (30167 turned so the pinned-up side is at the back); `HELD_AT.woldo_blade` (a held part written in its host's frame, same origin); `EXTRA_HANDS` + `uf_t0`, `du_0t`, `ud_t0`, `uu_tt` (the idols' raised hands turned in the wrist).
- `validate.ts` (affects every country; two lines, both no-ops for parts other countries use): the "stands on both feet" check also covers `fig_skirt` (one `||`), and `Object.assign(HOSTS, { woldo_blade: 'woldo_pole' })` so the clipped blade connects to (and may overlap) its pole at the same origin, as glass does in a frame. `npm run gate` stays green for every live scene.
- `check-assemblies.ts` / `check-asm-studs.ts`: the drumstick's bone and the bottle's neck in a hand's clip are joints by design (`ko_picnic`).
- r4 print tweaks (judge r2): the idols' panel Red (Dark Red on black stayed muddy), the guard's beads Bright Light Orange, the hanbok bow two bright-red loops lower on the chest.
- `prints.ts`: faces `face_ko_idol`, `face_ko_guard`; torsos `torso_ko_idol`, `torso_ko_guard`, `torso_ko_hanbok`, `torso_ko_hoodie`, `torso_ko_jacket`; the chicken-box lid `ko_chicken_box_m` (치킨 as drawn marker strokes, no font). Member copies `_m` for the picnic pair. Fans and the visitor reuse Kyoto's `face_smile` / `face_grin`. **Seoul print designs so far: 8** (2 faces, 5 torsos, box lid) + the reused Kyoto faces.
- Rebuild order after a merge: `node tools/ldraw/minifig-asm.mjs`, then `node tools/ldraw/asm-ko-life.mjs && node tools/ldraw/bake.mjs ko_picnic.ldr --force --hull`.

## Deviations from the schemes, and why
1. **Light stick held upright in a forward hand (`f`), not overhead (`u`).** The `u` clip's bore runs front–back, and a hilt lying front–back beside the raised hand ran through the head and hair (validator overlap, 4 clashes). Upright in `f`, the globe sits at head height beside the head, which is what the camera sees over the fans' shoulders.
2. **The light stick's lamp: two 1 × 1 round plates and a 1 × 1 round tile in opaque Medium Lavender, not a Trans-Purple 1 × 1 round brick.** Trans-Purple rendered as a pale frosted cup (the trans trap holds even for one 1 × 1); the tall brick with its stud read as a can (judge r2). No 1 × 1 dome mould in LDraw. Medium Lavender in 6141 / 98138 is [M].
3. **Skin Yellow for all Seoul figures** (stage scheme: Light Nougat idols; hanok scheme: Yellow). Every other set uses Yellow, and Nougat idols beside a Yellow guard and visitor would split the cast. One constant (`SKIN` in ko-life.ts) if Eric prefers Nougat.
4. **Picnic: they sit at the front edge of the mat, legs over the edge.** A seated leg is flat only round its rear hole; over any other stud it would stand on the stud. So the rear holes take the mat's front row and the legs reach out over the lawn (one plate clear); the gingham is the two rows behind them.
5. **The bottle is held out forward on a level arm (`h`), not upright (`f`).** Hanging from a seated figure's fist, the bottle ran 0.4 stud into his thigh. The level arm's clip bore runs up-back / down-forward: neck in the fist, the bottle out over his feet — a toast to the river.
6. **Drumstick 33057 is held as moulded, not turned.** Its bone is an r 4 cylinder standing up from the origin (33057.dat), so the `f` hand's vertical bore takes it without a pre-turn; it is turned half round so the meat leans out in front.
7. **Guard: woldo, not halberd; no plumes** (judge r1: the halberd read European). Spear 4497 in Red [M: colour unverified] as the pole, Crescent Blade 3757 in Flat Silver [M] clipped round the shaft under the spearhead, crescent outward. The real hat has two tall plumes; 30167 has no pin hole and no wide flat-brim hat with one exists, so no plumes. The pole's butt rests on the granite plate but is held only by the fist: the hand clip puts it 1.07 / 1.51 studs off the grid, so it cannot go into a stud.
8. **Idols: raised hands turned a quarter in the wrist** (judge r1: the two C's beside the head read as horns); legs stay one straight mould (split legs would need an assembly per idol).
9. **Hanbok torso decal is 1.9 × 1.62, not the shared 1.42 × 1.08** — the 973 runs 1.6 under the neck and the skirt's hip block sits lower than the legs' hips, so the shared rectangle left a white band between the printed chima and the skirt.
10. **Guard face has a moustache and goatee** (`face_ko_guard`; the real guards wear them) — korea.md planned a "calm" face; it replaces that slot.

## Judge
- Round 1: 7.1 (form 6.5): European halberd, hanbok waist at the hips, drumstick held by the meat, horn-like raised hands, half gingham. All fixed in r3.
- Round 2: **7.5, every dimension ≥ 7, compliance and regularity pass**; gate (8.0) not reached. Fixed after it (r4, not re-judged): lamp shape, Red panel, bead colour, bow.
- Open (not done, and why):
  - Idols' legs are one straight mould; the judge wants split mid-step legs on the lead and two wing idols (an exploded assembly per idol, ≈ 2 h) — Eric's call.
  - Beer bottle stays Trans-Brown (Korean beer bottles are brown); it renders as grey glass. Opaque brown 95228 is unverified.
  - Guard hat has no plumes: 30167 has no pin hole, and no wide flat-brim hat with one exists.
  - Decal whites and light colours render darker than the plastic (the guard's white collar reads grey): a renderer trait, every country.
  - 13 figures (9 on the stage): Eric decides the count for the island (korea.md trim order: one fan, then the guard).

## Checks
- `npx tsx scripts/validate.ts ko-life`: PASS (205 parts incl. ground 28 / deck 50 / lawn 21; figures 106: idols 37, fans 18, guard 8, visitor 6, picnic 37).
- `check-assemblies`, `check-studs`, `check-asm-studs`: PASS. `npm run gate`: green.
- Rule 8 close-ups looked at: mic handle in the fist (front, side), woldo pole in the fist and butt on the stand (front, side), camera in the hand in front of the face (front, side), hilt in the fist with the globe on its stud (front, back, side), drumstick bone and bottle neck in the fists (front, east, west, close).
