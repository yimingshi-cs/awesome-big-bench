// Optional integration test: NODE_PATH may point to an existing Playwright install.
// Record requests: the website must not fetch the offline file or full catalog on first visit.
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const docs=path.resolve(__dirname,'../docs'),requests=[];
const counts=JSON.parse(fs.readFileSync(path.join(docs,'index.html'),'utf8').match(/id="payload">(.*?)<\/script>/s)[1]);
const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost'),f=path.join(docs,url.pathname,url.pathname.endsWith('/')?'index.html':'');
  if(!f.startsWith(docs+path.sep)||!fs.existsSync(f)){res.writeHead(404).end();return;}
  requests.push(url.pathname);
  const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.json':'application/json','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png'};
  res.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'}).end(fs.readFileSync(f));
});
(async()=>{
  await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
  const base='http://127.0.0.1:'+server.address().port+'/';
  const browser=await chromium.launch(process.env.CHROME_CHANNEL?{channel:process.env.CHROME_CHANNEL}:{});
  try{
    for(const [locale,title,contribute] of [['zh/','评分','参与共建'],['','Scoring','Contribute']]){
      const ctx=await browser.newContext({permissions:['clipboard-read','clipboard-write'],viewport:{width:390,height:844}});
      await ctx.route('**/v1/status?*',r=>r.fulfill({json:{open:false,phase:'pending',campaign:'xhs-benchmarks-01',closesAt:null}}));
      const page=await ctx.newPage(),errors=[];page.setDefaultTimeout(8000);page.on('pageerror',e=>errors.push(e.message));
      const before=requests.length;
      await page.goto(base+locale,{waitUntil:'commit'});
      await page.locator('button.map-cell').first().waitFor();
      assert.equal(await page.locator('.map-cell').count(),counts.names.length);
      assert.ok(!requests.slice(before).some(x=>x.includes('/parts/')||x.includes('/offline/')));
      const link=page.locator('.offline-download');assert.ok(await link.getAttribute('download')!==null);
      await page.getByRole('link',{name:contribute,exact:true}).click();
      await page.locator('#copy-agent-prompt').click();
      assert.match(await page.evaluate(()=>navigator.clipboard.readText()),/CONTRIBUTING.md/);
      await page.locator('#contribute-dialog .close').click();
      await page.getByRole('link',{name:'HumanEval',exact:false}).first().click();
      await page.locator('.score-rule').waitFor();assert.match(await page.locator('.score-rule').innerText(),/pass@k/i);
      assert.equal(await page.locator('.score-note h3').innerText(),title);
      assert.ok(!requests.slice(before).some(x=>x.includes('directory-index')||x.includes('reports-')));
      await page.locator('.copy-pr').click();assert.match(await page.evaluate(()=>navigator.clipboard.readText()),/humaneval/);
      await page.locator('.report-sources>summary').click();await page.locator('.reported-versions a').first().waitFor({state:'attached'});
      assert.ok(requests.slice(before).some(x=>x.includes('reports-')));
      await page.locator('#cell-dialog .close').click();
      await page.locator('nav [data-page="directory"]').click();
      await page.locator('.directory-row').first().waitFor();
      assert.equal(await page.locator('.directory-row').count(),counts.featured.length);
      assert.ok(!requests.slice(before).some(x=>x.includes('directory-index')));
      await page.locator('#scope-all').click();await page.waitForFunction(n=>document.querySelectorAll('.directory-row').length===n,counts.catalogSize);
      await page.locator('#scope-featured').click();assert.equal(await page.locator('.directory-row').count(),counts.featured.length);
      await page.locator('#query').fill('OSWorld');await page.locator('#scope-all[aria-pressed=true]').waitFor();
      await page.locator('.directory-name[data-slug="osworld"]').click();
      await page.locator('.score-rule').waitFor();
      assert.equal(await page.locator('#cell-title').innerText(),'OSWorld');
      assert.deepEqual(errors,[]);await ctx.close();
    }
    const p=await browser.newPage();await p.context().setOffline(true);await p.goto('file://'+path.join(docs,'offline/awesome-big-bench-zh.html')+'#browse?entry=osworld');
    await p.locator('.score-rule').waitFor();assert.match(await p.locator('.score-rule').innerText(),/状态/);
    await p.locator('.report-sources>summary').click();await p.locator('.reported-versions a').first().waitFor({state:'attached'});
    console.log('PASS: both locales can copy prompts and read scores/citations without downloading the archive; featured/all/search and standalone offline cards work.');
  }finally{await browser.close();server.closeAllConnections();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
