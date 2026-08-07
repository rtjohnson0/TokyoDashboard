// Caches every photo the app loads, so once you've seen a place's card
// once (with signal), its photo keeps working forever with none.
// Everything else (the page itself, Firestore syncing, live API lookups)
// passes straight through untouched — this only touches images.

const IMAGE_CACHE = 'trip-images-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (req.destination !== 'image') return; // only intercept <img> loads

  event.respondWith(
    caches.open(IMAGE_CACHE).then(async (cache) => {
      const cached = await cache.match(req);
      if (cached) return cached;
      try {
        const res = await fetch(req);
        // Cache successful responses, including opaque cross-origin ones
        if (res && (res.ok || res.type === 'opaque')) {
          cache.put(req, res.clone());
        }
        return res;
      } catch (err) {
        // Offline and never cached — let it fail; the app's own
        // onerror handler already falls back to a clean placeholder.
        return cached || Response.error();
      }
    })
  );
});
