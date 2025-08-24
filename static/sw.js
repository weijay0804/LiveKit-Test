// Service Worker for LiveKit Mobile Streaming PWA
const CACHE_NAME = 'livekit-mobile-v1';
const urlsToCache = [
  '/static/index2.html',
  '/static/manifest.json',
  'https://cdn.jsdelivr.net/npm/livekit-client/dist/livekit-client.min.js'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: 快取開啟');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.warn('Service Worker: 快取失敗', err))
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: 刪除舊快取', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  // Skip API calls and external resources that require network
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('livekit.cloud') ||
      event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
      .catch(err => {
        console.warn('Service Worker: 網路請求失敗', err);
        // Return offline page if available
        if (event.request.mode === 'navigate') {
          return caches.match('/static/index2.html');
        }
      })
  );
});

// Handle background sync for reconnection
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: 背景同步觸發');
    // 可以在這裡處理重新連線邏輯
  }
});

// Handle push notifications (for future use)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : '您有新的直播通知',
    icon: '/static/icon-192.png',
    badge: '/static/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '查看直播',
        icon: '/static/icon-check.png'
      },
      {
        action: 'close',
        title: '關閉',
        icon: '/static/icon-close.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('LiveKit 直播', options)
  );
});