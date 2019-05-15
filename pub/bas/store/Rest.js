var Rest;

import Util from '../../bas/util/Util';

import Store from './Store';

Rest = class Rest extends Store {
  constructor(stream, uri) {
    super(stream, uri, 'Rest');
  }

  // Rest
  add(table, id, object, params = "") {
    return this.ajaxRest('add', table, id, object, params);
  }

  get(table, id, params = "") {
    return this.ajaxRest('get', table, id, params);
  }

  put(table, id, object, params = "") {
    return this.ajaxRest('put', table, id, object, params);
  }

  del(table, id, params = "") {
    return this.ajaxRest('del', table, id, params);
  }

  // Sql
  insert(table, objects, params = "") {
    return this.ajaxSql('insert', table, this.W, objects, params);
  }

  select(table, where = this.W, params = "") {
    return this.ajaxSql('select', table, where, null, params);
  }

  update(table, objects, params = "") {
    return this.ajaxSql('update', table, this.W, objects, params);
  }

  remove(table, where = this.W, params = "") {
    return this.ajaxSql('remove', table, where, null, params);
  }

  // Table - only partially implemented
  open(table, schema = this.S) {
    return this.ajaxTable('open', table, {
      schema: schema
    });
  }

  show(table, format = this.F) {
    return this.ajaxTable('show', table, {
      format: format
    });
  }

  make(table, alters = this.A) {
    return this.ajaxTable('make', table, {
      alters: alters
    });
  }

  drop(table, resets = this.R) {
    return this.ajaxTable('drop', table, {
      resets: resets
    });
  }

  // Subscribe to  a table or object with id
  onChange(t, id = 'none') {
    this.onerror(t, id, 'onChange', {}, {
      msg: "onChange() not implemeted by Store.Rest"
    });
  }

  asyncJSON(url, callback) {
    fetch(url).then((response) => {
      return response.json();
    }).then((data) => {
      return callback(data);
    }).catch((error) => {
      return console.error("Rest.asyncJSON()", {
        url: url,
        error: error
      });
    });
  }

  ajaxRest(op, t, id, object = null, params = "") {
    var dataType, settings, tableName, url;
    tableName = this.tableName(t);
    url = this.urlRest(op, t, '', params);
    dataType = this.dataType();
    settings = {
      url: url,
      type: this.restOp(op),
      dataType: dataType,
      processData: false,
      contentType: 'application/json',
      accepts: 'application/json'
    };
    if (object != null) {
      settings.data = this.toJSON(object);
    }
    settings.success = (data, status, jqXHR) => {
      var extras, result;
      result = {};
      if (op === 'get') {
        result = this.toObject(data);
      }
      if (op === 'add' || op === 'put') {
        result = object;
      }
      extras = this.toExtras(status, url, dataType, jqXHR.readyState);
      return this.publish(tableName, id, op, result, extras);
    };
    settings.error = (jqXHR, status, error) => {
      var extras, result;
      result = {};
      if (op === 'add' || op === 'put') {
        result = object;
      }
      extras = this.toExtras(status, url, dataType, jqXHR.readyState, error);
      return this.onerror(tableName, id, op, result, extras);
    };
    $.ajax(settings);
  }

  ajaxSql(op, t, where, objects = null, params = "") {
    var dataType, settings, tableName, url;
    tableName = this.tableName(t);
    url = this.urlRest(op, t, '', params);
    dataType = this.dataType();
    settings = {
      url: url,
      type: this.restOp(op),
      dataType: dataType,
      processData: false,
      contentType: 'application/json',
      accepts: 'application/json'
    };
    if (objects != null) {
      settings.data = objects;
    }
    settings.success = (data, status, jqXHR) => {
      var extras, result;
      result = {};
      if ((data != null) && (op === 'select' || op === 'remove')) { // toArray through
        result = Util.toObjects(data, where, this.key);
      }
      if ((objects != null) && (op === 'insert' || op === 'update')) {
        result = objects;
      }
      extras = this.toExtras(status, url, dataType, jqXHR.readyState);
      if (op === 'select' || op === 'delete') {
        extras.where = 'all';
      }
      return this.publish(tableName, 'none', op, result, extras);
    };
    settings.error = (jqXHR, status, error) => {
      var extras, result;
      result = {};
      if (op === 'open' || op === 'update') {
        result = objects;
      }
      extras = this.toExtras(status, url, dataType, jqXHR.readyState, error);
      if (op === 'select' || op === 'delete') {
        extras.where = 'all';
      }
      return this.onerror(tableName, 'none', op, result, extras);
    };
    $.ajax(settings);
  }

  ajaxTable(op, t, options) {
    var dataType, settings, tableName, url;
    tableName = this.tableName(t);
    url = this.urlRest(op, t, '');
    dataType = this.dataType();
    settings = {
      url: url,
      type: this.restOp(op),
      dataType: dataType,
      processData: false,
      contentType: 'application/json',
      accepts: 'application/json'
    };
    settings.success = (data, status, jqXHR) => {
      var extras, result;
      result = op === 'show' ? this.toKeysJson(data) : {};
      extras = this.toExtras(status, url, dataType, jqXHR.readyState);
      return this.publish(tableName, 'none', op, result, this.copyProperties(extras, options));
    };
    settings.error = (jqXHR, status, error) => {
      var extras;
      extras = this.toExtras(status, url, dataType, jqXHR.readyState, error);
      return this.onerror(tableName, 'none', op, {}, this.copyProperties(extras, options));
    };
    $.ajax(settings);
  }

  urlRest(op, table, id = '', params = '') {
    var tableJson;
    // console.log('Store.Rest.urlRest()', @uri, table,params, @uri + '/' + table + params )
    tableJson = table + '.json';
    switch (op) {
      case 'add':
      case 'get':
      case 'put':
      case 'del':
        return this.uri + '/' + tableJson + '/' + id + params;
      case 'insert':
      case 'select':
      case 'update':
      case 'remove':
        return this.uri + '/' + tableJson + params;
      case 'open':
      case 'show':
      case 'make':
      case 'drop':
        return this.uri + '/' + tableJson; // No Params
      case 'onChange':
        if (id === '') {
          return this.uri + '/' + table;
        } else {
          return this.uri + '/' + tableJson + '/' + id + params;
        }
        break;
      default:
        console.error('Store.Rest.urlRest() Unknown op', op);
        return this.uri + '/' + tableJson;
    }
  }

  restOp(op) {
    switch (op) {
      case 'add':
      case 'insert':
      case 'open':
        return 'post';
      case 'get':
      case 'select':
      case 'show':
        return 'get';
      case 'put':
      case 'update':
      case 'make':
        return 'put';
      case 'del':
      case 'remove':
      case 'drop':
        return 'delete';
      case 'onChange':
        return 'get';
      default:
        console.error('Store.Rest.restOp() Unknown op', op);
        return 'get';
    }
  }

};

export default Rest;
