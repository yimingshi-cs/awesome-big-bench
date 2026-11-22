'use strict';
const {catalog, names, months, domains, repo, nameGroups, fieldLandmarks, flagshipRecords} = JSON.parse(document.querySelector('#payload').textContent);
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
