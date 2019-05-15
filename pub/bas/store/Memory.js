var Memory,
  hasProp = {}.hasOwnProperty;

import Util from '../../bas/util/Util';

import Store from './Store';

import IndexedDB from './IndexedDB';

Memory = class Memory extends Store {
  constructor(stream, uri) {
    super(stream, uri, 'Memory');
    Store.databases[this.dbName] = this.tables;
    Util.noop(this.importLocalStorage, this.exportLocalStorage, this.importIndexedDB, this.exportIndexedDB, this.logRows);
  }

  add(t, id, object) {
    this.table(t)[id] = object;
    this.publish(t, id, 'add', object);
  }

  get(t, id) {
    var object;
    object = this.table(t)[id];
    if (object != null) {
      this.publish(t, id, 'get', object);
    } else {
      this.onerror(t, id, 'get', object, {
        msg: `Id ${id} not found`
      });
    }
  }

  put(t, id, object) {
    this.table(t)[id] = object;
    this.publish(t, id, 'put', object);
  }

  del(t, id) {
    var object;
    object = this.table(t)[id];
    if (object != null) {
      delete this.table(t)[id];
      this.publish(t, id, 'del', object);
    } else {
      this.onerror(t, id, 'del', object, {
        msg: `Id ${id} not found`
      });
    }
  }

  insert(t, objects) {
    var key, object, table;
    table = this.table(t);
    for (key in objects) {
      if (!hasProp.call(objects, key)) continue;
      object = objects[key];
      table[key] = object;
    }
    this.publish(t, 'none', 'insert', objects);
  }

  select(t, where) {
    var key, object, objects, table;
    objects = {};
    table = this.table(t);
    for (key in table) {
      if (!hasProp.call(table, key)) continue;
      object = table[key];
      if (where(object)) {
        objects[key] = object;
      }
    }
    this.publish(t, 'none', 'select', objects, {
      where: where.toString()
    });
  }

  update(t, objects) {
    var key, object, table;
    table = this.table(t);
    for (key in objects) {
      if (!hasProp.call(objects, key)) continue;
      object = objects[key];
      table[key] = object;
    }
    this.publish(t, id, 'update', objects);
  }

  remove(t, where = this.W) {
    var key, object, objects, table;
    table = this.table(t);
    objects = {};
    for (key in table) {
      if (!hasProp.call(table, key)) continue;
      object = table[key];
      if (!(where(object))) {
        continue;
      }
      objects[key] = object;
      delete object[key];
    }
    this.publish(t, 'none', 'remove', objects, {
      where: where.toString()
    });
  }

  open(t, schema) {
    this.createTable(t);
    this.publish(t, 'none', 'open', {}, {
      schema: schema
    });
  }

  show(t) {
    var key, keys, ref, ref1, tables, val;
    if (Util.isStr(t)) {
      keys = [];
      ref = this.tables[t];
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        val = ref[key];
        keys.push(key);
      }
      this.publish(t, 'none', 'show', keys, {
        showing: 'keys'
      });
    } else {
      tables = [];
      ref1 = this.tables;
      for (key in ref1) {
        if (!hasProp.call(ref1, key)) continue;
        val = ref1[key];
        tables.push(key);
      }
      this.publish(t, 'none', 'show', tables, {
        showing: 'tables'
      });
    }
  }

  make(t, alters) {
    this.publish(t, 'none', 'make', {}, {
      alters: alters,
      msg: 'alter is a noop'
    });
  }

  drop(t) {
    var hasTable;
    hasTable = this.tables[t] != null;
    if (hasTable) {
      delete this.tables[t];
      this.publish(t, 'none', 'drop', {});
    } else {
      this.onerror(t, 'none', 'drop', {}, {
        msg: `Table ${t} not found`
      });
    }
  }

  // Subscribe to  a table or object with id
  onChange(t, id = 'none') {
    this.onerror(t, id, 'onChange', {}, {
      msg: "onChange() not implemeted by Store.Memory"
    });
  }

  dbTableName(tableName) {
    return this.dbName + '/' + tableName;
  }

  tableNames() {
    var key, names, ref, table;
    names = [];
    ref = this.tables;
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      table = ref[key];
      names.push(key);
    }
    return names;
  }

  importLocalStorage(tableNames) {
    var i, len, tableName;
    for (i = 0, len = tableNames.length; i < len; i++) {
      tableName = tableNames[i];
      this.tables[tableName] = JSON.parse(localStorage.getItem(this.dbTableName(tableName)));
    }
  }

  exportLocalStorage() {
    var dbTableName, ref, table, tableName;
    ref = this.tables;
    for (tableName in ref) {
      if (!hasProp.call(ref, tableName)) continue;
      table = ref[tableName];
      dbTableName = this.dbTableName(tableName);
      localStorage.removeItem(dbTableName);
      localStorage.setItem(dbTableName, JSON.stringify(table));
    }
  }

  // console.log( 'Store.Memory.exportLocalStorage()', dbTableName )
  importIndexedDB(op) {
    var i, idb, len, onNext, ref, tableName;
    idb = new IndexedDB(this.stream, this.dbName);
    ref = idb.dbs.objectStoreNames;
    for (i = 0, len = ref.length; i < len; i++) {
      tableName = ref[i];
      onNext = (result) => {
        if (op === 'select') {
          return this.tables[tableName] = result;
        }
      };
      this.subscribe(tableName, onNext);
      idb.traverse('select', tableName, {}, this.W, false);
    }
  }

  exportIndexedDB() {
    var dbVersion, idb, onIdxOpen;
    dbVersion = 1;
    idb = new IndexedDB(this.stream, this.dbName, dbVersion, this.tables);
    onIdxOpen = (dbName) => {
      var name, onNext, ref, results, table;
      idb.deleteDatabase(dbName);
      ref = this.tables;
      results = [];
      for (name in ref) {
        if (!hasProp.call(ref, name)) continue;
        table = ref[name];
        onNext = (result) => {
          return Util.noop(dbName, result);
        };
        this.subscribe(name, 'none', 'insert', onNext);
        results.push(idb.insert(name, table));
      }
      return results;
    };
    this.subscribe('IndexedDB', dbVersion.toString(), 'open', (dbName) => {
      return onIdxOpen(dbName);
    });
    idb.openDatabase();
  }

  logRows(name, table) {
    var key, results, row;
    console.log(name);
    results = [];
    for (key in table) {
      if (!hasProp.call(table, key)) continue;
      row = table[key];
      console.log('  ', key);
      console.log('  ', row);
      results.push(console.log('  ', JSON.stringify(row)));
    }
    return results;
  }

};

export default Memory;
