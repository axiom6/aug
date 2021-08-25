var Worker,
  hasProp = {}.hasOwnProperty;

Worker = class Worker {
  constructor() {
    this.publish = this.publish.bind(this);
    this.onCatch = this.onCatch.bind(this);
    this.onInstall = this.onInstall.bind(this);
    this.onInstallAll = this.onInstallAll.bind(this);
    this.cacheUrlNotNeeded = this.cacheUrlNotNeeded.bind(this);
    this.onActivate = this.onActivate.bind(this);
    this.onFetch = this.onFetch.bind(this);
    this.onGet = this.onGet.bind(this);
    
    // For now this is just an example
    // Needs to be registered
    this.onPush = this.onPush.bind(this);
    
    // MDN says that sync may not progress to W3C standard
    // Needs to be registered
    this.onSync = this.onSync.bind(this);
    this.logPub = false;
    this.cacheUrls = this.toCacheUrls(Worker.cacheObjs); //    1200 = 20 min
    this.cacheOpts = {
      headers: {
        'Cache-Control': 'public, max-age=1200' // 2592000 = 30 days
      }
    };
    // console.log( 'Worker.self', self )
    this.addEventListeners();
  }

  toCacheUrls(objs) {
    var key, obj, urls;
    urls = [];
    for (key in objs) {
      if (!hasProp.call(objs, key)) continue;
      obj = objs[key];
      urls.push(obj.url);
    }
    return urls;
  }

  publish(name, status, obj = null) {
    if (this.logPub) {
      if (obj != null) {
        console.log(name, status, obj);
      } else {
        console.log(name, status);
      }
    }
  }

  onCatch(name, status, error) {
    console.log(name, status, error);
  }

  onInstall(event) {
    event.waitUntil(caches.open(Worker.cacheName).then((cache) => {
      var key, obj, ref;
      this.publish('Install', '------ Open ------');
      ref = Worker.cacheObjs;
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        obj = ref[key];
        fetch(obj.url, this.cacheOpts).then((response) => {
          this.publish('  Install', response.url);
          return cache.put(response.url, response);
        });
      }
    }).catch((error) => {
      this.onCatch('Install', 'Error', error);
    }));
  }

  onInstallAll(event) {
    event.waitUntil(caches.open(Worker.cacheName).then((cache) => {
      this.publish('InstallAll', 'Success', {
        cacheName: Worker.cacheName
      });
      return cache.addAll(this.cacheUrls);
    }).catch((error) => {
      this.onCatch('InstallAll', 'Error', error);
    }));
  }

  cacheUrlNotNeeded(cacheUrl) {
    return true;
  }

  onActivate(event) {
    event.waitUntil(caches.keys().then((cacheUrls) => {
      this.cacheUrls = cacheUrls;
      return this.cacheUrls.filter((cacheUrl) => {
        return this.cacheUrlNotNeeded(cacheUrl);
      });
    }).then((cachesToDelete) => {
      return Promise.all(cachesToDelete.map((cacheToDelete) => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => {
      self.clients.claim();
      return this.publish('Activate', 'Called');
    }).catch((error) => {
      this.onCatch('Activate', 'Error', error);
    }));
  }

  onFetch(event) {
    console.log('Worker.onFetch()', event.request.url);
    if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
      return;
    }
    if (event.request.url === 'http://localhost:3000/index.html?source=pwa') {
      return;
    }
    event.respondWith(caches.open(Worker.cacheName).then((cache) => {
      return cache.match(event.request, {
        ignoreSearch: true
      }).then((response) => {
        return response || fetch(event.request, this.cacheOpts).then((response) => {
          cache.put(event.request, response.clone());
          this.publish('Fetch', event.request.url);
          return response;
        });
      });
    }).catch((error) => {
      return this.onCatch('Fetch', event.request.url, error);
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
        caches.open(Worker.cacheName).then((cache) => {
          cache.put(event.request, cacheCopy);
          return this.publish('Get', 'Success');
        });
        return response;
      }).catch((error) => {
        caches.match(Worker.offlinePage);
        return this.onCatch('Get', 'Error', error);
      });
      return cached || networked;
    }));
  }

  onPush(event) {
    if (event.data.text() !== Worker.pushTag) {
      return;
    }
    event.waitUntil(caches.open(Worker.cacheName)).then((cache) => {
      return fetch(Worker.pushUrl).then((response) => {
        var json;
        cache.put(Worker.pushUrl, response.clone());
        json = response.json();
        this.publish('Push', Worker.pushTag, {
          json: json
        });
        return json;
      });
    });
  }

  onSync(event) {
    if (event.tag !== Worker.syncTag) {
      return;
    }
    event.waitUntil(caches.open(Worker.cacheSync).then((cache) => {
      return cache.add(Worker.syncUrl);
    }));
  }

  addEventListeners() {
    self.addEventListener('install', this.onInstall);
    self.addEventListener('activate', this.onActivate);
    self.addEventListener('fetch', this.onFetch);
  }

};

//elf.addEventListener('fetch',    @onGet      )
//elf.addEventListener('push',     @onPush     )
//elf.addEventListener('sync',     @onSync     )
Worker.cacheName = 'Axiom';

Worker.pushTag = 'xxx';

Worker.pushUrl = 'xxx';

Worker.offlinePage = 'xxx';

Worker.syncTag = 'xxx';

Worker.cacheSync = 'xxx';

Worker.syncUrl = 'xxx';

Worker.cacheObjs = {};

Worker.create = function(cacheName, cacheObjs, logPub) {
  var worker;
  worker = new Worker(cacheName, cacheObjs, logPub);
  if (worker === false) {
    ({});
  }
};

// console.log( "Worker.create()", cacheName )
Worker.create(Worker.cacheName, Worker.cacheObjs, true);

// export default Worker

//# sourceMappingURL=Worker.js.map
