// Take-apart smoothness: frames the page actually draws per second, and the longest frame, in the first seconds after "Take it apart".
//   node tools/bench-apart.mjs la [seconds]
import { chromium } from '../tools/node_modules/playwright/index.mjs';
const [,, scene = 'la', secs = '4'] = process.argv;
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
await page.goto(`http://127.0.0.1:${process.env.PORT ?? 8125}/index.html?shot=1&noglobe&scene=${scene}`, { waitUntil: 'domcontentloaded', timeout: 180000 });
await page.waitForFunction(() => window.__ready === true, null, { timeout: 180000 });
const r = await page.evaluate(async (S) => {
  const gaps = []; let last = performance.now(), run = true;
  const loop = () => { const now = performance.now(); gaps.push(now - last); last = now; if (run) requestAnimationFrame(loop); }; requestAnimationFrame(loop);
  await new Promise((res) => setTimeout(res, 1000)); const base = gaps.splice(0).slice(5);
  document.getElementById('btn-apart').click();
  await new Promise((res) => setTimeout(res, S * 1000)); run = false;
  const st = (a) => { const s = [...a].sort((x, y) => x - y); return { fps: +(1000 / (a.reduce((p, c) => p + c, 0) / a.length)).toFixed(1), worstMs: +s[s.length - 1].toFixed(0), p90Ms: +s[Math.floor(s.length * 0.9)].toFixed(0) }; };
  return { bricks: window.__app.items.length, idle: st(base), apart: st(gaps) };
}, +secs);
console.log(JSON.stringify({ scene, ...r })); await browser.close();
