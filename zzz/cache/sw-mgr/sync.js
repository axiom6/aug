
// sw.js
self.addEventListener('sync', event => {
  if (event.tag === 'submit') {
    console.log('sync!');
  }
});