

class ServiceManager

  constructor:( @stream ) ->
    @subject       = 'ServiceWorker'
    @serviceWorker = null
    @cacheName     = 'Augm'
    @cacheObjs     = @toCacheObjs()
    @cacheUrls     = @toCacheUrls( @cacheObjs )
    @offlinePage   = @cacheObjs.Html.url
    @onlineEvent()
    @subscribe( @subject )
    @register('./ServiceWorker.js' )

  register:( swUrl ) ->

    if not navigator['serviceWorker']?
      console.error( "ServiceManager", "This browser does not suppor service workers")
      return

    navigator.serviceWorker.register( swUrl, { scope: './' } )
      .then( (registration) =>
        serviceWorkerNav = null
        if registration.installing?
          serviceWorkerNav = registration.installing;
        else if registration.waiting?
          serviceWorkerNav = registration.waiting
        else if registration.active
          serviceWorkerNav = registration.active

        if serviceWorkerNav?
          @publish( 'Register', 'Success' )
          serviceWorkerNav.addEventListener('statechange', (event) =>
            @publish( 'StateChange', event.target.state ) ) )

      .catch( (error) =>
        @publish( 'Register', { swUrl:swUrl }, error ) )


  toCacheObjs:() -> {
    Html:     { name:'Html',      url:'./augm.html' }
    Augm:     { name:'Augm',      url:'./app/augm/Augm.js' }
    Vue:      { name:'Vue',       url:'./lib/vue/vue.esm.browser.js' }
    Main:     { name:'Main',      url:'./app/augm/Main.js'   }
    Home:     { name:'Main',      url:'./app/augm/Home.js'   }
    Router:   { name:'Router',    url:'./app/augm/router.js' }
    VueRouter:{ name:'VueRouter', url:'./lib/vue/vue-router.esm.js' }
    Roboto:   { name:'Roboto',    url:'./css/font/roboto/Roboto.css' }
    Roll:     { name:'Roll',      url:'./app/augm/Augm.roll.js' } }  # Gets deleted as a test

  toCacheUrls:( objs ) ->
    urls = []
    urls.push( obj.url ) for own key, obj of objs
    urls

  publish:( status, text, error=null ) ->
    message       = { status:status, text:text }
    message.error = error if error?
    @stream.publish( @subject, message )
    return

  publishStatus:( status, error=null ) =>
    switch status
      when 'Ready'         then @publish( 'Ready',        'App is being served from cache by a service worker' )
      when 'Registered'    then @publish( 'Registered',   'Service worker has been registered')
      when 'Cached'        then @publish( 'Cached',       'Content has been cached for offline use')
      when 'UpdateFound'   then @publish( 'UpdateFound',  'New content is downloading' )
      when 'Updated'       then @publish( 'Updated',      'New content is available; please refresh.')
      when 'Offline'       then @publish( 'Offline',      'No internet connection found. App is offline')
      when 'Online'        then @publish( 'Online',       'Internet connected' )
      when 'RegisterError' then @publish( 'RegisterError','Error during service worker registration', error )
      else                      @publish( 'UnknownStatus','Unknown status published' )
    return

  subscribe:( subject ) ->
    @stream.subscribe( subject, 'ServiceManager', @consoleStatus )

  consoleStatus:( message ) ->
    if not message.error?
      console.log(   'ServiceManager', { status:message.status, text:message.text } )
    else
      console.error( 'ServiceManager', { status:message.status, text:message.text, error:message.error } )
    return

  quota:() =>
    navigator['storageQuota'].queryInfo("temporary").then( (info) ->
      @publish( 'Quota', "Quota:#{info.quota} Usage: #{info.usage}") )
    return

  quotaGranted:() =>
    navigator.storage.requestPersistent().then( (granted) =>
      @publish( 'QuotaGranted', granted ) )
    return

  onlineEvent:() =>
    window.addEventListener("load", () =>
      handleNetworkChange = (event) =>
        if event is false then {}
        status = if navigator.onLine then 'Online' else 'Offline'
        @stream.publish( @subject, status )
        return
      window.addEventListener("online",  handleNetworkChange )
      window.addEventListener("offline", handleNetworkChange ) )
    return

export default ServiceManager