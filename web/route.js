const renderDirectory=initDirectory();
const restoreNames=initNames();
let restoreTrends=null,trendVersion=0;
async function enterTrends(params){
  const ticket=++trendVersion;
  if(!restoreTrends){
    const host=$('#plot');
    host.textContent=T('Loading chart…');
    try{
      const chart=await readPart('trends');
      if(ticket!==trendVersion||$('#trends').hidden)return;
      months=chart.months;renderTrendComparison();restoreTrends=initTrends(chart.timeline);
    }catch{
      if(ticket===trendVersion)host.replaceChildren(document.createTextNode(T('Chart unavailable.')+' '),button(T('Retry'),()=>enterTrends(params),'subtle'));return;
    }
  }
  restoreTrends(params);
}
function route(first=false){
  dismissCard();
  if(contributeDialog.open)contributeDialog.close();
  const [key,qs]=(location.hash.slice(1)||'names').split('?');
  // Older shared links now open the name map, not a retired section.
  if(key==='releases')history.replaceState(history.state,'','#names');
  const page=(key==='browse'||key==='directory')?'directory':key==='trends'?'trends':'names';
  document.querySelectorAll('.page').forEach(s=>s.hidden=s.id!==page);
  document.querySelectorAll('nav [data-page]').forEach(n=>{
    if(n.dataset.page===page)n.setAttribute('aria-current','page');else n.removeAttribute('aria-current');
  });
  const params=new URLSearchParams(qs);
  if(page==='directory')renderDirectory(params);
  if(page==='names')restoreNames(params);
  if(page==='trends')enterTrends(params);
  if(key==='contribute')showContribution();
  else if(params.get('contribute')==='1'){
    const sheet=$('#cell-info .detail-sheet'),n=sheet?.dataset.prefix?names.find(r=>r.prefix===sheet.dataset.prefix&&r.suffix===sheet.dataset.suffix):null;
    const x=recordsById.get(sheet?.dataset.entry);
    showContribution(prContext(x,n),sheet?.querySelector('.copy-pr')||null,sheet?'manual':'add');
  }
  syncLanguageLinks();
  if(key==='browse')$('#directory').scrollIntoView({behavior:'instant'});
  else if(!first)window.scrollTo({top:0,behavior:'instant'});
}
// A language change is a normal navigation, not a second catalog or ballot.
// Serialize the visible view, including dialogs opened without changing the URL.
function syncLanguageLinks(){
  const visible=Array.from(document.querySelectorAll('main>.page')).find(p=>!p.hidden)?.id||'names';
  const sheet=cardDialog.open?$('#cell-info .detail-sheet'):null;
  let page=visible==='directory'?'browse':visible;
  const p=new URLSearchParams();
  if(page==='names'&&sheet?.dataset.entry&&!sheet.dataset.prefix)page='browse';
  if(page==='names'){
    if($('#names-field').value)p.set('field',$('#names-field').value);
    if(sheet?.dataset.prefix){p.set('prefix',sheet.dataset.prefix);p.set('suffix',sheet.dataset.suffix);if(cardDialog.hasAttribute('data-picker'))p.set('roll','1');}
  }
  if(page==='browse'){
    const d=$('#mobile-domain').value,q=$('#query').value.trim();
    if(visible==='directory'){
      if(d&&d!=='All domains')p.set('domain',d);
      if(q)p.set('q',q);
      if($('#scope-all').getAttribute('aria-pressed')==='true')p.set('scope','all');
      else if(q)p.set('scope','featured');
      if($('#directory-order').value==='new')p.set('order','new');
    }
    if(sheet?.dataset.entry)p.set('entry',sheet.dataset.entry);
  }
  if(page==='trends'){
    for(const [k,id] of [['field','trend-domain'],['compare','trend-other'],['period','trend-window'],['year','year-select']]){
      const v=$('#'+id).value;if(v)p.set(k,v);
    }
    const m=months[Number($('#month-pick').value)];if(m)p.set('month',m.month);
  }
  if(contributeDialog.open){if(!sheet&&!activeContributionContext){page='contribute';}else{p.set('contribute','1');}}
  const h='#'+page+(p.size?'?'+p:'');
  for(const a of document.querySelectorAll('.language-switch')){
    const url=location.protocol==='file:'?new URL(zh?'awesome-big-bench-en.html':'awesome-big-bench-zh.html',location.href):new URL(a.href,location.href);
    url.hash=h;a.href=url.href;
  }
}
for(const event of ['focusin','pointerdown','contextmenu','click']){
  document.addEventListener(event,e=>{if(e.target.closest?.('.language-switch'))syncLanguageLinks();},true);
}
addEventListener('hashchange',()=>route());route(true);
