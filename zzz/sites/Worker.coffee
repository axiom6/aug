
###
  Lifecycle
  1, Registered by Cache
  2. Install
     a. Open a cache.
     b. Cache our files.
     c. Confirm whether all the required assets are cached or not.
  3. Fetch
     a. Add a callback to .then() on the fetch request.
     b.Once we get a response, we perform the following checks:
       - Ensure the response is valid.
       - Check the status is 200 on the response.
       - Make sure the response type is basic,
         - which indicates that it's a request from our origin.
         - This means that requests to third party assets aren't cached as well.
      c. Clone response

###


class Worker

  constructor:() ->
    @logPub    = false
    @cacheUrls = @toCacheUrls( Worker.cacheObjs )                        #    1200 = 20 min
    @cacheOpts = { headers:{ 'Cache-Control': 'public, max-age=1200' } } # 2592000 = 30 days
    # console.log( 'Worker.self', self )
    @addEventListeners()

  addEventListeners:() ->
    self.addEventListener('install',  @onInstall  )
    self.addEventListener('activate', @onActivate )
    self.addEventListener('fetch',    @onFetch    )
    #elf.addEventListener('fetch',    @onGet      )
    #elf.addEventListener('push',     @onPush     )
    #elf.addEventListener('sync',     @onSync     )
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
    console.log( name, status, error )
    return
  
  onInstall:( event ) =>
    event.waitUntil(
      caches.open( Worker.cacheName )
        .then( (cache) =>
          @publish( 'Install', '------ Open ------' )
          for own key, obj of Worker.cacheObjs
            fetch( obj.url, @cacheOpts )
              .then( (response) =>
                @publish( '  Install', response.url )
                return cache.put( response.url, response ) )
          return )
        .catch( (error) =>
          @onCatch( 'Install', 'Error', error ); return ) )
    return
  
  onInstallAll:( event ) =>
    event.waitUntil(
      caches.open( Worker.cacheName )
        .then( (cache) =>
          @publish( 'InstallAll', 'Success', { cacheName:Worker.cacheName } )
          return cache.addAll(@cacheUrls) )
        .catch( (error) =>
          @onCatch( 'InstallAll', 'Error', error ); return ) )
    return
  
  cacheUrlNotNeeded:( cacheUrl ) => true
  
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
           @publish( 'Activate', 'Called' ) )
        .catch( (error) =>
          @onCatch( 'Activate', 'Error', error )
          return ) )
    return
  
  onFetch:( event ) =>
    console.log( 'Worker.onFetch()', event.request.url )
    return if event.request.cache is 'only-if-cached' and event.request.mode isnt 'same-origin'
    return if event.request.url   is 'http://localhost:3000/index.html?source=pwa'
    event.respondWith(
      caches.open( Worker.cacheName )
        .then( (cache) =>
          return cache.match( event.request, {ignoreSearch:true} ).then( (response) =>
            return response or fetch( event.request,  @cacheOpts ).then( (response) =>
              cache.put( event.request, response.clone() )
              @publish( 'Fetch', event.request.url  )
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
           caches.open(Worker.cacheName)
            .then( (cache) =>
               cache.put( event.request, cacheCopy )
               @publish( 'Get', 'Success' ) )
           return response )
        .catch((error) =>
           caches.match(Worker.offlinePage)
           @onCatch( 'Get', 'Error', error  ) )
        return cached or networked ) )
    return
  
  # For now this is just an example
  # Needs to be registered
  onPush:( event ) =>
    return if event.data.text() isnt Worker.pushTag
    event.waitUntil( caches.open( Worker.cacheName ) )
      .then( (cache) =>
        return fetch( Worker.pushUrl ).then( (response) =>
          cache.put(  Worker.pushUrl, response.clone() )
          json = response.json()
          @publish( 'Push', Worker.pushTag, { json:json } )
          return json ) )
    return
   
  # MDN says that sync may not progress to W3C standard
  # Needs to be registered
  onSync:( event ) =>
    return if event.tag isnt Worker.syncTag
    event.waitUntil( caches.open(Worker.cacheSync).then( (cache) =>
      return cache.add(Worker.syncUrl) ) )
    return


Worker.version     = 2          # Incrementing this should cause PWAs to updated
Worker.cacheName   = 'Axiom'
Worker.pushTag     = 'xxx'
Worker.pushUrl     = 'xxx'
Worker.offlinePage = 'xxx'
Worker.syncTag     = 'xxx'
Worker.cacheSync   = 'xxx'
Worker.syncUrl     = 'xxx'
Worker.cacheObjs   = {}

Worker.create = (      cacheName, cacheObjs, logPub ) ->
  worker = new Worker( cacheName, cacheObjs, logPub )
  if worker is false then {}
  # console.log( "Worker.create()", cacheName )
  return

Worker.create( Worker.cacheName, Worker.cacheObjs, true )

# export default Worker
