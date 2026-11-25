// Optional evidence, trends and the complete directory are cached per revision.
// Opening a card from a visible row does not use this loader.
const arrivedParts=new Set(), readerCache=new Map(), readerRequests=new Map();
function readerArrived(key){
  arrivedParts.add(key);
  readerRequests.get(key)?.inline();
}
function readPart(key){
  if(readerCache.has(key))return Promise.resolve(readerCache.get(key));
  const rev=parts[key];
  if(!rev)return Promise.reject(Error('Unknown reader part'));
  if(readerRequests.has(key))return readerRequests.get(key).promise;
  let accept,reject;
  const promise=new Promise((ok,no)=>{accept=ok;reject=no;});
  function use(packet){
    if(packet.revision!==rev||!packet.records)throw Error('Reader edition mismatch');
    readerCache.set(key,packet.records);accept(packet.records);
  }
  function inline(){try{use(JSON.parse(document.getElementById('part-'+key).textContent));}catch(e){reject(e);}}
  readerRequests.set(key,{promise,inline});
  if(document.documentElement.dataset.edition==='offline'){
    if(arrivedParts.has(key))inline();
    else if(document.readyState!=='loading')reject(Error('Incomplete offline page'));
  }else{
    const url=key==='directory-index'?'parts/directory-index.'+rev+'.json':'parts/'+key+'.json?v='+rev;
    (async()=>{
      for(let attempt=0;attempt<2;attempt++){
        const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),attempt?20000:12000);
        try{
          const r=await fetch(url,{signal:controller.signal,credentials:'omit',cache:attempt?'reload':'default'});
          if(!r.ok){const e=Error('Part unavailable');e.permanent=r.status<500&&![408,429].includes(r.status);throw e;}
          use(await r.json());return;
        }catch(e){if(attempt||e.permanent)throw e;}
        finally{clearTimeout(timer);}
      }
    })().catch(reject);
  }
  // A truncated offline download should not leave a pending request forever.
  const limit=document.documentElement.dataset.edition==='offline'?setTimeout(()=>reject(Error('Missing offline part')),16000):null;
  function done(){if(limit!==null)clearTimeout(limit);readerRequests.delete(key);}
  promise.then(done,done);return promise;
}
