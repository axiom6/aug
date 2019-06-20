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

  //ublish:( table, id, op, obj, extras={} ) ->
  publish(table, obj) {
    this.stream.publish(this.toSubject(table), obj);
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
    this.publish(table, object);
  }

  put(table, id, object) { // Put an object into table with id
    this.publish(table, object);
  }

  del(table, id) { // Delete  an object from table with id
    this.publish(table, id);
  }

  // SQL tables with multiple objects (rows)
  insert(table, objects) { // Insert objects into table with unique id
    this.publish(table, objects);
  }

  update(table, objects) { // # Update objects into table mapped by id
    this.publish(table, objects);
  }

  remove(table, where) { // Remove objects from table with where clause
    this.publish(table, where);
  }

  // Table DDL (Data Definition Language)
  open(table, schema) { // Create a table with an optional schema
    this.publish(table, schema);
  }

  make(table, alters) { // Alter a table's schema - especially columns
    this.publish(table, alters);
  }

  drop(table, resets) { // Drop the entire @table - good for testing
    this.publish(table, resets);
  }

};

export default Pipe;
