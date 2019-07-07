var cacheName, cacheObjs, cacheUrlNotNeeded, cacheUrls, offlinePage, onActivate, onFetch, onGet, onInstall, oncatch, publish, toCacheUrls,
  hasProp = {}.hasOwnProperty;

cacheName = 'Augm';

offlinePage = './augm.html';

cacheObjs = {
  Root: {
    name: 'Root',
    url: '/'
  },
  Html: {
    name: 'Html',
    url: '/augm.html'
  },
  Augm: {
    name: 'Augm',
    url: '/app/augm/Augm.js'
  },
  Vue: {
    name: 'Vue',
    url: '/lib/vue/vue.esm.browser.js'
  },
  Main: {
    name: 'Main',
    url: '/app/augm/Main.js'
  },
  Home: {
    name: 'Main',
    url: '/app/augm/Home.js'
  },
  Router: {
    name: 'Router',
    url: '/app/augm/router.js'
  },
  VueRouter: {
    name: 'VueRouter',
    url: '/lib/vue/vue-router.esm.js'
  },
  Roboto: {
    name: 'Roboto',
    url: '/css/font/roboto/Roboto.css'
  },
  Roll: {
    name: 'Roll',
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

cacheUrls = toCacheUrls(cacheObjs);

publish = (status, text, obj = null) => {
  if (obj != null) {
    console.log(status, text, obj);
  } else {
    console.log(status, text);
  }
};

oncatch = (status, text, error) => {
  console.error(status, text, error);
};

onInstall = (event) => {
  event.waitUntil(caches.open(cacheName).then((cache) => {
    publish('Install', 'Success');
    return cache.addAll(cacheUrls);
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
  event.respondWith(caches.open(cacheName).then((cache) => {
    return cache.match(event.request, {
      ignoreSearch: true
    }).then((response) => {
      return response || fetch(event.request).then((response) => {
        cache.put(event.request, response.clone());
        publish('Fetch', 'Success');
        return response;
      });
    });
  }).catch((error) => {
    return oncatch('Fetch', 'Error', error);
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
      caches.open(cacheName).then((cache) => {
        cache.put(event.request, cacheCopy);
        return publish('Get', 'Success');
      });
      return response;
    }).catch((error) => {
      caches.match(offlinePage);
      return oncatch('Get', 'Error', error);
    });
    return cached || networked;
  }));
};

self.addEventListener('install', onInstall);

self.addEventListener('activate', onActivate);

self.addEventListener('fetch', onFetch);

//elf.addEventListener('fetch',    onGet      )
//elf.addEventListener('push',     onPush     )
//elf.addEventListener('sync',     onSync     )
