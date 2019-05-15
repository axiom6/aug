var PouchDB,
  hasProp = {}.hasOwnProperty;

import Util from '../../bas/util/Util';

import Store from './Store';

import Pouch from '../../../lib/store/PouchDB.esm.stub.js';

PouchDB = (function() {
  class PouchDB extends Store {
    constructor(stream, uri = PouchDB.CouchDBHost) {
      super(stream, uri, 'PouchDB');
      this.key = '_id'; // CouchDB Id - important but not used
      this.dbs = {};
    }

    db(t, id = 'none', object = null) {
      if ((object != null) && Util.isStr(id) && id !== 'none') {
        object['_id'] = id;
      }
      if (this.dbs[t] == null) {
        this.dbs[t] = new Pouch(this.uri + t.toLowerCase());
      }
      return this.dbs[t];
    }

    add(t, id, object) {
      var db;
      db = this.db(t, id, object);
      db.post(object).then((obj) => {
        return this.publish(t, id, 'add', object, obj);
      }).catch((err) => {
        return this.onerror(t, id, 'add', object, err);
      });
    }

    get(t, id) {
      var db;
      db = this.db(t, id);
      db.get(id).then((obj) => {
        return this.publish(t, id, 'get', obj);
      }).catch((err) => {
        return this.onerror(t, id, 'get', {}, err);
      });
    }

    put(t, id, object) {
      var db;
      db = this.db(t, id);
      db.get(id).then((obj) => {
        object._id = id;
        object._rev = obj['_rev'];
        return db.put(object).then((res) => {
          return this.publish(t, id, 'del', object, res);
        }).catch((err) => {
          return this.onerror(t, id, 'del', object, err);
        });
      }).catch((err) => {
        return this.onerror(t, id, 'del', {
          msg: 'Unable to get doc'
        }, err);
      });
    }

    del(t, id) {
      var db;
      db = this.db(t, id);
      db.get(id).then((obj) => {
        obj['_deleted'] = true;
        console.log('PouchDB.del get obj', obj);
        return db.put(obj).then((res) => {
          return this.publish(t, id, 'del', obj, res);
        }).catch((err) => {
          return this.onerror(t, id, 'del', obj, err);
        });
      }).catch((err) => {
        return this.onerror(t, id, 'del', {
          msg: 'Unable to get doc'
        }, err);
      });
    }

    // Right now same as update, objects without _rev will be inserted
    insert(t, objects) {
      var db, docs;
      db = this.db(t);
      docs = this.toArray(t, objects, this.W);
      db.bulkDocs(docs).then((res) => {
        return this.publish(t, 'none', 'insert', objects, res);
      }).catch((err) => {
        return this.onerror(t, 'none', 'insert', objects, err);
      });
    }

    select(t, where = this.W) {
      var db;
      db = this.db(t);
      db.allDocs({
        include_docs: true
      }).then((res) => {
        var objects;
        //console.log( 'PouchDB select res', res ) # PouchDB select results are weirdly over structured
        objects = this.toSelectObjects(t, res['rows'], where);
        return this.publish(t, 'none', 'select', objects);
      }).catch((err) => {
        return this.onerror(t, 'none', 'select', {}, err);
      });
    }

    // Right now same as insert except objects with  _rev will be updated
    update(t, objects) {
      var db, docs;
      db = this.db(t);
      docs = this.toArray(t, objects, this.W);
      db.bulkDocs(docs).then((res) => {
        return this.publish(t, 'none', 'update', objects, res);
      }).catch((err) => {
        return this.onerror(t, 'none', 'update', objects, err);
      });
    }

    remove(t, objects, where = this.W) {
      var db, docs;
      db = this.db(t);
      docs = this.toArray(t, objects, where, true);
      db.bulkDocs(docs).then((res) => {
        return this.publish(t, 'none', 'remove', objects, res);
      }).catch((err) => {
        return this.onerror(t, 'none', 'remove', objects, err);
      });
    }

    open(t, schema) {
      var db;
      db = db(t);
      Util.noop(db);
      this.publish(t, 'none', 'open', {}, {
        schema: schema
      });
    }

    show(t) {
      var db;
      db = this.db(t);
      db.allDocs({
        include_docs: true
      }).then((rows) => {
        var array;
        array = this.toArray(rows);
        return this.publish(t, 'none', 'show', array, {
          rows: rows
        });
      }).catch((err) => {
        return this.onerror(t, 'none', 'show', {}, err);
      });
    }

    make(t, alters) {
      var db;
      db = this.db(t);
      Util.noop(db);
      this.publish(t, 'none', 'open', {}, {
        alters: alters
      });
    }

    drop(t) {
      var db;
      db = this.db(t);
      this.dbs[t] = null; // Need to examine
      db.destroy(t).then((info) => {
        return this.publish(t, 'none', 'drop', {}, {
          info: info
        });
      }).catch((error) => {
        return this.onerror(t, 'none', 'drop', {}, error);
      });
    }

    // Subscribe to  a table. Note: PouchDB can not subscript to objecst with id
    onChange(t, id = 'none') {
      var db;
      db = this.db(t, id);
      db.changes({
        include_docs: true
      }).on('change', (changes) => {
        return this.publish(t, 'none', 'onChange', {}, changes);
      }).on('error', (error) => {
        return this.onerror(t, 'none', 'onChange', {}, {
          error: error
        });
      });
    }

    toArray(t, objects, whereIn = null, del = false) {
      var array, i, key, len, object, where;
      where = whereIn != null ? whereIn : function() {
        return true;
      };
      array = [];
      if (Util.isArray(objects)) {
        for (i = 0, len = array.length; i < len; i++) {
          object = array[i];
          if (!(where(object))) {
            continue;
          }
          if (object['id']) {
            object['_id'] = object['id'];
          }
          if (del) {
            object['_deleted'] = true;
          }
          array.push(object);
        }
      } else {
        for (key in objects) {
          if (!hasProp.call(objects, key)) continue;
          object = objects[key];
          if (!(where(object))) {
            continue;
          }
          object['_id'] = key;
          if (del) {
            object['_deleted'] = true;
          }
          array.push(object);
        }
      }
      return array;
    }

    toSelectObjects(t, rows, whereIn, del = false) {
      var i, key, len, objects, row, where;
      where = whereIn != null ? whereIn : function() {
        return true;
      };
      objects = {};
      if (Util.isArray(rows)) {
        for (i = 0, len = rows.length; i < len; i++) {
          row = rows[i];
          if (!(where(row['doc']))) {
            continue;
          }
          if (del) {
            row['_deleted'] = true;
          }
          objects[row['doc']['id']] = row['doc'];
        }
      } else {
        for (key in rows) {
          row = rows[key];
          if (!(where(row))) {
            continue;
          }
          if (del) {
            row['_deleted'] = true;
          }
          objects[key] = row;
        }
      }
      return objects;
    }

  };

  PouchDB.CouchDBHost = 'http://127.0.0.1:5984/';

  PouchDB.CouchDBLocal = 'http://localhost:5984/';

  return PouchDB;

}).call(this);

export default PouchDB;
