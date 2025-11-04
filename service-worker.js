// Service Worker for Farm Weather Advisory PWA
const CACHE_NAME = 'farm-weather-v1';
const urlsToCache = [
  '/Farm_Weather/',
  '/Farm_Weather/index.html',
  '/Farm_Weather/dashboard.html',
  '/Farm_Weather/dashboard_iot.html',
  '/Farm_Weather/login.html',
  '/Farm_Weather/register.html',
  '/Farm_Weather/js/dashboard.js',
  '/Farm_Weather/js/dashboard_iot.js',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          (response) => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-irrigation-data') {
    event.waitUntil(syncIrrigationData());
  }
});

// Push notification handler
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/Farm_Weather/icons/icon-192x192.png',
    badge: '/Farm_Weather/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/Farm_Weather/dashboard.html'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

// Helper function for syncing data
async function syncIrrigationData() {
  // Sync any pending irrigation logs or profile updates
  console.log('Syncing irrigation data...');
}
