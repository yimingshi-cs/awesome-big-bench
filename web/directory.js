// Filters and global date order can be shared. The default never collapses editions.
function initDirectory(){
  let domain='All domains';
  const security=new Set(['cwe-bench-v2','sec-bench-pro','webexploitbench-v12','cyberseceval']);
  const inDomain=(x,d)=>d==='All domains'||(d==='Cybersecurity'?security.has(x.slug):x.domain===d);
  const available=['All domains',...domains,'Cybersecurity'],domButtons=new Map();
  const searchText=s=>s.normalize('NFKC').toLowerCase().replace(/τ/g,'tau').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
  const text=new Map(catalog.map(x=>[x.slug,searchText([x.name,x.display_name,x.series,x.slug,x.task,x.description,x.domain,x.modalities,x.input,x.output,x.assessment,readingNotes[x.slug]?.kind,...(x.aliases||[])].filter(Boolean).join(' '))]));
  const seriesNames=new Set(catalog.map(x=>searchText(x.series)));
  const counts=Object.fromEntries(available.map(d=>[d,catalog.filter(x=>inDomain(x,d)).length]));
  const order=$('#directory-order'),state=()=>{
    const p=new URLSearchParams(),q=$('#query').value.trim();
    if(domain!=='All domains')p.set('domain',domain);
    if(q)p.set('q',q);
    if(order.value==='new')p.set('order','new');
    history.replaceState(null,'','#browse'+(p.size?'?'+p:''));
  };
  function choose(d,q=''){domain=d;$('#query').value=q;state();draw();}
  for(const d of available){
    const b=button(displayDomain(d),()=>choose(d),'filter');b.append(el('span',counts[d]));$('#domains').append(b);domButtons.set(d,b);
    $('#mobile-domain').add(new Option(displayDomain(d)+' ('+counts[d]+')',d));
  }
  $('#mobile-domain').onchange=e=>choose(e.target.value);
  $('#query').oninput=()=>{state();draw();};order.onchange=()=>{state();draw();};
  const cmp=new Intl.Collator('en',{numeric:true,sensitivity:'base'});
  function recent(a,b){return b.date.localeCompare(a.date)||(b.edition_order||0)-(a.edition_order||0)||cmp.compare(b.display_name,a.display_name);}
  function grouped(a,b){return domains.indexOf(a.domain)-domains.indexOf(b.domain)||cmp.compare(a.series,b.series)||(b.edition_order&&a.edition_order?b.edition_order-a.edition_order:0)||recent(a,b);}
  function draw(){
    const query=searchText($('#query').value),words=query.split(/\s+/).filter(Boolean),host=$('#entries');host.replaceChildren();
    $('#mobile-domain').value=domain;for(const [d,b] of domButtons)setPressed(b,d===domain);
    const found=catalog.filter(x=>inDomain(x,domain)&&(seriesNames.has(query)?searchText(x.series)===query:words.every(w=>text.get(x.slug).includes(w)))).sort(order.value==='new'?recent:grouped);
    $('#count').textContent=found.length+' '+(found.length===1?'entry':'entries');
    if(!found.length){host.append(el('p','No matching benchmarks.','small'),button('Clear filters',()=>choose('All domains'),'subtle'));return;}
    const t=el('table',null,'directory-table');t.setAttribute('aria-label','Benchmark directory');const head=t.createTHead().insertRow();
    for(const label of ['Benchmark','Task','Input','Release date']){
      const th=el('th',label);th.scope='col';if(label==='Release date')th.title='The link identifies the announcement, paper, release tag or dated evidence of availability.';head.append(th);
    }
    const body=t.createTBody();let last='';
    for(const x of found){
      if(order.value==='group'&&domain==='All domains'&&x.domain!==last){
        const band=el('th',displayDomain(x.domain),'directory-section');band.colSpan=4;body.insertRow().append(band);last=x.domain;
      }
      const row=body.insertRow();row.className='directory-row';
      const cell=row.insertCell(),b=button(null,()=>presentCard(catalogCard(x),b),'directory-name');b.dataset.slug=x.slug;
      const reported=mapEvidence.catalog[x.slug],mark=directoryMark(x);
      const slot=el('span',null,'mark-slot');slot.setAttribute('aria-hidden','true');if(mark?.placement==='row')slot.append(markImage(mark));
      const label=el('span',x.display_name,'directory-label');b.append(slot,label);b.setAttribute('aria-haspopup','dialog');
      if(reported){b.classList.add('is-reported');b.setAttribute('aria-label',x.display_name+': reported by '+labNames(mapEvidence.reports[reported]));}
      cell.append(b);
      const task=row.insertCell();task.className='directory-task';task.textContent=x.task||'—';
      const mod=row.insertCell();mod.className='directory-modality';mod.textContent=x.modalities;
      const day=row.insertCell();day.className='directory-day';day.append(dateLink(x));
    }
    host.append(t);
  }
  return params=>{
    domain=available.includes(params.get('domain'))?params.get('domain'):'All domains';$('#query').value=params.get('q')||'';
    order.value=params.get('order')==='new'?'new':'group';draw();
    const x=recordsById.get(params.get('entry'));
    if(x){const opener=[...document.querySelectorAll('.directory-name')].find(b=>b.dataset.slug===x.slug);if(opener)presentCard(catalogCard(x),opener);}
  };
}
