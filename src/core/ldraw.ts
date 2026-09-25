// Runtime decoder for geometry baked from the LDraw official library (tools/ldraw/bake.mjs).
// Baked data is quantised: Int16 positions (q units per stud), Int8 normals, Uint16/Uint32 indices, all base64.
import * as THREE from 'three';
import { LDRAW } from '../parts/ldraw/index';
import { PLATE } from './geometry';

export interface Baked { id: string; name: string; tris: number; q: number; i32: boolean; bbox: number[]; pos: string; nrm: string; idx: string }

const NodeBuffer = (globalThis as unknown as { Buffer?: { from(s: string, enc: string): Uint8Array } }).Buffer;
function bytes(s: string): Uint8Array { return NodeBuffer ? new Uint8Array(NodeBuffer.from(s, 'base64')) : Uint8Array.from(atob(s), (c) => c.charCodeAt(0)); }
const cache = new Map<string, THREE.BufferGeometry>();
export function hasBaked(id: string) { return !!LDRAW[id]; }
/** Baked bounding box in our units, relative to the LDraw origin: [x0, y0, z0, x1, y1, z1]. */
export function bakedBox(id: string): number[] { const b = LDRAW[id]; if (!b) throw new Error(`LDraw part ${id} not baked`); return b.bbox; }
/** Geometry in our units, centred on the footprint's bounding box in x/z, bottom flush with a part box `h` plates tall
 *  (so render pose == physics pose). `lift` raises the part by whole plates when its LDraw origin sits below the connection. */
export type Anchor = 'bbox' | 'origin' | 'oxz';
export function ldrawGeometry(id: string, h: number, lift = 0, anchor: Anchor = 'bbox'): THREE.BufferGeometry {
  const ck = `${id}/${h}/${lift}/${anchor}`; const hit = cache.get(ck); if (hit) return hit;
  const b = LDRAW[id]; if (!b) throw new Error(`LDraw part ${id} not baked — run: node tools/ldraw/bake.mjs ${id}`);
  const P = new Int16Array(bytes(b.pos).buffer), N = new Int8Array(bytes(b.nrm).buffer); const ib = bytes(b.idx); const I = b.i32 ? new Uint32Array(ib.buffer) : new Uint16Array(ib.buffer);
  const pos = new Float32Array(P.length), nrm = new Float32Array(N.length);
  // bbox: centre the footprint, bottom flush with the part box. origin: the LDraw origin (its stud/connection point) sits at the box's bottom centre.
  const originXZ = anchor !== 'bbox'; const cx = originXZ ? 0 : (b.bbox[0] + b.bbox[3]) / 2, cz = originXZ ? 0 : (b.bbox[2] + b.bbox[5]) / 2, dy = -h * PLATE / 2 - (anchor === 'origin' ? 0 : b.bbox[1]) + lift * PLATE;
  for (let i = 0; i < P.length; i += 3) { pos[i] = P[i] / b.q - cx; pos[i + 1] = P[i + 1] / b.q + dy; pos[i + 2] = P[i + 2] / b.q - cz; }
  for (let i = 0; i < N.length; i++) nrm[i] = N[i] / 127;
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nrm, 3)); g.setIndex(new THREE.BufferAttribute(I, 1));
  cache.set(ck, g); return g;
}
