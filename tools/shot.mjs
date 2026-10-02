// node tools/shot.mjs out.png "scene=kyoto&az=..&el=..&dist=..&dismantle=3&strength=3" [w h]
import { chromium } from '../tools/node_modules/playwright/index.mjs';
const [,, out, query = '', w = '1400', h = '900'] = process.argv;
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
page.on('console', (m) => { const t = m.text(); if (!t.includes('GL Driver') && m.type() !== 'debug') console.log('[page]', t.slice(0, 600)); });
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
await page.goto(`http://127.0.0.1:${process.env.PORT ?? 8125}/index.html?shot=1&${query}`, { waitUntil: 'load' });
await page.waitForFunction(() => window.__ready === true, null, { timeout: 180000 });
await page.waitForTimeout(400); await page.screenshot({ path: out }); await browser.close(); console.log('saved', out);
