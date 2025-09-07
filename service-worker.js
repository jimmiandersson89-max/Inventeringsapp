// Enkel cache-first SW för statiska filer
const CACHE_NAME = 'inventering-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './service-worker.js',
  './Icon-512.png'
  // Lägg till './Icon-192.png' om du använder en separat 192-ikon
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Cache-first för GET-förfrågningar
  if (req.method === 'GET') {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req))
    );
  }
});
