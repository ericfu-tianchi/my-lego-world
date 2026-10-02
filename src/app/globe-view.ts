// The home globe, v4 (2026-10-02): a desk globe after LEGO Ideas 21332. The flat-panel cladding of v3 was rejected (ugly facets and seams);
// the surface now comes in three candidates (see `GlobeStyle`) on latitude rings, one element per stud of surface. The ball turns on a 23.4° axis inside a half-meridian of 1×2 plates laid end to end (dark bluish grey, like
// pewter), with round 2×2 plates as pole caps, on a turned reddish-brown stand. A home screen, not a set the validator checks.
import * as THREE from 'three';
import { geometryFor } from '../core/catalog';
import { colorHex } from '../core/colors';
import { isLand } from '../scenes/landmask';
import { latLonToDir, PLACES, type Place } from '../scenes/globe';

export const GLOBE_RADIUS = 26;   // studs
export const TILT = 23.4 * Math.PI / 180;
export type GlobeStyle = 'dots' | 'tiles' | 'bands';
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
  constructor(env: THREE.Texture, public style: GlobeStyle = 'tiles') {
    const R = GLOBE_RADIUS; const one = new THREE.Vector3(1, 1, 1);
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0, envMap: env, envMapIntensity: 0.9 });
    const inst = (key: string, ms: THREE.Matrix4[], cs: string[], parent: THREE.Object3D, m: THREE.Material = mat) => { const im = new THREE.InstancedMesh(geometryFor(key), m, ms.length); const c = new THREE.Color(); ms.forEach((mm, k) => { im.setMatrixAt(k, mm); im.setColorAt(k, c.setHex(colorHex(cs[k]))); }); im.castShadow = true; im.receiveShadow = true; parent.add(im); return im; };
    const backing = new THREE.Mesh(new THREE.SphereGeometry(R - 0.15, 96, 64), new THREE.MeshStandardMaterial({ color: colorHex('DarkBlue'), roughness: 0.7 })); this.group.add(backing);   // the frame behind the panels: the seams between panels read as sea
    // ---- the surface: three candidates (Eric, 2026-10-02 — the flat-panel cladding was rejected as ugly)
    //   dots  — round 1×1 elements on latitude rings: land round plates (studs up), sea round tiles (LEGO Art World Map on a ball)
    //   tiles — square 1×1 tiles and plates on latitude rings, each square aligned east–west (the first desk globe)
    //   bands — the sea laid in 1×2 tiles running along the latitude rings, the land in 1×1 plates raised a plate above the sea, coasts in
    //           round 1×1 tiles: long smooth bands of ocean, continents standing up in relief
    const land: THREE.Matrix4[] = [], landC: string[] = [], sea: THREE.Matrix4[] = [], seaC: string[] = [], sea2: THREE.Matrix4[] = [], sea2C: string[] = [], coast: THREE.Matrix4[] = [], coastC: string[] = [];
    const up = new THREE.Vector3(0, 1, 0); const rings = Math.round(Math.PI * R);
    for (let i = 0; i < rings; i++) {
      const lat = 90 - (i + 0.5) * 180 / rings; const n = Math.max(1, Math.round(2 * Math.PI * R * Math.cos(lat * Math.PI / 180))); const off = style === 'dots' ? hash(i, 7) * 360 : 0;
      const cell = (j: number) => { const lon = ((off + (j + 0.5) * 360 / n) % 360 + 360) % 360 - 180; return { lon, L: !!isLand(lat, lon) }; };
      for (let j = 0; j < n; j++) {
        const { lon, L } = cell(j); const d = new THREE.Vector3(...latLonToDir(lat, lon)); const h = hash(i * 977 + j, 3);
        const east = new THREE.Vector3(0, 1, 0).cross(d).normalize(); if (east.lengthSq() < 1e-6) east.set(1, 0, 0); const north = d.clone().cross(east);
        const q = style === 'dots' ? new THREE.Quaternion().setFromUnitVectors(up, d) : new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(north, d, east));   // z along the ring (east)
        const at = (lift: number, along = 0) => { const lon2 = lon + along * 180 / n; const d2 = new THREE.Vector3(...latLonToDir(lat, lon2)); return new THREE.Matrix4().compose(d2.multiplyScalar(R + lift), q, one); };
        if (style === 'bands') {
          if (L) { land.push(at(0.6)); landC.push(landColor(lat, lon, h)); continue; }
          const nb = cell(j + 1); const nearL = cell(j - 1).L || nb.L;
          if (nearL) { coast.push(at(0.2)); coastC.push(h < 0.5 ? 'MediumAzure' : 'DarkAzure'); continue; }
          if (j % 2 === 0 && j + 1 < n && !nb.L && !cell(j + 2).L) { sea2.push(at(0.2, 0.5)); sea2C.push(seaColor(lat, lon, h)); j++; continue; }   // a 1×2 tile spans this cell and the next
          sea.push(at(0.2)); seaC.push(seaColor(lat, lon, h)); continue;
        }
        if (L) { land.push(at(0.2)); landC.push(landColor(lat, lon, h)); } else { sea.push(at(0.2)); seaC.push(seaColor(lat, lon, h)); }
      }
    }
    if (style === 'dots') { inst('roundplate_1x1', land, landC, this.group); inst('roundtile_1x1', sea, seaC, this.group); }
    else if (style === 'tiles') { inst('plate_1x1', land, landC, this.group); inst('tile_1x1', sea, seaC, this.group); }
    else { inst('plate_1x1', land, landC, this.group); inst('tile_1x1', sea, seaC, this.group); inst('tile_1x2', sea2, sea2C, this.group); inst('roundtile_1x1', coast, coastC, this.group); }
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
    for (const place of PLACES) {
      const dir = new THREE.Vector3(...latLonToDir(place.lat, place.lon)); const g = new THREE.Group(); g.position.copy(dir).multiplyScalar(R + (style === 'bands' ? 0.7 : 0.3)); g.quaternion.setFromUnitVectors(up, dir);
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
