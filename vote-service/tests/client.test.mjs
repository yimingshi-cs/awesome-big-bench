// UI event/transport contracts without writing a ballot to the live service.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const language=readFileSync(new URL('../../web/language.js',import.meta.url),'utf8');
const strings=JSON.parse(readFileSync(new URL('../../web/locale/ui.zh.json',import.meta.url),'utf8'));
const src=readFileSync(new URL('../../web/ballot.js',import.meta.url),'utf8');
class Element {
  constructor(text=''){this.textContent=text;this.children=[];this.attrs={};}
  append(...elements){this.children.push(...elements);}
  replaceChildren(...elements){this.children=elements;}
  setAttribute(k,v){this.attrs[k]=v;}
}
function setup(fetch,api='https://example.test',store=new Map(),lang='en'){
  const storage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)};
  const ctx={fetch,ui:strings,window:{localStorage:storage},location:new URL('https://yiming-shi.com/awesome-big-bench/'),
    URL,AbortController,crypto,setTimeout,clearTimeout,Intl,Date,document:{documentElement:{lang},createTextNode:s=>s},
    el:(tag,s)=>new Element(s??''),link:(s,u)=>Object.assign(new Element(s),{href:u}),button:(s,f)=>Object.assign(new Element(s),{onclick:f})};
  vm.runInNewContext(language+'\n'+src,ctx);const box=ctx.benchmarkBallot({display_name:'Demo 2',slug:'demo2'},{id:'qa',api});
  const [up,down,withdraw]=box.children[2].children;
  return {up,down,withdraw,status:box.children[3],store};
}
const wait=()=>new Promise(resolve=>setTimeout(resolve,10));
const response=(body,ok=true)=>({ok,json:async()=>body});
test('no endpoint never records a vote; pending status never makes a ballot write',async()=>{
  let calls=0;const f=async()=>{calls++;return response({open:false,phase:'pending',campaign:'qa',closesAt:null});};
  const empty=setup(f,'');assert.ok(empty.up.disabled);assert.equal(calls,0);assert.equal(empty.store.size,0);
  const pending=setup(f);await wait();assert.ok(pending.down.disabled);assert.equal(calls,1);assert.equal(pending.store.size,0);
  assert.match(pending.status.textContent,/hasn’t opened/);
});
test('a saved single choice can change, reload and withdraw; failed writes never claim success',async()=>{
  const requests=[];let saved=null;let fail=false;
  const f=async(url,opts)=>{
    assert.equal(opts.credentials,'omit');assert.equal(opts.referrerPolicy,'no-referrer');
    if(url.includes('/status'))return response({open:true,phase:'open',closesAt:'2099-01-01T00:00:00Z',campaign:'qa'});
    const b=JSON.parse(opts.body);requests.push(b);assert.ok(!url.includes(b.key));
    if(fail)return response({error:'storage_unavailable'},false);
    if(b.action==='set')saved=b.choice;
    return response({choice:saved,open:true});
  };
  const ui=setup(f);await wait();assert.equal(ui.store.size,0);
  assert.ok(!ui.up.disabled);await ui.up.onclick();assert.equal(ui.up.attrs['aria-pressed'],'true');assert.equal(saved,'up');
  await ui.down.onclick();assert.equal(ui.down.attrs['aria-pressed'],'true');assert.equal(saved,'down');
  const restored=setup(f,'https://example.test',ui.store,'zh-Hans');await wait();
  assert.equal(restored.down.textContent,'👎 拉');assert.equal(restored.down.attrs['aria-pressed'],'true');assert.ok(!restored.withdraw.hidden);
  await restored.withdraw.onclick();assert.equal(saved,null);assert.ok(restored.withdraw.hidden);
  assert.equal(new Set(requests.map(x=>x.key)).size,1);
  fail=true;await restored.up.onclick();assert.equal(restored.up.attrs['aria-pressed'],'false');assert.ok(restored.up.disabled);
  assert.match(restored.status.children[0],/还没收到投票确认/);assert.equal(saved,null);
});
