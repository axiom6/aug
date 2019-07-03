"use strict";

var precacheConfig = [
  ["index.html", "218187414cc275eaa7bb37f098e0fc92"],
  ["static/css/app.d1a62a5e00430713ca6ccd67cb5fd580.css", "d1a62a5e00430713ca6ccd67cb5fd580"],
  ["static/js/app.04ef0c51d385926ea560.js", "13cfbbcfd7077380247bbbb6d9731463"],
  ["static/js/manifest.2d92f59992387f01763b.js", "00451931f39fbee842952a5d349f22a6"],
  ["static/js/vendor.0140506021c3a9c89dd2.js", "27f61c490b1b8af1d621b16afdd174bb"]
];
...
urlsToCacheKeys = new Map(precacheConfig.map(function (e) {
  var t = e[0], n = e[1], r = new URL(t, self.location), a = createCacheKey(r, hashParamName, n, !1);
  return [r.toString(), a]
}));

self.addEventListener("install", function (e) {
  ...
});

self.addEventListener("activate", function (e) {
  ...
})

self.addEventListener("fetch", function (e) {
  if ("GET" === e.request.method) {
    var t, n = stripIgnoredUrlParameters(e.request.url, ignoreUrlParametersMatching);
    t = urlsToCacheKeys.has(n);
    t || (n = addDirectoryIndex(n, "index.html"), t = urlsToCacheKeys.has(n));
    t && e.respondWith(caches.open(cacheName).then(function (e) {
      return e.match(urlsToCacheKeys.get(n)).then(function (e) {
        if (e)return e;
        throw Error("The cached response that was expected is missing.")
      })
    }).catch(function (t) {
      return console.warn('Couldn\'t serve response for "%s" from cache: %O', e.request.url, t), fetch(e.request)
    }))
  }
});
