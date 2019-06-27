var Fire,
  hasProp = {}.hasOwnProperty;

import firebase from '../../../pub/lib/store/firebase.app.esm.js';

import '../../../pub/lib/store/firebase.database.esm.js';

import '../../../pub/lib/store/firebase.auth.esm.js';

Fire = (function() {
  class Fire {
    constructor(store, config) {
      this.store = store;
      this.dbName = this.store.dbName;
      this.tables = this.store.tables;
      this.keyProp = 'id';
      this.fb = this.init(this.config("augm-d4b3c"));
      //@auth() # Anonomous logins have to be enabled
      this.fd = firebase.database();
    }

    config(projectId) {
      return {
        projectId: projectId,
        apiKey: "AIzaSyD4Py9oML_Y77ze9bGX0I8s9hqndKkBVjY",
        authDomain: `${projectId}.firebaseapp.com`,
        databaseURL: `https://${projectId}.firebaseio.com`,
        storageBucket: `${projectId}.appspot.com`,
        messagingSenderId: "sender-id",
        appID: "app-id"
      };
    }

    init(config) {
      firebase.initializeApp(config);
      //console.log( 'Fires.init', config )
      return firebase;
    }

    batch(name, obj, objs, callback = null) {
      this.fd.ref(table).once('value').then((snapshot) => {
        if ((snapshot != null) && (snapshot.val() != null)) {
          obj.result = snapshot.val();
          if (this.store.batchComplete(objs)) {
            if (callback != null) {
              return callback(objs);
            } else {
              return this.store.results(name, 'batch', objs);
            }
          }
        }
      }).catch((error) => {
        return this.store.onerror(obj.table, 'batch', error);
      });
    }

    // Have too clarify id with snapshot.key
    change(table, id = 'none', callback = null, Event = 'put') {
      var path;
      path = id === 'none' ? table : table + '/' + id;
      this.fd.ref(path).on(Fire.EventType[Event], onChange).then((snapshot) => {
        var key, val;
        if (snapshot != null) {
          key = snapshot.key;
          val = snapshot.val();
          if (callback != null) {
            return callback(val);
          } else {
            return this.store.results(table, 'change', val, key);
          }
        }
      }).catch((error) => {
        return this.store.onerror(table, 'change', error);
      });
    }

    get(table, id, callback) {
      this.fd.ref(table + '/' + id).once('value').then((snapshot) => {
        if ((snapshot != null) && (snapshot.val() != null)) {
          if (callback != null) {
            return callback(snapshot.val());
          } else {
            return this.store.results(table, 'get', snapshot.val(), id);
          }
        }
      }).catch((error) => {
        return this.store.onerror(table, 'get', error, id);
      });
    }

    add(table, id, object) {
      this.fd.ref(table + '/' + id).set(object).catch((error) => {
        return this.store.onerror(table, 'add', error, id);
      });
    }

    // Same as add
    put(table, id, object) {
      this.fd.ref(table + '/' + id).set(object).catch((error) => {
        return this.store.onerror(table, 'put', error, id);
      });
    }

    del(table, id) {
      this.fd.ref(table + '/' + id).remove().catch((error) => {
        return this.store.onerror(table, 'del', error, id);
      });
    }

    select(table, where, callback = null) {
      this.fd.ref(table).once('value').then((snapshot) => {
        var objs;
        if ((snapshot != null) && (snapshot.val() != null)) {
          objs = this.store.toObjs(snapshot.val(), where, this.keyProp);
          if (callback != null) {
            return callback(objs);
          } else {
            return this.store.results(table, 'select', objs);
          }
        }
      });
    }

    insert(table, objects) {
      this.fd.ref(table).set(objects).catch((error) => {
        return this.store.onerror(table, 'insert', error);
      });
    }

    update(table, objects) {
      this.fd.ref(table).update(objects).catch((error) => {
        return this.store.onerror(table, 'update', error);
      });
    }

    remove(table, where) {
      var key, obj, objs;
      this.fd.ref(table).once('value').then((snapshot) => {}, (function() {
        if ((typeof snapshot !== "undefined" && snapshot !== null) && (snapshot.val() != null)) {
          objs = this.store.toObjs(snapshot.val(), where, this.keyProp);
          for (key in objs) {
            if (!hasProp.call(objs, key)) continue;
            obj = objs[key];
            this.del(table, key); // @fd.ref(table+'/'+key).remove()
          }
          return this.store.results(table, 'select', objs);
        }
      }).call(this));
    }

    range(table, beg, end) {
      this.fd.ref(table).orderByKey().startAt(beg).endAt(end).once('value').then((snapshot) => {
        var objs;
        if ((snapshot != null) && (snapshot.val() != null)) {
          objs = this.toObjects(snapshot.val());
          return this.store.results(table, 'range', objs);
        }
      }).catch((error) => {
        return this.store.onerror(table, 'range', error);
      });
    }

    // Need to learn what opening a table means in firebase
    open(table) {
      if (table === false) {
        ({});
      }
    }

    // ref.remove() is Dangerous and has removed all tables in Firebase
    // @fd.ref(table).set( {} )
    //    .catch( (error) =>
    //      @store.onerror( table, 'open', error ) )
    drop(table) {
      this.fd.ref(table).remove().catch((error) => {
        return this.store.onerror(table, 'drop', error);
      });
    }

    // Sign Anonymously
    auth() {
      this.fb.auth().signInAnonymously().catch((error) => {
        return this.store.onerror('auth', 'auth', error);
      });
    }

  };

  Fire.EventType = {
    get: "value",
    add: "child_added",
    put: "child_changed",
    del: "child_removed"
  };

  return Fire;

}).call(this);

export default Fire;

//mport firebase from "firebase/app" # Firebase core (required)
//mport "firebase/database"          # Realtime Database
//mport firebase from '../../../pub/lib/store/Firebase.esm.stub.js'
//mport "firebase/auth"              # Authentication
//mport "firebase/firestore"         # Cloud Firestore
//mport "firebase/functions"         # Cloud Functions for Firebase Client SDK
//mport "firebase/messaging"         # Cloud Messaging
//mport "firebase/storage"           # Cloud Storage
//mport "firebase/performance"       # Performance Monitoring (beta release)
