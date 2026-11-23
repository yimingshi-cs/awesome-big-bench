// One reading card for the directory, field references, and exact catalog matches on the map.
const recordsById=new Map(catalog.map(x=>[x.slug,x]));
const recordUrl=x=>'#browse?'+new URLSearchParams({domain:x.domain,q:x.name,entry:x.slug});
const namePair=n=>n.prefix+'|'+n.suffix;
const nameAnchor=s=>s==='²'?'squared':s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const nameEvidence=n=>gh('verification/matrix/'+nameAnchor(n.prefix)+'.md#'+nameAnchor(n.suffix));

function nameCorrection(n){
  const used=n.status==='used';
  const body='**Name:** '+n.name+'\n**Combination:** '+n.prefix+' × '+n.suffix+'\n**Listed as:** '+(used?'same-name AI benchmark':'no exact AI benchmark found')+'\n\n**Primary source:**\n\n**What should change?**\n';
  return issue(n.name+': name check','name')+'&body='+encodeURIComponent(body);
}
function cardHead(group,title,lead){
  const h=el('div',null,'card-head'),name=el('h2',title);name.id='cell-title';
  h.append(group,name);if(lead)h.append(el('p',lead,'card-lead'));
  return h;
}
function meta(parts,mark){
  const b=el('div',null,'card-meta');
  if(mark)b.append(el('span',mark==='no'?'Looks open':'Taken','badge '+mark));
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
  line.append(el('span','Compare ','compare-label'),link(x.name,recordUrl(x)));
  if(text)line.append(document.createTextNode(' — '+text));
  return line;
}
function sourceNotes(x,n,primary,guide){
  const d=el('details',null,'card-sources');d.append(el('summary','Sources & dates'));
  const facts=el('p',null,'source-facts');facts.append(el('time','Documented '+x.date));
  if(x.first_author_affil)facts.append(document.createTextNode(' · '+x.first_author_affil));
  d.append(facts);
  if(n?.note)d.append(el('p',n.note,'source-facts'));
  const links=new Map();
  function add(label,url){if(!url||url===primary)return;if(!links.has(url))links.set(url,[]);links.get(url).push(label);}
  add('Scoring',x.protocol_url);add('Date',x.date_source_url);add('Affiliation',x.affil_source_url);
  add('Mark provenance',x.logo_source_url);if(guide)add('Interpretation',guide.url);
  if(n){add('Name source',n.source_url);add('Name check · '+n.checked_on,nameEvidence(n));}
  {
    const items=el('div',null,'source-list');items.append(link('Link to this card',recordUrl(x)));
    for(const [url,labels] of links)items.append(link(labels.join(' / '),url));
    d.append(items);
  }
  return d;
}
function catalogCard(x,n=null){
  const box=el('div',null,'detail-sheet'),guide=readingNotes[x.slug],pair=n&&namePair(n);
  const key=n?mapEvidence.cells[pair]:mapEvidence.catalog[x.slug];
  const subtitle=guide?.kind&&guide.kind!=='Task suite'?guide.kind:x.task;
  box.append(cardHead(meta([x.domain,subtitle],n?(key?'reported':'yes'):null),x.name,x.description));
  const io=el('dl',null,'task-pair');
  const facts=guide?.facts||[{label:'Given',value:x.input},{label:'Must produce',value:x.output}];
  for(const fact of facts)io.append(field(fact.label,fact.value,fact.url));
  box.append(io);
  const score=el('section',null,'score-note');score.append(el('h3','Reading the score'),el('p',x.assessment,'score-rule'));
  if(guide?.reading)score.append(el('p',guide.reading,'interpretation'));box.append(score);
  if(guide?.compare)box.append(compareLine(recordsById.get(guide.compare),guide.contrast));
  for(const id of (pair&&nameGroups.relatedCatalog[pair])||[]){
    if(guide?.compare!==id)box.append(compareLine(recordsById.get(id)));
  }
  reportDetails(box,key,n?'Family release reports':'Release reports');
  box.append(sourceNotes(x,n,x.primary_url,guide));
  const edit=n?nameCorrection(n):issue(x.name+': correction','benchmark');
  box.append(cardFooter(link(guide?.action||'Original source',x.primary_url),link('Suggest a correction',edit)));
  return box;
}
function nameCard(n,x){
  const pair=namePair(n),used=n.status==='used',key=mapEvidence.cells[pair];
  // A version in the directory may be related without being the exact named test.
  if(x&&x.name.toLowerCase().replaceAll('’',"'")===n.name.toLowerCase().replaceAll('’',"'"))return catalogCard(x,n);
  const box=el('div',null,'detail-sheet name-sheet');
  const lead=n.note||(used?'A same-name AI evaluation is documented.':'No same-name AI evaluation found in the recorded searches.');
  box.append(cardHead(meta([n.prefix+' × '+n.suffix],key?'reported':used?'yes':'no'),n.name,lead));
  const date=el('p','Checked '+n.checked_on,'checked-date');box.append(date);
  if(x)box.append(compareLine(x,'See the documented edition and its scoring.'));
  if(!used&&n.source_url)box.append(link('Related use',n.source_url,'related-use'));
  reportDetails(box,key,'Family release reports');
  if(used)box.append(link('Search record',nameEvidence(n),'related-use'));
  box.append(cardFooter(link(used?'Original source':'Search record',used?n.source_url:nameEvidence(n)),
    link(used?'Suggest a correction':'Found a match?',nameCorrection(n))));
  return box;
}
const cardDialog=$('#cell-dialog');
let cardTrigger=null;
function presentCard(content,trigger){
  cardTrigger=trigger||null;$('#cell-info').replaceChildren(content);
  cardDialog.scrollTop=0;if(!cardDialog.open)cardDialog.showModal();
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
  if(page==='browse'&&params.has('entry')){
    params.delete('entry');history.replaceState(null,'','#browse'+(params.size?'?'+params:''));
  }
});
