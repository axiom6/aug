

class Cache

  constructor:( @stream ) ->
    @register('./Worker.js' )

  register:( swUrl ) ->

    if not navigator['serviceWorker']?
      console.error( "Cache", "This browser does not suppor service workers")
      return

    navigator.serviceWorker.register( swUrl, { scope: './' } )
      .then( (registration) =>
        serviceWorkerRegistration = null
        if registration.installing?
          serviceWorkerRegistration = registration.installing;
        else if registration.waiting?
          serviceWorkerRegistration = registration.waiting
        else if registration.active
          serviceWorkerRegistration = registration.active

        if serviceWorkerRegistration?
          @publish( 'Register', 'Success' ) )
          #serviceWorkerRegistration.addEventListener('statechange', (event) =>
          #  @publish( 'StateChange', event.target.state ) ) )

      .catch( (error) =>
        @publish( 'Register', { swUrl:swUrl }, error ) )

  publish:( status, text, error=null ) ->
    object       = { status:status, text:text }
    object.error = error if error?
    @stream.publish( @subject, object )
    return

  subscribe:() ->
    @stream.subscribe( @subject, 'Cache', @consoleStatus )

  consoleStatus:( object ) ->
    if object.error?
      console.error( 'Cache', { status:object.status, text:object.text, error:object.error } )
    # else
      # console.log(   'Cache', { status:object.status, text:object.text } )
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
        @publish( status, 'Cache.onlineEvent()' )
        return
      window.addEventListener("online",  handleNetworkChange )
      window.addEventListener("offline", handleNetworkChange ) )
    return

export default Cache