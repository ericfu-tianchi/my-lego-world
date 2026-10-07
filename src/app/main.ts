import * as THREE from 'three';
import { Blueprint } from '../core/builder';
import { BrickRenderer, makeStudioEnv, makeLights, type Item } from '../core/render';
import { geometryFor } from '../core/catalog';
import { Orbit } from '../core/controls';
import { PhysicsClient } from '../physics/client';
import { validate, summarize } from '../core/validate';
let checkId = 0;
import { SCENES } from '../scenes/index';
import checksJson from '../scenes/checks.json';
const CHECKS: Record<string, { parts: number; ok: boolean; floating: number; overlaps: number } | undefined> = checksJson;
import { type Place } from '../scenes/globe';
import { GlobeView, GLOBE_RADIUS } from './globe-view';

const TABLE_Y = -6;
const qs = new URLSearchParams(location.search);
const SHOT = qs.has('shot');
/** ?film=1 (promo capture, tools/film/): no rAF loop — window.__film steps app time by an exact dt and renders one frame */
const FILM = qs.has('film');
let filmDt = 0, filmK = 1, filmCam: null | { p: THREE.Vector3; t: THREE.Vector3; fov: number } = null;
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
  state: 'idle' as State, items: [] as Item[], anims: [] as Anim[], animT: 0, realT: 0, entering: false, entranceEnd: 1, animDone: null as null | (() => void), radius: 30, viewDist: 0,
  physics: new PhysicsClient(), lastPoses: null as Float32Array | null, prevPoses: null as Float32Array | null, poseAt: 0, poseGap: 1000 / 60, sceneId: 'kyoto', clock: new THREE.Clock(), autoRotate: 0.05,
  env: null as unknown as THREE.Texture, view: 'scene' as 'globe' | 'scene' | 'moving', globe: null as unknown as GlobeView, spin: 0, spinVel: 0, homeZoom: 1, idle: 0, warm: false, dragging: false, soon: null as null | { place: Place; until: number }, labels: [] as HTMLElement[], hover: null as null | Place,
  drift: null as null | { t: number; base: Float32Array; w: Float32Array }, burst: null as null | { t: number; p0: Float32Array; v: Float32Array; w: Float32Array; fixed: Uint8Array }, tween: null as null | { t: number; dur: number; step: (k: number) => void; done?: () => void }, raycaster: new THREE.Raycaster(), enter: 'float' as Enter,
  night: false, renderer: null as unknown as THREE.WebGLRenderer, scene: null as unknown as THREE.Scene, camera: null as unknown as THREE.PerspectiveCamera, orbit: null as unknown as Orbit, lights: null as unknown as ReturnType<typeof makeLights>, bricks: null as unknown as BrickRenderer, center: new THREE.Vector3(),
};
try { const e = localStorage.getItem('enter') as Enter | null; if (e === 'floor' || e === 'float') app.enter = e; } catch { /* storage blocked */ }
if (qs.get('enter')) app.enter = qs.get('enter') as Enter;
app.enter = 'float';   // Eric's pick (B, from the air)

