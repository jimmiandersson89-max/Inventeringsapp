// Cache-first SW (bumpa version när du ändrar index)
const CACHE_NAME = 'inventering-v16';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './service-worker.js',
  './Icon-512.png' // filnamnet i din repo är gemener: "icon-512.png"
];

// Installera och cacha baskällor
self.addEventListener('install', (event) => {
  self.skipWaiting(); // ta över direkt
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

// Aktivera och rensa gamla cacher
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Cache-first för GET
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req))
  );
});
