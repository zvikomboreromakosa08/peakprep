const CACHE_NAME = 'peakprep-v2';
const urlsToCache = [
  '/',
  '/past-papers.html',
  '/view-paper.html',
  '/assets/data/past-papers.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});
