import * as THREE from 'three';
import { PARTS, geometryFor, footprint, PLATE } from './catalog';
import { colorHex, isTrans } from './colors';
import { PRINTS, decalGeometry, printTexture } from './prints';
import type { Placement } from './builder';

export interface Item { mesh: THREE.InstancedMesh; index: number; key: string; home: { p: THREE.Vector3; q: THREE.Quaternion }; half: [number, number, number]; y: number; decal?: { mesh: THREE.InstancedMesh; index: number } }

/** InstancedMesh per part type × opacity × print; flat item list drives physics and animation. Prints ride as decal instances. */
export class BrickRenderer {
  group = new THREE.Group(); items: Item[] = []; meshes: THREE.InstancedMesh[] = []; decals = new Set<THREE.InstancedMesh>();
  matOpaque = new THREE.MeshStandardMaterial({ roughness: 0.38, metalness: 0, envMapIntensity: 0.9 });
  // LDraw moulds are drawn two-sided: the library's sub-part winding is not reliable after nested BFC inversion, and a culled sleeve
  // face lets you see the hand's wrist post through the arm (Eric's screenshot, 2026-09-16). Our own box bricks stay one-sided.
  matOpaqueDS = new THREE.MeshStandardMaterial({ roughness: 0.38, metalness: 0, envMapIntensity: 0.9, side: THREE.DoubleSide });
  matTrans = new THREE.MeshPhysicalMaterial({ roughness: 0.08, metalness: 0, transparent: true, opacity: 0.62, envMapIntensity: 1.2, depthWrite: false });
  matSil = new THREE.MeshBasicMaterial({ color: 0x141414 });
  anisotropy = 4;
  private m = new THREE.Matrix4(); private one = new THREE.Vector3(1, 1, 1);
  constructor(scene: THREE.Scene) { scene.add(this.group); }
  build(parts: Placement[], origin = new THREE.Vector3()) {
    this.clear();
    const groups = new Map<string, Placement[]>();
    for (const p of parts) { const gk = p.key + (isTrans(p.color) ? '#t' : '') + (p.print ? '#p' + p.print : ''); (groups.get(gk) ?? groups.set(gk, []).get(gk)!).push(p); }
    const q = new THREE.Quaternion(), pos = new THREE.Vector3(), c = new THREE.Color(), up = new THREE.Vector3(0, 1, 0);
    for (const [gk, list] of groups) {
      const key = gk.split('#')[0]; const trans = gk.includes('#t'); const printKey = /#p(.+)$/.exec(gk)?.[1]; const def = PARTS[key];
      const ds = !trans && !!def.ldraw;
      const mesh = new THREE.InstancedMesh(geometryFor(key), trans ? this.matTrans : ds ? this.matOpaqueDS : this.matOpaque, list.length); mesh.userData.trans = trans; mesh.userData.ds = ds;
      mesh.castShadow = !trans; mesh.receiveShadow = true; mesh.frustumCulled = false; mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      let decal: THREE.InstancedMesh | undefined;
      if (printKey) {
        const pd = PRINTS[printKey]; const mat = new THREE.MeshStandardMaterial({ map: printTexture(pd, def, this.anisotropy), transparent: true, roughness: 0.42, metalness: 0, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, envMapIntensity: 0.5, side: THREE.DoubleSide });
        decal = new THREE.InstancedMesh(decalGeometry(pd, def), mat, list.length); decal.frustumCulled = false; decal.instanceMatrix.setUsage(THREE.DynamicDrawUsage); decal.receiveShadow = true; decal.renderOrder = 1;
      }
      list.forEach((p, i) => {
        const [fw, fd] = footprint(def, p.rot);
        pos.set(origin.x + p.x + fw / 2, origin.y + (p.y + def.h / 2) * PLATE, origin.z + p.z + fd / 2);
        q.setFromAxisAngle(up, p.rot * Math.PI / 2); this.m.compose(pos, q, this.one); mesh.setMatrixAt(i, this.m); if (decal) decal.setMatrixAt(i, this.m);
        c.setHex(colorHex(p.color)); mesh.setColorAt(i, c);
        this.items.push({ mesh, index: i, key, home: { p: pos.clone(), q: q.clone() }, half: [def.w / 2, def.h * PLATE / 2, def.d / 2], y: p.y, decal: decal ? { mesh: decal, index: i } : undefined });
      });
      mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      this.group.add(mesh); this.meshes.push(mesh);
      if (decal) { decal.instanceMatrix.needsUpdate = true; this.group.add(decal); this.meshes.push(decal); this.decals.add(decal); }
    }
    return this.items;
  }
  setPose(it: Item, p: THREE.Vector3, q: THREE.Quaternion) { this.m.compose(p, q, this.one); it.mesh.setMatrixAt(it.index, this.m); if (it.decal) it.decal.mesh.setMatrixAt(it.decal.index, this.m); }
  getPose(it: Item, p: THREE.Vector3, q: THREE.Quaternion) { it.mesh.getMatrixAt(it.index, this.m); this.m.decompose(p, q, new THREE.Vector3()); }
  commit() { for (const m of this.meshes) m.instanceMatrix.needsUpdate = true; }
  resetHome() { for (const it of this.items) this.setPose(it, it.home.p, it.home.q); this.commit(); }
  /** Black-on-white silhouette for judging: one flat material, prints hidden. */
  silhouette(on: boolean) { for (const m of this.meshes) { if (this.decals.has(m)) { m.visible = !on; continue; } m.material = on ? this.matSil : (m.userData.trans ? this.matTrans : m.userData.ds ? this.matOpaqueDS : this.matOpaque); m.castShadow = !on && !m.userData.trans; } }
  clear() { for (const m of this.meshes) { this.group.remove(m); if (this.decals.has(m)) (m.material as THREE.Material).dispose(); m.dispose(); } this.meshes = []; this.items = []; this.decals.clear(); }
  setEnvironment(env: THREE.Texture) { this.matOpaque.envMap = env; this.matOpaqueDS.envMap = env; this.matTrans.envMap = env; }
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
  scene.add(new THREE.HemisphereLight(0xe9f0fa, 0x8c7c6c, 0.55));
  const key = new THREE.DirectionalLight(0xfff2e2, 2.4); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.03; key.shadow.radius = 3; scene.add(key); scene.add(key.target);
  const fill = new THREE.DirectionalLight(0xd6e4ff, 0.45); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffe8c8, 0.35); scene.add(rim);
  return { key, fill, rim, frame(center: THREE.Vector3, radius: number) {
    key.position.set(center.x - radius * 1.1, center.y + radius * 1.6, center.z + radius * 0.9); key.target.position.copy(center);
    const c = key.shadow.camera; c.left = -radius * 1.2; c.right = radius * 1.2; c.top = radius * 1.2; c.bottom = -radius * 1.2; c.near = 1; c.far = radius * 5; c.updateProjectionMatrix();
    fill.position.set(center.x + radius * 1.5, center.y + radius * 0.6, center.z - radius * 0.8); rim.position.set(center.x + radius * 0.2, center.y + radius * 0.8, center.z - radius * 1.6);
  } };
}
