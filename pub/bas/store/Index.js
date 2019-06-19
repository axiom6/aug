var Index,
  hasProp = {}.hasOwnProperty;

Index = class Index {
  constructor(store) {
    this.store = store;
    this.dbName = this.store.dbName;
    this.tables = this.store.tables;
    this.keyPath = 'key'; // Check
    this.dbVersion = 1;
    this.dbs = null;
    this.indexedDB = window.indexedDB;
    this.openDatabase(this.dbName, this.dbVersion);
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
      return this.store.results(table, id, op, req.result);
    };
    req.onerror = () => {
      return this.store.onerror(table, id, op, req.result, {
        error: req.error
      });
    };
  }

  add(table, id, object) {
    var req, txo;
    txo = this.txnObjectStore(table, "readwrite");
    req = txo.add(obj, id);
    req.onerror = () => {
      return this.store.onerror(table, id, 'add', object, {
        error: req.error
      });
    };
  }

  put(table, id, object) {
    var req, txo;
    txo = this.txnObjectStore(table, "readwrite");
    req = txo.put(object); // Check to be sre that indexDB understands id
    req.onerror = () => {
      return this.store.onerror(table, id, 'put', object, {
        error: req.error
      });
    };
  }

  del(table, id) {
    var req, txo;
    txo = this.txnObjectStore(table, "readwrite");
    req = txo['delete'](id); // Check to be sre that indexDB understands id
    req.onerror = () => {
      return this.store.onerror(table, id, 'del', req.result, {
        error: req.error
      });
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

  select(table, callback, where) {
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

  show(table, callback, where) {
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
      return this.store.results(table, 'none', op, objects, {
        where: 'all'
      });
    };
    req.onerror = () => {
      return this.store.onerror(table, 'none', op, {}, {
        where: 'all',
        error: req.error
      });
    };
  }

  createObjectStores(tables, keyPath) {
    var key, obj;
    for (key in tables) {
      if (!hasProp.call(tables, key)) continue;
      obj = tables[key];
      if (!this.dbs.objectStoreNames.contains(key)) {
        this.dbs.createObjectStore(key, {
          keyPath: keyPath
        });
      }
    }
  }

  openDatabase(dbName, dbVersion) {
    var request;
    request = this.indexedDB.open(dbName, dbVersion); // request = @indexedDB.IDBFactory.open( database, @dbVersion )
    request.onupgradeneeded = (event) => {
      this.dbs = event.target['result'];
      this.createObjectStores(this.tables);
      return console.log('Store.IndexedDB', 'upgrade', dbName, this.dbs.objectStoreNames);
    };
    request.onsuccess = (event) => {
      this.dbs = event.target['result'];
      return console.log('Store.IndexedDB', 'open', dbName, this.dbs.objectStoreNames);
    };
    return request.onerror = () => {
      console.error('Store.IndexedDB.openDatabase() unable to open', {
        database: dbName,
        error: request.error
      });
      return this.store.onerror('none', 'none', 'open', dbName, {
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
