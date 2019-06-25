var Fire;

import firebase from '../../../pub/lib/store/firebase.app.esm.js';

import '../../../pub/lib/store/firebase.database.esm.js';

import '../../../pub/lib/store/firebase.auth.esm.js';

Fire = (function() {
  class Fire {
    constructor(store, config) {
      this.store = store;
      this.dbName = this.store.dbName;
      this.tables = this.store.tables;
      this.fb = this.init(config);
      this.keyProp = 'id';
      this.auth(); // Anonomous logins have to be enabled
      this.fd = firebase.database();
    }

    init(config) {
      firebase.initializeApp(config);
      //console.log( 'Fires.init', config )
      return firebase;
    }

    batch(name, obj, objs, callback = null) {
      var onBatch;
      onBatch = (snapshot) => {
        if ((snapshot != null) && (snapshot.val() != null)) {
          obj.result = snapshot.val();
          if (this.store.batchComplete(objs)) {
            if (callback != null) {
              return callback(objs);
            } else {
              return this.store.results(name, 'batch', objs);
            }
          }
        } else {
          return this.store.onerror(obj.table, 'batch', 'Fire batch error');
        }
      };
      this.fd.ref(table).once('value', onBatch);
    }

    // Have too clarify id with snapshot.key
    change(table, id = 'none', callback = null, onEvt = 'put') {
      var onComplete, path;
      onComplete = (snapshot) => {
        var key, val;
        if (snapshot != null) {
          key = snapshot.key;
          val = snapshot.val();
          if (callback != null) {
            return callback(val);
          } else {
            return this.store.results(table, 'change', val, key);
          }
        } else {
          return this.store.onerror(table, 'change', 'Fire batch error');
        }
      };
      path = id === 'none' ? table : table + '/' + id;
      this.fd.ref(path).on(Fire.OnFire[onEvt], onComplete);
    }

    get(table, id, callback) {
      var onComplete;
      onComplete = (snapshot) => {
        if ((snapshot != null) && (snapshot.val() != null)) {
          if (callback != null) {
            return callback(snapshot.val());
          } else {
            return this.store.results(table, 'get', snapshot.val(), id);
          }
        } else {
          return this.store.onerror(table, 'get', 'Fire get error', id);
        }
      };
      this.fd.ref(table + '/' + id).once('value', onComplete);
    }

    add(table, id, object) {
      var onComplete;
      object[this.keyProp] = id;
      onComplete = (error) => {
        if (error != null) {
          return this.store.onerror(table, 'add', {
            error: error,
            object: object
          }, id);
        }
      };
      this.fd.ref(table + '/' + id).set(object, onComplete);
    }

    // Same as add
    put(table, id, object) {
      var onComplete;
      onComplete = (error) => {
        if (error != null) {
          return this.store.onerror(table, 'put', {
            error: error,
            object: object
          }, id);
        }
      };
      this.fd.ref(table + '/' + id).set(object, onComplete);
    }

    del(table, id) {
      var onComplete;
      onComplete = (error) => {
        if (error != null) {
          return this.store.onerror(table, 'del', {
            error: error
          }, id);
        }
      };
      this.fd.ref(table + '/' + id).remove(onComplete);
    }

    select(table, where, callback = null) {
      var onComplete;
      if (where === false) {
        ({});
      }
      onComplete = (snapshot) => {
        if ((snapshot != null) && (snapshot.val() != null)) {
          if (callback != null) {
            return callback(snapshot.val());
          } else {
            return this.store.results(table, 'select', snapshot.val());
          }
        }
      };
      this.fd.ref(table).once('value', onComplete);
    }

    insert(table, objects) {
      var onComplete;
      onComplete = (error) => {
        if (error != null) {
          return this.store.onerror(table, 'insert', {
            error: error
          });
        }
      };
      this.fd.ref(table).set(objects, onComplete);
    }

    range(table, beg, end) {
      var onComplete;
      onComplete = (snapshot) => {
        var val;
        if ((snapshot != null) && (snapshot.val() != null)) {
          val = this.toObjects(snapshot.val());
          return this.store.results(table, 'range', val);
        }
      };
      this.fd.ref(table).orderByKey().startAt(beg).endAt(end).once('value', onComplete);
    }

    update(table, objects) {
      var onComplete;
      onComplete = (error) => {
        if (error != null) {
          return this.store.onerror(table, 'update', {
            error: error
          });
        }
      };
      this.fd.ref(table).update(objects, onComplete);
    }

    remove(table, keys) {
      var i, key, len, ref;
      ref = this.fd.ref(table);
      for (i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        ref.child(key).remove();
      }
    }

    // Need to implement
    open(table) {
      if (table === false) {
        ({});
      }
    }

    // ref.remove( onComplete ) is Dangerous and has removed all tables in Firebase
    drop(table) {
      if (table === false) {
        ({});
      }
    }

    // keyProp only needed if rows is array
    toObjects(rows) {
      var ckey, i, len, objects, row;
      objects = {};
      if (this.store.isArray(rows)) {
        for (i = 0, len = rows.length; i < len; i++) {
          row = rows[i];
          if ((row != null) && (row['key'] != null)) {
            ckey = row['key'].split('/')[0];
            objects[row[ckey]] = this.toObjects(row);
            console.log('Fire.toObjects', {
              rkowKey: row['key'],
              ckey: ckey,
              row: row
            });
          } else {
            console.error("Fire.toObjects() row array element requires key property", row);
          }
        }
      } else {
        objects = rows;
      }
      return objects;
    }

    // Sign Anonymously
    auth() {
      var onerror;
      onerror = (error) => {
        return this.store.onerror('auth', 'auth', {
          error: error
        });
      };
      this.fb.auth().signInAnonymously().catch(onerror);
    }

  };

  Fire.OnFire = {
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
