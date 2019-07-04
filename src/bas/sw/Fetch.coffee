
class Fetch

  constructor:( @htmlUrl ) ->
    self.addEventListener('fetch', @onFetch(event) )

  onFetch:( event ) =>

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


export default Fetch