// The embedded copy keeps standalone/offline HTML useful. While it streams,
// a click can fetch just the relevant static part, without waiting for the rest.
const arrivedParts=new Set(), readerCache=new Map(), readerRequests=new Map();
function readerArrived(key){
  arrivedParts.add(key);
  const pending=readerRequests.get(key);
  if(pending)pending.inline();
}
function readPart(key){
  if(readerCache.has(key))return Promise.resolve(readerCache.get(key));
  const rev=parts[key];
  if(!rev)return Promise.reject(new Error('Unknown reader part'));
  if(readerRequests.has(key))return readerRequests.get(key).promise;
  const controller=new AbortController();
  let accept,reject;
  const promise=new Promise((ok,no)=>{accept=ok;reject=no;});
  function use(packet){
    if(packet.revision!==rev)throw Error('Reader edition mismatch');
    readerCache.set(key,packet.records);accept(packet.records);controller.abort();
  }
  function inline(){try{use(JSON.parse(document.getElementById('part-'+key).textContent));}catch(e){reject(e);}}
  readerRequests.set(key,{promise,inline});
  if(arrivedParts.has(key))inline();
  else if(document.documentElement.dataset.edition!=='offline'){
    fetch('parts/'+key+'.json?v='+rev,{signal:controller.signal,credentials:'omit'})
      .then(r=>{if(!r.ok)throw Error('Part unavailable');return r.json();})
      .then(use).catch(reject);
  }else if(document.readyState!=='loading')reject(Error('Incomplete offline page'));
  const timer=setTimeout(()=>{controller.abort();reject(Error('Part timed out'));},16000);
  function done(){clearTimeout(timer);readerRequests.delete(key);}
  promise.then(done,done);return promise;
}
