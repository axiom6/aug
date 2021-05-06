var Index,
  hasProp = {}.hasOwnProperty;

import Store from './Store.js';

Index = class Index extends Store {
  constructor(dbName) {
    super();
    this.db = null;
    this.dbName = dbName;
    this.dbVersion = 1;
    window.indexedDB.deleteDatabase(this.dbName);
  }

  openDB(dbName, dbVersion) {
    var dbp;
    // @db.close() if @db?
    dbp = new Promise((resolve, reject) => {
      var request;
      request = window.indexedDB.open(dbName, dbVersion);
      request.onupgradeneeded = (event) => {
        var upDb, upTxn;
        upDb = event.target['result'];
        upTxn = event.target['transaction'];
        this.openStores(upDb);
        // console.log( 'Index.openDB()', 'upgrade', @dbName, upDb.objectStoreNames )
        upTxn.complete;
      };
      request.onsuccess = (event) => {
        var db;
        db = event.target['result'];
        // console.log( 'Index.openDB()', 'open', @dbName )
        resolve(db);
      };
      request.onblocked = () => { // event
        this.onerror(dbName, 'Index.openDB()', {
          cause: 'Index.openDB() onblocked',
          error: request.error
        });
        reject('Request blocked');
      };
      return request.onerror = () => {
        this.onerror(dbName, 'Index.openDB()', {
          cause: 'Index.openDB() onerror',
          error: request.error
        });
        reject('Request error');
      };
    });
    return dbp;
  }

  openStores(upDb) {
    var key, list, obj, ref, table;
    ref = this.tables;
    for (table in ref) {
      if (!hasProp.call(ref, table)) continue;
      list = ref[table];
      for (key in list) {
        if (!hasProp.call(list, key)) continue;
        obj = list[key];
        if (key === 'Index') {
          this.openStore(upDb, table);
        }
      }
    }
  }

  contains(upDb, table) {
    return upDb.objectStoreNames.contains(table);
  }

  openStore(upDb, table) {
    if (!this.contains(upDb, table)) {
      upDb.createObjectStore(table, {
        keyPath: this.keyProp
      });
    }
  }

  // Need to better handle a missing objectStore
  // st.createIndex( @keyProp, @keyProp, { unique: true } )
  txo(table, mode = "readwrite") {
    var sto, txn;
    if (this.contains(this.db, table)) {
      txn = this.db.transaction(table, mode);
      sto = txn.objectStore(table);
      return sto;
    } else {
      console.error('Index.txo() missing ObjectStore for', table);
      //hrow new Error('Index.txo() missing ObjectStore for ' + table ) # May not be necessary
      return null;
    }
  }

  add(table, id, obj) {
    var txo;
    txo = this.txo(table);
    txo.add(obj);
    this.results(table, 'add', obj);
  }

  get(table, id, callback = null, op = 'get') {
    var req, txo;
    txo = this.txo(table);
    req = txo.get(id);
    req.onsuccess = () => {
      if (callback != null) {
        return callback(req.result);
      } else {
        return this.results(table, op, obj);
      }
    };
    req.onerror = (error) => {
      return this.onerror(table, op, error);
    };
  }

  put(table, id, obj) {
    var txo;
    txo = this.txo(table);
    txo.put(obj);
    this.results(table, 'put', obj);
  }

  del(table, id) {
    var txo;
    txo = this.txo(table);
    txo['delete'](id);
    this.results(table, 'del', {}); // Latee with obj
  }

  insert(table, objs) {
    var id, obj, txo;
    txo = this.txo(table);
    for (id in objs) {
      if (!hasProp.call(objs, id)) continue;
      obj = objs[id];
      txo.add(obj);
    }
    this.results(table, 'insert', objs);
  }

  select(table, where, callback = null) {
    this.traverse(table, where, callback, 'select');
  }

  update(table, objs) {
    var id, obj, txo;
    txo = this.txo(table);
    for (id in objs) {
      if (!hasProp.call(objs, id)) continue;
      obj = objs[id];
      txo.put(obj);
    }
    this.results(table, 'update', objs);
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
        objs[obj[this.keyProp]] = obj;
        if (op === 'remove') {
          txo['delete'](this.keyProp);
        }
      }
      if (callback != null) {
        return callback(objs);
      } else {
        return this.results(table, op, objs);
      }
    };
    req.onerror = (error) => {
      return this.onerror(table, op, error);
    };
  }

  show() {
    var key, ref, table, tables;
    tables = [];
    ref = this.db.objectStoreNames;
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      table = ref[key];
      tables.push(table);
    }
    this.results(this.dbName, 'show', tables);
  }

  open(table) {
    return this.results(table, 'open', {});
  }

  drop(table) {
    var error;
    try {
      this.db.deleteObjectStore(table);
      this.results(table, 'drop', {});
    } catch (error1) {
      error = error1;
      this.onerror(table, 'drop', error);
    }
  }

};

export default Index;

/*
  addTable:( table, id, obj ) ->
    if not @contains( @db, table )
      @openDB( @dbName, @dbVersion, [table] )
        .then( (db) =>
           @db = db
           @addHas( table, id, obj )
           return )
        .catch( (error) =>
           @onerror( table, 'addTable', error )
           return )
    else
      @addHas( table, id, obj )
    return

  initDB:() ->
    `function open(that) {
      return await that.openDB( that.dbName, that.version() ) }`
    @db = open(@)
    console.log( 'Index.initDB()', @db.name, @db.version )
    return

  openDatabase:() ->
    request = @indexedDB.open( @dbName, @dbVersion ) # request = @indexedDB.IDBFactory.open( database, @dbVersion )
    request.onupgradeneeded = ( event ) =>
      @dbs = event.target.result
      @objectStoreNames = @dbs['objectStoreNames']
      @createObjectStores()
      console.log( 'Store.IndexedDB', 'upgrade', @dbName, @objectStoreNames )
    request.onsuccess = ( event ) =>
      @dbs = event.target.result
      console.log( 'Store.IndexedDB', 'open',    @dbName, @objectStoreNames )
      @publish( 'none', 'open', 'none', @dbs.objectStoreNames )
    request.onerror   = () =>
      console.error( 'Store.IndexedDB.openDatabase() unable to open', { database:@dbName, error:request.error } )
      @onError( 'none', 'open', 'none', @dbName, { error:request.error } )
*/
