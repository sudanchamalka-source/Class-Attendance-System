self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('sudan-sir-store').then((cache) => cache.addAll([
      'index.html',
      'parent_portal.html',
      'register.html',
      'admin_fees.html',
      'students_list.html',
      'logo.png',
      'manifest.json'
    ])),
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request)),
  );
});
