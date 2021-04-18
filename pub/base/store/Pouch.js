var Pouch,
  hasProp = {}.hasOwnProperty;

import Store from './Store.js';

import * as PouchDB from 'pouchdb';

import * as PouchDBFind from 'pouchdb/dist/pouchdb.find';

Pouch = (function() {
  class Pouch extends Store {
    // adapter: One of 'idb', 'leveldb', or 'http'.
    constructor(opts1 = {}) {
      super();
      this.opts = opts1;
      this.tableDBs = {};
    }

    db(table, id = 'None', obj = null) {
      if (this.tableDBs[table] == null) {
        this.tableDBs[table] = new PouchDB(table, this.opts);
      }
      if ((obj != null) && this.isStr(id)) {
        obj['_id'] = id;
      }
      return this.tableDBs[table];
    }

    // Same as put
    add(table, id, obj) {
      var db;
      db = this.db(table, id, obj);
      db.put(obj).then((result) => {
        return this.results(table, 'add', result, id);
      }).catch((error) => {
        return this.onerror(table, 'add', error, id);
      });
    }

    get(table, id, callback = null) {
      var db;
      db = this.db(table, id);
      db.get(table).then((result) => {
        if (callback != null) {
          return callback(result);
        } else {
          return this.results(table, 'get', result, id);
        }
      }).catch((error) => {
        return this.onerror(table, 'get', error, id);
      });
    }

    put(table, id, obj) {
      var db;
      db = this.db(table, id, obj);
      db.put(obj).then((result) => {
        return this.results(table, 'put', result, id);
      }).catch((error) => {
        return this.onerror(table, 'put', error, id);
      });
    }

    del(table, id) {
      var db;
      db = this.db(table, id);
      db.get(table).then((obj) => {
        return db.remove(obj._id, obj._rev);
      }).then((result) => {
        return this.results(table, 'del', result, id);
      }).catch((error) => {
        return this.onerror(table, 'del', error, id);
      }).catch((error) => {
        return this.onerror(table, 'del', error, id);
      });
    }

    // Right now same as update, objs without _rev will be inserted
    insert(table, objs) {
      var db, docs;
      docs = this.toArray(table, objs, this.where);
      db = this.db(table);
      db.bulkDocs(docs).then((result) => {
        return this.results(table, 'insert', result);
      }).catch((error) => {
        return this.onerror(table, 'insert', error);
      });
    }

    select(table, where = this.where, callback = null) {
      var db;
      db = this.db(table);
      db.allDocs({
        include_docs: true
      }).then((results) => {
        var objs;
        objs = this.toSelectObjects(table, results.rows, where);
        if (callback != null) {
          return callback(result);
        } else {
          return this.results(table, 'select', objs);
        }
      }).catch((error) => {
        return this.onerror(table, 'select', error);
      });
    }

    // Right now same as insert except objs with  _rev will be updated
    update(table, objs) {
      var db, docs;
      docs = this.toArray(table, objs, this.where);
      db = this.db(table);
      db.bulkDocs(docs).then((result) => {
        return this.results(table, 'update', result);
      }).catch((error) => {
        return this.onerror(table, 'update', error);
      });
    }

    remove(table, objs, where = this.where) {
      var db, docs;
      docs = this.toArray(table, objs, where, true);
      db = this.db(table);
      db.bulkDocs(docs).then((result) => {
        return this.results(table, 'remove', result);
      }).catch((error) => {
        return this.onerror(table, 'remove', error);
      });
    }

    open(table) {
      var db;
      db = this.db(table);
      this.results(table, 'open', db);
    }

    show(table) {
      var db;
      db = this.db(table);
      db.info().then((result) => {
        return this.results(table, 'show', result);
      }).catch((error) => {
        return this.onerror(table, 'show', error);
      });
    }

    drop(table) {
      var db;
      db = this.db(table);
      db.destroy().then((result) => {
        return this.results(table, 'drop', result);
      }).catch((error) => {
        return this.onerror(table, 'drop', error);
      });
    }

    // Subscribe to  a table. Note: PouchDB can not subscript to objecst with id
    // @close( table ) # Determine necessity
    change(table, id = 'None') {
      var db, opts;
      opts = {
        include_docs: true
      };
      db = this.db(table, id);
      db.changes(opts).on('change', (change) => {
        return this.results(table, 'change', change);
      }).on('complete', (complete) => {
        return this.results(table, 'change', complete);
      }).on('error', (error) => {
        return this.onerror(table, 'change', error);
      });
    }

    close(table) {
      var db;
      db = this.db(table);
      db.close().then((result) => {
        delete this.tableDBs[table];
        return this.results(table, 'close', result);
      }).catch((error) => {
        return this.onerror(table, 'close', error);
      });
    }

    toArray(table, objs, whereIn = null, del = false) {
      var array, i, key, len, obj, where;
      where = whereIn != null ? whereIn : function() {
        return true;
      };
      array = [];
      if (this.isArray(objs)) {
        for (i = 0, len = array.length; i < len; i++) {
          obj = array[i];
          if (!(where(obj))) {
            continue;
          }
          if (obj['id']) {
            obj['_id'] = obj['id'];
          }
          if (del) {
            obj['_deleted'] = true;
          }
          array.push(obj);
        }
      } else {
        for (key in objs) {
          if (!hasProp.call(objs, key)) continue;
          obj = objs[key];
          if (!(where(obj))) {
            continue;
          }
          obj['_id'] = key;
          if (del) {
            obj['_deleted'] = true;
          }
          array.push(obj);
        }
      }
      return array;
    }

    toSelectObjects(table, rows, whereIn, del = false) {
      var i, key, len, objs, row, where;
      where = whereIn != null ? whereIn : function() {
        return true;
      };
      objs = {};
      if (this.isArray(rows)) {
        for (i = 0, len = rows.length; i < len; i++) {
          row = rows[i];
          if (!(where(row.doc))) {
            continue;
          }
          if (del) {
            row['_deleted'] = true;
          }
          objs[row.doc['id']] = row.doc; // Weird PouchDB structure
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
          objs[key] = row;
        }
      }
      return objs;
    }

  };

  Pouch.CouchDBHost = 'http://127.0.0.1:5984/';

  Pouch.CouchDBLocal = 'http://localhost:5984/';

  return Pouch;

}).call(this);

export default Pouch;
