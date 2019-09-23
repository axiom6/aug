
class Worker
  
  constructor:( @cacheName, @cacheObjs, @logPub=false ) ->
    @cacheUrls = @toCacheUrls( @cacheObjs )
    @cacheOpts = { headers:{ 'Cache-Control': 'public, max-age=86400' } }
    # console.log( 'Worker.self', self )
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
      caches.open( @cacheName )
        .then( (cache) =>
          @publish( 'InstallAll', 'Success', { cacheName:@cacheName } )
          return cache.addAll(@cacheUrls) )
        .catch( (error) =>
          @onCatch( 'InstallAll', 'Error', error ); return ) )
    return
  
  cacheUrlNotNeeded:( cacheUrl ) =>
    cacheUrl is '/pub/app/muse/roll.js'
  
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

    event.respondWith(
      caches.open( @cacheName )
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
    return

Worker.cacheName = 'Muse'

Worker.cacheObjs = {
  MuseHtml:     { name:'MuseHtml',     status:0, url:'/pub/app/muse/muse.html'         }
 #AugmHtml:     { name:'AugmHtml',     status:0, url:'/pub/app/augm/augm.html'         }
 #JitterHtml:   { name:'JitterHtml',   status:0, url:'/pub/app/jitter/jitter.html'     }
  MuseJS:       { name:'MuseJS',       status:0, url:'/pub/app/muse/Muse.js'           }
  Vue:          { name:'Vue',          status:0, url:'/pub/lib/vue/vue.esm.browser.js' }
  VueRouter:    { name:'VueRouter',    status:0, url:'/pub/lib/vue/vue-router.esm.js'  }
  Roboto:       { name:'Roboto',       status:0, url:'/pub/css/font/roboto/Roboto.css' }
  Home:         { name:'Home',         status:0, url:'/pub/app/muse/Home.js' }
  RobotoTTF:    { name:'RobotoTTF',    status:0, url:'/pub/css/font/roboto/Roboto-Regular.ttf' }
  FaSolidWoff2: { name:'FaSolidWoff2', status:0, url:'/pub/css/font/fontawesome/fa-solid-900.woff2' }
  FaBrandWoff2: { name:'FaBrandWoff2', status:0, url:'/pub/css/font/fontawesome/fa-brans-400.woff2' }
  FaInit:       { name:'FaInit',       status:0, url:'/pub/css/font/fontawesome/init.css' }
  Mixin:        { name:'Mixin',        status:0, url:'/pub/base/util/Mixin.js'   }
  Stream:       { name:'Stream',       status:0, url:'/pub/base/util/Stream.js'  }
  Cache:        { name:'Cache',        status:0, url:'/pub/base/util/Cache.js'   }
  FontAweJS:    { name:'FontAweJS',    status:0, url:'/pub/base/util/FontAwe.js' }
  UtilJS:       { name:'UtilJS',       status:0, url:'/pub/base/util/Util.js'    }
  DataJS:       { name:'UtilJS',       status:0, url:'/pub/base/util/Data.js'    }
  VisJS:        { name:'VisJS',        status:0, url:'/pub/base/util/Vis.js'     }
  NavJS:        { name:'NavJS',        status:0, url:'/pub/base/util/Nav.js'     }
  BuildJS:      { name:'BuildJS',      status:0, url:'/pub/ikw/cube/Build.js'    }
  RollJS:      { name:'RollJS',        status:0, url:'/pub/app/muse/roll.js'     }
}

Worker.create = ( cacheName, cacheObjs, logPub ) ->
  worker = new Worker( cacheName, cacheObjs, logPub )
  if worker is false then {}
  console.log( "Worker.create()", cacheName )
  return

Worker.create( Worker.cacheName, Worker.cacheObjs, true )
