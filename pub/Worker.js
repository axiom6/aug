var Worker, cacheName, cacheObjs, worker,
  hasProp = {}.hasOwnProperty;

Worker = class Worker {
  constructor(cacheName1, cacheObjs1, logPub = false) {
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
    this.cacheName = cacheName1;
    this.cacheObjs = cacheObjs1;
    this.logPub = logPub;
    this.cacheUrls = this.toCacheUrls(this.cacheObjs);
    this.addEventListeners();
  }

  pushSyncParams() {
    this.pushTag = 'PushTest';
    this.pushUrl = '/app/data/store/Push.json';
    this.cacheSync = 'Sync';
    this.syncTag = 'SyncTest';
    this.syncUrl = '/app/data/store/Sync.json';
    this.offlineUrl = '/augm.html';
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
    console.error(name, status, error);
  }

  onInstall(event) {
    event.waitUntil(caches.open(this.cacheName).then((cache) => {
      var key, obj, ref;
      this.publish('Install', '------ Open ------');
      ref = this.cacheObjs;
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        obj = ref[key];
        fetch(obj.url).then((response) => {
          obj.responseUrl = response.url;
          this.publish('  Install', response.status, obj);
          return cache.put(response.url, response);
        });
      }
    }).catch((error) => {
      this.onCatch('Install', 'Error', error);
    }));
  }

  onInstallAll(event) {
    event.waitUntil(caches.open(this.cacheName).then((cache) => {
      this.publish('InstallAll', 'Success', {
        cacheName: this.cacheName
      });
      return cache.addAll(this.cacheUrls);
    }).catch((error) => {
      this.onCatch('InstallAll\'', 'Error', error);
    }));
  }

  cacheUrlNotNeeded(cacheUrl) {
    return cacheUrl === '/app/augm/Augm.roll.js';
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
      return this.publish('Activate', 'Success');
    }).catch((error) => {
      this.onCatch('Activate', 'Error', error);
    }));
  }

  onFetch(event) {
    // @publish( 'Fetch URL ', event.request.url )
    // opt = { headers:{ 'Cache-Control': 'public, max-age=604800' } }
    event.respondWith(caches.open(cacheName).then((cache) => {
      return cache.match(event.request, {
        ignoreSearch: true
      }).then((response) => {
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          this.publish('Fetch', 'Success', {
            url: event.request.url
          });
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
        caches.open(cacheName).then((cache) => {
          cache.put(event.request, cacheCopy);
          return this.publish('Get', 'Success');
        });
        return response;
      }).catch((error) => {
        caches.match(offlinePage);
        return this.onCatch('Get', 'Error', error);
      });
      return cached || networked;
    }));
  }

  onPush(event) {
    if (event.data.text() !== this.pushTag) {
      return;
    }
    event.waitUntil(caches.open(cacheName)).then((cache) => {
      return fetch(pushUrl).then((response) => {
        var json;
        cache.put(pushUrl, response.clone());
        json = response.json();
        this.publish('Push', pushTag, {
          json: json
        });
        return json;
      });
    });
  }

  onSync(event) {
    if (event.tag !== this.syncTag) {
      return;
    }
    event.waitUntil(caches.open(cacheSync).then((cache) => {
      return cache.add(syncUrl);
    }));
  }

  addEventListeners() {
    self.addEventListener('install', this.onInstall);
    self.addEventListener('activate', this.onActivate);
    return self.addEventListener('fetch', this.onFetch);
  }

};

//elf.addEventListener('fetch',    @onGet      )
//elf.addEventListener('push',     @onPush     )
//elf.addEventListener('sync',     @onSync     )

// export default Worker
cacheName = 'Muse';

cacheObjs = {
  MuseHtml: {
    name: 'MuseHtml',
    status: 0,
    url: '/pub/app/muse/muse.html'
  },
  AugmHtml: {
    name: 'AugmHtml',
    status: 0,
    url: '/pub/app/augm/augm.html'
  },
  JitterHtml: {
    name: 'JitterHtml',
    status: 0,
    url: '/pub/app/jitter/jitter.html'
  },
  MuseJS: {
    name: 'MuseJS',
    status: 0,
    url: '/pub/app/muse/Muse.js'
  },
  Vue: {
    name: 'Vue',
    status: 0,
    url: '/pub/lib/vue/vue.esm.browser.js'
  },
  VueRouter: {
    name: 'VueRouter',
    status: 0,
    url: '/pub/lib/vue/vue-router.esm.js'
  },
  Roboto: {
    name: 'Roboto',
    status: 0,
    url: '/pub/css/font/roboto/Roboto.css'
  }
};

worker = new Worker(cacheName, cacheObjs, true);
