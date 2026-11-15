const CACHE = 'scentify-v2';

// Only cache truly static assets (icons, manifest) — never JS/CSS bundles.
// Vite hashes JS/CSS filenames on every build, so stale cache entries for old
// hashes would never be hit anyway, but caching them wastes space and can
// cause hard-to-debug blank screens when a cached index.html references a
// hash that is not in the cache yet.
const STATIC_ASSETS = ['/', '/manifest.json', '/favicon.svg', '/pwa-icon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);

  if (e.request.mode === 'navigate') {
    // SPA: always serve fresh index.html, fall back to cache offline
    e.respondWith(
      fetch(e.request).catch(() => caches.match('/'))
    );
    return;
  }

  // JS/CSS bundles have hashed filenames — always fetch from network so a
  // new deploy is never blocked by a stale cache entry.
  if (url.pathname.startsWith('/assets/')) {
    e.respondWith(fetch(e.request));
    return;
  }

  // Cache-first for icons, manifest, images, etc.
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      });
    })
  );
});
