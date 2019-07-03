
let CacheName = 'augm-cache';
let urlsToCache = [
  '/app/augm/Augm.js',
  '/app/augm/Home.js',
  '/app/augm/Main.js',
  '/app/augm/Router.js',
  '/css/font/roboto/Roboto.css'
];

self.addEventListener("install", function (event) {
  event['waitUntil'](
    caches.open(CacheName)                      // Open cache
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache); })   // Cache our files
  );                                           // Confirm whether all the required assets are cached or not.
});

self.addEventListener("activate", function (event) {

});

self.addEventListener("fetch", function (event) {

});