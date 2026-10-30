import * as THREE from 'three';
import { PARTS, geometryFor, footprint, PLATE } from './catalog';
import { colorHex, isTrans, isGlass } from './colors';
import { PRINTS, decalGeometry, printTexture } from './prints';
import type { Placement } from './builder';
import { bodyBox } from './ldraw';

export interface Item { mesh: THREE.InstancedMesh; index: number; key: string; tag?: string; home: { p: THREE.Vector3; q: THREE.Quaternion }; half: [number, number, number]; y: number; decal?: { mesh: THREE.InstancedMesh; index: number } }

/** InstancedMesh per part type × opacity × print; flat item list drives physics and animation. Prints ride as decal instances. */
/** a phone or tablet: draw the cheaper variants (also forced by ?touch) */
const LOW_GPU = typeof matchMedia !== 'undefined' && (matchMedia('(pointer: coarse)').matches || /[?&]touch\b/.test(location.search));
export class BrickRenderer {
  group = new THREE.Group(); items: Item[] = []; meshes: THREE.InstancedMesh[] = []; decals = new Set<THREE.InstancedMesh>();
  matOpaque = new THREE.MeshStandardMaterial({ roughness: 0.38, metalness: 0, envMapIntensity: 0.9 });
  // LDraw moulds are drawn two-sided: the library's sub-part winding is not reliable after nested BFC inversion, and a culled sleeve
  // face lets you see the hand's wrist post through the arm (Eric's screenshot, 2026-09-16). Our own box bricks stay one-sided.
  matOpaqueDS = new THREE.MeshStandardMaterial({ roughness: 0.38, metalness: 0, envMapIntensity: 0.9, side: THREE.DoubleSide });
  matTrans = new THREE.MeshPhysicalMaterial({ roughness: 0.08, metalness: 0, transparent: true, opacity: 0.62, envMapIntensity: 1.2, depthWrite: false });
  // curtain-wall glass: real transmission (three renders the opaque scene first and the glass samples it, tinted by the colour), so a
  // core or the sky shows through the facade; the flat 0.62 alpha above reads as frost on a whole tower (Shanghai Tower, 2026-10-03)
  // phones: transmission re-renders every opaque brick into a second target each frame (Shanghai's whole set drawn twice); there the
  // glass is an opaque polished panel in its own colour instead (Eric 2026-10-08: big sets stuttered on his phone)
  matGlass = LOW_GPU ? new THREE.MeshStandardMaterial({ roughness: 0.12, metalness: 0.3, envMapIntensity: 1.5, side: THREE.DoubleSide })   // opaque: see-through alpha reads as frost (pipeline trap)
    : new THREE.MeshPhysicalMaterial({ roughness: 0.15, metalness: 0, transmission: 0.85, thickness: 0.6, ior: 1.5, envMapIntensity: 1.4, specularIntensity: 1, side: THREE.DoubleSide });
  matSil = new THREE.MeshBasicMaterial({ color: 0x141414 });
  anisotropy = 4;
  /** night mode: a rule naming the glow colour of a brick (by tag, colour key, part key); glowing groups get their own material */
  glowRule: ((tag: string, color: string, key: string) => number | null) | null = null; private glowMats: { mat: THREE.MeshStandardMaterial; color: number }[] = [];
  private m = new THREE.Matrix4(); private one = new THREE.Vector3(1, 1, 1);
  /** sets built once and kept (keyed by scene id): a globe click swaps one in instead of building 8,000 instances inside the click */
  private sets = new Map<string, { meshes: THREE.InstancedMesh[]; items: Item[]; decals: Set<THREE.InstancedMesh>; glowMats: { mat: THREE.MeshStandardMaterial; color: number }[] }>(); private current: string | null = null;
  constructor(scene: THREE.Scene) { scene.add(this.group); }
  has(key: string) { return this.sets.has(key); }
  build(parts: Placement[], origin = new THREE.Vector3(), key?: string) {
    this.clear();
    const kept = key ? this.sets.get(key) : undefined;
    if (kept) { this.meshes = kept.meshes; this.items = kept.items; this.decals = kept.decals; this.glowMats = kept.glowMats; for (const m of this.meshes) this.group.add(m); this.current = key!; return this.items; }
    const groups = new Map<string, Placement[]>();
    // an assembly proxy is for the validator; its members are the bricks you see
    this.glowMats = [];
    for (const p of parts) { if (p.proxy) continue; const glow = this.glowRule?.(p.tag ?? '', p.color, p.key) ?? null; const gk = p.key + (isGlass(p.color) ? '#g' : isTrans(p.color) ? '#t' : '') + (glow !== null ? '#n' + glow : '') + (p.print ? '#p' + p.print : ''); (groups.get(gk) ?? groups.set(gk, []).get(gk)!).push(p); }
    const q = new THREE.Quaternion(), pos = new THREE.Vector3(), c = new THREE.Color(), up = new THREE.Vector3(0, 1, 0), rm = new THREE.Matrix4();
    for (const [gk, list] of groups) {
      const key = gk.split('#')[0]; const glass = gk.includes('#g'); const trans = glass || gk.includes('#t'); const printKey = /#p(.+)$/.exec(gk)?.[1]; const def = PARTS[key];
      const ds = !trans && !!def.ldraw;
      const glowHex = /#n(\d+)/.exec(gk); let mat: THREE.Material = glass ? this.matGlass : trans ? this.matTrans : ds ? this.matOpaqueDS : this.matOpaque;
      if (glowHex) { const m = (mat as THREE.MeshStandardMaterial).clone(); this.glowMats.push({ mat: m, color: +glowHex[1] }); mat = m; }
      const mesh = new THREE.InstancedMesh(geometryFor(key), mat, list.length); mesh.userData.base = mat; mesh.userData.trans = trans; mesh.userData.glass = glass; mesh.userData.ds = ds;
      mesh.castShadow = !trans; mesh.receiveShadow = true; mesh.frustumCulled = false; mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      let decal: THREE.InstancedMesh | undefined;
      if (printKey) {
        const pd = PRINTS[printKey]; const mat = new THREE.MeshStandardMaterial({ map: printTexture(pd, def, this.anisotropy), transparent: true, roughness: 0.42, metalness: 0, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, envMapIntensity: 0.5, side: THREE.DoubleSide });
        decal = new THREE.InstancedMesh(decalGeometry(pd, def), mat, list.length); decal.frustumCulled = false; decal.instanceMatrix.setUsage(THREE.DynamicDrawUsage); decal.receiveShadow = true; decal.renderOrder = 1;
      }
      list.forEach((p, i) => {
        const [fw, fd] = footprint(def, p.rot); let half: [number, number, number] = [def.w / 2, def.h * PLATE / 2, def.d / 2];
        if (p.xform) { // assembly member: its own transform; the physics box is its body box (the geometry is centred on it)
          const { p: xp, m } = p.xform; pos.set(origin.x + xp[0], origin.y + xp[1], origin.z + xp[2]);
          rm.set(m[0], m[1], m[2], 0, m[3], m[4], m[5], 0, m[6], m[7], m[8], 0, 0, 0, 0, 1); q.setFromRotationMatrix(rm);
          const b = bodyBox(def.ldraw!); half = [(b[3] - b[0]) / 2, (b[4] - b[1]) / 2, (b[5] - b[2]) / 2];
        } else { pos.set(origin.x + p.x + fw / 2, origin.y + (p.y + def.h / 2) * PLATE, origin.z + p.z + fd / 2); q.setFromAxisAngle(up, p.rot * Math.PI / 2); }
        this.m.compose(pos, q, this.one); mesh.setMatrixAt(i, this.m); if (decal) decal.setMatrixAt(i, this.m);
        c.setHex(colorHex(p.color)); mesh.setColorAt(i, c);
        this.items.push({ mesh, index: i, key, tag: p.tag, home: { p: pos.clone(), q: q.clone() }, half, y: p.y, decal: decal ? { mesh: decal, index: i } : undefined });
      });
      mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      this.group.add(mesh); this.meshes.push(mesh);
      if (decal) { decal.instanceMatrix.needsUpdate = true; this.group.add(decal); this.meshes.push(decal); this.decals.add(decal); }
    }
    if (key) { this.sets.set(key, { meshes: this.meshes, items: this.items, decals: this.decals, glowMats: this.glowMats }); this.current = key; }
    return this.items;
  }
  setPose(it: Item, p: THREE.Vector3, q: THREE.Quaternion) { this.m.compose(p, q, this.one); it.mesh.setMatrixAt(it.index, this.m); if (it.decal) it.decal.mesh.setMatrixAt(it.decal.index, this.m); }
  getPose(it: Item, p: THREE.Vector3, q: THREE.Quaternion) { it.mesh.getMatrixAt(it.index, this.m); this.m.decompose(p, q, new THREE.Vector3()); }
  commit() { for (const m of this.meshes) m.instanceMatrix.needsUpdate = true; }
  /** shadow casting on or off for every brick (a per-object flag: no shader recompile) */
  castShadows(on: boolean) { for (const m of this.meshes) if (!this.decals.has(m)) m.castShadow = on && !m.userData.trans; }
  resetHome() { for (const it of this.items) this.setPose(it, it.home.p, it.home.q); this.commit(); }
  /** Black-on-white silhouette for judging: one flat material, prints hidden. */
  silhouette(on: boolean) { for (const m of this.meshes) { if (this.decals.has(m)) { m.visible = !on; continue; } m.material = on ? this.matSil : (m.userData.base ?? this.matOpaque); m.castShadow = !on && !m.userData.trans; } }
  clear() { const keep = this.current !== null; for (const m of this.meshes) { this.group.remove(m); if (keep) continue; if (this.decals.has(m)) (m.material as THREE.Material).dispose(); m.dispose(); }   // a kept set is only detached
    this.meshes = []; this.items = []; this.decals = new Set(); this.glowMats = []; this.current = null; }
  /** the material a placement is drawn with (for prewarming programs and geometry uploads before a set enters) */
  materialFor(p: Placement): THREE.Material { const def = PARTS[p.key]; return isGlass(p.color) ? this.matGlass : isTrans(p.color) ? this.matTrans : def?.ldraw ? this.matOpaqueDS : this.matOpaque; }
  /** night: glowing groups emit their colour; everything else is lit by the scene's night lights */
  setNight(on: boolean) { for (const m of [this.matOpaque, this.matOpaqueDS, this.matTrans, this.matGlass, ...this.glowMats.map((g) => g.mat)]) m.envMapIntensity = on ? 0.12 : m === this.matTrans || m === this.matGlass ? 1.2 : 0.9;
    for (const g of this.glowMats) { g.mat.emissive.setHex(on ? g.color : 0x000000); g.mat.emissiveIntensity = on ? 1.6 : 0; g.mat.needsUpdate = true; } }
  setEnvironment(env: THREE.Texture) { this.matOpaque.envMap = env; this.matOpaqueDS.envMap = env; this.matTrans.envMap = env; this.matGlass.envMap = env; }
}

