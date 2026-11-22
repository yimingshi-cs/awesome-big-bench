// Complete matrix: absence of a data row is a build error, not a grey verdict.
function initNames(){
  const fields=Object.entries(nameGroups.fields), families=Object.entries(nameGroups.endings);
  const endings=families.flatMap(([,items])=>items), map=new Map(names.map(n=>[n.prefix+'|'+n.suffix,n]));
  const chooser=$('#names-field'), table=$('#name-map'), dialog=$('#cell-dialog');
  let focused=null, lastPick=null, cells=[], rowOrder=[];
  chooser.add(new Option('All fields',''));for(const [f] of fields)chooser.add(new Option(f,f));
  const slug=x=>x==='²'?'squared':x.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const detailFor=n=>gh('verification/matrix/'+slug(n.prefix)+'.md#'+slug(n.suffix));
  function open(n,b){
    focused=b;lastPick=n;
    const has=n.status==='used', box=$('#cell-info');box.replaceChildren();
    const verdict=el('span',has?'Same-name AI benchmark':'No exact match found','badge '+(has?'yes':'no'));
    const title=el('h2',n.name);title.id='cell-title';box.append(verdict,title);
    if(n.note && (has||n.source_url))box.append(el('p',n.note,'evidence-note'));
    box.append(el('small','Checked '+n.checked_on));
    const actions=el('div',null,'links');
    if(n.source_url)actions.append(link(has?'Original source':'Other use / related source',n.source_url));
    actions.append(link('Search record',detailFor(n)));
    const correction=link(has?'Suggest a correction':'Found a match?',issue(n.name+': name check','name'),'action');
    const suggested='**Name:** '+n.name+'\n**Combination:** '+n.prefix+' × '+n.suffix+'\n**Listed as:** '+(has?'same-name AI benchmark':'no exact AI benchmark found')+'\n\n**Primary source:**\n\n**What should change?**\n';
    correction.href+='&body='+encodeURIComponent(suggested);
    box.append(actions,correction);
    dialog.showModal();
  }
  dialog.querySelector('.close').onclick=()=>dialog.close();
  dialog.onclick=e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();};
  dialog.addEventListener('close',()=>focused?.focus({preventScroll:true}));
  function tabStop(b){for(const x of cells)x.tabIndex=x===b?0:-1;}
  function draw(){
    const selected=fields.filter(([f])=>!chooser.value||chooser.value===f);
    rowOrder=selected.flatMap(([,ps])=>ps);cells=[];table.replaceChildren();
    const cap=table.createCaption();cap.className='sr-only';cap.textContent='Benchmark names by prefix and ending. Green: same-name AI benchmark. Grey: no exact match found.';
    const cg=el('colgroup');cg.append(el('col',null,'prefix-col'));table.append(cg);
    for(const [,ss] of families){const cols=el('colgroup');cols.span=ss.length;table.append(cols);}
    const head=table.createTHead(),a=head.insertRow(),b=head.insertRow();
    for(const [title,cls] of [['Prefix','prefix-label']]){const th=el('th',title,cls);th.rowSpan=2;th.scope='col';a.append(th);}
    for(const [g,ss] of families){const h=el('th',g,'family-head');h.colSpan=ss.length;h.scope='colgroup';a.append(h);
      ss.forEach((s,i)=>{const e=el('th',s,i===0?'family-start':'');e.scope='col';b.append(e);});}
    for(const [f,ps] of selected){
      const body=table.createTBody();
      const band=body.insertRow(),group=el('th',null,'field-band');group.colSpan=endings.length+1;group.scope='rowgroup';
      const wrap=el('div',null,'field-landmarks');wrap.append(el('strong',f));const peers=el('span');
      for(const id of fieldLandmarks[f]||[]){const x=catalog.find(r=>r.slug===id);peers.append(link(x.name,'#browse?domain='+encodeURIComponent(x.domain)+'&q='+encodeURIComponent(x.name)));}
      wrap.append(peers);group.append(wrap);band.append(group);
      ps.forEach(p=>{
        const tr=body.insertRow();const prefix=el('th',p,'prefix-label');prefix.scope='row';tr.append(prefix);
        for(const [,ss] of families){ss.forEach((s,j)=>{
          const n=map.get(p+'|'+s),td=tr.insertCell();if(!j)td.className='family-start';const used=n.status==='used';
          const c=button(null,()=>open(n,c),'map-cell '+(used?'yes':'no'));c.dataset.prefix=p;c.dataset.suffix=s;c.tabIndex=-1;
          c.setAttribute('aria-label',n.name+': '+(used?'same-name AI benchmark':'no exact match found'));c.setAttribute('aria-haspopup','dialog');c.title=n.name;
          const text=el('span',n.name);
          // Soft-wrap joined names at the word boundary, never change their spelling.
          if(n.name.toLowerCase().startsWith(p.toLowerCase()) && n.name.length>p.length+1){
            text.replaceChildren(document.createTextNode(n.name.slice(0,p.length)),el('wbr'),document.createTextNode(n.name.slice(p.length)));
          }
          if(used){const tick=el('i','✓');tick.setAttribute('aria-hidden','true');c.append(tick);}
          c.append(text);td.append(c);cells.push(c);
        });}
      });
    }
    if(cells.length)cells[0].tabIndex=0;
    $('#pick-name').disabled=!cells.some(c=>c.classList.contains('no'));
  }
  table.addEventListener('focusin',e=>{if(e.target.matches('.map-cell'))tabStop(e.target);});
  table.addEventListener('keydown',e=>{
    if(!e.target.matches('.map-cell'))return;
    const i=cells.indexOf(e.target),w=endings.length,base=Math.floor(i/w)*w;
    const go={ArrowRight:Math.min(base+w-1,i+1),ArrowLeft:Math.max(base,i-1),ArrowDown:Math.min(cells.length-1,i+w),ArrowUp:Math.max(0,i-w),Home:base,End:base+w-1}[e.key];
    if(go===undefined)return;e.preventDefault();cells[go].focus();
  });
  chooser.onchange=draw;
  $('#pick-name').onclick=()=>{
    const pool=cells.filter(b=>b.classList.contains('no'));
    const alternatives=pool.filter(b=>b.dataset.prefix!==lastPick?.prefix||b.dataset.suffix!==lastPick?.suffix);
    const from=alternatives.length?alternatives:pool;if(!from.length)return;
    const b=from[Math.floor(Math.random()*from.length)];open(map.get(b.dataset.prefix+'|'+b.dataset.suffix),b);
  };
  draw();$('#map-meta').append(link('Search criteria and sources',gh('verification/names.md')));
}
