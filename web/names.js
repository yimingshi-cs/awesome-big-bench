// A recorded negative search and an unsearched combination never share a result list.
function initNames(){
  const byPair=new Map(names.map(n=>[n.prefix+'|'+n.suffix,n]));
  const fields=Object.entries(nameGroups.fields);
  const endings=Object.entries(nameGroups.endings);
  const prefixes=fields.flatMap(([,items])=>items).filter(p=>names.some(n=>n.prefix===p));
  const suffixes=endings.flatMap(([,items])=>items).filter(s=>names.some(n=>n.suffix===s));
  const get=(p,s)=>byPair.get(p+'|'+s)||{prefix:p,suffix:s,name:p+' × '+s,status:'unchecked'};
  const fieldOf=n=>nameGroups.exceptions[n.prefix+'|'+n.suffix]||fields.find(([,ps])=>ps.includes(n.prefix))[0];
  const availableFields=fields.map(([f])=>f).filter(f=>names.some(n=>fieldOf(n)===f));
  const select=$('#names-field'),host=$('#field-list'),more=$('#patterns');
  select.add(new Option('All fields',''));availableFields.forEach(f=>select.add(new Option(f,f)));
  const verdicts=['no_match','near','used'];
  const labels={no_match:'No exact match',near:'Similar names',used:'Already in use'};
  let selected=null,field='',full=false,patternSelected=null;
  const selectedNames=()=>names.filter(n=>(!field||fieldOf(n)===field)&&verdicts.includes(n.status));
  function evidence(n,withStatus=false){
    const panel=el('div',null,'name-evidence');
    panel.append(el('strong',n.name));if(withStatus)panel.append(el('span',states[n.status],'verdict '+n.status));
    if(n.checked_on)panel.append(el('time','Checked '+n.checked_on));
    if(n.status!=='no_match'&&n.note)panel.append(el('p',n.note));
    const links=el('div',null,'links');
    if(n.source_url)links.append(link(n.status==='near'?'Similar project':'Project',n.source_url));
    if(n.search_url)links.append(link('Repeat search',n.search_url));
    if(n.status!=='unchecked')links.append(link('Sources checked',gh('verification/names.md')));
    links.append(link(n.status==='unchecked'?'Submit a finding':'Suggest a correction',issue(n.name+': name check','name')));
    panel.append(links);return panel;
  }
  function choose(n,fromRoll=false){
    selected=selected===n&&!fromRoll?null:n;drawList();
    const b=host.querySelector('[aria-expanded="true"]');
    if(b){b.focus({preventScroll:true});if(fromRoll)b.scrollIntoView({block:'nearest'});}
  }
  function drawList(){
    host.replaceChildren();
    const rows=selectedNames(),shownFields=availableFields.filter(f=>!field||field===f);
    const headings=el('div',null,'name-table-head');
    headings.append(el('span','Field'));const cols=el('div',null,'name-columns');
    for(const k of verdicts)cols.append(el('b',labels[k],'head-'+k));headings.append(cols);host.append(headings);
    for(const f of shownFields){
      const data=rows.filter(x=>fieldOf(x)===f);
      if(!data.length)continue;
      const group=el('section',null,'name-group'),h=el('h2',f);group.append(h);
      const board=el('div',null,'name-columns');
      for(const k of verdicts){
        const arr=data.filter(x=>x.status===k).sort((a,b)=>prefixes.indexOf(a.prefix)-prefixes.indexOf(b.prefix)||suffixes.indexOf(a.suffix)-suffixes.indexOf(b.suffix));
        const col=el('div',null,'name-column '+k),heading=el('h3',labels[k]);col.append(heading);
        if(!arr.length){const none=el('span','—','nothing');none.setAttribute('aria-label','No records');col.append(none);}
        for(const n of arr){
          const b=button(n.name,()=>choose(n),'name-choice');b.setAttribute('aria-expanded',String(selected===n));col.append(b);
        }
        board.append(col);
      }
      group.append(board);if(selected&&data.includes(selected))group.append(evidence(selected));host.append(group);
    }
    $('#pick-name').disabled=!rows.some(n=>n.status==='no_match');
  }
  const random=(pool,last)=>{const p=pool.length>1?pool.filter(x=>x.name!==last?.name):pool;return p.length?p[Math.floor(Math.random()*p.length)]:null;};
  select.onchange=()=>{field=select.value;selected=null;patternSelected=null;drawList();if(more.open)drawGrid();};
  $('#pick-name').onclick=()=>{const n=random(selectedNames().filter(n=>n.status==='no_match'),selected);if(n)choose(n,true);};
  let rowFocus=['SWE','MM','Embodied'],colFocus=['Bench','Exam','Dojo'];
  function groups(options,allowed){return options.map(([label,items])=>[label,items.filter(x=>allowed.includes(x))]).filter(([,items])=>items.length);}
  function selector(chosen,i,parts,label){
    const s=el('select');s.setAttribute('aria-label',label+' '+(i+1));
    for(const [g,items] of parts){const og=el('optgroup');og.label=g;items.forEach(v=>og.append(new Option(v,v)));s.append(og);}
    s.value=chosen[i];s.onchange=()=>{const j=chosen.indexOf(s.value);if(j!==-1)chosen[j]=chosen[i];chosen[i]=s.value;patternSelected=null;drawGrid();$('#matrix select[aria-label="'+label+' '+(i+1)+'"]').focus();};return s;
  }
  function drawGrid(){
    const possible=prefixes.filter(p=>!field||nameGroups.fields[field].includes(p)||names.some(n=>n.prefix===p&&fieldOf(n)===field));
    rowFocus=[...new Set([...rowFocus,...possible])].filter(p=>possible.includes(p)).slice(0,3);
    const rr=full?possible:rowFocus,cc=full?suffixes:colFocus;
    const filterFields=groups(fields,possible),filterEndings=groups(endings,suffixes);
    const tab=el('table',null,'pattern-table '+(full?'atlas':'focus'));tab.setAttribute('aria-label',full?'All name combinations':'Three by three name grid');
    const thead=tab.createTHead();
    if(full){const r=thead.insertRow();r.append(el('th',''));for(const [g,a] of filterEndings){const th=el('th',g);th.scope='colgroup';th.colSpan=a.length;r.append(th);}}
    const head=thead.insertRow();head.append(el('th',''));
    cc.forEach((v,i)=>{const th=el('th');th.scope='col';th.append(full?document.createTextNode(v):selector(colFocus,i,filterEndings,'Ending'));head.append(th);});
    const tbody=tab.createTBody();let prior='';
    rr.forEach((p,ri)=>{
      const g=fields.find(([,a])=>a.includes(p))[0];
      if(full&&g!==prior){const heading=tbody.insertRow().insertCell();heading.colSpan=cc.length+1;heading.className='pattern-field';heading.textContent=g;prior=g;}
      const tr=tbody.insertRow(),th=el('th');th.scope='row';th.append(full?document.createTextNode(p):selector(rowFocus,ri,filterFields,'Prefix'));tr.append(th);
      cc.forEach(s=>{const n=get(p,s),td=tr.insertCell();
        let ctl;
        if(n.status==='unchecked'){
          ctl=button('Not checked',()=>show(n),'pattern-cell unchecked');
        }else{
          ctl=button(null,()=>show(n),'pattern-cell '+n.status);
          ctl.append(el('b',n.name),el('span',states[n.status]));
        }
        ctl.setAttribute('aria-label',n.name+': '+states[n.status]);
        if(n.prefix===patternSelected?.prefix&&n.suffix===patternSelected?.suffix)ctl.setAttribute('aria-pressed','true');
        td.append(ctl);
      });
    });
    $('#matrix').replaceChildren(tab);
    $('#pattern-detail').replaceChildren(...(patternSelected?[evidence(patternSelected,true)]:[]));
    setPressed($('#view-focus'),!full);setPressed($('#view-full'),full);
  }
  function show(n){patternSelected=n;drawGrid();$('#pattern-detail').scrollIntoView({block:'nearest'});}
  $('#view-focus').onclick=()=>{full=false;drawGrid();};$('#view-full').onclick=()=>{full=true;drawGrid();};
  $('#pick-unchecked').onclick=()=>{
    const ps=field?nameGroups.fields[field].filter(p=>prefixes.includes(p)):prefixes;
    const pool=ps.flatMap(p=>suffixes.map(s=>get(p,s))).filter(x=>x.status==='unchecked');
    const n=random(pool,patternSelected);if(!n){$('#pattern-detail').textContent='Every combination in this field has been checked.';return;}
    full=false;rowFocus=[n.prefix,...rowFocus.filter(x=>x!==n.prefix)].slice(0,3);colFocus=[n.suffix,...colFocus.filter(x=>x!==n.suffix)].slice(0,3);show(n);
  };
  more.ontoggle=()=>{if(more.open)drawGrid();};
  drawList();
}
