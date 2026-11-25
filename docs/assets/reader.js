const zh=document.documentElement.lang==='zh-Hans';
function T(key,values={}){
  const template=zh?ui[key]:key;
  if(template===undefined)throw new Error('Missing UI translation: '+key);
  return template.replace(/\{(\w+)\}/g,(_,k)=>String(values[k]));
}

'use strict';
const {catalog, readingNotes, names, featured, catalogSize, seriesSizes, domains, repo, nameGroups, fieldLandmarks, mapEvidence, mapCatalog, mapBallots, marks, agentPrompt, ballotConfig, ui, parts} = JSON.parse(document.querySelector('#payload').textContent);
let months=[];
const $ = selector => document.querySelector(selector);
function el(tag, text, cls) {
  const node = document.createElement(tag);
  if (text != null) node.textContent = text;
  if (cls) node.className = cls;
  return node;
}
function link(text, url, cls) { const a = el('a', text, cls); a.href = url; return a; }
function button(text, act, cls) { const b = el('button', text, cls); b.type='button'; b.onclick=act; return b; }
function svgNode(tag, attrs, text) {
  const n=document.createElementNS('http://www.w3.org/2000/svg',tag);
  for(const [k,v] of Object.entries(attrs)) n.setAttribute(k,v);
  if(text!=null)n.textContent=text;
  return n;
}
const gh = path => repo+'/blob/main/'+path;
const displayDomain = d => T(d);
const publicBase='https://yiming-shi.com/awesome-big-bench/'+(zh?'zh/':'');
const fmt = n => n.toLocaleString('en-US');
const setPressed = (node,on) => node.setAttribute('aria-pressed',String(on));

function renderTrendComparison(){
  function period(year){
    const selected=months.filter(m=>m.month.startsWith(year+'-')&&Number(m.month.slice(5))<=9);
    const hits=selected.reduce((a,m)=>a+m.hits,0),total=selected.reduce((a,m)=>a+m.total,0);
    return {year,hits,total,share:100*hits/total};
  }
  const a=period('2020'),b=period('2026');
  for(const part of [a,b]){
    const cell=el('div');cell.append(el('span',T('Jan–Sep {year}',part)),el('b',part.share.toFixed(2)+'%'),el('small',T('{hits} of {total} CS papers',{hits:fmt(part.hits),total:fmt(part.total)})));$('#comparison').append(cell);
  }
  const delta=el('div',null,'factor');delta.append(el('span',T('2026 vs. 2020')),el('b',(b.share/a.share).toFixed(2)+'×'),el('small',T('Jan–Sep share ratio')));$('#comparison').append(delta);
}

const reportedBy=key=>mapEvidence.vendors[key].join(', ');
function reportDetails(box,key,label='Release reports'){
  if(!key)return;
  const details=el('details',null,'report-sources');
  details.append(el('summary',T(label)+' · '+reportedBy(key)));
  const body=el('div');details.append(body);box.append(details);
  let busy=false,filled=false;
  async function read(){
    if(busy||filled||!details.open)return;
    busy=true;body.textContent=T('Loading sources…');
    try{
      const part=await readPart(mapEvidence.parts[key]);body.replaceChildren();
      appendReportRows(body,part[key]);filled=true;
    }catch{
      body.replaceChildren(button(T('Retry'),read,'subtle'),document.createTextNode(' · '),link(T('Model release sources'),repo+'/tree/main/verification/flagships'));
    }finally{busy=false;}
  }
  details.addEventListener('toggle',read);
}
function appendReportRows(details,rows){
  for(const lab of ['OpenAI','Anthropic','Google']){
    const own=rows.filter(r=>r.vendor===lab).sort((a,b)=>b.date.localeCompare(a.date));
    if(!own.length)continue;
    const list=new Map();
    for(const r of own){
      if(!list.has(r.release))list.set(r.release,new Map());
      list.get(r.release).set(r.benchmark+'|'+r.release_url+'|'+r.location+'|'+(r.qualifier||''),r);
    }
    const long=rows.length>8;
    const group=long?el('details',null,'report-lab'):el('div');
    if(long)group.append(el('summary',lab+' · '+T(list.size===1?'{n} release':'{n} releases',{n:list.size})));
    for(const [model,variants] of list){
      const row=el('div',null,'reported-versions');row.append(el('strong',model));
      for(const r of variants.values()){
        const a=link(r.benchmark,r.release_url);if(r.location)a.title=r.location;row.append(a);
        if(r.qualifier)row.append(el('small',r.qualifier));
        if(r.show_location||/Mercor|third.party|third party|cited measurement|partner evaluation/i.test(r.location))row.append(el('small',r.location));
      }
      group.append(row);
    }
    details.append(group);
  }
}

// Optional evidence, trends and the complete directory are cached per revision.
// Opening a card from a visible row does not use this loader.
const arrivedParts=new Set(), readerCache=new Map(), readerRequests=new Map();
function readerArrived(key){
  arrivedParts.add(key);
  readerRequests.get(key)?.inline();
}
function readPart(key){
  if(readerCache.has(key))return Promise.resolve(readerCache.get(key));
  const rev=parts[key];
  if(!rev)return Promise.reject(Error('Unknown reader part'));
  if(readerRequests.has(key))return readerRequests.get(key).promise;
  let accept,reject;
  const promise=new Promise((ok,no)=>{accept=ok;reject=no;});
  function use(packet){
    if(packet.revision!==rev||!packet.records)throw Error('Reader edition mismatch');
    readerCache.set(key,packet.records);accept(packet.records);
  }
  function inline(){try{use(JSON.parse(document.getElementById('part-'+key).textContent));}catch(e){reject(e);}}
  readerRequests.set(key,{promise,inline});
  if(document.documentElement.dataset.edition==='offline'){
    if(arrivedParts.has(key))inline();
    else if(document.readyState!=='loading')reject(Error('Incomplete offline page'));
  }else{
    const url=key==='directory-index'?'parts/directory-index.'+rev+'.json':'parts/'+key+'.json?v='+rev;
    (async()=>{
      for(let attempt=0;attempt<2;attempt++){
        const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),attempt?20000:12000);
        try{
          const r=await fetch(url,{signal:controller.signal,credentials:'omit',cache:attempt?'reload':'default'});
          if(!r.ok){const e=Error('Part unavailable');e.permanent=r.status<500&&![408,429].includes(r.status);throw e;}
          use(await r.json());return;
        }catch(e){if(attempt||e.permanent)throw e;}
        finally{clearTimeout(timer);}
      }
    })().catch(reject);
  }
  // A truncated offline download should not leave a pending request forever.
  const limit=document.documentElement.dataset.edition==='offline'?setTimeout(()=>reject(Error('Missing offline part')),16000):null;
  function done(){if(limit!==null)clearTimeout(limit);readerRequests.delete(key);}
  promise.then(done,done);return promise;
}

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
    const projectAPI=u.origin==='https://yiming-shi.com'&&u.pathname==='/awesome-big-bench/api';
    if(u.username||u.password||u.search||u.hash||(!projectAPI&&u.pathname!=='/')||(u.protocol!=='https:'&&!(hereIsLocal&&['127.0.0.1','localhost'].includes(u.hostname)&&u.protocol==='http:')))throw Error();
    endpoint=projectAPI?u.origin+u.pathname:u.origin;
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
      const statusPath='/v1/status?entry='+encodeURIComponent(entry.slug);
      let info;
      try{info=await request(statusPath);}catch(e){
        // A fresh connection can reset intermittently. Retry only this public,
        // read-only status GET; never replay a ballot or suppress an actual API error.
        if(e.name!=='TypeError'&&e.name!=='AbortError')throw e;
        info=await request(statusPath);
      }
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

