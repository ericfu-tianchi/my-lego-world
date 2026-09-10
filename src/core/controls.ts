import * as THREE from 'three';
/** Minimal orbit camera: drag orbits, wheel / pinch zooms, shift-drag or two fingers pan. */
export class Orbit {
  target = new THREE.Vector3(); az = 0.6; el = 0.5; dist = 60; minDist = 5; maxDist = 400; minEl = 0.05; maxEl = 1.45;
  autoRotate = 0; idleFor = 0; enabled = true; onInteract: (() => void) | null = null;
  private ptr = new Map<number, { x: number; y: number; b: number; shift: boolean }>(); private pinch = 0;
  constructor(public camera: THREE.PerspectiveCamera, public dom: HTMLElement) {
    dom.addEventListener('pointerdown', (e) => this.down(e)); dom.addEventListener('pointermove', (e) => this.move(e));
    dom.addEventListener('pointerup', (e) => this.up(e)); dom.addEventListener('pointercancel', (e) => this.up(e));
    dom.addEventListener('wheel', (e) => { e.preventDefault(); this.zoom(Math.exp(e.deltaY * 0.0012)); }, { passive: false });
    dom.addEventListener('contextmenu', (e) => e.preventDefault());
  }
  private touched() { this.idleFor = 0; this.onInteract?.(); }
  private down(e: PointerEvent) { if (!this.enabled) return; this.dom.setPointerCapture(e.pointerId); this.ptr.set(e.pointerId, { x: e.clientX, y: e.clientY, b: e.button, shift: e.shiftKey }); if (this.ptr.size === 2) this.pinch = this.pinchDist(); this.touched(); }
  private pinchDist() { const p = [...this.ptr.values()]; return Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y); }
  private move(e: PointerEvent) {
    if (!this.enabled) return; const prev = this.ptr.get(e.pointerId); if (!prev) return;
    const dx = e.clientX - prev.x, dy = e.clientY - prev.y; prev.x = e.clientX; prev.y = e.clientY;
    if (this.ptr.size === 2) { const d = this.pinchDist(); if (this.pinch > 0) this.zoom(this.pinch / d); this.pinch = d; this.pan(dx * 0.5, dy * 0.5); return; }
    if (prev.b === 2 || prev.shift) this.pan(dx, dy); else { this.az -= dx * 0.006; this.el = THREE.MathUtils.clamp(this.el + dy * 0.006, this.minEl, this.maxEl); }
    this.touched();
  }
  private up(e: PointerEvent) { this.ptr.delete(e.pointerId); this.pinch = 0; }
  zoom(f: number) { if (!this.enabled) return; this.dist = THREE.MathUtils.clamp(this.dist * f, this.minDist, this.maxDist); this.touched(); }
  private pan(dx: number, dy: number) { const s = this.dist * 0.0012; const right = new THREE.Vector3(), up = new THREE.Vector3(); this.camera.matrix.extractBasis(right, up, new THREE.Vector3()); this.target.addScaledVector(right, -dx * s).addScaledVector(up, dy * s); }
  update(dt: number) {
    this.idleFor += dt; if (this.autoRotate && this.idleFor > 3) this.az += this.autoRotate * dt * Math.min(1, (this.idleFor - 3) / 2);
    const c = Math.cos(this.el) * this.dist;
    this.camera.position.set(this.target.x + Math.sin(this.az) * c, this.target.y + Math.sin(this.el) * this.dist, this.target.z + Math.cos(this.az) * c); this.camera.lookAt(this.target);
  }
}
