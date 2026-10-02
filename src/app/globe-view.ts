// The home globe, v3 (2026-10-02): a desk globe after LEGO Ideas 21332, built the way that set is built. Eric chose the desk globe and asked
// that it be something you could really put together: the surface is not loose bricks on a sphere but flat mosaic panels — a cube projected
// onto the sphere and cut into 6 × 6 panels per face (216), each panel a square grid of 1×1 tiles and plates lying flat on one plane, the way
// 21332 clads its frame with flat panels; the facets show, as they do on the real set. Land is 1×1 plates (studs up, the continents stand
// proud), sea is 1×1 tiles. The ball turns on a 23.4° axis inside a half-meridian of 1×2 plates laid end to end (dark bluish grey, like
// pewter), with round 2×2 plates as pole caps, on a turned reddish-brown stand. A home screen, not a set the validator checks.
import * as THREE from 'three';
import { geometryFor } from '../core/catalog';
import { colorHex } from '../core/colors';
import { isLand } from '../scenes/landmask';
import { latLonToDir, PLACES, type Place } from '../scenes/globe';

export const GLOBE_RADIUS = 26;   // studs
export const TILT = 23.4 * Math.PI / 180;
export interface Pin { place: Place; group: THREE.Group; hit: THREE.Mesh; dir: THREE.Vector3 }

const hash = (a: number, b: number) => { let h = Math.imul(a, 73856093) ^ Math.imul(b, 19349663); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const desert = (lat: number, lon: number) => (lat > 14 && lat < 31 && lon > -16 && lon < 36) || (lat > 15 && lat < 31 && lon > 36 && lon < 60) || (lat > -30 && lat < -19 && lon > 118 && lon < 142) || (lat > 37 && lat < 46 && lon > 75 && lon < 112) || (lat > 23 && lat < 33 && lon > -116 && lon < -104) || (lat > -28 && lat < -18 && lon > 14 && lon < 25);
function landColor(lat: number, lon: number, n: number) {
  if (lat < -60 || (lat > 60 && lon > -75 && lon < -10) || lat > 72) return n < 0.2 ? 'LightBluishGray' : 'White';   // Antarctica, Greenland, the high Arctic
  if (desert(lat, lon)) return n < 0.35 ? 'DarkTan' : 'Tan';
  if (Math.abs(lat) < 12) return n < 0.4 ? 'DarkGreen' : 'Green';                                                    // rainforest belt
  if (lat > 50) return n < 0.4 ? 'DarkGreen' : 'OliveGreen';                                                           // boreal
  return n < 0.25 ? 'Green' : 'BrightGreen';
}
const nearLand = (lat: number, lon: number) => { for (const [a, b] of [[2, 0], [-2, 0], [0, 2], [0, -2]]) if (isLand(lat + a, lon + b)) return true; return false; };   // shallow water: the coastal shelf only
const seaColor = (lat: number, lon: number, h: number) => (lat < -66 || lat > 80 ? 'White' : nearLand(lat, lon) ? (h < 0.65 ? 'DarkAzure' : 'MediumAzure') : h < 0.12 ? 'DarkAzure' : 'DarkBlue');
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
    // ---- the panels
    const land: THREE.Matrix4[] = [], landC: string[] = [], sea: THREE.Matrix4[] = [], seaC: string[] = [];
    const FACES: [THREE.Vector3, THREE.Vector3, THREE.Vector3][] = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].map(([x, y, z]) => {
      const n = new THREE.Vector3(x, y, z); const u = Math.abs(y) > 0.5 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0).cross(n).normalize(); const v = n.clone().cross(u); return [n, u, v];
    });
    const P = 6; const onSphere = (n: THREE.Vector3, u: THREE.Vector3, v: THREE.Vector3, a: number, b: number) => n.clone().add(u.clone().multiplyScalar(Math.tan(a * Math.PI / 4))).add(v.clone().multiplyScalar(Math.tan(b * Math.PI / 4))).normalize();   // equal-angle cube map: even panels
    FACES.forEach(([n, u, v], f) => { for (let i = 0; i < P; i++) for (let j = 0; j < P; j++) {
      const a0 = -1 + 2 * i / P, a1 = -1 + 2 * (i + 1) / P, b0 = -1 + 2 * j / P, b1 = -1 + 2 * (j + 1) / P, am = (a0 + a1) / 2, bm = (b0 + b1) / 2;
      const c = onSphere(n, u, v, am, bm); const ea = onSphere(n, u, v, a1, bm).sub(onSphere(n, u, v, a0, bm)), eb = onSphere(n, u, v, am, b1).sub(onSphere(n, u, v, am, b0));
      const ex = ea.clone().addScaledVector(c, -ea.dot(c)).normalize(), ez = c.clone().cross(ex).normalize();   // the panel plane: x along the panel's a edge, y out
      const k = Math.max(3, Math.round(ea.length() * R)), kb = Math.max(3, Math.round(eb.length() * R));          // studs across the panel
      const q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(ex, c, ez.clone().negate()));
      const centre = c.clone().multiplyScalar(R * Math.cos(Math.atan(Math.hypot(k, kb) / 2 / R)));                 // the plane sits inside the sphere so the panel's corners touch it
      for (let x = 0; x < k; x++) for (let z = 0; z < kb; z++) {
        const p = centre.clone().addScaledVector(ex, x - (k - 1) / 2).addScaledVector(ez, z - (kb - 1) / 2); const [lat, lon] = toLatLon(p.clone().normalize()); const h = hash(f * 997 + i * 131 + x * 7, j * 97 + z * 3);
        const m = new THREE.Matrix4().compose(p.clone().addScaledVector(c, 0.2), q, one);
        if (isLand(lat, lon)) { land.push(m); landC.push(landColor(lat, lon, h)); } else { sea.push(m); seaC.push(seaColor(lat, lon, h)); }
      }
    } });
    inst('plate_1x1', land, landC, this.group); inst('tile_1x1', sea, seaC, this.group);
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
    for (const place of PLACES) {
      const dir = new THREE.Vector3(...latLonToDir(place.lat, place.lon)); const g = new THREE.Group(); g.position.copy(dir).multiplyScalar(R + 0.3); g.quaternion.setFromUnitVectors(up, dir);
      for (const [k, m, y] of [['roundplate_2x2', white, 0.2], ['round_1x1', red, 1.0], ['roundplate_2x2', red, 1.8]] as [string, THREE.Material, number][]) { const mesh = new THREE.Mesh(geometryFor(k), m); mesh.position.y = y; mesh.castShadow = true; g.add(mesh); }
      const hit = new THREE.Mesh(new THREE.SphereGeometry(2.6, 8, 8), new THREE.MeshBasicMaterial({ visible: false })); hit.position.y = 1.2; g.add(hit); this.group.add(g);
      this.pins.push({ place, group: g, hit, dir });
    }
  }
  /** the ball's rotation at home: `spin` about its own axis, the axis tilted 23.4° */
  homeQuat(spin: number) { return new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), TILT).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), spin)); }
  /** rotation that brings `dir` (globe-local) to world `to` */
  static facing(dir: THREE.Vector3, to: THREE.Vector3) { return new THREE.Quaternion().setFromUnitVectors(dir.clone().normalize(), to.clone().normalize()); }
}
