// Seoul element test scene: Gwanghwamun with its palace-wall stubs (haechi cut in r8) (docs/countries/korea.md §1, docs/refs/seoul-palace/
// SCHEME.md, build notes BUILD.md). ?scene=ko-palace&noglobe ; ?only=base | gate | roof | wall (the whole gate: base,gate,roof)
// Heights are plates above the island surface G (here the test plate's top). Gate frame: x 0..33 west → east over the granite base,
// z 0..13 north → south; the assembly's footprint is the lower eave, x −1..34 × z −1..14 (tools/ldraw/asm-ko-palace.mjs, r9 ≈ 1.3× r8).
import { Blueprint } from '../core/builder';
import type { SceneMeta } from './lib';

/** Gwanghwamun r9 plan, for every scene that places `ko_gwanghwamun` (plates above the ground G it stands on; cells in the gate frame).
 *  Place with `bp.assembly('ko_gwanghwamun', X − 1, G, Z − 1, 'LightBluishGray', 0, GATE_PRINTS)` where (X, Z) is the base's NW corner,
 *  then `tagGate(bp.parts.slice(first), G)`. The mask stands on the base walls only: the tunnels stay free for floor tiles and a minifig. */
export const GATE = {
  base: [34, 14] as [number, number],                // granite base x 0..33 × z 0..13
  eave: [-1, 34, -1, 14] as [number, number, number, number],   // lower eave x0, x1, z0, z1 (strip tips ≈ 1 stud further, from plate ≈ 34 up)
  tunnels: [[5, 4], [14, 6], [25, 4]] as [number, number][],     // first x, width; all z
  axis: 17,                                          // x of the gate's axis (between cells 16 and 17)
  deck: 21, lowerEave: 35, upperStorey: 41, upperEave: 52, ridge: 62, top: 64,
};
/** the plaque's printed member (the 2×6 tile of the 2 × 8 board) → print key */
export const GATE_PRINTS: Record<string, string> = { '69729|Black': 'ko_plaque26' };
/** retag the gate's members base (granite, below the deck) / gate (parapet, storeys, bands, plaque) / roof (both roofs: the dark and white
 *  members from the lower eave up) */
export function tagGate(parts: Blueprint['parts'], G: number) {
  for (const p of parts) {
    if (!p.xform) continue; const yp = p.xform.p[1] / 0.4 - G;   // plates above G (member body centre)
    const roofy = p.color === 'DarkBluishGray' || p.color === 'White' || (p.color === 'Black' && p.key !== 'ld_3034' && p.key !== 'ld_69729');   // r10: Black strip plates (the fascia); the plaque board stays 'gate'
    p.tag = yp < GATE.deck - 0.4 ? 'base' : yp > GATE.lowerEave - 0.5 && roofy ? 'roof' : 'gate';
  }
}

export const W = 56, D = 24, G = 1;
export const GX = 11, GZ = 4;                       // the gate frame's origin in the scene

/** A palace-wall stub (궁장) or any Seoul wall with a tiled coping, 2 studs thick, running along x from (x0, z0) for `len` studs (a multiple
 *  of 2), standing on ground plate level y. Body 0–9 in two-grey masonry bricks; coping: a Dark Bluish Gray plate one stud proud both sides
 *  (9–10), cheese slopes on the outer rows facing out with two plates between them (10–12), the White mortar plate (12–13), a dark tile cap
 *  (13–14). Shared with the hanok walls of Bukchon (the body below may change; the coping is the city's). */
export function copingWall(bp: Blueprint, x0: number, z0: number, len: number, y: number, body = (x: number, k: number, z: number) => ((x * 7 + k * 3 + z * 5) % 11 === 0 ? 'White' : 'LightBluishGray')) {
  for (let k = 0; k < 3; k++) for (const z of [z0, z0 + 1]) {
    let x = x0; const off = (k + z - z0) % 2;
    if (off) { bp.part('brick_masonry_1x2', x, y + 3 * k, z, body(x, k, z)); x += 2; }
    while (x + 4 <= x0 + len) { bp.part('brick_masonry_1x4', x, y + 3 * k, z, body(x, k, z)); x += 4; }
    if (x < x0 + len) bp.part('brick_masonry_1x2', x, y + 3 * k, z, body(x, k, z));
  }
  for (let x = x0; x < x0 + len; x += 4) {
    const n = Math.min(4, x0 + len - x);
    bp.part(`plate_4x${n}`.replace('plate_4x2', 'plate_2x4'), x, y + 9, z0 - 1, 'DarkBluishGray', n === 2 ? 1 : 0);
    for (let i = 0; i < n; i++) { bp.part('cheese_1x1', x + i, y + 10, z0 - 1, 'DarkBluishGray', 2); bp.part('cheese_1x1', x + i, y + 10, z0 + 2, 'DarkBluishGray', 0); }
    for (const dy of [10, 11]) bp.part(`plate_2x${n}`, x, y + dy, z0, 'DarkBluishGray', 1);
    bp.part(`plate_2x${n}`, x, y + 12, z0, 'White', 1);
    bp.part(`tile_2x${n}`, x, y + 13, z0, 'DarkBluishGray', 1);
  }
}

export function buildKoPalace(bp: Blueprint): SceneMeta {
  bp.tag = 'ground'; for (let x = 0; x < W; x += 8) for (let z = 0; z < D; z += 8) bp.part('plate_8x8', x, 0, z, 'LightBluishGray');
  // the gate: one assembly; its members are retagged base (granite, 0–17) / gate (parapet, storeys, bands) / roof (both roofs) by height
  // and by part (the eave plates, tiles, hips and ridge belong to the roofs)
  bp.tag = 'gate'; const first = bp.parts.length;
  bp.assembly('ko_gwanghwamun', GX - 1, G, GZ - 1, 'LightBluishGray', 0, GATE_PRINTS);
  tagGate(bp.parts.slice(first), G);
  // tunnel floors: White 2×4 / 2×2 tiles on the ground in the three tunnels (the assembly's footprint leaves them free)
  bp.tag = 'base';
  for (const [x0, w] of GATE.tunnels) for (let x = x0; x < x0 + w; x += 2) { for (let z = 0; z + 4 <= GATE.base[1]; z += 4) bp.part('tile_2x4', GX + x, G, GZ + z, 'White', 0); bp.part('tile_2x2', GX + x, G, GZ + 12, 'White', 0); }
  // r8: the haechi pair is cut from the gate (Eric: crouching animals or cut after two tries; r1–r3 and r8 all read as posts at 2 × 4) —
  // ko_haechi stays baked for a later attempt at a larger footprint
  // palace-wall stubs, 8 long (r3, judge r2: 4 read as a box), on each side of the base (z 6..7), lower than the base (top G + 14)
  bp.tag = 'wall'; copingWall(bp, GX - 8, GZ + 6, 8, G); copingWall(bp, GX + GATE.base[0], GZ + 6, 8, G);
  bp.tag = ''; bp.pack();
  return { id: 'ko-palace', title: 'Gwanghwamun', caption: 'Gwanghwamun', subtitle: 'test scene', size: [W, D], center: [W / 2, 24, D / 2], camera: { az: -0.5, el: 0.3, dist: 105 } };
}
