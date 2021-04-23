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
    var opts;
    opts = {
      where: where,
      callback: callback,
      ops2: 'select'
    };
    this.rest('find', table, 'None', this.query, opts);
  }

  insert(table, objs) {
    var docs;
    docs = this.insertDocs(table, objs);
    //onsole.log( 'Rest.insert()',   { "docs":docs } )
    this.rest('insert', table, 'None', {
      "docs": docs
    }, {});
  }

  update(table, objs) {
    var docs;
    docs = this.insertDocs(table, objs);
    this.rest('update', table, 'None', {
      "docs": docs
    }, {});
  }

  remove(table, where) {
    var opts;
    opts = {
      where: where,
      ops2: 'remove'
    };
    this.rest('find', table, 'None', this.query, opts);
  }

  show() {
    this.rest('show', this.dbName, 'None', null, {}); // Shows all docs in db
  }

  open(table) {
    this.rest('open', table, 'None', null, {});
  }

  drop(table) {
    this.rest('drop', table, 'None', null, {});
  }

  query() {
    return {};
  }

  rest(op1, table, id, obj, opts) {
    var json, settings, url;
    url = this.urlRest(op1, table, id);
    json = obj != null ? JSON.stringify(obj) : null;
    settings = this.config(op1, json);
    fetch(url, settings).then((response) => {
      return response.json();
    }).then((data) => {
      var result;
      if (op1 === 'find') {
        return this.findDocs(opts.ops2, table, data, opts.where, opts.callback);
      } else {
        result = this.restResult(op1, table, obj, data, opts.where);
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

  findDocs(op, table, iDocs, where, callback) {
    var i, iDoc, len, oDocs, opts, ref;
    oDocs = {
      "docs": []
    };
    ref = iDocs.docs;
    for (i = 0, len = ref.length; i < len; i++) {
      iDoc = ref[i];
      if (!(where(iDoc))) {
        continue;
      }
      if (op === 'remove' || op === 'drop') {
        iDoc['_deleted'] = true;
      }
      oDocs.docs.push(iDoc);
    }
    opts = {
      where: (function(obj) {
        return true;
      }),
      callback: callback
    };
    this.rest(op, table, 'None', oDocs, opts);
  }

  setCouchProps(table, id, obj, rev = null, ok = null) {
    obj['id'] = id;
    obj['_id'] = id;
    obj['_table'] = table;
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
      obj = this.setCouchProps(table, id, obj, null, null);
      docs.push(obj);
    }
    return docs;
  }

  insertObjs(table, iObj, results) {
    var i, id, len, oObj, row;
    oObj = {};
    for (i = 0, len = results.length; i < len; i++) {
      row = results[i];
      id = row.id;
      oObj[id] = iObj[key];
      oObj[id] = this.setCouchProps(table, id, oObj[id], row.rev, row.ok);
    }
    return oObj;
  }

  tableObjs(table, objsIn, results, query) {
    var i, key, len, obj, objsOp, row, where;
    where = query != null ? query : function(obj) {
      return true;
    };
    if (this.isArray(results)) {
      objsOp = {};
      for (i = 0, len = results.length; i < len; i++) {
        row = results[i];
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

  restResult(op, table, obj, data = null, where) { // obj can also be objs
    var result;
    result = {};
    if ((data != null) && (op === 'get' || op === 'del')) {
      result = data;
    }
    if ((obj != null) && (op === 'add' || op === 'put')) {
      result = obj;
    }
    if ((obj != null) && (op === 'insert' || op === 'update')) {
      result = this.insertObjs(table, obj, data);
    }
    if ((data != null) && (op === 'select' || op === 'remove')) {
      result = this.tableObjs(table, obj, data, where);
    }
    if ((data != null) && (op === 'show' || op === 'drop')) {
      result = data;
    }
    return result;
  }

  urlRest(op, table, id) {
    switch (op) {
      case 'add':
      case 'get':
      case 'put':
      case 'del':
        return this.baseUrl + '/' + table + '/' + id;
      case 'remove':
      case 'open':
      case 'drop':
        return this.baseUrl + '/' + table;
      case 'insert':
      case 'update':
        return this.baseUrl + '/' + table + '/' + '_bulk_docs';
      case 'select':
        return this.baseUrl + '/' + table + '/' + '_bulk_get';
      case 'show':
        return this.baseUrl + '/' + table + '/' + '_all_docs';
      default:
        console.error('Rest.urlRest() Unknown op', op);
        return this.baseUrl + '/' + table;
    }
  }

  restOp(op) {
    switch (op) {
      case 'add':
      case 'put':
      case 'open':
        return 'PUT';
      case 'get':
      case 'show':
        return 'GET';
      case 'select':
      case 'insert':
      case 'update':
      case 'find':
        return 'POST';
      case 'del':
      case 'remove':
      case 'drop':
        return 'DELETE';
      default:
        console.error('Rest.restOp() Unknown op', op);
        return 'GET';
    }
  }

};

export default Couch;