// One reading card for the directory, field references, and exact catalog matches on the map.
const recordsById=new Map(catalog.map(x=>[x.slug,x]));
const recordUrl=x=>'#browse?'+new URLSearchParams({domain:x.domain,q:x.name,entry:x.slug});
const namePair=n=>n.prefix+'|'+n.suffix;
const nameAnchor=s=>s==='²'?'squared':s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const nameEvidence=n=>gh('verification/matrix/'+nameAnchor(n.prefix)+'.md#'+nameAnchor(n.suffix));

const marksBySeries=new Map(catalog.filter(x=>marks[x.slug]).map(x=>[x.series,marks[x.slug]]));
function directoryMark(x){return marks[x.slug]||marksBySeries.get(x.series);}
function markImage(mark){
  const img=el('img');img.src=mark.uri;img.alt='';img.width=mark.width;img.height=mark.height;return img;
}
function dateLink(x){
  const d=x.display_date||x.date,upper=x.date_basis==='available_by'&&!x.display_date?.match(/^\d{4}-\d{2}$/);
  const human={paper:'First public paper',tag:'Version tag',available_by:'Documented publicly by',public_record:'Dated public record',released:'Public release',announcement:'Public announcement'};
  const a=link(upper?T('By {date}',{date:d}):d,x.date_source_url,'entry-date');a.title=T(human[x.date_basis]||'Dated evidence')+': '+d;return a;
}
function cardHead(group,title,lead){
  const h=el('div',null,'card-head'),name=el('h2',title);name.id='cell-title';
  h.append(group,name);if(lead)h.append(el('p',lead,'card-lead'));
  return h;
}
function meta(parts,mark){
  const b=el('div',null,'card-meta');
  if(mark)b.append(el('span',T(mark==='no'?'Looks open':'Taken'),'badge '+mark));
  for(const part of parts.filter(Boolean))b.append(el('span',part));
  return b;
}
function field(label,text,url){
  const g=el('div'),value=el('dd');value.append(url?link(text,url):text);g.append(el('dt',label),value);return g;
}
function cardFooter(main,edit){
  const f=el('div',null,'card-footer');main.className='action';f.append(main,edit);return f;
}
function compareLine(x,text){
  const line=el('p',null,'compare-line');
  line.append(el('span',T('Compare '),'compare-label'),link(x.name,recordUrl(x)));
  if(text)line.append(document.createTextNode(' — '+text));
  return line;
}
function sourceNotes(x,n,primary,guide,extra=null){
  const d=el('details',null,'card-sources');d.append(el('summary',T(extra?'Protocol & sources':'Sources')));
  const facts=el('p',null,'source-facts');facts.append(document.createTextNode(T('Date evidence: ')),dateLink(x));
  if(x.date_note)facts.append(document.createTextNode(' · '+x.date_note));
  if(x.first_author_affil)facts.append(document.createTextNode(' · '+x.first_author_affil));
  if(extra)d.append(extra);d.append(facts);
  if(x.source_title)d.append(link(x.source_title,x.primary_url,'original-title'));
  const mark=directoryMark(x);
  if(mark){
    const credit=el('p',null,'source-facts');credit.append(document.createTextNode(T(mark.kind)+': '),link(mark.credit,mark.credit_url),document.createTextNode(' · '),link(mark.license,mark.license_url),document.createTextNode(' · '+T(mark.changes)));d.append(credit);
  }
  if(n?.note)d.append(el('p',n.note,'source-facts'));
  const links=new Map();
  function add(label,url){if(!url||url===primary)return;if(!links.has(url))links.set(url,[]);links.get(url).push(label);}
  add(T('Scoring'),x.protocol_url);add(T('Date'),x.date_source_url);add(T('Affiliation'),x.affil_source_url);
  for(const ev of x.alternative_dates||[]){add(T(ev.date_basis==='tag'?'Tag': 'Dated record')+' · '+ev.date,ev.url);}
  add(T('Mark provenance'),x.logo_source_url);if(guide)add(T('Interpretation'),guide.url);
  if(n){add(T('Name source'),n.source_url);add(T('Name check · {date}',{date:n.checked_on}),nameEvidence(n));}
  {
    const items=el('div',null,'source-list');items.append(link(T('Link to this card'),recordUrl(x)));
    for(const [url,labels] of links)items.append(link(labels.join(' / '),url));
    d.append(items);
  }
  return d;
}
function catalogCard(x,n=null){
  const box=el('div',null,'detail-sheet');box.dataset.entry=x.slug;const guide=readingNotes[x.slug],pair=n?namePair(n):Object.keys(mapCatalog).find(k=>mapCatalog[k]===x.slug&&(nameGroups.relatedCatalog[k]||nameGroups.secondarySources?.[k]));
  const key=n?mapEvidence.cells[pair]:mapEvidence.catalog[x.slug];
  const title=x.display_name||x.name;
  const top=meta([displayDomain(x.domain),guide?.kind&&!['Task suite','任务集','任务套件'].includes(guide.kind)?guide.kind:''],n?(key?'reported':'yes'):null);
  if(n&&mapBallots[pair]?.length===1&&n.name.toLowerCase()!==title.toLowerCase())top.append(el('span',n.name));
  const header=cardHead(top,title,x.description&&x.description!==title?x.description:x.task);
  const mark=directoryMark(x);
  if(mark){const signature=el('div',null,'card-signature');signature.append(markImage(mark));header.prepend(signature);}
  const when=el('div',null,'card-date');when.append(dateLink(x));top.append(when);
  box.append(header);
  let protocol=null;
  if(x.origin!=='report'){
    protocol=el('dl',null,'task-pair');
    for(const fact of guide?.facts||[{label:T('Given'),value:x.input},{label:T('Result'),value:x.output}])protocol.append(field(fact.label,fact.value,fact.url));
    const score=el('section',null,'score-note');score.append(el('h3',T('Scoring')),el('p',x.assessment,'score-rule'));
    if(guide?.reading)score.append(el('p',guide.reading,'interpretation'));box.append(score);
  }
  if(guide?.compare)box.append(compareLine(recordsById.get(guide.compare),guide.contrast));
  const canonical=pair&&(!n||mapCatalog[pair]===x.slug);
  for(const id of (canonical&&nameGroups.relatedCatalog[pair])||[]){
    if(guide?.compare!==id)box.append(compareLine(recordsById.get(id),id==='gamecraft-bench'?T('Build a playable game instead of playing one.'):''));
  }
  if(canonical&&nameGroups.secondarySources?.[pair]){
    const more=el('details',null,'card-sources');more.append(el('summary',T('Other projects with this name')));
    for(const record of nameGroups.secondarySources[pair]){const item=el('p');item.append(link(zh?record.zh:record.en,record.url,'related-use'));more.append(item);}
    box.append(more);
  }
  box.append(benchmarkBallot(x,ballotConfig));
  reportDetails(box,mapEvidence.catalog[x.slug],'Release reports');
  box.append(sourceNotes(x,n,x.primary_url,guide,protocol));
  box.append(cardFooter(link(x.origin==='report'?T(x.protocol_url?'Protocol source':'Release evidence'):(guide?.action||T('Original source')),x.primary_url),contributionButton(x,n)));
  return box;
}
// Green is a naming verdict, not an edition ID. Never combine votes across
// related tasks, versions, former names or independent projects with the same name.
function openMapEvaluation(n,trigger,selected=null,focusChoice=false){
  const pair=namePair(n),ids=mapBallots[pair],multi=ids.length>1;
  const slug=multi?(ids.includes(selected)?selected:null):ids[0];
  const x=slug?recordsById.get(slug):null;
  const sheet=x?catalogCard(x,n):el('div',null,'detail-sheet name-sheet');
  if(!x){
    sheet.append(cardHead(meta([n.prefix+' × '+n.suffix],mapEvidence.cells[pair]?'reported':'yes'),n.name,n.note));
  }
  sheet.dataset.prefix=n.prefix;sheet.dataset.suffix=n.suffix;
  if(multi){
    const group=el('div',null,x?'edition-choice':'edition-choice bench-ballot'),label=el('label',T(x?'Choose what you’re rating':'Community vote'));
    const select=el('select');select.id='ballot-edition';label.htmlFor=select.id;select.setAttribute('aria-label',T('Choose what you’re rating'));
    select.add(new Option(T('Select a project or edition'),''));select.options[0].disabled=true;
    for(const id of ids){const r=recordsById.get(id),name=r.display_name||r.name;select.add(new Option(zh?(ui[name]||name):name,id));}
    select.value=slug||'';
    select.onchange=()=>{
      const params=new URLSearchParams(),field=$('#names-field').value;
      if(field)params.set('field',field);
      params.set('prefix',n.prefix);params.set('suffix',n.suffix);params.set('edition',select.value);
      history.replaceState(history.state,'','#names?'+params);
      openMapEvaluation(n,trigger,select.value,true);
    };
    group.append(label,select);sheet.querySelector('.card-head').after(group);
  }
  if(!x){
    for(const id of nameGroups.relatedCatalog[pair]||[])sheet.append(compareLine(recordsById.get(id),id==='gamecraft-bench'?T('Build a playable game instead of playing one.'):''));
    const opts=el('div',null,'ballot-options');
    for(const key of ['👍 Recommend','👎 Wouldn’t recommend']){
      const b=el('button',T(key));b.type='button';b.disabled=true;opts.append(b);
    }
    sheet.querySelector('.edition-choice').append(opts);
    const check=el('p',null,'checked-date');check.append(link(T('Name checked {date}',{date:n.checked_on}),nameEvidence(n)));
    sheet.append(check,cardFooter(link(T('Original source'),n.source_url),contributionButton(null,n)));

  }
  presentCard(sheet,trigger);
  if(focusChoice)sheet.querySelector('#ballot-edition')?.focus({preventScroll:true});
}
function nameCard(n,x){
  const box=el('div',null,'detail-sheet name-sheet');
  box.append(cardHead(meta([n.prefix+' × '+n.suffix],'no'),n.name,n.note||T('No same-name AI evaluation found in the recorded searches.')));
  box.append(el('p',T('Checked {date}',{date:n.checked_on}),'checked-date'));
  if(x)box.append(compareLine(x,T('See the documented edition and its scoring.')));
  if(n.source_url)box.append(link(T('Related use'),n.source_url,'related-use'));
  box.append(cardFooter(link(T('Search record'),nameEvidence(n)),contributionButton(null,n)));
  return box;
}
const cardDialog=$('#cell-dialog');
let cardTrigger=null;
function presentCard(content,trigger,rolling=false){
  cardDialog.toggleAttribute('data-picker',rolling);$('#pick-tools').hidden=!rolling;
  cardTrigger=trigger||null;$('#cell-info').replaceChildren(content);
  cardDialog.scrollTop=0;if(!cardDialog.open)cardDialog.showModal();
  if(rolling)$('#roll-again').focus({preventScroll:true});syncLanguageLinks();
}
function openEdition(x,trigger,n=null){
  // Records arrive with the map or directory row. The vote service and release
  // bibliography are independent: neither can delay reading the edition.
  const sheet=catalogCard(x,n);
  if(n){sheet.dataset.prefix=n.prefix;sheet.dataset.suffix=n.suffix;}
  presentCard(sheet,trigger);
}
function dismissCard(){if(cardDialog.open)cardDialog.close();}
cardDialog.querySelector('.close').onclick=dismissCard;
cardDialog.onclick=e=>{
  if(e.target!==cardDialog)return;
  const r=cardDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dismissCard();
};
cardDialog.addEventListener('close',()=>{
  // A link can replace an open card with another before the close event fires.
  if(cardDialog.open)return;
  if(cardTrigger?.isConnected)cardTrigger.focus({preventScroll:true});
  const [page,qs]=location.hash.slice(1).split('?'),params=new URLSearchParams(qs);
  if((page==='browse'&&params.has('entry'))||(page==='names'&&params.has('prefix'))){
    for(const k of ['entry','edition','prefix','suffix','contribute','roll'])params.delete(k);
    history.replaceState(null,'','#'+page+(params.size?'?'+params:''));
  }
  syncLanguageLinks();
});

