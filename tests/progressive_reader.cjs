// Optional integration test: NODE_PATH may point to an existing Playwright install.
// Keep the entire HTML tail in the server. No result can come from the offline copy.
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const docs=path.resolve(__dirname,'../docs'), tails=new Set(),requests=[];
const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost'),f=path.join(docs,url.pathname,url.pathname.endsWith('/')?'index.html':'');
  if(!f.startsWith(docs+path.sep)||!fs.existsSync(f)){res.writeHead(404).end();return;}
  const data=fs.readFileSync(f,'utf8');
  if(f.endsWith('.json')){requests.push(url.pathname);res.writeHead(200,{'Content-Type':'application/json'}).end(data);return;}
  const at=data.indexOf('<script type="application/json" id="part-');
  res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.write(data.slice(0,at));tails.add(res);
  res.once('close',()=>tails.delete(res));
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
      assert.equal(await page.locator('.map-cell').count(),319);
      assert.equal(requests.length,before);
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
      await page.locator('#query').fill('OSWorld');
      await page.locator('.directory-name[data-slug="osworld"]').click();
      await page.locator('.score-rule').waitFor();
      assert.equal(await page.locator('#cell-title').innerText(),'OSWorld');
      assert.deepEqual(errors,[]);await ctx.close();
    }
    const p=await browser.newPage();await p.goto('file://'+path.join(docs,'zh/index.html')+'#browse?entry=osworld');
    await p.locator('.score-rule').waitFor();assert.match(await p.locator('.score-rule').innerText(),/状态/);
    await p.locator('.report-sources>summary').click();await p.locator('.reported-versions a').first().waitFor({state:'attached'});
    console.log('PASS: both locales can copy prompts and read scores/citations with the archive held back; standalone offline card works.');
  }finally{for(const r of tails)r.end();await browser.close();server.closeAllConnections();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
