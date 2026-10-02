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
/** Take it apart (Eric's pick, 2026-10-02): zero gravity — the set bursts and its bricks drift for ever round where it stood.
 *  The entrance has two candidates for Eric to compare: 'floor' — the bricks lie close round the island on an invisible glass floor and leap
 *  home; 'float' — they hang a little apart in the air, as if just taken apart, and draw together. Both start while the globe is still moving. */
type Enter = 'floor' | 'float';
interface Anim { it: Item; fromP: THREE.Vector3; fromQ: THREE.Quaternion; delay: number; dur: number; arc: number }
type CamPose = { tx: number; ty: number; tz: number; az: number; el: number; dist: number };

const app = {
  tableY: TABLE_Y, table: null as unknown as THREE.Mesh<THREE.PlaneGeometry, THREE.ShadowMaterial>,
  state: 'idle' as State, items: [] as Item[], anims: [] as Anim[], animT: 0, realT: 0, entering: false, entranceEnd: 1, animDone: null as null | (() => void), radius: 30,
  physics: new PhysicsClient(), lastPoses: null as Float32Array | null, prevPoses: null as Float32Array | null, poseAt: 0, poseGap: 1000 / 60, sceneId: 'kyoto', clock: new THREE.Clock(), autoRotate: 0.05,
  env: null as unknown as THREE.Texture, view: 'scene' as 'globe' | 'scene' | 'moving', globe: null as unknown as GlobeView, spin: 0, spinVel: 0, homeZoom: 1, idle: 9, labels: [] as HTMLElement[], hover: null as null | Place,
  drift: null as null | { t: number; base: Float32Array; w: Float32Array }, tween: null as null | { t: number; dur: number; step: (k: number) => void; done?: () => void }, raycaster: new THREE.Raycaster(), enter: 'float' as Enter,
  renderer: null as unknown as THREE.WebGLRenderer, scene: null as unknown as THREE.Scene, camera: null as unknown as THREE.PerspectiveCamera, orbit: null as unknown as Orbit, lights: null as unknown as ReturnType<typeof makeLights>, bricks: null as unknown as BrickRenderer, center: new THREE.Vector3(),
};
try { const e = localStorage.getItem('enter') as Enter | null; if (e === 'floor' || e === 'float') app.enter = e; } catch { /* storage blocked */ }
if (qs.get('enter')) app.enter = qs.get('enter') as Enter;
app.enter = 'float';   // Eric's pick (B, from the air)

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
  Object.assign(app, { renderer, scene, camera, orbit, lights, bricks, table, globe, env });
  addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
  $('btn-apart').onclick = () => dismantle(); $('btn-rebuild').onclick = () => rebuild(); $('btn-globe').onclick = () => goGlobe();
  for (const pin of globe.pins) { const l = document.createElement('button'); const P = pin.place; l.className = 'pin-label' + (P.scene ? '' : ' soon') + (P.priority ? ' next' : ''); l.innerHTML = `<b>${P.name}</b><span>${P.city}</span>`; l.title = P.scene ? '' : 'Coming soon'; l.onclick = () => enterPlace(pin.place); $('labels').appendChild(l); app.labels.push(l); }
  // at home the globe turns under the hand and the camera stays put: drag or scroll spins the ball about its axis, with a little inertia
  let drag: { x: number; y: number; t: number } | null = null, pressAt: [number, number] | null = null;
  canvas.addEventListener('pointerdown', (e) => { pressAt = [e.clientX, e.clientY]; if (app.view === 'globe') { drag = { x: e.clientX, y: e.clientY, t: performance.now() }; app.spinVel = 0; app.idle = 0; canvas.setPointerCapture(e.pointerId); } });
  canvas.addEventListener('pointermove', (e) => {
    if (drag && app.view === 'globe') { const now = performance.now(); const d = (e.clientX - drag.x) * 0.006; app.spin += d; app.spinVel = (d / Math.max(1, now - drag.t)) * 1000; drag = { x: e.clientX, y: e.clientY, t: now }; app.idle = 0; }
    const pin = pickPin(e); app.hover = pin; canvas.style.cursor = pin ? 'pointer' : app.view === 'globe' ? 'grab' : '';
  });
  canvas.addEventListener('pointerup', (e) => { drag = null; if (pressAt && Math.hypot(e.clientX - pressAt[0], e.clientY - pressAt[1]) < 6) { const pin = pickPin(e); if (pin) enterPlace(pin); } pressAt = null; });
  canvas.addEventListener('wheel', (e) => { if (app.view !== 'globe') return; e.preventDefault(); e.stopImmediatePropagation(); app.spinVel += e.deltaX * 0.004; app.homeZoom = THREE.MathUtils.clamp(app.homeZoom * Math.exp(e.deltaY * 0.0012), 0.42, 1.25); setCam(homeCam()); app.idle = 0; }, { capture: true, passive: false });   // trackpad sideways spins, scroll or pinch zooms
  orbit.onInteract = () => { orbit.autoRotate = 0; };
  app.physics.onFrame = (f) => { if (app.state !== 'dismantling' && app.state !== 'settled') return; const now = performance.now(); app.prevPoses = app.lastPoses ?? f.poses; app.poseGap = app.lastPoses ? Math.min(100, Math.max(8, now - app.poseAt)) : 1000 / 60; app.poseAt = now; app.lastPoses = f.poses; if (app.state === 'dismantling' && f.simT >= 2.0) { startDrift(f.poses); return; } if (f.awake === 0 && app.state === 'dismantling') setState('settled'); };
}
function replay() { if (app.view !== 'scene' || app.tween || app.state === 'building' || app.state === 'rebuilding') return; app.physics.stop(); app.drift = null; app.bricks.resetHome(); prepareEntrance(); startEntrance(); }

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
function setState(s: State) { app.state = s; $('btn-apart').hidden = s !== 'built'; $('btn-rebuild').hidden = !(s === 'settled' || s === 'dismantling'); }