// The same portable prompt is embedded in the README and the offline site.
const contributeDialog=$('#contribute-dialog'),promptPreview=$('#agent-prompt');
let contributionOpener=null,activeContributionContext='';
function prContext(x,n){
  if(n)return [
    T('Name-map correction: ')+n.name,
    T('Cell: {pair} · {status} · checked {date}',{pair:n.prefix+' × '+n.suffix,status:T(n.status==='used'?'Taken':'Looks open'),date:n.checked_on}),
    T('Search record: ')+nameEvidence(n),
    n.source_url&&T('Current evidence: ')+n.source_url,
    x&&T('Entry ID: ')+x.slug,
    x&&T('Current card: ')+publicBase+recordUrl(x)
  ].filter(Boolean).join('\n');
  if(x)return [T('Directory correction: ')+(x.display_name||x.name),T('Entry ID: ')+x.slug,
    T('Current card: ')+publicBase+recordUrl(x),T('Current source: ')+x.primary_url].join('\n');
  return '';
}
function contributionText(context){
  return context?agentPrompt+'\n\n'+context:agentPrompt;
}
function showContribution(context='',opener=null,mode='add'){
  const manual=mode==='manual';
  activeContributionContext=context;contributionOpener=opener||$('#contribute-entry');promptPreview.value=contributionText(context);
  $('#contribute-title').textContent=manual&&context?T('Correct this entry'):T('Add a benchmark or fix a record');
  $('#prompt-preview-details').open=manual;
  $('#copy-agent-prompt').textContent=T('Copy PR prompt');
  $('#contribute-status').textContent=manual?T('Select and copy the prompt below.'):'';
  if(!contributeDialog.open)contributeDialog.showModal();syncLanguageLinks();
  if(manual){promptPreview.focus();promptPreview.select();}
}
async function copyContribution(b,context){
  const value=contributionText(context),sheet=b.id==='copy-agent-prompt';
  try{
    if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(value);
  }catch{
    if(sheet){
      $('#prompt-preview-details').open=true;promptPreview.focus();promptPreview.select();
      $('#contribute-status').textContent=T('Select and copy the prompt below.');
    }else showContribution(context,b,'manual');
    return;
  }
  b.textContent=T('Copied');b.setAttribute('aria-label',T('PR prompt copied'));
  if(sheet)$('#contribute-status').textContent=T('Paste it into your agent with your public source link.');
  clearTimeout(b.restoreCopyLabel);b.restoreCopyLabel=setTimeout(()=>{
    b.textContent=T('Copy PR prompt');b.removeAttribute('aria-label');
  },3000);
}
function contributionButton(x,n){
  const b=button(T('Copy PR prompt'),()=>copyContribution(b,prContext(x,n)),'copy-pr');
  b.title=T('Copy this record and a pull-request prompt for your agent');b.setAttribute('aria-live','polite');
  return b;
}
$('#copy-agent-prompt').onclick=e=>copyContribution(e.currentTarget,activeContributionContext);
$('#contribute-entry').onclick=e=>{
  if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  e.preventDefault();showContribution('',e.currentTarget);
};
contributeDialog.querySelector('.close').onclick=()=>contributeDialog.close();
contributeDialog.onclick=e=>{
  if(e.target!==contributeDialog)return;
  const r=contributeDialog.getBoundingClientRect();
  if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)contributeDialog.close();
};
contributeDialog.addEventListener('close',()=>{
  if(location.hash==='#contribute')history.replaceState(null,'','#names');
  if(contributionOpener?.isConnected)contributionOpener.focus({preventScroll:true});
});

