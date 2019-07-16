
cacheName    = 'Augm'
offlinePage  = './augm.html'
pushTag      = 'PushTest'
pushUrl      = '/app/data/store/Push.json'
cacheSync    = 'Sync'
syncTag      = 'SyncTest'
syncUrl      = '/app/data/store/Sync.json'
offlineUrl   = '/augm.html'

cacheObjs =  {
  Main: { name: 'Main', status: 0, url: '/main.html' },
  Augm: { name: 'Augm', status: 0, url: '/augm.html' },
  Muse: { name: 'Muse', status: 0, url: '/muse.html' } }

cacheObjs2 =  {
  Augm:     { name:'Augm',      status:0, url:'/app/augm/Augm.js' }
  Vue:      { name:'Vue',       status:0, url:'/lib/vue/vue.esm.browser.js' }
  Main:     { name:'Main',      status:0, url:'/app/augm/Main.js'   }
  Home:     { name:'Main',      status:0, url:'/app/augm/Home.js'   }
  Router:   { name:'Router',    status:0, url:'/app/augm/router.js' }
  VueRouter:{ name:'VueRouter', status:0, url:'/lib/vue/vue-router.esm.js' }
  Roboto:   { name:'Roboto',    status:0, url:'/css/font/roboto/Roboto.css' }
  Roll:     { name:'Roll',      status:0, url:'/app/augm/Augm.roll.js' } }  # Gets deleted as a test

toCacheUrls = ( objs ) ->
  urls = []
  urls.push( obj.url ) for own key, obj of objs
  urls

urls = toCacheUrls( cacheObjs )

publish = ( status, text, obj=null ) =>
  if status is false and text is false and obj is false then {}
  ###
  if obj?
    console.log( status, text, obj )
  else
    console.log( status, text )
  ###
  return

oncatch = ( status, text, error ) =>
  console.error( status, text, error )
  return

onInstall = ( event ) =>
  event.waitUntil(
    caches.open( cacheName )
      .then( (cache) =>
        publish( 'Install', '------ Open ------' )
        #prefix = '/aug/pub'
        for own key, obj of cacheObjs
          fetch( obj.url ) # prefix+
            .then( (response) =>
              obj.status = response.status
              publish( 'Install', response.status+':'+response.url )
              return cache.put( response.url, response ) )
        return )
      .catch( (error) =>
        oncatch( 'Install', 'Error', error ); return ) )
  return

onInstall1 = ( event ) =>
  event.waitUntil(
    caches.open( cacheName )
      .then( (cache) =>
        publish( 'Install', 'Success' )
        return cache.addAll(urls) )
      .catch( (error) =>
        oncatch( 'Install', 'Error', error ); return ) )
  return

cacheUrlNotNeeded = ( cacheUrl ) =>
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
        oncatch( 'Activate', 'Error', error )
        return ) )
  return

onFetch = (event) =>
  # publish( 'Fetch URL ', event.request.url )
  # opt = { headers:{ 'Cache-Control': 'public, max-age=604800' } }
  event.respondWith(
    caches.open( cacheName )
      .then( (cache) =>
        return cache.match( event.request, {ignoreSearch:true} ).then( (response) =>
          return response or fetch(event.request).then( (response) =>
            cache.put( event.request, response.clone() )
            publish( 'Fetch', 'Success', event.request.url  )
            return response ) ) )
      .catch( (error) =>
        oncatch( 'Fetch', event.request.url, error  ) ) )
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
         oncatch( 'Get', 'Error', error  ) )
      return cached or networked ) )
  return

# For now this is just an example
# Needs to be registered
onPush = (event) =>
  return if event.data.text() isnt pushTag
  event.waitUntil( caches.open( cacheName ) )
    .then( (cache) =>
      return fetch( pushUrl ).then( (response) =>
        cache.put(  pushUrl, response.clone() )
        json = response.json()
        publish( 'Push', pushTag, json )
        return json ) )
  return




# MDN says that sync may not progress to W3C standard
# Needs to be registered
onSync = (event) =>
  return if event.tag isnt syncTag
  event.waitUntil( caches.open(cacheSync).then( (cache) =>
    return cache.add(syncUrl) ) )
  return


self.addEventListener('install',  onInstall  )
self.addEventListener('activate', onActivate )
self.addEventListener('fetch',    onFetch    )
#elf.addEventListener('fetch',    onGet      )
#elf.addEventListener('push',     onPush     )
#elf.addEventListener('sync',     onSync     )

