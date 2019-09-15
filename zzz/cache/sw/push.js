
self.addEventListener('sync', function(event) {
  if (event['id'] === 'update-leaderboard') {
    event['waitUntil'](
      caches.open('mygame-dynamic').then(function(cache) {
        return cache.add('/leaderboard.json');
      })
    );
  }
});