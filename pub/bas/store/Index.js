var Index,
  hasProp = {}.hasOwnProperty;

Index = class Index {
  constructor(store, onOpen) {
    this.store = store;
    this.dbName = this.store.dbName;
    this.tables = this.store.tables;
    this.keyPath = 'id';
    this.dbVersion = 1;
    this.indexedDB = window.indexedDB;
    this.dbs = null;
    this.openDatabase(this.dbName, this.dbVersion, onOpen);
  }

  change(table, id, callback) {
    this.get(table, id, callback, 'change');
  }

  get(table, id, callback, op = 'get') {
    var req, txo;
    txo = this.txnObjectStore(table, "readonly");
    req = txo.get(id); // Check to be sre that indexDB understands id
    req.onsuccess = () => {
      if (callback != null) {
        callback(req.result);
      }
      return this.store.results(table, op, req.result, id);
    };
    req.onerror = () => {
      return this.store.onerror(table, op, {
        error: req.error
      }, id);
    };
  }

  add(table, id, object) {
    var req, txo;
    txo = this.txnObjectStore(table, "readwrite");
    req = txo.add(obj, id);
    req.onerror = () => {
      return this.store.onerror(table, 'add', {
        error: req.error,
        object: object
      }, id);
    };
  }

  put(table, id, object) {
    var req, txo;
    txo = this.txnObjectStore(table, "readwrite");
    req = txo.put(object); // Check to be sre that indexDB understands id
    req.onerror = () => {
      return this.store.onerror(table, 'put', {
        error: req.error,
        object: object
      }, id);
    };
  }

  del(table, id) {
    var req, txo;
    txo = this.txnObjectStore(table, "readwrite");
    req = txo['delete'](id); // Check to be sre that indexDB understands id
    req.onerror = () => {
      return this.store.onerror(table, 'del', {
        error: req.error
      }, id);
    };
  }

  insert(table, objects) {
    var key, object, txo;
    txo = this.txnObjectStore(table, "readwrite");
    for (key in objects) {
      if (!hasProp.call(objects, key)) continue;
      object = objects[key];
      object = this.idProp(key, object, this.key);
      txo.put(object);
    }
  }

  select(table, where, callback = null) {
    this.traverse('select', table, where, callback);
  }

  update(table, objects) {
    var key, object, txo;
    txo = this.txnObjectStore(table, "readwrite");
    for (key in objects) {
      if (!hasProp.call(objects, key)) continue;
      object = objects[key];
      object = this.idProp(key, object, this.key);
      txo.put(object);
    }
  }

  remove(table, where) {
    this.traverse('remove', table, where);
  }

  open(table, schema) {
    if (table === false && schema === false) {
      ({});
    }
  }

  show(table, where, callback = null) {
    this.traverse('show', table, where, callback);
  }

  make(table, alters) {
    if (table === false && alters === false) {
      ({});
    }
  }

  drop(table, resets) {
    if (resets === false) {
      ({});
    }
    this.dbs.deleteObjectStore(table);
  }

  // IndexedDB Specifics
  idProp(id, object, key) {
    if (object[key] == null) {
      object[key] = id;
    }
    return object;
  }

  txnObjectStore(table, mode) { // , key=@key
    var txn, txo;
    txo = null;
    if (this.dbs == null) {
      console.trace('Store.IndexedDb.txnObjectStore() @dbs null');
    } else if (this.dbs.objectStoreNames.contains(table)) {
      txn = this.dbs.transaction(table, mode);
      txo = txn.objectStore(table); // , { keyPath:key }
    } else {
      console.error('Store.IndexedDb.txnObjectStore() missing objectStore for', table);
    }
    return txo;
  }

  traverse(op, table, where, callback = null) {
    var mode, req, txo;
    mode = op === 'select' ? 'readonly' : 'readwrite';
    txo = this.txnObjectStore(table, mode);
    req = txo.openCursor();
    req.onsuccess = (event) => {
      var cursor, objects;
      objects = {};
      cursor = event.target['result'];
      if (cursor != null) {
        if (op === 'select' && where(cursor.value)) {
          objects[cursor.key] = cursor.value;
        }
        if (op === 'remove' && where(cursor.value)) {
          cursor.delete();
        }
        cursor.continue();
      }
      if (callback != null) {
        callback(objects);
      }
      return this.store.results(table, op, objects);
    };
    req.onerror = () => {
      return this.store.onerror(table, op, {
        error: req.error,
        where: where
      });
    };
  }

  createObjectStores(tables, keyPath) {
    var key, obj;
// when not @dbs.objectStoreNames.contains(key)
    for (key in tables) {
      if (!hasProp.call(tables, key)) continue;
      obj = tables[key];
      this.dbs.createObjectStore(key, {
        keyPath: keyPath
      });
    }
  }

  openDatabase(dbName, dbVersion, onOpen = null) {
    var request;
    request = this.indexedDB.open(dbName, dbVersion); // request = @indexedDB.IDBFactory.open( database, @dbVersion )
    request.onupgradeneeded = (event) => {
      this.dbs = event.target['result'];
      this.createObjectStores(this.tables, this.keyPath);
      console.log('Store.IndexedDB', 'upgrade', dbName, this.dbs.objectStoreNames);
      if (onOpen != null) {
        return onOpen();
      }
    };
    request.onsuccess = (event) => {
      this.dbs = event.target['result'];
      console.log('Store.IndexedDB', 'open', dbName, this.dbs.objectStoreNames);
      if (onOpen != null) {
        return onOpen();
      }
    };
    return request.onerror = () => {
      console.error('Store.IndexedDB.openDatabase() unable to open', {
        database: dbName,
        error: request.error
      });
      return this.store.onerror(dbName, 'Index.openDatabase', {
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

export default Index;

// console.error( 'Store.IndexedDB.constructor indexedDB not found' ) if not @indexedDB
