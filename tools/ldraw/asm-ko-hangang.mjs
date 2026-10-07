// Seoul · the Han front strip (2026-10-06): the Hangang Bus catamaran and the park lamp, each one assembly of real parts.
//   LDRAW_DIR=<main repo>/vendor/ldraw-lib/ldraw node tools/ldraw/asm-ko-hangang.mjs && node tools/ldraw/bake.mjs hangang_bus.ldr hg_lamp.ldr --force
// Scheme: docs/refs/seoul-hangang/SCHEME.md §3 (boat), §2.4 (lamp); build notes: docs/refs/seoul-hangang/BUILD.md.
// Frames: x along the boat (stern 0 → bow 15), z across it (0..4), y up in plates from the water's top (w); origin at the footprint's bottom centre.
import { Asm, bbox, PLATE } from './asm-ours.mjs';
const WHITE = 15, BLK = 0, BLUE = 1, DBG = 72, LBG = 71, ORANGE = 25;
const yaw0 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
const only = process.argv.slice(2); const want = (n) => !only.length || only.includes(n);
/** a round part centred on (x, z), its body's bottom at plate y */
const round = (a, id, color, x, y, z) => a.put(id, color, yaw0, [x, y * PLATE - bbox(id)[1], z]);
/** a rectangular part covering w (along x) × d (along z) from the corner (x, z), bottom at plate y: turned a quarter if its mould runs the other way */
const box = (a, id, color, x, y, z, w, d) => { const b = bbox(id); const nw = Math.round(b[3] - b[0]); return a.up(id, color, x, y, z, nw === w ? 0 : 1); };

// ---- hangang_bus: the Hangang Bus (2025), a catamaran 16 × 5, bow +x. Two 2-wide hulls (z 0–1 port, z 3–4 starboard) with a one-stud tunnel
// (z 2) under a full-width cross-deck. Livery after real-hangang-bus-b/c: a Black boot-top, White hulls with a royal Blue stern block whose
// front edge steps forward down the hull (the halftone fade, flush 1 × 1 plates), a Dark Bluish Gray strake under the deck edge, one long
// saloon with a continuous Black window band, a raised wheelhouse at its forward end with wrap-round Black glass and an Orange curved fin
// falling aft from it, white lattice railings on the open foredeck. Each bow is a stack of five wing plates 2 × 3 (taper 2 → 1, a blunt stem
// like the real one; r2: a wedge brick on a wing plate left a stepped boot-top and showed its underside — judge r1), the straight sides
// facing the tunnel, so the two bows mirror each other. r2 (judge r1): the Blue wraps up the stern — the aft deck's bulwarks and the
// saloon's aft wall — and a grille tile on the roof is the air-conditioning box.
if (want('hangang_bus')) {
  const a = new Asm('hangang_bus', [8, 0, 2.5]);
  const HULLS = [{ out: 0, inn: 1, z: 0, plate: '41770a' }, { out: 4, inn: 3, z: 3, plate: '41769a' }];   // left moulds on the port hull (straight side +z after the turn), right on the starboard
  for (const h of HULLS) {
    // boot-top (0–1): Black plates 2 × 8, 2 × 4, the wedge plate 4 × 2 under the bow
    box(a, '3034', BLK, 0, 0, h.z, 8, 2); box(a, '3020', BLK, 8, 0, h.z, 4, 2); a.up(h.plate, BLK, 12, 0, h.z, 1);
    // hull course (1–4): Blue stern block x 0–4, the fade on the outer row x 5–7 in 1 × 1 plates (r3, judge r2: one stud a level, the Blue
    // reaching furthest forward at the waterline), White to the bow: three White wedge plates 4 × 2 stacked (r3: Shanghai's proven bow mould;
    // the wing plates 2 × 3 showed a recess in each layer's angled face)
    box(a, '3001', BLUE, 0, 1, h.z, 4, 2); box(a, '3004', BLUE, 4, 1, h.z, 1, 2);
    for (const [x, cols] of [[5, [BLUE, BLUE, BLUE]], [6, [BLUE, BLUE, WHITE]], [7, [BLUE, WHITE, WHITE]]]) cols.forEach((c, k) => a.up('3024', c, x, 1 + k, h.out));
    box(a, '3010', WHITE, 5, 1, h.inn, 4, 1); a.up('3005', WHITE, 8, 1, h.out); box(a, '3622', WHITE, 9, 1, h.inn, 3, 1); box(a, '3622', WHITE, 9, 1, h.out, 3, 1);
    for (const y of [1, 2, 3]) a.up(h.plate, WHITE, 12, y, h.z, 1);
    // deck edge (4–5): Blue over the stern, the Dark Bluish Gray strake along the outer row, the White wedge plate over the bow
    box(a, '3023', BLUE, 0, 4, h.out, 2, 1); box(a, '3710', DBG, 2, 4, h.out, 4, 1); box(a, '3666', DBG, 6, 4, h.out, 6, 1); a.up(h.plate, WHITE, 12, 4, h.z, 1);
  }
  // the cross-deck (4–5) over the tunnel: White 2 × 3 plates spanning both inner rows, a 1 × 3 at the bow end; the saloon walls clamp them
  for (let x = 0; x < 12; x += 2) box(a, '3021', WHITE, x, 4, 1, 2, 3);
  // aft deck x 0–1: White tiles between low Blue bulwarks (a plate and a tile)
  for (const z of [1, 2, 3]) box(a, '3069b', WHITE, 0, 5, z, 2, 1);
  for (const z of [0, 4]) { box(a, '3023', BLUE, 0, 5, z, 2, 1); box(a, '3069b', BLUE, 0, 6, z, 2, 1); }
  // saloon x 2–11 (5–8): White corner posts and end walls, the Black window band down both sides
  for (const z of [0, 4]) { a.up('3005', BLUE, 2, 5, z); box(a, '3008', BLK, 3, 5, z, 8, 1); a.up('3005', WHITE, 11, 5, z); }
  box(a, '3622', BLUE, 2, 5, 1, 1, 3); box(a, '3622', WHITE, 11, 5, 1, 1, 3);
  // foredeck x 12–15 (5–8): lattice railings on the hulls' inner rows (the wedge plates' only studs are on their straight side)
  for (const z of [1, 3]) box(a, '3633', WHITE, 12, 5, z, 4, 1);
  // saloon roof (8–9): 2 × 10, 2 × 10, 1 × 10, bonded by the tiles and the wheelhouse above
  box(a, '3832', WHITE, 2, 8, 0, 10, 2); box(a, '3832', WHITE, 2, 8, 2, 10, 2); box(a, '4477', WHITE, 2, 8, 4, 10, 1);
  // roof top (9–10): tiles, except under the fin (x 7–8) and the wheelhouse (x 9–11) on the middle three rows
  // r3 (judge r2): the roof edge carries the stern's blue forward and breaks it into dots, as the real roof line's halftone does
  for (const z of [0, 4]) { box(a, '2431', BLUE, 2, 9, z, 4, 1); for (const x of [6, 8]) a.up('98138', BLUE, x, 9, z); for (const x of [7, 9]) a.up('3070b', WHITE, x, 9, z); box(a, '3069b', WHITE, 10, 9, z, 2, 1); }
  box(a, '2431', WHITE, 2, 9, 1, 4, 1); box(a, '2412b', WHITE, 2, 9, 2, 2, 1); box(a, '2412b', WHITE, 4, 9, 2, 2, 1); box(a, '2431', WHITE, 2, 9, 3, 4, 1); box(a, '63864', WHITE, 6, 9, 1, 1, 3);
  // the Orange fin (9–11): three curved slopes across the roof, high end against the wheelhouse, falling aft
  for (const z of [1, 2, 3]) a.up('11477', ORANGE, 7, 9, z, 3);
  // wheelhouse x 9–11 (9–11): two plate courses, the front and sides Black glass, the back White, bonded differently course to course
  box(a, '3623', WHITE, 9, 9, 1, 1, 3); box(a, '3623', BLK, 11, 9, 1, 1, 3); for (const z of [1, 3]) a.up('3024', BLK, 10, 9, z);
  box(a, '3623', WHITE, 9, 10, 1, 1, 3); for (const z of [1, 3]) box(a, '3023', BLK, 10, 10, z, 2, 1); a.up('3024', BLK, 11, 10, 2);
  // its roof (11–12): three tiles 1 × 3 straight on the glass ring (r3, judge r2: a plate and tiles made the white band over the glass too thick)
  for (const x of [9, 10, 11]) box(a, '63864', WHITE, x, 11, 1, 1, 3);
  const out = a.write(); console.log('hangang_bus:', a.parts.length, 'parts', JSON.stringify(out.bom));
}

