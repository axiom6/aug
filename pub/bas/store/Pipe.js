var Pipe;

Pipe = class Pipe {
  constructor(stream, dbName) {
    this.stream = stream;
    this.dbName = dbName;
  }

  toSubject(table) {
    return this.dbName + ':' + table;
  }

  toSource(id, op) {
    return id + ':' + op;
  }

  subscribe(table, id, op, onSubscribe) {
    this.stream.subscribe(this.toSubject(table), this.toSource(id, op), onSubscribe);
  }

  publish(table, id, op, obj, extras = {}) {
    this.stream.publish(this.toSubject(table), this.toSource(id, op), obj);
    if (extras === false) {
      ({});
    }
  }

  results(table, id, op, result, extras) {
    switch (op) {
      case 'change':
        return this.publish(table, id, 'change', result);
      case 'get':
        return this.publish(table, id, 'get', result);
      case 'select':
        return this.publish(table, 'none', 'select', result, extras);
      case 'show':
        return this.publish(table, 'none', 'show', result, extras);
    }
  }

  add(table, id, object) { // Post an object into table with id
    this.publish(table, id, 'add', object);
  }

  put(table, id, object) { // Put an object into table with id
    this.publish(table, id, 'put', object);
  }

  del(table, id) { // Delete  an object from table with id
    this.publish(table, id, 'del', {});
  }

  // SQL tables with multiple objects (rows)
  insert(table, objects) { // Insert objects into table with unique id
    this.publish(table, 'none', 'insert', objects);
  }

  update(table, objects) { // # Update objects into table mapped by id
    this.publish(table, 'none', 'update', objects);
  }

  remove(table, where = this.W) { // Remove objects from table with where clause
    this.publish(table, 'none', 'remove', {}, {
      where: where
    });
  }

  // Table DDL (Data Definition Language)
  open(table, schema = this.S) { // Create a table with an optional schema
    this.publish(table, 'none', 'show', {}, {
      schema: schema
    });
  }

  make(table, alters = this.A) { // Alter a table's schema - especially columns
    this.publish(table, 'none', 'show', {}, {
      alters: alters
    });
  }

  drop(table, resets = this.R) { // Drop the entire @table - good for testing
    this.publish(table, 'none', 'show', {}, {
      resets: resets
    });
  }

};
