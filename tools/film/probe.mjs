import { chromium } from '../node_modules/playwright/index.mjs';
const browser = await chromium.launch({ args: ['--use-angle=metal', '--ignore-gpu-blocklist', '--enable-gpu'] });
const page = await browser.newPage({ viewport: { width: 540, height: 960 } });
await page.goto(`http://127.0.0.1:8161/index.html?film=1`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => window.__ready === true, null, { timeout: 180000 });
await page.evaluate((id) => window.__film.enter(id), process.argv[2] ?? 'paris');
for (let i = 0; i < 300; i++) { await page.evaluate(() => window.__film.step(1 / 30)); if (i > 120 && (await page.evaluate(() => window.__film.state())).state === 'built') break; }
const r = await page.evaluate(() => { const t = window.__film.tags().tags; const n = {}; for (const it of window.__app.bricks.items) n[it.tag || '-'] = (n[it.tag || '-'] || 0) + 1; const g = window.__app.bricks.group; return { t, n, total: window.__app.bricks.items.length, gpos: g.position.toArray(), gscale: g.scale.toArray(), stats: document.getElementById('place-stats').textContent }; });
for (const [k, v] of Object.entries(r.t)) console.log(k.padEnd(14), (r.n[k] || 0).toString().padStart(5), v.map((x) => x.toFixed(1)).join(' '));
console.log(r.total, r.stats, r.gpos, r.gscale);
await browser.close();
