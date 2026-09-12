const CACHE='op-snag-list-v2';
const PREFIX='op-snag-list-';
const ASSETS=[
  './',
  './index.html',
  './manifest.json?v=2',
  './snag-icon-192-v2.png',
  './snag-icon-512-v2.png',
  './apple-touch-icon-snag-v2.png'
];
self.addEventListener('install',e=>e.waitUntil(
  caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())
));
self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(keys=>Promise.all(
    keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k))
  )).then(()=>self.clients.claim())
));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const u=new URL(e.request.url);
  if(u.origin!==location.origin) return;
  e.respondWith(
    fetch(e.request).then(resp=>{
      const copy=resp.clone();
      caches.open(CACHE).then(c=>c.put(e.request,copy));
      return resp;
    }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html')))
  );
});
