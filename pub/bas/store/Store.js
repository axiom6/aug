var Store;

Store = (function() {
  class Store {
    constructor(dbName, tables, url) {
      this.dbName = dbName;
      this.tables = tables;
      this.url = url;
      this.rest = null;
      this.fire = null;
      this.index = null;
      this.local = null;
      this.memory = null;
      this.pipe = null;
    }

    results(table, id, op, result, extras = {}) {
      if (this.pipe != null) {
        this.pipe.results(table, id, op, result, extras);
      }
    }

    onerror(table, id, op, result = {}, error = {}) {
      console.error('Store.onerror', {
        dbName: this.dbName,
        table: table,
        id: id,
        op: op,
        result: result,
        error: error
      });
    }

    // REST Api  CRUD + Subscribe for objectect records  
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
      if (this.fire != null) {
        //rest  .add( table, id, object ) if @rest?
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
      if (this.fire != null) {
        //rest  .put( table, id, object ) if @rest?
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
      if (this.fire != null) {
        //rest  .del( table, id ) if @rest?
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
    select(src, table, callback, where = Store.where) { // Get an object from table with id
      switch (src) {
        case 'rest':
          if (this.rest != null) {
            this.rest.select(table, callback, where);
          }
          break;
        case 'fire':
          if (this.fire != null) {
            this.fire.select(table, callback, where);
          }
          break;
        case 'index':
          if (this.index != null) {
            this.index.select(table, callback, where);
          }
          break;
        case 'local':
          if (this.local != null) {
            this.local.select(table, callback, where);
          }
          break;
        case 'memory':
          if (this.memory != null) {
            this.memory.select(table, callback, where);
          }
      }
    }

    insert(table, objects) { // Insert objects into table with unique id
      if (this.fire != null) {
        //rest  .insert( table, objects ) if @rest?
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
      if (this.fire != null) {
        //rest  .update( table, objects ) if @rest?
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
      if (this.fire != null) {
        //rest  .remove( table, where ) if @rest?
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
    show(src, table, callback, format = Store.format) { // Show a table
      switch (src) {
        case 'rest':
          if (this.rest != null) {
            this.rest.show(table, format, callback);
          }
          break;
        case 'fire':
          if (this.fire != null) {
            this.fire.show(table, format, callback);
          }
          break;
        case 'index':
          if (this.index != null) {
            this.index.show(table, format, callback);
          }
          break;
        case 'local':
          if (this.local != null) {
            this.local.show(table, format, callback);
          }
          break;
        case 'memory':
          if (this.memory != null) {
            this.memory.show(table, format, callback);
          }
      }
    }

    open(table, schema = Store.schema) { // Create a table with an optional schema
      if (this.fire != null) {
        //rest  .open( table, schema ) if @rest?
        this.fire.open(table, schema);
      }
      if (this.index != null) {
        this.index.open(table, schema);
      }
      if (this.local != null) {
        this.local.open(table, schema);
      }
      if (this.memory != null) {
        this.memory.open(table, schema);
      }
      if (this.pipe != null) {
        this.pipe.open(table, schema);
      }
    }

    make(table, alters = Store.alters) { // Alter a table's schema - especially columns
      if (this.fire != null) {
        //rest  .make( table, alters ) if @rest?
        this.fire.make(table, alters);
      }
      if (this.index != null) {
        this.index.make(table, alters);
      }
      if (this.local != null) {
        this.local.make(table, alters);
      }
      if (this.memory != null) {
        this.memory.make(table, alters);
      }
      if (this.pipe != null) {
        this.pipe.make(table, alters);
      }
    }

    drop(table, resets = Store.reset) { // Drop the entire @table - good for testing
      if (this.fire != null) {
        //rest  .open( table, resets ) if @rest?
        this.fire.open(table, resets);
      }
      if (this.index != null) {
        this.index.open(table, resets);
      }
      if (this.local != null) {
        this.local.open(table, resets);
      }
      if (this.memory != null) {
        this.memory.open(table, resets);
      }
      if (this.pipe != null) {
        this.pipe.open(table, resets);
      }
    }

    static where() {
      return true; // Default where clause filter that returns true to access all records
    }

  };

  // RDUDC            Retrieve  Create    Update    Delete   Change
  Store.restOps = ['get', 'add', 'put', 'del', 'change'];

  Store.sqlOps = ['select', 'insert', 'update', 'remove'];

  Store.tableOps = ['show', 'open', 'make', 'drop'];

  Store.schema = {}; // Default schema      for open()

  Store.format = {}; // Default format      for show()

  Store.alters = {}; // Default alterations for make()

  Store.resets = {}; // Default resets      for drop()    

  return Store;

}).call(this);

export default Store;