// Filters and global date order can be shared. The default never collapses editions.
function initDirectory(){
  let domain='All domains',scope='featured',routeID=0,pendingEntry=null;
  const chosen=new Set(featured);
  const security=new Set(['cwe-bench-v2','sec-bench-pro','webexploitbench-v12','cyberseceval']);
  const inDomain=(x,d)=>d==='All domains'||(d==='Cybersecurity'?security.has(x.slug):x.domain===d);
  const available=['All domains',...domains,'Cybersecurity'],domButtons=new Map();
  const searchText=s=>s.normalize('NFKC').toLowerCase().replace(/τ/g,'tau').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
  let text=null,loading=null;
  function loadIndex(){
    if(!loading)loading=readPart('directory-index').then(extra=>{
      for(const [slug,row] of Object.entries(extra)){
        const x=recordsById.get(slug);
        if(x)Object.assign(x,row);
        else{catalog.push(row);recordsById.set(slug,row);}
      }
      text=new Map(catalog.map(x=>[x.slug,searchText([x.name,x.display_name,x.series,x.slug,x.task,x.search_alias,displayDomain(x.domain),x.description,x.domain,x.modalities,x.input,x.output,x.assessment,readingNotes[x.slug]?.kind,...(x.aliases||[])].filter(Boolean).join(' '))]));
    }).catch(e=>{loading=null;throw e;});
    return loading;
  }

  function pool(){return scope==='featured'?catalog.filter(x=>chosen.has(x.slug)):catalog;}
  function syncScope(){for(const id of ['featured','all'])setPressed($('#scope-'+id),scope===id);}
  const order=$('#directory-order'),state=()=>{
    const p=new URLSearchParams(),q=$('#query').value.trim();
    if(domain!=='All domains')p.set('domain',domain);
    if(q)p.set('q',q);
    if(scope==='all'||q)p.set('scope',scope);
    if(order.value==='new')p.set('order','new');
    history.replaceState(null,'','#browse'+(p.size?'?'+p:''));
  };
  function choose(d,q=''){routeID++;domain=d;$('#query').value=q;state();draw();}
  for(const d of available){
    const b=button(displayDomain(d),()=>choose(d),'filter');b.append(el('span'));$('#domains').append(b);domButtons.set(d,b);
    $('#mobile-domain').add(new Option(displayDomain(d),d));
  }
  $('#mobile-domain').onchange=e=>choose(e.target.value);
  $('#query').oninput=()=>{routeID++;if($('#query').value.trim())scope='all';state();draw();};
  for(const id of ['all','featured'])$('#scope-'+id).onclick=()=>{routeID++;scope=id;state();draw();};order.onchange=()=>{state();draw();};
  const cmp=new Intl.Collator('en',{numeric:true,sensitivity:'base'});
  function recent(a,b){return b.date.localeCompare(a.date)||(b.edition_order||0)-(a.edition_order||0)||cmp.compare(b.display_name,a.display_name);}
  function grouped(a,b){return domains.indexOf(a.domain)-domains.indexOf(b.domain)||cmp.compare(a.series,b.series)||(b.edition_order&&a.edition_order?b.edition_order-a.edition_order:0)||recent(a,b);}
  function draw(){
    const query=searchText($('#query').value),words=query.split(/\s+/).filter(Boolean),host=$('#entries');host.replaceChildren();
    $('#mobile-domain').value=domain;for(const [d,b] of domButtons)setPressed(b,d===domain);
    syncScope();
    if(!text&&(scope==='all'||query)){
      const pending=el('p',T('Loading directory…'),'small');host.append(pending);
      loadIndex().then(()=>{if(pending.isConnected){draw();showRequested();}}).catch(()=>{
        if(pending.isConnected)pending.replaceChildren(document.createTextNode(T('Directory could not be loaded.')+' '),button(T('Retry'),draw,'subtle'));
      });
      return;
    }
    const candidates=pool(), counts=Object.fromEntries(available.map(d=>[d,candidates.filter(x=>inDomain(x,d)).length]));
    for(const [d,b] of domButtons){
      b.lastChild.textContent=counts[d];
      const opt=[...$('#mobile-domain').options].find(o=>o.value===d);opt.textContent=displayDomain(d)+' ('+counts[d]+')';
    }
    const seriesNames=new Set(candidates.map(x=>searchText(x.series)));
    const found=candidates.filter(x=>inDomain(x,domain)&&(seriesNames.has(query)?searchText(x.series)===query:words.every(w=>text.get(x.slug).includes(w)))).sort(order.value==='new'?recent:grouped);
    $('#count').textContent=T(found.length===1?'{n} entry':'{n} entries',{n:found.length});
    if(!found.length){
      const actions=el('div',null,'links empty-actions');
      const add=button(T('Add it with your agent'),()=>showContribution(query?T('Directory search with no matching results: ')+$('#query').value.trim():'',add,'add'),'action');
      actions.append(add,button(T('Clear filters'),()=>choose('All domains'),'subtle'));
      host.append(el('p',T('No matching benchmarks.'),'small'),actions);return;
    }
    const t=el('table',null,'directory-table');t.setAttribute('aria-label',T('Benchmark directory'));const head=t.createTHead().insertRow();
    for(const label of ['Benchmark','Task','Input','Release date']){
      const th=el('th',T(label));th.scope='col';if(label==='Release date')th.title=T('The link identifies the announcement, paper, release tag or dated evidence of availability.');head.append(th);
    }
    const body=t.createTBody();let last='';
    for(const x of found){
      if(order.value==='group'&&domain==='All domains'&&x.domain!==last){
        const band=el('th',displayDomain(x.domain),'directory-section');band.colSpan=4;body.insertRow().append(band);last=x.domain;
      }
      const row=body.insertRow();row.className='directory-row';
      const cell=row.insertCell(),b=button(null,()=>openEdition(x,b),'directory-name');b.dataset.slug=x.slug;
      const reported=mapEvidence.catalog[x.slug],mark=directoryMark(x);
      const slot=el('span',null,'mark-slot');slot.setAttribute('aria-hidden','true');if(mark?.placement==='row')slot.append(markImage(mark));
      const label=el('span',x.display_name,'directory-label');b.append(slot,label);b.setAttribute('aria-haspopup','dialog');
      if(reported){b.classList.add('is-reported');b.setAttribute('aria-label',T('{n}: reported by {labs}',{n:x.display_name,labs:reportedBy(reported)}));}
      cell.append(b);
      const task=row.insertCell();task.className='directory-task';task.textContent=x.task||'—';
      const mod=row.insertCell();mod.className='directory-modality';mod.textContent=x.modalities;
      const day=row.insertCell();day.className='directory-day';day.append(dateLink(x));
    }
    host.append(t);
  }
  function showRequested(){
    if(!pendingEntry||pendingEntry.id!==routeID||$('#directory').hidden)return;
    const x=recordsById.get(pendingEntry.slug);
    if(!x&&!text)return; // The index request (or its Retry) owns the continuation.
    pendingEntry=null;
    if(x){
      const opener=[...document.querySelectorAll('.directory-name')].find(b=>b.dataset.slug===x.slug);
      openEdition(x,opener||$('#query'));
    }else{
      $('#entries').prepend(el('p',T('No edition with this ID was found.'),'small'));
    }
  }
  return params=>{
    const id=++routeID,entry=params.get('entry');
    pendingEntry=entry?{id,slug:entry}:null;
    scope=params.get('scope')==='featured'?'featured':(params.get('scope')==='all'||params.get('q')||entry&&!chosen.has(entry))?'all':'featured';
    // A specifically linked historical entry must still resolve when a shared
    // link also retains a Featured filter.
    if(entry&&!recordsById.has(entry))scope='all';
    domain=available.includes(params.get('domain'))?params.get('domain'):'All domains';$('#query').value=params.get('q')||'';
    order.value=params.get('order')==='new'?'new':'group';draw();showRequested();
  };
}

