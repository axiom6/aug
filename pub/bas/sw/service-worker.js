"use strict";

let precacheConfig = [
  ["augm.html", "218187414cc275eaa7bb37f098e0fc92"],
  ["static/css/app.d1a62a5e00430713ca6ccd67cb5fd580.css", "d1a62a5e00430713ca6ccd67cb5fd580"],
  ["static/js/app.04ef0c51d385926ea560.js", "13cfbbcfd7077380247bbbb6d9731463"],
  ["static/js/manifest.2d92f59992387f01763b.js", "00451931f39fbee842952a5d349f22a6"],
  ["static/js/vendor.0140506021c3a9c89dd2.js", "27f61c490b1b8af1d621b16afdd174bb"]
];

let createCacheKey = function( r, hashParamName, n, q ) {
   return r * hashParamName * n * q;
}

let urlsToCacheKeys = new Map(precacheConfig.map(function (e) {
  let t    = e[0];
  let n    = e[1];
  let r    = new URL(t, self.location);
  let hash = 1;
  let a    = createCacheKey(r, hash, n, 1 );
  return [r.toString(), a]
}));

self.addEventListener("install", function (e) {
  //...
});

self.addEventListener("activate", function (e) {
  //...
})

self.addEventListener("fetch", function (e) {
  if ("GET" === e['request'].method) {
    let n = stripIgnoredUrlParameters(e['request'].url, ignoreUrlParametersMatching);
    let t = urlsToCacheKeys.has(n);
    if( !t ) {
      n = addDirectoryIndex(n, "index.html");
      t = urlsToCacheKeys.has(n); }
    //);
    t && e['respondWith'](caches.open(cacheName).then(function (e) {
      return e.match(urlsToCacheKeys.get(n)).then(function (e) {
        if (e)return e;
        throw Error("The cached response that was expected is missing.")
      })
    }).catch(function (t) {
      fetch(e['request']).then( );
      return console.warn('Couldn\'t serve response for "%s" from cache: %O', e['request'].url, t);

    }))
  }
});
