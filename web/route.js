renderCover();
const renderDirectory=initDirectory();
initNames();
initTrends();
function route(first=false){
  const [key,qs]=(location.hash.slice(1)||'directory').split('?');
  const page=['names','trends'].includes(key)?key:'directory';
  document.querySelectorAll('.page').forEach(s=>s.hidden=s.id!==page);
  document.querySelectorAll('nav [data-page]').forEach(n=>{
    if(n.dataset.page===page)n.setAttribute('aria-current','page');else n.removeAttribute('aria-current');
  });
  if(page==='directory')renderDirectory(new URLSearchParams(qs));
  if(key==='browse')$('#browse').scrollIntoView({behavior:'instant'});
  else if(!first)window.scrollTo({top:0,behavior:'instant'});
}
addEventListener('hashchange',()=>route());route(true);
