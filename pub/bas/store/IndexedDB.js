var IndexedDB,
  hasProp = {}.hasOwnProperty;

import Store from './Store';

IndexedDB = class IndexedDB extends Store {
  constructor(stream, uri, dbVersion = 1, tableNames = []) {
    super(stream, uri, 'IndexedDB');
    this.dbVersion = dbVersion;
    this.tableNames = tableNames;
    this.indexedDB = window.indexedDB; // or window.mozIndexedDB or window.webkitIndexedDB or window.msIndexedDB
    if (!this.indexedDB) {
      console.error('Store.IndexedDB.constructor indexedDB not found');
    }
    this.dbs = null;
  }

  add(t, id, object) {
    var req, tableName, txo;
    tableName = this.tableName(t);
    txo = this.txnObjectStore(tableName, "readwrite");
    req = txo.add(obj, id);
    req.onsuccess = () => {
      return this.publish(tableName, id, 'add', object);
    };
    req.onerror = () => {
      return this.onerror(tableName, id, 'add', object, {
        error: req.error
      });
    };
  }

  get(t, id) {
    var req, tableName, txo;
    tableName = this.tableName(t);
    txo = this.txnObjectStore(tableName, "readonly");
    req = txo.get(id); // Check to be sre that indexDB understands id
    req.onsuccess = () => {
      return this.publish(tableName, id, 'get', req.result);
    };
    req.onerror = () => {
      return this.onerror(tableName, id, 'get', req.result, {
        error: req.error
      });
    };
  }

  put(t, id, object) {
    var req, tableName, txo;
    tableName = this.tableName(t);
    txo = this.txnObjectStore(tableName, "readwrite");
    req = txo.put(object); // Check to be sre that indexDB understands id
    req.onsuccess = () => {
      return this.publish(tableName, id, 'put', object);
    };
    req.onerror = () => {
      return this.onerror(tableName, id, 'put', object, {
        error: req.error
      });
    };
  }

  del(t, id) {
    var req, tableName, txo;
    tableName = this.tableName(t);
    txo = this.txnObjectStore(tableName, "readwrite");
    req = txo['delete'](id); // Check to be sre that indexDB understands id
    req.onsuccess = () => {
      return this.publish(tableName, id, 'del', req.result);
    };
    req.onerror = () => {
      return this.onerror(tableName, id, 'del', req.result, {
        error: req.error
      });
    };
  }

  insert(t, objects) {
    var key, object, tableName, txo;
    tableName = this.tableName(t);
    txo = this.txnObjectStore(t, "readwrite");
    for (key in objects) {
      if (!hasProp.call(objects, key)) continue;
      object = objects[key];
      object = this.idProp(key, object, this.key);
      txo.put(object);
    }
    this.publish(tableName, 'none', 'insert', objects);
  }

  select(t, where = Store.where) {
    var tableName;
    tableName = this.tableName(t);
    this.traverse('select', tableName, where);
  }

  update(t, objects) {
    var key, object, tableName, txo;
    tableName = this.tableName(t);
    txo = this.txnObjectStore(t, "readwrite");
    for (key in objects) {
      if (!hasProp.call(objects, key)) continue;
      object = objects[key];
      object = this.idProp(key, object, this.key);
      txo.put(object);
    }
    this.publish(tableName, 'none', 'update', objects);
  }

  remove(t, where = Store.where) {
    var tableName;
    tableName = this.tableName(t);
    this.traverse('remove', tableName, where);
  }

  open(t, schema) {
    var tableName;
    tableName = this.tableName(t);
    // No real create table in IndexedDB so publish success
    this.publish(tableName, 'none', 'open', {}, {
      schema: schema
    });
  }

  show(t) {
    var tableName;
    tableName = this.tableName(t);
    this.traverse('show', tableName, objects, where, false);
  }

  make(t, alters) {
    var tableName;
    tableName = this.tableName(t);
    this.publish(tableName, 'none', 'make', {}, {
      alters: alters
    });
  }

  drop(t) {
    var tableName;
    tableName = this.tableName(t);
    this.dbs.deleteObjectStore(t);
    this.publish(tableName, 'none', 'drop');
  }

  // Subscribe to  a table or object with id
  onChange(t, id = 'none') {
    var tableName;
    tableName = this.tableName(t);
    this.onerror(tableName, id, 'onChange', {}, {
      msg: "onChange() not implemeted by Store.IndexedDb"
    });
  }

  // IndexedDB Specifics
  idProp(id, object, key) {
    if (object[key] == null) {
      object[key] = id;
    }
    return object;
  }

  txnObjectStore(t, mode, key = this.key) {
    var txn, txo;
    txo = null;
    if (this.dbs == null) {
      console.trace('Store.IndexedDb.txnObjectStore() @dbs null');
    } else if (this.dbs.objectStoreNames.contains(t)) {
      txn = this.dbs.transaction(t, mode);
      txo = txn.objectStore(t, {
        keyPath: key
      });
    } else {
      console.error('Store.IndexedDb.txnObjectStore() missing objectStore for', t);
    }
    return txo;
  }

  traverse(op, t, where) {
    var mode, req, txo;
    mode = op === 'select' ? 'readonly' : 'readwrite';
    txo = this.txnObjectStore(t, mode);
    req = txo.openCursor();
    req.onsuccess = (event) => {
      var cursor, objects;
      objects = {};
      cursor = event.target.result;
      if (cursor != null) {
        if (op === 'select' && where(cursor.value)) {
          objects[cursor.key] = cursor.value;
        }
        if (op === 'remove' && where(cursor.value)) {
          cursor.delete();
        }
        cursor.continue();
      }
      return this.publish(t, 'none', op, objects, {
        where: 'all'
      });
    };
    req.onerror = () => {
      return this.onerror(t, 'none', op, {}, {
        where: 'all',
        error: req.error
      });
    };
  }

  createObjectStores() {
    var i, len, ref, t;
    if (this.tableNames != null) {
      ref = this.tableNames;
      for (i = 0, len = ref.length; i < len; i++) {
        t = ref[i];
        if (!this.dbs.objectStoreNames.contains(t)) {
          this.dbs.createObjectStore(t, {
            keyPath: this.key
          });
        }
      }
    } else {
      console.error('Store.IndexedDB.createTables() missing @tableNames');
    }
  }

  openDatabase() {
    var request;
    request = this.indexedDB.open(this.dbName, this.dbVersion); // request = @indexedDB.IDBFactory.open( database, @dbVersion )
    request.onupgradeneeded = (event) => {
      this.dbs = event.target.result;
      this.createObjectStores();
      return console.log('Store.IndexedDB', 'upgrade', this.dbName, this.dbs.objectStoreNames);
    };
    request.onsuccess = (event) => {
      this.dbs = event.target.result;
      console.log('Store.IndexedDB', 'open', this.dbName, this.dbs.objectStoreNames);
      return this.publish('none', 'none', 'open', this.dbs.objectStoreNames);
    };
    return request.onerror = () => {
      console.error('Store.IndexedDB.openDatabase() unable to open', {
        database: this.dbName,
        error: request.error
      });
      return this.onerror('none', 'none', 'open', this.dbName, {
        error: request.error
      });
    };
  }

  deleteDatabase(dbName) {
    var request;
    request = this.indexedDB.deleteDatabase(dbName);
    request.onsuccess = () => {
      return console.log('Store.IndexedDB.deleteDatabase() deleted', {
        database: dbName
      });
    };
    request.onerror = () => {
      return console.error('Store.IndexedDB.deleteDatabase() unable to delete', {
        database: dbName,
        error: request.error
      });
    };
    return request.onblocked = () => {
      return console.error('Store.IndexedDB.deleteDatabase() database blocked', {
        database: dbName,
        error: request.error
      });
    };
  }

  close() {
    if (this.dbs != null) {
      return this.dbs.close();
    }
  }

};

export default IndexedDB;
