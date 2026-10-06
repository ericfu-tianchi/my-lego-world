// Germany · masonry helper for the Neuschwanstein build (2026-10-05). Walls are drawn as a map of plate cells and laid by our own run packer
// (the scene packer breaks one-stud walls into 1×1 bricks — notreDame, round 1), then arched windows are carved into the façades.
// Copied from the run packer in paris-notredame.ts and generalised so several buildings share it.
type Part = (key: string, lx: number, y: number, lz: number, color: string, lrot?: number) => void;
type Cell = { c: string; k: 'brick' | 'plate' };

/** quarter turn r of a part whose canonical half-arches point at `canon` (unit [dx, dz] vectors), so that they point at `want`. The rotation is
 *  the renderer's: r quarter turns about +y take (x, z) to (cos·x + sin·z, −sin·x + cos·z) with (cos, sin) = (1,0), (0,1), (−1,0), (0,−1). */
export function turnTo(canon: [number, number][], want: [number, number][]) {
  for (let r = 0; r < 4; r++) {
    const cs = [1, 0, -1, 0][r], sn = [0, 1, 0, -1][r];
    const got = canon.map(([x, z]) => [cs * x + sn * z, -sn * x + cs * z]);
    if (want.every(([a, b]) => got.some(([x, z]) => x === a && z === b)) && got.length === want.length) return r;
  }
  throw new Error(`no turn gives ${JSON.stringify(want)}`);
}

