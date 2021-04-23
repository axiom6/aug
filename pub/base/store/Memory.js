var Memory,
  hasProp = {}.hasOwnProperty;

import Store from './Store.js';

Memory = class Memory extends Store {
  constructor(dbName) {
    super(dbName);
    this.tables = {};
  }

  table(t) {
    if (this.tables[t] != null) {
      return this.tables[t];
    } else {
      this.tables[t] = {};
      return this.tables[t];
    }
  }

  add(tn, id, obj) {
    this.table(tn)[id] = obj;
    this.results(tn, 'add', obj);
  }

  get(tn, id, callback) {
    var obj;
    obj = this.table(tn)[id];
    if (obj != null) {
      if (callback != null) {
        callback(obj);
      } else {
        this.results(tn, 'get', obj);
      }
    } else {
      this.onerror(tn, 'get', {
        error: 'Memory object no found'
      }, id);
    }
  }

  put(tn, id, obj) {
    this.table(tn)[id] = obj;
    this.results(tn, 'put', obj);
  }

  del(tn, id) {
    var obj;
    obj = this.table(tn)[id];
    if (obj != null) {
      delete this.table(tn)[id];
      this.results(tn, 'del', obj);
    } else {
      this.onerror(tn, 'get', {
        error: 'Memory object not found'
      }, id);
    }
  }

  insert(tn, objs) {
    var key, obj, table;
    table = this.table(tn);
    for (key in objs) {
      if (!hasProp.call(objs, key)) continue;
      obj = objs[key];
      table[key] = obj;
    }
    this.results(tn, 'insert', objs);
  }

  select(tn, where, callback = null) {
    var key, obj, objs, table;
    table = this.table(tn);
    objs = {};
    for (key in table) {
      obj = table[key];
      if (where(obj)) {
        objs[key] = obj;
      }
    }
    if (callback != null) {
      callback(objs);
    } else {
      this.results(tn, 'select', objs);
    }
  }

  update(tn, objs) {
    var key, obj, table;
    table = this.table(tn);
    for (key in objs) {
      if (!hasProp.call(objs, key)) continue;
      obj = objs[key];
      table[key] = obj;
    }
    this.results(tn, 'update', objs);
  }

  remove(tn, where, op = 'remove') {
    var key, obj, objs, table;
    table = this.table(tn);
    objs = {};
    for (key in table) {
      if (!hasProp.call(table, key)) continue;
      obj = table[key];
      if (!(where(obj))) {
        continue;
      }
      objs[key] = obj;
      delete table[key];
    }
    this.results(tn, op, objs);
  }

  show() {
    var key, ref, table, tables;
    tables = [];
    ref = this.tables;
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      table = ref[key];
      tables.push(key);
    }
    this.results(this.dbName, 'show', tables);
  }

  open(table) {
    return this.results(table, 'open', {});
  }

  drop(tn) {}

};

//remove( tn, (obj)->true, op='drop' )
export default Memory;
