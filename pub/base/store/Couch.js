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
    this.rest('find', table, 'None', this.tableSelect(table), opts);
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
    this.rest('find', table, 'None', this.tableSelect(table), opts);
  }

  drop(table) {
    var opts;
    opts = {
      ops2: 'drop'
    };
    this.rest('find', table, 'None', this.tableSelect(table), opts);
  }

  show() {
    this.rest('show', this.dbName, 'None', null, {}); // Shows all docs in db
  }

  tableSelector(table) {
    return {
      "selector": {
        "_table": {
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

  findDocs(op, table, iDocs, where, call) {
    var i, iDoc, len, oDocs, query, ref;
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
    query = function(obj) {
      return true;
    };
    this.rest(op, table, 'None', oDocs, query, call);
  }

  setCouchProps(table, id, obj, rev = null, ok = null) {
    obj['id'] = id;
    obj['_id'] = this.toDocId(table, id);
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
      id = this.frDocId(row.id).id;
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
        if (this.whereTable(table, row, where)) {
          objsOp[row[this.keyProp]] = row;
        }
      }
      return objsOp;
    } else {
      objsOp = {};
      for (key in results) {
        if (!hasProp.call(results, key)) continue;
        obj = results[key];
        if (this.whereTable(table, row, where)) {
          objsOp[key] = obj;
        }
      }
      return objsOp;
    }
  }

  toDocId(table, id) {
    return table + id;
  }

  frDocId(docId) {
    var match, ptn;
    ptn = /([a-z]+)([A-Z][a-z]*)/;
    match = ptn.exec(docId);
    if (match != null) {
      return {
        table: match[1],
        id: match[2]
      };
    } else {
      return 'prac';
    }
  }

  whereTable(obj, table, where) {
    var tableId;
    tableId = this.frDocId(obj.id);
    return tableId.table === table && where(obj);
  }

  urlRest(op, table, id) {
    switch (op) {
      case 'add':
      case 'get':
      case 'put':
      case 'del':
        return this.baseUrl + '/' + this.dbName + '/' + this.toDocId(table, id);
      case 'remove':
        return this.baseUrl + '/' + this.dbName + '/' + table + '?batch=ok';
      case 'insert':
      case 'update':
        return this.baseUrl + '/' + this.dbName + '/' + '_bulk_docs';
      case 'select':
        return this.baseUrl + '/' + this.dbName + '/' + '_bulk_get';
      case 'drop':
        return this.baseUrl + '/' + this.dbName + '/' + this.toDocId(table, id); // Not yet complete
      case 'show':
        return this.baseUrl + '/' + this.dbName + '/' + '_all_docs';
      default:
        console.error('Rest.urlRest() Unknown op', op);
        return this.baseUrl + '/' + table;
    }
  }

  restOp(op) {
    switch (op) {
      case 'add':
      case 'put':
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

/*
  <!--script type="text/javascript">var global = window;</script-->
  <!--script type="text/typescript">(window as any).global = window;</script-->

  config:( op, json ) ->
    obj = {}                            # 'Access-Control-Allow-Origin'  http://localhost:3000
    obj.method   = @restOp(op)          # *GET, POST, PUT, DELETE
    obj.body     = json if json?
    obj.mode     = 'no-cors'               # no-cors, cors, *same-origin
    obj.credentials = 'include'         # 'same-origin'
    obj.cache    = 'no-cache'           # *default, no-cache, reload, force-cache, only-if-cached
    obj.redirect = 'follow'             # manual, *follow, error
    obj.referrer = 'no-referrer'        # no-referrer, *client
    obj.headers  = @headers()
    obj

  getter:( table ) ->
    url = @urlRest( 'get', table )
    fetch( url, {
      method: 'GET',
      mode:'no-cors',
      credentials: 'same-origin',
      redirect: 'follow',
      agent: null,
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Basic ' + btoa('admin:athena') } } )
    return

  sql:( op, table, where, objs=null, callback=null ) ->
    url       = @urlRest( op, table,'' )
    settings  = @config( op )
    fetch( url, settings )
      .then( (response) =>
        response.json() )
      .then( (data) =>
        result = @restResult( objs, data, where )
        if callback?
           callback(result)
        else
           @results( table, op, result ) )
      .catch( (error) =>
        @onerror( table, op, @toError(url,error) ) )
    return

 * Only for open and drop. Needs to be thought out
  opTable:( op, table ) ->
    url       = @urlRest( op, t,'' )
    settings  = @config( op )
    fetch( url, settings )
      .then( (response) =>
        response.json() )
      .then( (data) =>
        result = @restResult( null, data )
        @results( table, op, result ) )
      .catch( (error) =>
        @onerror( table, op, @toError(url,error) ) )
    return

  toError:( url, error=null, where=null, options=null ) ->
    obj         = { }
    obj.url     = url
    obj.error   = error   if error?
    obj.where   = where   if where?
    obj.options = options if options?
    obj
 */
