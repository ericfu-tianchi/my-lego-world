import * as THREE from 'three';
import { Blueprint } from '../core/builder';
import { BrickRenderer, makeStudioEnv, makeLights, type Item } from '../core/render';
import { Orbit } from '../core/controls';
import { PhysicsClient } from '../physics/client';
import { validate, summarize } from '../core/validate';
import { SCENES } from '../scenes/index';
import { type Place } from '../scenes/globe';
import { GlobeView, GLOBE_RADIUS, type GlobeStyle } from './globe-view';

const TABLE_Y = -6;
const qs = new URLSearchParams(location.search);
const SHOT = qs.has('shot');
const $ = (id: string) => document.getElementById(id) as HTMLElement;
type State = 'idle' | 'building' | 'built' | 'dismantling' | 'settled' | 'rebuilding';
/** Three entrance candidates for Eric to choose from (2026-10-02); 'rain' is the v1 entrance kept for comparison. */
type Entrance = 'steps' | 'vortex' | 'rubble' | 'rain';
const ENTRANCES: Entrance[] = ['steps', 'vortex', 'rubble'];
interface Anim { it: Item; fromP: THREE.Vector3; fromQ: THREE.Quaternion; delay: number; dur: number; arc: number; spin?: number; r0?: number; step?: number }
type CamPose = { tx: number; ty: number; tz: number; az: number; el: number; dist: number };

let globeStyle: GlobeStyle = 'mosaic';
try { const g = localStorage.getItem('globe') as GlobeStyle | null; if (g === 'mosaic' || g === 'brick' || g === 'desk') globeStyle = g; } catch { /* storage blocked */ }
if (qs.get('globe')) globeStyle = qs.get('globe') as GlobeStyle;
const app = {
  tableY: TABLE_Y, table: null as unknown as THREE.Mesh<THREE.PlaneGeometry, THREE.ShadowMaterial>,
  state: 'idle' as State, items: [] as Item[], anims: [] as Anim[], animT: 0, animDone: null as null | (() => void), kind: 'rebuild' as Entrance | 'rebuild', steps: 0,
  physics: new PhysicsClient(), lastPoses: null as Float32Array | null, prevPoses: null as Float32Array | null, poseAt: 0, poseGap: 1000 / 60, sceneId: 'kyoto', clock: new THREE.Clock(), autoRotate: 0.05,
  env: null as unknown as THREE.Texture, view: 'scene' as 'globe' | 'scene' | 'moving', globe: null as unknown as GlobeView, spin: 0, labels: [] as HTMLElement[], hover: null as null | Place,
  tween: null as null | { t: number; dur: number; step: (k: number) => void; done?: () => void }, raycaster: new THREE.Raycaster(), entrance: 'steps' as Entrance,
  renderer: null as unknown as THREE.WebGLRenderer, scene: null as unknown as THREE.Scene, camera: null as unknown as THREE.PerspectiveCamera, orbit: null as unknown as Orbit, lights: null as unknown as ReturnType<typeof makeLights>, bricks: null as unknown as BrickRenderer, center: new THREE.Vector3(),
};
try { const e = localStorage.getItem('entrance') as Entrance | null; if (e && (ENTRANCES as string[]).concat('rain').includes(e)) app.entrance = e; } catch { /* storage blocked */ }
if (qs.get('entrance')) app.entrance = qs.get('entrance') as Entrance;

