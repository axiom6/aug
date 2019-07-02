self.addEventListener("activate", function(event) {
  let setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches
      .open(cacheName)
      .then(function(cache) {
        return cache.keys().then(function(existingRequests) {
          return Promise.all(
            existingRequests.map(function(existingRequest) {
              if (!setOfExpectedUrls.has(existingRequest.url)) {
                return cache.delete(existingRequest);
              }
            })
          );
        });
      })
      .then(function() {
        return self.clients.claim();
      })
  );
});