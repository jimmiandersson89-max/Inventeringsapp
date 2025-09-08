// ----- Offert På Språng – Inventeringsapp service worker -----
const CACHE_NAME = 'inventering-v9';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './service-worker.js',
  './Icon-512.png'
  // Lägg till './Icon-192.png' om du använder en separat 192-ikon
];

// Installera och cacha kärnfiler
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting(); // aktivera direkt
});

// Rensa gamla cachar när ny version installeras
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim(); // ta kontroll över öppna klienter direkt
});

// Cache-first strategi för GET
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then(cached =>
      cached ||
      fetch(req).then(res => {
        // cachea ny resurs om svar OK
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
        }
        return res;
      }).catch(() => cached) // fallback till cache offline
    )
  );
});