function init() {
  const canvas = $('c') as HTMLCanvasElement;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: SHOT });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0; renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(32, innerWidth / innerHeight, 0.5, 1200);
  const orbit = new Orbit(camera, canvas); const lights = makeLights(scene); const bricks = new BrickRenderer(scene); bricks.anisotropy = renderer.capabilities.getMaxAnisotropy(); const env = makeStudioEnv(renderer); bricks.setEnvironment(env);
  const table = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.ShadowMaterial({ opacity: 0.22 })); table.rotation.x = -Math.PI / 2; table.position.y = TABLE_Y; table.receiveShadow = true; scene.add(table);
  const globe = new GlobeView(env, globeStyle); scene.add(globe.group, globe.fixtures);
  if (SHOT && qs.has('sil')) { table.visible = false; renderer.shadowMap.enabled = false; scene.background = new THREE.Color(0xffffff); document.body.style.background = '#fff'; document.querySelectorAll<HTMLElement>('.hud').forEach((h) => (h.style.display = 'none')); }
  Object.assign(app, { renderer, scene, camera, orbit, lights, bricks, table, globe, env });
  // globe chooser (temporary, until Eric picks one)
  document.querySelectorAll<HTMLButtonElement>('[data-globe]').forEach((b) => { b.onclick = () => setGlobe(b.dataset.globe as GlobeStyle); }); markGlobe();
  addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
  $('btn-apart').onclick = () => dismantle(); $('btn-rebuild').onclick = () => rebuild(); $('btn-globe').onclick = () => goGlobe();
  for (const pin of globe.pins) { const l = document.createElement('button'); l.className = 'pin-label'; l.innerHTML = `<b>${pin.place.name}</b><span>${pin.place.city}</span>`; l.onclick = () => enterPlace(pin.place); $('labels').appendChild(l); app.labels.push(l); }
  // entrance chooser (temporary, until Eric picks one): A / B / C and replay
  document.querySelectorAll<HTMLButtonElement>('[data-entrance]').forEach((b) => { b.onclick = () => { app.entrance = b.dataset.entrance as Entrance; try { localStorage.setItem('entrance', app.entrance); } catch { /* */ } markEntrance(); replay(); }; });
  $('btn-replay').onclick = () => replay(); markEntrance();
  canvas.addEventListener('pointermove', (e) => { const pin = pickPin(e); app.hover = pin; canvas.style.cursor = pin ? 'pointer' : ''; });
  let pressAt: [number, number] | null = null;
  canvas.addEventListener('pointerdown', (e) => { pressAt = [e.clientX, e.clientY]; });
  canvas.addEventListener('pointerup', (e) => { if (pressAt && Math.hypot(e.clientX - pressAt[0], e.clientY - pressAt[1]) < 6) { const pin = pickPin(e); if (pin) enterPlace(pin); } pressAt = null; });
  orbit.onInteract = () => { orbit.autoRotate = 0; };
  app.physics.onFrame = (f) => { if (app.state !== 'dismantling' && app.state !== 'settled') return; const now = performance.now(); app.prevPoses = app.lastPoses ?? f.poses; app.poseGap = app.lastPoses ? Math.min(100, Math.max(8, now - app.poseAt)) : 1000 / 60; app.poseAt = now; app.lastPoses = f.poses; if (f.awake === 0 && app.state === 'dismantling') setState('settled'); };
}
const markGlobe = () => document.querySelectorAll<HTMLButtonElement>('[data-globe]').forEach((b) => b.classList.toggle('on', b.dataset.globe === globeStyle));
function setGlobe(style: GlobeStyle) {
  if (style === globeStyle || app.view !== 'globe') return; globeStyle = style; try { localStorage.setItem('globe', style); } catch { /* */ }
  app.scene.remove(app.globe.group, app.globe.fixtures); app.globe = new GlobeView(app.env, style); app.scene.add(app.globe.group, app.globe.fixtures); markGlobe(); showGlobe();
}
const markEntrance = () => document.querySelectorAll<HTMLButtonElement>('[data-entrance]').forEach((b) => b.classList.toggle('on', b.dataset.entrance === app.entrance));

