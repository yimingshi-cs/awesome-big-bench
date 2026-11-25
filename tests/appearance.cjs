// Optional browser acceptance: NODE_PATH=<existing Playwright> CHROME_CHANNEL=chrome node tests/appearance.cjs
const {chromium}=require('playwright'), assert=require('node:assert/strict'), fs=require('node:fs'), path=require('node:path');
const root=path.resolve(__dirname,'../docs'), origin='https://yiming-shi.com', base=origin+'/awesome-big-bench/';
const capture=process.env.APPEARANCE_SCREENSHOTS;
if(capture)fs.mkdirSync(capture,{recursive:true});
async function context(b,opts={}){
  const ctx=await b.newContext({timezoneId:'Asia/Singapore',colorScheme:'light',viewport:{width:1280,height:850},...opts});
  await ctx.route('**/*',async r=>{
    const u=new URL(r.request().url());
    if(!u.href.startsWith(base)||r.request().method()!=='GET')return r.abort();
    if(u.pathname.endsWith('/v1/status'))return r.fulfill({json:{campaign:'xhs-benchmarks-01',phase:'pending',open:false,closesAt:null}});
    let f=path.resolve(root,decodeURIComponent(u.pathname.slice('/awesome-big-bench/'.length))||'.');
    if(u.pathname.endsWith('/'))f=path.join(f,'index.html');
    if(!f.startsWith(root+path.sep)||!fs.existsSync(f))return r.fulfill({status:404,body:'Not found'});
    return r.fulfill({path:f});
  });return ctx;
}
async function theme(p,v){try{await p.waitForFunction(t=>document.documentElement.dataset.theme===t,v,{timeout:4500});}catch(e){throw Error('Expected '+v+' at '+await p.evaluate(()=>[new Date().toString(),document.documentElement.dataset.theme,document.documentElement.dataset.appearance,location.href].join(' · ')));}}
async function checkContrast(p,region){
 const problems=await p.locator(region).evaluate((area)=>{
   const rgba=s=>s.match(/[\d.]+/g)?.map(Number)||[0,0,0,0];
   const blend=(top,under)=>top.slice(0,3).map((c,i)=>c*(top[3]??1)+under[i]*(1-(top[3]??1)));
   const lum=rgb=>rgb.slice(0,3).map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
   const bg=e=>{const chain=[];for(;e;e=e.parentElement)chain.unshift(e);return chain.reduce((c,a)=>blend(rgba(getComputedStyle(a).backgroundColor),c),[255,255,255]);};
   const issues=[];for(const e of [area,...area.querySelectorAll('*')]){
     const txt=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join('');
     if(!txt||e.matches('option,svg *,script,style')||e.closest('.sr-only')||!e.checkVisibility({checkOpacity:true,checkVisibilityCSS:true}))continue;
     const st=getComputedStyle(e),back=bg(e),fore=blend(rgba(st.color),back),a=lum(fore),b=lum(back),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
     const min=(parseFloat(st.fontSize)>=24||(parseFloat(st.fontSize)>=18.66&&+st.fontWeight>=700))?3:4.5;
     if(ratio+.015<min)issues.push([txt.slice(0,42),e.className,st.color,back,ratio.toFixed(2)]);
   }return issues.slice(0,12);
 });assert.deepEqual(problems,[],region+' text contrast');
}
(async()=>{const b=await chromium.launch(process.env.CHROME_CHANNEL?{channel:process.env.CHROME_CHANNEL}:{});
try{
  const c=await context(b,{colorScheme:'dark'}),p=await c.newPage();
  await p.clock.install({time:new Date('2026-11-26T12:59:50Z')}); // Singapore, 20:59:50
  await p.goto(base+'zh/',{waitUntil:'load'});await theme(p,'light');
  await p.clock.fastForward(10001);await theme(p,'dark');
  await p.clock.fastForward(10*3600*1000);await theme(p,'light');
  await p.selectOption('#appearance-mode','dark');await theme(p,'dark');await p.reload();await theme(p,'dark');
  await p.locator('.top .language-switch').click();await theme(p,'dark');assert.equal(await p.locator('#appearance-mode').inputValue(),'dark');
  const other=await c.newPage();await other.goto(base+'zh/');await theme(other,'dark');
  await other.selectOption('#appearance-mode','light');await theme(p,'light');await theme(other,'light');
  await p.clock.fastForward(14*3600*1000);await theme(other,'light');await theme(p,'light');
  await other.selectOption('#appearance-mode','auto');await theme(other,'dark');await theme(p,'dark');
  await c.close();
  for(const lang of ['zh/','']){
    const ctx=await context(b,{timezoneId:'America/Los_Angeles',viewport:{width:lang?390:1280,height:840}});const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.clock.install({time:new Date('2026-11-26T08:03:00Z')}); // 00:03 LA, 16:03 Singapore
    // The static table must be dark before the reader bundle arrives.
    let release;const gate=new Promise(r=>release=r);
    await page.route('**/assets/reader.js*',async r=>{await gate;await r.fallback();});
    await page.goto(base+lang,{waitUntil:'commit'});await page.locator('a.map-cell').first().waitFor();
    await theme(page,'dark');assert.equal(await page.locator('html').evaluate(e=>getComputedStyle(e).colorScheme),'dark');release();
    await page.locator('button.map-cell').first().waitFor();
    const nameColors=await page.evaluate(()=>['no','yes:not(.reported)','reported'].map(s=>getComputedStyle(document.querySelector('.map-cell.'+s)).backgroundColor));
    assert.equal(new Set(nameColors).size,3);await checkContrast(page,'header');await checkContrast(page,'#names');
    const save=async name=>{if(capture)await page.screenshot({path:path.join(capture,(lang?'zh':'en')+'-'+name+'.png')})};
    await save('map-dark');
    await page.locator('nav [data-page=directory]').click();await page.locator('.directory-row').first().waitFor();await checkContrast(page,'#directory');await save('directory-dark');
    await page.locator('button[data-slug=humaneval]').click();await page.locator('.score-rule').waitFor();await page.locator('.card-sources>summary').click();await checkContrast(page,'#cell-dialog');await save('card-dark');await page.keyboard.press('Escape');
    await page.locator('#contribute-entry').click();await page.locator('#prompt-preview-details summary').click();await checkContrast(page,'#contribute-dialog');
    const promptColors=await page.locator('#agent-prompt').evaluate(e=>[getComputedStyle(e).backgroundColor,getComputedStyle(e).color]);assert.notEqual(promptColors[0],promptColors[1]);await page.keyboard.press('Escape');
    await page.locator('nav [data-page=trends]').click();await page.locator('#plot polyline').waitFor();await page.selectOption('#trend-domain','Coding');await page.selectOption('#trend-other','Reasoning');
    const lines=()=>page.locator('#plot polyline').evaluateAll(els=>els.map(e=>getComputedStyle(e).stroke));
    const dark=await lines();assert.equal(new Set(dark).size,2);await checkContrast(page,'#trends');await save('trends-dark');
    assert.ok(await page.locator('#plot svg').evaluate(svg=>{
      const rgb=s=>s.match(/[\d.]+/g).slice(0,3).map(Number);const L=s=>rgb(s).map(c=>{const v=c/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((x,y,i)=>x+y*[.2126,.7152,.0722][i],0);
      const bg=L(getComputedStyle(document.body).backgroundColor),ratio=c=>{const a=L(c);return (Math.max(a,bg)+.05)/(Math.min(a,bg)+.05)};
      return [...svg.querySelectorAll('polyline')].every(e=>ratio(getComputedStyle(e).stroke)>=3)&&[...svg.querySelectorAll('text')].every(e=>ratio(getComputedStyle(e).fill)>=4.5);
    }),'chart lines and axis labels');
    await page.selectOption('#appearance-mode','light');await theme(page,'light');assert.notDeepEqual(await lines(),dark);await checkContrast(page,'#trends');
    await page.selectOption('#appearance-mode','auto');await theme(page,'dark');
    for(const width of [320,360,390,651,700,768,1024,1280]){await page.setViewportSize({width,height:840});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),'page overflow '+width);}
    assert.deepEqual(errors,[]);await ctx.close();
  }
  const of=await b.newContext({offline:true,timezoneId:'Asia/Singapore'}),f=await of.newPage();
  await f.addInitScript(()=>{for(const m of ['getItem','setItem','removeItem'])Storage.prototype[m]=function(){throw new Error('storage unavailable')};});
  await f.clock.install({time:new Date('2026-11-26T14:00:00Z')});await f.goto('file://'+path.join(root,'offline/awesome-big-bench-zh.html'));await theme(f,'dark');
  await f.selectOption('#appearance-mode','light');await theme(f,'light');await f.selectOption('#appearance-mode','auto');await theme(f,'dark');await of.close();
  console.log('PASS: local 21:00/07:00 boundaries while open, overrides/storage/tabs, pre-runtime dark paint, map/card/directory/prompt/chart contrast, mobile layouts and downloaded guide.');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
