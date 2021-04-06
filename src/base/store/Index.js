  //import { openDB } from '../../lib/idb/index.js';
var Index,
  hasProp = {}.hasOwnProperty;

Index = class Index {
  constructor(store) {
    this.insert = this.insert.bind(this);
    this.store = store;
    this.dbName = this.store.dbName;
    this.tables = this.store.tables;
    this.keyPath = 'id';
    window.indexedDB.deleteDatabase(this.dbName);
  }

  async initDB() {
    async function open(that) {
      return await that.openDB( that.dbName, that.version() ) };
    this.db = (await open(this));
  }

  // console.log( 'Index.initDB()', @db.name, @db.version )
  openDB(dbName, dbVersion) {
    var dbp;
    dbp = new Promise((resolve, reject) => {
      var request;
      request = window.indexedDB.open(dbName, dbVersion);
      request.onupgradeneeded = (event) => {
        var upDb, upTxn;
        upDb = event.target['result'];
        upTxn = event.target['transaction'];
        this.openStores(upDb, true);
        // console.log( 'Index.openDB()', 'upgrade', dbName, upDb.objectStoreNames )
        upTxn.complete;
      };
      request.onsuccess = (event) => {
        var db;
        db = event.target['result'];
        this.openStores(db, false);
        // console.log( 'Index.openDB()', 'open',    dbName, db.objectStoreNames )
        resolve(db);
      };
      request.onblocked = () => { // event
        this.store.onerror(dbName, 'open', {
          cause: 'Index.openDB() onblocked',
          error: request.error
        });
        reject();
      };
      return request.onerror = () => {
        this.store.onerror(dbName, 'open', {
          cause: 'Index.openDB() onerror',
          error: request.error
        });
        reject();
      };
    });
    return dbp;
  }

  openStores(db, isUpgrade) {
    var obj, ref, table;
    ref = this.tables;
    for (table in ref) {
      if (!hasProp.call(ref, table)) continue;
      obj = ref[table];
      this.openStore(db, table, isUpgrade);
    }
  }

  contains(db, table) {
    return db.objectStoreNames.contains(table);
  }

  openStore(db, table, isUpgrade) {
    if (isUpgrade && !this.contains(db, table)) {
      db.createObjectStore(table, {
        keyPath: this.keyPath
      });
    }
  }

  // st.createIndex( @keyPath, @keyPath, { unique: true } )
  txo(table, mode = "readwrite") {
    var sto, txn;
    txn = this.db.transaction(table, mode);
    sto = txn.objectStore(table);
    return sto;
  }

  version() {
    var dbVersionInt, dbVersionStr;
    localStorage.setItem('IndexDbVersion', '0');
    dbVersionStr = localStorage.getItem('IndexDbVersion');
    dbVersionInt = dbVersionStr != null ? parseInt(dbVersionStr) + 1 : 1;
    dbVersionStr = dbVersionInt.toString();
    localStorage.setItem('IndexDbVersion', dbVersionStr);
    console.log('Index() version', dbVersionStr, dbVersionInt);
    return dbVersionInt;
  }

  batch(name, obj, objs, callback = null) {
    var onBatch, where;
    onBatch = (result) => {
      obj.result = result;
      if (this.store.batchComplete(objs)) {
        if (callback != null) {
          return callback(objs);
        } else {
          return this.store.results(name, 'batch', objs);
        }
      }
    };
    where = function() {
      return true;
    };
    this.select(obj.table, where, onBatch);
  }

  get(table, id, callback, op = 'get') {
    var req, txo;
    txo = this.txo(table, 'readonly');
    req = txo.get(id);
    req.onsuccess = () => {
      if (callback != null) {
        return callback({
          [`${id}`]: req.result
        });
      } else {
        return this.store.results(table, op, req.result, id);
      }
    };
    req.onerror = (error) => {
      return this.store.onerror(table, op, error, id);
    };
  }

  add(table, id, object) {
    var txo;
    txo = this.txo(table);
    txo.add(object); // txn.complete
  }

  put(table, id, object) {
    var txo;
    txo = this.txo(table);
    txo.put(object);
  }

  del(table, id) {
    var txo;
    txo = this.txo(table);
    txo['delete'](id);
  }

  insert(table, objects) {
    var id, object, txo;
    txo = this.txo(table);
    for (id in objects) {
      if (!hasProp.call(objects, id)) continue;
      object = objects[id];
      txo.add(object);
    }
  }

  select(table, where, callback = null) {
    this.traverse(table, where, callback, 'select');
  }

  update(table, objects) {
    var id, object, txo;
    txo = this.txo(table);
    for (id in objects) {
      if (!hasProp.call(objects, id)) continue;
      object = objects[id];
      txo.put(object);
    }
  }

  remove(table, where) {
    this.traverse(table, where, null, 'remove');
  }

  traverse(table, where, callback = null, op) {
    var mode, req, txo;
    mode = op === 'remove' ? 'readwrite' : 'readonly';
    txo = this.txo(table, mode);
    req = txo.getAll();
    req.onsuccess = () => {
      var key, obj, objs, ref;
      objs = {};
      ref = req.result;
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        obj = ref[key];
        if (!(where(obj))) {
          continue;
        }
        objs[obj.id] = obj;
        if (op === 'remove') {
          txo['delete'](obj.id);
        }
      }
      if (callback != null) {
        return callback(objs);
      } else {
        return this.store.results(table, op, objs);
      }
    };
    req.onerror = (error) => {
      return this.store.onerror(table, op, error);
    };
  }

  open(table) {
    if (this.db != null) {
      this.openStore(this.db, table);
    } else {
      this.store.onerror(table, 'open', '@db null for IndexedDB');
    }
  }

  drop(table) {
    if (this.db != null) {
      this.db.deleteObjectStore(table);
    } else {
      this.store.onerror(table, 'drop', '@db null for IndexedDB');
    }
  }

};

export default Index;