function loadScene(id: string) {
  const def = SCENES[id]; if (!def) return; app.sceneId = id; const bp = new Blueprint(def.seed);
  const t0 = performance.now(); const meta = def.build(bp); const t1 = performance.now();
  app.tableY = id === 'kyoto-refined' ? -.03 : TABLE_Y; app.table.position.y = app.tableY;
  const rep = validate(bp.parts, meta.base ?? 0); console.log(`scene ${id}: ${(t1 - t0).toFixed(0)}ms\n` + summarize(rep, 10));
  const origin = new THREE.Vector3(-meta.size[0] / 2, 0, -meta.size[1] / 2);
  const only = qs.get('only'); const shown = only ? bp.parts.filter((p) => only.split(',').includes(p.tag ?? '')) : bp.parts;   // ?only=torii,bridge → element renders against clean sky
  app.items = app.bricks.build(shown, origin); const st = bp.stats();
  app.center.set(0, meta.center[1], 0); const radius = Math.hypot(meta.size[0], meta.size[1]) / 2 + 4; app.lights.frame(app.center, radius);
  const o = app.orbit; o.target.copy(app.center); o.az = meta.camera?.az ?? 0.62; o.el = meta.camera?.el ?? 0.4; o.dist = meta.camera?.dist ?? radius * 2.7; o.minDist = 8; o.maxDist = 220; o.minEl = 0.05; o.autoRotate = app.autoRotate;
  if (qs.has('az')) o.az = +qs.get('az')!; if (qs.has('el')) o.el = +qs.get('el')!; if (qs.has('dist')) o.dist = +qs.get('dist')!; if (qs.has('tx')) o.target.set(+qs.get('tx')!, +qs.get('ty')!, +qs.get('tz')!);
  $('place-title').textContent = meta.title; $('place-sub').textContent = `${meta.caption} · ${meta.subtitle}`;
  $('place-stats').textContent = `${st.parts.toLocaleString()} bricks · ${st.types} part types · ${st.colors} colours · ${rep.ok ? 'connection check passed' : rep.floating + ' floating · ' + rep.overlaps + ' overlaps'}`;
  app.bricks.resetHome(); if (SHOT && qs.has('sil')) app.bricks.silhouette(true); setState('built');
}
function setState(s: State) { app.state = s; $('btn-apart').hidden = s !== 'built'; $('btn-rebuild').hidden = !(s === 'settled' || s === 'dismantling'); $('strength-wrap').hidden = s !== 'built'; $('entrance').hidden = app.view !== 'scene' || s === 'building'; }

