import * as THREE from 'three';
import { Blueprint } from '../core/builder';
import { BrickRenderer, makeStudioEnv, makeLights, type Item } from '../core/render';
import { Orbit } from '../core/controls';
import { PhysicsClient } from '../physics/client';
import { validate, summarize } from '../core/validate';
import { SCENES } from '../scenes/index';
import { buildGlobe, latLonToDir, PLACES, type Place } from '../scenes/globe';
import { geometryFor } from '../core/catalog';
import { colorHex } from '../core/colors';

const TABLE_Y = -6;
const qs = new URLSearchParams(location.search);
const SHOT = qs.has('shot');
const $ = (id: string) => document.getElementById(id) as HTMLElement;
type State = 'idle' | 'building' | 'built' | 'dismantling' | 'settled' | 'rebuilding';

const app = {
  tableY: TABLE_Y, table: null as unknown as THREE.Mesh<THREE.PlaneGeometry, THREE.ShadowMaterial>,
  state: 'idle' as State, items: [] as Item[], anims: [] as { it: Item; fromP: THREE.Vector3; fromQ: THREE.Quaternion; delay: number; dur: number; arc: number }[], animT: 0, animDone: null as null | (() => void), ease: null as null | ((t: number) => number),
  physics: new PhysicsClient(), lastPoses: null as Float32Array | null, prevPoses: null as Float32Array | null, poseAt: 0, poseGap: 1000 / 60, sceneId: 'kyoto', clock: new THREE.Clock(), autoRotate: 0.05,
  view: 'scene' as 'globe' | 'scene', globe: null as unknown as BrickRenderer, globeR: 15, pins: [] as { place: Place; group: THREE.Group; hit: THREE.Mesh; label: HTMLElement; dir: THREE.Vector3 }[], hover: null as null | { place: Place }, camAnim: null as null | { t: number; dur: number; step: (k: number) => void; done?: () => void }, raycaster: new THREE.Raycaster(), env: null as unknown as THREE.Texture,
  renderer: null as unknown as THREE.WebGLRenderer, scene: null as unknown as THREE.Scene, camera: null as unknown as THREE.PerspectiveCamera, orbit: null as unknown as Orbit, lights: null as unknown as ReturnType<typeof makeLights>, bricks: null as unknown as BrickRenderer, center: new THREE.Vector3(),
};

