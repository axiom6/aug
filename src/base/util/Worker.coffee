
class Worker
  
  constructor:( @cacheName, @cacheObjs, @logPub=false ) ->
    @cacheUrls = @toCacheUrls( @cacheObjs )
    @addEventListeners()

  pushSyncParams:() ->
    @pushTag      = 'PushTest'
    @pushUrl      = '/app/data/store/Push.json'
    @cacheSync    = 'Sync'
    @syncTag      = 'SyncTest'
    @syncUrl      = '/app/data/store/Sync.json'
    @offlineUrl   = '/augm.html'
    return
  
  toCacheUrls:( objs ) ->
    urls = []
    urls.push( obj.url ) for own key, obj of objs
    urls
    
  publish:( name, status, obj=null ) =>
    if @logPub
      if obj?
        console.log( name, status, obj )
      else
        console.log( name, status )
    return
  
  onCatch:( name, status, error ) =>
    console.error( name, status, error )
    return
  
  onInstall:( event ) =>
    event.waitUntil(
      caches.open( @cacheName )
        .then( (cache) =>
          @publish( 'Install', '------ Open ------' )
          for own key, obj of @cacheObjs
            fetch( obj.url )
              .then( (response) =>
                obj.cacheName   =
                obj.responseUrl = response.url
                @publish( '  Install', response.status, obj )
                return cache.put( response.url, response ) )
          return )
        .catch( (error) =>
          @onCatch( 'Install', 'Error', error ); return ) )
    return
  
  onInstallAll:( event ) =>
    event.waitUntil(
      caches.open( @cacheName )
        .then( (cache) =>
          @publish( 'InstallAll', 'Success', { cacheName:@cacheName } )
          return cache.addAll(@cacheUrls) )
        .catch( (error) =>
          @onCatch( 'InstallAll\'', 'Error', error ); return ) )
    return
  
  cacheUrlNotNeeded:( cacheUrl ) =>
    cacheUrl is '/app/augm/Augm.roll.js'
  
  onActivate:( event ) =>
    event.waitUntil(
      caches.keys()
        .then( ( @cacheUrls ) =>
          return @cacheUrls.filter( (cacheUrl) => @cacheUrlNotNeeded(cacheUrl) ) )
        .then( (cachesToDelete) =>
          return Promise.all(cachesToDelete.map( (cacheToDelete) =>
            return caches.delete(cacheToDelete) ) ) )
        .then(() =>
           self.clients.claim()
           @publish( 'Activate', 'Success' ) )
        .catch( (error) =>
          @onCatch( 'Activate', 'Error', error )
          return ) )
    return
  
  onFetch:( event ) =>
    # @publish( 'Fetch URL ', event.request.url )
    # opt = { headers:{ 'Cache-Control': 'public, max-age=604800' } }
    event.respondWith(
      caches.open( cacheName )
        .then( (cache) =>
          return cache.match( event.request, {ignoreSearch:true} ).then( (response) =>
            return response or fetch(event.request).then( (response) =>
              cache.put( event.request, response.clone() )
              @publish( 'Fetch', 'Success', { url:event.request.url }  )
              return response ) ) )
        .catch( (error) =>
          @onCatch( 'Fetch', event.request.url, error  ) ) )
    return
  
  onGet:( event ) =>
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
               @publish( 'Get', 'Success' ) )
           return response )
        .catch((error) =>
           caches.match(offlinePage)
           @onCatch( 'Get', 'Error', error  ) )
        return cached or networked ) )
    return
  
  # For now this is just an example
  # Needs to be registered
  onPush:( event ) =>
    return if event.data.text() isnt @pushTag
    event.waitUntil( caches.open( cacheName ) )
      .then( (cache) =>
        return fetch( pushUrl ).then( (response) =>
          cache.put(  pushUrl, response.clone() )
          json = response.json()
          @publish( 'Push', pushTag, { json:json } )
          return json ) )
    return
   
  # MDN says that sync may not progress to W3C standard
  # Needs to be registered
  onSync:( event ) =>
    return if event.tag isnt @syncTag
    event.waitUntil( caches.open(cacheSync).then( (cache) =>
      return cache.add(syncUrl) ) )
    return
  
  addEventListeners:() -> 
    self.addEventListener('install',  @onInstall  )
    self.addEventListener('activate', @onActivate )
    self.addEventListener('fetch',    @onFetch    )
    #elf.addEventListener('fetch',    @onGet      )
    #elf.addEventListener('push',     @onPush     )
    #elf.addEventListener('sync',     @onSync     )
  
export default Worker