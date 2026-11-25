// End-to-end, isolated: a fresh browser and the real Worker backed by :memory:
// SQLite. Every request is routed locally. No production ballot is cast.
const {chromium}=require('playwright'), {DatabaseSync}=require('node:sqlite'), assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'), docs=path.join(root,'docs'), prefix='/awesome-big-bench/', origin='https://yiming-shi.com', base=origin+prefix;
(async()=>{
  const {fetchBallot}=await import('../vote-service/worker.mjs'),sql=new DatabaseSync(':memory:');
  sql.exec(fs.readFileSync(path.join(root,'vote-service/schema.sql'),'utf8'));
  const prep=(q,args=[])=>({bind:(...xs)=>prep(q,xs),first:async()=>sql.prepare(q).get(...args)??null,run:async()=>sql.prepare(q).run(...args)});
  const env={VOTES:{prepare:prep},ALLOWED_ORIGINS:origin,CAMPAIGN_ID:'xhs-benchmarks-01',CLOSES_AT:'2099-01-01T00:00:00Z',VOTING_OPEN:'true'};
  const browser=await chromium.launch(process.env.CHROME_CHANNEL?{channel:process.env.CHROME_CHANNEL}:{});
  try{for(const lang of ['zh/','']){
    const ctx=await browser.newContext({viewport:{width:lang?390:1280,height:844}});
    let optionalIndexFailures=0,indexRequests=0,cardFetches=0,denyData=false;
    const page=await ctx.newPage(),errors=[];page.setDefaultTimeout(10000);page.on('pageerror',e=>errors.push(e.message));
    await ctx.route('**/*',async route=>{
      const r=route.request(),u=new URL(r.url());
      if(u.origin!==origin||!u.pathname.startsWith(prefix))return route.abort();
      if(u.pathname.startsWith(prefix+'api/')){
        const opts={method:r.method(),headers:await r.allHeaders()};if(r.method()==='POST')opts.body=r.postData();
        const response=await fetchBallot(new Request(u,opts),env);
        return route.fulfill({status:response.status,headers:Object.fromEntries(response.headers),body:await response.text()});
      }
      if(/parts\/cards-/.test(u.pathname)){cardFetches++;return route.abort('failed');}
      if(u.pathname.includes('directory-index.')){indexRequests++;if(optionalIndexFailures>0){optionalIndexFailures--;return route.fulfill({status:503,body:'temporary'});}}
      if(denyData&&u.pathname.includes('/parts/'))return route.abort('failed');
      let file=path.join(docs,u.pathname.slice(prefix.length));if(u.pathname.endsWith('/'))file=path.join(file,'index.html');
      if(!file.startsWith(docs+path.sep)||!fs.existsSync(file))return route.fulfill({status:404,body:'missing'});
      return route.fulfill({path:file});
    });
    const open=(hash)=>page.goto(base+lang+hash,{waitUntil:'domcontentloaded'});
    await open('#names');await page.locator('button.map-cell').first().waitFor();
    const tally=await page.evaluate(()=>{
      const counts={direct:0,choose:0,empty:0},cells=document.querySelectorAll('button.map-cell');
      for(const c of cells){
        c.click();const s=document.querySelector('#cell-dialog[open] .detail-sheet');
        if(!s)throw Error('No sheet: '+c.textContent);
        if(c.classList.contains('no')){
          if(s.querySelector('.bench-ballot'))throw Error('Empty name has a ballot');counts.empty++;
        }else{
          if(!s.querySelector('.ballot-options button'))throw Error('No controls: '+c.textContent);
          const select=s.querySelector('#ballot-edition');
          if(select){
            if(select.value||select.options.length<3||s.dataset.entry)throw Error('Edition chosen without reader');
            if([...s.querySelectorAll('.ballot-options button')].some(b=>!b.disabled))throw Error('Family can vote before selecting');
            counts.choose++;
          }else{if(!s.dataset.entry)throw Error('Missing ID: '+c.textContent);counts.direct++;}
        }
      }return counts;
    });
    const map=await page.evaluate(()=>JSON.parse(document.querySelector('#payload').textContent).mapBallots);
    assert.equal(tally.direct,Object.values(map).filter(ids=>ids.length===1).length);
    assert.equal(tally.choose,Object.values(map).filter(ids=>ids.length>1).length);
    await open('#names?field=Coding&prefix=SWE&suffix=Bench');
    await page.selectOption('#ballot-edition','swe-bench-verified');
    const opts=page.locator('.ballot-options button');
    await opts.nth(0).click();await page.waitForFunction(()=>document.querySelector('.ballot-options button').getAttribute('aria-pressed')==='true');
    assert.equal(sql.prepare('SELECT edition FROM ballots').get().edition,'swe-bench-verified');
    await open('#browse?entry=swe-bench-verified');await opts.nth(1).click();
    await page.waitForFunction(()=>document.querySelectorAll('.ballot-options button')[1].getAttribute('aria-pressed')==='true');
    assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM ballots').get().n,1);
    await open('#names?field=Coding&prefix=SWE&suffix=Bench&edition=swe-bench-verified');
    await opts.nth(2).click();await page.waitForFunction(()=>document.querySelector('.ballot-remove').hidden);
    assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM ballots').get().n,0);
    // A reload with a genuinely empty cache. One failed automatic retry, then
    // successful manual Retry, must still open the requested non-featured edition.
    optionalIndexFailures=2;indexRequests=0;
    await page.goto(base+lang+'?fresh=1#browse?entry=ref-hotpotqa',{waitUntil:'domcontentloaded'});
    const retry=page.locator('#entries button').filter({hasText:lang?'重试':'Retry'});
    await retry.click();await page.waitForSelector('#cell-info [data-entry="ref-hotpotqa"]');
    assert.equal(indexRequests,3);await page.locator('#cell-dialog .close').click();
    denyData=true;await page.getByRole('button',{name:lang?'全部收录':'All entries',exact:true}).click();
    const checked=await page.evaluate(()=>{
      const all=[...document.querySelectorAll('.directory-row .directory-name')];
      for(const b of all){b.click();const card=document.querySelector('#cell-info .detail-sheet');if(card.dataset.entry!==b.dataset.slug||!card.querySelector('.bench-ballot')||!card.querySelector('.card-lead')||!card.querySelector('.card-footer a'))throw Error('Incomplete: '+b.dataset.slug);}
      return all.length;
    });
    assert.equal(checked,await page.evaluate(()=>JSON.parse(document.querySelector('#payload').textContent).catalogSize));
    assert.equal(cardFetches,0);assert.deepEqual(errors,[]);
    console.log(lang||'en',{...tally,checked,cardFetches},'Open: recommend → change in Directory → withdraw on map. No shared family vote.');
    await page.close();await ctx.close();
  }}finally{await browser.close();sql.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
