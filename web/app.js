'use strict';
const {catalog, names, months, domains, repo, nameGroups, fieldLandmarks, mapEvidence, mapCatalog} = JSON.parse(document.querySelector('#payload').textContent);
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
const issue = (name,template) => repo+'/issues/new?template='+template+'.md&title='+encodeURIComponent(name);
const displayDomain = d => d;
const fmt = n => n.toLocaleString('en-US');
const setPressed = (node,on) => node.setAttribute('aria-pressed',String(on));

function renderCover(){
  function period(year){
    const selected=months.filter(m=>m.month.startsWith(year+'-')&&Number(m.month.slice(5))<=9);
    const hits=selected.reduce((a,m)=>a+m.hits,0),total=selected.reduce((a,m)=>a+m.total,0);
    return {year,hits,total,share:100*hits/total};
  }
  const a=period('2020'),b=period('2026');
  for(const part of [a,b]){
    const t=el('span',null,'slope-stop');t.append(el('strong',part.share.toFixed(2)+'%'),el('small',part.year));$('#slope').append(t);
    if(part===a){
      const svg=svgNode('svg',{viewBox:'0 0 71 25','aria-hidden':'true'});
      svg.append(svgNode('path',{d:'M2 21 L69 4',fill:'none',stroke:'currentColor','stroke-width':2,'stroke-linecap':'round'}));
      $('#slope').append(svg);
    }
  }
  for(const part of [a,b]){
    const cell=el('div');cell.append(el('span','Jan–Sep '+part.year),el('b',part.share.toFixed(2)+'%'),el('small',fmt(part.hits)+' of '+fmt(part.total)+' CS papers'));$('#comparison').append(cell);
  }
  const delta=el('div',null,'factor');delta.append(el('span','2026 vs. 2020'),el('b',(b.share/a.share).toFixed(2)+'×'),el('small','Jan–Sep share ratio'));$('#comparison').append(delta);
}

const labNames=rows=>['OpenAI','Anthropic','Google'].filter(l=>rows.some(r=>r.vendor===l)).join(', ');
function reportDetails(box,key){
  if(!key)return;
  const rows=mapEvidence.reports[key],details=el('details',null,'report-sources');
  details.append(el('summary','Release reports · '+labNames(rows)));
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
    if(long)group.append(el('summary',lab+' · '+list.size+(list.size===1?' release':' releases')));
    for(const [model,variants] of list){
      const row=el('div',null,'reported-versions');row.append(el('strong',model));
      const labels=[...variants.values()].map(r=>r.benchmark);
      for(const r of variants.values()){
        const a=link(r.benchmark,r.release_url);a.title=r.location;row.append(a);
        if(r.qualifier && labels.filter(s=>s===r.benchmark).length>1)row.append(el('small',r.qualifier));
        if(/Mercor|third.party|third party|cited measurement|partner evaluation/i.test(r.location))row.append(el('small',r.location));
      }
      group.append(row);
    }
    details.append(group);
  }
  box.append(details);
}
