
// app.js
// ask for permission
Notification.requestPermission(permission => {
  console.log('permission:', permission);
});

// display notification
function displayNotification() {
  if (Notification.permission == 'granted') {
    navigator.serviceWorker.getRegistration()
      .then(registration => {
        registration.showNotification('this is a notification!');
      });
  }
}

// sw.js
self.addEventListener('notificationclick', event => {
  // notification click event
});

self.addEventListener('notificationclose', event => {
  // notification closed event
})