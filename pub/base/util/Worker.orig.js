
/*
if obj?
  console.log( status, text, obj )
else
  console.log( status, text )
*/
var cacheName, cacheObjs, cacheObjs2, cacheSync, cacheUrlNotNeeded, offlinePage, offlineUrl, onActivate, onFetch, onGet, onInstall, onInstall1, onPush, onSync, oncatch, publish, pushTag, pushUrl, syncTag, syncUrl, toCacheUrls, urls,
  hasProp = {}.hasOwnProperty;

cacheName = 'Augm';

offlinePage = './augm.html';

pushTag = 'PushTest';

pushUrl = '/app/data/store/Push.json';

cacheSync = 'Sync';

syncTag = 'SyncTest';

syncUrl = '/app/data/store/Sync.json';

offlineUrl = '/augm.html';

cacheObjs = {
  Main: {
    name: 'Main',
    status: 0,
    url: '/main.html'
  },
  Augm: {
    name: 'Augm',
    status: 0,
    url: '/augm.html'
  },
  Muse: {
    name: 'Muse',
    status: 0,
    url: '/muse.html'
  }
};

cacheObjs2 = {
  Augm: {
    name: 'Augm',
    status: 0,
    url: '/app/augm/Augm.js'
  },
  Vue: {
    name: 'Vue',
    status: 0,
    url: '/lib/vue/vue.esm.browser.js'
  },
  Main: {
    name: 'Main',
    status: 0,
    url: '/app/augm/Main.js'
  },
  Home: {
    name: 'Main',
    status: 0,
    url: '/app/augm/Home.js'
  },
  Router: {
    name: 'Router',
    status: 0,
    url: '/app/augm/router.js'
  },
  VueRouter: {
    name: 'VueRouter',
    status: 0,
    url: '/lib/vue/vue-router.esm.js'
  },
  Roboto: {
    name: 'Roboto',
    status: 0,
    url: '/css/font/roboto/Roboto.css'
  },
  Roll: {
    name: 'Roll',
    status: 0,
    url: '/app/augm/Augm.roll.js' // Gets deleted as a test
  }
};

toCacheUrls = function(objs) {
  var key, obj, urls;
  urls = [];
  for (key in objs) {
    if (!hasProp.call(objs, key)) continue;
    obj = objs[key];
    urls.push(obj.url);
  }
  return urls;
};

urls = toCacheUrls(cacheObjs);

publish = (status, text, obj = null) => {
  if (status === false && text === false && obj === false) {
    ({});
  }
};

oncatch = (status, text, error) => {
  console.error(status, text, error);
};

onInstall = (event) => {
  event.waitUntil(caches.open(cacheName).then((cache) => {
    var key, obj;
    publish('Install', '------ Open ------');
    for (key in cacheObjs) {
      if (!hasProp.call(cacheObjs, key)) continue;
      obj = cacheObjs[key];
      fetch(obj.url).then((response) => { // prefix+
        obj.status = response.status;
        publish('Install', response.status + ':' + response.url);
        return cache.put(response.url, response);
      });
    }
  }).catch((error) => {
    oncatch('Install', 'Error', error);
  }));
};

onInstall1 = (event) => {
  event.waitUntil(caches.open(cacheName).then((cache) => {
    publish('Install', 'Success');
    return cache.addAll(urls);
  }).catch((error) => {
    oncatch('Install', 'Error', error);
  }));
};

cacheUrlNotNeeded = (cacheUrl) => {
  return cacheUrl === '/app/augm/Augm.roll.js';
};

onActivate = (event) => {
  event.waitUntil(caches.keys().then((cacheUrls) => {
    return cacheUrls.filter((cacheUrl) => {
      return cacheUrlNotNeeded(cacheUrl);
    });
  }).then((cachesToDelete) => {
    return Promise.all(cachesToDelete.map((cacheToDelete) => {
      return caches.delete(cacheToDelete);
    }));
  }).then(() => {
    self.clients.claim();
    return publish('Activate', 'Success');
  }).catch((error) => {
    oncatch('Activate', 'Error', error);
  }));
};

onFetch = (event) => {
  // publish( 'Fetch URL ', event.request.url )
  // opt = { headers:{ 'Cache-Control': 'public, max-age=604800' } }
  event.respondWith(caches.open(cacheName).then((cache) => {
    return cache.match(event.request, {
      ignoreSearch: true
    }).then((response) => {
      return response || fetch(event.request).then((response) => {
        cache.put(event.request, response.clone());
        publish('Fetch', 'Success', event.request.url);
        return response;
      });
    });
  }).catch((error) => {
    return oncatch('Fetch', event.request.url, error);
  }));
};

onGet = (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  console.log('Worker.onGet()', event.request);
  event.respondWith(caches.match(event.request).then((cached) => {
    var networked;
    networked = fetch(event.request).then((response) => {
      var cacheCopy;
      cacheCopy = response.clone();
      caches.open(cacheName).then((cache) => {}, cache.put(event.request, cacheCopy), publish('Get', 'Success'));
      return response;
    }).catch((error) => {
      caches.match(offlinePage);
      return oncatch('Get', 'Error', error);
    });
    return cached || networked;
  }));
};

// For now this is just an example
// Needs to be registered
onPush = (event) => {
  if (event.data.text() !== pushTag) {
    return;
  }
  event.waitUntil(caches.open(cacheName)).then((cache) => {
    return fetch(pushUrl).then((response) => {
      var json;
      cache.put(pushUrl, response.clone());
      json = response.json();
      publish('Push', pushTag, json);
      return json;
    });
  });
};

// MDN says that sync may not progress to W3C standard
// Needs to be registered
onSync = (event) => {
  if (event.tag !== syncTag) {
    return;
  }
  event.waitUntil(caches.open(cacheSync).then((cache) => {
    return cache.add(syncUrl);
  }));
};

self.addEventListener('install', onInstall);

self.addEventListener('activate', onActivate);

self.addEventListener('fetch', onFetch);

//elf.addEventListener('fetch',    onGet      )
//elf.addEventListener('push',     onPush     )
//elf.addEventListener('sync',     onSync     )