// ---- globe: home, and the stage the set stands on -------------------------------------------------------
// One globe in one world. At home it spins at the centre of the view; on a click it turns until the place faces up, grows ×5 and sinks, until
// only its crown shows at the bottom of the screen with the place on top — and the set builds there. Back reverses the same motion.
const STAGE_SCALE = 3.2, STAGE_DROP = 20;
const stageY = () => app.tableY - STAGE_DROP - GLOBE_RADIUS * STAGE_SCALE;                 // the crown sits well below the set: on screen it peeks in at the bottom
const stageBall = (): [number, number, number, number] | undefined => (app.globe.group.visible ? [0, stageY(), 0, GLOBE_RADIUS * STAGE_SCALE] : undefined);
const homeCam = (): CamPose => (globeStyle === 'desk' ? { tx: 0, ty: -7, tz: 0, az: 0, el: 0.16, dist: 158 } : { tx: 0, ty: 0, tz: 0, az: 0, el: 0.18, dist: 128 });
const sceneCam = (): CamPose => { const o = app.orbit; return { tx: app.center.x, ty: app.center.y - 9, tz: app.center.z, az: o.az, el: o.el, dist: o.dist * 1.3 }; };   // target a little low: the set sits in the upper middle, the crown below
const setCam = (c: CamPose) => { const o = app.orbit; o.target.set(c.tx, c.ty, c.tz); o.az = c.az; o.el = c.el; o.dist = c.dist; };
const lerpCam = (a: CamPose, b: CamPose, e: number): CamPose => { let dAz = b.az - a.az; dAz = Math.atan2(Math.sin(dAz), Math.cos(dAz)); return { tx: a.tx + (b.tx - a.tx) * e, ty: a.ty + (b.ty - a.ty) * e, tz: a.tz + (b.tz - a.tz) * e, az: a.az + dAz * e, el: a.el + (b.el - a.el) * e, dist: a.dist + (b.dist - a.dist) * e }; };
const easeInOut = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
/** the globe's rotation that puts `place` on top, its north toward the back of the set */
function stageQuat(place: Place) { const pin = app.globe.pins.find((p) => p.place === place)!; const q = GlobeView.facing(pin.dir, new THREE.Vector3(0, 1, 0)); const north = new THREE.Vector3(0, 1, 0).applyQuaternion(q); north.y = 0; if (north.lengthSq() > 1e-6) { north.normalize(); const yaw = Math.atan2(north.x, north.z) - Math.PI; q.premultiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -yaw)); } return q; }
function showGlobe() {
  app.view = 'globe'; app.bricks.group.visible = false; app.table.visible = false; app.globe.pins.forEach((p) => (p.group.visible = true)); app.lights.frame(new THREE.Vector3(), GLOBE_RADIUS + 8);
  const g = app.globe.group; g.position.set(0, 0, 0); g.scale.setScalar(1); g.quaternion.copy(app.globe.homeQuat(app.spin)); app.globe.fixtures.visible = true; $('globe-pick').hidden = false;
  const o = app.orbit; o.minDist = 70; o.maxDist = 240; o.minEl = -1.2; o.autoRotate = 0; setCam(homeCam());
  $('card-globe').hidden = false; $('card-place').hidden = true; $('actions').hidden = true; $('entrance').hidden = true; $('hint').textContent = 'Drag to spin · Click a pin to visit';
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
  if (app.view !== 'globe' || app.tween) return; app.view = 'moving'; app.orbit.enabled = false; app.hover = null;
  const from = { cam: { tx: app.orbit.target.x, ty: app.orbit.target.y, tz: app.orbit.target.z, az: app.orbit.az, el: app.orbit.el, dist: app.orbit.dist }, q: app.globe.group.quaternion.clone() };
  loadScene(place.scene); const to = { cam: sceneCam(), q: stageQuat(place) }; prepareEntrance(); app.bricks.group.visible = true; app.table.visible = false; app.globe.pins.forEach((p) => (p.group.visible = false));
  $('card-globe').hidden = true; $('globe-pick').hidden = true; app.globe.fixtures.visible = false;   // the stand stays at home
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
  app.view = 'moving'; app.physics.stop(); app.anims = []; app.orbit.enabled = false; app.bricks.clear(); app.items = []; setState('idle');
  $('card-place').hidden = true; $('actions').hidden = true; $('entrance').hidden = true;
  const g = app.globe.group; const from = { cam: { tx: app.orbit.target.x, ty: app.orbit.target.y, tz: app.orbit.target.z, az: app.orbit.az, el: app.orbit.el, dist: app.orbit.dist }, q: g.quaternion.clone(), p: g.position.clone() };
  const toQ = app.globe.homeQuat(app.spin); app.lights.frame(new THREE.Vector3(), GLOBE_RADIUS + 8);
  await tween(1.8, (k) => { const e = easeInOut(k); g.quaternion.slerpQuaternions(from.q, toQ, e); g.scale.setScalar(Math.exp(Math.log(STAGE_SCALE) * (1 - e))); g.position.lerpVectors(from.p, new THREE.Vector3(), e); setCam(lerpCam(from.cam, homeCam(), e)); });
  showGlobe(); app.orbit.enabled = true;
}

