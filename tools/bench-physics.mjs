// Dismantle benchmark: how long one physics step takes and how many pose frames reach the page per second.
//   node tools/bench-physics.mjs singapore [seconds]
import { chromium } from '../tools/node_modules/playwright/index.mjs';
const [,, scene = 'singapore', secs = '4'] = process.argv;
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
await page.goto(`http://127.0.0.1:8125/index.html?shot=1&scene=${scene}`, { waitUntil: 'load' });
await page.waitForFunction(() => window.__ready === true, null, { timeout: 180000 });
const r = await page.evaluate(async (S) => {
  const app = window.__app; const steps = []; let frames = 0, sim = 0; const orig = app.physics.onFrame;
  app.physics.onFrame = (f) => { orig(f); frames++; steps.push(f.stepMs); sim = f.simT; };
  document.getElementById('btn-apart').click(); const t0 = performance.now();
  await new Promise((res) => setTimeout(res, S * 1000));
  const wall = (performance.now() - t0) / 1000; steps.sort((a, b) => a - b);
  return { bodies: app.items.length, wall: +wall.toFixed(2), simT: +sim.toFixed(2), framesPerSec: +(frames / wall).toFixed(1), stepMsMedian: +(steps[steps.length >> 1] ?? 0).toFixed(1), stepMsP90: +(steps[Math.floor(steps.length * 0.9)] ?? 0).toFixed(1) };
}, +secs);
console.log(JSON.stringify({ scene, ...r })); await browser.close();
