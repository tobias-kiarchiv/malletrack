// MalleTrack Service Worker
const CACHE = 'malletrack-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || '🌴 MalleTrack', {
      body: data.body || 'Neue Nachricht!',
      icon: data.icon || '/favicon.ico',
      vibrate: [200, 100, 200, 100, 200],
      tag: 'malletrack-alert',
      renotify: true,
      data: { url: data.url || self.location.origin }
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url || '/'));
});