function init() {
  const canvas = $('c') as HTMLCanvasElement;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: SHOT });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0; renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(32, innerWidth / innerHeight, 0.5, 600);
  const orbit = new Orbit(camera, canvas); const lights = makeLights(scene); const bricks = new BrickRenderer(scene); bricks.anisotropy = renderer.capabilities.getMaxAnisotropy(); const env = makeStudioEnv(renderer); bricks.setEnvironment(env);
  const globe = new BrickRenderer(scene); globe.setEnvironment(env);
  const table = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.ShadowMaterial({ opacity: 0.22 })); table.rotation.x = -Math.PI / 2; table.position.y = TABLE_Y; table.receiveShadow = true; scene.add(table);
  if (SHOT && qs.has('sil')) { table.visible = false; renderer.shadowMap.enabled = false; scene.background = new THREE.Color(0xffffff); document.body.style.background = '#fff'; document.querySelectorAll<HTMLElement>('.hud').forEach((h) => (h.style.display = 'none')); }
  Object.assign(app, { renderer, scene, camera, orbit, lights, bricks, table, globe, env });
  addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
  $('btn-apart').onclick = () => dismantle(); $('btn-rebuild').onclick = () => rebuild();
  $('btn-globe').onclick = () => goGlobe();
  canvas.addEventListener('pointermove', (e) => { const pin = pickPin(e); app.hover = pin; canvas.style.cursor = pin ? 'pointer' : ''; });
  let pressAt: [number, number] | null = null;
  canvas.addEventListener('pointerdown', (e) => { pressAt = [e.clientX, e.clientY]; });
  canvas.addEventListener('pointerup', (e) => { if (pressAt && Math.hypot(e.clientX - pressAt[0], e.clientY - pressAt[1]) < 6) { const pin = pickPin(e); if (pin) enterPlace(pin.place); } pressAt = null; });
  orbit.onInteract = () => { orbit.autoRotate = 0; if (app.view === 'scene' && app.camAnim && !app.camAnim.done) app.camAnim = null; };   // a drag takes the camera back from the entrance swing
  app.physics.onFrame = (f) => { if (app.state !== 'dismantling' && app.state !== 'settled') return; const now = performance.now(); app.prevPoses = app.lastPoses ?? f.poses; app.poseGap = app.lastPoses ? Math.min(100, Math.max(8, now - app.poseAt)) : 1000 / 60; app.poseAt = now; app.lastPoses = f.poses; if (f.awake === 0 && app.state === 'dismantling') setState('settled'); };
}
function loadScene(id: string) {
  const def = SCENES[id]; if (!def) return; app.sceneId = id; const bp = new Blueprint(def.seed);
  const t0 = performance.now(); const meta = def.build(bp); const t1 = performance.now();
  app.tableY = id === 'kyoto-refined' ? -.03 : TABLE_Y; app.table.position.y = app.tableY;
  const rep = validate(bp.parts, meta.base ?? 0); console.log(`scene ${id}: ${(t1 - t0).toFixed(0)}ms\n` + summarize(rep, 10));
  const origin = new THREE.Vector3(-meta.size[0] / 2, 0, -meta.size[1] / 2);
  const only = qs.get('only'); const shown = only ? bp.parts.filter((p) => only.split(',').includes(p.tag ?? '')) : bp.parts;   // ?only=torii,bridge → element renders against clean sky
  app.items = app.bricks.build(shown, origin); const st = bp.stats();
  app.center.set(0, meta.center[1], 0); const radius = Math.hypot(meta.size[0], meta.size[1]) / 2 + 4; app.lights.frame(app.center, radius);
  const o = app.orbit; o.target.copy(app.center); o.az = meta.camera?.az ?? 0.62; o.el = meta.camera?.el ?? 0.4; o.dist = meta.camera?.dist ?? radius * 2.7; o.minDist = 8; o.maxDist = 220; o.autoRotate = app.autoRotate;
  if (qs.has('az')) o.az = +qs.get('az')!; if (qs.has('el')) o.el = +qs.get('el')!; if (qs.has('dist')) o.dist = +qs.get('dist')!; if (qs.has('tx')) o.target.set(+qs.get('tx')!, +qs.get('ty')!, +qs.get('tz')!);
  $('place-title').textContent = meta.title; $('place-sub').textContent = `${meta.caption} · ${meta.subtitle}`;
  $('place-stats').textContent = `${st.parts.toLocaleString()} bricks · ${st.types} part types · ${st.colors} colours · ${rep.ok ? 'connection check passed' : rep.floating + ' floating · ' + rep.overlaps + ' overlaps'}`;
  app.bricks.resetHome(); if (SHOT && qs.has('sil')) app.bricks.silhouette(true); setState('built');
}

