var Memory,
  hasProp = {}.hasOwnProperty;

import Store from './Store.js';

Memory = class Memory extends Store {
  constructor(dbName) {
    super(dbName);
    this.memory = {};
  }

  table(tn) {
    if (this.memory[tn] != null) {
      return this.memory[tn];
    } else {
      this.openTable(tn);
      this.memory[tn] = {};
      return this.memory[tn];
    }
  }

  add(tn, id, obj) {
    this.table(tn)[id] = obj;
    this.results(tn, 'add', obj);
  }

  get(tn, id, callback = null) {
    var obj;
    obj = this.table(tn)[id] != null ? this.table(tn)[id] : {};
    if (obj != null) {
      if (callback != null) {
        callback(obj);
      } else {
        this.results(tn, 'get', obj);
      }
    } else {
      this.onerror(tn, 'get', {
        error: 'Memory object not found'
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
    this.showTables();
  }

  open(table) {
    this.openTable(table);
  }

  drop(table) {
    this.dropTable(table);
  }

};

export default Memory;

/*
  console.log( 'Memory.get', { table:tn, id:id, obj:obj } )
  console.log( 'Memory.add', { table:tn, id:id, obj:@table(tn)[id] } )
*/
