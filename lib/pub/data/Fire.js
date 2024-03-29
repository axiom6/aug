var Fire,
  hasProp = {}.hasOwnProperty;

import Store from './Store.js';

import firebase from 'firebase';

Fire = class Fire extends Store {
  constructor(stream, dbName) {
    super(stream, dbName);
    this.init(this.config());
    this.fd = firebase.database();
  }

  // https://console.firebase.google.com/project/data-muse/overview
  config() {
    return {
      apiKey: "AIzaSyDuWZIanBoKVZiPTcxDMQ9HyC2Ak3cr7j8",
      authDomain: "data-muse.firebaseapp.com",
      databaseURL: "https://data-muse-default-rtdb.firebaseio.com",
      projectId: "data-muse",
      storageBucket: "data-muse.appspot.com",
      messagingSenderId: "782871064051",
      appId: "1:782871064051:web:a4914c83e898b45e7c7686"
    };
  }

  init(config) {
    firebase.initializeApp(config);
  }

  add(table, id, obj) {
    this.fd.ref(table + '/' + id).set(obj).then((snaps) => {
      return this.results(table, 'add', obj);
    }).catch((error) => {
      return this.onerror(table, 'add', error, id);
    });
  }

  get(table, id, callback) {
    this.fd.ref(table + '/' + id).once('value').then((snaps) => {
      return this.firemsg(table, 'get', snaps, null, callback);
    }).catch((error) => {
      return this.onerror(table, 'get', error, id);
    });
  }

  put(table, id, obj) { // Same as add
    this.fd.ref(table + '/' + id).set(obj).then((snaps) => {
      return this.results(table, 'put', obj);
    }).catch((error) => {
      return this.onerror(table, 'put', error, id);
    });
  }

  del(table, id) {
    this.fd.ref(table + '/' + id).remove().then(() => {
      return this.firemsg(table, 'del', {});
    }).catch((error) => {
      return this.onerror(table, 'del', error, id);
    });
  }

  select(table, where, callback = null) {
    this.fd.ref(table).once('value').then((snaps) => {
      return this.firemsg(table, 'select', snaps, where, callback);
    }).catch((error) => {
      return this.onerror(table, 'select', error);
    });
  }

  insert(table, objs) {
    this.fd.ref(table).set(objs).then((snaps) => {
      return this.results(table, 'insert', objs);
    }).catch((error) => {
      return this.onerror(table, 'insert', error);
    });
  }

  update(table, objs) {
    this.fd.ref(table).update(objs).then((snaps) => {
      return this.results(table, 'update', objs);
    }).catch((error) => {
      return this.onerror(table, 'update', error);
    });
  }

  remove(table, where) {
    this.fd.ref(table).once('value').then((snaps) => {
      var key, obj, objs;
      if (this.isSnaps(snaps)) {
        objs = this.toObjects(snaps.val(), where);
        for (key in objs) {
          if (!hasProp.call(objs, key)) continue;
          obj = objs[key];
          if (where(obj)) {
            this.del(table, key); // @fd.ref(table+'/'+key).remove()
          }
        }
        return this.results(table, 'remove', objs);
      }
    }).catch((error) => {
      return this.onerror(table, 'remove', error);
    });
  }

  show() {
    this.showTables();
  }

  open(table) {
    this.openTable(table);
  }

  // ref.remove() is Dangerous and has removed all tables in Firebase
  drop(table) {
    this.dropTable(table);
    this.fd.ref(table).remove().then((snaps) => {
      return this.firemsg(table, 'drop', snaps);
    }).catch((error) => {
      return this.onerror(table, 'drop', error);
    });
  }

  // Have too clarify id with snapshot.key
  change(table, id = 'none', callback = null, Event = 'put') {
    var path;
    path = id === 'none' ? table : table + '/' + id;
    this.fd.ref(path).on(Fire.EventType[Event]).then((snaps) => {
      return this.firemsg(table, 'change', snaps, null, callback);
    }).catch((error) => {
      return this.onerror(table, 'change', error);
    });
  }

  range(table, beg, end) {
    this.fd.ref(table).orderByKey().startAt(beg).endAt(end).once('value').then((snaps) => {
      return this.firemsg(table, 'range', snaps);
    }).catch((error) => {
      return this.onerror(table, 'range', error);
    });
  }

  firemsg(table, op, snaps, query = null, callback = null) {
    var objs, where;
    where = query != null ? query : function(obj) {
      return true;
    };
    objs = this.isSnaps(snaps) ? this.toObjects(snaps.val(), where) : snaps;
    if (callback != null) {
      callback(objs);
    } else {
      this.results(table, op, objs);
    }
  }

  isSnaps(snaps) {
    return (snaps != null) && (snaps.val != null) && (snaps.key != null);
  }

  // Sign Anonymously
  auth() {
    this.fb.auth().signInAnonymously().then(((creds) => {
      return this.results('auth', 'auth', creds);
    })).catch((error) => {
      return this.onerror('auth', 'auth', error);
    });
  }

};

Fire.EventType = {
  get: "value",
  add: "child_added",
  put: "child_changed",
  del: "child_removed"
};

export default Fire;

/*
import firebase from 'firebase'

class Fire extends Store

  constructor:( stream, dbName ) ->
    super(      stream, dbName )
    @init( @config() )
    @fd = firebase.database()

  =====

  import { initializeApp } from 'firebase/app'
  import { Database      } from 'firebase/database'

  class Fire extends Store

  constructor:( stream, dbName ) ->
    super(      stream, dbName )
    @fireApp = initializeApp( @config() )
    @fd = Database( @fireApp )
*/

//# sourceMappingURL=Fire.js.map