function init() {
  const canvas = $('c') as HTMLCanvasElement;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: SHOT || FILM });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0; renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(32, innerWidth / innerHeight, 0.5, 1200);
  const orbit = new Orbit(camera, canvas); const lights = makeLights(scene); const bricks = new BrickRenderer(scene); bricks.anisotropy = renderer.capabilities.getMaxAnisotropy(); const env = makeStudioEnv(renderer); bricks.setEnvironment(env);
  const table = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.ShadowMaterial({ opacity: 0.22 })); table.rotation.x = -Math.PI / 2; table.position.y = TABLE_Y; table.receiveShadow = true; scene.add(table);
  const globe = new GlobeView(env); scene.add(globe.group, globe.fixtures);
  if (SHOT && qs.has('sil')) { table.visible = false; renderer.shadowMap.enabled = false; scene.background = new THREE.Color(0xffffff); document.body.style.background = '#fff'; document.querySelectorAll<HTMLElement>('.hud').forEach((h) => (h.style.display = 'none')); }
  Object.assign(app, { renderer, scene, camera, orbit, lights, bricks, table, globe, env });
  addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
  $('btn-night').onclick = () => setNight(!app.night); $('btn-apart').onclick = () => dismantle(); $('btn-rebuild').onclick = () => rebuild(); $('btn-globe').onclick = () => goGlobe();
  for (const pin of globe.pins) { const l = document.createElement('button'); const P = pin.place; l.className = 'pin-label' + (P.scene ? '' : ' soon') + (P.priority ? ' next' : ''); l.innerHTML = `<b>${P.name}</b><span>${P.city}</span>`; l.onclick = () => enterPlace(pin.place); l.onpointerenter = () => { if (P.scene) prepareBricks(P.scene); }; $('labels').appendChild(l); app.labels.push(l); }
  { const built = globe.pins.filter((p) => p.place.scene).length; const st = document.querySelector('#card-globe .stats'); if (st) st.textContent = `${built} places built · ${globe.pins.length - built} more pinned`; }   // counted, not hand-written (it said 2 with four built)
  // at home the globe turns under the hand and the camera stays put: drag or scroll spins the ball about its axis, with a little inertia
  let drag: { x: number; y: number; t: number } | null = null, pressAt: [number, number] | null = null;
  canvas.addEventListener('pointerdown', (e) => { pressAt = [e.clientX, e.clientY]; if (app.view === 'globe') { drag = { x: e.clientX, y: e.clientY, t: e.timeStamp }; app.dragging = true; app.spinVel = 0; app.idle = 0; canvas.setPointerCapture(e.pointerId); } });
  canvas.addEventListener('pointermove', (e) => {
    if (drag && app.view === 'globe') { const d = (e.clientX - drag.x) * 0.006; app.spin += d; app.spinVel = THREE.MathUtils.clamp((d / Math.max(16, e.timeStamp - drag.t)) * 1000, -4, 4); drag = { x: e.clientX, y: e.clientY, t: e.timeStamp }; app.idle = 0; }   // event timestamps, not handler time: moves queued behind a long task arrive 1 ms apart and flung the globe (Eric 2026-10-07)
    const pin = pickPin(e); if (pin && pin !== app.hover && pin.scene && !drag) prepareBricks(pin.scene); app.hover = pin; canvas.style.cursor = pin ? 'pointer' : app.view === 'globe' ? 'grab' : '';
  });
  canvas.addEventListener('pointerup', (e) => { if (drag && e.timeStamp - drag.t > 80) app.spinVel = 0; drag = null; app.dragging = false; if (pressAt && Math.hypot(e.clientX - pressAt[0], e.clientY - pressAt[1]) < 6) { const pin = pickPin(e); if (pin) enterPlace(pin); } pressAt = null; });
  canvas.addEventListener('wheel', (e) => { if (app.view !== 'globe') return; e.preventDefault(); e.stopImmediatePropagation(); app.spinVel += e.deltaX * 0.004; app.homeZoom = THREE.MathUtils.clamp(app.homeZoom * Math.exp(e.deltaY * 0.0012), 0.42, 1.25); setCam(homeCam()); app.idle = 0; }, { capture: true, passive: false });   // trackpad sideways spins, scroll or pinch zooms
  orbit.onInteract = () => { orbit.autoRotate = 0; };
  app.physics.onFrame = (f) => { if (app.state !== 'dismantling' && app.state !== 'settled') return; const now = performance.now(); app.prevPoses = app.lastPoses ?? f.poses; app.poseGap = app.lastPoses ? Math.min(100, Math.max(8, now - app.poseAt)) : 1000 / 60; app.poseAt = now; app.lastPoses = f.poses; if (app.state === 'dismantling' && f.simT >= 2.0) { startDrift(f.poses); return; } if (f.awake === 0 && app.state === 'dismantling') setState('settled'); };
}
function replay() { if (app.view !== 'scene' || app.tween || app.state === 'building' || app.state === 'rebuilding') return; app.physics.stop(); app.drift = null; app.burst = null; app.bricks.resetHome(); prepareEntrance(); startEntrance(); }

