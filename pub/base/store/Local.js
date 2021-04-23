var Local,
  hasProp = {}.hasOwnProperty;

import Store from './Store.js';

Local = class Local extends Store {
  constructor(dbName) {
    super(dbName);
    this.tableIds = {};
  }

  key(table, id) {
    return this.dbName + table + id;
  }

  obj(table, id) {
    var str;
    str = localStorage.getItem(this.key(table, id));
    // console.log( 'Local.obj()', str )
    if (str != null) {
      return JSON.parse(str);
    } else {
      return {};
    }
  }

  addId(table, id, obj) {
    obj._id = id;
    if (this.tableIds[table] == null) {
      this.tableIds[table] = [];
    }
    this.tableIds[table].push(id);
  }

  delId(table, id) {
    if (this.tableIds[table] == null) {
      this.tableIds[table] = [];
    }
    this.tableIds[table].push(id);
  }

  add(table, id, obj, silent = false) {
    this.addId(table, id, obj);
    localStorage.setItem(this.key(table, id), JSON.stringify(obj));
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
    localStorage.setItem(this.key(table, id), JSON.stringify(obj));
    if (!silent) {
      this.results(table, 'put', obj);
    }
  }

  del(table, id, silent = false) {
    var obj;
    this.delId(table, id);
    obj = this.obj(table, id);
    localStorage.removeItem(this.key(table, id));
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
    var id, ids, j, len, obj, objs;
    objs = {};
    ids = this.tableIds[table];
    for (j = 0, len = ids.length; j < len; j++) {
      id = ids[j];
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

  remove(table, where, silent = false) {
    var id, ids, j, len, obj, objs;
    ids = this.tableIds[table];
    objs = {};
    for (j = 0, len = ids.length; j < len; j++) {
      id = ids[j];
      obj = this.obj(table, id);
      if ((obj != null) && where(obj)) {
        this.del(table, id, true);
        objs[id] = obj;
      }
    }
    if (!silent) {
      this.results(table, 'remove', objs);
    }
  }

  open(table) {
    return this.results(table, 'open', {});
  }

  show() {
    var i, item, j, match, ptn, ref, table, tables;
    tables = [];
    ptn = /([A-Z][a-z]*)([A-Z][a-z]*)([A-Z][a-z]*)/;
    for (i = j = 0, ref = localStorage.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      item = localStorage.key(i);
      if (item.startsWith(this.dbName)) {
        match = ptn.exec(item);
        // console.log( 'Local.show()', match[1], match[2], match[3] )
        table = match[2];
        if (!tables.includes(table)) {
          tables.push(table);
        }
      }
    }
    this.results(this.dbName, 'show', tables);
  }

  drop(table) {
    this.remove(table, (function(obj) {
      return true;
    }), true);
    this.results(table, 'drop', {});
  }

};

export default Local;

/*
  version:() ->
    localStorage.setItem('IndexDbVersion','0')
    dbVersionStr = localStorage.getItem('IndexDbVersion')
    dbVersionInt = if dbVersionStr? then parseInt(dbVersionStr)+1 else 1
    dbVersionStr = dbVersionInt.toString()
    localStorage.setItem('IndexDbVersion',dbVersionStr)
    console.log( 'Index() version', dbVersionStr, dbVersionInt )
    dbVersionInt
*/
