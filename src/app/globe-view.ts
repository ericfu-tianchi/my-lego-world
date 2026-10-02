// The home globe, v2 (2026-10-02, Eric: a true map in LEGO, round, every continent and ocean where it is). Built like LEGO Art World Map
// (31203) wrapped onto a sphere: a dark-blue ball dotted with 1×1 round elements on even latitude rings, one per stud of surface, coloured
// from a 1° Natural Earth land mask. Ocean is flat round tiles (deep navy, lighter near coasts); land is round plates with their stud, so the
// continents stand up in relief. A decorative home screen, not a buildable set: the dots follow the sphere, not a stud grid.
import * as THREE from 'three';
import { geometryFor } from '../core/catalog';
import { Blueprint } from '../core/builder';
import { BrickRenderer } from '../core/render';
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

export type GlobeStyle = 'mosaic' | 'brick' | 'desk';
const TILT = 23.4 * Math.PI / 180;

/** Three looks for Eric to choose from (2026-10-02):
 *  mosaic — LEGO Art World Map wrapped on a ball: round 1×1 dots on latitude rings (land as round plates with studs, sea as round tiles);
 *  brick  — a planet stacked from real bricks: one-stud shell of 3-plate courses, studs up, the silhouette stepped like any LEGO ball;
 *  desk   — a desk globe after LEGO Ideas 21332: square 1×1 tiles and plates, tilted 23.4° on its axis inside a gold half-meridian, on a
 *           dark-brown turned stand. */