// ---- globe: home, and the stage the set stands on -------------------------------------------------------
// One globe in one world. At home it turns on its stand; on a click it turns until the place faces up, grows and sinks until only a sliver of
// its crown shows at the bottom of the screen with the place on top — and the set builds there. Back reverses the same motion.

const STAGE_SCALE = 3.2, STAGE_DROP = 30;
const stageY = () => app.tableY - STAGE_DROP - GLOBE_RADIUS * STAGE_SCALE;
/** home: the desk globe looked at from ~30° above, so the northern lands — where the places are — face the viewer (Eric's pick, 10-02);
 *  the wheel or a pinch zooms in and out */
const homeCam = (): CamPose => ({ tx: 0, ty: -9, tz: 0, az: 0, el: 0.52, dist: 158 * app.homeZoom });
const homeQ = () => app.globe.homeQuat(app.spin);
/** the set's opening view (Eric 10-02): close enough that the island fills the width, looking down at about 33° from the side */
const sceneCam = (): CamPose => ({ tx: app.center.x, ty: app.center.y - 4, tz: app.center.z, az: 0.3, el: 0.36, dist: app.radius * 2.15 });   // Eric's reference view (10-02): ~20° down, three-quarter
const setCam = (c: CamPose) => { const o = app.orbit; o.target.set(c.tx, c.ty, c.tz); o.az = c.az; o.el = c.el; o.dist = c.dist; };
const lerpCam = (a: CamPose, b: CamPose, e: number): CamPose => { let dAz = b.az - a.az; dAz = Math.atan2(Math.sin(dAz), Math.cos(dAz)); return { tx: a.tx + (b.tx - a.tx) * e, ty: a.ty + (b.ty - a.ty) * e, tz: a.tz + (b.tz - a.tz) * e, az: a.az + dAz * e, el: a.el + (b.el - a.el) * e, dist: a.dist + (b.dist - a.dist) * e }; };
const camNow = (): CamPose => ({ tx: app.orbit.target.x, ty: app.orbit.target.y, tz: app.orbit.target.z, az: app.orbit.az, el: app.orbit.el, dist: app.orbit.dist });
const easeInOut = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
/** the globe's rotation that puts `place` on top, its north toward the back of the set */
function stageQuat(place: Place) { const pin = app.globe.pins.find((p) => p.place === place)!; const q = GlobeView.facing(pin.dir, new THREE.Vector3(0, 1, 0)); const north = new THREE.Vector3(0, 1, 0).applyQuaternion(q); north.y = 0; if (north.lengthSq() > 1e-6) { north.normalize(); const yaw = Math.atan2(north.x, north.z) - Math.PI; q.premultiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -yaw)); } return q; }
function showGlobe() {
  app.view = 'globe'; app.bricks.group.visible = false; app.table.visible = false; app.globe.pins.forEach((p) => (p.group.visible = true)); app.lights.frame(new THREE.Vector3(0, -6, 0), GLOBE_RADIUS + 12);
  const g = app.globe.group; g.position.set(0, 0, 0); g.scale.setScalar(1); g.quaternion.copy(homeQ()); app.globe.fixtures.visible = true; 
  const o = app.orbit; o.enabled = false; o.autoRotate = 0; setCam(homeCam());   // the camera is fixed at home; the hand turns the ball
  $('card-globe').hidden = false; $('card-place').hidden = true; $('actions').hidden = true; $('hint').textContent = 'Drag to turn the globe · Scroll to zoom · Click a pin to visit';
}
/** Labels: every visible pin gets one, in rank order (built → next up → the rest, nearer the viewer first); a label that would overlap one
 *  already placed collapses to a dot and opens on hover. Dense Europe stays readable at any turn of the globe. */
