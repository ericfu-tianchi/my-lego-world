// node tools/film.mjs <scene> <shots.json> <outdir> [w h] [--stills]
// Renders a camera path frame by frame (30 fps) to <outdir>/f%05d.jpg; ffmpeg turns it into a video.
// shots.json: [{ name, pose: [tx, ty, tz, az, el, dist], hold: s, move: s }]: `move` s of eased travel into the pose, then `hold` s with a slow drift
import { chromium } from '../tools/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const args = process.argv.slice(2); const stills = args.includes('--stills'); const [scene, shotsFile, out, w = '1920', h = '1080'] = args.filter((a) => a !== '--stills');
const shots = JSON.parse(fs.readFileSync(shotsFile, 'utf8')); fs.mkdirSync(out, { recursive: true });
const FPS = 30, DRIFT = 0.035;   // rad/s of az while holding
const ease = (t) => t * t * t * (t * (6 * t - 15) + 10);   // smootherstep: zero velocity and acceleration at both ends
const lerp = (a, b, t) => a + (b - a) * t;
function path() {   // one pose per frame
  const P = []; let cur = shots[0].pose.slice();
  shots.forEach((s, i) => {
    const from = cur.slice(), to = s.pose.slice(); const n = i === 0 ? 0 : Math.round(s.move * FPS); const far = Math.hypot(to[0] - from[0], to[2] - from[2]);
    const cam = (q) => { const c = Math.cos(q[4]) * q[5]; return [q[0] + Math.sin(q[3]) * c, q[1] + Math.sin(q[4]) * q[5], q[2] + Math.cos(q[3]) * c]; };
    const A = cam(from), B = cam(to); const arc = Math.min(1, far / 10) * (Math.min(from[5], to[5]) < 50 ? 10 : 0) * (s.lift ?? 1);
    for (let f = 1; f <= n; f++) {   // the camera travels a straight line between the two eyes, raised on an arc: up and over the roofs, never through them
      const k = ease(f / n); const t = [0, 1, 2].map((j) => lerp(from[j], to[j], k)); const e = [0, 1, 2].map((j) => lerp(A[j], B[j], k)); e[1] += arc * Math.sin(Math.PI * k);
      const d = [e[0] - t[0], e[1] - t[1], e[2] - t[2]]; const r = Math.hypot(...d); P.push([...t, Math.atan2(d[0], d[2]), Math.asin(d[1] / r), r]); }
    const m = Math.round(s.hold * FPS); for (let f = 0; f < m; f++) { const p = to.slice(); p[3] += DRIFT * ease(f / m) * s.hold * (s.dir ?? 1); P.push(p); }
    cur = P.length ? P[P.length - 1].slice() : to; shots[i + 1] && (cur = cur);
  });
  return P;
}
const frames = stills ? shots.map((s) => s.pose) : path();
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=metal', '--ignore-gpu-blocklist', '--enable-gpu'] });
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
await page.goto(`http://127.0.0.1:${process.env.PORT ?? 8125}/index.html?shot=1&noglobe&scene=${scene}`, { waitUntil: 'domcontentloaded', timeout: 180000 });
await page.waitForFunction(() => window.__ready === true, null, { timeout: 180000 });
await page.evaluate(() => { for (const el of document.body.children) if (el.tagName !== 'CANVAS' && !el.querySelector('canvas')) el.style.display = 'none'; document.querySelectorAll('.hud, #card-place, #actions').forEach((e) => (e.style.display = 'none')); window.__app.orbit.autoRotate = 0; });
const t0 = Date.now();
for (let i = 0; i < frames.length; i++) {
  await page.evaluate(async ([tx, ty, tz, az, el, dist]) => { const o = window.__app.orbit; o.autoRotate = 0; o.target.set(tx, ty, tz); o.az = az; o.el = el; o.dist = dist; o.update(0);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); }, frames[i]);
  await page.screenshot({ path: `${out}/${stills ? shots[i].name : 'f' + String(i).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 92 });   // the page, not the canvas: the sky is the body's background
  if (i % 60 === 0) console.log(`${i}/${frames.length} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
await browser.close(); console.log('done', frames.length, 'frames');
