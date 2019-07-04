var Fetch;

Fetch = class Fetch {
  constructor(htmlUrl) {
    this.onFetch = this.onFetch.bind(this);
    this.htmlUrl = htmlUrl;
    self.addEventListener('fetch', this.onFetch(event));
  }

  onFetch(event) {
    var request, requestURL;
    request = event.request;
    requestURL = new URL(request.url);
    // Handle requests to a particular host specifically
    if (requestURL.hostname === this.htmlUrl) {
      event.respondWith("some combination of patterns");
    } else if (requestURL.origin === location.origin) { // Routing for local URLs
      if (/^\/article\//.test(requestURL.pathname)) { // Handle article URLs
        event.respondWith("some combination of patterns");
      } else if (/\.webp$/.test(requestURL.pathname)) {
        event.respondWith("some combination of patterns");
      } else if (request.method === 'POST') {
        event.respondWith("some combination of patterns");
      } else if (/cheese/.test(requestURL.pathname)) {
        event.respondWith(new Response("Flagrant cheese error", {
          status: 512 // A sensible default pattern
        }));
      }
    } else {
      event.respondWith(caches.match(request).then((response) => {
        return response || fetch(request);
      }));
    }
  }

};

export default Fetch;
