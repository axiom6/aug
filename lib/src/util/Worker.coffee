
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

  constructor:(  @cacheName,   @cacheObjs, @logPub ) ->
    @cacheUrls = @toCacheUrls( @cacheObjs )                              #    1200 = 20 min
    @cacheOpts = { headers:{ 'Cache-Control': 'public, max-age=1200' } } # 2592000 = 30 days
    # @log( 'Worker this', @  )
    @addEventListeners()

  addEventListeners:() ->
    self.addEventListener('install',  @onInstall  )
    self.addEventListener('fetch',    @onFetch    )
    self.addEventListener('activate', @onActivate )
    return
  
  onInstall:( event ) =>
    event.waitUntil(
      caches.open( @cacheName )
        .then( (cache) =>
          @log( 'Install', '------ Open ------' )
          for own key, obj of @cacheObjs
            fetch( obj.url,   @cacheOpts )
              .then( (response) =>
                @log( '  Install', response.url )
                return cache.put( response.url, response ) )
          return )
        .catch( (error) =>
          @onCatch( 'Install', 'Error', error ); return ) )
    return

  onFetch:( event ) =>
    url = event.request.url
    console.log( 'Worker.onFetch()', url )
    return if event.request.cache is 'only-if-cached' and event.request.mode isnt 'same-origin'
    return if url  is 'http://localhost:3000/index.html?source=pwa'
    event.respondWith(
      caches.open( Worker.cacheName )
        .then( (cache) =>
          return cache.match( event.request, {ignoreSearch:true} ).then( (response) =>
            return response or fetch( event.request,  @cacheOpts ).then( (response) =>
              cache.put( event.request, response.clone() )
              @log( 'Fetch', url )
              #  @cacheUrls = [] if not @cacheUrls?
              @cacheUrls.push( url ) if not @cacheUrls.includes(url)
              return response ) ) )
        .catch( (error) =>
          @onCatch( 'Fetch', event.request.url, error  ) ) )
    return
  
  onActivate:( event ) =>
    event.waitUntil(
      caches.keys()
        .then( ( @cacheUrls ) =>
          return @cacheUrls.filter( (cacheUrl) => @cacheUrlNeedsUpdate(cacheUrl) ) )
        .then( (cachesToDelete) =>
          return Promise.all(cachesToDelete.map( (cacheToDelete) =>
            return caches.delete(cacheToDelete) ) ) )
        .then(() =>
           self.clients.claim()
           @log( 'Activate', 'Called' ) )
        .catch( (error) =>
          @onCatch( 'Activate', 'Error', error )
          return ) )
    return

  toCacheUrls:( objs ) ->
    urls = []
    urls.push( obj.url ) for own key, obj of objs
    urls

  log:( name, status, obj=null ) ->
    if @logPub
      if obj?
        console.log( name, status, obj )
      else
        console.log( name, status )
    return

  onCatch:(        name, status, error ) =>
    console.error( name, status, error )
    return

  cacheUrlNeedsUpdate:( cacheUrl ) ->
     true

Worker.version     = "2.1"          # Incrementing this should cause PWAs to updated
Worker.cacheName   = 'Axiom'
Worker.cacheObjs   = {}

Worker.create = (      cacheName, cacheObjs, logPub ) ->
  worker = new Worker( cacheName, cacheObjs, logPub )
  if worker is false then {}
  worker.log( "Worker.create()", cacheName )
  return

Worker.create( Worker.cacheName, Worker.cacheObjs, false )

