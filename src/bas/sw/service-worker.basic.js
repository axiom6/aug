
let CacheName   = 'sw-v1'
let OfflinePage = ""

self.addEventListener('install', (event) => {
  event['waitUntil'](
    caches.open(CacheName)
      .then(cache => cache.addAll('./404.html'))
  )
})

self.addEventListener('fetch', (event) => {
  if (event['request'].method === 'GET') {
    event['respondWith'](
      caches.match(event['request'])
        .then((cached) => {
          let networked = fetch(event['request'])
            .then((response) => {
              let cacheCopy = response.clone()
              caches.open(CacheName)
                .then(cache => cache.put(event['request'], cacheCopy))
              return response;
            })
            .catch(() => caches.match(OfflinePage));
          return cached || networked;
        })
    )
  }
  //return;
});