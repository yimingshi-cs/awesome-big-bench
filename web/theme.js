// Runs in the head, before paint. All times are the visitor's local clock.
(()=>{
  const key='abb:appearance',root=document.documentElement;
  function saved(){try{return localStorage.getItem(key);}catch{return null;}}
  function modeOf(value){return value==='light'||value==='dark'?value:'auto';}
  let mode=modeOf(saved()),timer;
  function apply(){
    clearTimeout(timer);
    const now=new Date(),h=now.getHours(),night=mode==='auto'?(h>=21||h<7):mode==='dark';
    root.dataset.theme=night?'dark':'light';root.dataset.appearance=mode;
    root.style.colorScheme=root.dataset.theme;
    const bar=document.querySelector('meta[name="theme-color"]');if(bar)bar.content=night?'#111916':'#fdfefd';
    const select=document.getElementById('appearance-mode');if(select)select.value=mode;
    if(mode==='auto'){
      const next=new Date(now.getFullYear(),now.getMonth(),now.getDate()+(h>=21?1:0),h<7||h>=21?7:21);
      timer=setTimeout(apply,next-now);
    }
  }
  apply();
  document.addEventListener('DOMContentLoaded',apply,{once:true});
  document.addEventListener('change',event=>{
    if(event.target.id!=='appearance-mode')return;
    mode=modeOf(event.target.value);
    try{if(mode==='auto')localStorage.removeItem(key);else localStorage.setItem(key,mode);}catch{}
    apply();
  });
  addEventListener('storage',event=>{if(event.key===key||event.key===null){mode=modeOf(saved());apply();}});
  addEventListener('pageshow',apply);addEventListener('focus',apply);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)apply();});
})();
