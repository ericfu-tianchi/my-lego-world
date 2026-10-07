// The home globe, v4 (2026-10-02): a desk globe after LEGO Ideas 21332. The flat-panel cladding of v3 was rejected (ugly facets and seams);
// the surface is laid on latitude rings, one element per stud of surface ("bands", Eric's pick of three). The ball turns on a 23.4° axis inside a half-meridian of 1×2 plates laid end to end (dark bluish grey, like
// pewter), with round 2×2 plates as pole caps, on a turned reddish-brown stand. A home screen, not a set the validator checks.
import * as THREE from 'three';
import { geometryFor } from '../core/catalog';
import { colorHex } from '../core/colors';
import { isLand } from '../scenes/landmask';
import { earthColor } from '../scenes/earthmap';
import { latLonToDir, PLACES, type Place } from '../scenes/globe';

export const GLOBE_RADIUS = 26;   // studs
export const TILT = 23.4 * Math.PI / 180;
export interface Pin { place: Place; group: THREE.Group; hit: THREE.Mesh; dir: THREE.Vector3; top: number; rad: number }

const hash = (a: number, b: number) => { let h = Math.imul(a, 73856093) ^ Math.imul(b, 19349663); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
/** the great ranges, coarsely: 2 = high snow (Himalaya–Tibet core, high Andes), 1 = mountains */
function mountain(lat: number, lon: number): 0 | 1 | 2 {
  if (lat > 27 && lat < 30 && lon > 79 && lon < 93) return 2;                               // the Himalaya's snow line
  if (lat > 30 && lat < 37 && lon > 76 && lon < 100) return 1;                              // the Tibetan plateau
  if (lat > -28 && lat < -15 && lon > -70 && lon < -67) return 2;                            // high Andes
  if ((lat > -50 && lat < 8 && lon > -78 && lon < -67) || (lat > 32 && lat < 60 && lon > -122 && lon < -105) || (lat > 44 && lat < 48 && lon > 6 && lon < 15) || (lat > -5 && lat < 14 && lon > 34 && lon < 42) || (lat > 36 && lat < 44 && lon > 68 && lon < 80)) return 1;   // Andes, Rockies, Alps, Ethiopian highlands, Pamir–Tian Shan
  return 0;
}
const toLatLon = (d: THREE.Vector3) => [Math.asin(THREE.MathUtils.clamp(d.y, -1, 1)) * 180 / Math.PI, Math.atan2(-d.z, d.x) * 180 / Math.PI] as const;

export class GlobeView {
  /** the ball: turns about its own y axis; the app tilts it with `homeQuat` */
  group = new THREE.Group();
  /** the stand and meridian: never turn */
  fixtures = new THREE.Group(); pins: Pin[] = [];
  constructor(env: THREE.Texture) {
    const R = GLOBE_RADIUS; const one = new THREE.Vector3(1, 1, 1);
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0, envMap: env, envMapIntensity: 0.9 });
    const inst = (key: string, ms: THREE.Matrix4[], cs: string[], parent: THREE.Object3D, m: THREE.Material = mat) => { const im = new THREE.InstancedMesh(geometryFor(key), m, ms.length); const c = new THREE.Color(); ms.forEach((mm, k) => { im.setMatrixAt(k, mm); im.setColorAt(k, c.setHex(colorHex(cs[k]))); }); im.castShadow = true; im.receiveShadow = true; parent.add(im); return im; };
    const backing = new THREE.Mesh(new THREE.SphereGeometry(R - 0.15, 96, 64), new THREE.MeshStandardMaterial({ color: colorHex('DarkBlue'), roughness: 0.7 })); this.group.add(backing);   // the frame behind the panels: the seams between panels read as sea
    // ---- the surface (Eric chose "bands", 2026-10-02): the sea in 1×2 tiles running along the latitude rings, coasts in round 1×1 tiles,
    // the land in 1×1 plates raised a plate above the sea — and for accuracy: each cell is land only if most of it is (nine sub-samples of
    // the mask instead of one point, so coastlines follow the real shape and specks vanish), the great ranges (Himalaya–Tibet, Andes,
    // Rockies, Alps, East Africa) stand a second plate higher in the land's own colour (only the highest white), ice sheets white.
    const land: THREE.Matrix4[] = [], landC: string[] = [], sea: THREE.Matrix4[] = [], seaC: string[] = [], sea2: THREE.Matrix4[] = [], sea2C: string[] = [], coast: THREE.Matrix4[] = [], coastC: string[] = [];
    const rings = Math.round(Math.PI * R);
    for (let i = 0; i < rings; i++) {
      const lat = 90 - (i + 0.5) * 180 / rings; const n = Math.max(1, Math.round(2 * Math.PI * R * Math.cos(lat * Math.PI / 180))); const dLat = 180 / rings, dLon = 360 / n;
      const memo = new Map<number, boolean>();
      const landAt = (j: number) => { j = ((j % n) + n) % n; const hit = memo.get(j); if (hit !== undefined) return hit; const lon = (j + 0.5) * dLon - 180; let c = 0;
        for (const a of [-0.33, 0, 0.33]) for (const b of [-0.33, 0, 0.33]) c += isLand(lat + a * dLat, lon + b * dLon);
        const L = c >= 4 || (c >= 2 && !!isLand(lat, lon)); memo.set(j, L); return L; };   // 4 of 9, or 2 with the centre: thin islands (Japan, Java) survive, specks of coast do not
      const SEA = new Set(['DarkBlue', 'DarkAzure', 'MediumAzure']);
      /** the cell's colour from the satellite map (tools/earth/build-earthmap.py): the most common class over a 5×5 sample, land or sea */
      const colourAt = (j: number, wantLand: boolean, lat0 = lat) => { const lon0 = (j + 0.5) * dLon - 180; const votes = new Map<string, number>();
        for (const a of [-0.4, -0.2, 0, 0.2, 0.4]) for (const b of [-0.4, -0.2, 0, 0.2, 0.4]) { const c = earthColor(lat0 + a * dLat, lon0 + b * dLon); if (SEA.has(c) !== wantLand) votes.set(c, (votes.get(c) ?? 0) + 1); }
        let best = wantLand ? 'Green' : 'DarkBlue', bn = 0; for (const [c, k] of votes) if (k > bn) { best = c; bn = k; } return best; };
      for (let j = 0; j < n; j++) {
        const lon = (j + 0.5) * dLon - 180; const L = landAt(j); const h = hash(i * 977 + j, 3); void h;
        const d = new THREE.Vector3(...latLonToDir(lat, lon)); const east = new THREE.Vector3(0, 1, 0).cross(d).normalize(); if (east.lengthSq() < 1e-6) east.set(1, 0, 0); const north = d.clone().cross(east);
        const q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(north, d, east));   // z along the ring (east)
        const at = (lift: number, along = 0) => { const d2 = new THREE.Vector3(...latLonToDir(lat, lon + along * dLon)); return new THREE.Matrix4().compose(d2.multiplyScalar(R + lift), q, one); };
        if (L) {
          const m = mountain(lat, lon);
          const lc = colourAt(j, true); land.push(at(0.6)); landC.push(lc);
          if (m) { land.push(at(1.0)); landC.push(m === 2 ? 'White' : lc); }   // relief: ranges a plate higher in the land's own colour, only the highest snow-capped
          continue;
        }
        if (landAt(j - 1) || landAt(j + 1)) { coast.push(at(0.2)); coastC.push(colourAt(j, false) === 'MediumAzure' ? 'MediumAzure' : 'DarkAzure'); continue; }   // the coast is always shelf water
        if (j % 2 === 0 && j + 1 < n && !landAt(j + 1) && !landAt(j + 2)) { sea2.push(at(0.2, 0.5)); sea2C.push(colourAt(j, false)); j++; continue; }   // a 1×2 tile spans this cell and the next
        sea.push(at(0.2)); seaC.push(colourAt(j, false));
      }
    }
    inst('plate_1x1', land, landC, this.group); inst('tile_1x1', sea, seaC, this.group); inst('tile_1x2', sea2, sea2C, this.group); inst('roundtile_1x1', coast, coastC, this.group);
    // ---- the meridian, pole caps and stand (fixed). The arc lies in the axis plane: from the north cap round the west side to the south cap.
    const steel = new THREE.MeshStandardMaterial({ color: colorHex('DarkBluishGray'), roughness: 0.3, metalness: 0.35, envMap: env, envMapIntensity: 1.2 });
    const wood = new THREE.MeshStandardMaterial({ color: colorHex('ReddishBrown'), roughness: 0.45, envMap: env, envMapIntensity: 0.8 });
    const tilt = new THREE.Group(); tilt.rotation.z = TILT; this.fixtures.add(tilt);
    const Rm = R + 2.4; const N = Math.ceil(Math.PI * Rm / 2); const outer: THREE.Matrix4[] = [], inner: THREE.Matrix4[] = [];
    for (let s = 0; s < N; s++) {                                                               // 1×2 plates end to end, studs outward; a course of 1×2 tiles inside
      const a = Math.PI * (s + 0.5) / N; const radial = new THREE.Vector3(-Math.sin(a), Math.cos(a), 0), tang = new THREE.Vector3(-Math.cos(a), -Math.sin(a), 0);
      const q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(radial.clone().cross(tang), radial, tang));   // a 1×2 plate is 2 long in z: z along the arc
      outer.push(new THREE.Matrix4().compose(radial.clone().multiplyScalar(Rm), q, one)); inner.push(new THREE.Matrix4().compose(radial.clone().multiplyScalar(Rm - 0.4), q, one));
    }
    inst('plate_1x2', outer, outer.map(() => 'White'), tilt, steel); inst('tile_1x2', inner, inner.map(() => 'White'), tilt, steel);   // white instance colour: the material shows unmultiplied
    for (const sgn of [1, -1]) {                                                                // pole caps: a 2×2 round plate on a 1×1 round brick axle at each pole
      const cap = new THREE.Mesh(geometryFor('roundplate_2x2'), steel); cap.position.set(0, sgn * (Rm + 0.2), 0); if (sgn < 0) cap.rotation.x = Math.PI; tilt.add(cap);
      const axle = new THREE.Mesh(geometryFor('round_1x1'), steel); axle.position.set(0, sgn * (R + 1.0), 0); tilt.add(axle);
    }
    // the stand: under the meridian's lowest point a column of 1×1 round bricks on a stepped foot (two 6×6 round plates, a 4×4, a 2×2 round brick collar)
    let low = new THREE.Vector3(0, 1e9, 0); const tq = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), TILT);
    for (let k = 0; k <= 180; k++) { const a = Math.PI * k / 180; const p = new THREE.Vector3(-Math.sin(a) * Rm, Math.cos(a) * Rm, 0).applyQuaternion(tq); if (p.y < low.y) low = p; }
    const footY = -R - 14; const add = (key: string, y: number, m: THREE.Material, x = 0, z = 0) => { const mesh = new THREE.Mesh(geometryFor(key), m); mesh.position.set(low.x + x, y, z); this.fixtures.add(mesh); };
    // a stepped foot of real plates: 16×16 from four 8×8, then 12×12 from four 6×6, a 6×6 round plate, a 4×4 round plate, a 2×2 round brick collar
    for (const [dx, dz] of [[-4, -4], [4, -4], [-4, 4], [4, 4]]) add('plate_8x8', footY, wood, dx, dz);
    for (const [dx, dz] of [[-3, -3], [3, -3], [-3, 3], [3, 3]]) add('plate_6x6', footY + 0.4, wood, dx, dz);
    add('roundplate_6x6', footY + 0.8, wood); add('roundplate_4x4', footY + 1.2, wood);
    for (let y = footY + 1.6; y < low.y - 0.6; y += 1.2) add('roundbrick_2x2', y + 0.6, wood);
    this.fixtures.traverse((o) => { if ((o as THREE.Mesh).isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    // ---- pins: a white 2×2 round plate, a red 1×1 round brick post, a red 2×2 round plate head
    const red = new THREE.MeshStandardMaterial({ color: colorHex('BrightRed'), roughness: 0.35, envMap: env, envMapIntensity: 0.9 }), white = new THREE.MeshStandardMaterial({ color: colorHex('White'), roughness: 0.35, envMap: env, envMapIntensity: 0.9 });
    const up = new THREE.Vector3(0, 1, 0);
    // places not built yet: a slimmer pin, a 1×1 round plate on a 1×1 round brick, yellow
    const yellow = new THREE.MeshStandardMaterial({ color: colorHex('Yellow'), toneMapped: false, roughness: 0.55, envMap: env, envMapIntensity: 0.9 });
    for (const place of PLACES) {
      const dir = new THREE.Vector3(...latLonToDir(place.lat, place.lon)); const g = new THREE.Group(); g.position.copy(dir).multiplyScalar(R + 0.7); g.quaternion.setFromUnitVectors(up, dir);
      const head = place.scene ? red : yellow;   // not built yet: Bright Yellow, untone-mapped so it stays lemon against the tan land (Eric 2026-10-07: grey could not be seen, the tone-mapped yellow read as sand)
      // a place not built yet (Eric's pick C of three, 2026-10-07): a mini pin, a white 1×1 round plate under a 1×1 round tile
      const parts: [string, THREE.Material, number][] = place.scene ? [['roundplate_2x2', white, 0.2], ['round_1x1', red, 1.0], ['roundplate_2x2', red, 1.8]] : [['roundplate_1x1', white, 0.2], ['roundtile_1x1', head, 0.6]];
      const top = place.scene ? 2.2 : 0.8;
      for (const [k, m, y] of parts) { const mesh = new THREE.Mesh(geometryFor(k), m); mesh.position.y = y; mesh.castShadow = true; g.add(mesh); }
      const hit = new THREE.Mesh(new THREE.SphereGeometry(place.scene ? 2.6 : 1.4, 8, 8), new THREE.MeshBasicMaterial({ visible: false })); hit.position.y = 1.2; g.add(hit); g.scale.setScalar(0.8); this.group.add(g);   // a size smaller (Eric 2026-10-07)
      this.pins.push({ place, group: g, hit, dir, top: top * 0.8, rad: (place.scene ? 1 : 0.5) * 0.8 });
    }
  }
  /** the ball's rotation at home: `spin` about its own axis, the axis tilted 23.4° */
  homeQuat(spin: number) { return new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), TILT).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), spin)); }
  /** rotation that brings `dir` (globe-local) to world `to` */
  static facing(dir: THREE.Vector3, to: THREE.Vector3) { return new THREE.Quaternion().setFromUnitVectors(dir.clone().normalize(), to.clone().normalize()); }
}
