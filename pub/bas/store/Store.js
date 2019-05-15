var Store,
  hasProp = {}.hasOwnProperty;

import Util from '../util/Util.js';

import Memory from '../store/Memory.js';

import Fire from '../store/Fire';

import IndexedDB from '../store/IndexedDB';

import PouchDB from '../store/PouchDB';

import Rest from '../store/Rest';

if (Fire === false && IndexedDB === false && PouchDB === false && Rest === false) {
  ({});
}

Store = (function() {
  class Store {
    static where() {
      return true; // Default where clause filter that returns true to access all records
    }

    
    // @uri = REST URI where the file part is the database
    // @key = The key id property = default is ['id']
    constructor(stream, uri1, module) {
      this.stream = stream;
      this.uri = uri1;
      this.module = module;
      this.key = 'id';
      this.dbName = this.nameDb(this.uri);
      this.tables = {};
      this.hasMemory = false;
      this.W = Store.where;
      this.S = Store.schema;
      this.F = Store.format;
      this.A = Store.alters;
      this.R = Store.resets;
      Util.noop(this.getMemoryTables, this.toStoreObject, this.toSubjectFromParams, this.fromStoreObject, this.uponTablesComplete, this.toObjectsJson, this.onError2);
    }

    // REST Api  CRUD + Subscribe for objectect records
    add(table, id, object) {
      return Util.noop(table, id, object); // Post    Create   an object into table with id
    }

    get(table, id) {
      return Util.noop(table, id); // Get     Retrieve an object from table with id
    }

    put(table, id, object) {
      return Util.noop(table, id, object); // Put     Update   an object into table with id
    }

    del(table, id) {
      return Util.noop(table, id); // Delete  Delete   an object from table with id
    }

    
    // SQL Table DML (Data Manipulation Language) with multiple objects (rows)
    insert(table, objects) {
      return Util.noop(table, objects); // Insert objects into table with unique id
    }

    select(table, where = this.W) {
      return Util.noop(table, where); // Select objects from table with where clause
    }

    update(table, objects) {
      return Util.noop(table, objects); // Update objects into table mapped by id
    }

    remove(table, where = this.W) {
      return Util.noop(table, where); // Delete objects from table with where clause
    }

    
    // Table DDL (Data Definition Language)
    open(table, schema = this.S) {
      return Util.noop(table, schema); // Create a table with an optional schema
    }

    show(table, format = this.F) {
      return Util.noop(table, format); // Show a list tables if table name blank or columns
    }

    make(table, alters = this.A) {
      return Util.noop(table, alters); // Alter a table's schema - especially columns
    }

    drop(table, resets = this.R) {
      return Util.noop(table, resets); // Drop the entire @table - good for testing
    }

    
    // Subscribe to CRUD changes on a table or an object with id
    onChange(table, id = '') {
      Util.noop(table, id);
    }

    createTable(t) {
      this.tables[t] = {};
      return this.tables[t];
    }

    table(t) {
      if (this.tables[t] != null) {
        return this.tables[t];
      } else {
        return this.createTable(t);
      }
    }

    tableName(t) {
      var name, table;
      name = Util.firstTok(t, '.'); // Strips off  .json .js .csv file extensions
      table = this.table(name);
      Util.noop(table);
      return name;
    }

    memory(table, id, op) {
      var onNext;
      // console.log( 'Store.memory()', @toSubject(table,op,id) )
      onNext = (data) => {
        return this.toMemory(op, table, id, data);
      };
      this.stream.subscribe(this.toSubject(table, op, id), 'Store', onNext);
    }

    subscribe(table, id, op, onNext) {
      // console.log( 'Store.subscribe()', @toSubject(table,op,id) )
      this.stream.subscribe(this.toSubject(table, op, id), 'Store', onNext);
    }

    publish(table, id, op, data, extras = {}) {
      var params;
      params = this.toParams(table, id, op, extras);
      if (this.hasMemory) {
        this.toMemory(op, table, id, data, params);
      }
      this.stream.publish(this.toSubject(table, op, id), data);
    }

    onerror(table, id, op, result = {}, error = {}) {
      console.log('Stream.onerror', {
        db: this.dbName,
        table: table,
        id: id,
        op: op,
        result: result,
        error: error
      });
    }

    // params=Store provides empty defaults
    toMemory(op, table, id, data, params = Store) {
      var memory;
      memory = this.getMemory(this.dbName);
      switch (op) {
        case 'add':
          memory.add(table, id, data);
          break;
        case 'get':
          memory.add(table, id, data);
          break;
        case 'put':
          memory.put(table, id, data);
          break;
        case 'del':
          memory.del(table, id);
          break;
        case 'insert':
          memory.insert(table, data);
          break;
        case 'select':
          memory.insert(table, data);
          break;
        case 'update':
          memory.update(table, data);
          break;
        case 'remove':
          memory.remove(table, params.where);
          break;
        case 'open':
          memory.open(table, params.schema);
          break;
        case 'show':
          memory.show(table, params.format);
          break;
        case 'make':
          memory.make(table, params.alters);
          break;
        case 'drop':
          memory.drop(table, params.resets);
          break;
        default:
          console.error('Store.toMemory() unknown op', op);
      }
    }

    getMemory() {
      this.hasMemory = true;
      if ((Memory != null) && (Store.memories[this.dbName] == null)) {
        Store.memories[this.dbName] = new Memory(this.stream, this.dbName);
      }
      return Store.memories[this.dbName];
    }

    getMemoryTables() {
      return this.getMemory().tables;
    }

    remember() {
      Util.noop(this.getMemory(this.dbName));
    }

    toSubject(table = 'none', op = 'none', id = 'none') {
      var subject;
      subject = `${this.dbName}`;
      if (table !== 'none') {
        subject += `/${table}`;
      }
      if (id !== 'none') {
        subject += `/${id}`;
      }
      subject += `?module=${this.module}`;
      if (op !== 'none') {
        subject += `&op=${op}`;
      }
      // console.log( 'Store.toSubject', subject )
      return subject;
    }

    toParams(table, id, op, extras) {
      var params;
      params = {
        db: this.dbName,
        table: table,
        id: id,
        op: op,
        module: this.module
      };
      return Util.copyProperties(params, extras);
    }

    toSubjectFromParams(params) {
      return this.toSubject(params.table, params.op, params.id);
    }

    // Combine params and result
    toStoreObject(params, result) {
      return {
        params: params,
        result: result
      };
    }

    fromStoreObject(object) {
      return [object.params, object.result];
    }

    // ops can be single value. ids can be an array for single record ops
    toSubjects(tables, ops, ids) {
      var array, elem, i, j, ref;
      array = [];
      for (i = j = 0, ref = tables.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
        elem = {};
        elem.table = tables[i];
        elem.op = Util.isArray(ops) ? ops[i] : ops;
        elem.id = Util.isArray(ids) ? ids[i] : 'none';
        array.push(elem);
      }
      return array;
    }

    completeSubjects(array, completeOp, onComplete) {
      var callback, completeSubject, elem, id, j, len, op, sub, subjects;
      subjects = [];
      for (j = 0, len = array.length; j < len; j++) {
        elem = array[j];
        op = elem.op != null ? elem.op : 'none';
        id = elem.id != null ? elem.id : 'none';
        sub = this.toSubject(elem.table, op, id);
        subjects.push(sub);
      }
      completeSubject = `${this.dbName}?module=${this.module}&op=${completeOp}`;
      callback = typeof onComplete === 'function' ? () => {
        return onComplete();
      } : true;
      return this.stream.complete(completeSubject, subjects, callback);
    }

    // ops can be single value.  
    uponTablesComplete(tables, ops, completeOp, onComplete) {
      var subjects;
      subjects = this.toSubjects(tables, ops, 'none');
      this.completeSubjects(subjects, completeOp, onComplete);
    }

    toKeys(object) {
      var key, keys, obj;
      keys = [];
      for (key in object) {
        if (!hasProp.call(object, key)) continue;
        obj = object[key];
        keys.push(key);
      }
      return keys;
    }

    toJSON(obj) {
      if (obj != null) {
        return JSON.stringify(obj);
      } else {
        return '';
      }
    }

    toObject(json) {
      if (json) {
        return JSON.parse(json);
      } else {
        return {};
      }
    }

    toKeysJson(json) {
      return this.toKeys(JSON.parse(json));
    }

    toObjectsJson(json, where) {
      return Util.toObjects(JSON.parse(json), where, this.key);
    }

    onError2(error) {
      return console.error('Store.onError()', error.params, error.result);
    }

    onComplete() {
      return console.log('Store.onComplete()', 'Completed');
    }

    toExtras(status, url, datatype, readyState = null, error = null) {
      var extras;
      extras = {
        status: status,
        url: url,
        readyState: readyState,
        error: error // datatype:datatype,
      };
      if (readyState != null) {
        extras['readyState'] = readyState;
      }
      if (error != null) {
        extras['error'] = error;
      }
      return extras;
    }

    dataType() {
      var parse;
      parse = Util.parseURI(this.uri);
      if (parse.hostname === 'localhost') {
        return 'json';
      } else {
        return 'jsonp';
      }
    }

    nameDb(uri) {
      return Util.parseURI(uri)['dbName'];
    }

  };

  Store.memories = {}; // Store.Memory instances create by getMemory() for in memory dbName

  Store.databases = {}; // Set by Store.Memory as Store.databases[dbName].tables for

  
  // CRUD            Create    Retrieve  Update    Delete
  Store.restOps = ['add', 'get', 'put', 'del'];

  Store.sqlOps = ['insert', 'select', 'update', 'remove'];

  Store.tableOps = ['open', 'show', 'make', 'drop'];

  // @isRestOp:(  op ) -> Store. restOps.indexOf(op) isnt -1
  // @isSqlOp:(   op ) -> Store.  sqlOps.indexOf(op) isnt -1
  // @isTableOp:( op ) -> Store.tableOps.indexOf(op) isnt -1
  Store.methods = Store.restOps.concat(Store.sqlOps).concat(Store.tableOps).concat(['onChange']);

  Store.schema = {}; // Default schema      for open()

  Store.format = {}; // Default format      for show()

  Store.alters = {}; // Default alterations for make()

  Store.resets = {}; // Default resets      for drop()

  return Store;

}).call(this);

export default Store;
