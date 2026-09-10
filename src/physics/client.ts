import PhysicsWorker from './worker?worker&inline';
export interface PhysicsFrame { poses: Float32Array; awake: number; stepMs: number }
/** Main-thread handle to the physics worker. */
export class PhysicsClient {
  private w: Worker | null = null; onFrame: ((f: PhysicsFrame) => void) | null = null; onReady: (() => void) | null = null;
  start(poses: Float32Array, halfs: Float32Array, strength: number, tableY: number, center: [number, number], seed = 7) {
    this.stop(); const w = new PhysicsWorker(); this.w = w;
    w.onmessage = (e: MessageEvent) => { const m = e.data; if (m.type === 'frame') this.onFrame?.(m); else if (m.type === 'ready') this.onReady?.(); };
    w.postMessage({ type: 'start', poses, halfs, strength, tableY, center, seed });
  }
  pause(v: boolean) { this.w?.postMessage({ type: 'pause', value: v }); }
  poke(index: number) { this.w?.postMessage({ type: 'poke', index }); }
  stop() { if (this.w) { this.w.postMessage({ type: 'stop' }); this.w.terminate(); this.w = null; } }
  get running() { return !!this.w; }
}
