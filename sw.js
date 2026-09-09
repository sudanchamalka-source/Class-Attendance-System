
const CACHE_NAME = 'sudan-sir-app-v1';
const urlsToCache = [
  './',
  './index.html',
  './register.html',
  './admin_fees.html',
  './students_list.html',
  './parent_portal.html',
  './logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
