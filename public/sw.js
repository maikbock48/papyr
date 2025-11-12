// PAPYR Service Worker for Push Notifications

const CACHE_NAME = 'papyr-v1';
const urlsToCache = [
  '/',
  '/assets/PAPYR.png',
  '/assets/PAPYR.jpg'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('[Service Worker] Cache failed:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch new
        return response || fetch(event.request);
      })
      .catch(() => {
        // Fallback for offline
        console.log('[Service Worker] Fetch failed, offline mode');
      })
  );
});

// Push event - handle push notifications
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received:', event);

  const defaultData = {
    title: 'PAPYR',
    body: 'Zeit für dein Bekenntnis! 📝',
    icon: '/assets/PAPYR.png',
    badge: '/assets/PAPYR.png',
    data: {
      url: '/'
    }
  };

  let notificationData = defaultData;

  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon || defaultData.icon,
    badge: notificationData.badge || defaultData.badge,
    vibrate: [200, 100, 200],
    tag: 'papyr-notification',
    requireInteraction: false,
    data: notificationData.data || defaultData.data
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title || defaultData.title, options)
  );
});

// Notification click event - open app
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked');
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // If not, open a new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background sync event (for future use)
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  if (event.tag === 'sync-commitments') {
    event.waitUntil(
      // Sync logic here
      Promise.resolve()
    );
  }
});

console.log('[Service Worker] Loaded successfully');