/** Scenes are built once and kept: the blueprint (90 ms on Shanghai) and, through prewarm, every part geometry already on the GPU, so a
 *  click on the globe starts the transition at once (Eric 2026-10-04: big sets waited ~2 s and he clicked again, thinking it had failed). */
const built = new Map<string, { bp: Blueprint; meta: ReturnType<typeof SCENES[string]['build']>; ms: number; rep?: { ok: boolean; floating: number; overlaps: number } }>();
function buildCached(id: string) { let b = built.get(id); if (!b) { const def = SCENES[id]; const bp = new Blueprint(def.seed); const t0 = performance.now(); const meta = def.build(bp); b = { bp, meta, ms: performance.now() - t0 }; built.set(id, b); } return b; }
/** Every set is built into the brick renderer once — while the globe turns, one set per idle slot, and at once for the set under the
 *  pointer — and drawn once off screen, so its programs, geometry and instance buffers are on the GPU; a click then only swaps it in */
let bricksFor: string | null = null; const uploaded = new Set<string>();
function prepareBricks(id: string) {
  if (bricksFor === id || app.view !== 'globe' || app.tween || !SCENES[id]) return;
  const { bp, meta } = buildCached(id); app.bricks.glowRule = meta.glow ?? null; app.items = app.bricks.build(bp.parts, new THREE.Vector3(-meta.size[0] / 2, 0, -meta.size[1] / 2), id); bricksFor = id;
  if (uploaded.has(id)) return; uploaded.add(id);
  // drawn to the screen through a one-pixel scissor: a render target would compile the linear, untone-mapped shader variants and the
  // click would still compile the screen ones (0.8 s on Shanghai, measured 2026-10-04); the next frame paints over the pixel
  const g = app.bricks.group; const r = app.renderer; g.visible = true; r.setScissorTest(true); r.setScissor(0, 0, 1, 1); r.render(app.scene, app.camera); r.setScissorTest(false); g.visible = false;
}
function loadScene(id: string) {
  const def = SCENES[id]; if (!def) return; app.sceneId = id;
  const cached = buildCached(id); const { bp, meta, ms } = cached; const t0 = 0, t1 = ms;
  app.tableY = id === 'kyoto-refined' ? -.03 : TABLE_Y; app.table.position.y = app.tableY;
  // the connection check costs ~1.5 s on Shanghai's 8,000 parts — inside the click it held the globe still for two seconds (Eric 2026-10-04).
  // Screenshots and tools read its summary from the console, so they keep it synchronous; the app runs it once the entrance is over.
  const full = SHOT ? validate(bp.parts, meta.base ?? 0) : null; if (full) console.log(`scene ${id}: ${(t1 - t0).toFixed(0)}ms\n` + summarize(full, 10));
  const baked = CHECKS[id]?.parts === bp.parts.length ? CHECKS[id] : undefined;   // the gate's result (scripts/validate.ts)
  const rep = full ?? cached.rep ?? baked ?? null;
  const origin = new THREE.Vector3(-meta.size[0] / 2, 0, -meta.size[1] / 2);
  const only = qs.get('only'); const shown = only ? bp.parts.filter((p) => only.split(',').includes(p.tag ?? '')) : bp.parts;   // ?only=torii,bridge → element renders against clean sky
  if (only || bricksFor !== id) { app.bricks.glowRule = meta.glow ?? null; app.items = app.bricks.build(shown, origin, only ? undefined : id); bricksFor = only ? null : id; }   // a set prepared on hover is reused
  const st = bp.stats();
  $('btn-night').hidden = !meta.glow; setNight(!!meta.glow && (app.night || qs.has('night')));
  app.center.set(0, meta.center[1], 0); const radius = Math.hypot(meta.size[0], meta.size[1]) / 2 + 4; app.radius = radius; app.viewDist = meta.viewDist ?? radius * 2.15; app.lights.frame(app.center, radius);
  const o = app.orbit; o.target.copy(app.center); o.az = meta.camera?.az ?? 0.62; o.el = meta.camera?.el ?? 0.4; o.dist = meta.camera?.dist ?? radius * 2.7; o.minDist = 8; o.maxDist = 220; o.minEl = 0.05; o.autoRotate = app.autoRotate;
  if (qs.has('az')) o.az = +qs.get('az')!; if (qs.has('el')) o.el = +qs.get('el')!; if (qs.has('dist')) o.dist = +qs.get('dist')!; if (qs.has('tx')) o.target.set(+qs.get('tx')!, +qs.get('ty')!, +qs.get('tz')!);
  $('place-title').textContent = meta.title; $('place-sub').textContent = `${meta.caption} · ${meta.subtitle}`;
  const line = (r: { ok: boolean; floating: number; overlaps: number } | null) => `${st.parts.toLocaleString()} bricks · ${st.types} part types · ${st.colors} colours · ${!r ? 'checking connections…' : r.ok ? 'connection check passed' : r.floating + ' floating · ' + r.overlaps + ' overlaps'}`;
  $('place-stats').textContent = line(rep);
  if (!rep) { const my = ++checkId; const run = () => { if (my !== checkId || app.sceneId !== id) return; if (app.tween || app.state !== 'built') { setTimeout(run, 400); return; } cached.rep = validate(bp.parts, meta.base ?? 0); $('place-stats').textContent = line(cached.rep); }; setTimeout(run, 3500); }   // once per set per visit to the page
  app.bricks.resetHome(); if (SHOT && qs.has('sil')) app.bricks.silhouette(true); setState('built');
}
/** night mode (Shanghai, 2026-10-03): moonlight, a dark sky, and the bricks the scene's glow rule names lit from within */
function setNight(on: boolean) { app.night = on; app.bricks.setNight(on); app.lights.night(on); app.renderer.toneMappingExposure = on ? 1.15 : 1.0; document.body.classList.toggle('night', on); $('btn-night').textContent = on ? 'Day' : 'Night'; }
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
const sceneCam = (): CamPose => ({ tx: app.center.x, ty: app.center.y - 4, tz: app.center.z, az: 0.3, el: 0.36, dist: app.viewDist });   // Eric's reference view (10-02): ~20° down, three-quarter
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
/** Labels (Eric 2026-10-07): built places always show theirs; a place not built yet shows its label only under the pointer or for a
 *  moment after a click ("Coming soon"). Each label sits clear of every pin head — above its pin, or beside it when that spot is taken —
 *  and of the labels already placed, so Paris, Neuschwanstein and Prague can all be open at once. A label keeps its spot while it stays free. */
