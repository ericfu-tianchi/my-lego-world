import * as THREE from 'three';
import { Blueprint } from '../core/builder';
import { BrickRenderer, makeStudioEnv, makeLights, type Item } from '../core/render';
import { Orbit } from '../core/controls';
import { PhysicsClient } from '../physics/client';
import { validate, summarize } from '../core/validate';
import { SCENES } from '../scenes/index';
import { type Place } from '../scenes/globe';
import { GlobeView, GLOBE_RADIUS } from './globe-view';

const TABLE_Y = -6;
const qs = new URLSearchParams(location.search);
const SHOT = qs.has('shot');
const $ = (id: string) => document.getElementById(id) as HTMLElement;
type State = 'idle' | 'building' | 'built' | 'dismantling' | 'settled' | 'rebuilding';
/** How "Take it apart" lands — three candidates for Eric (2026-10-02). The entrance is the same heap played backwards, so it follows suit.
 *  floor: an invisible glass floor at the island's foot catches everything; the bricks spread out on it, their shadows show the floor.
 *  float: zero gravity — the set bursts and its bricks drift apart and hang in the air round where it stood.
 *  tray:  the glass floor with an invisible round rim just beyond the island, so the heap stays compact and in view. */
type Apart = 'floor' | 'float' | 'tray';
interface Anim { it: Item; fromP: THREE.Vector3; fromQ: THREE.Quaternion; delay: number; dur: number; arc: number }
type CamPose = { tx: number; ty: number; tz: number; az: number; el: number; dist: number };

const app = {
  tableY: TABLE_Y, table: null as unknown as THREE.Mesh<THREE.PlaneGeometry, THREE.ShadowMaterial>,
  state: 'idle' as State, items: [] as Item[], anims: [] as Anim[], animT: 0, animDone: null as null | (() => void), radius: 30,
  physics: new PhysicsClient(), lastPoses: null as Float32Array | null, prevPoses: null as Float32Array | null, poseAt: 0, poseGap: 1000 / 60, sceneId: 'kyoto', clock: new THREE.Clock(), autoRotate: 0.05,
  view: 'scene' as 'globe' | 'scene' | 'moving', globe: null as unknown as GlobeView, spin: 0, spinVel: 0, idle: 9, labels: [] as HTMLElement[], hover: null as null | Place,
  tween: null as null | { t: number; dur: number; step: (k: number) => void; done?: () => void }, raycaster: new THREE.Raycaster(), apart: 'floor' as Apart,
  renderer: null as unknown as THREE.WebGLRenderer, scene: null as unknown as THREE.Scene, camera: null as unknown as THREE.PerspectiveCamera, orbit: null as unknown as Orbit, lights: null as unknown as ReturnType<typeof makeLights>, bricks: null as unknown as BrickRenderer, center: new THREE.Vector3(),
};
try { const a = localStorage.getItem('apart') as Apart | null; if (a === 'floor' || a === 'float' || a === 'tray') app.apart = a; } catch { /* storage blocked */ }
if (qs.get('apart')) app.apart = qs.get('apart') as Apart;

