  //import { openDB } from '../../lib/idb/index.js';
var Index,
  hasProp = {}.hasOwnProperty;

Index = class Index {
  constructor(store) {
    this.insert = this.insert.bind(this);
    this.store = store;
    this.dbName = this.store.dbName;
    this.tables = this.store.tables;
    this.txos = {};
    this.keyPath = 'id';
    //window.indexedDB.deleteDatabase( @dbName )
    this.dbp = this.openDB(this.dbName, this.version());
  }

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
        console.log('Index.openDB()', 'upgrade', dbName, upDb.objectStoreNames);
        upTxn.complete;
      };
      //resolve(upDb)
      request.onsuccess = (event) => {
        var db;
        db = event.target['result'];
        this.openStores(db, false);
        console.log('Index.openDB()', 'open', dbName, db.objectStoreNames);
        resolve(db);
      };
      return request.onerror = () => {
        this.store.onerror(dbName, 'Index.openDB()', {
          error: request.error
        });
        reject();
      };
    });
    return dbp;
  }

  openStores(db, isUpgrade) {
    var obj, ref, table;
    console.log('Index.openStores() called', {
      dbName: this.dbName,
      version: db.version,
      isUpgrade: isUpgrade,
      stores: db.objectStoreNames
    });
    ref = this.tables;
    for (table in ref) {
      if (!hasProp.call(ref, table)) continue;
      obj = ref[table];
      this.openStore(table, db, isUpgrade);
    }
  }

  contains(table, db) {
    return db.objectStoreNames.contains(table);
  }

  openStore(table, db, isUpgrade) {
    console.log('Index.openStore()', {
      table: table
    });
    this.txos[table] = {};
    this.txos[table]['id'] = table;
    if (isUpgrade && !this.contains(table, db)) {
      this.txos[table]['objectStore'] = db.createObjectStore(table); // { keyPath:@keyPath }
    }
  }

  //txos[table]['objectStore'].createIndex( @keyPath, @keyPath, { unique: true } )
  txo(table, db, mode = "readwrite") {
    var txn;
    txn = db.transaction(table, mode);
    return txn.objectStore(table);
  }

  version() {
    var dbVersionInt, dbVersionStr;
    // localStorage.setItem('IndexDbVersion','0')
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
    this.dbp.then((db) => {
      var txn, txo;
      txn = db.transaction(table, "readwrite");
      txo = txn.objectStore(table);
      return txo.get(id);
    }).then((result) => {
      if (callback != null) {
        callback(result);
      }
      return this.store.results(table, op, result, id);
    });
  }

  add(table, id, object) {
    this.dbp.then((db) => {
      var txn, txo;
      txn = db.transaction(table, "readwrite");
      txo = txn.objectStore(table);
      txo.add(object, id); // id
      return txn.complete;
    });
  }

  put(table, id, object) {
    this.dbp.then((db) => {
      var txn, txo;
      txn = db.transaction(table, "readwrite");
      txo = txn.objectStore(table);
      txo.put(object, id); // id
      return txn.complete;
    });
  }

  del(table, id) {
    this.dbp.then((db) => {
      var txn, txo;
      txn = db.transaction(table, "readwrite");
      txo = txn.objectStore(table);
      return txo['delete'](id);
    });
  }

  insert(table, objects) {
    var id, object;
    for (id in objects) {
      if (!hasProp.call(objects, id)) continue;
      object = objects[id];
      this.add(table, object, id); // txo.add(object)
    }
  }

  //await txo.done
  select(table, where, callback = null) {
    this.traverse('select', table, where, callback);
  }

  update(table, objects) {
    var id, object;
    for (id in objects) {
      if (!hasProp.call(objects, id)) continue;
      object = objects[id];
      this.put(table, id, object);
    }
  }

  //await txo.done
  remove(table, where) {
    var id, obj, ref;
    ref = this.store.table(table);
    for (id in ref) {
      if (!hasProp.call(ref, id)) continue;
      obj = ref[id];
      if (where(obj)) {
        this.del(table, id); // txo['delete']( table, key )
      }
    }
  }

  //await txo.done
  open(table) {
    this.dbp.then((db) => {
      return this.openStore(table, db);
    });
  }

  drop(table) {
    this.dbp.then((db) => {
      return db.deleteObjectStore(table);
    });
  }

};

export default Index;
