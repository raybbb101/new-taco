// オフラインでも遊べるようにファイルをキャッシュする
// ファイルを更新したら VERSION を上げる
const VERSION = 'new-taco-1';
const FILES = [
  './', 'index.html', 'style.css', 'manifest.webmanifest',
  'engine.js', 'launcher.js', 'main.js',
  'games/nono-core.js', 'games/nono-art1.js', 'games/nono-art2.js', 'games/nono-art3.js', 'games/nono-art4.js', 'games/nono.js',
  'games/octo-sprites.js', 'games/octo-data.js', 'games/octo.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))));
  self.clients.claim();
});

// ネット優先、つながらなければキャッシュ
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); }
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
