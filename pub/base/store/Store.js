var Store,
  hasProp = {}.hasOwnProperty;

import Util from '../util/Util.js';

import Data from '../../data/appl/Data.js';

Store = class Store {
  constructor(dbName) {
    this.dbName = dbName;
    this.stream = Data.stream;
    this.source = this.constructor.name;
    this.keyProp = "_id";
  }

  toSubject(table, op) {
    return table + ':' + op;
  }

  // id gets lost
  publish(table, op, result) {
    this.stream.publish(this.toSubject(table, op), result);
  }

  results(table, op, result) {
    this.publish(table, op, result);
  }

  onerror(table, op, error, id = 'none') {
    console.error('Store.onerror', {
      table: table,
      op: op,
      error: error,
      id: id
    });
  }

  subscribe(table, op, source, onSubscribe) {
    var changeOp, i, len, ref;
    if (op !== 'change') {
      if (!this.stream.hasSubject(this.toSubject(table, op))) {
        this.stream.subscribe(this.toSubject(table, op), source, onSubscribe);
      }
    } else {
      ref = Store.changeOps;
      for (i = 0, len = ref.length; i < len; i++) {
        changeOp = ref[i];
        this.stream.subscribe(this.toSubject(table, changeOp), source, onSubscribe);
      }
    }
  }

  // SQL rowops
  get(table, id, callback) {} // Get an object from table with id

  add(table, id, obj) {} // Post an object into table with id

  put(table, id, obj) {} // Put an object into table with id

  del(table, id) {} // Delete  an object from table with id

  
    // SQL tables with multiple objects (rows)    
  select(table, where = Store.where, callback) {} // Get an object from table with id

  insert(table, objs) {} // Insert objects into table with unique id

  update(table, objs) {} // # Update objects into table mapped by id

  remove(table, where = Store.where) {} // Delete objects from table with where clause

  
    // Table DDL (Data Definition Language)
  show() {} // Show all table names

  open(table) {} // Create a new table. For now only reallt used by CouchDB

  drop(table) {} // Drop the entire @table - good for testing

  change(table, id = 'None') {}

  // REST Api  CRUD + Subscribe for objectect records

    // A set is Table:{ url:'muse/Prin.json', result:json }
  batch(sets, callback) {
    var set, table;
    for (table in sets) {
      if (!hasProp.call(sets, table)) continue;
      set = sets[table];
      this.batchSelect(table, set, sets, callback);
    }
  }

  batchComplete(sets) {
    var set, table;
    for (table in sets) {
      if (!hasProp.call(sets, table)) continue;
      set = sets[table];
      if (set['result'] == null) {
        return false;
      }
    }
    return true;
  }

  batchSelect(table, set, sets, callback = null) {
    var onBatch, where;
    onBatch = (result) => {
      set.result = result;
      if (this.batchComplete(sets)) {
        if (callback != null) {
          return callback(sets);
        } else {
          return this.results(table, 'batch', sets);
        }
      }
    };
    where = function() {
      return true;
    };
    this.select(table, where, onBatch); // Calls the derived Store
  }

  copyTable(src, des, table, where = Store.where) {
    var callback;
    callback = function(results) {
      return des.insert(table, results);
    };
    src.select(table, where, callback);
  }

  copyDatabase(src, des) {
    var data, ref, table;
    ref = this.tables;
    for (table in ref) {
      if (!hasProp.call(ref, table)) continue;
      data = ref[table];
      this.copyTable(src, des, table, Store.where);
    }
  }

  // Utilities
  toObjects(results, query) {
    var i, key, len, obj, objs, row, where;
    where = query != null ? query : function(obj) {
      return true;
    };
    if (this.isArray(results)) {
      objs = {};
      for (i = 0, len = results.length; i < len; i++) {
        row = results[i];
        if (where(row)) {
          objs[row[this.keyProp]] = row;
        }
      }
      return objs;
    } else {
      objs = {};
      for (key in results) {
        if (!hasProp.call(results, key)) continue;
        obj = results[key];
        if (where(obj)) {
          objs[key] = obj;
        }
      }
      return objs;
    }
  }

  toArray(objs) {
    return Util.toArray(objs);
  }

  isArray(a) {
    return Util.isArray(a);
  }

  isStr(s) {
    return Util.isStr(s);
  }

};

Store.changeOps = ['change', 'add', 'put', 'del', 'insert', 'update', 'remove'];

// RDUDC            Retrieve  Create    Update    Delete   Change
Store.restOps = [
  'get',
  'add',
  'put',
  'del' //batch
];

Store.sqlOps = ['select', 'insert', 'update', 'remove'];

Store.tableOps = ['show', 'open', 'drop'];

Store.allOps = Store.restOps.concat(Store.sqlOps, Store.tableOps);

// Dafaults for empty arguments
Store.where = function() {
  return true; // Default where clause filter that returns true to access all records
};

export default Store;
