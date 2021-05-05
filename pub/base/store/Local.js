var Local,
  hasProp = {}.hasOwnProperty;

import Store from './Store.js';

Local = class Local extends Store {
  constructor(dbName) {
    super(dbName);
    this.memory = {};
  }

  tableId(table, id) {
    return table + id;
  }

  obj(table, id) {
    var str;
    str = localStorage.getItem(this.tableId(table, id));
    if (str != null) {
      return JSON.parse(str);
    } else {
      return {};
    }
  }

  addId(table, id, obj) {
    obj._id = id;
    if (!((this.tables[table] != null) && (this.tables[table][this.source] != null))) {
      this.openTable(table);
    }
    if (this.memory[table] == null) {
      this.memory[table] = {};
    }
    this.memory[table][id] = obj;
  }

  delId(table, id) {
    if ((this.memory[table] != null) && (this.memory[table][id] != null)) {
      delete this.memory[table][id];
    }
  }

  add(table, id, obj, silent = false) {
    this.addId(table, id, obj);
    localStorage.setItem(this.tableId(table, id), JSON.stringify(obj));
    if (!silent) {
      this.results(table, 'add', obj);
    }
  }

  get(table, id, callback = null, op = 'get', silent = false) {
    var obj;
    obj = this.obj(table, id);
    if (obj != null) {
      if (callback != null) {
        callback(obj);
      } else {
        if (!silent) {
          this.results(table, op, obj);
        }
      }
    } else {
      this.onerror(table, op, {
        error: "Local get error"
      }, id);
    }
  }

  put(table, id, obj, silent = false) {
    this.addId(table, id, obj);
    localStorage.setItem(this.tableId(table, id), JSON.stringify(obj));
    if (!silent) {
      this.results(table, 'put', obj);
    }
  }

  del(table, id, silent = false) {
    var obj;
    this.delId(table, id);
    obj = this.obj(table, id);
    localStorage.removeItem(this.tableId(table, id));
    if (!silent) {
      this.results(table, 'del', obj);
    }
  }

  insert(table, objs) {
    var key, obj;
    for (key in objs) {
      if (!hasProp.call(objs, key)) continue;
      obj = objs[key];
      this.add(table, key, obj, true);
    }
    this.results(table, 'insert', objs);
  }

  select(table, where, callback = null, op = 'select') {
    var entry, id, obj, objs, ref;
    objs = {};
    ref = this.memory[table];
    for (id in ref) {
      if (!hasProp.call(ref, id)) continue;
      entry = ref[id];
      if (!(this.memory[table] != null)) {
        continue;
      }
      obj = this.obj(table, id);
      if ((obj != null) && where(obj)) {
        objs[id] = obj;
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
      this.put(table, key, obj, true);
    }
    this.results(table, 'update', objs);
  }

  remove(table, where, op = 'remove') {
    var entry, id, obj, objs, ref;
    objs = {};
    ref = this.memory[table];
    for (id in ref) {
      if (!hasProp.call(ref, id)) continue;
      entry = ref[id];
      if (!(this.memory[table] != null)) {
        continue;
      }
      obj = this.obj(table, id);
      if ((obj != null) && where(obj)) {
        this.del(table, id, true);
        objs[id] = obj;
      }
    }
    this.results(table, op, objs);
  }

  show() {
    return this.showTables();
  }

  open(table) {
    this.openTable(table);
  }

  drop(table) {
    var where;
    this.dropTable(table);
    where = function(obj) {
      return true;
    };
    this.remove(table, where, 'drop');
  }

};

export default Local;

/*
 * console.log( 'Local.obj()', str )

  version:() ->
    localStorage.setItem('IndexDbVersion','0')
    dbVersionStr = localStorage.getItem('IndexDbVersion')
    dbVersionInt = if dbVersionStr? then parseInt(dbVersionStr)+1 else 1
    dbVersionStr = dbVersionInt.toString()
    localStorage.setItem('IndexDbVersion',dbVersionStr)
    console.log( 'Index() version', dbVersionStr, dbVersionInt )
    dbVersionInt
 */
