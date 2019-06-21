var Pipe;

Pipe = class Pipe {
  constructor(stream, dbName) {
    this.stream = stream;
    this.dbName = dbName;
  }

  toSubject(table, op) {
    return this.dbName + ':' + table + ':' + op;
  }

  subscribe(table, op, source, onSubscribe) {
    this.stream.subscribe(this.toSubject(table, op), source, onSubscribe);
  }

  publish(table, op, result, id = null) {
    var obj;
    obj = id != null ? {
      id: result
    } : result;
    this.stream.publish(this.toSubject(table, op), obj);
  }

  results(table, op, result, id) {
    switch (op) {
      case 'change':
        return this.publish(table, 'change', result, id);
      case 'get':
        return this.publish(table, 'get', result, id);
      case 'select':
        return this.publish(table, 'select', result);
      case 'show':
        return this.publish(table, 'show', result);
      case 'batch':
        return this.publish(table, 'batch', result);
      case 'range':
        return this.publish(table, 'range', result); // Range op in Firebase
    }
  }

  add(table, id, object) { // Post an object into table with id
    this.publish(table, 'add', object, id);
  }

  put(table, id, object) { // Put an object into table with id
    this.publish(table, 'put', object, id);
  }

  del(table, id) { // Delete  an object from table with id
    this.publish(table, 'del', object, id);
  }

  // SQL tables with multiple objects (rows)
  insert(table, objects) { // Insert objects into table with unique id
    this.publish(table, 'insert', objects);
  }

  update(table, objects) { // # Update objects into table mapped by id
    this.publish(table, 'update', objects);
  }

  remove(table, where) { // Remove objects from table with where clause
    this.publish(table, 'remove', where);
  }

  // Table DDL (Data Definition Language)
  open(table, schema) { // Create a table with an optional schema
    this.publish(table, 'open', schema);
  }

  make(table, alters) { // Alter a table's schema - especially columns
    this.publish(table, 'make', alters);
  }

  drop(table, resets) { // Drop the entire @table - good for testing
    this.publish(table, 'drop', resets);
  }

};

export default Pipe;
