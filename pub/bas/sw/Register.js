  // Register a service worker to serve assets from local cache.

  // This lets the app load faster on subsequent visits in production, and gives
  // it offline capabilities. However, it also means that developers (and users)
  // will only see deployed updates on the "N+1" visit to a page, since previously
  // cached resources are updated in the background.
var Register,
  indexOf = [].indexOf;

Register = class Register {
  constructor(setup, swUrl, hooks) {
    var registrationOptions;
    this.registerValidSW = this.registerValidSW.bind(this);
    this.checkValidServiceWorker = this.checkValidServiceWorker.bind(this);
    this.unregister = this.unregister.bind(this);
    this.setup = setup;
    if (hooks == null) {
      hooks = {};
    }
    registrationOptions = hooks['registrationOptions'] == null ? {} : hooks['registrationOptions'];
    delete hooks['registrationOptions'];
    if (indexOf.call(navigator, 'serviceWorker') >= 0) {
      window.addEventListener('load', () => {
        if (this.isLocalhost()) {
          // This is running on localhost. Lets check if a service worker still exists or not.
          this.checkValidServiceWorker(swUrl, this.emit, registrationOptions);
          return navigator.serviceWorker.ready.then((registration) => {
            return this.emit('ready', registration);
          });
        } else {
          // Is not local host. Just register service worker
          return this.registerValidSW(swUrl, emit, registrationOptions);
        }
      });
    }
  }

  isLocalhost() {
    return window.location.hostname === 'localhost' || window.location.hostname === '[::1]' || window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/);
  }

  emit(hook) {
    var args, len;
    args = [];
    len = arguments.length - 1;
    while (len-- > 0) {
      args[len] = arguments[len + 1];
    }
    if (hooks && hooks[hook]) {
      hooks[hook].apply(hooks, args);
    }
  }

  register(swUrl, hooks) {}

  registerValidSW(swUrl, emit, registrationOptions) {
    return navigator.serviceWorker.register(swUrl, registrationOptions).then((registration) => {
      this.emit('registered', registration);
      if (registration.waiting) {
        this.emit('updated', registration);
        return;
      }
      return registration.onupdatefound = () => {
        var installingWorker;
        this.emit('updatefound', registration);
        installingWorker = registration.installing;
        return installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the old content will have been purged and
              // the fresh content will have been added to the cache.
              // It's the perfect time to display a "New content is
              // available; please refresh." message in your web app.
              return this.emit('updated', registration);
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              return this.emit('cached', registration);
            }
          }
        };
      };
    }).catch((error) => {
      return this.emit('error', error);
    });
  }

  checkValidServiceWorker(swUrl, emit, registrationOptions) {
    // Check if the service worker can be found.
    return fetch(swUrl).then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file.
      if (response.status === 404) {
        // No service worker found.
        this.emit('error', new Error("Service worker not found at " + swUrl));
        return this.unregister();
      } else if (response.headers.get('content-type').indexOf('javascript') === -1) {
        emit('error', new Error("Expected " + swUrl + " to have javascript content-type, " + "but received " + (response.headers.get('content-type'))));
        return this.unregister();
      } else {
        // Service worker found. Proceed as normal.
        return this.registerValidSW(swUrl, emit, registrationOptions);
      }
    }).catch((error) => {
      if (!navigator.onLine) {
        return this.emit('offline');
      } else {
        return this.emit('error', error);
      }
    });
  }

  unregister() {
    if (indexOf.call(navigator, 'serviceWorker') >= 0) {
      return navigator.serviceWorker.ready.then((registration) => {
        return registration.unregister();
      });
    }
  }

};

export default Register;