function updateLabels() {
  const camDir = new THREE.Vector3(); app.camera.getWorldDirection(camDir); const p = new THREE.Vector3(), d = new THREE.Vector3();
  const cand: { i: number; x: number; y: number; rank: number; facing: number }[] = [];
  app.globe.pins.forEach((pin, i) => {
    const l = app.labels[i]; d.copy(pin.dir).applyQuaternion(app.globe.group.quaternion); const facing = -d.dot(camDir); const visible = app.view === 'globe' && facing > 0.15;
    if (!visible) { l.style.opacity = '0'; l.style.pointerEvents = 'none'; return; }
    pin.group.getWorldPosition(p); p.addScaledVector(d, pin.place.scene ? 3 : 2); p.project(app.camera);
    cand.push({ i, x: (p.x * 0.5 + 0.5) * innerWidth, y: (-p.y * 0.5 + 0.5) * innerHeight, rank: (pin.place.scene ? 0 : pin.place.priority ? 1 : 2) - facing * 0.5, facing });
  });
  cand.sort((a, b) => a.rank - b.rank); const boxes: number[][] = [];
  for (const c of cand) {
    const l = app.labels[c.i]; const pin = app.globe.pins[c.i]; const hover = app.hover === pin.place; if (!l.classList.contains('dot') && l.offsetWidth) { l.dataset.w = String(l.offsetWidth); l.dataset.h = String(l.offsetHeight); } const w = +(l.dataset.w ?? 110), h = +(l.dataset.h ?? 36);   // the full label's size, measured while it is full (a dot would measure 10)
    const box = [c.x - w / 2 - 3, c.y - h - 3, c.x + w / 2 + 3, c.y + 3]; const clash = boxes.some((b) => box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1]);
    const full = hover || !clash; if (full) boxes.push(box);
    l.classList.toggle('dot', !full); l.style.opacity = String(Math.min(1, (c.facing - 0.15) * 4)); l.style.pointerEvents = 'auto';
    l.style.transform = `translate(-50%, -100%) translate(${c.x}px, ${c.y}px)`; l.classList.toggle('hover', hover); l.style.zIndex = hover ? '5' : String(3 - Math.round(c.rank));
  }
}
function pickPin(e: PointerEvent): Place | null {
  if (app.view !== 'globe') return null;
  app.raycaster.setFromCamera(new THREE.Vector2((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1), app.camera);
  const hits = app.raycaster.intersectObjects(app.globe.pins.map((p) => p.hit), false); return hits.length ? app.globe.pins.find((p) => p.hit === hits[0].object)!.place : null;
}
const tween = (dur: number, step: (k: number) => void) => new Promise<void>((done) => { app.tween = { t: 0, dur, step, done }; });
async function enterPlace(place: Place) {
  if (!place.scene) { const l = app.labels[app.globe.pins.findIndex((p) => p.place === place)]; l.classList.remove('shake'); void l.offsetWidth; l.classList.add('shake'); return; }   // not built yet
  if (app.view !== 'globe' || app.tween) return; app.view = 'moving'; app.hover = null; app.spinVel = 0;
  const from = { cam: camNow(), q: app.globe.group.quaternion.clone() };
  loadScene(place.scene!); const to = { cam: sceneCam(), q: stageQuat(place) }; prepareEntrance(); app.bricks.group.visible = true; app.table.visible = app.enter === 'floor'; app.globe.pins.forEach((p) => (p.group.visible = false));
  $('card-globe').hidden = true; app.globe.fixtures.visible = false;   // the stand stays at home
  const g = app.globe.group; const p0 = new THREE.Vector3(), p1 = new THREE.Vector3(0, stageY(), 0); let started = false;
  // one motion (Eric 10-02): the globe grows and rolls down while, above it, the set is already gathering itself
  await tween(2.8, (k) => {
    const e = easeInOut(k); g.quaternion.slerpQuaternions(from.q, to.q, easeInOut(Math.min(1, k * 1.15)));   // the spin lands a beat before the zoom does
    const gs = Math.exp(Math.log(STAGE_SCALE) * e); g.scale.setScalar(gs); g.position.lerpVectors(p0, p1, e); setCam(lerpCam(from.cam, to.cam, e));
    // the set rides the globe: it grows with it and stays seated on the crown, so it gathers on the place the pin marked
    const ss = gs / STAGE_SCALE, crown = g.position.y + GLOBE_RADIUS * gs, finalCrown = stageY() + GLOBE_RADIUS * STAGE_SCALE;
    app.bricks.group.scale.setScalar(ss); app.bricks.group.position.set(0, crown - finalCrown * ss * e, 0);   // seated on the crown early, lifting to its final height as the zoom lands
    if (!started) { started = true; startEntrance(); }   // the gathering begins with the click; its clock eases in
  });
  if (!started) startEntrance(); app.bricks.group.scale.setScalar(1); app.bricks.group.position.set(0, 0, 0);
  app.view = 'scene'; app.orbit.enabled = true; $('card-place').hidden = false; $('actions').hidden = false; $('hint').textContent = 'Drag to orbit · Scroll to zoom · Shift-drag to pan'; setState(app.state);
}
/** Back to the globe (Eric 10-02: the set should not just vanish): the set rains back up — top pieces first, spiralling the same way, off
 *  the top of the screen — while the globe rises, shrinks and turns home underneath, the set riding its crown as it shrinks. */
async function goGlobe() {
  if (app.view !== 'scene' || app.tween || app.state === 'building' || app.state === 'rebuilding') return;
  app.view = 'moving'; app.physics.stop(); app.anims = []; app.orbit.enabled = false; app.table.visible = false;
  $('card-place').hidden = true; $('actions').hidden = true;
  const ys = app.items.map((i) => i.home.p.y); const minY = Math.min(...ys), maxY = Math.max(...ys);
  app.drift = null; const exits = app.items.map((it) => { const p = new THREE.Vector3(), q = new THREE.Quaternion(); app.bricks.getPose(it, p, q); const h = it.home.p;
    return { it, p, q, to: new THREE.Vector3(p.x * 1.25 + rnd(6), h.y + 80 + Math.random() * 25, p.z * 1.25 + rnd(6)), delay: (1 - (h.y - minY) / (maxY - minY + 1e-6)) * 0.7 + Math.random() * 0.25 }; });
  setState('idle');
  const g = app.globe.group; const from = { cam: camNow(), q: g.quaternion.clone(), p: g.position.clone() };
  const toQ = homeQ(); app.lights.frame(new THREE.Vector3(0, -6, 0), GLOBE_RADIUS + 12); const finalCrown = stageY() + GLOBE_RADIUS * STAGE_SCALE; let t = 0;
  await tween(1.9, (k) => {
    const e = easeInOut(k); g.quaternion.slerpQuaternions(from.q, toQ, e); const gs = Math.exp(Math.log(STAGE_SCALE) * (1 - e)); g.scale.setScalar(gs); g.position.lerpVectors(from.p, new THREE.Vector3(), e); setCam(lerpCam(from.cam, homeCam(), e)); if (k > 0.85) app.globe.fixtures.visible = true;
    const ss = gs / STAGE_SCALE, crown = g.position.y + GLOBE_RADIUS * gs; app.bricks.group.scale.setScalar(ss); app.bricks.group.position.set(0, crown - finalCrown * ss * (1 - e), 0);
    t = k * 1.9; const _a = new THREE.Vector3(), _b = new THREE.Quaternion();
    for (const x of exits) { const u = THREE.MathUtils.clamp((t - x.delay) / 0.9, 0, 1), w = u * u * u;   // eases out of its seat, then accelerates up
      _a.lerpVectors(x.p, x.to, w); const ang = -w * 1.1, c = Math.cos(ang), sn = Math.sin(ang), ax = _a.x, az = _a.z; _a.x = ax * c + az * sn; _a.z = -ax * sn + az * c;   // keeps turning the same way as it rose in
      _b.copy(x.q).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(w * 2, w * 1.5, w))); app.bricks.setPose(x.it, _a, _b); }
    app.bricks.commit();
  });
  app.bricks.clear(); app.items = []; app.bricks.group.scale.setScalar(1); app.bricks.group.position.set(0, 0, 0); showGlobe();
}