export function mason(part: Part, y: number) {
  const M = new Map<string, Cell>();
  const K = (x: number, h: number, z: number) => `${x}|${h}|${z}`;
  /** fill an inclusive box of cells over a half-open plate range [h0, h1) */
  const wall = (x0: number, x1: number, z0: number, z1: number, h0: number, h1: number, c: string, skip?: (x: number, h: number, z: number) => boolean) => {
    for (let x = x0; x <= x1; x++) for (let z = z0; z <= z1; z++) for (let h = h0; h < h1; h++) if (!skip?.(x, h, z)) M.set(K(x, h, z), { c, k: 'brick' });
  };
  const plates = (x0: number, x1: number, z0: number, z1: number, h: number, c: string) => { for (let x = x0; x <= x1; x++) for (let z = z0; z <= z1; z++) M.set(K(x, h, z), { c, k: 'plate' }); };
  const clear = (x0: number, x1: number, z0: number, z1: number, h0: number, h1: number) => { for (let x = x0; x <= x1; x++) for (let z = z0; z <= z1; z++) for (let h = h0; h < h1; h++) M.delete(K(x, h, z)); };
  const has = (x: number, h: number, z: number) => M.has(K(x, h, z));
  /** a hollow rectangular shell: the four walls of the box x0..x1 × z0..z1 */
  const shell = (x0: number, x1: number, z0: number, z1: number, h0: number, h1: number, c: string) => {
    wall(x0, x1, z0, z0, h0, h1, c); wall(x0, x1, z1, z1, h0, h1, c); wall(x0, x0, z0 + 1, z1 - 1, h0, h1, c); wall(x1, x1, z0 + 1, z1 - 1, h0, h1, c);
  };
  /** Arched windows in a straight wall. `along` 'x' or 'z'; the wall line is at `at` (z for 'x', x for 'z'), `out` the outward sign; `open`
   *  the along-coordinates of the openings; the opening is 3 plates (row A, from h) plus 3 plates under the arch (row B). Row B's piers next to
   *  an opening are half-arch bricks: a pier between two openings is the two-sided 38583, a pier with one opening the 38585 turned so its
   *  second half points into the building. Glass sits two studs in, so the window reads as a deep recess. */
  const windows = (along: 'x' | 'z', at: number, out: 1 | -1, open: number[], h: number, glass: string, stone: string, glassFrom = 0) => {
    const cell = (u: number, depth = 0): [number, number] => (along === 'x' ? [u, at - out * depth] : [at - out * depth, u]);
    const dirU = (s: number): [number, number] => (along === 'x' ? [s, 0] : [0, s]);
    const inward: [number, number] = along === 'x' ? [0, -out] : [-out, 0];
    const set = new Set(open);
    for (const u of open) {
      const [x, z] = cell(u); clear(x, x, z, z, h, h + 6);
      // glass two studs in: one stud in, the diagonal of a group-end 38585's box would take the glass; the glass column runs down through the
      // floor (or `glassFrom`, where a wall already stands under it), so it stands on something wherever the window is
      const [gx, gz] = cell(u, 2); wall(gx, gx, gz, gz, glassFrom, h + 6, glass);
    }
    const piers = new Set<number>(); for (const u of open) { if (!set.has(u - 1)) piers.add(u - 1); if (!set.has(u + 1)) piers.add(u + 1); }
    for (const u of piers) {
      const L = set.has(u - 1), R = set.has(u + 1); const [x, z] = cell(u); clear(x, x, z, z, h + 3, h + 6);
      if (L && R) part('nd_halfarch_opp', x, y + h + 3, z, stone, along === 'x' ? 0 : 1);
      else part('nd_halfarch_adj', x, y + h + 3, z, stone, turnTo([[1, 0], [0, 1]], [dirU(L ? -1 : 1), inward]));
    }
  };
  /** runs of 1×N bricks (three stacked plate cells of one colour) along x, then along z for what is left, then plates the same way; long runs
   *  split 8/6/4/3/2/1 with the first piece shortened on alternate courses so the joints stagger */
  const flush = () => {
    const used = new Set<string>(); const hs = [...new Set([...M.keys()].map((k) => +k.split('|')[1]))].sort((a, b) => a - b);
    const split = (L: number, odd: boolean) => { const out: number[] = []; let r = L; if (odd && L >= 6) { out.push(2); r -= 2; } while (r > 0) { const s = [8, 6, 4, 3, 2, 1].find((v) => v <= r)!; out.push(s); r -= s; } return out; };
    for (const h of hs) {
      const cells = [...M.entries()].filter(([k]) => +k.split('|')[1] === h && !used.has(k)).map(([k, v]) => { const [x, , z] = k.split('|').map(Number); return { x, z, v }; });
      const brickable = (x: number, z: number, c: string) => [0, 1, 2].every((d) => { const v = M.get(K(x, h + d, z)); return !!v && v.k === 'brick' && v.c === c && !used.has(K(x, h + d, z)); });
      for (const kind of ['brick', 'plate'] as const) {
        const ok = (x: number, z: number, c: string) => kind === 'brick' ? brickable(x, z, c) : (!used.has(K(x, h, z)) && M.get(K(x, h, z))?.c === c);
        const take = (x: number, z: number) => { for (let d = 0; d < (kind === 'brick' ? 3 : 1); d++) used.add(K(x, h + d, z)); };
        const odd = Math.floor(h / 3) % 2 === 1;
        for (const axis of ['x', 'z'] as const) {
          const rows = new Map<string, { x: number; z: number; c: string }[]>();
          for (const { x, z, v } of cells) { if (!ok(x, z, v.c)) continue; const rk = axis === 'x' ? `${z}|${v.c}` : `${x}|${v.c}`; (rows.get(rk) ?? rows.set(rk, []).get(rk)!).push({ x, z, c: v.c }); }
          for (const row of rows.values()) {
            row.sort((a, b) => (axis === 'x' ? a.x - b.x : a.z - b.z));
            let i = 0;
            while (i < row.length) {
              let j = i; while (j + 1 < row.length && (axis === 'x' ? row[j + 1].x - row[j].x : row[j + 1].z - row[j].z) === 1) j++;
              const L = j - i + 1;
              if (axis === 'x' && L < 2) { i = j + 1; continue; }   // single cells wait for the z pass
              let at = i;
              for (const n of split(L, odd)) {
                const s = row[at]; if (!ok(s.x, s.z, s.c)) { at += n; continue; }
                part(`${kind}_1x${n}`, s.x, y + h, s.z, s.c, axis === 'x' ? 1 : 0);
                for (let q = 0; q < n; q++) { const t = row[at + q]; take(t.x, t.z); }
                at += n;
              }
              i = j + 1;
            }
          }
        }
      }
      // a lone cell left over (a plate cell between bricks of another course) becomes a 1×1 plate
      for (const { x, z, v } of cells) if (!used.has(K(x, h, z))) { part('plate_1x1', x, y + h, z, v.c); used.add(K(x, h, z)); }
    }
  };
  return { M, wall, plates, clear, has, shell, windows, flush };
}
