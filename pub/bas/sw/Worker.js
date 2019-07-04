var Worker;

Worker = (function() {
  var error;

  class Worker {
    constructor(setup) {
      this.addListeners = this.addListeners.bind(this);
      this.onInstall = this.onInstall.bind(this);
      this.onActivate = this.onActivate.bind(this);
      this.onFetch = this.onFetch.bind(this);
      this.onPush = this.onPush.bind(this);
      this.onSync = this.onSync.bind(this);
      this.onNotificationClick = this.onNotificationClick.bind(this);
      this.setup = setup;
      this.addListeners();
    }

    addListeners() {
      self.addEventListener('install', this.onInstall(event));
      self.addEventListener('activate', this.onActivate(event));
      self.addEventListener('fetch', this.onFetch(event));
      self.addEventListener('push', this.onPush(event));
      self.addEventListener('sync', this.onSync(event));
    }

    onInstall(event) {
      event.waitUntil(caches.open(this.setup.cacheName).then((cache) => {
        this.publish('Install', 'Open Cache Success');
        return cache.addAll(this.setup.cacheUrls);
      }).catch((error) => {
        this.publish('Install', 'Error', error);
      }));
    }

    cacheUrlNotNeeded(cacheUrl) {
      return cacheUrl === '/app/augm/Augm.roll.js';
    }

    onActivate(event) {
      event.waitUntil(caches.keys().then((cacheUrls) => {
        return cacheUrls.filter((cacheurl) => {
          return this.cacheUrlNotNeeded(cacheUrl);
        });
      }).then((cachesToDelete) => {
        return Promise.all(cachesToDelete.map((cacheToDelete) => {
          return caches.delete(cacheToDelete);
        }));
      }).then(() => {
        return self.clients.claim();
      }).catch((error) => {
        this.publish('Activate', 'Error', error);
      }));
    }

    onFetch(event) {
      var request, requestURL;
      request = event.request;
      requestURL = new URL(request.url);
      // Handle requests to a particular host specifically
      if (requestURL.hostname === this.htmlUrl) {
        event.respondWith("some combination of patterns");
      } else if (requestURL.origin === location.origin) { // Routing for local URLs
        if (/^\/article\//.test(requestURL.pathname)) { // Handle article URLs
          event.respondWith("some combination of patterns");
        } else if (/\.webp$/.test(requestURL.pathname)) {
          event.respondWith("some combination of patterns");
        } else if (request.method === 'POST') {
          event.respondWith("some combination of patterns");
        } else if (/cheese/.test(requestURL.pathname)) {
          event.respondWith(new Response("Flagrant cheese error", {
            status: 512 // A sensible default pattern
          }));
        }
      } else {
        event.respondWith(caches.match(request).then((response) => {
          return response || fetch(request);
        }));
      }
    }

    onPush(event) {}

    onSync(event) {}

    onNotificationClick(event) {}

    cacheUrls(jsonUrl) {
      caches.open(jsonUrl).then((cache) => {
        return fetch(url).then((response) => {
          return response.json();
        }).then((urls) => {
          return cache.addAll(urls);
        }).catch((error) => {
          return this.publish('cacheUrls', 'Fetch', error);
        });
      }).catch((error) => {
        return this.publish('cacheUrls', 'Open', error);
      });
    }

  };

  Worker.publish(status, text, error = null)(function() {
    this.setup.stream.publish(status, text, error);
  });

  return Worker;

}).call(this);

export default Worker;
