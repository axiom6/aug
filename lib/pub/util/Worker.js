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

Worker.cacheObjs = {};

Worker.cacheObjs2 = {
  IndexHtml: {
    name: 'IndexHtml',
    status: 0,
    url: '/index.html'
  },
  Favicon: {
    name: 'Favicon',
    status: 0,
    url: '/favicon.icon'
  },
  IndexJS: {
    name: 'IndexJS',
    status: 0,
    url: '/index.js'
  }
};

Worker.cacheObjsMuse = {
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
    url: '/pub/app/jitter/jitter.html'
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
    url: '/pub/draw/FontAwe.js'
  },
  Mixin: {
    name: 'Mixin',
    status: 0,
    url: '/pub/vue/Mixin.js'
  },
  Stream: {
    name: 'Stream',
    status: 0,
    url: '/pub/util/Stream.js'
  },
  Cache: {
    name: 'Cache',
    status: 0,
    url: '/pub/util/Cache.js'
  },
  UtilJS: {
    name: 'UtilJS',
    status: 0,
    url: '/pub/util/Util.js'
  },
  AccessJS: {
    name: 'AccessJS',
    status: 0,
    url: '/pub/util/Access.js'
  },
  VisJS: {
    name: 'VisJS',
    status: 0,
    url: '/pub/draw/Vis.js'
  },
  NavJS: {
    name: 'NavJS',
    status: 0,
    url: '/pub/navi/Nav.js'
  },
  BuildJS: {
    name: 'BuildJS',
    status: 0,
    url: '/pub/muse/conn/Build.js'
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
  },
  DataJson: {
    name: 'DataJson',
    status: 0,
    url: '/pub/data/muse/Data.json'
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

// export default Worker

//# sourceMappingURL=Worker.js.map
