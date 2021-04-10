
class Worker
  
  constructor:() ->
    @logPub    = false
    @cacheUrls = @toCacheUrls( Worker.cacheObjs )                        #    1200 = 20 min
    @cacheOpts = { headers:{ 'Cache-Control': 'public, max-age=1200' } } # 2592000 = 30 days
    # console.log( 'Worker.self', self )
    @addEventListeners()
  
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

Worker.cacheName = 'Axiom'

Worker.cacheObjs = {}

Worker.cacheObjs2 = {
  IndexHtml: { name:'IndexHtml', status:0, url:'/index.html'}
  Favicon:   { name:'Favicon',    status:0, url:'/favicon.icon'},
  IndexJS:   { name:'IndexJS',   status:0, url:'/index.js'  }
}

Worker.cacheObjsMuse = {
  MainHtml:     { name:'MainHtml',     status:0, url:'/pub/app/main/main.html'     }
  MuseHtml:     { name:'MuseHtml',     status:0, url:'/pub/app/muse/muse.html'     }
  MuseJS:       { name:'MuseJS',       status:0, url:'/pub/app/muse/Muse.js'       }
  MuseHome:     { name:'MuseHome',     status:0, url:'/pub/app/muse/Home.js'       }
  MuseMani:     { name:'MuseMani',     status:0, url:'/pub/app/muse/manifest.webmanifest' }
  AugmHtml:     { name:'AugmHtml',     status:0, url:'/pub/app/augm/augm.html'     }
  AugmJS:       { name:'AugmJS',       status:0, url:'/pub/app/augm/augm.js'       }
  AugmHome:     { name:'AugmHome',     status:0, url:'/pub/app/augm/home.js'       }
  AugmMani:     { name:'AugmMani',     status:0, url:'/pub/app/augm/manifest.webmanifest' }
  JitterHtml:   { name:'JitterHtml',   status:0, url:'/pub/app/jitter/jitter.html' }
  JitterJS:     { name:'JitterJS',     status:0, url:'/pub/app/jitter/jitter.js'   }
  JitterMani:   { name:'JitterMani',   status:0, url:'/pub/app/jitter/manifest.webmanifest' }
  JitterHome:   { name:'JitterHome',   status:0, url:'/pub/vue/jitter/home.js'     }
  JitterBody:   { name:'JitterBody',   status:0, url:'/pub/vue/jitter/body.js'     }
  JitterBrew:   { name:'JitterBrew',   status:0, url:'/pub/vue/jitter/brew.js'     }
  JitterChoice: { name:'JitterChoice', status:0, url:'/pub/vue/jitter/choice.js'   }
  JitterDrink:  { name:'JitterDrink',  status:0, url:'/pub/vue/jitter/drink.js'    }
  JitterFlavor: { name:'JitterFlavor', status:0, url:'/pub/vue/jitter/flavor.js'   }
  JitterRoast:  { name:'JitterRoast',  status:0, url:'/pub/vue/jitter/roast.js'    }
  MBoxHtml:     { name:'MBoxHtml',     status:0, url:'/pub/app/mbox/mbox.html'     }
  Vue:          { name:'Vue',          status:0, url:'/pub/lib/vue/vue.esm.browser.js' }
  VueRouter:    { name:'VueRouter',    status:0, url:'/pub/lib/vue/vue-router.esm.js'  }
  ChromeIcon:   { name:'ChromeIcon',   status:0, url:'/pub/css/icons/android-chrome-512x512.png' }
  Roboto:       { name:'Roboto',       status:0, url:'/pub/css/font/roboto/Roboto.css' }
  RobotoTTF:    { name:'RobotoTTF',    status:0, url:'/pub/css/font/roboto/Roboto-Regular.ttf'      }
  FaSolidWoff2: { name:'FaSolidWoff2', status:0, url:'/pub/css/font/fontawesome/fa-solid-900.woff2' }
  FaBrandWoff2: { name:'FaBrandWoff2', status:0, url:'/pub/css/font/fontawesome/fa-brans-400.woff2' }
  FaInit:       { name:'FaInit',       status:0, url:'/pub/css/font/fontawesome/init.css' }
  FontAweJS:    { name:'FontAweJS',    status:0, url:'/pub/base/draw/FontAwe.js' }
  Mixin:        { name:'Mixin',        status:0, url:'/pub/base/vue/Mixin.js'    }
  Stream:       { name:'Stream',       status:0, url:'/pub/base/util/Stream.js'  }
  Cache:        { name:'Cache',        status:0, url:'/pub/base/util/Cache.js'   }
  UtilJS:       { name:'UtilJS',       status:0, url:'/pub/base/util/Util.js'    }
  DataJS:       { name:'DataJS',       status:0, url:'/pub/base/util/Data.js'    }
  VisJS:        { name:'VisJS',        status:0, url:'/pub/base/draw/Vis.js'     }
  NavJS:        { name:'NavJS',        status:0, url:'/pub/base/nav/Nav.js'      }
  BuildJS:      { name:'BuildJS',      status:0, url:'/pub/muse/conn/Build.js'   }
  RollJS:       { name:'RollJS',       status:0, url:'/pub/app/muse/roll.js'     }
  PrinJson:     { name:'PrinJson',     status:0, url:'/pub/data/muse/Prin.json'  }
  RowsJson:     { name:'RowsJson',     status:0, url:'/pub/data/muse/Rows.json'  }
  InfoJson:     { name:'InfoJson',     status:0, url:'/pub/data/muse/Info.json'  }
  KnowJson:     { name:'KnowJson',     status:0, url:'/pub/data/muse/Know.json'  }
  WiseJson:     { name:'WiseJson',     status:0, url:'/pub/data/muse/Wise.json'  }
  DataJson:     { name:'DataJson',     status:0, url:'/pub/data/muse/Data.json'  }
}


Worker.create = ( cacheName, cacheObjs, logPub ) ->
  worker = new Worker( cacheName, cacheObjs, logPub )
  if worker is false then {}
  # console.log( "Worker.create()", cacheName )
  return

Worker.create( Worker.cacheName, Worker.cacheObjs, true )

# export default Worker