const SLOTS = ['up', 'upLeft', 'upRight', 'left', 'right', 'down', 'downLeft', 'downRight'] as const;
function updateLabels() {
  const camDir = new THREE.Vector3(); app.camera.getWorldDirection(camDir); const camUp = new THREE.Vector3(0, 1, 0).applyQuaternion(app.camera.quaternion);
  const p = new THREE.Vector3(), q = new THREE.Vector3(), d = new THREE.Vector3(); const toPx = (v: THREE.Vector3) => { v.project(app.camera); return [(v.x * 0.5 + 0.5) * innerWidth, (-v.y * 0.5 + 0.5) * innerHeight]; };
  const now = performance.now(); if (app.soon && app.soon.until < now) app.soon = null;
  const cand: { i: number; x: number; top: number; base: number; r: number; rank: number; facing: number }[] = []; const heads: { i: number; b: number[] }[] = [];
  app.globe.pins.forEach((pin, i) => {
    const l = app.labels[i]; d.copy(pin.dir).applyQuaternion(app.globe.group.quaternion); const facing = -d.dot(camDir);
    if (app.view !== 'globe' || facing <= 0.15) { l.style.opacity = '0'; l.style.pointerEvents = 'none'; return; }
    const built = !!pin.place.scene, s = pin.group.scale.x, top = (built ? 2.2 : 1.8) * s, rad = (built ? 1 : 0.5) * s;
    pin.group.getWorldPosition(p); q.copy(p).addScaledVector(d, top); const [x, y] = toPx(q.clone()); const [, y1] = toPx(q.addScaledVector(camUp, rad)); const r = Math.max(4, y - y1);
    const [, base] = toPx(p.clone()); heads.push({ i, b: [x - r, y - r, x + r, Math.max(base, y + r)] });
    const open = built || app.hover === pin.place || app.soon?.place === pin.place;
    if (!open) { l.style.opacity = '0'; l.style.pointerEvents = 'none'; l.classList.remove('hover'); return; }
    cand.push({ i, x, top: y, base: Math.max(base, y + r), r, rank: (built ? 0 : -1) - facing * 0.5, facing });   // an opened "coming soon" label is placed first: the pointer asked for it
  });
  cand.sort((a, b) => a.rank - b.rank); const boxes: number[][] = []; const G = 6;
  const hit = (b: number[], list: number[][]) => list.reduce((n, o) => n + Math.max(0, Math.min(b[2], o[2]) - Math.max(b[0], o[0])) * Math.max(0, Math.min(b[3], o[3]) - Math.max(b[1], o[1])), 0);
  for (const c of cand) {
    const l = app.labels[c.i]; const pin = app.globe.pins[c.i]; const hover = app.hover === pin.place;
    if (l.offsetWidth) { l.dataset.w = String(l.offsetWidth); l.dataset.h = String(l.offsetHeight); } const w = +(l.dataset.w ?? 110), h = +(l.dataset.h ?? 36);
    const boxAt = (slot: typeof SLOTS[number]) => { const y0 = slot.startsWith('up') ? c.top - c.r - G - h : slot.startsWith('down') ? c.base + G : c.top - h / 2;
      const x0 = slot === 'left' ? c.x - c.r - G - w : slot === 'right' ? c.x + c.r + G : slot.endsWith('Left') ? c.x - w + c.r : slot.endsWith('Right') ? c.x - c.r : c.x - w / 2;
      return [x0, y0, x0 + w, y0 + h]; };
    const pad = (b: number[]) => [b[0] - 4, b[1] - 4, b[2] + 4, b[3] + 4];   // labels keep a little air between them
    const others = heads.filter((o) => o.i !== c.i).map((o) => o.b); const cost = (slot: typeof SLOTS[number]) => { const b = boxAt(slot); return hit(pad(b), boxes) * 4 + hit(b, others); };
    const prev = l.dataset.slot as typeof SLOTS[number] | undefined; let slot: typeof SLOTS[number] = prev && cost(prev) === 0 ? prev : SLOTS.reduce((best, k) => (cost(k) < cost(best) ? k : best), SLOTS[0] as typeof SLOTS[number]);
    if (prev && slot !== prev && cost(prev) <= cost(slot)) slot = prev; l.dataset.slot = slot; const box = boxAt(slot); boxes.push(box);
    l.style.opacity = String(Math.min(1, (c.facing - 0.15) * 4)); l.style.pointerEvents = 'auto';
    l.style.transform = `translate(${box[0]}px, ${box[1]}px)`; l.classList.toggle('hover', hover); l.classList.toggle('asked', app.soon?.place === pin.place); l.style.zIndex = pin.place.scene ? (hover ? '6' : '4') : '7';
  }
}
function pickPin(e: PointerEvent): Place | null {
  if (app.view !== 'globe') return null;
  app.raycaster.setFromCamera(new THREE.Vector2((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1), app.camera);
  const hits = app.raycaster.intersectObjects(app.globe.pins.map((p) => p.hit), false); return hits.length ? app.globe.pins.find((p) => p.hit === hits[0].object)!.place : null;
}
const tween = (dur: number, step: (k: number) => void) => new Promise<void>((done) => { app.tween = { t: 0, dur, step, done }; });
async function enterPlace(place: Place) {
  if (!place.scene) { const l = app.labels[app.globe.pins.findIndex((p) => p.place === place)]; app.soon = { place, until: performance.now() + 2200 }; l.classList.remove('shake'); void l.offsetWidth; l.classList.add('shake'); return; }   // not built yet: its label opens and nods
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
  if (app.night) setNight(false);
  if (app.view !== 'scene' || app.tween || app.state === 'building' || app.state === 'rebuilding') return;
  app.view = 'moving'; app.physics.stop(); app.anims = []; app.orbit.enabled = false; app.table.visible = false;
  $('card-place').hidden = true; $('actions').hidden = true;
  const ys = app.items.map((i) => i.home.p.y); const minY = Math.min(...ys), maxY = Math.max(...ys);
  app.drift = null; app.burst = null; const exits = app.items.map((it) => { const p = new THREE.Vector3(), q = new THREE.Quaternion(); app.bricks.getPose(it, p, q); const h = it.home.p;
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
  app.bricks.clear(); app.items = []; bricksFor = null; app.bricks.group.scale.setScalar(1); app.bricks.group.position.set(0, 0, 0); showGlobe();
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
  if (app.state !== 'built') return; setState('dismantling'); app.orbit.autoRotate = 0; app.lastPoses = app.prevPoses = null; app.drift = null; app.burst = null;
  const n = app.items.length; const poses = new Float32Array(n * 7), halfs = new Float32Array(n * 3), fixed = new Uint8Array(n);
  app.items.forEach((it, i) => { poses.set([it.home.p.x, it.home.p.y, it.home.p.z, it.home.q.x, it.home.q.y, it.home.q.z, it.home.q.w], i * 7); halfs.set(it.half, i * 3); fixed[i] = it.key.startsWith('baseplate_') ? 1 : 0; });
  app.table.visible = false;   // zero-g, a fixed force (Eric 10-02: no slider; some punch, not much). 
  const B = { vy: 0.85, spin: 0.35, burst: 0.72 };   // Nebula (Eric's pick): a soft round cloud
  if (qs.get('apart') !== 'physics') { startBurst(poses, fixed, 2.2 * B.burst, app.tableY - 400, B.vy, B.spin, 7); return; }
  app.physics.start(poses, halfs, fixed, 2.2, app.tableY - 400, [0, 0], 7, undefined, { gravity: 0, damping: [1.0, 0.7], ...B });
}
// ---- closed-form burst, every set (LA, 2026-10-06: 11,000 rigid bodies stepped at ≈ 30 ms and stuttered; side by side on Shanghai Eric saw no
// difference, so all sets use it; ?apart=physics still runs the Rapier burst) ------
// The Nebula burst is zero-g with linear / angular damping 1.0 / 0.7, so each brick's flight has a closed form: x(t) = x0 + v·(1 − e^(−t))
// and a spin of |ω|·(1 − e^(−0.7t))/0.7 about its own axis. The starting velocities are the worker's, drawn from the same seeded sequence;
// only brick-on-brick contacts are dropped, which in a radial burst the eye does not miss. After 2 s it hands over to the same drift.
function seq(seed: number) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function startBurst(poses: Float32Array, fixed: Uint8Array, s: number, tableY: number, vyK: number, spin: number, seed: number) {
  const n = poses.length / 7, r01 = seq(seed), v = new Float32Array(n * 3), w = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const o = i * 7, x = poses[o], y = poses[o + 1], z = poses[o + 2]; const r = Math.hypot(x, z) + 0.5; const a = r01() * Math.PI * 2;
    const vel = s * (0.9 + Math.max(0, y - tableY) / 18), jitter = s * 0.6 * (1 + 0.5 * Math.min(1, Math.max(0, y - tableY - 12) / 24));
    v[i * 3] = (x / r) * vel * 0.55 + Math.cos(a) * jitter + spin * (-z / r) * vel * 0.4; v[i * 3 + 1] = (1.5 + s * 0.9 + r01() * s * 0.6) * vyK; v[i * 3 + 2] = (z / r) * vel * 0.55 + Math.sin(a) * jitter + spin * (x / r) * vel * 0.4;
    for (let k = 0; k < 3; k++) w[i * 3 + k] = (r01() - 0.5) * 3 * s;
  }
  app.burst = { t: 0, p0: poses, v, w, fixed };
}
function burstPoses(b: NonNullable<typeof app.burst>, t: number, out?: Float32Array) {
  const fl = 1 - Math.exp(-t), fa = (1 - Math.exp(-0.7 * t)) / 0.7, n = b.p0.length / 7;
  for (let i = 0; i < n; i++) {
    const o = i * 7, k = i * 3; _qa.set(b.p0[o + 3], b.p0[o + 4], b.p0[o + 5], b.p0[o + 6]);
    if (b.fixed[i]) _pa.set(b.p0[o], b.p0[o + 1], b.p0[o + 2]);
    else { _pa.set(b.p0[o] + b.v[k] * fl, b.p0[o + 1] + b.v[k + 1] * fl, b.p0[o + 2] + b.v[k + 2] * fl); _da.set(b.w[k], b.w[k + 1], b.w[k + 2]); const m = _da.length(); if (m > 1e-6) { _dq.setFromAxisAngle(_da.multiplyScalar(1 / m), m * fa); _qa.premultiply(_dq); } }
    if (out) out.set([_pa.x, _pa.y, _pa.z, _qa.x, _qa.y, _qa.z, _qa.w], o); else app.bricks.setPose(app.items[i], _pa, _qa);
  }
  if (!out) app.bricks.commit();
}
function drawBurst(dt: number) {
  const b = app.burst!; b.t = Math.min(2, b.t + dt);
  if (b.t >= 2) { const out = new Float32Array(b.p0.length); burstPoses(b, 2, out); app.burst = null; startDrift(out); drawDrift(0); return; }
  burstPoses(b, b.t);
}
function rebuild() {
  if (!(app.state === 'settled' || app.state === 'dismantling')) return; app.physics.stop(); app.drift = null; app.burst = null; setState('rebuilding');
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
  const dt = FILM ? filmDt : Math.min(0.05, app.clock.getDelta());
  if (app.tween) { app.tween.t += dt; const k = Math.min(1, app.tween.t / app.tween.dur); app.tween.step(k); if (k >= 1) { const d = app.tween.done; app.tween = null; d?.(); } }
  if (app.view === 'globe') {   // the hand's spin decays; after a few idle seconds the globe turns slowly by itself
    app.idle += dt; app.spin += app.spinVel * dt + (app.idle > 2.5 && app.warm ? dt * 0.1 * Math.min(1, (app.idle - 2.5) / 2) : 0); app.spinVel *= Math.exp(-dt * 2.2);
    app.globe.group.quaternion.copy(homeQ());
  }
  app.orbit.update(dt); if (filmCam) { const c = app.camera; c.position.copy(filmCam.p); c.lookAt(filmCam.t); if (c.fov !== filmCam.fov) { c.fov = filmCam.fov; c.updateProjectionMatrix(); } } else if (filmK !== 1) app.camera.position.sub(app.orbit.target).multiplyScalar(filmK).add(app.orbit.target); updateLabels(); stepAnims(dt); if (app.burst) drawBurst(dt); else if (app.drift) drawDrift(dt); else if (app.state === 'dismantling' || app.state === 'settled') drawPhysics(); app.renderer.render(app.scene, app.camera); if (!FILM) requestAnimationFrame(frame);
}
declare global { interface Window { __ready?: boolean; __app?: typeof app; __film?: object } }
async function start() {
  init(); window.__app = app;
  if (FILM) window.__film = {
    step: (dt: number) => { filmDt = dt; frame(); },
    look: (p: number[] | null, t: number[], fov = 32) => { filmCam = p ? { p: new THREE.Vector3(...p), t: new THREE.Vector3(...t), fov } : null; app.orbit.autoRotate = 0; app.autoRotate = 0; },
    enter: (id: string) => { const pin = app.globe.pins.find((p) => p.place.scene === id); if (pin) void enterPlace(pin.place); },
    pinScreen: (id: string) => { const pin = app.globe.pins.find((p) => p.place.scene === id)!; const v = new THREE.Vector3(); pin.group.getWorldPosition(v); v.project(app.camera); return [(v.x * 0.5 + 0.5) * innerWidth, (-v.y * 0.5 + 0.5) * innerHeight]; },
    zoom: (k: number) => { filmK = k; },   // the app's own camera, k × farther (a 9:16 frame is narrower than the app's)
    tags: () => { const b = built.get(app.sceneId)!, [W, D] = b.meta.size, o: Record<string, number[]> = {}; const at = (p: typeof b.bp.parts[number]) => p.xform ? [p.xform.p[0] - W / 2, p.xform.p[1], p.xform.p[2] - D / 2] : [p.x + 0.5 - W / 2, p.y * 0.4, p.z + 0.5 - D / 2];   // world coordinates
      for (const p of b.bp.parts) { const m = (o[p.tag || '-'] ??= [1e9, 1e9, 1e9, -1e9, -1e9, -1e9]); at(p).forEach((v, i) => { m[i] = Math.min(m[i], v); m[i + 3] = Math.max(m[i + 3], v); }); }
      return { tags: o, heads: b.bp.parts.filter((p) => p.key === 'fig_head' || p.key === 'ld_3626c').map((p) => [p.tag, ...at(p).map((v) => +v.toFixed(1))]) }; },
    apart: () => dismantle(), state: () => ({ view: app.view, state: app.state, tween: !!app.tween }),
    hideUI: (on: boolean) => document.querySelectorAll<HTMLElement>('.hud, #labels').forEach((h) => (h.style.visibility = on ? 'hidden' : '')),
  };
  // every set built and uploaded in the first seconds while the globe stands still (it starts turning once they are in), in two slices per
  // set (blueprint, then bricks + upload) and never while the hand is on the globe: a slice is a long task, and one in the middle of a
  // drag froze the ball and then flung it (Eric 2026-10-07)
  if (!SHOT && !FILM) { const queue = app.globe.pins.filter((p) => p.place.scene).map((p) => p.place.scene!);
    const next = () => { const id = queue[0]; if (!id) { app.warm = true; return; }
      if (app.view !== 'globe' || app.tween || app.dragging || Math.abs(app.spinVel) > 0.05) { setTimeout(next, 250); return; }
      if (!built.has(id)) buildCached(id); else { prepareBricks(id); queue.shift(); } setTimeout(next, 30); };
    setTimeout(next, 300); } else app.warm = true;
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
      if (app.burst) { const b = app.burst; b.t = Math.min(T, 2); const out = new Float32Array(b.p0.length); burstPoses(b, b.t, out); app.burst = null; for (let i = 0; i < app.items.length; i++) { const o = i * 7; _pa.set(out[o], out[o + 1], out[o + 2]); _qa.set(out[o + 3], out[o + 4], out[o + 5], out[o + 6]); app.bricks.setPose(app.items[i], _pa, _qa); } app.bricks.commit(); setState('settled'); }   // the closed-form burst: pose it at T and hold
      else await new Promise<void>((res) => { const orig = app.physics.onFrame!; app.physics.onFrame = (f) => { orig(f); if (f.simT >= T) { app.physics.pause(true); res(); } }; }); // T = simulated seconds
    }
  } else { prepareEntrance(); startEntrance(); }
  app.clock.getDelta(); frame(); requestAnimationFrame(() => requestAnimationFrame(() => { window.__ready = true; }));
}
start();
