'use strict';
const {catalog, names, months, domains, repo, nameGroups} = JSON.parse(document.querySelector('#payload').textContent);
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
const states={used:'In use',near:'Similar name',no_match:'No exact match',partial:'Search incomplete',unchecked:'Not checked'};
const keys=['used','near','no_match','partial','unchecked'];

function renderCover() {
  const pair = year => {
    const selected=months.filter(m=>m.month.startsWith(year+'-') && +m.month.slice(-2)<=9);
    return selected.reduce((a,m)=>[a[0]+m.hits,a[1]+m.total],[0,0]);
  };
  const [h1,t1]=pair('2020'),[h2,t2]=pair('2026'), ratio=(h2/t2)/(h1/t1);
  $('#cover-growth').textContent=ratio.toFixed(2)+'×';
  $('#edition').textContent=catalog.length+' benchmarks  /  '+domains.length+' domains';
  const examples=names.filter(n=>n.status==='no_match');
  const pick=examples.find(n=>!n.name.includes('Last Exam')) || examples[0];
  $('#cover-atlas').textContent=pick ? 'Try '+pick.name+' and other ideas' : 'See which names are in use';
  const seq=months.filter(m=>m.month<='2026-09').map(m=>100*m.hits/m.total),hi=Math.max(...seq);
  const pts=seq.map((v,i)=>[2+i*152/(seq.length-1),35-32*v/hi]);
  const svg=svgNode('svg',{viewBox:'0 0 156 39',preserveAspectRatio:'none'});
  svg.append(svgNode('polygon',{points:'2,38 '+pts.map(p=>p.join(',')).join(' ')+' 154,38',fill:'#436f54'}));
  svg.append(svgNode('polyline',{points:pts.map(p=>p.join(',')).join(' '),fill:'none',stroke:'#c4e8a0','stroke-width':1.7,'vector-effect':'non-scaling-stroke'}));$('#sparkline').append(svg);
  for(const [v,l,d] of [[ratio.toFixed(2)+'×','Increase in share','Jan–Sep, 2020 to 2026'],[(100*h1/t1).toFixed(2)+'%','Jan–Sep 2020',fmt(h1)+' / '+fmt(t1)+' papers'],[(100*h2/t2).toFixed(2)+'%','Jan–Sep 2026',fmt(h2)+' / '+fmt(t2)+' papers']]){
    const item=el('div');item.append(el('span',l,'micro'),el('b',v),el('span',d,'fact-detail'));$('#comparison').append(item);
  }
}
