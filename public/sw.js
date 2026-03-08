const STATIC_CACHE = 'todayshop-static-v1';
const RUNTIME_CACHE = 'todayshop-runtime-v1';
const OFFLINE_URL = '/offline.html';

const PRECACHE_URLS = [
  '/',
  OFFLINE_URL,
  '/manifest.webmanifest',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/apple-touch-icon.png',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/maskable-icon-512x512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => ![STATIC_CACHE, RUNTIME_CACHE].includes(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);

  try {
    const response = await fetch(request);

    if (response.ok && request.method === 'GET') {
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }

    return caches.match(OFFLINE_URL);
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok && request.method === 'GET') {
        cache.put(request, response.clone());
      }

      return response;
    })
    .catch(() => cached);

  return cached || networkPromise;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  if (url.origin !== self.location.origin) {
    return;
  }

  if (
    url.pathname.startsWith('/_next/static/') ||
    ['style', 'script', 'worker', 'font', 'image'].includes(request.destination)
  ) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});
