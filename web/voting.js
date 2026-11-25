// The shortlist is editorial, not a ranking. Every control uses the directory edition ID.
let voteVisit=null;
const voteField=$('#vote-field');
function applyVoteField(){
  const field=voteField.value;
  for(const group of $('#vote-list').children)group.hidden=Boolean(field&&group.dataset.field!==field);
}
voteField.onchange=()=>{
  applyVoteField();
  history.replaceState(null,'','#vote'+(voteField.value?'?'+new URLSearchParams({field:voteField.value}):''));
  syncLanguageLinks();
};
$('#vote-search').onsubmit=e=>{
  e.preventDefault();const q=$('#vote-query').value.trim();
  location.hash='browse?'+new URLSearchParams(q?{scope:'all',q}:{scope:'all'});
};
function leaveVotingPage(){
  if(!voteVisit)return;
  clearTimeout(voteVisit.timer);voteVisit=null;$('#vote-list').replaceChildren();
}
function showVotingPage(params){
  leaveVotingPage();
  const visit={timer:null}, list=$('#vote-list'), status=$('#vote-round'), slots=[];
  voteVisit=visit;
  const find=link(T('Search all {n} editions →',{n:catalogSize}),'#browse?scope=all&focus=search','vote-jump');
  const tools=$('.vote-tools');tools.querySelector('.vote-jump')?.remove();tools.append(find);
  voteField.replaceChildren(new Option(T('All fields'),''));
  const rows=votingPicks.map(id=>recordsById.get(id));
  for(const domain of domains){
    const entries=rows.filter(x=>x.domain===domain);if(!entries.length)continue;
    voteField.add(new Option(displayDomain(domain),domain));
    const group=el('section',null,'vote-group');group.dataset.field=domain;
    group.append(el('h3',displayDomain(domain)));
    for(const x of entries){
      const row=el('div',null,'vote-row'),label=el('div',null,'vote-label');
      const name=link(x.display_name,'#browse?'+new URLSearchParams({entry:x.slug}));
      label.append(name,el('small',x.task));const slot=el('div',null,'vote-controls');
      row.dataset.edition=x.slug;row.append(label,slot);group.append(row);slots.push([slot,x]);
    }
    list.append(group);
  }
  voteField.value=domains.includes(params.get('field'))?params.get('field'):'';
  applyVoteField();
  status.textContent=T('Checking voting status…');
  if(location.origin!=='https://yiming-shi.com'&&!['localhost','127.0.0.1','[::1]'].includes(location.hostname)){
    status.replaceChildren(link(T('Vote on the public site'),publicBase+'#vote'));return;
  }
  async function load(){
    status.textContent=T('Checking voting status…');
    try{
      const info=await ballotRound(ballotEndpoint(ballotConfig));
      if(visit!==voteVisit)return;
      if(info.campaign!==ballotConfig.id)throw Error('wrong_campaign');
      if(!info.open||Date.parse(info.closesAt)<=Date.now()){
        status.textContent=info.phase==='pending'?T('Voting hasn’t opened yet.'):T('Voting is closed.');return;
      }
      if(!Number.isFinite(Date.parse(info.closesAt)))throw Error('missing_deadline');
      status.textContent=ballotDeadline(info);
      for(const [slot,x] of slots)slot.replaceChildren(benchmarkBallot(x,ballotConfig,info));
      // Stop accepting input in a tab that stays open across the deadline.
      function expire(){
        if(visit!==voteVisit)return;
        const left=Date.parse(info.closesAt)-Date.now();
        if(left>0){visit.timer=setTimeout(expire,Math.min(2147483647,left));return;}
        for(const [slot] of slots)slot.replaceChildren();status.textContent=T('Voting is closed.');
      }
      expire();
    }catch{
      if(visit===voteVisit)status.replaceChildren(document.createTextNode(T('Could not reach the ballot service.')+' '),button(T('Retry'),load,'subtle'));
    }
  }
  load();
}
