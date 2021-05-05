var Couch,
  hasProp = {}.hasOwnProperty;

import Store from './Store.js';

Couch = class Couch extends Store {
  constructor(dbName, baseUrl) {
    super(dbName);
    this.baseUrl = baseUrl;
    this.username = 'admin';
    this.password = 'athena';
  }

  // obj: {error: "not_found", reason: "missing"}
  add(table, id, obj) {
    this.put(table, id, obj, 'add');
  }

  get(table, id, callback) {
    var opts;
    opts = {
      callback: callback
    };
    this.rest('get', table, id, null, opts);
  }

  put(table, id, obj, op = 'put') {
    obj = this.setCouchProps(table, id, obj);
    this.rest(op, table, id, obj, {});
  }

  del(table, id) {
    this.rest('del', table, id, null, {});
  }

  select(table, where, callback) {
    var opts, selector;
    selector = this.findSelect(table);
    opts = {
      where: where,
      callback: callback,
      op2: "select"
    };
    this.rest('find', table, 'None', selector, opts);
  }

  insert(table, objs) {
    var docs, opts;
    docs = this.insertDocs(table, objs);
    opts = {
      objs: objs
    };
    this.rest('insert', table, 'None', {
      "docs": docs
    }, opts);
  }

  update(table, objs) {
    var docs, opts;
    docs = this.insertDocs(table, objs);
    opts = {
      objs: objs
    };
    this.rest('update', table, 'None', {
      "docs": docs
    }, opts);
  }

  remove(table, where) {
    var opts, selector;
    selector = this.findSelect(table);
    opts = {
      where: where,
      op2: 'remove'
    };
    this.rest('find', table, 'None', selector, opts);
  }

  show() {
    this.showTables();
  }

  // consider 412 status when opening an existing table
  // @rest( 'show', @dbName,'None', null, {} ) # Shows all docs in db
  open(table) {
    this.openTable(table);
    this.rest('open', table, 'None', null, {});
  }

  // look at response obj: {ok: true}
  drop(table) {
    this.dropTable(table);
    this.rest('drop', table, 'None', null, {});
  }

  queryPrac() {
    return {
      "selector": {
        "plane": {
          "$eq": "Know"
        }
      }
    };
  }

  findSelect(table) {
    return {
      "selector": {
        "table": {
          "$eq": table
        }
      }
    };
  }

  rest(op1, table, id, obj, opts) {
    var json, settings, url;
    url = this.urlRest(op1, table, id);
    json = obj != null ? JSON.stringify(obj) : null;
    settings = this.config(op1, json);
    fetch(url, settings).then((response) => {
      if (!response.ok) {
        return this.onerror(table, op1, response.statusText);
      } else {
        return response.json();
      }
    }).then((data) => {
      var objs, result;
      if (op1 === 'find' && opts.op2 === 'select') {
        return this.selectDocs(table, data, opts.where, opts.callback);
      } else if (op1 === 'find') {
        return this.findDocs(opts.op2, table, data, opts.where, opts.callback);
      } else {
        objs = opts.objs != null ? opts.objs : obj;
        result = this.restResult(op1, table, objs, data, opts.where);
        if (opts.callback != null) {
          return opts.callback(result);
        } else {
          return this.results(table, op1, result);
        }
      }
    }).catch((error) => {
      return this.onerror(table, op1, error);
    });
  }

  headers() {
    return {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Basic " + btoa(this.username + ":" + this.password)
    };
  }

  config(op, json) {
    var obj;
    obj = {};
    obj.method = this.restOp(op);
    if (json != null) {
      obj.body = json;
    }
    obj.headers = this.headers();
    return obj;
  }

  findDocs(op, table, data, where, callback) {
    var dObjs, doc, i, len, oDocs, opts, ref;
    oDocs = {
      "docs": []
    };
    dObjs = {};
    ref = data.docs;
    for (i = 0, len = ref.length; i < len; i++) {
      doc = ref[i];
      if (!(where(doc))) {
        continue;
      }
      if (op === 'remove') {
        doc['_deleted'] = true;
      }
      doc = this.setCouchProps(table, doc.id, doc, doc._rev, true);
      oDocs.docs.push(doc);
      dObjs[doc.id] = doc;
    }
    // console.log('Couch.findDocs()', { data:data, oDocs:oDocs, dObjs:dObjs } )
    opts = {
      where: (function(obj) {
        return true;
      }),
      callback: callback,
      objs: dObjs
    };
    if (op === 'remove') {
      this.rest(op, table, 'None', oDocs, opts);
    } else if (op === 'select') {
      this.results(table, 'select', oDocs);
    }
  }

  selectDocs(table, docs, where, callback) {
    var doc, i, len, ref, results;
    results = {};
    ref = docs.docs;
    for (i = 0, len = ref.length; i < len; i++) {
      doc = ref[i];
      if (!(where(doc))) {
        continue;
      }
      doc = this.setCouchProps(table, doc.id, doc, doc._rev, true);
      results[doc.id] = doc;
    }
    if (callback != null) {
      callback(results);
    } else {
      this.results(table, 'select', results);
    }
  }

  setCouchProps(table, id, obj, rev = null, ok = null) {
    obj['id'] = id;
    obj['_id'] = id;
    obj['table'] = table;
    if (rev != null) {
      obj['_rev'] = rev;
    }
    if (ok != null) {
      obj.ok = ok;
    }
    return obj;
  }

  insertDocs(table, objs) {
    var docs, key, obj;
    docs = [];
    for (key in objs) {
      if (!hasProp.call(objs, key)) continue;
      obj = objs[key];
      obj = this.setCouchProps(table, key, obj, null, null);
      docs.push(obj);
    }
    return docs;
  }

  insertObjs(table, objs, data) {
    var i, id, len, results, row;
    // console.log('Couch.insertObjs()', { objs:objs, data:data } )
    results = {};
    for (i = 0, len = data.length; i < len; i++) {
      row = data[i];
      id = row.id;
      results[id] = objs[id];
      // console.log('Couch.insertObjs()', { id:id, result:results[id], obj:objs[id] } )
      results[id] = this.setCouchProps(table, id, results[id], row.rev, row.ok);
    }
    return results;
  }

  tableObjs(table, results, query) {
    var i, key, len, obj, objsOp, ref, row, where;
    where = query != null ? query : function(obj) {
      return true;
    };
    if (this.isArray(results.rows)) {
      objsOp = {};
      ref = results.rows;
      for (i = 0, len = ref.length; i < len; i++) {
        row = ref[i];
        if (where(row)) {
          objsOp[row[this.keyProp]] = row;
        }
      }
      return objsOp;
    } else {
      objsOp = {};
      for (key in results) {
        if (!hasProp.call(results, key)) continue;
        obj = results[key];
        if (where(row)) {
          objsOp[key] = obj;
        }
      }
      return objsOp;
    }
  }

  restResult(op, table, obj, data, where) { // obj can also be objs
    var result;
    result = {};
    if ((data != null) && (op === 'get' || op === 'del')) {
      result = data;
    }
    if ((obj != null) && (op === 'add' || op === 'put')) {
      result = obj;
    }
    if ((data != null) && (obj != null) && (op === 'insert' || op === 'update')) {
      result = this.insertObjs(table, obj, data);
    }
    if ((data != null) && (op === 'select')) {
      result = this.tableObjs(table, data, where);
    }
    if ((obj != null) && (op === 'remove')) {
      result = obj;
    }
    if ((data != null) && (op === 'show' || op === 'drop')) {
      result = data;
    }
    return result;
  }

  urlRest(op, table, id) {
    switch (op) {
      case 'add':
      case 'put':
        return this.baseUrl + '/' + table + '?batch=ok';
      case 'get':
      case 'del':
        return this.baseUrl + '/' + table + '/' + id;
      case 'open':
      case 'drop':
        return this.baseUrl + '/' + table;
      case 'insert':
      case 'update':
      case 'remove':
        return this.baseUrl + '/' + table + '/' + '_bulk_docs';
      case 'select':
        return this.baseUrl + '/' + table + '/' + '_all_docs';
      case 'find':
        return this.baseUrl + '/' + table + '/' + '_find';
      case 'show':
        return this.baseUrl + '/' + '_all_dbs';
      default:
        console.error('Rest.urlRest() Unknown op', op, id);
        return this.baseUrl + '/' + table;
    }
  }

  restOp(op) {
    switch (op) {
      case 'open':
        return 'PUT';
      case 'get':
      case 'select':
      case 'show':
        return 'GET';
      case 'insert':
      case 'update':
      case 'remove':
      case 'find':
      case 'add':
      case 'put':
        return 'POST';
      case 'del':
      case 'drop':
        return 'DELETE';
      default:
        console.error('Rest.restOp() Unknown op', op);
        return 'GET';
    }
  }

};

export default Couch;
