// Directory state lives in the URL so a reader can share a filtered reading list.
function initDirectory() {
  let domain='All domains';
  const security=new Set(['cwe-bench-v2','sec-bench-pro','webexploitbench-v12','cyberseceval']);
  const inDomain=(x,d)=>d==='All domains'||(d==='Cybersecurity'?security.has(x.slug):d===x.domain);
  const available=['All domains',...domains,'Cybersecurity'], domButtons=new Map();
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
  function detail(x) {
    const box=el('div',null,'record'),left=el('div'),right=el('div',null,'links');
    left.append(el('strong',x.task),el('p',x.description),el('small','Documented '+x.date+(x.first_author_affil?' · '+x.first_author_affil:' · No first-listed affiliation recorded')));
    right.append(link('Original source',x.primary_url),link('Scoring source',x.protocol_url),link('Date evidence',x.date_source_url));
    if(x.affil_source_url)right.append(link('Affiliation evidence',x.affil_source_url));
    if(x.logo_source_url)right.append(link('Mark provenance',x.logo_source_url));
    right.append(link('Suggest a correction',issue(x.name+': correction','benchmark')));box.append(left,right);return box;
  }
  function draw(){
    const q=$('#query').value.trim().toLowerCase(),host=$('#entries');host.replaceChildren();
    $('#mobile-domain').value=domain;for(const [d,b] of domButtons)setPressed(b,d===domain);
    const found=catalog.filter(x=>inDomain(x,domain)&&[x.name,x.task,x.slug,x.description,x.domain,x.input,x.output,x.assessment].join(' ').toLowerCase().includes(q));
    $('#count').textContent=found.length+' results';
    if(!found.length){host.append(el('p','No benchmarks match this selection.','small'),button('Clear filters',()=>choose('All domains'),'subtle'));return;}
    const t=el('table',null,'bench-table');t.setAttribute('aria-label','Benchmark task comparison');const head=t.createTHead().insertRow();
    for(const s of ['Benchmark','Input','Output','Scoring']){const th=el('th',s);th.scope='col';head.append(th);}
    const body=t.createTBody();
    let last='';
    for(const x of found){
      if(domain==='All domains'&&x.domain!==last){const cell=body.insertRow().insertCell();cell.colSpan=4;cell.className='group';cell.textContent=displayDomain(x.domain);last=x.domain;}
      const tr=body.insertRow();tr.className='data-row';const first=tr.insertCell();
      const extra=el('tr',null,'detail-row');extra.hidden=true;extra.id='record-'+x.slug;
      const b=button(x.name,()=>{extra.hidden=!extra.hidden;b.setAttribute('aria-expanded',String(!extra.hidden));},'record-trigger');
      b.setAttribute('aria-controls',extra.id);b.setAttribute('aria-expanded','false');first.append(b);
      for(const [label,value] of [['Input',x.input],['Output',x.output],['Scoring',x.assessment]]){
        const cell=tr.insertCell();cell.dataset.label=label;cell.textContent=value;
      }
      const td=extra.insertCell();td.colSpan=4;td.append(detail(x));body.append(extra);
    }
    host.append(t);
  }
  return params=>{domain=available.includes(params.get('domain'))?params.get('domain'):'All domains';$('#query').value=params.get('q')||'';draw();};
}
