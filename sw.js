// 1. Updated Cache Name to match your German project
const CACHE_NAME = 'german-clock-v103'; 
const GH_PATH = '/German-clock2'; 

const ASSETS = [
  `${GH_PATH}/`,
  `${GH_PATH}/index.html`,
  `${GH_PATH}/style.css`,   // Fixed: Matched your HTML link name
  `${GH_PATH}/script.js`,
  `${GH_PATH}/help_en.html`,
  `${GH_PATH}/help_de.html`,
  `${GH_PATH}/manifest.json`
];

// Install: Cache all files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use .addAll to ensure all files are cached for offline use
      return cache.addAll(ASSETS);
    })
  );
});

// Activate: Clean up old caches (prevents "polish-clock" leftovers)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
});

// Fetch: Serve from cache, then network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
