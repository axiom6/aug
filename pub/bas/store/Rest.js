//mport fetch from '../../lib/fetch/fetch.js' # NodeJS fetch
var Rest;

Rest = class Rest {
  constructor(store) {
    this.store = store;
    this.url = this.store.url;
    this.key = "id";
  }

  // Rest
  change(table, id, callback, params = "") {
    return this.rest('change', table, id, null, params, callback);
  }

  get(table, id, callback, params = "") {
    return this.rest('get', table, id, null, params, callback);
  }

  add(table, id, object, params = "") {
    return this.rest('add', table, id, object, params);
  }

  put(table, id, object, params = "") {
    return this.rest('put', table, id, object, params);
  }

  del(table, id, params = "") {
    return this.rest('del', table, id, null, params);
  }

  // Sql
  select(table, where = {}, params = "") {
    return this.sql('select', table, where, '', null, params, callback);
  }

  insert(table, objects, params = "") {
    return this.sql('insert', table, {}, '', objects, params);
  }

  update(table, objects, params = "") {
    return this.sql('update', table, {}, '', objects, params);
  }

  remove(table, where = {}, params = "") {
    return this.sql('remove', table, where, '', null, params);
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

  rest(op, table, id, object = null, params = "", callback = null) {
    var settings, url;
    url = this.url; // @urlRest( op, table,'',params )
    settings = this.config(op);
    fetch(url, settings).then((response) => {
      return response.json();
    }).then((data) => {
      var extras, result;
      result = this.restResult(object, data);
      extras = this.restExtras(url);
      if (callback != null) {
        callback(result);
      }
      return this.store.results(table, id, op, result, extras);
    }).catch((error) => {
      var extras, result;
      result = this.restResult(object);
      extras = this.restExtras(url, error);
      return this.store.onerror(table, id, op, result, extras);
    });
  }

  sql(op, table, where, id, objects = null, params = "", callback = null) {
    var settings, url;
    url = this.urlRest(op, table, '', params);
    settings = this.config(op);
    fetch(url, settings).then((response) => {
      return response.json();
    }).then((data) => {
      var extras, result;
      result = this.restResult(objects, data, where);
      extras = this.restExtras(url);
      if (callback != null) {
        callback(result);
      }
      return this.store.results(table, id, op, result, extras);
    }).catch((error) => {
      var extras, result;
      result = this.restResult(object);
      extras = this.restExtras(url, error);
      return this.store.onerror(table, id, op, result, extras);
    });
  }

  opTable(op, table, options, callback = null) {
    var settings, url;
    url = this.urlRest(op, t, '', params);
    settings = this.config(op);
    fetch(url, settings).then((response) => {
      return response.json();
    }).then((data) => {
      var extras, result;
      result = this.restResult(null, data);
      extras = this.restExtras(url, null, null, options);
      if (callback != null) {
        callback(result);
      }
      return this.store.results(table, id, op, result, extras);
    }).catch((error) => {
      var extras;
      extras = this.restExtras(url, error);
      return this.store.onerror(table, id, op, {}, extras);
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

  restExtras(url, error = null, where = null, options = null) {
    var extras;
    extras = {
      url: url
    };
    if (error != null) {
      extras.error = error;
    }
    if (where != null) {
      extras.where = where;
    }
    if (options != null) {
      extras.options = options;
    }
    return extras;
  }

  urlRest(op, table, id = '', params = '') {
    // console.log('Rest.urlRest()', @url, table,params, @url + '/' + table + params )
    switch (op) {
      case 'add':
      case 'get':
      case 'put':
      case 'del':
      case 'change':
        return this.url + '/' + table + '/' + id + params;
      case 'insert':
      case 'select':
      case 'update':
      case 'remove':
        return this.url + '/' + table + params;
      case 'open':
      case 'show':
      case 'make':
      case 'drop':
        return this.url + '/' + table; // No Params
      default:
        console.error('Rest.urlRest() Unknown op', op);
        return this.url + '/' + table + '/' + id + params;
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