function init() {
  const canvas = $('c') as HTMLCanvasElement;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: SHOT });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0; renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(32, innerWidth / innerHeight, 0.5, 1200);
  const orbit = new Orbit(camera, canvas); const lights = makeLights(scene); const bricks = new BrickRenderer(scene); bricks.anisotropy = renderer.capabilities.getMaxAnisotropy(); const env = makeStudioEnv(renderer); bricks.setEnvironment(env);
  const table = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.ShadowMaterial({ opacity: 0.22 })); table.rotation.x = -Math.PI / 2; table.position.y = TABLE_Y; table.receiveShadow = true; scene.add(table);
  const globe = new GlobeView(env); scene.add(globe.group, globe.fixtures);
  if (SHOT && qs.has('sil')) { table.visible = false; renderer.shadowMap.enabled = false; scene.background = new THREE.Color(0xffffff); document.body.style.background = '#fff'; document.querySelectorAll<HTMLElement>('.hud').forEach((h) => (h.style.display = 'none')); }
  Object.assign(app, { renderer, scene, camera, orbit, lights, bricks, table, globe });
  addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
  $('btn-apart').onclick = () => dismantle(); $('btn-rebuild').onclick = () => rebuild(); $('btn-globe').onclick = () => goGlobe();
  for (const pin of globe.pins) { const l = document.createElement('button'); l.className = 'pin-label'; l.innerHTML = `<b>${pin.place.name}</b><span>${pin.place.city}</span>`; l.onclick = () => enterPlace(pin.place); $('labels').appendChild(l); app.labels.push(l); }
  // take-apart chooser (temporary, until Eric picks one); switching while the set is in pieces rebuilds it first
  document.querySelectorAll<HTMLButtonElement>('[data-apart]').forEach((b) => { b.onclick = () => { app.apart = b.dataset.apart as Apart; try { localStorage.setItem('apart', app.apart); } catch { /* */ } markApart(); if (app.state === 'settled' || app.state === 'dismantling') rebuild(); }; });
  markApart();
  // at home the globe turns under the hand and the camera stays put: drag or scroll spins the ball about its axis, with a little inertia
  let drag: { x: number; t: number } | null = null, pressAt: [number, number] | null = null;
  canvas.addEventListener('pointerdown', (e) => { pressAt = [e.clientX, e.clientY]; if (app.view === 'globe') { drag = { x: e.clientX, t: performance.now() }; app.spinVel = 0; app.idle = 0; canvas.setPointerCapture(e.pointerId); } });
  canvas.addEventListener('pointermove', (e) => {
    if (drag && app.view === 'globe') { const now = performance.now(); const d = (e.clientX - drag.x) * 0.006; app.spin += d; app.spinVel = (d / Math.max(1, now - drag.t)) * 1000; drag = { x: e.clientX, t: now }; app.idle = 0; }
    const pin = pickPin(e); app.hover = pin; canvas.style.cursor = pin ? 'pointer' : app.view === 'globe' ? 'grab' : '';
  });
  canvas.addEventListener('pointerup', (e) => { drag = null; if (pressAt && Math.hypot(e.clientX - pressAt[0], e.clientY - pressAt[1]) < 6) { const pin = pickPin(e); if (pin) enterPlace(pin); } pressAt = null; });
  canvas.addEventListener('wheel', (e) => { if (app.view !== 'globe') return; e.preventDefault(); e.stopImmediatePropagation(); app.spinVel += (e.deltaX + e.deltaY) * 0.004; app.idle = 0; }, { capture: true, passive: false });
  orbit.onInteract = () => { orbit.autoRotate = 0; };
  app.physics.onFrame = (f) => { if (app.state !== 'dismantling' && app.state !== 'settled') return; const now = performance.now(); app.prevPoses = app.lastPoses ?? f.poses; app.poseGap = app.lastPoses ? Math.min(100, Math.max(8, now - app.poseAt)) : 1000 / 60; app.poseAt = now; app.lastPoses = f.poses; if (f.awake === 0 && app.state === 'dismantling') setState('settled'); };
}
const markApart = () => document.querySelectorAll<HTMLButtonElement>('[data-apart]').forEach((b) => b.classList.toggle('on', b.dataset.apart === app.apart));

