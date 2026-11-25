// One reading card for the directory, field references, and exact catalog matches on the map.
const recordsById=new Map(catalog.map(x=>[x.slug,x]));
const recordUrl=x=>'#browse?'+new URLSearchParams({domain:x.domain,q:x.name,entry:x.slug});
const namePair=n=>n.prefix+'|'+n.suffix;
const nameAnchor=s=>s==='²'?'squared':s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const nameEvidence=n=>gh('verification/matrix/'+nameAnchor(n.prefix)+'.md#'+nameAnchor(n.suffix));

const marksBySeries=new Map(catalog.filter(x=>marks[x.slug]).map(x=>[x.series,marks[x.slug]]));
function directoryMark(x){return marks[x.slug]||marksBySeries.get(x.series);}
function markImage(mark){
  const img=el('img');img.src=mark.uri;img.alt='';img.width=mark.width;img.height=mark.height;return img;
}
function dateLink(x){
  const d=x.display_date||x.date,upper=x.date_basis==='available_by'&&!x.display_date?.match(/^\d{4}-\d{2}$/);
  const human={paper:'First public paper',tag:'Version tag',available_by:'Documented publicly by',public_record:'Dated public record',released:'Public release',announcement:'Public announcement'};
  const a=link(upper?T('By {date}',{date:d}):d,x.date_source_url,'entry-date');a.title=T(human[x.date_basis]||'Dated evidence')+': '+d;return a;
}
function cardHead(group,title,lead){
  const h=el('div',null,'card-head'),name=el('h2',title);name.id='cell-title';
  h.append(group,name);if(lead)h.append(el('p',lead,'card-lead'));
  return h;
}
function meta(parts,mark){
  const b=el('div',null,'card-meta');
  if(mark)b.append(el('span',T(mark==='no'?'Looks open':'Taken'),'badge '+mark));
  for(const part of parts.filter(Boolean))b.append(el('span',part));
  return b;
}
function field(label,text,url){
  const g=el('div'),value=el('dd');value.append(url?link(text,url):text);g.append(el('dt',label),value);return g;
}
function cardFooter(main,edit){
  const f=el('div',null,'card-footer');main.className='action';f.append(main,edit);return f;
}
function compareLine(x,text){
  const line=el('p',null,'compare-line');
  line.append(el('span',T('Compare '),'compare-label'),link(x.name,recordUrl(x)));
  if(text)line.append(document.createTextNode(' — '+text));
  return line;
}
function sourceNotes(x,n,primary,guide,extra=null){
  const d=el('details',null,'card-sources');d.append(el('summary',T(extra?'Protocol & sources':'Sources')));
  const facts=el('p',null,'source-facts');facts.append(document.createTextNode(T('Date evidence: ')),dateLink(x));
  if(x.date_note)facts.append(document.createTextNode(' · '+x.date_note));
  if(x.first_author_affil)facts.append(document.createTextNode(' · '+x.first_author_affil));
  if(extra)d.append(extra);d.append(facts);
  if(x.source_title)d.append(link(x.source_title,x.primary_url,'original-title'));
  const mark=directoryMark(x);
  if(mark){
    const credit=el('p',null,'source-facts');credit.append(document.createTextNode(T(mark.kind)+': '),link(mark.credit,mark.credit_url),document.createTextNode(' · '),link(mark.license,mark.license_url),document.createTextNode(' · '+T(mark.changes)));d.append(credit);
  }
  if(n?.note)d.append(el('p',n.note,'source-facts'));
  const links=new Map();
  function add(label,url){if(!url||url===primary)return;if(!links.has(url))links.set(url,[]);links.get(url).push(label);}
  add(T('Scoring'),x.protocol_url);add(T('Date'),x.date_source_url);add(T('Affiliation'),x.affil_source_url);
  for(const ev of x.alternative_dates||[]){add(T(ev.date_basis==='tag'?'Tag': 'Dated record')+' · '+ev.date,ev.url);}
  add(T('Mark provenance'),x.logo_source_url);if(guide)add(T('Interpretation'),guide.url);
  if(n){add(T('Name source'),n.source_url);add(T('Name check · {date}',{date:n.checked_on}),nameEvidence(n));}
  {
    const items=el('div',null,'source-list');items.append(link(T('Link to this card'),recordUrl(x)));
    for(const [url,labels] of links)items.append(link(labels.join(' / '),url));
    d.append(items);
  }
  return d;
}
function catalogCard(x,n=null){
  const box=el('div',null,'detail-sheet');box.dataset.entry=x.slug;const guide=readingNotes[x.slug],pair=n?namePair(n):Object.keys(mapCatalog).find(k=>mapCatalog[k]===x.slug&&(nameGroups.relatedCatalog[k]||nameGroups.secondarySources?.[k]));
  const key=n?mapEvidence.cells[pair]:mapEvidence.catalog[x.slug];
  const title=x.display_name||x.name;
  const top=meta([displayDomain(x.domain),guide?.kind&&!['Task suite','任务集','任务套件'].includes(guide.kind)?guide.kind:''],n?(key?'reported':'yes'):null);
  if(n&&mapBallots[pair]?.length===1&&n.name.toLowerCase()!==title.toLowerCase())top.append(el('span',n.name));
  const header=cardHead(top,title,x.description&&x.description!==title?x.description:x.task);
  const mark=directoryMark(x);
  if(mark){const signature=el('div',null,'card-signature');signature.append(markImage(mark));header.prepend(signature);}
  const when=el('div',null,'card-date');when.append(dateLink(x));top.append(when);
  box.append(header);
  let protocol=null;
  if(x.origin!=='report'){
    protocol=el('dl',null,'task-pair');
    for(const fact of guide?.facts||[{label:T('Given'),value:x.input},{label:T('Result'),value:x.output}])protocol.append(field(fact.label,fact.value,fact.url));
    const score=el('section',null,'score-note');score.append(el('h3',T('Scoring')),el('p',x.assessment,'score-rule'));
    if(guide?.reading)score.append(el('p',guide.reading,'interpretation'));box.append(score);
  }
  if(guide?.compare)box.append(compareLine(recordsById.get(guide.compare),guide.contrast));
  const canonical=pair&&(!n||mapCatalog[pair]===x.slug);
  for(const id of (canonical&&nameGroups.relatedCatalog[pair])||[]){
    if(guide?.compare!==id)box.append(compareLine(recordsById.get(id),id==='gamecraft-bench'?T('Build a playable game instead of playing one.'):''));
  }
  if(canonical&&nameGroups.secondarySources?.[pair]){
    const more=el('details',null,'card-sources');more.append(el('summary',T('Other projects with this name')));
    for(const record of nameGroups.secondarySources[pair]){const item=el('p');item.append(link(zh?record.zh:record.en,record.url,'related-use'));more.append(item);}
    box.append(more);
  }
  box.append(benchmarkBallot(x,ballotConfig));
  reportDetails(box,mapEvidence.catalog[x.slug],'Release reports');
  box.append(sourceNotes(x,n,x.primary_url,guide,protocol));
  box.append(cardFooter(link(x.origin==='report'?T(x.protocol_url?'Protocol source':'Release evidence'):(guide?.action||T('Original source')),x.primary_url),contributionButton(x,n)));
  return box;
}
// Green is a naming verdict, not an edition ID. Never combine votes across
// related tasks, versions, former names or independent projects with the same name.
function openMapEvaluation(n,trigger,selected=null,focusChoice=false){
  const pair=namePair(n),ids=mapBallots[pair],multi=ids.length>1;
  const slug=multi?(ids.includes(selected)?selected:null):ids[0];
  const x=slug?recordsById.get(slug):null;
  const sheet=x?catalogCard(x,n):el('div',null,'detail-sheet name-sheet');
  if(!x){
    sheet.append(cardHead(meta([n.prefix+' × '+n.suffix],mapEvidence.cells[pair]?'reported':'yes'),n.name,n.note));
  }
  sheet.dataset.prefix=n.prefix;sheet.dataset.suffix=n.suffix;
  if(multi){
    const group=el('div',null,x?'edition-choice':'edition-choice bench-ballot'),label=el('label',T(x?'Choose what you’re rating':'Community vote'));
    const select=el('select');select.id='ballot-edition';label.htmlFor=select.id;select.setAttribute('aria-label',T('Choose what you’re rating'));
    select.add(new Option(T('Select a project or edition'),''));select.options[0].disabled=true;
    for(const id of ids){const r=recordsById.get(id),name=r.display_name||r.name;select.add(new Option(zh?(ui[name]||name):name,id));}
    select.value=slug||'';
    select.onchange=()=>{
      const params=new URLSearchParams(),field=$('#names-field').value;
      if(field)params.set('field',field);
      params.set('prefix',n.prefix);params.set('suffix',n.suffix);params.set('edition',select.value);
      history.replaceState(history.state,'','#names?'+params);
      openMapEvaluation(n,trigger,select.value,true);
    };
    group.append(label,select);sheet.querySelector('.card-head').after(group);
  }
  if(!x){
    for(const id of nameGroups.relatedCatalog[pair]||[])sheet.append(compareLine(recordsById.get(id),id==='gamecraft-bench'?T('Build a playable game instead of playing one.'):''));
    const opts=el('div',null,'ballot-options');
    for(const key of ['👍 Recommend','👎 Wouldn’t recommend']){
      const b=el('button',T(key));b.type='button';b.disabled=true;opts.append(b);
    }
    sheet.querySelector('.edition-choice').append(opts);
    const check=el('p',null,'checked-date');check.append(link(T('Name checked {date}',{date:n.checked_on}),nameEvidence(n)));
    sheet.append(check,cardFooter(link(T('Original source'),n.source_url),contributionButton(null,n)));

  }
  presentCard(sheet,trigger);
  if(focusChoice)sheet.querySelector('#ballot-edition')?.focus({preventScroll:true});
}
function nameCard(n,x){
  const box=el('div',null,'detail-sheet name-sheet');
  box.append(cardHead(meta([n.prefix+' × '+n.suffix],'no'),n.name,n.note||T('No same-name AI evaluation found in the recorded searches.')));
  box.append(el('p',T('Checked {date}',{date:n.checked_on}),'checked-date'));
  if(x)box.append(compareLine(x,T('See the documented edition and its scoring.')));
  if(n.source_url)box.append(link(T('Related use'),n.source_url,'related-use'));
  box.append(cardFooter(link(T('Search record'),nameEvidence(n)),contributionButton(null,n)));
  return box;
}
const cardDialog=$('#cell-dialog');
let cardTrigger=null;
function presentCard(content,trigger,rolling=false){
  cardDialog.toggleAttribute('data-picker',rolling);$('#pick-tools').hidden=!rolling;
  cardTrigger=trigger||null;$('#cell-info').replaceChildren(content);
  cardDialog.scrollTop=0;if(!cardDialog.open)cardDialog.showModal();
  if(rolling)$('#roll-again').focus({preventScroll:true});syncLanguageLinks();
}
function openEdition(x,trigger,n=null){
  // Records arrive with the map or directory row. The vote service and release
  // bibliography are independent: neither can delay reading the edition.
  const sheet=catalogCard(x,n);
  if(n){sheet.dataset.prefix=n.prefix;sheet.dataset.suffix=n.suffix;}
  presentCard(sheet,trigger);
}
function dismissCard(){if(cardDialog.open)cardDialog.close();}
cardDialog.querySelector('.close').onclick=dismissCard;
cardDialog.onclick=e=>{
  if(e.target!==cardDialog)return;
  const r=cardDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dismissCard();
};
cardDialog.addEventListener('close',()=>{
  // A link can replace an open card with another before the close event fires.
  if(cardDialog.open)return;
  if(cardTrigger?.isConnected)cardTrigger.focus({preventScroll:true});
  const [page,qs]=location.hash.slice(1).split('?'),params=new URLSearchParams(qs);
  if((page==='browse'&&params.has('entry'))||(page==='names'&&params.has('prefix'))){
    for(const k of ['entry','edition','prefix','suffix','contribute','roll'])params.delete(k);
    history.replaceState(null,'','#'+page+(params.size?'?'+params:''));
  }
  syncLanguageLinks();
});
