// The same portable prompt is embedded in the README and the offline site.
const contributeDialog=$('#contribute-dialog'),promptPreview=$('#agent-prompt');
let contributionOpener=null,activeContributionContext='';
function prContext(x,n){
  if(n)return [
    'Name-map correction: '+n.name,
    'Cell: '+n.prefix+' × '+n.suffix+' | Currently: '+(n.status==='used'?'taken':'no exact match found')+' | Checked: '+n.checked_on,
    'Search record: '+nameEvidence(n),
    n.source_url&&'Current evidence: '+n.source_url
  ].filter(Boolean).join('\n');
  if(x)return ['Directory correction: '+(x.display_name||x.name),'Entry ID: '+x.slug,
    'Current card: https://yiming-shi.com/awesome-big-bench/'+recordUrl(x),'Current source: '+x.primary_url].join('\n');
  return '';
}
function contributionText(context){
  return context?agentPrompt+'\n\n'+context:agentPrompt;
}
function showContribution(context='',opener=null,mode='add'){
  const manual=mode==='manual';
  activeContributionContext=context;contributionOpener=opener||$('#contribute-entry');promptPreview.value=contributionText(context);
  $('#contribute-title').textContent=manual&&context?'Correct this entry':'Add a benchmark or fix a record';
  $('#prompt-preview-details').open=manual;
  $('#copy-agent-prompt').textContent='Copy PR prompt';
  $('#contribute-status').textContent=manual?'Select and copy the prompt below.':'';
  if(!contributeDialog.open)contributeDialog.showModal();
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
      $('#contribute-status').textContent='Select and copy the prompt below.';
    }else showContribution(context,b,'manual');
    return;
  }
  b.textContent='Copied';b.setAttribute('aria-label','PR prompt copied');
  if(sheet)$('#contribute-status').textContent='Paste it into your agent with your public source link.';
  clearTimeout(b.restoreCopyLabel);b.restoreCopyLabel=setTimeout(()=>{
    b.textContent='Copy PR prompt';b.removeAttribute('aria-label');
  },3000);
}
function contributionButton(x,n){
  const b=button('Copy PR prompt',()=>copyContribution(b,prContext(x,n)),'copy-pr');
  b.title='Copy this record and a pull-request prompt for your agent';b.setAttribute('aria-live','polite');
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
