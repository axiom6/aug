
//   ignore    "**/.*",

let obj = {
  "hosting": {
    // ...

    // Add the "redirects" attribute within "hosting"
    "redirects": [{
      // Returns a permanent redirect to "/bar" for requests to "/foo" (but not "/foo/**")
      "source": "/foo",
      "destination": "/bar",
      "type": 301
    }, {
      // Returns a permanent redirect to "/bar" for requests to both "/foo" and "/foo/**"
      "source": "/foo{,/**}",
      "destination": "/bar",
      "type": 301
    }, {
      // Returns a temporary redirect for all requests to files or directories in the "firebase" directory
      "source": "/firebase/**",
      "destination": "https://firebase.google.com/",
      "type": 302
    }, {
      // A regular expression-based redirect equivalent to the above behavior
      "regex": "/firebase/.*",
      "destination": "https://firebase.google.com/",
      "type": 302
    }]
  }
}
