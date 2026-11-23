const zh=document.documentElement.lang==='zh-Hans';
function T(key,values={}){
  const template=zh?ui[key]:key;
  if(template===undefined)throw new Error('Missing UI translation: '+key);
  return template.replace(/\{(\w+)\}/g,(_,k)=>String(values[k]));
}
