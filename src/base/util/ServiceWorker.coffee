
cacheName    = 'Augm'
offlinePage  = './augm.html'

cacheObjs =  {
  Html:     { name:'Html',      url:'./augm.html' }
  Augm:     { name:'Augm',      url:'./app/augm/Augm.js' }
  Vue:      { name:'Vue',       url:'./lib/vue/vue.esm.browser.js' }
  Main:     { name:'Main',      url:'./app/augm/Main.js'   }
  Home:     { name:'Main',      url:'./app/augm/Home.js'   }
  Router:   { name:'Router',    url:'./app/augm/router.js' }
  VueRouter:{ name:'VueRouter', url:'./lib/vue/vue-router.esm.js' }
  Roboto:   { name:'Roboto',    url:'./css/font/roboto/Roboto.css' }
  Roll:     { name:'Roll',      url:'./app/augm/Augm.roll.js' } }  # Gets deleted as a test

toCacheUrls = ( objs ) ->
  urls = []
  urls.push( obj.url ) for own key, obj of objs
  urls

cacheUrls = toCacheUrls( cacheObjs )

publish = ( status, text, error=null ) =>
  if not error?
    console.log( status, text )
  else
    console.error( status, text, error )
  return

onInstall = ( event ) =>
  event.waitUntil(
    caches.open( cacheName )
      .then( (cache) =>
        publish( 'Install', 'Success' )
        return cache.addAll(cacheUrls) )
      .catch( (error) =>
        publish( 'Install', 'Error', error )
        return ) )
  return

cacheUrlNotNeeded:( cacheUrl ) =>
  cacheUrl is '/app/augm/Augm.roll.js'

onActivate = ( event ) =>
  event.waitUntil(
    caches.keys()
      .then( (cacheUrls) =>
        return cacheUrls.filter( (cacheUrl) => cacheUrlNotNeeded(cacheUrl) ) )
      .then( (cachesToDelete) =>
        return Promise.all(cachesToDelete.map( (cacheToDelete) =>
          return caches.delete(cacheToDelete) ) ) )
      .then(() =>
         self.clients.claim()
         publish( 'Activate', 'Success' ) )
      .catch( (error) =>
        publish( 'Activate', 'Error', error )
        return ) )
  return

onFetch = (event) =>
  event.respondWith(
    caches.open( cacheName )
      .then( (cache) =>
        return cache.match(event.request).then( (response) =>
          return response or fetch(event.request).then( (response) =>
            cache.put( event.request, response.clone() )
            publish( 'Fetch', 'Success'  )
            return response ) ) )
      .catch( (error) =>
        publish( 'Fetch', 'Error', error  ) ) )
  return

onGet = (event) =>
  return if event.request.method isnt 'GET'
  console.log('Worker.onGet()', event.request )
  event.respondWith(caches.match(event.request)
    .then((cached) =>
      networked = fetch(event.request)
       .then((response) =>
         cacheCopy = response.clone()
         caches.open(cacheName)
          .then( (cache) =>
             cache.put( event.request, cacheCopy )
             publish( 'Get', 'Success' ) )
         return response )
      .catch((error) =>
         caches.match(offlinePage)
         publish( 'Get', 'Error', error  ) )
      return cached or networked ) )
  return


self.addEventListener('install',  onInstall  )
self.addEventListener('activate', onActivate )
self.addEventListener('fetch',    onFetch    )
#elf.addEventListener('fetch',    onGet      )
#elf.addEventListener('push',     onPush     )
#elf.addEventListener('sync',     onSync     )

