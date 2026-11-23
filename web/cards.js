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
  const a=link((upper?'By ':'')+d,x.date_source_url,'entry-date');a.title=(human[x.date_basis]||'Dated evidence')+': '+d;return a;
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
function sourceNotes(x,n,primary,guide,extra=null){
  const d=el('details',null,'card-sources');d.append(el('summary',extra?'Protocol & sources':'Sources'));
  const facts=el('p',null,'source-facts');facts.append(document.createTextNode('Date evidence: '),dateLink(x));
  if(x.date_note)facts.append(document.createTextNode(' · '+x.date_note));
  if(x.first_author_affil)facts.append(document.createTextNode(' · '+x.first_author_affil));
  if(extra)d.append(extra);d.append(facts);
  const mark=directoryMark(x);
  if(mark){
    const credit=el('p',null,'source-facts');credit.append(document.createTextNode(mark.kind+': '),link(mark.credit,mark.credit_url),document.createTextNode(' · '),link(mark.license,mark.license_url),document.createTextNode(' · '+mark.changes));d.append(credit);
  }
  if(n?.note)d.append(el('p',n.note,'source-facts'));
  const links=new Map();
  function add(label,url){if(!url||url===primary)return;if(!links.has(url))links.set(url,[]);links.get(url).push(label);}
  add('Scoring',x.protocol_url);add('Date',x.date_source_url);add('Affiliation',x.affil_source_url);
  for(const ev of x.alternative_dates||[]){add((ev.date_basis==='tag'?'Tag': 'Dated record')+' · '+ev.date,ev.url);}
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
  const title=x.display_name||x.name;
  const top=meta([x.domain,guide?.kind&&guide.kind!=='Task suite'?guide.kind:''],n?(key?'reported':'yes'):null);
  const header=cardHead(top,title,x.description&&x.description!==title?x.description:null);
  const mark=directoryMark(x);
  if(mark){const signature=el('div',null,'card-signature');signature.append(markImage(mark));header.prepend(signature);}
  const when=el('div',null,'card-date');when.append(dateLink(x));top.append(when);
  box.append(header);
  let protocol=null;
  if(x.origin!=='report'){
    protocol=el('dl',null,'task-pair');
    for(const fact of guide?.facts||[{label:'Given',value:x.input},{label:'Result',value:x.output}])protocol.append(field(fact.label,fact.value,fact.url));
    const score=el('section',null,'score-note');score.append(el('h3','Scoring'),el('p',x.assessment,'score-rule'));
    if(guide?.reading)score.append(el('p',guide.reading,'interpretation'));box.append(score);
  }else if(!x.description&&x.task){header.append(el('p',x.task,'card-lead'));}
  if(guide?.compare)box.append(compareLine(recordsById.get(guide.compare),guide.contrast));
  for(const id of (pair&&nameGroups.relatedCatalog[pair])||[]){
    if(guide?.compare!==id)box.append(compareLine(recordsById.get(id)));
  }
  reportDetails(box,key,n?'Family release reports':'Release reports');
  box.append(sourceNotes(x,n,x.primary_url,guide,protocol));
  box.append(cardFooter(link(x.origin==='report'?(x.protocol_url?'Protocol source':'Release evidence'):(guide?.action||'Original source'),x.primary_url),contributionButton(x,n)));
  return box;
}
function nameCard(n,x){
  const pair=namePair(n),used=n.status==='used',key=mapEvidence.cells[pair];
  // A naming cell is evidence for a family, not proof of using every release.
  if(x&&x.display_name!==n.name&&x.series.toLowerCase()===n.name.toLowerCase()&&catalog.filter(r=>r.series===x.series).length>1){
    const box=el('div',null,'detail-sheet name-sheet');
    box.append(cardHead(meta([n.prefix+' × '+n.suffix],key?'reported':'yes'),n.name,n.note));
    box.append(link('Browse '+x.series+' editions','#browse?'+new URLSearchParams({domain:x.domain,q:x.series}),'related-use'));
    for(const id of nameGroups.relatedCatalog[pair]||[])box.append(compareLine(recordsById.get(id)));
    reportDetails(box,key,'Family release reports');
    const check=el('p',null,'checked-date');check.append(link('Name checked '+n.checked_on,nameEvidence(n)));box.append(check);
    box.append(cardFooter(link('Original source',n.source_url),contributionButton(null,n)));return box;
  }
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
    contributionButton(null,n)));
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
