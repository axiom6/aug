var Stuff,
  hasProp = {}.hasOwnProperty;

import Util from '../util/Util.js';

import Memory from '../store/Memory.js';

Stuff = (function() {
  class Stuff {
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
      this.datarx.subscribe(this.toSubject(table, op, id), 'Store', onNext);
    }

    // params=Store provides empty defaults
    toMemory(op, table, id, data, params) {
      var memory;
      memory = this.getMemory(this.dbName);
      switch (op) {
        case 'add':
          memory.add(table, id, data);
          break;
        case 'get':
          memory.get(table, id, data);
          break;
        case 'put':
          memory.put(table, id, data);
          break;
        case 'del':
          memory.del(table, id);
          break;
        case 'change':
          memory.change(table, data);
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
      if ((Memory != null) && (Stuff.memories[this.dbName] == null)) {
        Stuff.memories[this.dbName] = new Memory(this.datarx, this.dbName);
      }
      return Stuff.memories[this.dbName];
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
      return this.datarx.complete(completeSubject, subjects, callback);
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

  return Stuff;

}).call(this);
