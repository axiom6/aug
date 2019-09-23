var Worker,
  hasProp = {}.hasOwnProperty;

Worker = class Worker {
  constructor(cacheName1, cacheObjs1, logPub1 = false) {
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
    this.logPub = logPub1;
    this.cacheUrls = this.toCacheUrls(this.cacheObjs);
    this.cacheOpts = {
      headers: {
        'Cache-Control': 'public, max-age=86400'
      }
    };
    // console.log( 'Worker.self', self )
    this.addEventListeners();
  }

  // Not used. Push and Sync not implemented
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
    event.waitUntil(caches.open(this.cacheName).then((cache) => {
      this.publish('InstallAll', 'Success', {
        cacheName: this.cacheName
      });
      return cache.addAll(this.cacheUrls);
    }).catch((error) => {
      this.onCatch('InstallAll', 'Error', error);
    }));
  }

  cacheUrlNotNeeded(cacheUrl) {
    return cacheUrl === '/pub/app/muse/roll.js';
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
    if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
      return;
    }
    event.respondWith(caches.open(this.cacheName).then((cache) => {
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
    self.addEventListener('fetch', this.onFetch);
  }

};

//elf.addEventListener('fetch',    @onGet      )
//elf.addEventListener('push',     @onPush     )
//elf.addEventListener('sync',     @onSync     )
Worker.cacheName = 'Axiom';

Worker.cacheObjs = {
  MainHtml: {
    name: 'MainHtml',
    status: 0,
    url: '/pub/app/main/main.html'
  },
  MuseHtml: {
    name: 'MuseHtml',
    status: 0,
    url: '/pub/app/muse/muse.html'
  },
  MuseJS: {
    name: 'MuseJS',
    status: 0,
    url: '/pub/app/muse/Muse.js'
  },
  MuseHome: {
    name: 'MuseHome',
    status: 0,
    url: '/pub/app/muse/Home.js'
  },
  MuseMani: {
    name: 'MuseMani',
    status: 0,
    url: '/pub/app/muse/manifest.webmanifest'
  },
  AugmHtml: {
    name: 'AugmHtml',
    status: 0,
    url: '/pub/app/augm/augm.html'
  },
  AugmJS: {
    name: 'AugmJS',
    status: 0,
    url: '/pub/app/augm/augm.js'
  },
  AugmHome: {
    name: 'AugmHome',
    status: 0,
    url: '/pub/app/augm/home.js'
  },
  AugmMani: {
    name: 'AugmMani',
    status: 0,
    url: '/pub/app/augm/manifest.webmanifest'
  },
  JitterHtml: {
    name: 'JitterHtml',
    status: 0,
    url: '/pub/app/jitter/jits.html'
  },
  JitterJS: {
    name: 'JitterJS',
    status: 0,
    url: '/pub/app/jitter/jitter.js'
  },
  JitterMani: {
    name: 'JitterMani',
    status: 0,
    url: '/pub/app/jitter/manifest.webmanifest'
  },
  JitterHome: {
    name: 'JitterHome',
    status: 0,
    url: '/pub/vue/jitter/home.js'
  },
  JitterBody: {
    name: 'JitterBody',
    status: 0,
    url: '/pub/vue/jitter/body.js'
  },
  JitterBrew: {
    name: 'JitterBrew',
    status: 0,
    url: '/pub/vue/jitter/brew.js'
  },
  JitterChoice: {
    name: 'JitterChoice',
    status: 0,
    url: '/pub/vue/jitter/choice.js'
  },
  JitterDrink: {
    name: 'JitterDrink',
    status: 0,
    url: '/pub/vue/jitter/drink.js'
  },
  JitterFlavor: {
    name: 'JitterFlavor',
    status: 0,
    url: '/pub/vue/jitter/flavor.js'
  },
  JitterRoast: {
    name: 'JitterRoast',
    status: 0,
    url: '/pub/vue/jitter/roast.js'
  },
  MBoxHtml: {
    name: 'MBoxHtml',
    status: 0,
    url: '/pub/app/mbox/mbox.html'
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
  ChromeIcon: {
    name: 'ChromeIcon',
    status: 0,
    url: '/pub/css/icons/android-chrome-512x512.png'
  },
  Roboto: {
    name: 'Roboto',
    status: 0,
    url: '/pub/css/font/roboto/Roboto.css'
  },
  RobotoTTF: {
    name: 'RobotoTTF',
    status: 0,
    url: '/pub/css/font/roboto/Roboto-Regular.ttf'
  },
  FaSolidWoff2: {
    name: 'FaSolidWoff2',
    status: 0,
    url: '/pub/css/font/fontawesome/fa-solid-900.woff2'
  },
  FaBrandWoff2: {
    name: 'FaBrandWoff2',
    status: 0,
    url: '/pub/css/font/fontawesome/fa-brans-400.woff2'
  },
  FaInit: {
    name: 'FaInit',
    status: 0,
    url: '/pub/css/font/fontawesome/init.css'
  },
  FontAweJS: {
    name: 'FontAweJS',
    status: 0,
    url: '/pub/base/util/FontAwe.js'
  },
  Mixin: {
    name: 'Mixin',
    status: 0,
    url: '/pub/base/util/Mixin.js'
  },
  Stream: {
    name: 'Stream',
    status: 0,
    url: '/pub/base/util/Stream.js'
  },
  Cache: {
    name: 'Cache',
    status: 0,
    url: '/pub/base/util/Cache.js'
  },
  UtilJS: {
    name: 'UtilJS',
    status: 0,
    url: '/pub/base/util/Util.js'
  },
  DataJS: {
    name: 'DataJS',
    status: 0,
    url: '/pub/base/util/Data.js'
  },
  VisJS: {
    name: 'VisJS',
    status: 0,
    url: '/pub/base/util/Vis.js'
  },
  NavJS: {
    name: 'NavJS',
    status: 0,
    url: '/pub/base/util/Nav.js'
  },
  BuildJS: {
    name: 'BuildJS',
    status: 0,
    url: '/pub/ikw/cube/Build.js'
  },
  RollJS: {
    name: 'RollJS',
    status: 0,
    url: '/pub/app/muse/roll.js'
  },
  PrinJson: {
    name: 'PrinJson',
    status: 0,
    url: '/pub/data/muse/Prin.json'
  },
  RowsJson: {
    name: 'RowsJson',
    status: 0,
    url: '/pub/data/muse/Rows.json'
  },
  InfoJson: {
    name: 'InfoJson',
    status: 0,
    url: '/pub/data/muse/Info.json'
  },
  KnowJson: {
    name: 'KnowJson',
    status: 0,
    url: '/pub/data/muse/Know.json'
  },
  WiseJson: {
    name: 'WiseJson',
    status: 0,
    url: '/pub/data/muse/Wise.json'
  }
};

Worker.create = function(cacheName, cacheObjs, logPub) {
  var worker;
  worker = new Worker(cacheName, cacheObjs, logPub);
  if (worker === false) {
    ({});
  }
};

// console.log( "Worker.create()", cacheName )
Worker.create(Worker.cacheName, Worker.cacheObjs, true);
