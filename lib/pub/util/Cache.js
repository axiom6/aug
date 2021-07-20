// import WorkerJS from '/Worker.js'
var Cache;

Cache = class Cache {
  constructor(stream) {
    // else
    // console.log(   'Cache', { status:object.status, text:object.text } )
    this.quota = this.quota.bind(this);
    this.quotaGranted = this.quotaGranted.bind(this);
    this.onlineEvent = this.onlineEvent.bind(this);
    this.stream = stream;
    // WorkerJS.cacheName = 'Axiom'
    this.register('./Worker.js');
  }

  register(swUrl) {
    if (navigator['serviceWorker'] == null) {
      console.error("Cache", "This browser does not suppor service workers");
      return;
    }
    return navigator.serviceWorker.register(swUrl, {
      scope: './'
    }).then((registration) => {
      var serviceWorkerRegistration;
      serviceWorkerRegistration = null;
      if (registration.installing != null) {
        serviceWorkerRegistration = registration.installing;
      } else if (registration.waiting != null) {
        serviceWorkerRegistration = registration.waiting;
      } else if (registration.active) {
        serviceWorkerRegistration = registration.active;
      }
      if (serviceWorkerRegistration != null) {
        return this.publish('Register', 'Success');
      }
    //serviceWorkerRegistration.addEventListener('statechange', (event) =>
    //  @publish( 'StateChange', event.target.state ) ) )
    }).catch((error) => {
      return this.publish('Register', {
        swUrl: swUrl
      }, error);
    });
  }

  publish(status, text, error = null) {
    var object;
    object = {
      status: status,
      text: text
    };
    if (error != null) {
      object.error = error;
    }
    this.stream.publish(this.subject, object);
  }

  subscribe() {
    return this.stream.subscribe(this.subject, 'Cache', this.consoleStatus);
  }

  consoleStatus(object) {
    if (object.error != null) {
      console.error('Cache', {
        status: object.status,
        text: object.text,
        error: object.error
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
        this.publish(status, 'Cache.onlineEvent()');
      };
      window.addEventListener("online", handleNetworkChange);
      return window.addEventListener("offline", handleNetworkChange);
    });
  }

};

export default Cache;

//# sourceMappingURL=Cache.js.map