function loadScene(id: string) {
  const def = SCENES[id]; if (!def) return; app.sceneId = id; const bp = new Blueprint(def.seed);
  const t0 = performance.now(); const meta = def.build(bp); const t1 = performance.now();
  app.tableY = id === 'kyoto-refined' ? -.03 : TABLE_Y; app.table.position.y = app.tableY;
  const rep = validate(bp.parts, meta.base ?? 0); console.log(`scene ${id}: ${(t1 - t0).toFixed(0)}ms\n` + summarize(rep, 10));
  const origin = new THREE.Vector3(-meta.size[0] / 2, 0, -meta.size[1] / 2);
  const only = qs.get('only'); const shown = only ? bp.parts.filter((p) => only.split(',').includes(p.tag ?? '')) : bp.parts;   // ?only=torii,bridge → element renders against clean sky
  app.items = app.bricks.build(shown, origin); const st = bp.stats();
  app.center.set(0, meta.center[1], 0); const radius = Math.hypot(meta.size[0], meta.size[1]) / 2 + 4; app.radius = radius; app.lights.frame(app.center, radius);
  const o = app.orbit; o.target.copy(app.center); o.az = meta.camera?.az ?? 0.62; o.el = meta.camera?.el ?? 0.4; o.dist = meta.camera?.dist ?? radius * 2.7; o.minDist = 8; o.maxDist = 220; o.minEl = 0.05; o.autoRotate = app.autoRotate;
  if (qs.has('az')) o.az = +qs.get('az')!; if (qs.has('el')) o.el = +qs.get('el')!; if (qs.has('dist')) o.dist = +qs.get('dist')!; if (qs.has('tx')) o.target.set(+qs.get('tx')!, +qs.get('ty')!, +qs.get('tz')!);
  $('place-title').textContent = meta.title; $('place-sub').textContent = `${meta.caption} · ${meta.subtitle}`;
  $('place-stats').textContent = `${st.parts.toLocaleString()} bricks · ${st.types} part types · ${st.colors} colours · ${rep.ok ? 'connection check passed' : rep.floating + ' floating · ' + rep.overlaps + ' overlaps'}`;
  app.bricks.resetHome(); if (SHOT && qs.has('sil')) app.bricks.silhouette(true); setState('built');
}
function setState(s: State) { app.state = s; $('btn-apart').hidden = s !== 'built'; $('btn-rebuild').hidden = !(s === 'settled' || s === 'dismantling'); $('strength-wrap').hidden = s !== 'built'; $('apart-pick').hidden = app.view !== 'scene'; }

