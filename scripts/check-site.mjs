import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const base = 'http://127.0.0.1:4321';
const server = spawn(process.execPath, ['node_modules/astro/astro.js', 'preview', '--host', '127.0.0.1', '--port', '4321'], {stdio:'inherit'});
let browser;
try {
  for (let i=0;i<60;i++) {
    try { if ((await fetch(base)).ok) break; } catch {}
    if (i===59) throw new Error('Preview did not start');
    await new Promise(r=>setTimeout(r,500));
  }
  browser=await chromium.launch();
  await mkdir('screenshots',{recursive:true});
  for(const width of [390,1280]) {
    const page=await browser.newPage({viewport:{width,height:900}});
    for(const route of ['/','/about/','/projects/fsae/','/projects/vehicle-dynamics/','/projects/wydown/']) {
      const res=await page.goto(base+route);
      assert(res?.ok(), route+' not available');
      await page.evaluate(()=>document.fonts.ready);
      assert.equal(await page.locator('h1').count(),1,route+' heading');
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' horizontal overflow at '+width);
      assert(await page.locator('img').evaluateAll(images=>images.every(im=>im.complete&&im.naturalWidth>0)),route+' broken image');
      if(route==='/projects/vehicle-dynamics/') {
        assert(await page.locator('.katex-display').count()>=3,'display math missing');
        assert.equal(await page.locator('.katex-error').count(),0);
        assert(await page.locator('.article-contents a').evaluateAll(links=>links.every(a=>document.getElementById(decodeURIComponent(a.hash.slice(1))))),'broken contents link');
      }
      if(route==='/'||route==='/projects/vehicle-dynamics/') await page.screenshot({path:'screenshots/'+(route==='/'?'home':'vehicle-dynamics')+'-'+width+'.png',fullPage:true});
    }
    await page.close();
  }
  console.log('Desktop and mobile route, layout, image and math checks passed');
} finally {
  await browser?.close();
  server.kill();
}
