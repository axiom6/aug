
class Worker

  constructor:( @manage ) ->
    @pushTag   = "new-email"
    @pushJson  = 'Push.json'
    @syncName  = 'SymcMame'
    @syncCache = 'SymcCache'
    @addListeners()

  publish:( status, text, error=null ) ->
    @manage.stream.publish( status, text, error )
    return

  addListeners:() =>
    self.addEventListener('install',  @onInstall )
    self.addEventListener('activate', @onActivate )
    self.addEventListener('fetch',    @onFetch )
    #elf.addEventListener('fetch',    @onGet )
    #elf.addEventListener('push',     @onPush(     event ) )
    #elf.addEventListener('sync',     @onSync(     event ) )
    return

  onInstall:( event ) =>
    event.waitUntil(
      caches.open( @manage.cacheName )
        .then( (cache) =>
          @publish( 'Install', 'Open Cache Success' )
          return cache.addAll(@manage.cacheUrls) )
        .catch( (error) =>
          @publish( 'Install', 'Error', error )
          return ) )
    return

  cacheUrlNotNeeded:( cacheUrl ) ->
    cacheUrl is '/app/augm/Augm.roll.js'

  onActivate:( event ) =>
    event.waitUntil(
      caches.keys()
        .then( (cacheUrls) =>
          return cacheUrls.filter( (cacheUrl) => @cacheUrlNotNeeded(cacheUrl) ) )
        .then( (cachesToDelete) =>
          return Promise.all(cachesToDelete.map( (cacheToDelete) =>
            return caches.delete(cacheToDelete) ) ) )
        .then(() => self.clients.claim() )
        .catch( (error) =>
          @publish( 'Activate', 'Error', error )
          return ) )
    return

  onFetch:(event) =>
    event.respondWith(
      caches.open( @manage.cacheName )
        .then( (cache) =>
          return cache.match(event.request).then( (response) =>
            return response or fetch(event.request).then( (response) =>
              cache.put( event.request, response.clone() )
              return response ) ) )
        .catch( (error) =>
          @publish( 'Fetch', 'Error', error  ) ) )
    return

  onGet:(event) =>
    return if event.request.method isnt 'GET'
    event.respondWith(caches.match(event.request)
      .then((cached) =>
        networked = fetch(event.request)
         .then((response) =>
           cacheCopy = response.clone()
           caches.open(@manage.cacheName)
            .then( (cache) => cache.put( event.request, cacheCopy ) )
           return response )
        .catch(() => caches.match(@manage.offlinePage))
        return cached or networked ) )
    return

  # For now this is just an example
  onPush:(event) =>
    return if event.data.text() isnt @pushTag
    event.waitUntil( caches.open( @manage.cacheName ) )
     .then( (cache) =>
        return fetch( @pushJson).then( (response) =>
           cache.put( @pushJson, response.clone() )
           return response.json() ) )
     .then( (emails) =>
        msg = { body: "From " + emails[0].from.name, tag: @pushTag }
        @publish( 'Push', msg ) )
    return

  onSync:(event) =>
    return if event.id isnt @syncName
    event.waitUntil( caches.open(@syncCache).then( (cache) =>
      return cache.add(@syncName) ) )
    return

  cacheUrls:( jsonUrl ) ->
    caches.open(jsonUrl)
      .then( (cache) =>
        fetch(url)
          .then(  (response) => return response.json() )
          .then(  (urls)     => cache.addAll(urls) )
          .catch( (error)   => @publish( 'cacheUrls', 'Fetch', error ) ) )
      .catch( (error) => @publish( 'cacheUrls', 'Open', error ) )
    return

window['Worker'] = Worker

### 

  
    onFetchMany:(event) =>

    request    = event.request
    requestURL = new URL(request.url)

    # Handle requests to a particular host specifically
    if requestURL.hostname is @htmlUrl
      event.respondWith("some combination of patterns" )
    else if requestURL.origin is location.origin # Routing for local URLs
      if /^\/article\//.test(requestURL.pathname) # Handle article URLs
        event.respondWith("some combination of patterns");
      else if /\.webp$/.test(requestURL.pathname)
        event.respondWith("some combination of patterns")
      else if request.method is 'POST'
        event.respondWith("some combination of patterns")
      else if /cheese/.test(requestURL.pathname)
        event.respondWith( new Response("Flagrant cheese error", { status: 512 } ) )
    else # A sensible default pattern
      event.respondWith( caches.match(request).then( (response) =>
        return response or fetch(request) ) )
    return
###