// ---- hg_bench: a Hangang Park bench (judge r1: the pier bench read as two bricks), 4 × 2 facing +z: Dark Bluish Gray legs (Brick 1 × 2 across
// the seat at each end), a Reddish Brown Plate 2 × 4 seat, a Tile 1 × 4 for the front slats and a lattice Fence 1 × 4 × 1 for the backrest.
if (want('hg_bench')) {
  const a = new Asm('hg_bench', [2, 0, 1]); const RB = 70;
  for (const x of [0, 3]) box(a, '3004', DBG, x, 0, 0, 1, 2);
  box(a, '3020', RB, 0, 3, 0, 4, 2); box(a, '2431', RB, 0, 4, 1, 4, 1); box(a, '3633', RB, 0, 4, 0, 4, 1);
  const out = a.write(); console.log('hg_bench:', a.parts.length, 'parts', JSON.stringify(out.bom));
}

// ---- hg_lamp: a Hangang Park lamp, after real-hangang-bikepath.jpg: a tall slim grey post with a flat white LED disc. r2: the pole is LA's
// proven chain (la_lamp: a round-brick collar, a Bar 6L with stop ring standing in its hollow stud, a round-brick head collar on the bar's top
// end) — a stack of seven round bricks read as a ribbed insulator column. On the head collar's stud a round plate 2 × 2 (its centre tube)
// under a round tile 2 × 2: the smooth white disc. Footprint one stud; top at 21 plates.
if (want('hg_lamp')) {
  const a = new Asm('hg_lamp', [0.5, 0, 0.5]);
  a.up('3062b', LBG, 0, 0, 0); a.put('63965a', LBG, yaw0, [0.5, 3 * PLATE + 0.2, 0.5]); a.up('3062b', LBG, 0, 16, 0);   // collar, bar (stop on the collar's stud), head collar over the bar's top end
  round(a, '4032a', WHITE, 0.5, 19, 0.5); round(a, '14769', WHITE, 0.5, 20, 0.5);
  const out = a.write(); console.log('hg_lamp:', a.parts.length, 'parts', JSON.stringify(out.bom));
}