// ---- the entrance: Rebuild (Eric's choice, 2026-10-02) ------------------------------------------------------
// The bricks gather from near their places — lying round the island, or hanging a little apart — and click home, ground first.
const smooth = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const rnd = (a: number) => (Math.random() - 0.5) * a;
function heapPose(it: Item): [THREE.Vector3, THREE.Quaternion] {
  const h = it.home.p;
  if (app.entering) {   // where each brick comes from on the way in (in the set's frame; the swirl is added along the path)
    const r = Math.hypot(h.x, h.z) + 1e-3, spinQ = it.home.q.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(rnd(3), rnd(3), rnd(3))));
    void r; return [new THREE.Vector3(h.x * 1.25 + rnd(6), h.y + 70 + Math.random() * 25, h.z * 1.25 + rnd(6)), spinQ];   // Rain (Eric's pick): from above the top of the screen
  }
  if (app.enter === 'float') {   // a little apart, not chaos: each brick pushed out from the island's axis and up a few studs, gently turned
    const r = Math.hypot(h.x, h.z) + 1e-3, out = 3 + Math.random() * 6 + r * 0.12; return [new THREE.Vector3(h.x + (h.x / r) * out + rnd(3), h.y + 2 + Math.random() * 7, h.z + (h.z / r) * out + rnd(3)), it.home.q.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(rnd(1.6), rnd(1.6), rnd(1.6))))];
  }
  const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * app.radius * 1.1;   // lying close round the island on the glass floor
  return [new THREE.Vector3(Math.cos(a) * r, app.tableY + it.half[1] + Math.random() * 0.6, Math.sin(a) * r * 0.85), new THREE.Quaternion().setFromEuler(new THREE.Euler(rnd(0.4), Math.random() * 6.3, rnd(0.4)))];
}
function prepareEntrance() {
  app.entering = true;   // heapPose reads it: arrival points
  const ys = app.items.map((i) => i.home.p.y); const minY = Math.min(...ys), maxY = Math.max(...ys); const fl = app.enter === 'float';
  app.anims = app.items.map((it) => { const [p, q] = heapPose(it); return { it, fromP: p, fromQ: q, delay: 0.2 + Math.pow((it.home.p.y - minY) / (maxY - minY + 1e-6), 0.9) * 2.2 + Math.random() * 0.25, dur: fl ? 1.5 : 1.3, arc: fl ? 0.6 : 6 + Math.random() * 4 }; });
  app.entranceEnd = Math.max(...app.anims.map((a) => a.delay + a.dur)); app.entering = true;
  app.animT = -1e9; setState('building'); drawAnims();   // held before t = 0: hidden until the entrance starts
}
const ENTRANCE_SPAN = 3.4;   // real seconds from the click until the last brick seats (the zoom itself takes 2.8)
function startEntrance() { app.animT = 0; app.realT = 0; app.animDone = () => setState('built'); }
/** entrance clock: ramp and swirl warp time with an ease-in, so the gathering starts slow at the click and speeds up as the zoom lands */
const warp = (t: number) => { const T = app.entranceEnd; const k = Math.min(1, t / ENTRANCE_SPAN); return T * (0.25 * k + 0.75 * k * k) + Math.max(0, t - ENTRANCE_SPAN) * 2; };
const _p = new THREE.Vector3(), _q = new THREE.Quaternion();
function drawAnims() {
  let all = true;
  for (const a of app.anims) {
    const t = THREE.MathUtils.clamp((app.animT - a.delay) / a.dur, 0, 1); if (t < 1) all = false;
    if (app.animT < 0 || (app.entering && app.animT <= a.delay)) { _p.set(0, -500, 0); app.bricks.setPose(a.it, _p, a.fromQ); continue; }   // not yet on its way: nowhere (each arrives from off-screen, the globe or the sky)
    const e = app.entering ? 1 - Math.pow(1 - t, 2.4) : smooth(t);   // rain: falls fast, slows as it seats
    _p.lerpVectors(a.fromP, a.it.home.p, Math.min(1, e)); if (!app.entering) _p.y += Math.sin(t * Math.PI) * a.arc;
    if (app.entering) { const ang = (1 - smooth(t)) * 1.1, c = Math.cos(ang), sn = Math.sin(ang), x = _p.x, z = _p.z; _p.x = x * c + z * sn; _p.z = -x * sn + z * c;   }   // the spiral turns the same way as the view's idle rotation and the drift
    _q.slerpQuaternions(a.fromQ, a.it.home.q, smooth(t)); app.bricks.setPose(a.it, _p, _q);
  }
  app.bricks.commit(); return all;
}
function stepAnims(dt: number) { if (!app.anims.length || app.animT < -1) return; if (app.entering) { app.realT += dt; app.animT = warp(app.realT); } else app.animT += dt; if (drawAnims()) { app.anims = []; app.entering = false; app.animDone?.(); } }

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
  if (app.state !== 'built') return; setState('dismantling'); app.orbit.autoRotate = 0; app.lastPoses = app.prevPoses = null; app.drift = null;
  const n = app.items.length; const poses = new Float32Array(n * 7), halfs = new Float32Array(n * 3), fixed = new Uint8Array(n);
  app.items.forEach((it, i) => { poses.set([it.home.p.x, it.home.p.y, it.home.p.z, it.home.q.x, it.home.q.y, it.home.q.z, it.home.q.w], i * 7); halfs.set(it.half, i * 3); fixed[i] = it.key.startsWith('baseplate_') ? 1 : 0; });
  app.table.visible = false;   // zero-g, a fixed force (Eric 10-02: no slider; some punch, not much). 
  const B = { vy: 0.85, spin: 0.35, burst: 0.72 };   // Nebula (Eric's pick): a soft round cloud
  app.physics.start(poses, halfs, fixed, 2.2, app.tableY - 400, [0, 0], 7, undefined, { gravity: 0, damping: [1.0, 0.7], ...B });
}
function rebuild() {
  if (!(app.state === 'settled' || app.state === 'dismantling')) return; app.physics.stop(); app.drift = null; setState('rebuilding');
  const maxY = Math.max(...app.items.map((i) => i.home.p.y));
  app.anims = app.items.map((it) => { const p = new THREE.Vector3(), q = new THREE.Quaternion(); app.bricks.getPose(it, p, q); return { it, fromP: p, fromQ: q, delay: (it.home.p.y - TABLE_Y) / (maxY - TABLE_Y) * 1.2 + Math.random() * 0.1, dur: 1.6, arc: 4 }; });
  app.entering = false; app.animT = 0; app.animDone = () => { setState('built'); app.orbit.autoRotate = app.autoRotate; app.table.visible = false; };
}
// ---- zero-g drift (Eric 10-02: in a vacuum the pieces should keep floating round each other, never freeze) -----------------------------
// Once the burst has spent itself the solver is stopped and each brick drifts procedurally about where it ended up: the whole cloud turns
// slowly round the island's axis (inner pieces a little faster, like a loose nebula), every brick bobs on its own slow three-axis wave and
// tumbles slowly about its own random axis. Pure maths per frame — no physics, ~3,400 matrix updates.
function startDrift(poses: Float32Array) {
  app.physics.stop(); const n = app.items.length; const w = new Float32Array(n * 8);
  for (let i = 0; i < n; i++) { const o = i * 8; const ax = new THREE.Vector3(rnd(2), rnd(2), rnd(2)).normalize();
    w[o] = ax.x; w[o + 1] = ax.y; w[o + 2] = ax.z; w[o + 3] = (0.15 + Math.random() * 0.35) * (Math.random() < 0.5 ? -1 : 1);   // tumble axis, rad/s
    w[o + 4] = Math.random() * 6.28; w[o + 5] = 0.25 + Math.random() * 0.35; w[o + 6] = 0.3 + Math.random() * 0.6; w[o + 7] = Math.random(); }   // phase, bob freq, bob amplitude, swirl jitter
  app.drift = { t: 0, base: poses.slice(), w }; setState('settled');
}
const _dq = new THREE.Quaternion(), _da = new THREE.Vector3(), _yq = new THREE.Quaternion(), _Y = new THREE.Vector3(0, 1, 0);
/** Nebula (Eric's pick, 2026-10-02): a soft round cloud that keeps swirling round the island's axis, inner pieces faster, every piece bobbing
 *  and tumbling slowly on its own. */
