const C='yyred-v1';
const CORE=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(hit=>{
    const net=fetch(e.request).then(res=>{
      if(res&&res.ok&&(e.request.url.includes('/images/')||e.request.url.endsWith('index.html')||e.request.url.endsWith('/'))){
        const cl=res.clone();caches.open(C).then(c=>c.put(e.request,cl));
      }
      return res;
    }).catch(()=>hit);
    return hit||net;
  }));
});
