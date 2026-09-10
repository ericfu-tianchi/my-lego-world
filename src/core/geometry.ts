import * as THREE from 'three';

// ---- Brick unit system -------------------------------------------------------
// 1 unit = 1 stud pitch (8 mm). Brick height 1.2 (9.6 mm), plate 0.4 (3.2 mm).
// Part geometry is centred on its bounding box (w × h·PLATE × d) so render pose == physics pose.
export const PLATE = 0.4;
export const STUD_R = 0.3, STUD_H = 0.18, EDGE_R = 0.045;

export function mergeGeos(geos: THREE.BufferGeometry[]): THREE.BufferGeometry {
  let n = 0;
  const parts = geos.map((g) => { const ng = g.index ? g.toNonIndexed() : g; n += ng.attributes.position.count; return ng; });
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3);
  let o = 0;
  for (const g of parts) {
    if (!g.attributes.normal) g.computeVertexNormals();
    pos.set(g.attributes.position.array as Float32Array, o * 3); nor.set(g.attributes.normal.array as Float32Array, o * 3);
    o += g.attributes.position.count;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  return out;
}

/** Box with softly rounded edges (rounding approach from three's RoundedBoxGeometry, MIT). */
export function roundedBox(w: number, h: number, d: number, r = EDGE_R): THREE.BufferGeometry {
  const seg = 3; r = Math.min(w / 2, h / 2, d / 2, r);
  const g = new THREE.BoxGeometry(1, 1, 1, seg, seg, seg).toNonIndexed();
  const pos = g.attributes.position.array as Float32Array, nor = g.attributes.normal.array as Float32Array;
  const box = new THREE.Vector3(w, h, d).divideScalar(2).subScalar(r);
  const p = new THREE.Vector3(), nrm = new THREE.Vector3(); const half = 0.5 / seg;
  for (let i = 0; i < pos.length; i += 3) {
    p.fromArray(pos, i); nrm.copy(p);
    nrm.x -= Math.sign(nrm.x) * half; nrm.y -= Math.sign(nrm.y) * half; nrm.z -= Math.sign(nrm.z) * half; nrm.normalize();
    pos[i] = box.x * Math.sign(p.x) + nrm.x * r; pos[i + 1] = box.y * Math.sign(p.y) + nrm.y * r; pos[i + 2] = box.z * Math.sign(p.z) + nrm.z * r;
    nor[i] = nrm.x; nor[i + 1] = nrm.y; nor[i + 2] = nrm.z;
  }
  g.deleteAttribute('uv'); return g;
}
export function box(w: number, h: number, d: number, x = 0, y = 0, z = 0): THREE.BufferGeometry { const g = roundedBox(w, h, d, Math.min(EDGE_R, w / 4, h / 4, d / 4)); g.translate(x, y, z); return g; }
export function cyl(r: number, h: number, segs = 16, rTop = r, x = 0, y = 0, z = 0): THREE.BufferGeometry { const g = new THREE.CylinderGeometry(rTop, r, h, segs, 1, false); g.deleteAttribute('uv'); g.translate(x, y, z); return g; }
export function stud(x: number, y: number, z: number): THREE.BufferGeometry {
  const side = new THREE.CylinderGeometry(STUD_R, STUD_R, STUD_H, 14, 1, true);
  const cap = new THREE.CircleGeometry(STUD_R, 14); cap.rotateX(-Math.PI / 2); cap.translate(0, STUD_H / 2, 0);
  const g = mergeGeos([side, cap]); g.translate(x, y + STUD_H / 2, z); return g;
}
/** Studs over a w×d footprint on the top face at topY; filter(i, j) selects cells. */
export function studGrid(w: number, d: number, topY: number, filter?: (i: number, j: number) => boolean): THREE.BufferGeometry[] {
  const out: THREE.BufferGeometry[] = [];
  for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) { if (filter && !filter(i, j)) continue; out.push(stud(i + 0.5 - w / 2, topY, j + 0.5 - d / 2)); }
  return out;
}
/** Extrude a (z, y) profile along x by `w`; result centred on x. */
export function profileExtrude(shapeFn: (s: THREE.Shape) => void, w: number): THREE.BufferGeometry {
  const s = new THREE.Shape(); shapeFn(s);
  const g = new THREE.ExtrudeGeometry(s, { depth: w, bevelEnabled: false, curveSegments: 10 });
  g.rotateY(-Math.PI / 2); g.translate(w / 2, 0, 0); g.deleteAttribute('uv'); return g;
}
/** Extrude a top-view polygon (x, z points) upward by height h; centred on the w×d footprint. */
export function footprintPrism(points: [number, number][], h: number, w: number, d: number): THREE.BufferGeometry {
  const s = new THREE.Shape(); points.forEach(([x, z], i) => (i ? s.lineTo(x - w / 2, z - d / 2) : s.moveTo(x - w / 2, z - d / 2))); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: false }); g.rotateX(Math.PI / 2); g.translate(0, h / 2, 0); g.deleteAttribute('uv');
  // rotateX(+90°) maps shape y (our z) to -z; flip back
  g.scale(1, 1, -1); g.computeVertexNormals(); return g;
}
export function lathe(points: [number, number][], segs = 24): THREE.BufferGeometry { const g = new THREE.LatheGeometry(points.map((p) => new THREE.Vector2(p[0], p[1])), segs); g.deleteAttribute('uv'); return g; }

/** Convex roof corner: high point at the back-left (-x,-z) corner, slopes descend toward +x and +z. */
export function cornerSlope(size: number, h: number, lip: number): THREE.BufferGeometry {
  const H = h * PLATE, s = size / 2; const yb = -H / 2, yl = -H / 2 + lip, yt = H / 2;
  const A = [-s, yb, -s], B = [s, yb, -s], C = [s, yb, s], D = [-s, yb, s], Bl = [s, yl, -s], Cl = [s, yl, s], Dl = [-s, yl, s], E = [-s, yt, -s];
  const tris = [[A, C, B], [A, D, C], [A, B, Bl], [A, Bl, E], [A, E, Dl], [A, Dl, D], [D, Dl, Cl], [D, Cl, C], [C, Cl, Bl], [C, Bl, B], [E, Cl, Dl], [E, Bl, Cl]];
  const pos = new Float32Array(tris.length * 9);
  tris.forEach((t, i) => { pos.set(t[0], i * 9); pos.set(t[2], i * 9 + 3); pos.set(t[1], i * 9 + 6); });
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.computeVertexNormals(); return g;
}
/** Four-sided pyramid on a square footprint. */
export function pyramid(size: number, h: number): THREE.BufferGeometry { const g = new THREE.ConeGeometry(size / Math.SQRT2, h, 4, 1, false); g.rotateY(Math.PI / 4); g.deleteAttribute('uv'); return g; }
/** Side stud on a vertical face pointing along +z. */
export function sideStud(x: number, y: number, z: number): THREE.BufferGeometry { const g = stud(0, 0, 0); g.rotateX(Math.PI / 2); g.translate(x, y, z); return g; }