function drawDrift(dt: number) {
  const d = app.drift!; d.t += dt; const t = d.t, ease = Math.min(1, t / 1.5); 
  for (let i = 0; i < app.items.length; i++) {
    const o = i * 7, k = i * 8; const bx = d.base[o], by = d.base[o + 1], bz = d.base[o + 2]; const r = Math.hypot(bx, bz) + 2;
    const omega = (0.04 + 0.5 / r) * (0.85 + d.w[k + 7] * 0.3);
    let ang = ease * t * omega; const rr = 1;
    const c = Math.cos(ang), s = Math.sin(ang), ph = d.w[k + 4], f = d.w[k + 5], A = d.w[k + 6] * ease;
    const yy = by;
    _pa.set((bx * c - bz * s) * rr + Math.sin(t * f + ph) * A * 0.6, yy + Math.sin(t * f * 0.8 + ph * 1.7) * A, (bx * s + bz * c) * rr + Math.cos(t * f * 0.9 + ph) * A * 0.6);
    _qa.set(d.base[o + 3], d.base[o + 4], d.base[o + 5], d.base[o + 6]); _da.set(d.w[k], d.w[k + 1], d.w[k + 2]); _dq.setFromAxisAngle(_da, d.w[k + 3] * t * ease * 0.6); _yq.setFromAxisAngle(_Y, ang);
    _qa.premultiply(_dq).premultiply(_yq); app.bricks.setPose(app.items[i], _pa, _qa);
  }
  app.bricks.commit();
}
// ---- loop ---------------------------------------------------------------------------------------------
function frame() {
  const dt = Math.min(0.05, app.clock.getDelta());
  if (app.tween) { app.tween.t += dt; const k = Math.min(1, app.tween.t / app.tween.dur); app.tween.step(k); if (k >= 1) { const d = app.tween.done; app.tween = null; d?.(); } }
  if (app.view === 'globe') {   // the hand's spin decays; after a few idle seconds the globe turns slowly by itself
    app.idle += dt; app.spin += app.spinVel * dt + (app.idle > 2.5 ? dt * 0.1 * Math.min(1, (app.idle - 2.5) / 2) : 0); app.spinVel *= Math.exp(-dt * 2.2);
    app.globe.group.quaternion.copy(homeQ());
  }
  app.orbit.update(dt); updateLabels(); stepAnims(dt); if (app.drift) drawDrift(dt); else if (app.state === 'dismantling' || app.state === 'settled') drawPhysics(); app.renderer.render(app.scene, app.camera); requestAnimationFrame(frame);
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
  app.table.visible = false; setState('built');
  if (SHOT) {
    if (qs.has('dismantle')) { // run the sim for T seconds, then hold the frame
      const T = +qs.get('dismantle')!; dismantle();
      await new Promise<void>((res) => { const orig = app.physics.onFrame!; app.physics.onFrame = (f) => { orig(f); if (f.simT >= T) { app.physics.pause(true); res(); } }; }); // T = simulated seconds
    }
  } else { prepareEntrance(); startEntrance(); }
  app.clock.getDelta(); frame(); requestAnimationFrame(() => requestAnimationFrame(() => { window.__ready = true; }));
}
start();
