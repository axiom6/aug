var Rest;

import Store from './Store.js';

Rest = class Rest extends Store {
  constructor(dbName, baseUrl) {
    super(dbName);
    this.baseUrl = baseUrl;
  }

  get(table) {
    return this.getter(table);
  }

  cet(table, id, call) {
    return this.rest('get', table, id, null, call);
  }

  add(table, id, obj) {
    return this.rest('add', table, id, obj);
  }

  put(table, id, obj) {
    return this.rest('put', table, id, obj);
  }

  del(table, id) {
    return this.rest('del', table, id, null);
  }

  select(table, where, call) {
    return this.rest('select', table, 'None', null, where, call);
  }

  insert(table, objs) {
    return this.rest('insert', table, 'None', objs);
  }

  update(table, objs) {
    return this.rest('update', table, 'None', objs);
  }

  remove(table, where) {
    return this.rest('remove', table, 'None', null, where);
  }

  drop(table) {
    return this.rest('drop', table, 'None');
  }

  show() {
    return this.rest('show', '_all_dbs', 'None'); // '_all_dbs' for couch
  }

  rest(op, table, id, obj = null, where = null, callback = null) {
    var json, settings, url;
    url = this.urlRest(op, table);
    json = obj != null ? JSON.stringify(obj) : null;
    settings = this.config(op, json);
    fetch(url, settings).then((response) => {
      return response.json();
    }).then((data) => {
      var result;
      result = this.restRestResult(op, obj, data, where);
      if (callback != null) {
        return callback(result);
      } else {
        return this.results(table, op, result, id);
      }
    }).catch((error) => {
      return this.onerror(table, op, error, id);
    });
  }

  getter(table) {
    var url;
    url = this.urlRest('get', table);
    fetch(url, {
      method: 'GET',
      mode: 'no-cors',
      credentials: 'same-origin',
      redirect: 'follow',
      agent: null,
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Basic ' + btoa('admin:athena')
      }
    });
  }

  config(op, json) {
    var obj;
    obj = {}; // 'Access-Control-Allow-Origin'  http://localhost:3000
    obj.method = this.restOp(op); // *GET, POST, PUT, DELETE
    if (json != null) {
      obj.body = json;
    }
    obj.mode = 'no-cors'; // no-cors, cors, *same-origin
    obj.credentials = 'include'; // 'same-origin'
    obj.cache = 'no-cache'; // *default, no-cache, reload, force-cache, only-if-cached
    obj.redirect = 'follow'; // manual, *follow, error
    obj.referrer = 'no-referrer'; // no-referrer, *client
    obj.headers = {
      "Authorization": 'Basic ' + "admin" + ":" + "athena",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Methods": "*",
      "Origin": "http://localhost:3000"
    };
    return obj;
  }

  config2(op, json) {
    var obj;
    obj = {}; // 'Access-Control-Allow-Origin'  http://localhost:3000
    obj.method = this.restOp(op); // *GET, POST, PUT, DELETE
    if (json != null) {
      obj.body = json;
    }
    // console.log( 'Rest.config()', obj.body ) if op is 'add'
    obj.mode = 'cors'; // no-cors, cors, *same-origin
    obj.credentials = 'include'; // 'same-origin'
    obj.cache = 'no-cache'; // *default, no-cache, reload, force-cache, only-if-cached
    obj.redirect = 'follow'; // manual, *follow, error
    obj.referrer = 'no-referrer'; // no-referrer, *client
    obj.headers = {
      "Authorization": 'Basic ' + "admin" + ":" + "athena",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Methods": "*",
      "Origin": "http://localhost:3000"
    };
    return obj;
  }

  restResult(op, obj, data = null, where) { // obj can also be objs
    var result;
    result = {};
    if ((data != null) && (op === 'get' || op === 'del')) {
      result = data;
    }
    if ((obj != null) && (op === 'add' || op === 'put')) {
      result = obj;
    }
    if ((obj != null) && (op === 'insert' || op === 'update')) {
      result = obj;
    }
    if ((data != null) && (op === 'select' || op === 'remove')) {
      result = this.toObjects(data, where);
    }
    if ((data != null) && (op === 'show' || op === 'drop')) {
      result = data;
    }
    return result;
  }

  urlRest(op, table) {
    switch (op) {
      case 'add':
      case 'get':
      case 'put':
      case 'del':
        return this.baseUrl + '/' + table;
      case 'insert':
      case 'update':
      case 'remove':
        return this.baseUrl + '/' + table + '?batch=ok';
      case 'drop':
      case 'select':
        return this.baseUrl + '/' + table;
      case 'show':
        break;
      default:
        console.error('Rest.urlRest() Unknown op', op);
        return this.baseUrl + '/' + table;
    }
  }

  urlRestDB(op, table) {
    switch (op) {
      case 'add':
      case 'get':
      case 'put':
      case 'del':
        return this.baseUrl + '/' + this.dbName + '/' + table;
      case 'insert':
      case 'update':
      case 'remove':
        return this.baseUrl + '/' + this.dbName + '/' + table + '?batch=ok';
      case 'drop':
      case 'select':
        return this.baseUrl + '/' + this.dbName + '/' + table;
      case 'show':
        break;
      default:
        console.error('Rest.urlRest() Unknown op', op);
        return this.baseUrl + '/' + table;
    }
  }

  restOp(op) {
    switch (op) {
      case 'add':
      case 'insert':
        return 'POST';
      case 'get':
      case 'select':
      case 'show':
        return 'GET';
      case 'put':
      case 'update':
        return 'PUT';
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

export default Rest;

/*
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
