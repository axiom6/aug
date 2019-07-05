var Setup,
  hasProp = {}.hasOwnProperty;

import Register from './Register';

import Worker from './Worker';

Setup = class Setup {
  constructor(stream) {
    this.publishStatus = this.publishStatus.bind(this);
    this.quota = this.quota.bind(this);
    this.quotaGranted = this.quotaGranted.bind(this);
    this.stream = stream;
    this.subject = 'Worker';
    this.cacheName = 'Augm';
    this.cacheUrls = this.toCacheUrls();
    this.subscribe(this.subject);
    this.worker = new Worker(this);
    this.register = new Register(this, '/bas/sw/Worker.js');
  }

  cacheObjs() {
    return {
      Html: {
        name: 'Html',
        url: '/augm.html'
      },
      Augm: {
        name: 'Augm',
        url: '/app/augm/Augm.js'
      },
      Vue: {
        name: 'Vue',
        url: '/lib/vue/vue.esm.browser.js'
      },
      Main: {
        name: 'Main',
        url: '/app/augm/Main.js'
      },
      Home: {
        name: 'Main',
        url: '/app/augm/Home.js'
      },
      Router: {
        name: 'Router',
        url: '/app/augm/router.js'
      },
      VueRouter: {
        name: 'VueRouter',
        url: '/lib/vue/vue-router.esm.js'
      },
      Roboto: {
        name: 'Roboto',
        url: '/css/font/roboto/Roboto.css'
      },
      Roll: {
        name: 'Roll',
        url: '/app/augm/Augm.roll.js' // Gets deleted as a test
      }
    };
  }

  toCacheUrls() {
    var key, obj, objs, urls;
    objs = this.cacheObjs();
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
    return this.stream.subscribe(subject, 'SetupServiceWorker', this.consoleStatus);
  }

  consoleStatus(message) {
    if (message.error == null) {
      console.log('Setup Service Worker', {
        status: message.status,
        text: message.text
      });
    } else {
      console.error('Setup Service Worker', {
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

};

export default Setup;
