
#mport Register from './Register.js'
#mport Worker   from '../../Worker.js'

class Manage

  constructor:( @stream ) ->
    @subject     = 'Worker'
    @cacheName   = 'Augm'
    @cacheObjs   = @toCacheObjs()
    @cacheUrls   = @toCacheUrls( @cacheObjs )
    @offlinePage = @cacheObjs.Html.url
    @subscribe( @subject )
    @register('./Worker.js' )

  register:( swUrl ) ->

    if not navigator['serviceWorker']?
      console.error( "Manage ServiceWorker", "This browser does not suppor service workers")
      return

    navigator.serviceWorker.register( swUrl, { scope: './' } )
      .then( (registration) =>
        serviceWorker = null
        if registration.installing?
          serviceWorker = registration.installing;
        else if registration.waiting?
          serviceWorker = registration.waiting
        else if registration.active
          serviceWorker = registration.active

        if serviceWorker?
          @worker = new self['Worker']( @ )
          @publish( 'Register', 'Success' )
          serviceWorker.addEventListener('statechange', (event) =>
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
    @stream.subscribe( subject, 'SetupServiceWorker', @consoleStatus )

  consoleStatus:( message ) ->
    if not message.error?
      console.log(   'Manage Service Worker', { status:message.status, text:message.text } )
    else
      console.error( 'Manage Service Worker', { status:message.status, text:message.text, error:message.error } )
    return

  quota:() =>
    navigator['storageQuota'].queryInfo("temporary").then( (info) ->
      @publish( 'Quota', "Quota:#{info.quota} Usage: #{info.usage}") )
    return

  quotaGranted:() =>
    navigator.storage.requestPersistent().then( (granted) =>
      @publish( 'QuotaGranted', granted ) )
    return

export default Manage