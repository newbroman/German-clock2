const CACHE_NAME = 'polish-clock-v87 ';
// IMPORTANT: Update this to your GitHub repository name
const GH_PATH = '/German-clock2'; 

const ASSETS = [
  `${GH_PATH}/`,
  `${GH_PATH}/index.html`,
  `${GH_PATH}/styles.css`,
  `${GH_PATH}/script.js`,
  `${GH_PATH}/help_en.html`,
  `${GH_PATH}/help_de.html`,
  `${GH_PATH}/manifest.json`
];

// Install: Cache all files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
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
});const CACHE_NAME = 'polish-time-v40 ;
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// Install Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Fetch Assets
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
