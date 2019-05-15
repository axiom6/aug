var Fire;

import Util from '../../bas/util/Util.js';

import Store from './Store.js';

import Firebase from '../../../lib/store/Firebase.esm.stub.js';

Fire = (function() {
  class Fire extends Store {
    constructor(stream, uri, config) {
      super(stream, uri, 'Fire'); // @dbName set by Store in super constructor
      this.fb = this.init(this.config);
      this.keyProp = 'id';
      this.auth(); // Anonomous logins have to enabled
      this.fd = Firebase.database();
      Util.noop(Fire.OnFire, config);
    }

    init(config) {
      Firebase.initializeApp(config);
      //console.log( 'Fires.init', config )
      return Firebase;
    }

    add(t, id, object) {
      var onComplete, table;
      table = this.tableName(t);
      object[this.keyProp] = id;
      onComplete = (error) => {
        if (error == null) {
          return this.publish(table, 'add', id, object);
        } else {
          return this.onError(table, 'add', id, object, {
            error: error
          });
        }
      };
      this.fd.ref(table + '/' + id).set(object, onComplete);
    }

    get(t, id) {
      var onComplete, table;
      table = this.tableName(t);
      onComplete = (snapshot) => {
        if ((snapshot != null) && (snapshot.val() != null)) {
          return this.publish(table, 'get', id, snapshot.val());
        } else {
          return this.onError(table, 'get', id, {
            msg: 'Fire get error'
          });
        }
      };
      this.fd.ref(table + '/' + id).once('value', onComplete);
    }

    // Same as add
    put(t, id, object) {
      var onComplete, table;
      table = this.tableName(t);
      onComplete = (error) => {
        if (error == null) {
          return this.publish(table, 'put', id, object);
        } else {
          return this.onError(table, 'put', id, object, {
            error: error
          });
        }
      };
      this.fd.ref(table + '/' + id).set(object, onComplete);
    }

    del(t, id) {
      var onComplete, table;
      table = this.tableName(t);
      onComplete = (error) => {
        if (error == null) {
          return this.publish(table, 'del', id, {});
        } else {
          return this.onError(table, 'del', id, {}, {
            error: error
          });
        }
      };
      this.fd.ref(table + '/' + id).remove(onComplete);
    }

    insert(t, objects) {
      var onComplete, table;
      table = this.tableName(t);
      onComplete = (error) => {
        if (error == null) {
          return this.publish(table, 'insert', 'none', objects);
        } else {
          return this.onError(table, 'insert', 'none', {
            error: error
          });
        }
      };
      this.fd.ref(table).set(objects, onComplete);
    }

    select(t, where = this.W) {
      var onComplete, table;
      Util.noop(where);
      table = this.tableName(t);
      onComplete = (snapshot) => {
        if ((snapshot != null) && (snapshot.val() != null)) {
          //val = @toObjects( snapshot.val() )
          return this.publish(table, 'select', 'none', snapshot.val());
        } else {
          return this.publish(table, 'select', 'none', {}); // Publish empty results
        }
      };
      this.fd.ref(table).once('value', onComplete);
    }

    range(t, beg, end) {
      var onComplete, table;
      table = this.tableName(t);
      //console.log( 'Fire.range  beg', t, beg, end )
      onComplete = (snapshot) => {
        var val;
        if ((snapshot != null) && (snapshot.val() != null)) {
          val = this.toObjects(snapshot.val());
          return this.publish(table, 'range', 'none', val);
        } else {
          return this.publish(table, 'range', 'none', {}); // Publish empty results
        }
      };
      this.fd.ref(table).orderByKey().startAt(beg).endAt(end).once('value', onComplete);
    }

    update(t, objects) {
      var onComplete, table;
      table = this.tableName(t);
      onComplete = (error) => {
        if (error == null) {
          return this.publish(table, 'update', 'none', objects);
        } else {
          return this.onError(table, 'update', 'none', {
            error: error
          });
        }
      };
      this.fd.ref(table).update(objects, onComplete);
    }

    remove(t, keys) {
      var i, key, len, ref, table;
      table = this.tableName(t);
      ref = this.fd.ref(table);
      for (i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        ref.child(key).remove();
      }
      this.publish(table, 'remove', 'none', keys);
    }

    make(t) {
      var onComplete, table;
      table = this.tableName(t);
      onComplete = (error) => {
        if (error == null) {
          return this.publish(table, 'make', 'none', {}, {});
        } else {
          return this.onError(table, 'make', 'none', {}, {
            error: error
          });
        }
      };
      this.fd.ref().set(table, onComplete);
    }

    show(t, where = this.W) {
      var onComplete, table;
      table = t != null ? this.tableName(t) : this.dbName;
      onComplete = (snapshot) => {
        var keys;
        if ((snapshot != null) && (snapshot.val() != null)) {
          keys = Util.toKeys(snapshot.val(), where, this.keyProp);
          return this.publish(table, 'show', 'none', keys, {
            where: where.toString()
          });
        } else {
          return this.onError(table, 'show', 'none', {}, {
            where: where.toString()
          });
        }
      };
      if (t != null) {
        this.fd.ref(table).once('value', onComplete);
      } else {
        this.fd.ref().once('value', onComplete);
      }
    }

    // ref.remove( onComplete ) is Dangerous and has removed all tables in Firebase
    drop(t) {
      var table;
      table = this.tableName(t);
      this.onError(table, 'drop', 'none', {}, {
        error: 'Fire.drop(t) not implemented'
      });
    }

    // Have too clarify id with snapshot.key
    on(t, onEvt, id = 'none', onFunc = null) {
      var onComplete, path, table;
      table = this.tableName(t);
      onComplete = (snapshot) => {
        var key, val;
        if (snapshot != null) {
          key = snapshot.key;
          val = snapshot.val(); // @toObjects( snapshot.val() )
          if (onFunc != null) {
            return onFunc(key, val);
          } else {
            return this.publish(table, onEvt, key, val);
          }
        } else {
          return this.onError(table, onEvt, id, {}, {
            error: 'error'
          });
        }
      };
      path = id === 'none' ? table : table + '/' + id;
      this.fd.ref(path).on(Fire.OnFire[onEvt], onComplete);
    }

    // keyProp only needed if rows is array
    toObjects(rows) {
      var ckey, i, len, objects, row;
      objects = {};
      if (Util.isArray(rows)) {
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
        return this.onError('none', 'none', 'anon', {}, {
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
