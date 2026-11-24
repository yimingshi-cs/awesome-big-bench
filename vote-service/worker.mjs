// The public allowlist is generated from the checked directory, not supplied by the browser.
import catalog from './catalog.json' with { type: 'json' };
const LIMIT = 1024;
const hasEntry = slug => typeof slug==='string' && Object.hasOwn(catalog,slug);
const validKey = value => typeof value==='string' && /^[a-f0-9]{64}$/.test(value);

async function smallJSON(request) {
  if (Number(request.headers.get('Content-Length')) > LIMIT) throw new RangeError();
  const reader=request.body?.getReader();
  if(!reader) throw new SyntaxError();
  const data=new Uint8Array(LIMIT);let size=0;
  for(;;){
    const {done,value}=await reader.read();if(done) break;
    if(size+value.byteLength>LIMIT){await reader.cancel();throw new RangeError();}
    data.set(value,size);size+=value.byteLength;
  }
  return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(data.subarray(0,size)));
}

export async function fetchBallot(request, env, now=Date.now()) {
  const origin=request.headers.get('Origin');
  const allowed=(env.ALLOWED_ORIGINS||'').split(',').map(x=>x.trim()).filter(Boolean);
  const okOrigin=origin!==null && allowed.includes(origin);
  const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Vary':'Origin',
    'X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'};
  if(okOrigin) headers['Access-Control-Allow-Origin']=origin;
  const json=(status,body)=>new Response(JSON.stringify(body),{status,headers});
  const url=new URL(request.url);
  // The existing workers.dev API remains compatible. Only the exact project
  // prefix on the official HTTPS host maps to those same two handlers.
  const prefix='/awesome-big-bench/api';
  const path=url.origin==='https://yiming-shi.com'&&url.pathname.startsWith(prefix+'/')
    ?url.pathname.slice(prefix.length):url.pathname;
  if(!['/v1/status','/v1/ballot'].includes(path)) return json(404,{error:'not_found'});
  // Only public health metadata needs to work in a direct address-bar visit.
  if((origin!==null&&!okOrigin) || (path==='/v1/ballot'&&!okOrigin)) return json(403,{error:'origin_not_allowed'});
  if(request.method==='OPTIONS'){
    if(!okOrigin) return json(403,{error:'origin_not_allowed'});
    return new Response(null,{status:204,headers:{...headers,'Access-Control-Allow-Methods':'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'600'}});
  }
  const campaign=env.CAMPAIGN_ID, waiting=env.VOTING_OPEN==='false'&&env.CLOSES_AT==='', closeTime=Date.parse(env.CLOSES_AT);
  if(typeof campaign!=='string'||!/^[-a-z0-9]{1,64}$/.test(campaign)||(!waiting&&(!Number.isFinite(closeTime)||!/Z$/.test(env.CLOSES_AT)))||!['true','false'].includes(env.VOTING_OPEN)||!env.VOTES) return json(503,{error:'not_configured'});
  const open=env.VOTING_OPEN==='true'&&now<closeTime, phase=waiting?'pending':open?'open':'closed';
  if(path==='/v1/status'){
    if(request.method!=='GET') return json(405,{error:'method_not_allowed'});
    if([...url.searchParams.keys()].some(k=>k!=='entry')) return json(400,{error:'invalid_query'});
    if(url.searchParams.has('entry')&&!hasEntry(url.searchParams.get('entry'))) return json(404,{error:'unknown_edition'});
    try{
      await env.VOTES.prepare("SELECT choice FROM ballots WHERE 0").first();
      return json(200,{campaign,open,phase,closesAt:waiting?null:new Date(closeTime).toISOString(),editions:Object.keys(catalog).length});
    }catch{return json(503,{error:'storage_unavailable'});}
  }
  if(url.search) return json(400,{error:'invalid_query'});
  if(request.method!=='POST') return json(405,{error:'method_not_allowed'});
  if((request.headers.get('Content-Type')||'').split(';')[0].trim().toLowerCase()!=='application/json') return json(415,{error:'json_required'});
  let body;
  try{body=await smallJSON(request);}catch(e){return json(e instanceof RangeError?413:400,{error:'invalid_body'});}
  if(!body||typeof body!=='object'||Array.isArray(body)||Object.keys(body).some(k=>!['campaign','edition','key','action','choice'].includes(k)))return json(400,{error:'invalid_ballot'});
  if(body.campaign!==campaign) return json(409,{error:'wrong_campaign'});
  if(!hasEntry(body.edition)) return json(404,{error:'unknown_edition'});
  if(!validKey(body.key)||!['read','set'].includes(body.action)||
     (body.action==='read'?Object.hasOwn(body,'choice'):!['up','down',null].includes(body.choice)))
    return json(400,{error:'invalid_ballot'});
  if(body.action==='set'&&!open) return json(409,{error:'voting_closed'});
  // Domain separation prevents cross-edition linkage even if a client reuses a key.
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify([campaign,body.edition,body.key])));
  const handle=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
  const args=[campaign,body.edition,handle];
  try{
    if(body.action==='read'){
      const r=await env.VOTES.prepare('SELECT choice FROM ballots WHERE campaign=? AND edition=? AND handle=?').bind(...args).first();
      return json(200,{choice:r?.choice??null,open});
    }
    if(body.choice===null){
      await env.VOTES.prepare('DELETE FROM ballots WHERE campaign=? AND edition=? AND handle=?').bind(...args).run();
    }else{
      await env.VOTES.prepare('INSERT INTO ballots (campaign,edition,handle,choice) VALUES (?,?,?,?) ON CONFLICT(campaign,edition,handle) DO UPDATE SET choice=excluded.choice').bind(...args,body.choice).run();
    }
    return json(200,{choice:body.choice,open:true});
  }catch{return json(503,{error:'storage_unavailable'});}
}

export default { fetch(request,env){return fetchBallot(request,env);} };
