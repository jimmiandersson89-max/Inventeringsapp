// Enkel cache-first SW för GitHub Pages
const CACHE_NAME = 'inventeringsapp-v2';
const ASSETS = [
  '/Inventeringsapp/',
  '/Inventeringsapp/index.html',
  '/Inventeringsapp/manifest.webmanifest',
  '/Inventeringsapp/service-worker.js',
  '/Inventeringsapp/icon-512.png'
];

// Installera och lägg filer i cache
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

// Rensa gamla cachar vid uppgradering
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache-first för GET
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Fånga navigeringar (SPA/PWA) – serva index vid 404 på djupa länkar
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('/Inventeringsapp/index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
