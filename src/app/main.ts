import * as THREE from 'three';
import { Blueprint } from '../core/builder';
import { BrickRenderer, makeStudioEnv, makeLights, type Item } from '../core/render';
import { Orbit } from '../core/controls';
import { PhysicsClient } from '../physics/client';
import { validate, summarize } from '../core/validate';
import { SCENES } from '../scenes/index';

const TABLE_Y = -6;
const qs = new URLSearchParams(location.search);
const SHOT = qs.has('shot');
const $ = (id: string) => document.getElementById(id) as HTMLElement;
type State = 'idle' | 'building' | 'built' | 'dismantling' | 'settled' | 'rebuilding';

const app = {
  state: 'idle' as State, items: [] as Item[], anims: [] as { it: Item; fromP: THREE.Vector3; fromQ: THREE.Quaternion; delay: number; dur: number; arc: number }[], animT: 0, animDone: null as null | (() => void),
  physics: new PhysicsClient(), lastPoses: null as Float32Array | null, sceneId: 'kyoto', clock: new THREE.Clock(), autoRotate: 0.05,
  renderer: null as unknown as THREE.WebGLRenderer, scene: null as unknown as THREE.Scene, camera: null as unknown as THREE.PerspectiveCamera, orbit: null as unknown as Orbit, lights: null as unknown as ReturnType<typeof makeLights>, bricks: null as unknown as BrickRenderer, center: new THREE.Vector3(),
};

function init() {
  const canvas = $('c') as HTMLCanvasElement;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: SHOT });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0; renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(32, innerWidth / innerHeight, 0.5, 600);
  const orbit = new Orbit(camera, canvas); const lights = makeLights(scene); const bricks = new BrickRenderer(scene); bricks.setEnvironment(makeStudioEnv(renderer));
  const table = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.ShadowMaterial({ opacity: 0.22 })); table.rotation.x = -Math.PI / 2; table.position.y = TABLE_Y; table.receiveShadow = true; scene.add(table);
  Object.assign(app, { renderer, scene, camera, orbit, lights, bricks });
  addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
  $('btn-apart').onclick = () => dismantle(); $('btn-rebuild').onclick = () => rebuild();
  document.querySelectorAll<HTMLButtonElement>('[data-scene]').forEach((b) => (b.onclick = () => switchScene(b.dataset.scene!)));
  orbit.onInteract = () => { orbit.autoRotate = 0; };
  app.physics.onFrame = (f) => { if (app.state !== 'dismantling' && app.state !== 'settled') return; applyPoses(f.poses); app.lastPoses = f.poses; if (f.awake === 0 && app.state === 'dismantling') setState('settled'); };
}
function loadScene(id: string) {
  const def = SCENES[id]; if (!def) return; app.sceneId = id; const bp = new Blueprint(def.seed);
  const t0 = performance.now(); const meta = def.build(bp); const t1 = performance.now();
  const rep = validate(bp.parts); console.log(`scene ${id}: ${(t1 - t0).toFixed(0)}ms\n` + summarize(rep, 10));
  const origin = new THREE.Vector3(-meta.size[0] / 2, 0, -meta.size[1] / 2);
  app.items = app.bricks.build(bp.parts, origin); const st = bp.stats();
  app.center.set(0, meta.center[1], 0); const radius = Math.hypot(meta.size[0], meta.size[1]) / 2 + 4; app.lights.frame(app.center, radius);
  const o = app.orbit; o.target.copy(app.center); o.az = meta.camera?.az ?? 0.62; o.el = meta.camera?.el ?? 0.4; o.dist = meta.camera?.dist ?? radius * 2.7; o.minDist = 8; o.maxDist = 220; o.autoRotate = app.autoRotate;
  if (qs.has('az')) o.az = +qs.get('az')!; if (qs.has('el')) o.el = +qs.get('el')!; if (qs.has('dist')) o.dist = +qs.get('dist')!; if (qs.has('tx')) o.target.set(+qs.get('tx')!, +qs.get('ty')!, +qs.get('tz')!);
  $('place-title').textContent = meta.title; $('place-sub').textContent = `${meta.caption} · ${meta.subtitle}`;
  $('place-stats').textContent = `${st.parts.toLocaleString()} bricks · ${st.types} part types · ${st.colors} colours · ${rep.ok ? 'all connected' : rep.floating + ' floating'}`;
  document.querySelectorAll<HTMLButtonElement>('[data-scene]').forEach((b) => b.classList.toggle('on', b.dataset.scene === id));
  app.bricks.resetHome(); setState('built');
}
function switchScene(id: string) { if (id === app.sceneId || app.state === 'building' || app.state === 'rebuilding') return; app.physics.stop(); app.anims = []; loadScene(id); if (!SHOT) playBuildIn(); }
function setState(s: State) { app.state = s; $('btn-apart').hidden = s !== 'built'; $('btn-rebuild').hidden = !(s === 'settled' || s === 'dismantling'); $('strength-wrap').hidden = s !== 'built'; }

