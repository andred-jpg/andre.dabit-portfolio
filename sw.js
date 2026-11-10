const cacheName = 'andre-dabit-portfolio-v1';
const homeUrl = new URL('./', self.registration.scope).href;

self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.add(homeUrl)));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('andre-dabit-portfolio-') && key !== cacheName)
      .map(key => caches.delete(key))
  )));
});

self.addEventListener('fetch', event => {
  if (event.request.mode !== 'navigate') return;
  const url = new URL(event.request.url);
  const home = new URL(homeUrl);
  if (url.origin !== home.origin || ![home.pathname, home.pathname + 'index.html'].includes(url.pathname)) return;
  event.respondWith(fetch(event.request).catch(async () => {
    return await caches.match(homeUrl, {cacheName}) || Response.error();
  }));
});
