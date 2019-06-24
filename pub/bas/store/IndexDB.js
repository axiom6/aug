var IndexDB,
  hasProp = {}.hasOwnProperty;

IndexDB = class IndexDB {
  constructor(store, onOpenDB) {
    this.store = store;
    this.dbName = this.store.dbName;
    this.tables = this.store.tables;
    this.keyPath = 'id';
    this.indexedDB = window.indexedDB;
    this.db = null;
    this.txnUp = null;
    this.dbVersion = this.version();
    this.deleteDB(this.dbName);
    this.openDB(this.dbName, this.dbVersion, onOpenDB);
  }

  version() {
    var dbVersionInt, dbVersionStr;
    dbVersionStr = localStorage.getItem('IndexDbVersion');
    dbVersionInt = dbVersionStr != null ? parseInt(dbVersionStr) + 1 : 1;
    dbVersionStr = dbVersionInt.toString();
    localStorage.setItem('IndexDbVersion', dbVersionStr);
    console.log('Index() version', dbVersionStr, dbVersionInt);
    return dbVersionInt;
  }

  change(table, id, callback) {
    this.get(table, id, callback, 'change');
  }

  get(table, id, callback, op = 'get') {
    var req, txo;
    txo = this.txnObjectStore(table, "readwrite"); // readonly
    req = txo.get(id);
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
    object['id'] = id;
    txo = this.txnObjectStore(table, "readwrite"); // [table]
    req = txo.add(object);
    req.onerror = () => {
      return this.store.onerror(table, 'add', {
        error: req.error,
        object: object
      }, id);
    };
  }

  put(table, id, object) {
    var req, txo;
    object['id'] = id;
    txo = this.txnObjectStore(table, "readwrite");
    req = txo.put(object);
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
    req = txo['delete'](id);
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

  open(table) {
    var objStor;
    if (!this.db.objectStoreNames.contains(table)) {
      objStor = this.db.createObjectStore(table, {
        keyPath: this.keyPath
      });
      objStor.createIndex("id", "id", {
        unique: true
      });
    }
  }

  drop(table) {
    this.db.deleteObjectStore(table);
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
    if (this.db == null) {
      console.trace('Store.IndexedDb.txnObjectStore() @db null', this.dbName);
    } else if (this.db.objectStoreNames.contains(table)) {
      txn = this.db.transaction(table, mode); // if @txnUp? then @txnUp else @db.transaction( table, mode )
      txo = txn.objectStore(table); // { keyPath:@keyPath } )
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

  openTables(tables) {
    var name, obj;
    for (name in tables) {
      if (!hasProp.call(tables, name)) continue;
      obj = tables[name];
      this.open(name);
    }
  }

  openDB(dbName, dbVersion, onOpenDB = null) {
    var request;
    request = this.indexedDB.open(dbName, dbVersion); // request = @indexedDB.IDBFactory.open( database, @dbVersion )
    request.onupgradeneeded = (event) => {
      this.db = event.target['result'];
      this.txnUp = event.target['transaction'];
      this.openTables(this.tables);
      console.log('Index.openDB()', 'upgrade', dbName, this.db.objectStoreNames);
      if (onOpenDB != null) {
        return onOpenDB();
      }
    };
    request.onsuccess = (event) => {
      this.db = event.target['result'];
      this.openTables(this.tables);
      console.log('Index.openDB()', 'open', dbName, this.db.objectStoreNames);
      if (onOpenDB != null) {
        return onOpenDB();
      }
    };
    request.onerror = () => {
      // console.error( 'Index.openDB() unable to open', { database:dbName, error:request.error } )
      return this.store.onerror(dbName, 'Index.openDB()', {
        error: request.error
      });
    };
  }

  deleteDB(dbName) {
    var request;
    request = this.indexedDB.deleteDatabase(dbName);
    request.onsuccess = () => {
      return console.log('Index.deleteDB() deleted', {
        dbName: dbName
      });
    };
    request.onerror = () => {
      return console.error('Index.deleteDB() unable to delete', {
        dbName: dbName,
        error: request.error
      });
    };
    request.onblocked = () => {
      return console.error('Index.deleteDB() database blocked', {
        dbName: dbName,
        error: request.error
      });
    };
  }

  closeDB() {
    if (this.db != null) {
      this.db.close();
    }
  }

};

export default IndexDB;

// console.error( 'Store.IndexedDB.constructor indexedDB not found' ) if not @indexedDB