// Complete matrix: absence of a data row is a build error, not a grey verdict.
function initNames(){
  const fields=Object.entries(nameGroups.fields), families=Object.entries(nameGroups.endings);
  const endings=families.flatMap(([,items])=>items), map=new Map(names.map(n=>[n.prefix+'|'+n.suffix,n]));
  const chooser=$('#names-field'), table=$('#name-map');
  let cells=[], bag=[], lastRoll=null;
  const picker=$('#pick-name'),again=$('#roll-again');
  chooser.disabled=false;for(const [f] of fields)chooser.add(new Option(displayDomain(f),f));
  function open(n,b,rolling=false,edition=null){
    const x=recordsById.get(mapCatalog[namePair(n)]);
    if(n.status==='used'){openMapEvaluation(n,b,edition);return;}
    const sheet=nameCard(n,x);sheet.dataset.prefix=n.prefix;sheet.dataset.suffix=n.suffix;
    if(rolling){
      lastRoll=namePair(n);
      const params=new URLSearchParams();
      if(chooser.value)params.set('field',chooser.value);
      params.set('prefix',n.prefix);params.set('suffix',n.suffix);params.set('roll','1');
      history.replaceState(history.state,'','#names?'+params);
    }
    presentCard(sheet,b,rolling);
    if(rolling)$('#pick-announcement').textContent=n.name;
  }
  function landmark(x){
    const key=mapEvidence.landmarks[x.slug],a=link(x.name,recordUrl(x),key?'reported':'');
    a.setAttribute('aria-haspopup','dialog');
    if(key)a.setAttribute('aria-label',T('{n}: reported by {labs}',{n:x.name,labs:reportedBy(key)}));
    a.onclick=e=>{
      if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
      e.preventDefault();openEdition(x,a);
    };
    return a;
  }
  function tabStop(b){for(const x of cells)x.tabIndex=x===b?0:-1;}
  function draw(){
    const selected=fields.filter(([f])=>!chooser.value||chooser.value===f);
    cells=[];bag=[];lastRoll=null;table.replaceChildren();
    const cap=table.createCaption();cap.className='sr-only';cap.textContent=T('Benchmark names by prefix and ending. Grey: looks open. Mint: taken. Dark green: reported by OpenAI, Anthropic or Google.');
    const cg=el('colgroup');cg.append(el('col',null,'prefix-col'));table.append(cg);
    for(const [,ss] of families){const cols=el('colgroup');cols.span=ss.length;table.append(cols);}
    const head=table.createTHead(),a=head.insertRow(),b=head.insertRow();
    for(const [title,cls] of [['Prefix','prefix-label']]){const th=el('th',T(title),cls);th.rowSpan=2;th.scope='col';a.append(th);}
    for(const [g,ss] of families){const h=el('th',T(g),'family-head');h.colSpan=ss.length;h.scope='colgroup';a.append(h);
      ss.forEach((s,i)=>{const e=el('th',s,i===0?'family-start':'');e.scope='col';b.append(e);});}
    for(const [f,ps] of selected){
      const body=table.createTBody();
      const band=body.insertRow(),group=el('th',null,'field-band');group.colSpan=endings.length+1;group.scope='rowgroup';
      const wrap=el('div',null,'field-landmarks');wrap.append(el('strong',displayDomain(f)));const peers=el('span');
      for(const id of fieldLandmarks[f]||[])peers.append(landmark(recordsById.get(id)));
      if(peers.childElementCount)wrap.append(peers);group.append(wrap);band.append(group);
      ps.forEach(p=>{
        const tr=body.insertRow();const prefix=el('th',p,'prefix-label');prefix.scope='row';tr.append(prefix);
        for(const [,ss] of families){ss.forEach((s,j)=>{
          const n=map.get(p+'|'+s),td=tr.insertCell();if(!j)td.className='family-start';const used=n.status==='used';
          const key=mapEvidence.cells[namePair(n)];
          const c=button(null,()=>open(n,c),'map-cell '+(used?'yes':'no')+(key?' reported':''));c.dataset.prefix=p;c.dataset.suffix=s;c.tabIndex=-1;
          c.setAttribute('aria-label',T(key?'{n}: taken; reported by {labs}':used?'{n}: taken':'{n}: looks open',{n:n.name,labs:key?reportedBy(key):''}));c.setAttribute('aria-haspopup','dialog');c.title=n.name;
          const text=el('span',n.name);
          // Soft-wrap joined names at the word boundary, never change their spelling.
          if(n.name.toLowerCase().startsWith(p.toLowerCase()) && n.name.length>p.length+1){
            text.replaceChildren(document.createTextNode(n.name.slice(0,p.length)),el('wbr'),document.createTextNode(n.name.slice(p.length)));
          }
          c.append(text);td.append(c);cells.push(c);
        });}
      });
    }
    if(cells.length)cells[0].tabIndex=0;
    const eligible=cells.filter(c=>c.classList.contains('no')).length;
    picker.disabled=!eligible;again.disabled=eligible<2;
  }
  table.addEventListener('focusin',e=>{if(e.target.matches('.map-cell'))tabStop(e.target);});
  table.addEventListener('keydown',e=>{
    if(!e.target.matches('.map-cell'))return;
    const i=cells.indexOf(e.target),w=endings.length,base=Math.floor(i/w)*w;
    const go={ArrowRight:Math.min(base+w-1,i+1),ArrowLeft:Math.max(base,i-1),ArrowDown:Math.min(cells.length-1,i+w),ArrowUp:Math.max(0,i-w),Home:base,End:base+w-1}[e.key];
    if(go===undefined)return;e.preventDefault();cells[go].focus();
  });
  chooser.onchange=draw;
  function refill(except=null){
    bag=cells.filter(b=>b.classList.contains('no')).map(b=>map.get(b.dataset.prefix+'|'+b.dataset.suffix)).filter(n=>namePair(n)!==except);
    for(let i=bag.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[bag[i],bag[j]]=[bag[j],bag[i]];}
    const end=bag.length-1;
    if(end>0&&namePair(bag[end])===lastRoll)[bag[0],bag[end]]=[bag[end],bag[0]];
  }
  function roll(){
    if(!bag.length)refill();
    if(bag.length)open(bag.pop(),picker,true);
  }
  picker.onclick=again.onclick=roll;
  draw();$('#map-meta').append(link(T('Name checks'),gh('verification/names.md')),document.createTextNode(' · '),link(T('Model release sources'),repo+'/tree/main/verification/flagships'));
  return params=>{
    const f=params.get('field')||'', prefix=params.get('prefix'), suffix=params.get('suffix');
    if([...chooser.options].some(o=>o.value===f)&&chooser.value!==f){chooser.value=f;draw();}
    if(prefix&&suffix){
      const b=cells.find(c=>c.dataset.prefix===prefix&&c.dataset.suffix===suffix);
      if(b){
        const n=map.get(prefix+'|'+suffix),rolling=params.get('roll')==='1'&&n.status==='no_match';
        if(rolling)refill(namePair(n));
        open(n,rolling?picker:b,rolling,params.get('edition'));
      }
    }else if(params.get('roll')==='1'&&!picker.disabled){
      roll();
    }
  };
}

