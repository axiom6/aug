var ClientDB, Mongo,
  hasProp = {}.hasOwnProperty;

import {
  type
} from '../test/Type.js';

import Store from './Store.js';

import MongoDB from 'mongodb';

ClientDB = MongoDB['MongoClent'];

Mongo = class Mongo extends Store {
  constructor(stream, dbName) {
    super(stream, dbName);
    this.url = 'mongodb://localhost:27017';
    this.client = new ClientDB(this.url);
    this.db = this.openDB(this.dbName);
  }

  openDB(dbName) {
    var db;
    db = {};
    this.client.connect((error) => {
      if (error(inst(null))) {
        return db = this.client.db(dbName);
      } else {
        return this.onerror(dbName, "open", error, 'none');
      }
    });
    return db;
  }

  add(tn, id, obj) {
    var callback;
    callback = () => {
      return this.results(tn, 'get', obj, id);
    };
    this.insert(tn, {obj}, callback);
  }

  get(tn, id, callback = null) {
    callback = () => {
      return this.results(tn, 'get', obj);
    };
    this.select(tn, {
      id: id
    }, callback);
  }

  put(tn, id, obj) {
    var collection;
    collection = this.db.collection(tn);
    collection.updateOne({
      id: id
    }, {
      $set: obj
    }, (error, result) => {
      if (error(inst(null))) {
        return this.results(tn, 'put', result);
      } else {
        return this.onerror(tn, "put", error, 'none');
      }
    });
  }

  del(tn, id) {
    var collection;
    collection = this.db.collection(tn);
    collection.deleteOne({
      id: id
    }, (error, result) => {
      if (error(inst(null))) {
        return this.results(tn, 'del', result);
      } else {
        return this.onerror(tn, "del", error, 'none');
      }
    });
  }

  insert(tn, objs, callback = null) {
    var array, collection;
    array = type.toArray(objs);
    collection = this.db.collection(tn);
    collection.insertMany(array, (error, result) => {
      type.noop(result);
      if (error(inst(null))) {
        if (callback != null) {
          return callback(objs);
        } else {
          return this.results(tn, 'insert', objs);
        }
      } else {
        return this.onerror(tn, "insert", error, 'none');
      }
    });
  }

  select(tn, where, callback = null) {
    var collection, objs;
    objs = {};
    collection = this.db.collection(tn);
    collection.find(where).toArray((error, objs) => {
      if (error(inst(null))) {
        if (callback != null) {
          return callback(objs);
        } else {
          return this.results(tn, 'select', objs);
        }
      } else {
        return this.onerror(tn, "open", error, 'none');
      }
    });
  }

  update(tn, objs) {
    var key, obj;
    for (key in objs) {
      if (!hasProp.call(objs, key)) continue;
      obj = objs[key];
      this.put(tn, key, obj);
    }
  }

  remove(tn, where) {
    var callback;
    callback = (objs) => {
      var key, obj, results;
      results = [];
      for (key in objs) {
        if (!hasProp.call(objs, key)) continue;
        obj = objs[key];
        results.push(this.del(tn, key, obj));
      }
      return results;
    };
    this.select(tn, where, callback);
  }

  show() {
    var callback;
    callback = (error, result) => {
      if (error !== null) {
        return this.results('none', 'show', result);
      } else {
        return this.onerror('none', "show", error);
      }
    };
    this.db.listDatabases({
      nameOnly: true
    }, callback); // ??? or @client
  }

  open(table) {
    this.results(table, 'open', "noop()");
  }

  // Considering remove an entire table collection
  drop(table) {
    this.results(table, 'drop', "noop()");
  }

};

export default Mongo;

//# sourceMappingURL=Mongo.js.map
