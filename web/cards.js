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
  const box=el('div',null,'detail-sheet');box.dataset.entry=x.slug;const guide=readingNotes[x.slug],pair=n&&namePair(n);
  const key=n?mapEvidence.cells[pair]:mapEvidence.catalog[x.slug];
  const title=x.display_name||x.name;
  const top=meta([displayDomain(x.domain),guide?.kind&&!['Task suite','任务集','任务套件'].includes(guide.kind)?guide.kind:''],n?(key?'reported':'yes'):null);
  const header=cardHead(top,title,x.description&&x.description!==title?x.description:null);
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
  }else if(!x.description&&x.task){header.append(el('p',x.task,'card-lead'));}
  if(guide?.compare)box.append(compareLine(recordsById.get(guide.compare),guide.contrast));
  for(const id of (pair&&nameGroups.relatedCatalog[pair])||[]){
    if(guide?.compare!==id)box.append(compareLine(recordsById.get(id)));
  }
  box.append(benchmarkBallot(x,ballotConfig));
  reportDetails(box,key,n?'Family release reports':'Release reports');
  box.append(sourceNotes(x,n,x.primary_url,guide,protocol));
  box.append(cardFooter(link(x.origin==='report'?T(x.protocol_url?'Protocol source':'Release evidence'):(guide?.action||T('Original source')),x.primary_url),contributionButton(x,n)));
  return box;
}
function isFamilyName(n,x){
  return x&&x.display_name!==n.name&&x.series.toLowerCase()===n.name.toLowerCase()&&catalog.filter(r=>r.series===x.series).length>1;
}
function isCatalogName(n,x){return !isFamilyName(n,x)&&x.name.toLowerCase().replaceAll('’',"'")===n.name.toLowerCase().replaceAll('’',"'");}
function nameCard(n,x){
  const pair=namePair(n),used=n.status==='used',key=mapEvidence.cells[pair];
  if(isFamilyName(n,x)){
    const box=el('div',null,'detail-sheet name-sheet');
    box.append(cardHead(meta([n.prefix+' × '+n.suffix],key?'reported':'yes'),n.name,n.note));
    box.append(link(T('Browse {series} editions',{series:x.series}),'#browse?'+new URLSearchParams({domain:x.domain,q:x.series}),'related-use'));
    for(const id of nameGroups.relatedCatalog[pair]||[])box.append(compareLine(recordsById.get(id)));
    reportDetails(box,key,'Family release reports');
    const check=el('p',null,'checked-date');check.append(link(T('Name checked {date}',{date:n.checked_on}),nameEvidence(n)));box.append(check);
    box.append(cardFooter(link(T('Original source'),n.source_url),contributionButton(null,n)));return box;
  }
  // A related edition does not establish an exact name match.
  const box=el('div',null,'detail-sheet name-sheet');
  const lead=n.note||(T(used?'A same-name AI evaluation is documented.':'No same-name AI evaluation found in the recorded searches.'));
  box.append(cardHead(meta([n.prefix+' × '+n.suffix],key?'reported':used?'yes':'no'),n.name,lead));
  const date=el('p',T('Checked {date}',{date:n.checked_on}),'checked-date');box.append(date);
  if(x)box.append(compareLine(x,T('See the documented edition and its scoring.')));
  if(!used&&n.source_url)box.append(link(T('Related use'),n.source_url,'related-use'));
  reportDetails(box,key,'Family release reports');
  if(used)box.append(link(T('Search record'),nameEvidence(n),'related-use'));
  box.append(cardFooter(link(T(used?'Original source':'Search record'),used?n.source_url:nameEvidence(n)),
    contributionButton(null,n)));
  return box;
}
const cardDialog=$('#cell-dialog');
let cardTrigger=null;
function presentCard(content,trigger){
  cardTrigger=trigger||null;$('#cell-info').replaceChildren(content);
  cardDialog.scrollTop=0;if(!cardDialog.open)cardDialog.showModal();syncLanguageLinks();
}
function openEdition(x,trigger,n=null){
  const sheet=el('div',null,'detail-sheet'), title=x.display_name||x.name;
  sheet.dataset.entry=x.slug;if(n){sheet.dataset.prefix=n.prefix;sheet.dataset.suffix=n.suffix;}
  const status=el('p',T('Loading details…'),'card-lead');status.setAttribute('role','status');
  sheet.append(cardHead(meta([displayDomain(x.domain)],null),title),status,cardFooter(link(T('Original source'),x.primary_url),contributionButton(x,n)));
  presentCard(sheet,trigger);
  async function read(){
    try{
      const part=await readPart('cards-'+domains.indexOf(x.domain));
      if(!sheet.isConnected||!cardDialog.open)return;
      if(!Object.hasOwn(part,x.slug))throw Error('Missing edition');
      const full=catalogCard({...x,...part[x.slug]},n);
      if(n){full.dataset.prefix=n.prefix;full.dataset.suffix=n.suffix;}
      // Keep keyboard focus on the corresponding action if it was used while loading.
      const focused=sheet.contains(document.activeElement)?document.activeElement:null;
      sheet.replaceWith(full);
      if(focused)full.querySelector(focused.matches('.copy-pr')?'.copy-pr':'.card-footer a')?.focus({preventScroll:true});
    }catch{
      if(sheet.isConnected)status.replaceChildren(document.createTextNode(T('Details could not be loaded.')+' '),button(T('Retry'),read,'subtle'));
    }
  }
  read();
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
    for(const k of ['entry','prefix','suffix','contribute'])params.delete(k);
    history.replaceState(null,'','#'+page+(params.size?'?'+params:''));
  }
  syncLanguageLinks();
});
