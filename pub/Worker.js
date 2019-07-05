var Worker;

Worker = class Worker {
  constructor(manage) {
    this.addListeners = this.addListeners.bind(this);
    //elf.addEventListener('push',     @onPush(     event ) )
    //elf.addEventListener('sync',     @onSync(     event ) )
    this.onInstall = this.onInstall.bind(this);
    this.onActivate = this.onActivate.bind(this);
    this.onFetch = this.onFetch.bind(this);
    this.onGet = this.onGet.bind(this);
    this.manage = manage;
    this.addListeners();
  }

  publish(status, text, error = null) {
    this.manage.stream.publish(status, text, error);
  }

  addListeners() {
    self.addEventListener('install', this.onInstall);
    self.addEventListener('activate', this.onActivate);
    self.addEventListener('fetch', this.onFetch);
    self.addEventListener('fetch', this.onGet);
  }

  onInstall(event) {
    event.waitUntil(caches.open(this.manage.cacheName).then((cache) => {
      this.publish('Install', 'Open Cache Success');
      return cache.addAll(this.manage.cacheUrls);
    }).catch((error) => {
      this.publish('Install', 'Error', error);
    }));
  }

  cacheUrlNotNeeded(cacheUrl) {
    return cacheUrl === '/app/augm/Augm.roll.js';
  }

  onActivate(event) {
    event.waitUntil(caches.keys().then((cacheUrls) => {
      return cacheUrls.filter((cacheUrl) => {
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
    event.respondWith(caches.open(this.manage.cacheName).then((cache) => {
      return cache.match(event.request).then((response) => {
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    }).catch((error) => {
      return this.publish('Fetch', 'Error', error);
    }));
  }

  onGet(event) {
    if (event.request.method !== 'GET') {
      return;
    }
    console.log('Worker.onGet()', event.request);
    event.respondWith(caches.match(event.request).then((cached) => {
      var networked;
      networked = fetch(event.request).then((response) => {
        var cacheCopy;
        cacheCopy = response.clone();
        caches.open(this.manage.cacheName).then((cache) => {
          return cache.put(event.request, cacheCopy);
        });
        return response;
      }).catch(() => {
        return caches.match(this.manage.offlinePage);
      });
      return cached || networked;
    }));
  }

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

self['Worker'] = Worker;
