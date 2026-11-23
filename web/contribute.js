// The same portable prompt is embedded in the README and the offline site.
const contributeDialog=$('#contribute-dialog'),promptPreview=$('#agent-prompt');
let contributionOpener=null,activeContributionContext='';
function prContext(x,n){
  if(n)return [
    T('Name-map correction: ')+n.name,
    T('Cell: {pair} · {status} · checked {date}',{pair:n.prefix+' × '+n.suffix,status:T(n.status==='used'?'Taken':'Looks open'),date:n.checked_on}),
    T('Search record: ')+nameEvidence(n),
    n.source_url&&T('Current evidence: ')+n.source_url
  ].filter(Boolean).join('\n');
  if(x)return [T('Directory correction: ')+(x.display_name||x.name),T('Entry ID: ')+x.slug,
    T('Current card: ')+publicBase+recordUrl(x),T('Current source: ')+x.primary_url].join('\n');
  return '';
}
function contributionText(context){
  return context?agentPrompt+'\n\n'+context:agentPrompt;
}
function showContribution(context='',opener=null,mode='add'){
  const manual=mode==='manual';
  activeContributionContext=context;contributionOpener=opener||$('#contribute-entry');promptPreview.value=contributionText(context);
  $('#contribute-title').textContent=manual&&context?T('Correct this entry'):T('Add a benchmark or fix a record');
  $('#prompt-preview-details').open=manual;
  $('#copy-agent-prompt').textContent=T('Copy PR prompt');
  $('#contribute-status').textContent=manual?T('Select and copy the prompt below.'):'';
  if(!contributeDialog.open)contributeDialog.showModal();syncLanguageLinks();
  if(manual){promptPreview.focus();promptPreview.select();}
}
async function copyContribution(b,context){
  const value=contributionText(context),sheet=b.id==='copy-agent-prompt';
  try{
    if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(value);
  }catch{
    if(sheet){
      $('#prompt-preview-details').open=true;promptPreview.focus();promptPreview.select();
      $('#contribute-status').textContent=T('Select and copy the prompt below.');
    }else showContribution(context,b,'manual');
    return;
  }
  b.textContent=T('Copied');b.setAttribute('aria-label',T('PR prompt copied'));
  if(sheet)$('#contribute-status').textContent=T('Paste it into your agent with your public source link.');
  clearTimeout(b.restoreCopyLabel);b.restoreCopyLabel=setTimeout(()=>{
    b.textContent=T('Copy PR prompt');b.removeAttribute('aria-label');
  },3000);
}
function contributionButton(x,n){
  const b=button(T('Copy PR prompt'),()=>copyContribution(b,prContext(x,n)),'copy-pr');
  b.title=T('Copy this record and a pull-request prompt for your agent');b.setAttribute('aria-live','polite');
  return b;
}
$('#copy-agent-prompt').onclick=e=>copyContribution(e.currentTarget,activeContributionContext);
$('#contribute-entry').onclick=e=>{
  if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  e.preventDefault();showContribution('',e.currentTarget);
};
contributeDialog.querySelector('.close').onclick=()=>contributeDialog.close();
contributeDialog.onclick=e=>{
  if(e.target!==contributeDialog)return;
  const r=contributeDialog.getBoundingClientRect();
  if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)contributeDialog.close();
};
contributeDialog.addEventListener('close',()=>{
  if(location.hash==='#contribute')history.replaceState(null,'','#names');
  if(contributionOpener?.isConnected)contributionOpener.focus({preventScroll:true});
});