export class GlobeView {
  group = new THREE.Group(); fixtures = new THREE.Group(); pins: Pin[] = [];
  constructor(env: THREE.Texture, public style: GlobeStyle = 'mosaic') {
    const R = GLOBE_RADIUS; const mat = new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0, envMap: env, envMapIntensity: 0.9 });
    const up = new THREE.Vector3(0, 1, 0), q = new THREE.Quaternion(), one = new THREE.Vector3(1, 1, 1);
    const inst = (key: string, ms: THREE.Matrix4[], cs: string[], parent: THREE.Object3D = this.group, m = mat) => { const im = new THREE.InstancedMesh(geometryFor(key), m, ms.length); const c = new THREE.Color(); ms.forEach((mm, k) => { im.setMatrixAt(k, mm); im.setColorAt(k, c.setHex(colorHex(cs[k]))); }); im.castShadow = true; im.receiveShadow = true; parent.add(im); };
    const seaColor = (lat: number, lon: number, h: number) => (lat < -66 || lat > 80 ? 'White' : nearLand(lat, lon) ? (h < 0.65 ? 'DarkAzure' : 'MediumAzure') : h < 0.12 ? 'DarkAzure' : 'DarkBlue');
    if (style === 'brick') {
      // stacked courses: every cell of a one-stud shell is a 1×1 brick-height voxel, packed into real bricks by the Blueprint packer
      const bp = new Blueprint(9); const H = 1.2; const inside = (x: number, y: number, z: number) => x * x + y * y + z * z <= R * R; const ny = Math.ceil(R / H) + 1;
      for (let gx = -R - 1; gx <= R; gx++) for (let gz = -R - 1; gz <= R; gz++) for (let k = -ny; k <= ny; k++) {
        const cx = gx + 0.5, cz = gz + 0.5, cy = (k + 0.5) * H; if (!inside(cx, cy, cz)) continue;
        if (inside(cx + 1, cy, cz) && inside(cx - 1, cy, cz) && inside(cx, cy, cz + 1) && inside(cx, cy, cz - 1) && inside(cx, cy + H, cz) && inside(cx, cy - H, cz)) continue;
        const r = Math.hypot(cx, cy, cz); const lat = Math.asin(cy / r) * 180 / Math.PI, lon = Math.atan2(-cz, cx) * 180 / Math.PI; const h = hash(gx * 131 + k, gz);
        const color = isLand(lat, lon) ? landColor(lat, lon, h) : seaColor(lat, lon, h); for (let dy = 0; dy < 3; dy++) bp.vox1('brick', gx, 3 * k + dy, gz, color);
      }
      bp.pack(); const br = new BrickRenderer(new THREE.Scene()); br.setEnvironment(env); br.build(bp.parts, new THREE.Vector3(0, 0, 0)); br.resetHome(); this.group.add(br.group);
      const core = new THREE.Mesh(new THREE.SphereGeometry(R - 1.2, 48, 32), new THREE.MeshStandardMaterial({ color: colorHex('DarkBlue'), roughness: 0.7 })); this.group.add(core);
    } else {
      const ball = new THREE.Mesh(new THREE.SphereGeometry(R - 0.05, 96, 64), new THREE.MeshStandardMaterial({ color: colorHex(style === 'desk' ? 'Black' : 'DarkBlue'), roughness: 0.6, envMap: env, envMapIntensity: 0.5 }));
      ball.receiveShadow = true; this.group.add(ball);
      const land: THREE.Matrix4[] = [], landC: string[] = [], sea: THREE.Matrix4[] = [], seaC: string[] = [];
      const rings = Math.round(Math.PI * R);
      for (let i = 0; i < rings; i++) {
        const lat = 90 - (i + 0.5) * 180 / rings; const n = Math.max(1, Math.round(2 * Math.PI * R * Math.cos(lat * Math.PI / 180))); const off = style === 'desk' ? 0 : hash(i, 7) * 360;
        for (let j = 0; j < n; j++) {
          const lon = ((off + (j + 0.5) * 360 / n) % 360) - 180; const d = new THREE.Vector3(...latLonToDir(lat, lon)); const L = isLand(lat, lon); const h = hash(i * 977 + j, 3);
          // square tiles must line up with the ring: local x along the parallel (east), local y outward
          if (style === 'desk') { const east = new THREE.Vector3(0, 1, 0).cross(d).normalize(); if (east.lengthSq() < 1e-6) east.set(1, 0, 0); const north = d.clone().cross(east); q.setFromRotationMatrix(new THREE.Matrix4().makeBasis(east, d, north.negate())); }
          else q.setFromUnitVectors(up, d);
          const m = new THREE.Matrix4().compose(d.clone().multiplyScalar(R + 0.2), q, one);
          if (L) { land.push(m); landC.push(landColor(lat, lon, h)); } else { sea.push(m); seaC.push(seaColor(lat, lon, h)); }
        }
      }
      if (style === 'desk') { inst('plate_1x1', land, landC); inst('tile_1x1', sea, seaC); } else { inst('roundplate_1x1', land, landC); inst('roundtile_1x1', sea, seaC); }
    }
    if (style === 'desk') {
      // the stand: a gold half-meridian of 1×1 round bricks round the tilted axis, two gold axle caps, a dark-brown turned column on a round foot
      const gold = new THREE.MeshStandardMaterial({ color: 0xd9a441, roughness: 0.22, metalness: 0.85, envMap: env, envMapIntensity: 1.6 });   // Pearl Gold reads brown without a strong metallic sheen
      const tilt = new THREE.Group(); tilt.rotation.z = TILT; this.fixtures.add(tilt); const Rm = R + 2.2; const ms: THREE.Matrix4[] = [];
      for (let k = 0; k <= 64; k++) { const a = -Math.PI / 2 + Math.PI * k / 64; const p = new THREE.Vector3(-Math.cos(a) * Rm, Math.sin(a) * Rm, 0); const qq = new THREE.Quaternion().setFromUnitVectors(up, p.clone().normalize()); ms.push(new THREE.Matrix4().compose(p, qq, one)); }
      inst('round_1x1', ms, ms.map(() => 'White'), tilt, gold);   // white instance colour: the gold material shows through unmultiplied
      for (const sgn of [1, -1]) { const cap = new THREE.Mesh(geometryFor('roundplate_2x2'), gold); cap.position.set(0, sgn * (R + 1.2), 0); if (sgn < 0) cap.rotation.x = Math.PI; tilt.add(cap); }
      const wood = new THREE.MeshStandardMaterial({ color: colorHex('DarkBrown'), roughness: 0.5, envMap: env, envMapIntensity: 0.7 });
      const foot = new THREE.Mesh(geometryFor('roundplate_6x6'), wood); foot.position.y = -R - 11; foot.scale.set(1.6, 2, 1.6); this.fixtures.add(foot);
      for (let k = 0; k < 4; k++) { const col = new THREE.Mesh(geometryFor('roundbrick_2x2'), wood); col.position.y = -R - 10 + 1.2 * k + 0.6; this.fixtures.add(col); }
      const arm = new THREE.Mesh(geometryFor('round_1x1'), gold); arm.position.y = -R - 4.6; arm.scale.y = 3; this.fixtures.add(arm);
      this.fixtures.traverse((o) => { if ((o as THREE.Mesh).isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    }
    // pins: a white 2×2 round plate, a red 1×1 round brick post, a red 2×2 round plate head
    const red = new THREE.MeshStandardMaterial({ color: colorHex('BrightRed'), roughness: 0.35, envMap: env, envMapIntensity: 0.9 }), white = new THREE.MeshStandardMaterial({ color: colorHex('White'), roughness: 0.35, envMap: env, envMapIntensity: 0.9 });
    for (const place of PLACES) {
      const dir = new THREE.Vector3(...latLonToDir(place.lat, place.lon)); const g = new THREE.Group(); g.position.copy(dir).multiplyScalar(R + (style === 'brick' ? 0.6 : 0.4)); g.quaternion.setFromUnitVectors(up, dir);
      const parts: [string, THREE.Material, number][] = [['roundplate_2x2', white, 0.2], ['round_1x1', red, 1.0], ['roundplate_2x2', red, 1.8]];
      for (const [k, m, y] of parts) { const mesh = new THREE.Mesh(geometryFor(k), m); mesh.position.y = y; mesh.castShadow = true; g.add(mesh); }
      const hit = new THREE.Mesh(new THREE.SphereGeometry(2.6, 8, 8), new THREE.MeshBasicMaterial({ visible: false })); hit.position.y = 1.2; g.add(hit); this.group.add(g);
      this.pins.push({ place, group: g, hit, dir });
    }
  }
  /** the globe's resting rotation at home: a turn about its own axis (tilted for the desk globe) */
  homeQuat(spin: number) { const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), spin); return this.style === 'desk' ? new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), TILT).multiply(q) : q; }
  /** rotation that brings `dir` (globe-local) to world `to` */
  static facing(dir: THREE.Vector3, to: THREE.Vector3) { return new THREE.Quaternion().setFromUnitVectors(dir.clone().normalize(), to.clone().normalize()); }
}
