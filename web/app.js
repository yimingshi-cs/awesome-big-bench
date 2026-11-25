'use strict';
const {catalog, readingNotes, names, featured, catalogSize, seriesSizes, domains, repo, nameGroups, fieldLandmarks, mapEvidence, mapCatalog, marks, agentPrompt, ballotConfig, ui, parts} = JSON.parse(document.querySelector('#payload').textContent);
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
