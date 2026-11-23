renderTrendComparison();
const renderDirectory=initDirectory();
initNames();
initTrends();
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
  if(key==='contribute')showContribution();
  if(page==='directory')renderDirectory(new URLSearchParams(qs));
  if(key==='browse')$('#directory').scrollIntoView({behavior:'instant'});
  else if(!first)window.scrollTo({top:0,behavior:'instant'});
}
addEventListener('hashchange',()=>route());route(true);
