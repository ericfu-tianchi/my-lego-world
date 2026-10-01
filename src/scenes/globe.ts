// The home screen: a brick globe (a one-stud shell of a sphere, coloured from real coastline data) on a pedestal, with a pin on every place
// that has a diorama. Ported from the v1 Brick Atlas (~/Desktop/lego-world-claude, src/lib/globe.js) onto the v2 Blueprint and catalogue.
import { Blueprint } from '../core/builder';
import { isLand } from './landmask';

export const GLOBE_R = 15;
export interface Place { id: string; name: string; city: string; lat: number; lon: number; scene: string }
export const PLACES: Place[] = [
  { id: 'japan', name: 'Japan', city: 'Kyoto', lat: 35.0, lon: 135.8, scene: 'kyoto' },
  { id: 'singapore', name: 'Singapore', city: 'Marina Bay', lat: 1.35, lon: 103.8, scene: 'singapore' },
];

export function buildGlobe(bp: Blueprint, R = GLOBE_R) {
  const H = 1.2; const inside = (x: number, y: number, z: number) => x * x + y * y + z * z <= R * R; const ny = Math.ceil(R / H) + 1;
  const hash = (a: number, b: number, c: number, s: number) => { let h = (a * 73856093) ^ (b * 19349663) ^ (c * 83492791) ^ (s * 2654435761); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  const desert = (lat: number, lon: number) => (lat > 14 && lat < 31 && lon > -16 && lon < 36) || (lat > 15 && lat < 30 && lon > 36 && lon < 56) || (lat > -30 && lat < -19 && lon > 118 && lon < 142) || (lat > 38 && lat < 46 && lon > 88 && lon < 112) || (lat > 22 && lat < 33 && lon > -114 && lon < -104);
  const SAMPLES = [[0, 0, 0], [0.35, 0, 0.35], [-0.35, 0, -0.35], [0.35, 0.4, -0.35], [-0.35, -0.4, 0.35]];
  for (let gx = -R - 1; gx <= R; gx++) for (let gz = -R - 1; gz <= R; gz++) for (let k = -ny; k <= ny; k++) {
    const cx = gx + 0.5, cz = gz + 0.5, cy = (k + 0.5) * H; if (!inside(cx, cy, cz)) continue;
    const shell = !inside(cx + 1, cy, cz) || !inside(cx - 1, cy, cz) || !inside(cx, cy, cz + 1) || !inside(cx, cy, cz - 1) || !inside(cx, cy + H, cz) || !inside(cx, cy - H, cz); if (!shell) continue;
    let land = 0, lat0 = 0, lon0 = 0;   // supersample land / ocean round the cell centre
    SAMPLES.forEach(([dx, dy, dz], si) => { const x = cx + dx, y = cy + dy, z = cz + dz; const r = Math.hypot(x, y, z); const lat = Math.asin(y / r) * 180 / Math.PI, lon = Math.atan2(-z, x) * 180 / Math.PI; if (si === 0) { lat0 = lat; lon0 = lon; } if (isLand(lat, lon)) land++; });
    const L = land >= 3; const n = hash(gx, gz, k, 5);
    const color = Math.abs(lat0) > 78 || (L && Math.abs(lat0) > 68) ? 'White' : !L ? (n < 0.22 ? 'DarkAzure' : 'MediumAzure') : desert(lat0, lon0) ? (n < 0.3 ? 'DarkTan' : 'Tan') : n < 0.14 ? 'DarkGreen' : n < 0.34 ? 'Green' : 'BrightGreen';
    for (let dy = 0; dy < 3; dy++) bp.vox1('brick', gx, 3 * k + dy, gz, color);
  }
  const topK = Math.floor(R / H); bp.part('antenna_1x4', -0.5, 3 * topK + 1, -0.5, 'PearlGold');   // axis finial at the north pole
  const baseY = -Math.round((R + 8) / 0.4);                                                          // pedestal
  bp.fill('plate', -5, baseY, -5, 10, 1, 10, 'Black'); bp.fill('plate', -4, baseY + 1, -4, 8, 2, 8, 'DarkBluishGray');
  bp.part('roundplate_4x4', -2, baseY + 3, -2, 'DarkBluishGray');
  const colTop = 3 * -Math.floor(R / H); for (let y = baseY + 4; y + 3 <= colTop; y += 3) bp.part('roundbrick_2x2', -1, y, -1, 'DarkBluishGray');
  bp.part('roundplate_2x2', -1, colTop - 1, -1, 'PearlGold');
  bp.pack(); return { radius: R };
}
export function latLonToDir(lat: number, lon: number): [number, number, number] { const la = lat * Math.PI / 180, lo = lon * Math.PI / 180; return [Math.cos(la) * Math.cos(lo), Math.sin(la), -Math.cos(la) * Math.sin(lo)]; }