// ---- globe (home) ---------------------------------------------------------------------------------
function buildGlobeView() {
  const bp = new Blueprint(3); const meta = buildGlobe(bp); app.globe.build(bp.parts, new THREE.Vector3()); app.globe.resetHome(); app.globeR = meta.radius;
  const pinGroup = new THREE.Group(); app.globe.group.add(pinGroup);
  const mat = (c: string) => new THREE.MeshStandardMaterial({ color: colorHex(c), roughness: 0.35, envMap: app.env, envMapIntensity: 0.9 });
  const red = mat('BrightRed'), white = mat('White'), up = new THREE.Vector3(0, 1, 0);
  for (const place of PLACES) {   // a brick pin: white 2×2 round plate, red 1×1 round brick post, red 2×2 round plate head
    const dir = new THREE.Vector3(...latLonToDir(place.lat, place.lon)); const g = new THREE.Group(); g.position.copy(dir).multiplyScalar(app.globeR + 0.15); g.quaternion.setFromUnitVectors(up, dir);
    const base = new THREE.Mesh(geometryFor('roundplate_2x2'), white); base.position.y = 0.2; g.add(base);
    const post = new THREE.Mesh(geometryFor('round_1x1'), red); post.position.y = 1.0; g.add(post);
    const head = new THREE.Mesh(geometryFor('roundplate_2x2'), red); head.position.y = 1.8; g.add(head);
    g.traverse((m) => { if ((m as THREE.Mesh).isMesh) { m.castShadow = true; m.receiveShadow = true; } });
    const hit = new THREE.Mesh(new THREE.SphereGeometry(2.4, 8, 8), new THREE.MeshBasicMaterial({ visible: false })); hit.position.y = 1.2; g.add(hit); pinGroup.add(g);
    const label = document.createElement('button'); label.className = 'pin-label'; label.innerHTML = `<b>${place.name}</b><span>${place.city}</span>`; label.onclick = () => enterPlace(place); $('labels').appendChild(label);
    app.pins.push({ place, group: g, hit, label, dir });
  }
}
function updateLabels() {
  const camDir = new THREE.Vector3(); app.camera.getWorldDirection(camDir); const p = new THREE.Vector3();
  for (const pin of app.pins) {
    const visible = app.view === 'globe' && !app.camAnim && pin.dir.dot(camDir) < -0.12; pin.label.style.opacity = visible ? '1' : '0'; pin.label.style.pointerEvents = visible ? 'auto' : 'none'; if (!visible) continue;
    pin.group.getWorldPosition(p); p.addScaledVector(pin.dir, 2.6); p.project(app.camera);
    pin.label.style.transform = `translate(-50%, -100%) translate(${(p.x * 0.5 + 0.5) * innerWidth}px, ${(-p.y * 0.5 + 0.5) * innerHeight}px)`; pin.label.classList.toggle('hover', app.hover?.place === pin.place);
  }
}
function pickPin(e: PointerEvent) {
  if (app.view !== 'globe' || app.camAnim) return null;
  app.raycaster.setFromCamera(new THREE.Vector2((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1), app.camera);
  const hits = app.raycaster.intersectObjects(app.pins.map((p) => p.hit), false); return hits.length ? app.pins.find((p) => p.hit === hits[0].object) ?? null : null;
}
function showGlobe() {
  app.view = 'globe'; app.globe.group.visible = true; app.bricks.group.visible = false; app.table.visible = false; app.lights.frame(new THREE.Vector3(), app.globeR + 6);
  const o = app.orbit; o.target.set(0, -3, 0); o.minDist = 30; o.maxDist = 160; o.minEl = -1.2; o.autoRotate = 0.12; o.az = -2.55; o.el = 0.35; o.dist = 86;   // open facing Asia, where the built places are
  $('card-globe').hidden = false; $('card-place').hidden = true; $('actions').hidden = true; $('hint').textContent = 'Drag to spin · Click a pin to visit';
}
const fade = (on: boolean) => new Promise<void>((res) => { $('fade').style.opacity = on ? '1' : '0'; setTimeout(res, 480); });
async function enterPlace(place: Place) {
  if (app.camAnim || app.view !== 'globe') return; app.orbit.enabled = false; app.orbit.autoRotate = 0;
  const pin = app.pins.find((p) => p.place === place)!; const o = app.orbit; const az0 = o.az, el0 = o.el, d0 = o.dist;
  const az1 = Math.atan2(pin.dir.x, pin.dir.z), el1 = Math.asin(pin.dir.y); let dAz = az1 - az0; dAz = Math.atan2(Math.sin(dAz), Math.cos(dAz));
  await new Promise<void>((res) => { app.camAnim = { t: 0, dur: 1.1, done: res, step: (k) => { const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; o.az = az0 + dAz * e; o.el = el0 + (el1 - el0) * e; o.dist = d0 + (app.globeR + 8 - d0) * e; } }; });
  await fade(true);
  o.minEl = 0.05; loadScene(place.scene); app.view = 'scene'; app.globe.group.visible = false; app.bricks.group.visible = true; app.table.visible = true;
  $('card-globe').hidden = true; $('card-place').hidden = false; $('actions').hidden = false; $('hint').textContent = 'Drag to orbit · Scroll to zoom · Shift-drag to pan';
  playBuildIn(true); app.renderer.render(app.scene, app.camera); await fade(false); o.enabled = true;
}
async function goGlobe() {
  if (app.camAnim || app.view !== 'scene' || app.state === 'building' || app.state === 'rebuilding') return;
  app.physics.stop(); app.anims = []; app.orbit.enabled = false; await fade(true);
  app.bricks.clear(); app.items = []; setState('idle'); showGlobe(); app.renderer.render(app.scene, app.camera); await fade(false); app.orbit.enabled = true;
}
function setState(s: State) { app.state = s; $('btn-apart').hidden = s !== 'built'; $('btn-rebuild').hidden = !(s === 'settled' || s === 'dismantling'); $('strength-wrap').hidden = s !== 'built'; }

// ---- animation ---------------------------------------------------------------------------------
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const smooth = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
function animateItems(fromFn: (it: Item) => { p: THREE.Vector3; q: THREE.Quaternion }, delayFn: (it: Item) => number, dur: number, arc: number, onDone: () => void, ease?: (t: number) => number) {
  app.anims = app.items.map((it) => { const f = fromFn(it); return { it, fromP: f.p, fromQ: f.q, delay: delayFn(it), dur, arc }; }); app.animT = 0; app.animDone = onDone; app.ease = ease ?? null;
}
/** The entrance: every brick rains in from above, spinning, and snaps onto its studs in build order — ground first, landmarks last, a slight
 *  overshoot as it seats — while the camera swings in from high and wide. ~4 s; the user sees the set is made of parts before touching it. */
const easeSnap = (t: number) => { const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };   // ease-out-back: lands, dips past home, settles
function playBuildIn(cinematic = false) {
  setState('building'); const ys = app.items.map((i) => i.home.p.y); const minY = Math.min(...ys), maxY = Math.max(...ys);
  const o = app.orbit; const az1 = o.az, el1 = o.el, d1 = o.dist;
  animateItems((it) => ({ p: it.home.p.clone().add(new THREE.Vector3((Math.random() - 0.5) * 10, 26 + Math.random() * 18, (Math.random() - 0.5) * 10)), q: new THREE.Quaternion().setFromEuler(new THREE.Euler((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5)) }),
    (it) => Math.pow((it.home.p.y - minY) / (maxY - minY + 1e-6), 0.8) * 2.6 + (it.home.p.x + 30) / 60 * 0.35 + Math.random() * 0.25, 0.75, 0, () => setState('built'), easeSnap);
  if (cinematic) { o.az = az1 - 0.7; o.el = Math.min(1.2, el1 + 0.45); o.dist = d1 * 1.45; app.camAnim = { t: 0, dur: 4.2, step: (k) => { const e = 1 - Math.pow(1 - k, 3); o.az = az1 - 0.7 * (1 - e); o.el = el1 + 0.45 * (1 - e); o.dist = d1 * (1 + 0.45 * (1 - e)); } }; }
}
function stepAnims(dt: number) {
  if (!app.anims.length) return; app.animT += dt; let all = true; const p = new THREE.Vector3(), q = new THREE.Quaternion();
  for (const a of app.anims) {
    const t = THREE.MathUtils.clamp((app.animT - a.delay) / a.dur, 0, 1); if (t < 1) all = false;
    if (app.ease && app.animT < a.delay) { p.set(0, -500, 0); app.bricks.setPose(a.it, p, a.fromQ); continue; }   // the entrance: a brick appears only when its turn comes, so they rain in rather than hang as a cloud
    const e = app.ease ? app.ease(t) : a.arc ? smooth(t) : easeOut(t); p.lerpVectors(a.fromP, a.it.home.p, e); p.y += Math.sin(t * Math.PI) * a.arc; q.slerpQuaternions(a.fromQ, a.it.home.q, Math.min(1, app.ease ? easeOut(t) : e)); app.bricks.setPose(a.it, p, q);
  }
  app.bricks.commit(); if (all) { app.anims = []; app.animDone?.(); }
}
// ---- physics -----------------------------------------------------------------------------------------
// Physics frames arrive at whatever rate the solver manages; the screen draws at 60+. Each drawn frame shows the bodies interpolated between the
// last two physics frames (one frame of latency), so the fall is smooth even when a step is slow.
const _pa = new THREE.Vector3(), _pb = new THREE.Vector3(), _qa = new THREE.Quaternion(), _qb = new THREE.Quaternion();
function drawPhysics() {
  const cur = app.lastPoses, prev = app.prevPoses; if (!cur || !prev) return; const k = Math.min(1, (performance.now() - app.poseAt) / app.poseGap);
  for (let i = 0; i < app.items.length; i++) { const o = i * 7;
    _pa.set(prev[o], prev[o + 1], prev[o + 2]); _pb.set(cur[o], cur[o + 1], cur[o + 2]); _pa.lerp(_pb, k);
    _qa.set(prev[o + 3], prev[o + 4], prev[o + 5], prev[o + 6]); _qb.set(cur[o + 3], cur[o + 4], cur[o + 5], cur[o + 6]); _qa.slerp(_qb, k);
    app.bricks.setPose(app.items[i], _pa, _qa); }
  app.bricks.commit();
}
function dismantle() {
  if (app.state !== 'built') return; setState('dismantling'); app.orbit.autoRotate = 0; app.lastPoses = app.prevPoses = null;
  const n = app.items.length; const poses = new Float32Array(n * 7), halfs = new Float32Array(n * 3), fixed = new Uint8Array(n);
  app.items.forEach((it, i) => { poses.set([it.home.p.x, it.home.p.y, it.home.p.z, it.home.q.x, it.home.q.y, it.home.q.z, it.home.q.w], i * 7); halfs.set(it.half, i * 3); fixed[i] = it.key.startsWith('baseplate_') ? 1 : 0; });
  const strength = +($('strength') as HTMLInputElement).value;
  app.physics.start(poses, halfs, fixed, strength, app.tableY, [0, 0], 7);
}
function rebuild() {
  if (!(app.state === 'settled' || app.state === 'dismantling')) return; app.physics.stop(); setState('rebuilding');
  const maxY = Math.max(...app.items.map((i) => i.home.p.y));
  animateItems((it) => { const p = new THREE.Vector3(), q = new THREE.Quaternion(); app.bricks.getPose(it, p, q); return { p, q }; }, (it) => (it.home.p.y - TABLE_Y) / (maxY - TABLE_Y) * 1.2 + Math.random() * 0.1, 1.6, 4, () => { setState('built'); app.orbit.autoRotate = app.autoRotate; });
}
// ---- loop ---------------------------------------------------------------------------------------------
function frame() { const dt = Math.min(0.05, app.clock.getDelta());
  if (app.camAnim) { app.camAnim.t += dt; const k = Math.min(1, app.camAnim.t / app.camAnim.dur); app.camAnim.step(k); if (k >= 1) { const d = app.camAnim.done; app.camAnim = null; d?.(); } }
  app.orbit.update(dt); updateLabels(); stepAnims(dt); if (app.state === 'dismantling' || app.state === 'settled') drawPhysics(); app.renderer.render(app.scene, app.camera); requestAnimationFrame(frame); }
declare global { interface Window { __ready?: boolean; __app?: typeof app } }
async function start() {
  init(); buildGlobeView(); window.__app = app;
  const direct = qs.get('scene') && SCENES[qs.get('scene')!] ? qs.get('scene')! : null;   // ?scene= opens a set directly (render tooling); otherwise the globe
  if (!direct) { showGlobe(); app.clock.getDelta(); frame(); requestAnimationFrame(() => requestAnimationFrame(() => { window.__ready = true; })); return; }
  app.view = 'scene'; app.globe.group.visible = false; $('card-globe').hidden = true; loadScene(direct);
  if (SHOT) {
    if (qs.has('strength')) ($('strength') as HTMLInputElement).value = qs.get('strength')!;
    if (qs.has('dismantle')) { // run the sim for T seconds, then hold the frame
      const T = +qs.get('dismantle')!; dismantle();
      await new Promise<void>((res) => { const orig = app.physics.onFrame!; app.physics.onFrame = (f) => { orig(f); if (f.simT >= T) { app.physics.pause(true); res(); } }; }); // T = simulated seconds
    }
  } else playBuildIn();
  app.clock.getDelta(); frame(); requestAnimationFrame(() => requestAnimationFrame(() => { window.__ready = true; }));
}
start();
