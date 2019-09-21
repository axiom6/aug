
// Google
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

// MDN
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw-test/sw.js', {scope: './sw-test/'})
    .then((reg) => {
      // registration worked
      console.log('Registration succeeded. Scope is ' + reg.scope);
    }).catch((error) => {
    // registration failed
    console.log('Registration failed with ' + error);
  });
}