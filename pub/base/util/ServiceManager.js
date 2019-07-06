var ServiceManager,
  hasProp = {}.hasOwnProperty;

ServiceManager = class ServiceManager {
  constructor(stream) {
    this.publishStatus = this.publishStatus.bind(this);
    this.quota = this.quota.bind(this);
    this.quotaGranted = this.quotaGranted.bind(this);
    this.onlineEvent = this.onlineEvent.bind(this);
    this.stream = stream;
    this.subject = 'ServiceWorker';
    this.serviceWorker = null;
    this.cacheName = 'Augm';
    this.cacheObjs = this.toCacheObjs();
    this.cacheUrls = this.toCacheUrls(this.cacheObjs);
    this.offlinePage = this.cacheObjs.Html.url;
    this.onlineEvent();
    this.subscribe(this.subject);
    this.register('./ServiceWorker.js');
  }

  register(swUrl) {
    if (navigator['serviceWorker'] == null) {
      console.error("ServiceManager", "This browser does not suppor service workers");
      return;
    }
    return navigator.serviceWorker.register(swUrl, {
      scope: './'
    }).then((registration) => {
      var serviceWorkerNav;
      serviceWorkerNav = null;
      if (registration.installing != null) {
        serviceWorkerNav = registration.installing;
      } else if (registration.waiting != null) {
        serviceWorkerNav = registration.waiting;
      } else if (registration.active) {
        serviceWorkerNav = registration.active;
      }
      if (serviceWorkerNav != null) {
        this.publish('Register', 'Success');
        return serviceWorkerNav.addEventListener('statechange', (event) => {
          return this.publish('StateChange', event.target.state);
        });
      }
    }).catch((error) => {
      return this.publish('Register', {
        swUrl: swUrl
      }, error);
    });
  }

  toCacheObjs() {
    return {
      Html: {
        name: 'Html',
        url: './augm.html'
      },
      Augm: {
        name: 'Augm',
        url: './app/augm/Augm.js'
      },
      Vue: {
        name: 'Vue',
        url: './lib/vue/vue.esm.browser.js'
      },
      Main: {
        name: 'Main',
        url: './app/augm/Main.js'
      },
      Home: {
        name: 'Main',
        url: './app/augm/Home.js'
      },
      Router: {
        name: 'Router',
        url: './app/augm/router.js'
      },
      VueRouter: {
        name: 'VueRouter',
        url: './lib/vue/vue-router.esm.js'
      },
      Roboto: {
        name: 'Roboto',
        url: './css/font/roboto/Roboto.css'
      },
      Roll: {
        name: 'Roll',
        url: './app/augm/Augm.roll.js' // Gets deleted as a test
      }
    };
  }

  toCacheUrls(objs) {
    var key, obj, urls;
    urls = [];
    for (key in objs) {
      if (!hasProp.call(objs, key)) continue;
      obj = objs[key];
      urls.push(obj.url);
    }
    return urls;
  }

  publish(status, text, error = null) {
    var message;
    message = {
      status: status,
      text: text
    };
    if (error != null) {
      message.error = error;
    }
    this.stream.publish(this.subject, message);
  }

  publishStatus(status, error = null) {
    switch (status) {
      case 'Ready':
        this.publish('Ready', 'App is being served from cache by a service worker');
        break;
      case 'Registered':
        this.publish('Registered', 'Service worker has been registered');
        break;
      case 'Cached':
        this.publish('Cached', 'Content has been cached for offline use');
        break;
      case 'UpdateFound':
        this.publish('UpdateFound', 'New content is downloading');
        break;
      case 'Updated':
        this.publish('Updated', 'New content is available; please refresh.');
        break;
      case 'Offline':
        this.publish('Offline', 'No internet connection found. App is offline');
        break;
      case 'Online':
        this.publish('Online', 'Internet connected');
        break;
      case 'RegisterError':
        this.publish('RegisterError', 'Error during service worker registration', error);
        break;
      default:
        this.publish('UnknownStatus', 'Unknown status published');
    }
  }

  subscribe(subject) {
    return this.stream.subscribe(subject, 'ServiceManager', this.consoleStatus);
  }

  consoleStatus(message) {
    if (message.error == null) {
      console.log('ServiceManager', {
        status: message.status,
        text: message.text
      });
    } else {
      console.error('ServiceManager', {
        status: message.status,
        text: message.text,
        error: message.error
      });
    }
  }

  quota() {
    navigator['storageQuota'].queryInfo("temporary").then(function(info) {
      return this.publish('Quota', `Quota:${info.quota} Usage: ${info.usage}`);
    });
  }

  quotaGranted() {
    navigator.storage.requestPersistent().then((granted) => {
      return this.publish('QuotaGranted', granted);
    });
  }

  onlineEvent() {
    window.addEventListener("load", () => {
      var handleNetworkChange;
      handleNetworkChange = (event) => {
        var status;
        if (event === false) {
          ({});
        }
        status = navigator.onLine ? 'Online' : 'Offline';
        this.stream.publish(this.subject, status);
      };
      window.addEventListener("online", handleNetworkChange);
      return window.addEventListener("offline", handleNetworkChange);
    });
  }

};

export default ServiceManager;
