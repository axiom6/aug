var Memory,
  hasProp = {}.hasOwnProperty;

import IndexedDB from './IndexedDB';

Memory = class Memory {
  constructor(store) {
    this.store = store;
    this.dbName = this.store.dbName;
    this.tables = this.store.tables;
    this.pubChange = true;
  }

  table(tn) {
    this.tables[tn] = this.tables[tn] != null ? this.tables[tn] : {};
    return this.tables[tn];
  }

  // This could be tied to put and add
  change(tn, id, callback, op = 'change') {
    var object;
    object = this.table(tn)[id];
    if (object != null) {
      if (callback != null) {
        callback(object);
      }
      this.store.results(tn, id, op, object, {
        op: op
      });
    } else {
      this.store.onerror(tn, id, op, object);
    }
  }

  add(tn, id, object) {
    this.table(tn)[id] = object;
    if (this.pubChange) {
      this.change(tn, id, null, 'add');
    }
  }

  get(tn, id, callback) {
    var object;
    object = this.table(tn)[id];
    if (object != null) {
      if (callback != null) {
        callback(object);
      }
      this.store.results(tn, id, 'get', object);
    } else {
      this.store.onerror(tn, id, 'get', object);
    }
  }

  put(tn, id, object) {
    this.table(tn)[id] = object;
    if (this.pubChange) {
      this.change(tn, id, null, 'put');
    }
  }

  del(tn, id) {
    var object;
    object = this.table(tn)[id];
    if (object != null) {
      if (this.pubChange) {
        this.change(tn, id, null, 'del');
      }
      delete this.table(tn)[id];
    } else {
      this.store.onerror(tn, id, 'del', object);
    }
  }

  insert(tn, objects) {
    var key, obj, table;
    table = this.table(tn);
    for (key in objects) {
      if (!hasProp.call(objects, key)) continue;
      obj = objects[key];
      table[key] = obj;
    }
  }

  select(tn, callback, where) {
    var key, obj, objects, table;
    objects = {};
    table = this.table(tn);
    for (key in table) {
      if (!hasProp.call(table, key)) continue;
      obj = table[key];
      if (where(obj)) {
        objects[key] = obj;
      }
    }
    if (callback != null) {
      callback(objects);
    }
    this.store.results(tn, id, 'show', objects);
  }

  update(tn, objects) {
    var key, obj, table;
    table = this.table(tn);
    for (key in objects) {
      if (!hasProp.call(objects, key)) continue;
      obj = objects[key];
      table[key] = obj;
    }
  }

  remove(tn, where) {
    var key, obj, table;
    table = this.table(tn);
    for (key in table) {
      if (!hasProp.call(table, key)) continue;
      obj = table[key];
      if (where(obj)) {
        delete table[key];
      }
    }
  }

  show(tn, format, callback) {
    if (format === false) {
      ({});
    }
    if (callback != null) {
      callback(this.table(tn));
    }
    this.store.results(tn, id, 'show', this.table(tn));
  }

  open(tn, schema) {
    if (schema === false) {
      ({});
    }
    this.table(tn);
  }

  make(tn, alters) {
    if (tn === false && alters === false) {
      ({});
    }
  }

  drop(tn, resets) {
    if (resets === false) {
      ({});
    }
    if (this.tables[tn] != null) {
      delete this.tables[tn];
    } else {
      this.store.onerror(tn, id, 'drop');
    }
  }

  importLocal(local) {
    var i, id, len, ref, table, tn;
    ref = local.tableIds;
    for (tn in ref) {
      if (!hasProp.call(ref, tn)) continue;
      table = ref[tn];
      for (i = 0, len = table.length; i < len; i++) {
        id = table[i];
        this.add(tn, id, this.local.obj(tn, id));
      }
    }
  }

  exportDB(db) {
    var id, obj, ref, table, tn;
    ref = this.tables;
    for (tn in ref) {
      if (!hasProp.call(ref, tn)) continue;
      table = ref[tn];
      for (id in table) {
        if (!hasProp.call(table, id)) continue;
        obj = table[id];
        db.add(tn, id, obj);
      }
    }
  }

  importIndexedDB() {
    var i, idb, len, ref, tableName, where;
    idb = new IndexedDB(this.dbName);
    ref = idb.dbs.objectStoreNames;
    for (i = 0, len = ref.length; i < len; i++) {
      tableName = ref[i];
      where = function(obj) {
        return false;
      };
      idb.traverse('select', tableName, {}, where, false);
    }
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
