// Renders every catalogue part to a transparent PNG thumbnail; Playwright reads window.__thumbs.
import * as THREE from 'three';
import { PART_LIST, geometryFor, PLATE } from './core/catalog';
import { colorHex, isTrans, COLORS } from './core/colors';
import { CATEGORIES } from './core/catalog';

declare global { interface Window { __thumbs?: Record<string, string>; __meta?: unknown; __done?: boolean } }

const canvas = document.getElementById('c') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(360, 360);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0; renderer.outputColorSpace = THREE.SRGBColorSpace;

// procedural studio environment (same recipe as the app)
function makeStudioEnv() {
  const scene = new THREE.Scene();
  scene.add(new THREE.Mesh(new THREE.BoxGeometry(60, 40, 60), new THREE.MeshBasicMaterial({ color: 0x9a9a9a, side: THREE.BackSide })));
  const panel = (w: number, h: number, x: number, y: number, z: number, c: number, i: number) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(i) })); m.position.set(x, y, z); m.lookAt(0, y * 0.4, 0); scene.add(m); };
  panel(30, 14, -20, 18, 12, 0xfff4e6, 1.6); panel(18, 10, 22, 14, -10, 0xe6f0ff, 1.0); panel(40, 6, 0, 19.5, -25, 0xffffff, 0.6);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshBasicMaterial({ color: 0x6b6560 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -19; scene.add(floor);
  const pmrem = new THREE.PMREMGenerator(renderer); const env = pmrem.fromScene(scene, 0.04).texture; pmrem.dispose(); return env;
}
const env = makeStudioEnv();
const scene = new THREE.Scene();
scene.add(new THREE.HemisphereLight(0xe9f0fa, 0x8c7c6c, 0.55));
const key = new THREE.DirectionalLight(0xfff2e2, 2.4); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.03; scene.add(key);
const fill = new THREE.DirectionalLight(0xd6e4ff, 0.45); scene.add(fill);
const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 500);
const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.ShadowMaterial({ opacity: 0.22 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
const matOpaque = new THREE.MeshStandardMaterial({ roughness: 0.38, metalness: 0, envMap: env, envMapIntensity: 0.9 });
const matTrans = new THREE.MeshPhysicalMaterial({ roughness: 0.08, metalness: 0, transparent: true, opacity: 0.62, envMap: env, envMapIntensity: 1.2, depthWrite: false });

const thumbs: Record<string, string> = {};
let current: THREE.Mesh | null = null;
for (const p of PART_LIST) {
  if (current) scene.remove(current);
  const mat = (isTrans(p.showColor) ? matTrans : matOpaque).clone(); mat.color.setHex(colorHex(p.showColor));
  const mesh = new THREE.Mesh(geometryFor(p.key), mat); mesh.castShadow = true; mesh.receiveShadow = true;
  const H = p.h * PLATE; mesh.position.y = H / 2; scene.add(mesh); current = mesh;
  ground.position.y = 0;
  const r = Math.max(Math.hypot(p.w, p.d) / 2, H / 2, 0.9) * 1.15;
  const dist = r / Math.sin((camera.fov / 2) * Math.PI / 180) * 1.08;
  const az = 0.62, el = 0.5;
  camera.position.set(Math.sin(az) * Math.cos(el) * dist, H / 2 + Math.sin(el) * dist, Math.cos(az) * Math.cos(el) * dist);
  camera.lookAt(0, H / 2 - r * 0.08, 0); camera.updateProjectionMatrix();
  key.position.set(-r * 2.2, r * 3.5, r * 2); key.shadow.camera.left = -r * 1.6; key.shadow.camera.right = r * 1.6; key.shadow.camera.top = r * 1.6; key.shadow.camera.bottom = -r * 1.6; key.shadow.camera.near = 0.1; key.shadow.camera.far = r * 10; key.shadow.camera.updateProjectionMatrix();
  fill.position.set(r * 3, r * 1.2, -r * 2);
  renderer.render(scene, camera);
  thumbs[p.key] = canvas.toDataURL('image/png');
}
window.__thumbs = thumbs;
window.__meta = { categories: CATEGORIES, colors: COLORS, parts: PART_LIST.map((p) => ({ key: p.key, bl: p.bl, name: p.name, zh: p.zh, cat: p.cat, w: p.w, d: p.d, h: p.h, studs: typeof p.studs === 'string' ? p.studs : 'custom', accepts: p.accepts, verified: p.verified, note: p.note ?? '', showColor: p.showColor, hasMask: !!p.mask })) };
window.__done = true;
console.log('rendered', Object.keys(thumbs).length, 'parts');
