// One row in the inventory is a focal release and a reported evaluation configuration.
// Absence from a publication is not evidence that the lab did not run the evaluation.
function initFlagships(){
  const records=flagshipRecords, labs=['OpenAI','Anthropic','Google'];
  const displayLab={OpenAI:'OpenAI',Anthropic:'Claude',Google:'Gemini'};
  const files={OpenAI:'openai',Anthropic:'anthropic',Google:'google'};
  const generations=['previous','current'];
  const byFamily=new Map();
  for(const r of records){const key=r.family;if(!byFamily.has(key))byFamily.set(key,[]);byFamily.get(key).push(r);}
  const edition=(lab,gen)=>records.find(r=>r.vendor===lab&&r.generation===gen);
  const shortRelease=r=>r.release.replace(/^GPT-/,'').replace(' Astra and Sol',' Astra/Sol').replace(/^Gemini /,'').replace(/^Claude Fable ([^ ]+) \/ Claude Mythos .+$/,'Fable/Mythos $1');
  let lab='All',scope='headline',query='';const repeat=$('#release-repeat');
  const labBtns=new Map();
  const local=(l)=>l==='All'?'Across labs':displayLab[l];
  function selectLab(l){
    lab=l;repeat.replaceChildren();[['all','All families'],...(lab==='All'?[['shared','In two or more labs']]:[]),['both','In both releases'],['new','Latest release only']].forEach(([v,t])=>repeat.add(new Option(t,v)));
    draw();
  }
  for(const l of ['All',...labs]){const b=button(local(l),()=>selectLab(l),'release-tab');$('#release-labs').append(b);labBtns.set(l,b);}
  const represented=(rows,v,gen)=>rows.some(r=>r.vendor===v&&r.generation===gen);
  const tierOK=r=>scope==='all'||r.tier==='headline';
  function variant(r){
    const d=el('details',null,'protocol');const s=el('summary',r.benchmark);d.append(s);
    if(r.qualifier)d.append(el('p',r.qualifier));
    d.append(el('small',r.location));
    const links=el('div',null,'links');links.append(link('Reported result',r.release_url),link('Protocol',r.protocol_url));d.append(links);return d;
  }
  function draw(){
    for(const [l,b] of labBtns)setPressed(b,l===lab);
    $('#release-scope').value=scope;
    const t=el('table',null,'release-table'+(lab==='All'?' cross':' pair'));const tr=t.createTHead().insertRow();
    function heading(text,sub){const h=el('th',text);h.scope='col';if(sub)h.append(el('small',sub));tr.append(h);}
    heading('Benchmark family');
    if(lab==='All'){for(const v of labs)heading(displayLab[v],shortRelease(edition(v,'previous'))+' → '+shortRelease(edition(v,'current')));}
    else{for(const gen of generations){const r=edition(lab,gen);heading(r.release,r.date+' · '+(gen==='previous'?'previous':'latest'));}}
    const body=t.createTBody();let visible=0;
    const breadth=rs=>new Set(rs.filter(tierOK).map(r=>r.vendor)).size;
    const releaseCount=rs=>new Set(rs.filter(r=>tierOK(r)&&(lab==='All'||r.vendor===lab)).map(r=>r.vendor+'|'+r.generation)).size;
    const sorted=[...byFamily].sort((a,b)=>(lab==='All'?breadth(b[1])-breadth(a[1]):0)||releaseCount(b[1])-releaseCount(a[1])||a[0].localeCompare(b[0]));
    for(const [name,all] of sorted){
      const rows=lab==='All'?all:all.filter(r=>r.vendor===lab);
      if(!rows.some(tierOK)||!rows.some(r=>[r.benchmark,r.family,r.domain].join(' ').toLowerCase().includes(query)))continue;
      const scoped=rows.filter(tierOK);
      const labsHere=labs.filter(v=>scoped.some(r=>r.vendor===v));
      if(repeat.value==='shared'&&labsHere.length<2)continue;
      if(repeat.value==='both'&&!labsHere.some(v=>generations.every(g=>represented(scoped,v,g))))continue;
      if(repeat.value==='new'&&(!scoped.some(r=>r.generation==='current')||scoped.some(r=>r.generation==='previous')))continue;
      const line=body.insertRow();const rowHead=el('th',name);rowHead.scope='row';line.append(rowHead);visible++;
      if(lab==='All'){
        for(const v of labs){
          const cell=line.insertCell();cell.dataset.label=displayLab[v];
          const gens=generations.filter(g=>rows.some(r=>r.vendor===v&&r.generation===g&&tierOK(r)));
          if(!gens.length){cell.textContent='—';continue;}
          cell.append(button(gens.length===2?'Both':gens[0]==='current'?'Latest':'Previous',()=>{
            query=name.toLowerCase();$('#release-query').value=name;selectLab(v);
          },'scope-link'));
        }
      }else{
        for(const gen of generations){
          const cell=line.insertCell();cell.dataset.label=gen==='previous'?'Previous release':'Latest release';
          const group=rows.filter(r=>r.generation===gen);
          const shown=group.filter(tierOK);
          if(shown.length)shown.forEach(r=>cell.append(variant(r)));
          else if(group.length)cell.append(button('In full list',()=>{scope='all';draw();},'scope-link'));
          else cell.textContent='—';
        }
      }
    }
    const host=$('#release-results');host.replaceChildren();
    if(visible)host.append(t);else host.append(el('p','No families match these filters.','how'));
    $('#release-count').textContent=visible+(visible===1?' family':' families');
    $('#release-help').textContent=lab==='All'?'Select a lab cell for versions and sources.':'Expand a benchmark to see its protocol and source.';
    const docs=$('#release-docs');docs.replaceChildren();
    for(const v of (lab==='All'?labs:[lab]))docs.append(link(displayLab[v]+' sources',gh('verification/flagships/'+files[v]+'.md')));
    docs.append(link('Full CSV',gh('data/flagship_evaluations.csv')));
  }
  $('#release-scope').onchange=e=>{scope=e.target.value;draw();};repeat.onchange=draw;
  $('#release-query').oninput=e=>{query=e.target.value.toLowerCase().trim();draw();};
  $('#release-reset').onclick=()=>{scope='headline';query='';$('#release-query').value='';selectLab('All');};
  selectLab('All');
}
