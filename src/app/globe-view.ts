// The home globe, v2 (2026-10-02, Eric: a true map in LEGO, round, every continent and ocean where it is). Built like LEGO Art World Map
// (31203) wrapped onto a sphere: a dark-blue ball dotted with 1×1 round elements on even latitude rings, one per stud of surface, coloured
// from a 1° Natural Earth land mask. Ocean is flat round tiles (deep navy, lighter near coasts); land is round plates with their stud, so the
// continents stand up in relief. A decorative home screen, not a buildable set: the dots follow the sphere, not a stud grid.
import * as THREE from 'three';
import { geometryFor } from '../core/catalog';
import { colorHex } from '../core/colors';
import { isLand } from '../scenes/landmask';
import { latLonToDir, PLACES, type Place } from '../scenes/globe';

export const GLOBE_RADIUS = 26;   // studs: ~10,000 dots, one per stud of surface
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

export class GlobeView {
  group = new THREE.Group(); pins: Pin[] = [];
  constructor(env: THREE.Texture) {
    const R = GLOBE_RADIUS; const mat = new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0, envMap: env, envMapIntensity: 0.9 });
    const ball = new THREE.Mesh(new THREE.SphereGeometry(R - 0.05, 96, 64), new THREE.MeshStandardMaterial({ color: colorHex('DarkBlue'), roughness: 0.6, envMap: env, envMapIntensity: 0.5 }));
    ball.receiveShadow = true; this.group.add(ball);
    const land: THREE.Matrix4[] = [], landC: string[] = [], sea: THREE.Matrix4[] = [], seaC: string[] = [];
    const rings = Math.round(Math.PI * R); const up = new THREE.Vector3(0, 1, 0), q = new THREE.Quaternion(), one = new THREE.Vector3(1, 1, 1);
    for (let i = 0; i < rings; i++) {
      const lat = 90 - (i + 0.5) * 180 / rings; const n = Math.max(1, Math.round(2 * Math.PI * R * Math.cos(lat * Math.PI / 180))); const off = hash(i, 7) * 360;
      for (let j = 0; j < n; j++) {
        const lon = ((off + (j + 0.5) * 360 / n) % 360) - 180; const d = new THREE.Vector3(...latLonToDir(lat, lon)); const L = isLand(lat, lon); const h = hash(i * 977 + j, 3);
        q.setFromUnitVectors(up, d); const m = new THREE.Matrix4().compose(d.clone().multiplyScalar(R + 0.2), q, one);
        if (L) { land.push(m); landC.push(landColor(lat, lon, h)); }
        else { sea.push(m); seaC.push(lat < -66 || lat > 80 ? 'White' : nearLand(lat, lon) ? (h < 0.65 ? 'DarkAzure' : 'MediumAzure') : h < 0.12 ? 'DarkAzure' : 'DarkBlue'); }
      }
    }
    const inst = (key: string, ms: THREE.Matrix4[], cs: string[]) => { const im = new THREE.InstancedMesh(geometryFor(key), mat, ms.length); const c = new THREE.Color(); ms.forEach((m, k) => { im.setMatrixAt(k, m); im.setColorAt(k, c.setHex(colorHex(cs[k]))); }); im.castShadow = true; im.receiveShadow = true; this.group.add(im); };
    inst('roundplate_1x1', land, landC); inst('roundtile_1x1', sea, seaC);
    // pins: a white 2×2 round plate, a red 1×1 round brick post, a red 2×2 round plate head
    const red = new THREE.MeshStandardMaterial({ color: colorHex('BrightRed'), roughness: 0.35, envMap: env, envMapIntensity: 0.9 }), white = new THREE.MeshStandardMaterial({ color: colorHex('White'), roughness: 0.35, envMap: env, envMapIntensity: 0.9 });
    for (const place of PLACES) {
      const dir = new THREE.Vector3(...latLonToDir(place.lat, place.lon)); const g = new THREE.Group(); g.position.copy(dir).multiplyScalar(R + 0.4); g.quaternion.setFromUnitVectors(up, dir);
      const parts: [string, THREE.Material, number][] = [['roundplate_2x2', white, 0.2], ['round_1x1', red, 1.0], ['roundplate_2x2', red, 1.8]];
      for (const [k, m, y] of parts) { const mesh = new THREE.Mesh(geometryFor(k), m); mesh.position.y = y; mesh.castShadow = true; g.add(mesh); }
      const hit = new THREE.Mesh(new THREE.SphereGeometry(2.6, 8, 8), new THREE.MeshBasicMaterial({ visible: false })); hit.position.y = 1.2; g.add(hit); this.group.add(g);
      this.pins.push({ place, group: g, hit, dir });
    }
  }
  /** rotation that brings `dir` (globe-local) to world `to` */
  static facing(dir: THREE.Vector3, to: THREE.Vector3) { return new THREE.Quaternion().setFromUnitVectors(dir.clone().normalize(), to.clone().normalize()); }
}
