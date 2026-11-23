function initTrends(){
  const ALL='All fields', choices=[ALL,...Object.keys(months[0].counts)];
  const one=$('#trend-domain'), two=$('#trend-other'), win=$('#trend-window'), range=$('#month-pick');
  choices.forEach(s=>one.add(new Option(s,s)));two.add(new Option('None',''));choices.forEach(s=>two.add(new Option(s,s)));
  let pos=months.findIndex(m=>m.month==='2026-09'), activeSVG=null, coordinate=null;
  const colors=['#147c6b','#7662a4'];
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
    const when=el('div',null,'month-id');when.append(el('strong',m.month),el('small',!m.complete?'Partial month':''));read.append(when);
    d.forEach((s,j)=>{const col=el('div',null,'reading');const title=el('span',s);title.prepend(el('i',null,'line-key'+(j?' second':'')));
      col.append(title,el('b',pct(m,s).toFixed(2)+'%'),el('small',fmt(hits(m,s))+' / '+fmt(m.total)+' CS papers'));read.append(col);});
    range.setAttribute('aria-valuetext',m.month+': '+d.map(s=>s+' '+pct(m,s).toFixed(2)+'%').join('; '));
    if(!activeSVG)return;
    activeSVG.querySelector('.crosshair')?.remove();const g=svgNode('g',{class:'crosshair','pointer-events':'none'});
    const x=coordinate.x(i);g.append(svgNode('line',{x1:x,x2:x,y1:coordinate.top,y2:coordinate.bottom,stroke:'#627b6e','stroke-dasharray':'3 4'}));
    d.forEach((s,j)=>g.append(svgNode('circle',{cx:x,cy:coordinate.y(pct(m,s)),r:4.5,fill:'white',stroke:colors[j],'stroke-width':2})));activeSVG.append(g);
  }
  function draw(){
    syncChoices();const ids=windowIndices(),first=ids[0],last=ids.at(-1),d=sel();
    pos=Math.min(last,Math.max(pos,first));range.min=first;range.max=last;
    const mobile=matchMedia('(max-width:640px)').matches,W=mobile?430:1000,H=mobile?210:249,L=mobile?45:56,R=W-15,T=13,B=H-28;
    const high=Math.max(...ids.flatMap(i=>d.map(s=>pct(months[i],s))));
    const step=[.005,.01,.02,.05,.1,.2,.25,.5,1,2,5,10,25].find(v=>v*5>=high)||25;
    const Y=v=>B-(B-T)*v/(5*step),X=i=>L+(R-L)*(i-first)/Math.max(1,last-first);
    const svg=svgNode('svg',{viewBox:'0 0 '+W+' '+H,role:'img','aria-label':'Share of all CS titles by month: '+d.join(' versus ')});
    const mark=(tag,attrs,text)=>svg.append(svgNode(tag,attrs,text));
    for(let j=0;j<=5;j++){const y=Y(j*step);mark('line',{x1:L,x2:R,y1:y,y2:y,stroke:'#dee6e4'});mark('text',{x:L-7,y:y+4,'text-anchor':'end',class:'axis'},Number((j*step).toFixed(3))+'%');}
    let tickIds=ids.filter(i=>months[i].month.endsWith('-01'));
    if(ids.length<=15)tickIds=ids.filter((i,j)=>j%3===0);
    if(mobile&&tickIds.length>6)tickIds=tickIds.filter((_,j)=>j%2===0);
    for(const i of tickIds){const m=months[i].month;mark('text',{x:X(i),y:H-7,'text-anchor':'middle',class:'axis'},ids.length<=15?m:m.slice(0,4));}
    d.forEach((s,j)=>{
      const full=ids.filter(i=>months[i].complete),pts=full.map(i=>[X(i),Y(pct(months[i],s))]);
      if(d.length===1&&pts.length)mark('polygon',{points:[...pts,[pts.at(-1)[0],B],[pts[0][0],B]].map(p=>p.join(',')).join(' '),fill:'#d7f2eb'});
      mark('polyline',{points:pts.map(p=>p.join(',')).join(' '),fill:'none',stroke:colors[j],'stroke-width':2.5,'stroke-dasharray':j?'6 3':'none','stroke-linejoin':'round'});
      for(const i of ids.filter(i=>!months[i].complete)){const y=Y(pct(months[i],s));if(i>first)mark('line',{x1:X(i-1),x2:X(i),y1:Y(pct(months[i-1],s)),y2:y,stroke:colors[j],'stroke-dasharray':'2 4'});mark('circle',{cx:X(i),cy:y,r:4,fill:'white',stroke:colors[j],'stroke-width':2});}
    });
    $('#plot').replaceChildren(svg);activeSVG=svg;coordinate={x:X,y:Y,top:T,bottom:B};displayPoint(pos);
    function pick(e){const matrix=svg.getScreenCTM();if(!matrix)return;const pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;const x=pt.matrixTransform(matrix.inverse()).x;
      const idx=Math.min(last,Math.max(first,Math.round(first+(x-L)*(last-first)/(R-L))));if(idx!==pos)displayPoint(idx);}
    svg.onpointermove=e=>{if(e.pointerType==='mouse')pick(e);};svg.onclick=pick;
  }
  range.oninput=()=>displayPoint(+range.value);one.onchange=draw;two.onchange=draw;win.onchange=draw;matchMedia('(max-width:640px)').addEventListener('change',draw);
  $('#trend-links').append(link('Download monthly counts',gh('data/monthly.csv')),link('Charts',repo+'/tree/main/figures'));
  const timeline=catalog.filter(x=>x.origin!=='report'&&x.date_basis!=='available_by');
  const ypick=$('#year-select');[...new Set(timeline.map(x=>x.date.slice(0,4)))].sort().reverse().forEach(y=>ypick.add(new Option(y,y)));
  function milestones(){const host=$('#milestone-list');host.replaceChildren();for(const x of timeline.filter(x=>x.date.startsWith(ypick.value)).sort((a,b)=>a.date.localeCompare(b.date))){
    const row=el('div',null,'milestone-row'),left=el('div');left.append(el('span',x.date,'date'),link(x.name,x.primary_url),el('small',displayDomain(x.domain)));row.append(left);
    const i=months.findIndex(m=>m.month===x.date.slice(0,7));if(i>=0)row.append(button('Show month',()=>{win.value='all';pos=i;draw();$('.plotbox').scrollIntoView({block:'center'});range.focus({preventScroll:true});},'subtle'));host.append(row);
  }}
  ypick.onchange=milestones;milestones();draw();
}
