// Filters and global date order can be shared. The default never collapses editions.
function initDirectory(){
  let domain='All domains',scope='featured',routeID=0;
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
      text=new Map(catalog.map(x=>[x.slug,searchText([x.name,x.display_name,x.series,x.slug,x.task,x.search_alias,displayDomain(x.domain),x.description,x.domain,x.modalities,x.detailTerms,readingNotes[x.slug]?.kind,...(x.aliases||[])].filter(Boolean).join(' '))]));
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
      loadIndex().then(()=>{if(pending.isConnected)draw();}).catch(()=>{
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
  return params=>{
    const id=++routeID,entry=params.get('entry');
    scope=params.get('scope')==='featured'?'featured':(params.get('scope')==='all'||params.get('q')||entry&&!chosen.has(entry))?'all':'featured';
    domain=available.includes(params.get('domain'))?params.get('domain'):'All domains';$('#query').value=params.get('q')||'';
    order.value=params.get('order')==='new'?'new':'group';draw();
    function showEntry(){const x=recordsById.get(entry);
      if(x&&id===routeID&&!$('#directory').hidden){const opener=[...document.querySelectorAll('.directory-name')].find(b=>b.dataset.slug===x.slug);openEdition(x,opener||$('#query'));}
    }
    if(entry){if(recordsById.has(entry))showEntry();else loadIndex().then(showEntry).catch(()=>{});}
  };
}
