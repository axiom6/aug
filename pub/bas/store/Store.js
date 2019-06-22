var Store,
  hasProp = {}.hasOwnProperty;

Store = (function() {
  class Store {
    constructor(dbName, tables1, url) {
      this.dbName = dbName;
      this.tables = tables1;
      this.url = url;
      this.rest = null;
      this.fire = null;
      this.index = null;
      this.local = null;
      this.memory = null;
      this.pipe = null;
    }

    table(tn) {
      if (tables[tn] != null) {
        return tables[tn];
      } else {
        this.open(table);
        return this.tables[tn];
      }
    }

    results(table, op, result, id = null) {
      if (this.pipe != null) {
        this.pipe.results(table, op, result, id);
      }
    }

    onerror(table, op, error, id = 'none') {
      console.error('Store.onerror', {
        dbName: this.dbName,
        table: table,
        op: op,
        error: error,
        id: id
      });
    }

    subscribe(table, op, source, onSubscribe) {
      if (this.pipe != null) {
        this.pipe.subscribe(table, op, source, onSubscribe);
      }
    }

    publish(table, op, result, id = null) {
      if (this.pipe != null) {
        this.pipe.publish(table, op, result, id);
      }
    }

    // REST Api  CRUD + Subscribe for objectect records 
    batch(objs, callback) { // Respond to an changed object
      var key, obj;
      for (key in objs) {
        if (!hasProp.call(objs, key)) continue;
        obj = objs[key];
        switch (obj.src) {
          case 'rest':
            if (this.rest != null) {
              this.rest.batch(obj, objs, callback);
            }
            break;
          case 'fire':
            if (this.fire != null) {
              this.fire.batch(obj, objs, callback);
            }
            break;
          case 'index':
            if (this.index != null) {
              this.index.batch(obj, objs, callback);
            }
            break;
          case 'local':
            if (this.local != null) {
              this.local.batch(obj, objs, callback);
            }
            break;
          case 'memory':
            if (this.memory != null) {
              this.memory.batch(obj, objs, callback);
            }
        }
      }
    }

    batchComplete(objs) {
      var key, obj;
      for (key in objs) {
        if (!hasProp.call(objs, key)) continue;
        obj = objs[key];
        if (!obj['data']) {
          return false;
        }
      }
      return true;
    }

    change(src, table, id, callback) { // Respond to an changed object 
      switch (src) {
        case 'rest':
          if (this.rest != null) {
            this.rest.change(table, id, callback);
          }
          break;
        case 'fire':
          if (this.fire != null) {
            this.fire.change(table, id, callback);
          }
          break;
        case 'index':
          if (this.index != null) {
            this.index.change(table, id, callback);
          }
          break;
        case 'local':
          if (this.local != null) {
            this.local.change(table, id, callback);
          }
          break;
        case 'memory':
          if (this.memory != null) {
            this.memory.change(table, id, callback);
          }
      }
    }

    get(src, table, id, callback) { // Get an object from table with id
      switch (src) {
        case 'rest':
          if (this.rest != null) {
            this.rest.get(table, id, callback);
          }
          break;
        case 'fire':
          if (this.fire != null) {
            this.fire.get(table, id, callback);
          }
          break;
        case 'index':
          if (this.index != null) {
            this.index.get(table, id, callback);
          }
          break;
        case 'local':
          if (this.local != null) {
            this.local.get(table, id, callback);
          }
          break;
        case 'memory':
          if (this.memory != null) {
            this.memory.get(table, id, callback);
          }
      }
    }

    add(table, id, object) { // Post an object into table with id
      if (this.rest != null) {
        this.rest.add(table, id, object);
      }
      if (this.fire != null) {
        this.fire.add(table, id, object);
      }
      if (this.index != null) {
        this.index.add(table, id, object);
      }
      if (this.local != null) {
        this.local.add(table, id, object);
      }
      if (this.memory != null) {
        this.memory.add(table, id, object);
      }
      if (this.pipe != null) {
        this.pipe.add(table, id, object);
      }
    }

    put(table, id, object) { // Put an object into table with id
      if (this.rest != null) {
        this.rest.put(table, id, object);
      }
      if (this.fire != null) {
        this.fire.put(table, id, object);
      }
      if (this.index != null) {
        this.index.put(table, id, object);
      }
      if (this.local != null) {
        this.local.put(table, id, object);
      }
      if (this.memory != null) {
        this.memory.put(table, id, object);
      }
      if (this.pipe != null) {
        this.pipe.put(table, id, object);
      }
    }

    del(table, id) { // Delete  an object from table with id
      if (this.rest != null) {
        this.rest.del(table, id);
      }
      if (this.fire != null) {
        this.fire.del(table, id);
      }
      if (this.index != null) {
        this.index.del(table, id);
      }
      if (this.local != null) {
        this.local.del(table, id);
      }
      if (this.memory != null) {
        this.memory.del(table, id);
      }
      if (this.pipe != null) {
        this.pipe.del(table, id);
      }
    }

    // SQL tables with multiple objects (rows)    
    select(src, table, where = Store.where, callback = null) { // Get an object from table with id
      switch (src) {
        case 'rest':
          if (this.rest != null) {
            this.rest.select(table, where, callback);
          }
          break;
        case 'fire':
          if (this.fire != null) {
            this.fire.select(table, where, callback);
          }
          break;
        case 'index':
          if (this.index != null) {
            this.index.select(table, where, callback);
          }
          break;
        case 'local':
          if (this.local != null) {
            this.local.select(table, where, callback);
          }
          break;
        case 'memory':
          if (this.memory != null) {
            this.memory.select(table, where, callback);
          }
      }
    }

    insert(table, objects) { // Insert objects into table with unique id
      if (this.rest != null) {
        this.rest.insert(table, objects);
      }
      if (this.fire != null) {
        this.fire.insert(table, objects);
      }
      if (this.index != null) {
        this.index.insert(table, objects);
      }
      if (this.local != null) {
        this.local.insert(table, objects);
      }
      if (this.memory != null) {
        this.memory.insert(table, objects);
      }
      if (this.pipe != null) {
        this.pipe.insert(table, objects);
      }
    }

    update(table, objects) { // # Update objects into table mapped by id
      if (this.rest != null) {
        this.rest.update(table, objects);
      }
      if (this.fire != null) {
        this.fire.update(table, objects);
      }
      if (this.index != null) {
        this.index.update(table, objects);
      }
      if (this.local != null) {
        this.local.update(table, objects);
      }
      if (this.memory != null) {
        this.memory.update(table, objects);
      }
      if (this.pipe != null) {
        this.pipe.update(table, objects);
      }
    }

    remove(table, where = Store.where) { // Delete objects from table with where clause
      if (this.rest != null) {
        this.rest.remove(table, where);
      }
      if (this.fire != null) {
        this.fire.remove(table, where);
      }
      if (this.index != null) {
        this.index.remove(table, where);
      }
      if (this.local != null) {
        this.local.remove(table, where);
      }
      if (this.memory != null) {
        this.memory.remove(table, where);
      }
      if (this.pipe != null) {
        this.pipe.remove(table, where);
      }
    }

    // Table DDL (Data Definition Language)  
    show(callback = null) { // Show all table names
      var keys;
      keys = Object.keys(this.tables);
      if (callback != null) {
        callback(keys);
      }
      this.pipe.results(null, 'show', keys);
    }

    open(table) { // Create a table with an optional schema
      if (this.tables[table] == null) {
        this.tables[table] = {};
        if (this.rest != null) {
          this.rest.open(table);
        }
        if (this.fire != null) {
          this.fire.open(table);
        }
        if (this.index != null) {
          this.index.open(table);
        }
        if (this.local != null) {
          this.local.open(table);
        }
        if (this.pipe != null) {
          this.pipe.open(table);
        }
      } else {
        this.onerror(table, 'open', {
          error: 'Store table already exists'
        });
      }
    }

    drop(table) { // Drop the entire @table - good for testing
      if (this.rest != null) {
        this.rest.drop(table);
      }
      if (this.fire != null) {
        this.fire.drop(table);
      }
      if (this.index != null) {
        this.index.drop(table);
      }
      if (this.local != null) {
        this.local.drop(table);
      }
      if (this.pipe != null) {
        this.pipe.drop(table);
      }
      if (this.tables[table] != null) {
        delete this.tables[table];
      } else {
        this.onerror(table, 'drop', {
          error: 'Store missing table'
        });
      }
    }

    static where() {
      return true; // Default where clause filter that returns true to access all records
    }

  };

  // RDUDC            Retrieve  Create    Update    Delete   Change
  Store.restOps = ['get', 'add', 'put', 'del', 'change', 'batch'];

  Store.sqlOps = ['select', 'insert', 'update', 'remove'];

  Store.tableOps = ['show', 'open', 'drop'];

  return Store;

}).call(this);

export default Store;
