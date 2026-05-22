// MalleTrack Service Worker v2
const CACHE = 'malletrack-v2';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

// Fetch-Handler: Netzwerk-First, kein Caching (vermeidet Message-Channel-Error)
self.addEventListener('fetch', (e) => {
  // Nur GET-Requests durchlassen, alles andere ignorieren
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

self.addEventListener('push', (e) => {
  const data = e.data ? e.data.json() : {};
  e.waitUntil(
    self.registration.showNotification(data.title || '🌴 MalleTrack', {
      body: data.body || 'Neue Nachricht!',
      vibrate: [200, 100, 200, 100, 200],
      tag: 'malletrack-alert',
      renotify: true,
      data: { url: data.url || self.location.origin }
    })
  );
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data.url || '/'));
});

// Message-Handler: verhindert den "channel closed" Chrome-Bug
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  // Immer antworten um Message-Channel offen zu halten
  if (e.ports && e.ports[0]) {
    e.ports[0].postMessage({ status: 'ok' });
  }
});