export function makeStudioEnv(renderer: THREE.WebGLRenderer) {
  const scene = new THREE.Scene();
  scene.add(new THREE.Mesh(new THREE.BoxGeometry(60, 40, 60), new THREE.MeshBasicMaterial({ color: 0x9a9a9a, side: THREE.BackSide })));
  const panel = (w: number, h: number, x: number, y: number, z: number, c: number, i: number) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(i) })); m.position.set(x, y, z); m.lookAt(0, y * 0.4, 0); scene.add(m); };
  panel(30, 14, -20, 18, 12, 0xfff4e6, 1.6); panel(18, 10, 22, 14, -10, 0xe6f0ff, 1.0); panel(40, 6, 0, 19.5, -25, 0xffffff, 0.6);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshBasicMaterial({ color: 0x6b6560 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -19; scene.add(floor);
  const pmrem = new THREE.PMREMGenerator(renderer); const env = pmrem.fromScene(scene, 0.04).texture; pmrem.dispose(); return env;
}
export function makeLights(scene: THREE.Scene) {
  const hemi = new THREE.HemisphereLight(0xe9f0fa, 0x8c7c6c, 0.55); scene.add(hemi);
  const key = new THREE.DirectionalLight(0xfff2e2, 2.4); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.03; key.shadow.radius = 3; scene.add(key); scene.add(key.target);
  const fill = new THREE.DirectionalLight(0xd6e4ff, 0.45); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffe8c8, 0.35); scene.add(rim);
  /** night: a dim blue moonlight from the same side, a deep blue sky-fill; day restores the studio */
  const night = (on: boolean) => { hemi.color.setHex(on ? 0x3a4a78 : 0xe9f0fa); hemi.groundColor.setHex(on ? 0x14100c : 0x8c7c6c); hemi.intensity = on ? 0.35 : 0.55; key.color.setHex(on ? 0x8fa6ff : 0xfff2e2); key.intensity = on ? 0.35 : 2.4; fill.intensity = on ? 0.12 : 0.45; rim.intensity = on ? 0.1 : 0.35; };
  return { key, fill, rim, night, frame(center: THREE.Vector3, radius: number) {
    key.position.set(center.x - radius * 1.1, center.y + radius * 1.6, center.z + radius * 0.9); key.target.position.copy(center);
    const c = key.shadow.camera; c.left = -radius * 1.2; c.right = radius * 1.2; c.top = radius * 1.2; c.bottom = -radius * 1.2; c.near = 1; c.far = radius * 5; c.updateProjectionMatrix();
    fill.position.set(center.x + radius * 1.5, center.y + radius * 0.6, center.z - radius * 0.8); rim.position.set(center.x + radius * 0.2, center.y + radius * 0.8, center.z - radius * 1.6);
  } };
}
