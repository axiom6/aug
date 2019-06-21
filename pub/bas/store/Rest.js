//mport fetch from '../../lib/fetch/fetch.js' # NodeJS fetch
var Rest;

Rest = class Rest {
  constructor(store, baseUrl) {
    this.store = store;
    this.baseUrl = baseUrl;
    this.key = "id";
  }

  // Rest
  change(table, id, callback, path) {
    return this.rest('change', table, id, null, path, callback);
  }

  get(table, id, callback, path) {
    return this.rest('get', table, id, null, path, callback);
  }

  add(table, id, object, path) {
    return this.rest('add', table, id, object, path);
  }

  put(table, id, object, path) {
    return this.rest('put', table, id, object, path);
  }

  del(table, id, path) {
    return this.rest('del', table, id, null, path);
  }

  // Sql
  select(table, where = {}) {
    return this.sql('select', table, where, '', null, callback);
  }

  insert(table, objects) {
    return this.sql('insert', table, {}, '', objects);
  }

  update(table, objects) {
    return this.sql('update', table, {}, '', objects);
  }

  remove(table, where = {}) {
    return this.sql('remove', table, where, '', null);
  }

  // Table - only partially implemented
  show(table, format = {}) {
    return this.opTable('show', table, {
      format: format
    }, callback);
  }

  open(table, schema = {}) {
    return this.opTable('open', table, {
      schema: schema
    });
  }

  make(table, alters = {}) {
    return this.opTable('make', table, {
      alters: alters
    });
  }

  drop(table, resets = {}) {
    return this.opTable('drop', table, {
      resets: resets
    });
  }

  config(op) {
    var obj;
    obj = {};
    obj.method = this.restOp(op); // *GET, POST, PUT, DELETE
    obj.mode = 'cors'; // no-cors, cors, *same-origin
    obj.cache = 'no-cache'; // *default, no-cache, reload, force-cache, only-if-cached
    obj.redirect = 'follow'; // manual, *follow, error
    obj.referrer = 'no-referrer'; // no-referrer, *client
    obj.headers = {
      'Content-Type': 'application/json'
    };
    return obj;
  }

  batch(obj, objs, callback = null) {
    var settings, url;
    url = this.baseUrl + obj.url;
    settings = this.config('get');
    fetch(url, settings).then((response) => {
      return response.json();
    }).then((data) => {
      obj.data = data;
      if ((callback != null) && this.store.batchComplete(objs)) {
        callback(data);
      }
      return this.store.results(table, op, result, id);
    }).catch((error) => {
      return this.store.onerror(obj.table, 'batch', this.toError(url, error));
    });
  }

  rest(op, table, id, object = null, path, callback = null) {
    var settings, url;
    url = this.baseUrl + path;
    settings = this.config(op);
    fetch(url, settings).then((response) => {
      return response.json();
    }).then((data) => {
      var result;
      result = this.restResult(object, data);
      if (callback != null) {
        callback(result);
      }
      return this.store.results(table, op, result, id);
    }).catch((error) => {
      return this.store.onerror(table, op, this.toError(url, error), id);
    });
  }

  sql(op, table, where, id, objects = null, callback = null) {
    var settings, url;
    url = this.urlRest(op, table, '');
    settings = this.config(op);
    fetch(url, settings).then((response) => {
      return response.json();
    }).then((data) => {
      var result;
      result = this.restResult(objects, data, where);
      if (callback != null) {
        callback(result);
      }
      return this.store.results(table, op, result);
    }).catch((error) => {
      return this.store.onerror(table, op, this.toError(url, error), id);
    });
  }

  opTable(op, table, options, callback = null) {
    var settings, url;
    url = this.urlRest(op, t, '');
    settings = this.config(op);
    fetch(url, settings).then((response) => {
      return response.json();
    }).then((data) => {
      var result;
      result = this.restResult(null, data);
      if (callback != null) {
        callback(result);
      }
      return this.store.results(table, op, result);
    }).catch((error) => {
      return this.store.onerror(table, op, this.toError(url, error), id);
    });
  }

  restResult(object, data = null, where = function() {
      return true;
    }) { // object can also be objects
    var result;
    /*
    result = {}
    result = @toObject(data)                 if data?   and ( op is 'get'  )
    result = @toKeysJson(data)               if data?   and ( op is 'show' )
    result = object                          if object? and ( op is 'add' or op is 'put' )
    result = Util.toObjects(data,where,@key) if data?   and ( op is 'select' or op is 'remove' )
    result = object                          if object? and ( op is 'insert' or op is 'update' )
    result = if op is 'show' then @toKeysJson(data) else {}  
    */
    if (where === false) {
      ({});
    }
    result = data;
    return result;
  }

  toError(url, error = null, where = null, options = null) {
    var obj;
    obj = {};
    obj.url = url;
    if (error != null) {
      obj.error = error;
    }
    if (where != null) {
      obj.where = where;
    }
    if (options != null) {
      obj.options = options;
    }
    return obj;
  }

  urlRest(op, table, id = '', params = '') {
    switch (op) {
      case 'add':
      case 'get':
      case 'put':
      case 'del':
      case 'change':
        return this.baseUrl + '/' + table + '/' + id + params;
      case 'insert':
      case 'select':
      case 'update':
      case 'remove':
        return this.baseUrl + '/' + table + params;
      case 'open':
      case 'show':
      case 'make':
      case 'drop':
        return this.baseUrl + '/' + table; // No Params
      default:
        console.error('Rest.urlRest() Unknown op', op);
        return this.baseUrl + '/' + table + '/' + id + params;
    }
  }

  restOp(op) {
    switch (op) {
      case 'add':
      case 'insert':
      case 'open':
        return 'POST';
      case 'get':
      case 'select':
      case 'show':
        return 'GET';
      case 'put':
      case 'update':
      case 'make':
        return 'PUT';
      case 'del':
      case 'remove':
      case 'drop':
        return 'DELETE';
      case 'change':
        return 'GET';
      default:
        console.error('Rest.restOp() Unknown op', op);
        return 'GET';
    }
  }

};

export default Rest;