function initTrends(timeline){
  const ALL='All fields', choices=[ALL,...Object.keys(months[0].counts)];
  const one=$('#trend-domain'), two=$('#trend-other'), win=$('#trend-window'), range=$('#month-pick');
  choices.forEach(s=>one.add(new Option(displayDomain(s),s)));two.add(new Option(T('None'),''));choices.forEach(s=>two.add(new Option(displayDomain(s),s)));
  let pos=months.findIndex(m=>m.month==='2026-09'), activeSVG=null, coordinate=null;
  const colors=['var(--chart-a, #147c6b)','var(--chart-b, #7662a4)'];
  function windowIndices(){
    const all=months.map((_,i)=>i);if(win.value==='recent')return all.filter(i=>months[i].complete).slice(-12);
    return win.value==='since'?all.filter(i=>months[i].month>='2024-01'):all;
  }
  function sel(){return [one.value,two.value].filter(Boolean);}
  function hits(m,d){return d===ALL?m.hits:m.counts[d];}
  function pct(m,d){return 100*hits(m,d)/m.total;}
  function syncChoices(){
    for(const o of two.options)o.disabled=o.value===one.value;
    if(two.value===one.value)two.value='';
  }
  function displayPoint(i){
    pos=i;range.value=String(pos);const m=months[pos],d=sel(),read=$('#trend-readout');read.replaceChildren();
    const when=el('div',null,'month-id');when.append(el('strong',m.month),el('small',!m.complete?T('Partial month'):''));read.append(when);
    d.forEach((s,j)=>{const col=el('div',null,'reading');const title=el('span',displayDomain(s));title.prepend(el('i',null,'line-key'+(j?' second':'')));
      col.append(title,el('b',pct(m,s).toFixed(2)+'%'),el('small',T('{hits} / {total} CS papers',{hits:fmt(hits(m,s)),total:fmt(m.total)})));read.append(col);});
    range.setAttribute('aria-valuetext',m.month+': '+d.map(s=>displayDomain(s)+' '+pct(m,s).toFixed(2)+'%').join('; '));
    if(!activeSVG)return;
    activeSVG.querySelector('.crosshair')?.remove();const g=svgNode('g',{class:'crosshair','pointer-events':'none'});
    const x=coordinate.x(i);g.append(svgNode('line',{x1:x,x2:x,y1:coordinate.top,y2:coordinate.bottom,stroke:'var(--chart-cursor, #627b6e)','stroke-dasharray':'3 4'}));
    d.forEach((s,j)=>g.append(svgNode('circle',{cx:x,cy:coordinate.y(pct(m,s)),r:4.5,fill:'var(--paper)',stroke:colors[j],'stroke-width':2})));activeSVG.append(g);
  }
  function draw(){
    syncChoices();const ids=windowIndices(),first=ids[0],last=ids.at(-1),d=sel();
    pos=Math.min(last,Math.max(pos,first));range.min=first;range.max=last;
    const mobile=matchMedia('(max-width:640px)').matches,W=mobile?430:1000,H=mobile?210:249,L=mobile?45:56,R=W-15,top=13,B=H-28;
    const high=Math.max(...ids.flatMap(i=>d.map(s=>pct(months[i],s))));
    const step=[.005,.01,.02,.05,.1,.2,.25,.5,1,2,5,10,25].find(v=>v*5>=high)||25;
    const Y=v=>B-(B-top)*v/(5*step),X=i=>L+(R-L)*(i-first)/Math.max(1,last-first);
    const svg=svgNode('svg',{viewBox:'0 0 '+W+' '+H,role:'img','aria-label':T('Share of all CS titles by month: {fields}',{fields:d.map(displayDomain).join(T(' versus '))})});
    const mark=(tag,attrs,text)=>svg.append(svgNode(tag,attrs,text));
    for(let j=0;j<=5;j++){const y=Y(j*step);mark('line',{x1:L,x2:R,y1:y,y2:y,stroke:'var(--chart-grid, #dee6e4)'});mark('text',{x:L-7,y:y+4,'text-anchor':'end',class:'axis'},Number((j*step).toFixed(3))+'%');}
    let tickIds=ids.filter(i=>months[i].month.endsWith('-01'));
    if(ids.length<=15)tickIds=ids.filter((i,j)=>j%3===0);
    if(mobile&&tickIds.length>6)tickIds=tickIds.filter((_,j)=>j%2===0);
    for(const i of tickIds){const m=months[i].month;mark('text',{x:X(i),y:H-7,'text-anchor':'middle',class:'axis'},ids.length<=15?m:m.slice(0,4));}
    d.forEach((s,j)=>{
      const full=ids.filter(i=>months[i].complete),pts=full.map(i=>[X(i),Y(pct(months[i],s))]);
      if(d.length===1&&pts.length)mark('polygon',{points:[...pts,[pts.at(-1)[0],B],[pts[0][0],B]].map(p=>p.join(',')).join(' '),fill:'var(--chart-area, #d7f2eb)'});
      mark('polyline',{points:pts.map(p=>p.join(',')).join(' '),fill:'none',stroke:colors[j],'stroke-width':2.5,'stroke-dasharray':j?'6 3':'none','stroke-linejoin':'round'});
      for(const i of ids.filter(i=>!months[i].complete)){const y=Y(pct(months[i],s));if(i>first)mark('line',{x1:X(i-1),x2:X(i),y1:Y(pct(months[i-1],s)),y2:y,stroke:colors[j],'stroke-dasharray':'2 4'});mark('circle',{cx:X(i),cy:y,r:4,fill:'var(--paper)',stroke:colors[j],'stroke-width':2});}
    });
    $('#plot').replaceChildren(svg);activeSVG=svg;coordinate={x:X,y:Y,top,bottom:B};displayPoint(pos);
    function pick(e){const matrix=svg.getScreenCTM();if(!matrix)return;const pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;const x=pt.matrixTransform(matrix.inverse()).x;
      const idx=Math.min(last,Math.max(first,Math.round(first+(x-L)*(last-first)/(R-L))));if(idx!==pos)displayPoint(idx);}
    svg.onpointermove=e=>{if(e.pointerType==='mouse')pick(e);};svg.onclick=pick;
  }
  range.oninput=()=>displayPoint(+range.value);one.onchange=draw;two.onchange=draw;win.onchange=draw;matchMedia('(max-width:640px)').addEventListener('change',draw);
  $('#trend-links').append(link(T('Download monthly counts'),gh('data/monthly.csv')),link(T('Charts'),repo+'/tree/main/figures'));
  const ypick=$('#year-select');[...new Set(timeline.map(x=>x.date.slice(0,4)))].sort().reverse().forEach(y=>ypick.add(new Option(y,y)));
  function milestones(){const host=$('#milestone-list');host.replaceChildren();for(const x of timeline.filter(x=>x.date.startsWith(ypick.value)).sort((a,b)=>a.date.localeCompare(b.date))){
    const row=el('div',null,'milestone-row'),left=el('div');left.append(el('span',x.date,'date'),link(x.name,x.primary_url),el('small',displayDomain(x.domain)));row.append(left);
    const i=months.findIndex(m=>m.month===x.date.slice(0,7));if(i>=0)row.append(button(T('Show month'),()=>{win.value='all';pos=i;draw();$('.plotbox').scrollIntoView({block:'center'});range.focus({preventScroll:true});},'subtle'));host.append(row);
  }}
  ypick.onchange=milestones;milestones();draw();
  return params=>{
    function set(select,value){if(value!==null&&[...select.options].some(o=>o.value===value))select.value=value;}
    set(win,params.get('period'));set(one,params.get('field'));set(two,params.get('compare'));
    const i=months.findIndex(m=>m.month===params.get('month'));if(i>=0)pos=i;
    set(ypick,params.get('year'));milestones();draw();
  };
}

