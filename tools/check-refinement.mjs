import assert from 'node:assert/strict';
import { chromium } from './node_modules/playwright/index.mjs';
const browser=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
try {
  const page=await browser.newPage({viewport:{width:1000,height:800}});const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8125/?shot=1&scene=kyoto-refined&az=1.5&el=.3&dist=16&tx=-6&ty=6.8&tz=-5');
  await page.waitForFunction(()=>window.__ready,{timeout:180000});
  await page.screenshot({path:'docs/kyoto-refinement/tea-grip-reverse.png'});
  await page.click('#btn-apart');
  await page.waitForFunction(()=>window.__app.lastPoses!==null,null,{timeout:60000});
  assert.equal(await page.evaluate(()=>window.__app.lastPoses.length),2644*7);
  await page.click('#btn-rebuild');
  // Advance the existing animation timeline to its end; inspect exact restored transforms.
  await page.evaluate(()=>window.__app.animT=10);
  await page.waitForFunction(()=>window.__app.state==='built',null,{timeout:60000});
  const error=await page.evaluate(()=>{
    const a=window.__app;let max=0;
    for(const it of a.items){const p=it.home.p.clone(),q=it.home.q.clone();a.bricks.getPose(it,p,q);max=Math.max(max,p.distanceTo(it.home.p));}
    return max;
  });assert.ok(error<.00001,`rebuild error ${error}`);
  await page.click('[data-scene="kyoto"]');
  assert.equal(await page.evaluate(()=>window.__app.items.length),2875);
  await page.click('[data-scene="kyoto-refined"]');
  assert.equal(await page.evaluate(()=>window.__app.items.length),2644);
  assert.deepEqual(errors,[]);
  console.log('PASS: second grip angle, physics frame, rebuild endpoints, original/new scene switching, no page errors');
} finally {await browser.close();}
