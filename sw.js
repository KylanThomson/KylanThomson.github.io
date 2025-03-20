// Service Worker for Kylan Thomson's Portfolio Website
const CACHE_NAME = "kylan-thomson-portfolio-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/css/styles.css",
  "/js/main.js",
  "/manifest.json",
  "/favicon.ico",
  "/profile_pic.jpg",
  "/Kylan_Thomson_General_Resume.pdf",
  "/RR_1.jpg",
  "/RR_2.jpg",
  "/RR_3.jpg",
  "/RR_4.jpg",
  "/SM_DB_1.jpg",
  "/SM_DB_2.jpg",
  "/SM_DB_3.jpg",
  "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
  "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css",
];

// Install event - cache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
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
});

// Fetch event - serve from cache, fall back to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }

      // Clone the request
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest).then((response) => {
        // Check if valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          // Don't cache API calls or external resources
          if (event.request.url.indexOf("http") === 0) {
            cache.put(event.request, responseToCache);
          }
        });

        return response;
      });
    })
  );
});

// Handle offline analytics
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-analytics") {
    event.waitUntil(syncAnalytics());
  }
});

// Function to sync analytics data when back online
function syncAnalytics() {
  // Implementation would go here in a real application
  return Promise.resolve();
}