// ---- animation ---------------------------------------------------------------------------------
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const smooth = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
function animateItems(fromFn: (it: Item) => { p: THREE.Vector3; q: THREE.Quaternion }, delayFn: (it: Item) => number, dur: number, arc: number, onDone: () => void) {
  app.anims = app.items.map((it) => { const f = fromFn(it); return { it, fromP: f.p, fromQ: f.q, delay: delayFn(it), dur, arc }; }); app.animT = 0; app.animDone = onDone;
}
function playBuildIn() {
  setState('building'); const maxY = Math.max(...app.items.map((i) => i.home.p.y));
  animateItems((it) => ({ p: it.home.p.clone().add(new THREE.Vector3((Math.random() - 0.5) * 6, -18 - Math.random() * 10, (Math.random() - 0.5) * 6)), q: new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.random() * 2, Math.random() * 2, Math.random() * 2)) }),
    (it) => (it.home.p.y - TABLE_Y) / (maxY - TABLE_Y) * 1.3 + Math.random() * 0.15, 0.9, 0, () => setState('built'));
}
function stepAnims(dt: number) {
  if (!app.anims.length) return; app.animT += dt; let all = true; const p = new THREE.Vector3(), q = new THREE.Quaternion();
  for (const a of app.anims) {
    const t = THREE.MathUtils.clamp((app.animT - a.delay) / a.dur, 0, 1); if (t < 1) all = false;
    const e = a.arc ? smooth(t) : easeOut(t); p.lerpVectors(a.fromP, a.it.home.p, e); p.y += Math.sin(t * Math.PI) * a.arc; q.slerpQuaternions(a.fromQ, a.it.home.q, e); app.bricks.setPose(a.it, p, q);
  }
  app.bricks.commit(); if (all) { app.anims = []; app.animDone?.(); }
}
// ---- physics -----------------------------------------------------------------------------------------
function applyPoses(poses: Float32Array) { const p = new THREE.Vector3(), q = new THREE.Quaternion(); for (let i = 0; i < app.items.length; i++) { const o = i * 7; p.set(poses[o], poses[o + 1], poses[o + 2]); q.set(poses[o + 3], poses[o + 4], poses[o + 5], poses[o + 6]); app.bricks.setPose(app.items[i], p, q); } app.bricks.commit(); }
function dismantle() {
  if (app.state !== 'built') return; setState('dismantling'); app.orbit.autoRotate = 0;
  const n = app.items.length; const poses = new Float32Array(n * 7), halfs = new Float32Array(n * 3), fixed = new Uint8Array(n);
  app.items.forEach((it, i) => { poses.set([it.home.p.x, it.home.p.y, it.home.p.z, it.home.q.x, it.home.q.y, it.home.q.z, it.home.q.w], i * 7); halfs.set(it.half, i * 3); fixed[i] = it.key.startsWith('baseplate_') ? 1 : 0; });
  const strength = +($('strength') as HTMLInputElement).value;
  app.physics.start(poses, halfs, fixed, strength, TABLE_Y, [0, 0], 7);
}
function rebuild() {
  if (!(app.state === 'settled' || app.state === 'dismantling')) return; app.physics.stop(); setState('rebuilding');
  const maxY = Math.max(...app.items.map((i) => i.home.p.y));
  animateItems((it) => { const p = new THREE.Vector3(), q = new THREE.Quaternion(); app.bricks.getPose(it, p, q); return { p, q }; }, (it) => (it.home.p.y - TABLE_Y) / (maxY - TABLE_Y) * 1.2 + Math.random() * 0.1, 1.6, 4, () => { setState('built'); app.orbit.autoRotate = app.autoRotate; });
}
// ---- loop ---------------------------------------------------------------------------------------------
function frame() { const dt = Math.min(0.05, app.clock.getDelta()); app.orbit.update(dt); stepAnims(dt); app.renderer.render(app.scene, app.camera); requestAnimationFrame(frame); }
declare global { interface Window { __ready?: boolean; __app?: typeof app } }
async function start() {
  init(); loadScene(qs.get('scene') && SCENES[qs.get('scene')!] ? qs.get('scene')! : 'kyoto');
  window.__app = app;
  if (SHOT) {
    if (qs.has('strength')) ($('strength') as HTMLInputElement).value = qs.get('strength')!;
    if (qs.has('dismantle')) { // run the sim for T seconds, then hold the frame
      const T = +qs.get('dismantle')!; dismantle();
      await new Promise<void>((res) => { let t0 = 0; const orig = app.physics.onFrame!; app.physics.onFrame = (f) => { orig(f); if (!t0) t0 = performance.now(); if (performance.now() - t0 > T * 1000) { app.physics.pause(true); res(); } }; });
    }
  } else playBuildIn();
  app.clock.getDelta(); frame(); requestAnimationFrame(() => requestAnimationFrame(() => { window.__ready = true; }));
}
start();
