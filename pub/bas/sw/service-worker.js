
// 1. Current page does not respond with a 200 when offline
// 2. start_url does not respond with a 200 when offline
// 3. Unable to fetch start URL via service worker.
// 4. Does not register a service worker that controls page and start_url
// 5. Percentages row tracks in Home.vue
// 6. Does not redirect HTTP traffic to HTTPS
// 7. Does not use HTTP/2 for all of its resources
// 8. <input placeholder=" Search" id="search" type="text" size="16" class="input">
// 9. 88.8% Legible Text

/*
@font-face {
  font-family: 'Arvo';
  font-display: auto;
  src: local('Arvo'), url(https://fonts.gstatic.com/s/arvo/v9/rC7kKhY-eUDY-ucISTIf5PesZW2xOQ-xsNqO47m55DA.woff2) format('woff2');
}
 */

let CacheName     = 'AugmCache';
// let CacheVersion  = 1;

let CacheUrls = [
  '/app/augm/Augm.js',
  '/app/augm/Home.js',
  '/app/augm/Main.js',
  '/app/augm/Router.js',
  '/css/font/roboto/Roboto.css'
];

self.addEventListener('install', function(event) {
  event['waitUntil'](
    caches.open(CacheName).then(function(cache) {
      return cache.addAll(CacheUrls);
    })
  );
});

self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME];
  event['waitUntil'](
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', function(event) {
  console.log('Handling fetch event for', event['request'].url);

  event['respondWith'](
    caches.open(CacheName).then(function(cache) {
      return cache.match(event['request']).then(function(response) {
        if (response) {
          console.log(' Found response in cache:', response);
          return response;
        }

        // Otherwise, if there is no entry in the cache for event.request, response will be
        // undefined, and we need to fetch() the resource.
        console.log(' No response for %s found in cache. About to fetch ' +
          'from network...', event['request'].url);

        // We call .clone() on the request since we might use it in a call to cache.put() later on.
        // Both fetch() and cache.put() "consume" the request, so we need to make a copy.
        // (see https://fetch.spec.whatwg.org/#dom-request-clone)
        return fetch(event['request'].clone()).then(function(response) {
          console.log('  Response for %s from network is: %O',
            event['request'].url, response);

          if (response.status < 400 &&
              response.headers.has('content-type') &&
              response.headers.get('content-type').match(/^font\//i)) {
            console.log('  Caching the response to', event['request'].url);
            cache.put(event['request'], response.clone());
          } else {
            console.log('  Not caching the response to', event['request'].url);
          }

          // Return the original response object, which will be used to fulfill the resource request.
          return response;
        });
      }).catch(function(error) {
        // This catch() will handle exceptions that arise from the match() or fetch() operations.
        // Note that a HTTP error response (e.g. 404) will NOT trigger an exception.
        // It will return a normal response object that has the appropriate error code set.
        console.error('  Error in fetch handler:', error);

        throw error;
      });
    })
  );
});

/*

let CurrentCaches = {
  html:   'html-cache-v'    + CacheVersion,
  home:   'home-cache-v'    + CacheVersion,
  main:   'main-cache-v'    + CacheVersion,
  router: 'router-cache-v'  + CacheVersion,
  font:   'font-cache-v'    + CacheVersion
};

self.addEventListener('activate', function(event) {
  // Delete all caches that aren't named in CurrentCaches.
  // While there is only one cache in this example, the same logic will handle the case where
  // there are multiple versioned caches.
  let expectedCacheNamesSet = new Set(Object.values(CurrentCaches));
  event['waitUntil'](
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (!expectedCacheNamesSet.has(cacheName)) {
            // If this cache name isn't present in the set of "expected" cache names, then delete it.
            console.log('Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(cacheName)
      .then(cache => cache.match(event.request, {ignoreSearch: true}))
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
 */
