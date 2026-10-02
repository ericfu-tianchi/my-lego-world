/// <reference lib="webworker" />
// Rapier (SIMD build: 3× faster than the scalar one on a 3,400-brick island, 2026-10-02) runs here so the render thread never waits on the
// solver. One rigid body per brick. No CCD: it tripled the step cost and the bricks are never fast or thin enough to tunnel at 60 Hz.
import RAPIER from '@dimforge/rapier3d-simd-compat';
type Start = { type: 'start'; poses: Float32Array; halfs: Float32Array; fixed: Uint8Array; strength: number; tableY: number; center: [number, number]; seed: number; ball?: [number, number, number, number]; gravity?: number; damping?: [number, number]; wallR?: number; burst?: number; vy?: number; spin?: number };
type Msg = Start | { type: 'stop' } | { type: 'pause'; value: boolean } | { type: 'poke'; index: number };
let world: RAPIER.World | null = null, bodies: RAPIER.RigidBody[] = [], timer: ReturnType<typeof setTimeout> | undefined, paused = false, prev = 0, acc = 0, frame = 0, gen = 0, simT = 0;
const ready = RAPIER.init();
function rand(seed: number) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function start(m: Start) {
  world?.free(); world = new RAPIER.World({ x: 0, y: -(m.gravity ?? 24), z: 0 }); world.timestep = 1 / 60; world.integrationParameters.numSolverIterations = 5; bodies = [];
  const g = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(0, m.tableY - 2, 0)); world.createCollider(RAPIER.ColliderDesc.cuboid(120, 2, 120).setFriction(0.7).setRestitution(0.1), g);
  if (m.wallR) { const r = m.wallR, n = 32; for (let k = 0; k < n; k++) { const a = (k / n) * Math.PI * 2; const w = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(Math.cos(a) * r, m.tableY + 6, Math.sin(a) * r).setRotation({ x: 0, y: Math.sin(-a / 2), z: 0, w: Math.cos(-a / 2) })); world.createCollider(RAPIER.ColliderDesc.cuboid(0.5, 12, r * Math.PI / n + 0.3).setFriction(0.5), w); } }   // an invisible round tray wall
  if (m.ball) { const [bx, by, bz, br] = m.ball; const b = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(bx, by, bz)); world.createCollider(RAPIER.ColliderDesc.ball(br).setFriction(0.8).setRestitution(0.1), b); }   // the globe the set stands on
  for (const [x, z] of [[120, 0], [-120, 0], [0, 120], [0, -120]]) { const w = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(x, m.tableY + 30, z)); world.createCollider(RAPIER.ColliderDesc.cuboid(x ? 1 : 120, 60, z ? 1 : 120), w); }
  const n = m.poses.length / 7; const rnd = rand(m.seed); const s = m.strength * (m.burst ?? 1); const [ld, ad] = m.damping ?? [0.12, 0.3];
  for (let i = 0; i < n; i++) {
    const o = i * 7; const x = m.poses[o], y = m.poses[o + 1], z = m.poses[o + 2];
    // burst: outward from the diorama centre, stronger higher up, plus a lift — the "tap" that lets go of every brick at once
    const dx = x - m.center[0], dz = z - m.center[1]; const r = Math.hypot(dx, dz) + 0.5; const a = rnd() * Math.PI * 2;
    const vel = s * (0.9 + Math.max(0, y - m.tableY) / 18); const jitter = s * 0.6;
    const desc = (m.fixed[i] ? RAPIER.RigidBodyDesc.fixed() : RAPIER.RigidBodyDesc.dynamic()).setTranslation(x, m.fixed[i] ? y : y + 0.03, z).setRotation({ x: m.poses[o + 3], y: m.poses[o + 4], z: m.poses[o + 5], w: m.poses[o + 6] })
      .setCanSleep(true).setLinearDamping(ld).setAngularDamping(ad).setCcdEnabled(false)
      .setLinvel((dx / r) * vel * 0.55 + Math.cos(a) * jitter + (m.spin ?? 0) * (-dz / r) * vel * 0.4, (1.5 + s * 0.9 + rnd() * s * 0.6) * (m.vy ?? 1), (dz / r) * vel * 0.55 + Math.sin(a) * jitter + (m.spin ?? 0) * (dx / r) * vel * 0.4)   // vy flattens the burst into a disc; spin adds a swirl
      .setAngvel({ x: (rnd() - 0.5) * 3 * s, y: (rnd() - 0.5) * 3 * s, z: (rnd() - 0.5) * 3 * s });
    const b = world.createRigidBody(desc);
    world.createCollider(RAPIER.ColliderDesc.cuboid(Math.max(0.05, m.halfs[i * 3] * 0.96), Math.max(0.05, m.halfs[i * 3 + 1] * 0.96), Math.max(0.05, m.halfs[i * 3 + 2] * 0.96)).setDensity(0.8).setFriction(0.65).setRestitution(0.12), b);
    bodies.push(b);
  }
  prev = performance.now(); acc = 0; paused = false; frame = 0; simT = 0;
  (self as unknown as Worker).postMessage({ type: 'ready', count: n });
  tick(++gen);
}
function tick(g: number) {
  if (!world || g !== gen) return;
  const now = performance.now();
  if (!paused) {
    acc = Math.min(0.07, acc + (now - prev) / 1000); let steps = 0; const t0 = performance.now();
    while (acc >= 1 / 60 && steps < 3) { world.step(); acc -= 1 / 60; steps++; simT += 1 / 60; }
    if (steps) {
      const out = new Float32Array(bodies.length * 7); let awake = 0;
      for (let i = 0; i < bodies.length; i++) { const b = bodies[i]; const t = b.translation(), r = b.rotation(); out.set([t.x, t.y, t.z, r.x, r.y, r.z, r.w], i * 7); if (!b.isSleeping()) awake++; }
      (self as unknown as Worker).postMessage({ type: 'frame', poses: out, awake, stepMs: (performance.now() - t0) / steps, simT }, [out.buffer]);
      frame++;
    }
  }
  prev = now; timer = setTimeout(() => tick(g), Math.max(0, 1000 / 60 - (performance.now() - now)));   // keep a 60 Hz cadence: subtract the time the step took
}
self.onmessage = async (e: MessageEvent<Msg>) => {
  const m = e.data;
  if (m.type === 'start') { await ready; clearTimeout(timer); start(m); }
  else if (m.type === 'stop') { gen++; clearTimeout(timer); world?.free(); world = null; bodies = []; }
  else if (m.type === 'pause') { paused = m.value; prev = performance.now(); }
  else if (m.type === 'poke') { const b = bodies[m.index]; if (b) { b.applyImpulse({ x: 0, y: b.mass() * 12, z: 0 }, true); b.applyTorqueImpulse({ x: b.mass() * 2, y: 0, z: b.mass() }, true); } }
};
