var Local,
  hasProp = {}.hasOwnProperty;

import Store from '../util/Store.js';

Local = class Local extends Store {
  constructor() {
    super();
    this.tableIds = {};
  }

  key(table, id) {
    return table + id;
  }

  obj(table, id) {
    var str;
    str = localStorage.getItem(this.key(table, id));
    if (str != null) {
      return JSON.parse(str);
    } else {
      return null;
    }
  }

  addId(table, id) {
    if (this.tableIds[table] == null) {
      this.tableIds[table] = [];
    }
    return this.tableIds[table].push(id);
  }

  delId(table, id) {
    if (this.tableIds[table] == null) {
      this.tableIds[table] = [];
    }
    return this.tableIds[table].push(id);
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

  get(table, id, callback = null, op = 'get') {
    var obj;
    obj = this.obj(table, id);
    if (obj != null) {
      if (callback != null) {
        callback(obj);
      } else {
        this.results(table, op, obj, id);
      }
    } else {
      this.onerror(table, op, {
        error: "Local get error"
      }, id);
    }
  }

  add(table, id, obj) {
    this.addId(table, id);
    localStorage.setItem(this.key(table, id), JSON.stringify(obj));
  }

  put(table, id, obj) {
    localStorage.setItem(this.key(table, id), JSON.stringify(obj));
  }

  del(table, id) {
    this.delId(table, id);
    localStorage.removeItem(this.key(table, id));
  }

  insert(table, objs) {
    var key, obj;
    for (key in objs) {
      if (!hasProp.call(objs, key)) continue;
      obj = objs[key];
      this.add(table, key, obj);
    }
  }

  select(table, where, callback = null, op = 'select') {
    var i, id, ids, len, obj, objs;
    objs = {};
    ids = this.tableIds[table];
    for (i = 0, len = ids.length; i < len; i++) {
      id = ids[i];
      obj = this.obj(table, id);
      if ((obj != null) && where(obj)) {
        objs[key] = obj;
      }
    }
    if (callback != null) {
      callback(objs);
    } else {
      this.results(table, op, objs);
    }
  }

  update(table, objs) {
    var key, obj;
    for (key in objs) {
      if (!hasProp.call(objs, key)) continue;
      obj = objs[key];
      this.put(table, key, obj);
    }
  }

  remove(table, where) {
    var i, id, ids, len, obj, objs;
    ids = this.tableIds[table];
    objs = {};
    for (i = 0, len = ids.length; i < len; i++) {
      id = ids[i];
      obj = this.obj(table, id);
      if ((obj != null) && where(obj)) {
        this.del(table, id);
        objs[id] = obj;
      }
    }
    this.results(table, 'remove', objs);
  }

  // Nothing to do until we get ids
  open(table) {
    if (table === false) {
      ({});
    }
  }

  drop(table) {
    this.remove(table, function(obj) {
      return true;
    });
  }

};

export default Local;