// ---- globe: home, and the stage the set stands on -------------------------------------------------------
// One globe in one world. At home it turns on its stand; on a click it turns until the place faces up, grows and sinks until only a sliver of
// its crown shows at the bottom of the screen with the place on top — and the set builds there. Back reverses the same motion.
const STAGE_SCALE = 3.2, STAGE_DROP = 30;
const stageY = () => app.tableY - STAGE_DROP - GLOBE_RADIUS * STAGE_SCALE;
const HOME_CAM: CamPose = { tx: 0, ty: -7, tz: 0, az: 0, el: 0.16, dist: 158 };
/** the set's opening view (Eric 10-02): close enough that the island fills the width, looking down at about 33° from the side */
const sceneCam = (): CamPose => ({ tx: app.center.x, ty: app.center.y - 3, tz: app.center.z, az: app.orbit.az, el: 0.58, dist: app.radius * 2.15 });
const setCam = (c: CamPose) => { const o = app.orbit; o.target.set(c.tx, c.ty, c.tz); o.az = c.az; o.el = c.el; o.dist = c.dist; };
const lerpCam = (a: CamPose, b: CamPose, e: number): CamPose => { let dAz = b.az - a.az; dAz = Math.atan2(Math.sin(dAz), Math.cos(dAz)); return { tx: a.tx + (b.tx - a.tx) * e, ty: a.ty + (b.ty - a.ty) * e, tz: a.tz + (b.tz - a.tz) * e, az: a.az + dAz * e, el: a.el + (b.el - a.el) * e, dist: a.dist + (b.dist - a.dist) * e }; };
const camNow = (): CamPose => ({ tx: app.orbit.target.x, ty: app.orbit.target.y, tz: app.orbit.target.z, az: app.orbit.az, el: app.orbit.el, dist: app.orbit.dist });
const easeInOut = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
/** the globe's rotation that puts `place` on top, its north toward the back of the set */
function stageQuat(place: Place) { const pin = app.globe.pins.find((p) => p.place === place)!; const q = GlobeView.facing(pin.dir, new THREE.Vector3(0, 1, 0)); const north = new THREE.Vector3(0, 1, 0).applyQuaternion(q); north.y = 0; if (north.lengthSq() > 1e-6) { north.normalize(); const yaw = Math.atan2(north.x, north.z) - Math.PI; q.premultiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -yaw)); } return q; }
function showGlobe() {
  app.view = 'globe'; app.bricks.group.visible = false; app.table.visible = false; app.globe.pins.forEach((p) => (p.group.visible = true)); app.lights.frame(new THREE.Vector3(0, -6, 0), GLOBE_RADIUS + 12);
  const g = app.globe.group; g.position.set(0, 0, 0); g.scale.setScalar(1); g.quaternion.copy(app.globe.homeQuat(app.spin)); app.globe.fixtures.visible = true;
  const o = app.orbit; o.enabled = false; o.autoRotate = 0; setCam(HOME_CAM);   // the camera is fixed at home; the hand turns the ball
  $('card-globe').hidden = false; $('card-place').hidden = true; $('actions').hidden = true; $('apart-pick').hidden = true; $('hint').textContent = 'Drag or scroll to turn the globe · Click a pin to visit';
}
function updateLabels() {
  const camDir = new THREE.Vector3(); app.camera.getWorldDirection(camDir); const p = new THREE.Vector3(), d = new THREE.Vector3();
  app.globe.pins.forEach((pin, i) => {
    const l = app.labels[i]; d.copy(pin.dir).applyQuaternion(app.globe.group.quaternion); const visible = app.view === 'globe' && d.dot(camDir) < -0.15;
    l.style.opacity = visible ? '1' : '0'; l.style.pointerEvents = visible ? 'auto' : 'none'; if (!visible) return;
    pin.group.getWorldPosition(p); p.addScaledVector(d, 3); p.project(app.camera);
    l.style.transform = `translate(-50%, -100%) translate(${(p.x * 0.5 + 0.5) * innerWidth}px, ${(-p.y * 0.5 + 0.5) * innerHeight}px)`; l.classList.toggle('hover', app.hover === pin.place);
  });
}
function pickPin(e: PointerEvent): Place | null {
  if (app.view !== 'globe') return null;
  app.raycaster.setFromCamera(new THREE.Vector2((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1), app.camera);
  const hits = app.raycaster.intersectObjects(app.globe.pins.map((p) => p.hit), false); return hits.length ? app.globe.pins.find((p) => p.hit === hits[0].object)!.place : null;
}
const tween = (dur: number, step: (k: number) => void) => new Promise<void>((done) => { app.tween = { t: 0, dur, step, done }; });
async function enterPlace(place: Place) {
  if (app.view !== 'globe' || app.tween) return; app.view = 'moving'; app.hover = null; app.spinVel = 0;
  const from = { cam: camNow(), q: app.globe.group.quaternion.clone() };
  loadScene(place.scene); const to = { cam: sceneCam(), q: stageQuat(place) }; prepareEntrance(); app.bricks.group.visible = true; app.table.visible = app.apart !== 'float'; app.globe.pins.forEach((p) => (p.group.visible = false));
  $('card-globe').hidden = true; app.globe.fixtures.visible = false;   // the stand stays at home
  const g = app.globe.group; const p0 = new THREE.Vector3(), p1 = new THREE.Vector3(0, stageY(), 0); let started = false;
  await tween(2.4, (k) => {
    const e = easeInOut(k); g.quaternion.slerpQuaternions(from.q, to.q, easeInOut(Math.min(1, k * 1.15)));   // the spin lands a beat before the zoom does
    g.scale.setScalar(Math.exp(Math.log(STAGE_SCALE) * e)); g.position.lerpVectors(p0, p1, e); setCam(lerpCam(from.cam, to.cam, e));
    if (!started && k > 0.62) { started = true; startEntrance(); }
  });
  if (!started) startEntrance();
  app.view = 'scene'; app.orbit.enabled = true; $('card-place').hidden = false; $('actions').hidden = false; $('hint').textContent = 'Drag to orbit · Scroll to zoom · Shift-drag to pan'; setState(app.state);
}
async function goGlobe() {
  if (app.view !== 'scene' || app.tween || app.state === 'building' || app.state === 'rebuilding') return;
  app.view = 'moving'; app.physics.stop(); app.anims = []; app.orbit.enabled = false; app.bricks.clear(); app.items = []; setState('idle'); app.table.visible = false;
  $('card-place').hidden = true; $('actions').hidden = true; $('apart-pick').hidden = true;
  const g = app.globe.group; const from = { cam: camNow(), q: g.quaternion.clone(), p: g.position.clone() };
  const toQ = app.globe.homeQuat(app.spin); app.lights.frame(new THREE.Vector3(0, -6, 0), GLOBE_RADIUS + 12);
  await tween(1.8, (k) => { const e = easeInOut(k); g.quaternion.slerpQuaternions(from.q, toQ, e); g.scale.setScalar(Math.exp(Math.log(STAGE_SCALE) * (1 - e))); g.position.lerpVectors(from.p, new THREE.Vector3(), e); setCam(lerpCam(from.cam, HOME_CAM, e)); if (k > 0.85) app.globe.fixtures.visible = true; });
  showGlobe();
}

// ---- the entrance: Rebuild (Eric's choice, 2026-10-02) ------------------------------------------------------
// The set starts as the heap "Take it apart" leaves — on the glass floor, in the tray, or hanging in the air, whichever take-apart style is on —
// then the bricks leap back in arcs and click home, ground first.
const smooth = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const rnd = (a: number) => (Math.random() - 0.5) * a;
function heapPose(it: Item): [THREE.Vector3, THREE.Quaternion] {
  const a = Math.random() * Math.PI * 2;
  if (app.apart === 'float') { const r = app.radius * (0.7 + Math.random() * 0.8); return [new THREE.Vector3(Math.cos(a) * r, it.home.p.y + rnd(14) + 4, Math.sin(a) * r), new THREE.Quaternion().setFromEuler(new THREE.Euler(rnd(6), rnd(6), rnd(6)))]; }
  const r = Math.sqrt(Math.random()) * (app.apart === 'tray' ? app.radius * 1.05 : app.radius * 1.5);
  return [new THREE.Vector3(Math.cos(a) * r, app.tableY + it.half[1] + Math.random() * 0.6, Math.sin(a) * r * 0.85), new THREE.Quaternion().setFromEuler(new THREE.Euler(rnd(0.4), Math.random() * 6.3, rnd(0.4)))];
}
function prepareEntrance() {
  const ys = app.items.map((i) => i.home.p.y); const minY = Math.min(...ys), maxY = Math.max(...ys);
  app.anims = app.items.map((it) => { const [p, q] = heapPose(it); return { it, fromP: p, fromQ: q, delay: 0.6 + Math.pow((it.home.p.y - minY) / (maxY - minY + 1e-6), 0.9) * 2.3 + Math.random() * 0.2, dur: 1.3, arc: app.apart === 'float' ? 2 : 6 + Math.random() * 4 }; });
  app.animT = -1e9; setState('building'); drawAnims();   // held before t = 0: the heap is hidden until the entrance starts
}
function startEntrance() { app.animT = 0; app.animDone = () => setState('built'); }
const _p = new THREE.Vector3(), _q = new THREE.Quaternion();
function drawAnims() {
  let all = true;
  for (const a of app.anims) {
    const t = THREE.MathUtils.clamp((app.animT - a.delay) / a.dur, 0, 1); if (t < 1) all = false;
    if (app.animT < 0) { _p.set(0, -500, 0); app.bricks.setPose(a.it, _p, a.fromQ); continue; }
    const e = smooth(t); _p.lerpVectors(a.fromP, a.it.home.p, e); _p.y += Math.sin(t * Math.PI) * a.arc; _q.slerpQuaternions(a.fromQ, a.it.home.q, e); app.bricks.setPose(a.it, _p, _q);
  }
  app.bricks.commit(); return all;
}
function stepAnims(dt: number) { if (!app.anims.length || app.animT < -1) return; app.animT += dt; if (drawAnims()) { app.anims = []; app.animDone?.(); } }

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
  const float = app.apart === 'float'; app.table.visible = !float;
  app.physics.start(poses, halfs, fixed, strength, float ? app.tableY - 400 : app.tableY, [0, 0], 7, undefined,
    float ? { gravity: 0, damping: [1.2, 0.8], burst: 0.6 } : app.apart === 'tray' ? { wallR: app.radius * 1.15 } : {});
}
function rebuild() {
  if (!(app.state === 'settled' || app.state === 'dismantling')) return; app.physics.stop(); setState('rebuilding');
  const maxY = Math.max(...app.items.map((i) => i.home.p.y));
  app.anims = app.items.map((it) => { const p = new THREE.Vector3(), q = new THREE.Quaternion(); app.bricks.getPose(it, p, q); return { it, fromP: p, fromQ: q, delay: (it.home.p.y - TABLE_Y) / (maxY - TABLE_Y) * 1.2 + Math.random() * 0.1, dur: 1.6, arc: 4 }; });
  app.animT = 0; app.animDone = () => { setState('built'); app.orbit.autoRotate = app.autoRotate; app.table.visible = app.apart !== 'float'; };
}
// ---- loop ---------------------------------------------------------------------------------------------
function frame() {
  const dt = Math.min(0.05, app.clock.getDelta());
  if (app.tween) { app.tween.t += dt; const k = Math.min(1, app.tween.t / app.tween.dur); app.tween.step(k); if (k >= 1) { const d = app.tween.done; app.tween = null; d?.(); } }
  if (app.view === 'globe') {   // the hand's spin decays; after a few idle seconds the globe turns slowly by itself
    app.idle += dt; app.spin += app.spinVel * dt; app.spinVel *= Math.exp(-dt * 2.2); if (app.idle > 2.5) app.spin += dt * 0.1 * Math.min(1, (app.idle - 2.5) / 2);
    app.globe.group.quaternion.copy(app.globe.homeQuat(app.spin));
  }
  app.orbit.update(dt); updateLabels(); stepAnims(dt); if (app.state === 'dismantling' || app.state === 'settled') drawPhysics(); app.renderer.render(app.scene, app.camera); requestAnimationFrame(frame);
}
declare global { interface Window { __ready?: boolean; __app?: typeof app } }
async function start() {
  init(); window.__app = app;
  const direct = qs.get('scene') && SCENES[qs.get('scene')!] ? qs.get('scene')! : null;   // ?scene= opens a set directly (render tooling); otherwise the globe
  if (!direct) { app.spin = 2.45; showGlobe(); app.clock.getDelta(); frame(); requestAnimationFrame(() => requestAnimationFrame(() => { window.__ready = true; })); return; }
  // a set opened directly still stands over its globe, as after a click (&noglobe for clean element renders)
  app.view = 'scene'; $('card-globe').hidden = true; app.globe.fixtures.visible = false; loadScene(direct);
  const place = app.globe.pins.find((p) => p.place.scene === direct)?.place;
  if (place && !qs.has('noglobe')) { const g = app.globe.group; g.quaternion.copy(stageQuat(place)); g.scale.setScalar(STAGE_SCALE); g.position.set(0, stageY(), 0); app.globe.pins.forEach((p) => (p.group.visible = false)); if (!qs.has('az')) setCam(sceneCam()); } else app.globe.group.visible = false;
  app.table.visible = app.apart !== 'float'; setState('built');
  if (SHOT) {
    if (qs.has('strength')) ($('strength') as HTMLInputElement).value = qs.get('strength')!;
    if (qs.has('dismantle')) { // run the sim for T seconds, then hold the frame
      const T = +qs.get('dismantle')!; dismantle();
      await new Promise<void>((res) => { const orig = app.physics.onFrame!; app.physics.onFrame = (f) => { orig(f); if (f.simT >= T) { app.physics.pause(true); res(); } }; }); // T = simulated seconds
    }
  } else { prepareEntrance(); startEntrance(); }
  app.clock.getDelta(); frame(); requestAnimationFrame(() => requestAnimationFrame(() => { window.__ready = true; }));
}
start();
