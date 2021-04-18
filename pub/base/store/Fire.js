var Fire,
  hasProp = {}.hasOwnProperty;

import Store from './Store.js';

import firebase from 'firebase/app';

Fire = class Fire extends Store {
  constructor() {
    super();
    this.keyProp = 'id';
    this.fb = this.init(this.config("augm-d4b3c"));
    //@auth() # Anonomous logins have to be enabled
    this.fd = this.fb.database();
  }

  //@openTables( @tables )
  config(projectId) {
    return {
      projectId: projectId,
      apiKey: "AIzaSyD4Py9oML_Y77ze9bGX0I8s9hqndKkBVjY",
      authDomain: `${projectId}.firebaseapp.com`,
      databaseURL: `https://${projectId}.firebaseio.com`,
      storageBucket: `${projectId}.appspot.com`,
      messagingSenderId: "341294405322",
      appID: "1:341294405322:web:06369c7823ccc079"
    };
  }

  /*
  firebase.initializeApp({
    "apiKey": "AIzaSyD4Py9oML_Y77ze9bGX0I8s9hqndKkBVjY",
    "databaseURL": "https://augm-d4b3c.firebaseio.com",
    "storageBucket": "augm-d4b3c.appspot.com",
    "authDomain": "augm-d4b3c.firebaseapp.com",
    "messagingSenderId": "341294405322",
    "projectId": "augm-d4b3c",
    "appId": "1:341294405322:web:06369c7823ccc079"
  });
  */
  init(config) {
    //console.log( 'firebase', firebase )
    firebase.initializeApp(config);
    return firebase;
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
          return this.results(table, 'change', val, key);
        }
      }
    }).catch((error) => {
      return this.onerror(table, 'change', error);
    });
  }

  get(table, id, callback) {
    this.fd.ref(table + '/' + id).once('value').then((snapshot) => {
      if ((snapshot != null) && (snapshot.val() != null)) {
        if (callback != null) {
          return callback(snapshot.val());
        } else {
          return this.results(table, 'get', snapshot.val(), id);
        }
      }
    }).catch((error) => {
      return this.onerror(table, 'get', error, id);
    });
  }

  add(table, id, object) {
    this.fd.ref(table + '/' + id).set(object).catch((error) => {
      return this.onerror(table, 'add', error, id);
    });
  }

  // Same as add
  put(table, id, object) {
    this.fd.ref(table + '/' + id).set(object).catch((error) => {
      return this.onerror(table, 'put', error, id);
    });
  }

  del(table, id) {
    this.fd.ref(table + '/' + id).remove().catch((error) => {
      return this.onerror(table, 'del', error, id);
    });
  }

  select(table, where, callback = null) {
    this.fd.ref(table).once('value').then((snapshot) => {
      var objs;
      if ((snapshot != null) && (snapshot.val() != null)) {
        objs = this.toObjs(snapshot.val(), where, this.keyProp);
        if (callback != null) {
          return callback(objs);
        } else {
          return this.results(table, 'select', objs);
        }
      }
    });
  }

  insert(table, objects) {
    this.fd.ref(table).set(objects).catch((error) => {
      return this.onerror(table, 'insert', error);
    });
  }

  update(table, objects) {
    this.fd.ref(table).update(objects).catch((error) => {
      return this.onerror(table, 'update', error);
    });
  }

  remove(table, where) {
    var key, obj, objs;
    this.fd.ref(table).once('value').then((snapshot) => {}, (function() {
      if ((typeof snapshot !== "undefined" && snapshot !== null) && (snapshot.val() != null)) {
        objs = this.toObjs(snapshot.val(), where, this.keyProp);
        for (key in objs) {
          if (!hasProp.call(objs, key)) continue;
          obj = objs[key];
          this.del(table, key); // @fd.ref(table+'/'+key).remove()
        }
        return this.results(table, 'select', objs);
      }
    }).call(this));
  }

  range(table, beg, end) {
    this.fd.ref(table).orderByKey().startAt(beg).endAt(end).once('value').then((snapshot) => {
      var objs;
      if ((snapshot != null) && (snapshot.val() != null)) {
        objs = this.toObjects(snapshot.val());
        return this.results(table, 'range', objs);
      }
    }).catch((error) => {
      return this.onerror(table, 'range', error);
    });
  }

  openTables(tables) {
    var obj, table;
    for (table in tables) {
      if (!hasProp.call(tables, table)) continue;
      obj = tables[table];
      open(table);
    }
  }

  // Need to learn what opening a table means in firebase
  // Problem with Firebase sending a socket.io to url/Prac to Intellij server that becomes a 404
  open(table) {
    var ref;
    ref = this.fd.ref(table);
    if (!ref) {
      this.fd.root().set(table);
    }
  }

  // ref.remove() is Dangerous and has removed all tables in Firebase
  // @fd.ref(table).set( {} )
  //    .catch( (error) =>
  //      @onerror( table, 'open', error ) )
  drop(table) {
    this.fd.ref(table).remove().catch((error) => {
      return this.onerror(table, 'drop', error);
    });
  }

  // Sign Anonymously
  auth() {
    this.fb.auth().signInAnonymously().catch((error) => {
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
