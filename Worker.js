  /*
    Lifecycle
    1, Registered by Cache
    2. Install
       a. Open a cache.
       b. Cache our files.
       c. Confirm whether all the required assets are cached or not.
    3. Fetch
       a. Add a callback to .then() on the fetch request.
       b.Once we get a response, we perform the following checks:
         - Ensure the response is valid.
         - Check the status is 200 on the response.
         - Make sure the response type is basic,
           - which indicates that it's a request from our origin.
           - This means that requests to third party assets aren't cached as well.
        c. Clone response
  */
var Worker,
  hasProp = {}.hasOwnProperty;

Worker = class Worker {
  constructor(cacheName1, cacheObjs1, logPub1) {
    this.onInstall = this.onInstall.bind(this);
    this.onFetch = this.onFetch.bind(this);
    this.onActivate = this.onActivate.bind(this);
    this.onCatch = this.onCatch.bind(this);
    this.cacheName = cacheName1;
    this.cacheObjs = cacheObjs1;
    this.logPub = logPub1;
    this.cacheUrls = this.toCacheUrls(this.cacheObjs); //    1200 = 20 min
    this.cacheOpts = {
      headers: {
        'Cache-Control': 'public, max-age=1200' // 2592000 = 30 days
      }
    };
    // @log( 'Worker this', @  )
    this.addEventListeners();
  }

  addEventListeners() {
    self.addEventListener('install', this.onInstall);
    self.addEventListener('fetch', this.onFetch);
    self.addEventListener('activate', this.onActivate);
  }

  onInstall(event) {
    event.waitUntil(caches.open(this.cacheName).then((cache) => {
      var key, obj, ref;
      this.log('Install', '------ Open ------');
      ref = this.cacheObjs;
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        obj = ref[key];
        fetch(obj.url, this.cacheOpts).then((response) => {
          this.log('  Install', response.url);
          return cache.put(response.url, response);
        });
      }
    }).catch((error) => {
      this.onCatch('Install', 'Error', error);
    }));
  }

  onFetch(event) {
    var url;
    url = event.request.url;
    console.log('Worker.onFetch()', url);
    if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
      return;
    }
    if (url === 'http://localhost:3000/index.html?source=pwa') {
      return;
    }
    event.respondWith(caches.open(Worker.cacheName).then((cache) => {
      return cache.match(event.request, {
        ignoreSearch: true
      }).then((response) => {
        return response || fetch(event.request, this.cacheOpts).then((response) => {
          cache.put(event.request, response.clone());
          this.log('Fetch', url);
          if (!this.cacheUrls.includes(url)) {
            //  @cacheUrls = [] if not @cacheUrls?
            this.cacheUrls.push(url);
          }
          return response;
        });
      });
    }).catch((error) => {
      return this.onCatch('Fetch', event.request.url, error);
    }));
  }

  onActivate(event) {
    event.waitUntil(caches.keys().then((cacheUrls) => {
      this.cacheUrls = cacheUrls;
      return this.cacheUrls.filter((cacheUrl) => {
        return this.cacheUrlNeedsUpdate(cacheUrl);
      });
    }).then((cachesToDelete) => {
      return Promise.all(cachesToDelete.map((cacheToDelete) => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => {
      self.clients.claim();
      return this.log('Activate', 'Called');
    }).catch((error) => {
      this.onCatch('Activate', 'Error', error);
    }));
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

  log(name, status, obj = null) {
    if (this.logPub) {
      if (obj != null) {
        console.log(name, status, obj);
      } else {
        console.log(name, status);
      }
    }
  }

  onCatch(name, status, error) {
    console.error(name, status, error);
  }

  cacheUrlNeedsUpdate(cacheUrl) {
    return true;
  }

};

Worker.version = "2.1"; // Incrementing this should cause PWAs to updated

Worker.cacheName = 'Axiom';

Worker.cacheObjs = {};

Worker.create = function(cacheName, cacheObjs, logPub) {
  var worker;
  worker = new Worker(cacheName, cacheObjs, logPub);
  if (worker === false) {
    ({});
  }
  worker.log("Worker.create()", cacheName);
};

Worker.create(Worker.cacheName, Worker.cacheObjs, false);

//# sourceMappingURL=Worker.js.map