const renderDirectory=initDirectory();
const restoreNames=initNames();
let restoreTrends=null,trendVersion=0;
async function enterTrends(params){
  const ticket=++trendVersion;
  if(!restoreTrends){
    const host=$('#plot');
    host.textContent=T('Loading chart…');
    try{
      const chart=await readPart('trends');
      if(ticket!==trendVersion||$('#trends').hidden)return;
      months=chart.months;renderTrendComparison();restoreTrends=initTrends(chart.timeline);
    }catch{
      if(ticket===trendVersion)host.replaceChildren(document.createTextNode(T('Chart unavailable.')+' '),button(T('Retry'),()=>enterTrends(params),'subtle'));return;
    }
  }
  restoreTrends(params);
}
function route(first=false){
  dismissCard();
  if(contributeDialog.open)contributeDialog.close();
  const [key,qs]=(location.hash.slice(1)||'names').split('?');
  // Older shared links now open the name map, not a retired section.
  if(key==='releases')history.replaceState(history.state,'','#names');
  const page=(key==='browse'||key==='directory')?'directory':key==='trends'?'trends':'names';
  document.querySelectorAll('.page').forEach(s=>s.hidden=s.id!==page);
  document.querySelectorAll('nav [data-page]').forEach(n=>{
    if(n.dataset.page===page)n.setAttribute('aria-current','page');else n.removeAttribute('aria-current');
  });
  const params=new URLSearchParams(qs);
  if(page==='directory')renderDirectory(params);
  if(page==='names')restoreNames(params);
  if(page==='trends')enterTrends(params);
  if(key==='contribute')showContribution();
  else if(params.get('contribute')==='1'){
    const sheet=$('#cell-info .detail-sheet'),n=sheet?.dataset.prefix?names.find(r=>r.prefix===sheet.dataset.prefix&&r.suffix===sheet.dataset.suffix):null;
    const x=recordsById.get(sheet?.dataset.entry);
    showContribution(prContext(x,n),sheet?.querySelector('.copy-pr')||null,sheet?'manual':'add');
  }
  syncLanguageLinks();
  if(key==='browse')$('#directory').scrollIntoView({behavior:'instant'});
  else if(!first)window.scrollTo({top:0,behavior:'instant'});
}
// A language change is a normal navigation, not a second catalog or ballot.
// Serialize the visible view, including dialogs opened without changing the URL.
function syncLanguageLinks(){
  const visible=Array.from(document.querySelectorAll('main>.page')).find(p=>!p.hidden)?.id||'names';
  const sheet=cardDialog.open?$('#cell-info .detail-sheet'):null;
  let page=visible==='directory'?'browse':visible;
  const p=new URLSearchParams();
  if(page==='names'&&sheet?.dataset.entry&&!sheet.dataset.prefix)page='browse';
  if(page==='names'){
    if($('#names-field').value)p.set('field',$('#names-field').value);
    if(sheet?.dataset.prefix){p.set('prefix',sheet.dataset.prefix);p.set('suffix',sheet.dataset.suffix);if(sheet.dataset.entry&&sheet.querySelector('#ballot-edition'))p.set('edition',sheet.dataset.entry);if(cardDialog.hasAttribute('data-picker'))p.set('roll','1');}
  }
  if(page==='browse'){
    const d=$('#mobile-domain').value,q=$('#query').value.trim();
    if(visible==='directory'){
      if(d&&d!=='All domains')p.set('domain',d);
      if(q)p.set('q',q);
      if($('#scope-all').getAttribute('aria-pressed')==='true')p.set('scope','all');
      else if(q)p.set('scope','featured');
      if($('#directory-order').value==='new')p.set('order','new');
    }
    if(sheet?.dataset.entry)p.set('entry',sheet.dataset.entry);
  }
  if(page==='trends'){
    for(const [k,id] of [['field','trend-domain'],['compare','trend-other'],['period','trend-window'],['year','year-select']]){
      const v=$('#'+id).value;if(v)p.set(k,v);
    }
    const m=months[Number($('#month-pick').value)];if(m)p.set('month',m.month);
  }
  if(contributeDialog.open){if(!sheet&&!activeContributionContext){page='contribute';}else{p.set('contribute','1');}}
  const h='#'+page+(p.size?'?'+p:'');
  for(const a of document.querySelectorAll('.language-switch')){
    const url=location.protocol==='file:'?new URL(zh?'awesome-big-bench-en.html':'awesome-big-bench-zh.html',location.href):new URL(a.href,location.href);
    url.hash=h;a.href=url.href;
  }
}
for(const event of ['focusin','pointerdown','contextmenu','click']){
  document.addEventListener(event,e=>{if(e.target.closest?.('.language-switch'))syncLanguageLinks();},true);
}
addEventListener('hashchange',()=>route());route(true);
