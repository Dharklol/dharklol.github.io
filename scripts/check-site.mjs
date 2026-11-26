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
    for(const route of ['/','/about/','/contact/','/projects/fsae/','/projects/vehicle-dynamics/','/projects/wydown/','/documents/steering-fdr/','/documents/wufr-26-steering-fdr/','/resume/']) {
      const res=await page.goto(base+route);
      assert(res?.ok(), route+' not available');
      await page.evaluate(()=>document.fonts.ready);
      assert.equal(await page.locator('h1').count(),1,route+' heading');
      assert((await page.title()).includes('Jesse Koeppel'),route+' page title branding');
      assert((await page.locator('.wordmark').innerText()).includes('JESSE KOEPPEL'),route+' header branding');
      assert((await page.locator('.site-footer').innerText()).includes('Jesse Koeppel'),route+' footer branding');
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' horizontal overflow at '+width);
      assert(await page.locator('img').evaluateAll(async images=>{await Promise.all(images.map(im=>{im.loading='eager';return im.decode()}));return images.every(im=>im.complete&&im.naturalWidth>0)}),route+' broken image');
      assert.equal(await page.locator('header nav a[href="https://www.linkedin.com/in/jesse-koeppel/"]').count(),1);
      assert.equal(await page.locator('header nav a[href="/contact/"]').count(),1);
      assert.equal(await page.locator('header nav a[href="/resume/"]').count(),1);
      const requiredPdf = {'/resume/':'jesse-koeppel-resume.pdf','/documents/steering-fdr/':'wufr-27-steering-fdr.pdf','/documents/wufr-26-steering-fdr/':'wufr-26-steering-fdr.pdf'}[route];
      if(requiredPdf) {
        const path = '/documents/'+requiredPdf;
        assert.equal(await page.locator('object[type="application/pdf"][data="'+path+'"]').count(),1,route+' PDF embed missing');
        assert.equal(await page.locator('main a[download][href="'+path+'"]').count(),1,route+' PDF download missing');
        const pdf = await page.request.get(base+path);
        assert(pdf.ok() && (pdf.headers()['content-type']||'').includes('pdf'),path+' unavailable');
        const bytes=await pdf.body();
        assert(bytes.subarray(0,5).toString()==='%PDF-',path+' invalid PDF header');
        assert(bytes.subarray(-2048).includes(Buffer.from('%%EOF')),path+' missing PDF end marker');
        await pdf.dispose();
      }
      if(route==='/contact/') {
        assert.equal(await page.locator('main a[href="mailto:jessemsteel@gmail.com"]').count(),1);
        assert.equal(await page.locator('main a[href="https://github.com/Dharklol"]').count(),1);
        assert.equal(await page.locator('main a[href="https://www.linkedin.com/in/jesse-koeppel/"]').count(),1);
      }
      if(route==='/documents/steering-fdr/') {
        assert.equal(await page.locator('.document-reader .prose section').count(),9);
        assert(await page.locator('.article-contents a').evaluateAll(links=>links.every(a=>document.getElementById(decodeURIComponent(a.hash.slice(1))))),'broken document section link');
      }
      if(route==='/'||route==='/projects/fsae/') {
        assert.equal(await page.locator('img.actual-render[src="/figures/fsae/binder/suspension-render-transparent.webp"]').count(),1,'CAD render missing');
      }
      if(route==='/projects/fsae/') {
        const photoFiles=['car-on-track','team-and-car','campus-outreach','competition-setup','steering-build','suspension-failure'];
        let present=0;
        for(const name of photoFiles){
          const paths=['/figures/fsae/photos/'+name+'.jpg','/figures/fsae/photos/portfolio-photos/'+name+'.jpg'];
          for(const path of paths){const asset=await page.request.get(base+path);if(asset.ok()&&(asset.headers()['content-type']||'').includes('image/')){present++;await asset.dispose();break;}await asset.dispose();}
        }
        if(present===6){
          assert.equal(await page.locator('portfolio-carousel .visual-slide').count(),5,'photo carousel incomplete');
          assert.equal(await page.locator('.prose .inline-photo').count(),3,'contextual photos missing');
        }
        assert.equal(await page.locator('.evidence-gallery').count(),0,'duplicate end gallery');
        for (const name of ['ackermann-optimization.jpg','arb-instron.jpg','understeer-curves.jpg','load-transfer-sensitivity.jpg','endurance-gg.jpg']) {
          const path='/figures/fsae/binder/'+name;
          assert.equal(await page.locator('.prose a[href="'+path+'"] img[src="'+path+'"]').count(),1,'missing full-size image link: '+name);
        }
        assert.equal(await page.locator('main a[href="/documents/steering-fdr/"]').count(),1);
        assert.equal(await page.locator('main a[href="/documents/wufr-26-steering-fdr/"]').count(),1);
        assert(await page.locator('.katex-display').count()>=4);
      }
      if(route==='/projects/wydown/') assert(await page.locator('.katex-display').count()>=2);
      if(route==='/projects/vehicle-dynamics/') {
        const carousel=page.locator('portfolio-carousel');
        await carousel.locator('[data-next]').click();
        assert.equal(await carousel.locator('[data-count]').innerText(),'2 / 3');
        await carousel.locator('[data-prev]').click();
        assert.equal(await carousel.locator('[data-count]').innerText(),'1 / 3');
        assert.equal(await page.locator('main a[href="/figures/vehicle-dynamics/comparisons.csv"]').count(),1);
        const csv=await page.request.get(base+'/figures/vehicle-dynamics/comparisons.csv');
        assert(csv.ok() && (await csv.text()).trim().split(/\r?\n/).length===52,'comparison CSV missing rows');
        assert(await page.locator('.katex-display').count()>=3,'display math missing');
        assert.equal(await page.locator('.katex-error').count(),0);
        assert(await page.locator('.article-contents a').evaluateAll(links=>links.every(a=>document.getElementById(decodeURIComponent(a.hash.slice(1))))),'broken contents link');
      }
      if(route==='/'||route==='/projects/fsae/'||route==='/projects/vehicle-dynamics/'||route==='/contact/') await page.screenshot({path:'screenshots/'+(route==='/'?'home':route==='/contact/'?'contact':route==='/projects/fsae/'?'fsae':'vehicle-dynamics')+'-'+width+'.png',fullPage:true,animations:'disabled'});
    }
    await page.close();
  }
  const reduced=await browser.newPage({viewport:{width:390,height:900},reducedMotion:'reduce'});
  await reduced.goto(base);
  assert.equal(await reduced.locator('.hero h1').evaluate(el=>getComputedStyle(el).animationName),'none');
  assert.equal(await reduced.locator('html').evaluate(el=>getComputedStyle(el).scrollBehavior),'auto');
  await reduced.goto(base+'/projects/vehicle-dynamics/');
  assert.equal(await reduced.locator('portfolio-carousel [data-pause]').innerText(),'Play');
  await reduced.close();
  console.log('Desktop and mobile route, layout, image and math checks passed');
} finally {
  await browser?.close();
  server.kill();
}
