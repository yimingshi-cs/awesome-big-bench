// Each edition has an independent random edit capability. A visitor can skip without creating one.
function benchmarkBallot(entry,config){
  const section=el('section',null,'bench-ballot');
  section.setAttribute('aria-label',T('Community vote for {name}',{name:entry.display_name}));
  const title=el('h3',T('Worth using for this task?'));
  const rules=el('p',T('Anonymous. Vote only on editions you know. Please don’t vote on an edition you helped make or maintain.'),'ballot-rule');
  const buttons=el('div',null,'ballot-options'),up=el('button',T('👍 Recommend')),down=el('button',T('👎 Wouldn’t recommend')),remove=el('button',T('Remove vote'),'ballot-remove');
  for(const [b,name] of [[up,T('Recommend this edition')],[down,T('Would not recommend this edition')],[remove,T('Withdraw my vote')]]){
    b.type='button';b.setAttribute('aria-label',name);b.disabled=true;buttons.append(b);
  }
  up.setAttribute('aria-pressed','false');down.setAttribute('aria-pressed','false');remove.hidden=true;
  const status=el('p',T('Voting hasn’t opened yet.'),'ballot-status');
  status.setAttribute('role','status');section.append(title,rules,buttons,status);
  if(!config?.api)return section;
  const keyName='abb:ballot:'+config.id+':'+entry.slug;
  const hereIsLocal=['localhost','127.0.0.1','[::1]'].includes(location.hostname);
  if(location.origin!=='https://yiming-shi.com'&&!hereIsLocal){
    status.replaceChildren(link(T('Vote on the public site'),publicBase+recordUrl(entry)));
    return section;
  }
  let endpoint;
  try{
    const u=new URL(config.api);
    if(u.username||u.password||u.search||u.hash||u.pathname!=='/'||(u.protocol!=='https:'&&!(hereIsLocal&&['127.0.0.1','localhost'].includes(u.hostname)&&u.protocol==='http:')))throw Error();
    endpoint=u.origin;
  }catch{status.textContent=T('Voting is unavailable.');return section;}
  let key=null,choice=null,open=false,busy=false,deadline=0;
  function paint(){
    if(open&&Date.now()>=deadline)open=false;
    up.disabled=down.disabled=remove.disabled=!open||busy;
    up.setAttribute('aria-pressed',String(choice==='up'));down.setAttribute('aria-pressed',String(choice==='down'));
    remove.hidden=choice===null||!open;
  }
  function readKey(){
    const value=window.localStorage.getItem(keyName);
    if(value!==null&&!/^[a-f0-9]{64}$/.test(value))throw Error('Invalid saved edit key');
    return value;
  }
  function ensureKey(){
    if(key)return key;
    const existing=readKey();if(existing)return key=existing;
    const raw=new Uint8Array(32);crypto.getRandomValues(raw);
    const candidate=Array.from(raw,b=>b.toString(16).padStart(2,'0')).join('');
    window.localStorage.setItem(keyName,candidate);key=readKey();
    if(!key)throw Error('Not stored');
    return key;
  }
  async function request(path,body){
    const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),8000);
    try{
      const opts={signal:abort.signal,cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer',redirect:'error'};
      if(body){opts.method='POST';opts.headers={'Content-Type':'application/json'};opts.body=JSON.stringify(body);}
      const res=await fetch(endpoint+path,opts),out=await res.json();
      if(!res.ok)throw Error(out.error||'unavailable');
      return out;
    }finally{clearTimeout(timer);}
  }
  function send(action,value){
    const data={edition:entry.slug,campaign:config.id,key,action};
    if(action==='set')data.choice=value;
    return request('/v1/ballot',data);
  }
  function retry(message){
    open=false;busy=false;paint();status.replaceChildren(document.createTextNode(message+' '));
    const b=button(T('Retry'),init,'ballot-retry');status.append(b);
  }
  async function init(){
    open=false;busy=true;paint();status.textContent=T('Checking voting status…');
    try{
      const info=await request('/v1/status?entry='+encodeURIComponent(entry.slug));
      if(info.campaign!==config.id)throw Error('wrong_campaign');
      if(!info.open){
        status.textContent=info.phase==='pending'?T('Voting hasn’t opened yet.'):T('Voting is closed.');
        busy=false;paint();return;
      }
      deadline=Date.parse(info.closesAt);if(!Number.isFinite(deadline))throw Error('unavailable');
      try{key=readKey();}catch{
        status.textContent=T('Allow browser storage to keep your anonymous edit key.');busy=false;paint();return;
      }
      let confirmed=true;
      if(key){const own=await send('read');choice=own.choice;confirmed=own.open;}
      open=confirmed&&Date.now()<deadline;busy=false;paint();
      status.textContent=open?T('Anonymous · closes {date} SGT.',{date:new Intl.DateTimeFormat(zh?'zh-CN':'en-GB',{
        timeZone:'Asia/Singapore',day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hourCycle:'h23'
      }).format(new Date(deadline))}):T('Voting is closed.');
    }catch(e){
      if(e.message==='unknown_edition'){busy=false;paint();status.textContent=T('This edition is not on the ballot yet.');}
      else retry(T('Could not reach the ballot service.'));
    }
  }
  async function cast(value){
    if(!open||busy||value===choice)return;
    if(Date.now()>=deadline){open=false;paint();status.textContent=T('Voting is closed.');return;}
    try{ensureKey();}catch{open=false;paint();status.textContent=T('Allow browser storage before voting.');return;}
    busy=true;paint();status.textContent=T('Saving…');
    try{
      const saved=await send('set',value);
      if(saved.choice!==value)throw Error('unconfirmed');
      choice=saved.choice;busy=false;paint();status.textContent=choice===null?T('Vote withdrawn.'):T('Vote saved. You can change or withdraw it here.');
    }catch(e){
      if(e.message==='voting_closed'){open=false;busy=false;paint();status.textContent=T('Voting has closed.');}
      // A timeout may happen after a D1 commit. Re-read this capability; don't claim success or send an opposite vote.
      else retry(T('Vote not confirmed. Check its saved state.'));
    }
  }
  up.onclick=()=>cast('up');down.onclick=()=>cast('down');remove.onclick=()=>cast(null);
  init();return section;
}
