
class Worker

  constructor:( @setup ) ->
    @addListeners()
    @pushTag   = "new-email"
    @pushJson  = 'Push.json'
    @syncName  = 'SymcMame'
    @syncCache = 'SymcCache'

  @publish( status, text, error=null ) ->
    @setup.stream.publish( status, text, error )
    return

  addListeners:() =>
    self.addEventListener('install',  @onInstall(  event ) )
    self.addEventListener('activate', @onActivate( event ) )
    self.addEventListener('fetch',    @onFetch(    event ) )
    #elf.addEventListener('push',     @onPush(     event ) )
    #elf.addEventListener('sync',     @onSync(     event ) )
    return

  onInstall:( event ) =>
    event.waitUntil(
      caches.open( @setup.cacheName )
        .then( (cache) =>
          @publish( 'Install', 'Open Cache Success' )
          return cache.addAll(@setup.cacheUrls) )
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
          return cacheUrls.filter( (cacheurl) => @cacheUrlNotNeeded(cacheUrl) ) )
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
      caches.open( @setup.cacheName )
        .then( (cache) =>
          return cache.match(event.request).then( (response) =>
            return response or fetch(event.request).then( (response) =>
              cache.put( event.request, response.clone() )
              return response ) ) )
        .catch( (error) =>
          @publish( 'Fetch', 'Error', error  ) ) )
    return

  # For now this is just an example
  onPush:(event) =>
    return if event.data.text() isnt @pushTag
    event.waitUntil( caches.open( @setup.cacheName ) )
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

export default Worker