// ---- entrances ----------------------------------------------------------------------------------------
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const smooth = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const easeSnap = (t: number) => { const c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };   // ease-out-back: seats, dips past home, settles
const rnd = (a: number) => (Math.random() - 0.5) * a;
const randQ = (a: number) => new THREE.Quaternion().setFromEuler(new THREE.Euler(rnd(a), rnd(a), rnd(a)));
/** Build the per-brick animation for the chosen entrance; bricks stay hidden (or in the rubble pile) until `startEntrance`. */
function prepareEntrance() {
  const kind = app.entrance; app.kind = kind; const ys = app.items.map((i) => i.home.p.y); const minY = Math.min(...ys), maxY = Math.max(...ys); const hN = (it: Item) => (it.home.p.y - minY) / (maxY - minY + 1e-6);
  if (kind === 'steps') {
    // A · Instruction manual: the set goes together in numbered steps, bottom up — every brick of a step drops straight onto its studs from a
    // hand's height above, no tumbling, a quick snap; the next step begins as the last one seats. A counter shows "Step n / N".
    const N = 36; app.steps = N;
    app.anims = app.items.map((it) => { const s = Math.min(N - 1, Math.floor(Math.pow(hN(it), 0.85) * N)); return { it, fromP: it.home.p.clone().add(new THREE.Vector3(0, 7, 0)), fromQ: it.home.q.clone(), delay: s * 0.12 + ((it.home.p.x + it.home.p.z) / 120 + 0.5) * 0.08, dur: 0.32, arc: 0, step: s }; });
  } else if (kind === 'vortex') {
    // B · Vortex: the bricks pour in on a spiral round the island, a whirlwind that tightens and drops, each brick landing in its place
    // ground first — the set forms out of the storm.
    app.anims = app.items.map((it) => ({ it, fromP: it.home.p.clone(), fromQ: randQ(6), delay: Math.pow(hN(it), 0.8) * 2.4 + Math.random() * 0.3, dur: 1.1, arc: 0, spin: Math.PI * (1.5 + Math.random()), r0: 38 + Math.random() * 14 }));
  } else if (kind === 'rubble') {
    // C · Rebuild: the set starts as the heap it leaves when you take it apart — every brick lying loose on the table round the island — then
    // the bricks leap back up in arcs and click home, ground first. Exactly the Rebuild button, as the way in.
    app.anims = app.items.map((it) => { const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * 34 + 4; const half = it.half[1]; const x = Math.cos(a) * r * 1.15, z = Math.sin(a) * r * 0.9; const R = GLOBE_RADIUS * STAGE_SCALE; const floor = app.globe.group.visible ? stageY() + Math.sqrt(Math.max(0, R * R - x * x - z * z)) : app.tableY;   // the heap lies on the globe's crown, below the set
      return { it, fromP: new THREE.Vector3(x, floor + half + Math.random() * 0.8, z), fromQ: new THREE.Quaternion().setFromEuler(new THREE.Euler(rnd(0.5), Math.random() * 6.3, rnd(0.5))), delay: 0.6 + Math.pow(hN(it), 0.9) * 2.3 + Math.random() * 0.2, dur: 1.3, arc: 6 + Math.random() * 4 }; });
  } else {
    app.anims = app.items.map((it) => ({ it, fromP: it.home.p.clone().add(new THREE.Vector3(rnd(10), 26 + Math.random() * 18, rnd(10))), fromQ: randQ(5), delay: Math.pow(hN(it), 0.8) * 2.6 + Math.random() * 0.25, dur: 0.75, arc: 0 }));
  }
  app.animT = -1e9; setState('building'); drawAnims();   // hold at t = −∞: hidden, or lying in the rubble
}
function startEntrance() { app.animT = 0; app.animDone = () => { setState('built'); $('step').hidden = true; }; $('step').hidden = app.kind !== 'steps'; }
function replay() { if (app.view !== 'scene' || app.tween) return; app.physics.stop(); setState('built'); prepareEntrance(); startEntrance(); }
const _p = new THREE.Vector3(), _q = new THREE.Quaternion();
function drawAnims() {
  let all = true, step = 0;
  for (const a of app.anims) {
    const raw = (app.animT - a.delay) / a.dur; const t = THREE.MathUtils.clamp(raw, 0, 1); if (t < 1) all = false;
    if (raw <= 0 && (app.kind !== 'rebuild' && app.kind !== 'rubble' || app.animT < 0)) { _p.set(0, -500, 0); app.bricks.setPose(a.it, _p, a.fromQ); continue; }   // not its turn yet (the rubble heap appears when the entrance starts)
    const h = a.it.home.p;
    if (app.kind === 'vortex') {
      const e = easeOut(t), ang = Math.atan2(h.z, h.x) + a.spin! * (1 - e), r = Math.hypot(h.x, h.z) + (a.r0! - Math.hypot(h.x, h.z)) * Math.pow(1 - e, 1.6);
      _p.set(Math.cos(ang) * r, h.y + 22 * Math.pow(1 - e, 1.3), Math.sin(ang) * r); _q.slerpQuaternions(a.fromQ, a.it.home.q, smooth(t));
    } else if (app.kind === 'steps') { if (t > 0) step = Math.max(step, a.step! + 1); const e = easeSnap(t); _p.lerpVectors(a.fromP, h, e); _q.copy(a.it.home.q); }
    else if (app.kind === 'rain') { const e = easeSnap(t); _p.lerpVectors(a.fromP, h, e); _q.slerpQuaternions(a.fromQ, a.it.home.q, easeOut(t)); }
    else { const e = smooth(t); _p.lerpVectors(a.fromP, h, e); _p.y += Math.sin(t * Math.PI) * a.arc; _q.slerpQuaternions(a.fromQ, a.it.home.q, e); }   // rubble / rebuild: arc home
    app.bricks.setPose(a.it, _p, _q);
  }
  app.bricks.commit(); if (app.kind === 'steps') $('step').textContent = `Step ${Math.min(step, app.steps)} / ${app.steps}`;
  return all;
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
  app.physics.start(poses, halfs, fixed, strength, app.globe.group.visible ? stageY() - 30 : app.tableY, [0, 0], 7, stageBall());   // on the globe: bricks land on its crown, the table is far below
}
function rebuild() {
  if (!(app.state === 'settled' || app.state === 'dismantling')) return; app.physics.stop(); setState('rebuilding'); app.kind = 'rebuild';
  const maxY = Math.max(...app.items.map((i) => i.home.p.y));
  app.anims = app.items.map((it) => { const p = new THREE.Vector3(), q = new THREE.Quaternion(); app.bricks.getPose(it, p, q); return { it, fromP: p, fromQ: q, delay: (it.home.p.y - TABLE_Y) / (maxY - TABLE_Y) * 1.2 + Math.random() * 0.1, dur: 1.6, arc: 4 }; });
  app.animT = 0; app.animDone = () => { setState('built'); app.orbit.autoRotate = app.autoRotate; };
}
// ---- loop ---------------------------------------------------------------------------------------------
function frame() {
  const dt = Math.min(0.05, app.clock.getDelta());
  if (app.tween) { app.tween.t += dt; const k = Math.min(1, app.tween.t / app.tween.dur); app.tween.step(k); if (k >= 1) { const d = app.tween.done; app.tween = null; d?.(); } }
  if (app.view === 'globe') { app.spin += dt * 0.12; app.globe.group.quaternion.copy(app.globe.homeQuat(app.spin)); }
  app.orbit.update(dt); updateLabels(); stepAnims(dt); if (app.state === 'dismantling' || app.state === 'settled') drawPhysics(); app.renderer.render(app.scene, app.camera); requestAnimationFrame(frame);
}
declare global { interface Window { __ready?: boolean; __app?: typeof app } }
async function start() {
  init(); window.__app = app;
  const direct = qs.get('scene') && SCENES[qs.get('scene')!] ? qs.get('scene')! : null;   // ?scene= opens a set directly (render tooling); otherwise the globe
  if (!direct) { app.spin = 2.45; showGlobe();   // Asia, where the built places are, turning into view
    app.clock.getDelta(); frame(); requestAnimationFrame(() => requestAnimationFrame(() => { window.__ready = true; })); return; }
  // a set opened directly still stands on its globe, as after a click
  app.view = 'scene'; $('card-globe').hidden = true; $('globe-pick').hidden = true; app.globe.fixtures.visible = false; loadScene(direct);
  const place = app.globe.pins.find((p) => p.place.scene === direct)?.place;
  if (place && !qs.has('noglobe')) { const g = app.globe.group; g.quaternion.copy(stageQuat(place)); g.scale.setScalar(STAGE_SCALE); g.position.set(0, stageY(), 0); app.table.visible = false; app.globe.pins.forEach((p) => (p.group.visible = false)); setCam(sceneCam()); } else app.globe.group.visible = false;
  setState('built');
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
