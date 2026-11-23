// Directory state lives in the URL so a reader can share a filtered reading list.
function initDirectory() {
  let domain='All domains';
  const security=new Set(['cwe-bench-v2','sec-bench-pro','webexploitbench-v12','cyberseceval']);
  const inDomain=(x,d)=>d==='All domains'||(d==='Cybersecurity'?security.has(x.slug):d===x.domain);
  const available=['All domains',...domains,'Cybersecurity'], domButtons=new Map();
  const searchText=s=>s.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
  const terms=new Map(catalog.map(x=>[x.slug,searchText([x.name,x.slug,x.task,x.description,x.domain,x.input,x.output,x.assessment,readingNotes[x.slug]?.kind].join(' '))]));
  const count=d=>catalog.filter(x=>inDomain(x,d)).length;
  const putState=(d,q)=>{
    const p=new URLSearchParams();
    if(d!=='All domains')p.set('domain',d);
    if(q)p.set('q',q);
    history.replaceState(null,'','#browse'+(p.size?'?'+p:''));
  };
  function choose(d,q='') {domain=d;$('#query').value=q;putState(d,q);draw();}
  for(const d of available){
    const b=button(displayDomain(d),()=>choose(d),'filter');b.append(el('span',count(d)));$('#domains').append(b);domButtons.set(d,b);
    $('#mobile-domain').add(new Option(displayDomain(d)+' ('+count(d)+')',d));
  }
  $('#mobile-domain').onchange=e=>choose(e.target.value);
  $('#query').oninput=()=>{putState(domain,$('#query').value);draw();};
  function draw(){
    const q=$('#query').value.trim().toLowerCase(),host=$('#entries');host.replaceChildren();
    $('#mobile-domain').value=domain;for(const [d,b] of domButtons)setPressed(b,d===domain);
    const words=searchText(q).split(/\s+/).filter(Boolean);
    const found=catalog.filter(x=>inDomain(x,domain)&&words.every(w=>terms.get(x.slug).includes(w)));
    $('#count').textContent=found.length+(found.length===1?' result':' results');
    if(!found.length){host.append(el('p','No benchmarks match this selection.','small'),button('Clear filters',()=>choose('All domains'),'subtle'));return;}
    const t=el('table',null,'bench-table');t.setAttribute('aria-label','Benchmark task comparison');const head=t.createTHead().insertRow();
    for(const s of ['Benchmark','Input','Output','Scoring']){const th=el('th',s);th.scope='col';head.append(th);}
    const body=t.createTBody();
    let last='';
    for(const x of found){
      if(domain==='All domains'&&x.domain!==last){const cell=body.insertRow().insertCell();cell.colSpan=4;cell.className='group';cell.textContent=displayDomain(x.domain);last=x.domain;}
      const tr=body.insertRow();tr.className='data-row';const first=tr.insertCell();
      const b=button(x.name,()=>presentCard(catalogCard(x),b),'record-trigger');b.dataset.slug=x.slug;
      if(mapEvidence.catalog[x.slug]){b.classList.add('reported-record');b.setAttribute('aria-label',x.name+': reported by '+labNames(mapEvidence.reports[mapEvidence.catalog[x.slug]]));}
      b.setAttribute('aria-haspopup','dialog');first.append(b);
      for(const [label,value] of [['Input',x.input],['Output',x.output],['Scoring',x.assessment]]){
        const cell=tr.insertCell();cell.dataset.label=label;cell.textContent=value;
      }

    }
    host.append(t);
  }
  return params=>{domain=available.includes(params.get('domain'))?params.get('domain'):'All domains';$('#query').value=params.get('q')||'';draw();
    const x=recordsById.get(params.get('entry'));
    if(x){const opener=[...document.querySelectorAll('.record-trigger')].find(b=>b.dataset.slug===x.slug);if(opener)presentCard(catalogCard(x),opener);}};
}
