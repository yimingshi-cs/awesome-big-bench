import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {randomBytes} from 'node:crypto';
import {createServer} from 'node:http';
import {fetchBallot} from '../worker.mjs';
const schema=readFileSync(new URL('../schema.sql',import.meta.url),'utf8');
const now=Date.parse('2026-11-23T12:00:00Z'), origin='https://yiming-shi.com', campaign='test-campaign';
function dbFixture(){
  const sql=new DatabaseSync(':memory:');sql.exec(schema);
  const prep=(s,args=[])=>({bind:(...a)=>prep(s,a),first:async()=>sql.prepare(s).get(...args)??null,run:async()=>sql.prepare(s).run(...args)});
  return {sql,env:{VOTES:{prepare:prep},ALLOWED_ORIGINS:origin,CAMPAIGN_ID:campaign,CLOSES_AT:'2026-12-05T00:00:00Z',VOTING_OPEN:'true'}};
}
const entry='gamecraft-bench';
const key=()=>randomBytes(32).toString('hex');
const body=(key,choice='up',more={})=>({campaign,edition:entry,key,action:'set',choice,...more});
const ask=(env,path,options={},clock=now)=>fetchBallot(new Request('http://ballot.test'+path,options),env,clock);
const send=(env,b,headers={Origin:origin,'Content-Type':'application/json'})=>ask(env,'/v1/ballot',{method:'POST',headers,body:JSON.stringify(b)});
test('true pending, time cutoff, unknown entries and storage health',async()=>{
  const {env,sql}=dbFixture();
  const pending={...env,VOTING_OPEN:'false',CLOSES_AT:''};
  const initial=await (await ask(pending,'/v1/status?entry='+entry)).json();
  assert.equal(initial.phase,'pending');assert.equal(initial.closesAt,null);assert.ok(initial.editions>0);
  assert.equal((await send(pending,body(key()))).status,409);
  assert.equal((await ask({...env,CLOSES_AT:''},'/v1/status')).status,503);
  const closed=await (await ask(env,'/v1/status',{},Date.parse(env.CLOSES_AT))).json();assert.equal(closed.phase,'closed');
  assert.equal((await send({...env,CLOSES_AT:new Date(now).toISOString()},body(key()))).status,409);
  assert.equal((await ask(env,'/v1/status?entry=__proto__')).status,404);
  sql.exec('DROP TABLE ballots');
  assert.equal((await ask(env,'/v1/status')).status,503);
  assert.equal((await send(env,body(key()))).status,503);
});
test('CORS and request constraints; no results endpoint',async()=>{
  const {env}=dbFixture();
  const pre=await ask(env,'/v1/ballot',{method:'OPTIONS',headers:{Origin:origin}});
  assert.equal(pre.status,204);assert.equal(pre.headers.get('Access-Control-Allow-Origin'),origin);
  assert.equal((await send(env,body(key()),{'Content-Type':'application/json'})).status,403);
  assert.equal((await send(env,body(key()),{Origin:'https://other.example','Content-Type':'application/json'})).status,403);
  for(const [extra,status] of [[{key:'bad'},400],[{edition:'not-in-the-directory'},404],[{choice:'other'},400],[{campaign:'unrelated'},409],[{email:'not-accepted'},400]])assert.equal((await send(env,body(key(),'up',extra))).status,status);
  assert.equal((await send(env,body(key()),{Origin:origin,'Content-Type':'text/plain'})).status,415);
  assert.equal((await send(env,{data:'x'.repeat(2000)})).status,413);
  assert.equal((await ask(env,'/v1/ballot?key=x',{method:'POST',headers:{Origin:origin}})).status,400);
  assert.equal((await ask(env,'/v1/results')).status,404);
  const publicInfo=await(await ask(env,'/v1/status')).json();
  assert.deepEqual(Object.keys(publicInfo).sort(),['campaign','open','phase','closesAt','editions'].sort());
});
test('HTTP flow, concurrency, idempotence, no cross-edition/poll linkage or public totals',async t=>{
  const {sql,env}=dbFixture();
  const server=createServer(async(req,res)=>{
    const chunks=[];for await(const chunk of req)chunks.push(chunk);
    const request=new Request('http://127.0.0.1'+req.url,{method:req.method,headers:req.headers,...(req.method==='POST'?{body:Buffer.concat(chunks)}:{})});
    const resp=await fetchBallot(request,env,now);
    res.writeHead(resp.status,Object.fromEntries(resp.headers));res.end(await resp.text());
  }).listen(0,'127.0.0.1');
  await new Promise(resolve=>server.once('listening',resolve));t.after(()=>{server.closeAllConnections();server.close();});
  const base='http://127.0.0.1:'+server.address().port;
  const post=async payload=>{
    const resp=await fetch(base+'/v1/ballot',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(payload)});
    assert.equal(resp.status,200);return resp.json();
  };
  const token=key(),other=key(),read=key=>({campaign,edition:entry,key,action:'read'});
  assert.equal((await post(read(token))).choice,null);
  await Promise.all(Array.from({length:20},()=>post(body(token))));
  await post(body(token,'down'));await post(body(other,'up'));
  assert.deepEqual(await post(read(token)),{choice:'down',open:true});
  assert.deepEqual(await post(read(key())),{choice:null,open:true});
  await post(body(token,'up',{edition:'humaneval'}));
  const stored=sql.prepare('SELECT campaign,edition,handle,choice FROM ballots ORDER BY edition').all();
  assert.equal(stored.length,3);assert.equal(new Set(stored.map(r=>r.handle)).size,3);
  assert.ok(stored.every(r=>r.handle!==token&&r.handle!==other));
  await post(body(token,null));await post(body(token,null));
  assert.equal((await post(read(token))).choice,null);
  assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM ballots').get().n,2);
  assert.deepEqual(sql.prepare('PRAGMA table_info(ballots)').all().map(r=>r.name),['campaign','edition','handle','choice']);
});

test('the scoped HTTPS route is an alias to the same ballot and nothing else',async()=>{
  const {env}=dbFixture(), root='https://yiming-shi.com/awesome-big-bench/api';
  const get=(u,e=env)=>fetchBallot(new Request(u),e,now);
  const status=await (await get(root+'/v1/status?entry=humaneval')).json();
  assert.equal(status.campaign,campaign);assert.equal(status.open,true);
  const waiting={...env,VOTING_OPEN:'false',CLOSES_AT:''};
  const result=await (await get(root+'/v1/status',waiting)).json();
  assert.equal(result.phase,'pending');assert.equal(result.closesAt,null);
  const signed=(u,action,e=env)=>fetchBallot(new Request(u,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(action)}),e,now);
  const k=key();assert.equal((await signed(root+'/v1/ballot',body(k),waiting)).status,409);
  assert.equal((await signed(root+'/v1/ballot',body(k))).status,200);
  assert.deepEqual(await (await signed('https://service.example/v1/ballot',{campaign,edition:entry,key:k,action:'read'})).json(),{open:true,choice:'up'});
  for(const invalid of [root+'/v1/results',root+'-other/v1/status','https://other.example/awesome-big-bench/api/v1/status','https://yiming-shi.com/another/api/v1/status']){
    assert.equal((await get(invalid)).status,404);
  }
});
