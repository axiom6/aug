var Memory,
  hasProp = {}.hasOwnProperty;

import Store from '../util/Store.js';

Memory = class Memory extends Store {
  constructor(dbName, tables, stream) {
    super(dbName, tables, stream);
    this.dbName = this.dbName;
  }

  batch(name, obj, objs, callback = null) {
    var onBatch, where;
    onBatch = (result) => {
      obj.result = result;
      if (this.batchComplete(objs)) {
        if (callback != null) {
          return callback(objs);
        } else {
          return this.results(name, 'batch', objs);
        }
      }
    };
    where = function() {
      return true;
    };
    this.select(obj.table, where, onBatch);
  }

  add(tn, id, object) {
    this.table(tn)[id] = object;
  }

  get(tn, id, callback) {
    var object;
    object = this.table(tn)[id];
    if (object != null) {
      if (callback != null) {
        callback(object);
      } else {
        this.results(tn, 'get', object, id);
      }
    } else {
      this.onerror(tn, 'get', {
        error: 'Memory object no found'
      }, id);
    }
  }

  put(tn, id, object) {
    this.table(tn)[id] = object;
  }

  del(tn, id) {
    var object;
    object = this.table(tn)[id];
    if (object != null) {
      delete this.table(tn)[id];
    } else {
      this.onerror(tn, 'get', {
        error: 'Memory object not found'
      }, id);
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

  select(tn, where, callback = null) {
    var objects, table;
    table = this.table(tn);
    objects = this.filter(table, where);
    if (callback != null) {
      callback(objects);
    } else {
      this.results(tn, 'select', objects);
    }
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
    this.results(table, 'remove', objs);
  }

  open(tn) {
    if (tn === false) { // Nothing to do. Handled by store
      ({});
    }
  }

  drop(tn) {
    if (tn === false) { // Nothing to do. Handled by store
      ({});
    }
  }

};

export default Memory;
