
class Worker

  constructor:( @manage ) ->
    @addListeners()

  publish:( status, text, error=null ) ->
    @manage.stream.publish( status, text, error )
    return

  addListeners:() =>
    self.addEventListener('install',  @onInstall )
    self.addEventListener('activate', @onActivate )
    self.addEventListener('fetch',    @onFetch )
    self.addEventListener('fetch',    @onGet )
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
    console.log('Worker.onGet()', event.request )
    event.respondWith(caches.match(event.request)
      .then((cached) =>
        networked = fetch(event.request)
         .then((response) =>
           cacheCopy = response.clone()
           caches.open(@manage.cacheName)
            .then( (cache) => cache.put( event.request, cacheCopy ) )
           return response )
        .catch(() =>
           caches.match(@manage.offlinePage) )
        return cached or networked ) )
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

self['Worker'] = Worker
